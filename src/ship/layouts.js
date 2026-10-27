import * as THREE from 'three';
import { xform } from './builder.js';
import * as FN from './furniture.js';
import { STAIR, ELEV, laneCenterZ, pairLane } from './ship.js';
import { enrich } from './extras.js';

const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
const PI = Math.PI;

export function plate(d, text, x, y, z, ry, w = 1.3, h = 0.34, tilt = 0) {
  const c = document.createElement('canvas'); c.width = 256; c.height = Math.round(256 * h / w);
  const g = c.getContext('2d'); g.fillStyle = '#1b2a3a'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = '#d8b25a'; g.lineWidth = 5; g.strokeRect(3, 3, c.width - 6, c.height - 6);
  g.fillStyle = '#ffe9b0'; g.font = `bold ${Math.round(c.height * 0.5)}px "Noto Sans TC","Microsoft JhengHei",sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, c.width / 2, c.height / 2 + 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }));
  m.position.set(x, y, z); m.rotation.set(tilt, ry, 0); m.rotation.order = 'YXZ'; d.group.add(m); return m;
}
export function signBoard(d, text, x, y, z, ry, w, h, bg = '#12202e', fg = '#ffcf6a') {
  const c = document.createElement('canvas'); c.width = 512; c.height = Math.round(512 * h / w);
  const g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = fg; g.lineWidth = 6; g.strokeRect(5, 5, c.width - 10, c.height - 10);
  g.fillStyle = fg; g.font = `bold ${Math.round(c.height * 0.56)}px "Noto Sans TC","Microsoft JhengHei",sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, c.width / 2, c.height / 2 + 3);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }));
  m.position.set(x, y, z); m.rotation.y = ry; d.group.add(m); return m;
}
export const floorRect = (d, mat, x0, z0, x1, z1, h = 0.02) => d.b.box(mat, (x0 + x1) / 2, (z0 + z1) / 2, x1 - x0, z1 - z0, h, 0);
export function wallG(d, x0, z0, x1, z1, doors = [], hs = 1.05, hg = 2.3) { d.b.wall(x0, z0, x1, z1, hs, 'white', 0.16, doors); d.b.wall(x0, z0, x1, z1, hg - hs, 'glass', 0.05, doors, hs); }
export const poi = (d, key, o) => { (d.pois.misc[key] ||= []).push(o); return o; };

function door(d, hx, hz, closedYaw, openYaw, w = 1.1, h = 2.1) {
  const pivot = new THREE.Group(); pivot.position.set(hx, 0, hz); pivot.rotation.y = openYaw; d.group.add(pivot);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, h, w), d.M.woodLight); mesh.position.set(0, h / 2, w / 2); mesh.castShadow = true; pivot.add(mesh);
  const hdl = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.12), d.M.steel); hdl.position.set(0, 1.0, w - 0.14); pivot.add(hdl);
  const obj = { pivot, closedYaw, openYaw, cur: openYaw, target: openYaw, speed: 3.5 };
  obj.set = (open) => { obj.target = open ? openYaw : closedYaw; };
  obj.closed = () => Math.abs(obj.cur - closedYaw) < 0.05; obj.opened = () => Math.abs(obj.cur - openYaw) < 0.05;
  d.dyn.push((dt) => { const df = obj.target - obj.cur; if (Math.abs(df) > 0.001) { obj.cur += Math.sign(df) * Math.min(Math.abs(df), obj.speed * dt); pivot.rotation.y = obj.cur; } });
  return obj;
}

// ------------------------------------------------------------ 1F 員工生活層
function deck1(d, ship) {
  const b = d.b;
  // 甲板地面：室內瓷磚 / 地毯
  floorRect(d, 'tileDark', -44.4, -9.5, -34, 9.5);        // 儲藏
  floorRect(d, 'tile', -34, -9.5, -14, 9.5);               // 餐廳
  floorRect(d, 'carpet', -14, -1.4, 10, 1.4);             // 走廊
  // 外牆（z=±9.5），玻璃窗
  wallG(d, -44.4, -9.5, 10, -9.5); wallG(d, -44.4, 9.5, 10, 9.5);
  b.wall(-44.4, -9.5, -44.4, 9.5, 1.3, 'white', 0.2);
  // 儲藏室
  b.wall(-34, -9.5, -34, 9.5, 1.2, 'white', 0.16, [[-1.1, 1.1]]);
  for (const [x, z, r, m] of [[-41, -6.6, 0, 'cargoBlue'], [-41, 6.6, 0, 'cargoRed'], [-37, 7.4, 0.0, 'cargoGreen']]) FN.cargoContainer(b, x, z, r, m, m === 'cargoGreen' ? 3.0 : 4.8);
  FN.shelf(b, -43.6, -2.2, PI / 2, 2.4); FN.shelf(b, -43.6, 2.2, PI / 2, 2.4);
  [[-38, -2.6], [-38.8, -1.8], [-38, -0.8], [-36.4, -7.6], [-36.4, -6.6]].forEach(([x, z], i) => FN.crate(b, x, z, 0.8 + (i % 2) * 0.2, 'crate', i * 0.3));
  [[-35.2, -4.5], [-35.2, -3.7], [-35.6, 3.5], [-36.4, 4.2]].forEach(([x, z], i) => FN.barrel(b, x, z, i % 2 ? 'cargoBlue' : 'rust'));
  signBoard(d, '儲藏室', -34.12, 1.95, 0.0, PI / 2 * 3 - PI, 1.6, 0.4);
  // 廚房 + 餐廳
  FN.counter(b, -33.6, -8.5, -33.6, -2.0, 0.95); FN.counter(b, -33.6, 2.0, -33.6, 8.5, 0.95);
  FN.fridge(b, -33.3, -1.2, PI / 2 * 3 - PI + PI); FN.stove(b, -33.3, 1.2, PI / 2);
  FN.counter(b, -30.6, -6.5, -30.6, 6.5, 1.05, 0.5, 'woodDark', 'woodLight'); b.blocks.pop(); b.block(-30.9, -6.5, -30.3, -1.2); b.block(-30.9, 1.2, -30.3, 6.5);
  for (let i = 0; i < 4; i++) b.sph('steel', -33.4, 1.2, -7.5 + i * 1.0, 0.0, 1, 1, 1, 4);
  d.steams.push({ x: -33.3, y: 1.1, z: 1.2, s: 0.6 });
  const seatsAll = [];
  for (const [tx, tz] of [[-25.5, -5.5], [-25.5, 5.5], [-19.5, -5.5], [-19.5, 5.5]]) {
    FN.table(b, tx, tz, 2.4, 1.0, 0, 'woodLight');
    for (const sx of [-0.65, 0.65]) for (const sz of [-1, 1]) { const cz = tz + sz * 0.95; FN.diningChair(b, tx + sx, cz, faceTo(tx + sx, cz, tx + sx, tz), 'wood'); seatsAll.push({ x: tx + sx, z: cz, face: faceTo(tx + sx, cz, tx + sx, tz) }); }
    b.cylc('white', tx - 0.4, 0.8, tz, 0.12, 0.05, 10); b.cylc('orange', tx + 0.5, 0.78, tz + 0.15, 0.16, 0.03, 12);
  }
  seatsAll.forEach((s) => poi(d, 'canteen', s));
  b.wall(-14, -9.5, -14, 9.5, 1.2, 'white', 0.16, [[-1.1, 1.1]]);
  signBoard(d, '餐廳 · 廚房', -14.12, 1.95, 0.0, -PI / 2, 2.0, 0.42);
  FN.plant(b, -15, -8.4, 1); FN.plant(b, -15, 8.4, 1); FN.floorLamp(b, -31.5, 8.6);
  // 寢室：每人一間
  const order = ['最高級打工仔', '交易員-1', '交易員-2', '0xcat', '策略研究員', '鏈上獵手'];
  const fx = [-14, -6, 2];
  b.wall(10, -9.5, 10, -1.4, 1.2, 'white', 0.16); b.wall(10, 1.4, 10, 9.5, 1.2, 'white', 0.16);
  let ci = 0;
  for (const s of [-1, 1]) for (let c = 0; c < 3; c++) {
    const title = order[ci++]; const cx0 = fx[c]; const W = (u) => cx0 + u; const Z = (v) => s * (1.5 + v);
    // 地板
    floorRect(d, (c + (s > 0 ? 1 : 0)) % 2 ? 'woodLight' : 'wood', cx0 + 0.05, Math.min(Z(0), Z(8)), cx0 + 7.95, Math.max(Z(0), Z(8)));
    // 隔間牆
    b.wall(cx0, Z(0), cx0, Z(8), 1.2, 'white', 0.16);
    // 走廊側牆（含門）
    b.wall(cx0, s * 1.5, cx0 + 8, s * 1.5, 1.2, 'white', 0.14, [[cx0 + 2.0, cx0 + 3.5]]);
    // 衛浴（u 5.2~8, v 0~3.2）
    const bx0 = W(5.2), bx1 = W(8.0);
    b.wall(bx0, s * 1.5, bx1, s * 1.5, 2.3, 'white', 0.18); b.wall(bx0, Z(3.2), bx1, Z(3.2), 2.3, 'white', 0.14);
    b.wall(bx0, Z(0), bx0, Z(3.2), 2.3, 'white', 0.14, [[Math.min(Z(0.9), Z(2.1)), Math.max(Z(0.9), Z(2.1))]]);
    floorRect(d, 'tile', bx0, Math.min(Z(0), Z(3.2)), bx1, Math.max(Z(0), Z(3.2)), 0.03);
    FN.shower(b, W(7.4), Z(0.75), 1.0, 1.0);
    FN.toilet(b, W(6.0), Z(0.5), s > 0 ? PI : 0); // 馬桶貼走廊牆
    FN.sink(b, W(7.55), Z(2.6), s > 0 ? PI / 2 * 3 - PI + PI : 0);
    // 浴室門：鉸鏈在 v=0.9，閉合時沿 v 方向；開啟時朝 -u
    const hinge = [W(5.2), Z(0.9)];
    const closedYaw = s > 0 ? 0 : PI; // 門板沿局部 +z；s>0 時 +z = +v；s<0 時需轉 π
    const openYaw = s > 0 ? -PI / 2 : PI / 2;
    const bd = door(d, hinge[0], hinge[1], closedYaw, openYaw, 1.2); bd.set(true); bd.cur = bd.target = openYaw; bd.pivot.rotation.y = openYaw;
    // 臥室家具
    const bedZ = Z(6.2); FN.bed(b, W(2.2), bedZ, s > 0 ? 0 : PI, ['fabricB', 'fabricP', 'fabricG', 'fabricY', 'fabricB', 'fabricP'][ci - 1]);
    FN.nightstand(b, W(3.4), Z(7.3), s > 0 ? PI : 0); FN.wardrobe(b, W(0.45), Z(2.6), s > 0 ? PI / 2 : -PI / 2);
    b.box('rug', W(3.8), Z(3.9), 2.2, 1.5, 0.02, 0.02);
        const dk = FN.workDesk(d, W(6.6), Z(6.5), s > 0 ? 0 : PI, { chair: 'fabricW' }); // 面向外牆的書桌
    // 上面的 workDesk 以座位為原點朝前：朝外牆，座位需離牆 0.95+
    plate(d, title, W(2.75), 1.45, s * 1.38, s > 0 ? PI : 0, 1.5, 0.3);
    FN.floorLamp(b, W(0.5), Z(7.4));
    // 窗
    d.cabinWin = true;
    const hx = W(2.2), hz = Z(6.2);
    const poiC = {
      title,
      bed: { x: W(2.2), z: Z(6.3), face: s > 0 ? PI : 0, headYaw: s > 0 ? 0 : PI, y: 0.6, headDir: [0, s] },
      door: { x: W(2.75), z: Z(1.0) }, corridor: { x: W(2.75), z: 0 },
      bathOut: { x: W(4.4), z: Z(1.5), face: s > 0 ? PI / 2 : PI / 2 },
      bathIn: { x: W(6.9), z: Z(1.9) }, bathDoor: bd, bathDoorPt: { x: W(5.2), z: Z(1.5) },
      steam: { x: W(6.6), y: 2.0, z: Z(1.6) },
      deskSeat: { x: dk.seat.x, z: dk.seat.z, face: dk.seat.face },
      side: s,
    };
    d.pois.cabins[title] = poiC;
    d.steams.push({ x: W(6.6), y: 2.3, z: Z(1.6), s: 1, cabin: title });
  }
  // 大廳 / 艦首「未來設施」區（淨水、農場、釣魚）預留
  floorRect(d, 'wood', 24, -9, 44, 9, 0.02);
  for (const z of [-7, -4.5, 4.5, 7]) { b.box('woodDark', 30, z, 5, 1.1, 0.5); b.box('soil' in d.M ? 'soil' : 'woodDark', 30, z, 4.8, 0.9, 0.05, 0.5); for (let i = 0; i < 6; i++) b.sph('leaf', 27.9 + i * 0.8, 0.8, z + ((i * 7) % 3 - 1) * 0.1, 0.22, 1, 1.1, 1); b.block(27.5, z - 0.55, 32.5, z + 0.55); }
  for (const [x, z] of [[38, -5], [38, 5], [41, 0]]) { b.cyl('steel', x, z, 1.1, 2.4, 0, 16); b.cyl('steelDark', x, z, 1.15, 0.15, 2.4, 16); b.cyl('lightblue', x, z, 0.5, 0.06, 2.55, 12); b.blockC(x, z, 2.4, 2.4); }
  signBoard(d, '（未來）淨水 · 農場區', 36, 2.7, 0, -PI / 2, 3.2, 0.5);
  FN.plant(b, 12, -8.5, 1.1); FN.plant(b, 12, 8.5, 1.1); FN.floorLamp(b, 20, 8.6); FN.floorLamp(b, 20, -8.6);
  // 兩個聊天點
  poi(d, 'chat', { x: 12, z: 0 }); poi(d, 'chat', { x: -22, z: 0 });
  poi(d, 'rail', { x: 18, z: 11.2, face: 0 }); poi(d, 'rail', { x: 18, z: -11.2, face: PI });
}

// ------------------------------------------------------------ 2F 運動健康層
function deck2(d, ship) {
  const b = d.b;
  // 跑道
  const R = 3.6, cx = 34.4, cz = 9.9;
  const rr = (hx, hz, r) => { const s = new THREE.Shape(); const pts = []; const seg = 8; const corner = (ox, oz, a0) => { for (let i = 0; i <= seg; i++) { const a = a0 + (i / seg) * PI / 2; pts.push([ox + Math.cos(a) * r, oz + Math.sin(a) * r]); } };
    corner(hx - r, hz - r, 0); corner(-hx + r, hz - r, PI / 2); corner(-hx + r, -hz + r, PI); corner(hx - r, -hz + r, PI * 1.5); return pts; };
  const outerPts = rr(36.0, 10.95, 4.0), innerPts = rr(33.8, 8.75, 2.2);
  const sh = new THREE.Shape(outerPts.map(([x, z]) => new THREE.Vector2(x, -z))); sh.holes.push(new THREE.Path(innerPts.map(([x, z]) => new THREE.Vector2(x, -z)).reverse()));
  const tg = new THREE.ShapeGeometry(sh); tg.rotateX(-PI / 2); b.add(d.M.rubber, xform(tg, 0, 0.025, 0));
  for (const rad of [0.55, 1.1, 1.65]) { const o = rr(36.0 - 2.2 * 0.0 - 0.0, 10.95, 4.0); }
  const lane = (k) => rr(36.0 - k * 0.55, 10.95 - k * 0.55, Math.max(4.0 - k * 0.55, 1.0));
  for (const k of [0.55 * 0.0 + 0.0 + 0.0, 1, 2, 3]) {
    const a = lane(k + 0.02), c = lane(k + 0.12); const sh2 = new THREE.Shape(a.map(([x, z]) => new THREE.Vector2(x, -z))); sh2.holes.push(new THREE.Path(c.map(([x, z]) => new THREE.Vector2(x, -z)).reverse()));
    const g2 = new THREE.ShapeGeometry(sh2); g2.rotateX(-PI / 2); b.add(d.M.courtLine, xform(g2, 0, 0.032, 0));
  }
  // 跑道路徑（中線，順時針）
  const mid = rr(34.9, 9.85, 3.1); d.pois.track = mid.map(([x, z]) => ({ x, z }));
  // 健身房
  floorRect(d, 'tileDark', -33.8, -8.8, -22, 8.8, 0.025);
  wallG(d, -22, -8.8, -22, 8.8, [[0.2, 1.8]]); wallG(d, -33.8, -8.8, -22, -8.8, []); wallG(d, -33.8, 8.8, -22, 8.8, []);
  for (const z of [-6.8, -4.6, -2.4, -0.2]) { FN.treadmill(b, -31.2, z, PI / 2); poi(d, 'treadmill', { x: -31.9, z, face: PI / 2 }); }
  for (const z of [3.2, 5.2]) { FN.treadmill(b, -31.2, z, PI / 2); poi(d, 'treadmill', { x: -31.9, z, face: PI / 2 }); }
  FN.weightBench(b, -26.5, 6.0, 0); FN.weightBench(b, -26.5, 2.8, 0); FN.dumbbellRack(b, -24.2, 8.2, PI); FN.dumbbellRack(b, -28.2, -8.2, 0);
  poi(d, 'bench', { x: -26.5, z: 6.0, face: 0 }); poi(d, 'bench', { x: -26.5, z: 2.8, face: 0 });
  FN.mirrorWall(b, -33.7, -4, -33.7, 4);
  signBoard(d, '健身房', -21.9, 2.15, -3.0, PI / 2, 1.8, 0.42);
  // 醫務室
  floorRect(d, 'tile', -21.2, -8.8, -14, -0.4, 0.025);
  wallG(d, -21.2, -8.8, -21.2, -0.4, [[-3.8, -2.2]]); wallG(d, -21.2, -0.4, -14, -0.4, [[-17.4, -15.6]]); wallG(d, -14, -8.8, -14, -0.4, [[-5.6, -4.0]]);
  FN.infirmaryBed(b, -19.6, -6.0, 0); FN.infirmaryBed(b, -16.2, -6.0, 0); FN.curtainRail(b, -17.9, -8.0, -17.9, -4.0, 1.5); FN.medCabinet(b, -14.6, -8.3, PI / 2 * 3 - PI);
  b.box('red', -14.05, -3.0, 0.04, 0.9, 0.3, 1.6); b.box('red', -14.05, -3.0, 0.04, 0.3, 0.9, 1.3);
  signBoard(d, '醫務室', -14.2, 2.2, -4.8, -PI / 2, 1.5, 0.4, '#3a0f0f', '#ffd0d0');
  poi(d, 'infirm', { x: -19.6, z: -6.0, face: 0 });
  // 匹克球場
  FN.pickleCourt(b, -6.0, 0.0);
  d.pois.pickle = { a: { x: -9.6, z: 0.9, face: PI / 2 }, b: { x: -2.4, z: -0.9, face: -PI / 2 }, net: { x: -6, z: 0 }, wallY: 0 };
  // 乒乓球桌
  for (const [x, z] of [[-9.5, 7.2], [-3.5, 7.2], [-6.5, -7.2]]) { FN.pingPongTable(b, x, z, 0); poi(d, 'pingpong', { a: { x: x - 1.95, z, face: PI / 2 }, b: { x: x + 1.95, z, face: -PI / 2 }, c: { x, z } }); }
  // 籃球場
  FN.basketCourt(b, 28.8, 0, 10, 9);
  d.pois.misc.hoop = [{ x: 27.0, z: 0.3, face: PI / 2, hoop: { x: 33.4, y: 3.05, z: 0 } }];
  // 長椅與飲水機
  FN.waterCooler(b, 9, 8.2); FN.coffeeTable(b, 7.2, 8.2, 0, 1.8, 0.5); poi(d, 'chat', { x: 7, z: 6.4 });
  poi(d, 'cooler', { x: 9, z: 7.4, face: PI });
  FN.plant(b, 2.5, 8.4, 1); FN.plant(b, 2.5, -8.4, 1); FN.floorLamp(b, 24, 8.4); FN.floorLamp(b, 24, -8.4);
  // 觀海點
  poi(d, 'rail', { x: 8, z: 12.2, face: 0 }); poi(d, 'rail', { x: -8, z: -12.2, face: PI });
}

// ------------------------------------------------------------ 3F 會議工作層
function deck3(d, ship) {
  const b = d.b;
  floorRect(d, 'carpet', -32.5, -9.2, 7, 9.2, 0.02);
  // 交易員（面對面）
  const t1 = FN.workDesk(d, -25, -1.6, 0, { chair: 'fabricB' }); const t2 = FN.workDesk(d, -25, 1.6, PI, { chair: 'fabricP' });
  d.pois.desks.push({ key: '交易員-1', ...t1.seat, screen: t1.screenMat }, { key: '交易員-2', ...t2.seat, screen: t2.screenMat });
  // 其他座位（面向 +z，靠北牆）
  const row = [['策略研究員', -18.5], ['最高級打工仔', -13.5], ['0xcat', -8.5], ['鏈上獵手', -3.5]];
  for (const [k, x] of row) { const w = FN.workDesk(d, x, -7.9, 0, { chair: k === '最高級打工仔' ? 'leather' : 'fabricG' }); d.pois.desks.push({ key: k, ...w.seat, screen: w.screenMat }); }
  d.pois.extraDesks = []; for (const x of [-18.5, -13.5, -8.5]) { const w = FN.workDesk(d, x, 7.9, PI, { chair: 'fabricW' }); d.screens.push(w.screenMat); w.screenMat.color.set(0x0a1018); d.pois.extraDesks.push({ key: 'x' + x, ...w.seat, screen: w.screenMat }); }
  FN.plant(b, -28.5, -8.6, 1.1); FN.plant(b, 5.8, -8.6, 1.2); FN.plant(b, 5.8, 8.6, 1.2); FN.plant(b, -31.5, 8.6, 1.1);
  FN.whiteboard(b, -33.55, 0, PI / 2, 3.0); poi(d, 'whiteboard', { x: -32.3, z: 0, face: -PI / 2 });
  FN.coffeeMachine(b, -31.3, -8.9, 0); poi(d, 'coffee', { x: -31.3, z: -7.9, face: PI }); FN.waterCooler(b, -29.6, -9.0, 0); poi(d, 'cooler', { x: -29.6, z: -8.0, face: PI });
  FN.sofa(b, 1.5, 7.3, PI, 2.4); FN.armchair(b, 4.4, 5.6, -PI / 2); FN.coffeeTable(b, 1.6, 5.6, 0, 1.3, 0.6); poi(d, 'chat', { x: 1.5, z: 4.4 });
  poi(d, 'chat', { x: -19, z: 0 }); poi(d, 'chat', { x: -4, z: 0.5 });
  b.box('rug', 2.4, 6.0, 4.2, 2.6, 0.015, 0.02);
  // 公司看板（牆上標語）
  signBoard(d, '競技場 · 交易員 vs 交易員', -33.7, 2.45, -5, PI / 2, 4.2, 0.55);
  // 會議室
  floorRect(d, 'carpet2', 26, -5.5, 37.5, 5.5, 0.02);
  wallG(d, 26, -5.5, 37.5, -5.5, []); wallG(d, 26, 5.5, 37.5, 5.5, []);
  b.wall(26, -5.5, 26, 5.5, 2.0, 'white', 0.2, [[2.2, 3.8]]);
  b.wall(37.6, -4.8, 37.6, 4.8, 1.2, 'white', 0.1); // 艦首側矮牆
  FN.table(b, 31.8, 0, 5.4, 1.8, 0, 'woodDark');
  for (const x of [29.6, 31.0, 32.6, 34.0]) for (const s of [-1, 1]) FN.diningChair(b, x, s * 1.6, s > 0 ? PI : 0, 'leather');
  FN.diningChair(b, 35.3, 0, -PI / 2, 'leather');
  poi(d, 'meeting', { x: 29.0, z: 0, face: PI / 2 });
  FN.tv(d, 26.2 - 0.0, 1.55, 0, PI / 2, 3.4, null, ship.tvTex);
  // TV 在牆內側：position 往 +x 一點
  d.tvs[d.tvs.length - 1].position.x = 26.15 + 0.1;
  signBoard(d, '會議室', 25.88, 2.45, -2.6, -PI / 2, 1.6, 0.42);
  FN.plant(b, 36.6, -4.6, 1); FN.plant(b, 36.6, 4.6, 1);
  poi(d, 'rail', { x: 14, z: 12.4, face: 0 }); poi(d, 'rail', { x: 14, z: -12.4, face: PI }); poi(d, 'rail', { x: -40, z: 0, face: -PI / 2 }); poi(d, 'rail', { x: 52, z: 0, face: PI / 2 });
}

// ------------------------------------------------------------ 4F 娛樂休閒層
function deck4(d, ship) {
  const b = d.b;
  FN.pool(d, -20, -4.5, -9, 4.5);
  floorRect(d, 'tile', -21.2, -5.7, -7.8, 5.7, 0.02); // 池畔
  FN.waterSlide(d, -24.9, 0); // 滑水道塔 (起點)
  // 修正：滑水道位置依 pool 調整：以 world 點覆寫
  // 躺椅 + 傘
  for (const x of [-21, -18, -15, -12]) { FN.loungeChair(b, x, -7.0, 0, 'fabricW'); poi(d, 'lounger', { x, z: -7.0, face: 0, head: [0, -1] }); }
  for (const x of [-19.5, -13.5]) FN.umbrella(b, x, -8.2, 1.7);
  FN.loungeChair(b, -6.5, 3.0, PI / 2, 'fabricB'); poi(d, 'lounger', { x: -6.5, z: 3.0, face: PI / 2, head: [-1, 0] });
  FN.loungeChair(b, -6.5, -1.0, PI / 2, 'fabricB'); poi(d, 'lounger', { x: -6.5, z: -1.0, face: PI / 2, head: [-1, 0] }); FN.umbrella(b, -5.6, 1.0, 1.8);
  for (const [x, z] of [[-23.4, 5.4], [-23.4, -5.4]]) FN.plant(b, x, z, 1.1);
  poi(d, 'pool', { x: -10.6, z: 5.8, face: PI }); poi(d, 'pool', { x: -17, z: -5.9, face: 0 }); poi(d, 'pool', { x: -9.0, z: 0.0, face: -PI / 2 });
  // 街機
  floorRect(d, 'carpet', -3.5, -8.7, 8, -2, 0.02);
  const cols = ['blue', 'red', 'green', 'purple', 'orange', 'blue', 'pink'];
  for (let i = 0; i < 7; i++) { const x = -2.6 + i * 1.5; FN.arcade(d, x, -8.2, 0, cols[i]); poi(d, 'arcade', { x, z: -7.0, face: PI }); }
  FN.arcade(d, 2.0, -3.5, PI, 'purple'); poi(d, 'arcade', { x: 2.0, z: -4.7, face: 0 });
  // 吧台
  floorRect(d, 'woodDark', -3.5, 2.5, 8, 8.7, 0.02);
  FN.counter(b, -2.5, 6.0, 7, 6.0, 1.05, 0.7, 'woodDark', 'woodLight');
  b.box('woodDark', 2.2, 8.5, 9, 0.35, 1.9); for (let i = 0; i < 9; i++) b.cyl(['green', 'orange', 'blue', 'red'][i % 4], -2 + i * 1.0, 8.3, 0.07, 0.3, 1.1 + (i % 3) * 0.35, 8);
  b.box('lamp', 2.2, 8.31, 8.8, 0.04, 0.05, 2.3);
  for (let i = 0; i < 6; i++) { const x = -1.8 + i * 1.7; FN.stool(b, x, 5.0, 0.7, 'red'); poi(d, 'stool', { x, z: 5.0, face: 0, bar: { x, z: 6.0 } }); }
  signBoard(d, 'BAR · 方舟酒吧', 2.2, 3.0, 8.56, PI, 3.4, 0.55, '#220a18', '#ff7fb0');
  poi(d, 'chat', { x: 4, z: 3.3 }); poi(d, 'chat', { x: -14, z: 0 });
  // 艦首甲板座
  for (const [x, z] of [[27, 3.5], [27, -3.5]]) { FN.loungeChair(b, x, z, PI / 2 * 3 - PI + PI / 2, 'fabricY'); FN.table(b, 28.6, z, 0.6, 0.6, 0, 'woodLight', 0.5); }
  FN.umbrella(b, 28.6, 0, 2.0); FN.roundTable?.(b, 28.6, 0, 0.7);
  poi(d, 'lounger', { x: 27, z: 3.5, face: PI * 1.5, head: [-1, 0] }); poi(d, 'lounger', { x: 27, z: -3.5, face: PI * 1.5, head: [-1, 0] });
  poi(d, 'rail', { x: 30, z: 4.2, face: PI / 2 }); poi(d, 'rail', { x: 30, z: -4.2, face: PI / 2 });
  FN.floorLamp(b, 8.5, 7.8); FN.floorLamp(b, 8.5, -7.8);
  FN.lifeRing(b, 0, 0.7, 8.85, 0); FN.lifeRing(b, 0, 0.7, -8.85, PI);
}

// ------------------------------------------------------------ 5F 董事長辦公層
function deck5(d, ship) {
  const b = d.b;
  // 直升機坪
  b.cyl('asphalt', -14.5, 0, 5.6, 0.1, 0, 36);
  b.add(d.M.yellow, xform(new THREE.RingGeometry(5.0, 5.2, 48).rotateX(-PI / 2), -14.5, 0.11, 0));
  b.box('courtLine', -14.5, -0.0, 0.4, 3.0, 0.02, 0.11); b.box('courtLine', -14.5, 0, 0.4, 3.0, 0.02, 0.11, PI / 2); b.box('courtLine', -14.5, 0, 2.2, 0.4, 0.02, 0.11);
  b.box('courtLine', -16.2, 0, 0.4, 3.0, 0.02, 0.11); b.box('courtLine', -12.8, 0, 0.4, 3.0, 0.02, 0.11);
  FN.helicopter(d, -14.5, 0);
  d.pois.misc.heli = [{ x: -9.2, z: 2.6 }];
  // 董事長辦公室
  floorRect(d, 'carpet2', -5.6, -6.6, 9, 6.6, 0.02);
  wallG(d, -5.6, -6.6, 9, -6.6, []); wallG(d, -5.6, 6.6, 9, 6.6, []);
  b.wall(-5.6, -6.6, -5.6, 6.6, 2.4, 'white', 0.2, [[4.6, 6.0]]);
  b.wall(9, -6.6, 9, 6.6, 1.1, 'white', 0.16, [[-1.4, 1.4]]); b.wall(9, -6.6, 9, 6.6, 1.2, 'glass', 0.05, [[-1.4, 1.4]], 1.1);
  FN.tv(d, -5.5, 1.75, 0, PI / 2, 3.6, null, ship.tvTex);
  d.tvs[d.tvs.length - 1].position.x = -5.5 + 0.1 + 0.06;
  // 大辦公桌（T董朝向電視）
  const dk = FN.workDesk(d, 3.6, 0, -PI / 2, { chair: 'leather' }); d.pois.desks.push({ key: 'T董', ...dk.seat, screen: dk.screenMat });
  b.box('woodDark', 2.55, 0, 0.9, 2.6, 0.1, 0.72);
  FN.sofa(b, 6.5, -4.8, -PI / 2, 2.4, 'sofa2'); FN.sofa(b, 6.5, 4.8, -PI / 2, 2.4, 'sofa2'); FN.coffeeTable(b, 4.9, 0, PI / 2, 1.4, 0.7);
  b.box('rug', 5.5, 0, 3.2, 8.4, 0.015, 0.02);
  FN.bookshelf(b, -2.0, -6.35, 0, 2.2, 2.1); FN.bookshelf(b, 1.2, -6.35, 0, 2.2, 2.1); FN.bookshelf(b, -2.0, 6.35, PI, 2.2, 2.1); FN.bookshelf(b, 1.2, 6.35, PI, 2.2, 2.1);
  FN.plant(b, -4.6, -5.6, 1.2); FN.plant(b, -4.6, 2.9, 1.2); FN.plant(b, 8.0, -5.8, 1.1); FN.floorLamp(b, 8.2, 5.8);
  b.sph('blue', 8.0, 1.1, 5.0, 0.0, 1, 1, 1, 4); // placeholder
  b.cyl('woodDark', 4.4, -5.6, 0.2, 0.9, 0, 10); b.sph('lightblue', 4.4, 1.3, -5.6, 0.34, 1, 1, 1, 14); b.block(4.1, -5.9, 4.7, -5.3);
  signBoard(d, 'T 董 辦 公 室', 9.12, 2.55, 0, PI / 2, 4.0, 0.5);
  poi(d, 'chat', { x: 7.6, z: 0 });
  // 露台：按摩池、躺椅、傘
  FN.hotTub(d, 15.8, 4.6, 2.0); poi(d, 'tub', { x: 15.8, z: 4.6 });
  floorRect(d, 'woodLight', 9.1, -7.2, 24, 7.2, 0.015);
  FN.loungeChair(b, 20.2, 2.2, -PI / 2, 'fabricW'); FN.loungeChair(b, 20.2, 5.0, -PI / 2, 'fabricW'); FN.umbrella(b, 21.6, 3.6, 1.7);
  poi(d, 'lounger', { x: 20.2, z: 2.2, face: -PI / 2, head: [1, 0] }); poi(d, 'lounger', { x: 20.2, z: 5.0, face: -PI / 2, head: [1, 0] });
  FN.roundTable(b, 15.8, -1.2, 0.5); FN.diningChair(b, 15.0, -1.2, PI / 2); FN.diningChair(b, 16.6, -1.2, -PI / 2);
  poi(d, 'rail', { x: 18, z: 6.9, face: 0 }); poi(d, 'rail', { x: 25.6, z: 0, face: PI / 2 });
  FN.plant(b, 10.0, 6.4, 1.1); FN.plant(b, 10.4, -3.3, 1.0);
  // 天線桅桿與旗
  b.cyl('steel', 0.5, 0.0, 0.05, 3.0, 2.4, 6); b.box('red', 1.0, 0.0, 1.0, 0.02, 0.6, 5.0);
  b.cyl('steelDark', -20.3, 5.2, 0.12, 5, 0, 8); b.box('red', -19.7, 5.2, 1.2, 0.02, 0.7, 4.2);
  FN.lifeRing(b, 0, 0.7, 7.35, 0); FN.lifeRing(b, 12, 0.7, -7.35, PI);
  // 煙囪裝飾（艦橋後方）
  b.blockC(-19.4, -4.6, 3.0, 3.0);
}

export const layouts = [deck1, deck2, deck3, deck4, deck5].map((fn, i) => (d, ship) => { fn(d, ship); enrich(i, d, ship); });
