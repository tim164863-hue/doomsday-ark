// 兩極景觀：冰山 / 浮冰（決定性場，sim/polar.js）、北極熊（北）、企鵝（南）。
// 只在冷度 ≥ 0.28 時才有東西；數量（冰山、動物、半徑）依畫質縮放；離開時縮小消失。冰山形狀共用 6 組幾何，動物各 1~2 個 Mesh。
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bergsAround, BERG } from '../sim/polar.js';
import { waveHeight } from './waves.js';
import { clamp, damp } from '../util.js';

export const POLAR_Q = { high: { R: 700, bergs: 30, floes: 14, bears: 5, peng: 4 }, mid: { R: 600, bergs: 22, floes: 10, bears: 4, peng: 3 }, low: { R: 480, bergs: 14, floes: 6, bears: 3, peng: 3 } };
const PI = Math.PI;
const hn = (x, y, z) => { const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return v - Math.floor(v); };
function paint(g, fn) { const p = g.attributes.position, c = new Float32Array(p.count * 3), col = new THREE.Color(); for (let i = 0; i < p.count; i++) { fn(col, p.getX(i), p.getY(i), p.getZ(i)); c.set([col.r, col.g, col.b], i * 3); } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; }
const solid = (g, hex) => paint(g, (c) => c.set(hex));

function bergGeo(variant) {
  const top = 0.42 + (variant % 3) * 0.08, g = new THREE.CylinderGeometry(top, 1, 1.4, 9, 3, false); g.translate(0, 0.3, 0); // y ∈ [-0.4, 1.0]
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const k = 0.82 + 0.36 * hn(Math.round(x * 50), Math.round(y * 50) + variant, Math.round(z * 50)); const rad = Math.hypot(x, z); const lift = y > 0.9 ? (hn(Math.round(x * 20), variant, Math.round(z * 20)) - 0.4) * 0.28 : 0; p.setXYZ(i, x * k, y + lift + (variant % 2 && rad < 0.3 && y > 0.9 ? 0.35 : 0), z * k); }
  g.computeVertexNormals(); const top0 = new THREE.Color(0xe4f1fb), side = new THREE.Color(0xc9e4f4), deep = new THREE.Color(0x6fb4d8);
  return paint(g, (c, x, y) => { if (y > 0.82) c.copy(top0); else if (y > 0.05) c.copy(side).lerp(top0, (y - 0.05) / 0.77 * 0.6); else c.copy(deep).lerp(side, clamp((y + 0.4) / 0.45, 0, 1)); });
}
function floeGeo(variant) {
  const g = new THREE.CylinderGeometry(1, 0.92, 1, 8, 1, false); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const k = 0.8 + 0.4 * hn(Math.round(x * 40), variant, Math.round(z * 40)); p.setXYZ(i, x * k, y, z * k); }
  g.computeVertexNormals(); return paint(g, (c, x, y) => c.set(y > 0.2 ? 0xf2f8ff : 0xa8d2e8));
}
function bearGeo() { // 面向 +z，約 2.4 m 長；身體 + 頭 兩個 Mesh（頭可轉動）
  const S = (r, w, h, d, x, y, z, hex) => { const g = new THREE.SphereGeometry(r, 10, 8); g.scale(w, h, d); g.translate(x, y, z); return solid(g, hex); };
  const C = (rt, rb, h, x, y, z, hex) => { const g = new THREE.CylinderGeometry(rt, rb, h, 7); g.translate(x, y, z); return solid(g, hex); };
  const W = 0xfff6e0, SH = 0xf0e2c4;
  const body = mergeGeometries([S(0.5, 1.5, 0.95, 0.85, 0, 0.78, 0, W), S(0.42, 1.0, 0.8, 0.9, 0, 0.8, -0.55, SH), C(0.17, 0.2, 0.7, 0.32, 0.35, 0.55, W), C(0.17, 0.2, 0.7, -0.32, 0.35, 0.55, W), C(0.17, 0.2, 0.7, 0.32, 0.35, -0.6, W), C(0.17, 0.2, 0.7, -0.32, 0.35, -0.6, W), S(0.2, 1, 0.5, 1, 0.32, 0.03, 0.62, 0xd9d4c4), S(0.2, 1, 0.5, 1, -0.32, 0.03, 0.62, 0xd9d4c4), S(0.2, 1, 0.5, 1, 0.32, 0.03, -0.55, 0xd9d4c4), S(0.2, 1, 0.5, 1, -0.32, 0.03, -0.55, 0xd9d4c4)]);
  const head = mergeGeometries([S(0.28, 1, 0.9, 1.05, 0, 0, 0, W), S(0.16, 0.9, 0.75, 1.5, 0, -0.06, 0.3, SH), S(0.06, 1, 0.8, 1, 0, -0.02, 0.5, 0x15171a), S(0.07, 1, 1, 0.6, 0.19, 0.24, -0.05, W), S(0.07, 1, 1, 0.6, -0.19, 0.24, -0.05, W), S(0.03, 1, 1, 1, 0.1, 0.07, 0.26, 0x15171a), S(0.03, 1, 1, 1, -0.1, 0.07, 0.26, 0x15171a)]);
  head.translate(0, 0, 0); return { body, head };
}
function pengGeo() { // 面向 +z，約 0.95 m 高
  const S = (r, w, h, d, x, y, z, hex) => { const g = new THREE.SphereGeometry(r, 9, 7); g.scale(w, h, d); g.translate(x, y, z); return solid(g, hex); };
  const parts = [S(0.26, 1, 1.75, 0.9, 0, 0.5, 0, 0x1b2430), S(0.2, 0.95, 1.55, 0.5, 0, 0.47, 0.13, 0xf6f8fa), S(0.15, 1, 1, 1, 0, 0.98, 0.02, 0x1b2430), S(0.04, 1, 0.8, 2.2, 0, 0.95, 0.17, 0xf5a623), S(0.03, 1, 1, 1, 0.07, 1.02, 0.14, 0xffffff), S(0.03, 1, 1, 1, -0.07, 1.02, 0.14, 0xffffff), S(0.05, 0.3, 2, 1.2, 0.27, 0.5, 0, 0x222c3a), S(0.05, 0.3, 2, 1.2, -0.27, 0.5, 0, 0x222c3a), S(0.07, 1.4, 0.4, 2, 0.1, 0.03, 0.1, 0xf5a623), S(0.07, 1.4, 0.4, 2, -0.1, 0.03, 0.1, 0xf5a623)];
  return mergeGeometries(parts);
}

export class Polar {
  constructor(scene, quality) {
    this.scene = scene; this.setQ(quality); this.root = new THREE.Group(); this.root.name = 'polar'; scene.add(this.root);
    this.bergG = Array.from({ length: 6 }, (_, i) => bergGeo(i)); this.floeG = Array.from({ length: 3 }, (_, i) => floeGeo(i)); this.bear = bearGeo(); this.pengG = pengGeo();
    this.mIce = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.42, metalness: 0.0 });
    this.mAni = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0 });
    this.entries = new Map(); this.items = []; this.t0 = 0; this.last = { x: 1e9, z: 1e9, cold: -1 }; this.snd = 6; this.onSound = null; this.cold = 0; this.hemi = 'north'; this.near = [];
  }
  setQ(q) { this.Q = POLAR_Q[q.name] || POLAR_Q.mid; }
  setQuality(q) { this.setQ(q); this.last.cold = -1; }
  /** pos = 船的場景座標 {x,z}；cold 0..1；hemi 'north'|'south'；es = envState */
  update(dt, time, pos, cold, hemi, es) {
    this.cold = cold; this.hemi = hemi;
    const need = cold >= BERG.startCold - 0.02; this.t0 -= dt;
    if ((need || this.entries.size) && (this.t0 <= 0 || Math.hypot(pos.x - this.last.x, pos.z - this.last.z) > 20 || Math.abs(cold - this.last.cold) > 0.015 || hemi !== this.last.hemi)) { this.t0 = 0.5; this.last = { x: pos.x, z: pos.z, cold, hemi }; this.refresh(pos, need ? cold : 0, hemi); }
    if (!this.entries.size) return;
    const night = es ? es.nightF : 0; const dk = 1 - 0.35 * night; this.mIce.color.setScalar(dk);
    for (const [id, e] of this.entries) {
      e.k = damp(e.k, e.want, performance.now() < (this.fast || 0) ? 100 : 1.4, dt); if (e.want === 0 && e.k < 0.02) { this.root.remove(e.g); this.entries.delete(id); continue; }
      const it = e.it, w = waveHeight(it.x, it.z, time); e.g.position.y = w * 0.55 - (it.kind === 'floe' ? 0.12 : 0); e.g.rotation.z = Math.sin(time * 0.4 + e.ph) * 0.012 * (it.kind === 'berg' ? 1 : 3); e.g.rotation.x = Math.cos(time * 0.33 + e.ph) * 0.012 * (it.kind === 'berg' ? 1 : 3);
      const s = e.k * (0.4 + 0.6 * e.k); e.mesh.scale.set(it.r * s, (it.kind === 'berg' ? it.h : 0.6) * s, it.r * s); if (e.ani) { e.ani.scale.setScalar(e.k); e.ani.position.y = (it.kind === 'berg' ? it.h * e.k * (0.4 + 0.6 * e.k) : 0.3 * e.k) ; this.animate(e, time); }
    }
    // 偶發叫聲：近處（鏡頭 90 m 內）的熊 / 企鵝
    this.snd -= dt; if (this.snd <= 0 && this.onSound) { this.snd = 4 + Math.random() * 7; const cand = this.near.filter((e) => e.it.animal); if (cand.length) { const e = cand[Math.floor(Math.random() * cand.length)]; this.onSound(e.it.animal === 'bear' ? 'bear' : 'penguin', e.it.x, e.it.z); } }
  }
  refresh(pos, cold, hemi) {
    const Q = this.Q; const all = cold > 0 ? bergsAround(pos.x, pos.z, Q.R, cold, hemi) : []; this.items = all;
    const d = (b) => (b.x - pos.x) ** 2 + (b.z - pos.z) ** 2; const bergs = all.filter((b) => b.kind === 'berg').sort((a, b) => d(a) - d(b)).slice(0, Q.bergs), floes = all.filter((b) => b.kind === 'floe').sort((a, b) => d(a) - d(b)).slice(0, Q.floes);
    const keep = new Set(); let bears = 0, pengs = 0;
    for (const it of [...bergs, ...floes]) {
      keep.add(it.id); let e = this.entries.get(it.id);
      if (!e) { e = this.make(it); this.entries.set(it.id, e); this.root.add(e.g); }
      e.want = 1; if (it.animal === 'bear') { if (bears++ >= Q.bears) { e.ani && (e.ani.visible = false); } else if (e.ani) e.ani.visible = true; } else if (it.animal === 'peng') { if (pengs++ >= Q.peng) { e.ani && (e.ani.visible = false); } else if (e.ani) e.ani.visible = true; }
    }
    for (const [id, e] of this.entries) if (!keep.has(id)) e.want = 0;
    this.near = [...this.entries.values()].filter((e) => e.want && e.ani && e.ani.visible && Math.hypot(e.it.x - this.camX, e.it.z - this.camZ) < 120);
  }
  /** 鏡頭位置（叫聲距離用） */
  setCam(x, z) { this.camX = x; this.camZ = z; if (this.entries.size) this.near = [...this.entries.values()].filter((e) => e.want && e.ani && e.ani.visible && Math.hypot(e.it.x - x, e.it.z - z) < 120); }
  make(it) {
    const g = new THREE.Group(); g.position.set(it.x, 0, it.z); const ph = (it.seed % 1000) / 160;
    const geo = it.kind === 'berg' ? this.bergG[it.seed % 6] : this.floeG[it.seed % 3]; const mesh = new THREE.Mesh(geo, this.mIce); mesh.rotation.y = (it.seed % 628) / 100; mesh.scale.setScalar(0.01); g.add(mesh); mesh.castShadow = false; mesh.receiveShadow = false;
    const e = { it, g, mesh, k: 0, want: 1, ph, ani: null, parts: [] };
    if (it.animal) {
      const a = new THREE.Group(); g.add(a); e.ani = a; const R = it.r * (it.kind === 'berg' ? 0.2 : 0.28);
      if (it.animal === 'bear') { for (let i = 0; i < it.n; i++) { const b = new THREE.Group(); const body = new THREE.Mesh(this.bear.body, this.mAni), head = new THREE.Mesh(this.bear.head, this.mAni); head.position.set(0, 0.95, 1.1); b.add(body, head); const ang = ph + i * 2.4; b.position.set(Math.cos(ang) * R, 0, Math.sin(ang) * R); b.rotation.y = ang + 1.2 + (it.seed % 7) * 0.3; b.scale.setScalar(3.3); a.add(b); e.parts.push({ b, head, kind: 'bear', ph: ph + i }); } }
      else { for (let i = 0; i < it.n; i++) { const m = new THREE.Mesh(this.pengG, this.mAni); const ang = ph + i * 1.3 + (it.seed % 5), rr = R * (0.3 + 0.7 * ((i * 37 + it.seed) % 10) / 10); m.position.set(Math.cos(ang) * rr, 0, Math.sin(ang) * rr); m.rotation.y = ((it.seed + i * 53) % 628) / 100; m.scale.setScalar(3.0); a.add(m); e.parts.push({ b: m, kind: 'peng', ph: ph + i * 1.7, y0: m.rotation.y }); } }
    }
    return e;
  }
  animate(e, time) {
    for (const p of e.parts) {
      if (p.kind === 'bear') { p.head.rotation.y = Math.sin(time * 0.5 + p.ph) * 0.6; p.head.rotation.x = Math.sin(time * 0.37 + p.ph * 2) * 0.12 + 0.05; p.b.position.y = Math.sin(time * 0.9 + p.ph) * 0.02; }
      else { const w = Math.sin(time * 0.35 + p.ph) > 0.7; p.b.rotation.z = w ? Math.sin(time * 7 + p.ph) * 0.16 : Math.sin(time * 1.4 + p.ph) * 0.02; p.b.rotation.y = p.y0 + Math.sin(time * 0.3 + p.ph) * 0.4; }
    }
  }
  /** 手動駕駛碰撞：以最近一次 refresh 的完整列表判斷（含畫質沒畫出的）。 */
  hit(x, z, r) { for (const b of this.items) if (b.kind === 'berg' && Math.hypot(b.x - x, b.z - z) < b.r * 0.85 + r) return b; return null; }
  /** 找最近、有指定動物的冰山（螢幕截圖 / 導覽用） */
  find(animal) { let best = null, bd = 1e12; for (const e of this.entries.values()) if (e.it.animal === animal && e.k > 0.6 && e.ani && e.ani.visible) { const d = e.it.x ** 2 + e.it.z ** 2; if (d < bd) { bd = d; best = e.it; } } return best; }
}
