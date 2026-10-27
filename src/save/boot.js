// 開機時決定「用哪一份存檔」：訪客 / 登入雲端 / 雲端連不上 / 示範模式。純邏輯（UI 選擇由 choose() 注入），可在 node 測試。
import { LocalStorageAdapter, MemoryAdapter } from './adapter.js';
import { isOwner } from './cloud.js';
import { clock } from '../clock.js';

export function summarize(s) {
  if (!s) return null; let lv = 0; for (const k of Object.keys(s.fac || {})) lv += s.fac[k].lv || 0;
  return { lastSeen: s.lastSeen, created: s.created, facLv: lv, trips: (s.stats && s.stats.trips) || 0, res: s.res };
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
  if (!user) {
    if (fresh) await local.clear(); clock.useWall();
    return { mode: 'guest', adapter: local, state: await local.load(), user: null, owner: false, needPush: false, notes };
  }
  const ad = cloud.adapterFor(user.uid, { storage: store });
  const doc = await ad.loadDoc(); const mirror = ad.loadMirror(); const guest = await local.load();
  if (doc.error) {
    notes.push('cloud-offline');
    if (mirror) { clock.syncUnverified(mirror.lastSeen); return { mode: 'mirror', adapter: ad, state: mirror, user, owner, needPush: false, notes }; }
    clock.useWall(); notes.push('no-save'); return { mode: 'memory', adapter: new MemoryAdapter(), state: null, user, owner, needPush: false, notes };
  }
  if (doc.corrupt) notes.push('cloud-corrupt');
  let state = doc.state, origin = state ? 'cloud' : null, needPush = false;
  if (mirror && (!state || mirror.lastSeen > state.lastSeen + 5)) { state = mirror; origin = 'mirror'; needPush = true; }
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
