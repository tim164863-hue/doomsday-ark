// 特殊海域的畫面：迷霧 / 漩渦 / 火焰 / 地獄 / 海上巨石陣。
//  · 天色 / 霧 / 水色：寫進 env.sz（environment.js 讀；跟天氣 env.wx 同樣的做法），強度 = 深度 k（0 邊緣 … 1 深處，平滑）。
//  · 場景物件：決定性雜湊格場（sim/szfield.js，場景座標）→ 石柱 / 岩柱 / 火柱 / 小漩渦 / 霧珠，一個一個淡入淡出；石柱與岩柱給手動駕駛撞。
//  · 粒子：餘燼 / 灰燼 / 浪沫 / 符文光點（兩組 Points）+ 迷霧團（Sprite）。地獄偶爾閃紅雷。
// 1 張地圖單位 ≈ 550 m，所以海域本身看不到邊界；用「深度」驅動氛圍，物件密度也隨深度增加。
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { fieldAround, FIELD } from '../sim/szfield.js';
import { waveHeight } from './waves.js';
import { clamp, damp } from '../util.js';

export const ZONE_Q = {
  high: { R: 430, cap: { stone: 26, lava: 16, flame: 24, vortex: 5, orb: 28 }, parts: 280, banks: 14 },
  mid: { R: 360, cap: { stone: 20, lava: 12, flame: 18, vortex: 4, orb: 20 }, parts: 190, banks: 10 },
  low: { R: 300, cap: { stone: 14, lava: 9, flame: 12, vortex: 3, orb: 12 }, parts: 110, banks: 6 },
};
// 每個海域的調色（天頂 / 地平線 sky、霧 fog、水 wDeep / wSh；glow = 自發光色，白天不被壓暗）
export const PAL = {
  fog: { sky: [0.66, 0.72, 0.78], skyAmt: 0.85, fog: [0.72, 0.77, 0.82], fogAmt: 0.9, fogMul: 15, dim: 0.35, wDeep: [0.1, 0.14, 0.16], wSh: [0.28, 0.36, 0.38], wAmt: 0.6, glow: 0, star: 0.95 },
  whirlpool: { sky: [0.13, 0.3, 0.34], skyAmt: 0.6, fog: [0.14, 0.28, 0.31], fogAmt: 0.5, fogMul: 1.4, dim: 0.28, wDeep: [0.005, 0.07, 0.09], wSh: [0.05, 0.33, 0.34], wAmt: 0.7, glow: 0, star: 0.6 },
  fire: { sky: [1.0, 0.4, 0.1], skyAmt: 0.75, fog: [0.95, 0.36, 0.1], fogAmt: 0.65, fogMul: 2.4, dim: 0.3, wDeep: [0.22, 0.05, 0.02], wSh: [0.95, 0.33, 0.05], wAmt: 0.5, glow: 1, star: 0.9 },
  hell: { sky: [0.26, 0.02, 0.035], skyAmt: 0.78, fog: [0.17, 0.022, 0.026], fogAmt: 0.62, fogMul: 3.0, dim: 0.78, wDeep: [0.03, 0.0, 0.0], wSh: [0.36, 0.045, 0.01], wAmt: 0.55, glow: 1, star: 1 },
  stonehenge: { sky: [0.42, 0.34, 0.64], skyAmt: 0.65, fog: [0.38, 0.32, 0.56], fogAmt: 0.55, fogMul: 1.9, dim: 0.3, wDeep: [0.05, 0.04, 0.15], wSh: [0.2, 0.17, 0.42], wAmt: 0.5, glow: 0, star: 0.4 },
};
// 粒子：col 顏色、size 大小、vy 垂直速度（m/s）、sw 水平擾動、spin 繞轉、add 是否加色、h 最大高度、n 數量比例
const PART = {
  fire: { col: 0xffa040, size: 2.4, vy: 5, sw: 3, spin: 0, add: true, h: 60, n: 1 },
  hell: { col: 0xff5a2a, size: 2.6, vy: 6, sw: 4, spin: 0, add: true, h: 70, n: 1 },
  stonehenge: { col: 0xb9a6ff, size: 2.2, vy: 1.2, sw: 1.4, spin: 0, add: true, h: 40, n: 0.7 },
  whirlpool: { col: 0xcdf7f4, size: 2.6, vy: 0.6, sw: 3, spin: 0.09, add: true, h: 12, n: 0.9 },
  fog: { col: 0xeaf4fb, size: 2, vy: 0.2, sw: 0.7, spin: 0, add: true, h: 24, n: 0.0 },
};
const KINDS_OF = { fog: ['orb'], whirlpool: ['vortex'], fire: ['flame'], hell: ['lava', 'flame'], stonehenge: ['stone', 'orb'] };
const hn = (x, y, z) => { const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return v - Math.floor(v); };
const col = (g, fn) => { const p = g.attributes.position, c = new Float32Array(p.count * 3), k = new THREE.Color(); for (let i = 0; i < p.count; i++) { fn(k, p.getX(i), p.getY(i), p.getZ(i)); c.set([k.r, k.g, k.b], i * 3); } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; };
function dotTex(soft = 1) {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 1, 32, 32, 31); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35 * soft, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function spiralTex() { // 漩渦圓盤：中心暗、螺旋臂泛白、外緣淡出
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d'); g.translate(S / 2, S / 2);
  const bg = g.createRadialGradient(0, 0, 4, 0, 0, S / 2); bg.addColorStop(0, 'rgba(0,12,18,.95)'); bg.addColorStop(0.3, 'rgba(6,50,60,.6)'); bg.addColorStop(0.75, 'rgba(10,70,80,.18)'); bg.addColorStop(1, 'rgba(10,70,80,0)'); g.fillStyle = bg; g.beginPath(); g.arc(0, 0, S / 2, 0, 7); g.fill();
  for (let a = 0; a < 4; a++) { g.beginPath(); for (let i = 0; i <= 60; i++) { const r = 8 + (S / 2 - 12) * i / 60, ang = a * Math.PI / 2 + i / 60 * 5.2; const x = Math.cos(ang) * r, y = Math.sin(ang) * r; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.strokeStyle = 'rgba(214,248,246,.5)'; g.lineWidth = 7; g.lineCap = 'round'; g.shadowColor = 'rgba(190,250,246,.8)'; g.shadowBlur = 6; g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const columnGeo = (sides, base, jitter, seed, topHex, botHex) => { // y ∈ [-0.3, 1]；上窄下寬、頂面微傾
  const g = new THREE.CylinderGeometry(0.72, 1, 1.3, sides, 3, false); g.translate(0, 0.35, 0); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const k = 1 - jitter + 2 * jitter * hn(Math.round(x * 40), Math.round(y * 30) + seed, Math.round(z * 40)); p.setXYZ(i, x * k, y + (y > 0.95 ? (x * 0.12 + z * 0.06) : 0), z * k); }
  g.computeVertexNormals(); const a = new THREE.Color(topHex), b = new THREE.Color(botHex); return col(g, (c, x, y) => c.copy(b).lerp(a, clamp((y + 0.3) / 1.3, 0, 1)));
};

export class ZoneFX {
  constructor(scene, env, quality) {
    this.scene = scene; this.env = env; this.setQ(quality); this.root = new THREE.Group(); this.root.name = 'zonefx'; scene.add(this.root);
    this.id = ''; this.want = ''; this.depth = 0; this.k = 0; this.t0 = 0; this.last = { x: 1e9, z: 1e9, k: -1, id: '' }; this.entries = new Map(); this.solid = []; this.onThunder = null; this.flashT = 4; this.flash = 0; this.fast = 0;
    this.s = { id: '', k: 0, sky: [0, 0, 0], skyAmt: 0, fog: [0, 0, 0], fogAmt: 0, fogMul: 0, dim: 0, wDeep: [0, 0, 0], wSh: [0, 0, 0], wAmt: 0, glow: 0, star: 0, flash: 0 }; env.sz = this.s;
    this.dot = dotTex(1); this.dotSoft = dotTex(0.6); this.spiral = spiralTex();
    this.stoneG = [0, 1, 2, 3].map((i) => columnGeo(6, 1, 0.14, i, 0xb7b0c8, 0x6a6580)); this.lavaG = [0, 1, 2].map((i) => columnGeo(7, 1, 0.2, 10 + i, 0x3a2a2c, 0x120a0c));
    this.mStone = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.85, metalness: 0.05 }); this.mLava = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.7, metalness: 0.1, emissive: 0x551100, emissiveIntensity: 0.55 });
    const add = (o) => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, ...o });
    this.mRune = add({ color: 0xc8b6ff, opacity: 0.7 }); this.mGlow = add({ color: 0xff6a20, opacity: 0.55, map: this.dot }); this.mFlame = add({ vertexColors: true, opacity: 0.8, side: THREE.DoubleSide });
    this.mVortex = new THREE.MeshBasicMaterial({ map: this.spiral, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    this.flameG = (() => { const g = new THREE.ConeGeometry(1, 1, 8, 3, true); g.translate(0, 0.5, 0); const a = new THREE.Color(0xc42003), b = new THREE.Color(0xff8a1e); return col(g, (c, x, y) => c.copy(a).lerp(b, clamp(y * 1.1, 0, 1)).multiplyScalar(0.85)); })();
    this.diskG = new THREE.CircleGeometry(1, 20); this.diskG.rotateX(-Math.PI / 2); this.planeG = new THREE.PlaneGeometry(2, 2); this.planeG.rotateX(-Math.PI / 2);
    this.bandG = new THREE.CylinderGeometry(0.88, 0.97, 0.07, 6, 1, false); this.bandG.translate(0, 0.58, 0);
    this.mOrb = new THREE.SpriteMaterial({ map: this.dot, color: 0xcfeaff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0.85 });
    this.mBank = new THREE.SpriteMaterial({ map: this.dotSoft, color: 0xe8f0f6, transparent: true, depthWrite: false, fog: false, opacity: 0 });
    this.buildParts(); this.buildBanks();
  }
  setQ(q) { this.Q = ZONE_Q[q.name] || ZONE_Q.mid; }
  setQuality(q) { this.setQ(q); this.last.k = -1; this.buildParts(); this.buildBanks(); }
  buildParts() {
    for (const o of [this.pBright, this.pDark]) if (o) { this.root.remove(o); o.geometry.dispose(); o.material.dispose(); }
    const n = this.Q.parts; this.N = n; const mk = (add) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); const m = new THREE.PointsMaterial({ size: 2.4, map: this.dot, transparent: true, depthWrite: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, opacity: 0, fog: false, color: 0xffffff }); const p = new THREE.Points(g, m); p.frustumCulled = false; p.visible = false; this.root.add(p); return p; };
    this.pBright = mk(true); this.pDark = mk(false); this.pv = new Float32Array(n * 3); this.pRel = new Float32Array(n * 3); for (let i = 0; i < n; i++) { this.pRel[i * 3] = (Math.random() * 2 - 1) * 150; this.pRel[i * 3 + 1] = Math.random() * 40; this.pRel[i * 3 + 2] = (Math.random() * 2 - 1) * 150; this.pv[i * 3] = Math.random() * 2 - 1; this.pv[i * 3 + 1] = 0.4 + Math.random() * 0.8; this.pv[i * 3 + 2] = Math.random() * 2 - 1; }
  }
  buildBanks() {
    if (this.banks) for (const b of this.banks) this.root.remove(b.sp);
    this.banks = []; for (let i = 0; i < this.Q.banks; i++) { const sp = new THREE.Sprite(this.mBank.clone()); sp.visible = false; sp.renderOrder = 2; this.root.add(sp); this.banks.push({ sp, x: (Math.random() * 2 - 1) * 280, z: (Math.random() * 2 - 1) * 280, y: 5 + Math.random() * 22, s: 80 + Math.random() * 110, vx: 2 + Math.random() * 2.5, vz: 0.5 + Math.random() * 1.5, a: 0.5 + Math.random() * 0.5 }); }
  }
  /** game 每 0.5 s 餵：id = 海域（''=不在海域）、depth 0..1；snap = 立刻到位（截圖 / 第一次） */
  setTarget(id, depth, snap) { this.want = id || ''; this.depth = id ? depth : 0; if (snap) { this.fast = 1; } }
  // ---------------------------------------------------------------- 每幀
  update(dt, time, cam, pos) {
    const S = this.s, fast = this.fast; this.fast = 0; this._fast = fast || (this._fastT = Math.max(0, (this._fastT || 0) - dt)) > 0 ? 1 : 0; if (fast) this._fastT = 0.6;
    if (this.want && this.want !== this.id && (!this.id || this.k < 0.05)) { this.id = this.want; for (const e of this.entries.values()) e.want = 0; }
    this.k = damp(this.k, this.id && this.want === this.id ? this.depth : 0, fast ? 100 : 0.9, dt); if (!this.want && this.k < 0.004) this.id = '';
    const id = this.id, P = PAL[id];
    if (P) { const r = fast || S.k < 0.02 ? 100 : 1.6; const L = (a, b) => { for (let i = 0; i < 3; i++) a[i] = damp(a[i], b[i], r, dt); };
      L(S.sky, P.sky); L(S.fog, P.fog); L(S.wDeep, P.wDeep); L(S.wSh, P.wSh); for (const kk of ['skyAmt', 'fogAmt', 'fogMul', 'dim', 'wAmt', 'glow', 'star']) S[kk] = damp(S[kk], P[kk], r, dt); }
    S.id = id; S.k = this.k < 0.004 ? 0 : this.k;
    // 地獄閃電（紅白）
    if (id === 'hell' && this.k > 0.25) { this.flashT -= dt; if (this.flashT <= 0) { this.flashT = 2.5 + Math.random() * 6; this.flash = 1; if (this.onThunder) setTimeout(() => this.onThunder(60 + Math.random() * 120), 300 + Math.random() * 900); } }
    this.flash = Math.max(0, this.flash - dt * 3.2); S.flash = this.flash * this.k * (0.75 + 0.25 * Math.sin(time * 60));
    const need = this.k > 0.02 || this.entries.size > 0; this.t0 -= dt;
    if (need && (this.t0 <= 0 || Math.hypot(pos.x - this.last.x, pos.z - this.last.z) > 20 || Math.abs(this.k - this.last.k) > 0.04 || id !== this.last.id)) { this.t0 = 0.5; this.last = { x: pos.x, z: pos.z, k: this.k, id }; this.refresh(pos); }
    if (!need) { this.pBright.visible = this.pDark.visible = false; for (const b of this.banks) b.sp.visible = false; return; }
    this.updateEntries(dt, time); this.updateParts(dt, time, cam, id, pos); this.updateBanks(dt, pos, id);
  }
  refresh(pos) {
    const id = this.id, kinds = id ? KINDS_OF[id] : [], keep = new Set(), Q = this.Q, k = this.k; this.solid = [];
    for (const kind of kinds) { let items = fieldAround(kind, pos.x, pos.z, Q.R, k); const dist = (b) => (b.x - pos.x) ** 2 + (b.z - pos.z) ** 2; items.sort((a, b) => dist(a) - dist(b)); const cap = Math.round(Q.cap[kind] * (id === 'hell' && kind === 'flame' ? 0.5 : 1)); items = items.slice(0, cap);
      for (const it of items) { keep.add(it.id); let e = this.entries.get(it.id); if (!e) { e = this.make(it); if (!e) continue; this.entries.set(it.id, e); this.root.add(e.g); } e.want = 1; e.it = it; if (FIELD[kind].hit) this.solid.push(e); } }
    for (const [i, e] of this.entries) if (!keep.has(i)) e.want = 0;
  }
  make(it) {
    const g = new THREE.Group(); g.position.set(it.x, 0, it.z); const ph = (it.seed % 1000) / 160; const e = { g, it, k: 0, want: 1, ph, kind: it.kind, spin: 0 };
    if (it.kind === 'stone') { const m = new THREE.Mesh(this.stoneG[it.seed % 4], this.mStone); m.rotation.y = (it.seed % 628) / 100; g.add(m); const band = new THREE.Mesh(this.bandG, this.mRune); band.rotation.y = m.rotation.y; g.add(band); }
    else if (it.kind === 'lava') { const m = new THREE.Mesh(this.lavaG[it.seed % 3], this.mLava); m.rotation.y = (it.seed % 628) / 100; g.add(m); const d = new THREE.Mesh(this.diskG, this.mGlow); d.position.y = 0.05; d.scale.set(2.2, 1, 2.2); d.userData.disk = 1; g.add(d); e.disk = d; }
    else if (it.kind === 'flame') { e.cones = []; for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(this.flameG, this.mFlame); const a = i * 2.1 + ph; c.position.set(Math.cos(a) * 0.3 * (i ? 1 : 0), 0, Math.sin(a) * 0.3 * (i ? 1 : 0)); c.userData = { h: i ? 0.65 - i * 0.1 : 1, w: i ? 0.6 : 1, ph: ph + i }; g.add(c); e.cones.push(c); } const d = new THREE.Mesh(this.diskG, this.mGlow); d.position.y = 0.05; d.scale.set(2.8, 1, 2.8); g.add(d); e.disk = d; }
    else if (it.kind === 'vortex') { const m = new THREE.Mesh(this.planeG, this.mVortex); m.scale.set(1, 1, 1); g.add(m); e.mesh = m; e.dir = it.seed % 2 ? 1 : -1; }
    else if (it.kind === 'orb') { const sp = new THREE.Sprite(this.mOrb.clone()); g.add(sp); e.sp = sp; sp.material.color.setHex(this.id === 'stonehenge' ? 0xc8b6ff : 0xcfeaff); }
    else return null; return e;
  }
  updateEntries(dt, time) {
    const rate = this._fast ? 100 : 1.5; const pulse = 0.65 + 0.35 * Math.sin(time * 1.6); this.mRune.opacity = 0.35 + 0.5 * pulse;
    for (const [i, e] of this.entries) {
      e.k = damp(e.k, e.want, rate, dt); if (e.want === 0 && e.k < 0.02) { this.root.remove(e.g); this.entries.delete(i); if (e.sp) e.sp.material.dispose(); continue; }
      const it = e.it, w = waveHeight(it.x, it.z, time), s = e.k * (0.4 + 0.6 * e.k), g = e.g;
      if (e.kind === 'stone' || e.kind === 'lava') { g.position.y = w * 0.5; g.scale.set(it.r * s, it.h * s, it.r * s); g.rotation.z = Math.sin(time * 0.4 + e.ph) * 0.01; }
      else if (e.kind === 'flame') { g.position.y = w * 0.5; g.scale.set(it.r * s, it.h * s, it.r * s); for (const c of e.cones) { const u = c.userData, f = 1 + 0.22 * Math.sin(time * 9 + u.ph * 3) + 0.1 * Math.sin(time * 17 + u.ph); c.scale.set(u.w * (1 + 0.1 * Math.sin(time * 6 + u.ph)), u.h * f, u.w); c.rotation.z = Math.sin(time * 3 + u.ph) * 0.12; c.rotation.x = Math.cos(time * 2.4 + u.ph) * 0.12; } }
      else if (e.kind === 'vortex') { g.position.y = w * 0.3 + 0.35; e.mesh.rotation.y += dt * 0.4 * e.dir; const r = it.r * s; e.mesh.scale.set(r, 1, r); }
      else if (e.kind === 'orb') { g.position.y = it.h + Math.sin(time * 0.9 + e.ph) * 1.2; g.position.x = it.x + Math.sin(time * 0.3 + e.ph) * 2; const sc = (it.r * 3.2 + 0.8 * Math.sin(time * 2 + e.ph)) * s; e.sp.scale.set(sc, sc, 1); e.sp.material.opacity = (0.45 + 0.4 * Math.sin(time * 1.7 + e.ph)) * e.k; }
    }
  }
  updateParts(dt, time, cam, id, pos) {
    const P = PART[id] || PART.fog, on = this.k > 0.03 && P.n > 0, bright = this.pBright, dark = this.pDark;
    bright.visible = on; dark.visible = on && id === 'hell'; if (!on) return;
    const n = Math.round(this.N * P.n * (0.3 + 0.7 * this.k)); bright.geometry.setDrawRange(0, n); dark.geometry.setDrawRange(0, Math.round(n * 0.6));
    const bm = bright.material, dm = dark.material; bm.color.setHex(P.col); bm.size = P.size; bm.opacity = clamp(this.k * 1.2, 0, 1) * 0.9; dm.color.setHex(0x3a2224); dm.size = P.size * 1.1; dm.opacity = this.k * 0.7;
    const ba = bright.geometry.attributes.position.array, da = dark.geometry.attributes.position.array, rel = this.pRel, v = this.pv; const HX = 150;
    for (let i = 0; i < this.N; i++) { const j = i * 3; let x = rel[j], y = rel[j + 1], z = rel[j + 2];
      const dk = id === 'hell' && i % 5 > 1;                                        // 地獄：一部分是往下飄的灰燼
      const sy = dk ? -2.5 - v[j + 1] * 2 : P.vy * (0.4 + v[j + 1]); x += (v[j] * P.sw + (P.spin ? -z * P.spin : 0) + 1.5) * dt; z += (v[j + 2] * P.sw + (P.spin ? x * P.spin : 0)) * dt; y += sy * dt;
      if (y > P.h) y = 0; else if (y < 0) y = P.h; if (x > HX) x -= 2 * HX; else if (x < -HX) x += 2 * HX; if (z > HX) z -= 2 * HX; else if (z < -HX) z += 2 * HX; rel[j] = x; rel[j + 1] = y; rel[j + 2] = z;
      const A = dk ? da : ba; const wx = cam.x + x, wz = cam.z + z; A[j] = wx; A[j + 1] = (id === 'whirlpool' || id === 'fog' ? waveHeight(wx, wz, time) * 0.5 : 0) + y + 0.5; A[j + 2] = wz; }
    bright.geometry.attributes.position.needsUpdate = true; dark.geometry.attributes.position.needsUpdate = true;
  }
  updateBanks(dt, pos, id) {
    const on = id === 'fog' && this.k > 0.03, S = this.s; for (const b of this.banks) { b.sp.visible = on; if (!on) continue; b.x += b.vx * dt; b.z += b.vz * dt; const H = 290; if (b.x - pos.x > H) b.x -= 2 * H; else if (b.x - pos.x < -H) b.x += 2 * H; if (b.z - pos.z > H) b.z -= 2 * H; else if (b.z - pos.z < -H) b.z += 2 * H;
      b.sp.position.set(b.x, b.y, b.z); b.sp.scale.set(b.s, b.s * 0.45, 1); b.sp.material.opacity = this.k * 0.3 * b.a; b.sp.material.color.setRGB(S.fog[0] * 1.05, S.fog[1] * 1.05, S.fog[2] * 1.05); }
  }
  /** 手動駕駛碰撞：圓 (x,z,r) 撞到的石柱 / 岩柱（只看已長出來的），或 null */
  hit(x, z, r) { for (const e of this.solid) { if (e.k < 0.55) continue; const b = e.it; if (Math.hypot(b.x - x, b.z - z) < b.r * 0.9 + r) return b; } return null; }
  /** 場內已長出來的小漩渦（手動駕駛的旋轉推力用） */
  vortexItems() { const o = []; for (const e of this.entries.values()) if (e.kind === 'vortex' && e.want && e.k > 0.5) o.push(e.it); return o; }
  get solidCount() { return this.solid.length; }
}
