import * as THREE from 'three';
import { QUALITY, ORDER, detectQuality } from './config.js';
import { Environment } from './world/environment.js';
import { Ocean } from './world/ocean.js';
import { Ship } from './ship/ship.js';
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
  constructor(canvas) {
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
    this.ship = new Ship(this.env, this.quality, this.tv.tex);
    this.scene.add(this.ship.root);
    this.dayT = 0.7; this.dayRate = 1 / 1800; this.speed = 1; this.paused = false;
    this.focus = new THREE.Vector3(0, 8, 0);
    this.ctx = this; this.fps = 60; this.fpsAcc = 0; this.fpsN = 0; this.lowCount = 0; this.soloDeck = null; this.viewDeck = 4; this.viewOverride = null;
    this.envState = this.env.update(this.dayT, 0, this.camera, this.focus); this.updatePhase();
    this.sealife = new SeaLife(this.scene, this.env, this.quality);
    this.player = new Player(this); this.crew = new Crew(this);
    this.controls = new Controls(this, canvas); this.controls.tapCb = (x, y) => this.onTap(x, y);
    const P = new URLSearchParams(location.search);
    this.ds = new DataSource({ mode: P.get('demo') === 'cycle' ? 'cycle' : P.get('demo') ? 'demo' : 'live' });
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
  deckAtY(y) { return Math.max(0, Math.min(4, Math.floor((y - BASE_Y + 0.9) / (DH + this.ship.explode)))); }
  updateDecks() {
    const c = this.controls; let vd;
    if (this.soloDeck != null && c.mode === 'free') vd = this.soloDeck;
    else if (c.mode === 'follow') vd = this.player.deck; else if (c.mode === 'free') vd = this.viewOverride != null && c.focusBot ? c.focusBot.actor.deck : this.deckAtY(c.target.y); else vd = 4;
    this.viewDeck = vd; const solo = this.soloDeck != null && c.mode === 'free';
    const vis = [0, 1, 2, 3, 4].map((i) => (solo ? i === this.soloDeck : c.mode === 'overview' || i <= vd)); const bandVis = [0, 1].map((k) => (c.mode === 'overview' && !solo) || (solo ? k < this.soloDeck : k < vd)); this.ship.setVisibleDecks(vis, bandVis); this.deckVis = vis;
  }
  /** 只顯示某一層並把鏡頭對準它（點右側樓層按鈕） */
  showDeck(i) {
    const c = this.controls; this.ship.setExplode(0); c.setMode('free'); this.soloDeck = i; this.viewOverride = null; c.focusBot = null;
    c.target.set(8, this.ship.deckY(i) + 0.4, 0); const m = innerWidth < 700; c.pitch = m ? 1.15 : 1.02; c.yaw = 0.55; c.dist = (m ? 78 : 66) * (i <= 2 ? 1.2 : 1); this.updateDecks(); this.ui && this.ui.refreshDeckBtns();
  }
  /** 全景：回到整艘船 */
  showPanorama() { this.soloDeck = null; this.controls.setMode('overview'); this.ship.setExplode(0); this.updateDecks(); this.ui && this.ui.refreshDeckBtns(); }
  onTap(x, y) {
    const r = this.controls.pickFloor(x, y); if (!r) return; this.player.goTo(r.deck, r.x, r.z);
  }
  step(dt) {
    if (!this.paused) this.dayT = (this.dayT + dt * this.dayRate * this.speed) % 1;
    this.time += dt;
    const sdt = Math.min(dt, 0.1);
    this.ocean.update(this.time, 1);
    this.ship.update(sdt, this.time);
    this.player.update(sdt, this.controls.move, this.controls.yaw);
    this.crew.update(sdt, this.time);
    this.updateDecks();
    this.controls.update(sdt);
    this.focus.copy(this.controls.mode === 'overview' ? this.controls.tgtOver : this.controls.target);
    const e = this.envState = this.env.update(this.dayT, this.time, this.camera, this.focus); this.updatePhase();
    this.sealife.update(sdt, this.time, e);
    this.tv.update(sdt);
    for (const s of systems) s.update(dt, this);
    // FPS 與自動降級
    if (dt < 0.5) { this.fpsAcc += dt; this.fpsN++; if (this.fpsAcc >= 1) { this.fps = this.fpsN / this.fpsAcc; this.fpsAcc = 0; this.fpsN = 0; this.autoQuality(); } }
    return e;
  }
  autoQuality() {
    if (this.qLocked || document.hidden || this.time < 6) return;
    if (this.fps < 26) this.lowCount++; else this.lowCount = Math.max(0, this.lowCount - 1);
    if (this.lowCount >= 4) { this.lowCount = 0; const i = ORDER.indexOf(this.qLevel); if (i < ORDER.length - 1) { this.setQuality(ORDER[i + 1]); emit('quality', this.qLevel); } }
  }
  /** 導航自測：每層所有 POI 是否可由樓梯口 / 電梯到達 */
  selfTest() {
    const out = []; this.ship.decks.forEach((d) => {
      const nav = d.nav; const starts = []; if (d.index < 4) starts.push(['up', stairEntry(d.index, 1)]); if (d.index > 0) starts.push(['dn', stairEntry(d.index - 1, -1)]); starts.push(['elev', ELEV_PORTAL]);
      const pts = []; const add = (n, o) => { if (o && typeof o.x === 'number' && typeof o.z === 'number') pts.push([n, o]); };
      for (const k in d.pois.misc) { const v = d.pois.misc[k]; if (Array.isArray(v)) v.forEach((o, i) => add(k + i, o)); else add(k, v); }
      (d.pois.desks || []).forEach((o) => add('desk' + o.key, o)); for (const t in (d.pois.cabins || {})) { const c = d.pois.cabins[t]; add('cabin.' + t + '.corridor', c.corridor); add('cabin.' + t + '.bathIn', c.bathIn); add('cabin.' + t + '.bathOut', c.bathOut); }
      const s0 = starts[0][1]; for (const [n, o] of pts) { const p = nav.findPath(s0.x, s0.z, o.x, o.z); const last = p && p[p.length - 1]; const miss = !p || Math.hypot(last[0] - o.x, last[1] - o.z) > 1.3; if (miss) out.push(`${d.name}:${n} (${o.x.toFixed(1)},${o.z.toFixed(1)}) ${!p ? '無路徑' : '終點偏差'}`); }
      for (const [n, o] of starts) { const f = nav.free(nav.ix(o.x), nav.iz(o.z)); if (!f) out.push(`${d.name}:${n} 入口不可走 (${o.x},${o.z})`); }
    }); return out;
  }
  render() { this.renderer.render(this.scene, this.camera); }
}
