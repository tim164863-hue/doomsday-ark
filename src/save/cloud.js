// Firebase（Google 登入 + Firestore 雲端存檔）。Firebase SDK 以動態 import 載入：訪客不付成本，
// 且這個檔案在 node 測試裡也能 import（不會碰 DOM / firebase）。
// 文件路徑：arks/{uid}  欄位：{ v:int, data:string(JSON 存檔), lastSeen:number, updatedAt:serverTimestamp }
// 使用 firestore/lite（REST，無長連線），寫入節流（預設最短 30 秒一次）以留在免費額度內。
import { clock } from '../clock.js';
import { SAVE_VERSION } from '../sim/defs.js';
import { sanitizeFleet } from '../sim/fleet.js';
import { sanitizeRel } from '../sim/rel.js';
import { isChar, sanitizePl } from '../crew/characters.js';

// 公開的 Web 用戶端設定（可公開，安全性靠 Firestore 規則與授權網域）。
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD__wWcqsLlaL1r1xThPLv-K8xjcv-_d0o',
  authDomain: 'doomsday-ark-f2248.firebaseapp.com',
  projectId: 'doomsday-ark-f2248',
  storageBucket: 'doomsday-ark-f2248.firebasestorage.app',
  messagingSenderId: '248448049412',
  appId: '1:248448049412:web:1412a5c420ec9d6b9f3051',
};
/** 船東帳號：只有它看得到真實 bot 與交易電視。僅為「顯示」判斷（sessions.json 本來就是公開檔），不是安全邊界。
 *  只認 Firebase uid（不再比對 email，程式碼 / 打包檔裡也不放 email）。要換船東：把新的 uid 填進這個常數
 *  （uid 可在 🔑 選單最下方複製）。清單是空的 = 沒有任何人是船東。 */
export const OWNER_UIDS = ['7yB5MDDkd3bymKEDHczUyb3buK63'];
export const MIN_WRITE_GAP = 30000;
export const MAX_DOC_CHARS = 100000;

export function isOwner(u) {
  if (!u) return false;
  return !!u.uid && OWNER_UIDS.includes(u.uid);
}

/** 存檔序列化：只留最近 60 筆紀錄，並確保不超過文件大小上限。 */
export function serialize(state) {
  let s = { ...state, log: (state.log || []).slice(-60) };
  let j = JSON.stringify(s);
  if (j.length > MAX_DOC_CHARS) { s = { ...s, log: s.log.slice(-10) }; j = JSON.stringify(s); }
  return j;
}
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
/** 驗證雲端 / 本機讀回的存檔形狀；不合法回傳 null。 */
export function validateState(s) {
  if (!s || typeof s !== 'object' || s.v !== SAVE_VERSION) return null;
  if (![s.seed, s.simT, s.lastSeen, s.created, s.cond].every(fin)) return null;
  if (!s.res || !['food', 'water', 'fuel', 'parts'].every((k) => fin(s.res[k]))) return null;
  if (!s.fac || typeof s.fac !== 'object' || !s.crew || typeof s.crew !== 'object') return null;
  if (!Array.isArray(s.trips) || !Array.isArray(s.log)) return null;
  for (const k of ['food', 'water', 'fuel', 'parts']) s.res[k] = Math.max(0, Math.min(1e6, s.res[k]));
  if (s.fleet != null) { const f = sanitizeFleet(s.fleet); if (f) s.fleet = f; else delete s.fleet; }   // 艦隊是可選欄位（舊存檔沒有）
  if (s.rel != null) { const r = sanitizeRel(s.rel); if (r) s.rel = r; else delete s.rel; }   // 船員關係：可選欄位
  if (s.pl != null) { if (s.pl && typeof s.pl === 'object' && isChar(s.pl.c)) s.pl = sanitizePl(s.pl); else delete s.pl; }   // 角色 / 船員種子：可選欄位
  return s;
}
function parseDoc(data) {
  try { return validateState(JSON.parse(data)); } catch (e) { return null; }
}

// ------------------------------------------------------------------ 後端（Firestore lite / 記憶體測試替身）
function firestoreBackend(fs, db) {
  const ref = (uid) => fs.doc(db, 'arks', uid);
  const read = async (uid) => {
    const snap = await fs.getDoc(ref(uid)); if (!snap.exists()) return { exists: false };
    const d = snap.data(); const ts = d.updatedAt; return { exists: true, v: d.v, data: d.data, updatedMs: ts && ts.toMillis ? ts.toMillis() : 0 };
  };
  return {
    get: read,
    set: (uid, p) => fs.setDoc(ref(uid), { v: p.v, data: p.data, lastSeen: p.lastSeen, updatedAt: fs.serverTimestamp() }),
    touch: (uid) => fs.setDoc(ref(uid), { updatedAt: fs.serverTimestamp() }, { merge: true }),
    del: (uid) => fs.deleteDoc(ref(uid)),
  };
}
/** 記憶體後端：測試 / 開發用（serverSkewMs = 模擬伺服器與裝置時鐘的差）。 */
export function createMemoryBackend(opts = {}) {
  const docs = opts.docs || new Map(); const skew = () => opts.skewMs || 0; const srv = () => Date.now() + skew();
  const chk = () => { if (opts.fail) throw new Error('network'); };
  const calls = { get: 0, set: 0, touch: 0, del: 0 };
  return {
    docs, calls, opts,
    async get(uid) { chk(); calls.get++; const d = docs.get(uid); return d ? { exists: true, v: d.v, data: d.data, updatedMs: d.updatedMs } : { exists: false }; },
    async set(uid, p) {
      chk(); calls.set++;
      if (typeof p.data !== 'string' || p.data.length > MAX_DOC_CHARS || !Number.isInteger(p.v) || !fin(p.lastSeen)) throw new Error('rules-denied');
      docs.set(uid, { v: p.v, data: p.data, lastSeen: p.lastSeen, updatedMs: srv() });
    },
    async touch(uid) { chk(); calls.touch++; const d = docs.get(uid); if (!d) throw new Error('rules-denied'); d.updatedMs = srv(); },
    async del(uid) { chk(); calls.del++; docs.delete(uid); },
  };
}

// ------------------------------------------------------------------ 存檔轉接器（介面同 LocalStorageAdapter，多了雲端細節）
export class CloudAdapter {
  constructor(backend, uid, opts = {}) {
    this.backend = backend; this.uid = uid; this.name = 'firestore'; this.mirrorKey = 'ark.cache.' + uid;
    this.status = 'idle'; this.lastOk = 0; this.err = null; this.canWrite = false; this.dirty = false;
    this.minGap = opts.minGap ?? MIN_WRITE_GAP; this._last = -1e12; this._timer = null; this._inflight = null; this._pending = null; this._ls = 0; this.listeners = [];
    this.store = opts.storage || (typeof localStorage !== 'undefined' ? localStorage : null);
  }
  onStatus(fn) { this.listeners.push(fn); }
  _set(st) { this.status = st; for (const f of this.listeners) { try { f(st, this); } catch (e) { /* ignore */ } } }
  loadMirror() { try { const r = this.store && this.store.getItem(this.mirrorKey); return r ? validateState(JSON.parse(r)) : null; } catch (e) { return null; } }
  /** 讀雲端文件。回傳 { exists, state, corrupt, error }。 */
  async loadDoc() {
    let r; try { r = await this.backend.get(this.uid); } catch (e) { this.err = e; this._set('offline'); return { error: e }; }
    if (!r.exists) return { exists: false, state: null };
    const st = parseDoc(r.data); return st ? { exists: true, state: st, updatedMs: r.updatedMs } : { exists: true, state: null, corrupt: true };
  }
  async load() { const d = await this.loadDoc(); return d.state || this.loadMirror(); }
  /** 以伺服器時間對時（touch + 讀回 updatedAt）。成功回傳 true。 */
  async syncClock() {
    try { await this.backend.touch(this.uid); const r = await this.backend.get(this.uid); if (!r.updatedMs) return false; clock.syncServer(r.updatedMs / 1000); return true; } catch (e) { return false; }
  }
  save(state, opts = {}) {
    const json = serialize(state);
    try { this.store && this.store.setItem(this.mirrorKey, json); } catch (e) { /* 空間不足 */ }
    this._pending = json; this._ls = Math.floor(state.lastSeen || 0); this.dirty = true;
    if (!this.canWrite) return Promise.resolve();
    const wait = this.minGap - (Date.now() - this._last);
    if (opts.force || wait <= 0) return this._flush();
    if (!this._timer) this._timer = setTimeout(() => { this._timer = null; this._flush(); }, wait);
    return Promise.resolve();
  }
  async _flush() {
    if (this._inflight) { this._again = true; return this._inflight; }
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    this._inflight = (async () => {
      do {
        this._again = false; const json = this._pending; this.dirty = false; this._last = Date.now(); this._set('saving');
        try {
          await this.backend.set(this.uid, { v: SAVE_VERSION, data: json, lastSeen: this._ls });
          const r = await this.backend.get(this.uid); if (r.updatedMs) clock.syncServer(r.updatedMs / 1000);
          this.lastOk = Date.now(); this.err = null; this._set('ok');
        } catch (e) { this.err = e; this.dirty = true; this._set('error'); }
      } while (this._again);
      this._inflight = null;
    })();
    return this._inflight;
  }
  async clear() { try { this.store && this.store.removeItem(this.mirrorKey); } catch (e) { /* ignore */ } try { await this.backend.del(this.uid); } catch (e) { /* ignore */ } }
}

// ------------------------------------------------------------------ Firebase 初始化 / 登入
const WEBVIEW_RE = /(FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|KAKAOTALK|Twitter|; wv\)|WebView|Snapchat)/i;
export const inAppBrowser = () => typeof navigator !== 'undefined' && WEBVIEW_RE.test(navigator.userAgent || '');
const simple = (u) => u ? { uid: u.uid, email: u.email || '', emailVerified: !!u.emailVerified, displayName: u.displayName || '', photoURL: u.photoURL || '' } : null;
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

let FB = null;
export const cloud = {
  user: null, backend: null, authError: null, available: false, fake: false,
  adapterFor(uid, opts) { return new CloudAdapter(this.backend, uid, opts); },
};

/** 啟動時呼叫：載入 Firebase、等待登入狀態（含 redirect 回來）。失敗 / 逾時 → 當訪客。 */
export async function initCloud({ timeoutMs = 7000 } = {}) {
  try {
    if (import.meta.env?.DEV) { const f = new URLSearchParams(location.search).get('fakecloud'); if (f) return initFake(f); }
    const [appM, authM, fs] = await withTimeout(Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore/lite')]), timeoutMs);
    const app = appM.initializeApp(FIREBASE_CONFIG); const auth = authM.getAuth(app); const db = fs.getFirestore(app);
    FB = { authM, auth, provider: new authM.GoogleAuthProvider() }; FB.provider.setCustomParameters({ prompt: 'select_account' });
    cloud.backend = firestoreBackend(fs, db); cloud.available = true;
    try { await withTimeout(authM.getRedirectResult(auth), timeoutMs); } catch (e) { if (e && e.code) cloud.authError = e; }
    await withTimeout(auth.authStateReady(), timeoutMs);
    cloud.user = simple(auth.currentUser);
    try { if (sessionStorage.getItem('ark.redirecting')) { sessionStorage.removeItem('ark.redirecting'); if (!cloud.user && !cloud.authError) cloud.authError = { code: 'ark/redirect-lost' }; } } catch (e) { /* ignore */ }
  } catch (e) { cloud.available = false; cloud.user = null; cloud.authError = cloud.authError || { code: 'ark/init-failed', message: String(e && e.message) }; }
  return cloud;
}
function initFake(kind) {
  const P = new URLSearchParams(location.search); const docs = new Map();
  try { const raw = localStorage.getItem('ark.fakecloud'); if (raw) for (const [k, v] of JSON.parse(raw)) docs.set(k, v); } catch (e) { /* ignore */ }
  const be = createMemoryBackend({ docs, skewMs: +(P.get('fakeskew') || 0), fail: kind === 'offline' });
  const set = be.set.bind(be); be.set = async (u, p) => { await set(u, p); localStorage.setItem('ark.fakecloud', JSON.stringify([...docs])); };
  cloud.backend = be; cloud.available = true; cloud.fake = true;
  if (kind !== 'guest') cloud.user = kind === 'owner' ? { uid: OWNER_UIDS[0] || 'fake-owner', email: 'owner@example.com', emailVerified: true, displayName: 'Tim Tseng', photoURL: '' } : { uid: 'fake-' + kind, email: kind + '@example.com', emailVerified: true, displayName: kind === 'offline' ? 'Offline User' : 'Guest Player', photoURL: '' };
  return cloud;
}

/** 按下登入：先 popup；popup 被擋 / 環境不支援才改 redirect。回傳 { ok } | { cancelled } | { error }。 */
export async function signIn() {
  if (!FB) return { error: { code: 'ark/unavailable' } };
  const { authM, auth, provider } = FB;
  try { await authM.signInWithPopup(auth, provider); return { ok: true }; }
  catch (e) {
    const c = e && e.code;
    if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request' || c === 'auth/user-cancelled') return { cancelled: true };
    if (c === 'auth/popup-blocked' || c === 'auth/operation-not-supported-in-this-environment' || c === 'auth/web-storage-unsupported') {
      try { sessionStorage.setItem('ark.redirecting', '1'); } catch (e2) { /* ignore */ }
      try { await authM.signInWithRedirect(auth, provider); return { redirecting: true }; } catch (e2) { return { error: e2 }; }
    }
    return { error: e };
  }
}
export async function signOutNow() { if (FB) await FB.authM.signOut(FB.auth); else localStorage.removeItem('ark.fakecloud.user'); }
