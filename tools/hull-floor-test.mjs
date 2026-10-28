// 船體保底（自然磨損 / 風暴 / 雷擊都停在 SZ.floor = 20%）測試：node tools/hull-floor-test.mjs
import { newState, simulateTo, syncCrew } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import { weatherAt } from '../src/sim/weather.js';
import { SZ, hullDmg } from '../src/sim/szdata.js';
import { TICK } from '../src/sim/defs.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000, H = 3600; const crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const mk = (pos, cond, o = {}) => { const s = newState(o.seed || 777, T0, 480); syncCrew(s, crew); F.ensureFleet(s, true); F.ensureWorld(s, 'u-test'); s.res = { food: 4000, water: 4000, fuel: 4000, parts: 400, ...(o.res || {}) }; s.created = T0 - 10 * 3600; s.fleet.world.pos = { ...pos }; s.cond = cond; s.fac.workshop.lv = 0; return s; };
const feed = (s) => { for (const k of ['food', 'water', 'fuel']) s.res[k] = Math.max(s.res[k], 3000); };
const strip = (s) => { const c = JSON.parse(JSON.stringify(s)); delete c.lastSeen; return JSON.stringify(c); };
const SEA = { x: 1000, y: 1000 };
const stormAt = () => { for (let b = 0; b < 400; b++) { const t = T0 + b * 3 * H; if (weatherAt(t, SEA.x, SEA.y).kind === 'storm') return t - (t - T0) % (3 * H); } return null; };
// 逐 tick 推進並記錄最低船體 / 事件
const walk = (s, to, step = TICK) => { let min = s.cond; const ev = []; while (s.simT + step <= to) { feed(s); const r = simulateTo(s, s.simT + step); ev.push(...r.events); min = Math.min(min, s.cond); } return { min, ev }; };
const runTo = (s, t) => { while (s.simT < t) { feed(s); simulateTo(s, Math.min(t, s.simT + 40 * H)); } return s; };

// ---- 純函式
{ const s = { cond: 50 }; ok(hullDmg(s, 10) === 10 && s.cond === 40, 'hullDmg：一般扣血');
  s.cond = 25; ok(hullDmg(s, 10) === 5 && s.cond === SZ.floor, 'hullDmg：只扣到 20%（實際扣 5）');
  s.cond = 20; ok(hullDmg(s, 3) === 0 && s.cond === 20, 'hullDmg：正好 20% 不再扣');
  s.cond = 12; ok(hullDmg(s, 3) === 0 && s.cond === 12, 'hullDmg：已低於 20%（12）→ 不扣、也不被抬高到 20');
  s.cond = 12; hullDmg(s, 0); hullDmg(s, -4); hullDmg(s, NaN); ok(s.cond === 12, 'hullDmg：0 / 負數 / NaN 不動船體'); }
// ---- 自然磨損停在 20%
{ const s = mk(SEA, 100); const { min } = walk(mk(SEA, 100), T0 + 10 * H); ok(min < 100, '磨損有作用（10 小時內船體下降）');
  const L = mk({ x: 1000, y: 300 }, 21); runTo(L, T0 + 40 * H); ok(L.cond === SZ.floor, `自然磨損（一般）：21% → 停在 ${L.cond}%`);
  const sh = mk({ x: 1000, y: 300 }, 20.04, { res: { food: 0, water: 0 } }); let m = 99; for (let i = 0; i < 20; i++) { sh.res.food = 0; sh.res.water = 0; simulateTo(sh, sh.simT + 6 * H); m = Math.min(m, sh.cond); } ok(m === SZ.floor && sh.cond === SZ.floor, `缺糧缺水（磨損 ×6）：20.04% → 停在 ${sh.cond}%`);
  const long = mk({ x: 1000, y: 300 }, 100); runTo(long, T0 + 12 * 24 * H); ok(long.cond === SZ.floor, `閒置 12 天：船體停在 ${long.cond}%（不會沉到 0）`); }
// ---- 風暴 / 雷擊停在 20%
{ const t0 = stormAt(); ok(t0 !== null, '找得到暴風時段');
  const dmg = (c) => { const s = mk(SEA, c); s.simT = t0; s.lastSeen = t0; const r = walk(s, t0 + 3 * H); return { s, end: s.cond, min: r.min, ev: r.ev }; };
  const hi = dmg(100), lo = dmg(21); ok(hi.end < 99, `暴風 3 小時：100% → ${hi.end.toFixed(1)}%（風暴 / 磨損有作用）`); ok(lo.end === SZ.floor && lo.min === SZ.floor, `暴風 3 小時：21% → 停在 ${lo.end}%`);
  // 長時間暴風 + 雷擊：從 20.5% 走很多個暴風時段，永遠 ≥ 20，並且雷擊 / 風暴事件有「已在保底」的訊息
  let all = []; let minAll = 100; const s = mk(SEA, 20.5); s.simT = T0; s.lastSeen = T0;
  for (let b = 0, n = 0; b < 3000 && n < 60; b++) { const t = T0 + b * 3 * H; if (weatherAt(t, SEA.x, SEA.y).kind !== 'storm') continue; n++; const r = walk(s, Math.max(s.simT, t) + 3 * H); minAll = Math.min(minAll, r.min); all.push(...r.ev); }
  ok(minAll === SZ.floor && s.cond === SZ.floor, `暴風 60 個時段 + 雷擊：20.5% → 最低 ${minAll}%、結尾 ${s.cond}%（不低於 20）`);
  const lt = all.filter((e) => e.sub === 'lightning'), st = all.filter((e) => e.type === 'storm');
  ok(lt.length > 0 && lt.some((e) => /已在保底/.test(e.text)) && !lt.some((e) => /−0%/.test(e.text)), `雷擊事件 ${lt.length} 次：保底時顯示「已在保底」`); console.log('    樣本:', (lt[0] || {}).text, '|', (st[0] || {}).text);
  // 強制雷擊 / 隨機風暴：直接把船體放在 20.3，掃很多 seed
  let bad = 0; for (let sd = 1; sd <= 12; sd++) { const q = mk(SEA, 20.3, { seed: 900 + sd }); q.simT = T0; q.lastSeen = T0; const r = walk(q, T0 + 30 * H, 600); if (r.min < SZ.floor) bad++; } ok(bad === 0, '12 個種子 × 30 小時（含隨機風暴事件）：沒有一次低於 20%'); }
// ---- 已經低於 20% 的船體不會被抬高
{ const s = mk(SEA, 12); const t0 = stormAt(); s.simT = t0; s.lastSeen = t0; const r = walk(s, t0 + 6 * H); ok(r.min === 12 && s.cond === 12, `船體 12%：暴風 6 小時後仍是 ${s.cond}%（不會被抬高到 20、也不會再降）`);
  const q = mk(SEA, 7.5); runTo(q, T0 + 5 * 24 * H); ok(q.cond === 7.5, `船體 7.5%：閒置 5 天仍是 ${q.cond}%`);
  const w = mk(SEA, 12); w.fac.workshop.lv = 1; w.res.parts = 50; simulateTo(w, T0 + 6 * H); ok(w.cond > 12, `工坊修理仍然可以把低於 20% 的船體慢慢修回來（→ ${w.cond.toFixed(2)}%）`); }
// ---- 離線一次補算 = 逐小時 = 逐 tick（保底也一樣）
{ for (const [name, pos, cond] of [['一般海域 80%', SEA, 80], ['接近保底 21%', SEA, 21], ['已低於保底 12%', SEA, 12], ['極地 30%', { x: 1000, y: 100 }, 30]]) {
    const a = mk(pos, cond), b = mk(pos, cond), c = mk(pos, cond); const T = T0 + 5 * 24 * H;
    for (const s of [a, b, c]) { s.res = { food: 99999, water: 99999, fuel: 99999, parts: 400 }; }
    simulateTo(a, T0 + 40 * H); simulateTo(a, T0 + 80 * H); simulateTo(a, T);   // 離線補算（分段，每段 ≤ 48 小時）
    for (let t = T0 + H; t <= T; t += H) simulateTo(b, t);                       // 每小時
    for (let t = T0 + TICK; t <= T; t += TICK) simulateTo(c, t);                 // 每 tick
    ok(strip(a) === strip(b) && strip(b) === strip(c) && a.cond >= Math.min(cond, SZ.floor), `離線補算 = 逐小時 = 逐 tick（${name}，5 天）：船體 ${a.cond.toFixed(2)}%`); } }
console.log(fails ? fails + ' 項失敗' : '全部通過'); process.exit(fails ? 1 : 0);
