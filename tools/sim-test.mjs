// 離線模擬決定性測試：node tools/sim-test.mjs
import { newState, simulateTo, syncCrew, build, startTrip, summarize, claimTask, staffOf, cheer, rates } from '../src/sim/sim.js';
import { runSelfTest } from '../src/sim/selftest.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000; const crew = ['a', 'b', 'c', 'd', 'e', 'f'].map((k, i) => ({ key: k, cat: ['work', 'work', 'rest', 'off', 'work', 'rest'][i] }));
const mk = () => { const s = newState(12345, T0, 480); syncCrew(s, crew); return s; };
const clone = (s) => JSON.parse(JSON.stringify(s));
const strip = (s) => { const c = clone(s); delete c.lastSeen; return JSON.stringify(c); };

// 1. 同一輸入 → 同一輸出
{ const a = mk(), b = mk(); build(a, 'greenhouse'); build(b, 'greenhouse'); const ra = simulateTo(a, T0 + 8 * 3600), rb = simulateTo(b, T0 + 8 * 3600); ok(strip(a) === strip(b) && JSON.stringify(ra) === JSON.stringify(rb), '相同輸入的 8 小時離線結果完全相同'); }
// 2. 分段 vs 一次補算
{ const a = mk(), b = mk(); for (const s of [a, b]) { build(s, 'greenhouse'); build(s, 'workshop'); }
  simulateTo(a, T0 + 20 * 3600); for (let t = T0; t <= T0 + 20 * 3600; t += 777) simulateTo(b, t); simulateTo(b, T0 + 20 * 3600);
  ok(strip(a) === strip(b), '分段推進（線上）與一次補算（離線）結果一致'); }
// 3. 存檔 → 讀檔（JSON）後繼續，結果一致
{ const a = mk(), b = mk(); simulateTo(a, T0 + 5 * 3600); const b2 = clone(b); simulateTo(b2, T0 + 5 * 3600); const mid = clone(b2); simulateTo(mid, T0 + 30 * 3600); simulateTo(a, T0 + 30 * 3600); ok(strip(a) === strip(mid), '存檔序列化後再補算，結果一致'); }
// 4. 出海：決定性 + 離線完成
{ const a = mk(), b = mk(); const ra = startTrip(a, 'container', ['a', 'b'], T0), rb = startTrip(b, 'container', ['a', 'b'], T0); ok(ra.ok && JSON.stringify(ra.trip) === JSON.stringify(rb.trip), '出海結果（種子）可重現');
  const rep = simulateTo(a, T0 + 3600); ok(rep.trips.length === 1 && a.trips.length === 0 && a.crew.a.away === 0, '出海 15 分鐘的任務在離線補算中被結算');
  const other = mk(); simulateTo(other, T0 + 3600); ok(a.res.parts > other.res.parts - 1 || ra.trip.res.parts === 0, '出海帶回資源'); }
// 5. 離線上限 48 小時
{ const s = mk(); const rep = simulateTo(s, T0 + 200 * 3600); ok(rep.capped && rep.ticks === 48 * 60, '離線補算最多 48 小時'); }
// 6. 資源不會為負，不超過上限
{ const s = mk(); s.fac.purifier.lv = 0; simulateTo(s, T0 + 40 * 3600); ok(Object.values(s.res).every((v) => v >= 0 && v <= 500), '資源永不為負、不超過上限'); ok(s.stats.shortages >= 1, '斷糧會觸發短缺事件'); }
// 7. 真實 bot 狀態加成（唯讀）：同設施，駐守者 work → 產能高於 off
{ const a = mk(), b = mk(); const who = staffOf(a).purifier; a.statusSnap[who] = 'work'; b.statusSnap[who] = 'off'; ok(rates(a).water > rates(b).water, '駐守 bot 工作中 → 設施小幅加成'); ok(rates(a).water / rates(b).water <= 1.11, '加成不超過 10%'); }
// 8. 每日任務：同一天同一種子 → 同樣的任務；每日 3 個
{ const a = mk(), b = mk(); ok(JSON.stringify(a.daily) === JSON.stringify(b.daily) && a.daily.tasks.length === 3, '每日任務決定性且為 3 個'); }
// 9. 跨日換任務
{ const s = mk(); const d0 = s.daily.day; const rep = simulateTo(s, T0 + 26 * 3600); ok(s.daily.day !== d0 && rep.newDay, '跨日會重新產生每日任務'); }
// 10. 打氣冷卻
{ const s = mk(); ok(cheer(s, 'a', T0).ok && !cheer(s, 'a', T0 + 10).ok && cheer(s, 'a', T0 + 200).ok, '打氣有冷卻'); }
// 11. 領取任務
{ const s = mk(); s.daily.tasks[0].progress = s.daily.tasks[0].target; const before = JSON.stringify(s.res); ok(claimTask(s, 0).ok && JSON.stringify(s.res) !== before && !claimTask(s, 0).ok, '任務完成可領取一次'); }
// 12. 摘要
{ const s = mk(); const sm = summarize(simulateTo(s, T0 + 6 * 3600)); ok(sm.hours === 6, '摘要小時數正確'); }
// 13. 自測函式
{ ok(runSelfTest().length === 0, 'selftest 無問題'); }
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
