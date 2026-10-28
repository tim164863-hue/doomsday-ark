// 海上固體物件（廢墟大樓 / 橋塔 / 漂流殘骸 / 冰山 / 石柱）的碰撞：純函式、可在 node 測試。
// 場景座標（公尺）；船 = 沿船身排開的一串圓；移動用「掃過」檢查（逐小步），所以再快也不會穿過去（no tunnelling）。
import { mulberry32 } from '../util.js';

export const RUIN_CLUSTERS = [[-760, -380, 0.9], [620, -640, 1.0], [880, 330, 0.7], [-300, 860, 0.8], [140, -980, 1.1], [-980, 220, 0.8]];
export const RUIN_BRIDGES = [[360, 760], [-620, -760]];

/** 廢墟的佈局（視覺 sealife.buildRuins 與碰撞共用；rng 呼叫順序固定，所以畫面跟以前一模一樣） */
export function ruinLayout() {
  const rng = mulberry32(7); const blocks = [], bridges = [];
  for (const [cx, cz, sc] of RUIN_CLUSTERS) {
    const n = 9 + Math.floor(rng() * 9);
    for (let i = 0; i < n; i++) {
      const w = (10 + rng() * 22) * sc, d = (10 + rng() * 22) * sc, h = (24 + rng() * 120) * sc * (0.4 + (1 - i / n)); const mat = rng() < 0.5 ? 0 : 1;
      const x = cx + (rng() - 0.5) * 220 * sc, y = h / 2 - 12 - rng() * 14, z = cz + (rng() - 0.5) * 160 * sc; const rx = (rng() - 0.5) * 0.25, ry = rng() * 3, rz = (rng() - 0.5) * 0.3; const cut = rng() < 0.6;
      blocks.push({ w, h, d, mat, x, y, z, rx, ry, rz, cut });
    }
  }
  for (const [x, z] of RUIN_BRIDGES) bridges.push({ x, z });
  return { blocks, bridges };
}

// 3x3 旋轉（three.js 的 Euler 'XYZ'：R = Rx·Ry·Rz）
function rot(rx, ry, rz) {
  const a = Math.cos(rx), b = Math.sin(rx), c = Math.cos(ry), d = Math.sin(ry), e = Math.cos(rz), f = Math.sin(rz);
  return [c * e, -c * f, d, a * f + b * d * e, a * e - b * d * f, -b * c, b * f - a * d * e, b * e + a * d * f, a * c];
}
/** 一個（可能傾斜的）方塊在水面（y=0）的截面 → 水平有向長方形；水面以上沒有東西就回 null（沉在水下的不擋船） */
function waterBox(b) {
  const R = rot(b.rx, b.ry, b.rz); const top = b.y + b.h / 2; if (top < 1.2) return null;
  const Y = [R[1], R[4], R[7]]; if (Y[1] < 0.3) return null; const t = -b.y / Y[1]; const cx = b.x + Y[0] * t, cz = b.z + Y[2] * t;   // 沿著方塊的「上」軸走到水面
  let ux = R[0], uz = R[6], l = Math.hypot(ux, uz); if (l < 1e-6) { ux = 1; uz = 0; l = 1; } ux /= l; uz /= l; const sx = Math.hypot(R[0], R[6]), sz = Math.hypot(R[2], R[8]);
  const hw = b.w / 2 * sx, hd = b.d / 2 * sz; return { x: cx, z: cz, ux, uz, hw, hd, rad: Math.hypot(hw, hd), top, kind: 'ruin', needLen: 0 };
}
let _boxes = null;
/** 廢墟 / 橋塔 / 橋面的水平長方形（只算一次）。橋面離水面 ≈ 11 m：小船可以從底下過，船長 ≥ 24 m 的大船會撞到。 */
export function ruinBoxes() {
  if (_boxes) return _boxes; const L = ruinLayout(); const out = [];
  for (const b of L.blocks) { const o = waterBox(b); if (o) out.push(o); }
  for (const br of L.bridges) {
    for (const s of [0, 1]) { const o = waterBox({ x: br.x + s * 80, y: 50, z: br.z, w: 10, h: 140, d: 10, rx: 0, ry: 0, rz: (s - 0.5) * 0.12 }); if (o) { o.kind = 'bridge'; out.push(o); } }
    out.push({ x: br.x + 40, z: br.z, ux: 1, uz: 0, hw: 55, hd: 3.5, rad: 55, top: 13.5, kind: 'bridge', needLen: 24 });
  }
  return (_boxes = out);
}

/** 漂流殘骸每種的碰撞圓（模型本地座標 [x, z, r]；縮放 1.7） */
export const DEBRIS_SCALE = 1.7;
export const DEBRIS_CIRCLES = [
  [[0, 0, 2.1]],                                                 // 0 木板群
  [[-0.95, 0, 0.55], [0, 0, 0.55], [0.95, 0, 0.55]],              // 1 油桶
  [[-2, 0, 1.45], [0, 0, 1.45], [2, 0, 1.45]],                    // 2 半沉貨櫃
  [[0, 0, 0.75], [3, 0.5, 1.5]],                                  // 3 救生圈 + 筏
  [[0, 0, 2.7]],                                                  // 4 船殼板
  [[-1.05, 0, 0.7], [0, 0, 0.7], [1.05, 0, 0.7], [0.2, 1.5, 0.75]], // 5 木箱 + 輪胎
  [[-1.5, 0, 0.95], [0, 0, 0.95], [1.5, 0, 0.95]],                // 6 翻覆小船
];
/** 把殘骸清單（{x,z,yaw,k}）展開成世界座標的圓；out 可重複使用 */
export function debrisCircles(list, out = []) {
  out.length = 0;
  for (const d of list) { const cs = DEBRIS_CIRCLES[d.k % DEBRIS_CIRCLES.length], c = Math.cos(d.yaw), s = Math.sin(d.yaw); for (const [lx, lz, r] of cs) { const x = lx * DEBRIS_SCALE, z = lz * DEBRIS_SCALE; out.push({ x: d.x + x * c + z * s, z: d.z - x * s + z * c, r: r * DEBRIS_SCALE, kind: 'debris' }); } }
  return out;
}

// ------------------------------------------------------------------ 圓 vs 圓 / 長方形
/** 船的一個圓（x,z,r）對圓形障礙 → 接觸（法線從障礙指向船、穿深）；沒碰到回 null */
export function circleVsCircle(x, z, r, bx, bz, br, kind) {
  const dx = x - bx, dz = z - bz, d = Math.hypot(dx, dz), pen = br + r - d; if (pen <= 0) return null; return d > 1e-6 ? { nx: dx / d, nz: dz / d, pen, kind } : { nx: 1, nz: 0, pen, kind };
}
export function circleVsBox(x, z, r, b, kind) {
  const dx = x - b.x, dz = z - b.z; if (dx * dx + dz * dz > (b.rad + r) * (b.rad + r)) return null;
  const lx = dx * b.ux + dz * b.uz, lz = -dx * b.uz + dz * b.ux; const cx = Math.max(-b.hw, Math.min(b.hw, lx)), cz = Math.max(-b.hd, Math.min(b.hd, lz)); let nl, mz, pen;
  if (cx === lx && cz === lz) { const ex = b.hw - Math.abs(lx), ez = b.hd - Math.abs(lz); if (ex < ez) { nl = lx >= 0 ? 1 : -1; mz = 0; pen = r + ex; } else { nl = 0; mz = lz >= 0 ? 1 : -1; pen = r + ez; } }   // 圓心在裡面：從最近的面推出
  else { const ax = lx - cx, az = lz - cz, d = Math.hypot(ax, az); pen = r - d; if (pen <= 0) return null; nl = ax / d; mz = az / d; }
  return { nx: b.ux * nl - b.uz * mz, nz: b.uz * nl + b.ux * mz, pen, kind: kind || b.kind };
}

/** 船身 = 沿船身的一串圓（半徑 ≈ 船寬的一半，間距 ≈ 1.4 倍半徑） */
export function hullCircles(x, z, yaw, cfg, out = []) {
  out.length = 0; const c = Math.cos(yaw), sn = -Math.sin(yaw), r = Math.max(2, cfg.hw * 0.95), half = Math.max(0, cfg.len / 2 - r), n = half < 0.5 ? 1 : Math.max(2, Math.ceil(half * 2 / (r * 1.4)) + 1);
  for (let i = 0; i < n; i++) { const o = n === 1 ? 0 : -half + (2 * half * i) / (n - 1); out.push({ x: x + c * o, z: z + sn * o, r }); } return out;
}
/** 最深的一個接觸（所有船圓 × 所有 probe）。probe(x, z, r) → 接觸 | null */
export function deepest(x, z, yaw, cfg, probes, tmp = []) {
  const cs = hullCircles(x, z, yaw, cfg, tmp); let best = null;
  for (const c of cs) for (const p of probes) { const h = p(c.x, c.z, c.r); if (h && (!best || h.pen > best.pen)) best = h; } return best;
}

/** 掃過式移動：st 已經被物理推到新位置，(x0,z0) 是這一格開始的位置。沿路徑逐小步檢查，碰到就停在碰到前、沿著表面滑；
 *  回傳 { kind, imp（撞擊的法向速度 m/s）, nx, nz } 或 null。會修改 st.x / st.z / st.v / st.w。 */
export function sweepShip(st, x0, z0, cfg, probes, dt) {
  if (!probes.length) return null; const yaw = st.yaw, tmp = []; let hit = null; const v0 = st.v, hx = Math.cos(yaw), hz = -Math.sin(yaw);
  let cx = x0, cz = z0, rx = st.x - x0, rz = st.z - z0; const step = Math.max(0.3, Math.max(2, cfg.hw * 0.95) * 0.35);
  if (deepest(cx, cz, yaw, cfg, probes, tmp)) { cx = x0; cz = z0; }   // 起點就已經貼著 / 卡在物件上：下面的最後推出會處理
  for (let it = 0; it < 4; it++) {
    const dist = Math.hypot(rx, rz); if (dist < 1e-6) break; const n = Math.max(1, Math.ceil(dist / step)); let found = -1, c = null;
    for (let i = 1; i <= n; i++) { c = deepest(cx + rx * i / n, cz + rz * i / n, yaw, cfg, probes, tmp); if (c) { found = i; break; } }
    if (found < 0) { cx += rx; cz += rz; rx = rz = 0; break; }
    const f = (found - 1) / n; cx += rx * f; cz += rz * f; rx *= 1 - f; rz *= 1 - f;   // 停在碰到前
    const dn = rx * c.nx + rz * c.nz; if (dn < 0) { rx -= dn * c.nx; rz -= dn * c.nz; }   // 去掉朝向物件的位移，剩下的沿表面滑
    if (!hit) hit = { kind: c.kind, nx: c.nx, nz: c.nz, imp: Math.max(0, -v0 * (hx * c.nx + hz * c.nz)) };
    cx += c.nx * 0.02; cz += c.nz * 0.02;   // 離表面一點點，避免下一步又算碰到
  }
  // 最後把殘餘的穿透推出去（船轉向掃進物件時）
  const startFree = !deepest(x0, z0, yaw, cfg, probes, tmp);
  for (let k = 0; k < 10; k++) { const c = deepest(cx, cz, yaw, cfg, probes, tmp); if (!c) break; cx += c.nx * (c.pen + 0.05); cz += c.nz * (c.pen + 0.05); if (!hit) hit = { kind: c.kind, nx: c.nx, nz: c.nz, imp: Math.max(0, -v0 * (hx * c.nx + hz * c.nz)) }; }
  { const c = deepest(cx, cz, yaw, cfg, probes, tmp); if (c && c.pen > 0.1 && startFree) { cx = x0; cz = z0; if (!hit) hit = { kind: c.kind, nx: c.nx, nz: c.nz, imp: 0 }; } }   // 夾在兩個物件中間推不出去：退回這一格的起點（一定是空的）
  st.x = cx; st.z = cz;
  if (hit) { const sp = Math.abs(v0) || 1, k = Math.max(0, Math.min(1, hit.imp / sp)); if (k > 0.85) st.v = v0 * -0.15; else st.v = v0 * (1 - 0.8 * k); st.w *= 0.8; }
  return hit;
}
/** 撞擊傷害（船體 %）：很輕的碰觸（imp ≤ 1.2 m/s）不傷船；上限 3% */
export const IMPACT_MIN = 1.2;
export const impactDamage = (imp, mul = 1) => (imp > IMPACT_MIN ? Math.min(3, 0.4 + imp * 0.12) * mul : 0);

/** 把一個點（NPC 船 / 自動返港）推到物件外面（半徑 r）；沒碰到就原樣回傳 */
export function pushOut(x, z, r, probes) {
  for (let k = 0; k < 3; k++) { let best = null; for (const p of probes) { const h = p(x, z, r); if (h && (!best || h.pen > best.pen)) best = h; } if (!best) break; x += best.nx * (best.pen + 0.05); z += best.nz * (best.pen + 0.05); } return { x, z };
}
/** 自動返港用的轉向：想去 desired 方向，如果前方 look 公尺內會撞到，就往兩邊轉到第一個沒擋的角度 */
export function steerAround(x, z, desired, r, look, probes) {
  const clear = (a) => { for (let d = r; d <= look; d += r) { for (const p of probes) if (p(x + Math.cos(a) * d, z - Math.sin(a) * d, r)) return false; } return true; };
  if (clear(desired)) return desired; for (let k = 1; k <= 8; k++) for (const sgn of [1, -1]) { const a = desired + sgn * k * 0.2; if (clear(a)) return a; } return desired;
}
