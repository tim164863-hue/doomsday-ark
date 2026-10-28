// 即時海圖：全螢幕覆蓋層（2D canvas）。戰爭迷霧、5 個海域、出生點、方舟與航線、艦隊任務、海上事件決定。
// 資料都來自 state.fleet.world / ships；所有動作透過 play.worldAct()，閒置結果不依賴這個畫面是否打開。
import * as W from '../sim/world.js';
import * as FL from '../sim/fleet.js';
import { EVENTS, pending, eventInfo } from '../sim/seaevents.js';
import { SHIPS, ZONES, ZONE_ORDER, WORLD } from '../sim/fleetdefs.js';
import { clock } from '../clock.js';
import { weatherAt, coldRaw, KINDS, effectsOf, WX } from '../sim/weather.js';

import { SPECIAL_ZONES, SZ_ORDER, zoneAtPoint, routeZones, MATERIALS } from '../sim/szdata.js';
import { routeGate, gateMsg } from '../sim/promo.js';
import { unprepared, seaStatus, rescueCan, RESCUE } from '../sim/seazones.js';

const nowSec = () => clock.now();
const $ = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mmss = (sec) => { sec = Math.max(0, Math.ceil(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`; };
const hex = (c) => (typeof c === 'number' ? '#' + c.toString(16).padStart(6, '0') : String(c));

const szShort = (Z) => { const h = Z.haz, L = []; if (h.slow) L.push(`航速 −${Math.round(h.slow * 100)}%`); if (h.pull) L.push('被拉向中心'); if (h.drift) L.push('偏航'); if (h.hull) L.push('船體受損'); if (h.water) L.push('飲水蒸發'); if (h.strike) L.push('落雷'); if (h.mo) L.push('士氣下滑'); if (h.stuck) L.push('卡住 +30 分'); if (h.rock) L.push('撞石柱'); return L.join('、'); };

export class SeaChart {
  constructor(hud) {
    this.hud = hud; this.open_ = false; this.view = { x: 1000, y: 1000, k: 0.4 }; this.sel = null; this.ptrs = new Map(); this.fogKey = ''; this.mini = document.createElement('canvas'); this.mini.width = this.mini.height = WORLD.grid;
    this.el = $(`<div id="seachart" class="hide"><canvas></canvas><div class="scTop"><b>🧭 海圖</b><span class="scSub"></span><span class="sp"></span><button data-a="zi">＋</button><button data-a="zo">－</button><button data-a="home">⌂ 方舟</button><button data-a="panel" title="收合 / 展開資訊面板">📋</button><button data-a="close">✕</button></div><div class="scPanel"></div><div class="scConfirm hide"></div></div>`);
    hud.root.append(this.el); this.cv = this.el.querySelector('canvas'); this.ctx = this.cv.getContext('2d'); this.panel = this.el.querySelector('.scPanel'); this.conf = this.el.querySelector('.scConfirm');
    this.el.querySelector('[data-a=close]').onclick = () => this.close(); this.el.querySelector('[data-a=zi]').onclick = () => this.zoom(1.4); this.el.querySelector('[data-a=zo]').onclick = () => this.zoom(1 / 1.4); this.el.querySelector('[data-a=home]').onclick = () => this.center(); this.pbtn = this.el.querySelector('[data-a=panel]'); this.pbtn.onclick = () => this.setPanel(this.panel.classList.contains('collapsed'));
    const cv = this.cv; cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); this.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, moved: 0 }); this.pinch0 = null; });
    cv.addEventListener('pointermove', (e) => { const p = this.ptrs.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.moved += Math.abs(dx) + Math.abs(dy); p.x = e.clientX; p.y = e.clientY;
      if (this.ptrs.size === 1) { this.view.x -= dx / this.view.k; this.view.y -= dy / this.view.k; this.clamp(); } else if (this.ptrs.size === 2) { const [a, b] = [...this.ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (this.pinch0) this.zoom(d / this.pinch0); this.pinch0 = d; } });
    const up = (e) => { const p = this.ptrs.get(e.pointerId); this.ptrs.delete(e.pointerId); this.pinch0 = null; if (p && p.moved < 8 && this.ptrs.size === 0) this.click(e.clientX, e.clientY); };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', (e) => { this.ptrs.delete(e.pointerId); });
    cv.addEventListener('wheel', (e) => { e.preventDefault(); this.zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
    addEventListener('resize', () => this.open_ && this.resize());
  }
  get s() { return this.hud.play.state; }
  isOpen() { return this.open_; }
  /** 資訊面板收合：手機預設收起，點 📋 展開 */
  setPanel(open) { this.panel.classList.toggle('collapsed', !open); this.pbtn.classList.toggle('on', !!open); this._panelUser = true; }
  open() { if (!this.s.fleet || !this.s.fleet.world || !this.s.fleet.world.pos) { this.hud.ui.toast('還沒有世界地圖（需要先有艦隊）'); return; } this.hud.closeModal(); this.open_ = true; this.el.classList.remove('hide'); this.resize(); this.center(); this._panelUser = false; this.setPanel(this.W > 700); this._panelUser = false; this.sel = null; this.conf.classList.add('hide'); this.panelSig = ''; this.refresh(true); this.loop(); }
  close() { this.open_ = false; this.el.classList.add('hide'); }
  toggle() { this.open_ ? this.close() : this.open(); }
  resize() { const r = this.el.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1); this.W = r.width; this.H = r.height; this.cv.width = Math.round(r.width * dpr); this.cv.height = Math.round(r.height * dpr); this.dpr = dpr; this.minK = Math.max(this.W, this.H) / 2200; }
  center() { const w = this.s.fleet.world; const p = W.arkPos(w, nowSec()); this.view.x = p.x; this.view.y = p.y; this.view.k = Math.max(this.minK || 0.2, Math.min(1.1, Math.min(this.W, this.H) / 520)); }
  zoom(f, cx, cy) { const v = this.view; const k = Math.max(this.minK, Math.min(4, v.k * f)); if (cx != null) { const r = this.cv.getBoundingClientRect(); const wx = (cx - r.left - this.W / 2) / v.k + v.x, wy = (cy - r.top - this.H / 2) / v.k + v.y; v.k = k; v.x = wx - (cx - r.left - this.W / 2) / k; v.y = wy - (cy - r.top - this.H / 2) / k; } else v.k = k; this.clamp(); }
  clamp() { const v = this.view; v.x = Math.max(-100, Math.min(2100, v.x)); v.y = Math.max(-100, Math.min(2100, v.y)); }
  toWorld(cx, cy) { const r = this.cv.getBoundingClientRect(); const v = this.view; return [(cx - r.left - this.W / 2) / v.k + v.x, (cy - r.top - this.H / 2) / v.k + v.y]; }
  toScreen(x, y) { const v = this.view; return [(x - v.x) * v.k + this.W / 2, (y - v.y) * v.k + this.H / 2]; }

  click(cx, cy) {
    const [x, y] = this.toWorld(cx, cy); const w = this.s.fleet.world; const now = nowSec();
    if (!W.insideWorld(x, y)) { this.sel = null; this.conf.classList.add('hide'); return; }
    const p = W.arkPos(w, now); const c = W.routeCost(p.x, p.y, x, y); const [gx, gy] = W.cellOf(x, y); const seen = W.fogHas(w, gx, gy);
    this.sel = { x: Math.round(x), y: Math.round(y), c, seen, zone: seen ? W.zoneAt(x, y) : null };
    const zl = seen ? W.zoneLabel(this.sel.zone) : '❓未知海域'; this.buildMini(w); const rz = routeZones(p.x, p.y, x, y).filter((id) => this.szSeen && this.szSeen[id]);
    const warn = rz.map((id) => { const Z = SPECIAL_ZONES[id]; return `<small class="szw" style="color:${Z.color}">⚠ 航線穿過 ${Z.icon}${Z.name}：${szShort(Z)}${unprepared(this.s.fleet, Z) ? '（旗艦階級未達建議，危害 ×1.5）' : ''}</small>`; }).join(''); const lack = this.s.res.fuel < c.fuel + 15; const gate = routeGate(this.s.fleet, p.x, p.y, x, y); const gw = gate ? `<small class="szw" style="color:#ff8a7a">🔒 ${gateMsg(gate.z)}</small>` : '';
    this.conf.innerHTML = `<div class="cf"><b>航向 (${this.sel.x}, ${this.sel.y})</b> · ${zl}<small>距離 ${Math.round(c.dist)} · ⛽${c.fuel}${lack ? '（燃料不足）' : ''} · 約 ${c.minutes} 分鐘（離線也會抵達）</small>${gw}${warn}</div><div class="cb"><button class="pri" data-a="go" ${lack || gate ? 'disabled' : ''}>⚓ 出航</button><button data-a="no">取消</button></div>`;
    this.conf.classList.remove('hide'); this.conf.querySelector('[data-a=no]').onclick = () => { this.sel = null; this.conf.classList.add('hide'); };
    this.conf.querySelector('[data-a=go]').onclick = () => { const r = this.hud.play.worldAct('sail', { x: this.sel.x, y: this.sel.y }); if (r && r.ok) { this.sel = null; this.conf.classList.add('hide'); this.refresh(true); } };
  }

  // ---- 每幀繪製
  loop() { if (!this.open_) return; this.draw(); this.refresh(); requestAnimationFrame(() => this.loop()); }
  buildMini(w) {
    if (this.fogKey === w.fog + '|' + (w.pos ? 1 : 0)) return; this.fogKey = w.fog + '|' + (w.pos ? 1 : 0); const g = this.mini.getContext('2d'); const img = g.createImageData(WORLD.grid, WORLD.grid); const zg = W.zoneGrid(); const pol = [0, 0]; this.polSeen = pol; const szs = {}; this.szSeen = szs;
    for (let cy = 0; cy < WORLD.grid; cy++) for (let cx = 0; cx < WORLD.grid; cx++) {
      const i = (cy * WORLD.grid + cx) * 4; const [px, py] = W.cellCenter(cx, cy); const out = !W.insideWorld(px, py);
      if (out) { img.data.set([4, 8, 14, 255], i); continue; }
      if (W.fogHas(w, cx, cy)) { const c = hex(ZONES[ZONE_ORDER[zg[cy * WORLD.grid + cx]]].color); const n = parseInt(c.slice(1), 16); const sh = 0.82 + ((cx * 7 + cy * 13) % 5) * 0.035; const cr = coldRaw(px, py), ic = Math.max(0, Math.min(1, (cr - 0.25) / 0.65)) * 0.72; if (cr >= WX.circle) pol[py < 1000 ? 0 : 1] = 1; const rgb = [(((n >> 16) & 255) * sh * 0.8) * (1 - ic) + 214 * ic, (((n >> 8) & 255) * sh * 0.8) * (1 - ic) + 236 * ic, ((n & 255) * sh * 0.8) * (1 - ic) + 250 * ic]; const sh2 = zoneAtPoint(px, py); if (sh2) { szs[sh2.id] = 1; const m = 0.4 + 0.45 * sh2.depth, T = sh2.z.tint; for (let q = 0; q < 3; q++) rgb[q] = rgb[q] * (1 - m) + T[q] * m * sh; } img.data.set([rgb[0], rgb[1], rgb[2], 255], i); }
      else { const j = ((cx * 31 + cy * 17) % 4); img.data.set([17 + j, 30 + j, 46 + j, 255], i); }
    }
    g.putImageData(img, 0, 0);
  }
  missionPos(sh, now) {
    const m = sh.m; if (!m || !m.from || !m.to) return null; const p = Math.max(0, Math.min(1, (now - m.start) / (m.end - m.start))); let k; if (p < 0.42) k = p / 0.42; else if (p < 0.58) k = 1; else k = 1 - (p - 0.58) / 0.42; const e = k * k * (3 - 2 * k);
    const a = W.arkPos(this.s.fleet.world, m.start); return { x: m.from.x + (m.to.x - m.from.x) * e, y: m.from.y + (m.to.y - m.from.y) * e, hx: m.from.x, hy: m.from.y, tx: m.to.x, ty: m.to.y, p, a };
  }
  draw() {
    const w = this.s.fleet.world; const g = this.ctx; const now = nowSec(); const v = this.view; this.buildMini(w);
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); g.fillStyle = '#050b14'; g.fillRect(0, 0, this.W, this.H);
    const [x0, y0] = this.toScreen(0, 0), sz = 2000 * v.k; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(this.mini, x0, y0, sz, sz);
    // 世界邊界圓
    const [cxs, cys] = this.toScreen(1000, 1000); g.strokeStyle = '#6aa7d855'; g.lineWidth = 2; g.beginPath(); g.arc(cxs, cys, 980 * v.k, 0, 7); g.stroke();
    // 格線
    g.strokeStyle = '#ffffff0d'; g.lineWidth = 1; g.fillStyle = '#9fc1de66'; g.font = '10px sans-serif'; g.beginPath(); for (let u = 0; u <= 2000; u += 200) { const [a, b] = this.toScreen(u, 0); const [c, d] = this.toScreen(0, u); g.moveTo(a, y0); g.lineTo(a, y0 + sz); g.moveTo(x0, d); g.lineTo(x0 + sz, d); if (a > 0 && a < this.W) g.fillText(u, a + 2, 12); if (d > 0 && d < this.H) g.fillText(u, 2, d - 2); } g.stroke();
    // 出生點
    if (w.spawn) { const [sx, sy] = this.toScreen(w.spawn.x, w.spawn.y); g.fillStyle = '#ffd36b'; g.font = '13px sans-serif'; g.textAlign = 'center'; g.fillText('🏠', sx + 14, sy - 10); g.textAlign = 'left'; }
    // 海域名（只標已看過的）
    g.font = 'bold 12px sans-serif'; g.textAlign = 'center'; for (const z of ZONE_ORDER) { if (!w.seen[z]) continue; const cen = this.zoneLabelPos(z, w); if (!cen) continue; const [lx, ly] = this.toScreen(cen[0], cen[1]); g.fillStyle = '#ffffffb0'; g.fillText(`${ZONES[z].icon}${ZONES[z].name}`, lx, ly - 30); } g.textAlign = 'left';
    // 特殊海域：已看過的畫虛線圈 + 名稱（迷霧只有外緣被揭開後才看得到）
    { const t = performance.now() / 1000; g.textAlign = 'center'; g.lineWidth = 2; for (const id of SZ_ORDER) { if (!this.szSeen || !this.szSeen[id]) continue; const Z = SPECIAL_ZONES[id]; const [zx, zy] = this.toScreen(Z.x, Z.y); const rr = Z.r * v.k; if (zx + rr < 0 || zy + rr < 0 || zx - rr > this.W || zy - rr > this.H) continue; g.setLineDash([7, 6]); g.lineDashOffset = -t * 6; g.strokeStyle = Z.color + 'cc'; g.beginPath(); g.arc(zx, zy, rr, 0, 7); g.stroke(); g.setLineDash([]); g.lineDashOffset = 0;
      const un = unprepared(this.s.fleet, Z); g.font = 'bold 12px sans-serif'; const lab = `${Z.icon}${Z.short}${un ? ' ⚠' : ''}`; g.lineWidth = 3; g.strokeStyle = '#050b14'; g.strokeText(lab, zx, zy + 4); g.fillStyle = Z.color; g.fillText(lab, zx, zy + 4); g.lineWidth = 2; } g.textAlign = 'left'; }
    // 極地名（只標已看過的極圈）與各區天氣圖示（只標已揭開的 400×400 區塊中心；晴 / 多雲不畫）
    g.font = 'bold 12px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#e6f6ffd0'; if (this.polSeen && this.polSeen[0]) { const [lx, ly] = this.toScreen(1000, 120); g.fillText('🐻‍❄️ 北極', lx, ly); } if (this.polSeen && this.polSeen[1]) { const [lx, ly] = this.toScreen(1000, 1890); g.fillText('🐧 南極', lx, ly); }
    { const wxc = this.wxCells(w, now); g.font = '17px sans-serif'; for (const c of wxc) { const [sx, sy] = this.toScreen(c.x, c.y); if (sx < -20 || sy < -20 || sx > this.W + 20 || sy > this.H + 20) continue; g.globalAlpha = 0.45 + 0.4 * c.i; g.fillText(c.icon, sx, sy + 6); } g.globalAlpha = 1; } g.textAlign = 'left';
    // 方舟航線
    const ark = W.arkPos(w, now); if (w.route) { const [a, b] = this.toScreen(ark.x, ark.y), [c, d] = this.toScreen(w.route.x1, w.route.y1); g.setLineDash([6, 5]); g.strokeStyle = '#7ad0ff'; g.lineWidth = 2; g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); g.setLineDash([]); g.strokeStyle = '#7ad0ff'; g.beginPath(); g.arc(c, d, 7, 0, 7); g.stroke(); }
    // 艦隊任務
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 260); this.hits = [];
    for (const sh of this.s.fleet.ships) { if (sh.state !== 'sail') continue; const mp = this.missionPos(sh, now); if (!mp) continue; const [a, b] = this.toScreen(mp.hx, mp.hy), [c, d] = this.toScreen(mp.tx, mp.ty), [px, py] = this.toScreen(mp.x, mp.y);
      g.setLineDash([3, 5]); g.strokeStyle = '#ffffff55'; g.lineWidth = 1; g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); g.setLineDash([]);
      g.fillStyle = '#0b1b2dd0'; g.beginPath(); g.arc(px, py, 11, 0, 7); g.fill(); g.strokeStyle = hex(ZONES[sh.m.zone].color); g.lineWidth = 2; g.stroke(); g.font = '13px sans-serif'; g.textAlign = 'center'; g.fillText(SHIPS[sh.type].icon, px, py + 5);
      if (pending(sh.m, now)) { g.strokeStyle = `rgba(255,120,80,${0.4 + pulse * 0.6})`; g.lineWidth = 3; g.beginPath(); g.arc(px, py, 14 + pulse * 6, 0, 7); g.stroke(); g.fillText('❗', px + 14, py - 12); } g.textAlign = 'left'; }
    // 方舟
    const [ax, ay] = this.toScreen(ark.x, ark.y); const ang = w.route ? Math.atan2(w.route.y1 - w.route.y0, w.route.x1 - w.route.x0) : -Math.PI / 2;
    g.save(); g.translate(ax, ay); g.rotate(ang); g.fillStyle = '#fff'; g.strokeStyle = '#0a2a44'; g.lineWidth = 2; g.beginPath(); g.moveTo(14, 0); g.lineTo(-9, 8); g.lineTo(-5, 0); g.lineTo(-9, -8); g.closePath(); g.fill(); g.stroke(); g.restore();
    g.strokeStyle = `rgba(122,208,255,${0.25 + pulse * 0.3})`; g.lineWidth = 2; g.beginPath(); g.arc(ax, ay, 18 + pulse * 5, 0, 7); g.stroke();
    // 選取
    if (this.sel) { const [sx, sy] = this.toScreen(this.sel.x, this.sel.y); g.strokeStyle = '#ffd36b'; g.lineWidth = 2; g.beginPath(); g.moveTo(sx - 10, sy); g.lineTo(sx + 10, sy); g.moveTo(sx, sy - 10); g.lineTo(sx, sy + 10); g.stroke(); g.setLineDash([4, 4]); g.beginPath(); g.moveTo(ax, ay); g.lineTo(sx, sy); g.stroke(); g.setLineDash([]); }
    // 羅盤
    g.save(); g.translate(44, 92); g.strokeStyle = '#ffffff55'; g.lineWidth = 1; g.beginPath(); g.arc(0, 0, 22, 0, 7); g.stroke(); g.fillStyle = '#ff7a5e'; g.beginPath(); g.moveTo(0, -20); g.lineTo(5, 0); g.lineTo(-5, 0); g.fill(); g.fillStyle = '#fff'; g.font = 'bold 11px sans-serif'; g.textAlign = 'center'; g.fillText('N', 0, -25); g.restore();
    // 比例尺
    g.fillStyle = '#fff'; g.strokeStyle = '#fff'; const bar = 100 * v.k; g.lineWidth = 2; g.beginPath(); g.moveTo(14, this.H - 16); g.lineTo(14 + bar, this.H - 16); g.stroke(); g.font = '11px sans-serif'; g.fillText('100', 14, this.H - 22);
  }
  /** 已揭開區塊的天氣（每秒重算一次） */
  wxCells(w, now) {
    const key = Math.floor(now / 30) + '|' + w.fog; if (this._wxc && this._wxc.key === key) return this._wxc.v; const v = [];
    for (let cy = 0; cy < 5; cy++) for (let cx = 0; cx < 5; cx++) { const x = cx * WX.cell + WX.cell / 2, y = cy * WX.cell + WX.cell / 2; if (!W.insideWorld(x, y)) continue; const [gx, gy] = W.cellOf(x, y); if (!W.fogHas(w, gx, gy)) continue; const wx = weatherAt(now, x, y); if (wx.kind === 'clear' || wx.kind === 'cloudy') { if (wx.show !== 'aurora') continue; } if (wx.i < 0.15) continue; v.push({ x, y, icon: KINDS[wx.show] ? KINDS[wx.show].icon : KINDS[wx.kind].icon, i: wx.i }); }
    this._wxc = { key, v }; return v;
  }
  zoneLabelPos(z, w) { // 已揭開格子中、該海域的重心
    const key = z + w.fog; if (this._zl && this._zl.key === key) return this._zl.v; let sx = 0, sy = 0, n = 0; const zg = W.zoneGrid(); const zi = ZONE_ORDER.indexOf(z);
    for (let cy = 0; cy < WORLD.grid; cy++) for (let cx = 0; cx < WORLD.grid; cx++) if (zg[cy * WORLD.grid + cx] === zi && W.fogHas(w, cx, cy)) { const [px, py] = W.cellCenter(cx, cy); sx += px; sy += py; n++; }
    const v = n ? [sx / n, sy / n] : null; this._zl = { key, v }; this._zlMap = this._zlMap || {}; return v;
  }

  // ---- 側欄：方舟狀態 / 任務 / 事件決定
  refresh(force) {
    if (!this.open_) return; const s = this.s, w = s.fleet.world, now = nowSec(); const ark = W.arkPos(w, now); const zone = W.zoneAt(ark.x, ark.y);
    this.el.querySelector('.scSub').textContent = `${W.zoneLabel(zone)} · (${Math.round(ark.x)}, ${Math.round(ark.y)}) · 已探索 ${Math.round(W.fogCount(w) / (Math.PI * 980 * 980 / 625) * 100)}%`;
    const wxn = weatherAt(now, ark.x, ark.y); const K = KINDS[wxn.show] || KINDS[wxn.kind]; this.el.querySelector('.scSub').textContent += ` · ${K.icon}${wxn.temp}°`;
    const evs = FL.pendingEvents(s, now); const sail = s.fleet.ships.filter((x) => x.state === 'sail'); const sig = JSON.stringify([evs.map((x) => x.id + ':' + x.m.ev.k), sail.map((x) => x.id), !!w.route, Math.floor(s.res.fuel / 5), Math.floor(s.res.parts / 10), wxn.show, Math.round(wxn.i * 5), Math.floor(now / 600), (() => { const h = zoneAtPoint(ark.x, ark.y); return h ? h.id + Math.round(h.depth * 4) : ''; })(), JSON.stringify(s.fleet.mat || 0), Object.keys(s.fleet.bp || {}).length, Object.keys(this.szSeen || {}).join()]);
    if (force || sig !== this.panelSig) { this.panelSig = sig; this.renderPanel(evs, sail, ark, w); if (evs.length && !this._panelUser && this.panel.classList.contains('collapsed')) this.setPanel(true); }
    const eta = this.panel.querySelector('[data-arketa]'); if (eta && w.route) eta.textContent = `剩 ${mmss(w.route.t1 - now)}`;
    this.panel.querySelectorAll('[data-eta]').forEach((el) => { const sh = FL.findShip(s, +el.dataset.id); if (sh && sh.m) el.textContent = `返航 剩 ${mmss(sh.m.end - now)}`; });
  }
  /** 目前天氣 + 效果說明 + 累計紀錄 */
  wxHtml(w, ark, now) {
    const wx = weatherAt(now, ark.x, ark.y), K = KINDS[wx.show] || KINDS[wx.kind], E = effectsOf(wx), L = [];
    if (E.slow > 0.01) L.push(`航速 −${Math.round(E.slow * 100)}%`); if (E.hull > 0) L.push('船體受損'); if (E.strike > 0) L.push('可能被雷擊'); if (E.lucky) L.push('藍圖機率 ×1.5、收穫 ×1.15'); if (wx.kind === 'rain') L.push('接雨水'); if (wx.cold > 0.3) L.push(`暖氣多耗燃料`); if (wx.kind === 'storm') L.push('出海任務更危險');
    const st = w.wx || {}; const rec = [st.hits ? `⚡雷擊 ${st.hits}` : '', st.storm ? `⛈暴風 ${st.storm} 刻` : '', st.snow ? `🌨降雪 ${st.snow} 刻` : '', st.aur ? `🌌極光 ${st.aur} 刻` : ''].filter(Boolean).join('　');
    return `<div class="pk wxp"><h4>${K.icon} 天氣：${K.name} <small>${wx.temp}°C${wx.polar ? ' · ' + (wx.polar === 'north' ? '🐻‍❄️北極圈' : '🐧南極圈') : ''}</small></h4><p>${L.length ? L.join(' · ') : '平穩，沒有特別影響。'}</p>${rec ? `<small class="dim">${rec}</small>` : ''}</div>`;
  }
  /** 特殊海域：目前所在的危害 + 已發現清單 + 材料 / 稀有藍圖；巨石陣中心有古碑按鈕 */
  szPanel(w, ark, now) {
    const s = this.s, st = seaStatus(s, now); this.buildMini(w); const seen = this.szSeen || {}; const cur = st && st.h; const sz = w.sz || {};
    let here = ''; if (cur) { const Z = cur.z; const pz = Z.id === 'stonehenge' && cur.depth >= 0.3; here = `<p style="color:${Z.color}"><b>${Z.icon} 正在 ${Z.name}（深度 ${Math.round(cur.depth * 100)}%）</b><br><small>${szShort(Z)}${st.un ? ' · ⚠ 旗艦階級未達建議，危害 ×1.5' : ''}</small></p>${pz ? '<div class="mb"><button data-a="pz">🗿 讀古碑（每天一次）</button></div>' : ''}${Z.id === 'whirlpool' ? (() => { const rc = rescueCan(s, now); return rc.ok ? `<p class="warn">⛽ 燃料不夠開出去（要 ⛽${Math.ceil(rc.need)}）。</p><div class="mb"><button data-a="rescue">🛟 呼叫拖船（🔩${RESCUE.parts}）</button></div>` : '<p class="dim">開出漩渦：全速往外、或在海圖重新出航；燃料用完時可呼叫拖船。</p>'; })() : ''}`; }
    const chips = SZ_ORDER.map((id) => { const Z = SPECIAL_ZONES[id]; return `<span class="zc ${seen[id] ? '' : 'un'}" style="${seen[id] ? `border-color:${Z.color};color:${Z.color}` : ''}" title="${seen[id] ? Z.blurb : '還沒找到'}">${seen[id] ? Z.icon + Z.short : '❓'}</span>`; }).join('');
    return `<div class="pk szp"><h4>🧭 特殊海域 <small>${SZ_ORDER.filter((i) => seen[i]).length}/5</small></h4>${here}<div class="zonebar">${chips}</div>${this.hud.matHtml(s)}<p class="dim">${cur ? '' : '迷霧、漩渦、火焰、地獄、巨石陣：危險，但掉稀有藍圖與晉升材料。'}${sz.n && Object.keys(sz.n).length ? '' : ''}</p></div>`;
  }
  renderPanel(evs, sail, ark, w) {
    const s = this.s; const now = nowSec();
    const evHtml = evs.map((sh) => { const E = eventInfo(sh.m); return `<div class="evc" data-id="${sh.id}"><div class="eh">${E.icon} <b>${E.name}</b> <small>${SHIPS[sh.type].icon}${esc(sh.name)}</small></div><p>${E.text}</p><div class="eo">${E.opts.map((o, i) => `<button data-a="ev" data-i="${i}"><b>${o.t}</b><small>${o.d}</small></button>`).join('')}</div><small class="dim">不選擇 = 照原計畫（自動）。</small></div>`; }).join('');
    const done = sail.filter((x) => x.m.ev && x.m.ev.c >= 0).map((x) => `<div class="evd">${esc(x.m.ev.txt)}</div>`).join('');
    const ms = sail.map((sh) => `<div class="msn" data-id="${sh.id}"><span>${SHIPS[sh.type].icon}</span><div><b>${esc(sh.name)}</b> → ${ZONES[sh.m.zone].icon}${ZONES[sh.m.zone].name}<small data-eta data-id="${sh.id}"></small></div></div>`).join('') || '<p class="dim">目前沒有船在海上。</p>';
    const seen = ZONE_ORDER.map((z) => `<span class="zc ${w.seen[z] ? '' : 'un'}" style="${w.seen[z] ? `border-color:${hex(ZONES[z].color)};color:${hex(ZONES[z].color)}` : ''}">${w.seen[z] ? ZONES[z].icon + ZONES[z].name : '❓'}</span>`).join('');
    this.panel.innerHTML = `${evHtml}<div class="pk"><h4>⚓ 方舟 ${w.route ? `<small data-arketa></small>` : '<small>停泊中</small>'}</h4><p>${w.route ? `航向 (${Math.round(w.route.x1)}, ${Math.round(w.route.y1)}) ${(() => { const [gx, gy] = W.cellOf(w.route.x1, w.route.y1); return W.fogHas(w, gx, gy) ? W.zoneLabel(W.zoneAt(w.route.x1, w.route.y1)) : '❓未知海域'; })()}` : '點地圖任意位置，決定下一個目的地。'}</p><p class="dim">航速 ${WORLD.arkSpeed}/分 · 每 ${Math.round(1 / WORLD.fuelPerUnit)} 單位耗 ⛽1 · 目前 ⛽${Math.floor(s.res.fuel)}</p>${w.route ? '<div class="mb"><button data-a="stop">⏹ 就地停泊（燃料不退）</button></div>' : ''}</div>
      ${this.wxHtml(w, ark, now)}${this.szPanel(w, ark, now)}<div class="pk"><h4>🚢 海上任務</h4>${ms}${done}</div><div class="pk"><h4>🗺 已發現海域</h4><div class="zonebar">${seen}</div><p class="dim">方舟停在遠海域旁，該海域的任務會更快、收穫更多。船出任務時會順便揭開目的地附近的迷霧。</p></div>`;
    this.panel.querySelectorAll('[data-a=ev]').forEach((b) => { b.onclick = () => { const id = +b.closest('.evc').dataset.id; this.hud.play.worldAct('decide', { id, i: +b.dataset.i }); this.refresh(true); }; });
    const rsb = this.panel.querySelector('[data-a=rescue]'); if (rsb) rsb.onclick = () => { this.hud.play.worldAct('rescue', {}); this.refresh(true); };
    const pzb = this.panel.querySelector('[data-a=pz]'); if (pzb) pzb.onclick = () => this.hud.openPuzzle();
    const st = this.panel.querySelector('[data-a=stop]'); if (st) st.onclick = () => { this.hud.play.worldAct('stop', {}); this.refresh(true); };
  }
}
