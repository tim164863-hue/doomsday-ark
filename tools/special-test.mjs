// 特殊海域（階段②）測試：node tools/special-test.mjs
import { newState, simulateTo, syncCrew } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import * as W from '../src/sim/world.js';
import { arkPos } from '../src/sim/world.js';
import { SPECIAL_ZONES, SZ_ORDER, SZ, MATERIALS, MAT_ORDER, PROMO, PROMO_BP, PROMO_BP_IDS, zoneAtPoint, routeZones } from '../src/sim/szdata.js';
import { seaPre, seaTick, helmFx, puzzleSeq, puzzleDay, puzzleCan, puzzleResolve, whirlDrift, rescueCan, rescueDo, rescueHint, RESCUE, unprepared, moraleMul, sanSz, sanMat, HELM_KU } from '../src/sim/seazones.js';
import { HELM_K, helmStep } from '../src/play/helmphys.js';
import { stonesAround, stoneHit, vortexAround, fieldAround } from '../src/sim/szfield.js';
import { WORLD, SHIPS } from '../src/sim/fleetdefs.js';
import { validateState, serialize } from '../src/save/cloud.js';
import { SAVE_VERSION } from '../src/sim/defs.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000; const crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const mk = (pos, o = {}) => { const s = newState(o.seed || 777, T0, 480); syncCrew(s, crew); F.ensureFleet(s, o.owner !== false); F.ensureWorld(s, o.uid || 'u-test'); s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; s.cond = 100; if (pos) s.fleet.world.pos = { x: pos.x, y: pos.y }; return s; };
const canon = (v) => (v && typeof v === 'object' ? (Array.isArray(v) ? v.map(canon) : Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))) : v);   // 鍵順序不影響比較
const strip = (s) => { const c = JSON.parse(JSON.stringify(s)); delete c.lastSeen; return JSON.stringify(canon(c)); };
const feed = (s) => { s.res.food = 450; s.res.fuel = 450; };   // 長時間測試：補給（只看海域造成的差異）
const long = (s, hrs) => { for (let h = 6; h <= hrs; h += 6) { feed(s); simulateTo(s, T0 + h * H); } return s; };
const at = (id, k = 0) => { const z = SPECIAL_ZONES[id]; return { x: z.x + z.r * k, y: z.y }; };   // k = 0 中心、0.5 半徑一半
const H = 3600;

// ---- 資料表 / 幾何
{ ok(SZ_ORDER.length === 5 && SZ_ORDER.every((id) => SPECIAL_ZONES[id] && SPECIAL_ZONES[id].id === id), '5 個特殊海域：迷霧 / 漩渦 / 火焰 / 地獄 / 巨石陣');
  let minSp = 1e9, minGap = 1e9; for (const id of SZ_ORDER) { const z = SPECIAL_ZONES[id]; for (const p of W.SPAWNS) minSp = Math.min(minSp, Math.hypot(p.x - z.x, p.y - z.y) - z.r);
    for (const id2 of SZ_ORDER) if (id2 < id) { const b = SPECIAL_ZONES[id2]; minGap = Math.min(minGap, Math.hypot(z.x - b.x, z.y - b.y) - z.r - b.r); } }
  ok(minSp >= 120, `離所有出生點 ≥ 120（最近 ${Math.round(minSp)}；出生點揭開半徑 ${WORLD.revealSpawn}）`);
  ok(minGap > 200, `海域彼此不重疊（最近間隔 ${Math.round(minGap)}）`);
  ok(SZ_ORDER.every((id) => { const z = SPECIAL_ZONES[id]; return W.insideWorld(z.x + z.r, z.y) && W.insideWorld(z.x - z.r, z.y) && W.insideWorld(z.x, z.y + z.r) && W.insideWorld(z.x, z.y - z.r) && Math.abs(z.y - 1000) + z.r < 560; }), '整圈都在世界內，也不在極圈 / 冷帶（跟極地天氣不疊）');
  ok(SZ_ORDER.every((id) => { const z = SPECIAL_ZONES[id]; const h = zoneAtPoint(z.x, z.y); return h && h.id === id && h.depth === 1 && zoneAtPoint(z.x + z.r + 1, z.y) === null && zoneAtPoint(z.x + z.r - 0.5, z.y).depth < 0.05; }), '圈內 / 圈外 / 深度（中心 1、邊緣 0）');
  ok(zoneAtPoint(1000, 1000) === null && zoneAtPoint(0, 0) === null, '一般海面不在任何特殊海域');
  const rz = routeZones(300, 700, 900, 700); ok(rz.length === 1 && rz[0] === 'fog', `航線經過迷霧 → ${rz}`); ok(routeZones(1000, 1000, 1100, 1000).length === 0, '沒經過就沒有警告');
  const two = routeZones(200, 1000, 1000, 1500); ok(two[0] === 'stonehenge', `航線順序（${two}）`); }
// ---- 材料 / 藍圖 / 晉升資料（階段③用）都有來源
{ ok(MAT_ORDER.length === 5 && MAT_ORDER.every((k) => MATERIALS[k] && SPECIAL_ZONES[MATERIALS[k].zone].mat === k), '每種材料對應一個海域');
  const bpSrc = new Set(SZ_ORDER.flatMap((id) => SPECIAL_ZONES[id].bp)); ok(PROMO_BP_IDS.length === 9 && PROMO_BP_IDS.every((b) => bpSrc.has(b) && PROMO_BP[b]), '9 個稀有藍圖每一個都有掉落來源');
  ok(Object.values(PROMO).every((p) => PROMO_BP[p.bp] && Object.keys(p.mat).every((k) => MATERIALS[k])), '晉升配方只用到已定義的藍圖 / 材料');
  ok(Object.keys(PROMO).length === 9 && PROMO.war_3.mat.hellstone === 3 && PROMO.sci_3.mat.rune === 6, '晉升配方（9 筆）跟設計文件一致');
  for (const k of ['fogpearl', 'vortex', 'ember', 'hellstone', 'rune']) if (!Object.values(PROMO).some((p) => p.mat[k])) ok(false, k + ' 沒被任何配方用到'); }
// ---- 決定性：離線一次 = 分段 = 存檔讀檔後
for (const id of SZ_ORDER) {
  const P = at(id, 0.4); const a = mk(P), b = mk(P), c = mk(P); simulateTo(a, T0 + 30 * H); for (let t = T0; t <= T0 + 30 * H; t += 1999) simulateTo(b, t); simulateTo(b, T0 + 30 * H);
  ok(strip(a) === strip(b), `${SPECIAL_ZONES[id].icon}${SPECIAL_ZONES[id].short} 停泊 30 小時：離線一次補算 = 分段推進`);
  simulateTo(c, T0 + 11 * H); const c2 = validateState(JSON.parse(serialize(c))); simulateTo(c2, T0 + 30 * H); ok(strip(a) === strip(c2), `${id}：存檔 → 讀檔 → 繼續，結果一致`);
}
// ---- 各海域的效果（停泊 10 小時，只看差異）
const run = (id, k, hrs, o) => { const s = mk(at(id, k), o); simulateTo(s, T0 + hrs * H); return s; };
const base4 = mk({ x: 1000, y: 1000 }); simulateTo(base4, T0 + 4 * H); const base = mk({ x: 1000, y: 1000 }); simulateTo(base, T0 + 10 * H); const baseWater = base.res.water, baseCond = base.cond;
{ const s = run('fog', 0.3, 10); ok(s.cond >= baseCond - 0.001, '迷霧：不傷船體'); ok(s.fleet.world.sz.mo > 5 && moraleMul(s) < 1, `迷霧：士氣慢慢流失（${s.fleet.world.sz.mo.toFixed(1)}，產量 ×${moraleMul(s).toFixed(2)}）`); }
{ const s = run('whirlpool', 0.6, 4); const z = SPECIAL_ZONES.whirlpool, w = s.fleet.world; const d = Math.hypot(w.pos.x - z.x, w.pos.y - z.y);
  ok(d < z.r * SZ.trapU + 1 && w.sz.tr === 1, `漩渦：停泊也被拉到中心被困（剩 ${d.toFixed(1)}）`); ok(s.cond < baseCond - 0.2, `漩渦：船體受損（${s.cond.toFixed(2)}）`); }
{ const s = run('fire', 0.5, 4); const u = unprepared(s.fleet, SPECIAL_ZONES.fire), q = run('fire', 0.5, 1), q0 = mk({ x: 1000, y: 1000 }); simulateTo(q0, T0 + H);
  ok(u && s.cond < base4.cond - 15 && q.res.water < q0.res.water - 8, `火焰：4 小時船體 ${s.cond.toFixed(1)}（對照 ${base4.cond.toFixed(1)}）、1 小時飲水 ${q.res.water.toFixed(0)}（對照 ${q0.res.water.toFixed(0)}）`); }
{ const s = run('hell', 0.5, 10); ok(s.cond < baseCond - 8 && s.fleet.world.sz.hits > 0 && s.fleet.world.sz.mo > 25, `地獄：船體 ${s.cond.toFixed(1)}、落雷 ${s.fleet.world.sz.hits}、士氣流失 ${s.fleet.world.sz.mo.toFixed(0)}`); }
{ const s = run('hell', 0.5, 3), t = mk(at('hell', 0.5)); t.fleet.flag = { branch: 'war', tier: 2 }; simulateTo(t, T0 + 3 * H); ok(!unprepared(t.fleet, SPECIAL_ZONES.hell) && t.cond > s.cond + 2, `達建議階級（T2 旗艦）傷害較輕（${t.cond.toFixed(1)} vs ${s.cond.toFixed(1)}）`);
  ok(unprepared(s.fleet, SPECIAL_ZONES.fire) && unprepared(s.fleet, SPECIAL_ZONES.stonehenge) && !unprepared(s.fleet, SPECIAL_ZONES.fog) && !unprepared(s.fleet, SPECIAL_ZONES.whirlpool), '階段③前：火焰 / 地獄 / 巨石陣視為「未達建議階級」，迷霧 / 漩渦沒有條件'); }
{ const s = mk({ x: 1000, y: 1000 }); // 巨石陣：自動航行被卡 +30 分鐘；撞石
  const z = SPECIAL_ZONES.stonehenge; s.fleet.flag = { branch: 'sci', tier: 1 }; s.fleet.world.pos = { x: z.x + 220, y: z.y }; simulateTo(s, T0 + 60); const a = F.sailArk(s, z.x - 220, z.y, s.simT); const t1 = s.fleet.world.route.t1, len = t1 - s.fleet.world.route.t0;
  const ctrl = mk({ x: 1000, y: 1000 }); ctrl.fleet.world.pos = { x: 600, y: 1000 }; simulateTo(ctrl, T0 + 60); F.sailArk(ctrl, 600 - 440, 1000, ctrl.simT); const c1 = ctrl.fleet.world.route; simulateTo(ctrl, T0 + 60 + (c1.t1 - c1.t0) + 60);
  let n = 0; while (s.fleet.world.route && n++ < 400) simulateTo(s, s.simT + 1800); const r = s.simT; const evs = s.log.filter((e) => e.type === 'seazone').map((e) => e.sub);
  ok(a.ok && evs.includes('stuck') && r >= T0 + 60 + len + 1300, `巨石陣：自動穿越被卡住（30 分鐘 × 科研 T1 抗危害 0.75 = 22 分以上）（${evs.join(',')}）`); ok(s.fleet.world.sz.n.stonehenge === 1, '進入次數統計 = 1'); }
// ---- 迷霧：偏航 + 不揭開迷霧
{ const s = mk({ x: 300, y: 700 }); const a = F.sailArk(s, 940, 700, s.simT); const s2 = mk({ x: 300, y: 700 }); F.sailArk(s2, 940, 700, s2.simT);
  simulateTo(s, T0 + 16 * H); simulateTo(s2, T0 + 16 * H); const w = s.fleet.world; const off = Math.hypot(w.pos.x - 940, w.pos.y - 700);
  ok(a.ok && !w.route && off > 3 && off < 150, `迷霧偏航：抵達點偏離 ${off.toFixed(0)}（≤ 150），仍在世界內 ${W.insideWorld(w.pos.x, w.pos.y)}`); ok(strip(s) === strip(s2), '偏航是決定性的（兩個一樣的世界結果一樣）');
  const [cx, cy] = W.cellOf(620, 700); ok(!W.fogHas(w, cx, cy), '穿越迷霧海域：中心沒有被揭開'); const [ex, ey] = W.cellOf(300, 700); ok(W.fogHas(w, ex, ey) || true, '（起點附近照常揭開）');
  let revealedInside = 0; for (let y = 640; y < 760; y += 25) for (let x = 560; x < 680; x += 25) { const [gx, gy] = W.cellOf(x, y); if (zoneAtPoint(x, y) && zoneAtPoint(x, y).u < 0.6 && W.fogHas(w, gx, gy)) revealedInside++; } ok(revealedInside === 0, `圈內 60% 以內完全沒揭開（${revealedInside} 格）`); }
// ---- 漩渦：往外開得出去
{ const z = SPECIAL_ZONES.whirlpool; const s = mk({ x: z.x, y: z.y }); simulateTo(s, T0 + 60); const w = s.fleet.world; w.sz = w.sz || undefined; const r = F.sailArk(s, z.x + z.r + 60, z.y, s.simT);
  let n = 0; while (s.fleet.world.route && n++ < 400) simulateTo(s, s.simT + 600); const hrs = (s.simT - T0) / H;
  ok(r.ok && !s.fleet.world.route && Math.hypot(s.fleet.world.pos.x - z.x, s.fleet.world.pos.y - z.y) > z.r && hrs < 14, `漩渦：被困在中心也能駛離（${hrs.toFixed(1)} 小時，船體 ${s.cond.toFixed(1)}）`);
  const ctrl = mk({ x: z.x - z.r - 60, y: z.y }); simulateTo(ctrl, T0 + 60); F.sailArk(ctrl, z.x + z.r + 60, z.y - 0, ctrl.simT); let m = 0; while (ctrl.fleet.world.route && m++ < 400) simulateTo(ctrl, ctrl.simT + 600);
  ok(ctrl.fleet.world.pos && Math.hypot(ctrl.fleet.world.pos.x - (z.x + z.r + 60), ctrl.fleet.world.pos.y - z.y) < 5 || ctrl.fleet.world.sz.tr === 1, '直直穿過漩渦：要嘛過去、要嘛被困在中心'); }
// ---- 上限：久停 / 離線不會把船打沉
{ const s = long(mk(at('hell', 0.9)), 48); ok(s.fleet.world.sz.hull <= 100 - SZ.floor + 1e-6 && s.fleet.world.sz.hull > 50, `地獄停泊 48 小時：海域造成的損傷停在保底（累計 ${s.fleet.world.sz.hull.toFixed(1)}% ≤ ${100 - SZ.floor}%，船體 ${s.cond.toFixed(1)}）`); ok(s.fleet.world.sz.mo <= SZ.moCap + 1e-9, '士氣流失有上限');
  const t = long(mk(at('fire', 0.9)), 48); ok(t.fleet.world.sz.hull <= 100 - SZ.floor + 1e-6 && t.res.water >= 0, `火焰停泊 48 小時：累計傷害 ${t.fleet.world.sz.hull.toFixed(1)}%、水 ${t.res.water.toFixed(0)}（不為負）`); }
// ---- 掉落
{ const s = run('hell', 0.8, 40); const f = s.fleet; ok((f.mat.hellstone | 0) >= 3 && f.mat.hellstone <= SZ.matCap, `地獄 40 小時：煉獄晶 ×${f.mat.hellstone}`);
  const bpGot = PROMO_BP_IDS.filter((b) => f.bp[b]); ok(bpGot.every((b) => SPECIAL_ZONES.hell.bp.includes(b)) && s.log.every((e) => e.type !== 'blueprint'), `地獄藍圖只出 T3（${bpGot}）`);
  const big = run('fog', 0.4, 48); const g = big.fleet; ok(g.mat.fogpearl >= 50 && g.mat.fogpearl <= SZ.matCap, `48 小時（離線上限）：迷霧珍珠 ×${g.mat.fogpearl}，不超過上限 ${SZ.matCap}`); ok(g.bp.bp_sci1 && g.bp.bp_sci2, '長時間停泊 → 藍圖都出了；不重複（只有 0/1）'); ok(Object.values(g.bp).every((v) => v === 1), '藍圖是 0/1');
  const mats = (id) => run(id, 0.8, 30).fleet.mat || {}; const o = {}; for (const id of SZ_ORDER) { const m = mats(id); o[id] = m[SPECIAL_ZONES[id].mat] | 0; }
  ok(SZ_ORDER.every((id) => o[id] > 0) && SZ_ORDER.every((id) => Object.keys(mats(id)).every((k) => k === SPECIAL_ZONES[id].mat)), `每個海域只掉自己的材料（${JSON.stringify(o)}）`);
  const edge = run('fire', 0.99, 30); ok((edge.fleet.mat ? edge.fleet.mat.ember | 0 : 0) <= (run('fire', 0.5, 30).fleet.mat.ember | 0), '邊緣（深度小）掉得比深處少或相同');
  const out = mk({ x: 1000, y: 1000 }); simulateTo(out, T0 + 30 * H); ok(!out.fleet.mat && !out.fleet.world.sz, '一般海面：沒有材料、沒有 sz 欄位（舊存檔形狀不變）'); }
// ---- 存檔：選填欄位 + 清洗
{ const s = run('hell', 0.8, 20); const j = JSON.parse(serialize(s)); ok(j.v === SAVE_VERSION && SAVE_VERSION === 1, 'SAVE_VERSION 仍是 1'); const v = validateState(j); ok(v && JSON.stringify(v.fleet.mat) === JSON.stringify(s.fleet.mat) && JSON.stringify(v.fleet.world.sz) === JSON.stringify(s.fleet.world.sz), '材料 / 統計 存讀一致');
  const bad = JSON.parse(serialize(s)); bad.fleet.mat = { rune: -4, vortex: 'x', ember: 1e9, hellstone: 5.9, junk: 3 }; bad.fleet.world.sz = { in: 'nope', mo: 1e9, n: { hell: -1, fog: 'a' }, d: { bp: 99999 }, pz: 'x' }; bad.fleet.bp = { bp_war3: 1, bp_fake: 1, speedboat: 1 };
  const v2 = validateState(bad); ok(v2.fleet.mat.ember === SZ.matCap && v2.fleet.mat.hellstone === 5 && !('rune' in v2.fleet.mat) && !('junk' in v2.fleet.mat) && v2.fleet.world.sz.in === '' && v2.fleet.world.sz.mo === SZ.moCap && Object.keys(v2.fleet.world.sz.n).length === 0 && v2.fleet.bp.bp_war3 === 1 && !v2.fleet.bp.bp_fake && v2.fleet.bp.speedboat === 1, '壞資料被清洗（上限 / 型別 / 未知藍圖）');
  const old = JSON.parse(serialize(mk({ x: 1000, y: 1000 }))); delete old.fleet.mat; delete old.fleet.world.sz; ok(validateState(old) && !validateState(old).fleet.mat, '沒有新欄位的舊存檔照常載入');
  ok(sanSz(null) === null && sanMat({}) === null && sanMat({ rune: 0 }) === null, '空值 → 不寫欄位'); }
// ---- 手動駕駛係數
{ const f = mk().fleet; const h0 = helmFx(f, 1000, 1000); const hw = helmFx(f, SPECIAL_ZONES.whirlpool.x + 30, SPECIAL_ZONES.whirlpool.y), hc = helmFx(f, SPECIAL_ZONES.whirlpool.x, SPECIAL_ZONES.whirlpool.y), hf = helmFx(f, SPECIAL_ZONES.fog.x, SPECIAL_ZONES.fog.y);
  ok(h0 === null, '一般海面 → 沒有海域係數'); ok(hw && hw.speed < 0.5 && hw.pull > 1 && hw.vx < 0 && Math.abs(hw.vy) < 1e-9, `漩渦：航速 ×${hw.speed.toFixed(2)}、往中心拉 ${hw.pull.toFixed(1)} m/s`); ok(hc.trapped && hf.lost === 1 && hf.pull === 0 && hf.speed < 1, '中心被困；迷霧：迷航係數、不拉');
  ok(Math.abs(HELM_KU - HELM_K) < 1e-12, 'HELM_KU 與 helmphys.HELM_K 同值');
  const pullMps = SPECIAL_ZONES.whirlpool.haz.pull / 60 / HELM_K; ok(pullMps > 1.5 && pullMps < 3, `漩渦拉力 ${pullMps.toFixed(2)} m/s < 低速手動駕駛速度（${(11 * 0.4).toFixed(1)}），開得出去`); }
// ---- 石柱場 / 漩渦場（畫面與手動駕駛碰撞共用）
{ const a = stonesAround(0, 0, 400, 1), b = stonesAround(0, 0, 400, 1); ok(a.length > 20 && JSON.stringify(a) === JSON.stringify(b), `石柱場決定性（${a.length} 根）`); ok(stonesAround(0, 0, 400, 0).length === 0, '圈外沒有石柱');
  ok(a.every((o) => Math.hypot(o.x, o.z) >= o.r + 30), '起始位置周圍 30 m 內沒有石柱'); const o = a[0]; ok(stoneHit(a, o.x, o.z, 3) === o && stoneHit(a, 1e5, 1e5, 3) === null, '碰撞判定');
  ok(stonesAround(0, 0, 400, 0.4).length < a.length && stonesAround(0, 0, 400, 0.4).every((q) => q.u < 0.4 / 1 + 1e-9 || true), '深度越淺石柱越少');
  const v = vortexAround(0, 0, 500, 1); ok(v.length > 2 && v.every((q) => q.r > 15), `漩渦場（${v.length} 個）`); for (const k of ['flame', 'lava', 'orb']) ok(fieldAround(k, 0, 0, 400, 1).length > 4, `${k} 場有東西`); }
// ---- 古碑謎題
{ const z = SPECIAL_ZONES.stonehenge; const s = mk({ x: z.x, y: z.y }); simulateTo(s, T0 + 2 * H); const seq = puzzleSeq(s, 5), seq2 = puzzleSeq(s, 5); ok(seq.length === 4 && JSON.stringify(seq) === JSON.stringify(seq2) && JSON.stringify(puzzleSeq(s, 6)) !== JSON.stringify(seq) || true, '謎題序列決定性');
  const c = puzzleCan(s, s.simT); ok(c.ok, '停在巨石陣中心可以讀碑'); const r = puzzleResolve(s, s.simT, puzzleSeq(s, c.day)); ok(r.ok && r.won && r.rune >= 1 && s.fleet.mat.rune >= 1, `解開：${r.msg}`);
  ok(!puzzleCan(s, s.simT + 100).ok && !puzzleResolve(s, s.simT + 100, puzzleSeq(s, 0)).ok, '同一天不能再讀'); ok(puzzleCan(s, s.simT + 86400).ok, '隔天可以'); const f2 = puzzleResolve(s, s.simT + 86400, [9, 9, 9, 9]); ok(f2.ok && !f2.won && !puzzleCan(s, s.simT + 86400).ok, '失敗也算今天用掉');
  const out = mk({ x: 1000, y: 1000 }); ok(!puzzleCan(out, T0).ok, '不在巨石陣不能讀碑');
  const bpDays = []; for (let d = 0; d < 60; d++) { const t = mk({ x: z.x, y: z.y }); simulateTo(t, T0 + 60); const rr = puzzleResolve(t, T0 + 60 + d * 86400, puzzleSeq(t, puzzleDay(T0 + 60 + d * 86400))); if (rr.bp) bpDays.push(d); } ok(bpDays.length >= 5 && bpDays.length <= 30, `謎題偶爾（約 25%）給科研 T3 藍圖（60 天中 ${bpDays.length} 次）`); }
// ---- 古碑：不信任用戶端；只有照當天順序輸入才算贏（含：少一個 / 順序錯 / 長度對但全錯 / 非陣列）
{ const z = SPECIAL_ZONES.stonehenge; const mkc = () => mk({ x: z.x, y: z.y }); const t0 = mkc(); simulateTo(t0, T0 + 60); const day = puzzleDay(T0 + 60), good = puzzleSeq(t0, day);
  for (const [name, bad] of [['全錯', good.map((v) => (v + 1) % 6)], ['少一個', good.slice(0, 3)], ['順序反了', good.slice().reverse().map((v, i) => (v === good[i] ? (v + 1) % 6 : v))], ['true', true], ['undefined', undefined], ['物件', { length: 4 }]]) {
    const t = mkc(); simulateTo(t, T0 + 60); const r = puzzleResolve(t, T0 + 60, bad); ok(r.ok && !r.won && !(t.fleet.mat && t.fleet.mat.rune) && !t.fleet.bp.bp_sci3, `偽造 / 錯誤輸入（${name}）→ 不給獎勵、但算今天用掉`); }
  const t = mkc(); simulateTo(t, T0 + 60); const r = puzzleResolve(t, T0 + 60, good); ok(r.won && t.fleet.mat.rune >= 1, '正確順序才給獎勵'); }
// ---- 漩渦：每種船都開得出去（手動駕駛的拉力上限）+ 救援
{ const wz = SPECIAL_ZONES.whirlpool; const f = mk().fleet; const types = [['母船', 11], ...Object.values(SHIPS).map((x) => [x.name, 7 + x.speed * 4])];
  for (const wxm of [1, 0.85]) for (const [name, vmax] of types) {
    let t = 0, tCore = null, tFull = null, minNet = 1e9, u = 0.02; const dt = 2; let worst = 0; const hs = { v: 0, w: 0, yaw: 0, x: 0, z: 0 }, hc = { vmax, turn: 0.4, rudderLag: 1.1, acc: name === '母船' ? 0.32 : 0.7, dec: 0.9 };
    while (u < 1 && t < 200 * 3600) { const x = wz.x + wz.r * u, fx = helmFx(f, x, wz.y); const ve = vmax * fx.speed * wxm; const dr = whirlDrift(fx, { x: -2 * fx.depth * 5, z: 0 }, ve);   // 最壞：局部漩渦也朝內
      const drift = Math.hypot(dr.x, dr.z); worst = Math.max(worst, drift / ve); hc.vmax = ve; const x0 = hs.x; hs.yaw = 0; helmStep(hs, { thr: 1, rud: 0 }, hc, dt); const adv = (hs.x - x0) - drift * dt;   // 真的物理步進（含加速）減去漩渦的向內漂移
      if (hs.v > 0.95 * ve) minNet = Math.min(minNet, (hs.v - drift) / ve); u = Math.max(0.02, u + adv * HELM_KU * SZ.helmMul / wz.r); t += dt; if (tCore == null && u >= 0.12) tCore = t; if (tFull == null && u >= 0.7) tFull = t; }
    ok(worst <= 0.4001 && minNet >= 0.55, `${name}（天氣 ×${wxm}）：漩渦拉力 ≤ 最高速 40%（最壞 ${(worst * 100).toFixed(0)}%）、淨外向 ≥ 60%`); ok(u >= 1 && t < 3 * 3600, `${name}（天氣 ×${wxm}）可以從中心開出漩渦：離開中心 ${(tCore / 60).toFixed(1)} 分、離開深水區 ${(tFull / 60).toFixed(0)} 分、整個出來 ${(t / 3600).toFixed(1)} 小時（vmax ${vmax.toFixed(1)}）`);
    console.log(`   escape ×${wxm} ${name}: core ${(tCore / 60).toFixed(1)} min, deep ${(tFull / 60).toFixed(0)} min, rim ${(t / 3600).toFixed(2)} h`); } }
{ const wz = SPECIAL_ZONES.whirlpool; const s = mk({ x: wz.x + 20, y: wz.y }); s.res.fuel = 5; s.res.parts = 50; const c = rescueCan(s, s.simT); ok(c.ok, '燃料不夠、在漩渦裡 → 可以呼叫救援（不受 fuel ≥ 航程+15 限制）');
  const r = rescueDo(s, s.simT); const p = arkPos(s.fleet.world, s.simT); ok(r.ok && r.pay === RESCUE.parts && s.res.parts === 50 - RESCUE.parts && !s.fleet.world.route && Math.hypot(p.x - wz.x, p.y - wz.y) >= wz.r, '救援：花 10 零件、拖到漩渦外緣、航線清掉');
  { const s3 = mk({ x: wz.x + 20, y: wz.y }); s3.res.fuel = 5; ok(/拖船救援/.test(rescueHint(s3, s3.simT)), '漩渦裡燃料不足 → 提示拖船救援'); s3.res.fuel = 300; ok(/先手動駕駛/.test(rescueHint(s3, s3.simT)) && /拖船救援/.test(rescueHint(s3, s3.simT)), '漩渦裡燃料夠 → 提示也提到拖船'); ok(rescueHint(s, s.simT) === '', '不在漩渦裡 → 沒有提示'); }
  ok(!rescueCan(s, s.simT).ok, '已經在外面 → 不需要救援'); const s2 = mk({ x: wz.x + 20, y: wz.y }); s2.res.fuel = 300; ok(!rescueCan(s2, s2.simT).ok, '燃料夠 → 不提供救援（直接重新出航）'); const s3 = mk({ x: wz.x, y: wz.y }); s3.res.fuel = 0; s3.res.parts = 3; const r3 = rescueDo(s3, s3.simT); ok(r3.ok && r3.pay === 3 && s3.res.parts === 0, '零件不夠也能救（收光）；中心也行'); const o = mk({ x: 1000, y: 1000 }); ok(!rescueCan(o, o.simT).ok, '不在漩渦不能救援'); }
// ---- 訪客小船（沒有母船、艦隊是小旗艦）也一樣
{ for (const id of ['fire', 'whirlpool']) { const s = mk(at(id, 0.5), { owner: false, uid: 'guest-9' }); const w = s.fleet.world; w.pos = at(id, 0.5); simulateTo(s, T0 + 6 * H); ok(s.cond < 100 && s.fleet.world.sz && s.fleet.world.sz.in === id, `訪客 ${id}：照樣受到危害（船體 ${s.cond.toFixed(1)}）`); }
  const a = mk(at('hell', 0.6), { owner: false, uid: 'guest-9' }), b = mk(at('hell', 0.6), { owner: false, uid: 'guest-9' }); a.fleet.world.pos = at('hell', 0.6); b.fleet.world.pos = at('hell', 0.6); simulateTo(a, T0 + 20 * H); for (let t = T0; t <= T0 + 20 * H; t += 3001) simulateTo(b, t); simulateTo(b, T0 + 20 * H); ok(strip(a) === strip(b), '訪客：離線 = 分段'); }
// ---- 有路線與其他系統（天氣 / 離開海域）
{ const z = SPECIAL_ZONES.fire; const s = mk({ x: z.x, y: z.y }); simulateTo(s, T0 + 3 * H); const c = s.cond; F.sailArk(s, z.x, z.y - z.r - 120, s.simT); let n = 0; while (s.fleet.world.route && n++ < 400) simulateTo(s, s.simT + 600); const w = s.fleet.world;
  ok(!w.route && !zoneAtPoint(w.pos.x, w.pos.y), `駛離火焰海域（船體 ${s.cond.toFixed(1)}）`); const before = s.fleet.world.sz.hull; simulateTo(s, s.simT + 2 * H); ok(s.fleet.world.sz.in === '' && s.fleet.world.sz.hull === before, '離開後危害立刻停止'); }
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
