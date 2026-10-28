// DEV 專用（vite dev 才會載入；正式版的動態 import 會被整段移除，不會進 bundle）：假玩家 / 假突襲，供截圖與手動測試。
import * as PVP from '../sim/pvp.js';
import * as W from '../sim/world.js';
import { cloud } from '../save/cloud.js';
import { clock } from '../clock.js';
const nowSec = () => clock.now();
export function pvDevInit(play) {
  const pv = cloud.pvp; if (!pv || !pv.store) return; const me = () => play.state, now = () => nowSec();
  const fake = (uid, dx, dy, o = {}) => { const w = me().fleet.world, p = { x: w.pos.x + dx, y: w.pos.y + dy }; const fp = o.fp || 8; const pub = { v: 1, h: PVP.handleOf(uid), x: Math.round(p.x), y: Math.round(p.y), fp, hl: 400, cd: 100, res: { food: 300, water: 280, fuel: 220, parts: 150, ...(o.res || {}) }, cap: PVP.lootCap(fp), sh: o.sh || 0, ls: Math.floor(o.ls == null ? now() - 7200 : o.ls), t: Math.floor(now()), cells: [PVP.blockOf(p.x, p.y)] }; pv.store.presence.set(uid, pub); if (pv.persist) pv.persist(); return pub; };
  window.arkPv = {
    fake, seed: () => { const w = me().fleet.world; W.reveal(w, w.pos.x, w.pos.y, 200); fake('npc-aaa', -30, 22); fake('npc-bbb', 48, -26, { fp: 20 }); fake('npc-ccc', -55, -30, { ls: now() - 90 }); fake('npc-ddd', 60, 50, { sh: now() + 3 * 3600 }); fake('npc-eee', 130, 0); return play.pvpScan(true).then(() => play.hud.chart.open_ && play.hud.chart.refresh(true)); },
    raidMe: (from = 'npc-aaa', loot = { food: 24, water: 22, fuel: 17, parts: 12 }, ago = 3600) => { const uid = play.pvc.uid, t = Math.floor(now() - ago), b = PVP.bucketOf(t); pv.store.raids.set(`${uid}/${from}_${b}`, { v: 1, attacker: from, defender: uid, b, t, ah: PVP.handleOf(from), loot, ap: { x: 0, y: 0 } }); if (pv.persist) pv.persist(); },
    pull: () => play.pvc.pull(play.state, true), client: () => play.pvc, state: () => play.state, store: pv.store,
  };
  if (new URLSearchParams(location.search).get('pvseed') === '1') setTimeout(() => window.arkPv.seed(), 500);
}
