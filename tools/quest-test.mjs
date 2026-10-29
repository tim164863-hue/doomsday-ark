// 新手教學任務測試：node tools/quest-test.mjs
import { newState, simulateTo, syncCrew, startTrip, build, rates } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import { resCap } from '../src/sim/promo.js';
import { START, USE, SHIP_FUEL_USE } from '../src/sim/defs.js';
import * as Q from '../src/sim/quests.js';
import { validateState, serialize } from '../src/save/cloud.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000; const crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const mk = (owner = false) => { const s = newState(777, T0, 480); syncCrew(s, crew); F.ensureFleet(s, owner); if (!owner) F.pickStarter(s, 'skiff', T0); return s; };
const clone = (s) => JSON.parse(JSON.stringify(s));

// --- 結構
ok(Q.STEPS.length === 8 && Q.LINES.length === 2, '兩條任務線、共 8 步');
ok(Q.STEPS.filter((x) => x.line === 'basic').map((x) => x.id).join() === 'move,talk,chart,sail', '基本操作：走動 / 聊天 / 航海圖 / 開船');
ok(Q.STEPS.filter((x) => x.line === 'biz').map((x) => x.id).join() === 'salvage,supply,upgrade,build', '經營：打撈 / 補給 / 升級小船 / 建造船');
ok(new Set(Q.STEP_IDS).size === 8 && Q.STEPS.every((x) => Q.EVENTS.filter((e) => e === x.ev).length === 1), '步驟 id / 事件唯一');
// --- 獎勵換算：2–3 天正常消耗（小船 n = 3–4）
console.log('  獎勵總量', JSON.stringify(Q.REWARD_TOTAL));
for (const n of [3, 4]) { const d = Q.rewardDays(n); console.log(`  n=${n}  食物 ${d.food.toFixed(2)} 天 / 水 ${d.water.toFixed(2)} 天 / 燃料 ${d.fuel.toFixed(2)} 天`); ok(['food', 'water', 'fuel'].every((k) => d[k] >= 2 && d[k] <= 3), `n=${n}：食物 / 水 / 燃料獎勵 = 2–3 天正常消耗`); }
{ const s = mk(); const r = rates(s, s.simT); const day = (x) => x * 1440; const d = Q.dayUse(Object.keys(s.crew).length + 1);
  ok(Math.abs(day(r.cons.food) - d.food) < 1e-6 && Math.abs(day(r.cons.water) - d.water) < 1e-6 && Math.abs(day(r.cons.fuel) - d.fuel) < 1e-6, '換算公式與 sim.rates() 的實際消耗一致'); }
ok(Q.STEPS.every((x) => Object.values(x.r).every((v) => v > 0 && Number.isInteger(v))), '每步獎勵都是正整數');
// --- 起始資源不變
{ const s = mk(); ok(['food', 'water', 'fuel', 'parts'].every((k) => s.res[k] === START.res[k]) && !s.quest, '起始資源沒變、沒有 quest 欄位（舊存檔等價）'); }
// --- 事件 → 發獎勵一次
{ const s = mk(); const b = { ...s.res }; let o = Q.noteQuest(s, 'move'); ok(o.length === 1 && o[0].step.id === 'move' && s.res.food === b.food + 50 && s.res.parts === b.parts + 10, 'move：發 50/60/60/10');
  const after = { ...s.res }; o = Q.noteQuest(s, 'move'); ok(o.length === 0 && JSON.stringify(s.res) === JSON.stringify(after), '同一個事件重複觸發：不再發獎勵（不可刷）');
  const s2 = clone(s); const cs = Q.sanitizeQuest(s2.quest); ok(JSON.stringify(cs) === JSON.stringify(s.quest), 'sanitize 是冪等的'); }
// --- 全部完成：總量、藍圖、上限
{ const s = mk(); s.res = { food: 0, water: 0, fuel: 0, parts: 0 }; const outAll = []; for (const e of Q.EVENTS) outAll.push(...Q.noteQuest(s, e));
  const q = s.quest; const tot = {}; for (const k of Q.RES4) tot[k] = s.res[k] + q.pool[k];
  ok(Q.RES4.every((k) => Math.abs(tot[k] - Q.REWARD_TOTAL[k]) < 0.5), '全部完成：倉庫 + 補給庫 = 獎勵總量'); ok(q.fin === 1 && q.bp === 'patrol' && s.fleet.bp.patrol === 1, '最後一步：稀有藍圖「武裝巡邏艇」'); ok(outAll.length === 9 && outAll[8].final, '8 步 + 終獎勵');
  ok(Q.RES4.every((k) => s.res[k] <= resCap(s, k)), '發獎勵不超過倉庫上限'); const snap = JSON.stringify(s.res); for (const e of Q.EVENTS) Q.noteQuest(s, e); ok(JSON.stringify(s.res) === snap && !Q.evalQuest(s).length, '全部完成後重複觸發：什麼都不會再發'); }
// --- 補給庫：倉庫滿了先存著，有空位再補
{ const s = mk(); s.res.fuel = resCap(s, 'fuel'); const f0 = s.res.fuel; Q.noteQuest(s, 'move'); ok(s.res.fuel === f0 && s.quest.pool.fuel === 60, '倉庫滿了：獎勵進補給庫'); s.res.fuel -= 25; Q.flushPool(s); ok(s.res.fuel === f0 && Math.abs(s.quest.pool.fuel - 35) < 1e-6, '有空位就補進來（且不超過上限）'); }
// --- 決定性 / 與離線模擬無關
{ const a = mk(), b = mk(); for (const e of ['move', 'talk', 'chart']) { Q.noteQuest(a, e); } for (const e of ['chart', 'move', 'talk']) { Q.noteQuest(b, e); } const srt = (q) => JSON.stringify(Q.sanitizeQuest(q), (k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort()) : v)); ok(JSON.stringify(a.res) === JSON.stringify(b.res) && srt(a.quest) === srt(b.quest), '事件順序不同、結果相同（決定性）');
  const x = mk(), y = mk(); Q.noteQuest(x, 'move'); Q.noteQuest(y, 'move'); simulateTo(x, T0 + 3600); for (let t = T0 + 60; t <= T0 + 3600; t += 60) simulateTo(y, t); ok(JSON.stringify(x.res) === JSON.stringify(y.res), '發獎勵後離線模擬：一次 / 逐 tick 結果相同'); }
// --- 存檔：舊存檔沒有欄位也能載入；有欄位會被清理；SAVE_VERSION 不變
{ const s = mk(); const old = validateState(JSON.parse(serialize(s))); ok(old && !('quest' in old) && old.v === 1, '舊存檔（沒有 quest）照常載入、v 仍是 1'); Q.noteQuest(s, 'talk'); const back = validateState(JSON.parse(serialize(s))); ok(back.quest && back.quest.done.talk === 1 && back.res.food === s.res.food, '有進度的存檔：寫入 / 讀回一致');
  const bad = JSON.parse(serialize(s)); bad.quest = { v: 1, ev: { hack: 1, move: 1 }, done: { move: 1, zzz: 1 }, pool: { food: 1e9, water: -5, fuel: 'x', parts: NaN }, bp: 'nope', fin: 1, c: 'yes' };
  const cl = validateState(bad).quest; ok(!cl.ev.hack && !cl.done.zzz && cl.pool.food <= Q.REWARD_TOTAL.food && cl.pool.water === 0 && cl.pool.fuel === 0 && cl.pool.parts === 0 && cl.bp === 0 && cl.fin === 0 && cl.c === 1, '被竄改的 quest 欄位會被清理（未知 id / 超大數字 / 假完成）');
  const bad2 = JSON.parse(serialize(s)); bad2.quest = 'garbage'; ok(!('quest' in validateState(bad2)), '格式不對的 quest 直接丟掉'); }
// --- 既有玩家（已經有很多進度）也能做任務：沒有自動全完成
{ const s = mk(); s.stats.trips = 9; s.stats.built = 5; const r = Q.evalQuest(s); ok(r.length === 0, '既有玩家：舊進度不會讓任務自動完成，仍要照步驟做一次'); }
// --- 做不到的步驟自動算完成（升到頂 / 艦隊滿）
{ const s = mk(true); s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; for (const sh of s.fleet.ships) sh.lv = 3; const had = s.fleet.ships.length; const r = Q.evalQuest(s); ok(had === 0 || r.some((x) => x.step && x.step.id === 'upgrade'), '所有船都已滿級：升級步驟自動完成'); }
// --- 真的做一遍（非擁有者）：蓋設施 / 升級 / 造船 → 對應事件
{ const s = mk(); const log = [];
  const b = build(s, 'greenhouse'); ok(b.ok, '蓋溫室成功（20 零件 + 20 水）'); log.push(...Q.noteQuest(s, 'supply'));
  const u = F.upgradeShip(s, s.fleet.ships[0].id); ok(u.ok, '小漁船升 Lv2（30 零件）'); log.push(...Q.noteQuest(s, 'upgrade'));
  ok(log.map((x) => x.step.id).join() === 'supply,upgrade', '做完動作 → 對應步驟完成'); }
// --- 零件預算：只靠獎勵 + 起始資源就能走完「蓋溫室 + 升級 + 造船」（不卡關）
for (const starter of ['skiff', 'speedboat', 'tug']) {
  const s = newState(5, T0, 480); syncCrew(s, crew); F.ensureFleet(s, false); F.pickStarter(s, starter, T0); let blocked = '';
  for (const id of Q.STEP_IDS) {
    const st = Q.stepOf(id);
    if (id === 'supply') { const r = build(s, 'greenhouse'); if (!r.ok) blocked = '蓋溫室：' + r.msg; }
    if (id === 'upgrade') { const r = F.upgradeShip(s, s.fleet.ships[0].id); if (!r.ok) blocked = '升級：' + r.msg; }
    if (id === 'build') { const r = F.buildShip(s, 'skiff'); if (!r.ok) blocked = '造船：' + r.msg; }
    Q.noteQuest(s, st.ev);
  }
  ok(!blocked, `起始選 ${starter}：依序做完 8 步不會因零件 / 資源卡住 ${blocked}`);
}
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
