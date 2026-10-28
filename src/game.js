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
import { Player } from './player.js';
import { Controls } from './controls.js';
import { Crew } from './crew/crew.js';
import { DataSource } from './data.js';
import { stairEntry, ELEV_PORTAL } from './crew/actor.js';
import { BASE_Y, DH } from './ship/ship.js';
import { waveHeight } from './world/waves.js';

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
    this.small = !opts.owner; this.homeless = this.small && !opts.home; this.homeType = this.small ? (opts.home || 'skiff') : null;
    if (this.small) { mapDecksTo(0); this.ship = new SmallShip(this.env, this.quality, this.tv.tex, this.homeType, opts.homeLv || 1); this.ship.root.visible = !this.homeless; }
    else this.ship = new Ship(this.env, this.quality, this.tv.tex);
    this.scene.add(this.ship.root); this.ocean.uniforms.uHullOn.value = this.small ? 0 : 1;
    this.dayT = 0.7; this.dayRate = 1 / 1800; this.speed = 1; this.paused = false;
    this.focus = new THREE.Vector3(0, 8, 0);
    this.ctx = this; this.fps = 60; this.fpsAcc = 0; this.fpsN = 0; this.lowCount = 0; this.soloDeck = null; this.viewDeck = 4; this.viewOverride = null;
    this.envState = this.env.update(this.dayT, 0, this.camera, this.focus); this.updatePhase();
    this.sealife = new SeaLife(this.scene, this.env, this.quality);
    this.player = new Player(this); this.crew = new Crew(this);
    this.controls = new Controls(this, canvas); this.controls.tapCb = (x, y) => this.onTap(x, y); if (this.small) { this.controls.setMode('overview'); this.controls.target.copy(this.controls.tgtOver); }
    const P = new URLSearchParams(location.search);
    this.ds = new DataSource({ mode: P.get('demo') === 'cycle' ? 'cycle' : P.get('demo') ? 'demo' : opts.owner ? 'live' : 'virtual', cap: this.small ? (this.homeless ? 0 : this.ship.cap) : undefined });
    this.owner = !!opts.owner; this.tv.setLocked(!this.owner && !P.get('demo'));
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
    this.qLevel = level; this.quality = QUALITY[level]; this.env.setQuality(this.quality); this.ocean.build(this.quality);
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
    else if (c.mode === 'follow') vd = this.pilot ? 4 : this.player.deck; else if (c.mode === 'free') vd = this.viewOverride != null && c.focusBot ? c.focusBot.actor.deck : this.deckAtY(c.target.y); else vd = 4;
    this.viewDeck = vd; const solo = this.soloDeck != null && c.mode === 'free';
    const vis = [0, 1, 2, 3, 4].map((i) => (solo ? i === this.soloDeck : c.mode === 'overview' || i <= vd)); const bandVis = [0, 1].map((k) => (c.mode === 'overview' && !solo) || (solo ? k < this.soloDeck : k < vd)); this.ship.setVisibleDecks(vis, bandVis); this.deckVis = vis;
  }
  /** 只顯示某一層並把鏡頭對準它（點右側樓層按鈕） */
  showDeck(i) {
    if (this.small) return;
    const c = this.controls; this.ship.setExplode(0); c.setMode('free'); this.soloDeck = i; this.viewOverride = null; c.focusBot = null;
    c.target.set(8, this.ship.deckY(i) + 0.4, 0); const m = innerWidth < 700; c.pitch = m ? 1.15 : 1.02; c.yaw = 0.55; c.dist = (m ? 78 : 66) * (i <= 2 ? 1.2 : 1); this.updateDecks(); this.ui && this.ui.refreshDeckBtns();
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
    this.ocean.update(this.time, 1);
    this.ship.update(sdt, this.time);
    if (this.small) this.syncSmallFoam();
    this.player.update(sdt, this.pilot || (this.play && this.play.gaming) ? { x: 0, y: 0, run: false } : this.controls.move, this.controls.yaw);
    this.crew.update(sdt, this.time);
    this.updateDecks();
    this.controls.update(sdt);
    this.focus.copy(this.controls.mode === 'overview' ? this.controls.tgtOver : this.controls.target);
    const e = this.envState = this.env.update(this.dayT, this.time, this.camera, this.focus); this.updatePhase();
    this.sealife.update(sdt, this.time, e);
    this.tv.update(sdt);
    for (const s of systems) s.update(dt, this);
    // FPS 與自動降級（用牆上時鐘計算；掉到很低的幀率也要能偵測）
    const nowMs = performance.now(); this.fpsN++; if (this.t0Ms == null) this.t0Ms = nowMs; this.realT = (nowMs - this.t0Ms) / 1000;
    if (this.fpsT0 == null) this.fpsT0 = nowMs;
    if (nowMs - this.fpsT0 >= 1000) { this.fps = this.fpsN * 1000 / (nowMs - this.fpsT0); this.fpsT0 = nowMs; this.fpsN = 0; this.autoQuality(); }
    return e;
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
