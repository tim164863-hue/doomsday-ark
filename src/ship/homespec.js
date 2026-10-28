// 小船當「家」的佈局（純資料 + 純計算，無 three.js；node 測試用）。
// 訪客 / 其他帳號看不到郵輪方舟：家就是自己選的那艘小船。模型（fleetmodels.js）放大 k 倍，
// 甲板上用 packer 把工作桌、餐桌、鋪蓋、躺椅、閒聊點、欄杆點排進去，並產生導航網格。
import { NavGrid, CS, GX0, GZ0, GW, GH } from './nav.js';

export const HOME_TYPES = ['skiff', 'speedboat', 'tug', 'patrol', 'icebreaker'];
export const isHomeType = (t) => HOME_TYPES.includes(t);

// 模型座標（+x 船頭）。xr = 可走的 x 範圍；blocks = 固定結構（艙室、桅、絞車…）；hide = 要隱藏的小道具（騰出甲板）
export const SPECS = {
  skiff: { facSc: 0.55, L: 7, W: 2.4, hull: { bow: 0.42, sternW: 0.7 }, k: 3.2, xr: [-3.1, 1.9], margin: 0.4, cap: 3, desks: 0, beds: 0, loungers: 0,
    door: [-1.9, 0], blocks: [[-1.72, -0.67, -0.1, 0.67], [0.9, -0.1, 1.1, 0.1]], hide: [{ r: [-2.95, -1.0, -1.8, 0.95], y: 1.6 }],
    t: { desk: [[0.8, 2.2], [0.8, -2.2], [2.4, -2.2]], galley: [4.2, 0], bed: [-7.6, 0], lounger: [0, 0], land: [-1.0, 3.0], party: [3.4, 0], chat: [[1.4, 0.2], [-7.0, 2.2], [-7.0, -2.2]] },
    fac: [[-8.2, 2.1], [-6.0, 2.1], [-8.2, -2.1], [-6.0, -2.1], [1.4, 3.0]] },
  speedboat: { facSc: 0.6, L: 9.5, W: 3.3, hull: { bow: 0.4, sternW: 0.9 }, k: 2.5, xr: [-4.4, 3.0], margin: 0.35, cap: 4, desks: 0, beds: 0, loungers: 0,
    door: [-3.0, 0], blocks: [[-2.85, -1.05, 0.35, 1.05], [-0.35, -0.2, 0.05, 0.2], [-3.75, -0.2, -3.35, 0.2], [-3.35, -0.45, -2.75, 0.45]],
    hide: [{ r: [-4.4, -1.5, -3.5, -0.55], y: 2.4 }, { r: [-4.1, 0.6, -2.3, 1.6], y: 2.4 }],
    t: { desk: [[1.6, 2.6], [1.6, -2.6], [3.6, 2.2], [3.6, -2.2]], galley: [5.0, 0], bed: [-9.0, 0], lounger: [0, 0], land: [1.0, 3.0], party: [4.0, 0], chat: [[2.4, 0], [-8.0, 2.4], [-8.0, -2.4]] },
    fac: [[-9.6, 2.5], [-9.6, -2.5], [-7.4, 2.9], [-7.4, -2.9], [0.4, 3.0]] },
  tug: { facSc: 0.75, L: 14, W: 5, hull: { bow: 0.3, sternW: 0.9 }, k: 1.6, xr: [-6.4, 5.8], margin: 0.4, cap: 6, desks: 0, beds: 0, loungers: 1,
    door: [-0.3, 0], blocks: [[-0.1, -1.3, 3.3, 1.3], [-3.5, -0.85, -2.5, 0.85], [-5.3, -1.7, -3.9, -1.1], [-5.3, 1.1, -3.9, 1.7]], hide: [],
    t: { desk: [[-2.6, 3.0], [-2.6, -3.0], [-0.6, 3.2], [-0.6, -3.2]], galley: [-2.0, 0], bed: [7.2, 0], lounger: [8.0, 0], land: [-4.0, 3.4], party: [-1.8, 0], chat: [[-1.0, 0], [6.0, 2.0], [6.0, -2.0]] },
    fac: [[-9.6, 2.6], [-9.6, -2.6], [-7.4, 3.0], [-7.4, -3.0], [-4.4, 3.4]] },
  patrol: { facSc: 0.75, L: 18, W: 4.6, hull: { bow: 0.42, sternW: 0.88 }, k: 1.6, xr: [-8.2, -3.3], margin: 0.4, cap: 6, desks: 0, beds: 0, loungers: 1,
    door: [-3.2, 0], blocks: [[-3.0, -1.7, 3.4, 1.7]], hide: [],
    t: { desk: [[-6.0, 2.4], [-6.0, -2.4], [-4.8, 0], [-8.2, 0]], galley: [-9.5, 0], bed: [0, 0], lounger: [-5.0, 0], land: [-4.8, 2.6], party: [-8.5, 0], chat: [[-5.0, 0], [-8.0, 1.5]] },
    fac: [[-9.5, 2.4], [-9.5, -2.4], [-7, 2.5], [-7, -2.5], [-4.6, -2.5]] },
  icebreaker: { facSc: 0.9, L: 26, W: 8.6, hull: { bow: 0.26, sternW: 0.9 }, k: 1.2, xr: [-12.0, -6.3], margin: 0.5, cap: 8, desks: 0, beds: 0, loungers: 2,
    door: [-6.2, 0], blocks: [[-6.0, -3.3, 2.0, 3.3]],
    hide: [],
    t: { desk: [[-7.5, 3.0], [-7.5, -3.0], [-9.0, 0], [-7.0, 0], [-10.5, 3.0]], galley: [-10.0, 0], bed: [0, 0], lounger: [-7.5, 0], land: [-7.0, 3.6], party: [-9.0, 0], chat: [[-8.0, 0], [-10.5, 3.5]] },
    fac: [[-11.0, 3.5], [-11.0, -3.5], [-8.0, 3.7], [-8.0, -3.7], [-6.8, 0]] },
};

function bez(p0, p1, p2, p3, t) { const u = 1 - t; return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3; }
/** 與 fleetmodels.js 的 hullHalfW 相同（模型座標）。 */
export function hullHalfW(L, W, x, { bow = 0.34, sternW = 0.8 } = {}) {
  const hl = L / 2, hw = W / 2, sx = -hl, bx = hl - L * bow; let best = 0, bd = 1e9;
  const segs = [[[sx, hw * sternW], [sx + L * 0.12, hw], [bx - L * 0.2, hw], [bx, hw * 0.92]], [[bx, hw * 0.92], [bx + L * bow * 0.55, hw * 0.7], [hl - L * 0.04, hw * 0.2], [hl, 0]]];
  for (const sg of segs) for (let i = 0; i <= 60; i++) { const t = i / 60, px = bez(sg[0][0], sg[1][0], sg[2][0], sg[3][0], t), d = Math.abs(px - x); if (d < bd) { bd = d; best = bez(sg[0][1], sg[1][1], sg[2][1], sg[3][1], t); } }
  return best;
}

const R4 = (ry) => ({ c: Math.round(Math.cos(ry)), s: Math.round(Math.sin(ry)) });
/** 局部矩形 [x0,z0,x1,z1]（局部 +z = 面向）在朝向 ry（π/2 的倍數）下的世界矩形 */
function wrect(x, z, ry, r) {
  const { c, s } = R4(ry); const pts = [[r[0], r[1]], [r[2], r[1]], [r[0], r[3]], [r[2], r[3]]].map(([lx, lz]) => [x + lx * c + lz * s, z - lx * s + lz * c]);
  return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
}
const rectFree = (nav, r) => { for (let z = r[1] + 0.01; z <= r[3] - 0.01 + CS / 2; z += CS / 2) for (let x = r[0] + 0.01; x <= r[2] - 0.01 + CS / 2; x += CS / 2) if (!nav.free(nav.ix(Math.min(x, r[2] - 0.01)), nav.iz(Math.min(z, r[3] - 0.01)))) return false; return true; };
export function blockWorldRect(nav, r) {
  for (let iz = nav.iz(r[1]); iz <= nav.iz(r[3] - 1e-6); iz++) for (let ix = nav.ix(r[0]); ix <= nav.ix(r[2] - 1e-6); ix++) if (nav.inb(ix, iz)) { nav.cells[iz * GW + ix] = 0; nav.base[iz * GW + ix] = 0; }
}
const yawTo = (ax, az, bx, bz) => Math.atan2(bx - ax, bz - az);

// 局部形狀（局部 +z 為面向方向）
const FP = {
  desk:    { need: [-0.95, -0.9, 0.95, 1.55], block: [-0.9, 0.5, 0.9, 1.45] },     // 座位在原點，桌在前方 0.85
  galley:  { need: [-1.6, -1.5, 1.6, 1.5], block: [-0.55, -0.45, 0.55, 0.45] },
  deskC:   { need: [-0.65, -0.5, 0.65, 1.3], block: [-0.55, 0.4, 0.55, 1.2] },   // 窄桌（深 0.6，只在放不下一般桌時用）
  bed:     { need: [-0.55, -1.15, 0.55, 1.15], block: [-0.45, -1.0, 0.45, 1.0] },
  lounger: { need: [-0.55, -1.1, 0.55, 1.1], block: [-0.4, -1.0, 0.4, 1.0] },
};

/** 產生某船型的家：導航網格、阻擋矩形、所有 POI。 */
export function buildHome(type) {
  const S = SPECS[type]; if (!S) throw new Error('no home spec for ' + type); const k = S.k;
  const hw = (x) => hullHalfW(S.L, S.W, x / k, S.hull) * k;
  const x0 = S.xr[0] * k, x1 = S.xr[1] * k; const nav = new NavGrid(); const poly = [];
  for (let iz = 0; iz < GH; iz++) for (let ix = 0; ix < GW; ix++) {
    const x = nav.cx(ix), z = nav.cz(iz); if (x < x0 || x > x1) continue; if (Math.abs(z) <= hw(x) - S.margin) { nav.cells[iz * GW + ix] = 1; nav.base[iz * GW + ix] = 1; }
  }
  for (let x = x0; x <= x1 + 1e-6; x += 0.5) poly.push([x, hw(x) - S.margin + 0.3]); for (let x = x1; x >= x0 - 1e-6; x -= 0.5) poly.push([x, -(hw(x) - S.margin + 0.3)]);
  const blocks = S.blocks.map((b) => [b[0] * k, b[1] * k, b[2] * k, b[3] * k]); for (const b of blocks) blockWorldRect(nav, b);
  const pois = { desks: [], beds: [], seats: [], loungers: [], chat: [], rail: [], stool: [] }; const props = { desks: [], tables: [], beds: [], loungers: [] };
  // 以 start 為起點的可走連通區（與 A* 同規則）
  const WR = 0.16; // 玩家半徑：走道必須真的走得過去（只有 1 格寬的縫不算）
  const comp = (sx, sz) => {
    const seen = new Uint8Array(GW * GH); const st = nav.nearestFree(sx, sz, 8, WR) || nav.nearestFree(sx, sz, 8); if (!st) return seen; const q = [nav.ix(st[0]) + nav.iz(st[1]) * GW]; seen[q[0]] = 1;
    for (let h = 0; h < q.length; h++) { const i = q[h], ix = i % GW, iz = (i / GW) | 0; for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) { const jx = ix + dx, jz = iz + dz; if (!nav.inb(jx, jz)) continue; const j = jx + jz * GW; if (seen[j] || !nav.free(jx, jz)) continue; if (!nav.walkable(nav.cx(jx), nav.cz(jz), WR)) continue; if (dx && dz && (!nav.free(ix + dx, iz) || !nav.free(ix, iz + dz))) continue; seen[j] = 1; q.push(j); } }
    return seen;
  };
  const must = []; // 已放好、必須維持可到達的點
  const okReach = (seen, extra) => [...must, ...(extra || [])].every((m) => { const q = nav.nearestFree(m[0], m[1], 2, WR); return q && seen[nav.ix(q[0]) + nav.iz(q[1]) * GW]; });
  const startPt = S.t.land;
  const place = (kind, target, rys, exitFn, extra = 0.0, LIM = 60) => {
    const fp = typeof kind === 'string' ? FP[kind] : kind; const cands = []; const R = 16;
    for (let dz = -R; dz <= R; dz += 0.25) for (let dx = -R; dx <= R; dx += 0.25) {
      const x = target[0] + dx, z = target[1] + dz; const d = Math.hypot(dx, dz);
      for (const ry of rys) { const w = wrect(x, z, ry, [fp.need[0] - extra, fp.need[1] - extra, fp.need[2] + extra, fp.need[3] + extra]); if (rectFree(nav, w)) { cands.push({ x, z, ry, d }); break; } }
    }
    cands.sort((a, b) => a.d - b.d);
    for (let i = 0; i < Math.min(cands.length, LIM); i++) {
      const c = cands[i]; const save = nav.cells.slice(), saveB = nav.base.slice(); blockWorldRect(nav, wrect(c.x, c.z, c.ry, fp.block));
      if (okReach(comp(startPt[0], startPt[1]), exitFn ? [exitFn(c)] : [[c.x, c.z]])) return c; nav.cells.set(save); nav.base.set(saveB);
    }
    return null;
  };
  // 甲板兩端（船尾 / 船頭）一定要保持走得到，不能被桌子封死
  { const c0 = comp(startPt[0], startPt[1]); for (const px of [x0 + 1.6, x1 - 2.4]) { const q = nav.nearestFree(px, 0, 1.2, WR); if (q && c0[nav.ix(q[0]) + nav.iz(q[1]) * GW]) must.push(q); }
    // 船頭 / 船尾最遠的可走格（含繞過艙室的舷側走道）也要一直走得到：家具不能把走道封死
    let lo = null, hi = null; for (let iz = 0; iz < GH; iz++) for (let ix = 0; ix < GW; ix++) if (c0[ix + iz * GW] && nav.walkable(nav.cx(ix), nav.cz(iz), 0.24)) { const x = nav.cx(ix); if (!lo || x < lo[0]) lo = [x, nav.cz(iz)]; if (!hi || x > hi[0]) hi = [x, nav.cz(iz)]; }
    for (const q of [lo, hi]) if (q) must.push(q); }
  // 餐桌（4 座）
  { const g = place('galley', S.t.galley, [0, Math.PI / 2]); if (g) { props.tables.push({ x: g.x, z: g.z, ry: g.ry });
      for (const [lx, lz] of [[0, 0.95], [0, -0.95], [1.0, 0], [-1.0, 0]]) { const { c, s } = R4(g.ry); const x = g.x + lx * c + lz * s, z = g.z - lx * s + lz * c; pois.seats.push({ x, z, face: yawTo(x, z, g.x, g.z), table: props.tables.length - 1 }); must.push([x, z]); }
      pois.stool.push(...pois.seats.slice(0, 2).map((p) => ({ ...p }))); } }
  // 工作桌：先放 3 張（確保每艘都有位子），設施之後再補其餘的
    const placeDesks = (a0, a1) => { for (let i = a0; i < a1; i++) { const t = S.t.desk[i % S.t.desk.length]; const toward = Math.sign(t[1]) || 1; const rys = [toward > 0 ? 0 : Math.PI, Math.PI / 2, -Math.PI / 2, toward > 0 ? Math.PI : 0]; let p = place('desk', t, rys, null, 0, 600); if (!p) { p = place('deskC', t, rys, null, 0, 600); if (p) p.compact = true; } if (p) { pois.desks.push({ key: 'd' + i, x: p.x, z: p.z, face: p.ry, ry: p.ry }); props.desks.push(p); must.push([p.x, p.z]); } } };
  placeDesks(0, Math.min(3, S.desks));
  // 設施（淨水 / 溫室 / 發電 / 醫務 / 工坊）：縮小的設備位，沿舷側放，站位在前方 0.9m；順序同 FAC_ORDER
  const FRAW = [[1.3, 0.8], [1.4, 1.0], [1.3, 0.8], [1.3, 1.0], [1.4, 0.8]]; const facs = [];
  FRAW.forEach(([fw, fd], i) => { let got = null, sc = S.facSc;
    for (const m of [1, 0.82, 0.68, 0.55, 0.45]) { sc = S.facSc * m; const a = fw * sc, b = fd * sc; const fp = { need: [-a - 0.05, -b - 0.05, a + 0.05, b + 0.8], block: [-a, -b, a, b] };
      got = place(fp, S.fac[i], [0, Math.PI, Math.PI / 2, -Math.PI / 2], (c) => { const q = R4(c.ry); const lz = b + 0.55; return [c.x + q.s * lz, c.z + q.c * lz]; }, 0, 400); if (got) break; }
    facs.push(got ? { x: got.x, z: got.z, ry: got.ry, sc, ok: true } : { x: S.fac[i][0], z: S.fac[i][1], ry: 0, sc: S.facSc * 0.45, ok: false }); });
  placeDesks(Math.min(3, S.desks), S.desks);
  // 鋪蓋
  for (let i = 0; i < S.beds; i++) { const p = place('bed', S.t.bed, [0, Math.PI], (c) => { const q = R4(c.ry); return [c.x - q.s * 1.45, c.z - q.c * 1.45]; }); if (p) { const { c, s } = R4(p.ry); props.beds.push(p); must.push([p.x - s * 1.45, p.z - c * 1.45]); pois.beds.push({ x: p.x, z: p.z, ry: p.ry, head: [s, c], exit: { x: p.x - s * 1.45, z: p.z - c * 1.45 } }); } }
  for (let i = 0; i < S.loungers; i++) { const p = place('lounger', S.t.lounger, [Math.PI / 2, -Math.PI / 2, 0, Math.PI], (c) => { const q = R4(c.ry); return [c.x + q.s * 1.45, c.z + q.c * 1.45]; }); if (p) { const { c, s } = R4(p.ry); props.loungers.push(p); must.push([p.x + s * 1.45, p.z + c * 1.45]); pois.loungers.push({ x: p.x, z: p.z, face: p.ry, head: [-s, -c] }); } }
  // 工作桌
  // 閒聊點：目標附近最近的可走格（且四周留空）
  const cp = comp(startPt[0], startPt[1]); const inC = (x, z) => { const q = nav.nearestFree(x, z, 2, WR); return !!q && !!cp[nav.ix(q[0]) + nav.iz(q[1]) * GW]; };
  for (const t of S.t.chat) { const q = nav.nearestFree(t[0], t[1], 3); if (q && nav.walkable(q[0], q[1], 0.4) && inC(q[0], q[1]) && pois.chat.every((c) => Math.hypot(c.x - q[0], c.z - q[1]) > 2)) pois.chat.push({ x: q[0], z: q[1] }); }
  { const cells = []; for (let iz = 0; iz < GH; iz++) for (let ix = 0; ix < GW; ix++) if (cp[ix + iz * GW] && nav.walkable(nav.cx(ix), nav.cz(iz), 0.4)) cells.push([nav.cx(ix), nav.cz(iz)]);
    while (pois.chat.length < 4 && cells.length) { let bst = null, bs = -1; for (const c of cells) { const d = Math.min(9, ...pois.chat.map((p) => Math.hypot(p.x - c[0], p.z - c[1])), ...pois.seats.map((p) => Math.hypot(p.x - c[0], p.z - c[1]) * 1.5)); if (d > bs) { bs = d; bst = c; } } if (!bst || bs < 2) break; pois.chat.push({ x: bst[0], z: bst[1] }); } }
  // 欄杆點：沿舷側（有些船舷邊被甲板物件擋住 → 逐步往內縮，至少找出 1 個，釣魚小遊戲才有地方玩）
  for (const inset of [0.35, 0.7, 1.1, 1.6, 2.2]) { if (pois.rail.length) break; for (let x = x0 + 1.0; x < x1 - 0.5; x += 1.6) for (const sd of [-1, 1]) { const z = sd * (hw(x) - S.margin - inset); if (nav.walkable(x, z, 0.28) && inC(x, z)) pois.rail.push({ x, z, face: sd > 0 ? 0 : Math.PI }); } }
  const start0 = nav.nearestFree(startPt[0], startPt[1], 8); const land = nav.nearestFree(S.t.land[0], S.t.land[1], 8) || [0, 0]; const party = nav.nearestFree(S.t.party[0], S.t.party[1], 8) || [0, 0]; const start = start0 || [0, 0];
  const door = nav.nearestFree(S.door[0] * k, S.door[1] * k, 6) || [0, 0];
  // 被家具 / 艙室圍死、走不到的小角落：直接封起來，免得出現「看得到走不到」的死格
  { const cs = comp(startPt[0], startPt[1]); for (let j = 0; j < GW * GH; j++) if (nav.cells[j] === 1 && !cs[j]) { nav.cells[j] = 0; nav.base[j] = 0; } }
  return { type, k, nav, door, poly, blocks, pois, props, facs, facSc: S.facSc, land, party, start, cap: S.cap, spec: S, hw };
}
