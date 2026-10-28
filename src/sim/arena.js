// 末日方舟 · 階段④：即時砲戰場（純邏輯、固定步長、無 DOM / three.js）。畫面在 ui/battleui.js，這裡只管「規則」。
// 場地 100×100（上方是敵人、下方是玩家）。玩家：搖桿 / WASD 走位閃避、瞄準後開砲（砲彈有飛行時間，要預判）、普通彈 / 燃燒彈。
// 這個戰場只產生「命中率 / 閃避率」：結算一律交給 battle.js 的決定性對戰函式（手動加成有上限），所以畫面上的輸贏只是臨場感，
// 結算頁以 battle.js 為準。敵人的行動全部由 hash(seed,'arena',場次) 決定，測試可以用機器人重播。
import { hash, mulberry32 } from './rng.js';
import { clamp } from '../util.js';
import { SZ } from './szdata.js';
import { BT, ownPower, BOT } from './battle.js';

export const AR = { size: 100, dt: 1 / 30, time: 75, pr: 2.4, shellV: 46, splash: 4.5, cd: 1.0, cdInc: 2.2, incN: 5, aimMin: 8 };
const FOE_R = { serpent: 5, kraken: 12, leviathan: 15, pirate: 7 };

/** foe = battle.foeStats(cur)；own = fleet.combatOf(s)。 */
export function createArena(seed, n, foe, own) {
  const rnd = mulberry32(hash(seed, 'arena', n)); const kill = foe.hp / (ownPower(own) * BOT.acc);
  const maxHp = clamp(Math.round(kill * 1.7), 6, 60);
  return { seed, n, rnd, foe: { id: foe.id, name: foe.name, icon: foe.icon, x: 50, y: foe.id === 'pirate' ? 20 : 24, r: FOE_R[foe.id] || 6, hp: maxHp, max: maxHp, vis: true, st: 'idle', tt: 1.5, cool: 1.5, phase: 1, burn: 0, dive: 0, ang: Math.PI / 2, dir: 1, lane: null, boss: !!foe.boss },
    hullPct: own.cond, floor: SZ.floor, hit: clamp(foe.atk * 0.9 / Math.max(1, own.hull) * 100, 0.6, 14), spd: 16 * clamp(own.spd || 1, 0.8, 1.2),
    p: { x: 50, y: 82, vx: 0, vy: 0, ang: -Math.PI / 2, cd: 0.4, inc: AR.incN }, shells: [], proj: [], tele: [], fx: [], t: 0, over: null, st: { shots: 0, hits: 0, atk: 0, taken: 0, inc: 0 }, acc: 0 };
}
export const arenaMetrics = (a) => ({ shots: a.st.shots, hits: a.st.hits, acc: a.st.shots ? a.st.hits / a.st.shots : 0, dodge: a.st.atk ? clamp(1 - a.st.taken / a.st.atk, 0, 1) : 1, won: a.over === 'win', t: +a.t.toFixed(1) });

const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
function hitPlayer(a, ev, what) { a.st.taken++; a.hullPct = Math.max(a.floor, a.hullPct - a.hit); ev.push({ k: 'hurt', what, x: a.p.x, y: a.p.y }); if (a.hullPct <= a.floor + 1e-9) { a.over = 'lose'; ev.push({ k: 'lose' }); } }
const launch = (a, x, y, tx, ty, v, r = 2.6) => { const d = dist(x, y, tx, ty) || 1; a.proj.push({ x, y, vx: (tx - x) / d * v, vy: (ty - y) / d * v, r }); a.st.atk++; };
const circle = (a, x, y, r, T, kind = 'slam') => { a.tele.push({ x, y, r, t: 0, T, kind }); a.st.atk++; };

/** 敵人 AI（每步呼叫）：依種類排程攻擊；階段 2（血量 < 50%）更快。 */
function foeAI(a, dt, ev) {
  const F = a.foe, P = a.p, rnd = a.rnd; const px0 = F.x, py0 = F.y; F.phase = F.hp <= F.max / 2 ? 2 : 1; const sp = F.phase === 2 ? 1.35 : 1;
  F.tt -= dt * sp; F.cool -= dt * sp;
  if (F.burn > 0) { F.burn -= dt; F.bacc = (F.bacc || 0) + dt * 0.25; if (F.bacc >= 1) { F.bacc -= 1; dmgFoe(a, 1, ev, true); } }
  const lead = (k) => ({ x: clamp(P.x + P.vx * k, 4, 96), y: clamp(P.y + P.vy * k, 40, 96) });
  if (F.id === 'serpent') {
    F.x = 50 + Math.sin(a.t * 0.55 + 1) * 26; F.y = 24 + Math.sin(a.t * 1.1) * 7;
    if (F.st === 'dive') { F.dive -= dt; F.vis = false; if (F.dive <= 0) { F.vis = true; F.st = 'idle'; F.tt = 3.2; ev.push({ k: 'surface' }); } }
    else if (F.tt <= 0) { F.st = 'dive'; F.dive = 1.2; ev.push({ k: 'dive' }); }
    if (F.vis && F.cool <= 0) { F.cool = 1.9 + rnd() * 0.6; launch(a, F.x, F.y, lead(0.25).x, lead(0.25).y, 27); }
  } else if (F.id === 'kraken') {
    F.x = 50 + Math.sin(a.t * 0.35) * 6;
    if (F.cool <= 0) { F.cool = 2.5; const k = F.phase === 2 ? 2 : 1; for (let i = 0; i < k; i++) { const q = lead(0.3 + i * 0.25); circle(a, q.x + (i ? (rnd() - 0.5) * 14 : 0), q.y, 11, 1.15); } }
  } else if (F.id === 'leviathan') {
    F.x = 50 + Math.sin(a.t * 0.3) * 18;
    if (F.st === 'charge') { const L = F.lane; L.t += dt; if (L.t >= L.T) { F.st = 'idle'; if (!L.done) { L.done = 1; const d = distToLane(P, L); a.tele.push({ lane: L, t: 0, T: 0.35, kind: 'dash' }); if (d < 6.5) hitPlayer(a, ev, 'charge'); } } }
    else if (F.cool <= 0) {
      F.cool = 2.3; const r = rnd();
      if (r < 0.34) { for (let i = 0; i < 3; i++) { const q = lead(0.3 + i * 0.2); circle(a, q.x + (i ? (rnd() - 0.5) * 22 : 0), q.y, 12, 1.2); } }
      else if (r < 0.68) { const base = Math.atan2(P.y - F.y, P.x - F.x); for (let i = -2; i <= 2; i++) { const g = base + i * 0.2; launch(a, F.x, F.y + 8, F.x + Math.cos(g) * 60, F.y + 8 + Math.sin(g) * 60, 25, 2.8); } }
      else { F.st = 'charge'; F.lane = { x0: F.x, y0: F.y, x1: P.x, y1: P.y, w: 6.5, t: 0, T: 1.2 }; a.st.atk++; }
    }
  } else if (F.id === 'pirate') {
    F.x += F.dir * 9 * dt; if (F.x > 78) F.dir = -1; if (F.x < 22) F.dir = 1; F.y = 20 + Math.sin(a.t * 0.5) * 5;
    if (F.cool <= 0) { F.cool = 2.2; const q = lead(0.5); circle(a, q.x, q.y, 8, 1.5, 'shell'); if (F.phase === 2 || rnd() < 0.4) circle(a, clamp(q.x + (rnd() - 0.5) * 28, 6, 94), clamp(q.y + (rnd() - 0.5) * 16, 44, 96), 8, 1.8, 'shell'); }
  }
  F.vx = (F.x - px0) / dt; F.vy = (F.y - py0) / dt;   // 給瞄準預判 / 畫面用
}
function distToLane(P, L) { const dx = L.x1 - L.x0, dy = L.y1 - L.y0, l2 = dx * dx + dy * dy || 1; const t = clamp(((P.x - L.x0) * dx + (P.y - L.y0) * dy) / l2, -0.5, 3); return dist(P.x, P.y, L.x0 + dx * t, L.y0 + dy * t); }
function dmgFoe(a, d, ev, burn) { const F = a.foe; if (a.over) return; F.hp = Math.max(0, F.hp - d); ev.push({ k: 'foehit', x: F.x, y: F.y, burn: !!burn }); if (F.hp <= 0) { a.over = 'win'; ev.push({ k: 'win' }); } }

/** 一個固定步長。inp = { mx, my（-1..1）, aim: {x,y}|null, fire: 布林（邊緣觸發，用完要清）, ammo: 0|1 }。回傳這步的事件陣列。 */
export function stepArena(a, inp, dt = AR.dt) {
  const ev = []; if (a.over) return ev; const P = a.p; a.t += dt;
  // 走位（有慣性）
  let mx = inp && Number.isFinite(inp.mx) ? inp.mx : 0, my = inp && Number.isFinite(inp.my) ? inp.my : 0; const m = Math.hypot(mx, my); if (m > 1) { mx /= m; my /= m; }
  const k = 1 - Math.exp(-7 * dt); P.vx += (mx * a.spd - P.vx) * k; P.vy += (my * a.spd - P.vy) * k; P.x = clamp(P.x + P.vx * dt, 4, 96); P.y = clamp(P.y + P.vy * dt, 46, 96); if (Math.hypot(P.vx, P.vy) > 1) P.ang = Math.atan2(P.vy, P.vx);
  // 開砲
  P.cd -= dt; if (inp && inp.aim && inp.fire && P.cd <= 0) {
    const inc = inp.ammo === 1 && P.inc > 0; let tx = clamp(inp.aim.x, 0, 100), ty = clamp(inp.aim.y, 0, 100); const d0 = dist(P.x, P.y, tx, ty); if (d0 < AR.aimMin) { const g = Math.atan2(ty - P.y, tx - P.x); tx = P.x + Math.cos(g) * AR.aimMin; ty = P.y + Math.sin(g) * AR.aimMin; }
    const d = dist(P.x, P.y, tx, ty), T = clamp(d / AR.shellV, 0.4, 1.5); a.shells.push({ x0: P.x, y0: P.y, x1: tx, y1: ty, t: 0, T, inc }); a.st.shots++; P.cd = inc ? AR.cdInc : AR.cd; if (inc) { P.inc--; a.st.inc++; } ev.push({ k: 'fire', inc });
  }
  // 砲彈落水
  for (const s of a.shells) { s.t += dt; if (s.t >= s.T && !s.done) { s.done = 1; const F = a.foe; const hit = F.vis && dist(s.x1, s.y1, F.x, F.y) < F.r + AR.splash * (s.inc ? 1.15 : 1); ev.push({ k: 'splash', x: s.x1, y: s.y1, hit }); if (hit) { a.st.hits++; dmgFoe(a, 1, ev); if (s.inc) F.burn = 2.5; } } }
  a.shells = a.shells.filter((s) => !s.done);
  // 敵人行動 → 彈道 / 預警圈
  if (!a.over) foeAI(a, dt, ev);
  for (const q of a.proj) { q.x += q.vx * dt; q.y += q.vy * dt; if (!q.dead && dist(q.x, q.y, P.x, P.y) < AR.pr + q.r) { q.dead = 1; if (!a.over) hitPlayer(a, ev, 'proj'); } if (q.x < -8 || q.x > 108 || q.y < -8 || q.y > 108) q.dead = 1; }
  a.proj = a.proj.filter((q) => !q.dead);
  for (const c of a.tele) { c.t += dt; if (c.kind === 'dash') continue; if (c.t >= c.T && !c.done) { c.done = 1; ev.push({ k: 'slam', x: c.x, y: c.y, r: c.r }); if (!a.over && dist(P.x, P.y, c.x, c.y) < c.r + AR.pr * 0.5) hitPlayer(a, ev, c.kind); } }
  a.tele = a.tele.filter((c) => (c.kind === 'dash' ? c.t < c.T : c.t < c.T + 0.25));
  if (!a.over && a.t >= AR.time) { a.over = 'time'; ev.push({ k: 'time' }); }
  return ev;
}
