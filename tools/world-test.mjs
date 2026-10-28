// 世界地圖 / 迷霧 / 航行 / 海上事件 / 駕駛 測試：node tools/world-test.mjs
import { newState, simulateTo, syncCrew } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import * as W from '../src/sim/world.js';
import { EVENTS, pending, planEvent } from '../src/sim/seaevents.js';
import { WORLD, ZONE_ORDER } from '../src/sim/fleetdefs.js';
import { validateState, serialize } from '../src/save/cloud.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000; const crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const mk = (seed = 777, uid = 'u-test') => { const s = newState(seed, T0, 480); syncCrew(s, crew); F.ensureFleet(s, true); F.ensureWorld(s, uid); s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; return s; };
const strip = (s) => { const c = JSON.parse(JSON.stringify(s)); delete c.lastSeen; return JSON.stringify(c); };

// 地圖常數
{ const z = W.zoneGrid(); const cnt = [0, 0, 0, 0, 0]; for (const v of z) cnt[v]++; ok(cnt.every((n) => n > 150), `5 個海域都有足夠的面積（${cnt.join('/')}）`);
  let gap = 1e9; for (const a of W.SPAWNS) for (const b of W.SPAWNS) if (a !== b) gap = Math.min(gap, Math.hypot(a.x - b.x, a.y - b.y)); ok(W.SPAWNS.length === 8 && gap >= WORLD.spawnMinGap, `出生點相距 ≥ ${WORLD.spawnMinGap}（最小 ${Math.round(gap)}）`);
  ok(W.SPAWNS.every((p) => W.zoneAt(p.x, p.y) === 'near'), '每個出生點都在近海');
  ok(ZONE_ORDER.slice(1).every((zn) => W.SPAWNS.every((p) => W.nearestZoneCell(p.x, p.y, zn).d >= 120)), '出生點周圍 120 內只有近海 → 預設玩法不受遠海域加成');
  ok(W.spawnFor('alice') === W.spawnFor('alice') && new Set(Array.from({ length: 60 }, (_, i) => W.spawnFor('u' + i).slot)).size >= 6, '出生點依 uid 決定性且分佈平均'); }
// 迷霧
{ const w = W.emptyWorld(); w.spawn = { slot: 0, x: 1000, y: 200 }; w.pos = { x: 1000, y: 200 }; ok(W.fogCount(w) === 0, '空迷霧全黑'); const n1 = W.reveal(w, 1000, 200, 100); ok(n1 > 30 && W.fogHas(w, 40, 8) && !W.fogHas(w, 10, 70), '揭開圓形區域、其餘仍是迷霧'); ok(W.reveal(w, 1000, 200, 100) === 0, '重複揭開不重複計'); ok(w.fog.length < 1500, `迷霧存檔大小 ${w.fog.length} 字元`); }
// 出生
{ const s = mk(1, 'player-A'); const w = s.fleet.world; ok(w.spawn && Math.hypot(w.pos.x - w.spawn.x, w.pos.y - w.spawn.y) < 1 && W.fogCount(w) > 20 && w.seen.near, '新玩家：出生點、周圍已揭開');
  const x = JSON.stringify(w); F.ensureWorld(s, 'someone-else'); ok(JSON.stringify(s.fleet.world) === x, 'ensureWorld 不會移動已有的出生點'); }
// 老存檔（沒有 world / pilot 欄位）可以讀，並在 ensureWorld 後補上
{ const s = newState(5, T0, 480); syncCrew(s, crew); F.ensureFleet(s, true); const j = JSON.parse(serialize(s)); delete j.fleet.world; delete j.fleet.pilot; const r = validateState(j); ok(r && r.fleet && r.fleet.world && r.fleet.world.pos === null, '舊存檔（無 world）可讀入'); F.ensureWorld(r, 'x'); ok(r.fleet.world.pos && W.fogCount(r.fleet.world) > 0, '舊存檔補上世界狀態'); }
// 航行：離線一次補算 = 線上分段 = 存檔讀檔後繼續
{ const a = mk(), b = mk(), c = mk(); for (const s of [a, b, c]) { F.buildShip(s, 'skiff'); }
  const go = (s) => { simulateTo(s, T0 + 20 * 60); return F.sailArk(s, 1000, 1000, s.simT); }; const ra = go(a); go(b); go(c);
  ok(ra.ok && ra.cost.fuel > 0 && a.fleet.world.route, `方舟起錨（${ra.msg}）`);
  simulateTo(a, T0 + 30 * 3600); for (let t = T0 + 20 * 60; t <= T0 + 30 * 3600; t += 887) simulateTo(b, t); simulateTo(b, T0 + 30 * 3600);
  simulateTo(c, T0 + 5 * 3600); const c2 = validateState(JSON.parse(serialize(c))); simulateTo(c2, T0 + 30 * 3600);
  ok(strip(a) === strip(b), '航行 + 閒置：離線一次補算與線上分段推進一致'); ok(strip(a) === strip(c2), '航行 + 閒置：存檔讀檔後繼續一致');
  const w = a.fleet.world; ok(!w.route && Math.abs(w.pos.x - 1000) < 1 && Math.abs(w.pos.y - 1000) < 1, '離線期間方舟抵達目的地並停下');
  ok(W.fogHas(w, 20, 40) && w.explored > 20, `沿途迷霧被揭開（已探索 ${w.explored} 格）`); }
// 航行規則
{ const s = mk(); s.res.fuel = 10; ok(!F.sailArk(s, 1000, 700, s.simT).ok, '燃料不足不能出航'); s.res.fuel = 400; ok(!F.sailArk(s, 5000, 5000, s.simT).ok, '不能開出世界邊界'); ok(!F.sailArk(s, s.fleet.world.pos.x, s.fleet.world.pos.y, s.simT).ok, '原地不用出航');
  const f0 = s.res.fuel; const r = F.sailArk(s, 1000, 400, s.simT); ok(r.ok && f0 - s.res.fuel === r.cost.fuel, '出航時一次扣燃料'); simulateTo(s, s.simT + 60 * 60); const mid = W.arkPos(s.fleet.world, s.simT); const r2 = F.sailArk(s, 1100, 300, s.simT); ok(r2.ok && Math.abs(s.fleet.world.route.x0 - mid.x) < 3, '航行中可以從當下位置改航'); }
// 任務目的地 / 揭霧 / 遠海域加成
{ const s = mk(); F.buildShip(s, 'skiff'); simulateTo(s, T0 + 20 * 60); const sh = s.fleet.ships[0]; sh.state = 'dock'; sh.m = null; const st = F.shipStats(sh); const m0 = F.planMission(s, sh, 'near', s.simT); ok(m0.to && m0.from && W.zoneAt(m0.to.x, m0.to.y) === 'near', '任務目的地落在該海域內（出生在近海，預設不變）');
  const base = F.missionMinutes(sh, 'near'); ok(Math.round((m0.end - m0.start) / 60) === base, '方舟在出生點 → 近海任務時間不變'); }
{ const s = mk(); F.grantBlueprint(s, 'speedboat'); F.buildShip(s, 'speedboat'); simulateTo(s, T0 + 20 * 60); const sh = s.fleet.ships[0]; sh.state = 'dock'; sh.m = null; const w = s.fleet.world; const near = W.nearestZoneCell(w.pos.x, w.pos.y, 'reef'); const mA = F.planMission(s, sh, 'reef', s.simT);
  w.pos = { x: near.x, y: near.y }; const mB = F.planMission(s, sh, 'reef', s.simT); ok((mB.end - mB.start) < (mA.end - mA.start) && W.zoneAt(mB.to.x, mB.to.y) === 'reef', `方舟停在珊瑚礁邊 → 往返更快（${Math.round((mA.end - mA.start) / 60)}→${Math.round((mB.end - mB.start) / 60)} 分）`); }
{ const s = mk(); F.grantBlueprint(s, 'speedboat'); F.buildShip(s, 'speedboat'); simulateTo(s, T0 + 20 * 60); const sh = s.fleet.ships[0]; F.setAuto(s, sh.id, false); sh.state = 'dock'; const n0 = W.fogCount(s.fleet.world); const r = F.sendShip(s, sh.id, 'reef', s.simT); ok(r.ok && sh.state === 'sail', '派遣到珊瑚礁'); simulateTo(s, s.simT + 3 * 3600); ok(W.fogCount(s.fleet.world) > n0 && s.fleet.world.seen.reef, '任務完成後在目的地揭開迷霧、記錄看過的海域'); }
// 海上事件
{ let withEv = 0, tot = 0; const kinds = new Set(); for (let n = 0; n < 200; n++) for (const z of ZONE_ORDER) { const e = planEvent(1, 1, n, z, false); tot++; if (e) { withEv++; kinds.add(e.k); ok.last = 1; if (!EVENTS[e.k].zones.includes(z)) fails++; } } ok(withEv / tot > 0.45 && withEv / tot < 0.75 && kinds.size === Object.keys(EVENTS).length, `約 60% 的任務有海上事件、6 種都出現（${(withEv / tot * 100) | 0}%）`);
  ok(JSON.stringify(planEvent(9, 2, 3, 'reef', false)) === JSON.stringify(planEvent(9, 2, 3, 'reef', false)), '事件決定性'); }
{ const mkEv = () => { const s = mk(); F.grantBlueprint(s, 'speedboat'); F.buildShip(s, 'speedboat'); simulateTo(s, T0 + 20 * 60); const sh = s.fleet.ships[0]; F.setAuto(s, sh.id, false); sh.state = 'dock'; for (let i = 0; i < 40; i++) { sh.n = i; const m = F.planMission(s, sh, 'near', s.simT); if (m.ev) { sh.n = i; break; } } return s; };
  const a = mkEv(), b = mkEv(); const sa = a.fleet.ships[0], sb = b.fleet.ships[0]; F.sendShip(a, sa.id, 'near', a.simT); F.sendShip(b, sb.id, 'near', b.simT); ok(sa.m && sa.m.ev, '派出的任務帶有事件');
  const tEv = sa.m.start + (sa.m.ev.at + 0.01) * (sa.m.end - sa.m.start); simulateTo(a, tEv + 90); simulateTo(b, tEv + 90); ok(pending(sa.m, a.simT) && F.pendingEvents(a, a.simT).length === 1, '事件發生後進入待決定');
  const ra = F.decideSeaEvent(a, sa.id, 0, a.simT), rb = F.decideSeaEvent(b, sb.id, 0, b.simT); ok(ra.ok && JSON.stringify(sa.m) === JSON.stringify(sb.m), '決定結果是決定性的'); ok(!F.decideSeaEvent(a, sa.id, 1, a.simT).ok, '同一事件不能重複決定');
  simulateTo(a, T0 + 40 * 3600); simulateTo(b, T0 + 15 * 3600); simulateTo(b, T0 + 40 * 3600); ok(strip(a) === strip(b), '做了決定之後，離線補算仍然一致'); }
{ const mkU = (skip) => { const s = mk(); F.grantBlueprint(s, 'speedboat'); F.buildShip(s, 'speedboat'); simulateTo(s, T0 + 20 * 60); const sh = s.fleet.ships[0]; sh.state = 'dock'; sh.n = 0; for (let i = 0; i < 60; i++) { sh.n = i; if (F.planMission(s, sh, 'near', s.simT).ev) break; } F.setAuto(s, sh.id, false); F.sendShip(s, sh.id, 'near', s.simT); return s; };
  const a = mkU(), b = mkU(); simulateTo(a, T0 + 40 * 3600); simulateTo(b, T0 + 40 * 3600); ok(strip(a) === strip(b), '沒有做決定 = 照原計畫（閒置結果穩定一致）'); }
// 駕駛
{ const s = mk(); F.buildShip(s, 'skiff'); simulateTo(s, T0 + 20 * 60); const sh = s.fleet.ships[0]; sh.state = 'dock'; sh.m = null; const r = F.startPilot(s, sh.id, s.simT); ok(r.ok && sh.state === 'pilot', '可以登上停港的船駕駛'); ok(!F.startPilot(s, sh.id, s.simT).ok, '不能同時駕駛兩艘');
  const m0 = s.fleet.stats.missions; simulateTo(s, s.simT + 20 * 60); ok(sh.state === 'pilot' && s.fleet.stats.missions === m0, '駕駛中不會被閒置系統派出去'); F.keepPilot(s, sh.id, s.simT); simulateTo(s, s.simT + 3 * 3600); ok(sh.state !== 'pilot', '忘了還船 30 分鐘後自動歸港');
  F.setAuto(s, sh.id, false); sh.state = 'dock'; sh.m = null; F.startPilot(s, sh.id, s.simT); ok(F.endPilot(s, sh.id).ok && sh.state === 'dock', '返港'); const j = JSON.parse(serialize(s)); j.fleet.ships[0].state = 'pilot'; ok(validateState(j).fleet.ships[0].state === 'pilot', '駕駛中狀態可存讀');
  let got = 0; for (let i = 0; i < 40; i++) { const c = F.pilotCollect(s, s.simT, 480); if (c.ok) got += c.v; } ok(got > 0 && got <= 80, `駕駛撿補給箱每日有上限（${got}/80）`); }
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
