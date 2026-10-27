import * as THREE from 'three';
import { on } from '../events.js';
import { MOODS } from '../crew/mood.js';
import { fmtClock } from '../util.js';
import { MODE_NAMES } from '../controls.js';
import { NAMES, TITLES } from '../ship/ship.js';

const ACT = { match: '打球對戰', arcade: '玩街機', bar: '吧台小酌', lounge: '躺椅曬/看星', swim: '泳池游泳', tub: '泡按摩池', treadmill: '跑步機', bench: '重訓', jog: '操場慢跑', hoop: '投籃', eat: '吃飯', chat: '聊天', rail: '看海', tv: '看比賽直播', coffee: '喝咖啡' };
const STATUS = { work: ['工作中', '#5fd08a'], rest: ['休息中', '#ffd36b'], off: ['下班', '#8aa0b8'] };
const PHASE = { night: '🌙 夜', dawn: '🌅 黎明', day: '☀️ 白天', dusk: '🌇 黃昏' };
const $ = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };

export class UI {
  constructor(game) {
    this.game = game; this.root = document.getElementById('ui'); this.labelRoot = document.getElementById('labels'); this.labels = new Map(); this.build();
    on('crew', () => this.renderList()); on('elevator', (d) => this.showElevator(d)); on('time', () => this.syncTime()); on('quality', (q) => { this.qsel.value = 'auto'; this.toast('畫質自動降為 ' + q); });
    game.ui = this; game.onModeChange = (m) => { this.camBtn.textContent = '🎥 ' + MODE_NAMES[m]; this.refreshDeckBtns(); };
    setInterval(() => this.renderList(true), 1000);
  }
  build() {
    const g = this.game, r = this.root;
    r.innerHTML = '';
    this.top = $(`<div id="top"><div class="brand"><b>末日方舟</b><span>DOOMSDAY ARK</span></div><div class="chips"><span id="dataChip" class="chip">連線中…</span><span id="phaseChip" class="chip"></span><span id="fpsChip" class="chip dim"></span></div>
      <div class="tools"><select id="qsel" title="畫質"><option value="auto">畫質：自動</option><option value="high">畫質：高</option><option value="mid">畫質：中</option><option value="low">畫質：低</option></select><button id="helpBtn" title="操作說明 (H)">❓</button></div></div>`);
    this.right = $(`<div id="right"><button id="camBtn" title="切換視角 (V)">🎥 追隨</button><button id="panBtn" title="全景：顯示整艘船 (0)">🚢 全景</button><div id="decks"></div><button id="exBtn" title="展開甲板">🗂 展開</button><button id="listBtn" title="成員 (L)">👥 成員</button></div>`);
    this.crewPanel = $(`<div id="crew" class="hide"><div class="hd">👥 船員 <small>點選即可聚焦</small><button class="x">✕</button></div><div class="bd"></div></div>`);
    this.timebar = $(`<div id="timebar" class="collapsed"><div class="row1"><button id="tbBtn" title="攝影模式：只調整畫面光線與時段，不影響遊戲時間／進度"><span class="pm">📷</span><span id="clock"></span><span class="car">▴</span></button>
      <span class="ex"><button data-t="0.27" title="拍攝：日出光線">🌅</button><button data-t="0.5" title="拍攝：正午光線">☀️</button><button data-t="0.745" title="拍攝：日落光線">🌇</button><button data-t="0.96" title="拍攝：星空光線">🌌</button>
      <span class="sep"></span><button id="pp" title="暫停/繼續 (T)">⏸</button><span class="pmL">光線流速</span><button data-s="1" class="sp on">1×</button><button data-s="5" class="sp">5×</button><button data-s="20" class="sp">20×</button>
      <button id="tbSize" title="縮放時間軸：小／中／大">⤢ 中</button></span></div>
      <div class="pmNote ex">📷 攝影模式：只改變畫面光線，<b>不影響遊戲時間／進度</b>（遊戲進度以現實時間計算）</div><input id="slider" class="ex" type="range" min="0" max="1000" step="1"></div>`);
    this.tbSize = localStorage.getItem('ark.tbsize') || 'm'; this.timebar.dataset.size = this.tbSize;
    this.elev = $(`<div id="elevPop" class="hide"><div class="t">🛗 電梯・選擇樓層</div><div class="b"></div></div>`);
    this.help = $(`<div id="help" class="hide"><div class="card"><h2>末日方舟 · 操作說明</h2>
      <div class="cols"><div><h3>🖥 電腦</h3><p><b>W A S D / 方向鍵</b> 移動（Shift 跑步）</p><p><b>點擊地板</b> 自動尋路（可跨樓層）</p><p><b>左鍵拖曳</b> 轉動鏡頭　<b>滾輪</b> 縮放</p><p><b>右鍵拖曳</b> 平移（自由視角）</p><p><b>V</b> 切換 追隨/自由/俯瞰　<b>T</b> 暫停時間</p><p><b>1–5</b> 只看某一層　<b>0</b> 全景　<b>L</b> 成員　<b>H</b> 說明</p></div>
      <div><h3>📱 手機</h3><p><b>左下搖桿</b> 移動</p><p><b>點一下地板</b> 走過去</p><p><b>單指拖曳</b> 轉鏡頭　<b>雙指捏合</b> 縮放</p><p>走到樓梯口自動上下樓；走進電梯會跳出樓層選單。</p></div></div>
      <p class="note">船員的上班/休息/下班狀態來自辦公室公開的 sessions.json（唯讀、每約 2.5 分鐘更新）。本遊戲不會對任何 bot 傳送任何東西。</p><button class="ok">開始航行</button></div></div>`);
    this.toastEl = $(`<div id="toast"></div>`);
    r.append(this.top, this.right, this.crewPanel, this.timebar, this.elev, this.help, this.toastEl);
    this.qsel = this.top.querySelector('#qsel'); this.camBtn = this.right.querySelector('#camBtn'); this.dataChip = this.top.querySelector('#dataChip'); this.phaseChip = this.top.querySelector('#phaseChip'); this.fpsChip = this.top.querySelector('#fpsChip');
    this.qsel.value = g.qLocked && new URLSearchParams(location.search).get('q') == null ? g.qLevel : 'auto'; if (!g.qLocked) this.qsel.value = 'auto';
    this.qsel.onchange = () => { const v = this.qsel.value; if (v === 'auto') { localStorage.removeItem('ark.quality'); g.qLocked = false; this.toast('畫質：自動（依 FPS 調整）'); } else { localStorage.setItem('ark.quality', v); g.qLocked = true; g.setQuality(v); this.toast('畫質：' + v); } };
    this.top.querySelector('#helpBtn').onclick = () => this.toggleHelp(); this.help.querySelector('.ok').onclick = () => { this.toggleHelp(false); localStorage.setItem('ark.helped', '1'); };
    this.camBtn.onclick = () => g.controls.cycleMode(); this.right.querySelector('#panBtn').onclick = () => g.showPanorama();
    this.right.querySelector('#exBtn').onclick = (e) => { const on = g.ship.explodeTarget < 1; g.ship.setExplode(on ? 5 : 0); e.target.classList.toggle('on', on); };
    this.right.querySelector('#listBtn').onclick = () => this.toggleCrew(); this.crewPanel.querySelector('.x').onclick = () => this.toggleCrew(false);
    this.timebar.querySelectorAll('[data-t]').forEach((b) => (b.onclick = () => g.setTime(+b.dataset.t)));
    this.timebar.querySelectorAll('[data-s]').forEach((b) => (b.onclick = () => { g.speed = +b.dataset.s; this.syncTime(); }));
    this.timebar.querySelector('#pp').onclick = () => g.togglePause();
    const tbBtn = this.timebar.querySelector('#tbBtn'); tbBtn.onclick = () => { const c = this.timebar.classList.toggle('collapsed'); tbBtn.querySelector('.car').textContent = c ? '▴' : '▾'; };
    const sz = this.timebar.querySelector('#tbSize'); const SZ = { s: '小', m: '中', l: '大' }; const applySz = () => { this.timebar.dataset.size = this.tbSize; sz.textContent = '⤢ ' + SZ[this.tbSize]; localStorage.setItem('ark.tbsize', this.tbSize); }; applySz();
    sz.onclick = () => { this.tbSize = { s: 'm', m: 'l', l: 's' }[this.tbSize]; applySz(); };
    this.slider = this.timebar.querySelector('#slider'); this.sliding = false;
    this.slider.addEventListener('pointerdown', () => (this.sliding = true)); addEventListener('pointerup', () => (this.sliding = false));
    this.slider.addEventListener('input', () => g.setTime(this.slider.value / 1000));
    const dk = this.right.querySelector('#decks'); this.deckBtns = [];
    for (let i = 4; i >= 0; i--) { const b = $(`<button class="deck${i < 2 ? ' hullDeck' : ''}${i === 1 ? ' hullStart' : ''}" title="${TITLES[i]}"><i></i>${NAMES[i]}${i < 2 ? '<small>船艙</small>' : ''}</button>`); b.onclick = () => g.showDeck(i); dk.appendChild(b); this.deckBtns[i] = b; }
    this.syncTime();
    const eb = this.elev.querySelector('.b'); for (let i = 4; i >= 0; i--) { const b = $(`<button data-d="${i}">${NAMES[i]}<small>${TITLES[i]}</small></button>`); b.onclick = () => { g.player.useElevator(i); this.showElevator(null); }; eb.appendChild(b); }
    if (!localStorage.getItem('ark.helped')) setTimeout(() => this.toggleHelp(true), 1200);
  }
  toast(t) { this.toastEl.textContent = t; this.toastEl.classList.add('show'); clearTimeout(this._tt); this._tt = setTimeout(() => this.toastEl.classList.remove('show'), 2400); }
  toggleHelp(v) { this.help.classList.toggle('hide', v === undefined ? !this.help.classList.contains('hide') : !v); }
  toggleCrew(v) { this.crewPanel.classList.toggle('hide', v === undefined ? !this.crewPanel.classList.contains('hide') : !v); this.renderList(); }
  refreshDeckBtns() { const g = this.game; this.deckBtns.forEach((b, i) => { b.classList.toggle('sel', g.soloDeck === i); b.classList.toggle('here', g.player.deck === i); }); this.right.querySelector('#panBtn').classList.toggle('sel', g.controls.mode === 'overview'); }
  showElevator(d) { if (d == null) { this.elev.classList.add('hide'); return; } this.elev.classList.remove('hide'); this.elev.querySelectorAll('button').forEach((b) => (b.disabled = +b.dataset.d === d)); }
  syncTime() { const g = this.game; this.timebar.querySelector('#pp').textContent = g.paused ? '▶' : '⏸'; this.timebar.querySelectorAll('.sp').forEach((b) => b.classList.toggle('on', +b.dataset.s === g.speed)); }
  renderList(light) {
    if (this.crewPanel.classList.contains('hide')) return; const g = this.game; const bd = this.crewPanel.querySelector('.bd'); const bots = [...g.crew.bots.values()];
    if (!light || this._listN !== bots.length) { bd.innerHTML = ''; this.rows = new Map(); this._listN = bots.length; for (const b of bots) { const row = $(`<div class="row"><span class="mi"></span><div class="nm"><b></b><small></small></div><div class="stt"></div></div>`); row.onclick = () => { g.controls.focusOn(b); if (innerWidth < 700) this.toggleCrew(false); }; bd.appendChild(row); this.rows.set(b, row); } }
    for (const b of bots) { const row = this.rows.get(b); if (!row) continue; const st = STATUS[b.info.cat]; const m = MOODS[b.mood] || MOODS.focus; row.querySelector('.mi').textContent = m.icon; row.querySelector('b').textContent = b.title;
      let sub = b.info.cat === 'work' ? (b.activity === '休息一下' ? '小歇一下' : '敲鍵盤中') : b.info.cat === 'rest' ? (ACT[b.activity] || b.activity || '放鬆') : (b.activity || '休息'); sub = sub + ' · ' + m.name; if (b.info.equity != null) sub += ` · ${b.info.equity.toFixed(1)}U ${b.info.pnl >= 0 ? '+' : ''}${b.info.pnl.toFixed(1)}%`;
      row.querySelector('small').textContent = sub; const s = row.querySelector('.stt'); s.textContent = st[0]; s.style.color = st[1]; s.style.borderColor = st[1]; }
  }
  // ---- 每幀：標籤 + 狀態
  update() {
    const g = this.game; const es = g.envState;
    if (!this.sliding) this.slider.value = Math.round(g.dayT * 1000);
    this.timebar.querySelector('#clock').textContent = '🕒 ' + fmtClock(g.dayT) + ' ' + PHASE[g.phaseKey]; this.phaseChip.textContent = PHASE[g.phaseKey] || '';
    this._fc = (this._fc || 0) + 1;
    if (this._fc % 20 === 0) {
      const d = g.dataInfo; if (d) { this.dataChip.textContent = d.offline ? '🟠 離線示範資料' : '🟢 即時連線 · ' + g.crew.bots.size + ' 位船員'; this.dataChip.className = 'chip ' + (d.offline ? 'warn' : 'ok'); }
      this.fpsChip.textContent = Math.round(g.fps) + ' fps · ' + g.qLevel; this.refreshDeckBtns();
    }
    this.updateLabels();
  }
  makeLabel(b, isPlayer) {
    const el = $(`<div class="lb${isPlayer ? ' me' : ''}"><div class="sp"></div><div class="st"></div><div class="nm"><span class="mi"></span><span class="n"></span></div></div>`);
    el.querySelector('.n').textContent = b.title; if (isPlayer) el.querySelector('.mi').textContent = '👑'; this.labelRoot.appendChild(el);
    el.onclick = () => { if (!isPlayer) this.game.controls.focusOn(b); }; return { el, sp: el.querySelector('.sp'), st: el.querySelector('.st'), mi: el.querySelector('.mi'), last: {} };
  }
  updateLabels() {
    const g = this.game, cam = g.camera, W = g.W, H = g.H; const v = this._v || (this._v = new THREE.Vector3()); const ps = [];
    const items = [...g.crew.bots.values(), g.player];
    for (const b of items) {
      let L = this.labels.get(b); const isP = b === g.player; if (!L) { L = this.makeLabel(b, isP); this.labels.set(b, L); }
      const av = b.avatar; const deckOk = (g.deckVis ? g.deckVis[b.actor.deck] : true) && (g.controls.mode === 'overview' || b.actor.deck === g.viewDeck); const show = deckOk && av.group.visible && !(b.inBath);
      if (!show) { if (L.on !== false) { L.el.style.display = 'none'; L.on = false; } continue; }
      av.group.getWorldPosition(v); v.y += b.sleeping ? 1.3 : 2.15 * (isP ? 1.08 : 1); const dist = cam.position.distanceTo(v); v.project(cam);
      if (v.z > 1 || Math.abs(v.x) > 1.1 || Math.abs(v.y) > 1.1 || dist > 260) { if (L.on !== false) { L.el.style.display = 'none'; L.on = false; } continue; }
      if (L.on !== true) { L.el.style.display = ''; L.on = true; }
      L.el.style.transform = `translate(${((v.x * 0.5 + 0.5) * W).toFixed(1)}px,${((-v.y * 0.5 + 0.5) * H).toFixed(1)}px) translate(-50%,-100%)`;
      const far = dist > 70, mid = dist > 36, xfar = dist > 150; L.el.classList.toggle('xfar', xfar); L.el.classList.toggle('far', far); L.el.classList.toggle('mid', mid && !far); L.el.style.zIndex = 1000 - Math.round(dist);
      if (isP) continue;
      const m = MOODS[b.mood] || MOODS.focus; const icon = b.hurt ? '🤕' : b.sleeping ? '💤' : m.icon; if (L.last.mi !== icon) { L.mi.textContent = icon; L.last.mi = icon; }
      const sp = b.speech && b.speech.until > g.time ? b.speech : null; const spt = sp ? sp.text : ''; if (L.last.sp !== spt) { L.sp.textContent = spt; L.last.sp = spt; L.sp.className = 'sp' + (sp ? ' on ' + sp.kind : ''); }
      let st = ''; if (b.info.equity != null) { const p = b.info.pnl; st = `${b.info.equity.toFixed(1)}U <i class="${p >= 0 ? 'up' : 'dn'}">${p >= 0 ? '+' : ''}${p.toFixed(1)}%</i>${b.info.pos != null ? ' · ' + b.info.pos + '倉' : ''}`; }
      if (L.last.st !== st) { L.st.innerHTML = st; L.last.st = st; L.st.style.display = st ? '' : 'none'; }
    }
  }
}
