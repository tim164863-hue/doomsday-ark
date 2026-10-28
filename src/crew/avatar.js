// 角色：沿用上一版辦公室（grokbot-office）的 Kenney「Mini Characters」(CC0) 方塊 Q 版造型與動畫片段，
// 再程序化疊上：配件（皇冠/貓耳/圍巾…）、手持物、浴袍與毛巾，以及打字/游泳/躺臥等額外姿勢。
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';

const MODEL_NAMES = ['male-a', 'male-b', 'male-c', 'male-d', 'male-e', 'male-f', 'female-a', 'female-b', 'female-c', 'female-d', 'female-e', 'female-f'];
const cache = {};
export function preloadAvatars() {
  const L = new GLTFLoader(); L.setMeshoptDecoder(MeshoptDecoder);
  const base = import.meta.env.BASE_URL || './';
  return Promise.all(MODEL_NAMES.map((n) => new Promise((res) => L.load(`${base}models/character-${n}.glb`, (g) => { cache[n] = g; res(); }, undefined, () => res()))));
}

const matCache = new Map();
const mat = (hex, o = {}) => { const k = hex + JSON.stringify(o); if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color: hex, roughness: 0.7, metalness: 0, ...o })); return matCache.get(k); };
const gold = () => mat(0xffc93a, { metalness: 0.85, roughness: 0.28, emissive: 0x6b4a00, emissiveIntensity: 0.35 });
const G = {}; const geo = (k, f) => (G[k] ||= f());

/** 每位成員：使用哪個模型 + 配件。shirt 供毯子等顏色用。 */
export const LOOKS = {
  'T董': { model: 'male-d', shirt: 0x2a3144, scale: 1.1, acc: ['crown', 'badge', 'goldtie'] },
  '最高級打工仔': { model: 'male-a', shirt: 0x2f9a62, acc: [] },
  '交易員-1': { model: 'male-b', shirt: 0xd9482f, acc: ['headband'] },
  '交易員-2': { model: 'male-f', shirt: 0x3fae6b, acc: ['cap'] },
  '0xcat': { model: 'female-a', shirt: 0x7b4bc4, acc: ['catears'] },
  '策略研究員': { model: 'female-e', shirt: 0xf1f3f5, acc: [] },
  '鏈上獵手': { model: 'female-b', shirt: 0xe9b23a, acc: ['scarf', 'goggles'] },
};
const SPARE = ['male-c', 'female-c', 'female-d', 'female-f', 'male-e'];
function hashLook(key) {
  let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) | 0;
  return { model: SPARE[Math.abs(h) % SPARE.length], shirt: 0x5b7fc4, acc: [] };
}


// ---- 角色換色：所有 Kenney 角色共用一張 512×512 調色盤貼圖；把「衣服」色系（藍紫 / 綠 / 橘紅黃）轉到指定色相，膚色 / 髮色 / 灰階不動。
const rgb2hsv = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, mx ? d / mx : 0, mx / 255]; };
const hsv2rgb = (h, s, v) => { const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c; let r = 0, g = 0, b = 0; const i = Math.floor((((h % 360) + 360) % 360) / 60); if (i === 0) [r, g, b] = [c, x, 0]; else if (i === 1) [r, g, b] = [x, c, 0]; else if (i === 2) [r, g, b] = [0, c, x]; else if (i === 3) [r, g, b] = [0, x, c]; else if (i === 4) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x]; return [(r + m) * 255, (g + m) * 255, (b + m) * 255]; };
const CENTER = { cool: 235, green: 150, warm: 30 };
export function recolorPixels(d, col) {
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2]; if (r + g + b === 0) continue; const [h, s, v] = rgb2hsv(r, g, b); if (s < 0.25) continue;
    let k = null; const hh = h >= 340 ? h - 360 : h;
    if (h >= 185 && h < 300) k = 'cool'; else if (h >= 95 && h < 185) k = 'green';
    else if (hh < 62 && (s >= 0.7 || (hh >= 33 && s > 0.55) || (hh < 12 && s >= 0.6))) k = 'warm';
    if (!k || col[k] == null) continue;
    const nh = col[k] + (hh - CENTER[k]) * 0.5; const [nr, ng, nb] = hsv2rgb(nh, s, v); d[i] = nr; d[i + 1] = ng; d[i + 2] = nb;
  }
}
const recolorCache = new Map();
function recolor(model, srcScene, name, col) {
  const key = name + JSON.stringify(col); let m = recolorCache.get(key);
  if (!m) {
    let base = null; srcScene.traverse((o) => { if (!base && o.isMesh && o.material && o.material.map) base = o.material; });
    if (!base || !base.map.image) return; const img = base.map.image, w = img.width || 512, h = img.height || 512;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0, w, h);
    const id = cx.getImageData(0, 0, w, h); recolorPixels(id.data, col); cx.putImageData(id, 0, 0);
    const t = new THREE.CanvasTexture(cv); t.flipY = base.map.flipY; t.colorSpace = base.map.colorSpace; t.wrapS = base.map.wrapS; t.wrapT = base.map.wrapT; t.anisotropy = base.map.anisotropy;
    m = base.clone(); m.map = t; recolorCache.set(key, m);
  }
  model.traverse((o) => { if (o.isMesh && o.material && o.material.map) o.material = m; });
}

const H_TARGET = 1.42; // 世界單位身高（Q 版大頭，比真人矮一點）
const NATIVE_H = 0.671;
const SIT_Y = 0.37, SIT_Z = -0.05;

// 姿勢 → 基本動畫片段
const CLIP = {
  stand: 'idle', sit: 'sit', type: 'sit', think: 'sit', eat: 'sit', lie: 'idle', lounge: 'idle', swim: 'idle', wave: 'idle', swing: 'idle', stretch: 'idle',
  arcade: 'interact-right', rail: 'holding-both', drink: 'holding-right', lift: 'holding-both', shoot: 'holding-both', chat: 'idle', hello: 'emote-yes', sleepy: 'idle',
};
const SITTING = new Set(['sit', 'type', 'think', 'eat']);
const PITCH = { lie: -1.5, lounge: -1.15, swim: 1.5 };
const WALKABLE = new Set(['stand', 'chat', 'hello', 'sleepy', 'wave', 'drink', 'treadmill']);

const _q = new THREE.Quaternion(), _e = new THREE.Euler();
const _a = new THREE.Quaternion(), _b = new THREE.Quaternion(), _m = new THREE.Quaternion();
// 在「模型空間」(x=左、y=上、z=前) 對骨頭疊加旋轉 —— 不受骨架局部軸向影響
function rotM(av, b, x = 0, y = 0, z = 0) {
  if (!b || (!x && !y && !z)) return;
  av.model.getWorldQuaternion(_m).invert();
  b.parent.getWorldQuaternion(_a); _a.premultiply(_m); // PQ（相對模型）
  _b.setFromEuler(_e.set(x, y, z));
  b.quaternion.premultiply(_q.copy(_a).invert().multiply(_b).multiply(_a));
}

export class Avatar {
  constructor(key, look) {
    this.key = key; look = look || LOOKS[key] || hashLook(key); this.look = look;
    const gl = cache[look.model] || cache['male-a'];
    const root = (this.group = new THREE.Group()); root.name = 'avatar:' + key;
    this.body = new THREE.Group(); root.add(this.body);
    this.sc = (H_TARGET / NATIVE_H) * (look.scale || 1);
    this.model = cloneSkinned(gl.scene); this.model.scale.setScalar(this.sc); this.body.add(this.model);
    if (look.col && Object.keys(look.col).length) recolor(this.model, gl.scene, look.model, look.col);
    this.model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
    const B = (this.bones = {});
    this.model.traverse((o) => { if (['head', 'torso', 'arm-left', 'arm-right', 'leg-left', 'leg-right'].includes(o.name)) B[o.name] = o; });
    this.rest = Object.values(B).map((b) => [b, b.quaternion.clone()]);
    this.mixer = new THREE.AnimationMixer(this.model); this.actions = {};
    for (const c of gl.animations) this.actions[c.name] = this.mixer.clipAction(c);
    this.cur = null; this.play('idle', 0);
    this.accessories(look); this.accessories2(look);
    this.makeRobe(); this.makeItems();
    this.poseName = 'stand'; this.speed = 0; this.gait = 'walk'; this.swingT = 0; this.talk = 0; this.t = Math.random() * 10; this.stairLean = 0;
    this.pitch = 0; this.sitK = 0; this.fixedSpeed = null; this.fixedGait = null;
  }

  add(parent, geom, material, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geom, material); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; }

  accessories(look) {
    const A = new Set(look.acc || []), head = this.bones.head, torso = this.bones.torso, add = this.add.bind(this);
    const gold = mat(0xffc93a, { metalness: 0.85, roughness: 0.28, emissive: 0x6b4a00, emissiveIntensity: 0.35 });
    if (A.has('crown')) {
      const g = new THREE.Group(); g.position.set(0, 0.325, 0); head.add(g);
      add(g, geo('crownR', () => new THREE.CylinderGeometry(0.15, 0.14, 0.06, 16)), gold, 0, 0.02, 0).scale.z = 0.82;
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; add(g, geo('crownS', () => new THREE.ConeGeometry(0.035, 0.1, 5)), gold, Math.sin(a) * 0.14, 0.1, Math.cos(a) * 0.115); }
      add(g, geo('crownJ', () => new THREE.SphereGeometry(0.026, 8, 6)), mat(0xe0262e, { roughness: 0.2 }), 0, 0.025, 0.125);
    }
    if (A.has('badge')) add(torso, geo('badge', () => new THREE.CylinderGeometry(0.035, 0.035, 0.014, 14).rotateX(Math.PI / 2)), gold, 0.075, 0.095, 0.1);
    if (A.has('goldtie')) add(torso, geo('gtie', () => new THREE.BoxGeometry(0.035, 0.1, 0.012)), gold, 0, 0.075, 0.105);
    if (A.has('catears')) for (const s of [-1, 1]) { const e = add(head, geo('ear', () => new THREE.ConeGeometry(0.07, 0.15, 4)), mat(0x8a5ad8), s * 0.13, 0.37, 0); e.rotation.z = -s * 0.3; add(head, geo('earI', () => new THREE.ConeGeometry(0.04, 0.09, 4)), mat(0xf6a6c8), s * 0.128, 0.365, 0.02).rotation.z = -s * 0.3; }
    if (A.has('headband')) add(head, geo('hb', () => new THREE.CylinderGeometry(0.222, 0.222, 0.05, 24, 1, true)), mat(0xffffff, { side: THREE.DoubleSide }), 0, 0.215, 0).scale.z = 0.79;
    if (A.has('cap')) { const c = mat(0x0e7585); add(head, geo('cap', () => new THREE.SphereGeometry(0.235, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.42)), c, 0, 0.2, 0).scale.z = 0.8; add(head, geo('capb', () => new THREE.BoxGeometry(0.3, 0.014, 0.15)), c, 0, 0.24, 0.2).rotation.x = 0.1; }
    if (A.has('scarf')) { add(head, geo('scarf', () => new THREE.TorusGeometry(0.16, 0.045, 8, 18).rotateX(Math.PI / 2)), mat(0xe0762a), 0, 0.0, 0).scale.z = 0.8; add(torso, geo('scarft', () => new THREE.BoxGeometry(0.06, 0.15, 0.03)), mat(0xe0762a), 0.06, 0.06, 0.105); }
    if (A.has('goggles')) { const g = new THREE.Group(); g.position.set(0, 0.27, 0.0); head.add(g); add(g, geo('ggb', () => new THREE.BoxGeometry(0.36, 0.06, 0.04)), mat(0x2a2f33), 0, 0, 0.16); for (const s of [-1, 1]) add(g, geo('ggl', () => new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10).rotateX(Math.PI / 2)), mat(0x6fd0ff, { roughness: 0.1, metalness: 0.3 }), s * 0.09, 0, 0.18); }
  }

  /** 新增配件（角色資料庫用）：帽子 / 眼鏡 / 耳機 / 背包…，顏色由 look.ac 指定。 */
  accessories2(look) {
    const A = new Set(look.acc || []), head = this.bones.head, torso = this.bones.torso, add = this.add.bind(this); const ac = look.ac || {};
    const col = (k, d) => (ac[k] != null ? ac[k] : d); const M = (hex, o) => mat(hex, o);
    const dome = (r, y, hex, sz = 0.82, phi = 0.46) => { const m = add(head, geo('dome' + r + '_' + phi, () => new THREE.SphereGeometry(r, 20, 10, 0, Math.PI * 2, 0, Math.PI * phi)), M(hex), 0, y, 0); m.scale.z = sz; return m; };
    const ring = (r, h, y, hex, sz = 0.8) => { const m = add(head, geo('ringH' + r + '_' + h, () => new THREE.CylinderGeometry(r, r, h, 24, 1, true)), M(hex, { side: THREE.DoubleSide }), 0, y, 0); m.scale.z = sz; return m; };
    if (A.has('sailor')) { const c = col('sailor', 0x1f3f7a); add(head, geo('slr', () => new THREE.CylinderGeometry(0.2, 0.215, 0.1, 22)), M(0xffffff), 0, 0.3, 0).scale.z = 0.86; ring(0.222, 0.05, 0.245, c, 0.86); add(head, geo('slt', () => new THREE.CylinderGeometry(0.19, 0.19, 0.012, 20)), M(c), 0, 0.352, 0).scale.z = 0.86; }
    if (A.has('captain')) { dome(0.24, 0.2, 0xf4f4f0, 0.84, 0.44); add(head, geo('cpv', () => new THREE.BoxGeometry(0.3, 0.025, 0.13)), M(0x1c1f24), 0, 0.225, 0.2); add(head, geo('cpb', () => new THREE.SphereGeometry(0.03, 10, 8)), gold(), 0, 0.3, 0.17); ring(0.242, 0.035, 0.23, 0x1f2d4a, 0.84); }
    if (A.has('bucket')) { const c = col('bucket', 0xe8c441); add(head, geo('bkc', () => new THREE.CylinderGeometry(0.17, 0.21, 0.13, 20)), M(c), 0, 0.31, 0).scale.z = 0.85; add(head, geo('bkb', () => new THREE.CylinderGeometry(0.31, 0.31, 0.016, 24)), M(c), 0, 0.245, 0).scale.z = 0.92; }
    if (A.has('hardhat')) { const c = col('hardhat', 0xffc21a); dome(0.245, 0.2, c, 0.84, 0.46); add(head, geo('hhb', () => new THREE.BoxGeometry(0.34, 0.022, 0.12)), M(c), 0, 0.21, 0.2); add(head, geo('hhr', () => new THREE.BoxGeometry(0.05, 0.035, 0.36)), M(c), 0, 0.445, 0); }
    if (A.has('chef')) { const c = col('chef', 0xffffff); add(head, geo('chc', () => new THREE.CylinderGeometry(0.17, 0.18, 0.12, 20)), M(c), 0, 0.27, 0).scale.z = 0.86; add(head, geo('chp', () => new THREE.SphereGeometry(0.21, 16, 12)), M(c), 0, 0.4, 0).scale.set(1, 0.72, 0.9); }
    if (A.has('explorer')) { const c = col('explorer', 0xc9a766); add(head, geo('exb', () => new THREE.CylinderGeometry(0.35, 0.35, 0.016, 28)), M(c), 0, 0.245, 0).scale.z = 0.95; add(head, geo('exc', () => new THREE.CylinderGeometry(0.17, 0.2, 0.14, 20)), M(c), 0, 0.31, 0).scale.z = 0.88; ring(0.205, 0.04, 0.275, 0x6b4a2a, 0.88); }
    if (A.has('glasses')) { const c = col('glasses', 0x2b2f3a); for (const sx of [-1, 1]) { add(head, geo('gls', () => new THREE.TorusGeometry(0.058, 0.011, 8, 18)), M(c), sx * 0.095, 0.17, 0.2); add(head, geo('glt', () => new THREE.BoxGeometry(0.012, 0.012, 0.2)), M(c), sx * 0.2, 0.17, 0.1); } add(head, geo('glb', () => new THREE.BoxGeometry(0.06, 0.012, 0.012)), M(c), 0, 0.18, 0.2); }
    if (A.has('headphones')) { const c = col('headphones', 0x2b2f3a); const t = add(head, geo('hpt', () => new THREE.TorusGeometry(0.235, 0.018, 8, 24, Math.PI)), M(c), 0, 0.14, 0); t.scale.z = 0.85; for (const sx of [-1, 1]) add(head, geo('hpc', () => new THREE.CylinderGeometry(0.065, 0.065, 0.055, 14).rotateZ(Math.PI / 2)), M(0xe9407a), sx * 0.235, 0.14, 0); }
    if (A.has('bow')) { const c = col('bow', 0xffffff); const g = new THREE.Group(); g.position.set(-0.15, 0.31, 0.13); g.rotation.z = 0.5; head.add(g); for (const sx of [-1, 1]) { const w = add(g, geo('bw', () => new THREE.ConeGeometry(0.05, 0.1, 6)), M(c), sx * 0.05, 0, 0); w.rotation.z = -sx * Math.PI / 2; } add(g, geo('bk', () => new THREE.SphereGeometry(0.022, 8, 6)), M(c), 0, 0, 0); }
    if (A.has('divermask')) { const c = col('divermask', 0xff7a2a); ring(0.224, 0.04, 0.25, c, 0.8); add(head, geo('dml', () => new THREE.BoxGeometry(0.3, 0.075, 0.03)), M(0x1d4f7a, { transparent: true, opacity: 0.8, roughness: 0.2 }), 0, 0.25, 0.185); add(head, geo('dmf', () => new THREE.BoxGeometry(0.33, 0.09, 0.02)), M(c), 0, 0.25, 0.175); }
    if (A.has('beanie')) { const c = col('beanie', 0xe0382b); dome(0.238, 0.19, c, 0.82, 0.48); ring(0.242, 0.065, 0.2, 0xf4efe6, 0.82); add(head, geo('bnp', () => new THREE.SphereGeometry(0.05, 10, 8)), M(0xf4efe6), 0, 0.45, 0); }
    if (A.has('bandana')) { const c = col('bandana', 0xf08a2a); ring(0.226, 0.07, 0.2, c, 0.8); add(head, geo('bdk', () => new THREE.BoxGeometry(0.1, 0.1, 0.03)), M(c), 0, 0.2, -0.2).rotation.z = 0.6; }
    if (A.has('bag')) { const c = col('bag', 0x7a5a3a); add(torso, geo('bgb', () => new THREE.BoxGeometry(0.22, 0.26, 0.1)), M(c), 0, 0.03, -0.14); add(torso, geo('bgl', () => new THREE.BoxGeometry(0.2, 0.08, 0.02)), M(0xe8e2d4, { roughness: 0.9 }), 0, 0.1, -0.2); for (const sx of [-1, 1]) add(torso, geo('bgs', () => new THREE.BoxGeometry(0.03, 0.22, 0.012)), M(c), sx * 0.075, 0.07, 0.108); }
  }

  makeRobe() {
    const white = mat(0xf6f3ec, { roughness: 0.95 }), trim = mat(0xe3a1c0, { roughness: 0.9 });
    const parts = []; const t = this.bones.torso, add = this.add.bind(this);
    parts.push(add(t, geo('rb1', () => new THREE.BoxGeometry(0.27, 0.19, 0.19)), white, 0, 0.075, 0));
    parts.push(add(t, geo('rb2', () => new THREE.BoxGeometry(0.28, 0.1, 0.2)), white, 0, -0.06, 0));
    parts.push(add(t, geo('rb3', () => new THREE.BoxGeometry(0.29, 0.025, 0.205)), trim, 0, -0.005, 0));
    for (const n of ['arm-left', 'arm-right']) parts.push(add(this.bones[n], geo('rbs', () => new THREE.BoxGeometry(0.075, 0.12, 0.085)), white, 0, -0.045, 0));
    this.robeParts = parts;
    this.towel = add(this.bones.head, geo('towel', () => new THREE.BoxGeometry(0.47, 0.13, 0.36)), mat(0xdff1f7, { roughness: 0.95 }), 0, 0.31, 0);
    this.robeParts.push(this.towel); this.setRobe(false);
    this.robe = { get visible() { return false; } }; const self = this; Object.defineProperty(this.robe, 'visible', { get: () => self.robeOn });
  }

  makeItems() {
    this.items = {}; const rh = this.bones['arm-right'], lh = this.bones['arm-left'], add = this.add.bind(this);
    const racket = new THREE.Group(); racket.position.set(0, -0.14, 0.03); racket.visible = false; rh.add(racket);
    add(racket, geo('rkH', () => new THREE.CylinderGeometry(0.01, 0.01, 0.09, 6)), mat(0x6b4a2a), 0, -0.02, 0);
    add(racket, geo('rkD', () => new THREE.CylinderGeometry(0.06, 0.06, 0.01, 18)), mat(0xc22b2b), 0, -0.09, 0).rotation.x = Math.PI / 2;
    this.items.racket = racket;
    const mug = new THREE.Group(); mug.position.set(0, -0.14, 0.04); mug.visible = false; rh.add(mug);
    add(mug, geo('mug', () => new THREE.CylinderGeometry(0.025, 0.021, 0.055, 10)), mat(0xf2f2f0), 0, 0, 0);
    this.items.mug = mug;
    const ball = add(lh, geo('ball', () => new THREE.SphereGeometry(0.06, 14, 10)), mat(0xd9732b), 0, -0.15, 0.05); ball.visible = false; this.items.ball = ball;
  }

  setRobe(on) { this.robeOn = on; for (const p of this.robeParts) p.visible = on; }
  setPose(name) { this.poseName = name; }
  hold(name) { for (const k in this.items) this.items[k].visible = k === name; }
  swing() { this.swingT = 1; }

  play(name, fade = 0.22, ts = 1) {
    const a = this.actions[name] || this.actions.idle; if (!a) return;
    if (this.cur === a) { a.timeScale = ts; return; }
    a.reset().setEffectiveWeight(1).fadeIn(fade).play(); a.timeScale = ts;
    if (this.cur) this.cur.fadeOut(fade);
    this.cur = a; this.curName = name;
  }

  update(dt, time) {
    this.t += dt; const pn = this.poseName; const B = this.bones;
    const moving = this.speed > 0.15 && WALKABLE.has(pn);
    let clip = CLIP[pn] || 'idle', ts = 1;
    if (moving) { const run = this.gait === 'run'; clip = run ? 'sprint' : 'walk'; ts = THREE.MathUtils.clamp(this.speed / (run ? 3.4 : 1.5), 0.6, 1.7); }
    else if (pn === 'chat' && this.talk > 0.4 && Math.sin(this.t * 0.9) > 0.55) clip = 'emote-yes';
    if (this.swingT > 0) clip = 'attack-melee-right';
    this.play(clip, clip === 'attack-melee-right' ? 0.08 : 0.22, clip === 'attack-melee-right' ? 1.6 : ts);
    if (this.swingT > 0) this.swingT = Math.max(0, this.swingT - dt * 2.4);
    for (const [b, q] of this.rest) b.quaternion.copy(q);
    this.mixer.update(dt);

    // 身體傾斜（躺/游泳/躺椅）與坐姿抬升
    const k = 1 - Math.exp(-9 * dt);
    const tp = PITCH[pn] || 0; this.pitch += (tp - this.pitch) * k;
    this.body.rotation.x = this.pitch;
    this.sitK += (((SITTING.has(pn)) ? 1 : 0) - this.sitK) * k;
    const lift = Math.abs(Math.sin(this.pitch)) * 0.1 * this.sc / 2.2;
    this.model.position.set(0, this.sitK * SIT_Y + lift, this.sitK * SIT_Z);
    // 程序化手勢（疊加在動畫片段之上）
    this.model.updateMatrixWorld(true);
    const rot = (b, x, y, z) => rotM(this, b, x, y, z); const s = Math.sin, tt = this.t;
    if (pn === 'type') { rot(B['arm-left'], -1.15 + s(tt * 17) * 0.06, 0, -0.55); rot(B['arm-right'], -1.15 + s(tt * 14 + 1) * 0.06, 0, 0.55); rot(B.head, 0.1 + s(tt * 0.9) * 0.05); }
    else if (pn === 'think') { rot(B['arm-left'], -0.6, 0, -0.5); rot(B['arm-right'], -2.2, 0, 0.7); rot(B.head, 0.15); }
    else if (pn === 'eat') { rot(B['arm-left'], -0.8, 0, -0.5); rot(B['arm-right'], -1.0 - (s(tt * 2.6) * 0.5 + 0.5) * 1.0, 0, 0.5); rot(B.head, 0.08); }
    else if (pn === 'wave') { rot(B['arm-right'], -2.7, 0, 0.1 + s(tt * 9) * 0.45); }
    else if (pn === 'stretch') { rot(B['arm-left'], -3.0, 0, 0.2); rot(B['arm-right'], -3.0, 0, -0.2); rot(B.head, -0.2); }
    else if (pn === 'sleepy') { rot(B.head, 0.4 + s(tt * 1.5) * 0.08); rot(B.torso, 0.18); }
    else if (pn === 'shoot') { const sh = (s(tt * 2.2) * 0.5 + 0.5); rot(B['arm-left'], -2.2 - sh * 0.5); rot(B['arm-right'], -2.2 - sh * 0.5); }
    else if (pn === 'lift') { const sh = s(tt * 2.2) * 0.5 + 0.5; rot(B['arm-left'], -sh * 1.8); rot(B['arm-right'], -sh * 1.8); }
    else if (pn === 'chat') { rot(B['arm-right'], -0.7 + s(tt * 3.1) * 0.4 * this.talk); rot(B.head, s(tt * 4.2) * 0.07 * this.talk); }
    else if (pn === 'swim') { const w = tt * 4.2; rot(B['arm-left'], -2.7 + s(w)); rot(B['arm-right'], -2.7 + s(w + Math.PI)); rot(B['leg-left'], s(tt * 11) * 0.3); rot(B['leg-right'], -s(tt * 11) * 0.3); rot(B.head, -0.6); }
    else if (pn === 'lounge') { rot(B['arm-right'], -1.2); rot(B['leg-left'], -0.2); rot(B['leg-right'], -0.2); }
    if (this.stairLean) rot(B.torso, this.stairLean);
  }
}
