// 末日方舟 · 階段⑤：PvP 的雲端層（Firestore lite / 記憶體替身）+ 規則的 JS 鏡像 + 客戶端排程。
//
// 免費 Spark 方案的跨使用者寫入怎麼運作（唯一一種）：
//   · presence/{uid}            ：只有本人能寫（公開快照；任何登入者可讀）。別人永遠寫不了你的 presence，也寫不了 arks/{uid}。
//   · raids/{defender}/in/{attacker}_{bucket}：攻擊方在「被攻擊者的收件匣」裡 create 一份文件（只能 create，不能 update / delete）。
//       被攻擊者（本人）上線時讀自己的收件匣，把它抄進自己的存檔，之後由決定性的 pvTick 結算。被攻擊者不需要寫任何別人的文件。
//   · 規則能做的事：型別 / 範圍 / 大小 / 每個「攻擊者×目標×12 小時」一份 / 與目標 presence 快照比較（get()）的掠奪上限 / 時間戳靠近伺服器時間。
//   · 規則做不到的事（⇒ 防不了作弊）：驗證打贏了守衛艦、驗證攻擊者真的在附近（只能比對自己宣稱的座標）、驗證 presence 快照是真的、
//     讓被攻擊者的實際損失回饋給攻擊者。
import { PV, sanPub, sanRaidDoc, blockOf, nearBlocks, bucketOf, pubOf, pubChanged, canRaid, pvIngest, ingestSince, pvOf, attExpire, outPrune, outDone, handleOf, raidDocId, ensurePv } from '../sim/pvp.js';
import { arkPos } from '../sim/world.js';

const PUB_KEYS = ['v', 'h', 'x', 'y', 'fp', 'res', 'cap', 'sh', 'ls', 't', 'ut', 'cells', 'rt'];   // ut = 伺服器寫入時間（客戶端寫 serverTimestamp()，規則要求 == request.time）；hl / cd 在第 14 輪移除
const RAID_KEYS = ['v', 'attacker', 'defender', 'b', 't', 'ah', 'loot', 'ap'];
const only = (o, ks) => Object.keys(o).every((k) => ks.includes(k));
const intNN = (x) => Number.isInteger(x) && x >= 0;
/** 與 firestore.pvp.rules（DESIGN-fleet.md §4.1）一一對應的 JS 鏡像：記憶體後端用它模擬「規則擋下來」，tools/pvp-test.mjs 靠它。
 *  真正的規則由 tools/rules-emulator（Firebase 模擬器）測 150 個案例；兩邊的界線必須一致。 */
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const rng = (v, lo, hi) => isNum(v) && v >= lo && v <= hi;
const nint = (v, hi) => Number.isInteger(v) && v >= 0 && v <= hi;
const isMap = (o) => !!o && typeof o === 'object' && !Array.isArray(o);
const sameKeys = (o, ks) => isMap(o) && Object.keys(o).length === ks.length && ks.every((k) => k in o);
const cellOk = (c) => typeof c === 'string' && c.length <= 5 && /^[0-9]{1,2}_[0-9]{1,2}$/.test(c);
export const RULE = { shieldMax: 43200, clock: 120, nearPad: 60, listPresence: 24, listInbox: 60, minWrite: 10, attFresh: 900, lootMax: 400, lsAhead: 600, stale: 7 * 86400 };
/** presence 形狀（create / update 共用）。回傳空字串 = 通過，否則是第一個不合格的理由。 */
export function presenceShape(d, nowSec) {   // d.ut 是「已解析的伺服器時間」（Firestore 會把 serverTimestamp() 換成 request.time）
  if (!isMap(d)) return 'bad-keys'; const ks = Object.keys(d);
  if (!PUB_KEYS.every((k) => k === 'rt' || k in d) || !ks.every((k) => PUB_KEYS.includes(k))) return 'bad-keys';
  if (d.v !== 1) return 'bad-version'; if (typeof d.h !== 'string' || d.h.length < 1 || d.h.length > 12) return 'bad-handle';
  if (!(rng(d.x, 0, 2000) && rng(d.y, 0, 2000) && rng(d.fp, 0, 200) && rng(d.cap, 0, 1000))) return 'bad-range';
  if (!(isMap(d.res) && Object.keys(d.res).length === 4 && PV.lootKeys.every((k) => rng(d.res[k], 0, 2000)))) return 'bad-res';
  if (!rng(d.t, nowSec - RULE.clock, nowSec + RULE.clock)) return 'bad-time'; if (d.ut !== nowSec) return 'bad-ut'; if (!rng(d.ls, d.t - 86400, d.t + RULE.lsAhead)) return 'bad-ls';
  if (!rng(d.sh, 0, nowSec + RULE.shieldMax + RULE.clock)) return 'bad-shield';
  if (!Array.isArray(d.cells) || d.cells.length < 1 || d.cells.length > 16 || !d.cells.every(cellOk)) return 'bad-cells';
  if ('rt' in d) { const r = d.rt; if (!(sameKeys(r, ['x0', 'y0', 'x1', 'y1', 't0', 't1']) && rng(r.x0, 0, 2000) && rng(r.y0, 0, 2000) && rng(r.x1, 0, 2000) && rng(r.y1, 0, 2000) && rng(r.t0, 0, nowSec + 2592000) && rng(r.t1, r.t0, nowSec + 2592000))) return 'bad-route'; }
  return '';
}
/** prev = 目前雲端上的文件（沒有 = create；有 = update，多一條「距離上次寫入 ≥ 10 秒」） */
export function ruleCheckPresence({ auth, uid, doc, nowSec, isOwnerUid, prev }) {
  if (!auth || auth !== uid) return 'not-owner-of-doc'; if (isOwnerUid) return 'owner-no-presence';
  const e = presenceShape(doc, nowSec); if (e) return e;
  if (prev && !(nowSec - prev.ut >= RULE.minWrite)) return 'too-frequent'; return '';   // 比的是上一次的 ut（伺服器時間），不是客戶端自己填的 t
}
/** att = 攻擊者自己的 presence；pres = 防守者的 presence。攻擊者的 presence 必須存在、最近發佈過、與宣稱座標一致。 */
export function ruleCheckRaid({ auth, def, id, doc, pres, att, nowSec, isOwnerUid }) {
  if (!auth) return 'no-auth'; if (isOwnerUid) return 'owner-no-pvp';
  if (!isMap(doc) || !sameKeys(doc, RAID_KEYS)) return 'bad-keys'; if (doc.v !== 1) return 'bad-version';
  if (doc.attacker !== auth) return 'attacker-mismatch'; if (doc.defender !== def || def === auth) return 'defender-mismatch';
  if (typeof doc.ah !== 'string' || doc.ah.length > 12) return 'bad-ah';
  if (!isNum(doc.t) || !Number.isInteger(doc.b) || doc.b !== bucketOf(doc.t)) return 'bad-bucket'; if (id !== `${auth}_${doc.b}`) return 'bad-id';
  if (!rng(doc.t, nowSec - RULE.clock, nowSec + RULE.clock)) return 'bad-time';
  if (!(sameKeys(doc.ap, ['x', 'y']) && rng(doc.ap.x, 0, 2000) && rng(doc.ap.y, 0, 2000))) return 'bad-ap';
  if (!pres) return 'no-presence'; if (!(pres.ls <= doc.t - PV.offlineAfter)) return 'target-online'; if (!(pres.ls >= doc.t - RULE.stale)) return 'target-stale'; if (!(pres.sh <= doc.t)) return 'target-shielded';
  const l = doc.loot; if (!isMap(l) || !Object.keys(l).every((k) => PV.lootKeys.includes(k))) return 'bad-loot';
  for (const k of PV.lootKeys) { const v = k in l ? l[k] : 0; if (!nint(v, RULE.lootMax)) return 'bad-loot'; if (v > pres.res[k] * PV.take || v > pres.cap) return 'loot-too-big'; }
  const pad = PV.range + RULE.nearPad, near = (x, y, p) => Math.abs(x - p.x) <= pad && Math.abs(y - p.y) <= pad;
  if (!near(doc.ap.x, doc.ap.y, pres)) return 'too-far';
  if (!att) return 'attacker-no-presence'; if (!(att.t >= doc.t - RULE.attFresh && att.ls >= doc.t - RULE.attFresh)) return 'attacker-stale';
  if (!near(doc.ap.x, doc.ap.y, att)) return 'ap-far-from-attacker'; if (!near(att.x, att.y, pres)) return 'attacker-far-from-target';
  return '';
}

/** 記憶體替身：store 可以讓多個「使用者」共用；as = 目前登入的 uid；now = () => 伺服器秒數；owners = 船東 uid 清單。 */
export function createMemoryPvp(store, as, now, owners = []) {
  const S = store || { presence: new Map(), raids: new Map() }; const calls = { put: 0, near: 0, raid: 0, pull: 0 }; const cfg = { fail: false };
  const chk = () => { if (cfg.fail) throw new Error('network'); };
  return {
    store: S, calls, cfg, as,
    async putPresence(uid, doc) { chk(); if (cfg.putGate) await cfg.putGate; /* 測試用：把「寫入還在路上」卡住 */ calls.put++; const full = { ...doc, ut: now() }; /* = serverTimestamp() */ const e = ruleCheckPresence({ auth: as, uid, doc: full, nowSec: now(), isOwnerUid: owners.includes(as), prev: S.presence.get(uid) || null }); if (e) throw new Error('rules-denied:' + e); S.presence.set(uid, JSON.parse(JSON.stringify(full))); },
    async delPresence(uid) { chk(); calls.del = (calls.del || 0) + 1; if (uid !== as) throw new Error('rules-denied:not-owner-of-doc'); S.presence.delete(uid); },
    async near(blocks, limit = PV.scanMax) { chk(); calls.near++; if (!(limit <= RULE.listPresence)) throw new Error('rules-denied:list-limit'); const out = []; for (const [uid, d] of S.presence) { if (d.cells.some((c) => blocks.includes(c))) out.push({ uid, ...JSON.parse(JSON.stringify(d)) }); if (out.length >= limit) break; } return out; },
    async putRaid(def, id, doc) {
      chk(); calls.raid++; const key = `${def}/${id}`; if (S.raids.has(key)) throw new Error('rules-denied:exists');
      const e = ruleCheckRaid({ auth: as, def, id, doc, pres: S.presence.get(def) || null, att: S.presence.get(as) || null, nowSec: now(), isOwnerUid: owners.includes(as) }); if (e) throw new Error('rules-denied:' + e); S.raids.set(key, JSON.parse(JSON.stringify(doc)));
    },
    async raidsFor(uid, since, limit = 60) { chk(); calls.pull++; if (uid !== as) throw new Error('rules-denied:read'); if (!(limit <= RULE.listInbox)) throw new Error('rules-denied:list-limit'); const out = []; for (const [k, d] of S.raids) if (k.startsWith(uid + '/') && d.t >= since) out.push(JSON.parse(JSON.stringify(d))); return out.slice(0, limit); },
    async updateRaid() { throw new Error('rules-denied:update'); }, async deleteRaid() { throw new Error('rules-denied:delete'); },
  };
}
/** Firestore lite 版。規則見 DESIGN-fleet.md（本檔不部署規則）。 */
export function firestorePvp(fs, db) {
  return {
    async putPresence(uid, doc) { await fs.setDoc(fs.doc(db, 'presence', uid), { ...doc, ut: fs.serverTimestamp() }); },   // ut 一定是伺服器時間（規則：ut == request.time）
    async delPresence(uid) { await fs.deleteDoc(fs.doc(db, 'presence', uid)); },
    async near(blocks, limit = PV.scanMax) { const q = fs.query(fs.collection(db, 'presence'), fs.where('cells', 'array-contains-any', blocks.slice(0, 9)), fs.limit(Math.min(limit, RULE.listPresence))); const snap = await fs.getDocs(q); return snap.docs.map((d) => ({ uid: d.id, ...d.data() })); },
    async putRaid(def, id, doc) { await fs.setDoc(fs.doc(db, 'raids', def, 'in', id), doc); },
    async raidsFor(uid, since, limit = 60) { const q = fs.query(fs.collection(db, 'raids', uid, 'in'), fs.where('t', '>=', since), fs.limit(Math.min(limit, RULE.listInbox))); const snap = await fs.getDocs(q); return snap.docs.map((d) => d.data()); },
  };
}

/** 客戶端排程：節流、失敗不丟例外（PvP 壞掉不能影響遊戲本身） */
export class PvpClient {
  constructor(backend, { uid, owner, now }) { this.be = backend; this.uid = uid || null; this.owner = !!owner; this.now = now || (() => Date.now() / 1000); this.last = null; this.pubAt = 0; this.scanAt = 0; this.pullAt = 0; this.list = []; this.err = ''; this.scanning = false; this.scanned = false; this.counts = { pub: 0, scan: 0, pull: 0, raid: 0 }; this.wipePending = false; this.sealed = false; this.flight = null; this.sessChecked = false; }
  get enabled() { return !!(this.be && this.uid && !this.owner); }
  get why() { return !this.uid ? 'guest' : this.owner ? 'owner' : !this.be ? 'offline' : ''; }
  async publish(s, own, force) {
    if (!this.enabled) return false; const pv0 = pvOf(s); if (!pv0 || !pv0.nt || pv0.hid) return false;   // 還沒看過隱私說明（nt）或正在隱身（hid）→ 什麼都不公開
    const now = this.now(); const pub = pubOf(s, this.uid, now, own, this.owner); if (!pub) return false;
    const gap = now - this.pubAt; if (!force && !(gap >= PV.pubGap || (pubChanged(this.last, pub) && gap >= 30))) return false;
    if (this.sealed) return false;
    let ok = false; const fl = this.be.putPresence(this.uid, pub); this.flight = fl;   // 記下「還在路上的寫入」，wipe() 會等它先落地再刪
    try { await fl; this.last = pub; this.pubAt = now; this.counts.pub++; this.err = ''; ok = true; } catch (e) { this.err = String(e && e.message || e); } finally { if (this.flight === fl) this.flight = null; }
    // 寫入在路上時玩家剛好隱身 / 登出 → 剛落地的 presence 要馬上刪掉（不能讓它活下來）
    const pvN = pvOf(s); if (ok && (this.sealed || (pvN && pvN.hid))) { await this.wipe(); return false; }
    return ok;
  }
  /** 隱身開關：開 = 立刻刪掉自己的 presence 並停止公開；關 = 重新公開。有突襲正在進行 / 結果還沒送出時不能開（否則規則會因為沒有 presence 擋掉那份文件）。 */
  async setHidden(s, on) {
    const pv = ensurePv(s); if (!pv) return { ok: false, msg: '還沒有世界地圖' }; if (!this.enabled) return { ok: false, msg: '登入後才有玩家對戰' };
    if (on && (pv.att || pv.out.length)) return { ok: false, msg: '還有突襲正在進行或結果還沒送出，稍後再開隱身' };
    pv.hid = on ? 1 : 0; pv.nt = 1;
    if (on) { const ok = await this.wipe(); return { ok: true, msg: ok ? '🕶 已隱身：你的公開資料已刪除，別人看不到你（你也暫時不能出手）' : '🕶 已隱身（雲端暫時連不上，之後會再刪除你的公開資料）', pending: !ok }; }
    this.last = null; this.pubAt = 0; this.wipePending = false; return { ok: true, msg: '已取消隱身，會重新出現在附近玩家的海圖上' };
  }
  /** 刪掉自己的 presence（隱身 / 登出 / 刪除帳號時）。失敗回傳 false（不丟例外）。 */
  async wipe(opt) {
    if (!this.enabled) return false; if (opt && opt.final) this.sealed = true;   // final（登出 / 刪帳號）：之後這個 client 不再公開任何東西
    this.last = null; this.pubAt = 0;
    if (this.flight) { try { await this.flight; } catch (e) { /* 寫入失敗就沒有東西要刪 */ } }   // 先等還在路上的 putPresence 落地，刪除才是最後一步
    try { await this.be.delPresence(this.uid); this.err = ''; this.wipePending = false; return true; } catch (e) { this.err = String(e && e.message || e); this.wipePending = true; return false; }
  }
  /** 每個 beat 呼叫：隱身中且上次刪除失敗 → 重試，成功才清掉旗標。回傳是否有重試。 */
  async retryWipe(s) {
    const pv = pvOf(s); if (this.enabled && !this.sessChecked) { this.sessChecked = true; if (pv && pv.hid) this.wipePending = true; }   // 每個 session 第一次 beat：存檔說正在隱身 → 再刪一次（重新載入會丟掉旗標；刪除是冪等的）
    if (!this.enabled || !this.wipePending || !((pv && pv.hid) || this.sealed)) return false; await this.wipe(); return true;
  }
  /** 掃描附近（≤24 次讀取）。回傳整理過的清單（含是否能出手與原因），不能出手的也列出來讓玩家看懂原因。 */
  async scan(s, force) {
    if (!this.enabled) return this.list; const now = this.now(); if (!force && now - this.scanAt < PV.scanGap) return this.list; this.scanAt = now; this.scanning = true;
    try {
      const w = s.fleet && s.fleet.world; if (!w || !w.pos) { this.list = []; return this.list; } const me = arkPos(w, now); const raw = await this.be.near(nearBlocks(me.x, me.y), PV.scanMax); this.counts.scan++;
      const out = []; for (const d of raw) { const pub = sanPub(d); if (!pub || d.uid === this.uid || now - pub.ls > PV.staleAfter) continue; /* 超過 7 天沒上線的幽靈船不列出 */ const c = canRaid(s, pub, d.uid, this.uid, now, false); if (c.why === 'fog' || c.why === 'bad' || (c.dist != null && c.dist > PV.range * 2.5)) continue; out.push({ uid: d.uid, pub, c }); }
      out.sort((a, b) => (a.c.dist || 0) - (b.c.dist || 0)); this.list = out.slice(0, 12); this.err = ''; this.scanned = true;
    } catch (e) { this.err = String(e && e.message || e); } finally { this.scanning = false; }
    return this.list;
  }
  /** 把收件匣抄進存檔。必須在 simulateTo 之前呼叫（登入時 / 輪詢時）。 */
  async pull(s, force) {
    if (!this.enabled) return 0; const now = this.now(); if (!force && now - this.pullAt < 120) return 0; this.pullAt = now;
    try { const docs = await this.be.raidsFor(this.uid, Math.max(ingestSince(s), Math.floor(now - PV.window))); this.counts.pull++; this.err = ''; return pvIngest(s, docs, this.uid, this.owner, now); } catch (e) { this.err = String(e && e.message || e); return 0; }
  }
  /** 送出 outbox 裡的 raid 文件（失敗保留，下次再送；被規則擋掉的 = 永久失敗，丟掉） */
  async flush(s, own) {
    const pv = pvOf(s); if (!this.enabled || !pv || !pv.out.length) return 0; const now = this.now();
    // 規則要比對攻擊者自己的 presence（要存在、夠新、座標接近）⇒ 送 raid 前先強制發佈一次（太頻繁被擋就沿用舊的，規則允許 15 分鐘內）
    if (own) await this.publish(s, own, true);
    outPrune(s, now); attExpire(s, now); let n = 0;
    for (const d of [...pv.out]) { try { await this.be.putRaid(d.defender, raidDocId(d), d); outDone(s, d); n++; this.counts.raid++; } catch (e) { const m = String(e && e.message || e); this.err = m; if (/rules-denied|permission|exists|ALREADY/i.test(m)) outDone(s, d); else break; } }
    return n;
  }
}
export { handleOf, blockOf };
