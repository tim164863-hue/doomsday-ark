import { SHIP, ex, HULL_XS, HULL_XB, TIER, NDECK, TOP } from './config.js';
import * as THREE from 'three';
import { applyDetail, KIND } from './detail.js';
import { Builder, makeMaterials, xform } from './builder.js';
import { patchShip } from './wasteland.js';
import { NavGrid, CS, GX0, GZ0, GW, GH } from './nav.js';
import { outline, pointInPoly, distToEdges, buildHullParts, outlineHull, halfWidth } from './hull.js';
import { layouts } from './layouts.js';
import { waveHeight } from '../world/waves.js';

export const DH = SHIP.deckH;            // 層高
export const BASE_Y = SHIP.baseY;        // 1F 地板高度（船殼內，水線之上）
const BRANCH_LOOK = { war: { trim: 0x2b3640, funnel: 0x59626b }, mer: { trim: 0x5a2c14, funnel: 0xb84a1c }, sci: { trim: 0x0b3a56, funnel: 0x1f8ea6 } };
export const UPPER = {   // 6F–8F：依分支命名（階段③）
  war: [['6F', '作戰指揮中心'], ['7F', '砲術與艦橋層'], ['8F', '防空雷達台']],
  mer: [['6F', '貿易交易大廳'], ['7F', '貨運調度中心'], ['8F', '貴賓瞭望台']],
  sci: [['6F', '實驗研究室'], ['7F', '天文觀測站'], ['8F', '氣象雷達台']],
};
export const NAMES = ['1F', '2F', '3F', '4F', '5F', ...(UPPER[TIER.branch] || []).slice(0, NDECK - 5).map((u) => u[0])];
export const TITLES = ['船艙 · 員工生活層', '船艙 · 運動健康層', '主甲板 · 會議工作層', '娛樂休閒層', '董事長辦公層（直升機坪）', ...(UPPER[TIER.branch] || []).slice(0, NDECK - 5).map((u) => u[1])];
export const HULL = { xs: HULL_XS, xb: HULL_XB, hz: SHIP.hz, bl: SHIP.bowLen };
export const KEEL_Y = SHIP.keelY;
export const HULL_DECKS = SHIP.hullDecks;      // 1F、2F 在船殼內；3F 為主甲板（船殼頂）
// 各層外形由 SHIP 設定導出（1F / 2F 實際外形由船殼斷面推導，見 outlineHull）
export const PARAMS = SHIP.decks.slice(0, NDECK).map((d, i) => ({ xs: ex(d.xs), xb: ex(d.xb), hz: d.hz, bl: d.bl ?? SHIP.bowLen - 0.1 }));
export const ELEV = { x0: 10.7, x1: 13.3, z0: -6.8, z1: -4.2, cx: 12, cz: -5.5, portalZ: -3.6 };
export const STAIR = { x0: 16, x1: 23.2, holeX0: 18.4, w: 2.4, laneOff: 3, arrive: 25.0, bottom: 14.4, upTrig: 15.4, downTrig: 24.0 };
export const pairLane = (k) => (k % 2 === 0 ? 1 : -1);
export const laneCenterZ = (k) => pairLane(k) * (STAIR.laneOff + STAIR.w / 2);

export class Deck {
  constructor(index, ship) {
    this.index = index; this.ship = ship; this.name = NAMES[index]; this.title = TITLES[index];
    this.M = ship.M; this.env = ship.env;
    this.p = PARAMS[index];
    this.hullDeck = index < HULL_DECKS;
    if (this.hullDeck) { this.shape = ship.hullShape; this.hullY = BASE_Y + index * DH - 0.05; this.poly = outlineHull(this.shape, this.hullY, 0.3); }
    else this.poly = outline(this.p);
    this.group = new THREE.Group(); this.b = new Builder(this.M); this.nav = new NavGrid();
    this.tvs = []; this.screens = []; this.waters = []; this.rotors = []; this.doors = []; this.steams = []; this.dyn = [];
    this.holes = []; this.pois = { desks: [], cabins: {}, misc: {} };
    this.tvTex = ship.tvTex;
  }
  hw(x) { return this.hullDeck ? Math.max(this.shape.half(x, this.hullY) - 0.3, 0) : halfWidth(x, this.p); }
  floorY() { return BASE_Y + this.index * DH; }

  buildFloor() {
    const shape = new THREE.Shape(this.poly.map(([x, z]) => new THREE.Vector2(x, -z)));
    for (const h of this.holes) { const [x0, z0, x1, z1] = h; const path = new THREE.Path([new THREE.Vector2(x0, -z0), new THREE.Vector2(x1, -z0), new THREE.Vector2(x1, -z1), new THREE.Vector2(x0, -z1)]); shape.holes.push(path); }
    const t = 0.5;
    const g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, -t, 0);
    // 地板上面：木甲板色 / 下面：白
    const mesh = new THREE.Mesh(g, [this.hullDeck ? this.M.tileDark : this.M.teak, this.M.white]);
    // ExtrudeGeometry groups: 0 = caps (top/bottom), 1 = sides
    mesh.receiveShadow = true; mesh.castShadow = true; this.group.add(mesh);
    // 木紋條：頂面加一層淺色板條
    const sh2 = new THREE.Mesh(g.clone(), this.M.white); sh2.visible = false;
  }
  buildRails() {
    if (this.hullDeck) { this.buildHullStub(); return; }
    const b = this.b; const poly = this.poly; const n = poly.length;
    for (let i = 0; i < n; i++) {
      const [x1, z1] = poly[i], [x2, z2] = poly[(i + 1) % n];
      const dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz); if (len < 0.05) continue;
      const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2, ry = Math.atan2(-dz, dx);
      // 向內縮 0.12
      b.boxc('glass', mx, 0.55, mz, len, 0.95, 0.03, ry);
      b.boxc('white', mx, -0.17, mz, len + 0.04, 0.3, 0.13, ry); b.boxc('hullBlue', mx, -0.4, mz, len + 0.04, 0.12, 0.14, ry); b.boxc('yellow', mx, 0.0, mz, len + 0.04, 0.03, 0.135, ry);
      b.boxc('rail', mx, 1.04, mz, len, 0.05, 0.07, ry);
      b.boxc('rail', mx, 0.08, mz, len, 0.12, 0.07, ry);
      const posts = Math.max(1, Math.round(len / 2.2));
      for (let k = 0; k <= posts; k++) { const t = k / posts; b.cyl('rail', x1 + dx * t, z1 + dz * t, 0.035, 1.05, 0, 6); }
    }
  }
  /** 船殼層：舷側剖面（外殼隱藏時露出的矮艙壁，頂部深藍收邊 + 燈帶） */
  buildHullStub() {
    const b = this.b; const poly = this.poly; const n = poly.length;
    for (let i = 0; i < n; i++) {
      const [x1, z1] = poly[i], [x2, z2] = poly[(i + 1) % n];
      const dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz); if (len < 0.05) continue;
      const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2, ry = Math.atan2(-dz, dx);
      b.boxc('white', mx, 0.55, mz, len + 0.04, 1.1, 0.3, ry); b.boxc('hullBlue', mx, 1.14, mz, len + 0.04, 0.08, 0.34, ry);
      b.boxc('lamp', mx, 0.9, mz, len * 0.9, 0.05, 0.02 + 0.3, ry);
    }
  }
  buildBulwarkTop() {
    // 1F：船殼壁，頂部加扶手
    const b = this.b; const poly = this.poly; const n = poly.length;
    for (let i = 0; i < n; i++) {
      const [x1, z1] = poly[i], [x2, z2] = poly[(i + 1) % n];
      const dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz); if (len < 0.05) continue;
      const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2, ry = Math.atan2(-dz, dx);
      b.boxc('rail', mx, 1.0, mz, len, 0.07, 0.14, ry);
      const posts = Math.max(1, Math.round(len / 3));
      for (let k = 0; k <= posts; k++) { const t = k / posts; b.cyl('rail', x1 + dx * t, z1 + dz * t, 0.04, 1.0, 0, 6); }
    }
  }
  /** 欄杆/玻璃：沿矩形（用於樓梯孔） */
  holeRail(x0, z0, x1, z1, sides = 'nesw') {
    const b = this.b; const e = [];
    const seg = (ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az, len = Math.hypot(dx, dz); const mx = (ax + bx) / 2, mz = (az + bz) / 2, ry = Math.atan2(-dz, dx);
      b.boxc('rail', mx, 1.0, mz, len, 0.05, 0.06, ry); b.boxc('rail', mx, 0.5, mz, len, 0.04, 0.04, ry); b.boxc('glass', mx, 0.55, mz, len, 0.9, 0.02, ry);
      const posts = Math.max(1, Math.round(len / 1.4)); for (let k = 0; k <= posts; k++) { const t = k / posts; b.cyl('rail', ax + dx * t, az + dz * t, 0.03, 1.0, 0, 6); } };
    if (sides.includes('n')) seg(x0, z0, x1, z0); if (sides.includes('s')) seg(x0, z1, x1, z1);
    if (sides.includes('w')) seg(x0, z0, x0, z1); if (sides.includes('e')) seg(x1, z0, x1, z1);
  }

  finalize() {
    this.buildFloor();
    this.buildRails();
    // 支柱（連到上一層）
    if (this.index >= HULL_DECKS && this.index < TOP) {
      const up = PARAMS[this.index + 1];
      for (let x = up.xs + 2; x < up.xb; x += 8) for (const s of [-1, 1]) { const z = s * (up.hz - 0.15); this.b.cyl('white', x, z, 0.16, DH - 0.5, 0, 8); }
    }
    // 網格
    const nav = this.nav; const poly = this.poly;
    for (let iz = 0; iz < GH; iz++) for (let ix = 0; ix < GW; ix++) {
      const x = nav.cx(ix), z = nav.cz(iz);
      nav.cells[iz * GW + ix] = pointInPoly(x, z, poly) && distToEdges(x, z, poly) > 0.5 ? 1 : 0;
    }
    const blockRect = (x0, z0, x1, z1) => {
      const ix0 = Math.floor((x0 - GX0) / CS), ix1 = Math.floor((x1 - GX0) / CS), iz0 = Math.floor((z0 - GZ0) / CS), iz1 = Math.floor((z1 - GZ0) / CS);
      for (let iz = Math.max(0, iz0); iz <= Math.min(GH - 1, iz1); iz++) for (let ix = Math.max(0, ix0); ix <= Math.min(GW - 1, ix1); ix++) nav.cells[iz * GW + ix] = 0;
    };
    for (const h of this.holes) blockRect(h[0] - 0.15, h[1] - 0.15, h[2] + 0.15, h[3] + 0.15);
    for (const bl of this.b.blocks) blockRect(...bl);
    this.blockRect = blockRect; this.blockCount = this.b.blocks.length;
    const built = this.b.build(this.ship.quality.shadows > 0);
    this.group.add(built);
    this.nav.base.set(nav.cells);
    this.group.traverse((o) => { if (o.isMesh && o.parent === this.group && !o.castShadow) o.castShadow = false; });
  }
  /** 通行（可暫時封鎖一個矩形，例如門關著）*/
  setBlock(rect, on) {
    const [x0, z0, x1, z1] = rect; const nav = this.nav;
    const ix0 = Math.floor((x0 - GX0) / CS), ix1 = Math.floor((x1 - GX0) / CS), iz0 = Math.floor((z0 - GZ0) / CS), iz1 = Math.floor((z1 - GZ0) / CS);
    for (let iz = iz0; iz <= iz1; iz++) for (let ix = ix0; ix <= ix1; ix++) if (nav.inb(ix, iz)) nav.cells[iz * GW + ix] = on ? 0 : nav.base[iz * GW + ix];
  }
}

export class Ship {
  constructor(env, quality, tvTex) {
    this.env = env; this.quality = quality; this.tvTex = tvTex; this.M = makeMaterials(env, quality);
    { const br = BRANCH_LOOK[TIER.branch]; if (br) { this.M.hullBlue.color.setHex(br.trim); this.M.funnel.color.setHex(br.funnel); } }
    this.root = new THREE.Group();      // 搖晃用
    this.decks = [];
    this.explode = 0; this.explodeTarget = 0;
    const F = [0, 1, 2].map((i) => BASE_Y + i * DH);
    const hp = buildHullParts(HULL, F, KEEL_Y, this.M, this.env); this.hullShape = hp.shape; this.hullBase = hp.base; this.hullBands = hp.bands;
    this.root.add(hp.base); hp.bands.forEach((g) => this.root.add(g));
    patchShip(this.root, { type: 'flagship', lv: 3, meshes: [hp.base, hp.bands[0].children[0], hp.bands[1].children[0]], yRange: [F[0] + 0.9, F[1] + DH * 0.55], n: 34, sc: 1.7 });   // 廢土：船殼補丁鋼板
    this.hullLights = []; this.hullMats = [hp.base.material, hp.bands[0].children[0].material, hp.bands[1].children[0].material];
    if (quality.name !== 'low') this.hullMats.forEach((m) => applyDetail(m, KIND.hull));
    for (let i = 0; i < NDECK; i++) {
      const d = new Deck(i, this); this.decks.push(d);
      // 孔洞：電梯（>=2F）與樓梯（上來的那一側）
      if (i >= 1) d.holes.push([ELEV.x0 + 0.1, ELEV.z0 + 0.1, ELEV.x1 - 0.1, ELEV.z1 - 0.1]);
      if (i >= 1) { const z = laneCenterZ(i - 1); d.holes.push([STAIR.holeX0, z - STAIR.w / 2, STAIR.x1, z + STAIR.w / 2]); }
      this.addElevatorShaft(d);
      if (i < TOP) this.addStairFlight(d);
      if (i >= 1) { const z = laneCenterZ(i - 1); d.holeRail(STAIR.holeX0, z - STAIR.w / 2, STAIR.x1, z + STAIR.w / 2, 'nsw'); }
      layouts[i](d, this);
      d.finalize();
      this.root.add(d.group);
      if (d.hullDeck && this.quality.shadows >= 0) this.addHullLights(d);
    }
    // 電梯車廂
    this.car = new THREE.Group();
    const cm = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.1, 2.3), this.M.steelDark); cm.position.y = 0.0; this.car.add(cm);
    const cw = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.5, 2.3), this.M.glassTint); cw.position.y = 1.3; this.car.add(cw);
    const cl = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 2.0), this.M.lamp); cl.position.y = 2.5; this.car.add(cl);
    this.car.position.set(ELEV.cx, 0, ELEV.cz); this.root.add(this.car); this.carPos = 0; this.carTarget = 0;
    this.shadowMeshes = [];
    this.rockState = { roll: 0, pitch: 0, heave: 0 };
    this.applyExplode(0);
  }
  /** 浮點層 i 的地板高度（含展開） */
  deckY(i) { return BASE_Y + i * (DH + this.explode); }
  addHullLights(d) {
    const y = d.floorY() + 2.6;
    for (const x of [-30, -6, 20, 40]) { const l = new THREE.PointLight(0xffd9a0, 0, 34, 1.4); l.position.set(x, y, 0); this.root.add(l); this.hullLights.push({ l, deck: d.index }); }
  }
  addElevatorShaft(d) {
    const b = d.b; const { x0, x1, z0, z1 } = ELEV; const h = DH - 0.5;
    b.box('steelDark', ELEV.cx, ELEV.z0, x1 - x0, 0.1, h); b.box('steelDark', x0, ELEV.cz, 0.1, z1 - z0, h); b.box('steelDark', x1, ELEV.cz, 0.1, z1 - z0, h);
    b.boxc('glassTint', ELEV.cx, h * 0.55, z0 + 0.05, x1 - x0, h * 0.9, 0.03);
    // 前面：門框 + 左右玻璃，中間為開口
    b.box('steelDark', x0 + 0.1, z1, 0.14, 0.14, h); b.box('steelDark', x1 - 0.1, z1, 0.14, 0.14, h); b.box('steelDark', ELEV.cx, z1, x1 - x0, 0.14, 0.25, 2.3);
    b.box('lamp', ELEV.cx, z1 + 0.08, 0.5, 0.05, 0.12, 2.15); // 樓層指示
    b.block(x0, z0 - 0.1, x1, z1 + 0.05);
    if (d.index === TOP) b.box('steelDark', ELEV.cx, ELEV.cz, x1 - x0 + 0.3, z1 - z0 + 0.3, 0.2, h);
  }
  addStairFlight(d) {
    const k = d.index; const sgn = pairLane(k); const zc = laneCenterZ(k); const b = d.b;
    const steps = 20, run = (STAIR.x1 - STAIR.x0) / steps, rise = DH / steps;
    for (let i = 0; i < steps; i++) b.box('woodLight', STAIR.x0 + run * (i + 0.5), zc, run, STAIR.w, rise * (i + 1));
    const ang = Math.atan2(DH, STAIR.x1 - STAIR.x0), len = Math.hypot(DH, STAIR.x1 - STAIR.x0), mx = (STAIR.x0 + STAIR.x1) / 2;
    for (const s of [-1, 1]) {
      const z = zc + s * (STAIR.w / 2 + 0.03);
      b.boxc('white', mx, DH / 2 - 0.1, z, len, 0.3, 0.06, 0, 0, ang);
      b.boxc('rail', mx, DH / 2 + 0.95, z, len, 0.05, 0.06, 0, 0, ang);
      for (let i = 0; i <= 6; i++) { const t = i / 6; const x = STAIR.x0 + (STAIR.x1 - STAIR.x0) * t; b.box('rail', x, z, 0.05, 0.05, 0.95, DH * t); }
    }
    b.block(STAIR.x0 - 0.1, zc - STAIR.w / 2 - 0.15, STAIR.x1, zc + STAIR.w / 2 + 0.15);
    d.pois.misc['stairUp'] = { x: STAIR.bottom, z: zc, topX: STAIR.arrive, k };
  }
  applyExplode(e) { this.explode = e; this.applyBands && this.hullBands && this.applyBands(); for (const d of this.decks) d.group.position.y = this.deckY(d.index); }
  setExplode(target) { this.explodeTarget = target; }
  /** 取得某層上的世界(船本地)位置 y */
  yAt(deckIndexF) { return this.deckY(0) + deckIndexF * (DH + this.explode); }

  update(dt, time) {
    if (Math.abs(this.explode - this.explodeTarget) > 0.01) { this.applyExplode(this.explode + (this.explodeTarget - this.explode) * (1 - Math.exp(-4 * dt))); }
    // 電梯車廂
    { const df = this.carTarget - this.carPos; const sp = Math.min(1.4, 0.35 + Math.abs(df) * 0.9); const st = Math.sign(df) * Math.min(Math.abs(df), sp * dt); this.carPos += st; if (Math.abs(this.carTarget - this.carPos) < 0.004) this.carPos = this.carTarget; }
    this.car.position.y = this.yAt(this.carPos) + 0.0;
    { const nf = this.env.windowMat.emissiveIntensity / 1.6; for (const m of this.hullMats) m.emissiveIntensity = 1 - nf * 0.85; for (const h of this.hullLights) h.l.intensity = this.decks[h.deck].group.visible ? nf * 45 : 0; }
    // 搖晃（取四點波高估計橫搖縱搖）
    const LK = TIER.lenK, SX = 34 * LK; const hs = [waveHeight(-SX, 0, time), waveHeight(SX, 0, time), waveHeight(0, -10, time), waveHeight(0, 10, time)];
    const pitch = Math.atan2(hs[1] - hs[0], SX * 2) * 0.55, roll = Math.atan2(hs[2] - hs[3], 20) * 0.45;
    const heave = (hs[0] + hs[1] + hs[2] + hs[3]) / 4 * 0.5;
    const r = this.rockState; r.roll += (roll - r.roll) * (1 - Math.exp(-2 * dt)); r.pitch += (pitch - r.pitch) * (1 - Math.exp(-2 * dt)); r.heave += (heave - r.heave) * (1 - Math.exp(-2 * dt));
    this.root.rotation.order = 'YXZ'; this.root.rotation.set(r.roll + (this.lean || 0), this.yawOff || 0, r.pitch);  // 駕駛母船時 yawOff / lean 由 play/helm.js 給
    this.root.position.y = r.heave + 0.1;
    for (const d of this.decks) {
      for (const ro of d.rotors) ro.obj.rotation[ro.axis] += ro.speed * dt;
      for (const w of d.waters) w.material.opacity = 0.78 + Math.sin(time * 1.3) * 0.03;
      for (const f of d.dyn) f(dt, time);
    }
  }
  setVisibleDecks(vis, bandVis) { this.decks.forEach((d, i) => { d.group.visible = vis[i]; }); this.bandVis = bandVis || [true, true]; this.applyBands(); }
  applyBands() { const ex = this.explode > 0.05; (this.hullBands || []).forEach((g, k) => { g.visible = !ex && (!this.bandVis || this.bandVis[k]); }); }
}
