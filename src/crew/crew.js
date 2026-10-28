import * as THREE from 'three';
import { Avatar, LOOKS } from './avatar.js';
import { Actor, ELEV_PORTAL } from './actor.js';
import { Match } from './match.js';
import { computeMood, moodLine } from './mood.js';
import { pickConversation, greeting } from './chatter.js';
import { pick, rand, chance, clamp } from '../util.js';
import { DH } from '../ship/ship.js';
import { emit } from '../events.js';
import { D } from './decks.js';

const PI = Math.PI;
const yawOfDir = (hx, hz) => Math.atan2(-hx, -hz);
const rnd = Math.random;

// --------------------------------------------------------------------- 蒸氣（浴室 / 廚房）
let steamTex;
function getSteamTex() {
  if (steamTex) return steamTex;
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 2, 32, 32, 31); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  steamTex = new THREE.CanvasTexture(c); return steamTex;
}
class SteamFX {
  constructor(ship) {
    this.list = [];
    for (const d of ship.decks) for (const s of d.steams) {
      const e = { deck: d, s, level: s.cabin ? 0 : 0.55, target: s.cabin ? 0 : 0.55, sprites: [] };
      const n = s.cabin ? 9 : 4;
      for (let i = 0; i < n; i++) {
        const m = new THREE.SpriteMaterial({ map: getSteamTex(), transparent: true, depthWrite: false, opacity: 0, color: 0xffffff, fog: true });
        const sp = new THREE.Sprite(m); sp.userData = { ph: Math.random(), ox: (Math.random() - 0.5) * (s.cabin ? 1.8 : 0.4), oz: (Math.random() - 0.5) * (s.cabin ? 2.2 : 0.4), sc: s.cabin ? 1.6 + Math.random() * 1.4 : 0.5 + Math.random() * 0.5 };
        sp.renderOrder = 5; d.group.add(sp); e.sprites.push(sp);
      }
      if (s.cabin) { // 浴室蒸氣「天花板」：從上方看不到裡面
        const cover = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 3.3).rotateX(-PI / 2), new THREE.MeshBasicMaterial({ color: 0xe9eef2, transparent: true, opacity: 0, depthWrite: false }));
        cover.position.set(s.x, 2.32, s.z); cover.renderOrder = 4; d.group.add(cover); e.cover = cover;
      }
      this.list.push(e); if (s.cabin) this.byCabin = this.byCabin || {}, this.byCabin[s.cabin] = e;
    }
  }
  setCabin(title, on) { const e = this.byCabin && this.byCabin[title]; if (e) e.target = on ? 1 : 0; }
  update(dt, t) {
    for (const e of this.list) {
      e.level += (e.target - e.level) * (1 - Math.exp(-(e.target > e.level ? 2.5 : 0.35) * dt));
      const L = e.level;
      if (e.cover) e.cover.material.opacity = Math.min(0.94, L * 1.15) * (L > 0.04 ? 1 : 0);
      for (const sp of e.sprites) {
        const u = sp.userData; const ph = (t * (e.s.cabin ? 0.18 : 0.3) + u.ph) % 1;
        sp.position.set(e.s.x + u.ox + Math.sin(t + u.ph * 9) * 0.1, (e.s.cabin ? 1.2 : e.s.y) + ph * (e.s.cabin ? 1.4 : 1.2), e.s.z + u.oz);
        sp.scale.setScalar(u.sc * (0.7 + ph * 0.8)); sp.material.opacity = L * Math.sin(ph * PI) * (e.s.cabin ? 0.55 : 0.4);
        sp.visible = L > 0.03;
      }
    }
  }
}

// --------------------------------------------------------------------- 一位成員
class Bot {
  constructor(crew, info) {
    this.crew = crew; this.game = crew.game; this.info = info; this.key = info.key; this.title = info.title; this.kind = info.kind;
    this.avatar = new Avatar(info.key, info.look); this.actor = new Actor(this.game, this.avatar, D.work, 0, 0);
    this.actor.baseSpeed = 1.3 + rnd() * 0.35; this.gen = null; this.dt = 0.016; this.claimed = []; this.speech = null; this.mood = 'focus'; this.moodTimer = rnd() * 8;
    this.nextMoodLine = 20 + rnd() * 40; this.workStart = Date.now() - rnd() * 25 * 60000; this.sleeping = false; this.showered = false; this.shower = 0; this.inBath = false;
    this.cabin = null; this.desk = null; this.playing = false; this.convo = null; this.talkT = 0; this.greetCd = 0; this.lastChat = -999; this.state = 'init'; this.activity = '';
    this.blanket = null; this.phone = false;
  }
  get deckObj() { return this.game.ship.decks[this.actor.deck]; }
  say(text, dur = 3.4, kind = 'chat') { this.speech = { text, until: this.game.time + dur, kind }; }
  setMoodNow() { const e = this.game.envState; this.mood = this.moodForce && this.moodForce.until > Date.now() ? this.moodForce.m : this.cheerUntil > Date.now() ? 'happy' : this.hurt ? 'tired' : this.game.szAnx && !this.sleeping ? 'anxious' : computeMood(this.info, { nightF: e.nightF, dayF: e.dayF, workedMin: this.info.cat === 'work' ? (Date.now() - this.workStart) / 60000 : 0, sleeping: this.sleeping, playing: this.playing }); }
  worldPos(out = new THREE.Vector3()) { return this.avatar.group.getWorldPosition(out); }

  // ---- 佔位
  claim(p) { if (!p) return null; p.taken = this; this.claimed.push(p); return p; }
  free() { for (const p of this.claimed) if (p.taken === this) p.taken = null; this.claimed.length = 0; }
  pickPoi(deck, key, filter) {
    const list = (this.game.ship.decks[deck].pois.misc[key] || []).filter((p) => !p.taken && (!filter || filter(p)));
    return list.length ? this.claim(pick(list)) : null;
  }

  // ---- 行為基礎（generator）
  *goTo(deck, x, z, face, opts) { this.actor.routeTo(deck, x, z, { face, ...opts }); yield; while (this.actor.busy) yield; }
  *wait(s) { let t = 0; while (t < s) { t += this.dt; yield; } }
  *waitUntil(fn, max = 999) { let t = 0; while (!fn() && t < max) { t += this.dt; yield; } }
  *glide(x, z, yaw, y = 0) { this.actor.steps.push({ t: 'glide', x, z, yaw, y }); yield; while (this.actor.busy) yield; }
  pose(p, hold = null) { this.avatar.setPose(p); this.avatar.hold(hold); }
  cleanup() {
    this.free(); this.avatar.hold(null); this.avatar.group.visible = true; this.actor.clear(); this.actor.locked = false; this.actor.mode = 'walk';
    this.avatar.body.rotation.x = 0; this.avatar.setPose('stand'); this.avatar.speed = 0; this.avatar.fixedSpeed = null; this.avatar.fixedGait = null; this.playing = false;
    if (this.match) { this.match.cancel(); this.match = null; } this.targetPos = null; this.inBath = false;
    if (this.blanket) this.blanket.visible = false; this.crew.fx.setCabin(this.title, false);
    if (this.cabin) { this.cabin.bathDoor.set(true); }
    if (this.sleeping || this.avatar.robe.visible) { /* 起床：位置交給 wake 處理 */ }
    this.sleeping = false; this.actor.yOff = 0;
  }
  restart() { if (this.away) return; this.cleanup(); this.gen = this.run(); }
  /** 出海 / 返航（玩法層呼叫）：出海時從船上消失，返航時回到主甲板救生艇旁 */
  setAway(on) {
    if (!!on === !!this.away) return;
    if (on) { this.cleanup(); this.away = true; this.state = 'away'; this.activity = '出海中'; this.convo = null; this.speech = null; this.gen = (function* () { while (true) yield; })(); this.avatar.group.visible = false; }
    else {
      this.away = false; this.cleanup(); const sh = this.game.ship; const n = sh.decks[D.work].nav; const p = sh.small ? (n.nearestFree(sh.land[0] + (rnd() - 0.5) * 2, sh.land[1] + (rnd() - 0.5) * 2, 3) || sh.land) : (n.nearestFree(-19 + (rnd() - 0.5) * 6, 10.4) || [-19, 9]); this.actor.place(D.work, p[0], p[1], PI); this.avatar.group.visible = true; this.gen = this.run();
    }
  }
  *run() {
    const cat = this.info.cat; this.state = cat;
    if (cat !== 'off' && !this.wasSleeping) this.avatar.setRobe(false);
    if (this.wasSleeping) { yield* this.wake(); }
    if (cat === 'work') { this.workStart = Date.now() - rnd() * 3 * 60000; yield* this.workLoop(); }
    else if (cat === 'rest') yield* this.restLoop();
    else yield* this.offLoop();
  }
  *wake() {
    this.wasSleeping = false; const c = this.cabin;
    if (c && c.small) { this.avatar.group.visible = true; this.actor.place(0, c.door.x, c.door.z, 0); }
    else if (c) { const b = c.bed; yield* this.glide(b.x + 1.35, b.z - c.side * 1.2, b.face, 0); }
    this.avatar.setRobe(false); this.avatar.setPose('stand'); this.actor.avatar.body.rotation.x = 0; this.pose('stretch'); yield* this.wait(1.6); this.pose('stand');
    if (c) { this.actor.routeTo(0, c.door.x, c.door.z, {}); while (this.actor.busy) yield; }
  }

  // ---------------- 上班
  *workLoop() {
    const desk = this.crew.deskFor(this); this.desk = desk;
    if (desk) { yield* this.goTo(D.work, desk.x, desk.z, desk.face); }
    let nextBreak = desk ? 55 + rnd() * 70 : 4 + rnd() * 8; // 沒有桌子（小船甲板）：站著值班，很快就去做別的事（巡欄杆 / 聊天）
    while (true) {
      if (desk) { yield* this.glide(desk.x, desk.z, desk.face, 0); this.pose('type'); if (desk.screen) desk.screen.color.set(0x2a6a9a); }
      else this.pose('stand');
      let t = 0; const dur = desk ? 25 + rnd() * 45 : 6 + rnd() * 10;
      while (t < dur) {
        t += this.dt; yield;
        if (desk && rnd() < 0.0025) { this.pose('think'); yield* this.wait(3 + rnd() * 4); this.pose('type'); }
        if (this.game.crewRule && this.game.crewRule.fastBreak) t += this.dt * 6;
      }
      nextBreak -= dur;
      if (nextBreak < 0) {
        nextBreak = desk ? (this.game.envState.nightF > 0.6 ? 110 : 60) + rnd() * 80 : 6 + rnd() * 10;
        if (desk && desk.screen) desk.screen.color.set(0x15324a);
        yield* this.breakTime();
      }
    }
  }
  *breakTime() {
    const roll = rnd();
    const m = this.game.ship.decks[D.work].pois.misc;
    this.activity = '休息一下';
    if (roll < 0.28 && m.coffee) { const p = m.coffee[0]; yield* this.goTo(D.work, p.x, p.z, p.face); this.pose('drink', 'mug'); yield* this.wait(8 + rnd() * 6); }
    else if (roll < 0.5 && m.cooler) { const p = pick(m.cooler); yield* this.goTo(D.work, p.x, p.z, p.face); this.pose('drink', 'mug'); yield* this.wait(6 + rnd() * 5); }
    else if (roll < 0.66 && m.whiteboard) { const p = m.whiteboard[0]; yield* this.goTo(D.work, p.x, p.z, p.face); this.pose('think'); this.pose('stand'); yield* this.wait(8 + rnd() * 6); }
    else if (roll < 0.82) { const p = pick(m.rail); yield* this.goTo(D.work, p.x, p.z, p.face); this.pose('rail'); yield* this.wait(10 + rnd() * 8); }
    else { const p = pick(m.chat); yield* this.goTo(D.work, p.x, p.z, rnd() * 6); this.pose('stretch'); yield* this.wait(4); this.pose('chat'); yield* this.wait(8 + rnd() * 8); }
    this.pose('stand'); this.avatar.hold(null); this.free();
  }

  // ---------------- 休息
  *restLoop() {
    // 初次載入已位於休閒區就不用走
    while (true) {
      const e = this.game.envState; const night = e.nightF > 0.6;
      let opts = [];
      const partner = this.game.ship.small ? null : this.crew.findPartner(this);
      if (partner && !night) opts.push(['match', 4.2]); else if (partner) opts.push(['match', 1.5]);
      opts.push(['arcade', 1.6], ['bar', night ? 2.6 : 1.2], ['lounge', night ? 2.0 : 1.4], ['swim', night ? 0.2 : 1.5], ['tub', night ? 2.0 : 0.8], ['treadmill', 1.0], ['bench', 0.8],
        ['jog', night ? 0.2 : 1.2], ['hoop', night ? 0.2 : 1.4], ['eat', 1.1], ['chat', 2.0], ['rail', night ? 2.4 : 1.0], ['tv', 0.9], ['coffee', 0.6]);
      if (this.game.ship.small) { const sm = this.game.ship.decks[0].pois.misc; const okk = { chat: !!sm.chat.length, rail: !!sm.rail.length, eat: !!(sm.canteen && sm.canteen.length), lounge: !!(sm.lounger && sm.lounger.length) }; opts = opts.filter((o) => okk[o[0]]); if (!opts.length) opts = [['chat', 1]]; }
      const tot = opts.reduce((s, o) => s + o[1], 0); let r = rnd() * tot, act = 'chat'; for (const [n, w] of opts) { r -= w; if (r <= 0) { act = n; break; } }
      this.activity = act;
      yield* this['act_' + act](partner);
      this.pose('stand'); this.avatar.hold(null); this.free(); this.actor.yOff = 0; this.avatar.body.rotation.x = 0;
      yield* this.wait(1 + rnd() * 3);
    }
  }
  *standAt(p, pose, dur, hold) { yield* this.goTo(p.deckIdx ?? this.curDeck, p.x, p.z, p.face); this.pose(pose, hold); yield* this.wait(dur); }
  *act_arcade() { const p = this.pickPoi(D.fun, 'arcade'); if (!p) return; yield* this.goTo(D.fun, p.x, p.z, p.face); yield* this.glide(p.x, p.z, p.face); this.pose('arcade'); yield* this.wait(18 + rnd() * 24); }
  *act_bar() { const p = this.pickPoi(D.fun, 'stool'); if (!p) return; yield* this.goTo(D.fun, p.x, p.z, p.face); yield* this.glide(p.x, p.z - 0.12, p.face, 0.2); this.pose('eat', 'mug'); yield* this.wait(16 + rnd() * 20); this.actor.yOff = 0; yield* this.glide(p.x, p.z - 0.3, p.face, 0); }
  *act_lounge() { const p = this.pickPoi(D.fun, 'lounger') || this.pickPoi(D.boss, 'lounger'); if (!p) return; const dk = p.__d ?? D.fun; const deck = this.crew.findPoiDeck(p); yield* this.goTo(deck, p.x, p.z + (p.head[1] ? -p.head[1] * 1.3 : 0), p.face); const hx = p.head[0], hz = p.head[1]; yield* this.glide(p.x - hx * 0.85, p.z - hz * 0.85, yawOfDir(hx, hz), 0.42); this.pose('lounge'); yield* this.wait(22 + rnd() * 30); this.pose('stand'); yield* this.glide(p.x - hx * 1.6 + hz * 0.0, p.z - hz * 1.6, p.face, 0); }
  *act_tub() { const p = this.pickPoi(D.boss, 'tub'); if (!p) return; yield* this.goTo(D.boss, p.x - 2.7, p.z, PI / 2); yield* this.glide(p.x + (rnd() - 0.5) * 1.0, p.z + (rnd() - 0.5) * 1.2, -PI / 2 + (rnd() - 0.5), -0.18); this.pose('sit'); this.pose('eat'); yield* this.wait(20 + rnd() * 25); this.pose('stand'); yield* this.glide(p.x - 2.7, p.z, PI / 2, 0); }
  *act_swim(partner) {
    const pools = this.game.ship.decks[D.fun].pois.misc.pool; if (!pools) return; const edge = pick(pools);
    yield* this.goTo(D.fun, -17.5, 5.4, PI);
    this.pose('stand'); yield* this.wait(0.5);
    const pts = [[-18.6, 2.0], [-10.4, 2.0], [-10.4, -2.2], [-18.6, -2.2]].map(([x, z]) => ({ x, z }));
    yield* this.glide(pts[0].x, pts[0].z, PI / 2, 0.12); this.pose('swim');
    const laps = 2 + Math.floor(rnd() * 2); this.actor.mode = 'walk';
    this.actor.steps.push({ t: 'follow', pts, laps, speed: 1.0, start: 1 }); this.actor.yOffSwim = true; yield; while (this.actor.busy) { this.actor.yOff = 0.12; yield; }
    this.pose('stand'); yield* this.glide(-17.5, 5.4, PI, 0);
  }
  *act_treadmill() { const p = this.pickPoi(D.gym, 'treadmill'); if (!p) return; yield* this.goTo(D.gym, p.x, p.z, p.face); yield* this.glide(p.x, p.z, p.face); this.pose('stand'); this.avatar.gait = 'run'; this.actor.mode = 'run'; const t0 = this.game.time; const dur = 18 + rnd() * 20; this.avatar.fixedSpeed = 2.6; this.avatar.fixedGait = 'run'; while (this.game.time - t0 < dur) yield; this.avatar.fixedSpeed = null; this.avatar.fixedGait = null; this.avatar.speed = 0; this.actor.mode = 'walk'; this.actor.speed = 0; }
  *act_bench() { const p = this.pickPoi(D.gym, 'bench'); if (!p) return; yield* this.goTo(D.gym, p.x, p.z + 1.3, p.face + PI); yield* this.glide(p.x, p.z + 1.0, PI, 0); this.pose('lift'); yield* this.wait(16 + rnd() * 18); }
  *act_jog() { const tr = this.game.ship.decks[D.gym].pois.track; if (!tr) return; let bi = 0, bd = 1e9; tr.forEach((q, i) => { const d = Math.hypot(q.x - this.actor.x, q.z - this.actor.z); if (d < bd) { bd = d; bi = i; } }); yield* this.goTo(D.gym, tr[(bi + 4) % tr.length].x, tr[(bi + 4) % tr.length].z, 0, {}); this.actor.mode = 'run'; this.actor.steps.push({ t: 'follow', pts: tr, laps: 1 + rnd() * 1.4, speed: 2.8, start: (bi + 4) % tr.length }); yield; while (this.actor.busy) yield; this.actor.mode = 'walk'; this.pose('stand'); yield* this.wait(3); }
  *act_hoop() {
    const h = this.game.ship.decks[D.gym].pois.misc.hoop; if (!h) return; const p = h[0]; const ball = this.crew.getBall(D.gym);
    yield* this.goTo(D.gym, p.x, p.z, p.face); this.avatar.hold('ball'); ball.visible = false; const n = 4 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      this.pose('stand'); yield* this.wait(1.2 + rnd()); this.pose('shoot'); yield* this.wait(0.45);
      this.avatar.hold(null); ball.visible = true; const hoop = p.hoop; const t0 = this.game.time; const T = 1.15; const sx = this.actor.x, sz = this.actor.z; const miss = chance(0.4);
      while (this.game.time - t0 < T) { const u = (this.game.time - t0) / T; const ex = hoop.x - (miss ? 0.5 : 0), ez = hoop.z + (miss ? 0.3 : 0); ball.position.set(sx + (ex - sx) * u, 2.05 + (hoop.y - 2.05) * u + 4 * 1.3 * u * (1 - u), sz + (ez - sz) * u); yield; }
      const t1 = this.game.time; while (this.game.time - t1 < 0.55) { const u = (this.game.time - t1) / 0.55; ball.position.y = hoop.y * (1 - u * u) + 0.12; ball.position.x += (miss ? 0.8 : 0.0) * this.dt; yield; }
      this.pose('stand'); ball.visible = false; this.avatar.hold('ball'); if (!miss) this.say('進！', 1.8, 'chat'); else if (chance(0.5)) this.say('可惜…', 1.8, 'chat');
    }
    this.avatar.hold(null); ball.visible = false;
  }
  *act_eat() { const p = this.pickPoi(D.cabin, 'canteen'); if (!p) return; yield* this.goTo(D.cabin, p.x, p.z, p.face); yield* this.glide(p.x, p.z, p.face); this.pose('eat'); yield* this.wait(18 + rnd() * 16); this.pose('stand'); }
  *act_chat() { const up = this.game.ship.decks.slice(5).map((x) => x.index); const p = pick(['fun', 'cabin', 'work', 'fun', 'gym', ...up.map((_, i) => 'up' + i)].map((k) => k)); const deck = /^up/.test(p) ? up[+p.slice(2)] : { fun: D.fun, cabin: D.cabin, work: D.work, gym: D.gym }[p]; const list = this.game.ship.decks[deck].pois.misc.chat; if (!list || !list.length) return; const q = list.find((c) => !c.taken) || pick(list); this.claim(q); yield* this.goTo(deck, q.x, q.z, rnd() * 6); this.pose('chat'); this.avatar.talk = 0.3; yield* this.wait(14 + rnd() * 16); }
  *act_rail() { const dk = pick([D.fun, D.cabin, D.work, D.gym, ...this.game.ship.decks.slice(5).map((x) => x.index)]); const list = this.game.ship.decks[dk].pois.misc.rail; if (!list) return; const q = pick(list); yield* this.goTo(dk, q.x, q.z, q.face); this.pose('rail'); yield* this.wait(14 + rnd() * 18); }
  *act_tv() { yield* this.goTo(D.work, 27.7, rnd() < 0.5 ? -1.2 : 1.2, -PI / 2); this.pose('stand'); this.avatar.talk = 0; yield* this.wait(14 + rnd() * 14); }
  *act_coffee() { const p = this.game.ship.decks[D.work].pois.misc.coffee; if (!p) return; yield* this.goTo(D.work, p[0].x, p[0].z, p[0].face); this.pose('drink', 'mug'); yield* this.wait(10); }
  *act_match(partner) {
    // 這個 bot 是邀請者
    if (!partner || partner.info.cat !== 'rest' || partner.match || partner.state === 'init') return;
    if (this.crew.social && this.crew.social.s && !this.crew.social.invite(this, partner)) { yield* this.wait(3); return; }
    const kinds = []; const gy = this.game.ship.decks[D.gym].pois;
    const tables = (gy.misc.pingpong || []).filter((t) => !t.taken); if (tables.length) kinds.push('pp'); if (gy.pickle && !gy.pickle.taken) kinds.push('pk');
    if (!kinds.length) return; const kind = pick(kinds); const fac = kind === 'pp' ? pick(tables) : gy.pickle; fac.taken = this;
    const m = new Match(this.crew, kind, D.gym, fac, this, partner); this.crew.matches.push(m);
    partner.match = m; this.match = m; partner.matchRole = 'b'; partner.joinMatch(m);
    yield* this.playMatch(m, 'a');
    fac.taken = null; if (this.crew.social && this.crew.social.s) this.crew.social.afterMatch(this, partner, m);
  }
  joinMatch(m) { this.interrupt(function* (b) { yield* b.playMatch(m, 'b'); }); }
  *playMatch(m, role) {
    this.match = m; this.playing = true; const st = role === 'a' ? m.pos.a : m.pos.b;
    this.actor.mode = 'walk'; yield* this.goTo(D.gym, st.x, st.z, st.face);
    this.avatar.hold('racket'); this.pose('swing'); this.actor.x = st.x; this.actor.z = st.z; this.actor.yaw = st.face;
    m.markReady(this); this.info.matchFrom = this.game.time;
    yield* this.waitUntil(() => m.done, 400);
    this.avatar.hold(null); this.playing = false; this.match = null; this.pose('wave'); yield* this.wait(1.8); this.pose('stand');
    if (role === 'a' || rnd() < 0.5) this.say(pick(['打得真過癮！', '下次我會贏你。', '好久沒這麼痛快了！', '喝杯水休息一下。']), 3);
  }
  interrupt(genFn) { this.cleanup(); this.gen = (function* (b) { yield* genFn(b); b.restartAfter = true; })(this); }

  // ---------------- 下班
  *offLoop() {
    const c = this.crew.cabinFor(this); this.cabin = c;
    if (!c) { // 沒有寢室：躺椅休息
      const p = this.pickPoi(D.fun, 'lounger'); if (p) { yield* this.goTo(D.fun, p.x, p.z - p.head[1] * 1.3, p.face); const hx = p.head[0], hz = p.head[1]; yield* this.glide(p.x - hx * 0.85, p.z - hz * 0.85, yawOfDir(hx, hz), 0.42); this.pose('lounge'); this.sleeping = true; while (true) yield; }
      return;
    }
    this.activity = '下班';
    yield* this.goTo(D.cabin, c.door.x, c.door.z, 0);
    if (c.small) { this.enterBed(c, true); this.activity = '睡覺'; while (true) yield; }
    if (!this.showered || rnd() < 0.15) yield* this.takeShower(c);
    yield* this.goBed(c);
    while (true) yield;
  }
  *takeShower(c) {
    this.activity = '洗澡';
    yield* this.goTo(D.cabin, c.bathOut.x, c.bathOut.z, PI / 2);
    c.bathDoor.set(true); yield* this.waitUntil(() => c.bathDoor.opened(), 3);
    this.actor.steps.push({ t: 'direct', x: c.bathIn.x, z: c.bathIn.z }); yield; while (this.actor.busy) yield;
    this.actor.yaw = PI / 2 * 1; yield* this.wait(0.5);
    c.bathDoor.set(false); yield* this.waitUntil(() => c.bathDoor.closed(), 3);
    this.avatar.group.visible = false; this.inBath = true; this.crew.fx.setCabin(this.title, true);
    yield* this.wait(12 + rnd() * 8);
    this.crew.fx.setCabin(this.title, false);
    this.avatar.setRobe(true); this.avatar.group.visible = true; this.inBath = false; this.pose('stand'); this.actor.x = c.bathIn.x; this.actor.z = c.bathIn.z;
    c.bathDoor.set(true); yield* this.waitUntil(() => c.bathDoor.opened(), 3);
    this.actor.steps.push({ t: 'direct', x: c.bathOut.x, z: c.bathOut.z }); yield; while (this.actor.busy) yield;
    this.showered = true; this.say(pick(['洗完澡好舒服～', '呼，清爽！', '準備睡覺了。']), 3);
    this.pose('stretch'); yield* this.wait(1.4); this.pose('stand');
  }
  *goBed(c) {
    const b = c.bed; this.activity = '睡覺';
    yield* this.goTo(D.cabin, b.x + 1.35, b.z - c.side * 1.2, b.face);
    this.enterBed(c, true);
  }
  enterBed(c, anim) {
    if (c.small) { this.sleeping = true; this.wasSleeping = true; this.actor.steps.length = 0; this.actor.cur = null; this.actor.place(0, c.door.x, c.door.z, 0); this.pose('stand'); this.avatar.group.visible = false; return; }
    const b = c.bed, s = c.side; const hx = 0, hz = s;
    this.sleeping = true; this.wasSleeping = true; this.pose('lie'); this.avatar.group.visible = true;
    this.actor.steps.length = 0; this.actor.cur = null; this.actor.place(D.cabin, b.x, b.z - hz * 0.8, yawOfDir(hx, hz)); this.actor.yOff = 0.7;
    if (!this.blanket) { const m = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.14, 1.15), new THREE.MeshStandardMaterial({ color: this.avatar.look.shirt, roughness: 0.95 })); m.castShadow = true; this.game.ship.decks[D.cabin].group.add(m); this.blanket = m; }
    this.blanket.position.set(b.x, 0.9, b.z - hz * 0.38); this.blanket.visible = true;
  }
}

// --------------------------------------------------------------------- 全員管理
export class Crew {
  constructor(game) {
    this.game = game; this.bots = new Map(); this.matches = []; this.fx = new SteamFX(game.ship); this.balls = {}; this.chatT = 1; this.pairCd = new Map();
    this.deskUsed = new Set(); this.deskExtra = 0; this.cabinUsed = new Set();
    this.onHit = () => {}; this.onPoint = (m) => { const w = m.score; if (rnd() < 0.5) (rnd() < 0.5 ? m.a : m.b).say(pick(['好球！', '漂亮！', '再來一局？', '這分算我的！']), 2.4); };
    // 預設一組 T董 的專屬暱稱，供 UI 使用
  }
  getBall(deck) {
    if (!this.balls[deck]) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), new THREE.MeshStandardMaterial({ color: 0xd9732b, roughness: 0.8 })); m.castShadow = true; m.visible = false; this.game.ship.decks[deck].group.add(m); this.balls[deck] = m; }
    return this.balls[deck];
  }
  findPoiDeck(p) { for (const d of this.game.ship.decks) for (const k in d.pois.misc) { const l = d.pois.misc[k]; if (Array.isArray(l) && l.includes(p)) return d.index; } return D.fun; }
  deskFor(bot) {
    const d = this.game.ship.decks[D.work].pois;
    let dk = d.desks.find((x) => x.key === bot.key); if (dk) return dk;
    const free = d.extraDesks.find((x) => !this.deskUsed.has(x.key)); if (free) { this.deskUsed.add(free.key); return free; }
    return null;
  }
  cabinFor(bot) {
    const sh = this.game.ship; if (sh.small) { const d = sh.door; const nop = () => true; return { small: true, title: bot.title, door: { x: d[0], z: d[1] }, bed: { x: d[0], z: d[1], face: 0 }, side: 1, bathDoor: { set() {}, opened: nop, closed: nop }, bathOut: { x: d[0], z: d[1] }, bathIn: { x: d[0], z: d[1] }, corridor: { x: d[0], z: d[1] } }; }
    return sh.decks[D.cabin].pois.cabins[bot.key] || null;
  }
  findPartner(bot) {
    const c = [...this.bots.values()].filter((o) => o !== bot && o.info.cat === 'rest' && !o.match && !o.playing && o.state === 'rest' && (o.activity !== 'swim') && !(o.sceneUntil > this.game.time));
    if (!c.length) return null; if (!this.social || !this.social.s) return pick(c);
    const w = c.map((o) => this.social.partnerWeight(bot, o)); const tot = w.reduce((a, b) => a + b, 0); if (tot <= 0) return null; let r = rnd() * tot; for (let i = 0; i < c.length; i++) { r -= w[i]; if (r <= 0) return c[i]; } return c[c.length - 1];
  }
  applyData(data) {
    this.data = data; this.arena = data.arena;
    if (data.arena) this.game.tv.setArena(data.arena);
    const seen = new Set();
    for (const info of data.crew) {
      seen.add(info.key); let b = this.bots.get(info.key);
      if (!b) { b = new Bot(this, info); this.bots.set(info.key, b); this.spawn(b); }
      else { const changed = b.info.cat !== info.cat; b.info = info; if (changed && !b.away) { b.restart(); } }
    }
    for (const [k, b] of this.bots) if (!seen.has(k)) { b.cleanup(); b.avatar.group.removeFromParent(); this.bots.delete(k); }
    emit('crew', [...this.bots.values()]);
  }
  /** 載入時依狀態直接把人放到合理位置（不用走過來）。 */
  spawn(b) {
    const info = b.info; const ship = this.game.ship; b.state = info.cat; b.setMoodNow();
    if (info.cat === 'work') { const dk = this.deskFor(b); b.desk = dk; if (dk) { b.actor.place(D.work, dk.x, dk.z, dk.face); b.pose('type'); if (dk.screen) dk.screen.color.set(0x2a6a9a); } else { const sm = ship.decks[D.work].pois.misc.chat; const p0 = sm && sm.length ? pick(sm) : { x: 0, z: 0 }; const q = ship.decks[D.work].nav.nearestFree(p0.x + (rnd() - 0.5) * 2, p0.z + (rnd() - 0.5) * 2, 3) || [p0.x, p0.z]; b.actor.place(D.work, q[0], q[1], rnd() * 6); b.pose('stand'); } b.gen = b.run(); }
    else if (info.cat === 'rest') {
      const p = pick(ship.decks[D.fun].pois.misc.chat); b.actor.place(D.fun, p.x + (rnd() - 0.5) * 3, p.z + (rnd() - 0.5) * 3, rnd() * 6); b.pose('stand'); b.gen = b.run();
    } else {
      const c = this.cabinFor(b); b.cabin = c;
      if (c) { b.showered = true; b.avatar.setRobe(true); b.enterBed(c); b.state = 'off'; b.gen = (function* () { while (true) yield; })(); }
      else b.gen = b.run();
    }
  }
  update(dt, time) {
    for (const b of this.bots.values()) {
      b.dt = dt;
      if (b.gen) { const r = b.gen.next(); if (r.done) { b.gen = null; if (b.restartAfter) { b.restartAfter = false; b.restart(); } } }
      b.actor.update(dt); b.avatar.update(dt, time);
      b.avatar.talk += ((b.convo ? 1 : (b.avatar.talk > 0.3 ? 0.3 : 0)) - b.avatar.talk) * Math.min(1, dt * 4);
      // 心情
      b.moodTimer -= dt; if (b.moodTimer <= 0) { b.moodTimer = 4; b.setMoodNow(); }
      b.nextMoodLine -= dt;
      if (b.nextMoodLine <= 0) { b.nextMoodLine = 45 + rnd() * 75; if (!b.speech || b.speech.until < time) { if (!b.inBath) b.say((this.social && this.social.s && rnd() < 0.3 && this.social.moodLine(b)) || moodLine(b.mood, b.info, this.game.envState), 4.5, 'mood'); } }
      if (b.speech && b.speech.until < time) b.speech = null;
      if (b.greetCd > 0) b.greetCd -= dt;
    }
    for (let i = this.matches.length - 1; i >= 0; i--) { const m = this.matches[i]; m.update(dt); if (m.done) this.matches.splice(i, 1); }
    this.fx.update(dt, time);
    this.updateChat(dt, time); this.updateGreet(time);
  }
  // ---- 閒聊
  updateChat(dt, time) {
    this.chatT -= dt; if (this.chatT > 0) return; this.chatT = 1.2;
    const bots = [...this.bots.values()].filter((b) => !b.away && !b.sleeping && !b.inBath && b.actor.speed < 0.3 && !b.convo && b.state !== 'init' && !(b.actor.cur && b.actor.cur.t === 'stair') && !b.actor.inCar);
    for (let i = 0; i < bots.length; i++) for (let j = i + 1; j < bots.length; j++) {
      const a = bots[i], b = bots[j]; if (a.actor.deck !== b.actor.deck) continue;
      const dist = Math.hypot(a.actor.x - b.actor.x, a.actor.z - b.actor.z); const maxD = a.info.cat === 'work' && b.info.cat === 'work' ? 6.8 : 4.2; if (dist > maxD) continue;
      const key = a.key < b.key ? a.key + '|' + b.key : b.key + '|' + a.key; const cd = this.pairCd.get(key) || 0; if (time < cd) continue;
      const traders = a.kind === 'trader' && b.kind === 'trader';
      const p = traders ? 0.45 : a.info.cat === 'work' && b.info.cat === 'work' ? 0.1 : 0.3;
      this.pairCd.set(key, time + (traders ? 40 : 70) + rnd() * 50);
      if (rnd() > p) continue;
      if (a.playing || b.playing) { // 球場邊的加油聲由 Match 處理
        continue;
      }
      const mode = a.info.cat === 'work' && b.info.cat === 'work' ? 'work' : 'leisure';
      this.startConvo(a, b, (this.social && this.social.s && this.social.convLines(a, b)) || pickConversation(a.info, b.info, this.game.envState, this.arena, mode));
    }
    // 球賽中的對話
    for (const m of this.matches) if (m.state === 'play' && rnd() < 0.18) { const s = rnd() < 0.5 ? m.a : m.b; if (!s.convo && (!s.speech || s.speech.kind !== 'chat')) s.say(pick(['好球！', '這球好刁！', '我發球～', '手感來了！', '不錯喔！', '差一點！', '換你發球。', '漂亮！']), 2.2); }
  }
  startConvo(a, b, lines) {
    const speakers = [a, b]; a.convo = b.convo = { t: 0 };
    const stand = (x) => x.actor.avatar.poseName === 'stand' || x.actor.avatar.poseName === 'chat';
    if (stand(a) && !a.actor.busy) { a.actor.yaw = Math.atan2(b.actor.x - a.actor.x, b.actor.z - a.actor.z); }
    if (stand(b) && !b.actor.busy) { b.actor.yaw = Math.atan2(a.actor.x - b.actor.x, a.actor.z - b.actor.z); }
    if (a.avatar.poseName === 'stand') a.avatar.setPose('chat'); if (b.avatar.poseName === 'stand') b.avatar.setPose('chat');
    const gap = 3.4; lines.forEach((ln, i) => setTimeout(() => { const s = speakers[i % 2]; if (!s.sleeping && !s.inBath && s.convo) { s.say(ln, 3.2, 'chat'); } if (i === lines.length - 1) { setTimeout(() => { a.convo = b.convo = null; if (a.avatar.poseName === 'chat' && a.state !== 'x') { /* 保持 */ } }, 2500); } }, i * gap * 1000));
  }
  // ---- T董靠近打招呼
  updateGreet(time) {
    const pl = this.game.player; if (!pl) return;
    for (const b of this.bots.values()) {
      if (b.away || b.actor.deck !== pl.actor.deck || b.greetCd > 0 || b.sleeping || b.inBath || b.convo) continue;
      const d = Math.hypot(b.actor.x - pl.actor.x, b.actor.z - pl.actor.z);
      if (d < 2.6 && pl.actor.speed < 3) {
        b.greetCd = 90 + rnd() * 60; b.say(greeting(this.game.phaseKey, this.game.owner), 3.4, 'greet');
        if (b.avatar.poseName === 'stand' && !b.actor.busy) { b.actor.yaw = Math.atan2(pl.actor.x - b.actor.x, pl.actor.z - b.actor.z); b.avatar.setPose('wave'); setTimeout(() => { if (b.avatar.poseName === 'wave') b.avatar.setPose('stand'); }, 2200); }
      }
    }
  }
}
