import * as THREE from 'three';

/** 競賽直播電視：兩台 TV 共用一張動態畫布 */
export class ContestTV {
  constructor() {
    this.canvas = document.createElement('canvas'); this.canvas.width = 768; this.canvas.height = 432;
    this.ctx = this.canvas.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.canvas); this.tex.colorSpace = THREE.SRGBColorSpace; this.tex.anisotropy = 4;
    this.arena = null; this.t = 0; this.draw();
  }
  setArena(arena) { this.arena = arena; this.draw(); }
  draw() {
    const c = this.ctx, W = this.canvas.width, H = this.canvas.height;
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b1626'); g.addColorStop(1, '#050a12'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = '#12304f'; c.fillRect(0, 0, W, 52);
    c.font = 'bold 28px "Noto Sans TC","Microsoft JhengHei",sans-serif'; c.textBaseline = 'middle'; c.fillStyle = '#ffd36b'; c.fillText('🏆 交易競賽 · 直播', 16, 27);
    const live = (Math.floor(this.t * 1.2) % 2 === 0); c.fillStyle = live ? '#ff3b3b' : '#7a1c1c'; c.beginPath(); c.arc(W - 90, 27, 9, 0, 7); c.fill(); c.fillStyle = '#fff'; c.font = 'bold 22px sans-serif'; c.fillText('LIVE', W - 72, 28);
    const a = this.arena;
    if (!a || !a.traders || !a.traders.length) { c.fillStyle = '#7f93a8'; c.font = '28px "Noto Sans TC",sans-serif'; c.textAlign = 'center'; c.fillText('等待賽況訊號…', W / 2, H / 2); c.textAlign = 'left'; this.tex.needsUpdate = true; return; }
    const cols = ['#4fd1ff', '#ffa94d', '#9be564', '#ff7aa8'];
    // 圖表區
    const px = 16, py = 66, pw = W - 32 - 190, ph = H - 66 - 20;
    c.fillStyle = 'rgba(255,255,255,.04)'; c.fillRect(px, py, pw, ph);
    let t0 = Infinity, t1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const tr of a.traders) for (const [t, v] of tr.series || []) { t0 = Math.min(t0, t); t1 = Math.max(t1, t); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
    for (const tr of a.traders) { v0 = Math.min(v0, tr.equity, tr.start); v1 = Math.max(v1, tr.equity, tr.start); }
    const pad = (v1 - v0) * 0.1 || 1; v0 -= pad; v1 += pad; if (!isFinite(t0)) { t0 = 0; t1 = 1; } if (t1 === t0) t1 = t0 + 1;
    c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1; c.fillStyle = '#6f879f'; c.font = '16px sans-serif';
    for (let i = 0; i <= 4; i++) { const y = py + ph - (i / 4) * ph; c.beginPath(); c.moveTo(px, y); c.lineTo(px + pw, y); c.stroke(); c.fillText((v0 + (v1 - v0) * i / 4).toFixed(0), px + 4, y - 8); }
    const sy = py + ph - ((a.traders[0].start - v0) / (v1 - v0)) * ph; c.setLineDash([6, 6]); c.strokeStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(px, sy); c.lineTo(px + pw, sy); c.stroke(); c.setLineDash([]);
    a.traders.forEach((tr, i) => {
      const s = tr.series || []; c.strokeStyle = cols[i % cols.length]; c.lineWidth = 3.2; c.beginPath();
      s.forEach(([t, v], k) => { const x = px + ((t - t0) / (t1 - t0)) * pw, y = py + ph - ((v - v0) / (v1 - v0)) * ph; k ? c.lineTo(x, y) : c.moveTo(x, y); });
      const last = s.length ? s[s.length - 1] : null; const ex = last ? px + ((last[0] - t0) / (t1 - t0)) * pw : px + pw, ey = py + ph - ((tr.equity - v0) / (v1 - v0)) * ph;
      c.lineTo(px + pw, ey); c.stroke(); c.fillStyle = cols[i % cols.length]; c.beginPath(); c.arc(px + pw, ey, 6, 0, 7); c.fill();
    });
    // 排行
    const sorted = [...a.traders].sort((p, q) => q.equity - p.equity);
    c.font = 'bold 22px "Noto Sans TC",sans-serif'; c.fillStyle = '#9fb4c8'; c.fillText('排行', px + pw + 22, 84);
    sorted.forEach((tr, i) => {
      const y = 120 + i * 92; const idx = a.traders.indexOf(tr);
      c.fillStyle = 'rgba(255,255,255,.06)'; c.fillRect(px + pw + 14, y - 22, 164, 80);
      c.fillStyle = cols[idx % cols.length]; c.fillRect(px + pw + 14, y - 22, 5, 80);
      c.font = 'bold 22px "Noto Sans TC",sans-serif'; c.fillText((i === 0 ? '👑 ' : '') + tr.name, px + pw + 28, y);
      c.fillStyle = '#fff'; c.font = 'bold 28px sans-serif'; c.fillText(tr.equity.toFixed(1) + 'U', px + pw + 28, y + 30);
      const pct = ((tr.equity - tr.start) / tr.start) * 100; c.fillStyle = pct >= 0 ? '#4ade80' : '#ff6b6b'; c.font = '20px sans-serif'; c.fillText((pct >= 0 ? '+' : '') + pct.toFixed(1) + '%', px + pw + 28, y + 54);
    });
    this.tex.needsUpdate = true;
  }
  update(dt) { this.t += dt; if (Math.floor(this.t * 1.2) !== this._lf) { this._lf = Math.floor(this.t * 1.2); this.draw(); } }
}
