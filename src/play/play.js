// 玩法層：把純模擬（sim/）接到 3D 世界與 HUD。
// - 遊戲進度只看「現實時間」（Date.now），與攝影模式的光線時間（dayT）完全無關。
// - 真實 bot 狀態只透過 sessions.json 唯讀快照，只提供駐守設施的小幅產能加成；本層不對任何 bot 傳送任何東西。
// - 存檔經 save/adapter.js 的介面，之後要接 Firebase 只換 adapter。
import * as THREE from 'three';
import { registerSystem, on } from '../events.js';
import { waveHeight } from '../world/waves.js';
import { createAdapter } from '../save/adapter.js';
import { boatLoft } from '../ship/extras.js';
import { moodLine } from '../crew/mood.js';
import * as S from '../sim/sim.js';
import { FAC, FAC_ORDER, SITES, TIERS, TICK, RES } from '../sim/defs.js';
import { FacilityView, findSlot, blockRect, FOOT, SC } from './facilities.js';

// 各設施的樓層與偏好位置（x,z）；實際位置會在附近找一塊四周留空的地方
const ANCHOR = { purifier: [34, -6], generator: [34, 7], workshop: [22, 8], infirmary: [24, -8], greenhouse: [36, 4] };
const nowSec = () => Date.now() / 1000;
const rnd = Math.random;
const pick = (a) => a[Math.floor(rnd() * a.length)];

export class Play {
  constructor(game) {
    this.game = game; this.adapter = createAdapter(); this.state = null; this.fac = {}; this.target = null; this.hud = null;
    this.acc = 0; this.saveAcc = 0; this.hudAcc = 0; this.lastFrameWall = performance.now(); this.pendingReport = null; this.boats = new Map(); this.flags = new Map();
    this.ready = false;
  }
  async init(hud) {
    this.hud = hud; const P = new URLSearchParams(location.search);
    if (P.get('fresh')) await this.adapter.clear();
    let st = await this.adapter.load(); const t = nowSec(); let first = false; let rep = null; let away = 0;
    if (!st) { st = S.newState((rnd() * 2 ** 32) >>> 0, t, -new Date().getTimezoneOffset()); first = true; }
    else { away = t - (st.lastSeen || st.simT); rep = S.simulateTo(st, t); }
    this.state = st; this.placeFacilities(); this.applyFacilityStates();
    this.pendingReport = { first, away, rep };
    registerSystem({ name: 'play', update: (dt) => this.update(dt) });
    on('crew', () => this.onCrew());
    addEventListener('visibilitychange', () => { if (document.hidden) this.save(); });
    addEventListener('pagehide', () => this.save()); addEventListener('beforeunload', () => this.save());
    this.ready = true; this.save();
    hud.attach(this); this.onCrew();
    // 載入完成後顯示離線報告（等說明視窗關閉）
    const tryShow = () => { if (!this.hud.helpOpen()) { const r = this.pendingReport; this.pendingReport = null; if (r && (r.first || (r.rep && r.away >= 120))) this.hud.showReport(r); } else setTimeout(tryShow, 600); };
    setTimeout(tryShow, 1400);
  }

  // ------------------------------------------------------------ 設施擺放
  placeFacilities() {
    const ship = this.game.ship; const used = [[], [], [], [], []];
    for (const f of FAC_ORDER) {
      const d = FAC[f].deck; const nav = ship.decks[d].nav; const [hw, hd] = FOOT[f];
      const [ax, az] = ANCHOR[f]; const p = findSlot(nav, ax, az, hw, hd, used[d]) || findSlot(nav, ax, az, hw, hd, used[d], 0.5) || [ax, az];
      used[d].push({ x: p[0], z: p[1], hw, hd }); blockRect(nav, p[0], p[1], hw, hd);
      const v = new FacilityView(f, ship.decks[d].group, p[0], p[1]); v.deck = d; this.fac[f] = v;
    }
  }
  applyFacilityStates() {
    const s = this.state; const r = S.rates(s, s.simT);
    for (const f of FAC_ORDER) { const st = s.fac[f]; this.fac[f].setState(st.lv, st.dmg, FAC[f].res ? r[FAC[f].res] > 0 && s.res.fuel > 0 : false); }
  }
  /** 站位：設施前方 */
  standPos(f) { const v = this.fac[f]; const nav = this.game.ship.decks[v.deck].nav; return nav.nearestFree(v.x, v.z + v.hd + 0.9) || [v.x, v.z + v.hd + 1.2]; }

  // ------------------------------------------------------------ 船員同步
  onCrew() {
    if (!this.ready) return; const bots = [...this.game.crew.bots.values()];
    S.syncCrew(this.state, bots.map((b) => ({ key: b.key, cat: b.info.cat })));
    this.applyCrewFlags(); this.hud && this.hud.refresh(true);
  }
  botOf(key) { return this.game.crew.bots.get(key) || null; }
  applyCrewFlags() {
    const s = this.state, t = nowSec();
    for (const [k, b] of this.game.crew.bots) {
      const c = s.crew[k]; if (!c) continue; const away = !!c.away; const hurt = c.inj > t;
      if (!!b.hurt !== hurt) { b.hurt = hurt; b.setMoodNow(); }
      if (!!b.away !== away) { b.setAway(away); }
    }
  }

  // ------------------------------------------------------------ 每幀
  update(dt) {
    if (!this.ready) return; const g = this.game; const wall = performance.now(); const gap = (wall - this.lastFrameWall) / 1000; this.lastFrameWall = wall;
    if (gap > 120) { this.catchUp(); }
    this.acc += dt; this.saveAcc += dt; this.hudAcc += dt;
    if (this.acc >= 1) { this.acc = 0; this.tickLive(); }
    for (const f of FAC_ORDER) this.fac[f].update(g.time);
    this.hud.updateTags();
    this.updateTarget(); this.updateBoats(g.time);
    if (this.hudAcc >= 0.25) { this.hudAcc = 0; this.hud.refresh(); }
    if (this.saveAcc >= 10) { this.saveAcc = 0; this.save(); }
  }
  /** 分頁被丟到背景很久後回來：用同一套模擬補算，顯示報告 */
  catchUp() {
    const s = this.state; const from = s.simT; const away = nowSec() - s.lastSeen; const rep = S.simulateTo(s, nowSec());
    this.afterSim(rep, true); if (away >= 120 && rep.ticks > 0) this.hud.showReport({ first: false, away, rep });
  }
  tickLive() {
    const rep = S.simulateTo(this.state, nowSec()); if (rep.ticks > 0) this.afterSim(rep, false);
  }
  afterSim(rep, silent) {
    this.applyCrewFlags(); this.applyFacilityStates();
    if (silent) return;
    for (const ev of rep.events) this.onEvent(ev);
  }
  onEvent(ev) {
    const ui = this.game.ui; const bots = [...this.game.crew.bots.values()].filter((b) => !b.away && !b.sleeping && !b.inBath);
    const say = (b, txt, kind = 'chat') => b && b.say(txt, 4.8, kind);
    if (ev.type === 'storm') { ui.toast('⛈ ' + ev.text); for (const b of bots.slice(0, 3)) say(b, pick(['好大的浪！抓穩！', '船在晃，東西快固定好！', '風暴來了…']), 'mood'); }
    else if (ev.type === 'shortage') { ui.toast('⚠️ ' + ev.text); for (const b of bots.slice(0, 2)) say(b, pick(['肚子好餓…', '水…有沒有水喝？', '補給是不是該補一下了？']), 'mood'); }
    else if (ev.type === 'trip') { ui.toast('🚣 ' + ev.text); const b = this.botOf(ev.who); const tr = ev.injured || []; if (b) setTimeout(() => say(b, ev.fail ? pick(['這次運氣不太好…', '什麼都沒撈到，抱歉。']) : pick(['帶了東西回來囉！', '回來了！這趟不錯。']), 'mood'), 1200); for (const k of tr) { const x = this.botOf(k); if (x) setTimeout(() => say(x, '嘶…受了點傷。', 'mood'), 2400); } }
    else if (ev.type === 'sick') { ui.toast('🤒 ' + ev.text); const b = this.botOf(ev.who); say(b, '頭好暈…', 'mood'); }
    else if (ev.type === 'recover') { ui.toast('💪 ' + ev.text); say(this.botOf(ev.who), '好多了，謝謝關心！', 'mood'); }
    else if (ev.type === 'crate' || ev.type === 'rain') { ui.toast('🎁 ' + ev.text); say(pick(bots), ev.type === 'rain' ? '下雨了！快接水！' : '看！海上漂來一個箱子！'); }
    this.hud.logEvent(ev);
  }
  save() { if (this.state) { this.state.lastSeen = Math.max(this.state.lastSeen || 0, nowSec()); this.adapter.save(this.state); } }

  // ------------------------------------------------------------ 互動目標
  updateTarget() {
    const g = this.game, pl = g.player; const a = pl.actor; let best = null, bd = 1e9;
    if (!(a.cur && (a.cur.t === 'stair' || a.cur.t === 'elev'))) {
      for (const f of FAC_ORDER) { const v = this.fac[f]; if (v.deck !== a.deck) continue; const d = Math.hypot(v.x - a.x, v.z - a.z) - Math.max(v.hw, v.hd) + 1.0; if (d < 2.4 && d < bd) { bd = d; best = { type: 'fac', id: f }; } }
      for (const b of g.crew.bots.values()) { if (b.away || b.actor.deck !== a.deck || !b.avatar.group.visible) continue; const d = Math.hypot(b.actor.x - a.x, b.actor.z - a.z); if (d < 2.4 && d < bd + 0.3 && (!best || d < bd)) { bd = d; best = { type: 'bot', bot: b }; } }
    }
    const same = (!best && !this.target) || (best && this.target && best.type === this.target.type && best.id === this.target.id && best.bot === this.target.bot);
    if (!same) { this.target = best; this.hud.setTarget(best); }
  }
  primary() {
    const t = this.target; if (!t) return null; const s = this.state;
    if (t.type === 'fac') { const st = s.fac[t.id]; if (st.dmg) return 'repair'; if (st.lv < 3) return 'build'; if (t.id === 'workshop' && s.cond < 99) return 'hull'; return null; }
    return 'chat';
  }
  /** 執行互動。所有效果都只存在於遊戲內。 */
  act(name, arg) {
    const s = this.state, t = this.target, ui = this.game.ui; let r = null; const now = nowSec();
    if (name === 'build') { const f = (arg || (t && t.id)); r = S.build(s, f); if (r.ok) { this.applyFacilityStates(); const b = this.botOf(S.staffOf(s)[f]); if (b && !b.away) b.say(r.first ? '新設施完工，開工囉！' : '升級完成，效率更好了！', 4.5, 'mood'); this.fac[f].root.scale.setScalar(SC * 0.9); setTimeout(() => this.fac[f].root.scale.setScalar(SC), 160); } }
    else if (name === 'repair') { r = S.repairFac(s, arg || (t && t.id)); if (r.ok) this.applyFacilityStates(); }
    else if (name === 'hull') { r = S.repairHull(s); }
    else if (name === 'chat') { const b = (arg || (t && t.bot)); r = S.chat(s, b.key, now); this.chatWith(b); r = { ok: true, msg: '' }; }
    else if (name === 'cheer') { const b = (arg || (t && t.bot)); r = S.cheer(s, b.key, now); if (r.ok) { b.cheerUntil = Date.now() + 150000; b.setMoodNow(); b.say(pick(['謝謝T董！更有幹勁了！', 'T董人真好～', '收到鼓勵，滿血復活！']), 4.5, 'mood'); if (b.avatar.poseName === 'stand' && !b.actor.busy) { b.avatar.setPose('wave'); setTimeout(() => { if (b.avatar.poseName === 'wave') b.avatar.setPose('stand'); }, 2200); } } else if (r.wait) r.msg = `${b.title} 還在回味上次的打氣（${r.wait} 秒後再來）`; }
    else if (name === 'claim') { r = S.claimTask(s, arg); }
    else if (name === 'trip') { r = S.startTrip(s, arg.site, arg.crew, now); if (r.ok) { this.applyCrewFlags(); this.afterTripStart(r.trip); } }
    if (r && r.msg) ui.toast((r.ok ? '' : '⚠️ ') + r.msg);
    this.save(); this.hud.refresh(true); return r;
  }
  chatWith(b) {
    const env = this.game.envState, s = this.state; const t = nowSec(); const lines = []; const kids = S.crewKeys(s);
    const st = S.staffOf(s); const myFac = FAC_ORDER.find((f) => st[f] === b.key);
    if (b.hurt) lines.push('我還在養傷，等等就好…');
    if (s.res.food < 40) lines.push('食物快不夠了，T董，要不要派人出海找找？');
    if (s.res.water < 40) lines.push('水剩不多了，淨水器要顧好喔。');
    if (s.cond < 40) lines.push('船體傷痕累累，工坊那邊需要整修。');
    if (myFac && s.fac[myFac].lv) lines.push(`我負責${FAC[myFac].name}，運轉${s.fac[myFac].dmg ? '有點不順，需要修理' : '很順利'}！`);
    if (myFac && !s.fac[myFac].lv) lines.push(`${FAC[myFac].name}什麼時候蓋好呀？我已經準備好了。`);
    lines.push(moodLine(b.mood, b.info, env), moodLine(b.mood, b.info, env));
    b.say(pick(lines), 5, 'chat');
    if (b.actor.deck === this.game.player.actor.deck && !b.actor.busy && b.avatar.poseName === 'stand') { const pl = this.game.player.actor; b.actor.yaw = Math.atan2(pl.x - b.actor.x, pl.z - b.actor.z); }
  }
  /** 走到某設施（點 HUD 標籤時） */
  walkToFac(f) { const v = this.fac[f]; const p = this.standPos(f); this.game.player.goTo(v.deck, p[0], p[1]); this.game.ui.toast('前往 ' + FAC[f].name); }
  walkToBot(b) { if (b.away) return; const a = b.actor; this.game.player.goTo(a.deck, a.x + 1.2, a.z + 0.8); }

  // ------------------------------------------------------------ 出海：小艇視覺
  afterTripStart(tr) { /* boat meshes are synced in updateBoats from state.trips */ }
  makeBoat() {
    const g = new THREE.Group(); const om = new THREE.MeshStandardMaterial({ color: 0xff7a1c, roughness: 0.55, side: THREE.DoubleSide }); const wm = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.6, side: THREE.DoubleSide });
    const hull = new THREE.Mesh(boatLoft(4.2, 0.9, 0.78), om); const inner = new THREE.Mesh(boatLoft(3.95, 0.8, 0.66, true), wm); inner.position.y = 0.1;
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 2.4, 12, 1, true, 0, Math.PI).rotateZ(Math.PI / 2), om); can.position.y = 0.43;
    g.add(hull, inner, can); g.scale.setScalar(1.6); g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    return g;
  }
  boatPose(tr, t) {
    const site = SITES.find((x) => x.id === tr.site); const R = 70 + tr.tier * 55; const dx = Math.cos(site.angle), dz = Math.sin(site.angle);
    const side = Math.sin(site.angle) >= 0 ? 1 : -1; const sx = -19, sz = 14 * side; const tx = dx * R, tz = dz * R;
    const p = Math.max(0, Math.min(1, (t - tr.start) / (tr.end - tr.start))); let k, head;
    if (p < 0.42) { k = p / 0.42; head = 1; } else if (p < 0.58) { k = 1; head = 0; } else { k = 1 - (p - 0.58) / 0.42; head = -1; }
    const e = k * k * (3 - 2 * k); let x = sx + (tx - sx) * e, z = sz + (tz - sz) * e;
    let yaw = Math.atan2(-(tz - sz) * head, (tx - sx) * head); if (head === 0) yaw = Math.atan2(-(tz - sz), tx - sx) + Math.sin(t * 0.3) * 0.5;
    return { x, z, yaw, p, arrived: p >= 0.42 && p <= 0.58 };
  }
  updateBoats(time) {
    const s = this.state; const t = nowSec(); const live = new Set(s.trips.map((x) => x.id));
    for (const tr of s.trips) {
      let B = this.boats.get(tr.id); if (!B) { B = { mesh: this.makeBoat() }; this.game.scene.add(B.mesh); this.boats.set(tr.id, B); }
      const p = this.boatPose(tr, t); const y = waveHeight(p.x, p.z, time) + 0.25;
      B.mesh.position.set(p.x, y, p.z); B.mesh.rotation.y = p.yaw; B.mesh.rotation.z = Math.sin(time * 1.3 + tr.id) * 0.06; B.mesh.rotation.x = Math.sin(time * 1.1 + tr.id * 2) * 0.04; B.pose = p;
    }
    for (const [id, B] of this.boats) if (!live.has(id)) { B.mesh.removeFromParent(); this.boats.delete(id); }
  }
  boatWorld(id, out = new THREE.Vector3()) { const B = this.boats.get(id); return B ? out.copy(B.mesh.position).setY(B.mesh.position.y + 4) : null; }
}
