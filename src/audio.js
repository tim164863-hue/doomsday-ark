// 程序合成音效（Web Audio，無外部音檔、無授權問題）：
//   · 海浪：循環的棕噪音，經低通濾波，用兩個不同週期的 LFO 做漲退潮起伏 + 一層很輕的浪沫高頻。
//   · 海鷗：白天偶爾一兩聲（鋸齒波 + 滑音 + 顫音 + 帶通），隨機左右聲道。
//   · 海豚：躍出水面時的點擊聲（短促帶通雜訊）+ 口哨（正弦上下滑音），依距離衰減。
//   · 鯨魚：浮上海面時的低頻長鳴（兩個低頻正弦滑音 + 緩慢顫音 + 延遲迴響）。
// 瀏覽器自動播放規則：AudioContext 在第一次使用者手勢（pointerdown / keydown / touchend）後才建立；
// 分頁切到背景時 suspend，回來 resume；音量與開關存在 localStorage 'ark.sound'。
const KEY = 'ark.sound';
const LEVELS = [{ ic: '🔊', v: 0.5 }, { ic: '🔉', v: 0.2 }, { ic: '🔇', v: 0 }];
const rnd = (a, b) => a + Math.random() * (b - a);

export class AudioFX {
  constructor() {
    let lv = 0; try { const j = JSON.parse(localStorage.getItem(KEY) || 'null'); if (j && Number.isInteger(j.lv) && LEVELS[j.lv]) lv = j.lv; } catch (e) { /* 預設 */ }
    this.lv = lv; this.ctx = null; this.master = null; this.nextGull = 6; this.lastEv = {}; this.day = 1; this.helmSpd = 0; this.btns = [];
    this._gesture = () => this.unlock();
    for (const ev of ['pointerdown', 'keydown', 'touchend', 'click']) addEventListener(ev, this._gesture, { passive: true });
    document.addEventListener('visibilitychange', () => this.vis());
    this.syncBtn();
  }
  get level() { return LEVELS[this.lv]; }
  bind(btn) { this.btns.push(btn); btn.onclick = () => this.cycle(); this.syncBtn(); }
  syncBtn() { for (const b of this.btns) { b.textContent = this.level.ic; b.title = '音效：' + ['開（點一下調小）', '小聲（點一下靜音）', '靜音（點一下開啟）'][this.lv]; } }
  cycle() { this.lv = (this.lv + 1) % LEVELS.length; try { localStorage.setItem(KEY, JSON.stringify({ lv: this.lv })); } catch (e) { /* 無痕模式 */ } this.unlock(); this.apply(); this.syncBtn(); }
  apply() {
    if (!this.master || !this.ctx) return; const c = this.ctx; clearTimeout(this._susT);
    if (this.level.v > 0) { if (c.state === 'suspended' && !document.hidden) c.resume().catch(() => {}); this.master.gain.setTargetAtTime(this.level.v, c.currentTime, 0.15); }
    else { this.master.gain.setTargetAtTime(0, c.currentTime, 0.08); this._susT = setTimeout(() => { if (this.level.v === 0 && this.ctx) this.ctx.suspend().catch(() => {}); }, 500); } // 靜音：淡出後直接 suspend，不再空算
  }
  unlock() {
    try {
      if (!this.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; this.ctx = new AC(); this.master = this.ctx.createGain(); this.master.gain.value = 0; this.master.connect(this.ctx.destination); this.buildWaves(); this.apply(); }
      if (this.ctx.state === 'suspended' && !document.hidden && this.level.v > 0) this.ctx.resume().catch(() => {});
    } catch (e) { /* 沒有音訊裝置就靜默 */ }
  }
  vis() { if (!this.ctx) return; if (document.hidden) this.ctx.suspend().catch(() => {}); else if (this.level.v > 0) this.ctx.resume().catch(() => {}); }
  get on() { return !!this.ctx && this.ctx.state === 'running' && this.level.v > 0; }
  noiseBuf(sec, brown) { const c = this.ctx, n = Math.floor(c.sampleRate * sec), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; if (brown) { l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w; } const f = Math.min(2000, n >> 1); for (let i = 0; i < f; i++) { const k = i / f; d[n - f + i] = d[n - f + i] * (1 - k) + d[i] * k; } return b; } // 尾端與開頭交叉淡化，循環無爆音
  buildWaves() {
    const c = this.ctx; this.wave = c.createGain(); this.wave.gain.value = 0.5; this.wave.connect(this.master);
    const mk = (buf, type, f0, q, g) => { const s = c.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = rnd(0.9, 1.1); const f = c.createBiquadFilter(); f.type = type; f.frequency.value = f0; f.Q.value = q; const gn = c.createGain(); gn.gain.value = g; s.connect(f); f.connect(gn); gn.connect(this.wave); s.start(); return { f, gn }; };
    const brown = this.noiseBuf(6, true), white = this.noiseBuf(4, false);
    const lo = mk(brown, 'lowpass', 520, 0.6, 1.0), foam = mk(white, 'bandpass', 2600, 0.5, 0.0);
    const lfo = (target, depth, hz, ph) => { const o = c.createOscillator(); o.frequency.value = hz; const g = c.createGain(); g.gain.value = depth; o.connect(g); g.connect(target); o.start(c.currentTime + ph); };
    lfo(lo.gn.gain, 0.45, 1 / 8.3, 0); lfo(lo.f.frequency, 220, 1 / 8.3, 0); lfo(lo.gn.gain, 0.2, 1 / 13.1, 1.7); // 漲退潮
    lfo(foam.gn.gain, 0.05, 1 / 8.3, 1.2); foam.gn.gain.value = 0.07;
    this.lo = lo;
  }
  /** 每幀呼叫：isDay(0..1 的白天程度)、helm 速度；白天才會有海鷗 */
  update(dt, dayF, spd) {
    if (!this.on) return; const c = this.ctx; this.day = dayF; this.nextGull -= dt;
    if (this.wave) { const tg = 0.5 + Math.min(0.5, Math.abs(spd || 0) * 0.04); if (Math.abs(tg - (this._wg == null ? -1 : this._wg)) > 0.02) { this._wg = tg; this.wave.gain.setTargetAtTime(tg, c.currentTime, 0.5); } } // 只在目標值有明顯變化時才排程
    if (this.nextGull <= 0) { this.nextGull = rnd(9, 24); if (dayF > 0.5) this.gull(rnd(0.5, 1)); }
  }
  out(pan, gain) { const c = this.ctx; const g = c.createGain(); g.gain.value = gain; if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, pan)); g.connect(p); p.connect(this.master); } else g.connect(this.master); return g; }
  gull(vol = 1) {
    const c = this.ctx, t0 = c.currentTime + 0.02, pan = rnd(-0.8, 0.8), out = this.out(pan, 0.22 * vol), calls = 1 + Math.floor(Math.random() * 3);
    let t = t0; for (let i = 0; i < calls; i++) {
      const len = rnd(0.3, 0.55), o = c.createOscillator(); o.type = 'sawtooth'; const f0 = rnd(1500, 1900);
      o.frequency.setValueAtTime(f0 * 0.78, t); o.frequency.linearRampToValueAtTime(f0 * 1.12, t + len * 0.25); o.frequency.exponentialRampToValueAtTime(f0 * 0.62, t + len);
      const v = c.createOscillator(); v.frequency.value = rnd(28, 40); const vg = c.createGain(); vg.gain.value = 60; v.connect(vg); vg.connect(o.frequency);
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2300; bp.Q.value = 1.3; const e = c.createGain(); e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(1, t + 0.04); e.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(bp); bp.connect(e); e.connect(out); o.start(t); v.start(t); o.stop(t + len + 0.05); v.stop(t + len + 0.05); t += len + rnd(0.05, 0.15);
    }
  }
  dolphin(dist = 30) {
    const c = this.ctx, g = Math.max(0, 1 - dist / 140); if (g < 0.05) return; const out = this.out(rnd(-0.7, 0.7), 0.28 * g), t0 = c.currentTime + 0.02;
    const nb = this._clickBuf || (this._clickBuf = this.noiseBuf(0.05, false));
    const n = 5 + Math.floor(Math.random() * 6); for (let i = 0; i < n; i++) { const s = c.createBufferSource(); s.buffer = nb; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = rnd(4500, 8000); bp.Q.value = 6; const e = c.createGain(); const t = t0 + i * (0.045 - i * 0.002); e.gain.setValueAtTime(1, t); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.018); s.connect(bp); bp.connect(e); e.connect(out); s.start(t); s.stop(t + 0.03); }
    const tw = t0 + 0.35, len = rnd(0.35, 0.6), o = c.createOscillator(); o.type = 'sine'; const f = rnd(2300, 3200); o.frequency.setValueAtTime(f, tw); o.frequency.exponentialRampToValueAtTime(f * 2.1, tw + len * 0.45); o.frequency.exponentialRampToValueAtTime(f * 1.3, tw + len);
    const e = c.createGain(); e.gain.setValueAtTime(0.0001, tw); e.gain.exponentialRampToValueAtTime(0.7, tw + 0.05); e.gain.exponentialRampToValueAtTime(0.0001, tw + len); o.connect(e); e.connect(out); o.start(tw); o.stop(tw + len + 0.05);
  }
  whale(dist = 60) {
    const c = this.ctx, g = Math.max(0, 1 - dist / 220); if (g < 0.05) return; const t0 = c.currentTime + 0.05, len = 4.2, out = this.out(rnd(-0.5, 0.5), 0.5 * g);
    const nodes = [out]; const dl = c.createDelay(1); dl.delayTime.value = 0.35; const fb = c.createGain(); fb.gain.value = 0.35; dl.connect(fb); fb.connect(dl); const wet = c.createGain(); wet.gain.value = 0.4; dl.connect(wet); wet.connect(out); nodes.push(dl, fb, wet);
    for (const [m, a] of [[1, 1], [2.01, 0.35]]) { const o = c.createOscillator(); o.type = 'sine'; const f = rnd(70, 95) * m; o.frequency.setValueAtTime(f, t0); o.frequency.exponentialRampToValueAtTime(f * 2.3, t0 + len * 0.4); o.frequency.exponentialRampToValueAtTime(f * 1.5, t0 + len);
      const v = c.createOscillator(); v.frequency.value = 5; const vg = c.createGain(); vg.gain.value = 3 * m; v.connect(vg); vg.connect(o.frequency); const e = c.createGain(); e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(a, t0 + 0.9); e.gain.exponentialRampToValueAtTime(0.0001, t0 + len); o.connect(e); e.connect(out); e.connect(dl); o.start(t0); v.start(t0); o.stop(t0 + len + 0.1); v.stop(t0 + len + 0.1); nodes.push(o, v, e); }
    setTimeout(() => { for (const n of nodes) { try { n.disconnect(); } catch (e) { /* 已斷開 */ } } }, (len + 4) * 1000); // 迴響尾音衰減後，明確斷開延遲迴路
  }
  /** sealife 事件：kind = 'dolphin' | 'whale'；dist = 與鏡頭的距離（公尺） */
  event(kind, dist) { if (!this.on) return; const now = performance.now(); if (now - (this.lastEv[kind] || 0) < (kind === 'whale' ? 8000 : 1800)) return; this.lastEv[kind] = now; if (kind === 'dolphin') this.dolphin(dist); else if (kind === 'whale') this.whale(dist); }
}
