// 設施的 3D 模型與擺放位置（純視覺；數值全在 sim/）
import * as THREE from 'three';
import { CS, GX0, GZ0, GW, GH } from '../ship/nav.js';

const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7, metalness: 0.1, ...o });
const MAT = {
  steel: M(0x8c96a0, { metalness: 0.5, roughness: 0.45 }), dark: M(0x3a4048, { metalness: 0.4 }), wood: M(0x9a7248), white: M(0xf0f2f2, { roughness: 0.55 }),
  blue: M(0x3a86c8, { metalness: 0.3, roughness: 0.4 }), green: M(0x4fa548), leaf: M(0x6fc060), soil: M(0x5a4030), orange: M(0xe8892e), red: M(0xd04040),
  glass: M(0xbfe8ff, { transparent: true, opacity: 0.28, roughness: 0.1, depthWrite: false }),
  water: M(0x5ab4ff, { emissive: 0x2a7ac8, emissiveIntensity: 0.6, transparent: true, opacity: 0.85 }),
  glowG: new THREE.MeshBasicMaterial({ color: 0x66ff99 }), glowO: new THREE.MeshBasicMaterial({ color: 0xffa040 }), glowP: new THREE.MeshBasicMaterial({ color: 0xff7ae8 }), glowB: new THREE.MeshBasicMaterial({ color: 0x7ad0ff }),
  bpFill: new THREE.MeshBasicMaterial({ color: 0x58c4ff, transparent: true, opacity: 0.14, depthWrite: false }),
  bpLine: new THREE.LineBasicMaterial({ color: 0x8fdcff, transparent: true, opacity: 0.9 }),
  smoke: new THREE.MeshBasicMaterial({ color: 0xcfd3d6, transparent: true, opacity: 0.4, depthWrite: false }),
  warn: new THREE.MeshBasicMaterial({ color: 0xff4a3a }),
};
const box = (m, w, h, d, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y + h / 2, z); o.castShadow = true; return o; };
const cyl = (m, r, h, x, y, z, seg = 14, r2 = r) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r2, r, h, seg), m); o.position.set(x, y + h / 2, z); o.castShadow = true; return o; };
const add = (g, ...a) => { for (const o of a) g.add(o); return g; };

export let SC = 1.7; // 模型放大倍率（甲板很大，太小看不到）；小船家園會縮小（setFacScale）
const RAW = { purifier: [1.3, 0.8], greenhouse: [1.4, 1.0], generator: [1.3, 0.8], infirmary: [1.3, 1.0], workshop: [1.4, 0.8] };
export const FOOT = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [k, [v[0] * SC, v[1] * SC]]));
export function setFacScale(sc) { SC = sc; for (const k in RAW) { FOOT[k][0] = RAW[k][0] * sc; FOOT[k][1] = RAW[k][1] * sc; } }

function plinth(g, hw, hd, m = MAT.dark) { g.add(box(m, hw * 2, 0.12, hd * 2, 0, 0, 0)); }

const MODELS = {
  purifier(L) { // 三級各加一座濾水塔
    const g = [new THREE.Group(), new THREE.Group(), new THREE.Group()];
    plinth(g[0], 1.3, 0.8, MAT.steel);
    add(g[0], cyl(MAT.blue, 0.42, 1.5, -0.6, 0.12, 0), cyl(MAT.steel, 0.46, 0.14, -0.6, 1.62, 0), box(MAT.dark, 0.5, 0.7, 0.4, 0.55, 0.12, 0.2), box(MAT.glowB, 0.3, 0.12, 0.02, 0.55, 0.62, 0.41));
    add(g[0], cyl(MAT.steel, 0.07, 1.0, 0.0, 0.12, -0.45, 8));
    add(g[1], cyl(MAT.blue, 0.38, 1.25, 0.2, 0.12, -0.3), cyl(MAT.steel, 0.42, 0.12, 0.2, 1.37, -0.3));
    add(g[2], cyl(MAT.blue, 0.32, 1.7, 1.0, 0.12, -0.25), cyl(MAT.steel, 0.36, 0.12, 1.0, 1.82, -0.25));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 8, 20).rotateX(Math.PI / 2), MAT.glowB); ring.position.set(1.0, 1.0, -0.25); g[2].add(ring);
    return g;
  },
  greenhouse(L) {
    const g = [new THREE.Group(), new THREE.Group(), new THREE.Group()];
    add(g[0], box(MAT.wood, 2.8, 0.22, 2.0, 0, 0, 0), box(MAT.soil, 2.4, 0.1, 0.6, 0, 0.22, -0.55), box(MAT.soil, 2.4, 0.1, 0.6, 0, 0.22, 0.5));
    for (let i = 0; i < 4; i++) add(g[0], cyl(MAT.leaf, 0.14, 0.35, -0.9 + i * 0.6, 0.3, -0.55, 8, 0.02), cyl(MAT.green, 0.14, 0.3, -0.9 + i * 0.6, 0.3, 0.5, 8, 0.02));
    // 玻璃框
    for (const sx of [-1.3, 1.3]) for (const sz of [-0.9, 0.9]) g[0].add(box(MAT.white, 0.07, 1.5, 0.07, sx, 0.22, sz));
    add(g[0], box(MAT.glass, 2.6, 1.4, 1.8, 0, 0.25, 0));
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.6, 3, 1, false), MAT.glass); roof.rotation.z = Math.PI / 2; roof.rotation.x = 0; roof.position.set(0, 1.72, 0); roof.scale.set(0.5, 1, 0.9); g[0].add(roof);
    for (let i = 0; i < 4; i++) add(g[1], cyl(MAT.leaf, 0.2, 0.55, -0.9 + i * 0.6, 0.3, 0, 8, 0.03));
    add(g[2], box(MAT.glowP, 2.2, 0.06, 0.1, 0, 1.45, -0.4), box(MAT.glowP, 2.2, 0.06, 0.1, 0, 1.45, 0.4));
    return g;
  },
  generator(L) {
    const g = [new THREE.Group(), new THREE.Group(), new THREE.Group()];
    plinth(g[0], 1.3, 0.8);
    add(g[0], box(MAT.orange, 1.5, 0.95, 0.9, -0.3, 0.12, 0), box(MAT.dark, 1.52, 0.12, 0.92, -0.3, 0.6, 0), cyl(MAT.steel, 0.1, 1.5, 0.3, 0.12, -0.35, 8), box(MAT.dark, 0.4, 0.8, 0.3, 0.95, 0.12, 0.3), box(MAT.glowG, 0.2, 0.1, 0.02, 0.95, 0.65, 0.46));
    add(g[1], box(MAT.steel, 0.7, 0.7, 0.7, 0.95, 0.12, -0.35), cyl(MAT.steel, 0.1, 1.2, 1.1, 0.8, -0.4, 8));
    add(g[2], cyl(MAT.blue, 0.3, 0.9, -1.0, 0.12, 0.3), box(MAT.glowG, 1.0, 0.05, 0.05, -0.3, 1.08, 0.46));
    return g;
  },
  infirmary(L) {
    const g = [new THREE.Group(), new THREE.Group(), new THREE.Group()];
    plinth(g[0], 1.3, 1.0, MAT.white);
    add(g[0], box(MAT.steel, 1.9, 0.35, 0.9, -0.2, 0.12, 0.1), box(MAT.white, 1.8, 0.14, 0.82, -0.2, 0.47, 0.1), box(MAT.white, 0.5, 0.12, 0.5, -0.9, 0.61, 0.1), box(MAT.white, 0.9, 1.5, 0.45, 0.85, 0.12, -0.55), box(MAT.red, 0.36, 0.1, 0.02, 0.85, 1.0, -0.31), box(MAT.red, 0.1, 0.36, 0.02, 0.85, 0.87, -0.31));
    add(g[1], cyl(MAT.steel, 0.03, 1.5, 0.7, 0.12, 0.6, 6), box(MAT.glass, 0.18, 0.28, 0.1, 0.7, 1.3, 0.6), box(MAT.white, 0.06, 0.06, 0.8, 0.6, 1.58, 0.6));
    add(g[2], box(MAT.dark, 0.5, 0.4, 0.2, 0.2, 1.1, -0.85), box(MAT.glowG, 0.4, 0.28, 0.02, 0.2, 1.16, -0.74), cyl(MAT.steel, 0.04, 0.9, 0.2, 0.12, -0.85, 6));
    return g;
  },
  workshop(L) {
    const g = [new THREE.Group(), new THREE.Group(), new THREE.Group()];
    add(g[0], box(MAT.wood, 2.2, 0.12, 0.8, 0, 0.85, 0.1), box(MAT.dark, 0.1, 0.85, 0.7, -1.0, 0, 0.1), box(MAT.dark, 0.1, 0.85, 0.7, 1.0, 0, 0.1), box(MAT.dark, 2.2, 0.12, 0.7, 0, 0.2, 0.1), box(MAT.steel, 0.3, 0.2, 0.2, -0.6, 0.97, 0.1), box(MAT.dark, 0.5, 0.25, 0.3, 0.55, 0.97, 0.1),
      box(MAT.steel, 2.4, 1.0, 0.08, 0, 1.0, -0.65));
    for (let i = 0; i < 5; i++) g[0].add(box(i % 2 ? MAT.orange : MAT.red, 0.16, 0.34, 0.06, -0.9 + i * 0.45, 1.3, -0.58));
    add(g[1], cyl(MAT.steel, 0.16, 1.4, 1.15, 0.12, -0.2, 10), box(MAT.dark, 0.5, 0.2, 0.4, 1.15, 1.25, -0.2), box(MAT.orange, 0.5, 0.5, 0.5, -1.15, 0.12, -0.2));
    add(g[2], box(MAT.glowO, 0.18, 0.06, 0.18, 0.55, 1.14, 0.1), box(MAT.steel, 0.6, 1.0, 0.5, -1.15, 0.62, 0.5));
    return g;
  },
};

/** 在 nav 上找一塊四周留空的位置（hw×hd 半尺寸 + 1m 邊界全是可走格） */
export function findSlot(nav, ax, az, hw, hd, avoid = [], margin = 1.0, maxD = 1e9) {
  let best = null, bd = maxD; const rx = hw + margin, rz = hd + margin;
  for (let iz = 0; iz < GH; iz++) for (let ix = 0; ix < GW; ix++) {
    const x = GX0 + (ix + 0.5) * CS, z = GZ0 + (iz + 0.5) * CS; const d = Math.hypot(x - ax, z - az); if (d >= bd) continue;
    if (avoid.some((a) => Math.abs(a.x - x) < a.hw + hw + 0.9 && Math.abs(a.z - z) < a.hd + hd + 0.9)) continue;
    let ok = true;
    for (let zz = -rz; zz <= rz && ok; zz += CS) for (let xx = -rx; xx <= rx; xx += CS) { if (!nav.free(nav.ix(x + xx), nav.iz(z + zz))) { ok = false; break; } }
    if (ok) { bd = d; best = [x, z]; }
  }
  return best;
}
export function blockRect(nav, x, z, hw, hd) {
  for (let zz = -hd; zz <= hd; zz += CS / 2) for (let xx = -hw; xx <= hw; xx += CS / 2) { const ix = nav.ix(x + xx), iz = nav.iz(z + zz); if (nav.inb(ix, iz)) { nav.cells[iz * GW + ix] = 0; nav.base[iz * GW + ix] = 0; } }
}

export class FacilityView {
  constructor(id, deckGroup, x, z, ry = 0, sc = SC) {
    this.id = id; this.x = x; this.z = z; this.ry = ry; this.sc = sc; this.hw = RAW[id][0] * sc; this.hd = RAW[id][1] * sc; const [rw, rd] = RAW[id];
    this.root = new THREE.Group(); this.root.position.set(x, 0, z); this.root.scale.setScalar(sc); this.root.rotation.y = ry; deckGroup.add(this.root);
    this.levels = MODELS[id](); this.levels.forEach((l) => this.root.add(l));
    // 藍圖（未建造）
    this.bp = new THREE.Group(); const bg = new THREE.BoxGeometry(rw * 2, 1.4, rd * 2);
    const bm = new THREE.Mesh(bg, MAT.bpFill); bm.position.y = 0.7; const bl = new THREE.LineSegments(new THREE.EdgesGeometry(bg), MAT.bpLine); bl.position.y = 0.7;
    const ring = new THREE.Mesh(new THREE.RingGeometry(Math.max(rw, rd) * 1.05, Math.max(rw, rd) * 1.18, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x8fdcff, transparent: true, opacity: 0.7, depthWrite: false })); ring.position.y = 0.05; this.ring = ring;
    this.bp.add(bm, bl, ring); this.root.add(this.bp);
    // 故障燈 + 煙
    this.warn = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), MAT.warn); this.warn.position.set(0, 2.2, 0); this.root.add(this.warn);
    this.puffs = []; for (let i = 0; i < 4; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), MAT.smoke.clone()); p.visible = false; this.root.add(p); this.puffs.push(p); }
    this.lv = 0; this.dmg = false; this.active = false; this.top = 2.6 * sc;
    this.setState(0, false, false);
  }
  setState(lv, dmg, active) {
    this.lv = lv; this.dmg = dmg; this.active = active;
    this.levels.forEach((g, i) => { g.visible = lv > i; });
    this.bp.visible = lv === 0; this.warn.visible = dmg && lv > 0;
    if (lv === 0) for (const p of this.puffs) p.visible = false;
  }
  worldPos(out = new THREE.Vector3()) { return this.root.getWorldPosition(out).setY(out.y + this.top); }
  update(t) {
    if (this.lv === 0) { this.ring.scale.setScalar(1 + Math.sin(t * 2.4) * 0.05); this.bp.children[1].material.opacity = 0.6 + Math.sin(t * 2.4) * 0.3; }
    if (this.dmg && this.lv) { this.warn.visible = Math.sin(t * 7) > 0; this.warn.position.y = 2.2 + Math.sin(t * 3) * 0.05; }
    if (this.lv && (this.id === 'generator' || this.dmg)) {
      const on = this.active || this.dmg; const px = this.id === 'generator' ? 0.3 : 0, pz = this.id === 'generator' ? -0.35 : 0;
      this.puffs.forEach((p, i) => { p.visible = on; if (!on) return; const k = ((t * 0.35 + i / 4) % 1); p.position.set(px + Math.sin(i * 2 + t) * 0.1, 1.7 + k * 1.3, pz); p.scale.setScalar(0.5 + k * 1.2); p.material.opacity = 0.4 * (1 - k); });
    } else for (const p of this.puffs) p.visible = false;
  }
}
