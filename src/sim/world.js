// 末日方舟 · 共享世界地圖（純函式）：2000×2000 單位、80×80 格；5 個海域、戰爭迷霧、固定出生點、方舟航行。
// 地圖本身是「所有玩家共用的常數」（不依存檔種子）；每位玩家只存自己的迷霧、位置、航線（fleet.world）。
import { hash } from './rng.js';
import { WORLD, ZONE_ORDER } from './fleetdefs.js';
import { zoneAtPoint } from './szdata.js';
/** 迷霧海域裡看不見東西：海圖迷霧不會被方舟揭開（任務船不受影響） */
const hazed = (x, y) => { const h = zoneAtPoint(x, y); return !!(h && h.z.haz.noReveal && h.depth > 0); };

const G = WORLD.grid, CELL = WORLD.cell, C = WORLD.c;
const MAP_SEED = 20261028;
const idx = (cx, cy) => cy * G + cx;
const inb = (cx, cy) => cx >= 0 && cy >= 0 && cx < G && cy < G;
export const cellOf = (x, y) => [Math.max(0, Math.min(G - 1, Math.floor(x / CELL))), Math.max(0, Math.min(G - 1, Math.floor(y / CELL)))];
export const cellCenter = (cx, cy) => [(cx + 0.5) * CELL, (cy + 0.5) * CELL];

// ---------------------------------------------------------------- 出生點（8 個固定、彼此相距 ≥ 600）
export const SPAWNS = Array.from({ length: WORLD.slots }, (_, i) => { const a = -Math.PI / 2 + (i / WORLD.slots) * Math.PI * 2; return { slot: i, x: Math.round(C + Math.cos(a) * WORLD.spawnR), y: Math.round(C + Math.sin(a) * WORLD.spawnR) }; });
/** 依玩家 id（uid / 存檔種子）決定性挑出生點。多人同點的衝突留到多人階段用 Firestore 交易搶位。 */
export const spawnFor = (key) => SPAWNS[hash('spawn', key) % WORLD.slots];

// ---------------------------------------------------------------- 海域
function vnoise(x, y, step, salt) {
  const gx = x / step, gy = y / step; const x0 = Math.floor(gx), y0 = Math.floor(gy); const fx = gx - x0, fy = gy - y0; const sm = (t) => t * t * (3 - 2 * t);
  const h = (a, b) => hash(MAP_SEED, salt, a, b) / 4294967296; const u = sm(fx), v = sm(fy);
  return (h(x0, y0) * (1 - u) + h(x0 + 1, y0) * u) * (1 - v) + (h(x0, y0 + 1) * (1 - u) + h(x0 + 1, y0 + 1) * u) * v;
}
const Z_IDX = { near: 0, reef: 1, ruins: 2, ice: 3, abyss: 4 };
function rawZone(x, y) {
  const n = (vnoise(x, y, 130, 'z') - 0.5) * 36;      // ±18：邊界稍微不規則
  let ds = 1e9; for (const p of SPAWNS) ds = Math.min(ds, Math.hypot(x - p.x, y - p.y));
  if (ds + n < 170) return 'near';
  if (Math.hypot(x - C, y - C) + n * 2 < 230) return 'abyss';
  if (y + n * 2 < 260) return 'ice';
  if (ds + n < 260) return 'reef';
  return 'ruins';
}
let ZG = null;     // 80×80 海域格（常數，惰性建立）
export function zoneGrid() { if (ZG) return ZG; ZG = new Uint8Array(G * G); for (let cy = 0; cy < G; cy++) for (let cx = 0; cx < G; cx++) { const [x, y] = cellCenter(cx, cy); ZG[idx(cx, cy)] = Z_IDX[rawZone(x, y)]; } return ZG; }
export const zoneAt = (x, y) => { const [cx, cy] = cellOf(x, y); return ZONE_ORDER[zoneGrid()[idx(cx, cy)]]; };
export const zoneOfCell = (cx, cy) => ZONE_ORDER[zoneGrid()[idx(cx, cy)]];

// ---------------------------------------------------------------- 迷霧（位元圖 → base64；以 WeakMap 快取解碼結果）
const cache = new WeakMap();
const b64enc = (arr) => { let s = ''; for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]); return btoa(s); };
const b64dec = (str) => { const arr = new Uint8Array(Math.ceil(WORLD.fogBits / 8)); try { const s = atob(str || ''); for (let i = 0; i < arr.length && i < s.length; i++) arr[i] = s.charCodeAt(i); } catch (e) { /* 壞資料 → 全黑 */ } return arr; };
function fogArr(w) { let c = cache.get(w); if (!c || c.str !== w.fog) { c = { str: w.fog, arr: b64dec(w.fog) }; cache.set(w, c); } return c.arr; }
export const fogHas = (w, cx, cy) => { if (!inb(cx, cy)) return false; const a = fogArr(w); const i = idx(cx, cy); return !!(a[i >> 3] & (1 << (i & 7))); };
export function fogCount(w) { const a = fogArr(w); let n = 0; for (let i = 0; i < WORLD.fogBits; i++) if (a[i >> 3] & (1 << (i & 7))) n++; return n; }
/** 揭開以 (x,y) 為圓心、半徑 r 的迷霧；回傳新揭開的格數，並記錄看過的海域 */
export function reveal(w, x, y, r) {
  const a = fogArr(w); let n = 0; const [cx0, cy0] = cellOf(x, y); const rc = Math.ceil(r / CELL) + 1; const zg = zoneGrid();
  for (let cy = cy0 - rc; cy <= cy0 + rc; cy++) for (let cx = cx0 - rc; cx <= cx0 + rc; cx++) {
    if (!inb(cx, cy)) continue; const [px, py] = cellCenter(cx, cy); if (Math.hypot(px - x, py - y) > r) continue;
    { const hz = zoneAtPoint(px, py); if (hz && hz.z.haz.noReveal && hz.u < 0.72) continue; }   // 迷霧海域：只有外緣一圈看得到，內部永遠是霧
    const i = idx(cx, cy); if (a[i >> 3] & (1 << (i & 7))) continue; a[i >> 3] |= 1 << (i & 7); n++; w.seen[ZONE_ORDER[zg[i]]] = 1;
  }
  if (n) { w.fog = b64enc(a); cache.set(w, { str: w.fog, arr: a }); }
  return n;
}

// ---------------------------------------------------------------- 玩家世界狀態
export const emptyWorld = () => ({ v: 1, spawn: null, fog: '', seen: {}, pos: null, route: null, explored: 0 });
/** 還沒出生點就依玩家 key 決定性指定，並揭開出生點周圍 */
export function ensureSpawn(f, key) {
  if (!f.world || typeof f.world !== 'object') f.world = emptyWorld(); const w = f.world;
  if (!w.seen || typeof w.seen !== 'object') w.seen = {}; if (typeof w.fog !== 'string') w.fog = '';
  if (!w.spawn || typeof w.spawn.x !== 'number') { const sp = spawnFor(key); w.spawn = { slot: sp.slot, x: sp.x, y: sp.y }; w.pos = { x: sp.x, y: sp.y }; w.route = null; reveal(w, sp.x, sp.y, WORLD.revealSpawn); }
  if (!w.pos) w.pos = { x: w.spawn.x, y: w.spawn.y };
  return w;
}
/** t 時刻方舟的位置（航行中依航線線性內插） */
export function arkPos(w, t) {
  if (!w || !w.pos) return { x: C, y: C, moving: false };
  const r = w.route; if (!r) return { x: w.pos.x, y: w.pos.y, moving: false };
  const u = Math.max(0, Math.min(1, (t - r.t0) / Math.max(1, r.t1 - r.t0))); return { x: r.x0 + (r.x1 - r.x0) * u, y: r.y0 + (r.y1 - r.y0) * u, moving: u < 1, u };
}
export const routeCost = (x0, y0, x1, y1) => { const d = Math.hypot(x1 - x0, y1 - y0); return { dist: d, minutes: Math.max(1, Math.round(d / WORLD.arkSpeed)), fuel: Math.max(1, Math.ceil(d * WORLD.fuelPerUnit)) }; };
export const insideWorld = (x, y) => Math.hypot(x - C, y - C) <= 1000 - 20;      // 圓形海域（半徑 980）

/** 方舟出航；從目前位置（航行中就是當下位置）轉向新目的地 */
export function sailTo(s, x, y, nowSec, reserve = 15) {
  const f = s.fleet; if (!f || !f.world || !f.world.pos) return { ok: false, msg: '世界地圖尚未建立' }; const w = f.world;
  if (!Number.isFinite(x) || !Number.isFinite(y) || !insideWorld(x, y)) return { ok: false, msg: '那裡已經是世界的盡頭' };
  const t = Math.max(s.simT, nowSec); const p = arkPos(w, t); const c = routeCost(p.x, p.y, x, y);
  if (c.dist < 8) return { ok: false, msg: '已經在那裡了' };
  if (s.res.fuel < c.fuel + reserve) return { ok: false, msg: `燃料不足：航程需要 ⛽${c.fuel}（至少保留 ${reserve}）` };
  s.res.fuel -= c.fuel; w.pos = { x: p.x, y: p.y }; w.route = { x0: p.x, y0: p.y, x1: x, y1: y, t0: t, t1: t + c.minutes * 60, fuel: c.fuel };
  const z = zoneAt(x, y); return { ok: true, msg: `方舟起錨，航向 (${Math.round(x)}, ${Math.round(y)})，約 ${c.minutes} 分鐘`, cost: c, zone: z };
}
/** 每個 tick（sim.stepTick 呼叫）：更新位置、揭開沿途迷霧、抵達事件 */
export function worldTick(s, tEnd, ev) {
  const f = s.fleet; const w = f && f.world; if (!w || !w.pos) return;
  const r = w.route; if (!r) return;
  const p = arkPos(w, tEnd); w.pos = { x: p.x, y: p.y }; const n = hazed(p.x, p.y) ? 0 : reveal(w, p.x, p.y, WORLD.revealArk); if (n) w.explored = (w.explored || 0) + n;
  if (!p.moving) { w.route = null; w.pos = { x: r.x1, y: r.y1 }; if (!hazed(r.x1, r.y1)) reveal(w, r.x1, r.y1, WORLD.revealArk); const z = zoneAt(r.x1, r.y1); ev && ev({ t: tEnd, type: 'arrive', text: `方舟抵達 ${zoneLabel(z)}。`, zone: z }); }
}
const NAMES = { near: '🌊近海', reef: '🪸珊瑚礁', ruins: '🏙️廢墟城市', ice: '🧊冰海', abyss: '🕳️深淵' };
export const isHazed = hazed;
export const zoneLabel = (z) => NAMES[z] || z;

/** 從 (x,y) 出發，離某海域最近的格（回傳 {x,y,d}）；用於任務目的地與「附近」判斷 */
export function nearestZoneCell(x, y, zone, maxD = 1e9) {
  const zi = Z_IDX[zone]; const zg = zoneGrid(); let best = null;
  for (let cy = 0; cy < G; cy++) for (let cx = 0; cx < G; cx++) { if (zg[idx(cx, cy)] !== zi) continue; const [px, py] = cellCenter(cx, cy); const d = Math.hypot(px - x, py - y); if (d <= maxD && (!best || d < best.d - 1e-9)) best = { x: px, y: py, d, cx, cy }; }
  return best;
}
/** 就地停泊（已付的燃料不退） */
export function stopArk(s, nowSec) { const w = s.fleet && s.fleet.world; if (!w || !w.route) return { ok: false, msg: '方舟已經停泊' }; const p = arkPos(w, Math.max(s.simT, nowSec)); w.pos = { x: p.x, y: p.y }; w.route = null; return { ok: true, msg: '方舟就地下錨' }; }
