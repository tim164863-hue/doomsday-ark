import * as THREE from 'three';
import { waveHeight } from './waves.js';
import { mulberry32, clamp, smoothstep } from '../util.js';

const PI = Math.PI;
const TAU = PI * 2;
let softTex;
function soft() {
  if (softTex) return softTex; const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 1, 32, 32, 31); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return (softTex = new THREE.CanvasTexture(c));
}
const lathe = (pts, seg = 14) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

/** 小水花：用一圈 sprite 重複使用 */
class Splashes {
  constructor(scene, n = 40) {
    this.items = []; this.i = 0;
    for (let k = 0; k < n; k++) { const m = new THREE.SpriteMaterial({ map: soft(), transparent: true, depthWrite: false, opacity: 0, color: 0xffffff }); const s = new THREE.Sprite(m); s.visible = false; scene.add(s); this.items.push({ s, t: 9, v: new THREE.Vector3(), life: 1, sc: 1 }); }
  }
  burst(x, y, z, n = 6, sc = 1, up = 3) {
    for (let k = 0; k < n; k++) { const it = this.items[this.i++ % this.items.length]; it.t = 0; it.life = 0.7 + Math.random() * 0.5; it.sc = sc * (0.6 + Math.random() * 0.8); it.s.position.set(x, y, z); it.v.set((Math.random() - 0.5) * 2.5, up * (0.5 + Math.random()), (Math.random() - 0.5) * 2.5); it.s.visible = true; }
  }
  update(dt) {
    for (const it of this.items) { if (it.t > it.life) { it.s.visible = false; continue; } it.t += dt; const u = it.t / it.life; it.v.y -= 9 * dt; it.s.position.addScaledVector(it.v, dt); it.s.scale.setScalar(it.sc * (0.5 + u * 1.4)); it.s.material.opacity = (1 - u) * 0.8; }
  }
}

function makeDolphin(mat) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(lathe([[0.02, -1.0], [0.16, -0.75], [0.27, -0.2], [0.29, 0.25], [0.22, 0.7], [0.1, 1.05], [0.02, 1.25]]).rotateX(PI / 2), mat); body.scale.set(1, 1, 1); g.add(body);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.34, 8).rotateX(PI / 2), mat); beak.position.set(0, -0.02, 1.35); g.add(beak);
  const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.34, 4), mat); dorsal.position.set(0, 0.31, 0.0); dorsal.rotation.x = -0.5; dorsal.scale.z = 0.4; g.add(dorsal);
  const tail = new THREE.Group(); tail.position.z = -0.95; g.add(tail); const fl = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.04, 0.2), mat); fl.position.z = -0.1; tail.add(fl);
  const tail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.35, 6).rotateX(PI / 2), mat); tail2.position.z = 0.14; tail.add(tail2);
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.15), mat); f.position.set(s * 0.3, -0.1, 0.4); f.rotation.z = -s * 0.5; g.add(f); }
  g.userData.tail = tail; g.scale.setScalar(1.15); g.traverse((o) => { o.castShadow = false; }); return g;
}
function makeWhale(mat, belly) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(lathe([[0.02, -8], [0.8, -6], [1.7, -3], [2.2, 0.5], [2.0, 3.5], [1.2, 6], [0.5, 7.5], [0.05, 8.3]], 18).rotateX(PI / 2), mat); body.scale.set(1.1, 0.9, 1); g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 10), mat); head.scale.set(1.2, 0.8, 1.4); head.position.set(0, 0.2, 7.3); g.add(head);
  const tail = new THREE.Group(); tail.position.z = -7.6; g.add(tail);
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.18, 1.3), mat); f.position.set(s * 1.5, 0, -0.5); f.rotation.y = s * 0.45; tail.add(f); }
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 4), mat); fin.position.set(0, 1.9, -3); g.add(fin);
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.8), mat); f.position.set(s * 2.0, -0.8, 3.3); f.rotation.z = -s * 0.6; f.rotation.y = s * 0.3; g.add(f); }
  g.userData.tail = tail; return g;
}
function makeBird(mat) {
  const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), mat); body.scale.set(0.8, 0.7, 1.7); g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), mat); head.position.set(0, 0.06, 0.4); g.add(head); const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.14, 4).rotateX(PI / 2), new THREE.MeshStandardMaterial({ color: 0xf0b030 })); beak.position.set(0, 0.04, 0.54); g.add(beak);
  g.userData.wings = [];
  for (const s of [-1, 1]) { const w = new THREE.Group(); w.position.set(s * 0.1, 0.05, 0); const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 0.34), mat); m.position.x = s * 0.45; w.add(m); g.add(w); g.userData.wings.push(w); }
  return g;
}

export class SeaLife {
  constructor(scene, env, quality) {
    this.scene = scene; this.env = env; this.q = quality; this.rng = mulberry32(42); this.group = new THREE.Group(); scene.add(this.group);
    this.splash = new Splashes(scene, 60); this.t = 0;
    this.dolMat = new THREE.MeshStandardMaterial({ color: 0x6f8a9a, roughness: 0.38, metalness: 0.05 });
    this.whaleMat = new THREE.MeshStandardMaterial({ color: 0x3e4d5a, roughness: 0.5 });
    this.birdMat = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.8 });
    this.fishMat = new THREE.MeshStandardMaterial({ color: 0xc8d6e0, roughness: 0.25, metalness: 0.6 });
    this.dolphins = []; this.whales = []; this.birds = []; this.fish = []; this.debris = [];
    this.buildDolphins(); this.buildWhales(); this.buildBirds(); this.buildFish(); this.buildDebris(); this.buildRuins();
  }
  buildDolphins() {
    const pods = this.q.dolphins >= 5 ? 3 : this.q.dolphins >= 4 ? 2 : 2;
    for (let p = 0; p < pods; p++) {
      const pod = { r: 60 + p * 38 + this.rng() * 20, a: this.rng() * TAU, sp: (0.05 + this.rng() * 0.03) * (p % 2 ? -1 : 1), list: [] };
      const n = Math.max(3, this.q.dolphins - 1 + (p === 0 ? 1 : 0));
      for (let i = 0; i < n; i++) { const m = makeDolphin(this.dolMat); this.group.add(m); pod.list.push({ m, off: i * 0.9 + this.rng() * 0.4, side: (this.rng() - 0.5) * 7, per: 3.4 + this.rng() * 2.6, ph: this.rng() * 5, last: -1, alt: 2.2 + this.rng() * 1.8 }); }
      this.dolphins.push(pod);
    }
  }
  buildWhales() {
    for (let i = 0; i < 2; i++) { const m = makeWhale(this.whaleMat); m.visible = false; this.group.add(m); const sp = []; for (let k = 0; k < 10; k++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft(), transparent: true, depthWrite: false, opacity: 0 })); s.visible = false; this.scene.add(s); sp.push(s); } this.whales.push({ m, sp, a: i * 3.2 + 0.8, r: 120 + i * 70, state: 'under', t: 4 + i * 9, dir: 1, ph: 0, x: 0, z: 0, hd: 0, blown: 0 }); }
  }
  buildBirds() {
    const n = this.q.birds; const per = Math.ceil(n / 3);
    for (let f = 0; f < 3; f++) { const fl = { r: 40 + f * 30, a: this.rng() * TAU, h: 22 + f * 9, sp: 0.08 + f * 0.01, list: [] }; for (let i = 0; i < per; i++) { const b = makeBird(this.birdMat); b.scale.setScalar(1.6); this.group.add(b); fl.list.push({ b, o: this.rng() * 3, ro: (this.rng() - 0.5) * 14, ho: (this.rng() - 0.5) * 8, ph: this.rng() * 6 }); } this.birds.push(fl); }
  }
  buildFish() {
    for (let f = 0; f < 3; f++) {
      const fl = { list: [], t: 5 + f * 6, state: 'wait', x: 0, z: 0, hd: 0, age: 0 };
      for (let i = 0; i < 7; i++) { const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), this.fishMat); body.scale.set(0.5, 0.5, 2.2); g.add(body); g.userData.wings = []; for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.01, 0.15), this.fishMat); w.position.set(s * 0.2, 0.03, 0.02); g.add(w); g.userData.wings.push(w); } g.visible = false; this.group.add(g); fl.list.push({ g, o: this.rng() * 1.2, lat: (this.rng() - 0.5) * 5 }); }
      this.fish.push(fl);
    }
  }
  buildDebris() {
    const mats = [new THREE.MeshStandardMaterial({ color: 0x8b6b45, roughness: 0.9 }), new THREE.MeshStandardMaterial({ color: 0x9c3b2a, roughness: 0.8 }), new THREE.MeshStandardMaterial({ color: 0x2f5d7a, roughness: 0.8 }), new THREE.MeshStandardMaterial({ color: 0x6b6f70, roughness: 0.7, metalness: 0.4 }), new THREE.MeshStandardMaterial({ color: 0xd9d4c8, roughness: 0.9 })];
    const n = this.q.debris;
    for (let i = 0; i < n; i++) {
      const k = i % 7; let m;
      if (k === 0) m = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 0.5), mats[0]);
      else if (k === 1) m = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.9, 10), mats[1]);
      else if (k === 2) m = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 1.1), mats[0]);
      else if (k === 3) { m = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.12, 8, 14), mats[4]); }
      else if (k === 4) m = new THREE.Mesh(new THREE.BoxGeometry(6, 1.2, 2.4), mats[2]);
      else if (k === 5) m = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 1.6), mats[3]);
      else { m = new THREE.Group(); const hull = new THREE.Mesh(new THREE.BoxGeometry(5, 0.8, 1.8), mats[3]); m.add(hull); const cab = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.4), mats[4]); cab.position.set(-1.3, 0.8, 0); m.add(cab); m.rotation.z = 0.25; }
      const ang = this.rng() * TAU, r = 38 + this.rng() * 170; m.position.set(Math.cos(ang) * r, 0, Math.sin(ang) * r); m.rotation.y = this.rng() * TAU; m.castShadow = false;
      this.group.add(m); this.debris.push({ m, ang, r, sp: (this.rng() - 0.5) * 0.002, bob: this.rng() * 6, k, spin: (this.rng() - 0.5) * 0.05, ty: k === 4 ? -0.2 : k === 6 ? 0.1 : 0.05 });
    }
  }
  buildRuins() {
    if (!this.q.ruins) return;
    const g = new THREE.Group(); const mat = new THREE.MeshStandardMaterial({ color: 0x4a5258, roughness: 0.9 }); const mat2 = new THREE.MeshStandardMaterial({ color: 0x3a4146, roughness: 0.95 });
    const rng = mulberry32(7);
    const clusters = [[-760, -380, 0.9], [620, -640, 1.0], [880, 330, 0.7], [-300, 860, 0.8], [140, -980, 1.1], [-980, 220, 0.8]];
    for (const [cx, cz, sc] of clusters) {
      const n = 9 + Math.floor(rng() * 9);
      for (let i = 0; i < n; i++) {
        const w = (10 + rng() * 22) * sc, d = (10 + rng() * 22) * sc, h = (24 + rng() * 120) * sc * (0.4 + (1 - i / n)); const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), rng() < 0.5 ? mat : mat2);
        b.position.set(cx + (rng() - 0.5) * 220 * sc, h / 2 - 12 - rng() * 14, cz + (rng() - 0.5) * 160 * sc); b.rotation.set((rng() - 0.5) * 0.25, rng() * 3, (rng() - 0.5) * 0.3); g.add(b);
        // 缺口：斜切的頂
        if (rng() < 0.6) { const cut = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, h * 0.15, d * 0.7), mat2); cut.position.copy(b.position); cut.position.y += h * 0.46; cut.rotation.copy(b.rotation); cut.rotation.z += 0.5; g.add(cut); }
      }
    }
    // 半沉橋塔
    for (const [x, z] of [[360, 760], [-620, -760]]) { for (const s of [0, 1]) { const t = new THREE.Mesh(new THREE.BoxGeometry(10, 140, 10), mat); t.position.set(x + s * 80, 50, z); t.rotation.z = (s - 0.5) * 0.12; g.add(t); } const deck = new THREE.Mesh(new THREE.BoxGeometry(110, 3, 7), mat2); deck.position.set(x + 40, 12, z); deck.rotation.z = 0.08; g.add(deck); }
    this.ruins = g; this.scene.add(g); this.ruinsMat = [mat, mat2];
  }

  update(dt, time, es) {
    this.t = time; const nightF = es ? es.nightF : 0;
    this.updateDolphins(dt, time); this.updateWhales(dt, time); this.updateBirds(dt, time, nightF); this.updateFish(dt, time); this.updateDebris(dt, time);
    this.splash.update(dt);
    if (this.ruinsMat) { const k = 0.25 + (1 - nightF) * 0.75; this.ruinsMat[0].color.setRGB(0.29 * k, 0.32 * k, 0.35 * k); this.ruinsMat[1].color.setRGB(0.23 * k, 0.25 * k, 0.28 * k); }
  }
  updateDolphins(dt, time) {
    for (const pod of this.dolphins) {
      pod.a += pod.sp * dt;
      for (const d of pod.list) {
        const lead = pod.a - d.off * 0.012 * Math.sign(pod.sp || 1); const rr = pod.r + d.side;
        const px = Math.cos(lead) * rr, pz = Math.sin(lead) * rr; const dirx = -Math.sin(lead) * Math.sign(pod.sp), dirz = Math.cos(lead) * Math.sign(pod.sp);
        const cyc = ((time + d.ph) % d.per) / d.per; const dur = 0.5 / d.per * 1.0 + 0.0; // 躍出時間比例
        const lt = d.alt / d.per; // 弧長比例
        let y, pitch = 0, vis = true;
        if (cyc < lt) { const u = cyc / lt; y = Math.sin(u * PI) * (2.2 + d.side * 0.05 + 0.6) - 0.5; pitch = Math.cos(u * PI) * 0.9; const prev = d.last; if (prev !== 1 && cyc > 0.02) { /* skip */ } if (d.last !== 1 && u > 0.04) { d.last = 1; this.splash.burst(px, waveHeight(px, pz, time), pz, 5, 0.8, 2.5); } }
        else { y = -2.5; vis = false; if (d.last === 1) { d.last = 0; this.splash.burst(px + dirx * 3, waveHeight(px, pz, time), pz + dirz * 3, 6, 1.0, 3.2); } }
        const wy = waveHeight(px, pz, time);
        d.m.visible = vis; d.m.position.set(px, wy + y, pz);
        d.m.rotation.set(0, 0, 0); d.m.rotation.y = Math.atan2(dirx, dirz); d.m.rotateX(-pitch * 0.95); d.m.userData.tail.rotation.x = Math.sin(time * 14 + d.ph) * 0.4;
      }
    }
  }
  updateWhales(dt, time) {
    for (const w of this.whales) {
      w.t -= dt;
      if (w.state === 'under') { w.m.visible = false; if (w.t <= 0) { w.state = 'rise'; w.t = 3; w.a += (Math.random() - 0.5) * 0.9; const r = w.r + (Math.random() - 0.5) * 40; w.x = Math.cos(w.a) * r; w.z = Math.sin(w.a) * r; w.hd = w.a + PI / 2 * (Math.random() < 0.5 ? 1 : -1) + (Math.random() - 0.5) * 0.6; w.blown = 0; w.m.visible = true; } }
      else if (w.state === 'rise' || w.state === 'surf' || w.state === 'dive') {
        const sp = w.state === 'surf' ? 1.6 : 2.4; w.x += Math.sin(w.hd) * sp * dt; w.z += Math.cos(w.hd) * sp * dt;
        let y = 0, pitch = 0;
        if (w.state === 'rise') { const u = 1 - w.t / 3; y = -3.4 + 3.0 * smoothstep(0, 1, u); pitch = -0.25 * (1 - u); if (w.t <= 0) { w.state = 'surf'; w.t = 9 + Math.random() * 4; } }
        else if (w.state === 'surf') { y = -0.5 + Math.sin(time * 0.9) * 0.18; pitch = Math.sin(time * 0.7) * 0.05; if (w.blown < 3 && w.t < 12 - w.blown * 3.2) { this.spout(w, time); w.blown++; } if (w.t <= 0) { w.state = 'dive'; w.t = 4.5; } }
        else { const u = 1 - w.t / 4.5; y = -0.5 - 4.5 * smoothstep(0, 1, u); pitch = 0.45 * u; w.m.userData.tail.rotation.x = -0.6 * Math.sin(u * PI); if (w.t <= 0) { w.state = 'under'; w.t = 22 + Math.random() * 25; w.m.visible = false; } }
        const wy = waveHeight(w.x, w.z, time);
        w.m.position.set(w.x, wy + y, w.z); w.m.rotation.set(0, w.hd, 0); w.m.rotateX(-pitch); if (w.state !== 'dive') w.m.userData.tail.rotation.x = Math.sin(time * 1.2) * 0.1;
        if (w.spoutT !== undefined && w.spoutT >= 0) this.updateSpout(w, dt);
      } 
      if (w.spoutT !== undefined && w.spoutT >= 0 && w.state === 'under') this.updateSpout(w, dt);
    }
  }
  spout(w, time) { w.spoutT = 0; w.spoutX = w.x + Math.sin(w.hd) * 5.5; w.spoutZ = w.z + Math.cos(w.hd) * 5.5; w.spoutY = waveHeight(w.x, w.z, time) + 0.6; }
  updateSpout(w, dt) {
    w.spoutT += dt; const T = 2.4;
    w.sp.forEach((s, i) => { const u = w.spoutT / T - i * 0.025; if (u < 0 || u > 1) { s.visible = false; return; } s.visible = true; const uu = Math.min(1, u * 1.6); const h = 10 * (1 - (1 - uu) * (1 - uu)) + (u > 0.6 ? -(u - 0.6) * 6 : 0); s.position.set(w.spoutX + (i % 3 - 1) * u * 1.4, w.spoutY + h * (0.5 + (i / w.sp.length) * 0.5), w.spoutZ + ((i * 7) % 3 - 1) * u * 1.2); s.scale.setScalar(1.6 + u * 3.6); s.material.opacity = (1 - u) * 0.8; });
    if (w.spoutT > T + 0.4) { w.spoutT = -1; w.sp.forEach((s) => (s.visible = false)); }
  }
  updateBirds(dt, time, nightF) {
    for (const fl of this.birds) {
      fl.a += fl.sp * dt;
      for (const bd of fl.list) {
        const a = fl.a + bd.o * 0.08; const r = fl.r + bd.ro + Math.sin(time * 0.1 + bd.ph) * 6; const x = Math.cos(a) * r, z = Math.sin(a) * r;
        const y = fl.h + bd.ho + Math.sin(time * 0.35 + bd.ph) * 2.2; bd.b.position.set(x, y, z);
        bd.b.rotation.y = Math.atan2(-Math.sin(a), Math.cos(a)); bd.b.rotation.z = -0.25;
        const flap = Math.sin(time * 7 + bd.ph) * (Math.sin(time * 0.3 + bd.ph) > 0.2 ? 0.1 : 0.7); bd.b.userData.wings[0].rotation.z = flap; bd.b.userData.wings[1].rotation.z = -flap;
        bd.b.visible = nightF < 0.8;
      }
    }
  }
  updateFish(dt, time) {
    for (const fl of this.fish) {
      fl.t -= dt;
      if (fl.state === 'wait') { if (fl.t <= 0) { fl.state = 'fly'; fl.age = 0; const a = Math.random() * TAU, r = 35 + Math.random() * 60; fl.x = Math.cos(a) * r; fl.z = Math.sin(a) * r; fl.hd = a + PI + (Math.random() - 0.5) * 1.6; fl.dur = 2.4 + Math.random() * 1.2; } }
      else {
        fl.age += dt; const sp = 9;
        for (const f of fl.list) {
          const t = fl.age - f.o; const on = t > 0 && t < fl.dur; f.g.visible = on; if (!on) continue;
          const px = fl.x + Math.sin(fl.hd) * sp * t + Math.cos(fl.hd) * f.lat, pz = fl.z + Math.cos(fl.hd) * sp * t - Math.sin(fl.hd) * f.lat;
          const u = t / fl.dur; const y = waveHeight(px, pz, time) + 0.25 + Math.sin(u * PI) * (0.7 + 0.4 * Math.sin(f.lat));
          f.g.position.set(px, y, pz); f.g.rotation.set(0, fl.hd, 0); f.g.rotateX(-Math.cos(u * PI) * 0.25); const fw = Math.sin(time * 40 + f.o * 9) * 0.3; f.g.userData.wings[0].rotation.z = fw; f.g.userData.wings[1].rotation.z = -fw;
          if (t < dt * 1.5) this.splash.burst(px, waveHeight(px, pz, time), pz, 1, 0.3, 1.5);
        }
        if (fl.age > fl.dur + 1.5) { fl.state = 'wait'; fl.t = 14 + Math.random() * 25; for (const f of fl.list) f.g.visible = false; }
      }
    }
  }
  updateDebris(dt, time) {
    for (const d of this.debris) {
      d.ang += d.sp * dt; const x = Math.cos(d.ang) * d.r, z = Math.sin(d.ang) * d.r; const wy = waveHeight(x, z, time);
      const hx = waveHeight(x + 1.5, z, time) - waveHeight(x - 1.5, z, time), hz = waveHeight(x, z + 1.5, time) - waveHeight(x, z - 1.5, time);
      d.m.position.set(x, wy + d.ty, z); d.m.rotation.x = hz * 0.2; d.m.rotation.z = (d.k === 6 ? 0.25 : 0) - hx * 0.2; d.m.rotation.y += d.spin * dt;
    }
  }
}
