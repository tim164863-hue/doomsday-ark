// 每層甲板的導航網格 + A* + 碰撞
import { TIER } from './config.js';
const PAD = Math.ceil(TIER.ext);   // 旗艦加長：兩端各多 PAD 公尺的格子
export const CS = 0.5, GX0 = -50 - PAD, GZ0 = -16, GW = 232 + 4 * PAD, GH = 64;

class Heap {
  constructor() { this.a = []; }
  push(n, f) { const a = this.a; a.push([f, n]); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a; const top = a[0]; const last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { let l = 2 * i + 1, r = l + 1, m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return top[1]; }
  get size() { return this.a.length; }
}

export class NavGrid {
  constructor() { this.cells = new Uint8Array(GW * GH); this.base = new Uint8Array(GW * GH); }
  idx(ix, iz) { return iz * GW + ix; }
  ix(x) { return Math.floor((x - GX0) / CS); }
  iz(z) { return Math.floor((z - GZ0) / CS); }
  cx(ix) { return GX0 + (ix + 0.5) * CS; }
  cz(iz) { return GZ0 + (iz + 0.5) * CS; }
  inb(ix, iz) { return ix >= 0 && iz >= 0 && ix < GW && iz < GH; }
  free(ix, iz) { return this.inb(ix, iz) && this.cells[iz * GW + ix] === 1; }
  /** 圓形碰撞檢查 */
  walkable(x, z, r = 0.28) {
    if (!this.free(this.ix(x), this.iz(z))) return false;
    for (let a = 0; a < 8; a++) { const t = a * Math.PI / 4; if (!this.free(this.ix(x + Math.cos(t) * r), this.iz(z + Math.sin(t) * r))) return false; }
    return true;
  }
  /** 以 r 為半徑做軸向滑動，回傳新位置 */
  move(x, z, dx, dz, r = 0.28) {
    let nx = x + dx, nz = z + dz;
    if (this.walkable(nx, nz, r)) return [nx, nz];
    if (dx !== 0 && this.walkable(x + dx, z, r)) return [x + dx, z];
    if (dz !== 0 && this.walkable(x, z + dz, r)) return [x, z + dz];
    return [x, z];
  }
  los(x0, z0, x1, z1, r = 0.22) {
    const d = Math.hypot(x1 - x0, z1 - z0); const n = Math.max(1, Math.ceil(d / 0.2));
    for (let i = 0; i <= n; i++) { const t = i / n; if (!this.walkable(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, r)) return false; }
    return true;
  }
  nearestFree(x, z, maxR = 8, rad = 0) {
    const ok = rad ? (a, b) => this.walkable(this.cx(a), this.cz(b), rad) : (a, b) => this.free(a, b);
    const ix = this.ix(x), iz = this.iz(z);
    if (ok(ix, iz)) return [this.cx(ix), this.cz(iz)];
    for (let r = 1; r < maxR / CS; r++) {
      let best = null, bd = 1e9;
      for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        if (ok(ix + dx, iz + dz)) { const d = dx * dx + dz * dz; if (d < bd) { bd = d; best = [ix + dx, iz + dz]; } }
      }
      if (best) return [this.cx(best[0]), this.cz(best[1])];
    }
    return null;
  }
  /** 先要求「人體半徑也走得過」的路（避開 0.5 m 寬的假通道）；找不到才退回只看格子 */
  findPath(x0, z0, x1, z1) { return this.findPath2(x0, z0, x1, z1, true) || this.findPath2(x0, z0, x1, z1, false); }
  findPath2(x0, z0, x1, z1, strict) {
    const s = this.nearestFree(x0, z0), g = (strict && this.nearestFree(x1, z1, 3, 0.26)) || this.nearestFree(x1, z1);
    if (!s || !g) return null;
    const sx = this.ix(s[0]), sz = this.iz(s[1]), gx = this.ix(g[0]), gz = this.iz(g[1]);
    const start = sz * GW + sx, goal = gz * GW + gx;
    if (start === goal) return [[x1, z1]];
    const gS = new Float32Array(GW * GH).fill(1e9), from = new Int32Array(GW * GH).fill(-1), closed = new Uint8Array(GW * GH);
    const h = new Heap(); gS[start] = 0; h.push(start, 0);
    const N8 = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
    let found = false;
    while (h.size) {
      const c = h.pop(); if (closed[c]) continue; closed[c] = 1;
      if (c === goal) { found = true; break; }
      const cx = c % GW, cz = (c / GW) | 0;
      for (const [dx, dz, w] of N8) {
        const nx = cx + dx, nz = cz + dz; if (!this.free(nx, nz)) continue;
        if (strict && (nz * GW + nx) !== goal && !this.walkable(this.cx(nx), this.cz(nz), 0.26)) continue;
        if (dx && dz && (!this.free(cx + dx, cz) || !this.free(cx, cz + dz))) continue;
        const n = nz * GW + nx; const ng = gS[c] + w; if (ng >= gS[n]) continue;
        gS[n] = ng; from[n] = c; h.push(n, ng + Math.hypot(gx - nx, gz - nz));
      }
    }
    if (!found) return null;
    const pts = []; for (let c = goal; c !== -1; c = from[c]) pts.push([this.cx(c % GW), this.cz((c / GW) | 0)]);
    pts.reverse(); pts.push([x1, z1]);
    // 拉直
    const out = []; let i = 0; let cur = [x0, z0];
    while (i < pts.length) {
      let j = pts.length - 1;
      while (j > i && !this.los(cur[0], cur[1], pts[j][0], pts[j][1], strict ? 0.27 : 0.22)) j--;
      out.push(pts[j]); cur = pts[j]; i = j + 1;
    }
    return out;
  }
}
