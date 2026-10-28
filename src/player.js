import * as THREE from 'three';
import { Avatar } from './crew/avatar.js';
import { Actor, ELEV_PORTAL } from './crew/actor.js';
import { STAIR, laneCenterZ } from './ship/ship.js';
import { emit } from './events.js';
import { dampAngle } from './util.js';
import { D } from './crew/decks.js';
import { charById, lookOf, isChar, CHARS } from './crew/characters.js';

/** 玩家：T董。可手動移動（鍵盤/搖桿）也可點擊移動（路徑規劃、跨層）。 */
export class Player {
  constructor(game) {
    this.game = game; this.avatar = Player.makeAvatar(game); this.actor = new Actor(game, this.avatar, D.boss, 1.2, 3.2);
    this.actor.baseSpeed = 2.7; this.actor.speedMul = 1; this.avatar.setPose('stand'); this.key = game.owner ? 'T董' : 'player'; this.title = game.small ? '船長' : 'T董'; // T董 是船東專屬角色：只有 owner 看得到
     // key 是關係表的固定鍵；title 是顯示名稱（訪客稱「船長」）
    this.elevArmed = true; this.stairCd = 0; this.marker = null; this.moving = false; this.deckChangeTime = 0;
    this.makeMarker(); this.placeStart();
  }
  /** 船東 → T董（專屬造型）；其他人 → 自己挑的角色（資料庫 10 位之一），絕不會是 T董。 */
  static makeAvatar(game) {
    if (game.owner) return new Avatar('T董');
    const id = isChar(game.charId) ? game.charId : CHARS[0].id; return new Avatar('P:' + id, lookOf(id));
  }
  /** 換角色（非船東）：換掉模型但保留位置 / 方向 / 路徑。回傳是否成功。 */
  setCharacter(id) {
    if (this.game.owner || !isChar(id)) return false;
    this.game.charId = id; const old = this.avatar, a = this.actor; const av = new Avatar('P:' + id, lookOf(id));
    const vis = old.group.visible; old.group.removeFromParent(); av.group.visible = vis; av.setPose('stand');
    this.avatar = av; a.avatar = av; a.place(a.deck, a.x, a.z, a.yaw);
    return true;
  }
  placeStart() { const sh = this.game.ship; const n = sh.decks[D.boss].nav; const p = sh.small ? sh.start : (n.nearestFree(1.2, 3.4) || [1, 3]); this.actor.place(D.boss, p[0], p[1], sh.small ? 0 : -Math.PI / 2); }
  get deck() { return this.actor.deck; }
  makeMarker() {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.4, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0.9, depthWrite: false })); m.visible = false; m.renderOrder = 6; this.marker = m;
  }
  showMarker(deck, x, z) { this.marker.removeFromParent(); this.game.ship.decks[deck].group.add(this.marker); this.marker.position.set(x, 0.06, z); this.marker.visible = true; this.markerT = 0; }
  goTo(deck, x, z, opts) { this.actor.routeTo(deck, x, z, opts); this.showMarker(deck, x, z); }
  cancelRoute() { if (this.actor.busy && !(this.actor.cur && (this.actor.cur.t === 'stair' || this.actor.cur.t === 'elev'))) this.actor.clear(); }
  useElevator(to) { if (to === this.deck) return; this.actor.clear(); this.actor.mode = 'walk'; this.actor.steps.push({ t: 'elev', from: this.deck, to }); this.elevArmed = false; emit('elevator', null); }
  takeStairs(dir) { const k = dir > 0 ? this.deck : this.deck - 1; this.actor.clear(); this.actor.steps.push({ t: 'stair', k, dir }); this.stairCd = 1.0; }

  update(dt, input, camYaw) {
    const a = this.actor; const ship = this.game.ship;
    const mag = Math.hypot(input.x, input.y);
    const busyAuto = a.busy;
    if (mag > 0.08 && !(a.cur && (a.cur.t === 'stair' || a.cur.t === 'elev'))) {
      if (busyAuto) a.clear();
      const s = Math.sin(camYaw), c = Math.cos(camYaw);
      let dx = (-s) * input.y + c * input.x, dz = (-c) * input.y + (-s) * input.x; const l = Math.hypot(dx, dz); dx /= l; dz /= l;
      if (ship.small) { const ry = ship.root.rotation.y, cr = Math.cos(ry), sr = Math.sin(ry); const lx = dx * cr - dz * sr, lz = dx * sr + dz * cr; dx = lx; dz = lz; }
      const sp = (input.run ? 4.6 : 2.7) * Math.min(1, mag);
      const r = ship.decks[a.deck].nav.move(a.x, a.z, dx * sp * dt, dz * sp * dt, 0.16); a.x = r[0]; a.z = r[1];
      a.yaw = dampAngle(a.yaw, Math.atan2(dx, dz), 14, dt); a.speed += (sp - a.speed) * Math.min(1, dt * 12); this.avatar.speed = a.speed; this.avatar.gait = input.run ? 'run' : 'walk'; a.sync(); this.marker.visible = false;
    } else if (busyAuto) { a.update(dt); this.avatar.speed = a.speed; if (!a.busy) this.marker.visible = false; }
    else { a.speed += (0 - a.speed) * Math.min(1, dt * 10); this.avatar.speed = this.avatar.fixedSpeed ?? a.speed; if (this.avatar.fixedGait) this.avatar.gait = this.avatar.fixedGait; a.sync(); }
    this.avatar.update(dt, this.game.time);
    if (this.marker.visible) { this.markerT += dt; const k = 1 + Math.sin(this.markerT * 6) * 0.12; this.marker.scale.setScalar(k); }
    // 樓梯 / 電梯觸發
    this.stairCd -= dt; const d = a.deck;
    if (!ship.small && (!a.cur || (a.cur.t === 'walk'))) {
      const zUp = d < 4 ? { x: STAIR.upTrig, z: laneCenterZ(d) } : null, zDn = d > 0 ? { x: STAIR.downTrig, z: laneCenterZ(d - 1) } : null;
      if (mag > 0.08 && this.stairCd <= 0 && !a.busy) {
        if (zUp && Math.hypot(a.x - zUp.x, a.z - zUp.z) < 0.55) this.takeStairs(1);
        else if (zDn && Math.hypot(a.x - zDn.x, a.z - zDn.z) < 0.55) this.takeStairs(-1);
      }
      const de = Math.hypot(a.x - ELEV_PORTAL.x, a.z - ELEV_PORTAL.z);
      if (de < 0.7 && this.elevArmed && !a.busy) { this.elevArmed = false; emit('elevator', d); }
      if (de > 1.6) { if (!this.elevArmed) emit('elevator', null); this.elevArmed = true; }
    }
    this.moving = a.speed > 0.2;
  }
}
