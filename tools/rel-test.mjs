// 船員關係測試：node tools/rel-test.mjs
import { newState, simulateTo, syncCrew, rates, staffOf, staffBonus, startTrip } from '../src/sim/sim.js';
import * as R from '../src/sim/rel.js';
import { validateState, serialize } from '../src/save/cloud.js';
import { runSelfTest } from '../src/sim/selftest.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000; const KEYS = ['阿拓', '小米', '老K', '艾莉', '波波', '大衛'];
const crew = KEYS.map((k, i) => ({ key: k, cat: ['work', 'rest', 'rest', 'work', 'rest', 'off'][i] }));
const mk = (seed = 12345) => { const s = newState(seed, T0, 480); syncCrew(s, crew); return s; };
const clone = (s) => JSON.parse(JSON.stringify(s));
const strip = (s) => { const c = clone(s); delete c.lastSeen; return JSON.stringify(c); };
const H = 3600;
// 離線補算最多 48 小時，所以長時間用「每 24 小時一段」推進（等同玩家多次回來）。
const run = (s, hours) => { const reps = []; for (let h = 24; h < hours + 24; h += 24) reps.push(simulateTo(s, T0 + Math.min(h, hours) * H)); return { events: [].concat(...reps.map((r) => r.events)) }; };

// 1. 決定性：一次補算 vs 分段推進 vs 存檔讀檔後繼續
{ const a = mk(), b = mk(); simulateTo(a, T0 + 40 * H); for (let t = T0; t <= T0 + 40 * H; t += 913) simulateTo(b, t); simulateTo(b, T0 + 40 * H);
  ok(strip(a) === strip(b), '關係：離線一次補算 = 線上分段推進（40 小時）'); ok(Object.keys(a.rel.aff).length > 0, '相處後出現交情數值');
  const c = mk(); simulateTo(c, T0 + 30 * H); const c2 = validateState(JSON.parse(serialize(c))); simulateTo(c2, T0 + 40 * H); ok(strip(c2) === strip(a), '存檔 → 讀檔 → 繼續，結果仍相同'); }
// 2. 不同種子 → 不同關係；同種子 → 同關係
{ const a = mk(1), b = mk(1), c = mk(2); simulateTo(a, T0 + 48 * H); simulateTo(b, T0 + 48 * H); simulateTo(c, T0 + 48 * H); ok(JSON.stringify(a.rel) === JSON.stringify(b.rel) && JSON.stringify(a.rel) !== JSON.stringify(c.rel), '關係由種子決定'); }
// 3. 一週後會分出朋友與對頭（跨多個種子統計）
{ let friends = 0, rivals = 0, seeds = 0; for (let sd = 1; sd <= 12; sd++) { const s = mk(sd * 7919); run(s, 7 * 24); seeds++; for (const [a, b] of [].concat(...KEYS.map((x, i) => KEYS.slice(i + 1).map((y) => [x, y])))) { const k = R.relKind(s, a, b); if (k === 'friend') friends++; if (k === 'rival') rivals++; } }
  ok(friends >= seeds && rivals >= seeds * 0.5, `一週後有朋友與對頭（${seeds} 個種子：朋友 ${friends} 對 / 對頭 ${rivals} 對）`); }
// 4. 吵架 → 和好 一個完整週期（出現事件、之後交情回升）
{ let fights = 0, makeups = 0, ordered = true; for (let sd = 1; sd <= 12; sd++) { const s = mk(sd * 104729); const rep = run(s, 10 * 24); const open = new Map(); for (const e of rep.events) { if (e.type === 'fight') { fights++; open.set(R.pairKey(e.who, e.with), e.t); } if (e.type === 'makeup') { makeups++; if (!open.has(R.pairKey(e.who, e.with))) ordered = false; open.delete(R.pairKey(e.who, e.with)); } } }
  ok(fights > 0 && makeups > 0 && ordered, `會吵架也會和好（吵 ${fights} 次 / 和好 ${makeups} 次，和好必在吵架之後）`); }
// 5. 吵架期間效率下降、和好後恢復；好朋友多 → 加成為正
{ const s = mk(); const k = staffOf(mk()).purifier; const others = KEYS.filter((x) => x !== k); for (const o of others) R.bump(s, k, o, 60); const hi = R.teamBonus(s, k, T0); R.ensureRel(s).feud[R.pairKey(k, others[0])] = T0 + 600; const mid = R.teamBonus(s, k, T0); const after = R.teamBonus(s, k, T0 + 1200);
  ok(hi > 0 && hi <= 0.10 && mid < hi && after === hi, `交情好 → 效率加成（+${Math.round(hi * 100)}%），吵架期間下降，期滿恢復`);
  const bad = mk(); for (const o of others) R.bump(bad, k, o, -80); ok(R.teamBonus(bad, k, T0) < 0 && R.teamBonus(bad, k, T0) >= -0.12, '交情差 → 效率扣分（有下限）');
  const fac = 'purifier'; const s0 = mk(); ok(staffBonus(s, fac, T0) > staffBonus(s0, fac, T0) && staffBonus(bad, fac, T0) < staffBonus(s0, fac, T0), '設施駐守加成會反映關係'); }
// 6. 沒有 rel 的舊存檔：加成為 0、可載入、可補算
{ const s = mk(); delete s.rel; ok(R.teamBonus(s, KEYS[0], T0) === 0, '舊存檔（無 rel）：加成 0'); const v = validateState(JSON.parse(serialize(s))); ok(v && v.rel === undefined, '舊存檔可載入且不強制建立 rel'); simulateTo(v, T0 + 3 * H); ok(v.rel && typeof v.rel.aff === 'object', '補算後自動建立 rel'); }
// 7. 壞掉的 rel 會被修正 / 丟掉
{ const s = mk(); simulateTo(s, T0 + 6 * H); const j = JSON.parse(serialize(s)); j.rel = { aff: { 'a|b': 999, bad: 5, 'c|d': 'x' }, feud: 7, best: { x: 'y', z: 12.7 }, party: 'no' }; const v = validateState(j); ok(v.rel.aff['a|b'] === 100 && !('bad' in v.rel.aff) && !('c|d' in v.rel.aff) && v.rel.feud && v.rel.best.z === 13 && v.rel.party === -1, '壞資料被清洗（上限、型別、缺欄位）');
  const j2 = JSON.parse(serialize(s)); j2.rel = 'oops'; ok(validateState(j2).rel === undefined, 'rel 不是物件 → 丟掉'); }
// 8. 離開的船員不會留下關係殘影
{ const s = mk(); simulateTo(s, T0 + 24 * H); ok(Object.keys(s.rel.aff).some((k) => k.includes('大衛')), '大衛有關係紀錄'); syncCrew(s, crew.filter((c) => c.key !== '大衛'), T0 + 24 * H); ok(!Object.keys(s.rel.aff).some((k) => k.includes('大衛')), '離開後相關紀錄被清掉'); }
// 9. 夜間派對：決定性，辦的那天事件只有一次，窗口與 21:00 對齊
{ const s = mk(99); const days = []; for (let d = 0; d < 20; d++) days.push(R.partyOn(s, 20000 + d)); ok(days.some(Boolean) && days.some((x) => !x), '有些夜晚辦派對、有些不辦'); const rep = run(s, 14 * 24); const parties = rep.events.filter((e) => e.type === 'party');
  const perDay = new Set(parties.map((e) => R.dayOf(e.t, s.tz))); ok(parties.length === perDay.size, '同一天最多一次派對'); ok(parties.every((e) => R.localMin(e.t, s.tz) === R.PARTY_MIN), '派對事件剛好在當地 21:00'); ok(parties.length >= 1, `兩週內辦了 ${parties.length} 次派對`);
  const t21 = Math.floor((T0 + 3 * 86400) / 86400) * 86400 - 480 * 60 + R.PARTY_MIN * 60; ok(R.localMin(t21, 480) === R.PARTY_MIN, '本地分鐘換算正確'); }
// 10. 慶祝與共患難：大豐收讓全員交情上升；風暴 / 生病有事件
{ const s = mk(); const before = R.affOf(s, KEYS[0], KEYS[1]); const evs = []; R.celebrate(s, T0, (e) => evs.push(e), '測試'); ok(R.affOf(s, KEYS[0], KEYS[1]) === before + 3 && evs[0].type === 'celebrate', '慶祝：全員 +3');
  const s2 = mk(); const ev2 = []; R.rally(s2, T0, (e) => ev2.push(e), 'sick', KEYS[2], 0.5); ok(ev2[0].type === 'help' && R.affOf(s2, KEYS[2], ev2[0].who) >= 5, '生病：有人照顧，交情大增');
  const big = mk(5); big.res.fuel = 100; const r = startTrip(big, 'container', [KEYS[0], KEYS[1]], T0); const rep = simulateTo(big, T0 + 3 * H); ok(!r.ok || rep.events.some((e) => e.type === 'trip'), '出海事件仍正常結算'); }
// 11. T董 邀請：機率合理（心情 / 交情 / 狀態），結果改變交情
{ const base = { aff: 0, mood: 'happy', cat: 'rest' }; ok(R.inviteChance(base) > R.inviteChance({ ...base, mood: 'tired' }), '心情好比疲累更願意'); ok(R.inviteChance({ ...base, aff: 60 }) > R.inviteChance({ ...base, aff: -40 }), '交情好更願意'); ok(R.inviteChance({ ...base, cat: 'work' }) < R.inviteChance(base), '工作中比較不想玩');
  ok(R.inviteChance({ ...base, sleeping: true }) === 0 && R.inviteChance({ ...base, hurt: true }) < 0.1, '睡覺 / 受傷幾乎不接受'); const all = [0, 1].map(() => R.inviteChance({ ...base, mood: 'anxious', aff: -100, cat: 'work' })); ok(all[0] >= 0.05 && R.inviteChance({ ...base, aff: 100, cheered: true }) <= 0.97, '機率有上下限');
  const s = mk(); const a = R.inviteRoll(s, '小米', T0), b = R.inviteRoll(s, '小米', T0 + 30), c = R.inviteRoll(s, '小米', T0 + 600); ok(a === b && a !== c, '同一分鐘答案固定');
  const r = R.playTogether(s, '小米', 'win'); ok(r.aff === 2 && R.affOf(s, R.BOSS, '小米') === 2, '一起玩 → 與 T董 的交情上升'); R.inviteDeclined(s, '小米'); ok(R.affOf(s, R.BOSS, '小米') === 1.5, '被拒絕稍微降一點'); R.saveBest(s, 'pickle', 7); R.saveBest(s, 'pickle', 3); ok(s.rel.best.pickle === 7, '最高分只升不降');
  const t = mk(); simulateTo(t, T0 + 48 * H); ok(!Object.keys(t.rel.aff).some((k) => k.includes(R.BOSS)), '模擬不會替 T董 製造交情（只由玩家互動）'); }
// 12. 計時小遊戲純邏輯
{ ok(R.markerPos(0, 1) === 0 && R.markerPos(1, 1) === 1 && R.markerPos(2, 1) === 0 && Math.abs(R.markerPos(0.5, 1) - 0.5) < 1e-9, '指針三角波來回'); ok(R.timingQuality(0.5) === 1 && R.timingQuality(0.5 + 0.2) < 0.5 && R.timingQuality(0.02) === 0, '越靠近甜蜜點品質越高');
  ok(R.gradeOf(1) === 'perfect' && R.gradeOf(0.7) === 'good' && R.gradeOf(0.4) === 'ok' && R.gradeOf(0.1) === 'miss', '評級'); ok(R.botReturns(1, 0.5, 0.5) === false && R.botReturns(0, 0.5, 0.5) === true, '打得好對手更難接'); }
// 13. 自測
{ ok(runSelfTest().length === 0, 'selftest 無問題'); }
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
