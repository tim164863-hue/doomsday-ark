// 程序合成音效（Web Audio，無外部音檔、無授權問題）：
//   · 海浪：循環的棕噪音，經低通濾波，用兩個不同週期的 LFO 做漲退潮起伏 + 一層很輕的浪沫高頻。
//   · 海鷗：白天偶爾一兩聲（鋸齒波 + 滑音 + 顫音 + 帶通），隨機左右聲道。
//   · 海豚：躍出水面時的點擊聲（短促帶通雜訊）+ 口哨（正弦上下滑音），依距離衰減。
//   · 鯨魚：浮上海面時的低頻長鳴（兩個低頻正弦滑音 + 緩慢顫音 + 延遲迴響）。
//   · 天氣（setWeather，由 game 每幀餵入）：雨聲（白噪音高低通）、風聲（棕噪音帶通 + 緩慢起伏）、極光（四個泛音正弦 + 慢顫音）；天氣結束 20 秒後整組停止並斷開。
//   · 特殊海域（setZone）：迷霧 / 漩渦 / 火焰 / 地獄 / 巨石陣各一組循環音 + 偶發事件（霧笛、爆裂聲、石鐘）；全部合成，離開 20 秒後整組停止。
//   · 雷聲（thunder：近處霹靂 + 低頻滾動 + 距離延遲）、企鵝叫聲、北極熊低吼。
// 瀏覽器自動播放規則：AudioContext 在第一次使用者手勢（pointerdown / keydown / touchend）後才建立；
// 分頁切到背景時 suspend，回來 resume；音量與開關存在 localStorage 'ark.sound'。
const KEY = 'ark.sound';
const LEVELS = [{ ic: '\ue081', v: 0.5 }, { ic: '\ue082', v: 0.2 }, { ic: '\ue083', v: 0 }];
const rnd = (a, b) => a + Math.random() * (b - a);
const ZERO = { storm: 0, rain: 0, snow: 0, aurora: 0, cold: 0 };

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
    if (this.wave) { const W = this.wxT || ZERO; const tg = Math.max(0.2, 0.5 + Math.min(0.5, Math.abs(spd || 0) * 0.04) + 0.3 * W.storm - 0.25 * W.snow); if (Math.abs(tg - (this._wg == null ? -1 : this._wg)) > 0.02) { this._wg = tg; this.wave.gain.setTargetAtTime(tg, c.currentTime, 0.5); } } // 只在目標值有明顯變化時才排程
    if (this.nextGull <= 0) { this.nextGull = rnd(9, 24); if (dayF > 0.5 && !(this.wxT && (this.wxT.storm > 0.25 || this.wxT.rain > 0.3 || this.wxT.snow > 0.3))) this.gull(rnd(0.5, 1)); }
    this.wxStep(dt); this.zoneStep(dt);
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
  // ------------------------------------------------------------ 天氣
  /** game 每幀（或每次變化）傳入平滑後的天氣強度：{storm, rain, snow, aurora}（0..1）。只存目標值；音訊節點在 update() 內才建 / 調。 */
  setWeather(w) { this.wxT = w; }
  wxStep(dt) {
    const T = this.wxT || ZERO, c = this.ctx; const need = Math.max(T.rain, T.storm, T.snow, T.aurora);
    if (need > 0.02) this.wxIdle = 0; else this.wxIdle = (this.wxIdle || 0) + dt;
    if (!this.wx && need > 0.02) this.buildWx();
    if (this.wx && this.wxIdle > 20) { this.teardownWx(); return; }
    if (!this.wx) return; const g = this.wx.tg;
    const rain = Math.max(T.rain, T.storm * 0.9) * (T.snow > 0.5 ? 0.15 : 1), wind = Math.min(1, 0.12 + T.storm * 0.9 + T.snow * 0.55 + T.rain * 0.3) * (need > 0.02 ? 1 : 0);
    const set = (k, node, v) => { if (Math.abs(v - (g[k] == null ? -1 : g[k])) > 0.015) { g[k] = v; node.gain.setTargetAtTime(v, c.currentTime, 0.8); } };
    set('rain', this.wx.rain, rain * 0.5); set('wind', this.wx.wind, wind * 0.55); set('aur', this.wx.aur, T.aurora * 0.07);
  }
  // ------------------------------------------------------------ 特殊海域（程序合成；強度 = zonefx 的深度 k）
  //  迷霧：低沉的氣墊 + 兩個失諧的空心音 / 漩渦：帶通噪音繞著掃頻 + 低頻咕嚕 / 火焰：低吼 + 隨機爆裂聲 / 地獄：低頻鋸齒嗡鳴 + 滾動悶雷 / 巨石陣：共鳴的和弦 + 偶爾的石鐘聲
  setZone(z) { this.zT = z; }
  zoneStep(dt) {
    const T = this.zT, c = this.ctx; const id = T && T.k > 0.02 ? T.id : '';
    if (id) this.zIdle = 0; else this.zIdle = (this.zIdle || 0) + dt;
    if (!this.zn && id) this.buildZone(); if (this.zn && this.zIdle > 20) { this.teardownZone(); return; } if (!this.zn) return;
    const g = this.zn.tg; for (const k of Object.keys(this.zn.bus)) { const v = k === id ? Math.min(1, T.k * 1.3) : 0; if (Math.abs(v - (g[k] == null ? -1 : g[k])) > 0.015) { g[k] = v; this.zn.bus[k].gain.setTargetAtTime(v, c.currentTime, 1.2); } }
    if (!id) return; this.zn.ev -= dt; if (this.zn.ev > 0) return;
    if (id === 'fire' || id === 'hell') { this.zn.ev = rnd(0.06, id === 'fire' ? 0.35 : 0.8); this.crackle(T.k * (id === 'fire' ? 1 : 0.7)); }
    else if (id === 'stonehenge') { this.zn.ev = rnd(4, 9); this.stoneBell(T.k); }
    else if (id === 'fog') { this.zn.ev = rnd(7, 15); this.foghorn(T.k); }
    else this.zn.ev = rnd(3, 6);
  }
  buildZone() {
    const c = this.ctx, nodes = [], srcs = []; const track = (n) => { nodes.push(n); return n; };
    const bus = {}; const mkBus = (k) => { const gn = track(c.createGain()); gn.gain.value = 0; gn.connect(this.master); bus[k] = gn; return gn; };
    const loop = (buf, rate) => { const s = c.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = rate; srcs.push(s); s.start(); return s; };
    const lfo = (target, depth, hz) => { const o = c.createOscillator(); o.frequency.value = hz; const d = track(c.createGain()); d.gain.value = depth; o.connect(d); d.connect(target); o.start(); srcs.push(o); };
    const osc = (type, f, a, out) => { const o = c.createOscillator(); o.type = type; o.frequency.value = f; const e = track(c.createGain()); e.gain.value = a; o.connect(e); e.connect(out); o.start(); srcs.push(o); return o; };
    const filt = (type, f, q) => { const n = track(c.createBiquadFilter()); n.type = type; n.frequency.value = f; n.Q.value = q; return n; };
    const brown = this._wxBrown || (this._wxBrown = this.noiseBuf(5, true)), white = this._zWhite || (this._zWhite = this.noiseBuf(3, false));
    // 迷霧：空心的低音 + 失諧的兩個音，很慢的顫音
    { const o = mkBus('fog'), lp = filt('lowpass', 280, 0.7); const b = loop(brown, 0.7); b.connect(lp); const gg = track(c.createGain()); gg.gain.value = 0.35; lp.connect(gg); gg.connect(o);
      const f1 = osc('sine', 110, 0.06, o), f2 = osc('sine', 164.8 * 1.012, 0.04, o); osc('triangle', 82.4, 0.04, o); lfo(f1.frequency, 0.6, 0.09); lfo(f2.frequency, 0.9, 0.07); lfo(gg.gain, 0.12, 0.11); }
    // 漩渦：帶通噪音（頻率繞圈掃）+ 咕嚕
    { const o = mkBus('whirlpool'), bp = filt('bandpass', 380, 1.4); const b = loop(brown, 1.1); b.connect(bp); const gg = track(c.createGain()); gg.gain.value = 0.9; bp.connect(gg); gg.connect(o); lfo(bp.frequency, 260, 0.3); lfo(gg.gain, 0.35, 0.3);
      const w = filt('bandpass', 2400, 0.8); const sw = loop(white, 1); sw.connect(w); const wg = track(c.createGain()); wg.gain.value = 0.07; w.connect(wg); wg.connect(o); lfo(wg.gain, 0.05, 0.3); lfo(w.frequency, 900, 0.3);
      const gl = filt('bandpass', 170, 5); const s2 = loop(brown, 0.5); s2.connect(gl); const g2 = track(c.createGain()); g2.gain.value = 0.9; gl.connect(g2); g2.connect(o); lfo(g2.gain, 0.5, 0.9); }
    // 火焰：低吼 + 高頻嘶嘶（爆裂聲另外用 crackle 事件）
    { const o = mkBus('fire'), lp = filt('lowpass', 420, 0.5); const b = loop(brown, 1.3); b.connect(lp); const gg = track(c.createGain()); gg.gain.value = 0.85; lp.connect(gg); gg.connect(o); lfo(gg.gain, 0.3, 0.37);
      const hp = filt('highpass', 3000, 0.5); const w = loop(white, 1); w.connect(hp); const wg = track(c.createGain()); wg.gain.value = 0.025; hp.connect(wg); wg.connect(o); lfo(wg.gain, 0.02, 2.3); }
    // 地獄：低頻鋸齒嗡鳴（兩個略微失諧）+ 滾動的悶雷
    { const o = mkBus('hell'), lp = filt('lowpass', 150, 1.2); lp.connect(o); const a = osc('sawtooth', 41, 0.35, lp), b2 = osc('sawtooth', 41 * 1.011, 0.3, lp), c2 = osc('sawtooth', 61.7, 0.12, lp); lfo(a.frequency, 0.8, 0.13); lfo(c2.frequency, 1.2, 0.17); lfo(lp.frequency, 40, 0.07);
      const r = filt('lowpass', 180, 0.6); const rb = loop(brown, 0.55); rb.connect(r); const rg = track(c.createGain()); rg.gain.value = 1.1; r.connect(rg); rg.connect(o); lfo(rg.gain, 0.5, 0.21); }
    // 巨石陣：共鳴的五度和弦，慢慢呼吸
    { const o = mkBus('stonehenge'); for (const [f, a] of [[98, 0.1], [147, 0.07], [196.6, 0.05], [293.7, 0.03]]) { const e = track(c.createGain()); e.gain.value = 0; e.connect(o); const q = osc('sine', f * (1 + (Math.random() - 0.5) * 0.004), 1, e); lfo(e.gain, a * 0.8, 0.05 + Math.random() * 0.08); e.gain.value = a; } const lp = filt('lowpass', 200, 0.7); const b = loop(brown, 0.6); b.connect(lp); const gg = track(c.createGain()); gg.gain.value = 0.35; lp.connect(gg); gg.connect(o); }
    this.zn = { nodes, srcs, bus, tg: {}, ev: 2 };
  }
  teardownZone() { const w = this.zn; this.zn = null; if (!w) return; for (const s of w.srcs) { try { s.stop(); } catch (e) { /* 已停 */ } } for (const n of w.nodes) { try { n.disconnect(); } catch (e) { /* 已斷開 */ } } }
  /** 火焰 / 地獄的爆裂聲：短促高通噪音，隨機左右 */
  crackle(k) {
    const c = this.ctx, t = c.currentTime + 0.01, out = this.out(rnd(-0.8, 0.8), 0.12 * k * rnd(0.4, 1)); const s = c.createBufferSource(); s.buffer = this._clickBuf || (this._clickBuf = this.noiseBuf(0.05, false)); const hp = c.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = rnd(1400, 5200); hp.Q.value = 1.2;
    const e = c.createGain(); e.gain.setValueAtTime(1, t); e.gain.exponentialRampToValueAtTime(0.0001, t + rnd(0.02, 0.06)); s.connect(hp); hp.connect(e); e.connect(out); s.start(t); s.stop(t + 0.07); setTimeout(() => { try { out.disconnect(); } catch (er) { /* 已斷開 */ } }, 400);
  }
  /** 巨石陣：石鐘（五聲音階的正弦 + 兩個泛音，長衰減） */
  stoneBell(k) {
    const c = this.ctx, t = c.currentTime + 0.02, out = this.out(rnd(-0.6, 0.6), 0.16 * k), f = [196, 220, 261.6, 293.7, 329.6, 392][Math.floor(Math.random() * 6)], len = 3.6; const nodes = [out];
    for (const [m, a, d] of [[1, 1, len], [2.76, 0.35, len * 0.6], [5.4, 0.12, len * 0.35]]) { const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * m; const e = c.createGain(); e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(a, t + 0.01); e.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(e); e.connect(out); o.start(t); o.stop(t + d + 0.05); nodes.push(e); }
    setTimeout(() => { for (const n of nodes) { try { n.disconnect(); } catch (er) { /* 已斷開 */ } } }, (len + 1) * 1000);
  }
  /** 迷霧：遠處的低沉霧笛（兩個低音，緩起緩落） */
  foghorn(k) {
    const c = this.ctx, t = c.currentTime + 0.05, out = this.out(rnd(-0.7, 0.7), 0.2 * k), len = 2.6; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; lp.connect(out); const nodes = [out, lp];
    for (const f of [rnd(70, 88), rnd(70, 88) * 1.5]) { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f * 1.04, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.5); const e = c.createGain(); e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(0.5, t + 0.7); e.gain.exponentialRampToValueAtTime(0.0001, t + len); o.connect(e); e.connect(lp); o.start(t); o.stop(t + len + 0.05); nodes.push(e); }
    setTimeout(() => { for (const n of nodes) { try { n.disconnect(); } catch (er) { /* 已斷開 */ } } }, (len + 1) * 1000);
  }
  buildWx() {
    const c = this.ctx, nodes = [], srcs = []; const track = (n) => { nodes.push(n); return n; };
    const loop = (buf, rate) => { const s = c.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = rate; srcs.push(s); return s; };
    const mkG = () => { const gn = track(c.createGain()); gn.gain.value = 0; gn.connect(this.master); return gn; };
    const white = this.noiseBuf(3, false), brown = this._wxBrown || (this._wxBrown = this.noiseBuf(5, true));
    // 雨：白噪音 → 高通 1.2k → 低通 7k
    const rain = mkG(), rs = loop(white, rnd(0.95, 1.05)), hp = track(c.createBiquadFilter()); hp.type = 'highpass'; hp.frequency.value = 1200; const lp = track(c.createBiquadFilter()); lp.type = 'lowpass'; lp.frequency.value = 7000; rs.connect(hp); hp.connect(lp); lp.connect(rain); rs.start();
    // 風：棕噪音 → 帶通（頻率與音量被兩個慢 LFO 推著走）
    const wind = mkG(), ws = loop(brown, rnd(0.9, 1.1)), bp = track(c.createBiquadFilter()); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.9; ws.connect(bp); bp.connect(wind); ws.start();
    const lfo = (target, depth, hz) => { const o = c.createOscillator(); o.frequency.value = hz; const d = track(c.createGain()); d.gain.value = depth; o.connect(d); d.connect(target); o.start(); srcs.push(o); };
    lfo(bp.frequency, 160, 0.11); lfo(wind.gain, 0.12, 0.17);
    // 極光：C4 G4 C5 G5 泛音，各自微失諧 + 慢顫音
    const aur = mkG(); [[261.63, 1], [392.0, 0.6], [523.25, 0.45], [784.0, 0.25]].forEach(([f, a], i) => { const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * (1 + (i % 2 ? 0.003 : -0.002)); const e = track(c.createGain()); e.gain.value = a * 0.25; const t = c.createOscillator(); t.frequency.value = 0.07 + i * 0.05; const td = track(c.createGain()); td.gain.value = a * 0.2; t.connect(td); td.connect(e.gain); o.connect(e); e.connect(aur); o.start(); t.start(); srcs.push(o, t); });
    this.wx = { nodes, srcs, rain, wind, aur, tg: {} };
  }
  teardownWx() { const w = this.wx; this.wx = null; if (!w) return; for (const s of w.srcs) { try { s.stop(); } catch (e) { /* 已停 */ } } for (const n of w.nodes) { try { n.disconnect(); } catch (e) { /* 已斷開 */ } } }
  /** 雷聲：dist（公尺）。近處先有霹靂（高頻噪音爆裂），再接低頻滾動；遠處只剩悶雷，並依距離延遲（上限 2.5 秒）。 */
  thunder(dist = 300) {
    const c = this.ctx, g = Math.max(0.12, 1 - dist / 1200), delay = Math.min(2.5, dist / 340), t0 = c.currentTime + 0.02 + delay, out = this.out(rnd(-0.6, 0.6), 0.55 * g), nodes = [out];
    const track = (n) => { nodes.push(n); return n; };
    if (dist < 400) { const s = c.createBufferSource(); s.buffer = this._clickBuf || (this._clickBuf = this.noiseBuf(0.05, false)); s.loop = true; const hp = track(c.createBiquadFilter()); hp.type = 'highpass'; hp.frequency.value = 1800; const e = track(c.createGain()); e.gain.setValueAtTime(1.0, t0); e.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35); s.connect(hp); hp.connect(e); e.connect(out); s.start(t0); s.stop(t0 + 0.4); }
    const rb = this._thBuf || (this._thBuf = this.noiseBuf(4.5, true)), s2 = c.createBufferSource(); s2.buffer = rb; const lp = track(c.createBiquadFilter()); lp.type = 'lowpass'; lp.frequency.setValueAtTime(260, t0); lp.frequency.exponentialRampToValueAtTime(90, t0 + 3.6); const e2 = track(c.createGain());
    const len = 3 + (dist < 400 ? 0.8 : 0); e2.gain.setValueAtTime(0.0001, t0 + 0.02); e2.gain.exponentialRampToValueAtTime(1.4, t0 + (dist < 400 ? 0.12 : 0.5)); e2.gain.exponentialRampToValueAtTime(0.5, t0 + 0.9); e2.gain.exponentialRampToValueAtTime(0.9, t0 + 1.3); e2.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
    s2.connect(lp); lp.connect(e2); e2.connect(out); s2.start(t0); s2.stop(t0 + len + 0.1);
    setTimeout(() => { for (const n of nodes) { try { n.disconnect(); } catch (e) { /* 已斷開 */ } } }, (len + delay + 1) * 1000);
  }
  /** 撞冰：低頻悶響 + 一小段碎冰噪音 */
  crash(dist = 10) {
    const c = this.ctx, t0 = c.currentTime + 0.01, out = this.out(0, 0.55), o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(110, t0); o.frequency.exponentialRampToValueAtTime(38, t0 + 0.5);
    const e = c.createGain(); e.gain.setValueAtTime(1, t0); e.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55); o.connect(e); e.connect(out); o.start(t0); o.stop(t0 + 0.6);
    const s = c.createBufferSource(); s.buffer = this._clickBuf || (this._clickBuf = this.noiseBuf(0.05, false)); s.loop = true; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 0.8; const e2 = c.createGain(); e2.gain.setValueAtTime(0.7, t0); e2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25); s.connect(bp); bp.connect(e2); e2.connect(out); s.start(t0); s.stop(t0 + 0.3);
  }
  penguin(dist = 30) {
    const c = this.ctx, g = Math.max(0, 1 - dist / 90); if (g < 0.05) return; const out = this.out(rnd(-0.6, 0.6), 0.2 * g), n = 2 + Math.floor(Math.random() * 3); let t = c.currentTime + 0.02;
    for (let i = 0; i < n; i++) { const len = rnd(0.12, 0.2), o = c.createOscillator(); o.type = 'sawtooth'; const f = rnd(620, 900); o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.5, t + len * 0.5); o.frequency.exponentialRampToValueAtTime(f * 0.9, t + len);
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 2; const e = c.createGain(); e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(1, t + 0.02); e.gain.exponentialRampToValueAtTime(0.0001, t + len); o.connect(bp); bp.connect(e); e.connect(out); o.start(t); o.stop(t + len + 0.03); t += len + rnd(0.04, 0.1); }
  }
  bear(dist = 40) {
    const c = this.ctx, g = Math.max(0, 1 - dist / 160); if (g < 0.05) return; const t0 = c.currentTime + 0.03, len = 1.5, out = this.out(rnd(-0.5, 0.5), 0.4 * g), o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(95, t0); o.frequency.exponentialRampToValueAtTime(55, t0 + len);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 340; lp.Q.value = 3; const am = c.createGain(); am.gain.value = 0.6; const lf = c.createOscillator(); lf.frequency.value = 17; const ld = c.createGain(); ld.gain.value = 0.4; lf.connect(ld); ld.connect(am.gain);
    const e = c.createGain(); e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(1, t0 + 0.25); e.gain.exponentialRampToValueAtTime(0.0001, t0 + len); o.connect(lp); lp.connect(am); am.connect(e); e.connect(out); o.start(t0); lf.start(t0); o.stop(t0 + len + 0.05); lf.stop(t0 + len + 0.05);
  }
  /** 事件：kind = 'dolphin' | 'whale' | 'thunder' | 'penguin' | 'bear'；dist = 與鏡頭的距離（公尺） */
  event(kind, dist) { if (!this.on) return; const now = performance.now(); if (now - (this.lastEv[kind] || 0) < (kind === 'whale' ? 8000 : kind === 'thunder' ? 900 : kind === 'crash' ? 1500 : kind === 'bear' ? 9000 : kind === 'penguin' ? 3500 : 1800)) return; this.lastEv[kind] = now; if (kind === 'dolphin') this.dolphin(dist); else if (kind === 'whale') this.whale(dist); else if (kind === 'thunder') this.thunder(dist); else if (kind === 'crash') this.crash(dist); else if (kind === 'penguin') this.penguin(dist); else if (kind === 'bear') this.bear(dist); }
}
