// 特殊海域的場景物件場（純函式、決定性）：畫面（world/zonefx.js）與手動駕駛碰撞（play/helm.js）共用。
// 場景座標（公尺）切格，每格用雜湊決定有沒有東西、大小、方向；數量隨「深度」(0 邊緣 … 1 深處) 增加，深度慢慢變 → 物件一個一個淡入淡出。
import { hash } from './rng.js';

const U32 = 4294967296;
const rr = (a, b, c, d, e) => hash(a, b, c, d, e) / U32;
export const FIELD = {
  stone:  { cell: 55,  p: 0.30, r: [2.2, 5.5],  h: [9, 28],  clear: 30, hit: true },    // 巨石陣：直立石柱（會撞）
  vortex: { cell: 200, p: 0.50, r: [28, 70],    h: [1, 1],   clear: 55, hit: false },   // 漩渦：海面上的小漩渦（局部旋轉力）
  flame:  { cell: 60,  p: 0.45, r: [3, 8],      h: [6, 18],  clear: 25, hit: false },   // 火焰：海面上的火柱
  lava:   { cell: 95,  p: 0.50, r: [6, 20],     h: [8, 34],  clear: 40, hit: true },    // 地獄：玄武岩柱（會撞）
  orb:    { cell: 90,  p: 0.55, r: [0.7, 1.6],  h: [2, 9],   clear: 0,  hit: false },   // 迷霧：漂浮的霧珠光點
};
/** (x,z) 附近半徑 R 內、kind 種類的物件。回傳 [{id,kind,x,z,r,h,seed,u}]；u = 出現門檻 / 密度（< 1 才存在，越小越先出現、越晚消失）。 */
export function fieldAround(kind, x, z, R, depth) {
  const out = [], F = FIELD[kind]; if (!F || depth <= 0) return out; const C = F.cell, dens = F.p * depth;
  for (let gx = Math.floor((x - R) / C); gx <= Math.floor((x + R) / C); gx++) for (let gz = Math.floor((z - R) / C); gz <= Math.floor((z + R) / C); gz++) {
    const px = (gx + 0.1 + 0.8 * rr('fx', gx, gz, kind, 1)) * C, pz = (gz + 0.1 + 0.8 * rr('fz', gx, gz, kind, 2)) * C; if (Math.hypot(px - x, pz - z) > R) continue;
    const u = rr('fu', gx, gz, kind, 3); if (u >= dens) continue; const s = rr('fs', gx, gz, kind, 4);
    const r = F.r[0] + (F.r[1] - F.r[0]) * s * s, h = F.h[0] + (F.h[1] - F.h[0]) * (0.3 + 0.7 * rr('fh', gx, gz, kind, 5)) * (0.5 + 0.5 * s); if (Math.hypot(px, pz) < r + F.clear) continue;
    out.push({ id: `${kind}${gx}_${gz}`, kind, x: px, z: pz, r, h, seed: hash('fv', gx, gz, kind), u: u / dens });
  }
  return out;
}
export const stonesAround = (x, z, R, depth) => fieldAround('stone', x, z, R, depth);
export const vortexAround = (x, z, R, depth) => fieldAround('vortex', x, z, R, depth);
/** 船（圓心 sx,sz、半徑 sr）撞到的石柱 / 岩柱（會撞的種類），或 null */
export function stoneHit(items, sx, sz, sr) { for (const b of items) if (FIELD[b.kind].hit && Math.hypot(b.x - sx, b.z - sz) < b.r * 0.9 + sr) return b; return null; }
/** 手動駕駛：站在漩渦場裡的局部推力（公尺 / 秒，場景座標）：向內 + 旋轉。items = vortexAround 的結果 */
export function vortexPush(items, x, z) {
  let px = 0, pz = 0; for (const v of items) { const dx = v.x - x, dz = v.z - z, d = Math.hypot(dx, dz); if (d > v.r * 1.6 || d < 0.5) continue; const k = (1 - d / (v.r * 1.6)); const nx = dx / d, nz = dz / d;
    px += (nx * 1.1 + -nz * 1.6) * k * 1.2; pz += (nz * 1.1 + nx * 1.6) * k * 1.2; }
  const m = Math.hypot(px, pz); if (m > 2) { px *= 2 / m; pz *= 2 / m; } return { x: px, z: pz };
}
