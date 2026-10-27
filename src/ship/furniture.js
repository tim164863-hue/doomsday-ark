import * as THREE from 'three';
import { xform } from './builder.js';

/** 以 (x,z,ry) 為原點的局部座標：lx=右，lz=前 */
export class Frame {
  constructor(b, x, z, ry = 0) { this.b = b; this.x = x; this.z = z; this.ry = ry; this.c = Math.cos(ry); this.s = Math.sin(ry); }
  w(lx, lz) { return [this.x + lx * this.c + lz * this.s, this.z - lx * this.s + lz * this.c]; }
  box(mat, lx, lz, w, d, h, y0 = 0) { const [x, z] = this.w(lx, lz); this.b.box(mat, x, z, w, d, h, y0, this.ry); }
  boxc(mat, lx, y, lz, w, h, d, rx = 0, rzz = 0) { const [x, z] = this.w(lx, lz); this.b.boxc(mat, x, y, z, w, h, d, this.ry, rx, rzz); }
  cyl(mat, lx, lz, r, h, y0 = 0, seg = 14, rTop = r) { const [x, z] = this.w(lx, lz); this.b.cyl(mat, x, z, r, h, y0, seg, rTop); }
  sph(mat, lx, y, lz, r, sx = 1, sy = 1, sz = 1, seg = 10) { const [x, z] = this.w(lx, lz); this.b.sph(mat, x, y, z, r, sx, sy, sz, seg); }
  block(lx, lz, w, d) { const [x, z] = this.w(lx, lz); this.b.blockC(x, z, w, d, this.ry); }
}
const F = (b, x, z, ry) => new Frame(b, x, z, ry);

export function officeChair(b, x, z, ry, mat = 'fabricB') {
  const f = F(b, x, z, ry);
  f.cyl('steelDark', 0, 0, 0.04, 0.3, 0.05, 6); f.box('steelDark', 0, 0, 0.5, 0.06, 0.04, 0.03);
  f.box(mat, 0, 0, 0.5, 0.5, 0.08, 0.4); f.box(mat, 0, -0.24, 0.46, 0.08, 0.5, 0.5);
}
export function plant(b, x, z, s = 1, mat = 'leaf') {
  b.cyl('pot', x, z, 0.22 * s, 0.4 * s, 0, 10, 0.17 * s);
  b.sph(mat, x, 0.75 * s, z, 0.32 * s, 1, 1.2, 1); b.sph('leaf2', x + 0.12 * s, 1.0 * s, z - 0.05 * s, 0.22 * s, 1, 1.1, 1); b.block(x - 0.25 * s, z - 0.25 * s, x + 0.25 * s, z + 0.25 * s);
}
export function floorLamp(b, x, z) { b.cyl('steelDark', x, z, 0.14, 0.04, 0, 8); b.cyl('steel', x, z, 0.02, 1.5, 0.04, 6); b.cyl('lamp', x, z, 0.2, 0.28, 1.45, 10, 0.1); }
export function crate(b, x, z, s = 0.8, mat = 'crate', ry = 0, h = s) { b.box(mat, x, z, s, s, h, 0, ry); b.box('woodDark', x, z, s + 0.02, s + 0.02, 0.06, h * 0.3, ry); b.blockC(x, z, s, s, ry); }
export function barrel(b, x, z, mat = 'rust') { b.cyl(mat, x, z, 0.32, 0.9, 0, 12); b.cyl('steelDark', x, z, 0.335, 0.05, 0.2, 12); b.cyl('steelDark', x, z, 0.335, 0.05, 0.65, 12); b.block(x - 0.33, z - 0.33, x + 0.33, z + 0.33); }
export function sofa(b, x, z, ry, len = 2.2, mat = 'sofa') {
  const f = F(b, x, z, ry);
  f.box(mat, 0, 0, len, 0.9, 0.42); f.box(mat, 0, -0.38, len, 0.2, 0.45, 0.4);
  f.box(mat, -len / 2 + 0.1, 0, 0.2, 0.9, 0.3, 0.42); f.box(mat, len / 2 - 0.1, 0, 0.2, 0.9, 0.3, 0.42);
  f.block(0, 0, len, 0.95);
}
export function armchair(b, x, z, ry, mat = 'sofa2') { sofa(b, x, z, ry, 0.95, mat); }
export function coffeeTable(b, x, z, ry = 0, w = 1.1, d = 0.6) { const f = F(b, x, z, ry); f.box('woodDark', 0, 0, w, d, 0.05, 0.38); f.box('steelDark', -w / 2 + 0.05, -d / 2 + 0.05, 0.04, 0.04, 0.38); f.box('steelDark', w / 2 - 0.05, d / 2 - 0.05, 0.04, 0.04, 0.38); f.box('steelDark', -w / 2 + 0.05, d / 2 - 0.05, 0.04, 0.04, 0.38); f.box('steelDark', w / 2 - 0.05, -d / 2 + 0.05, 0.04, 0.04, 0.38); f.block(0, 0, w, d); }
export function bookshelf(b, x, z, ry, w = 2, h = 2.0) {
  const f = F(b, x, z, ry);
  f.box('woodDark', 0, 0, w, 0.4, h);
  const cols = ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink'];
  for (let r = 0; r < 4; r++) { const y = 0.25 + r * (h - 0.3) / 4.1; for (let i = 0; i < Math.floor(w / 0.16); i++) f.box(cols[(i * 3 + r * 2) % cols.length], -w / 2 + 0.12 + i * 0.16, 0.06, 0.1, 0.26, 0.28 + ((i + r) % 3) * 0.04, y); }
  f.block(0, 0, w, 0.42);
}
export function table(b, x, z, w, d, ry = 0, mat = 'woodLight', h = 0.74) { const f = F(b, x, z, ry); f.box(mat, 0, 0, w, d, 0.06, h - 0.06); for (const sx of [-1, 1]) for (const sz of [-1, 1]) f.box('steelDark', sx * (w / 2 - 0.08), sz * (d / 2 - 0.08), 0.06, 0.06, h - 0.06); f.block(0, 0, w, d); }
export function roundTable(b, x, z, r = 0.6) { b.cyl('woodLight', x, z, r, 0.05, 0.7, 16); b.cyl('steelDark', x, z, 0.05, 0.7, 0, 8); b.cyl('steelDark', x, z, 0.28, 0.04, 0, 12); b.blockC(x, z, r * 2, r * 2); }
export function stool(b, x, z, h = 0.65, mat = 'red') { b.cyl(mat, x, z, 0.19, 0.07, h - 0.07, 12); b.cyl('steel', x, z, 0.03, h - 0.07, 0, 6); b.cyl('steelDark', x, z, 0.18, 0.03, 0, 10); }
export function diningChair(b, x, z, ry, mat = 'wood') { const f = F(b, x, z, ry); f.box(mat, 0, 0, 0.42, 0.42, 0.05, 0.42); f.box(mat, 0, -0.2, 0.42, 0.05, 0.45, 0.45); for (const sx of [-1, 1]) for (const sz of [-1, 1]) f.box('steelDark', sx * 0.18, sz * 0.18, 0.04, 0.04, 0.42); }

/** 工作桌：回傳座位資訊與螢幕材質 */
export function workDesk(deck, x, z, ry, opts = {}) {
  const b = deck.b; const f = F(b, x, z, ry);
  // 桌面在座位前方 0.95
  f.box('woodLight', 0, 0.95, 1.7, 0.85, 0.05, 0.72); f.box('steelDark', -0.78, 0.95, 0.05, 0.75, 0.72); f.box('steelDark', 0.78, 0.95, 0.05, 0.75, 0.72);
  f.box('steelDark', 0, 1.3, 1.55, 0.04, 0.5, 0.2); // 背板
  // 螢幕（背對座位的另一側為支架）
  const [mx, mz] = f.w(0, 1.2);
  f.box('black', 0, 1.2, 0.7, 0.05, 0.42, 0.9); f.box('black', 0, 1.2, 0.08, 0.14, 0.04, 0.74);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x1a2a3a });
  const sg = new THREE.PlaneGeometry(0.64, 0.36); const sm = new THREE.Mesh(sg, screenMat);
  const [sx, sz] = f.w(0, 1.2 - 0.03); sm.position.set(sx, 0.97 + 0.0, sz); sm.rotation.y = ry + Math.PI; deck.group.add(sm);
  f.box('black', 0.0, 0.75, 0.5, 0.16, 0.02, 0.78); // 鍵盤
  f.box('white', 0.55, 0.8, 0.08, 0.08, 0.08, 0.78);
  f.block(0, 0.95, 1.8, 0.95);
  officeChair(b, x, z, ry, opts.chair || 'fabricB');
  const wx = x + Math.sin(ry) * 0.0, wz = z;
  return { seat: { x: wx, z: wz, face: ry }, screenMat };
}

export function bed(b, x, z, ry, mat = 'fabricB') { // 床頭在 +lz? 這裡：床長軸沿局部 z，枕頭在 lz=+0.8
  const f = F(b, x, z, ry);
  f.box('woodDark', 0, 0, 1.15, 2.15, 0.28); f.box('fabricW', 0, 0, 1.08, 2.05, 0.2, 0.28);
  f.box(mat, 0, -0.2, 1.1, 1.5, 0.1, 0.4); f.box('fabricW', 0, 0.78, 0.7, 0.4, 0.12, 0.45);
  f.box('woodDark', 0, 1.1, 1.2, 0.08, 0.7);
  f.block(0, 0, 1.2, 2.2);
}
export function nightstand(b, x, z, ry = 0) { const f = F(b, x, z, ry); f.box('woodDark', 0, 0, 0.45, 0.4, 0.5); f.cyl('lamp', 0, 0, 0.1, 0.18, 0.5, 8, 0.06); f.block(0, 0, 0.45, 0.4); }
export function wardrobe(b, x, z, ry = 0) { const f = F(b, x, z, ry); f.box('woodLight', 0, 0, 1.2, 0.55, 1.9); f.box('woodDark', 0, 0.28, 0.02, 0.02, 1.8, 0.05); f.block(0, 0, 1.2, 0.55); }
export function toilet(b, x, z, ry) { const f = F(b, x, z, ry); f.box('white', 0, 0, 0.38, 0.25, 0.4, 0.0); f.box('white', 0, -0.2, 0.32, 0.5, 0.2, 0.0); f.box('white', 0, 0.08, 0.38, 0.14, 0.4, 0.4); f.block(0, 0, 0.4, 0.7); }
export function sink(b, x, z, ry) { const f = F(b, x, z, ry); f.box('white', 0, 0, 0.5, 0.4, 0.1, 0.78); f.box('white', 0, 0, 0.1, 0.1, 0.78); f.box('steel', 0, 0.12, 0.04, 0.04, 0.12, 0.88); f.block(0, 0, 0.5, 0.4); }
export function shower(b, x, z, w = 1.0, d = 1.0) {
  b.box('tile', x, z, w, d, 0.04, 0); b.boxc('glass', x - w / 2, 1.05, z, 0.03, 2.0, d); b.boxc('glass', x, 1.05, z + d / 2, w, 2.0, 0.03);
  b.cyl('steel', x + w / 2 - 0.1, z - d / 2 + 0.1, 0.02, 1.0, 1.4, 6); b.sph('steel', x + w / 2 - 0.1, 2.35, z - d / 2 + 0.1, 0.12, 1, 0.3, 1, 8);
}

export function tv(deck, x, y, z, ry, w, mat, tex) { // y 為中心高度；screen 面向局部 +z
  const h = w * 0.5625; const f = F(deck.b, x, z, ry);
  f.boxc('black', 0, y, 0, w + 0.1, h + 0.1, 0.1);
  f.box('steelDark', 0, -0.08, 0.5, 0.2, y - h / 2 - 0.02, 0.0);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), tex ? new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }) : mat);
  const [px, pz] = f.w(0, 0.056); m.position.set(px, y, pz); m.rotation.y = ry; deck.group.add(m); deck.tvs.push(m);
  return m;
}

export function arcade(deck, x, z, ry, color = 'blue') {
  const b = deck.b; const f = F(b, x, z, ry);
  f.box(color, 0, 0, 0.8, 0.7, 1.7); f.box('black', 0, 0.35, 0.7, 0.05, 1.0, 0.4, ); f.box('steelDark', 0, 0.45, 0.78, 0.4, 0.04, 0.95);
  f.box('lamp', 0, 0.2, 0.82, 0.08, 0.6, 1.62);
  const colr = [0xff5577, 0x55ffaa, 0x66aaff, 0xffcc44][Math.floor(Math.abs(x * 7 + z * 3)) % 4];
  const mat = new THREE.MeshBasicMaterial({ color: colr });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.44), mat); const [px, pz] = f.w(0, 0.37); m.position.set(px, 1.18, pz); m.rotation.set(-0.3, ry, 0); m.rotation.order = 'YXZ'; deck.group.add(m); deck.screens.push(mat);
  f.block(0, 0, 0.85, 0.8);
}
export function treadmill(b, x, z, ry) { const f = F(b, x, z, ry); f.box('steelDark', 0, 0, 0.7, 1.6, 0.16); f.box('black', 0, 0.0, 0.58, 1.5, 0.04, 0.16); f.box('steel', -0.3, 0.75, 0.04, 0.04, 1.0); f.box('steel', 0.3, 0.75, 0.04, 0.04, 1.0); f.box('black', 0, 0.78, 0.5, 0.14, 0.2, 1.0); f.block(0, 0, 0.75, 1.65); }
export function weightBench(b, x, z, ry) {
  const f = F(b, x, z, ry); f.box('leather', 0, 0, 0.35, 1.2, 0.1, 0.4); f.box('steelDark', 0, -0.5, 0.06, 0.06, 0.4); f.box('steelDark', 0, 0.5, 0.06, 0.06, 0.4);
  f.box('steelDark', -0.5, 0.45, 0.05, 0.05, 1.1); f.box('steelDark', 0.5, 0.45, 0.05, 0.05, 1.1);
  const [cx, cz] = f.w(0, 0.45); b.cylc('steel', cx, 1.35, cz, 0.015, 1.5, 6, 0, ry, Math.PI / 2);
  for (const sx of [-0.62, 0.62]) { const [wx, wz] = f.w(sx, 0.45); b.cylc('black', wx, 1.35, wz, 0.2, 0.06, 14, 0, ry, Math.PI / 2); }
  f.block(0, 0, 1.6, 1.3);
}
export function dumbbellRack(b, x, z, ry) { const f = F(b, x, z, ry); f.box('steelDark', 0, 0, 2.0, 0.5, 0.6); for (let i = 0; i < 6; i++) { f.box('black', -0.8 + i * 0.32, 0, 0.18, 0.2, 0.14, 0.62); f.box('steel', -0.8 + i * 0.32, 0, 0.1, 0.4, 0.04, 0.66); } f.block(0, 0, 2.0, 0.5); }
export function mirrorWall(b, x0, z0, x1, z1) { const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0); const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2; if (alongX) b.boxc('glassTint', mx, 1.2, mz, Math.abs(x1 - x0), 1.8, 0.05); else b.boxc('glassTint', mx, 1.2, mz, 0.05, 1.8, Math.abs(z1 - z0)); }
export function infirmaryBed(b, x, z, ry) { const f = F(b, x, z, ry); f.box('steel', 0, 0, 0.9, 2.0, 0.08, 0.45); f.box('white', 0, 0, 0.85, 1.9, 0.14, 0.53); f.box('white', 0, 0.8, 0.5, 0.3, 0.1, 0.67); f.box('steelDark', 0, 0, 0.05, 0.05, 0.45); f.block(0, 0, 0.95, 2.05); }
export function curtainRail(b, x0, z0, x1, z1, h = 1.7) { const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0); const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2; if (alongX) { b.boxc('fabricW', mx, 0.9 + h / 2 - 0.4, mz, Math.abs(x1 - x0), h - 0.0, 0.03); b.block(x0, z0 - 0.08, x1, z1 + 0.08);} else { b.boxc('fabricW', mx, 0.9 + h / 2 - 0.4, mz, 0.03, h, Math.abs(z1 - z0)); b.block(x0 - 0.08, z0, x1 + 0.08, z1);} }
export function medCabinet(b, x, z, ry) { const f = F(b, x, z, ry); f.box('white', 0, 0, 0.9, 0.4, 1.7); f.box('red', 0, 0.21, 0.35, 0.02, 1.2, 0.5 + 0.0); f.box('red', 0, 0.211, 0.1, 0.02, 1.2, 0.8 + 0.0); f.block(0, 0, 0.9, 0.42); }

export function pingPongTable(b, x, z, ry) {
  const f = F(b, x, z, ry); // 長軸沿局部 x
  f.box('courtBlue', 0, 0, 2.74, 1.525, 0.04, 0.72); f.box('courtLine', 0, 0, 2.74, 0.015, 0.045, 0.72); f.box('courtLine', 0, 0, 0.015, 1.525, 0.045, 0.72);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) f.box('steelDark', sx * 1.2, sz * 0.6, 0.06, 0.06, 0.72);
  f.box('white', 0, 0, 0.012, 1.7, 0.15, 0.76); f.box('steelDark', 0, 0.85, 0.03, 0.03, 0.17, 0.76); f.box('steelDark', 0, -0.85, 0.03, 0.03, 0.17, 0.76);
  f.block(0, 0, 2.8, 1.55);
}
export function pickleCourt(b, x, z) { // 長軸沿 x，13.4 x 6.1
  b.box('courtBlue', x, z, 14.4, 7.2, 0.03, 0.0);
  b.box('courtGreen', x, z, 13.4, 6.1, 0.015, 0.03);
  const L = (lx, lz, w, d) => b.box('courtLine', x + lx, z + lz, w, d, 0.012, 0.045);
  L(0, 3.05, 13.4, 0.05); L(0, -3.05, 13.4, 0.05); L(6.7, 0, 0.05, 6.1); L(-6.7, 0, 0.05, 6.1);
  L(2.13, 0, 0.05, 6.1); L(-2.13, 0, 0.05, 6.1); L(3.4, 0, 4.3, 0.05); L(-3.4, 0, 4.3, 0.05);
  b.box('white', x, z, 0.03, 6.7, 0.9, 0.0); b.box('black', x, z, 0.04, 6.7, 0.06, 0.88);
  b.box('steelDark', x, z + 3.35, 0.06, 0.06, 0.95); b.box('steelDark', x, z - 3.35, 0.06, 0.06, 0.95);
  b.block(x - 0.03, z - 3.4, x + 0.03, z + 3.4);
}
export function basketCourt(b, x, z, w = 12, d = 9) {
  b.box('courtBlue', x, z, w + 1, d + 1, 0.03, 0.0); b.box('rubber', x, z, w, d, 0.015, 0.03);
  const L = (lx, lz, ww, dd) => b.box('courtLine', x + lx, z + lz, ww, dd, 0.012, 0.045);
  L(0, d / 2, w, 0.06); L(0, -d / 2, w, 0.06); L(w / 2, 0, 0.06, d); L(-w / 2, 0, 0.06, d); L(0, 0, 0.06, d);
  const c = new THREE.CylinderGeometry(1.8, 1.8, 0.012, 24, 1, true); b.add(b.M.courtLine, xform(new THREE.RingGeometry(1.6, 1.66, 32).rotateX(-Math.PI / 2), x, 0.05, z));
  for (const sx of [-1, 1]) {
    L(sx * (w / 2 - 2.4), 0, 0.06, 3.6); L(sx * (w / 2 - 1.2), 1.8, 2.4, 0.06); L(sx * (w / 2 - 1.2), -1.8, 2.4, 0.06);
    const hx = x + sx * (w / 2 - 0.2);
    b.cyl('steelDark', hx + sx * 0.4, z, 0.07, 3.2, 0, 8); b.box('white', hx + sx * 0.18, z, 0.04, 1.4, 0.95, 2.9); b.box('red', hx + sx * 0.14, z, 0.03, 0.55, 0.45, 3.0);
    b.add(b.M.orange, xform(new THREE.TorusGeometry(0.23, 0.02, 6, 16), hx - sx * 0.2, 3.05, z, Math.PI / 2, 0, 0));
    b.block(hx + sx * 0.3 - 0.12, z - 0.12, hx + sx * 0.5 + 0.12, z + 0.12);
  }
}

export function loungeChair(b, x, z, ry, mat = 'fabricW') { const f = F(b, x, z, ry); f.box('steel', 0, 0, 0.7, 1.9, 0.05, 0.28); f.box(mat, 0, 0.0, 0.62, 1.1, 0.1, 0.33); f.boxc(mat, 0, 0.62, -0.7, 0.62, 0.1, 0.8, -0.8); f.block(0, 0, 0.75, 1.95); }
export function umbrella(b, x, z, r = 1.5, mat = 'sunshade') { b.cyl('steel', x, z, 0.03, 2.3, 0, 6); b.geo(mat, xform(new THREE.ConeGeometry(r, 0.45, 10), x, 2.35, z)); b.blockC(x, z, 0.2, 0.2); }
export function lifeRing(b, x, y, z, ry) { b.add(b.M.red, xform(new THREE.TorusGeometry(0.32, 0.09, 8, 16), x, y, z, 0, ry, 0)); b.add(b.M.white, xform(new THREE.TorusGeometry(0.32, 0.092, 8, 4), x, y, z, 0, ry, 0, 1, 1, 1)); }
export function counter(b, x0, z0, x1, z1, h = 1.0, depth = 0.7, mat = 'woodDark', top = 'tile') {
  const alongX = Math.abs(x1 - x0) >= Math.abs(z1 - z0); const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, len = Math.hypot(x1 - x0, z1 - z0);
  if (alongX) { b.box(mat, mx, mz, len, depth, h - 0.05); b.box(top, mx, mz, len + 0.05, depth + 0.1, 0.06, h - 0.05); b.block(x0, mz - depth / 2, x1, mz + depth / 2); }
  else { b.box(mat, mx, mz, depth, len, h - 0.05); b.box(top, mx, mz, depth + 0.1, len + 0.05, 0.06, h - 0.05); b.block(mx - depth / 2, z0, mx + depth / 2, z1); }
}
export function fridge(b, x, z, ry) { const f = F(b, x, z, ry); f.box('steel', 0, 0, 0.8, 0.7, 1.8); f.box('steelDark', 0.3, 0.36, 0.03, 0.03, 0.6, 0.9); f.block(0, 0, 0.8, 0.7); }
export function stove(b, x, z, ry) { const f = F(b, x, z, ry); f.box('steel', 0, 0, 0.9, 0.7, 0.9); f.box('black', 0, 0, 0.85, 0.65, 0.03, 0.9); for (const sx of [-0.2, 0.2]) for (const sz of [-0.15, 0.15]) f.cyl('steelDark', sx, sz, 0.1, 0.02, 0.93, 10); f.block(0, 0, 0.9, 0.7); }
export function cargoContainer(b, x, z, ry, mat = 'cargoBlue', long = 4.8) { const f = F(b, x, z, ry); f.box(mat, 0, 0, long, 2.0, 2.2); for (let i = -long / 2 + 0.2; i < long / 2; i += 0.34) { f.box(mat, i, 1.02, 0.1, 0.06, 2.0, 0.0); f.box(mat, i, -1.02, 0.1, 0.06, 2.0, 0.0); } f.block(0, 0, long, 2.05); }
export function shelf(b, x, z, ry, w = 2.4) { const f = F(b, x, z, ry); for (const sx of [-w / 2, w / 2]) f.box('steelDark', sx, 0, 0.06, 0.5, 2.1); for (let i = 0; i < 4; i++) { f.box('steel', 0, 0, w, 0.5, 0.04, 0.2 + i * 0.6); if (i < 3) { f.box(['cargoBlue', 'crate', 'cargoRed'][i % 3], -0.5, 0, 0.5, 0.35, 0.3, 0.24 + i * 0.6); f.box('crate', 0.5, 0, 0.55, 0.35, 0.35, 0.24 + i * 0.6); } } f.block(0, 0, w, 0.5); }
export function waterCooler(b, x, z, ry = 0) { const f = F(b, x, z, ry); f.box('white', 0, 0, 0.4, 0.4, 1.0); f.cyl('lightblue', 0, 0, 0.16, 0.45, 1.0, 10); f.block(0, 0, 0.4, 0.4); }
export function coffeeMachine(b, x, z, ry = 0) { const f = F(b, x, z, ry); f.box('woodDark', 0, 0, 0.9, 0.5, 0.95); f.box('steelDark', 0, 0, 0.5, 0.4, 0.45, 0.95); f.box('red', 0, 0.18, 0.12, 0.04, 0.12, 1.15); f.block(0, 0, 0.9, 0.5); }
export function whiteboard(b, x, z, ry, w = 2.6) { const f = F(b, x, z, ry); f.box('steel', 0, 0, w + 0.1, 0.05, 1.3, 0.55); f.box('white', 0, 0.03, w, 0.02, 1.2, 0.6); f.box('blue', -0.5, 0.045, 0.9, 0.01, 0.03, 1.2); f.box('red', 0.3, 0.045, 0.7, 0.01, 0.03, 1.0); f.box('green', 0.0, 0.045, 0.6, 0.01, 0.03, 0.95); f.block(0, 0, w, 0.1); }

export function hotTub(deck, x, z, r = 2.1) {
  const b = deck.b;
  b.cyl('woodDark', x, z, r + 0.3, 0.9, 0, 24); b.cyl('white', x, z, r, 0.92, 0, 24);
  const wm = new THREE.Mesh(new THREE.CircleGeometry(r - 0.12, 28).rotateX(-Math.PI / 2), deck.M.water); wm.position.set(x, 0.86, z); wm.receiveShadow = true; deck.group.add(wm); deck.waters.push(wm);
  b.blockC(x, z, (r + 0.3) * 2, (r + 0.3) * 2);
}
export function pool(deck, x0, z0, x1, z1) {
  const b = deck.b; const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, w = x1 - x0, d = z1 - z0;
  // 水池下沉：用池緣方塊圍出
  const rim = 0.55, hgt = 0.45;
  b.box('tile', mx, z0 - rim / 2, w + rim * 2, rim, hgt); b.box('tile', mx, z1 + rim / 2, w + rim * 2, rim, hgt);
  b.box('tile', x0 - rim / 2, mz, rim, d, hgt); b.box('tile', x1 + rim / 2, mz, rim, d, hgt);
  b.box('tileBlue', mx, mz, w, d, 0.02, 0.0);
  const wm = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), deck.M.water); wm.position.set(mx, 0.34, mz); deck.group.add(wm); deck.waters.push(wm);
  b.block(x0 - rim, z0 - rim, x1 + rim, z1 + rim);
  // 泳池扶梯
  b.cyl('steel', x0 + 1.4, z1 + 0.1, 0.03, 1.0, 0.3, 6); b.cyl('steel', x0 + 1.9, z1 + 0.1, 0.03, 1.0, 0.3, 6);
}
export function waterSlide(deck, x, z) {
  const b = deck.b; // 塔 + 螺旋滑水道落入泳池
  b.box('steelDark', x, z, 2.2, 2.2, 0.15, 4.4); // 平台
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.cyl('steel', x + sx * 1.0, z + sz * 1.0, 0.07, 4.4, 0, 8);
  b.box('white', x, z, 1.0, 0.6, 4.4, 0.0); // 塔核心
  for (let i = 0; i < 8; i++) b.box('steel', x + 1.3 + (i % 2) * 0.0, z - 1.0 + i * 0.28, 0.5, 0.05, 0.05, 0.4 + i * 0.5);
  b.blockC(x, z, 2.6, 2.6);
  const pts = [[0, 4.9, 0], [1.9, 4.6, -2.3], [4.6, 4.0, -3.4], [8.0, 3.3, -2.9], [10.4, 2.5, 0], [8.6, 1.8, 3.0], [6.0, 1.3, 1.6], [7.6, 0.6, -0.2]].map(([dx, y, dz]) => new THREE.Vector3(x + dx, y, z + dz));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  const tube = new THREE.TubeGeometry(curve, 120, 0.55, 10, false);
  b.add(b.M.orange, tube);
  for (let i = 3; i < pts.length - 1; i++) { const p = curve.getPoint(i / (pts.length - 1)); b.cyl('steel', p.x, p.z, 0.05, p.y - 0.4, 0, 6); }
}
export function helicopter(deck, x, z) {
  const g = new THREE.Group(); const M = deck.M;
  const add = (geo, m, p = [0, 0, 0], r = [0, 0, 0]) => { const mesh = new THREE.Mesh(geo, m); mesh.position.set(...p); mesh.rotation.set(...r); mesh.castShadow = true; g.add(mesh); return mesh; };
  add(new THREE.SphereGeometry(1, 16, 12).scale(1.5, 0.95, 0.95), M.heliBody, [0, 1.25, 0]);
  add(new THREE.BoxGeometry(2.8, 0.14, 0.14), M.heliRed, [0, 1.25, 0.96]);
  add(new THREE.SphereGeometry(0.8, 12, 8).scale(1, 0.75, 0.8), M.glassTint, [0.95, 1.3, 0]);
  add(new THREE.CylinderGeometry(0.1, 0.22, 3.2, 8), M.heliBody, [-2.7, 1.45, 0], [0, 0, Math.PI / 2 + 0.05]);
  add(new THREE.BoxGeometry(0.1, 0.9, 0.08), M.heliRed, [-4.2, 1.8, 0]);
  for (const s of [-1, 1]) { add(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 6), M.steelDark, [0, 0.12, s * 0.75], [0, 0, Math.PI / 2]); add(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), M.steelDark, [0.7, 0.4, s * 0.7]); add(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), M.steelDark, [-0.7, 0.4, s * 0.7]); }
  add(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 6), M.steelDark, [0, 2.25, 0]);
  const rotor = new THREE.Group(); rotor.position.set(0, 2.45, 0); g.add(rotor);
  for (let i = 0; i < 2; i++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.03, 0.22), M.steelDark); bl.rotation.y = i * Math.PI / 2; rotor.add(bl); }
  const tail = new THREE.Group(); tail.position.set(-4.2, 1.8, 0.1); g.add(tail); tail.add(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.9, 0.08), M.steelDark));
  g.position.set(x, 0.0, z); g.rotation.y = 0.0; deck.group.add(g); deck.rotors.push({ obj: rotor, speed: 14, axis: 'y' }, { obj: tail, speed: 20, axis: 'z' });
  deck.b.blockC(x, z, 3.4, 2.0);
  return g;
}
