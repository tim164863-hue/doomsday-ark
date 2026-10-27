import * as THREE from 'three';
import { damp } from '../util.js';

const G = {};
const geo = (k, f) => (G[k] ||= f());
const limb = (L, r) => geo(`limb${L}_${r}`, () => new THREE.CapsuleGeometry(r, L - r, 4, 8).translate(0, -(L + r) / 2, 0));
const matCache = new Map();
const mat = (hex, o = {}) => { const k = hex + JSON.stringify(o); if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color: hex, roughness: 0.75, metalness: 0, ...o })); return matCache.get(k); };

/** 每位成員的外觀（顏色 + 配件）。找不到的 key 會用雜湊配色。 */
export const LOOKS = {
  'T董': { shirt: 0x2a3144, pants: 0x1f2433, skin: 0xf0c7a0, hair: 0xe9e9ee, acc: ['sunglasses', 'tie', 'goldpin'], scale: 1.08, tie: 0xc01822 },
  '最高級打工仔': { shirt: 0x2b3f78, pants: 0x20263a, skin: 0xe9be96, hair: 0x15110e, acc: ['glasses', 'tie'], tie: 0xd8b25a },
  '交易員-1': { shirt: 0xd9482f, pants: 0x2a2f3a, skin: 0xe6b88f, hair: 0x4a2c1a, acc: ['headband'], },
  '交易員-2': { shirt: 0x1fa5b8, pants: 0x2a2f3a, skin: 0xf0c9a4, hair: 0xe2b84a, acc: ['cap'], capCol: 0x0e5d6b },
  '0xcat': { shirt: 0x7b4bc4, pants: 0x30284a, skin: 0xefc6a2, hair: 0x2b2030, acc: ['catears', 'hood'], },
  '策略研究員': { shirt: 0xf1f3f5, pants: 0x3d6b4f, skin: 0xe4b48c, hair: 0x1d2b20, acc: ['glasses', 'labcoat'], },
  '鏈上獵手': { shirt: 0x2a2f2a, pants: 0x23282b, skin: 0xd9a77e, hair: 0x7a4a22, acc: ['scarf', 'goggles'], scarf: 0xe0762a },
};
function hashLook(key) {
  let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) | 0; const hue = (Math.abs(h) % 360) / 360;
  return { shirt: new THREE.Color().setHSL(hue, 0.55, 0.45).getHex(), pants: 0x2a2f3a, skin: 0xe8bd96, hair: 0x2a1f18, acc: [] };
}

const POSES = {
  stand: { hipY: 0.89, spine: 0, head: 0, lSx: 0, lSz: 0.07, lEx: -0.08, rSx: 0, rSz: -0.07, rEx: -0.08, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
  sit: { hipY: 0.5, spine: 0.04, head: 0, lSx: -0.35, lSz: 0.06, lEx: -0.9, rSx: -0.35, rSz: -0.06, rEx: -0.9, lH: -1.5, lK: 1.5, rH: -1.5, rK: 1.5, pitch: 0 },
  type: { hipY: 0.5, spine: 0.12, head: 0.12, lSx: -0.95, lSz: 0.08, lEx: -1.05, rSx: -0.95, rSz: -0.08, rEx: -1.05, lH: -1.5, lK: 1.5, rH: -1.5, rK: 1.5, pitch: 0 },
  think: { hipY: 0.5, spine: 0.0, head: 0.18, lSx: -0.45, lSz: 0.08, lEx: -1.1, rSx: -0.55, rSz: 0, rEx: -2.4, lH: -1.5, lK: 1.5, rH: -1.5, rK: 1.5, pitch: 0 },
  eat: { hipY: 0.5, spine: 0.1, head: 0.1, lSx: -0.8, lSz: 0.06, lEx: -1.0, rSx: -0.7, rSz: -0.05, rEx: -1.2, lH: -1.5, lK: 1.5, rH: -1.5, rK: 1.5, pitch: 0 },
  lie: { hipY: 0.89, spine: 0, head: 0, lSx: 0, lSz: 0.12, lEx: -0.1, rSx: 0, rSz: -0.12, rEx: -0.1, lH: 0, lK: 0.0, rH: 0, rK: 0.0, pitch: -1.5 },
  lounge: { hipY: 0.89, spine: 0, head: 0.1, lSx: -0.5, lSz: 0.1, lEx: -0.5, rSx: -0.3, rSz: -0.1, rEx: -1.3, lH: -0.15, lK: 0.35, rH: -0.1, rK: 0.25, pitch: -1.3 },
  swim: { hipY: 0.89, spine: 0, head: -0.5, lSx: -2.8, lSz: 0.1, lEx: -0.2, rSx: -2.8, rSz: -0.1, rEx: -0.2, lH: 0, lK: 0.1, rH: 0, rK: 0.1, pitch: 1.5 },
  wave: { hipY: 0.89, spine: 0, head: 0, lSx: 0, lSz: 0.07, lEx: -0.08, rSx: -2.7, rSz: -0.2, rEx: -0.3, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
  swing: { hipY: 0.84, spine: 0.1, head: 0, lSx: -0.4, lSz: 0.4, lEx: -0.4, rSx: -0.7, rSz: -0.3, rEx: -0.9, lH: -0.25, lK: 0.35, rH: 0.25, rK: 0.35, pitch: 0 },
  stretch: { hipY: 0.89, spine: -0.05, head: -0.2, lSx: -3.0, lSz: 0.2, lEx: -0.15, rSx: -3.0, rSz: -0.2, rEx: -0.15, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
  arcade: { hipY: 0.89, spine: 0.06, head: -0.1, lSx: -0.9, lSz: 0.1, lEx: -0.7, rSx: -0.9, rSz: -0.1, rEx: -0.7, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
  rail: { hipY: 0.89, spine: 0.12, head: -0.1, lSx: -0.9, lSz: 0.15, lEx: -0.6, rSx: -0.9, rSz: -0.15, rEx: -0.6, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
  drink: { hipY: 0.89, spine: 0, head: -0.05, lSx: 0, lSz: 0.1, lEx: -0.1, rSx: -0.5, rSz: -0.05, rEx: -2.2, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
  lift: { hipY: 0.89, spine: 0, head: 0, lSx: -0.2, lSz: 0.1, lEx: -1.9, rSx: -0.2, rSz: -0.1, rEx: -1.9, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
  shoot: { hipY: 0.85, spine: -0.05, head: -0.3, lSx: -2.5, lSz: 0.1, lEx: -0.6, rSx: -2.7, rSz: -0.1, rEx: -0.4, lH: -0.1, lK: 0.2, rH: -0.1, rK: 0.2, pitch: 0 },
  chat: { hipY: 0.89, spine: 0, head: 0, lSx: -0.3, lSz: 0.12, lEx: -0.9, rSx: -0.3, rSz: -0.12, rEx: -0.9, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
  hello: { hipY: 0.89, spine: 0, head: 0, lSx: -0.3, lSz: 0.12, lEx: -0.9, rSx: -0.3, rSz: -0.12, rEx: -0.9, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
  sleepy: { hipY: 0.89, spine: 0.25, head: 0.35, lSx: 0, lSz: 0.07, lEx: -0.08, rSx: 0, rSz: -0.07, rEx: -0.08, lH: 0, lK: 0, rH: 0, rK: 0, pitch: 0 },
};
const GAIT = { walk: { f: 5.2, amp: 0.62, bob: 0.025 }, run: { f: 8.2, amp: 1.0, bob: 0.05 } };

export class Avatar {
  constructor(key, look) {
    this.key = key; look = look || LOOKS[key] || hashLook(key); this.look = look;
    const sc = look.scale || 1;
    const root = (this.group = new THREE.Group()); root.name = 'avatar:' + key;
    this.body = new THREE.Group(); root.add(this.body); this.body.scale.setScalar(sc);
    this.hips = new THREE.Group(); this.body.add(this.hips);
    const shirt = mat(look.shirt), pants = mat(look.pants), skin = mat(look.skin, { roughness: 0.6 }), hair = mat(look.hair, { roughness: 0.55 }), shoe = mat(0x1a1a1e);
    const mk = (g, m, parent, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; parent.add(o); return o; };
    // 軀幹
    this.spine = new THREE.Group(); this.hips.add(this.spine);
    mk(geo('pelv', () => new THREE.BoxGeometry(0.33, 0.16, 0.2)), pants, this.hips, 0, -0.02, 0);
    const torso = mk(geo('torso', () => new THREE.CapsuleGeometry(0.16, 0.26, 4, 10).scale(1.08, 1, 0.74)), shirt, this.spine, 0, 0.3, 0);
    // 頭
    this.head = new THREE.Group(); this.head.position.y = 0.64; this.spine.add(this.head);
    mk(geo('neck', () => new THREE.CylinderGeometry(0.045, 0.05, 0.1, 8)), skin, this.head, 0, 0.02, 0);
    const headM = mk(geo('head', () => new THREE.SphereGeometry(0.15, 20, 16).scale(1, 1.05, 1)), skin, this.head, 0, 0.19, 0);
    const hairM = mk(geo('hair', () => new THREE.SphereGeometry(0.158, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.56).scale(1, 1.06, 1.03)), hair, this.head, 0, 0.195, -0.01); hairM.rotation.x = -0.22;
    this.hair = hairM;
    const eyeM = mat(0x16161a, { roughness: 0.3 });
    for (const s of [-1, 1]) mk(geo('eye', () => new THREE.SphereGeometry(0.019, 8, 6)), eyeM, this.head, s * 0.056, 0.2, 0.138);
    mk(geo('mouth', () => new THREE.BoxGeometry(0.05, 0.01, 0.01)), mat(0x8a3a3a), this.head, 0, 0.14, 0.147);
    // 手臂
    this.arms = {};
    for (const [side, sx] of [['l', 1], ['r', -1]]) {
      const sh = new THREE.Group(); sh.position.set(sx * 0.225, 0.52, 0); this.spine.add(sh);
      mk(geo('shoulder', () => new THREE.SphereGeometry(0.062, 10, 8)), shirt, sh);
      mk(limb(0.3, 0.052), shirt, sh);
      const el = new THREE.Group(); el.position.y = -0.3; sh.add(el);
      mk(limb(0.27, 0.045), shirt, el);
      mk(geo('hand', () => new THREE.SphereGeometry(0.05, 10, 8)), skin, el, 0, -0.29, 0);
      this.arms[side] = { sh, el };
    }
    // 腿
    this.legs = {};
    for (const [side, sx] of [['l', 1], ['r', -1]]) {
      const hp = new THREE.Group(); hp.position.set(sx * 0.09, -0.04, 0); this.hips.add(hp);
      mk(limb(0.43, 0.075), pants, hp);
      const kn = new THREE.Group(); kn.position.y = -0.43; hp.add(kn);
      mk(limb(0.4, 0.062), pants, kn);
      mk(geo('shoe', () => new THREE.BoxGeometry(0.1, 0.07, 0.24)), shoe, kn, 0, -0.43, 0.05);
      this.legs[side] = { hp, kn };
    }
    // 配件
    this.accessories(look, mk, shirt, skin, hair);
    // 浴袍 + 毛巾
    const robeMat = mat(0xf4f1ea, { roughness: 0.95 }), robeTrim = mat(0xd9a0b8, { roughness: 0.9 });
    this.robe = new THREE.Group(); this.robe.visible = false; this.body.add(this.robe);
    const rt = new THREE.Mesh(geo('robeT', () => new THREE.CapsuleGeometry(0.18, 0.28, 4, 10).scale(1.15, 1, 0.85)), robeMat); rt.position.y = 0.3; this.spine.add(rt); this.robe.add(rt);
    const skirt = new THREE.Mesh(geo('robeS', () => new THREE.CylinderGeometry(0.2, 0.25, 0.46, 14, 1, true)), robeMat); skirt.material = robeMat.clone(); skirt.material.side = THREE.DoubleSide; skirt.position.y = -0.22; this.hips.add(skirt); this.robe.add(skirt);
    const belt = new THREE.Mesh(geo('robeB', () => new THREE.TorusGeometry(0.175, 0.025, 6, 16).rotateX(Math.PI / 2)), robeTrim); belt.position.y = 0.06; this.spine.add(belt); this.robe.add(belt);
    this.robeParts = [rt, skirt, belt];
    for (const side of ['l', 'r']) { const sl = new THREE.Mesh(limb(0.3, 0.07), robeMat); this.arms[side].sh.add(sl); this.robeParts.push(sl); const sl2 = new THREE.Mesh(limb(0.17, 0.065), robeMat); this.arms[side].el.add(sl2); this.robeParts.push(sl2); }
    this.towel = new THREE.Mesh(geo('towel', () => new THREE.SphereGeometry(0.175, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5).scale(1, 0.9, 1.1)), robeMat); this.towel.position.set(0, 0.2, -0.01); this.towel.visible = false; this.head.add(this.towel);
    this.robeParts.forEach((p) => { p.visible = false; p.castShadow = true; });
    // 手持物
    this.items = {};
    const hand = this.arms.r.el;
    const racket = new THREE.Group(); mk(geo('rkH', () => new THREE.CylinderGeometry(0.018, 0.018, 0.18, 6)), mat(0x6b4a2a), racket, 0, -0.1, 0.0);
    const disc = mk(geo('rkD', () => new THREE.CylinderGeometry(0.115, 0.115, 0.015, 18).rotateX(Math.PI / 2)), mat(0xc22b2b), racket, 0, -0.27, 0); disc.rotation.y = 0;
    racket.position.set(0, -0.29, 0.02); racket.rotation.x = -1.4; racket.visible = false; hand.add(racket); this.items.racket = racket;
    const mug = new THREE.Group(); mk(geo('mug', () => new THREE.CylinderGeometry(0.035, 0.03, 0.08, 10)), mat(0xf2f2f0), mug, 0, 0, 0); mk(geo('mugl', () => new THREE.CylinderGeometry(0.03, 0.03, 0.005, 10)), mat(0x5a3a22), mug, 0, 0.038, 0);
    mug.position.set(0, -0.3, 0.06); mug.visible = false; hand.add(mug); this.items.mug = mug;
    const ballItem = mk(geo('ballH', () => new THREE.SphereGeometry(0.115, 14, 10)), mat(0xd9732b), this.arms.l.el, 0, -0.34, 0.1); ballItem.visible = false; this.items.ball = ballItem;
    // 狀態
    this.cur = { ...POSES.stand }; this.tgt = { ...POSES.stand }; this.poseName = 'stand';
    this.phase = Math.random() * 6; this.speed = 0; this.gait = 'walk'; this.swingT = 0; this.talk = 0; this.t = Math.random() * 10; this.blink = 0;
    this.heads = headM; this.bobY = 0;
    this.setPose('stand');
  }
  accessories(look, mk, shirt, skin, hair) {
    const A = new Set(look.acc || []);
    const black = mat(0x111114, { roughness: 0.3 });
    if (A.has('glasses')) for (const s of [-1, 1]) { const g = mk(geo('gl', () => new THREE.TorusGeometry(0.036, 0.007, 6, 14)), black, this.head, s * 0.06, 0.2, 0.15); g.rotation.y = 0; }
    if (A.has('sunglasses')) { mk(geo('sg', () => new THREE.BoxGeometry(0.28, 0.045, 0.03)), black, this.head, 0, 0.205, 0.145); }
    if (A.has('goggles')) { mk(geo('gg', () => new THREE.BoxGeometry(0.29, 0.07, 0.05)), mat(0xe0762a, { roughness: 0.4 }), this.head, 0, 0.3, 0.1); for (const s of [-1, 1]) mk(geo('ggl', () => new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10).rotateX(Math.PI / 2)), mat(0x6fd0ff, { roughness: 0.1, metalness: 0.3 }), this.head, s * 0.07, 0.3, 0.13); }
    if (A.has('headband')) mk(geo('hb', () => new THREE.TorusGeometry(0.152, 0.018, 6, 20).rotateX(Math.PI / 2)), mat(0xffffff), this.head, 0, 0.255, 0);
    if (A.has('cap')) { const c = look.capCol || 0x225577; mk(geo('cap', () => new THREE.SphereGeometry(0.165, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5)), mat(c), this.head, 0, 0.22, -0.005); mk(geo('capb', () => new THREE.BoxGeometry(0.2, 0.012, 0.13)), mat(c), this.head, 0, 0.22, 0.17).rotation.x = 0.1; if (this.hair) this.hair.visible = false; }
    if (A.has('catears')) for (const s of [-1, 1]) { const e = mk(geo('ear', () => new THREE.ConeGeometry(0.05, 0.11, 4)), mat(look.shirt), this.head, s * 0.1, 0.36, -0.01); e.rotation.z = -s * 0.25; }
    if (A.has('hood')) { mk(geo('hood', () => new THREE.TorusGeometry(0.16, 0.05, 8, 18, Math.PI * 1.2)), shirt, this.spine, 0, 0.7, -0.07).rotation.x = Math.PI * 0.45; }
    if (A.has('tie')) { const t = mk(geo('tie', () => new THREE.BoxGeometry(0.05, 0.28, 0.02)), mat(look.tie || 0xc01822), this.spine, 0, 0.38, 0.122); t.rotation.x = -0.05; }
    if (A.has('goldpin')) mk(geo('pin', () => new THREE.SphereGeometry(0.02, 8, 6)), mat(0xffcf40, { metalness: 0.9, roughness: 0.25 }), this.spine, 0.1, 0.5, 0.12);
    if (A.has('scarf')) { mk(geo('scarf', () => new THREE.TorusGeometry(0.115, 0.05, 8, 16).rotateX(Math.PI / 2)), mat(look.scarf || 0xe0762a), this.head, 0, 0.0, 0); mk(geo('scarft', () => new THREE.BoxGeometry(0.07, 0.24, 0.03)), mat(look.scarf || 0xe0762a), this.spine, 0.08, 0.5, 0.11); }
    if (A.has('labcoat')) { const lc = new THREE.Mesh(geo('lab', () => new THREE.CapsuleGeometry(0.175, 0.3, 4, 10).scale(1.12, 1, 0.8)), mat(0xffffff, { roughness: 0.9 })); lc.position.y = 0.26; this.spine.add(lc); lc.castShadow = true; const g2 = new THREE.Mesh(geo('lab2', () => new THREE.BoxGeometry(0.34, 0.3, 0.3)), mat(0xffffff, { roughness: 0.9 })); g2.position.set(0, -0.1, 0); g2.scale.set(1, 1, 0.75); this.hips.add(g2); }
  }
  setPose(name) { const p = POSES[name] || POSES.stand; this.poseName = name; this.tgt = p; }
  setRobe(on) { this.robe.visible = on; this.robeParts.forEach((p) => (p.visible = on)); this.towel.visible = on; }
  hold(name) { for (const k in this.items) this.items[k].visible = k === name; }
  swing() { this.swingT = 1; }
  update(dt, time) {
    this.t += dt; const c = this.cur, t = this.tgt;
    const k = 1 - Math.exp(-11 * dt);
    for (const key in t) c[key] += (t[key] - c[key]) * k;
    const moving = this.speed > 0.15; const pn = this.poseName;
    const gaitPose = pn === 'stand' || pn === 'chat' || pn === 'hello' || pn === 'sleepy' || pn === 'wave' || pn === 'drink';
    const g = GAIT[this.gait];
    let hipY = c.hipY, lH = c.lH, rH = c.rH, lK = c.lK, rK = c.rK, lSx = c.lSx, rSx = c.rSx, lEx = c.lEx, rEx = c.rEx, spine = c.spine, head = c.head, lSz = c.lSz, rSz = c.rSz;
    if (moving && (gaitPose || pn === 'treadmill')) {
      this.phase += dt * g.f * Math.min(1.6, this.speed / (this.gait === 'run' ? 3 : 1.45) + 0.35);
      const s = Math.sin(this.phase), amp = g.amp * Math.min(1, this.speed / 1.2);
      lH = s * amp; rH = -s * amp; lK = Math.max(0, -Math.sin(this.phase + 0.6)) * amp * 1.5; rK = Math.max(0, Math.sin(this.phase + 0.6)) * amp * 1.5;
      lSx = -s * amp * 0.75; rSx = s * amp * 0.75; lEx = -0.2 - (this.gait === 'run' ? 0.9 : 0.1); rEx = lEx;
      hipY = c.hipY - 0.03 + Math.abs(Math.cos(this.phase)) * g.bob; spine = this.gait === 'run' ? 0.2 : 0.04;
    }
    if (pn === 'type') { lEx += Math.sin(this.t * 17) * 0.05; rEx += Math.sin(this.t * 14 + 1) * 0.05; head += Math.sin(this.t * 0.9) * 0.05; }
    if (pn === 'chat') { rEx += Math.sin(this.t * 3.1) * 0.4 * this.talk; rSx += Math.sin(this.t * 2.3) * 0.25 * this.talk; lEx += Math.sin(this.t * 2.7 + 1) * 0.3 * this.talk; head += Math.sin(this.t * 4.2) * 0.07 * this.talk; }
    if (pn === 'wave') rEx = -0.3 + Math.sin(this.t * 9) * 0.5;
    if (pn === 'eat') rEx = -1.2 - (Math.sin(this.t * 2.6) * 0.5 + 0.5) * 0.9;
    if (pn === 'lift') { const s = Math.sin(this.t * 2.2); lEx = rEx = -1.2 - (s * 0.5 + 0.5) * 1.2; }
    if (pn === 'arcade') { lSz += Math.sin(this.t * 9) * 0.08; rEx += Math.sin(this.t * 12) * 0.2; }
    if (pn === 'swim') { const w = this.t * 4.2; lSx = -2.7 + Math.sin(w) * 1.0; rSx = -2.7 + Math.sin(w + Math.PI) * 1.0; lH = Math.sin(this.t * 11) * 0.25; rH = -lH; head = -0.5 + Math.sin(w * 0.5) * 0.15; }
    if (pn === 'sleepy') head += Math.sin(this.t * 1.5) * 0.08;
    if (pn === 'swing' || this.swingT > 0) {
      if (this.swingT > 0) { this.swingT = Math.max(0, this.swingT - dt * 2.8); const sw = Math.sin((1 - this.swingT) * Math.PI); rSx = -0.4 - sw * 1.5; rSz = -0.3 + sw * 0.55; spine += sw * 0.35; }
    }
    if (pn === 'stretch') { lSx += Math.sin(this.t * 3) * 0.1; rSx += Math.sin(this.t * 3) * 0.1; }
    // 眨眼/睏
    this.hips.position.y = hipY; this.spine.rotation.x = spine; this.head.rotation.x = head; this.body.rotation.x = c.pitch;
    this.arms.l.sh.rotation.set(lSx, 0, lSz); this.arms.r.sh.rotation.set(rSx, 0, rSz);
    this.arms.l.el.rotation.x = lEx; this.arms.r.el.rotation.x = rEx;
    this.legs.l.hp.rotation.x = lH; this.legs.r.hp.rotation.x = rH; this.legs.l.kn.rotation.x = lK; this.legs.r.kn.rotation.x = rK;
    // 睡覺/躺：身體旋轉後以腳為原點，故把 body 中心抬一點
    this.body.position.y = 0;
  }
}
