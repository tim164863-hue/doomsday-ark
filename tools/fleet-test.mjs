// 艦隊模擬測試：node tools/fleet-test.mjs
import { newState, simulateTo, syncCrew, startTrip } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import { SHIPS, SHIP_ORDER, ZONES, FLEET_MAX, STARTERS } from '../src/sim/fleetdefs.js';
import { validateState, serialize } from '../src/save/cloud.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000; const crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const mk = (owner = false) => { const s = newState(777, T0, 480); syncCrew(s, crew); F.ensureFleet(s, owner); s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; return s; };
const clone = (s) => JSON.parse(JSON.stringify(s)); const strip = (s) => { const c = clone(s); delete c.lastSeen; return JSON.stringify(c); };

ok(SHIP_ORDER.length === 6, '共 6 種船');
ok(SHIP_ORDER.every((k) => { const B = SHIPS[k]; return B.speed > 0 && B.cargo > 0 && B.hull > 0 && B.zones.length && B.cost.parts; }), '每種船都有速度 / 載貨 / 耐久 / 火力 / 海域 / 造價');
ok(new Set(SHIP_ORDER.map((k) => JSON.stringify([SHIPS[k].speed, SHIPS[k].cargo, SHIPS[k].hull, SHIPS[k].fp, SHIPS[k].zones]))).size === 6, '6 種船的數值組合互不相同');
ok(Object.keys(ZONES).join() === 'near,reef,ruins,ice,abyss', '海域：近海 / 珊瑚礁 / 廢墟城市 / 冰海 / 深淵');
ok(SHIPS.sub.zones.includes('abyss') && !SHIPS.icebreaker.zones.includes('abyss') && SHIPS.icebreaker.zones.includes('ice') && !SHIPS.skiff.zones.includes('ice'), '海域限制：只有潛艇能下深淵、破冰船能進冰海');

// 新玩家選船
{ const s = mk(false); ok(s.fleet.pick === null && s.fleet.flagship === null && !s.fleet.ships.length, '非擁有者：尚未選船、沒有旗艦');
  ok(!F.pickStarter(s, 'sub').ok && !F.pickStarter(s, 'icebreaker').ok, '不能選需要藍圖的大船當第一艘');
  const r = F.pickStarter(s, 'speedboat'); ok(r.ok && s.fleet.ships.length === 1 && s.fleet.ships[0].state === 'dock', '選快艇：立刻有一艘停港中的船');
  ok(!F.pickStarter(s, 'tug').ok, '只能選一次'); }
// 擁有者
{ const s = mk(true); ok(s.fleet.flagship === 'cruise' && s.fleet.pick === 'owner', '擁有者：旗艦=郵輪，不需選船'); }
// 建造 / 藍圖
{ const s = mk(true); ok(!F.buildShip(s, 'sub').ok, '沒有藍圖不能造潛水艇');
  const p0 = s.res.parts; const b = F.buildShip(s, 'skiff'); ok(b.ok && s.res.parts === p0 - 40 && s.fleet.ships[0].state === 'build', '小漁船不需藍圖：扣資源並進入建造中');
  simulateTo(s, T0 + 5 * 60); ok(s.fleet.ships[0].state === 'build', '建造需要時間'); simulateTo(s, T0 + 15 * 60); ok(s.fleet.ships[0].state !== 'build', '時間到建造完成（離線補算也會完成）');
  F.grantBlueprint(s, 'sub'); ok(F.buildShip(s, 'sub').ok, '拿到藍圖後可建造潛水艇'); s.res.parts = 5; ok(!F.buildShip(s, 'skiff').ok, '資源不足不能建造');
  s.res.parts = 400; while (s.fleet.ships.length < FLEET_MAX) F.buildShip(s, 'skiff'), (s.res.parts = 400, s.res.fuel = 400); ok(!F.buildShip(s, 'skiff').ok, `艦隊最多 ${FLEET_MAX} 艘`); }
// 閒置任務
{ const s = mk(true); F.buildShip(s, 'skiff'); const before = s.res.food + s.res.water + s.res.parts; const rep = simulateTo(s, T0 + 10 * 3600); const ship = s.fleet.ships[0]; ok(s.fleet.stats.missions >= 5, '閒置的船自動出航多趟（' + s.fleet.stats.missions + ' 趟 / 10 小時）'); ok(rep.events.some((e) => e.type === 'fleet'), '離線補算會產生艦隊事件'); ok(s.res.fuel >= 15 || ship.state === 'sail', '自動任務保留燃料底線'); }
{ const s = mk(true); F.buildShip(s, 'skiff'); s.fleet.ships[0].auto = false; simulateTo(s, T0 + 5 * 3600); ok(s.fleet.stats.missions === 0, '關掉自動出航 → 停在港內'); }
{ const s = mk(true); F.buildShip(s, 'skiff'); s.res.fuel = 10; simulateTo(s, T0 + 3600); ok(s.fleet.stats.missions === 0, '燃料不足不會出航'); }
// 決定性：一次補算 = 分段推進 = 存檔再讀
{ const a = mk(true), b = mk(true); for (const s of [a, b]) { F.buildShip(s, 'skiff'); F.grantBlueprint(s, 'patrol'); F.buildShip(s, 'patrol'); }
  simulateTo(a, T0 + 30 * 3600); for (let t = T0; t <= T0 + 30 * 3600; t += 913) simulateTo(b, t); simulateTo(b, T0 + 30 * 3600); ok(strip(a) === strip(b), '艦隊：離線一次補算與線上分段推進結果一致');
  const c = mk(true); F.buildShip(c, 'skiff'); F.grantBlueprint(c, 'patrol'); F.buildShip(c, 'patrol'); simulateTo(c, T0 + 7 * 3600); const c2 = validateState(JSON.parse(serialize(c))); simulateTo(c2, T0 + 30 * 3600); ok(c2 && strip(a) === strip(c2), '艦隊：存檔 → 讀檔（含驗證）後繼續，結果一致'); }
// 數值差異：快艇比小漁船快、拖船載貨多、巡邏艇更安全
{ const mkShip = (type, lv = 1) => ({ type, lv }); ok(F.missionMinutes(mkShip('speedboat'), 'reef') < F.missionMinutes(mkShip('tug'), 'reef'), '快艇比拖船快'); ok(F.shipStats(mkShip('tug')).cargo > F.shipStats(mkShip('speedboat')).cargo * 3, '拖船載貨量遠大於快艇');
  ok(F.missionRisk(mkShip('patrol'), 'ruins') < F.missionRisk(mkShip('skiff'), 'ruins'), '武裝巡邏艇風險低於小漁船'); ok(F.shipStats(mkShip('icebreaker')).hull > F.shipStats(mkShip('tug')).hull, '破冰船最耐撞'); }
// 升級
{ const s = mk(true); F.buildShip(s, 'tug' in SHIPS && 'skiff'); simulateTo(s, T0 + 15 * 60); const sh = s.fleet.ships[0]; sh.state = 'dock'; sh.m = null; sh.auto = false; const c0 = F.shipStats(sh).cargo; ok(F.upgradeShip(s, sh.id).ok && sh.lv === 2 && F.shipStats(sh).cargo > c0, '升級提升載貨量'); ok(F.upgradeShip(s, sh.id).ok && sh.lv === 3 && !F.upgradeShip(s, sh.id).ok, '最高 Lv3'); }
// 受損 / 整修
{ const s = mk(true); F.buildShip(s, 'skiff'); simulateTo(s, T0 + 15 * 60); const sh = s.fleet.ships[0]; sh.auto = false; sh.hp = 20; sh.state = 'dock'; const r = F.repairShip(s, sh.id); ok(r.ok && sh.hp === 100, '整修船體'); sh.hp = 45; sh.auto = true; s.fac.workshop.lv = 0; const m0 = s.fleet.stats.missions; simulateTo(s, T0 + 4 * 3600); ok(s.fleet.stats.missions === m0 && sh.hp === 45, '船況 < 50% 不會自動出航'); }
// 藍圖掉落：多趟任務後在可到達海域會找到藍圖（各種子）
{ let found = 0; for (let seed = 1; seed <= 12; seed++) { const s = newState(seed, T0, 0); F.ensureFleet(s, true); s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; F.buildShip(s, 'skiff'); F.upgradeShip; for (let h = 0; h < 40; h++) { s.res.fuel = 400; simulateTo(s, T0 + (h + 1) * 3600); } if (Object.keys(s.fleet.bp).length) found++; } ok(found >= 2, `閒置船隊在近海 40 小時內有機會發現藍圖（${found}/12 個種子）`); }
{ const s = mk(true); let got = 0; for (let i = 1; i <= 300; i++) { s.nextTripId = i; const tr = { ...F.tripBlueprint(s, i, 2, false) }; if (F.tripBlueprint(s, i, 2, false)) got++; } ok(got > 10 && got < 90, `高風險出海藍圖機率合理（${got}/300）`); }
{ const s = mk(true); s.nextTripId = 1; const r = startTrip(s, 'rig', ['a'], T0); ok(r.ok && 'bpFind' in r.trip, '出海計畫帶有 bpFind 欄位'); }
// 驗證：壞資料不會讓存檔壞掉
{ const s = mk(true); F.buildShip(s, 'skiff'); const j = JSON.parse(serialize(s)); j.fleet.ships[0].type = 'bogus'; j.fleet.ships.push({ type: 'tug', lv: 99, hp: 1e9, state: 'sail', m: { zone: 'x' } }); const v = validateState(j); ok(v && v.fleet.ships.length === 1 && v.fleet.ships[0].type === 'tug' && v.fleet.ships[0].lv === 3 && v.fleet.ships[0].hp === 100 && v.fleet.ships[0].state === 'dock', '壞掉的艦隊資料會被修正，不會讓存檔失效');
  const old = JSON.parse(serialize(newState(1, T0, 0))); ok(validateState(old) && !('fleet' in old), '舊存檔（沒有 fleet）仍可載入，不需升版'); }
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
