// 開機時決定「用哪一份存檔」：訪客 / 登入雲端 / 雲端連不上 / 示範模式。純邏輯（UI 選擇由 choose() 注入），可在 node 測試。
import { LocalStorageAdapter, MemoryAdapter } from './adapter.js';
import { isOwner } from './cloud.js';
import { clock } from '../clock.js';

export function summarize(s) {
  if (!s) return null; let lv = 0; for (const k of Object.keys(s.fac || {})) lv += s.fac[k].lv || 0;
  return { lastSeen: s.lastSeen, created: s.created, facLv: lv, trips: (s.stats && s.stats.trips) || 0, res: s.res };
}
/** 船東專屬存檔（有旗艦遊輪 / 船東選船標記）。非船東不得載入，避免訪客看到 T董 的方舟。 */
export const isOwnerSave = (s) => !!(s && s.fleet && (s.fleet.pick === 'owner' || s.fleet.flagship === 'cruise'));
export const MODE_KEY = 'ark.mode', QUARANTINE_KEY = 'ark.ownerLocal.v1';
/**
 * 進站流程：已登入 → 'cloud'（船東 / 一般帳號由 bootSave 判斷）；沒登入：上次選訪客 → 'guest'；否則 → 'ask'（顯示 [Google 登入] / [訪客遊玩]）。
 * 網址參數 demo / fresh / guest 直接當訪客（截圖、測試用）。
 */
export function entryDecision({ user, mode, params }) {
  if (user) return 'cloud';
  if (params && (params.get('demo') || params.get('fresh') || params.get('guest'))) return 'guest';
  return mode === 'guest' ? 'guest' : 'ask';
}
const mem = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

/**
 * @returns {{mode:'guest'|'cloud'|'mirror'|'memory'|'demo', adapter, state:object|null, user, owner:boolean, needPush:boolean, notes:string[]}}
 */
export async function bootSave({ cloud, choose, fresh = false, demo = false, storage } = {}) {
  const store = storage || (typeof localStorage !== 'undefined' ? localStorage : mem());
  const local = new LocalStorageAdapter(undefined, store); const notes = [];
  const user = cloud && cloud.user ? cloud.user : null; const owner = isOwner(user);
  if (demo) { clock.useWall(); return { mode: 'demo', adapter: new MemoryAdapter(), state: null, user, owner: false, needPush: false, notes }; }
  // 本機存檔若是船東（T董 旗艦）的，一律不給非船東用：移到隔離 key 備份（不刪），訪客從選船開始。
  const quarantine = async () => { const l = await local.load(); if (l && isOwnerSave(l)) { try { store.setItem(QUARANTINE_KEY, JSON.stringify(l)); } catch (e) { /* ignore */ } await local.clear(); notes.push('owner-local-ignored'); return null; } return l; };
  if (!user) {
    if (fresh) await local.clear(); clock.useWall();
    return { mode: 'guest', adapter: local, state: await quarantine(), user: null, owner: false, needPush: false, notes };
  }
  const ad = cloud.adapterFor(user.uid, { storage: store });
  const doc = await ad.loadDoc(); const mirror = ad.loadMirror(); const guest = owner ? null : await quarantine();   // 船東永遠載入自己的雲端方舟，不合併訪客進度
  if (doc.error) {
    notes.push('cloud-offline');
    if (mirror) { clock.syncUnverified(mirror.lastSeen); return { mode: 'mirror', adapter: ad, state: mirror, user, owner, needPush: false, notes }; }
    clock.useWall(); notes.push('no-save'); return { mode: 'memory', adapter: new MemoryAdapter(), state: null, user, owner, needPush: false, notes };
  }
  if (doc.corrupt) notes.push('cloud-corrupt');
  let state = doc.state, origin = state ? 'cloud' : null, needPush = false;
  if (mirror && (!state || mirror.lastSeen > state.lastSeen + 5)) { state = mirror; origin = 'mirror'; needPush = true; }
  if (!owner && state && isOwnerSave(state)) { state = null; origin = null; notes.push('owner-save-ignored'); }   // 非船東帳號不載入船東存檔
  ad.canWrite = true;
  let synced = false; if (doc.exists && !doc.corrupt) synced = await ad.syncClock();
  if (!synced) { if (doc.exists) clock.syncUnverified(state ? state.lastSeen : Date.now() / 1000); else clock.useWall(); }
  const markKey = 'ark.guestSync.' + user.uid; const mark = store.getItem(markKey);
  if (guest && String(Math.floor(guest.lastSeen)) !== mark) {
    const newer = !state || guest.lastSeen > state.lastSeen ? 'local' : 'cloud';
    const pick = choose ? await choose({ cloud: state ? summarize(state) : null, local: summarize(guest), newer, owner }) : newer;
    try { store.setItem(markKey, String(Math.floor(guest.lastSeen))); } catch (e) { /* ignore */ }
    if (pick === 'local') { state = guest; origin = 'guest'; needPush = true; }
  }
  if (state && (origin === 'guest' || origin === 'mirror')) { // 來自裝置時鐘的存檔：不得超前伺服器時間
    const t = clock.now(); if (state.lastSeen > t) state.lastSeen = t; if (state.simT > t) state.simT = Math.floor(t / 60) * 60;
  }
  return { mode: 'cloud', adapter: ad, state, user, owner, needPush: needPush || !doc.exists, notes, origin };
}
