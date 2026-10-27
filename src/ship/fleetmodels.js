// 艦隊 3D 模型：6 種小型船（程序式、低多邊形但有細節）。座標：+x 為船頭，y 向上，水線在 y=0；單位 = 公尺。
import * as THREE from 'three';

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
const stripe = (g, m, L, W, y, h = 0.18) => { const geo = hullSolid(L * 1.002, W * 1.003, h, {}).geo; const o = new THREE.Mesh(geo, m); o.position.y = y; g.add(o); };
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
function speedboat(g, lv) {
  const white = mat(0xf6f6f4, 0.35, 0.1), red = mat(0xe03a3a, 0.4), dark = mat(0x20242b, 0.5), steel = mat(0xb8bcc2, 0.3, 0.7), seat = mat(0x20242b, 0.8);
  const L = 8.5, W = 2.6; addHull(g, L, W, 1.0, white, mat(0x14222e, 0.6), { bow: 0.5, sternW: 0.85, belly: 0.45 }); stripe(g, red, L, W, 0.3, 0.16); stripe(g, dark, L, W, 0.12, 0.1);
  box(g, dark, L * 0.5, 0.02, W * 0.7, -0.9, 0.62, 0); // 地板
  const ws = box(g, GLASS(), 0.05, 0.7, 2.0, 0.55, 1.15, 0); ws.rotation.z = -0.5; box(g, dark, 0.08, 0.06, 2.1, 0.62, 0.8, 0); // 擋風玻璃
  box(g, white, 1.8, 0.45, 2.1, 1.7, 0.85, 0).scale.set(1, 1, 0.9); // 船頭艙蓋
  for (let i = 0; i < 2; i++) { box(g, seat, 0.7, 0.18, 0.8, -0.2 - i * 1.0, 0.72, -0.5); box(g, seat, 0.1, 0.55, 0.8, -0.55 - i * 1.0, 1.0, -0.5); box(g, seat, 0.7, 0.18, 0.8, -0.2 - i * 1.0, 0.72, 0.5); box(g, seat, 0.1, 0.55, 0.8, -0.55 - i * 1.0, 1.0, 0.5); }
  box(g, dark, 0.35, 0.3, 0.7, 0.1, 0.9, 0); // 控制台
  for (const sz of [-1, 1]) { box(g, steel, 0.5, 0.9, 0.35, -L / 2 - 0.15, 0.65, sz * 0.55); cyl(g, dark, 0.05, 0.05, 0.9, -L / 2 - 0.5, 0.2, sz * 0.55, 8); box(g, dark, 0.35, 0.12, 0.05, -L / 2 - 0.52, -0.2, sz * 0.55); }
  cyl(g, steel, 0.02, 0.02, 1.2, -2.8, 1.6, 0, 5); lamp(g, 3.2, 0.85, 0.0, 0.06);
  if (lv >= 2) box(g, mat(0x2fa0e8, 0.3), L * 0.55, 0.07, 0.05, 0.4, 0.82, W / 2 * 0.92);
  if (lv >= 3) { box(g, dark, 0.3, 0.05, 2.4, -2.4, 1.5, 0); cyl(g, steel, 0.03, 0.03, 0.9, -2.4, 1.0, -0.9, 6); cyl(g, steel, 0.03, 0.03, 0.9, -2.4, 1.0, 0.9, 6); }
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
  const d = { skiff: 0.3, speedboat: 0.18, tug: 0.55, sub: 0.0, patrol: 0.5, icebreaker: 1.0 }[type] || 0.3;
  g.userData.draft = d; g.userData.type = type; g.userData.lv = lv; g.position.y = 0; return g;
}
