// 兩極冰山場（純函式、決定性）：渲染與手動駕駛碰撞共用。
// 場景座標（公尺）切 150 m 格，每格以雜湊決定有沒有冰山 / 浮冰、大小、有沒有動物（北極熊 / 企鵝）。
// 密度隨 cold 增加；cold 慢慢變化 → 冰山一個一個淡入淡出，不會整片跳變。
import { hash } from './rng.js';
import { smoothstep } from '../util.js';

export const BERG = { cell: 150, startCold: 0.28, spawnClear: 75 };
const U32 = 4294967296;
export const bergDensity = (cold) => (cold < BERG.startCold ? 0 : 0.06 + 0.40 * smoothstep(BERG.startCold, 0.95, cold));
export const floeDensity = (cold) => (cold < BERG.startCold ? 0 : 0.08 + 0.30 * smoothstep(BERG.startCold, 0.95, cold));
const rr = (a, b, c, d, e) => hash(a, b, c, d, e) / U32;

/** (x,z) 附近半徑 R 內的冰山 / 浮冰。hemi: 'north' | 'south'（決定動物種類）。回傳 [{id,kind,x,z,r,h,seed,animal,n,u}]，u = 出現門檻 / 密度 (<1 才存在)。 */
export function bergsAround(x, z, R, cold, hemi) {
  const out = []; const dB = bergDensity(cold), dF = floeDensity(cold); if (dB <= 0) return out; const C = BERG.cell; const hm = hemi === 'south' ? 's' : 'n';
  for (let gx = Math.floor((x - R) / C); gx <= Math.floor((x + R) / C); gx++) for (let gz = Math.floor((z - R) / C); gz <= Math.floor((z + R) / C); gz++) {
    const px = (gx + 0.12 + 0.76 * rr('bx', gx, gz, hm, 1)) * C, pz = (gz + 0.12 + 0.76 * rr('bz', gx, gz, hm, 2)) * C;
    if (Math.hypot(px - x, pz - z) > R) continue;
    const ub = rr('bu', gx, gz, hm, 3);
    if (ub < dB) {
      const sz = rr('bs', gx, gz, hm, 4), r = 6 + sz * sz * 34, h = 3 + sz * 16 + rr('bh', gx, gz, hm, 5) * 4;
      if (Math.hypot(px, pz) < r + BERG.spawnClear) continue;
      const au = rr('ba', gx, gz, hm, 6); let animal = null, n = 0;
      if (hm === 'n' && r >= 15 && au < 0.6) { animal = 'bear'; n = 1 + (au < 0.15 ? 1 : 0); } else if (hm === 's' && r >= 9 && au < 0.65) { animal = 'peng'; n = 3 + Math.floor(au * 6) % 3; }
      out.push({ id: `${hm}b${gx}_${gz}`, kind: 'berg', x: px, z: pz, r, h, seed: hash('bv', gx, gz, hm), animal, n, u: ub / dB });
    } else if (ub < dB + dF) {
      const r = 3.5 + rr('fs', gx, gz, hm, 7) * 7;
      if (Math.hypot(px, pz) < r + BERG.spawnClear) continue;
      const au = rr('fa', gx, gz, hm, 8); const animal = hm === 's' && r >= 5.5 && au < 0.5 ? 'peng' : null;
      out.push({ id: `${hm}f${gx}_${gz}`, kind: 'floe', x: px, z: pz, r, h: 0.6, seed: hash('fv', gx, gz, hm), animal, n: animal ? 2 + (hash('fn', gx, gz) % 3) : 0, u: (ub - dB) / dF });
    }
  }
  return out;
}
/** 船（圓心 sx,sz，半徑 sr）撞到的冰山（只有 berg 會撞）。回傳該冰山或 null。 */
export function bergHit(items, sx, sz, sr) { for (const b of items) if (b.kind === 'berg') { if (Math.hypot(b.x - sx, b.z - sz) < b.r * 0.85 + sr) return b; } return null; }
