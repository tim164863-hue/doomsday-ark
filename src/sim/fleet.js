// 末日方舟 · 艦隊模擬（純函式式；與 sim.js 同一套 tick：線上 / 離線補算結果相同）
// 狀態 s.fleet 為「可選欄位」：舊存檔沒有也能載入（ensureFleet 補上），因此不需升 SAVE_VERSION。
import { TICK, RES, RES_KEYS, FAC, LV_MULT } from './defs.js';
import { hash, mulberry32 } from './rng.js';
import { SHIPS, SHIP_ORDER, STARTERS, ZONES, ZONE_ORDER, FLEET_MAX, LV_MAX, LV_STAT, LV_SPEED, RESERVE_FUEL, FLAGSHIP, TRIP_BP } from './fleetdefs.js';

const BP_IDS = SHIP_ORDER.filter((k) => !SHIPS[k].free);   // 需要藍圖的船
export const bpIds = () => BP_IDS.slice();

export function newFleet(owner) {
  return { v: 1, nextId: 1, ships: [], bp: {}, flagship: owner ? 'cruise' : null, pick: owner ? 'owner' : null, stats: { missions: 0, sunk: 0 },
    // 預留給共享世界地圖（第 3 步）：出生點 / 迷霧 / 已探索海域 / 位置。目前不參與任何計算。
    world: { spawn: null, fog: '', seen: { near: 1 }, pos: null } };
}
export function ensureFleet(s, owner) { if (!s.fleet || typeof s.fleet !== 'object') s.fleet = newFleet(owner); return s.fleet; }

/** 驗證 / 修正讀回的 fleet；壞掉就回傳 null（由 ensureFleet 重建）。 */
export function sanitizeFleet(f) {
  if (!f || typeof f !== 'object' || !Array.isArray(f.ships)) return null;
  const n = (x, d = 0) => (typeof x === 'number' && Number.isFinite(x) ? x : d);
  const ships = [];
  for (const sh of f.ships.slice(0, FLEET_MAX)) {
    if (!sh || !SHIPS[sh.type]) continue;
    const o = { id: n(sh.id, 0) | 0, type: sh.type, name: String(sh.name || SHIPS[sh.type].name).slice(0, 16), lv: Math.max(1, Math.min(LV_MAX, n(sh.lv, 1) | 0)), hp: Math.max(0, Math.min(100, n(sh.hp, 100))), state: ['dock', 'sail', 'build', 'wreck'].includes(sh.state) ? sh.state : 'dock', auto: sh.auto !== false, zone: sh.zone === 'auto' || ZONES[sh.zone] ? sh.zone : 'auto', n: n(sh.n, 0) | 0, done: n(sh.done, 0), m: null };
    if (o.state === 'sail') { const m = sh.m; if (m && ZONES[m.zone] && [m.start, m.end].every((x) => typeof x === 'number' && Number.isFinite(x))) o.m = { zone: m.zone, start: m.start, end: m.end, fuel: n(m.fuel), res: Object.fromEntries(RES_KEYS.map((k) => [k, Math.max(0, Math.min(5000, n(m.res && m.res[k]) | 0))])), dmg: Math.max(0, Math.min(100, n(m.dmg))), fail: !!m.fail, bp: BP_IDS.includes(m.bp) ? m.bp : null }; else o.state = 'dock'; }
    ships.push(o);
  }
  const ids = new Set(); for (const sh of ships) { if (ids.has(sh.id) || sh.id <= 0) sh.id = 1 + Math.max(0, ...ships.map((x) => x.id)); ids.add(sh.id); }
  const bp = {}; for (const k of BP_IDS) if (f.bp && f.bp[k]) bp[k] = 1;
  const w = f.world && typeof f.world === 'object' ? f.world : {};
  return { v: 1, nextId: Math.max(n(f.nextId, 1), 1 + Math.max(0, ...ships.map((x) => x.id))), ships, bp, flagship: f.flagship === 'cruise' ? 'cruise' : null, pick: typeof f.pick === 'string' ? f.pick.slice(0, 16) : null,
    stats: { missions: n(f.stats && f.stats.missions) | 0, sunk: n(f.stats && f.stats.sunk) | 0 }, world: { spawn: w.spawn || null, fog: typeof w.fog === 'string' ? w.fog.slice(0, 4000) : '', seen: w.seen && typeof w.seen === 'object' ? w.seen : { near: 1 }, pos: w.pos || null } };
}

// ---------------------------------------------------------------- 數值
export function shipStats(ship) {
  const B = SHIPS[ship.type]; const lv = ship.lv || 1;
  return { speed: +(B.speed * LV_SPEED[lv]).toFixed(2), cargo: Math.round(B.cargo * LV_STAT[lv]), hull: Math.round(B.hull * LV_STAT[lv]), fp: B.fp + (lv - 1) * (B.fp ? 1 : 0), zones: B.zones };
}
export const shipPower = (ship) => { const st = shipStats(ship); return st.fp * 10 + st.hull / 10 + st.cargo / 20; };
export function missionMinutes(ship, zone) { return Math.max(5, Math.round(ZONES[zone].min / shipStats(ship).speed)); }
export function missionFuel(ship, zone) { return Math.max(1, Math.ceil(ZONES[zone].fuel * SHIPS[ship.type].fuelUse)); }
export function missionRisk(ship, zone) { const st = shipStats(ship); return Math.min(0.9, ZONES[zone].danger / (1 + st.fp * 0.15 + st.hull / 200)); }
/** 自動任務：在可航行海域裡挑「推薦戰力 ≤ 船的戰力」中收穫最高的 */
export function autoZone(ship) { const st = shipStats(ship); const pw = shipPower(ship); let best = null; for (const z of ZONE_ORDER) { if (!st.zones.includes(z)) continue; if (ZONES[z].rec <= pw) best = z; } return best || st.zones[0]; }
export const zoneOf = (ship) => (ship.zone === 'auto' || !ZONES[ship.zone] || !SHIPS[ship.type].zones.includes(ship.zone) ? autoZone(ship) : ship.zone);

const addRes = (s, k, v, rep) => { const cap = RES[k].cap; const b = s.res[k]; s.res[k] = Math.min(cap, s.res[k] + v); const d = s.res[k] - b; if (rep && d > 0) rep.produced[k] += d; return d; };
const canPay = (s, c) => Object.keys(c).every((k) => s.res[k] >= c[k]);
const pay = (s, c) => { for (const k in c) s.res[k] -= c[k]; };
export const costTextF = (c) => Object.keys(c).map((k) => `${RES[k].icon}${c[k]}`).join(' ');
const ev = (s, rep, e) => { s.log.push(e); if (s.log.length > 60) s.log.shift(); if (rep) rep.events.push(e); };

// ---------------------------------------------------------------- 任務規劃（在出發那一刻決定結果，與 trip 相同風格）
export function planMission(s, ship, zone, startSec) {
  const f = s.fleet; const rnd = mulberry32(hash(s.seed, 'fm', ship.id, ship.n)); const Z = ZONES[zone]; const st = shipStats(ship);
  const risk = missionRisk(ship, zone); const fail = rnd() < risk * 0.6;
  const total = st.cargo * Z.rich * (0.7 + rnd() * 0.6) * (fail ? 0.4 : 1) * (1 + st.fp * 0.02);
  const res = { food: 0, water: 0, fuel: 0, parts: 0 }; let ws = 0; for (const k in Z.w) ws += Z.w[k]; for (const k in Z.w) res[k] = Math.round(total * Z.w[k] / ws);
  const hit = rnd() < risk * 2.5 || fail; const dmg = hit ? Math.round((8 + rnd() * 14) * (fail ? 1.6 : 1) / (1 + st.hull / 250) * (1 + Z.danger * 3)) : 0;
  const pool = Z.bp.filter((b) => !f.bp[b]); let bp = null; if (!fail && pool.length && rnd() < Z.bpChance) bp = pool[Math.floor(rnd() * pool.length)];
  return { zone, start: startSec, end: startSec + missionMinutes(ship, zone) * 60, fuel: missionFuel(ship, zone), res, dmg, fail, bp };
}

function resolveMission(s, ship, tEnd, rep) {
  const m = ship.m; const f = s.fleet; const B = SHIPS[ship.type]; const Z = ZONES[m.zone];
  for (const k of RES_KEYS) if (m.res[k]) addRes(s, k, m.res[k], rep);
  ship.hp = Math.max(0, ship.hp - m.dmg); ship.m = null; f.stats.missions++; ship.n++;
  const gains = RES_KEYS.filter((k) => m.res[k]).map((k) => `${RES[k].icon}${m.res[k]}`).join(' ');
  let text = `${B.icon}${ship.name} ${m.fail ? '遇襲，勉強帶回' : '從' + Z.name + '返航'}：${gains}` + (m.dmg ? `（船體 −${m.dmg}%）` : '');
  if (ship.hp <= 0) { ship.state = 'wreck'; f.stats.sunk++; text += `。${ship.name} 重創擱淺，需要整修！`; } else ship.state = 'dock';
  if (m.bp && !f.bp[m.bp]) { f.bp[m.bp] = 1; text += `。🗺️ 在海上發現「${SHIPS[m.bp].name}」藍圖！`; ev(s, rep, { t: tEnd, type: 'blueprint', bp: m.bp, text: `發現藍圖：${SHIPS[m.bp].name}` }); }
  ev(s, rep, { t: tEnd, type: 'fleet', ship: ship.id, text, fail: m.fail });
}

/** 每個 tick（由 sim.stepTick 呼叫）：建造完成、任務返航、閒置自動出航、工坊修船 */
export function fleetTick(s, t, tEnd, rep) {
  const f = s.fleet; if (!f || !f.ships.length) return;
  const wk = s.fac && s.fac.workshop; const wkLv = wk && wk.lv && !wk.dmg ? wk.lv : 0;
  for (const ship of f.ships.slice().sort((a, b) => a.id - b.id)) {
    if (ship.state === 'build' && ship.done <= tEnd) { ship.state = 'dock'; ev(s, rep, { t: tEnd, type: 'shipdone', ship: ship.id, text: `${SHIPS[ship.type].icon}${ship.name} 建造完成，已停靠在方舟旁。` }); }
    else if (ship.state === 'sail' && ship.m && ship.m.end <= tEnd) resolveMission(s, ship, tEnd, rep);
    if (ship.state === 'dock') {
      if (wkLv && ship.hp < 100) ship.hp = Math.min(100, ship.hp + 0.04 * LV_MULT[wkLv]);
      if (ship.auto && ship.hp >= 50) {
        const zone = zoneOf(ship); const fuel = missionFuel(ship, zone);
        if (s.res.fuel >= fuel + RESERVE_FUEL) { s.res.fuel -= fuel; ship.m = planMission(s, ship, zone, t); ship.state = 'sail'; }
      }
    }
  }
}
/** 組員出海找到藍圖（tripPlan 呼叫；獨立亂數不影響原本結果） */
export function tripBlueprint(s, id, tier, fail) {
  const f = s.fleet; if (!f || fail) return null; const T = TRIP_BP[tier]; if (!T) return null; const rnd = mulberry32(hash(s.seed, 'tbp', id));
  const pool = T.pool.filter((b) => !f.bp[b]); if (!pool.length || rnd() >= T.chance) return null; return pool[Math.floor(rnd() * pool.length)];
}
export function grantBlueprint(s, bp) { const f = s.fleet; if (!f || !BP_IDS.includes(bp) || f.bp[bp]) return false; f.bp[bp] = 1; return true; }

// ---------------------------------------------------------------- 玩家行動
const fleetCount = (f) => f.ships.length;
export const canBuild = (s, type) => { const f = s.fleet; const B = SHIPS[type]; if (!f || !B) return { ok: false, why: '沒有這種船' }; if (fleetCount(f) >= FLEET_MAX) return { ok: false, why: `艦隊已滿（最多 ${FLEET_MAX} 艘）` }; if (!B.free && !f.bp[type]) return { ok: false, why: '需要藍圖（出海探索時有機會發現）' }; if (!canPay(s, B.cost)) return { ok: false, why: '資源不足：需要 ' + costTextF(B.cost) }; return { ok: true }; };
export function pickStarter(s, type, nowSec) {
  const f = s.fleet; if (!f) return { ok: false, msg: '艦隊尚未建立' }; if (f.pick) return { ok: false, msg: '已經選過了' }; if (!STARTERS.includes(type)) return { ok: false, msg: '請從入門船型中選一艘' };
  f.pick = type; if (!SHIPS[type].free) f.bp[type] = 1; const ship = makeShip(f, type, 'dock', 0); f.ships.push(ship); f.nextId = Math.max(f.nextId, ship.id + 1);
  const text = `${SHIPS[type].icon}你選了「${SHIPS[type].name}」作為第一艘船，出海吧！`; s.log.push({ t: s.simT, type: 'fleet', ship: ship.id, text }); return { ok: true, msg: text, ship };
}
function makeShip(f, type, state, done) { const id = f.nextId++; const same = f.ships.filter((x) => x.type === type).length; return { id, type, name: SHIPS[type].name + (same ? ' ' + (same + 1) + ' 號' : ''), lv: 1, hp: 100, state, auto: true, zone: 'auto', n: 0, done, m: null }; }
export function buildShip(s, type) {
  const c = canBuild(s, type); if (!c.ok) return { ok: false, msg: c.why }; const f = s.fleet; const B = SHIPS[type];
  pay(s, B.cost); const ship = makeShip(f, type, 'build', s.simT + B.build * 60); f.ships.push(ship);
  const text = `開始建造 ${B.icon}${B.name}（${B.build} 分鐘）`; s.log.push({ t: s.simT, type: 'fleet', ship: ship.id, text }); return { ok: true, msg: text, ship };
}
export const upgradeCost = (ship) => { if (ship.lv >= LV_MAX) return null; const b = SHIPS[ship.type].up; const k = ship.lv; const c = {}; for (const r in b) c[r] = Math.round(b[r] * k * (k === 1 ? 1 : 1.4)); return c; };
export function upgradeShip(s, id) {
  const ship = findShip(s, id); if (!ship) return { ok: false, msg: '找不到這艘船' }; if (ship.state !== 'dock') return { ok: false, msg: '船在航行 / 建造中，返港後才能升級' };
  const c = upgradeCost(ship); if (!c) return { ok: false, msg: '已是最高等級' }; if (!canPay(s, c)) return { ok: false, msg: '資源不足：需要 ' + costTextF(c) };
  pay(s, c); ship.lv++; ship.hp = 100; const text = `${SHIPS[ship.type].icon}${ship.name} 升到 Lv${ship.lv}`; s.log.push({ t: s.simT, type: 'fleet', ship: ship.id, text }); return { ok: true, msg: text, ship };
}
export const repairCostShip = (ship) => ({ parts: Math.max(6, Math.round((100 - ship.hp) * 0.3)) });
export function repairShip(s, id) {
  const ship = findShip(s, id); if (!ship) return { ok: false, msg: '找不到這艘船' }; if (ship.state === 'sail' || ship.state === 'build') return { ok: false, msg: '船在航行 / 建造中' }; if (ship.hp >= 99) return { ok: false, msg: '船況良好' };
  const c = repairCostShip(ship); if (!canPay(s, c)) return { ok: false, msg: '零件不足：需要 ' + costTextF(c) }; pay(s, c); ship.hp = ship.state === 'wreck' ? 60 : 100; ship.state = 'dock'; return { ok: true, msg: `${ship.name} 整修完成` };
}
export function setZone(s, id, zone) {
  const ship = findShip(s, id); if (!ship) return { ok: false, msg: '找不到這艘船' }; if (zone !== 'auto' && !SHIPS[ship.type].zones.includes(zone)) return { ok: false, msg: `${SHIPS[ship.type].name}無法前往${ZONES[zone] ? ZONES[zone].name : '該海域'}` };
  ship.zone = zone; return { ok: true, msg: zone === 'auto' ? '改為自動選擇海域' : `目標海域：${ZONES[zone].name}` };
}
export function setAuto(s, id, on) { const ship = findShip(s, id); if (!ship) return { ok: false, msg: '找不到這艘船' }; ship.auto = !!on; return { ok: true, msg: on ? '閒置時自動出航' : '已停止自動出航（停在港內）' }; }
export function renameShip(s, id, name) { const ship = findShip(s, id); if (!ship) return { ok: false, msg: '找不到這艘船' }; const n = String(name || '').replace(/[<>]/g, '').trim().slice(0, 12); if (!n) return { ok: false, msg: '名字不能空白' }; ship.name = n; return { ok: true, msg: '已改名' }; }
export const findShip = (s, id) => (s.fleet ? s.fleet.ships.find((x) => x.id === id) || null : null);
export const flagshipInfo = () => FLAGSHIP;
