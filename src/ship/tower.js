// 旗艦晉升後的上層甲板（6F–8F 塔樓）與加長段（艦艏 / 艦艉）的分支外觀（階段③）。
// 座標沿用 5F 的樓梯 / 電梯：樓梯在 x 16–23.2、z ±(2.85–5.55)，電梯在 x 10.7–13.3、z −6.8…−4.2；其餘空間隨便擺。
import * as THREE from 'three';
import * as FN from './furniture.js';
import { plate, signBoard, poi, floorRect } from './layouts.js';
import { xform } from './builder.js';
import { TIER, TOP, ANNEX, SHIP } from './config.js';
const PI = Math.PI;

const cons = (b, x, z, ry, w = 1.6, mat = 'steelDark', scr = 'lamp') => {   // 控制台（面朝 ry 的前方有斜面螢幕）
  const f = new FN.Frame(b, x, z, ry); f.box(mat, 0, 0, w, 0.8, 0.85); f.boxc(scr, 0, 1.1, 0.05, w - 0.15, 0.5, 0.05, -0.45); f.box('black', 0, 0.45, w - 0.1, 0.14, 0.04, 0.88); f.block(0, 0, w, 0.9);
};
const tower = (b, x, z, r, h, mat = 'steelDark') => { b.cyl(mat, x, z, r, h, 0, 10); b.blockC(x, z, r * 2, r * 2); };
const radar = (d, x, z, y, speed = 1.6) => {   // 旋轉雷達
  const g = new THREE.Group(); g.position.set(x, y, z); d.group.add(g);
  const M = d.M; const dish = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 0.55), M.steelDark); g.add(dish); const dish2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.3, 0.08), M.steel); dish2.position.set(0, 0.2, 0.3); g.add(dish2);
  d.rotors.push({ obj: g, axis: 'y', speed });
};
const dome = (b, x, z, r, mat = 'white') => { b.cyl('steelDark', x, z, r * 1.15, 0.7, 0, 16); b.sph(mat, x, 0.7, z, r, 1, 0.8, 1, 18); b.boxc('black', x + r * 0.2, 0.7 + r * 0.55, z, r * 0.9, 0.12, r * 0.55, 0, 0, 0.5); b.blockC(x, z, r * 2.2, r * 2.2); };
const crateStack = (b, x, z, mat = 'cargoRed', n = 2, ry = 0) => { for (let k = 0; k < n; k++) b.box(mat, x, z, 3.2, 1.5, 1.4, k * 1.4, ry); b.blockC(x, z, 3.2, 1.5, ry); };
const gun = (d, x, z, ry, big = 1) => {   // 雙聯裝砲塔
  const b = d.b; b.cyl('steelDark', x, z, 1.05 * big, 0.35, 0, 14); b.cyl('steel', x, z, 0.95 * big, 0.5, 0.35, 12, 0.7 * big);
  const f = new FN.Frame(b, x, z, ry); for (const s of [-1, 1]) { const [px, pz] = f.w(s * 0.28 * big, 1.3 * big); b.cylc('black', px, 0.95 * big, pz, 0.09 * big, 2.3 * big, 8, PI / 2, ry, 0); }
  b.blockC(x, z, 2.2 * big, 2.2 * big);
};

/** 分支 × 層：6F / 7F / 8F 的內容 */
const BUILD = {
  war: [
    (d, ship) => { const b = d.b; floorRect(d, 'tileDark', 9.5, -2.8, 28, 2.8, 0.02);
      FN.table(b, 18.2, 0, 6.2, 2.2, 0, 'steelDark', 0.9); b.box('tileBlue', 18.2, 0, 5.8, 1.8, 0.02, 0.96); for (const x of [15.8, 18.2, 20.6]) b.box('red', x, 0.2, 0.2, 0.2, 0.05, 0.98);
      for (const z of [-1.9, 1.9]) for (const x of [12.8, 15, 21.4, 23.6]) cons(b, x, z * 1.2, z > 0 ? PI : 0, 1.3, 'steelDark');
      FN.tv(d, 28.3, 1.8, -1.2, -PI / 2, 2.6, null, ship.tvTex); FN.tv(d, 28.3, 1.8, 1.4, -PI / 2, 2.0, null, ship.tvTex);
      FN.crate(b, 9.6, 5.6, 0.9, 'crate'); FN.crate(b, 9.6, 6.6, 0.9, 'crate'); FN.barrel(b, 27.4, 6.2); FN.barrel(b, 27.4, -6.2);
      signBoard(d, '作 戰 指 揮 中 心', 9.0, 2.6, 0, PI / 2, 3.6, 0.5, '#1d2630', '#9fd0ff'); poi(d, 'chat', { x: 18.2, z: 2.3 }); },
    (d, ship) => { const b = d.b; floorRect(d, 'tileDark', 9.5, -2.8, 28, 2.8, 0.02); cons(b, 26.6, 0, -PI / 2, 4.6, 'black'); cons(b, 25.4, -2.2, -PI / 2, 1.4, 'steelDark'); cons(b, 25.4, 2.2, -PI / 2, 1.4, 'steelDark');
      b.cyl('woodDark', 24.2, 0, 0.5, 0.9, 0, 12); b.cylc('woodLight', 24.2, 1.45, 0, 0.5, 0.06, 18, PI / 2, 0, 0); for (let k = 0; k < 8; k++) { const a = k * PI / 4; b.boxc('woodLight', 24.2 + Math.cos(a) * 0.5, 1.45, Math.sin(a) * 0.5, 0.12 + 0.6 * 0, 0.05, 0.05, a); } b.blockC(24.2, 0, 1.0, 1.0);
      for (const z of [-1.8, 1.8]) { FN.shelf(b, 10.6, z * 1.9, PI / 2, 2.2); }
      for (let k = 0; k < 4; k++) FN.barrel(b, 14.4 + k * 0.8, -6.3, 'red'); for (let k = 0; k < 4; k++) FN.crate(b, 24 + k * 1.0, 6.4, 0.8, 'crate');
      b.cyl('steel', 14, 0.9, 0.12, 2.4, 0, 8); b.cyl('steelDark', 14, 0.9, 0.2, 0.5, 2.2, 8); b.blockC(14, 0.9, 0.5, 0.5);   // 潛望鏡
      signBoard(d, '砲術 · 艦橋', 9.6, 2.6, 0, PI / 2, 2.6, 0.5, '#1d2630', '#9fd0ff'); poi(d, 'chat', { x: 14.5, z: -1.5 }); },
    (d) => { const b = d.b; floorRect(d, 'asphalt', 10.5, -5.6, 28, 5.6, 0.02);
      radar(d, 24.6, 0, 3.6, 1.8); tower(b, 24.6, 0, 0.35, 3.5); b.box('steelDark', 24.6, 0, 1.6, 1.6, 0.35, 3.3);
      for (const z of [-1, 1]) { const zz = z * 1.8; b.box('steelDark', 14, zz, 2.2, 1.0, 0.35); b.cylc('steel', 14.4, 1.3, zz, 0.45, 2.4, 10, 0, 0, 0.9); b.cylc('red', 15.3, 2.3, zz, 0.14, 0.5, 8, 0, 0, 0.9); b.blockC(14, zz, 2.2, 1.0); }
      for (const [x, z] of [[27.0, 3.4], [27.0, -3.4]]) { b.cyl('steelDark', x, z, 0.35, 0.9, 0, 10); b.cylc('steel', x, 1.25, z, 0.14, 1.5, 8, 0, 0, PI / 2 - 0.6); b.blockC(x, z, 0.8, 0.8); }
      b.cyl('white', 11.6, 0.0, 0.1, 6.2, 0, 8); b.box('steelDark', 11.6, 0, 0.1, 2.6, 0.06, 5.4); b.sph('red', 11.6, 6.3, 0, 0.12, 1, 1, 1, 6); b.blockC(11.6, 0, 0.5, 0.5);
      poi(d, 'rail', { x: 27.2, z: 0, face: PI / 2 }); poi(d, 'chat', { x: 16, z: -0.2 }); },
  ],
  mer: [
    (d, ship) => { const b = d.b; floorRect(d, 'rug', 9.5, -2.8, 28, 2.8, 0.02);
      for (const z of [-2.2, 2.2]) FN.counter(b, 13.6, z * 0.98, 18.2, z * 0.98, 1.05, 0.7, 'woodDark', 'woodLight');
      FN.counter(b, 24.6, -2.0, 24.6, 2.0, 1.05, 0.7, 'woodDark', 'woodLight');
      for (const z of [-1.2, 1.2]) FN.roundTable(b, 20.6, z, 0.5);
      for (const z of [-1.2, 1.2]) for (const dx of [-0.9, 0.9]) FN.diningChair(b, 20.6 + dx, z, dx > 0 ? -PI / 2 : PI / 2);
      FN.tv(d, 28.4, 1.9, 0, -PI / 2, 4.2, null, ship.tvTex);
      FN.plant(b, 9.8, 5.8, 1.2); FN.plant(b, 9.8, -2.4, 1.2); FN.plant(b, 27.2, 6.0, 1.1); FN.plant(b, 27.2, -6.0, 1.1);
      for (const z of [-1, 1]) b.box('yellow', 15.8, z * 1.7, 0.5, 0.3, 0.08, 1.06);
      signBoard(d, '貿 易 交 易 大 廳', 9.0, 2.6, 0, PI / 2, 3.8, 0.5, '#3a1f10', '#ffd9a0'); poi(d, 'chat', { x: 20.6, z: 0 }); },
    (d) => { const b = d.b; floorRect(d, 'concrete', 9.5, -2.8, 28, 2.8, 0.02);
      crateStack(b, 12.3, 2.2, 'cargoBlue', 2, PI / 2); crateStack(b, 26.2, -2.2, 'cargoRed', 2, 0); crateStack(b, 26.2, 2.2, 'cargoGreen', 1, 0);
      FN.whiteboard(b, 9.2, -2.2, PI / 2, 2.6); FN.shelf(b, 9.8, 2.8, PI / 2, 2.2);
      for (let k = 0; k < 3; k++) FN.crate(b, 14 + k * 1.2, -6.2, 0.9, 'crate'); for (let k = 0; k < 3; k++) FN.crate(b, 24 + k * 1.0, 6.3, 0.9, 'crate');
      FN.workDesk(d, 15.6, 0.2, -PI / 2, {}); FN.barrel(b, 27.5, 6.4, 'cargoBlue');
      signBoard(d, '貨 運 調 度 中 心', 9.0, 2.6, 0, PI / 2, 3.6, 0.5, '#3a1f10', '#ffd9a0'); poi(d, 'chat', { x: 19, z: 0 }); },
    (d) => { const b = d.b; floorRect(d, 'woodLight', 10.5, -5.6, 28, 5.6, 0.02);
      FN.sofa(b, 26.2, -1.9, -PI / 2, 2.4, 'sofa2'); FN.sofa(b, 26.2, 1.9, -PI / 2, 2.4, 'sofa2'); FN.coffeeTable(b, 24.4, 0, PI / 2, 1.4, 0.7);
      FN.loungeChair(b, 14.5, -1.8, PI / 2, 'fabricW'); FN.loungeChair(b, 14.5, 1.8, PI / 2, 'fabricW'); FN.umbrella(b, 15.8, 0, 1.8);
      b.cyl('steel', 12.0, 0.0, 0.05, 1.3, 0, 8); b.cylc('steel', 12.0, 1.5, 0.1, 0.07, 1.4, 8, 0, 0, PI / 2.4); b.blockC(12.0, 0, 0.5, 0.5);
      b.cyl('steelDark', 9.6, 0, 0.12, 6.2, 0, 8); b.box('red', 10.2, 0, 1.2, 0.02, 0.8, 5.4); for (const x of [14, 22]) for (const z of [-6.2, 6.2]) { b.cyl('steelDark', x, z, 0.05, 2.3, 0, 6); b.sph('lamp', x, 2.4, z, 0.14, 1, 1, 1, 8); }
      FN.plant(b, 27.0, 6.0, 1.1); FN.plant(b, 27.0, -6.0, 1.1); poi(d, 'rail', { x: 27.2, z: 0, face: PI / 2 }); poi(d, 'chat', { x: 25.0, z: 0.2 }); },
  ],
  sci: [
    (d) => { const b = d.b; floorRect(d, 'tileBlue', 9.5, -2.8, 28, 2.8, 0.02);
      for (const z of [-2.3, 2.3]) FN.counter(b, 13.4, z, 19.0, z, 1.0, 0.8, 'steel', 'white');
      for (let k = 0; k < 5; k++) { b.cyl('lightblue', 13.8 + k * 1.1, -2.3, 0.1, 0.34, 1.0, 8); b.sph('lamp', 13.8 + k * 1.1, 1.44, 2.3, 0.1, 1, 1, 1, 6); }
      FN.table(b, 22.8, 0, 3.0, 1.4, 0, 'steelDark', 0.9); b.sph('lightblue', 22.8, 1.55, 0, 0.5, 1, 1, 1, 14); b.cyl('steel', 22.8, 0, 0.1, 0.12, 0.92, 6);
      FN.whiteboard(b, 9.2, 2.6, PI / 2, 2.4); FN.bookshelf(b, 9.4, -2.7, PI / 2, 2.2, 2.0); FN.waterCooler(b, 27.6, 5.8);
      for (const z of [-6.2, 6.2]) FN.crate(b, 26.4, z, 0.8, 'crate');
      signBoard(d, '實 驗 研 究 室', 9.0, 2.6, 0, PI / 2, 3.4, 0.5, '#0e2a40', '#a8e4ff'); poi(d, 'chat', { x: 22.8, z: 1.7 }); },
    (d) => { const b = d.b; floorRect(d, 'tileDark', 9.5, -2.8, 28, 2.8, 0.02);
      dome(b, 25.0, 0, 1.7, 'white'); b.cyl('steel', 25.0, 0, 0.1, 2.2, 0, 8);
      FN.table(b, 18.2, 0, 2.8, 1.2, 0, 'steelDark', 0.9); cons(b, 18.2, 1.9 * 0.5, PI, 1.6, 'steelDark'); FN.officeChair(b, 18.2, -1.4, PI);
      for (const z of [-2.4, 2.4]) { FN.bookshelf(b, 12.8, z * 1.2, PI / 2, 2.0, 1.8); }
      FN.plant(b, 27.4, 6.0, 1.0); FN.plant(b, 27.4, -6.0, 1.0);
      b.box('black', 9.15, 0, 0.12, 3.6, 1.8, 0.5); for (let k = 0; k < 18; k++) b.sph('lamp', 9.24, 0.7 + (k * 37 % 15) * 0.1, ((k * 53 % 31) / 31 - 0.5) * 3.3, 0.03, 1, 1, 1, 5);
      signBoard(d, '天 文 觀 測 站', 9.4, 2.6, 0, PI / 2, 3.2, 0.5, '#0e2a40', '#a8e4ff'); poi(d, 'chat', { x: 15.5, z: 0.4 }); },
    (d) => { const b = d.b; floorRect(d, 'asphalt', 10.5, -5.6, 28, 5.6, 0.02);
      b.cyl('white', 24.6, 0, 0.18, 3.6, 0, 8); b.sph('white', 24.6, 4.5, 0, 1.45, 1, 1, 1, 18); b.cyl('steelDark', 24.6, 0, 0.5, 0.35, 3.3, 8); b.blockC(24.6, 0, 1.0, 1.0);
      { const g = new THREE.Group(); g.position.set(15.0, 2.6, 0); d.group.add(g); for (let k = 0; k < 3; k++) { const a = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), d.M.red); a.position.set(Math.cos(k * 2.094) * 0.7, 0, Math.sin(k * 2.094) * 0.7); g.add(a); const arm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.05), d.M.steel); arm.position.set(Math.cos(k * 2.094) * 0.35, 0, Math.sin(k * 2.094) * 0.35); arm.rotation.y = -k * 2.094; g.add(arm); } d.rotors.push({ obj: g, axis: 'y', speed: 4 }); b.cyl('steelDark', 15.0, 0, 0.08, 2.6, 0, 6); b.blockC(15, 0, 0.5, 0.5); }
      b.cylc('steel', 12.0, 1.1, 2.0, 1.1, 0.12, 22, PI / 2 - 0.7, 0, 0); b.cyl('steelDark', 12.0, 2.0, 0.1, 1.1, 0, 6); b.blockC(12, 2, 1.4, 1.4);
      b.cyl('white', 10.8, 0, 0.1, 6.0, 0, 8); b.box('steelDark', 10.8, 0, 0.1, 2.4, 0.06, 5.2); b.sph('lamp', 10.8, 6.1, 0, 0.11, 1, 1, 1, 6); b.blockC(10.8, 0, 0.5, 0.5);
      poi(d, 'rail', { x: 27.2, z: 0, face: PI / 2 }); poi(d, 'chat', { x: 19.2, z: -0.2 }); },
  ],
};
export function towerDeck(d, ship, lv) { const fn = (BUILD[TIER.branch] || BUILD.sci)[lv - 5]; if (fn) fn(d, ship); poi(d, 'rail', { x: 27.0, z: 0, face: PI / 2 }); }

/** 加長段的分支外觀：放在 3F 主甲板兩端空出來的 `gap` 公尺 */
export function annexProps(d) {
  if (!ANNEX) return; const b = d.b; const [s0, s1] = ANNEX.stern, [b0, b1] = ANNEX.bow; const sm = (s0 + s1) / 2, bm = (b0 + b1) / 2; const br = TIER.branch;
  if (br === 'war') { gun(d, bm, 0, 0, 1.3); if (TIER.tier >= 2) { gun(d, sm, 0, PI, 1.2); } if (TIER.tier >= 3) { for (const s of [-1, 1]) { gun(d, bm - 1, s * 5.4, 0, 0.8); gun(d, sm + 1, s * 5.4, PI, 0.8); } } else for (const s of [-1, 1]) { b.box('crate', b0 + 0.8, s * 6.6, 1.2, 0.6, 0.5); } b.box('steelDark', bm, 0, Math.max(1, b1 - b0 - 1), 0.1, 0.03, 0.02); }
  else if (br === 'mer') { const n = TIER.tier; for (let k = 0; k < n; k++) { for (const s of [-1, 1]) { crateStack(b, sm - 0.4 + (k % 2) * 0.2, s * (3.6 + k * 1.7), ['cargoRed', 'cargoBlue', 'cargoGreen'][k], 1 + (k % 2), 0); crateStack(b, bm + 0.4, s * (3.6 + k * 1.7), ['cargoBlue', 'cargoGreen', 'cargoRed'][k], 1 + ((k + 1) % 2), 0); } }
    if (n >= 3) { for (const sg of [-1, 1]) { const x = (sg < 0 ? sm : bm); b.cyl('steelDark', x, 0, 0.45, 5.4, 0, 10); b.box('orange', x + sg * 1.6, 0, 3.6, 0.35, 0.35, 5.2); b.blockC(x, 0, 0.9, 0.9); } } }
  else { dome(d.b, bm, 0, 1.5 + 0.1 * TIER.tier); if (TIER.tier >= 2) { b.cyl('white', sm, 0, 0.2, 4.2, 0, 8); radar(d, sm, 0, 4.4, 1.2); b.blockC(sm, 0, 0.7, 0.7); } if (TIER.tier >= 3) { for (const s of [-1, 1]) { b.cyl('steel', sm + 0.6, s * 4.8, 0.7, 1.3, 0, 12); b.sph('lightblue', sm + 0.6, 1.4, s * 4.8, 0.7, 1, 0.5, 1, 10); b.blockC(sm + 0.6, s * 4.8, 1.4, 1.4); } } }
}
