import * as THREE from 'three';
import { runSelfTest } from './sim/selftest.js';
import { QUALITY, ORDER, detectQuality } from './config.js';
import { Environment } from './world/environment.js';
import { Ocean } from './world/ocean.js';
import { Ship } from './ship/ship.js';
import { SmallShip } from './ship/smallship.js';
import { mapDecksTo } from './crew/decks.js';
import { ContestTV } from './ship/tv.js';
import { systems, emit } from './events.js';
import { SeaLife } from './world/sealife.js';
import { AudioFX } from './audio.js';
import { Player } from './player.js';
import { Controls } from './controls.js';
import { Crew } from './crew/crew.js';
import { DataSource } from './data.js';
import { isChar, randomChar, crewSpec, charById } from './crew/characters.js';
import { stairEntry, ELEV_PORTAL } from './crew/actor.js';
import { BASE_Y, DH } from './ship/ship.js';
import { waveHeight, waveState } from './world/waves.js';
import { WeatherFX } from './world/weather.js';
import { Polar } from './world/polar.js';
import { ZoneFX } from './world/zonefx.js';
import { helmFx, HELM_KU, SPECIAL_ZONES } from './sim/seazones.js';
import * as WD from './sim/world.js';
import { weatherAt, helmFactor, tempOf } from './sim/weather.js';
import { arkPos } from './sim/world.js';
import { clock } from './clock.js';

export class Game {
  constructor(canvas, opts = {}) {
    const q = detectQuality(); this.qLevel = q.level; this.qLocked = q.locked; this.quality = QUALITY[this.qLevel];
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: this.quality.dpr > 1 ? true : false, powerPreference: 'high-performance' });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.3, 9000);
    this.time = 0; this.clock = new THREE.Clock();
    this.env = new Environment(this.scene, this.renderer, this.quality);
    this.ocean = new Ocean(this.scene, this.env, this.quality);
    this.tv = new ContestTV();
    // 擁有者：T董 的郵輪方舟；其他人（訪客 / 其他帳號）：只有自己選的小船（尚未選時：只有海，不顯示任何船殼）
    this.owner = !!opts.owner; // 要在 Player / Crew 之前設好
    this.charId = this.owner ? null : (isChar(opts.char) ? opts.char : randomChar()); this.crewSeed = this.owner ? 0 : (Number.isFinite(opts.crewSeed) ? opts.crewSeed >>> 0 : (Math.random() * 2 ** 32) >>> 0);
    this.small = !opts.owner; this.homeless = this.small && !opts.home; this.homeType = this.small ? (opts.home || 'skiff') : null;
    if (this.small) { mapDecksTo(0); this.ship = new SmallShip(this.env, this.quality, this.tv.tex, this.homeType, opts.homeLv || 1); this.ship.root.visible = !this.homeless; }
    else this.ship = new Ship(this.env, this.quality, this.tv.tex);
    this.scene.add(this.ship.root); this.ocean.uniforms.uHullOn.value = this.small ? 0 : 1;
    this.dayT = 0.7; this.dayRate = 1 / 1800; this.speed = 1; this.paused = false;
    this.focus = new THREE.Vector3(0, 8, 0);
    this.ctx = this; this.fps = 60; this.fpsAcc = 0; this.fpsN = 0; this.lowCount = 0; this.soloDeck = null; this.viewDeck = 4; this.viewOverride = null;
    this.envState = this.env.update(this.dayT, 0, this.camera, this.focus); this.updatePhase();
    this.sealife = new SeaLife(this.scene, this.env, this.quality);
    this.audio = new AudioFX(); const _av = new THREE.Vector3(); this.sealife.onSound = (k, x, z) => this.audio.event(k, this.camera.position.distanceTo(_av.set(x, 0, z)));
    // 天氣（粒子 / 閃電 / 極光 / 天色）與兩極（冰山、北極熊、企鵝）；強度來自 sim/weather.js 的 weatherAt(遊戲時間, 地圖位置)
    this.wxfx = new WeatherFX(this.scene, this.env, this.quality, this.renderer); this.polar = new Polar(this.scene, this.quality); this.wxNow = null; this.wxT = 0; this.wxOv = null;
    this.wxfx.onThunder = (d) => this.audio.event('thunder', d); this.polar.onSound = (k, x, z) => this.audio.event(k, this.camera.position.distanceTo(_av.set(x, 0, z)));
    // 特殊海域（迷霧 / 漩渦 / 火焰 / 地獄 / 巨石陣）：畫面與音效；危害由 sim/seazones.js 算（跟畫面無關）
    this.zonefx = new ZoneFX(this.scene, this.env, this.quality); this.zonefx.onThunder = (d) => this.audio.event('thunder', d); this.szFx = null; this.szOv = null; this.szT = 0; this.szFirst = false;
    { const q = new URLSearchParams(location.search).get('wx'); if (q) this.setWx(q); const z = new URLSearchParams(location.search).get('sz'); if (z) this.setSz(z); }
    this.player = new Player(this); this.crew = new Crew(this);
    this.controls = new Controls(this, canvas); this.controls.tapCb = (x, y) => this.onTap(x, y); if (this.small) { this.controls.setMode('overview'); this.controls.target.copy(this.controls.tgtOver); }
    const P = new URLSearchParams(location.search);
    this.ds = new DataSource({ mode: P.get('demo') === 'cycle' ? 'cycle' : P.get('demo') ? 'demo' : opts.owner ? 'live' : 'virtual', cap: this.small ? (this.homeless ? 0 : this.ship.cap) : undefined, crew: this.small ? crewSpec(this.crewSeed, this.homeless ? 0 : this.ship.cap, [charById(this.charId).name]) : undefined });
    this.tv.setLocked(!this.owner && !P.get('demo'));
    this.ds.onData((d) => { this.dataInfo = d; this.crew.applyData(d); });
    this.resize();
    addEventListener('resize', () => this.resize());
  }
  resize() {
    const w = innerWidth, h = innerHeight; this.W = w; this.H = h;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, this.quality.dpr));
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  setQuality(level) {
    this.qLevel = level; this.quality = QUALITY[level]; this.env.setQuality(this.quality); this.ocean.build(this.quality); this.wxfx.setQuality(this.quality); this.polar.setQuality(this.quality); this.zonefx.setQuality(this.quality);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, this.quality.dpr)); this.renderer.setSize(this.W, this.H, false);
    this.scene.traverse((o) => { if (o.material) { o.material.needsUpdate = true; } });
  }
  updatePhase() { const e = this.envState; this.phaseKey = e.nightF > 0.6 ? 'night' : e.duskF > 0.5 ? (this.dayT > 0.5 ? 'dusk' : 'dawn') : 'day'; e.phaseKey = this.phaseKey; }
  togglePause() { this.paused = !this.paused; emit('time', null); }
  setTime(t) { this.dayT = ((t % 1) + 1) % 1; }
  setViewDeck(d) { this.viewOverride = d; }
  deckAtY(y) { if (this.small) return 0; return Math.max(0, Math.min(4, Math.floor((y - BASE_Y + 0.9) / (DH + this.ship.explode)))); }
  updateDecks() {
    const c = this.controls; let vd;
    if (this.small) { this.viewDeck = 0; this.deckVis = [true]; this.ship.setVisibleDecks([true]); return; }
    if (this.soloDeck != null && c.mode === 'free') vd = this.soloDeck;
    else if (c.mode === 'follow') vd = this.pilot || (this.helm && this.helm.on) ? 4 : this.player.deck; else if (c.mode === 'free') vd = this.viewOverride != null && c.focusBot ? c.focusBot.actor.deck : this.deckAtY(c.target.y); else vd = 4;
    this.viewDeck = vd; const solo = this.soloDeck != null && c.mode === 'free';
    const vis = [0, 1, 2, 3, 4].map((i) => (c.mode === 'overview' && !solo) || i <= vd); const bandVis = [0, 1].map((k) => (c.mode === 'overview' && !solo) || k < vd); this.ship.setVisibleDecks(vis, bandVis); this.deckVis = vis;
  }
  /** 只顯示某一層並把鏡頭對準它（點右側樓層按鈕） */
  showDeck(i) {
    if (this.small) return;
    const c = this.controls; this.ship.setExplode(0); c.setMode('free'); this.soloDeck = i; this.viewOverride = null; c.focusBot = null;
    { const q = this.helm ? this.helm.world({ x: 8, z: 0, yaw: 0 }) : { x: 8, z: 0 }; c.target.set(q.x, this.ship.deckY(i) + 0.4, q.z); } const m = innerWidth < 700; c.pitch = m ? 1.15 : 1.02; c.yaw = 0.55; c.dist = (m ? 78 : 66) * (i <= 2 ? 1.2 : 1); this.updateDecks(); this.ui && this.ui.refreshDeckBtns();
  }
  /** 全景：回到整艘船 */
  showPanorama() { this.soloDeck = null; this.controls.setMode('overview'); this.ship.setExplode(0); this.updateDecks(); this.ui && this.ui.refreshDeckBtns(); }
  syncSmallFoam() {
    const u = this.ocean.uniforms, sh = this.ship, r = sh.root; u.uSmallOn.value = this.homeless ? 0 : 1;
    u.uSmall.value.set(r.position.x, r.position.z, r.rotation.y, sh.spec.L * sh.k * 0.5);
  }
  onTap(x, y) {
    if (this.pilot || (this.play && this.play.gaming)) return;
    const r = this.controls.pickFloor(x, y); if (!r) return; this.player.goTo(r.deck, r.x, r.z);
  }
  step(dt) {
    if (!this.paused) this.dayT = (this.dayT + dt * this.dayRate * this.speed) % 1;
    this.time += dt;
    const sdt = Math.min(dt, 0.1);
    this.updateWeather(sdt); this.ocean.update(this.time, waveState.amp);
    if (this.helm) this.helm.update(sdt, this.time);
    this.ship.update(sdt, this.time);
    if (this.helm) this.helm.apply();
    if (this.small) this.syncSmallFoam();
    this.player.update(sdt, this.pilot || (this.helm && this.helm.on) || (this.play && this.play.gaming) ? { x: 0, y: 0, run: false } : this.controls.move, this.controls.yaw);
    this.crew.update(sdt, this.time);
    this.updateDecks();
    this.controls.update(sdt);
    this.focus.copy(this.controls.mode === 'overview' ? this.controls.tgtOver : this.controls.target);
    const e = this.envState = this.env.update(this.dayT, this.time, this.camera, this.focus); this.updatePhase();
    this.sealife.update(sdt, this.time, e);
    this.audio.update(dt, 1 - Math.max(e.nightF, e.duskF * 0.6), this.helm && this.helm.on ? this.helm.v : 0);
    this.tv.update(sdt);
    for (const s of systems) s.update(dt, this);
    // FPS 與自動降級（用牆上時鐘計算；掉到很低的幀率也要能偵測）
    const nowMs = performance.now(); this.fpsN++; if (this.t0Ms == null) this.t0Ms = nowMs; this.realT = (nowMs - this.t0Ms) / 1000;
    if (this.fpsT0 == null) this.fpsT0 = nowMs;
    if (nowMs - this.fpsT0 >= 1000) { this.fps = this.fpsN * 1000 / (nowMs - this.fpsT0); this.fpsT0 = nowMs; this.fpsN = 0; this.autoQuality(); }
    return e;
  }
  /** 手動駕駛時的「即時」地圖位置（世界座標 + 還沒推送的位移）；其他情況 = mapPos() */
  mapPosLive() { const p = this.mapPos(), h = this.helm, w = this.play && this.play.state && this.play.state.fleet && this.play.state.fleet.world; if (!p || !h || !w || w.route || !(h.on || h.displaced)) return p; return { x: w.pos.x + (h.x - h.base.x) * HELM_KU, y: w.pos.y + (h.z - h.base.z) * HELM_KU, moving: false }; }
  /** 視覺用海域覆寫（截圖 / 試玩）：'fog' | 'whirlpool' | 'fire' | 'hell' | 'stonehenge'，可加 ,0.8（深度）；null 取消。不影響存檔與模擬。 */
  setSz(spec) {
    if (!spec) { this.szOv = null; this.szT = 0; return; } const [id, d] = String(spec).split(','); const z = SPECIAL_ZONES[id]; if (!z) { this.szOv = null; return; }
    this.szOv = { id, z, depth: Math.max(0, Math.min(1, d == null ? 1 : +d || 1)), un: 1, speed: 1, pull: 0, lost: 0, trapped: false }; this.szT = 0; this.szFirst = false;
  }
  /** 測試 / 截圖用：把方舟直接放到某個特殊海域（u = 離中心的比例 0..1；會存檔）。 */
  szTeleport(id, u = 0.5) {
    const z = SPECIAL_ZONES[id], w = this.play && this.play.state && this.play.state.fleet && this.play.state.fleet.world; if (!z || !w) return false;
    w.route = null; w.pos = { x: z.x + z.r * u, y: z.y }; WD.reveal(w, w.pos.x, w.pos.y, 120); WD.reveal(w, z.x, z.y, z.r + 40); w.hm = 0; this.szT = 0; this.szFirst = false; this.play.save(true); return true;
  }
  /** 目前地圖位置（地圖單位）；沒有存檔 / 世界 → null */
  mapPos() { const p = this.play, w = p && p.state && p.state.fleet && p.state.fleet.world; return w && w.pos ? arkPos(w, clock.now()) : null; }
  /** 換角色（非船東）：換模型 + 寫進存檔 pl.c。 */
  setChar(id) {
    if (this.owner || !isChar(id)) return false;
    const pl = this.play && this.play.games; if (pl && pl.active) { this.ui.toast('先結束目前的活動再換角色'); return false; }
    if (!this.player.setCharacter(id)) return false;
    if (this.play && this.play.state) { this.play.state.pl = { c: id, s: this.crewSeed }; this.play.save(true); }
    return true;
  }
  /** 視覺用天氣覆寫（截圖 / 試玩）：'storm' | 'rain' | 'snow' | 'blizzard' | 'aurora' | 'clear'，可加 ,n / ,s（北 / 南極）；null 取消。不影響存檔與模擬；氣溫依冷度 / 夜晚 / 暴風換算。 */
  setWx(spec) {
    if (!spec) { this.wxOv = null; this.wxT = 0; return; }
    const parts = String(spec).split(','), k = parts[0], hemi = parts.includes('s') ? 'south' : parts.includes('n') ? 'north' : null;
    const polar = !!hemi, o = { kind: 'clear', snowy: false, i: 1, cold: polar ? 0.9 : 0.1, craw: polar ? 0.9 : 0.1, shelter: 0, night: false, aur: 0, temp: 20, polar: hemi, hemi: hemi || 'north' };
    if (k === 'storm') o.kind = 'storm'; else if (k === 'blizzard') { o.kind = 'storm'; o.snowy = true; o.cold = o.craw = Math.max(o.cold, 0.7); } else if (k === 'snow') { o.kind = 'snow'; o.snowy = true; o.cold = o.craw = Math.max(o.cold, 0.7); } else if (k === 'rain') o.kind = 'rain'; else if (k === 'aurora') { o.aur = 1; o.cold = o.craw = Math.max(o.cold, 0.8); o.polar = o.polar || 'north'; o.night = true; } else if (k === 'cloudy') o.kind = 'cloudy';
    if (o.cold > 0.5 && !hemi) o.hemi = 'north'; o.temp = tempOf(o.cold, o.night, o.kind); o.show = k; this.wxOv = o; this.wxT = 0; this.wxFirst = false; this.polar.fast = performance.now() + 25000;
  }
  updateWeather(dt) {
    this.wxT -= dt;
    if (this.wxT <= 0) { this.wxT = 0.5; if (this.wxOv) this.wxNow = this.wxOv; else { const p = this.mapPos(); this.wxNow = p ? weatherAt(clock.now(), p.x, p.y) : null; this.wxMap = p; } const w = this.wxNow; this.wxfx.setTarget(w, !this.wxFirst); this.wxFirst = true; this.wxHelm = w ? helmFactor(w) : null; }
    const helm = this.helm, w = this.wxNow, hp = helm && (helm.on || helm.displaced) ? helm : null, cam = this.camera.position;
    this.wxfx.update(dt, this.time, this.camera, this.envState, hp);
    this.audio.setWeather(this.wxfx.s);
    this.szT -= dt; if (this.szT <= 0) { this.szT = 0.5; if (this.szOv) this.szFx = this.szOv; else { const p = this.mapPosLive(), f = this.play && this.play.state && this.play.state.fleet; this.szFx = p && f ? helmFx(f, p.x, p.y) : null; } const z = this.szFx; { const w = this.play && this.play.state && this.play.state.fleet && this.play.state.fleet.world; this.szAnx = !!((z && z.z.haz.mo && z.depth > 0.35) || (w && w.sz && w.sz.mo >= 25)); } this.zonefx.setTarget(z ? z.id : '', z ? z.depth : 0, !this.szFirst); this.szFirst = true; }
    this.zonefx.update(dt, this.time, cam, hp ? { x: hp.x, z: hp.z } : { x: 0, z: 0 }); this.audio.setZone(this.zonefx.s);
    const hemi = this.wxOv ? this.wxOv.hemi : (this.wxMap && this.wxMap.y > 1000 ? 'south' : 'north');
    this.polar.setCam(cam.x, cam.z); this.polar.update(dt, this.time, hp ? { x: hp.x, z: hp.z } : { x: 0, z: 0 }, w ? w.cold : 0, hemi, this.envState);
  }
  autoQuality() {
    if (this.qLocked || document.hidden || (this.realT || 0) < 5) return;
    // 連續 4 秒 < 26fps 降一級；< 12fps 連續 2 秒直接降兩級（手機載入重的場景救急）
    if (this.fps < 26) this.lowCount++; else this.lowCount = Math.max(0, this.lowCount - 1);
    if (this.fps < 12) this.vlowCount = (this.vlowCount || 0) + 1; else this.vlowCount = 0;
    const drop = this.vlowCount >= 2 ? 2 : this.lowCount >= 4 ? 1 : 0;
    if (drop) { this.lowCount = 0; this.vlowCount = 0; const i = Math.min(ORDER.length - 1, ORDER.indexOf(this.qLevel) + drop); if (ORDER[i] !== this.qLevel) { this.setQuality(ORDER[i]); emit('quality', this.qLevel); this.qDowngrades = (this.qDowngrades || 0) + 1; } }
  }
  /** 導航自測：每層所有 POI 是否可由樓梯口 / 電梯到達 */
  selfTest() {
    const out = []; this.ship.decks.forEach((d) => {
      const nav = d.nav; const starts = []; if (this.small) starts.push(['start', { x: this.ship.start[0], z: this.ship.start[1] }]); else { if (d.index < 4) starts.push(['up', stairEntry(d.index, 1)]); if (d.index > 0) starts.push(['dn', stairEntry(d.index - 1, -1)]); starts.push(['elev', ELEV_PORTAL]); }
      const pts = []; const add = (n, o) => { if (o && typeof o.x === 'number' && typeof o.z === 'number') pts.push([n, this.small && o.head ? { x: o.x, z: o.z - o.head[1] * 1.3 } : o]); };
      for (const k in d.pois.misc) { const v = d.pois.misc[k]; if (Array.isArray(v)) v.forEach((o, i) => add(k + i, o)); else add(k, v); }
      (d.pois.desks || []).forEach((o) => add('desk' + o.key, o)); for (const t in (d.pois.cabins || {})) { const c = d.pois.cabins[t]; add('cabin.' + t + '.corridor', c.corridor); add('cabin.' + t + '.bathIn', c.bathIn); add('cabin.' + t + '.bathOut', c.bathOut); }
      const s0 = starts[0][1]; for (const [n, o] of pts) { const p = nav.findPath(s0.x, s0.z, o.x, o.z); const last = p && p[p.length - 1]; const miss = !p || Math.hypot(last[0] - o.x, last[1] - o.z) > 1.3; if (miss) out.push(`${d.name}:${n} (${o.x.toFixed(1)},${o.z.toFixed(1)}) ${!p ? '無路徑' : '終點偏差'}`); }
      for (const [n, o] of starts) { const f = nav.free(nav.ix(o.x), nav.iz(o.z)); if (!f) out.push(`${d.name}:${n} 入口不可走 (${o.x},${o.z})`); }
    });
    out.push(...runSelfTest());
    if (this.play) for (const f in this.play.fac) { const v = this.play.fac[f]; const nav = this.ship.decks[v.deck].nav; const st = this.play.standPos(f); const s0 = this.small ? { x: this.ship.start[0], z: this.ship.start[1] } : v.deck < 4 ? stairEntry(v.deck, 1) : ELEV_PORTAL; const p = nav.findPath(s0.x, s0.z, st[0], st[1]); const last = p && p[p.length - 1]; if (!p || Math.hypot(last[0] - st[0], last[1] - st[1]) > 1.3) out.push(`設施 ${f} 的站位走不到`); }
    return out;
  }
  render() { this.renderer.render(this.scene, this.camera); }
}
