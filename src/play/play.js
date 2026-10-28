// 玩法層：把純模擬（sim/）接到 3D 世界與 HUD。
// - 遊戲進度只看「現實時間」（Date.now），與攝影模式的光線時間（dayT）完全無關。
// - 真實 bot 狀態只透過 sessions.json 唯讀快照，只提供駐守設施的小幅產能加成；本層不對任何 bot 傳送任何東西。
// - 存檔經 save/adapter.js 的介面，之後要接 Firebase 只換 adapter。
import * as THREE from 'three';
import { registerSystem, on } from '../events.js';
import { waveHeight } from '../world/waves.js';
import { clock } from '../clock.js';
import { boatLoft } from '../ship/extras.js';
import { moodLine } from '../crew/mood.js';
import { Mascots } from '../crew/mascots.js';
import * as S from '../sim/sim.js';
import { FAC, FAC_ORDER, SITES, TIERS, TICK, RES } from '../sim/defs.js';
import * as F from '../sim/fleet.js';
import * as SZM from '../sim/seazones.js';
import { SHIPS, ZONES, ZONE_ORDER } from '../sim/fleetdefs.js';
import { buildShipModel } from '../ship/fleetmodels.js';
import { FacilityView, findSlot, blockRect, FOOT, SC, setFacScale } from './facilities.js';
import { Avatar } from '../crew/avatar.js';
import { Player } from '../player.js';
import { SHIP_CX } from '../ship/config.js';
import { dampAngle } from '../util.js';
import { Games } from './games.js';
import { Social } from '../crew/social.js';
import { Helm } from './helm.js';
import { sweepShip, steerAround, pushOut, impactDamage, IMPACT_MIN } from '../sim/seaprops.js';
import { SZ } from '../sim/szdata.js';

// 各設施的樓層與偏好位置（x,z）；實際位置會在附近找一塊四周留空的地方
const ANCHOR = { purifier: [35, -5.5], generator: [35.5, 5.5], workshop: [22, 8], infirmary: [29.5, -6.6], greenhouse: [37.6, 8.2] };
const nowSec = () => clock.now();
const rnd = Math.random;
const pick = (a) => a[Math.floor(rnd() * a.length)];

export class Play {
  constructor(game) {
    this.game = game; this.adapter = null; this.boot = null; this.state = null; this.fac = {}; this.target = null; this.hud = null;
    this.acc = 0; this.saveAcc = 0; this.hudAcc = 0; this.lastFrameWall = performance.now(); this.pendingReport = null; this.boats = new Map(); this.flags = new Map(); this.fleetViews = new Map(); this.preview = null;
    this.ready = false; this.pilot = null; this.crates = []; this.helm = new Helm(game, this);
  }
  async init(hud, boot) {
    this.hud = hud; this.boot = boot; this.adapter = boot.adapter;
    let st = boot.state; let t = nowSec(); let first = false; let rep = null; let away = 0;
    if (!st) {
      st = S.newState((rnd() * 2 ** 32) >>> 0, t, -new Date().getTimezoneOffset()); first = true;
      if (this.adapter.canWrite) { // 新方舟：先寫入一次以取得伺服器時間；裝置時鐘差太多就用伺服器時間重建
        await this.adapter.save(st, { force: true });
        if (clock.synced && Math.abs(clock.skew) > 60) { st = S.newState(st.seed, clock.now(), st.tz); }
      }
    } else {
      t = nowSec(); if (st.lastSeen > t) st.lastSeen = t;
      away = Math.max(0, t - (st.lastSeen || st.simT)); rep = S.simulateTo(st, t);
    }
    F.ensureFleet(st, this.game.owner); st.fleet = F.sanitizeFleet(st.fleet) || F.newFleet(this.game.owner);
    F.ensureWorld(st, (boot.user && boot.user.uid) || 'seed' + st.seed); for (const sh of st.fleet.ships) if (sh.state === 'pilot') sh.state = 'dock';   // 上次駕駛到一半關掉頁面：船回港
    if (!this.game.owner) st.pl = { c: this.game.charId, s: this.game.crewSeed }; else delete st.pl; // 角色與船員種子寫回存檔（owner 永遠是 T董，不存）
    this.state = st; this.placeFacilities(); this.applyFacilityStates();
    this.pendingReport = { first, away, rep };
    registerSystem({ name: 'play', update: (dt) => this.update(dt) });
    on('crew', () => this.onCrew());
    addEventListener('visibilitychange', () => { if (document.hidden) this.save(true); else this.resync(); });
    addEventListener('pagehide', () => this.save(true)); addEventListener('beforeunload', () => this.save(true));
    this.mascots = new Mascots(this.game, this);
    this.games = new Games(this); this.games.init(); this.social = new Social(this); this.game.crew.social = this.social;
    this.ready = true; this.save(boot.needPush);
    hud.attach(this); this.onCrew(); this.pickWatch();
    // 載入完成後顯示離線報告（等說明視窗關閉）
    const tryShow = () => { if (!this.hud.helpOpen()) { const r = this.pendingReport; this.pendingReport = null; if (r && r.first && !this.game.owner && this.state.fleet && !this.state.fleet.pick) { /* 新訪客：先選船（pickWatch），不先跳歡迎視窗 */ } else if (r && (r.first || (r.rep && r.away >= 120))) this.hud.showReport(r); } else setTimeout(tryShow, 600); };
    setTimeout(tryShow, 1400);
  }

  // ------------------------------------------------------------ 設施擺放
  placeFacilities() {
    const ship = this.game.ship; const used = [[], [], [], [], []];
    if (this.game.small) { // 小船家：縮小的設備位（位置在 homespec 裡配好，不擋路）
      const h = ship.home;
      FAC_ORDER.forEach((f, i) => { const p = h.facs[i]; const v = new FacilityView(f, ship.decks[0].group, p.x, p.z, p.ry, p.sc); v.deck = 0; this.fac[f] = v; });
      return;
    }
    for (const f of FAC_ORDER) {
      const d = FAC[f].deck; const nav = ship.decks[d].nav; const [hw, hd] = FOOT[f];
      const [ax, az] = ANCHOR[f]; const p = findSlot(nav, ax, az, hw, hd, used[d], 1.0, 7) || findSlot(nav, ax, az, hw, hd, used[d], 0.5, 7) || findSlot(nav, ax, az, hw, hd, used[d]) || findSlot(nav, ax, az, hw, hd, used[d], 0.5) || [ax, az];
      used[d].push({ x: p[0], z: p[1], hw, hd }); blockRect(nav, p[0], p[1], hw, hd);
      const v = new FacilityView(f, ship.decks[d].group, p[0], p[1]); v.deck = d; this.fac[f] = v;
    }
  }
  applyFacilityStates() {
    const s = this.state; const r = S.rates(s, s.simT);
    for (const f of FAC_ORDER) { const st = s.fac[f]; this.fac[f].setState(st.lv, st.dmg, FAC[f].res ? r[FAC[f].res] > 0 && s.res.fuel > 0 : false); }
  }
  /** 站位：設施前方 */
  standPos(f) {
    const v = this.fac[f]; const nav = this.game.ship.decks[v.deck].nav;
    if (this.game.small) { const dd = v.hd + 0.55, ry = v.ry || 0; return nav.nearestFree(v.x + Math.sin(ry) * dd, v.z + Math.cos(ry) * dd, 3) || [v.x, v.z + dd]; }
    return nav.nearestFree(v.x, v.z + v.hd + 0.9) || [v.x, v.z + v.hd + 1.2];
  }

  // ------------------------------------------------------------ 船員同步
  onCrew() {
    if (!this.ready) return; const bots = [...this.game.crew.bots.values()];
    if (this.game.dataInfo && this.game.dataInfo.demo) return; // 示範資料不寫進存檔
    S.syncCrew(this.state, bots.map((b) => ({ key: b.key, cat: b.info.cat })), nowSec());
    this.applyCrewFlags(); this.hud && this.hud.refresh(true);
  }
  get gaming() { return !!(this.games && this.games.active); }
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
    if (this.mascots) this.mascots.update(Math.min(dt, 0.1));
    const sdt = Math.min(dt, 0.1); this.games.update(sdt); this.social.update(sdt);
    this.updateTarget(); this.updateBoats(g.time); this.updatePilot(dt, g.time); this.updateFleet(g.time);
    if (this.hudAcc >= 0.25) { this.hudAcc = 0; this.hud.refresh(); }
    if (this.saveAcc >= 10) { this.saveAcc = 0; this.save(); }
    this.syncAcc = (this.syncAcc || 0) + dt; if (this.syncAcc >= 600) { this.syncAcc = 0; this.resync(); }
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
    else if (ev.type === 'weather') {
      const recent = ev.t > nowSec() - 600; if (ev.sub !== 'lightning' || recent) ui.toast(ev.text);
      if (ev.sub === 'lightning' && ev.t > nowSec() - 120) { const g = this.game; g.wxfx.strike(90, g.camera); for (const b of bots.slice(0, 2)) say(b, pick(['哇！閃電打到船了！', '好近的雷…檢查一下船體！']), 'mood'); }
      else if (ev.sub === 'polar' && recent) for (const b of bots.slice(0, 2)) say(b, pick(['好冷…快穿外套！', '看！遠處有冰山！']), 'mood');
      else if (ev.sub === 'aurora' && recent) for (const b of bots.slice(0, 2)) say(b, pick(['是極光！太美了！', '快看天空！']), 'mood');
    }
    else if (ev.type === 'seazone') {
      const recent = ev.t > nowSec() - 600, g = this.game;
      const short = (t) => { const i = t.indexOf('：'); const j = t.indexOf('（旗艦'); return i > 0 ? t.slice(0, i) + (j > 0 ? ' ⚠ 旗艦階級未達建議' : '') : t; };
      if (ev.sub === 'enter' && recent) ui.toast(short(ev.text)); else if (ev.sub === 'bp' || recent && ev.sub !== 'strike' && ev.sub !== 'mat' || ev.sub === 'mat' && ev.t > nowSec() - 120) ui.toast(ev.text);
      if (ev.sub === 'strike' && ev.t > nowSec() - 120) { g.wxfx.strike(90, g.camera); ui.toast(ev.text); for (const b of bots.slice(0, 2)) say(b, pick(['啊！地獄的雷打到船了！', '好燙…船體在冒煙！']), 'mood'); }
      else if (ev.sub === 'rock' && recent) { g.audio.event('crash', 14); for (const b of bots.slice(0, 2)) say(b, pick(['撞到石頭了！', '這些石柱怎麼會自己移動…']), 'mood'); }
      else if (ev.sub === 'enter' && recent) { const Z = ev.zone; const L = { fog: ['什麼都看不見…', '這霧好濃，別走散了。'], whirlpool: ['船被捲住了！抓穩！', '水在打轉…快往外開！'], fire: ['海面著火了！！', '好燙！飲水別浪費。'], hell: ['這裡是…地獄？', '快離開這裡，我不想待了…'], stonehenge: ['那些石頭…有人排過它們。', '好神秘的地方。'] }[Z]; if (L) for (const b of bots.slice(0, 2)) say(b, pick(L), 'mood'); }
      else if (ev.sub === 'bp' && ev.t > nowSec() - 600) for (const b of bots.slice(0, 2)) say(b, pick(['找到稀有藍圖了！', '這張圖紙…是旗艦升級用的！']), 'mood');
    }
    else if (ev.type === 'shortage') { ui.toast('⚠️ ' + ev.text); for (const b of bots.slice(0, 2)) say(b, pick(['肚子好餓…', '水…有沒有水喝？', '補給是不是該補一下了？']), 'mood'); }
    else if (ev.type === 'trip') { ui.toast('🚣 ' + ev.text); const b = this.botOf(ev.who); const tr = ev.injured || []; if (b) setTimeout(() => say(b, ev.fail ? pick(['這次運氣不太好…', '什麼都沒撈到，抱歉。']) : pick(['帶了東西回來囉！', '回來了！這趟不錯。']), 'mood'), 1200); for (const k of tr) { const x = this.botOf(k); if (x) setTimeout(() => say(x, '嘶…受了點傷。', 'mood'), 2400); } }
    else if (ev.type === 'fleet') ui.toast(ev.text);
    else if (ev.type === 'blueprint') ui.toast('🗺️ ' + ev.text);
    else if (ev.type === 'shipdone') { ui.toast('🛠 ' + ev.text); }
    else if (ev.type === 'sick') { ui.toast('🤒 ' + ev.text); const b = this.botOf(ev.who); say(b, '頭好暈…', 'mood'); }
    else if (ev.type === 'recover') { ui.toast('💪 ' + ev.text); say(this.botOf(ev.who), '好多了，謝謝關心！', 'mood'); }
    else if (ev.type === 'crate' || ev.type === 'rain') { ui.toast('🎁 ' + ev.text); say(pick(bots), ev.type === 'rain' ? '下雨了！快接水！' : '看！海上漂來一個箱子！'); }
    else if (ev.type === 'fight' || ev.type === 'makeup' || ev.type === 'party' || ev.type === 'celebrate' || ev.type === 'help') ui.toast((ev.type === 'fight' ? '💢 ' : ev.type === 'makeup' ? '🤝 ' : ev.type === 'help' ? '🩹 ' : '') + ev.text);
    if (this.social && ['fight', 'makeup', 'party', 'celebrate', 'help', 'storm'].includes(ev.type)) this.social.onEvent(ev);
    this.hud.logEvent(ev);
  }
  save(force = false) { if (this.state) { this.state.lastSeen = Math.max(this.state.lastSeen || 0, nowSec()); return this.adapter.save(this.state, { force }); } }
  /** 回到前景 / 每 10 分鐘：重新對伺服器時間（登入時），然後補算。 */
  async resync() {
    if (!this.ready || !this.adapter || !this.adapter.syncClock || !this.adapter.canWrite) return;
    if (await this.adapter.syncClock()) { const s = this.state; if (nowSec() - s.simT > 120) this.catchUp(); }
  }

  // ------------------------------------------------------------ 互動目標
  updateTarget() {
    const g = this.game, pl = g.player; const a = pl.actor; let best = null, bd = 1e9;
    if (!this.pilot && !this.gaming && (g.small || g.controls.mode !== 'overview') && !(a.cur && (a.cur.t === 'stair' || a.cur.t === 'elev'))) {
      for (const f of FAC_ORDER) { const v = this.fac[f]; if (v.deck !== a.deck) continue; const d = Math.hypot(v.x - a.x, v.z - a.z) - Math.max(v.hw, v.hd) + 1.0; if (d < 2.4 && d < bd) { bd = d; best = { type: 'fac', id: f }; } }
      for (const b of g.crew.bots.values()) { if (b.away || b.actor.deck !== a.deck || !b.avatar.group.visible) continue; const d = Math.hypot(b.actor.x - a.x, b.actor.z - a.z); if (d < 2.4 && d < bd + 0.3 && (!best || d < bd)) { bd = d; best = { type: 'bot', bot: b }; } }
    }
    if (!this.pilot && !this.gaming && (g.small || g.controls.mode !== 'overview') && !(a.cur && (a.cur.t === 'stair' || a.cur.t === 'elev'))) {
      let cand = null; for (const sp of this.games.spots) { if (sp.deck !== a.deck) continue; const d = Math.hypot(sp.x - a.x, sp.z - a.z); if (d < 1.55 && !(best && best.type === 'bot' && bd < 1.2 && bd <= d) && (!cand || d < cand.d)) cand = { type: 'spot', spot: sp, id: sp.id, d }; } if (cand) best = cand;
    }
    if (!this.pilot && !this.gaming && this.mascots && (g.small || g.controls.mode !== 'overview')) { const m = this.mascots.nearest(a); if (m && (!best || bd > 1.2)) best = { type: 'mascot', m }; }
    const same = (!best && !this.target) || (best && this.target && best.type === this.target.type && best.id === this.target.id && best.bot === this.target.bot && best.m === this.target.m);
    if (!same) { this.target = best; this.hud.setTarget(best); }
  }
  primary() {
    const t = this.target; if (!t) return null; const s = this.state;
    if (t.type === 'mascot') return 'poke';
    if (t.type === 'spot') return 'play';
    if (t.type === 'fac') { const st = s.fac[t.id]; if (st.dmg) return 'repair'; if (st.lv < 3) return 'build'; if (t.id === 'workshop' && s.cond < 99) return 'hull'; return null; }
    return 'chat';
  }
  /** 執行互動。所有效果都只存在於遊戲內。 */
  act(name, arg) {
    const s = this.state, t = this.target, ui = this.game.ui; let r = null; const now = nowSec();
    if (name === 'play') { const sp = arg || (t && t.spot); if (sp) this.games.start(sp, null); return; }
    if (name === 'invite') { if (arg && arg.spot && arg.bot) this.games.start(arg.spot, arg.bot); return; }
    if (name === 'poke') { if (this.mascots) this.mascots.poke(); this.hud.refreshPrompt(true); return; }
    if (name === 'build') { const f = (arg || (t && t.id)); r = S.build(s, f); if (r.ok) { this.applyFacilityStates(); const b = this.botOf(S.staffOf(s)[f]); if (b && !b.away) b.say(r.first ? '新設施完工，開工囉！' : '升級完成，效率更好了！', 4.5, 'mood'); this.fac[f].root.scale.setScalar(SC * 0.9); setTimeout(() => this.fac[f].root.scale.setScalar(SC), 160); } }
    else if (name === 'repair') { r = S.repairFac(s, arg || (t && t.id)); if (r.ok) this.applyFacilityStates(); }
    else if (name === 'hull') { r = S.repairHull(s); }
    else if (name === 'chat') { const b = (arg || (t && t.bot)); r = S.chat(s, b.key, now); this.chatWith(b); r = { ok: true, msg: '' }; }
    else if (name === 'cheer') { const bn = this.game.small ? '船長' : 'T董'; const b = (arg || (t && t.bot)); r = S.cheer(s, b.key, now); if (r.ok) { b.cheerUntil = Date.now() + 150000; b.setMoodNow(); b.say(pick(['謝謝' + bn + '！更有幹勁了！', bn + '人真好～', '收到鼓勵，滿血復活！']), 4.5, 'mood'); if (b.avatar.poseName === 'stand' && !b.actor.busy) { b.avatar.setPose('wave'); setTimeout(() => { if (b.avatar.poseName === 'wave') b.avatar.setPose('stand'); }, 2200); } } else if (r.wait) r.msg = `${b.title} 還在回味上次的打氣（${r.wait} 秒後再來）`; }
    else if (name === 'claim') { r = S.claimTask(s, arg); }
    else if (name === 'trip') { r = S.startTrip(s, arg.site, arg.crew, now); if (r.ok) { this.applyCrewFlags(); this.afterTripStart(r.trip); } }
    if (r && r.msg) ui.toast((r.ok ? '' : '⚠️ ') + r.msg);
    this.save(); this.hud.refresh(true); return r;
  }
  chatWith(b) {
    const env = this.game.envState, s = this.state; const t = nowSec(); const lines = []; const kids = S.crewKeys(s);
    const st = S.staffOf(s); const myFac = FAC_ORDER.find((f) => st[f] === b.key);
    if (b.hurt) lines.push('我還在養傷，等等就好…');
    if (s.res.food < 40) lines.push('食物快不夠了，' + (this.game.owner ? 'T董' : '船長') + '，要不要派人出海找找？');
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
    const side = Math.sin(site.angle) >= 0 ? 1 : -1; let sx = -19, sz = 14 * side; if (this.game.small) { const hs = this.game.ship; sx = -2; sz = side * (hs.spec.W * hs.k * 0.5 + 3); } const tx = dx * R, tz = dz * R;
    const p = Math.max(0, Math.min(1, (t - tr.start) / (tr.end - tr.start))); let k, head;
    if (p < 0.42) { k = p / 0.42; head = 1; } else if (p < 0.58) { k = 1; head = 0; } else { k = 1 - (p - 0.58) / 0.42; head = -1; }
    const e = k * k * (3 - 2 * k); let x = sx + (tx - sx) * e, z = sz + (tz - sz) * e;
    let yaw = Math.atan2(-(tz - sz) * head, (tx - sx) * head); if (head === 0) yaw = Math.atan2(-(tz - sz), tx - sx) + Math.sin(t * 0.3) * 0.5;
    return { ...this.helm.world({ x, z, yaw }), p, arrived: p >= 0.42 && p <= 0.58 };
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

  // ------------------------------------------------------------ 艦隊（資料在 state.fleet；模型見 ship/fleetmodels.js）
  /** 小船家：家（旗艦）停在原點，其他船環繞在旁邊 */
  homeId() { return this.game.small && !this.game.homeless ? (F.homeShip(this.state.fleet) || {}).id : null; }
  berthOf(ship) {
    const f = this.state.fleet; const i = f.ships.indexOf(ship);
    if (!this.game.small) return this.berthPose(i, SHIPS[ship.type].len);
    if (ship.id === this.homeId()) return { x: 0, z: 0, yaw: 0 };
    const others = f.ships.filter((x) => x.id !== this.homeId()); const j = Math.max(0, others.indexOf(ship)); const SL = [[-6, 17], [-6, -17], [26, 14], [26, -14], [-34, 14], [-34, -14]]; const q = SL[j % SL.length];
    return { x: q[0] - Math.floor(j / SL.length) * 40, z: q[1] * (1 + 0.35 * Math.floor(j / SL.length)), yaw: q[1] > 0 ? 0.08 : -0.08 };
  }
  berthPose(i, len) { const col = Math.floor(i / 2); const side = i % 2 ? 1 : -1; return { x: [-24, 4, 30][col] || 0, z: side * (21 + len * 0.12), yaw: side > 0 ? 0.08 : -0.08 }; }
  fleetPose(ship, i, t) {
    const B = SHIPS[ship.type]; const m = ship.m;
    if (ship.state === 'pilot' && this.pilot && this.pilot.id === ship.id) return { x: this.pilot.x, z: this.pilot.z, yaw: this.pilot.yaw, away: false, piloted: true };
    if (ship.state === 'sail' && m) {
      const zi = ZONE_ORDER.indexOf(m.zone); const R = 85 + zi * 45, ang = 0.7 + ship.id * 1.37 + zi * 0.5; const tx = Math.cos(ang) * R, tz = Math.sin(ang) * R; const b = this.berthOf(ship);
      const p = Math.max(0, Math.min(1, (t - m.start) / (m.end - m.start))); let k, head; if (p < 0.42) { k = p / 0.42; head = 1; } else if (p < 0.58) { k = 1; head = 0; } else { k = 1 - (p - 0.58) / 0.42; head = -1; }
      const e = k * k * (3 - 2 * k); const x = b.x + (tx - b.x) * e, z = b.z + (tz - b.z) * e; let yaw = Math.atan2(-(tz - b.z) * (head || 1), (tx - b.x) * (head || 1)); if (head === 0) yaw += Math.sin(t * 0.3) * 0.6;
      return { x, z, yaw, away: p > 0.04 && p < 0.96 };
    }
    return { ...this.berthOf(ship), away: false };
  }
  updateFleet(time) {
    const s = this.state, f = s.fleet; if (!f) return; const t = nowSec(); const live = new Set();
    f.ships.forEach((ship, i) => {
      live.add(ship.id); let V = this.fleetViews.get(ship.id);
      if (ship.id === this.homeId()) { // 家 = 場景裡的 SmallShip；只移動它的根節點（搖晃由 SmallShip 自己做）
        const R = this.game.ship.root; if (!V) { V = { mesh: R, lv: ship.lv, type: ship.type, id: ship.id, home: true }; this.fleetViews.set(ship.id, V); }
        let p = this.fleetPose(ship, i, t); if (!p.piloted) p = this.helm.world(p); R.position.set(p.x, 0, p.z); R.rotation.y = p.yaw; V.pos = p; return;
      }
      if (!V || V.lv !== ship.lv || V.type !== ship.type) { if (V) V.mesh.removeFromParent(); V = { mesh: buildShipModel(ship.type, ship.lv), lv: ship.lv, type: ship.type, id: ship.id }; V.mesh.userData.shipId = ship.id; this.game.scene.add(V.mesh); this.fleetViews.set(ship.id, V); }
      let p = this.fleetPose(ship, i, t); if (!p.piloted) p = this.helm.world(p);
      if (p.away && ship.state === 'sail') { const sl = SHIPS[ship.type].len, q = pushOut(p.x, p.z, Math.max(2, sl * 0.22), this.game.solidProbes(sl)); if (q.x !== p.x || q.z !== p.z) p = { ...p, x: q.x, z: q.z }; }   // 出海 / 返航的船繞過殘骸 / 廢墟 / 冰山
      const y = waveHeight(p.x, p.z, time) * 0.7 + 0.05;
      V.mesh.position.set(p.x, y, p.z); V.mesh.rotation.set(Math.sin(time * 1.2 + ship.id) * 0.03, p.yaw, Math.sin(time * 0.9 + ship.id * 2) * 0.04);
      let sc = 1; if (ship.state === 'build') { const pr = Math.max(0, Math.min(1, 1 - (ship.done - t) / (SHIPS[ship.type].build * 60))); sc = 0.35 + 0.65 * pr; V.mesh.position.y -= 0.4 * (1 - pr); }
      if (ship.state === 'wreck') { V.mesh.rotation.z += 0.22; V.mesh.position.y -= 0.5; }
      V.mesh.scale.setScalar(sc); V.mesh.visible = true; V.pos = p;
    });
    for (const [id, V] of this.fleetViews) if (!live.has(id)) { if (!V.home) V.mesh.removeFromParent(); this.fleetViews.delete(id); }
    if (this.preview) { this.preview.mesh.position.y = waveHeight(this.preview.mesh.position.x, this.preview.mesh.position.z, time) * 0.7 + 0.05; this.preview.mesh.rotation.y += 0.004; }
  }
  /** 鏡頭移到某艘船（或展示台上的模型）來看 */
  focusModel(mesh, len) {
    const c = this.game.controls; this.game.soloDeck = null; c.setMode('free'); c.focusBot = null; c.target.set(mesh.position.x, mesh.position.y + len * 0.12 + 1, mesh.position.z); c.dist = Math.max(14, len * 2.2); c.pitch = 0.42; c.yaw = 0.9; this.game.updateDecks(); this.game.ui && this.game.ui.refreshDeckBtns && this.game.ui.refreshDeckBtns();
  }
  viewShip(id) { const V = this.fleetViews.get(id); const ship = F.findShip(this.state, id); if (!V || !ship) return; if (V.pos && V.pos.away) { this.game.ui.toast('船在海上，返港後再看'); return; } if (V.home) { this.game.controls.setMode('overview'); this.hud.closeModal(); return; } this.focusModel(V.mesh, SHIPS[ship.type].len); this.hud.closeModal(); }
  /** 展示台：看任何船型（含尚未擁有的）。放在方舟旁的海面上，旋轉展示。 */
  viewType(type, lv = 1) {
    this.clearPreview(); const mesh = buildShipModel(type, lv); if (this.game.homeless) mesh.position.set(0, 0, 0); else if (this.game.small) mesh.position.set(-46, 0, -62); else mesh.position.set(-6, 0, -52); if (!this.game.homeless) { const hw = this.helm.world({ x: mesh.position.x, z: mesh.position.z, yaw: 0 }); mesh.position.set(hw.x, 0, hw.z); } this.game.scene.add(mesh); this.preview = { mesh, type, lv };
    this.focusModel(mesh, SHIPS[type].len); this.hud.closeModal();
  }
  clearPreview() { if (this.preview) { this.preview.mesh.removeFromParent(); this.preview = null; } }
  fleetAct(name, a = {}) {
    const s = this.state; let r = null;
    if (name === 'pick') r = F.pickStarter(s, a.type, nowSec());
    else if (name === 'build') r = F.buildShip(s, a.type);
    else if (name === 'upgrade') r = F.upgradeShip(s, a.id);
    else if (name === 'repair') r = F.repairShip(s, a.id);
    else if (name === 'zone') r = F.setZone(s, a.id, a.zone);
    else if (name === 'auto') r = F.setAuto(s, a.id, a.on);
    else if (name === 'rename') r = F.renameShip(s, a.id, a.name);
    else if (name === 'home') r = F.setHome(s, a.id);
    if (name === 'sail' && r && !r.ok && /燃料不足/.test(r.msg)) r.msg += SZM.rescueHint(s, now);
    if (r && r.msg) this.game.ui.toast((r.ok ? '' : '⚠️ ') + r.msg);
    if (r && r.ok) { this.updateFleet(this.game.time); }
    // 小船家：選船／換旗艦／升級旗艦 → 存檔後重新載入，場景換成新的船
    if (r && r.ok && this.game.small && !r.same && (name === 'pick' || name === 'home' || (name === 'upgrade' && a.id === this.homeId()))) { this.reloadHome(); return r; }
    this.save(true); this.hud.refresh(true); return r;
  }
  reloadHome() {
    this.reloading = true; this.game.ui.toast('⚓ 換成新的船，重新整備中…');
    Promise.resolve(this.save(true)).catch(() => {}).then(() => { const u = new URL(location.href); u.searchParams.delete('fresh'); setTimeout(() => location.replace(u.toString()), 350); });
  }
  // ------------------------------------------------------------ 駕駛小船（T董親自開）
  HELM = { skiff: [0.35, 0.66, 0], speedboat: [-3.55, 1.28, 0], tug: [4.6, 1.6, 0], sub: [0.8, 3.2, 0], patrol: [4.1, 1.6, 1.4], icebreaker: [0.4, 9.0, 1.5] };
  startPilot(id) {
    if (this.pilot) return; if (this.helm.on) { this.helm.stop(); } const ship = F.findShip(this.state, id); if (!ship) return; const i = this.state.fleet.ships.indexOf(ship); const r = F.startPilot(this.state, id, nowSec());
    if (!r.ok) { this.game.ui.toast('⚠️ ' + r.msg); return r; }
    const b = this.berthOf(ship); const g = this.game; const av = Player.makeAvatar(g); av.setPose('stand'); const V = this.fleetViews.get(id); const h = this.HELM[ship.type] || [0, 1, 0]; av.group.position.set(h[0], h[1], h[2]); av.group.rotation.y = Math.PI / 2;
    if (V && V.home) { const sh = g.ship; av.group.position.set(h[0] * sh.k, h[1] * sh.k, h[2] * sh.k); sh.body.add(av.group); } else V && V.mesh.add(av.group);
    this.pilot = { id, type: ship.type, idx: i, x: b.x, z: b.z, yaw: b.yaw, v: 0, av, cam: new THREE.Vector3(b.x, 2, b.z), homing: false, keepT: 0, max: 7 + SHIPS[ship.type].speed * 5, t0: g.time };
    const V2 = this.fleetViews.get(id); if (V2 && V2.pos) { this.pilot.x = V2.pos.x; this.pilot.z = V2.pos.z; this.pilot.yaw = V2.pos.yaw; }
    g.pilot = this.pilot; g.player.avatar.group.visible = false; const c = g.controls; c.setMode('follow'); this.pilot.camSave = { dist: c.dist, pitch: c.pitch }; c.dist = 14 + SHIPS[ship.type].len * 1.1; c.pitch = 0.55; c.yaw = Math.PI / 2 + 0.2;
    this.spawnCrates(); this.hud.showPilotBar(true); this.game.ui.toast(r.msg + '　WASD / 搖桿駕駛，Shift 加速'); this.hud.refresh(true); return r;
  }
  stopPilot(home) {
    const P = this.pilot; if (!P) return; if (home && !P.homing) { P.homing = true; P.homeT = this.game.time; this.game.ui.toast('自動返港中…'); return; }
    P.av.group.removeFromParent(); this.game.pilot = null; this.pilot = null; this.game.player.avatar.group.visible = true; F.endPilot(this.state, P.id);
    const c = this.game.controls; if (P.camSave) { c.dist = P.camSave.dist; c.pitch = P.camSave.pitch; } for (const k of this.crates) k.mesh.removeFromParent(); this.crates = []; this.hud.showPilotBar(false); this.save(true); this.hud.refresh(true); this.game.ui.toast('船已靠港');
  }
  spawnCrates() {
    const f = this.state.fleet; if (f.pilot && f.pilot.got >= 80) return;
    while (this.crates.length < 4) { const a = Math.random() * Math.PI * 2, r = 60 + Math.random() * 170; const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 1.4), new THREE.MeshStandardMaterial({ color: 0xffa21f, roughness: 0.5, emissive: 0x552a00 })); const bar = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 0.4), new THREE.MeshStandardMaterial({ color: 0xffffff })); m.add(bar); m.castShadow = true; this.game.scene.add(m); const cw = this.helm.world({ x: Math.cos(a) * r + (this.game.small ? 0 : SHIP_CX), z: Math.sin(a) * r * 0.8, yaw: 0 }); this.crates.push({ mesh: m, x: cw.x, z: cw.z, ph: Math.random() * 6 }); }
  }
  updatePilot(dt, time) {
    const P = this.pilot; if (!P) return; const g = this.game; const input = g.controls.move; const sdt = Math.min(dt, 0.1);
    let mag = Math.hypot(input.x, input.y); let desired = null;
    if (P.homing) { const b = this.helm.world(this.berthOf(F.findShip(this.state, P.id))); const dx = b.x - P.x, dz = b.z - P.z; const d = Math.hypot(dx, dz); if (d < 3 || time - P.homeT > 120) { P.x = b.x; P.z = b.z; this.stopPilot(false); return; } desired = Math.atan2(-dz, dx); const sl = SHIPS[P.type].len; desired = steerAround(P.x, P.z, desired, Math.max(2, sl * 0.2), 30 + sl * 1.5, this.game.solidProbes(sl)); mag = Math.min(1, 0.25 + d / 60); }
    else if (mag > 0.08) { const s = Math.sin(g.controls.yaw), c = Math.cos(g.controls.yaw); let dx = (-s) * input.y + c * input.x, dz = (-c) * input.y + (-s) * input.x; desired = Math.atan2(-dz, dx); }
    let target = 0;
    if (desired != null) { const diff = Math.abs(Math.atan2(Math.sin(desired - P.yaw), Math.cos(desired - P.yaw))); P.yaw = dampAngle(P.yaw, desired, 2.6, sdt); target = P.max * Math.min(1, mag) * (input.run && !P.homing ? 1.7 : 1) * Math.max(0.25, Math.cos(Math.min(diff, 1.4))); }
    P.v += (target - P.v) * Math.min(1, sdt * (target > P.v ? 0.9 : 1.6)); const px0 = P.x, pz0 = P.z; P.x += Math.cos(P.yaw) * P.v * sdt; P.z += -Math.sin(P.yaw) * P.v * sdt;
    { const sl = SHIPS[P.type].len, pst = { x: P.x, z: P.z, yaw: P.yaw, v: P.v, w: 0 }; const hit = sweepShip(pst, px0, pz0, { len: sl, hw: sl * 0.2 }, this.game.solidProbes(sl), sdt); P.x = pst.x; P.z = pst.z; P.v = pst.v;   // 領航也會撞到廢墟 / 殘骸 / 冰山 / 石柱（掃過式，不會穿過去）
      if (hit && hit.imp > IMPACT_MIN && time - (P.hitT || -9) > 2) { P.hitT = time; const dmg = impactDamage(hit.imp), sh = F.findShip(this.state, P.id); if (sh && typeof sh.hp === 'number') sh.hp = Math.max(Math.min(sh.hp, SZ.floor), sh.hp - dmg); this.game.ui.toast('💥 撞上' + ({ debris: '漂流殘骸', ice: '冰山', stone: '石柱', ruin: '廢墟', bridge: '橋' }[hit.kind] || '障礙') + '！船體 −' + dmg.toFixed(1) + '%'); this.game.audio && this.game.audio.event('crash', 10); } }
    // 方舟船體（橢圓）擋住；外圍 260 單位為邊界
    // （母船被駕駛離開原位時，碰撞與邊界都在母船座標系裡算）
    const H = this.helm, hd = H.displaced; let lx = P.x, lz = P.z; if (hd) { const L = H.local(P.x, P.z); lx = L.x; lz = L.z; }
    const a = 91.2 / 2 + 3, bb = 13.6 + 3; const ex = (lx - SHIP_CX) / a, ez = lz / bb; const r = Math.hypot(ex, ez); if (r < 1 && !g.small) { const k = 1.002 / Math.max(r, 0.05); lx = SHIP_CX + ex * k * a; lz = ez * k * bb; P.v *= 0.9; }
    const R = Math.hypot(lx, lz); if (R > 270) { lx *= 270 / R; lz *= 270 / R; P.v *= 0.9; }
    if (hd) { const Wd = H.world({ x: lx, z: lz, yaw: 0 }); P.x = Wd.x; P.z = Wd.z; } else { P.x = lx; P.z = lz; }
    P.cam.set(P.x, waveHeight(P.x, P.z, time) * 0.7 + 1.8, P.z); P.av.update(sdt, time);
    P.keepT += dt; if (P.keepT > 20) { P.keepT = 0; F.keepPilot(this.state, P.id, nowSec()); }
    g.player.avatar.group.visible = false;
    for (const k of this.crates) { k.mesh.position.set(k.x, waveHeight(k.x, k.z, time) * 0.7 + 0.6 + Math.sin(time * 2 + k.ph) * 0.12, k.z); k.mesh.rotation.y = time * 0.7 + k.ph; if (Math.hypot(k.x - P.x, k.z - P.z) < 4.5 + SHIPS[P.type].len * 0.2) { k.mesh.removeFromParent(); this.crates.splice(this.crates.indexOf(k), 1); const r = F.pilotCollect(this.state, nowSec(), this.state.tz); this.game.ui.toast((r.ok ? '📦 ' : '') + r.msg); this.save(); this.hud.refresh(true); if (r.ok) setTimeout(() => this.pilot && this.spawnCrates(), 4000); break; } }
    this.hud.updatePilotBar(P);
  }
  /** 世界 / 海圖動作 */
  worldAct(name, a = {}) {
    const s = this.state; let r = null; const now = nowSec();
    if (name === 'sail') r = F.sailArk(s, a.x, a.y, now);
    else if (name === 'stop') r = F.stopArk(s, now);
    else if (name === 'decide') r = F.decideSeaEvent(s, a.id, a.i, now);
    else if (name === 'puzzle') r = SZM.puzzleResolve(s, now, a.seq);
    else if (name === 'rescue') { const w = s.fleet.world; if (this.game.helm.on) this.game.helm.stop(); r = SZM.rescueDo(s, now); }
    if (r && r.msg) this.game.ui.toast((r.ok ? '' : '⚠️ ') + r.msg);
    this.save(true); this.hud.refresh(true); return r;
  }
  /** 新玩家（非擁有者）第一次進來：等說明 / 報告視窗關閉後顯示選船畫面 */
  pickWatch() {
    const f = this.state.fleet; if (this.game.owner || !f || f.pick || new URLSearchParams(location.search).get('fleet') === '0') return;
    const tick = () => { if (this.state.fleet.pick) return; if (!this.hud.helpOpen() && !this.hud.modalKind) { this.hud.openModal('pick'); return; } setTimeout(tick, 800); };
    setTimeout(tick, 2200);
  }
  boatWorld(id, out = new THREE.Vector3()) { const B = this.boats.get(id); return B ? out.copy(B.mesh.position).setY(B.mesh.position.y + 4) : null; }
}
