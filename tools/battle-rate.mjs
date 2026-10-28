// 遭遇頻率 / 離線船體損失 量測（不是測試）：node tools/battle-rate.mjs [天數]
import { newState, simulateTo, syncCrew } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import * as B from '../src/sim/battle.js';
import { SPECIAL_ZONES } from '../src/sim/szdata.js';
const T0 = 1_800_000_000, H = 3600, D = 86400, DAYS = +process.argv[2] || 30, crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const mk = (pos, seed) => { const s = newState(seed, T0, 480); syncCrew(s, crew); F.ensureFleet(s, true); F.ensureWorld(s, 'u-bt'); s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; s.fleet.world.pos = { ...pos }; return s; };
const spots = { '遠海(1000,1000)': [1000, 1000], '北方(1000,300)': [1000, 300], '西(500,600)': [500, 600], '東南(1400,1400)': [1400, 1400], ...Object.fromEntries(Object.keys(SPECIAL_ZONES).map((z) => [SPECIAL_ZONES[z].name + '中心', [SPECIAL_ZONES[z].x, SPECIAL_ZONES[z].y]])) };
export function measure(pos, seeds = [1, 2, 3, 4, 5], branch = null) {
  let enc = 0, hullB = 0, hullT = 0, days = 0, kinds = {};
  for (const seed of seeds) { const s = mk({ x: pos[0], y: pos[1] }, 4000 + seed); if (branch) s.fleet.flag = branch;
    for (let d = 0; d < DAYS; d++) { s.cond = 100; s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; const n0 = (s.fleet.world.bt || { n: 0 }).n, h0 = (s.fleet.world.bt || { h: 0 }).h; for (let u = s.simT + 6 * H; u <= T0 + (d + 1) * D; u += 6 * H) simulateTo(s, u); simulateTo(s, T0 + (d + 1) * D);
      const bt = s.fleet.world.bt || { n: 0, h: 0 }; enc += bt.n - n0; hullB += bt.h - h0; hullT += 100 - s.cond; days++; } for (const k of ['w', 'l', 'd', 'f']) kinds[k] = (kinds[k] | 0) + ((s.fleet.world.bt || { st: {} }).st[k] | 0); }
  return { enc: enc / days, hullB: hullB / days, hullT: hullT / days, kinds };
}
if (process.argv[1].endsWith('battle-rate.mjs')) for (const [nm, p] of Object.entries(spots)) { const r = measure(p); console.log(nm.padEnd(16), `遭遇 ${r.enc.toFixed(2)}/天　戰鬥損失 ${r.hullB.toFixed(1)}%/天　總損失(含磨損) ${r.hullT.toFixed(1)}%/天`, JSON.stringify(r.kinds)); }
