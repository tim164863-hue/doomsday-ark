import { STAIR, ELEV, DH, laneCenterZ } from '../ship/ship.js';
import { angDiff, dampAngle, clamp } from '../util.js';

/** 舞台上的行動者（員工 / T董）：負責跨層路徑、樓梯、電梯與座位吸附。 */
export const stairEntry = (k, dir) => (dir > 0 ? { x: STAIR.upTrig, z: laneCenterZ(k) } : { x: STAIR.downTrig, z: laneCenterZ(k) });
export const ELEV_PORTAL = { x: ELEV.cx, z: ELEV.portalZ };

export class Actor {
  constructor(game, avatar, deckIndex = 0, x = 0, z = 0) {
    this.game = game; this.ship = game.ship; this.avatar = avatar;
    this.deck = deckIndex; this.x = x; this.z = z; this.yaw = 0; this.yOff = 0;
    this.speed = 0; this.baseSpeed = 1.45; this.steps = []; this.cur = null; this.path = null; this.pi = 0;
    this.locked = false; this.hidden = false; this.mode = 'walk'; this.snapTo = null;
    this.place(deckIndex, x, z, 0);
  }
  get deckObj() { return this.ship.decks[this.deck]; }
  get nav() { return this.deckObj.nav; }
  get busy() { return !!this.cur || this.steps.length > 0; }
  place(deck, x, z, yaw = this.yaw) {
    if (deck !== this.deck || !this.avatar.group.parent) { this.deck = deck; this.ship.decks[deck].group.add(this.avatar.group); }
    this.x = x; this.z = z; this.yaw = yaw; this.yOff = 0; this.sync();
  }
  sync() { const g = this.avatar.group; g.position.set(this.x, this.yOff, this.z); g.rotation.y = this.yaw; }
  reparent(deck) { this.deck = deck; this.ship.decks[deck].group.add(this.avatar.group); }
  clear() { this.steps.length = 0; this.cur = null; this.path = null; this.speed = 0; if (this.elevHeld) this.releaseElev(); }
  releaseElev() { if (this.ship.elevLock === this) this.ship.elevLock = null; this.elevHeld = false; }

  /** 規劃：從目前位置到 (deck,x,z)。 */
  routeTo(deck, x, z, opts = {}) {
    this.clear(); this.mode = opts.run ? 'run' : 'walk'; this.speedMul = opts.speedMul || 1;
    let d = this.deck; const steps = [];
    if (d !== deck) {
      const useElev = opts.elevator ?? (Math.abs(deck - d) >= 3 && !this.ship.elevLock && Math.random() < 0.5);
      if (useElev) {
        steps.push({ t: 'walk', deck: d, x: ELEV_PORTAL.x, z: ELEV_PORTAL.z }); steps.push({ t: 'elev', from: d, to: deck }); d = deck;
      } else while (d !== deck) {
        const dir = deck > d ? 1 : -1; const k = dir > 0 ? d : d - 1; const e = stairEntry(k, dir);
        steps.push({ t: 'walk', deck: d, x: e.x, z: e.z }); steps.push({ t: 'stair', k, dir }); d += dir;
      }
    }
    steps.push({ t: 'walk', deck, x, z, final: true });
    this.steps = steps; this.arrivedFace = opts.face;
  }
  /** 直接指定一串自訂步驟 */
  queue(step) { this.steps.push(step); }

  next() { this.cur = this.steps.shift() || null; this.path = null; if (this.cur) this.begin(this.cur); }
  begin(s) {
    if (s.t === 'walk') {
      const nav = this.ship.decks[s.deck].nav;
      let p = nav.findPath(this.x, this.z, s.x, s.z);
      if (!p) { p = [[s.x, s.z]]; s.fallback = true; }
      this.path = p; this.pi = 0;
    } else if (s.t === 'stair') {
      s.p = 0; s.len = (STAIR.x1 - STAIR.x0 + 1.6) * 0.95; this.reparent(s.dir > 0 ? s.k : s.k); // 樓梯在下層 group 裡
      this.yOff = s.dir > 0 ? 0 : DH + this.ship.explode;
      this.yaw = s.dir > 0 ? Math.PI / 2 : -Math.PI / 2; this.z = laneCenterZ(s.k);
    } else if (s.t === 'elev') { if (s.phase === undefined) s.phase = 0; }
    else if (s.t === 'direct') { s.sx = this.x; s.sz = this.z; }
  }
  speedNow() { return (this.baseSpeed * (this.mode === 'run' ? 2.3 : 1)) * (this.speedMul || 1); }

  update(dt) {
    if (this.locked) { this.speed = 0; this.sync(); return; }
    if (!this.cur) { if (this.steps.length) this.next(); }
    const s = this.cur; let moved = 0;
    if (s) {
      if (s.t === 'walk') {
        const deckNav = this.ship.decks[this.deck].nav;
        const tgt = this.path[this.pi]; if (!tgt) { this.finishStep(); }
        else {
          const dx = tgt[0] - this.x, dz = tgt[1] - this.z, dist = Math.hypot(dx, dz); const sp = this.speedNow();
          const adv = Math.min(dist, sp * dt);
          if (dist < 0.08) { this.pi++; if (this.pi >= this.path.length) this.finishStep(); }
          else {
            const nx = this.x + dx / dist * adv, nz = this.z + dz / dist * adv;
            if (s.fallback) { this.x = nx; this.z = nz; } else { const r = deckNav.move(this.x, this.z, nx - this.x, nz - this.z, 0.26); this.x = r[0]; this.z = r[1]; if (Math.hypot(r[0] - nx, r[1] - nz) > 0.001) { s.stuck = (s.stuck || 0) + dt; if (s.stuck > 1.5) { this.pi++; s.stuck = 0; if (this.pi >= this.path.length) this.finishStep(); } } else s.stuck = 0; }
            this.yaw = dampAngle(this.yaw, Math.atan2(dx, dz), 12, dt); moved = adv / dt;
          }
        }
      } else if (s.t === 'stair') {
        const sp = (this.mode === 'run' ? 2.4 : 1.5) * (this.speedMul || 1); s.p += dt * sp / s.len * 1.0; const p = clamp(s.p, 0, 1);
        const ex = this.ship.explode, H = DH + ex;
        const ps = s.dir > 0 ? p : 1 - p;
        this.x = (s.dir > 0 ? STAIR.upTrig : STAIR.downTrig) + (s.dir > 0 ? 1 : -1) * 0; // base
        const x0 = s.dir > 0 ? STAIR.upTrig : STAIR.arrive - 1.0, x1 = s.dir > 0 ? STAIR.arrive : STAIR.bottom + 0.0;
        this.x = x0 + (x1 - x0) * p; this.yOff = H * clamp((this.x - STAIR.x0) / (STAIR.x1 - STAIR.x0), 0, 1); this.z = laneCenterZ(s.k); moved = sp * 1.2;
        this.avatar.stairLean = 0.12;
        if (s.p >= 1) { this.avatar.stairLean = 0; const nd = s.k + (s.dir > 0 ? 1 : 0); this.reparent(nd); this.yOff = 0; this.x = s.dir > 0 ? STAIR.arrive : STAIR.bottom; this.finishStep(); }
      } else if (s.t === 'elev') { moved = this.updateElev(s, dt); }
      else if (s.t === 'direct') {
        const dx = s.x - this.x, dz = s.z - this.z, dist = Math.hypot(dx, dz), adv = Math.min(dist, 1.4 * dt);
        if (dist < 0.03) this.finishStep(); else { this.x += dx / dist * adv; this.z += dz / dist * adv; this.yaw = dampAngle(this.yaw, Math.atan2(dx, dz), 12, dt); moved = 1.4; }
      } else if (s.t === 'follow') {
        const pts = s.pts; const n = pts.length; s.i = s.i ?? s.start ?? 0; const tgt = pts[s.i % n]; const dx = tgt.x - this.x, dz = tgt.z - this.z, dist = Math.hypot(dx, dz); const sp = s.speed || 3.0;
        if (dist < 0.3) { s.i++; s.count = (s.count || 0) + 1; if (s.count >= n * s.laps) this.finishStep(); } else { const adv = Math.min(dist, sp * dt); this.x += dx / dist * adv; this.z += dz / dist * adv; this.yaw = dampAngle(this.yaw, Math.atan2(dx, dz), 8, dt); moved = sp; }
      } else if (s.t === 'glide') { // 吸附到精確姿態
        s.t0 = (s.t0 || 0) + dt; const k = 1 - Math.exp(-10 * dt); this.x += (s.x - this.x) * k; this.z += (s.z - this.z) * k; this.yaw = dampAngle(this.yaw, s.yaw, 12, dt); this.yOff += ((s.y || 0) - this.yOff) * k;
        if (s.t0 > 0.35) { this.x = s.x; this.z = s.z; this.yaw = s.yaw; this.yOff = s.y || 0; this.finishStep(); }
      }
    }
    this.speed += (moved - this.speed) * (1 - Math.exp(-14 * dt)); this.avatar.speed = this.avatar.fixedSpeed ?? this.speed; this.avatar.gait = this.avatar.fixedGait || (this.mode === 'run' ? 'run' : 'walk');
    this.sync();
  }
  finishStep() {
    const s = this.cur; this.cur = null; this.path = null;
    if (s && s.final && this.arrivedFace !== undefined) { this.steps.unshift({ t: 'glide', x: this.x, z: this.z, yaw: this.arrivedFace, y: 0 }); }
    if (s && s.onDone) s.onDone();
    if (this.steps.length) this.next();
    else if (s) { this.speed = 0; this.mode = 'walk'; }
  }
  updateElev(s, dt) {
    const ship = this.ship; const A = ELEV;
    if (s.phase === 0) { // 叫車
      if (ship.elevLock && ship.elevLock !== this) return 0;
      ship.elevLock = this; this.elevHeld = true; ship.carTarget = s.from; s.phase = 1; return 0;
    }
    if (s.phase === 1) { if (Math.abs(ship.carPos - s.from) < 0.02) { s.phase = 2; const me = this.cur; this.steps.unshift(me); this.steps.unshift({ t: 'direct', x: A.cx, z: A.cz + 0.45 }); this.cur = null; this.next(); } return 0; }
    if (s.phase === 2) { // 已走進車廂
      this.avatar.group.removeFromParent(); ship.car.add(this.avatar.group); this.inCar = true;
      this.carLocal = { x: this.x - A.cx, z: this.z - A.cz }; s.phase = 3; ship.carTarget = s.to; this.yaw = 0; return 0;
    }
    if (s.phase === 3) {
      this.avatar.group.position.set(this.carLocal.x, 0.06, this.carLocal.z); this.avatar.group.rotation.y = 0;
      if (Math.abs(ship.carPos - s.to) < 0.02) { this.inCar = false; this.reparent(s.to); this.x = A.cx + this.carLocal.x; this.z = A.cz + this.carLocal.z; this.yOff = 0; this.yaw = 0; s.phase = 4; const me = this.cur; this.steps.unshift(me); this.steps.unshift({ t: 'direct', x: ELEV_PORTAL.x, z: ELEV_PORTAL.z }); this.cur = null; this.releaseElev(); this.next(); }
      return 0;
    }
    if (s.phase === 4) { this.finishStep(); }
    return 0;
  }
}
