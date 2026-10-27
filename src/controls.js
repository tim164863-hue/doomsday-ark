import * as THREE from 'three';
import { clamp, isTouchDevice } from './util.js';
import { BASE_Y, DH } from './ship/ship.js';
import { pointInPoly } from './ship/hull.js';

const MODES = ['follow', 'free', 'overview'];
export const MODE_NAMES = { follow: '追隨', free: '自由', overview: '俯瞰' };

export class Controls {
  constructor(game, dom) {
    this.game = game; this.dom = dom; this.keys = new Set(); this.joy = { x: 0, y: 0 }; this.pointers = new Map(); this.tapCb = null;
    this.mode = 'follow'; this.yaw = 0.95; this.pitch = 0.95; this.dist = innerWidth < 700 ? 12.5 : 17; this.target = new THREE.Vector3(0, 18, 0); this.saved = {};
    this.touch = isTouchDevice() || new URLSearchParams(location.search).get('joy') === '1';
    this.rc = new THREE.Raycaster(); this.tmp = new THREE.Vector3(); this.pinch = 0; this.drag = false; this.focusBot = null;
    this.bind();
  }
  setMode(m) {
    if (m === this.mode) return;
    this.saved[this.mode] = { yaw: this.yaw, pitch: this.pitch, dist: this.dist, target: this.target.clone() };
    this.mode = m; const s = this.saved[m];
    if (m === 'overview') { this.yaw = 0.8; this.pitch = 0.5; this.dist = 175; this.tgtOver = new THREE.Vector3(0, 9, 0); this.game.ship.setExplode(0); }
    else if (m === 'follow') { if (s) { this.yaw = s.yaw; this.pitch = s.pitch; this.dist = s.dist; } else { this.dist = 17; this.pitch = 0.95; } }
    else { if (s) { this.yaw = s.yaw; this.pitch = s.pitch; this.dist = s.dist; this.target.copy(s.target); } else { this.dist = 45; this.pitch = 0.8; } }
    if (m !== 'free') this.game.soloDeck = null; this.focusBot = null; this.game.onModeChange && this.game.onModeChange(m);
  }
  cycleMode() { this.setMode(MODES[(MODES.indexOf(this.mode) + 1) % 3]); }
  /** 自由視角聚焦到某位成員 */
  focusOn(bot) {
    const p = bot.worldPos(new THREE.Vector3()); this.setMode('free'); this.game.soloDeck = null; this.target.copy(p); this.target.y += 1; this.dist = 16; this.pitch = 0.95; this.focusBot = bot;
    this.game.setViewDeck(bot.actor.deck);
  }
  bind() {
    const d = this.dom;
    addEventListener('keydown', (e) => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return; const k = e.key.toLowerCase(); this.keys.add(k);
      if (k === 'v') this.cycleMode(); if (k === 't') this.game.togglePause(); if (k === 'h' || k === '?') this.game.ui && this.game.ui.toggleHelp(); if (k === 'l') this.game.ui && this.game.ui.toggleCrew();
      if (k >= '1' && k <= '5' && !e.ctrlKey && !e.metaKey) this.game.showDeck(+k - 1);
      if (k === '0' || k === 'p') this.game.showPanorama();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault(); });
    addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase())); addEventListener('blur', () => this.keys.clear());
    d.addEventListener('contextmenu', (e) => e.preventDefault());
    d.addEventListener('pointerdown', (e) => { d.setPointerCapture(e.pointerId); this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), b: e.button, moved: 0 }); if (this.pointers.size === 2) this.pinch = this.pdist(); this.drag = false; });
    d.addEventListener('pointermove', (e) => {
      const p = this.pointers.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; p.moved += Math.abs(dx) + Math.abs(dy);
      if (this.pointers.size === 1) {
        if (p.moved > 7) this.drag = true;
        if (this.drag) { if (p.b === 2 || (this.mode === 'free' && e.shiftKey)) this.pan(dx, dy); else { this.yaw -= dx * 0.0062; this.pitch = clamp(this.pitch + dy * 0.0048, 0.18, 1.5); } }
      } else if (this.pointers.size === 2) {
        const nd = this.pdist(); if (this.pinch > 0) this.zoom(this.pinch / nd); this.pinch = nd; const [a, b] = [...this.pointers.values()]; // 雙指平移（自由模式）
        if (this.mode === 'free') this.pan(dx * 0.5, dy * 0.5);
      }
    });
    const up = (e) => {
      const p = this.pointers.get(e.pointerId); this.pointers.delete(e.pointerId); this.pinch = 0; if (!p) return;
      if (p.moved < 8 && performance.now() - p.t < 450 && p.b <= 0 && this.tapCb) this.tapCb(e.clientX, e.clientY);
    };
    d.addEventListener('pointerup', up); d.addEventListener('pointercancel', (e) => { this.pointers.delete(e.pointerId); this.pinch = 0; });
    d.addEventListener('wheel', (e) => { e.preventDefault(); this.zoom(Math.exp(e.deltaY * 0.0011)); }, { passive: false });
    // 虛擬搖桿
    const joy = document.getElementById('joy'); this.joyEl = joy;
    if (joy) {
      joy.style.display = this.touch ? 'block' : 'none'; const knob = joy.querySelector('.knob'); let id = null; const R = 52;
      const set = (e) => { const r = joy.getBoundingClientRect(); let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); const l = Math.hypot(dx, dy); if (l > R) { dx = dx / l * R; dy = dy / l * R; } knob.style.transform = `translate(${dx}px,${dy}px)`; this.joy.x = dx / R; this.joy.y = -dy / R; };
      joy.addEventListener('pointerdown', (e) => { id = e.pointerId; joy.setPointerCapture(id); set(e); e.stopPropagation(); });
      joy.addEventListener('pointermove', (e) => { if (e.pointerId === id) set(e); });
      const end = (e) => { if (e.pointerId !== id) return; id = null; knob.style.transform = ''; this.joy.x = 0; this.joy.y = 0; };
      joy.addEventListener('pointerup', end); joy.addEventListener('pointercancel', end);
    }
  }
  pdist() { const [a, b] = [...this.pointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; }
  zoom(f) { const [lo, hi] = this.mode === 'overview' ? [60, 340] : this.mode === 'follow' ? [5.5, 48] : [4, 340]; this.dist = clamp(this.dist * f, lo, hi); }
  pan(dx, dy) { const k = this.dist * 0.0016; const s = Math.sin(this.yaw), c = Math.cos(this.yaw); this.target.x += (-c * dx - s * dy) * k; this.target.z += (s * dx - c * dy) * k; this.focusBot = null; }
  /** 鍵盤 + 搖桿 → 移動向量 */
  get move() {
    const K = this.keys; let x = (K.has('d') || K.has('arrowright') ? 1 : 0) - (K.has('a') || K.has('arrowleft') ? 1 : 0), y = (K.has('w') || K.has('arrowup') ? 1 : 0) - (K.has('s') || K.has('arrowdown') ? 1 : 0);
    if (x || y) { const l = Math.hypot(x, y); x /= l; y /= l; }
    x += this.joy.x; y += this.joy.y; const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; }
    return { x, y, run: K.has('shift') || Math.hypot(this.joy.x, this.joy.y) > 0.92 };
  }
  /** 螢幕座標 → 甲板上的點（只選目前可見的甲板，取最近交點） */
  pickFloor(cx, cy) {
    const g = this.game; const r = this.dom.getBoundingClientRect(); const ndc = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    this.rc.setFromCamera(ndc, g.camera); let best = null;
    for (const d of g.ship.decks) {
      if (!d.group.visible) continue; d.group.updateWorldMatrix(true, false);
      const inv = new THREE.Matrix4().copy(d.group.matrixWorld).invert(); const o = this.rc.ray.origin.clone().applyMatrix4(inv), dir = this.rc.ray.direction.clone().transformDirection(inv);
      if (Math.abs(dir.y) < 1e-5) continue; const t = -o.y / dir.y; if (t < 0) continue; const x = o.x + dir.x * t, z = o.z + dir.z * t;
      if (!pointInPoly(x, z, d.poly)) continue; if (!best || t < best.t) best = { t, deck: d.index, x, z };
    }
    return best;
  }
  update(dt) {
    const g = this.game; const cam = g.camera;
    if (this.mode === 'follow') {
      const p = g.player.avatar.group.getWorldPosition(this.tmp); p.y += 1.25; this.target.lerp(p, 1 - Math.exp(-9 * dt));
    } else if (this.mode === 'overview') { this.target.lerp(this.tgtOver, 1 - Math.exp(-4 * dt)); }
    else if (this.focusBot) { const p = this.focusBot.worldPos(this.tmp); p.y += 1; this.target.lerp(p, 1 - Math.exp(-6 * dt)); }
    const cp = Math.cos(this.pitch);
    cam.position.set(this.target.x + Math.sin(this.yaw) * cp * this.dist, this.target.y + Math.sin(this.pitch) * this.dist, this.target.z + Math.cos(this.yaw) * cp * this.dist);
    if (cam.position.y < 1.5) cam.position.y = 1.5;
    cam.lookAt(this.target); cam.fov = this.mode === 'overview' ? 40 : 48; cam.updateProjectionMatrix();
  }
}
