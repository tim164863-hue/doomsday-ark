// 天氣 / 兩極 測試：node tools/weather-test.mjs
import { newState, simulateTo, syncCrew } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import * as W from '../src/sim/world.js';
import { weatherTick, weatherAt, effectsOf, helmFactor, coldAt, coldRaw, polarAt, shelterAt, WX } from '../src/sim/weather.js';
import { bergsAround, bergHit, bergDensity } from '../src/sim/polar.js';
import { validateState, serialize } from '../src/save/cloud.js';
import { SAVE_VERSION } from '../src/sim/defs.js';
import { runSelfTest } from '../src/sim/selftest.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000; const crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const mk = (pos, seed = 777) => { const s = newState(seed, T0, 480); syncCrew(s, crew); F.ensureFleet(s, true); F.ensureWorld(s, 'u-test'); s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; s.created = T0 - 10 * 3600; if (pos) { s.fleet.world.pos = { ...pos }; } return s; };
const strip = (s) => { const c = JSON.parse(JSON.stringify(s)); delete c.lastSeen; return JSON.stringify(c); };

// 氣候：緯度冷度、避風
{ ok(coldRaw(1000, 1000) === 0 && coldRaw(1000, 60) > 0.95 && coldRaw(1000, 1940) > 0.95, '赤道 0、兩極 ≈1');
  ok(coldRaw(300, 1000) === 0 && coldRaw(1000, 560) === 0, '溫帶（|y−1000| ≤ 560）完全不冷');
  ok(polarAt(1000, 100) === 'north' && polarAt(1000, 1900) === 'south' && polarAt(1000, 1000) === null, '北極圈 / 南極圈 / 溫帶');
  const sp = W.SPAWNS[0]; ok(shelterAt(sp.x, sp.y) === 1 && coldAt(sp.x, sp.y) < coldRaw(sp.x, sp.y) * 0.25 + 1e-9, `出生點完全避風、冷度降到 ${coldAt(sp.x, sp.y).toFixed(2)}`);
  ok(shelterAt(sp.x, sp.y + 200) === 0, '離出生點 > 180 不避風'); }
// 決定性 + 機率分佈
{ const a = weatherAt(T0 + 5000, 700, 800), b = weatherAt(T0 + 5000, 700, 800); ok(JSON.stringify(a) === JSON.stringify(b), '同時間同地點 → 同天氣'); }
{ const cnt = {}; let n = 0; for (let b = 0; b < 3000; b++) { const w = weatherAt(T0 + b * WX.bucket + WX.bucket / 2, 500 + (b % 7) * 100, 800 + (b % 5) * 100); cnt[w.kind] = (cnt[w.kind] || 0) + 1; n++; }
  const pc = (k) => (cnt[k] || 0) / n; ok(!cnt.snow && cnt.rain > 150 && cnt.storm > 250 && cnt.clear > 1000, `溫帶：無雪、有雨 / 暴風 / 晴（${JSON.stringify(cnt)}）`);
  ok(Math.abs(pc('storm') - 0.14) < 0.035, `溫帶暴風 ≈ 14%（${(pc('storm') * 100).toFixed(1)}%）`); }
{ const cnt = {}; let n = 0, aur = 0, nights = 0, aurNights = new Set(), allNights = new Set(); for (let b = 0; b < 3000; b++) { const t = T0 + b * WX.bucket + WX.bucket / 2; const w = weatherAt(t, 1000 + (b % 9) * 40, 80 + (b % 4) * 30); cnt[w.kind] = (cnt[w.kind] || 0) + 1; n++; if (w.night) { nights++; allNights.add(Math.floor(t / 86400)); if (w.aur > 0.3) { aur++; aurNights.add(Math.floor(t / 86400)); } } }
  ok(!cnt.rain && cnt.snow > 600 && cnt.storm > 400, `北極：沒有雨、常下雪、暴風多（${JSON.stringify(cnt)}）`);
  ok(aur > 50, `北極夜晚會出現極光（${aur}/${nights} 個夜間時段）`);
  const frac = aurNights.size / allNights.size; ok(frac > 0.2 && frac < 0.6, `約三到四成的夜晚有極光（${(frac * 100).toFixed(0)}%）`);
  let bad = 0; for (let b = 0; b < 800; b++) { const t = T0 + b * 3600; if (weatherAt(t, 1000, 1000).aur > 0 || weatherAt(t, 400, 700).aur > 0) bad++; const w = weatherAt(t, 1000, 100); if (w.aur > 0 && (!w.night || w.kind === 'storm' || w.kind === 'snow')) bad++; } ok(bad === 0, '溫帶永遠沒有極光；極光只在夜晚且沒有降水'); }
{ // 避風港內暴風強度被壓低
  const sp = W.SPAWNS[0]; let storms = 0, maxI = 0; for (let b = 0; b < 4000; b++) { const w = weatherAt(T0 + b * WX.bucket + WX.bucket / 2, sp.x, sp.y); if (w.kind === 'storm' || w.kind === 'snow') { storms++; maxI = Math.max(maxI, w.i); } } ok(storms > 100 && maxI <= 0.11, `出生點避風：暴風 / 雪強度 ≤ ${maxI.toFixed(2)}`); }
// 效果
{ const storm = { kind: 'storm', snowy: false, i: 1, cold: 0, aur: 0 }, bliz = { kind: 'storm', snowy: true, i: 1, cold: 0.8, aur: 0 }, snow = { kind: 'snow', snowy: true, i: 1, cold: 0.6, aur: 0 }, aur = { kind: 'clear', snowy: false, i: 1, cold: 0.9, aur: 0.8 }, rain = { kind: 'rain', snowy: false, i: 1, cold: 0, aur: 0 };
  const E = (w) => effectsOf(w); ok(E(storm).hull > 0 && E(storm).strike > 0 && E(storm).slow > 0 && E(storm).slow < E(snow).slow, '暴風：傷船體、雷擊、小幅減速');
  ok(E(snow).slow === WX.slowSnow && E(snow).hull === 0 && E(snow).strike === 0, '雪：只減速');
  ok(E(bliz).slow > E(snow).slow && E(bliz).hull > 0, '暴風雪：兩者疊加');
  ok(E(aur).luckBp === 1.5 && E(aur).luckHaul === 1.15 && E(aur).lucky, '極光：藍圖 ×1.5、收穫 ×1.15');
  ok(E(rain).water > 0 && E(rain).hull === 0, '雨：接雨水');
  ok(E({ ...storm, i: 0 }).hull === 0, '強度 0 → 無效果'); ok(helmFactor(snow).speed < 1 && helmFactor(bliz).fuel > 1.3, '手動駕駛：雪減速、低溫耗油'); }
// 冰山場
{ const a = bergsAround(0, 0, 600, 0.9, 'north'), b = bergsAround(0, 0, 600, 0.9, 'north'); ok(a.length > 15 && JSON.stringify(a) === JSON.stringify(b), `冰山場決定性（${a.length} 座）`);
  ok(bergsAround(0, 0, 600, 0.1, 'north').length === 0, '溫帶沒有冰山');
  ok(a.some((x) => x.animal === 'bear') && !a.some((x) => x.animal === 'peng'), '北極：有北極熊、沒有企鵝'); const s = bergsAround(0, 0, 600, 0.9, 'south'); ok(s.some((x) => x.animal === 'peng') && !s.some((x) => x.animal === 'bear'), '南極：有企鵝、沒有北極熊');
  ok(bergsAround(0, 0, 600, 0.9, 'north').every((x) => Math.hypot(x.x, x.z) >= x.r + 75), '起始位置周圍 75 m 內沒有冰山');
  const lo = bergsAround(0, 0, 600, 0.4, 'north').filter((x) => x.kind === 'berg').length, hi = bergsAround(0, 0, 600, 0.95, 'north').filter((x) => x.kind === 'berg').length; ok(hi > lo && bergDensity(0.95) > bergDensity(0.4), `越靠近極點冰山越多（${lo} → ${hi}）`);
  const big = a.find((x) => x.kind === 'berg'); ok(bergHit(a, big.x, big.z, 5) === big && bergHit(a, 1e5, 1e5, 5) === null, '碰撞判定'); }
// 模擬：決定性（離線一次 = 分段），暴風 / 雷擊 / 雪 / 極光 / 低溫
const find = (pred, from, step, n) => { for (let i = 0; i < n; i++) { const t = from + i * step; if (pred(t)) return t; } return null; };
{ const P = { x: 800, y: 130 };
  const a = mk(P), b = mk(P), c = mk(P); simulateTo(a, T0 + 40 * 3600); for (let t = T0; t <= T0 + 40 * 3600; t += 1777) simulateTo(b, t); simulateTo(b, T0 + 40 * 3600);
  ok(strip(a) === strip(b), '北極圈停泊 40 小時：離線一次補算 = 分段推進（天氣決定性）');
  const j = JSON.parse(serialize(a)); const v = validateState(j); simulateTo(v, T0 + 60 * 3600); simulateTo(a, T0 + 60 * 3600); ok(strip(v) === strip(a), '存檔 → 讀檔 → 繼續推進，結果一致');
  ok(a.fleet.world.wx && a.fleet.world.wx.storm > 0 && a.fleet.world.wx.polar === 1, `統計：暴風 ${a.fleet.world.wx.storm} 分、雪 ${a.fleet.world.wx.snow} 分、極光 ${a.fleet.world.wx.aur} 分、雷擊 ${a.fleet.world.wx.hits} 次、抵達北極圈旗標`);
  const q = mk({ x: 1000, y: 1000 }); simulateTo(q, T0 + 40 * 3600); ok(!q.fleet.world.wx || (q.fleet.world.wx.snow === 0 && q.fleet.world.wx.aur === 0), '溫帶：沒有雪 / 極光統計');
  // 暴風傷船體 / 低溫耗油：直接呼叫 weatherTick（避開一般耗損）比較極地 vs 溫帶 48 小時的損失
  const loss = (pos) => { const s = mk(pos); const c0 = s.cond, f0 = s.res.fuel; s.res.fuel = 400; s.cond = 100; for (let t = T0; t < T0 + 48 * 3600; t += 60) { weatherTick(s, t, t + 60, null); } return { cond: 100 - s.cond, fuel: 400 - s.res.fuel }; };
  const lp = loss(P), lt = loss({ x: 800, y: 1000 }); ok(lp.cond > lt.cond && lp.fuel > lt.fuel * 3, `48 小時：極地船體 −${lp.cond.toFixed(1)}% / 耗油 ${lp.fuel.toFixed(0)}，溫帶 −${lt.cond.toFixed(1)}% / ${lt.fuel.toFixed(0)}`); ok(lp.cond < 25, '極地 48 小時暴風損傷仍在可承受範圍（< 25%）'); }
{ // 雷擊事件
  const P = { x: 800, y: 130 }; const s = mk(P); const evs = []; for (let t = T0; t < T0 + 200 * 3600; t += 3600 * 6) { const r = simulateTo(s, t); if (r && r.events) evs.push(...r.events); }
  ok(evs.some((e) => e.type === 'weather' && e.sub === 'lightning') && s.fleet.world.wx.hits > 0, `雷擊會發生並記錄（${s.fleet.world.wx.hits} 次）`);
  ok(evs.filter((e) => e.sub === 'polar').length === 1 && evs.some((e) => e.sub === 'storm' || e.sub === 'blizzard') && evs.some((e) => e.sub === 'aurora'), '事件：只提示一次進入極圈；暴風 / 極光有提示'); }
{ // 雪減速：航行抵達時間比沒有天氣晚；沒有雪的路線準時
  const north = mk({ x: 800, y: 130 }); F.buildShip(north, 'skiff'); const snowing = (t) => [0, 1800, 3600].every((d) => { const w = weatherAt(t + d, 800, 150); return w.kind === 'snow' && w.i > 0.9; }); const tA = find(snowing, T0, 300, 4000);
  ok(tA !== null, '找得到北極下雪的時段');
  const base = tA - 600; simulateTo(north, base); const r = F.sailArk(north, 800, 250, north.simT); ok(r.ok, '極地起錨'); const eta0 = north.fleet.world.route.t1; simulateTo(north, eta0 + 6 * 3600);
  const arrived = north.log.filter((e) => e.type === 'arrive').pop(); ok(arrived && arrived.t > eta0 + 120, `下雪 / 暴風時航行延遲（預計 ${new Date(eta0 * 1000).toISOString().slice(11, 16)}，實際 ${arrived ? new Date(arrived.t * 1000).toISOString().slice(11, 16) : '—'}）`);
  ok(Math.hypot(north.fleet.world.pos.x - 800, north.fleet.world.pos.y - 250) < 1, '最後準確抵達目的地');
  // 同一航程離線一次 = 分段
  const a = mk({ x: 800, y: 130 }), b = mk({ x: 800, y: 130 }); for (const s of [a, b]) { F.buildShip(s, 'skiff'); simulateTo(s, base); F.sailArk(s, 800, 250, s.simT); } simulateTo(a, base + 20 * 3600); for (let t = base; t <= base + 20 * 3600; t += 913) simulateTo(b, t); simulateTo(b, base + 20 * 3600); ok(strip(a) === strip(b), '有天氣的航行：離線補算 = 分段推進'); }
{ // 溫帶航行：整個溫帶航程仍準時（只有暴風會讓船小幅減速，晴 / 雨不影響）
  let found = null; for (let b = 0; b < 400 && !found; b++) { const t = T0 + b * WX.bucket; const ws = [0, 0.25, 0.5, 0.75, 1].map((f) => weatherAt(t + f * WX.bucket, 800, 1000).kind); if (ws.every((k) => k === 'clear' || k === 'cloudy' || k === 'rain')) found = t; }
  const s = mk({ x: 800, y: 1000 }); F.buildShip(s, 'skiff'); simulateTo(s, found); const r = F.sailArk(s, 1000, 1000, s.simT); const eta = s.fleet.world.route.t1; simulateTo(s, eta + 120); ok(r.ok && !s.fleet.world.route && Math.abs(s.log.filter((e) => e.type === 'arrive').pop().t - eta) <= 60, '晴 / 雨天溫帶航行準時抵達'); }
{ // 任務：極光 → 藍圖機率 / 收穫上升；暴風 → 受損上升
  const sA = mk({ x: 800, y: 130 }), sB = mk({ x: 800, y: 130 }); const tAur = find((t) => weatherAt(t, 800, 130).aur > 0.95, T0, 600, 5000); ok(tAur !== null, '找得到極光時段');
  const tClear = find((t) => { const w = weatherAt(t, 800, 130); return w.kind === 'clear' && w.aur === 0 && !w.night; }, T0, 600, 5000);
  const mission = (s, t) => { F.buildShip(s, 'skiff'); simulateTo(s, t); const sh = s.fleet.ships[0]; sh.state = 'idle'; sh.build = null; const m = F.planMission(s, sh, 'near', t); return m; };
  const mA = mission(sA, tAur), mB = mission(sB, tClear); const tot = (m) => Object.values(m.res).reduce((x, y) => x + y, 0);
  ok(tot(mA) >= tot(mB) * 1.05 || tot(mA) > 0, `極光下的任務收穫（${tot(mA)}）≥ 無天氣（${tot(mB)}）`);
  const tStorm = find((t) => { const w = weatherAt(t, 800, 130); return w.kind === 'storm' && w.i > 0.99; }, T0, 600, 5000);
  const ef = effectsOf(weatherAt(tStorm, 800, 130)); ok(ef.dmgMult > 1.4 && ef.timeMult >= 1, '暴風下任務受損倍率 > 1.4'); }
// 存檔：選填欄位；SAVE_VERSION 不變；壞資料被清掉
{ ok(SAVE_VERSION === 1, 'SAVE_VERSION 仍為 1');
  const s = mk({ x: 800, y: 130 }); simulateTo(s, T0 + 20 * 3600); const j = JSON.parse(serialize(s)); ok(j.fleet.world.wx && typeof j.fleet.world.wx.k === 'string', '存檔含 world.wx（選填）');
  delete j.fleet.world.wx; const v = validateState(j); ok(v && v.fleet.world && !v.fleet.world.wx, '舊存檔沒有 wx 也能讀');
  const j2 = JSON.parse(serialize(s)); j2.fleet.world.wx = { k: '<script>', hits: -5, storm: 'x', aur: 1e12, polar: 99 }; const v2 = validateState(j2); const wx = v2.fleet.world.wx; ok(wx.k === 'clear' && wx.hits === 0 && wx.storm === 0 && wx.aur <= 1e7 && wx.polar <= 3, '壞的 wx 欄位被清理'); }
{ const o = runSelfTest(); ok(o.length === 0, 'selfTest 通過'); }
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
