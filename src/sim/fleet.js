// 末日方舟 · 艦隊模擬（純函式式；與 sim.js 同一套 tick：線上 / 離線補算結果相同）
// 狀態 s.fleet 為「可選欄位」：舊存檔沒有也能載入（ensureFleet 補上），因此不需升 SAVE_VERSION。
import { weatherAt, effectsOf } from './weather.js';
import { TICK, RES, RES_KEYS, FAC, LV_MULT } from './defs.js';
import { hash, mulberry32 } from './rng.js';
import { SHIPS, SHIP_ORDER, STARTERS, ZONES, ZONE_ORDER, FLEET_MAX, LV_MAX, LV_STAT, LV_SPEED, RESERVE_FUEL, FLAGSHIP, TRIP_BP, WORLD } from './fleetdefs.js';
import * as W from './world.js';
import * as R from './rel.js';
import { HOME_TYPES } from '../ship/homespec.js';
import { sanSz, sanMat } from './seazones.js';
import { PROMO_BP_IDS } from './szdata.js';
import { resCap, sanFlag, promoTick, tradeMul } from './promo.js';
import { planEvent, decide as decideEvent, pending as evPending, EVENTS } from './seaevents.js';

const BP_IDS = SHIP_ORDER.filter((k) => !SHIPS[k].free);   // 需要藍圖的船
export const bpIds = () => BP_IDS.slice();

export function newFleet(owner) {
  return { v: 1, nextId: 1, ships: [], bp: {}, flagship: owner ? 'cruise' : null, pick: owner ? 'owner' : null, stats: { missions: 0, sunk: 0 },
    // 預留給共享世界地圖（第 3 步）：出生點 / 迷霧 / 已探索海域 / 位置。目前不參與任何計算。
    world: W.emptyWorld(), pilot: { day: -1, got: 0 } };
}
export function ensureFleet(s, owner) { if (!s.fleet || typeof s.fleet !== 'object') s.fleet = newFleet(owner); return s.fleet; }

/** 驗證 / 修正讀回的 fleet；壞掉就回傳 null（由 ensureFleet 重建）。 */
export function sanitizeFleet(f) {
  if (!f || typeof f !== 'object' || !Array.isArray(f.ships)) return null;
  const n = (x, d = 0) => (typeof x === 'number' && Number.isFinite(x) ? x : d);
  const pt = (p) => (p && Number.isFinite(p.x) && Number.isFinite(p.y) ? { x: p.x, y: p.y } : null);
  const sanEv = (e) => (e && EVENTS[e.k] ? { k: e.k, at: Math.max(0, Math.min(1, n(e.at, 0.2))), c: Number.isInteger(e.c) && e.c >= -1 && e.c < EVENTS[e.k].opts.length ? e.c : -1, bad: !!e.bad, txt: typeof e.txt === 'string' ? e.txt.slice(0, 120) : '' } : null);
  const ships = [];
  for (const sh of f.ships.slice(0, FLEET_MAX)) {
    if (!sh || !SHIPS[sh.type]) continue;
    const o = { id: n(sh.id, 0) | 0, type: sh.type, name: String(sh.name || SHIPS[sh.type].name).slice(0, 16), lv: Math.max(1, Math.min(LV_MAX, n(sh.lv, 1) | 0)), hp: Math.max(0, Math.min(100, n(sh.hp, 100))), state: ['dock', 'sail', 'build', 'wreck', 'pilot'].includes(sh.state) ? sh.state : 'dock', auto: sh.auto !== false, zone: sh.zone === 'auto' || ZONES[sh.zone] ? sh.zone : 'auto', n: n(sh.n, 0) | 0, done: n(sh.done, 0), pilotAt: n(sh.pilotAt, 0), m: null };
    if (o.state === 'sail') { const m = sh.m; if (m && ZONES[m.zone] && [m.start, m.end].every((x) => typeof x === 'number' && Number.isFinite(x))) o.m = { zone: m.zone, start: m.start, end: m.end, fuel: n(m.fuel), res: Object.fromEntries(RES_KEYS.map((k) => [k, Math.max(0, Math.min(5000, n(m.res && m.res[k]) | 0))])), dmg: Math.max(0, Math.min(100, n(m.dmg))), fail: !!m.fail, bp: BP_IDS.includes(m.bp) ? m.bp : null, from: pt(m.from), to: pt(m.to), ev: sanEv(m.ev) }; else o.state = 'dock'; }
    ships.push(o);
  }
  const ids = new Set(); for (const sh of ships) { if (ids.has(sh.id) || sh.id <= 0) sh.id = 1 + Math.max(0, ...ships.map((x) => x.id)); ids.add(sh.id); }
  const bp = {}; for (const k of [...BP_IDS, ...PROMO_BP_IDS]) if (f.bp && f.bp[k]) bp[k] = 1; const mat = sanMat(f.mat); const flag = sanFlag(f.flag);
  const world = sanWorld(f.world);
  const home = Number.isInteger(f.home) && ships.some((x) => x.id === f.home) ? { home: f.home } : {};
  return { ...home, ...(mat ? { mat } : {}), ...(flag ? { flag } : {}), v: 1, nextId: Math.max(n(f.nextId, 1), 1 + Math.max(0, ...ships.map((x) => x.id))), ships, bp, flagship: f.flagship === 'cruise' ? 'cruise' : null, pick: typeof f.pick === 'string' ? f.pick.slice(0, 16) : null,
    stats: { missions: n(f.stats && f.stats.missions) | 0, sunk: n(f.stats && f.stats.sunk) | 0 }, world, pilot: { day: n(f.pilot && f.pilot.day, -1) | 0, got: Math.max(0, n(f.pilot && f.pilot.got) | 0) } };
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

const addRes = (s, k, v, rep) => { const cap = resCap(s, k); const b = s.res[k]; s.res[k] = Math.min(cap, s.res[k] + v); const d = s.res[k] - b; if (rep && d > 0) rep.produced[k] += d; return d; };
const canPay = (s, c) => Object.keys(c).every((k) => s.res[k] >= c[k]);
const pay = (s, c) => { for (const k in c) s.res[k] -= c[k]; };
export const costTextF = (c) => Object.keys(c).map((k) => `${RES[k].icon}${c[k]}`).join(' ');
const ev = (s, rep, e) => { s.log.push(e); if (s.log.length > 60) s.log.shift(); if (rep) rep.events.push(e); };

/** 出發那一刻方舟位置的天氣效果（暴風 → 受損增加、雪 → 變慢、極光 → 藍圖機率與收穫提升）；沒有世界地圖 → 全部 ×1 */
function missionWx(f, t) { const w = f.world; if (!w || !w.pos) return { luckBp: 1, luckHaul: 1, dmgMult: 1, timeMult: 1 }; const p = W.arkPos(w, t); return effectsOf(weatherAt(t, p.x, p.y)); }
// ---------------------------------------------------------------- 任務規劃（在出發那一刻決定結果，與 trip 相同風格）
export function planMission(s, ship, zone, startSec) {
  const f = s.fleet; const rnd = mulberry32(hash(s.seed, 'fm', ship.id, ship.n)); const Z = ZONES[zone]; const st = shipStats(ship);
  const risk = missionRisk(ship, zone); const fail = rnd() < risk * 0.6; const wxm = missionWx(f, startSec);
  const total = st.cargo * Z.rich * (0.7 + rnd() * 0.6) * (fail ? 0.4 : 1) * (1 + st.fp * 0.02) * wxm.luckHaul;
  const res = { food: 0, water: 0, fuel: 0, parts: 0 }; let ws = 0; for (const k in Z.w) ws += Z.w[k]; for (const k in Z.w) res[k] = Math.round(total * Z.w[k] / ws);
  const hit = rnd() < risk * 2.5 || fail; const dmg = hit ? Math.round((8 + rnd() * 14) * (fail ? 1.6 : 1) / (1 + st.hull / 250) * (1 + Z.danger * 3) * wxm.dmgMult) : 0;
  const pool = Z.bp.filter((b) => !f.bp[b]); let bp = null; if (!fail && pool.length && rnd() < Z.bpChance * wxm.luckBp) bp = pool[Math.floor(rnd() * pool.length)];
  // 世界地圖：目的地 = 離方舟最近的該海域格；方舟已在（或緊鄰）遠方海域時，往返更快、收穫更多（預設出生在近海 → 完全不變）
  const w = f.world; const pos = W.arkPos(w, startSec); let from = null, to = null, mins = missionMinutes(ship, zone), close = false;
  if (w && w.pos) { from = { x: Math.round(pos.x), y: Math.round(pos.y) }; const c = W.nearestZoneCell(pos.x, pos.y, zone); if (c) { const jr = mulberry32(hash(s.seed, 'fmj', ship.id, ship.n)); to = { x: Math.round(c.x + (jr() - 0.5) * 18), y: Math.round(c.y + (jr() - 0.5) * 18) }; close = zone !== 'near' && c.d <= WORLD.near; } }
  mins = Math.max(5, Math.round(mins * wxm.timeMult));
  if (close) { mins = Math.max(5, Math.round(mins * 0.7)); for (const k in res) res[k] = Math.round(res[k] * 1.15); }
  const m = { zone, start: startSec, end: startSec + mins * 60, fuel: missionFuel(ship, zone), res, dmg, fail, bp, from, to, ev: null };
  if (w && w.pos) m.ev = planEvent(s.seed, ship.id, ship.n, zone, fail);
  return m;
}

function resolveMission(s, ship, tEnd, rep) {
  const m = ship.m; const f = s.fleet; const B = SHIPS[ship.type]; const Z = ZONES[m.zone];
  { const tm = tradeMul(f); if (tm > 1 && !m.fail) for (const k of RES_KEYS) if (m.res[k]) m.res[k] = Math.round(m.res[k] * tm); }   // 商船旗艦：貿易收益加成
  for (const k of RES_KEYS) if (m.res[k]) addRes(s, k, m.res[k], rep);
  ship.hp = Math.max(0, ship.hp - m.dmg); ship.m = null; f.stats.missions++; ship.n++;
  if (m.to && f.world && f.world.pos) { const nn = W.reveal(f.world, m.to.x, m.to.y, WORLD.revealMission); if (nn) f.world.explored = (f.world.explored || 0) + nn; }
  const gains = RES_KEYS.filter((k) => m.res[k]).map((k) => `${RES[k].icon}${m.res[k]}`).join(' ');
  let text = `${B.icon}${ship.name} ${m.fail ? '遇襲，勉強帶回' : '從' + Z.name + '返航'}：${gains}` + (m.dmg ? `（船體 −${m.dmg}%）` : '');
  if (ship.hp <= 0) { ship.state = 'wreck'; f.stats.sunk++; text += `。${ship.name} 重創擱淺，需要整修！`; } else ship.state = 'dock';
  if (m.ev && m.ev.c >= 0 && m.ev.txt) text += `（${m.ev.txt}）`;
  if (m.bp && !f.bp[m.bp]) { f.bp[m.bp] = 1; text += `。🗺️ 在海上發現「${SHIPS[m.bp].name}」藍圖！`; ev(s, rep, { t: tEnd, type: 'blueprint', bp: m.bp, text: `發現藍圖：${SHIPS[m.bp].name}` }); }
  ev(s, rep, { t: tEnd, type: 'fleet', ship: ship.id, text, fail: m.fail });
  const hauled = RES_KEYS.reduce((a, k) => a + (m.res[k] || 0), 0); if (!m.fail && hauled >= 90 && ship.hp > 0) R.celebrate(s, tEnd, (e) => ev(s, rep, e), `${ship.name} 載滿而歸（${hauled} 單位），船員們一起慶祝！`);
}

/** 每個 tick（由 sim.stepTick 呼叫）：建造完成、任務返航、閒置自動出航、工坊修船 */
export function fleetTick(s, t, tEnd, rep) {
  const f = s.fleet; if (f) promoTick(s, tEnd, (e) => ev(s, rep, e));   // 旗艦晉升：改裝完成（完成時間在開工時寫死，離線補算結果一致）
  if (!f || !f.ships.length) return;
  const wk = s.fac && s.fac.workshop; const wkLv = wk && wk.lv && !wk.dmg ? wk.lv : 0;
  for (const ship of f.ships.slice().sort((a, b) => a.id - b.id)) {
    if (ship.state === 'build' && ship.done <= tEnd) { ship.state = 'dock'; ev(s, rep, { t: tEnd, type: 'shipdone', ship: ship.id, text: `${SHIPS[ship.type].icon}${ship.name} 建造完成，已停靠在方舟旁。` }); }
    else if (ship.state === 'sail' && ship.m && ship.m.end <= tEnd) resolveMission(s, ship, tEnd, rep);
    if (ship.state === 'pilot' && tEnd - ship.pilotAt > 1800) ship.state = 'dock';   // 忘了還船：30 分鐘後自動歸港
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
/** 非擁有者的「家」：玩家選定的旗艦小船（f.home = 船 id）；沒設定就用第一艘入門船，再不然第一艘可當家的船。擁有者不使用（T董 的家是郵輪方舟）。 */
export const canBeHome = (sh) => !!sh && HOME_TYPES.includes(sh.type) && sh.state !== 'build';
export function homeShip(f) {
  if (!f || !Array.isArray(f.ships)) return null;
  const a = f.ships.find((x) => x.id === f.home); if (canBeHome(a)) return a;
  const b = f.ships.find((x) => x.type === f.pick && canBeHome(x)); if (b) return b;
  return f.ships.find(canBeHome) || null;
}
export function setHome(s, id) {
  const f = s.fleet; const sh = f && f.ships.find((x) => x.id === id); if (!sh) return { ok: false, msg: '找不到這艘船' };
  if (!HOME_TYPES.includes(sh.type)) return { ok: false, msg: SHIPS[sh.type].name + ' 不能當旗艦（潛艇沒有甲板）' };
  if (sh.state === 'build') return { ok: false, msg: '還在建造中' }; if (sh.state === 'sail' || sh.state === 'pilot') return { ok: false, msg: '船在海上，返港後再換旗艦' };
  if (homeShip(f) && homeShip(f).id === id) return { ok: true, msg: '已經是旗艦了', same: true };
  f.home = id; const text = `⭐ 旗艦換成「${sh.name}」`; s.log.push({ t: s.simT, type: 'fleet', ship: id, text }); return { ok: true, msg: text, ship: sh };
}
export function pickStarter(s, type, nowSec) {
  const f = s.fleet; if (!f) return { ok: false, msg: '艦隊尚未建立' }; if (f.pick) return { ok: false, msg: '已經選過了' }; if (!STARTERS.includes(type)) return { ok: false, msg: '請從入門船型中選一艘' };
  f.pick = type; if (!SHIPS[type].free) f.bp[type] = 1; const ship = makeShip(f, type, 'dock', 0); f.ships.push(ship); f.nextId = Math.max(f.nextId, ship.id + 1);
  const text = `${SHIPS[type].icon}你選了「${SHIPS[type].name}」作為第一艘船，出海吧！`; s.log.push({ t: s.simT, type: 'fleet', ship: ship.id, text }); return { ok: true, msg: text, ship };
}
function makeShip(f, type, state, done) { const id = f.nextId++; const same = f.ships.filter((x) => x.type === type).length; return { id, type, name: SHIPS[type].name + (same ? ' ' + (same + 1) + ' 號' : ''), lv: 1, hp: 100, state, auto: true, zone: 'auto', n: 0, done, pilotAt: 0, m: null }; }
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

function sanWorld(w) {
  const o = W.emptyWorld(); if (!w || typeof w !== 'object') return o; const n = (x) => typeof x === 'number' && Number.isFinite(x); const pt = (p) => (p && n(p.x) && n(p.y) ? { x: Math.max(0, Math.min(2000, p.x)), y: Math.max(0, Math.min(2000, p.y)) } : null);
  if (w.spawn && n(w.spawn.x) && n(w.spawn.y)) o.spawn = { slot: Math.max(0, Math.min(WORLD.slots - 1, w.spawn.slot | 0)), ...pt(w.spawn) };
  o.fog = typeof w.fog === 'string' && w.fog.length <= 1400 && /^[A-Za-z0-9+/=]*$/.test(w.fog) ? w.fog : ''; o.seen = {}; for (const z of ZONE_ORDER) if (w.seen && w.seen[z]) o.seen[z] = 1; o.pos = pt(w.pos); o.explored = n(w.explored) ? Math.max(0, w.explored | 0) : 0;
  if (w.wx && typeof w.wx === 'object') { const c = (v) => (n(v) ? Math.max(0, Math.min(1e7, v | 0)) : 0); o.wx = { k: ['clear', 'storm', 'blizzard', 'snow', 'aurora'].includes(w.wx.k) ? w.wx.k : 'clear', hits: c(w.wx.hits), storm: c(w.wx.storm), snow: c(w.wx.snow), aur: c(w.wx.aur), polar: c(w.wx.polar) & 3 }; }
  { const sz = sanSz(w.sz); if (sz) o.sz = sz; }
  const r = w.route; if (r && n(r.x0) && n(r.y0) && n(r.x1) && n(r.y1) && n(r.t0) && n(r.t1)) o.route = { x0: r.x0, y0: r.y0, x1: r.x1, y1: r.y1, t0: r.t0, t1: r.t1, fuel: n(r.fuel) ? r.fuel : 0 };
  return o;
}

// ---------------------------------------------------------------- 世界 / 航行 / 事件 / 駕駛（玩家行動）
export const ensureWorld = (s, key) => { const f = s.fleet; if (!f) return null; return W.ensureSpawn(f, key); };
export function sailArk(s, x, y, nowSec) { return W.sailTo(s, x, y, nowSec, RESERVE_FUEL); }
export function decideSeaEvent(s, shipId, choice, nowSec) {
  const ship = findShip(s, shipId); if (!ship || ship.state !== 'sail') return { ok: false, msg: '這艘船不在海上' };
  const m = ship.m; const E = m && m.ev && EVENTS[m.ev.k]; const pool = E ? ZONES[m.zone].bp.filter((b) => !s.fleet.bp[b]) : [];
  const r = decideEvent(s.seed, ship, shipStats(ship), choice, nowSec, pool); if (r.ok) s.log.push({ t: s.simT, type: 'fleet', ship: ship.id, text: `${SHIPS[ship.type].icon}${ship.name}｜${m.ev.txt}` }); return r;
}
export const pendingEvents = (s, nowSec) => (s.fleet ? s.fleet.ships.filter((x) => x.state === 'sail' && evPending(x.m, nowSec)) : []);
export function startPilot(s, id, nowSec) {
  const ship = findShip(s, id); if (!ship) return { ok: false, msg: '找不到這艘船' }; if (s.fleet.ships.some((x) => x.state === 'pilot')) return { ok: false, msg: '你已經在駕駛一艘船了' };
  if (ship.state !== 'dock') return { ok: false, msg: ship.state === 'sail' ? '船在海上執行任務，等它返港' : '這艘船現在不能駕駛' }; if (ship.hp < 25) return { ok: false, msg: '船況太差，先整修' };
  ship.state = 'pilot'; ship.pilotAt = nowSec; return { ok: true, msg: `登上 ${ship.name}，出海兜風！` };
}
export function endPilot(s, id) { const ship = findShip(s, id); if (!ship || ship.state !== 'pilot') return { ok: false, msg: '不在駕駛中' }; ship.state = 'dock'; ship.auto = ship.auto; return { ok: true, msg: `${ship.name} 回到港邊` }; }
export function keepPilot(s, id, nowSec) { const ship = findShip(s, id); if (ship && ship.state === 'pilot') ship.pilotAt = nowSec; }
/** 駕駛時撿到海面上的補給箱：每天最多 80 單位（避免變成刷資源） */
export function pilotCollect(s, nowSec, tz = 0) {
  const f = s.fleet; const day = Math.floor((nowSec + tz * 60) / 86400); if (f.pilot.day !== day) f.pilot = { day, got: 0 };
  if (f.pilot.got >= 80) return { ok: false, msg: '今天撿得夠多了（每日上限 80），明天再來！' };
  const rnd = mulberry32(hash(s.seed, 'pcol', day, f.pilot.got)); const k = RES_KEYS[Math.floor(rnd() * 4)]; const v = Math.min(80 - f.pilot.got, 4 + Math.floor(rnd() * 7));
  s.res[k] = Math.min(resCap(s, k), s.res[k] + v); f.pilot.got += v; return { ok: true, msg: `撿到補給箱：${RES[k].icon}+${v}`, k, v };
}
/** 手動派船（海圖上用）：立刻出航到指定海域（不改變閒置自動設定） */
export function sendShip(s, id, zone, nowSec) {
  const ship = findShip(s, id); if (!ship) return { ok: false, msg: '找不到這艘船' }; if (ship.state !== 'dock') return { ok: false, msg: '船現在不在港內' }; if (ship.hp < 25) return { ok: false, msg: '船況太差，先整修' };
  if (!ZONES[zone] || !SHIPS[ship.type].zones.includes(zone)) return { ok: false, msg: `${SHIPS[ship.type].name}無法前往該海域` };
  const fuel = missionFuel(ship, zone); if (s.res.fuel < fuel + RESERVE_FUEL) return { ok: false, msg: `燃料不足（需要 ⛽${fuel}）` };
  s.res.fuel -= fuel; ship.m = planMission(s, ship, zone, Math.max(s.simT, nowSec)); ship.state = 'sail'; return { ok: true, msg: `${ship.name} 出航：${ZONES[zone].name}` };
}
export const stopArk = (s, nowSec) => W.stopArk(s, nowSec);
