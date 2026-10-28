// 旗艦晉升（階段③）測試：node tools/promo-test.mjs
import { newState, simulateTo, syncCrew } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import * as W from '../src/sim/world.js';
import * as PM from '../src/sim/promo.js';
import { SPECIAL_ZONES, SZ_ORDER, PROMO, PROMO_BP, zoneAtPoint } from '../src/sim/szdata.js';
import { unprepared, unprepK, helmFx, seaPre, seaTick, emptySz } from '../src/sim/seazones.js';
import { FLAG_ROWS } from '../src/sim/promo.js';
import { SHIPS, ZONES } from '../src/sim/fleetdefs.js';
import { FAC } from '../src/sim/defs.js';
import { QUALITY } from '../src/config.js';
import { helmFactor } from '../src/sim/weather.js';
import { RES, SAVE_VERSION } from '../src/sim/defs.js';
import { WORLD } from '../src/sim/fleetdefs.js';
import { validateState, serialize } from '../src/save/cloud.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000, H = 3600; const crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const mk = (pos = { x: 1000, y: 1000 }, o = {}) => { const s = newState(o.seed || 4242, T0, 480); syncCrew(s, crew); F.ensureFleet(s, o.owner !== false); F.ensureWorld(s, 'u-promo'); s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; s.fleet.world.pos = { ...pos }; if (!o.noBp) for (const k of Object.keys(PROMO_BP)) s.fleet.bp[k] = 1; return s; };
const canon = (v) => (v && typeof v === 'object' ? (Array.isArray(v) ? v.map(canon) : Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))) : v);
const strip = (s) => { const c = JSON.parse(JSON.stringify(s)); delete c.lastSeen; return JSON.stringify(canon(c)); };
const flag = (s, branch, tier) => { s.fleet.flag = { branch, tier, pj: null, up: null }; return s; };

// ---- 資料表
{ const R = PM.FLAG_ROWS; const ids = Object.keys(R); ok(ids.length === 10 && ['war', 'mer', 'sci'].every((b) => [1, 2, 3].every((t) => R[`${b}_${t}`])), '10 列：基礎船 + 3 分支 × 3 階');
  ok(['war', 'mer', 'sci'].every((b) => [1, 2, 3].every((t) => PROMO[`${b}_${t}`] && R[`${b}_${t}`].hours === [24, 36, 48][t - 1])), '9 份配方都在資料表，改裝 24 / 36 / 48 小時');
  ok(['war', 'mer', 'sci'].every((b) => [1, 2, 3].every((t) => R[`${b}_${t}`].len > R[t === 1 ? 'ark_t0' : `${b}_${t - 1}`].len && R[`${b}_${t}`].decks === 5 + t)), '每升一階：船更長、多一層甲板（6 / 7 / 8 層）');
  ok(R.war_3.fp > R.mer_3.fp && R.war_3.fp > R.sci_3.fp && R.war_3.hull > R.mer_3.hull && R.war_3.hull > R.sci_3.hull, '戰艦：火力 / 裝甲最高（給階段④）');
  ok(R.mer_3.cargo > R.war_3.cargo && R.mer_3.cargo > R.sci_3.cargo && R.mer_3.trade > R.sci_3.trade, '商船：載貨 / 貿易最高');
  ok(R.sci_3.scout > R.war_3.scout && R.sci_3.cold > R.war_3.cold && R.sci_3.haz > R.war_3.haz, '科研：偵察 / 抗寒 / 抗危害最高');
  const s0 = PM.flagStats(null); ok(s0.id === 'ark_t0' && s0.armorMul === 1 && s0.capMul === 1 && s0.scoutK === 1 && s0.hazMul === 1 && PM.tradeMul(null) === 1 && PM.arkSpeedOf(null) === WORLD.arkSpeed, '基礎船（沒有 flag）所有倍率 = 1，舊存檔行為不變'); }

// ---- 解法順序（不會卡死）：每個配方需要的材料 / 藍圖，都在「上一階」就進得去
{ const zoneFor = (mat) => SZ_ORDER.map((id) => SPECIAL_ZONES[id]).filter((z) => z.mat === mat); const zoneForBp = (bp) => SZ_ORDER.map((id) => SPECIAL_ZONES[id]).filter((z) => z.bp.includes(bp));
  const bad = []; for (const [id, P] of Object.entries(PROMO)) { const row = PM.FLAG_ROWS[id]; const prev = { branch: row.tier > 1 ? row.branch : null, tier: row.tier - 1 }; const f = { flag: prev };
    const can = (zs) => zs.some((z) => !z.need || !z.need.hard || PM.meetsNeed(f, z));
    for (const m of Object.keys(P.mat)) if (!can(zoneFor(m))) bad.push(`${id}:${m}`); if (!can(zoneForBp(P.bp))) bad.push(`${id}:${P.bp}`); }
  ok(bad.length === 0, `9 份配方的材料 / 藍圖都拿得到（不會「要進去才能拿的東西在進不去的海域」）${bad.join(',')}`); }

// ---- 海域進入條件：硬 / 強
{ const s = mk(); const f = s.fleet; const Z = SPECIAL_ZONES;
  ok(Z.hell.need.hard && Z.stonehenge.need.hard && !Z.fire.need.hard && !Z.fog.need && !Z.whirlpool.need, '硬條件：地獄 / 巨石陣；強條件：火焰（可進，危害 ×3）；迷霧 / 漩渦 無');
  const to = (id, k = 0) => ({ x: Z[id].x + Z[id].r * k, y: Z[id].y });
  const west = (id) => ({ x: Z[id].x - Z[id].r - 160, y: Z[id].y });
  const tryGo = (ff, id) => { const t = mk(west(id)); t.fleet.flag = ff; simulateTo(t, T0 + 60); const a = F.sailArk(t, Z[id].x + Z[id].r + 160, Z[id].y, t.simT); return a; };
  let r = tryGo(null, 'hell'); ok(!r.ok && r.gate === 'hell' && /需要/.test(r.msg), `T0 駛向地獄被擋：${r.msg}`);
  r = tryGo({ branch: 'war', tier: 1 }, 'hell'); ok(!r.ok, '戰艦 T1 還是被擋（要 T2）');
  r = tryGo({ branch: 'mer', tier: 2 }, 'hell'); ok(r.ok, '商船 T2 進得去地獄');
  r = tryGo(null, 'stonehenge'); ok(!r.ok && r.gate === 'stonehenge', 'T0 進不去巨石陣');
  r = tryGo({ branch: 'sci', tier: 1 }, 'stonehenge'); ok(r.ok, '科研 T1 進得去巨石陣');
  r = tryGo({ branch: 'war', tier: 1 }, 'stonehenge'); ok(!r.ok, '戰艦 T1 進不去巨石陣（要 T2）');
  r = tryGo({ branch: 'war', tier: 2 }, 'stonehenge'); ok(r.ok, '戰艦 T2 進得去巨石陣');
  r = tryGo(null, 'fire'); ok(r.ok, '火焰是強條件：T0 也能出航進去');
  r = tryGo(null, 'fog'); ok(r.ok, '迷霧沒有條件');
  // 已經在裡面（舊存檔 / 降階）→ 可以開出來，不被困死
  const t = mk(to('hell', 0.6)); t.fleet.world.pos = to('hell', 0.6); simulateTo(t, T0 + 60); const o = F.sailArk(t, Z.hell.x + Z.hell.r + 150, Z.hell.y, t.simT); ok(o.ok, '已經在地獄裡的 T0：可以開出來'); 
  // 手動駕駛
  ok(PM.pointGate(null, Z.hell.x, Z.hell.y, { x: Z.hell.x - 400, y: Z.hell.y }) && !PM.pointGate(null, Z.hell.x, Z.hell.y, { x: Z.hell.x, y: Z.hell.y }) && !PM.pointGate({ flag: { branch: 'sci', tier: 2 } }, Z.hell.x, Z.hell.y, { x: 0, y: 0 }), '手動駕駛的 pointGate：外面進不去、裡面放行、T2 通過');
  const u = unprepared(f, Z.fire); const fx = helmFx(f, Z.fire.x, Z.fire.y); ok(u && fx.un === 3, '火焰未達：危害 ×3'); }

// ---- 晉升流程
{ const s = mk(); const f = s.fleet; f.mat = { ember: 3, vortex: 5, fogpearl: 5 };
  let r = PM.promoStart(s, T0); ok(!r.ok, '沒選目標不能開工');
  r = PM.promoPlan(s, 'war_2'); ok(!r.ok, 'T0 不能跳級（只能 T1）');
  r = PM.promoPlan(s, 'war_1'); ok(r.ok && f.flag.pj.to === 'war_1', '選定戰艦 T1');
  r = PM.promoStart(s, T0); ok(!r.ok && /資源/.test(r.msg), '資源沒投滿不能開工');
  let q = PM.promoStatus(s, T0).options.find((o) => o.branch === 'war').req; ok(q.total === 6 && q.done === 2, `進度：${q.done}/${q.total}（藍圖 + 材料 已有）`);
  s.res.parts = 400; s.res.fuel = 400; s.res.food = 400; s.res.water = 400;
  r = PM.promoDeposit(s); ok(r.ok && f.flag.pj.parts === 400 && s.res.parts === 0, `分批投入：${r.msg}`);
  ok(f.flag.pj.parts === 400 && f.flag.pj.fuel === 300 && f.flag.pj.food === 100 && f.flag.pj.water === 80 && s.res.fuel === 100, '燃料 / 食物 / 飲水投到需求為止，零件投到倉庫上限');
  r = PM.promoStart(s, T0); ok(!r.ok, '零件 400/900，還不能開工');
  s.res.parts = 400; PM.promoDeposit(s); s.res.parts = 100; PM.promoDeposit(s); ok(f.flag.pj.parts === 900, '第二、三批補齊零件 900');
  // 缺材料 / 缺藍圖
  const m3 = f.mat.ember; f.mat.ember = 2; r = PM.promoStart(s, T0); ok(!r.ok && /材料/.test(r.msg), '材料不夠不能開工'); f.mat.ember = m3;
  delete f.bp.bp_war1; r = PM.promoStart(s, T0); ok(!r.ok && /藍圖/.test(r.msg), '沒有藍圖不能開工'); f.bp.bp_war1 = 1;
  // 航行中不能開工
  s.res.fuel = 400; F.sailArk(s, 1100, 1000, s.simT); r = PM.promoStart(s, T0); ok(!r.ok && /航行中/.test(r.msg), '航行中不能開工'); F.stopArk(s, s.simT);
  r = PM.promoStart(s, T0); ok(r.ok && f.flag.up && f.flag.up.end - f.flag.up.start === 24 * H && f.mat.ember === undefined, `開工：${r.msg}`);
  ok(f.flag.up.end === Math.max(s.simT, T0) + 24 * H && f.flag.pj === null && (f.mat.vortex === 5), '完成時間在開工時寫死；只扣這份配方的材料（焰心鋼 3 用掉）');
  const end = f.flag.up.end;
  s.res.fuel = 400; r = F.sailArk(s, 1100, 1000, s.simT); ok(!r.ok && /改裝/.test(r.msg), '改裝期間不能出航');
  r = PM.promoReset(s); ok(!r.ok, '改裝中不能重置'); r = PM.promoPlan(s, 'war_1'); ok(!r.ok, '改裝中不能改選');
  // 離線補算：一次跑完 vs 分段跑，結果相同
  const A = mk(), B = mk(); for (const x of [A, B]) { x.fleet.mat = { ember: 3 }; PM.promoPlan(x, 'war_1'); x.res = { food: 500, water: 500, fuel: 400, parts: 400 }; PM.promoDeposit(x); x.fleet.flag.pj.parts = 900; PM.promoStart(x, T0); }
  simulateTo(A, T0 + 30 * H); for (let h = 1; h <= 30; h++) simulateTo(B, T0 + h * H);
  ok(strip(A) === strip(B), '離線一次補算 = 逐小時推進（改裝結果決定性）');
  ok(A.fleet.flag.branch === 'war' && A.fleet.flag.tier === 1 && A.fleet.flag.up === null && A.log.some((e) => e.type === 'promo'), `24 小時後完成：戰艦 T1，有「晉升完成」事件`);
  const C = mk(); C.fleet.mat = { ember: 3 }; PM.promoPlan(C, 'war_1'); C.fleet.flag.pj = { to: 'war_1', parts: 900, fuel: 300, food: 100, water: 80 }; PM.promoStart(C, T0); simulateTo(C, T0 + 23 * H); ok(C.fleet.flag.up && C.fleet.flag.tier === 0, '23 小時還沒完成'); }

// ---- 階級串接、分支規則、重置
{ const s = mk(); flag(s, 'war', 1); ok(PM.nextRowId(s.fleet, 'war') === 'war_2' && PM.nextRowId(s.fleet, 'mer') === null, '只能升同分支的下一階');
  let r = PM.promoPlan(s, 'mer_1'); ok(!r.ok, '換分支：要先改裝回基礎船'); const op = PM.promoStatus(s, T0).options; ok(op[1].locked && op[1].why.includes('改裝回基礎船') && !op[0].locked, 'UI 狀態：其他分支鎖住並說明原因');
  flag(s, 'war', 3); ok(PM.nextRowId(s.fleet, 'war') === null && PM.promoStatus(s, T0).options[0].locked, '滿階後沒有下一階');
  s.fleet.flag = { branch: 'sci', tier: 1, pj: { to: 'sci_2', parts: 300, fuel: 50, food: 0, water: 0 }, up: null }; s.res.parts = 0; r = PM.promoCancelPlan(s); ok(r.ok && s.res.parts === 300 && s.fleet.flag.tier === 1 && !s.fleet.flag.pj, '取消籌備：投入的資源全退');
  s.fleet.flag.pj = { to: 'sci_2', parts: 200, fuel: 0, food: 0, water: 0 }; s.res.parts = 0; r = PM.promoReset(s); ok(r.ok && s.res.parts === 200 && PM.flagRow(s.fleet).id === 'ark_t0' && s.fleet.flag.tier === 0 && s.res.fuel === 400 && s.fleet.flag.hold.fuel === 50 && Object.keys(s.fleet.flag.hold).length === 1, '改裝回基礎船：階級歸零、籌備中的資源退回；T1 多出來的燃料 50 進待退回（基礎船上限 400）'); }

// ---- 效果
{ const sci = flag(mk(), 'sci', 3), war = flag(mk(), 'war', 3), mer = flag(mk(), 'mer', 3), base = mk();
  ok(PM.capOf(mer.fleet, 'parts') > 2.5 * RES.parts.cap && PM.capOf(war.fleet, 'parts') < PM.capOf(mer.fleet, 'parts') && PM.capOf(null, 'parts') === RES.parts.cap, `商船 T3 倉庫上限：零件 ${PM.capOf(mer.fleet, 'parts')}（基礎 ${RES.parts.cap}）`);
  const mf = mk(); flag(mf, 'mer', 3); mf.res.parts = 395; simulateTo(mf, T0 + 6 * H); ok(mf.res.parts > RES.parts.cap, '資源可以超過 400（受 flagship 載貨上限）');
  // 速度：商船 T3 航程更短
  const a = mk({ x: 300, y: 300 }), b = flag(mk({ x: 300, y: 300 }), 'sci', 3); const ra = F.sailArk(a, 700, 300, a.simT), rb = F.sailArk(b, 700, 300, b.simT); ok(ra.ok && rb.ok && rb.cost.minutes < ra.cost.minutes * 0.85, `科研 T3 航程 ${rb.cost.minutes} 分 < 基礎 ${ra.cost.minutes} 分（航速 ×1.25）`);
  const mw = flag(mk({ x: 300, y: 300 }), 'war', 3), rw = F.sailArk(mw, 700, 300, mw.simT); ok(rw.cost.minutes > ra.cost.minutes, `戰艦 T3 較慢：${rw.cost.minutes} 分`);
  // 偵察：揭霧半徑
  const c0 = mk({ x: 300, y: 300 }), c1 = flag(mk({ x: 300, y: 300 }), 'sci', 3); for (const x of [c0, c1]) { F.sailArk(x, 700, 300, x.simT); simulateTo(x, T0 + 600 * 60); }
  ok(c1.fleet.world.explored > c0.fleet.world.explored * 1.4, `科研 T3 揭開的格子 ${c1.fleet.world.explored} vs 基礎 ${c0.fleet.world.explored}`);
  ok(PM.revealArkOf(sci.fleet) > WORLD.revealArk * 2 && PM.revealArkOf(null) === WORLD.revealArk, '揭霧半徑 ×2.4（科研 T3）');
  // 特殊海域傷害：同一個地方待 3 小時
  const z = SPECIAL_ZONES.fire; const inFire = (s) => { s.fleet.world.pos = { x: z.x + z.r * 0.4, y: z.y }; simulateTo(s, T0 + 3 * H); return s; };
  const fb = inFire(mk()), fw = inFire(flag(mk(), 'war', 3)), fs = inFire(flag(mk(), 'sci', 3));
  ok(fb.cond < 100 - 8 && fw.cond > fb.cond + 6 && fs.cond > fb.cond + 4, `火焰 3 小時船體：基礎 ${fb.cond.toFixed(1)} / 戰艦 T3 ${fw.cond.toFixed(1)} / 科研 T3 ${fs.cond.toFixed(1)}（受傷 ${(100 - fw.cond).toFixed(1)} vs ${(100 - fb.cond).toFixed(1)}）`);
  // 暴風：裝甲
  ok(PM.flagStats(war.fleet).armorMul < 0.6 && PM.flagStats(base.fleet).armorMul === 1, `裝甲：戰艦 T3 受到的船體傷害 ×${PM.flagStats(war.fleet).armorMul.toFixed(2)}`);
  const cold = { cold: 1, kind: 'snow', i: 1, snowy: true, show: 'snow' }; const h0 = helmFactor(cold, null), h1 = helmFactor(cold, sci.fleet); ok(h1.fuel < h0.fuel && h1.speed >= h0.speed, `手動駕駛：科研 T3 極地耗油 ×${h1.fuel.toFixed(2)}（基礎 ×${h0.fuel.toFixed(2)}）`);
  ok(PM.tradeMul(mer.fleet) === 1.5 && PM.flagCombat(war.fleet).fp === 46, '商船貿易 ×1.5；戰艦 fp 46（階段④介面 flagCombat）'); }

// ---- 存檔
{ const s = mk(); s.fleet.mat = { ember: 3 }; PM.promoPlan(s, 'war_1'); PM.promoDeposit(s); const j = JSON.parse(serialize(s)); const v = validateState(j); ok(v && v.fleet && v.fleet.flag && v.fleet.flag.pj && v.fleet.flag.pj.to === 'war_1', '存檔來回：籌備中的晉升專案保留');
  flag(s, 'sci', 2); s.fleet.flag.up = { to: 'sci_3', start: T0, end: T0 + 48 * H }; const v2 = validateState(JSON.parse(serialize(s))); ok(v2.fleet.flag.tier === 2 && v2.fleet.flag.up.end === T0 + 48 * H, '存檔來回：進行中的改裝保留');
  const bad = F.sanitizeFleet({ ...s.fleet, flag: { branch: 'hack', tier: 99, pj: { to: 'nope' }, up: { to: 'war_1', start: 'x', end: 5 } } }); ok(!bad.flag, '壞掉的 flag 被清掉');
  const bad2 = F.sanitizeFleet({ ...s.fleet, flag: { branch: 'war', tier: 99, pj: { to: 'war_2', parts: 99999, fuel: -4 } } }); ok(bad2.flag && bad2.flag.tier === 3 && bad2.flag.pj.parts === 1600 && bad2.flag.pj.fuel === 0, '超出範圍的值被夾住');
  const old = JSON.parse(JSON.stringify(s)); delete old.fleet.flag; const v3 = validateState(old); ok(v3 && !v3.fleet.flag && PM.flagRow(v3.fleet).id === 'ark_t0', '舊存檔沒有 flag → 基礎船'); ok(SAVE_VERSION === 1, 'SAVE_VERSION 仍是 1'); }

// ---- 審查修正 ①：原型鏈 key（'__proto__' / 'constructor' / 'toString'）不能讓遊戲崩潰
{ const BAD = ['__proto__', 'constructor', 'toString', 'hasOwnProperty'];
  ok(BAD.every((k) => FLAG_ROWS[k] === undefined && PROMO[k] === undefined && SPECIAL_ZONES[k] === undefined && SHIPS[k] === undefined && ZONES[k] === undefined && FAC[k] === undefined && RES[k] === undefined && QUALITY[k] === undefined && PM.BRANCHES[k] === undefined), '資料表是無原型物件：__proto__ / constructor / toString 都查不到');
  let thrown = null; try {
    for (const k of BAD) {
      const s = mk(); s.fleet.flag = { branch: k, tier: 2, pj: { to: k, parts: 5 }, up: { to: k, start: T0, end: T0 + 5 } };
      const f = F.sanitizeFleet(s.fleet); if (f.flag) throw new Error('flag 沒被清掉：' + k);
      PM.flagStats(s.fleet); PM.promoStatus(s, T0); PM.promoTick(s, T0 + 10 * H, null);   // 沒清洗的壞資料也不能丟例外
      if (PM.promoPlan(s, k).ok) throw new Error('promoPlan 接受了 ' + k);
      const s2 = mk(); s2.fleet.ships = [{ id: 1, type: k, name: 'x', lv: 1, hp: 100, state: 'dock', zone: k }]; const f2 = F.sanitizeFleet(s2.fleet); if (f2.ships.length) throw new Error('ships.type 沒被清掉：' + k);
      const s3 = mk(); s3.fleet.flag = { branch: 'war', tier: 1, pj: { to: k }, up: null }; if (F.sanitizeFleet(s3.fleet).flag.pj) throw new Error('pj.to 沒被清掉');
      const s4 = mk(); s4.fleet.flag = { branch: 'war', tier: 1, pj: null, up: { to: k, start: 0, end: 1 } }; if (F.sanitizeFleet(s4.fleet).flag.up) throw new Error('up.to 沒被清掉');
      const v = validateState(JSON.parse(serialize(Object.assign(mk(), { fleet: { ...s.fleet } })))); if (!v) throw new Error('validateState 回 null');
    } } catch (e) { thrown = e; }
  ok(!thrown, '壞的 flag.branch / pj.to / up.to / ships.type 都被清掉、不丟例外' + (thrown ? '：' + thrown.message : ''));
  // ?tier= / localStorage 'ark.tier'
  const loadCfg = async (tag, ls, search) => { const rm = []; globalThis.location = { search }; globalThis.localStorage = { getItem: () => ls, removeItem: (k) => rm.push(k), setItem() {} }; const m = await import('../src/ship/config.js?' + tag); delete globalThis.location; delete globalThis.localStorage; return { m, rm }; };
  { const r = await loadCfg('a1', 'constructor', ''); ok(r.m.CUR_TIER === 'ark_t0' && r.rm.includes('ark.tier') && r.m.NDECK === 5, "localStorage ark.tier='constructor' → 基礎船，並清掉壞值（自我修復）"); }
  { const r = await loadCfg('a2', '__proto__', '?tier=__proto__'); ok(r.m.CUR_TIER === 'ark_t0' && r.m.TIER_PREVIEW === false, "?tier=__proto__ + 壞 localStorage → 基礎船"); }
  { const r = await loadCfg('a3', 'war_2', ''); ok(r.m.CUR_TIER === 'war_2' && r.m.NDECK === 7 && r.rm.length === 0, '合法的 localStorage ark.tier=war_2 照常讀'); }
  { const r = await loadCfg('a4', null, '?tier=war_3'); ok(r.m.CUR_TIER === 'ark_t0', '正式版（非 vite dev）忽略 ?tier= 預覽'); }
}

// ---- 審查修正 ②：取消 / 重選 / 改裝回基礎船 的退款不會被倉庫上限吃掉（進「待退回」暫存區再補回）
{ const total = (s, k) => s.res[k] + ((s.fleet.flag && s.fleet.flag.hold && s.fleet.flag.hold[k]) || 0);
  const s = mk(); PM.promoPlan(s, 'war_1'); s.fleet.flag.pj.parts = 900; s.res.parts = 400;   // 投入 900、倉庫已滿 400
  const r = PM.promoCancelPlan(s); ok(r.ok && s.res.parts === 400 && s.fleet.flag.hold.parts === 900 && /待退回/.test(r.msg), `取消：倉庫放不下的 900 零件進待退回（hold=${s.fleet.flag && s.fleet.flag.hold && s.fleet.flag.hold.parts}），訊息有說明`);
  ok(PM.holdOf(s.fleet).some((h) => h.k === 'parts' && h.v === 900) && PM.flagRow(s.fleet).id === 'ark_t0', '只有 hold 的 flag 仍然是基礎船，UI 看得到待退回');
  const v = validateState(JSON.parse(serialize(s))); ok(v.fleet.flag && v.fleet.flag.hold && v.fleet.flag.hold.parts === 900, '待退回量存檔往返不丟');
  s.res.parts = 100; PM.holdDrain(s); ok(s.res.parts === 400 && s.fleet.flag.hold.parts === 600, '倉庫有空位就補回（空出 300 → 補 300）');
  const ss = JSON.stringify([s.res.parts]); for (let i = 0; i < 3; i++) { s.res.parts = 0; PM.holdDrain(s); } ok(!s.fleet.flag || !s.fleet.flag.hold, '慢慢補完後 hold 清空，沒有 tier/pj/up 的 flag 一併移除');
  // 經過模擬 tick 也會自動補回，且離線一次算完 = 分段算
  const a = mk(), b = mk(); for (const x of [a, b]) { PM.promoPlan(x, 'war_1'); x.fleet.flag.pj.parts = 900; x.res.parts = 400; PM.promoCancelPlan(x); x.res.parts = 0; }
  simulateTo(a, T0 + 10 * H); for (let h = 1; h <= 10; h++) simulateTo(b, T0 + h * H); ok(strip(a) === strip(b) && a.res.parts > 0 && (a.fleet.flag && a.fleet.flag.hold ? a.fleet.flag.hold.parts : 0) < 900, `tick 自動補回、離線一次算 = 逐小時算（零件 ${Math.round(a.res.parts)}）`);
  // 重選另一個目標（同一分支的其他路線）：舊專案的退款同樣不損失
  const p = mk(); PM.promoPlan(p, 'war_1'); p.fleet.flag.pj.water = 80; p.fleet.flag.pj.parts = 900; p.res.parts = 400; p.res.water = 500; PM.promoPlan(p, 'mer_1'); ok(total(p, 'parts') === 400 + 900 && total(p, 'water') === 580, `改選路線：零件 / 水都完整保留（${total(p, 'parts')} / ${total(p, 'water')}）`);
  // 改裝回基礎船：倉庫上限變小，超出的不消失
  const m = mk(); flag(m, 'mer', 3); m.res.water = 800; m.res.parts = 1000; const cap0 = PM.capOf(m.fleet, 'water'); const R = PM.promoReset(m);
  ok(R.ok && m.res.water === 500 && m.fleet.flag.hold.water === 300 && m.res.parts === 400 && m.fleet.flag.hold.parts === 600 && PM.flagRow(m.fleet).id === 'ark_t0' && cap0 > 800, `改裝回基礎船：水 800 → 倉庫 500 + 待退回 300（原上限 ${cap0}），零件 1000 → 400 + 600`);
  const m2 = mk(); flag(m2, 'war', 1); PM.promoPlan(m2, 'war_2'); m2.fleet.flag.pj.parts = 700; m2.res.parts = 400; PM.promoReset(m2); ok(total(m2, 'parts') === 1100, '改裝回基礎船時籌備中的投入也進待退回，總量不變');
  const bad = F.sanitizeFleet({ ...mk().fleet, flag: { hold: { parts: 5e9, fuel: -3, food: 'x', water: 12.9 } } }); ok(bad.flag && bad.flag.hold.parts === 20000 && !('fuel' in bad.flag.hold) && bad.flag.hold.water === 12, 'hold 清洗：上限 20000、負數 / 非數字被丟掉'); }

// ---- 審查修正 ⑦：promoStart 重新檢查 nextRowId
{ const s = mk(); PM.promoPlan(s, 'war_1'); s.fleet.flag.pj = { to: 'war_2', parts: 1600, fuel: 500, food: 200, water: 150 }; s.fleet.mat = { ember: 9, hellstone: 9, rune: 9, vortex: 9, fogpearl: 9 }; s.fleet.bp = { bp_war2: 1, bp_war1: 1 };
  const r = PM.promoStart(s, T0); ok(!r.ok && !s.fleet.flag.pj && !s.fleet.flag.up && s.fleet.mat.ember === 9, 'promoStart：目標不是下一階（過期專案）→ 拒絕、不扣材料'); }

// ---- 審查修正 ⑤⑥：海圖 ETA 用旗艦航速、警示用實際倍率
{ const sci = mk(); flag(sci, 'sci', 3); const base = mk(); const a = W.routeCost(1000, 1000, 1900, 1000, sci.fleet), b = W.routeCost(1000, 1000, 1900, 1000, base.fleet); ok(a.minutes < b.minutes && a.minutes === Math.max(1, Math.round(900 / PM.arkSpeedOf(sci.fleet))), `ETA 依旗艦航速（星圖號 ${a.minutes} 分 < 基礎船 ${b.minutes} 分）`);
  const Z = SPECIAL_ZONES; ok(unprepK(base.fleet, Z.fire) === 3 && unprepK(base.fleet, Z.hell) !== 3 && unprepK(sci.fleet, Z.fire) === 1, `unprepK：火焰 ×3、其他 ×${unprepK(base.fleet, Z.hell)}；達標 ×1`);
  ok(!('mer' in (Z.fire.need.tiers || {})), '火焰的 need.tiers 沒有不會用到的 mer'); }

// ---- 審查修正 ⑧：特殊海域傷害（火焰 ×3）不會把船體打到 20% 以下；自然老化與區域傷害分開
{ const fire = SPECIAL_ZONES.fire; const P = { x: fire.x, y: fire.y };
  const s = mk(P); s.cond = 21; let t = T0; for (let i = 0; i < 400; i++) { const pre = seaPre(s, t); seaTick(s, t, t + 60, null, pre); t += 60; } ok(s.cond >= 20 && s.fleet.world.sz.hits >= 0 && s.fleet.world.sz.hull > 0 && s.fleet.world.sz.hull <= 1.001, `區域傷害：船體 21% 在火焰中心打了 400 tick，停在 ${s.cond.toFixed(2)}%（地板 20%）`);
  const s2 = mk(P); s2.cond = 12; t = T0; for (let i = 0; i < 100; i++) { const pre = seaPre(s2, t); seaTick(s2, t, t + 60, null, pre); t += 60; } ok(s2.cond === 12, '船體已低於地板時，區域傷害不再往下打（12% 維持 12%）');
  const s3 = mk(P); s3.res.food = 4000; let minCond = 100; for (let h = 1; h <= 48; h++) { s3.res.food = 450; s3.res.water = 450; s3.res.fuel = 450; simulateTo(s3, T0 + h * H); minCond = Math.min(minCond, s3.cond); }
  const zoneDmg = s3.fleet.world.sz.hull; ok(zoneDmg <= 80.0001, `停在火焰 48 小時：累計區域傷害 ${zoneDmg.toFixed(1)}% ≤ 80%（100% → 地板 20%）`); }

console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
