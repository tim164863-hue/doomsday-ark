// 各層的細節加料：隔間、設備、植栽、露台家具……（純裝飾 + 少量碰撞，不動既有的 POI）
import { ex } from './config.js';
import * as THREE from 'three';
import * as FN from './furniture.js';
import { plate, signBoard, floorRect, wallG, poi } from './layouts.js';
import { xform } from './builder.js';

const PI = Math.PI;
const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);

// ---- 小型通用元件
function partition(b, x0, z0, x1, z1, h = 1.2, mat = 'fabricB') {
  const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0); const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
  if (alongX) { b.box(mat, mx, mz, Math.abs(x1 - x0), 0.07, h); b.box('steel', mx, mz, Math.abs(x1 - x0) + 0.02, 0.09, 0.03, h); b.block(Math.min(x0, x1), mz - 0.08, Math.max(x0, x1), mz + 0.08); }
  else { b.box(mat, mx, mz, 0.07, Math.abs(z1 - z0), h); b.box('steel', mx, mz, 0.09, Math.abs(z1 - z0) + 0.02, 0.03, h); b.block(mx - 0.08, Math.min(z0, z1), mx + 0.08, Math.max(z0, z1)); }
}
function bigPlant(b, x, z, s = 1) {
  b.cyl('pot', x, z, 0.34 * s, 0.55 * s, 0, 12, 0.26 * s); b.cyl('woodDark', x, z, 0.05 * s, 1.1 * s, 0.5 * s, 6);
  for (const [dx, dy, dz, r] of [[0, 1.9, 0, 0.55], [0.38, 1.55, 0.1, 0.42], [-0.35, 1.5, -0.12, 0.42], [0.05, 1.3, 0.36, 0.36]]) b.sph(dy > 1.7 ? 'leaf2' : 'leaf', x + dx * s, dy * s, z + dz * s, r * s, 1, 0.9, 1);
  b.blockC(x, z, 0.6 * s, 0.6 * s);
}
function bench(b, x, z, ry, len = 1.8, mat = 'woodLight') { const f = new FN.Frame(b, x, z, ry); f.box(mat, 0, 0, len, 0.45, 0.07, 0.42); f.box(mat, 0, -0.2, len, 0.06, 0.4, 0.45); for (const s of [-1, 1]) f.box('steelDark', s * (len / 2 - 0.12), 0, 0.06, 0.4, 0.4); f.block(0, 0, len, 0.5); }
function server(b, x, z, ry) { const f = new FN.Frame(b, x, z, ry); f.box('black', 0, 0, 0.8, 0.9, 2.1); f.box('steelDark', 0, 0.46, 0.7, 0.02, 1.9, 0.1); for (let i = 0; i < 9; i++) { f.box(i % 3 === 0 ? 'green' : 'lamp', -0.2, 0.47, 0.06, 0.02, 0.04, 0.2 + i * 0.2); f.box('steel', 0.1, 0.47, 0.3, 0.02, 0.05, 0.2 + i * 0.2); } f.block(0, 0, 0.8, 0.9); }
function cabinet(b, x, z, ry, w = 1.2, h = 1.1, mat = 'steel') { const f = new FN.Frame(b, x, z, ry); f.box(mat, 0, 0, w, 0.5, h); f.box('steelDark', 0, 0.26, w - 0.06, 0.02, 0.03, h * 0.5); f.box('steelDark', 0, 0.26, w - 0.06, 0.02, 0.03, h * 0.8); f.block(0, 0, w, 0.5); }
function printer(b, x, z, ry) { const f = new FN.Frame(b, x, z, ry); f.box('woodDark', 0, 0, 0.9, 0.55, 0.8); f.box('white', 0, 0, 0.7, 0.5, 0.28, 0.8); f.box('steelDark', 0, 0.25, 0.5, 0.02, 0.05, 1.0); f.block(0, 0, 0.9, 0.55); }
function billiard(b, x, z, ry) { const f = new FN.Frame(b, x, z, ry); f.box('woodDark', 0, 0, 2.7, 1.5, 0.78); f.box('courtGreen', 0, 0, 2.3, 1.1, 0.04, 0.78); for (const [lx, lz] of [[-1.15, -0.55], [1.15, -0.55], [-1.15, 0.55], [1.15, 0.55], [0, -0.55], [0, 0.55]]) f.cyl('black', lx, lz, 0.07, 0.05, 0.8, 8); for (const [i, c] of ['red', 'yellow', 'blue', 'orange', 'purple', 'white'].entries()) f.sph(c, 0.4 + (i % 3) * 0.12, 0.84, -0.12 + Math.floor(i / 3) * 0.12 + (i % 2) * 0.06, 0.04, 1, 1, 1, 6); f.block(0, 0, 2.8, 1.6); }
function mat2(b, x, z, w, d, c, ry = 0) { b.box(c, x, z, w, d, 0.03, 0.02, ry); }
function lampPost(b, x, z, h = 2.2) { b.cyl('steelDark', x, z, 0.05, h, 0, 6); b.sph('lamp', x, h + 0.1, z, 0.14, 1, 1, 1, 8); b.block(x - 0.1, z - 0.1, x + 0.1, z + 0.1); }
function pergola(b, x0, z0, x1, z1, h = 2.6) {
  for (const [x, z] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) { b.box('white', x, z, 0.14, 0.14, h); b.block(x - 0.09, z - 0.09, x + 0.09, z + 0.09); }
  for (const z of [z0, z1]) b.box('white', (x0 + x1) / 2, z, x1 - x0 + 0.3, 0.16, 0.14, h);
  for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / 6) b.box('woodLight', x, (z0 + z1) / 2, 0.08, z1 - z0 + 0.4, 0.07, h + 0.12);
  for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / 6) b.sph('lamp', x, h - 0.06, (z0 + z1) / 2, 0.05, 1, 1, 1, 6);
}
function stringLights(b, x0, z0, x1, z1, y = 2.3, n = 10) { for (let i = 0; i <= n; i++) { const t = i / n; b.sph('lamp', x0 + (x1 - x0) * t, y - Math.sin(t * PI) * 0.22, z0 + (z1 - z0) * t, 0.045, 1, 1, 1, 5); } }

// 救生艇：真正的尖頭艇身（放樣）+ 內艙 + 艇罩 + 舷窗 + 吊艇架
export function boatLoft(L, W, H, flip = false) {
  const N = 16, M = 9, pos = [], idx = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2 - 1; const w = W * Math.pow(Math.max(1 - Math.pow(Math.abs(t), 2.6), 0), 0.55); const top = H + 0.3 * t * t;
    for (let j = 0; j <= M; j++) { const u = (j / M) * 2 - 1; pos.push(t * L / 2, top * Math.pow(Math.abs(u), 2.5) * 0.92 + (j === 0 || j === M ? 0.08 * top : 0), u * w); }
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const a = i * (M + 1) + j, b2 = a + 1, c = a + (M + 1), d = c + 1; if (flip) idx.push(a, b2, c, b2, d, c); else idx.push(a, c, b2, b2, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
function lifeboat(b, x, z, s = 1) {
  const y0 = 0.42; const L = 4.2, W = 0.9, H = 0.78;
  b.geo('orange', xform(boatLoft(L, W, H), x, y0, z));
  b.geo('white', xform(boatLoft(L * 0.94, W * 0.9, H * 0.86, true), x, y0 + 0.1, z));       // 內艙
  b.boxc('white', x, y0 + 0.22, z, 3.4, 0.07, 0.04 + 1.5); b.boxc('white', x, y0 + 0.4, z, 3.6, 0.05, 0.05 + 1.62);
  b.boxc('white', x, y0 + 0.28, z + W * 0.9, 3.2, 0.12, 0.03); b.boxc('white', x, y0 + 0.28, z - W * 0.9, 3.2, 0.12, 0.03); // 舷側白條
  // 艇罩：半圓拱 + 兩端圓頂
  b.geo('orange', xform(new THREE.CylinderGeometry(0.62, 0.62, 2.4, 14, 1, true, 0, PI).rotateZ(PI / 2), x, y0 + H * 0.55, z));
  for (const e of [-1.2, 1.2]) b.geo('orange', xform(new THREE.SphereGeometry(0.62, 12, 6, 0, PI * 2, 0, PI / 2), x + e, y0 + H * 0.55, z, 0, 0, 0, 1, 1, 1));
  for (const dx of [-0.8, 0, 0.8]) for (const sg of [-1, 1]) b.boxc('black', x + dx, y0 + H * 0.55 + 0.34, z + sg * 0.5, 0.36, 0.2, 0.04, 0, sg * -0.5);
  b.boxc('yellow', x, y0 + H * 0.55 + 0.63, z, 0.5, 0.05, 0.4);
  b.box('steelDark', x - 1.0, z, 0.22, 0.9, 0.0, 0.0); b.box('steelDark', x + 1.0, z, 0.22, 0.9, 0.0, 0.0);
  // 墊木 / 艇架
  for (const dx of [-1.1, 1.1]) b.box('woodDark', x + dx, z, 0.3, 1.2, 0.34);
  // 吊艇架：內側立柱 + 懸臂 + 吊索
  for (const dx of [-1.3, 1.3]) {
    const pz = z - s * 1.25;
    b.box('white', x + dx, pz, 0.16, 0.16, 2.9); b.boxc('white', x + dx, 2.95, z - s * 0.55, 0.14, 0.14, 1.9); b.boxc('steelDark', x + dx, 2.4, pz + s * 0.3, 0.07, 0.07, 1.0, 0, -s * 0.7);
    b.cylc('steelDark', x + dx, 2.0, z, 0.02, 1.9, 5); b.sph('steel', x + dx, 2.95, z, 0.07, 1, 1, 1, 6);
    b.blockC(x + dx, pz, 0.3, 0.3);
  }
  b.blockC(x, z, 4.4, 1.9);
}
function pipeRun(b, x0, x1, z, y = 2.0) { b.box('steelDark', (x0 + x1) / 2, z, x1 - x0, 0.22, 0.22, y); b.box('red', (x0 + x1) / 2, z, x1 - x0, 0.14, 0.14, y + 0.3); b.box('steel', (x0 + x1) / 2, z, x1 - x0, 0.3, 0.05, y - 0.35); }
function chainCoil(b, x, z) { for (let k = 0; k < 5; k++) b.add(b.M.steelDark, xform(new THREE.TorusGeometry(1.5 - k * 0.12, 0.17, 6, 18), x, 0.2 + k * 0.28, z, PI / 2, 0, 0)); b.blockC(x, z, 3.2, 3.2); }
function flag(b, x, z, col = 'red', h = 4.2) { // x,z 為旗桿
  b.cyl('steel', x, z, 0.04, h, 0, 6); b.box(col, x + 0.55, z, 1.1, 0.03, 0.7, h - 0.7); b.box('white', x + 0.55, z, 0.4, 0.035, 0.4, h - 0.55); }

// ---- 船殼層（1F / 2F）補完：舷側走道、管線、燈、船艏艉空間
function hullFill(i, d) {
  const b = d.b;
  const side = d.hw(0) - 0.55;                         // 舷側貼牆線
  for (const s of [-1, 1]) {
    pipeRun(b, ex(-43), ex(42), s * (side - 0.0), 2.1); pipeRun(b, ex(-43), ex(42), s * (side - 0.0), 1.2);
    for (let x = ex(-42); x <= ex(40); x += 6) { b.box('lamp', x, s * (side + 0.25), 0.34, 0.06, 0.18, 1.7); b.box('steelDark', x, s * (side + 0.2), 0.5, 0.1, 0.08, 1.7); }
  }
  if (i === 0) {
    for (const s of [-1, 1]) for (const x of [ex(-40), -33, -26, -19, -12, -5, 2, 9, 28, 35, ex(42)]) cabinet(b, x, s * (d.hw(0) - 1.15), s > 0 ? PI : 0, 1.4, 1.5, ['steel', 'steelDark', 'woodDark'][Math.abs(x) % 3]);
    for (const s of [-1, 1]) for (const x of [-38, -17, 6]) { FN.crate(b, x, s * 10.9, 0.7, 'crate', 0.2, 0.7); } // 備品堆
    // 艏尖艙：錨鏈艙 + 貨櫃
    chainCoil(b, ex(50), 0); FN.cargoContainer(b, ex(47), 7.6, 0, 'cargoRed', 4.0); FN.cargoContainer(b, ex(47), -7.6, 0, 'cargoBlue', 4.0);
    b.box('yellow', ex(44.8), 0, 0.3, 14, 0.02, 0.025);
    for (const s of [-1, 1]) lampPost(b, ex(54), s * 3.5, 2.3);
    plate(d, '⚓ 錨鏈艙', ex(56.2), 2.0, 0, PI / 2, 2.2, 0.45);
  } else {
    // 船艉：蒸氣室 / 按摩池
    FN.hotTub(d, ex(-41.5), -5.2, 2.1); FN.hotTub(d, ex(-41.5), 5.2, 2.1);
    for (const z of [-9.2, 0, 9.2]) bench(b, ex(-44.3), z, PI / 2, 2.2, 'woodDark'); lampPost(b, ex(-38.5), 0, 2.0);
    bigPlant(b, ex(-37.2), -9.0, 0.9); bigPlant(b, ex(-37.2), 9.0, 0.9);
    plate(d, '♨ 溫泉 · SPA', ex(-45.2), 2.2, 0, PI / 2, 2.4, 0.5);
    // 船艏：觀景休憩艙
    pergola(b, ex(40), -2.4, ex(46), 2.4, 2.5);
    FN.sofa(b, ex(42), -4.6, 0, 2.6, 'sofa'); FN.sofa(b, ex(42), 4.6, PI, 2.6, 'sofa2'); FN.coffeeTable(b, ex(43.5), 0, 0, 1.4, 0.8);
    FN.sofa(b, ex(50), -3.3, PI / 2, 2.4, 'sofa2'); FN.sofa(b, ex(50), 3.3, -PI / 2, 2.4, 'sofa2'); FN.roundTable(b, ex(52.6), 0, 0.5);
    bigPlant(b, ex(46.8), -7.8, 1); bigPlant(b, ex(46.8), 7.8, 1); bigPlant(b, ex(55), -3.2, 0.8); bigPlant(b, ex(55), 3.2, 0.8);
    stringLights(b, ex(40), -2.4, ex(46), -2.4, 2.4, 10); stringLights(b, ex(40), 2.4, ex(46), 2.4, 2.4, 10);
    poi(d, 'chat', { x: ex(43.5), z: 0 }); plate(d, '☕ 船艏休憩艙', ex(38.6), 2.4, 0, -PI / 2, 2.4, 0.45);
  }
}

function mainDeckFill(d) {
  const b = d.b;
  // 辦公區外牆（玻璃）：保持水線上方的「上層建築」感，兩側保留甲板走道
  wallG(d, -33.9, -9.7, 6.9, -9.7, [[-23, -21.8], [-1.6, -0.4]]); wallG(d, -33.9, 9.7, 6.9, 9.7, [[-23, -21.8], [-1.6, -0.4]]); wallG(d, -33.9, -9.7, -33.9, 9.7, []);
  for (const s of [-1, 1]) {
    for (const x of [-31, -19, -7, 33, ex(42)]) lifeboat(b, x, s * 12.2, s);
    for (const x of [-26, -14, 0, 12, 24]) FN.lifeRing(b, x, 0.78, s * 13.25, s > 0 ? 0 : PI);
    for (const x of [-12, -4, 4]) { FN.loungeChair(b, x, s * 11.3, s > 0 ? -PI / 2 : PI / 2, 'fabricW'); }
    for (const x of [ex(-41), -25, 14, ex(50)]) { b.cyl('steelDark', x, s * 12.9, 0.18, 0.55, 0, 8); b.cyl('red', x, s * 12.9, 0.2, 0.08, 0.5, 8); b.blockC(x, s * 12.9, 0.45, 0.45); }
  }
  // 船艉：日光浴甲板
  for (const z of [-7, -3.5, 3.5, 7]) FN.loungeChair(b, ex(-41), z, -PI / 2, 'fabricW');
  FN.umbrella(b, ex(-43.2), -5.3, 1.7); FN.umbrella(b, ex(-43.2), 5.3, 1.7); FN.roundTable(b, ex(-43.2), -5.3, 0.5); FN.roundTable(b, ex(-43.2), 5.3, 0.5);
  bigPlant(b, ex(-45.2), -9.8, 1); bigPlant(b, ex(-45.2), 9.8, 1); flag(b, ex(-44.8), 0, 'hullBlue', 4.6); stringLights(b, ex(-44.6), -9, ex(-44.6), 9, 2.4, 18);
  // 船艏：起錨機、絞盤、纜樁、船首旗
  for (const s of [-1, 1]) { b.cyl('steelDark', ex(52), s * 3.2, 0.5, 0.9, 0, 12); b.cyl('steel', ex(52), s * 3.2, 0.38, 0.12, 0.9, 12); b.blockC(ex(52), s * 3.2, 1.1, 1.1); for (const x of [ex(46), ex(56)]) { b.cyl('red', x, s * 6.2, 0.2, 0.55, 0, 8); b.blockC(x, s * 6.2, 0.5, 0.5); } }
  { const wx = ex(49); b.box('steelDark', wx, 0, 2.4, 1.6, 0.7); b.cyl('steel', wx, -0.7, 0.55, 1.3, 0.7, 12); b.cyl('steel', wx, 0.7, 0.55, 1.3, 0.7, 12); b.blockC(wx, 0, 2.4, 1.6); }
  for (let k = 0; k < 6; k++) b.box('steelDark', ex(51) + k * 0.5, 0, 0.35, 0.18, 0.05, 0.22 + 0.0);
  flag(b, ex(58.2), 0, 'red', 4.4);
  for (const x of [ex(-39), -30]) { b.box('yellow', x, 0, 0.18, 14, 0.02, 0.025); }
}

export function enrich(i, d, ship) { ([e1, e2, e3, e4, e5][i] || (() => {}))(d, ship); if (d.hullDeck) hullFill(i, d); if (i === 2) mainDeckFill(d); }

// ================= 1F 員工生活層
function e1(d) {
  const b = d.b; const order = ['最高級打工仔', '交易員-1', '交易員-2', '0xcat', '策略研究員', '鏈上獵手'];
  const fx = [-14, -6, 2]; let ci = 0;
  for (const s of [-1, 1]) for (let c = 0; c < 3; c++) {
    ci++; const cx0 = fx[c]; const W = (u) => cx0 + u; const Z = (v) => s * (1.5 + v);
    FN.bookshelf(b, W(0.32), Z(4.5), PI / 2, 1.6, 1.4);
    b.cyl(['fabricY', 'fabricP', 'fabricG'][ci % 3], W(1.45), Z(4.0), 0.4, 0.42, 0, 12); b.sph(['fabricY', 'fabricP', 'fabricG'][ci % 3], W(1.45), 0.42, Z(4.0), 0.4, 1, 0.45, 1, 10); b.blockC(W(1.45), Z(4.0), 0.8, 0.8);
    FN.plant(b, W(4.9), Z(7.5), 0.8);
    // 桌上小物 / 牆上畫
    plate(d, ['🌊 海', '⚓ ARK', '☀️'][ci % 3], W(0.12), 1.6, Z(6.6), PI / 2, 0.9, 0.55);
    // 窗簾
    b.box('fabricW', W(7.4), Z(7.92), 0.5, 0.06, 1.7, 0.2); b.box('fabricW', W(5.8), Z(7.92), 0.5, 0.06, 1.7, 0.2);
  }
  // 餐廳：吊燈感的光點、菜單板、飲水機與水果籃
  signBoard(d, '今日特餐 · 海鮮燉飯', -22.5, 2.3, -9.35, 0, 3.4, 0.5, '#2b1a10', '#ffd9a0');
  signBoard(d, '今日特餐 · 海鮮燉飯', -22.5, 2.3, 9.35, PI, 3.4, 0.5, '#2b1a10', '#ffd9a0');
  FN.waterCooler(b, -16.2, -8.9, PI); FN.waterCooler(b, -16.2, 8.9, 0);
  FN.sofa(b, -22.2, -9.0, 0, 2.0, 'sofa'); FN.sofa(b, -22.2, 9.0, PI, 2.0, 'sofa2');
  for (const x of [-30, -17]) { b.cyl('woodDark', x, 0, 0.5, 0.5, 0, 14); b.sph('leaf', x, 0.85, 0, 0.45, 1, 0.9, 1, 8); b.blockC(x, 0, 1, 1); }
  // 儲藏室：棧板、油桶區、標示線
  for (const [x, z] of [[ex(-41.2), 0], [ex(-39.6), 0.0]]) { b.box('woodLight', x, z, 1.1, 1.1, 0.12); b.box('crate', x, z, 0.9, 0.9, 0.7, 0.12); b.block(x - 0.55, z - 0.55, x + 0.55, z + 0.55); }
  for (let k = 0; k < 6; k++) b.box('yellow', -36 - k * 0.6, 0, 0.7, 0.14, 0.02, 0.025);
  // 前甲板：長椅 + 欄邊植栽 + 繩纜捲
  bigPlant(b, 25.5, -8, 1); bigPlant(b, 25.5, 8, 1);
  lampPost(b, 36, -8.5); lampPost(b, 36, 8.5); lampPost(b, ex(46), -4.5); lampPost(b, ex(46), 4.5);
}

// ================= 2F 運動健康層
function e2(d) {
  const b = d.b;
  // 瑜珈角（x 5~11, z -8~-4）
  floorRect(d, 'woodLight', 3.2, -8.8, 11.4, -3.6, 0.025);
  [['pink', 4.6], ['lightblue', 6.0], ['purple', 7.4], ['green', 8.8]].forEach(([c, x], k) => { mat2(b, x, -6.1, 0.65, 1.8, c); });
  plate(d, '瑜珈 · 伸展', 3.1, 2.0, -5.5, PI / 2, 1.5, 0.36);
  for (const x of [10.2]) { b.cyl('woodDark', x, -8.0, 0.2, 0.5, 0, 10); b.sph('leaf', x, 0.8, -8.0, 0.35, 1, 1, 1, 8); }
  // 拳擊台（艦尾側 x -33~-22 上方 z>?）改放在 x 12~20 外側：以拳擊沙包代替
  for (const x of [-30, -27.5, -25]) { b.cyl('steelDark', x, -8.6, 0.04, 2.6, 0, 6); b.cyl('red', x, -8.4, 0.2, 0.9, 1.0, 10); b.blockC(x, -8.4, 0.5, 0.5); }
  // 跑道邊：飲水站 + 毛巾架 + 長椅
  for (const x of [-12, 14]) bench(b, x, 9.9 - 0.0, PI, 1.8, 'woodLight');
  FN.waterCooler(b, 3.6, 8.5, PI); FN.waterCooler(b, 3.6, -8.5, 0);
  // 健身房：啞鈴區、墊子、器材
  mat2(b, -29.5, 5.6, 0.7, 1.9, 'blue'); mat2(b, -28.4, 5.6, 0.7, 1.9, 'orange');
  FN.plant(b, -22.8, -8.2, 1); FN.plant(b, -22.8, 8.2, 1);
  signBoard(d, '今日目標：5 公里', -33.78, 2.5, 0, PI / 2, 2.8, 0.45, '#10202e', '#6fe0a0');
  // 醫務室：藥櫃、座椅
  FN.diningChair(b, -15.2, -2.0, -PI / 2, 'fabricW'); FN.diningChair(b, -16.6, -1.2, PI, 'fabricW'); FN.plant(b, -20.4, -1.4, 0.8);
  // 球場周邊：計分板、長椅、觀眾席
  signBoard(d, 'SCORE  0 : 0', 28.8, 3.2, -9.6, 0, 2.6, 0.6, '#101820', '#ffcf6a');
  for (const x of [26, 29, 32]) bench(b, x, 9.4, PI, 2.2, 'fabricB');
  for (const x of [24.5, 33.5]) { b.cyl('steelDark', x, -9.4, 0.05, 2.4, 0, 6); }
  // 艦艏甲板：咖啡桌椅
  for (const z of [-5, 0, 5]) { FN.roundTable(b, ex(41), z, 0.5); FN.diningChair(b, ex(41) - 0.8, z, PI / 2); FN.diningChair(b, ex(41) + 0.8, z, -PI / 2); }
  FN.umbrella(b, ex(41), 0, 2.0);
  bigPlant(b, 36.5, -8, 1); bigPlant(b, 36.5, 8, 1); bigPlant(b, 8, -9.4, 0.9);
}

// ================= 3F 會議工作層（辦公區重做）
function e3(d, ship) {
  const b = d.b;
  const northX = [-18.5, -13.5, -8.5, -3.5];
  // 隔板：每個座位一格
  for (const x of [-21, -16, -11, -6, -1]) partition(b, x, -9.0, x, -6.35, 1.25, 'fabricB');
  for (const x of [-21, -16, -11, -6]) partition(b, x, 6.35, x, 9.0, 1.25, 'fabricG');
  for (const [k, x] of [['策略研究員', -18.5], ['最高級打工仔', -13.5], ['0xcat', -8.5], ['鏈上獵手', -3.5]]) plate(d, k, x, 1.55, -9.02, 0, 1.4, 0.3);
  for (const x of [-18.5, -13.5, -8.5]) plate(d, '空位', x, 1.55, 9.02, PI, 1.0, 0.26);
  // 交易員島：地毯 + 螢幕牆 + 隔板
  b.box('carpet2', -25, 0, 4.4, 5.4, 0.02, 0.02);
  partition(b, -27.6, -3.3, -27.6, 3.3, 1.3, 'fabricP'); partition(b, -22.4, -3.3, -22.4, 3.3, 1.3, 'fabricP');
  signBoard(d, '交易島', -25, 2.5, 0, 0, 2.2, 0.45, '#2a0f0f', '#ff9a8a').visible = false;
  // 西牆：機櫃（機房感）、印表區
  for (let k = 0; k < 4; k++) server(b, -32.7, 3.6 + k * 1.05, PI / 2);
  signBoard(d, 'SERVER', -33.55, 2.5, 5.2, PI / 2, 1.8, 0.4, '#06121e', '#6fe0ff');
  printer(b, -27.3, -8.9, 0); cabinet(b, -25.9, -8.9, 0, 1.2, 1.1); cabinet(b, -24.6, -8.9, 0, 1.2, 1.1);
  b.box('steel', -25.3, -8.92, 2.6, 0.02, 0.04, 1.12);
  // 中央：圓形討論桌 + 沙發休憩區
  for (const [cx, cz] of [[-13, -0.5], [-8.5, 1.8]]) { FN.roundTable(b, cx, cz, 0.8); for (let k = 0; k < 4; k++) { const a = k * PI / 2 + 0.4; const x = cx + Math.cos(a) * 1.2, z = cz + Math.sin(a) * 1.2; FN.diningChair(b, x, z, faceTo(x, z, cx, cz), 'fabricY'); } }
  b.box('rug', -3.4, -3.6, 4.2, 3.0, 0.02, 0.02);
  FN.sofa(b, -3.4, -5.0, 0, 2.4, 'sofa'); FN.sofa(b, -3.4, -2.2, PI, 2.4, 'sofa2'); FN.coffeeTable(b, -3.4, -3.6, 0, 1.2, 0.6);
  // 植栽與隔屏
  bigPlant(b, -31.6, -5.4, 0.9); bigPlant(b, 6.0, -3.0, 0.9); bigPlant(b, 6.0, 3.0, 0.9); bigPlant(b, -20.8, -3.2, 0.8); bigPlant(b, -20.8, 3.2, 0.8);
  signBoard(d, '專注 · 安靜工作中', -3.0, 2.5, -9.3, 0, 3.0, 0.5, '#10202e', '#9fd0ff').visible = true;
  // 東側玻璃牆（中間留 4m 通道）
  const hw = d.hw(7) - 0.15;
  wallG(d, 7, -hw, 7, hw, [[-2.0, 2.0]]);
  // 戶外露台
  pergola(b, 9.5, 6.7, 14.5, 8.3); for (const x of [10.6, 12.4]) { FN.roundTable(b, x, 7.5, 0.45); }
  FN.diningChair(b, 10.6, 8.2, PI); FN.diningChair(b, 12.4, 8.2, PI); FN.diningChair(b, 10.6, 6.8, 0); FN.diningChair(b, 12.4, 6.8, 0);
  bench(b, 20.5, 8.3, PI, 2.0); bench(b, 23.6, 8.3, PI, 2.0); bench(b, 21.5, -8.3, 0, 2.2); bigPlant(b, 9.4, -8.2, 0.9); bigPlant(b, 24.5, 8.4, 0.9); bigPlant(b, 24.8, -8.2, 0.9);
  FN.umbrella(b, 17, 8.4, 1.5);
  // 會議室：書牆、茶水櫃、地毯
  FN.bookshelf(b, 28.5, -5.1, 0, 2.2, 2.0); FN.bookshelf(b, 31.2, -5.1, 0, 2.2, 2.0); FN.bookshelf(b, 28.5, 5.1, PI, 2.2, 2.0); FN.bookshelf(b, 31.2, 5.1, PI, 2.2, 2.0);
  cabinet(b, 35.2, -5.0, 0, 1.6, 0.9, 'woodDark'); cabinet(b, 35.2, 5.0, PI, 1.6, 0.9, 'woodDark'); FN.coffeeMachine(b, 35.4, -5.1, 0); FN.waterCooler(b, 36.4, 4.9, PI);
  b.box('rug', 31.8, 0, 7.4, 3.8, 0.02, 0.02);
  plate(d, '週會 10:00', 37.45, 1.7, 0, -PI / 2, 1.6, 0.32);
  lampPost(b, ex(40.5), -3.5); lampPost(b, ex(40.5), 3.5);
}

// ================= 4F 娛樂休閒層
function e4(d) {
  const b = d.b;
  // 泳池：池邊淋浴、毛巾架、長椅、棕櫚
  b.cyl('steel', -7.4, -4.6, 0.05, 2.2, 0, 6); b.cylc('steel', -7.4, 2.25, -4.6, 0.18, 0.05, 10); b.blockC(-7.4, -4.6, 0.3, 0.3);
  for (let k = 0; k < 4; k++) b.box(['white', 'lightblue', 'pink', 'yellow'][k], -22.8, 6.9, 0.2, 0.7, 0.02, 0.9 + k * 0.1);
  for (const x of [-22, -16.5]) bigPlant(b, x, 7.6, 0.9);
  bigPlant(b, -23.3, 7.9, 1); bigPlant(b, -7.0, -7.7, 0.9); bigPlant(b, -7.0, 7.7, 0.9);
  for (const x of [-21.5, -18.8, -16.1, -13.4, -10.7]) lampPost(b, x, 6.3, 1.0);
  // 吧台與中央娛樂區：撞球桌、高腳桌
  billiard(b, 0.8, -0.4, 0); billiard(b, 5.4, -0.4, 0);
  plate(d, '撞球 · 飛鏢', 3.0, 2.3, 8.0 - 0.0, PI, 0.01, 0.01).visible = false;
  for (const [x, z] of [[-1.2, 2.2], [7.2, 2.0]]) { b.cyl('steelDark', x, z, 0.35, 0.05, 1.0, 12); b.cyl('steelDark', x, z, 0.04, 1.0, 0, 6); b.cyl('steelDark', x, z, 0.22, 0.04, 0, 10); b.blockC(x, z, 0.7, 0.7); }
  // 街機區看板、投幣機
  signBoard(d, 'ARCADE · 街機天堂', 3.0, 2.7, -8.9, 0, 4.2, 0.6, '#14082a', '#7fe0ff');
  // 舞台 / DJ 台（艦尾側）
  // 艦首：迷你高爾夫果嶺 + 躺椅 + 酒吧小桌
  floorRect(d, 'grass', 31.5, -3.0, 38.5, 3.0, 0.04);
  b.cyl('black', 36.3, 0.4, 0.12, 0.05, 0.04, 10); b.cyl('steel', 36.3, 0.4, 0.015, 1.1, 0.04, 4); b.box('red', 36.55, 0.4, 0.3, 0.02, 0.2, 0.9);
  b.sph('white', 32.8, 0.08, -0.6, 0.06, 1, 1, 1, 8); b.cyl('concrete', 34.4, 1.2, 0.5, 0.05, 0.04, 12); b.box('rust', 34.6, -1.3, 0.08, 1.2, 0.07, 0.04);
  for (const z of [-5.6, 5.6]) { FN.loungeChair(b, 33, z, PI / 2 * 3, 'fabricY') }
  FN.umbrella(b, 32, -5.9, 1.5); FN.umbrella(b, 32, 5.9, 1.5);
  bigPlant(b, 30.5, -6.4, 1); bigPlant(b, 30.5, 6.4, 1);
  stringLights(b, 28.6, -8.3, 28.6, 8.3, 2.5, 14);
  lampPost(b, 28.6, -8.3, 2.5); lampPost(b, 28.6, 8.3, 2.5);
  // 觀景長椅
  bench(b, 14, 8.2, PI, 2.0); bench(b, 21, -8.2, 0, 2.0); bench(b, 24, 8.2, PI, 2.0);
  bigPlant(b, 9.4, 8.2, 0.9); bigPlant(b, 9.4, -8.2, 0.9);
}

// ================= 5F 董事長辦公層
function e5(d, ship) {
  const b = d.b;
  { // 大煙囪（白身、深藍頂帶 + 金色圓形 ARK 標誌）+ 雷達桅杆
    const fx = -19.4, fz = -4.6;
    b.cyl('white', fx, fz, 1.5, 4.6, 0, 20, 1.26); b.cyl('hullBlue', fx, fz, 1.26, 1.4, 4.6, 20, 1.2); b.cyl('black', fx, fz, 1.2, 0.18, 6.0, 20); b.cyl('yellow', fx, fz, 1.27, 0.1, 4.55, 20);
    for (const sg of [-1, 1]) { b.cylc('white', fx, 5.1, fz + sg * 1.2, 0.5, 0.06, 18, PI / 2, 0, 0); b.sph('yellow', fx, 5.1, fz + sg * 1.24, 0.3, 1, 1, 0.12, 14); b.box('hullBlue', fx, fz + sg * 1.27, 0.34, 0.03, 0.34, 4.93); }
    for (const dx of [-0.7, 0, 0.7]) b.cyl('steel', fx + dx, fz, 0.06, 1.1, 6.15, 6);
    // 桅杆
    b.cyl('white', -21.2, 0, 0.1, 7.5, 0, 8); b.box('steelDark', -21.2, 0, 0.1, 2.4, 0.08, 5.6); b.box('steel', -21.2, 0, 0.1, 2.0, 0.06, 6.6); b.sph('red', -21.2, 7.6, 0, 0.14, 1, 1, 1, 6); b.sph('lamp', -21.2, 7.9, 0, 0.1, 1, 1, 1, 6);
    b.cyl('white', -21.2, 0, 0.12, 0.3, 7.3, 8); b.box('white', -21.2, 1.2, 0.08, 0.9, 0.5, 7.0); b.blockC(-21.2, 0, 0.5, 0.5);
    flag(b, -21.6, 3.6, 'red', 3.2); flag(b, -21.6, -2.2, 'yellow', 3.2);
  }
  // 直升機坪：邊燈、風向袋、H 標記、安全黃黑條紋、油桶與消防箱
  for (let k = 0; k < 24; k++) { const a = (k / 24) * PI * 2; b.sph(k % 2 ? 'yellow' : 'lamp', -14.5 + Math.cos(a) * 5.55, 0.18, Math.sin(a) * 5.55, 0.09, 1, 1, 1, 6); }
  b.box('courtLine', -14.5, 0, 0.5, 3.2, 0.02, 0.115); b.box('courtLine', -14.5 - 0.0, 0.0, 2.2, 0.5, 0.02, 0.116);
  b.cyl('steelDark', -9.6, 6.2, 0.05, 3.0, 0, 6); b.add(b.M.red, xform(new THREE.ConeGeometry(0.28, 1.2, 8).rotateZ(-PI / 2), -9.0, 2.8, 6.2));
  b.cyl('rust', -20.4, -5.4 + 9.6, 0.3, 0.9, 0, 10); b.blockC(-20.4, 4.2, 0.7, 0.7); b.cyl('red', -21.2, 4.4, 0.3, 0.9, 0, 10); b.blockC(-21.2, 4.4, 0.7, 0.7);
  b.box('red', -20.8, 5.3, 0.9, 0.35, 0.8); b.blockC(-20.8, 5.3, 0.9, 0.35);
  signBoard(d, '直升機坪 · HELIPAD', -9.3, 0.4, -4.8, PI / 2, 2.4, 0.4, '#1a1a1a', '#ffd34a').visible = false;
  // 通往直升機坪的走道標線（從辦公室西門 z≈5.3）
  b.box('yellow', -7.6, 5.3, 4.2, 0.18, 0.02, 0.022); b.box('yellow', -8.8, 3.6, 0.18, 3.4, 0.02, 0.022);
  // 辦公室：地球儀、獎盃櫃、方舟模型、掛畫、酒櫃
  b.cyl('woodDark', 8.2, -2.6, 0.25, 0.9, 0, 10); b.sph('blue', 8.2, 1.3, -2.6, 0.38, 1, 1, 1, 14); b.box('steel', 8.2, -2.6, 0.04, 0.04, 0.9, 0.9 + 0.0); b.blockC(8.2, -2.6, 0.6, 0.6);
  FN.bookshelf(b, 5.2, -6.4, 0, 2.0, 1.2); b.box('steelDark', 3.2, 6.35, 1.8, 0.5, 1.0); for (let k = 0; k < 4; k++) b.cyl(['green', 'red', 'blue', 'orange'][k], 2.6 + k * 0.35, 6.35, 0.07, 0.34, 1.0, 8); b.block(2.3, 6.1, 4.1, 6.6);
  plate(d, '進取 · 穩健', -5.45, 2.3, -3.8, PI / 2, 1.8, 0.4); plate(d, 'ARK 2026', -5.45, 2.3, 3.8, PI / 2, 1.8, 0.4);
  b.box('woodLight', 2.0, 0.0, 0.5, 0.5, 0.6); b.add(b.M.white, xform(new THREE.ConeGeometry(0.2, 0.7, 4).rotateZ(-PI / 2), 2.0, 1.0, 0.0)); // 方舟模型（桌上）
  b.box('rug', 3.0, 0, 5.0, 4.0, 0.02, 0.02);
  // 露台：酒吧車、烤爐、望遠鏡、船舵擺飾、盆栽
  b.box('woodDark', 11.4, -6.1, 3.0, 0.7, 1.05); b.box('woodLight', 11.4, -6.1, 3.2, 0.9, 0.06, 1.05); for (let k = 0; k < 5; k++) b.cyl(['green', 'orange', 'blue', 'red', 'lightblue'][k], 10.4 + k * 0.5, -6.1, 0.07, 0.3, 1.11, 8); b.block(9.8, -6.5, 13.0, -5.7);
  for (const x of [10.4, 11.4, 12.4]) { FN.stool(b, x, -5.2, 0.7, 'blue'); }
  FN.diningChair(b, 21.2, -0.3, -PI / 2); FN.roundTable(b, 22.4, -0.3, 0.5); FN.diningChair(b, 23.6, -0.3, PI / 2);
  b.box('black', 22.0, 6.2, 0.9, 0.55, 0.7); b.box('steelDark', 22.0, 6.2, 0.95, 0.6, 0.1, 0.7); b.cyl('steel', 22.0, 6.2, 0.04, 0.5, 0.8, 6); b.block(21.5, 5.9, 22.5, 6.5);
  b.cyl('steel', 24.7, 1.6, 0.04, 1.4, 0, 6); b.cylc('steel', 24.7, 1.6, 1.6, 0.07, 0.8, 8, 0, 0, PI / 2.6); b.blockC(24.7, 1.6, 0.4, 0.4);
  b.cyl('woodDark', 24.8, -1.6, 0.18, 1.0, 0, 8); b.add(b.M.woodLight, xform(new THREE.TorusGeometry(0.42, 0.05, 6, 16), 24.8, 1.5, -1.6, 0, PI / 2, 0)); b.blockC(24.8, -1.6, 0.5, 0.5);
  bigPlant(b, 24.4, 6.2, 0.9); bigPlant(b, 24.4, -6.4, 0.9); bigPlant(b, 9.7, 3.2, 0.8); bigPlant(b, 13.4, 6.4, 0.8);
  stringLights(b, 9.4, 6.9, 24.2, 6.9, 2.4, 14); lampPost(b, 9.4, 6.9, 2.4); lampPost(b, 24.2, 6.9, 2.4);
  FN.lifeRing(b, 20, 0.7, 7.35, 0);
}
