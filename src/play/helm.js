// 駕駛母船（G）：直接操控「家」那艘船本身（T董 的郵輪方舟 / 訪客的小旗艦），跟走路的 T董 互不相干。
//  - 油門（W/S 或搖桿上下，放開後保持）+ 舵（A/D 或搖桿左右）；有質量的平滑物理、船尾尾流、轉彎傾斜。
//  - 船員照常在甲板上走動；退出（G / 下錨）後船會慢慢滑行停下。
//  - 與海圖一致：本地航行 = 「當前地圖位置」周圍的微調；位移向量 × K 會推動 fleet.world.pos（滿速≈自動航行速度）、揭開迷霧、少量耗油。
//    自動航行中開始駕駛會先取消航線；航程從 H（船相對出發點的位置）累積，所以開出去再開回來地圖位置也回來。
//  - 其他船（艦隊）作為船團跟著母船：fleetPose 結果經 world() 轉到母船座標系。
import * as THREE from 'three';
import { SHIP_CX } from '../ship/config.js';
import { WORLD, SHIPS } from '../sim/fleetdefs.js';
import * as F from '../sim/fleet.js';
import * as WD from '../sim/world.js';
import { clock } from '../clock.js';
import { waveHeight } from '../world/waves.js';
import { angDiff } from '../util.js';
import { helmStep, toWorld, toLocal, HELM_K, clamp } from './helmphys.js';
export { HELM_K, helmStep };
const nowSec = () => clock.now();
function softDot() {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 2, 32, 32, 31);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export class Helm {
  constructor(game, play) {
    this.g = game; this.p = play; this.on = false; this.piv = game.small ? 0 : SHIP_CX;
    this.x = this.piv; this.z = 0; this.yaw = 0; this.v = 0; this.w = 0; this.thr = 0; this.lean = 0;
    this.cam = new THREE.Vector3(); this.camSave = null; this.prevMode = 'overview'; this.dist0 = 0; this.fuelDebt = 0; this.fuelUsed = 0; this.revT = 0; this.hudT = 0; this.userT = -99; this.edgeT = 0; this.base = { x: this.piv, z: 0 };
    this.group = new THREE.Group(); this.group.name = 'wake'; game.scene.add(this.group); this.puffs = []; this.emitT = 0;
    const geo = new THREE.PlaneGeometry(2, 2); geo.rotateX(-Math.PI / 2); const tex = softDot();
    for (let i = 0; i < 140; i++) { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xeaf6fb, map: tex, transparent: true, opacity: 0, depthWrite: false, fog: false })); m.visible = false; m.renderOrder = 0; this.group.add(m); this.puffs.push({ m, life: 0, max: 1, s0: 1, s1: 2, x: 0, z: 0, yaw: 0, a: 0 }); }
    this.g.helm = this;
  }
  // ------------------------------------------------------------ 規格
  get cfg() {
    const g = this.g; if (!g.small) return { vmax: 11, turn: 0.2, acc: 0.32, dec: 0.5, rudderLag: 1.1, len: 91.2, hw: 13.6, cam: 150, pitch: 0.36, y: 4 };
    const sp = this._spd || 1, len = g.ship.spec.L * g.ship.k, hw = g.ship.spec.W * g.ship.k * 0.5;
    return { vmax: 7 + sp * 4, turn: 0.55 + 0.1 / Math.max(0.6, len / 14), acc: 0.7, dec: 0.9, rudderLag: 2.0, len, hw, cam: Math.max(28, len * 2.5), pitch: 0.5, y: 1.6 };
  }
  get displaced() { return Math.hypot(this.x - this.piv, this.z) > 0.01 || Math.abs(this.yaw) > 1e-4; }
  get speed() { return this.v; }
  // ------------------------------------------------------------ 座標轉換（母船座標系 ↔ 世界）
  world(p) {
    if (!this.displaced) return p; const q = toWorld(this, this.piv, p); return { ...p, x: q.x, z: q.z, yaw: (p.yaw || 0) + this.yaw };
  }
  local(x, z) { return toLocal(this, this.piv, x, z); }
  /** 船的根節點該放的位置（根節點在母船座標原點；擁有者方舟的原點與樞軸差 piv） */
  rootXZ() { const c = Math.cos(this.yaw), s = Math.sin(this.yaw); return [this.x - this.piv * c, this.z + this.piv * s]; }
  // ------------------------------------------------------------ 開始 / 結束
  canStart() {
    const g = this.g, p = this.p; if (g.homeless) return '還沒有船可以駕駛';
    if (p.pilot) return '先把出海的船開回港（結束領航）再駕駛母船'; if (p.gaming) return '先結束手上的小遊戲';
    if (g.small) { const sh = F.homeShip(p.state.fleet); if (!sh) return '還沒有旗艦'; if (sh.state !== 'idle' && sh.state !== 'dock') { const V = p.fleetViews.get(sh.id); if (V && V.pos && V.pos.away) return '旗艦出海中，等它回來再駕駛'; } }
    return null;
  }
  toggle() { return this.on ? this.stop() : this.start(); }
  start() {
    if (this.on) return; const g = this.g, p = this.p, ui = g.ui; const why = this.canStart(); if (why) { ui && ui.toast('⚠️ ' + why); return; }
    if (g.small) { const sh = F.homeShip(p.state.fleet); this._spd = (sh && SHIPS[sh.type] ? SHIPS[sh.type].speed : 1); }
    const w = p.state.fleet && p.state.fleet.world; let note = '';
    if (w && w.route) { const r = F.stopArk(p.state, nowSec()); note = '（已取消自動航行）'; p.save(true); }
    this.on = true; this.thr = Math.max(0, Math.min(1, this.v / this.cfg.vmax)); this.dist0 = 0; this.fuelDebt = 0; this.fuelUsed = 0; this.fuel0 = p.state.res ? p.state.res.fuel : 0;
    const c = g.controls; this.prevMode = c.mode; c.setMode('follow'); this.camSave = { dist: c.dist, pitch: c.pitch, yaw: c.yaw };
    const cf = this.cfg; c.dist = cf.cam; c.pitch = cf.pitch; c.yaw = this.yaw - Math.PI / 2; this.userT = -99; this.updateCam(true);
    document.body.classList.add('helming'); p.hud.showHelmBar(true); g.updateDecks(); g.ui && g.ui.refreshDeckBtns && g.ui.refreshDeckBtns();
    ui && ui.toast((g.small ? '⛵ 駕駛小船' : '🚢 駕駛母船') + note + (document.body.classList.contains('touch') ? '　搖桿轉向 · 按鈕控油門/停車' : '　W/S 油門 · A/D 舵 · Shift 加速 · 空白鍵停車 · G 退出'));
  }
  stop() {
    if (!this.on) return; this.on = false; this.thr = 0; const g = this.g, c = g.controls;
    if (this.camSave) { c.dist = this.camSave.dist; c.pitch = this.camSave.pitch; c.yaw = this.camSave.yaw; } if (this.prevMode && this.prevMode !== 'follow') c.setMode(this.prevMode);
    document.body.classList.remove('helming'); this.p.hud.showHelmBar(false); g.updateDecks(); g.ui && g.ui.refreshDeckBtns && g.ui.refreshDeckBtns();
    this.syncWorld(true); this.p.save(true); g.ui && g.ui.toast('⚓ 已退出駕駛，船慢慢滑行停下');
  }
  // ------------------------------------------------------------ 每幀
  update(dt, time) {
    const g = this.g, c = g.controls; const moving = Math.abs(this.v) > 0.02 || Math.abs(this.w) > 0.0005;
    if (this.on && this.p.state.fleet && this.p.state.fleet.world && this.p.state.fleet.world.route) { this.g.ui && this.g.ui.toast('⚓ 已啟動自動航行，退出手動駕駛'); this.stop(); }
    if (this.on) {
      const inp = c.move; const rate = 1.0; const run = inp.run;
      if (Math.abs(inp.y) > 0.12) this.thr = clamp(this.thr + inp.y * rate * dt * (run ? 1.6 : 1), -0.35, run ? 1.35 : 1);
      if (!run && this.thr > 1) this.thr = Math.max(1, this.thr - 0.8 * dt);
      if (c.keys.has(' ') || c.keys.has('x')) this.thr = 0;
      this.input = { thr: this.thr, rud: -inp.x };
      if (this.fuelOk0()) this.burn((g.small ? 0.05 : 0.1) * Math.min(1.35, Math.abs(this.thr)) * (g.wxHelm ? g.wxHelm.fuel : 1) * dt);
    } else this.input = { thr: 0, rud: 0 };
    if (this.on || moving || this.displaced) {
      const cfg = this.cfg; const st = { v: this.v, w: this.w, yaw: this.yaw, x: this.x, z: this.z };
      const fuel = this.on ? this.fuelOk() : true; const ip = { thr: fuel ? this.input.thr : 0, rud: this.input.rud };
      const hf = g.wxHelm; if (hf) cfg.vmax *= hf.speed; // 暴風 / 下雪：最高速度下降（跟自動航行 / 離線一樣用 sim/weather.js 的係數）
      helmStep(st, ip, cfg, dt); this.limit(st); this.iceHit(st, cfg);
      const ddx = st.x - this.x, ddz = st.z - this.z; if (c.mode !== 'follow' || !this.on) { c.target.x += ddx; c.target.z += ddz; if (c.tgtOver) { c.tgtOver.x += ddx; c.tgtOver.z += ddz; } }
      this.dist0 += Math.hypot(st.x - this.x, st.z - this.z); this.v = st.v; this.w = st.w; this.yaw = st.yaw; this.x = st.x; this.z = st.z;
      const tl = clamp(-this.w * (this.v / cfg.vmax) * (this.g.small ? 1.4 : 2.2), -0.09, 0.09); this.lean += (tl - this.lean) * (1 - Math.exp(-2.2 * dt));
    }
    this.g.ship.lean = this.lean; this.g.ship.yawOff = this.yaw;
    if (this.on) { this.revT += dt; if (this.revT > 1) { this.revT = 0; this.syncWorld(); } this.hudT += dt; if (this.hudT > 0.1) { this.hudT = 0; this.p.hud.updateHelmBar(this); } this.updateCam(false, dt); }
    this.updateWake(dt, time); this.updateOcean();
  }
  /** 在 game.step 裡 ship.update 之後呼叫：把根節點放到母船位置 */
  apply() {
    const sh = this.g.ship; if (!sh) return; if (!this.displaced) { if (this._was) { this._was = false; sh.root.position.x = 0; sh.root.position.z = 0; if (this.g.small) sh.root.rotation.y = 0; } return; }
    this._was = true; const [rx, rz] = this.rootXZ(); sh.root.position.x = rx; sh.root.position.z = rz; if (this.g.small) sh.root.rotation.y = this.yaw;
  }
  homeWorld(p) { return this.world(p); }
  fuelOk() { const s = this.p.state; if (!s || !s.res) return true; if (s.res.fuel < 1) { this.edgeT += 1; if (this.edgeT === 1 || this.edgeT % 600 === 0) this.g.ui && this.g.ui.toast('⛽ 燃料用完了，船只能滑行'); return false; } this.edgeT = 0; return true; }
  fuelOk0() { const s = this.p.state; return !!(s && s.res && s.res.fuel >= 1); }
  /** 引擎本身的耗油（跟地圖航程的耗油分開算；累積到整數才扣，HUD 另外顯示小數） */
  burn(a) { const s = this.p.state; this.fuelUsed += a; if (s && s.res) s.res.fuel = Math.max(0, s.res.fuel - a); }
  /** 冰山碰撞（兩極）：船頭 / 船身兩個圓；撞到 → 推出去、反彈、船體小損傷（2 秒冷卻），浮冰不會撞。 */
  iceHit(st, cfg) {
    const po = this.g.polar; if (!po || !po.items.length) return; const c = Math.cos(st.yaw), sn = -Math.sin(st.yaw), r = Math.max(2, cfg.hw * 0.95), L = cfg.len * 0.3;
    for (const o of [L, 0, -L]) { const b = po.hit(st.x + c * o, st.z + sn * o, r); if (!b) continue;
      const dx = st.x + c * o - b.x, dz = st.z + sn * o - b.z, d = Math.hypot(dx, dz) || 1, need = b.r * 0.85 + r + 0.3; st.x += dx / d * (need - d); st.z += dz / d * (need - d);
      const imp = Math.abs(st.v); st.v *= -0.25; st.w *= 0.5; const now = performance.now();
      if (this.on && imp > 1.2 && now - (this._iceT || 0) > 2000) { this._iceT = now; const s = this.p.state; const dmg = Math.min(2, 0.4 + imp * 0.12); if (s && typeof s.cond === 'number') s.cond = Math.max(0, s.cond - dmg); this.g.ui && this.g.ui.toast('🧊 撞上冰山！船體 −' + dmg.toFixed(1) + '%'); this.g.audio && this.g.audio.event('crash', 10); }
      break; }
  }
  /** 世界邊界：地圖位置推出世界外就停船 */
  limit(st) {
    const w = this.p.state && this.p.state.fleet && this.p.state.fleet.world; if (!w || !w.pos) return;
    const k = HELM_K; const b = this.base; const nx = w.pos.x + (st.x - b.x) * k, ny = w.pos.y + (st.z - b.z) * k;
    if (!WD.insideWorld(nx, ny)) { st.x = this.x; st.z = this.z; st.v *= 0.5; if (this.on && performance.now() - (this._edgeToast || 0) > 4000) { this._edgeToast = performance.now(); this.g.ui && this.g.ui.toast('🌐 那裡已經是世界的盡頭'); } }
  }
  /** 把本地位移累積推到地圖位置（1 Hz；停車 / 退出時 force） */
  syncWorld(force) {
    const p = this.p, s = p.state, w = s && s.fleet && s.fleet.world; if (!w || !w.pos || w.route) { return; }
    const b = this.base; // base = 上次推送到地圖時的船位；增量 × K
    const dx = this.x - b.x, dz = this.z - b.z; const d = Math.hypot(dx, dz); if (d < 0.5 && !force) return; if (d < 1e-6) return;
    const nx = w.pos.x + dx * HELM_K, ny = w.pos.y + dz * HELM_K; if (!WD.insideWorld(nx, ny)) { b.x = this.x; b.z = this.z; return; }
    w.pos = { x: nx, y: ny }; b.x = this.x; b.z = this.z; const n = WD.reveal(w, nx, ny, WORLD.revealArk); if (n) w.explored = (w.explored || 0) + n;
    this.burn(d * HELM_K * WORLD.fuelPerUnit);
    if (this.on && this.g.small === false) { /* 擁有者：無額外處理 */ }
    p.hud.noteHelm && p.hud.noteHelm();
  }
  updateCam(snap, dt = 0.016) {
    const g = this.g, c = g.controls, cf = this.cfg; const x = this.x, z = this.z; const ty = waveHeight(x, z, g.time) * 0.5 + cf.y;
    this.cam.set(x, ty, z);
    const want = this.yaw - Math.PI / 2; const dragging = c.drag && c.pointers.size > 0; if (dragging) this.userT = performance.now(); const idle = performance.now() - this.userT > 2500;
    if (snap) c.yaw = want; else if (idle) c.yaw += angDiff(c.yaw, want) * (1 - Math.exp(-1.1 * dt));
  }
  // ------------------------------------------------------------ 尾流（浮在海面的泡沫斑，漸漸擴散淡出）
  updateWake(dt, time) {
    const cf = this.cfg; const sp = Math.abs(this.v);
    if (sp > 0.6) { this.emitT -= dt; if (this.emitT <= 0) { this.emitT = Math.max(0.05, 1.1 / (1 + sp * 0.9)); this.emit(cf, sp); } }
    const dayF = this.g.envState ? 0.28 + 0.72 * Math.max(0, 1 - (this.g.envState.nightF || 0)) : 1; let n = 0;
    for (const q of this.puffs) { if (q.life <= 0) { if (q.m.visible) q.m.visible = false; continue; } q.life -= dt; n++; if (q.life <= 0) { q.m.visible = false; continue; } const t = 1 - q.life / q.max; const s = q.s0 + (q.s1 - q.s0) * (1 - (1 - t) * (1 - t));
      q.m.position.set(q.x, waveHeight(q.x, q.z, time) * 0.85 + 0.12, q.z); q.m.rotation.y = q.yaw; q.m.scale.set(s * 1.7, 1, s * 0.8); q.m.material.opacity = q.a * (1 - t) * (t < 0.08 ? t / 0.08 : 1) * dayF; }
  }
  emit(cf, sp) {
    const c = Math.cos(this.yaw), s = Math.sin(this.yaw); const sx = this.g.small ? -cf.len * 0.5 : -cf.len * 0.5 + 3; // 母船座標（相對中心）
    const spots = [[sx, 0, 1.0], [sx + cf.len * 0.04, cf.hw * 0.7, 0.8], [sx + cf.len * 0.04, -cf.hw * 0.7, 0.8]]; if (sp > cf.vmax * 0.5) spots.push([cf.len * 0.34, cf.hw * 0.8, 0.5], [cf.len * 0.34, -cf.hw * 0.8, 0.5]);
    for (const [lx, lz, f] of spots) {
      const q = this.puffs.find((e) => e.life <= 0); if (!q) return; const wx = this.x + lx * c + lz * s, wz = this.z - lx * s + lz * c;
      const base = Math.max(cf.hw * 0.3, 1.5); q.x = wx; q.z = wz; q.yaw = this.yaw; q.life = q.max = 7 + Math.min(5, sp * 0.35); q.s0 = base * 0.8; q.s1 = base * (2.0 + sp * 0.1); q.a = clamp(0.18 + sp * 0.03, 0.15, 0.5) * f; q.m.visible = true;
    }
  }
  updateOcean() {
    const g = this.g, u = g.ocean.uniforms; const [rx, rz] = this.rootXZ(); u.uArk.value.set(this.x, this.z, this.yaw, this.piv);
    if (this.displaced || this.on) g.ocean.follow(g.controls.target.x, g.controls.target.z); else if (g.ocean.mesh.position.x || g.ocean.mesh.position.z) g.ocean.follow(0, 0);
  }
}