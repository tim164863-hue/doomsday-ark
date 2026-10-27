import * as THREE from 'three';
import { pick, rand } from '../util.js';

/** 雙人對打：乒乓 / 匹克球。球真的在兩人之間飛，擊球時揮拍。 */
const ballGeo = { pp: new THREE.SphereGeometry(0.04, 10, 8), pk: new THREE.SphereGeometry(0.075, 12, 8) };
export class Match {
  constructor(crew, kind, deckIdx, fac, a, b) {
    this.crew = crew; this.kind = kind; this.deck = deckIdx; this.fac = fac; this.a = a; this.b = b; this.state = 'gather'; this.done = false; this.t = 0;
    this.dur = rand(55, 100); this.age = 0; this.hitter = a; this.rally = 0; this.rallyMax = 0; this.pause = 0; this.flight = null; this.score = [0, 0];
    this.ball = new THREE.Mesh(ballGeo[kind === 'pp' ? 'pp' : 'pk'], new THREE.MeshStandardMaterial({ color: kind === 'pp' ? 0xffffff : 0xe8f04a, roughness: 0.5 }));
    this.ball.castShadow = true; this.ball.visible = false; crew.game.ship.decks[deckIdx].group.add(this.ball);
    // 站位
    this.pos = kind === 'pp' ? { a: { ...fac.a }, b: { ...fac.b } } : { a: { ...fac.a }, b: { ...fac.b } };
    this.sideA = kind === 'pp' ? 1 : 1; this.cur = { a: { x: this.pos.a.x, z: this.pos.a.z }, b: { x: this.pos.b.x, z: this.pos.b.z } };
    this.ready = new Set(); this.sync();
  }
  sync() { this.faceA = this.pos.a.face; this.faceB = this.pos.b.face; }
  stationOf(bot) { return bot === this.a ? this.pos.a : this.pos.b; }
  markReady(bot) { this.ready.add(bot); if (this.ready.size === 2 && this.state === 'gather') { this.state = 'play'; this.serve(this.a); } }
  serve(h) {
    this.hitter = h; this.rally = 0; this.rallyMax = 6 + Math.floor(Math.random() * 14); this.launch();
  }
  launch() {
    const h = this.hitter, r = h === this.a ? this.b : this.a; const ph = h === this.a ? this.cur.a : this.cur.b;
    const spread = this.kind === 'pp' ? 0.45 : 1.6; const tz = (h === this.a ? this.pos.b.z : this.pos.a.z) + rand(-spread, spread);
    const tx = (h === this.a ? this.pos.b.x : this.pos.a.x) + (this.kind === 'pk' ? rand(-0.8, 0.8) : 0);
    const y0 = this.kind === 'pp' ? 1.0 : 0.95;
    const hold = this.kind === 'pp' ? 0.7 : 1.1;
    this.flight = { t: 0, T: this.kind === 'pp' ? rand(0.5, 0.7) : rand(0.9, 1.25), from: { x: ph.x + Math.sin(h.actor.yaw) * 0.4, y: y0, z: ph.z + Math.cos(h.actor.yaw) * 0.4 }, to: { x: tx, z: tz }, H: this.kind === 'pp' ? 0.35 : 0.95, hit: false };
    r.targetPos = { x: tx, z: tz }; h.avatarSwing = true; h.actor.avatar.swing();
    this.ball.visible = true;
  }
  cancel() { this.done = true; if (this.fac) this.fac.taken = null; this.ball.visible = false; this.ball.removeFromParent(); }
  update(dt) {
    if (this.done) return;
    this.age += dt;
    // 球員位置微幅移動，追球
    for (const [bot, key] of [[this.a, 'a'], [this.b, 'b']]) {
      if (!bot.actor || this.state === 'gather') continue; const st = this.pos[key], cur = this.cur[key];
      let tz = st.z, tx = st.x; if (bot.targetPos) { tz = Math.max(st.z - (this.kind === 'pk' ? 2.2 : 0.5), Math.min(st.z + (this.kind === 'pk' ? 2.2 : 0.5), bot.targetPos.z)); if (this.kind === 'pk') tx = st.x + Math.max(-0.8, Math.min(0.8, (bot.targetPos.x - st.x) * 0.3)); }
      cur.z += (tz - cur.z) * Math.min(1, dt * 4); cur.x += (tx - cur.x) * Math.min(1, dt * 3);
      bot.actor.x = cur.x; bot.actor.z = cur.z; bot.actor.yaw = key === 'a' ? this.faceA : this.faceB;
    }
    if (this.state !== 'play') return;
    if (this.pause > 0) { this.pause -= dt; if (this.pause <= 0) { if (this.age > this.dur) { this.finish(); return; } this.serve(Math.random() < 0.5 ? this.a : this.b); } return; }
    const f = this.flight; if (!f) return; f.t += dt; const u = Math.min(1, f.t / f.T);
    const x = f.from.x + (f.to.x - f.from.x) * u, z = f.from.z + (f.to.z - f.from.z) * u; const y = f.from.y + (1.0 - f.from.y) * u + 4 * f.H * u * (1 - u);
    this.ball.position.set(x, y, z);
    const recv = this.hitter === this.a ? this.b : this.a;
    if (!f.hit && f.T - f.t < 0.22) { f.hit = true; recv.actor.avatar.swing(); }
    if (u >= 1) {
      this.rally++; this.crew.onHit && this.crew.onHit(this);
      if (this.rally >= this.rallyMax || Math.random() < 0.04) { this.score[recv === this.a ? 1 : 0]++; this.ball.visible = false; this.flight = null; this.pause = rand(1.5, 2.6); this.crew.onPoint && this.crew.onPoint(this); }
      else { this.hitter = recv; this.launch(); }
    }
  }
  finish() { this.done = true; if (this.fac) this.fac.taken = null; this.ball.visible = false; this.ball.removeFromParent(); }
}
