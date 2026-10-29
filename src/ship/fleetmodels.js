// 艦隊 3D 模型：6 種小型船（程序式、低多邊形但有細節）。座標：+x 為船頭，y 向上，水線在 y=0；單位 = 公尺。
import * as THREE from 'three';
import { patchShip } from './wasteland.js';

const MAT = {};
const mat = (hex, r = 0.6, m = 0.05, extra = {}) => { const k = hex + ':' + r + ':' + m + JSON.stringify(extra); return MAT[k] || (MAT[k] = new THREE.MeshStandardMaterial({ color: hex, roughness: r, metalness: m, ...extra })); };
const GLASS = () => mat(0x8fd4ee, 0.12, 0.2, { transparent: true, opacity: 0.55 });
const LAMP = () => mat(0xfff2b0, 0.4, 0, { emissive: 0xffd36b, emissiveIntensity: 0.9 });

const box = (g, m, w, h, d, x, y, z, ry = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.rotation.y = ry; o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
const cyl = (g, m, rt, rb, h, x, y, z, seg = 14, rx = 0, rz = 0) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y, z); o.rotation.x = rx; o.rotation.z = rz; o.castShadow = true; g.add(o); return o; };
const sph = (g, m, r, x, y, z, sx = 1, sy = 1, sz = 1) => { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), m); o.position.set(x, y, z); o.scale.set(sx, sy, sz); o.castShadow = true; g.add(o); return o; };

/** 船殼：頂視輪廓（船尾方、船頭尖）擠出成實體，再縮小一份當水下龍骨。bow=船頭尖的比例、sternW=船尾寬度比例 */
export function hullSolid(L, W, H, { bow = 0.34, sternW = 0.8, belly = 0.5, keel = 0.55 } = {}) {
  const hl = L / 2, hw = W / 2; const sh = new THREE.Shape(); const sx = -hl, bx = hl - L * bow;
  sh.moveTo(sx, -hw * sternW); sh.lineTo(sx, hw * sternW); sh.bezierCurveTo(sx + L * 0.12, hw, bx - L * 0.2, hw, bx, hw * 0.92); sh.bezierCurveTo(bx + L * bow * 0.55, hw * 0.7, hl - L * 0.04, hw * 0.2, hl, 0);
  sh.bezierCurveTo(hl - L * 0.04, -hw * 0.2, bx + L * bow * 0.55, -hw * 0.7, bx, -hw * 0.92); sh.bezierCurveTo(bx - L * 0.2, -hw, sx + L * 0.12, -hw, sx, -hw * sternW);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: H, bevelEnabled: true, bevelThickness: Math.min(0.12, H * 0.12), bevelSize: Math.min(0.12, W * 0.04), bevelSegments: 2, curveSegments: 18 });
  geo.rotateX(-Math.PI / 2); // 擠出方向朝上 (y)；形狀 y → -z
  const under = geo.clone(); under.scale(keel, belly, keel); return { geo, under, H };
}
function addHull(g, L, W, H, topMat, lowMat, opts = {}) {
  const h = hullSolid(L, W, H, opts); const top = new THREE.Mesh(h.geo, topMat); const dy = opts.deckY != null ? opts.deckY - H : -H * 0.38; top.position.y = dy; top.castShadow = true; top.receiveShadow = true; g.add(top);
  const under = new THREE.Mesh(h.under, lowMat); under.position.y = dy - H * 0.55; g.add(under);
  return top;
}
const stripe = (g, m, L, W, y, h = 0.18, opts = {}) => { const geo = hullSolid(L * 1.002, W * 1.003, h, opts).geo; const o = new THREE.Mesh(geo, m); o.position.y = y; g.add(o); };
function rail(g, L, W, y, m, posts = 9, bow = 0.34) {
  const hw = W / 2 * 0.86; const xs = -L / 2 + 0.3, xe = L / 2 - L * bow - 0.2;
  for (const sd of [-1, 1]) {
    for (let i = 0; i <= posts; i++) { const x = xs + (xe - xs) * i / posts; cyl(g, m, 0.025, 0.025, 0.7, x, y + 0.35, sd * hw, 5); }
    box(g, m, xe - xs, 0.04, 0.04, (xs + xe) / 2, y + 0.7, sd * hw); box(g, m, xe - xs, 0.03, 0.03, (xs + xe) / 2, y + 0.38, sd * hw);
  }
}
function deckPlanks(g, L, W, y, m1, m2, bow = 0.34) { const n = Math.floor(W / 0.34); const xs = -L / 2 + 0.2, xe = L / 2 - L * bow * 0.6; for (let i = 0; i < n; i++) { const z = -W / 2 * 0.8 + (W * 0.8 * (i + 0.5)) / n; box(g, i % 2 ? m1 : m2, xe - xs, 0.03, W * 0.8 / n - 0.02, (xs + xe) / 2, y, z); } }
function porthole(g, x, y, z, side, m = mat(0x1d2a38, 0.3, 0.4)) { const o = cyl(g, m, 0.12, 0.12, 0.05, x, y, z + side * 0.01, 12, Math.PI / 2); o.rotation.z = 0; o.rotation.x = Math.PI / 2; }
function lamp(g, x, y, z, r = 0.1) { sph(g, LAMP(), r, x, y, z); }
function flag(g, x, y, z, color) { cyl(g, mat(0xdddddd), 0.015, 0.015, 1.0, x, y + 0.5, z, 4); box(g, mat(color, 0.8), 0.45, 0.28, 0.01, x - 0.24, y + 0.88, z); }

// ---------------------------------------------------------------- 6 種船
function skiff(g, lv) {
  const wood = mat(0x2f6f9e, 0.7), white = mat(0xf0ece2, 0.6), dark = mat(0x3a2a1c, 0.8), rope = mat(0xc9b58a, 0.9), steel = mat(0x777c82, 0.4, 0.6);
  const L = 7, W = 2.4; addHull(g, L, W, 1.1, wood, mat(0x1c3a52, 0.8), { bow: 0.42, sternW: 0.7 }); stripe(g, white, L, W, 0.58, 0.14);
  deckPlanks(g, L, W, 0.62, mat(0xc89a5e, 0.8), mat(0xb88850, 0.8), 0.42);
  box(g, white, 1.5, 1.2, 1.3, -0.9, 1.25, 0, 0); box(g, mat(0x2f6f9e, 0.7), 1.64, 0.08, 1.44, -0.9, 1.88, 0); // 駕駛艙 + 屋頂
  for (const sz of [-1, 1]) box(g, GLASS(), 0.6, 0.45, 0.02, -0.5, 1.45, sz * 0.66); box(g, GLASS(), 0.02, 0.45, 0.9, -0.14, 1.45, 0);
  cyl(g, dark, 0.05, 0.06, 3.0, 1.0, 2.1, 0, 8); box(g, dark, 0.06, 0.06, 2.2, 1.0, 3.1, 0); cyl(g, rope, 0.01, 0.01, 2.4, 1.0, 2.0, 0.95, 4, 0, 0.35); // 桅 + 吊桿
  for (let i = 0; i < 3; i++) box(g, mat(0xb88850, 0.8), 0.55, 0.35, 0.45, -2.3 + i * 0.1, 0.85 + i * 0.35 * (i > 1), -0.65 + i * 0.5, i * 0.2); // 魚箱
  cyl(g, steel, 0.06, 0.06, 0.8, -3.6, 0.6, 0, 8); box(g, mat(0x222222, 0.5), 0.5, 0.5, 0.35, -3.62, 0.55, 0); // 舷外機
  lamp(g, 1.0, 3.2, 0, 0.1); rail(g, L, W, 0.62, steel, 8, 0.42); flag(g, -0.9, 1.9, 0.5, 0xe84a3a);
  if (lv >= 2) { box(g, mat(0xe0c95a, 0.4, 0.5), L * 0.7, 0.05, 0.05, 0, 0.9, W / 2 * 0.98); }
  if (lv >= 3) { cyl(g, steel, 0.04, 0.04, 0.4, 0.2, 2.1, 0, 6); sph(g, LAMP(), 0.16, 0.2, 2.35, 0); }
}
// ---- 洋流號（快艇款）：橘色圓胖漁船風格，黑色下船殼、白色舷緣、繩索花環、帆上「順」、船尾旗幟「洋流」
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const CJK = "'Noto Sans CJK TC','Noto Sans TC','PingFang TC','Microsoft JhengHei','Heiti TC','WenQuanYi Zen Hei',sans-serif";
/** 單面貼圖面板：pts = [[x,y],...]（船座標 x,y），side = ±1（法線朝 ±z），u 方向讓兩面都能正讀 */
function panel(g, pts, tex, side, z = 0, o = {}) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const idx = pts.length === 4 ? [0, 1, 2, 0, 2, 3] : [0, 1, 2];
  let area = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; area += (a[0] * (side < 0 ? -1 : 1)) * b[1] - (b[0] * (side < 0 ? -1 : 1)) * a[1]; }
  const ord = idx.slice(); if (area <= 0) for (let i = 0; i < ord.length; i += 3) { const t = ord[i + 1]; ord[i + 1] = ord[i + 2]; ord[i + 2] = t; }
  const pos = [], uv = [];
  for (const p of pts) { pos.push(p[0], p[1], z + side * 0.015); uv.push(side < 0 ? (x1 - p[0]) / (x1 - x0) : (p[0] - x0) / (x1 - x0), (p[1] - y0) / (y1 - y0)); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(ord); geo.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.28, roughness: 0.85, side: THREE.FrontSide, ...o });
  const mesh = new THREE.Mesh(geo, m); mesh.castShadow = true; g.add(mesh); return mesh;
}
function strut(g, m, a, b, r = 0.02) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), len = d.length();
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 5), m); o.position.copy(A.clone().add(B).multiplyScalar(0.5));
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); g.add(o); return o;
}
function festoon(g, m, pts, r = 0.05) { const c = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p))); const o = new THREE.Mesh(new THREE.TubeGeometry(c, 20, r, 5), m); o.castShadow = true; g.add(o); return o; }
function bez(p0, p1, p2, p3, t) { const u = 1 - t; return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3; }
/** hullSolid 頂視輪廓在 x 處的半寬（用來把舷窗、繩索貼在船殼上） */
function hullHalfW(L, W, x, { bow = 0.34, sternW = 0.8 } = {}) {
  const hl = L / 2, hw = W / 2, sx = -hl, bx = hl - L * bow; let best = 0, bd = 1e9;
  const segs = [[[sx, hw * sternW], [sx + L * 0.12, hw], [bx - L * 0.2, hw], [bx, hw * 0.92]], [[bx, hw * 0.92], [bx + L * bow * 0.55, hw * 0.7], [hl - L * 0.04, hw * 0.2], [hl, 0]]];
  for (const sg of segs) for (let i = 0; i <= 60; i++) { const t = i / 60, px = bez(sg[0][0], sg[1][0], sg[2][0], sg[3][0], t), d = Math.abs(px - x); if (d < bd) { bd = d; best = bez(sg[0][1], sg[1][1], sg[2][1], sg[3][1], t); } }
  return best;
}
function speedboat(g, lv) {
  const orange = mat(0xf0661a, 0.5, 0.05, { emissive: 0xf0661a, emissiveIntensity: 0.2 }), orange2 = mat(0xe0581a, 0.55, 0.05, { emissive: 0xe0581a, emissiveIntensity: 0.18 }), black = mat(0x16181c, 0.6), white = mat(0xf4f1e8, 0.5), cream = mat(0xf0e4c6, 0.8), brown = mat(0x7a4a26, 0.7), rope = mat(0xb99358, 0.95), dark = mat(0x16222f, 0.25, 0.3), steel = mat(0x8c9096, 0.4, 0.6), wood = mat(0xb27a44, 0.8), amber = mat(0xffb020, 0.35, 0, { emissive: 0xff9a10, emissiveIntensity: 0.8 });
  const L = 9.5, W = 3.3, DK = 1.37, HO = { bow: 0.4, sternW: 0.9 }; addHull(g, L, W, 1.6, orange, black, { ...HO, belly: 0.5, keel: 0.62, deckY: DK - 0.12 });
  stripe(g, black, L, W, -0.25, 0.5, HO); // 下船殼黑帶（水線附近）
  stripe(g, white, L, W, 0.62, 0.05, HO); stripe(g, white, L, W, DK - 0.32, 0.18, HO); // 細白線 + 白舷緣
  if (lv >= 2) stripe(g, mat(0xe8c74a, 0.4, 0.4), L, W, 0.9, 0.06, HO);
  box(g, mat(0xa07a4c, 0.85), L * 0.6, 0.03, W * 0.66, -1.2, DK + 0.015, 0); // 甲板
  // 船頭高起的橘色船首塊（白頂）
  box(g, orange, 0.55, 0.62, 0.9, L / 2 - 0.55, DK + 0.3, 0).scale.set(1, 1, 1); box(g, white, 0.6, 0.08, 0.95, L / 2 - 0.55, DK + 0.64, 0);
  // 圓舷窗（白框 + 深色玻璃）
  for (const sd of [-1, 1]) for (const px of [2.15, 0.65, -3.4]) {
    const zz = sd * (hullHalfW(L, W, px, HO) + 0.17); const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 8, 16), white); ring.position.set(px, 0.42, zz); g.add(ring);
    const gl = cyl(g, dark, 0.2, 0.2, 0.05, px, 0.42, zz - sd * 0.01, 14, Math.PI / 2);
  }
  // 繩索花環（舷側）
  for (const sd of [-1, 1]) {
    const zz = (x) => sd * (hullHalfW(L, W, x, HO) + 0.17);
    const segs = [[3.2, 1.2], [1.2, -1.3], [-1.3, -3.9]]; let prev = null;
    for (const [a, b] of segs) {
      const pts = []; for (let i = 0; i <= 6; i++) { const t = i / 6, x = a + (b - a) * t; pts.push([x, DK - 0.12 - Math.sin(Math.PI * t) * 0.36, zz(x)]); } festoon(g, rope, pts, 0.06);
      cyl(g, rope, 0.07, 0.07, 0.16, a, DK - 0.08, zz(a), 8, Math.PI / 2); prev = b;
    }
  }
  // 駕駛艙：白艙身、橘色屋頂、深色窗
  const CX = -1.25, CW = 2.9, CH = 1.15, CD = 2.2;
  box(g, white, CW, CH, CD, CX, DK + CH / 2, 0); box(g, orange2, CW + 0.02, 0.16, CD + 0.02, CX, DK + 0.1, 0); // 艙底橘帶
  box(g, orange, CW + 0.36, 0.14, CD + 0.34, CX, DK + CH + 0.07, 0); box(g, white, CW + 0.4, 0.04, CD + 0.38, CX, DK + CH - 0.01, 0);
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { const wx = CX + 1.0 - i * 0.95; box(g, dark, 0.7, 0.5, 0.04, wx, DK + 0.68, sd * (CD / 2 + 0.02)); box(g, white, 0.76, 0.05, 0.05, wx, DK + 0.95, sd * (CD / 2 + 0.03)); }
  for (let i = -1; i <= 1; i += 1) box(g, dark, 0.04, 0.5, 0.52, CX + CW / 2 + 0.02, DK + 0.68, i * 0.7); // 前窗
  box(g, white, 0.05, 0.05, CD - 0.1, CX + CW / 2 + 0.03, DK + 0.97, 0);
  // 屋頂：琥珀信標、灰色設備箱、探照燈
  cyl(g, steel, 0.16, 0.18, 0.1, CX - 0.55, DK + CH + 0.19, 0.55, 12); const bc = cyl(g, amber, 0.13, 0.13, 0.22, CX - 0.55, DK + CH + 0.35, 0.55, 12); sph(g, amber, 0.13, CX - 0.55, DK + CH + 0.46, 0.55);
  box(g, mat(0x9aa0a8, 0.6, 0.3), 0.9, 0.55, 0.8, CX - 1.0, DK + CH + 0.4, -0.55); box(g, mat(0x80868e, 0.6, 0.3), 0.7, 0.12, 0.6, CX - 1.0, DK + CH + 0.72, -0.55);
  box(g, steel, 0.22, 0.2, 0.2, CX + 1.0, DK + CH + 0.25, 0.6); lamp(g, CX + 1.12, DK + CH + 0.25, 0.6, 0.09);
  // 兩根褐色桅杆（前桅掛三角帆、後桅掛旗幟）+ 金屬箍
  const MX = -0.15, MH = 5.2; cyl(g, brown, 0.075, 0.1, MH, MX, DK + MH / 2, 0, 8); const RX = -3.55, RH = 5.4; cyl(g, brown, 0.07, 0.095, RH, RX, DK + RH / 2, 0, 8);
  for (const [mx, hh] of [[MX, MH], [RX, RH]]) for (const f of [0.35, 0.7, 0.97]) cyl(g, steel, 0.105, 0.105, 0.1, mx, DK + hh * f, 0, 8);
  lamp(g, MX, DK + MH + 0.12, 0, 0.12); lamp(g, RX, DK + RH + 0.12, 0, 0.12);
  // 橘色三角帆 + 「順」
  const sy0 = DK + 2.7, sy1 = DK + 5.0, sx2 = 3.0; const tri = [[MX, sy1], [MX, sy0], [MX + sx2, sy0 + 0.4]];
  for (const side of [-1, 1]) {
    const tex = canvasTex(512, 512, (x, w, h) => {
      const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f87822'); gr.addColorStop(1, '#e85a14'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
      x.strokeStyle = 'rgba(120,40,0,.18)'; x.lineWidth = 3; for (let i = 1; i < 5; i++) { x.beginPath(); x.moveTo(0, h * i / 5); x.lineTo(w, h * i / 5 + 20); x.stroke(); }
      // 字放在三角形內：船座標 x≈MX+0.95、y≈中段
      const cu = 0.95 / sx2, cv = ((sy0 + 1.15) - sy0) / (sy1 - sy0); const px = (side < 0 ? 1 - cu : cu) * w, py = (1 - cv) * h;
      x.font = `900 ${Math.round(h * 0.4)}px ${CJK}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff4e6'; x.strokeStyle = '#fff4e6'; x.lineWidth = 7; x.strokeText('順', px, py); x.fillText('順', px, py);
    });
    panel(g, tri, tex, side, 0.0);
  }
  box(g, brown, sx2 + 0.1, 0.07, 0.07, MX + sx2 / 2, sy0 + 0.2, 0).rotation.z = Math.atan2(0.4, sx2); // 帆桁
  strut(g, rope, [MX, sy1 - 0.05, 0.02], [L / 2 - 0.4, DK + 0.65, 0], 0.018); strut(g, rope, [MX + sx2, sy0 + 0.4, 0], [L / 2 - 0.6, DK + 0.7, 0.0], 0.02); // 前支索
  strut(g, rope, [MX, DK + 3.2, 0.03], [MX + 0.9, DK + 0.1, 1.2], 0.015); strut(g, rope, [MX, DK + 3.2, -0.03], [MX + 0.9, DK + 0.1, -1.2], 0.015);
  strut(g, rope, [MX, sy1, 0], [RX, DK + RH - 0.2, 0], 0.016); strut(g, rope, [RX, DK + RH - 0.1, 0], [-L / 2 + 0.2, DK + 0.4, 0], 0.016);
  // 旗幟「洋流」：米色底橘邊、直書黑字，掛在後桅橫桿上
  const bx0 = RX, bx1 = RX - 1.5, by1 = DK + RH - 0.3, by0 = DK + 2.55; box(g, brown, 1.75, 0.07, 0.07, (bx0 + bx1) / 2 - 0.1, by1 + 0.08, 0); cyl(g, steel, 0.1, 0.1, 0.1, bx1 - 0.2, by1 + 0.08, 0, 6, 0, Math.PI / 2);
  const btex = canvasTex(256, 512, (x, w, h) => {
    x.fillStyle = '#f0e4c6'; x.fillRect(0, 0, w, h); x.strokeStyle = '#f0661a'; x.lineWidth = 16; x.strokeRect(8, 8, w - 16, h - 16);
    x.fillStyle = 'rgba(150,110,60,.12)'; for (let i = 0; i < 40; i++) x.fillRect(Math.random() * w, Math.random() * h, 30, 2);
    x.font = `900 ${Math.round(w * 0.62)}px ${CJK}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#16120e'; x.strokeStyle = '#16120e'; x.lineWidth = 8;
    x.strokeText('洋', w / 2, h * 0.3); x.fillText('洋', w / 2, h * 0.3); x.strokeText('流', w / 2, h * 0.7); x.fillText('流', w / 2, h * 0.7);
  });
  for (const side of [-1, 1]) panel(g, [[bx0, by1], [bx1, by1], [bx1, by0], [bx0, by0]], btex, side, 0.0, { roughness: 0.9 });
  strut(g, rope, [RX, DK + RH - 0.5, 0], [bx1, by0 - 0.05, 0], 0.012);
  // 船尾：舵輪、救生圈、橘色排氣管、木箱
  const wx = -3.05, wy = DK + 0.85; const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.045, 8, 20), wood); wheel.position.set(wx, wy, 0.0); g.add(wheel);
  for (let i = 0; i < 4; i++) { const sp = box(g, wood, 0.8, 0.04, 0.04, wx, wy, 0); sp.rotation.z = i * Math.PI / 4; } for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; box(g, wood, 0.05, 0.05, 0.14, wx + Math.cos(a) * 0.46, wy + Math.sin(a) * 0.46, 0); }
  cyl(g, steel, 0.06, 0.06, 0.2, wx, wy, 0.0, 8, Math.PI / 2); box(g, brown, 0.1, 0.5, 0.1, wx, DK + 0.25, 0);
  { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 10, 20), orange); ring.position.set(-2.55, DK + 0.62, -CD / 2 - 0.14); g.add(ring); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; box(g, white, 0.22, 0.2, 0.2, -2.55 + Math.cos(a) * 0.3, DK + 0.62 + Math.sin(a) * 0.3, -CD / 2 - 0.14).rotation.z = a + Math.PI / 2; } }
  cyl(g, orange, 0.26, 0.28, 1.2, -4.0, DK + 0.6, -1.05, 12); cyl(g, steel, 0.3, 0.3, 0.12, -4.0, DK + 1.24, -1.05, 12);
  box(g, wood, 0.7, 0.55, 0.6, -3.7, DK + 0.3, 1.05); box(g, mat(0x8d949b, 0.6, 0.3), 0.55, 0.42, 0.5, -3.6, DK + 0.76, 1.0, 0.3); box(g, wood, 0.5, 0.45, 0.5, -2.6, DK + 0.25, 1.25);
  // 船尾與兩側矮白欄杆
  for (const sd of [-1, 1]) { box(g, white, 3.2, 0.05, 0.05, -2.4, DK + 0.55, sd * (W / 2 * 0.86)); for (let i = 0; i <= 5; i++) cyl(g, white, 0.025, 0.025, 0.55, -4.0 + i * 0.64, DK + 0.28, sd * (W / 2 * 0.86), 5); }
  box(g, white, 0.05, 0.05, W * 0.8, -L / 2 + 0.28, DK + 0.55, 0);
  if (lv >= 3) { flag(g, MX, DK + MH + 0.1, 0, 0xffd23a); box(g, steel, 0.3, 0.25, 0.3, CX + 1.2, DK + CH + 0.3, -0.6); lamp(g, CX + 1.38, DK + CH + 0.32, -0.6, 0.11); }
}
function tug(g, lv) {
  const red = mat(0xb02a22, 0.55), black = mat(0x1c1f24, 0.7), white = mat(0xeeeeea, 0.5), steel = mat(0x6a7078, 0.45, 0.6), tire = mat(0x111111, 0.95), yellow = mat(0xe8b923, 0.5), deck = mat(0x5a606a, 0.8);
  const L = 14, W = 5; addHull(g, L, W, 2.0, red, black, { bow: 0.3, sternW: 0.9, belly: 0.5, deckY: 1.5 }); stripe(g, black, L, W, 1.15, 0.28); stripe(g, white, L, W, 1.55, 0.1);
  box(g, deck, L * 0.76, 0.05, W * 0.78, -0.8, 1.55, 0);
  box(g, white, 3.4, 1.5, 3.2, 1.6, 2.3, 0); box(g, white, 3.0, 1.3, 2.8, 1.55, 3.75, 0); box(g, black, 3.3, 0.1, 3.1, 1.55, 4.45, 0); // 兩層駕駛室
  for (let i = -2; i <= 2; i++) box(g, GLASS(), 0.05, 0.6, 0.45, 3.12, 3.9, i * 0.5); for (const sz of [-1, 1]) box(g, GLASS(), 2.3, 0.6, 0.05, 1.6, 3.9, sz * 1.42);
  cyl(g, black, 0.5, 0.58, 1.8, -0.8, 3.6, 0, 14); cyl(g, red, 0.52, 0.52, 0.3, -0.8, 4.2, 0, 14); cyl(g, black, 0.5, 0.5, 0.15, -0.8, 4.55, 0, 14); // 煙囪
  // A 型吊架 + 絞車（打撈用）
  for (const sz of [-1, 1]) { const o = box(g, yellow, 0.18, 4.4, 0.18, -4.6, 3.6, sz * 1.4); o.rotation.z = 0.3; }
  box(g, yellow, 0.2, 0.2, 3.0, -3.7, 5.7, 0); cyl(g, steel, 0.5, 0.5, 1.6, -3.0, 2.0, 0, 14, Math.PI / 2); cyl(g, black, 0.1, 0.1, 2.2, -3.0, 2.0, 0, 8, Math.PI / 2);
  cyl(g, mat(0x222222, 0.6), 0.02, 0.02, 3.6, -3.75, 3.8, 0, 4); box(g, yellow, 0.35, 0.6, 0.35, -3.75, 2.0, 0); // 吊鉤
  for (let i = 0; i < 9; i++) { const x = -5.2 + i * 1.3; for (const sz of [-1, 1]) { const t = cyl(g, tire, 0.28, 0.28, 0.32, x, 1.35, sz * (W / 2 * 0.99), 12, Math.PI / 2); t.rotation.x = Math.PI / 2; t.rotation.z = Math.PI / 2; t.rotation.y = 0; t.rotation.set(0, 0, Math.PI / 2); } }
  cyl(g, tire, 0.45, 0.45, 0.6, L / 2 - 0.4, 1.7, 0, 14); // 船頭大碰墊
  rail(g, L, W, 1.55, steel, 12, 0.3); for (const sz of [-1, 1]) lamp(g, 3.2, 4.6, sz * 1.4, 0.12); cyl(g, steel, 0.03, 0.03, 1.4, 1.2, 5.2, 0, 5); box(g, steel, 0.8, 0.05, 0.05, 1.2, 5.8, 0);
  if (lv >= 2) box(g, yellow, 0.4, 0.4, 0.4, 3.7, 1.95, 0);
  if (lv >= 3) { sph(g, LAMP(), 0.22, 1.2, 6.0, 0); box(g, steel, 1.4, 0.06, 0.06, 1.2, 5.55, 0); }
}
function sub(g, lv) {
  const body = mat(0xe8b923, 0.45, 0.2), dark = mat(0x1f242b, 0.55, 0.3), steel = mat(0x8a9099, 0.35, 0.7), white = mat(0xf2f2ee, 0.5);
  const L = 16, R = 1.9; // 圓筒身（水線以上露出約 1/3）
  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(R, L - R * 2, 10, 24), body); hull.rotation.z = Math.PI / 2; hull.position.y = -0.4; hull.castShadow = true; g.add(hull);
  cyl(g, dark, R * 0.96, R * 0.96, 0.18, 3.2, -0.4, 0, 24, 0, Math.PI / 2); cyl(g, dark, R * 0.96, R * 0.96, 0.18, -3.5, -0.4, 0, 24, 0, Math.PI / 2);
  box(g, dark, 4, 0.05, 0.9, -0.2, R - 0.4, 0); // 甲板防滑
  // 指揮塔
  box(g, body, 2.6, 1.8, 1.4, 0.8, R + 0.3, 0).scale.set(1, 1, 1); cyl(g, body, 0.7, 0.7, 1.8, 2.1, R + 0.3, 0, 16).scale.set(0.8, 1, 0.9); box(g, dark, 2.7, 0.12, 1.5, 0.8, R + 1.25, 0);
  for (let i = 0; i < 3; i++) cyl(g, GLASS(), 0.17, 0.17, 0.06, 1.0 + i * 0.6, R + 0.55, 0.72, 12, Math.PI / 2);
  cyl(g, steel, 0.06, 0.06, 1.8, 0.4, R + 2.1, 0.3, 8); cyl(g, steel, 0.08, 0.08, 0.25, 0.4, R + 3.0, 0.3, 8); box(g, steel, 0.5, 0.05, 0.05, 0.2, R + 2.9, 0.3); cyl(g, steel, 0.04, 0.04, 1.2, 0.9, R + 1.9, -0.3, 6);
  // 艏舵 / 尾舵 / 螺旋槳
  for (const sz of [-1, 1]) { box(g, dark, 1.2, 0.08, 1.4, 4.5, -0.1, sz * 1.6).rotation.y = sz * 0.15; box(g, dark, 1.3, 0.08, 1.8, -L / 2 + 0.9, -0.4, sz * 1.9); }
  box(g, dark, 1.3, 1.8, 0.08, -L / 2 + 0.9, 0.6, 0); box(g, dark, 1.3, 1.8, 0.08, -L / 2 + 0.9, -1.4, 0);
  cyl(g, steel, 0.6, 0.6, 0.5, -L / 2 - 0.1, -0.4, 0, 20, 0, Math.PI / 2); for (let i = 0; i < 4; i++) box(g, steel, 0.06, 1.0, 0.18, -L / 2 - 0.4, -0.4, 0).rotation.x = i * Math.PI / 4;
  lamp(g, L / 2 - 0.5, 0.2, 0.8, 0.14); lamp(g, L / 2 - 0.5, 0.2, -0.8, 0.14);
  for (let i = 0; i < 4; i++) { const px = -5 + i * 1.1; box(g, white, 0.4, 0.04, 0.04, px, R - 0.55, 0.42); }
  if (lv >= 2) box(g, mat(0xd04a2a, 0.5), 0.9, 0.9, 0.9, -3.2, R - 0.15, 0);
  if (lv >= 3) { cyl(g, steel, 0.05, 0.05, 1.3, 3.6, R + 0.5, 0.2, 6); box(g, steel, 0.5, 0.06, 0.06, 3.6, R + 1.2, 0.2); }
}
function patrol(g, lv) {
  const grey = mat(0x7c8590, 0.5, 0.3), dgrey = mat(0x4b525b, 0.6, 0.3), white = mat(0xdfe3e6, 0.5), steel = mat(0x9aa0a8, 0.35, 0.7), black = mat(0x1a1d22, 0.6), orange = mat(0xff7a1c, 0.5), camo = mat(0x69725f, 0.8);
  const L = 18, W = 4.6; addHull(g, L, W, 2.0, grey, black, { bow: 0.42, sternW: 0.88, belly: 0.45, keel: 0.5, deckY: 1.55 }); stripe(g, dgrey, L, W, 1.0, 0.25); stripe(g, orange, L, W, 0.62, 0.08);
  box(g, dgrey, L * 0.74, 0.05, W * 0.8, -1.2, 1.58, 0);
  // 上層結構（斜面）
  box(g, grey, 6.4, 1.3, 3.4, 0.2, 2.25, 0); box(g, grey, 4.0, 1.1, 2.7, 0.0, 3.4, 0); box(g, dgrey, 4.2, 0.1, 2.9, 0, 4.0, 0);
  for (let i = -3; i <= 3; i++) box(g, mat(0x142638, 0.2, 0.3), 0.05, 0.5, 0.48, 2.02, 3.5, i * 0.38); for (const sz of [-1, 1]) box(g, mat(0x142638, 0.2, 0.3), 3.2, 0.5, 0.05, 0.0, 3.5, sz * 1.37);
  // 主砲塔 + 砲管
  cyl(g, grey, 0.9, 1.0, 0.5, 5.2, 1.85, 0, 8); box(g, grey, 1.5, 0.6, 1.2, 5.2, 2.4, 0); const brl = cyl(g, steel, 0.09, 0.11, 2.4, 6.4, 2.45, 0, 10, 0, Math.PI / 2); brl.rotation.z = Math.PI / 2 - 0.1; cyl(g, black, 0.13, 0.13, 0.25, 7.6, 2.55, 0, 10, 0, Math.PI / 2);
  // 雷達 / 天線
  cyl(g, steel, 0.06, 0.06, 2.2, -0.8, 5.2, 0, 6); box(g, steel, 1.6, 0.14, 0.1, -0.8, 6.3, 0); cyl(g, steel, 0.02, 0.02, 2.4, -1.8, 5.2, 0.9, 4); cyl(g, steel, 0.02, 0.02, 1.6, -1.8, 4.8, -0.9, 4);
  // 尾部：機槍座 + 小艇架
  cyl(g, steel, 0.1, 0.1, 0.9, -6.0, 2.0, 0, 8); box(g, black, 0.7, 0.2, 0.2, -5.7, 2.55, 0); box(g, orange, 3.2, 0.4, 1.4, -5.6, 1.9, 1.2).scale.set(1, 1, 0.8); for (const sz of [-1, 1]) cyl(g, black, 0.22, 0.22, 3.2, -5.6, 2.15, sz * 0.9 + 1.0, 10, 0, Math.PI / 2);
  for (let i = 0; i < 4; i++) { porthole(g, -3.6 + i * 1.6, 1.3, W / 2 * 0.98, 1); porthole(g, -3.6 + i * 1.6, 1.3, -W / 2 * 0.98, -1); }
  rail(g, L, W, 1.58, steel, 14, 0.42); lamp(g, 1.2, 4.2, 1.2, 0.1); lamp(g, 1.2, 4.2, -1.2, 0.1); flag(g, -2.2, 4.1, 0, 0xcc2222);
  if (lv >= 2) { for (const sz of [-1, 1]) { box(g, black, 0.7, 0.35, 0.3, 1.0, 2.0, sz * 1.9); cyl(g, steel, 0.04, 0.04, 0.9, 1.35, 2.1, sz * 1.9, 6, 0, Math.PI / 2); } }
  if (lv >= 3) { for (const sz of [-1, 1]) box(g, camo, 1.3, 0.5, 0.5, 3.5, 2.0, sz * 1.0); }
}
function icebreaker(g, lv) {
  const red = mat(0xc4372b, 0.55), black = mat(0x1a1c20, 0.7), white = mat(0xf0f0ec, 0.5), steel = mat(0x7b828a, 0.4, 0.6), yellow = mat(0xe8b923, 0.5), orange = mat(0xff7a1c, 0.5), deck = mat(0x59616a, 0.8);
  const L = 26, W = 8.6; addHull(g, L, W, 3.4, red, black, { bow: 0.26, sternW: 0.9, belly: 0.55, keel: 0.6, deckY: 2.5 }); stripe(g, black, L, W, 1.8, 0.4); stripe(g, white, L, W, 2.4, 0.12);
  // 破冰船首：加厚的圓弧船首護甲
  sph(g, red, 1.0, L / 2 - 0.4, 0.4, 0, 1.2, 1.1, 0.9); box(g, black, 1.6, 0.3, 1.2, L / 2 - 1.8, 2.0, 0);
  box(g, deck, L * 0.8, 0.06, W * 0.82, -1.5, 2.55, 0);
  // 上層結構兩層 + 駕駛台
  box(g, white, 8, 2.4, 6.6, -2.0, 3.8, 0); box(g, white, 6.2, 2.2, 5.6, -1.4, 6.1, 0); box(g, white, 3.4, 1.8, 6.2, 0.4, 8.0, 0).scale.set(1, 1, 1); box(g, black, 3.6, 0.12, 6.4, 0.4, 8.95, 0);
  for (let i = -5; i <= 5; i++) box(g, GLASS(), 0.06, 0.8, 0.45, 2.15, 8.1, i * 0.52); for (const sz of [-1, 1]) box(g, GLASS(), 2.8, 0.8, 0.06, 0.4, 8.1, sz * 3.12);
  for (let i = 0; i < 9; i++) for (const sz of [-1, 1]) { box(g, mat(0x1e3347, 0.2, 0.3), 0.55, 0.5, 0.05, -5.2 + i * 0.95, 4.0, sz * 3.32); if (i < 7) box(g, mat(0x1e3347, 0.2, 0.3), 0.55, 0.5, 0.05, -4.4 + i * 0.95, 6.3, sz * 2.82); }
  // 煙囪（紅底黑頂）
  cyl(g, red, 1.0, 1.15, 3.0, -4.0, 8.2, 0, 18); cyl(g, black, 1.0, 1.0, 0.6, -4.0, 9.9, 0, 18); box(g, white, 0.12, 1.0, 1.0, -4.0, 9.4, 0);
  // 吊車 + 直升機坪 + 救生艇
  box(g, yellow, 0.35, 5, 0.35, 4.6, 5.0, 2.4); const arm = box(g, yellow, 0.25, 0.25, 6, 4.6, 7.4, 0); arm.rotation.x = 0; cyl(g, steel, 0.015, 0.015, 3, 4.6, 5.9, 0, 4);
  box(g, mat(0x6e7782, 0.7), 5, 0.1, 5, -9.8, 4.0, 0); cyl(g, white, 1.6, 1.6, 0.02, -9.8, 4.07, 0, 24); box(g, white, 0.2, 0.02, 1.4, -9.8, 4.08, 0);
  for (const sz of [-1, 1]) { const lb = box(g, orange, 4.4, 0.9, 1.4, -2.5, 6.0, sz * 3.9); lb.scale.set(1, 1, 1); box(g, white, 4.0, 0.18, 1.2, -2.5, 6.45, sz * 3.9); }
  rail(g, L, W, 2.55, steel, 18, 0.26); for (const x of [1.0, -1.0]) for (const sz of [-1, 1]) lamp(g, x + 2, 9.2, sz * 2.9, 0.14);
  cyl(g, steel, 0.08, 0.08, 3, 0.4, 10.5, 0, 6); box(g, steel, 2.2, 0.1, 0.1, 0.4, 11.6, 0); cyl(g, steel, 0.4, 0.5, 0.8, 0.4, 9.4, 0, 12); flag(g, 0.4, 12.0, 0, 0xcc2222);
  if (lv >= 2) { box(g, yellow, 0.5, 0.9, 0.5, 8.2, 3.1, 1.4); box(g, yellow, 0.5, 0.9, 0.5, 8.2, 3.1, -1.4); }
  if (lv >= 3) { for (const sz of [-1, 1]) { cyl(g, steel, 0.3, 0.3, 0.5, 2.6, 9.7, sz * 3.3, 12); sph(g, LAMP(), 0.28, 2.6, 10.1, sz * 3.3); } }
}
const BUILD = { skiff, speedboat, tug, sub, patrol, icebreaker };

/** 取得一艘船的模型（Group）。lv 影響細節（1–3）。回傳 { group, draft } draft = 吃水深度（讓船在水面上位置正確）。 */
export function buildShipModel(type, lv = 1) {
  const g = new THREE.Group(); (BUILD[type] || skiff)(g, lv);
  patchShip(g, { type, lv });   // 末日廢土感：鏽蝕 / 補丁 / 土法零件（?wl=0 關閉）
  const d = { skiff: 0.3, speedboat: 0.18, tug: 0.55, sub: 0.0, patrol: 0.5, icebreaker: 1.0 }[type] || 0.3;
  g.userData.draft = d; g.userData.type = type; g.userData.lv = lv; g.position.y = 0; return g;
}
