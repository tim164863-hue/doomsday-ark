// 特別版吉祥物：奔奔（綠色毛球、圓眼鏡、奔跑）與抱抱（愛心身體）。隨機出現在某一層甲板跑一陣子，再用星星閃光離開。
// 純裝飾＋小互動：不在船員名單、不寫入存檔、不影響模擬（只暫時提升附近船員的心情顯示）。
import * as THREE from 'three';
import { pick, chance } from '../util.js';

const rnd = (a, b) => a + Math.random() * (b - a);
const M = {}; const mat = (k, f) => M[k] || (M[k] = f());
const std = (hex, r = 0.85, extra = {}) => new THREE.MeshStandardMaterial({ color: hex, roughness: r, metalness: 0, ...extra });

function furTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#58b85c'; x.fillRect(0, 0, 256, 256); x.lineCap = 'round'; x.lineJoin = 'round';
  for (let i = 0; i < 90; i++) { // 深綠色手繪塗鴉線
    x.strokeStyle = i % 3 ? 'rgba(28,110,48,.75)' : 'rgba(120,205,110,.7)'; x.lineWidth = 2 + Math.random() * 2.2; x.beginPath();
    let px = Math.random() * 256, py = Math.random() * 256; x.moveTo(px, py); for (let k = 0; k < 5; k++) { px += rnd(-26, 26); py += rnd(-26, 26); x.lineTo(px, py); } x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
const limb = (g, m, len, r, x, y, z) => { // 圓胖短肢：以頂端為轉軸
  const piv = new THREE.Group(); piv.position.set(x, y, z); const c = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 8), m); c.position.y = -len / 2 - r * 0.4; c.castShadow = true; piv.add(c); g.add(piv); return piv;
};
const dot = (g, x, y, z, r, m) => { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), m); o.position.set(x, y, z); g.add(o); return o; };

/** 奔奔：蓬鬆雲朵形綠色毛球 + 大圓眼鏡 + 黃橘色短手短腳。面朝 +z。 */
export function buildBenben() {
  const g = new THREE.Group(); const fur = mat('bfur', () => std(0xffffff, 0.95, { map: furTex(), emissive: 0x2e8a3c, emissiveIntensity: 0.35 })); const furD = mat('bfurd', () => std(0x3f9a4c, 0.95, { emissive: 0x2a7a36, emissiveIntensity: 0.3 }));
  const skin = mat('bskin', () => std(0xf4b63a, 0.7)); const black = mat('blk', () => std(0x1b1b1f, 0.5)); const white = mat('wht', () => std(0xfffdf5, 0.4));
  const body = new THREE.Group(); body.position.y = 0.62; g.add(body); g.userData.body = body;
  const lumps = [[0, 0, 0, 0.36], [0.2, 0.14, 0.02, 0.24], [-0.22, 0.14, 0, 0.25], [0.02, 0.3, -0.02, 0.24], [0.26, -0.1, 0, 0.22], [-0.27, -0.08, 0.02, 0.22], [0.1, -0.24, 0.04, 0.22], [-0.12, -0.25, 0, 0.21],
    [0.3, 0.24, -0.1, 0.17], [-0.32, 0.26, -0.08, 0.17], [0.0, 0.42, 0.06, 0.16], [0.18, 0.38, 0.0, 0.15], [-0.2, 0.38, 0.02, 0.15], [0.0, 0, -0.2, 0.3], [0.2, 0, 0.18, 0.2], [-0.2, 0.02, 0.2, 0.2]];
  lumps.forEach(([x, y, z, r], i) => { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), i % 4 === 3 ? furD : fur); o.position.set(x, y, z); o.rotation.set(i, i * 2, 0); o.castShadow = true; body.add(o); });
  // 臉：大圓眼鏡 + 點點眼睛 + 小扁嘴
  const face = new THREE.Group(); face.position.set(0, 0.06, 0.37); body.add(face);
  for (const sx of [-1, 1]) {
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.115, 20), white); lens.position.set(sx * 0.14, 0.04, 0.0); face.add(lens);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.016, 8, 24), black); rim.position.set(sx * 0.14, 0.04, 0.004); face.add(rim);
    dot(face, sx * 0.14 + 0.01, 0.04, 0.012, 0.024, black);
  }
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.012, 6, 10, Math.PI), black); bridge.position.set(0, 0.08, 0.004); face.add(bridge);
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.014, 0.01), black); mouth.position.set(0, -0.12, 0.0); face.add(mouth);
  face.children.forEach((c) => { c.renderOrder = 2; });
  // 手腳
  g.userData.armL = limb(body, skin, 0.2, 0.065, -0.5, 0.1, 0.1); g.userData.armR = limb(body, skin, 0.2, 0.065, 0.5, 0.1, 0.1);
  g.userData.legL = limb(g, skin, 0.16, 0.075, -0.15, 0.3, 0); g.userData.legR = limb(g, skin, 0.16, 0.075, 0.15, 0.3, 0);
  for (const k of ['legL', 'legR']) { const foot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), skin); foot.position.set(0, -0.3, 0.04); foot.scale.set(1, 0.6, 1.3); g.userData[k].add(foot); }
  g.userData.kind = 'benben'; g.userData.baseY = 0; return g;
}
const heartShape = () => {
  const s = new THREE.Shape(); s.moveTo(0, -0.5); s.bezierCurveTo(-0.15, -0.36, -0.52, -0.12, -0.52, 0.14); s.bezierCurveTo(-0.52, 0.4, -0.26, 0.5, 0, 0.3); s.bezierCurveTo(0.26, 0.5, 0.52, 0.4, 0.52, 0.14); s.bezierCurveTo(0.52, -0.12, 0.15, -0.36, 0, -0.5); return s;
};
/** 抱抱：紅粉色愛心身體、點點眼、腮紅、微笑、深紅色小手腳。面朝 +z。 */
export function buildBaobao() {
  const g = new THREE.Group(); const red = mat('hred', () => std(0xe8455f, 0.55, { emissive: 0xc02a44, emissiveIntensity: 0.3 })); const dark = mat('hdark', () => std(0x8a2233, 0.7)); const black = mat('blk', () => std(0x1b1b1f, 0.5)); const cheek = mat('hchk', () => std(0xff8aa0, 0.6));
  const body = new THREE.Group(); body.position.y = 0.46; g.add(body); g.userData.body = body;
  const geo = new THREE.ExtrudeGeometry(heartShape(), { depth: 0.22, bevelEnabled: true, bevelThickness: 0.11, bevelSize: 0.09, bevelSegments: 5, curveSegments: 20 }); geo.translate(0, 0, -0.11);
  const h = new THREE.Mesh(geo, red); h.scale.setScalar(0.72); h.castShadow = true; body.add(h);
  const hl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), mat('hhl', () => std(0xffd0d8, 0.4))); hl.position.set(-0.2, 0.3, 0.2); hl.scale.set(1.3, 0.8, 0.5); body.add(hl);
  const fz = 0.255 * 0.72 + 0.2; const face = new THREE.Group(); face.position.set(0, 0.04, 0.3); body.add(face);
  for (const sx of [-1, 1]) { dot(face, sx * 0.13, 0.07, 0.0, 0.03, black); const ck = new THREE.Mesh(new THREE.CircleGeometry(0.055, 14), cheek); ck.position.set(sx * 0.22, -0.02, -0.005); ck.scale.y = 0.7; face.add(ck); }
  const sm = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 14, Math.PI), black); sm.position.set(0, -0.02, 0.0); sm.rotation.z = Math.PI; face.add(sm);
  g.userData.armL = limb(body, dark, 0.07, 0.04, -0.36, -0.05, 0.02); g.userData.armR = limb(body, dark, 0.07, 0.04, 0.36, -0.05, 0.02);
  g.userData.legL = limb(g, dark, 0.09, 0.05, -0.1, 0.17, 0); g.userData.legR = limb(g, dark, 0.09, 0.05, 0.1, 0.17, 0);
  for (const k of ['legL', 'legR']) { const foot = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 6), dark); foot.position.set(0, -0.15, 0.03); foot.scale.set(1, 0.6, 1.3); g.userData[k].add(foot); }
  g.userData.kind = 'baobao'; return g;
}

const LINES = {
  benben: ['奔奔～衝衝衝！', '我是奔奔，在跑步喔！', '戴眼鏡的我，跑得超快！', '跑跑跑，停不下來～', '嗨 {boss}！一起跑嗎？'],
  baobao: ['抱抱～給你一個愛心！', '我是抱抱，要抱抱嗎？', '嘿嘿，臉紅紅。', '跟著奔奔，不會迷路。', '今天也要開開心心。'],
};
const BOT_SPAWN = ['奔奔又跑來了！', '是奔奔和抱抱！', '哇，奔奔跑過去了～', '抱抱跟在後面耶，好可愛！', '快看，奔奔今天也戴著眼鏡。'];
const BOT_POKE = ['摸摸牠們，心情都變好了。', '抱抱好療癒～', '奔奔好有活力，我也來動一動！', '謝謝奔奔和抱抱！', '有牠們在，今天不累了。'];
const NAMES = { benben: '奔奔', baobao: '抱抱' };

export class Mascots {
  constructor(game, play) {
    this.game = game; this.play = play; this.list = []; this.sparks = []; this.t = 0; this.next = rnd(45, 100); this.trail = []; this.tags = new Map(); this.stay = 0; this.pokeCd = 0;
  }
  get active() { return this.list.length > 0; }
  /** 找甲板上較開闊的可走位置 */
  spot(deck, near, maxR = 99) {
    const nav = this.game.ship.decks[deck].nav; let best = null, bs = -1; const sm = this.game.small; const rr = sm ? 1.3 : 2.4;
    for (let i = 0; i < 90; i++) {
      let x, z; if (near) { const a = Math.random() * 6.28, d = rnd(this.game.small ? 1.5 : 3, maxR); x = near.x + Math.cos(a) * d; z = near.z + Math.sin(a) * d; } else { if (sm) { const o = this.game.ship.anchors; x = o.party.x + (Math.random() - 0.5) * 14; z = (Math.random() - 0.5) * 7; } else { x = nav.cx(Math.floor(Math.random() * 232)); z = nav.cz(Math.floor(Math.random() * 64)); } }
      if (!nav.walkable(x, z, sm ? 0.3 : 0.5)) continue; if (near && !nav.los(near.x, near.z, x, z)) continue;
      let open = 0; for (let a = 0; a < 8; a++) if (nav.walkable(x + Math.cos(a * 0.785) * rr, z + Math.sin(a * 0.785) * rr, sm ? 0.28 : 0.4)) open++;
      if (open > bs) { bs = open; best = { x, z }; } if (open >= (sm ? 5 : 8)) break;
    }
    return best;
  }
  spawnNow(deck) {
    if (this.active) return false; const sh = this.game.ship; const decks = sh.decks.map((d, i) => i);
    if (deck == null) { const vd = this.game.viewDeck; deck = (vd != null && vd >= 0 && vd < decks.length && chance(0.6)) ? vd : pick(decks); }
    let p = null; for (let k = 0; k < 6 && !p; k++) { p = this.spot(deck); if (!p) deck = pick(decks); } if (!p) return false;
    const mk = (type, x, z) => { const model = type === 'benben' ? buildBenben() : buildBaobao(); model.scale.setScalar(0.001); sh.decks[deck].group.add(model); model.position.set(x, 0, z);
      const el = document.createElement('div'); el.className = 'ft mascot ' + type; el.innerHTML = `<div class="r"><i>${type === 'benben' ? '🟢' : '❤️'}</i><span class="t">${NAMES[type]}</span></div><div class="mbub"></div>`; el.onclick = (e) => { e.stopPropagation(); this.tap(m); }; this.play.hud.tagLayer.append(el);
      const m = { type, model, deck, x, z, yaw: 0, v: 0, el, born: this.t, bub: null, bubUntil: 0, size: type === 'benben' ? 0.62 : 0.5, label: 1.25, on: null, ph: Math.random() * 6 }; return m; };
    const b = mk('benben', p.x, p.z), h = mk('baobao', p.x - 1.0, p.z); this.list = [b, h]; this.trail = []; this.wp = null; this.pause = 0; this.stay = rnd(70, 110); this.leaving = 0; this.age = 0;
    for (const m of this.list) { m.model.userData.s = 0; }
    this.spark(deck, p.x, 0.5, p.z, 14);
    const g = this.game, ui = g.ui; if (ui && ui.toast && (deck === g.viewDeck || g.controls.mode === 'overview')) ui.toast(g.small ? '🟢❤️ 奔奔和抱抱跑上了甲板！' : `🟢❤️ 奔奔和抱抱跑上了 ${deck + 1}F！`);
    this.botsNear(deck, p, 16, BOT_SPAWN, 2); return true;
  }
  botsNear(deck, p, R, lines, n) {
    const bots = [...this.game.crew.bots.values()].filter((b) => !b.away && !b.sleeping && !b.inBath && !b.convo && b.actor.deck === deck && Math.hypot(b.actor.x - p.x, b.actor.z - p.z) < R);
    bots.sort(() => Math.random() - 0.5); bots.slice(0, n).forEach((b, i) => setTimeout(() => { if (!b.sleeping && !b.inBath) b.say(pick(lines), 3.6, 'mood'); }, 700 + i * 1100 + Math.random() * 500));
    return bots;
  }
  spark(deck, x, y, z, n = 10) {
    const grp = this.game.ship.decks[deck].group; const cols = [0xfff3a0, 0xffffff, 0xffb3c8, 0xa8f0b8];
    for (let i = 0; i < n; i++) {
      const m = new THREE.MeshBasicMaterial({ color: cols[i % 4], transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending }); const o = new THREE.Mesh(new THREE.OctahedronGeometry(rnd(0.06, 0.12), 0), m); o.position.set(x, y, z); grp.add(o);
      this.sparks.push({ o, m, vx: rnd(-1.1, 1.1), vy: rnd(1.2, 2.6), vz: rnd(-1.1, 1.1), life: 0, max: rnd(0.8, 1.4) });
    }
  }
  say(m, text, dur = 3) { m.bub = text; m.bubUntil = this.t + dur; m.el.querySelector('.mbub').textContent = text; m.el.classList.add('talk'); }
  /** 點擊名牌：靠近就互動，太遠就先走過去 */
  tap(m) {
    const a = this.game.player.actor; if (a.deck === m.deck && Math.hypot(a.x - m.x, a.z - m.z) < 5) { this.poke(); return; }
    this.game.player.goTo(m.deck, m.x - 1.4, m.z);
  }
  poke() {
    if (!this.active || this.t < this.pokeCd) return false; this.pokeCd = this.t + 2; const b = this.list[0], h = this.list[1];
    this.say(b, pick(LINES.benben).replace('{boss}', this.game.small ? '船長' : 'T董'), 3.4); this.say(h, pick(LINES.baobao), 3.4); this.spark(b.deck, b.x, 0.9, b.z, 8); this.spark(h.deck, h.x, 0.7, h.z, 8);
    h.joy = 1.2; b.joy = 1.2; const bots = this.botsNear(b.deck, b, 9, BOT_POKE, 2);
    for (const k of this.game.crew.bots.values()) { if (k.away || k.actor.deck !== b.deck || Math.hypot(k.actor.x - b.x, k.actor.z - b.z) > 9) continue; k.cheerUntil = Math.max(k.cheerUntil || 0, Date.now() + 60000); k.setMoodNow(); }
    this.pokes = (this.pokes || 0) + 1; return true;
  }
  update(dt) {
    this.t += dt; const sh = this.game.ship;
    // 火花
    for (let i = this.sparks.length - 1; i >= 0; i--) { const s = this.sparks[i]; s.life += dt; const k = s.life / s.max; s.o.position.x += s.vx * dt; s.o.position.y += s.vy * dt; s.o.position.z += s.vz * dt; s.vy -= 2.2 * dt; s.o.rotation.y += dt * 6; s.o.rotation.x += dt * 4; s.m.opacity = Math.max(0, 1 - k); if (k >= 1) { s.o.removeFromParent(); s.m.dispose(); s.o.geometry.dispose(); this.sparks.splice(i, 1); } }
    if (!this.active) { this.next -= dt; if (this.next <= 0) { this.next = rnd(150, 330); if (!document.hidden && this.play.hud && !this.game.homeless) this.spawnNow(); else this.next = 20; } this.updateTags(); return; }
    const [b, h] = this.list; const nav = sh.decks[b.deck].nav; this.age += dt;
    // 出現 / 離開縮放
    const sc = this.age < 0.5 ? this.age / 0.5 : this.leaving ? Math.max(0, 1 - (this.t - this.leaving) / 0.45) : 1; const ease = sc * sc * (3 - 2 * sc);
    if (!this.leaving && this.age > this.stay) { this.leaving = this.t; this.spark(b.deck, b.x, 0.6, b.z, 14); this.spark(h.deck, h.x, 0.5, h.z, 14); }
    // 奔奔：跑向隨機路點；抱抱：沿奔奔足跡跟隨
    if (this.hold != null) { b.v = h.v = this.hold * 3; }
    else if (!this.leaving) {
      if (this.pause > 0) { this.pause -= dt; b.v += (0 - b.v) * Math.min(1, dt * 8); }
      else {
        if (!this.wp || Math.hypot(this.wp.x - b.x, this.wp.z - b.z) < 0.5) { this.wp = this.spot(b.deck, b, 10); if (!this.wp) this.pause = 0.6; else if (chance(0.3)) this.pause = rnd(0.5, 1.4); }
        if (this.wp) { const dx = this.wp.x - b.x, dz = this.wp.z - b.z, d = Math.hypot(dx, dz) || 1; const want = Math.atan2(dx, dz); let da = Math.atan2(Math.sin(want - b.yaw), Math.cos(want - b.yaw)); b.yaw += da * Math.min(1, dt * 7); b.v += (3.3 - b.v) * Math.min(1, dt * 4);
          const [nx, nz] = nav.move(b.x, b.z, Math.sin(b.yaw) * b.v * dt, Math.cos(b.yaw) * b.v * dt, 0.3); if (Math.hypot(nx - b.x, nz - b.z) < b.v * dt * 0.3) { this.wp = null; } b.x = nx; b.z = nz; }
      }
      this.trail.push([b.x, b.z, this.t]); while (this.trail.length > 2 && this.trail[1][2] < this.t - 0.55) this.trail.shift();
      const tp = this.trail[0]; const dx = tp[0] - h.x, dz = tp[1] - h.z, d = Math.hypot(dx, dz);
      if (d > 0.9) { h.yaw += ((Math.atan2(dx, dz) - h.yaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 9); } const sp = Math.min(d * 5, 3.4); h.v = sp; if (d > 0.05) { const [nx, nz] = nav.move(h.x, h.z, dx / d * sp * dt, dz / d * sp * dt, 0.25); h.x = nx; h.z = nz; } if (d <= 0.9) h.v *= 0.4;
      if (Math.hypot(h.x - b.x, h.z - b.z) > 7) { h.x = b.x - Math.sin(b.yaw) * 1.2; h.z = b.z - Math.cos(b.yaw) * 1.2; }
    }
    for (const m of this.list) {
      const u = m.model.userData, run = Math.min(1, m.v / 3); const ph = this.t * (m.type === 'benben' ? 15 : 13) + m.ph; const s = Math.sin(ph);
      m.model.position.set(m.x, Math.abs(s) * 0.09 * run + (m.joy > 0 ? Math.abs(Math.sin(this.t * 14)) * 0.18 : 0), m.z); if (m.joy > 0) m.joy -= dt;
      m.model.rotation.y = m.yaw; m.model.scale.setScalar(Math.max(0.001, ease)); u.body.rotation.z = Math.sin(ph * 0.5) * (m.type === 'baobao' ? 0.14 : 0.06) * run; u.body.rotation.x = 0.12 * run; u.body.scale.set(1 + 0.03 * s * run, 1 - 0.04 * s * run, 1);
      if (m.type === 'benben') { u.legL.rotation.x = s * 1.0 * run; u.legR.rotation.x = -s * 1.0 * run; u.armL.rotation.x = -s * 1.1 * run - 0.2; u.armR.rotation.x = s * 1.1 * run - 0.2; u.armL.rotation.z = 0.5 + 0.4 * run; u.armR.rotation.z = -0.5 - 0.4 * run; }
      else { u.legL.rotation.x = s * 0.9 * run; u.legR.rotation.x = -s * 0.9 * run; u.armL.rotation.z = 0.8 + s * 0.4 * run; u.armR.rotation.z = -0.8 - s * 0.4 * run; }
      if (m.joy > 0) { u.armL.rotation.z = 2.2; u.armR.rotation.z = -2.2; }
      if (m.bub && this.t > m.bubUntil) { m.bub = null; m.el.classList.remove('talk'); }
    }
    if (this.leaving && this.t - this.leaving > 0.5) { for (const m of this.list) { m.model.removeFromParent(); m.el.remove(); } this.list = []; this.tags.clear(); this.pokes = 0; this.next = rnd(150, 330); }
    this.updateTags();
  }
  updateTags() {
    const g = this.game, cam = g.camera, W = g.W, H = g.H; const v = new THREE.Vector3();
    for (const m of this.list) {
      let ok = (g.deckVis ? g.deckVis[m.deck] : true) && (g.controls.mode === 'overview' || m.deck === g.viewDeck) && !g.pilot; let dist = 0;
      if (ok) { m.model.getWorldPosition(v); v.y += m.label * 1; dist = cam.position.distanceTo(v); v.project(cam); ok = !(v.z > 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05 || dist > 90); }
      if (!ok) { if (m.on !== false) { m.el.style.display = 'none'; m.on = false; } continue; }
      if (m.on !== true) { m.el.style.display = ''; m.on = true; }
      m.el.style.transform = `translate(${((v.x * 0.5 + 0.5) * W).toFixed(1)}px,${((-v.y * 0.5 + 0.5) * H).toFixed(1)}px) translate(-50%,-100%)`; m.el.style.zIndex = 520 - Math.round(dist); m.el.classList.toggle('far', dist > 45);
    }
  }
  /** 離玩家最近、2.4m 內的吉祥物（給互動提示用） */
  nearest(a) { let best = null, bd = 2.6; for (const m of this.list) { if (m.deck !== a.deck || this.leaving) continue; const d = Math.hypot(m.x - a.x, m.z - a.z); if (d < bd) { bd = d; best = m; } } return best; }
  names() { return this.list.map((m) => NAMES[m.type]); }
}
export const MASCOT_LINE = LINES;
