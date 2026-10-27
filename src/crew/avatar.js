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
    this.model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
    const B = (this.bones = {});
    this.model.traverse((o) => { if (['head', 'torso', 'arm-left', 'arm-right', 'leg-left', 'leg-right'].includes(o.name)) B[o.name] = o; });
    this.rest = Object.values(B).map((b) => [b, b.quaternion.clone()]);
    this.mixer = new THREE.AnimationMixer(this.model); this.actions = {};
    for (const c of gl.animations) this.actions[c.name] = this.mixer.clipAction(c);
    this.cur = null; this.play('idle', 0);
    this.accessories(look);
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
