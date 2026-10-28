// 玩法 HUD：資源列、精簡船員列、互動提示、離線報告、每日任務、出海面板
import { tt } from '../touch.js';
import * as THREE from 'three';
import { MOODS } from '../crew/mood.js';
import * as S from '../sim/sim.js';
import * as FL from '../sim/fleet.js';
import { SeaChart } from './seachart.js';
import { SHIPS, SHIP_ORDER, STARTERS, ZONES, ZONE_ORDER, FLAGSHIP, FLEET_MAX, LV_MAX } from '../sim/fleetdefs.js';
import { RES, RES_KEYS, FAC, FAC_ORDER, SITES, TIERS, LV_MULT, MAX_LV, REPAIR_FAC_COST, REPAIR_HULL, STATUS_BONUS } from '../sim/defs.js';

const $ = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
import { clock } from '../clock.js';
import * as R from '../sim/rel.js';
import * as SZM from '../sim/seazones.js';
import { KIND, spotTaken } from '../play/games.js';
import { CHARS, charById } from '../crew/characters.js';
import { charPreviews } from './charpreview.js';
const nowSec = () => clock.now();
const hm = (ts) => { const d = new Date(ts * 1000); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const dur = (sec) => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return h ? `${h} 小時 ${m} 分` : m ? `${m} 分 ${String(s).padStart(2, '0')} 秒` : `${s} 秒`; };
const mmss = (sec) => { sec = Math.max(0, Math.ceil(sec)); const m = Math.floor(sec / 60), s = sec % 60; return `${m}:${String(s).padStart(2, '0')}`; };
const fmt = (n) => (Math.abs(n) >= 100 ? Math.round(n) : Math.round(n * 10) / 10);
const costHTML = (c, s) => Object.keys(c).map((k) => `<span class="${s && s.res[k] < c[k] ? 'lack' : ''}">${RES[k].icon}${c[k]}</span>`).join(' ');
const EV_ICON = { seazone: '🧭', weather: '🌦', storm: '⛈', shortage: '⚠️', trip: '🚣', sick: '🤒', recover: '💪', crate: '🎁', rain: '🌧', build: '🔨', fight: '💢', makeup: '🤝', party: '🎉', celebrate: '🎊', help: '🩹', meal: '🍽' };
const CAT_ICON = { work: '⌨️', rest: '🛋', off: '😴' };
const REASON = { focus: '專心工作中', happy: '心情不錯', tired: '有點累了', anxious: '有點不安', bored: '有點無聊' };

export class HUD {
  constructor(game) {
    this.game = game; this.ui = game.ui; this.play = null; this.root = game.ui.root; this.tags = new Map(); this.log = []; this.modalKind = null; this.crewOpen = innerWidth > 700; this.rows = new Map(); this.moreOpen = false;
    this.bar = $(`<div id="resbar"><div class="rcs"></div><div class="racts"><button class="rb" id="btnTasks" title="每日任務 (J)">📋<span class="bdg hide"></span></button><button class="rb" id="btnTrips" title="出海探索 (B)">🚣<span class="bdg hide"></span></button><button class="rb" id="btnFleet" title="艦隊 (F)">⚓<span class="bdg hide"></span></button><button class="rb" id="btnChart" title="海圖 (M)">🧭<span class="bdg hide"></span></button><button class="rb" id="btnHelm" title="駕駛母船 (G)">🛳️</button><button class="rb" id="btnRel" title="船員關係 (R)">💞</button><button class="rb" id="btnCrewL" title="船員列表">👥</button>${game.small ? '<button class="rb" id="btnChar" title="更換角色">🧑‍✈️</button>' : ''}</div></div>`);
    this.crewList = $(`<div id="crewmini"></div>`);
    this.prompt = $(`<div id="prompt" class="hide"></div>`);
    this.modal = $(`<div id="modal" class="hide"><div class="mcard"></div></div>`);
    this.tagLayer = $(`<div id="tags"></div>`); this.pilotBar = $(`<div id="pilotbar" class="hide"><div class="pn"></div><div class="ps"><u></u></div><small class="pt">WASD / 搖桿　Shift 加速</small><button data-a="home" class="pri">🏠 返港</button></div>`);
    this.helmBar = $(`<div id="helmbar" class="hide"><div class="hn">🚢</div><div class="hk"><b class="kt">0.0</b><small>節</small><b class="hd">000°</b><small class="hp"></small></div><div class="ps" title="油門"><u></u></div><small class="pt">W/S 油門 · A/D 舵 · Shift 加速 · 空白鍵停車</small><div class="hs"></div><button data-a="stop">⏹ 停車</button><button data-a="exit" class="pri">⚓ 下錨</button></div>`);
    { const hb = this.bar.querySelector('#btnHelm'); if (hb && game.small) hb.title = '駕駛小船 (G)'; } this.pill = $(`<button id="tlpill" title="資源／選單（點開或收起）"><i>📊</i><span class="pv"></span><i class="wxi"></i><i class="szi" style="display:none"></i><span class="car">▾</span></button>`); this.ui.top.prepend(this.pill); this.pill.onclick = () => { const o = document.body.classList.toggle('tlopen'); this.pill.querySelector('.car').textContent = o ? '▴' : '▾'; this.ui.placeToast && this.ui.placeToast(); };
    this.syncJoy(); this._joyT = setInterval(() => { this.syncJoy(); this.syncBottom(); }, 150); this.root.append(this.tagLayer, this.bar, this.crewList, this.prompt, this.modal, this.pilotBar, this.helmBar); this.helmBar.querySelector('[data-a=stop]').onclick = () => { this.play.helm.thr = 0; }; this.helmBar.querySelector('[data-a=exit]').onclick = () => this.play.helm.stop(); this.bar.querySelector('#btnHelm').onclick = () => this.play.helm.toggle(); this.pilotBar.querySelector('[data-a=home]').onclick = () => this.play.stopPilot(true);
    const rcs = this.bar.querySelector('.rcs');
    for (const k of RES_KEYS) rcs.append($(`<div class="rc" data-k="${k}" title="${RES[k].name}"><i>${RES[k].icon}</i><b>0</b><small></small></div>`));
    rcs.append($(`<div class="rc cond" data-k="cond" title="船體狀況"><i>🛠</i><b>0%</b><span class="bar"><u></u></span></div>`));
    rcs.append($(`<div class="rc wx" data-k="wx" title="目前天氣" style="display:none"><i>🌤</i><b></b></div><div class="rc sz" data-k="sz" title="特殊海域" style="display:none"><i>🌀</i><b></b></div>`));
    this.bar.querySelector('#btnTasks').onclick = () => this.openModal('tasks'); this.bar.querySelector('#btnTrips').onclick = () => this.openModal('trips'); this.bar.querySelector('#btnFleet').onclick = () => this.openModal('fleet'); this.bar.querySelector('#btnChart').onclick = () => this.chart.toggle(); this.chart = new SeaChart(this);
    this.bar.querySelector('#btnRel').onclick = () => this.openModal('rel');
    { const cb = this.bar.querySelector('#btnChar'); if (cb) cb.onclick = () => this.openModal('char'); }
    this.bar.querySelector('#btnCrewL').onclick = () => { this.crewOpen = !this.crewOpen; this.renderCrew(true); };
    this.modal.addEventListener('pointerdown', (e) => { if (e.target === this.modal) this.closeModal(); });
    addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.ctrlKey || e.metaKey) return; const k = e.key.toLowerCase();
      if (k === 'escape' && this.modalKind) this.closeModal(); if (k === 'escape' && this.chart.isOpen()) this.chart.close();
      if (k === 'm' && this.play && !this.modalKind && this.ui.help.classList.contains('hide')) { this.chart.toggle(); return; } if (this.chart.isOpen()) return;
      if (!this.play || this.modalKind || !this.ui.help.classList.contains('hide')) return;
      if (k === 'e') { const a = this.play.primary(); if (a) this.doPrimary(a); else if (this.play.target && this.play.target.type === 'bot') this.play.act('chat'); }
      else if (k === 'g') this.play.helm.toggle(); else if (k === 'j') this.openModal('tasks'); else if (k === 'b') this.openModal('trips'); else if (k === 'f') this.openModal('fleet'); else if (k === 'r') this.openModal('rel');
    });
    this.lastPromptKey = '';
  }
  /** 虛擬搖桿只在「走路 / 駕駛」時顯示：任何彈窗、說明、海圖、選船、小遊戲開著就收起來 */
  syncJoy() {
    const g = this.game; const ov = !!this.modalKind || this.helpOpen() || (this.chart && this.chart.isOpen()) || !!document.getElementById('pvbar') || document.body.classList.contains('gaming') || !!document.getElementById('entry') || !!g.homeless || !!document.querySelector('#acctMenu:not([hidden]), #syncdlg');
    document.body.classList.toggle('nojoy', ov); document.body.classList.toggle('homeless', !!g.homeless);
  }
  /** 底部 UI 不重疊：互動卡 / 小遊戲 / 駕駛列出現時自動收起展開的時間列；若使用者又手動展開，卡片會用實測高度往上推 */
  syncBottom() {
    const tb = this.game.ui && this.game.ui.timebar; if (!tb) return; const cl = document.body.classList; const vis = (e) => !!e && !e.classList.contains('hide') && getComputedStyle(e).display !== 'none';
    const busy = vis(this.prompt) || cl.contains('mging') || cl.contains('helming') || vis(this.pilotBar) || vis(this.helmBar);
    if (busy && !this._busy && !tb.classList.contains('collapsed')) { tb.classList.add('collapsed'); const car = tb.querySelector('#tbBtn .car'); if (car) car.textContent = '▴'; }
    this._busy = busy;
    const ex = busy && !tb.classList.contains('collapsed') ? Math.round(tb.offsetHeight + 18) : 0; document.documentElement.style.setProperty('--tbh', ex + 'px'); document.documentElement.style.setProperty('--tbx', (tb.classList.contains('collapsed') ? 0 : Math.round(tb.offsetHeight + 18)) + 'px');
  }
  showHelmBar(on) { this.helmBar.classList.toggle('hide', !on); this.bar.querySelector('#btnHelm').classList.toggle('on', !!on); if (on) this.updateHelmBar(this.play.helm); }
  updateHelmBar(H) {
    const b = this.helmBar, sh = this.play.game.small ? FL.homeShip(this.s.fleet) : null; b.querySelector('.hn').textContent = sh ? `${SHIPS[sh.type].icon} ${sh.name}` : '🚢 母船';
    b.querySelector('.kt').textContent = (Math.abs(H.v) * 1.944).toFixed(1); const bear = ((Math.PI / 2 - H.yaw) * 180 / Math.PI % 360 + 360) % 360; b.querySelector('.hd').textContent = String(Math.round(bear) % 360).padStart(3, '0') + '°';
    const w = this.s.fleet && this.s.fleet.world; b.querySelector('.hp').textContent = w && w.pos ? `📍${w.pos.x.toFixed(2)},${w.pos.y.toFixed(2)}` : '';
    const fl = this.s.res ? this.s.res.fuel : 0; b.querySelector('.hs').textContent = `📍${w && w.pos ? w.pos.x.toFixed(2) + ',' + w.pos.y.toFixed(2) : '-'} · 🧭${Math.round(H.dist0)} m · ⛽−${(H.fuelUsed || 0).toFixed(2)} (${fl.toFixed(1)})`;
    b.querySelector('.ps u').style.width = Math.max(0, Math.min(100, H.thr / 1.35 * 100)) + '%'; b.querySelector('.ps').classList.toggle('rev', H.thr < 0);
  }
  noteHelm() { this._chartDirty = true; }
  showPilotBar(on) { this.pilotBar.classList.toggle('hide', !on); document.body.classList.toggle('piloting', !!on); }
  updatePilotBar(P) { const nm = FL.findShip(this.s, P.id); this.pilotBar.querySelector('.pn').textContent = `${SHIPS[P.type].icon} ${nm ? nm.name : ''}`; this.pilotBar.querySelector('.ps u').style.width = Math.min(100, Math.abs(P.v) / (P.max * 1.7) * 100) + '%'; this.pilotBar.querySelector('button').textContent = P.homing ? '⏳ 返港中…' : '🏠 返港'; }
  attach(play) { this.play = play; this.buildTags(); this.refresh(true); }
  helpOpen() { return !this.ui.help.classList.contains('hide'); }
  get s() { return this.play.state; }

  // ------------------------------------------------------------ 資源列 / 船員列
  refresh(force) {
    if (!this.play) return; const s = this.s; const r = S.rates(s, s.simT); const wc = this.game.wxNow; // 極地（冷）時燃料警戒線拉高到 40：暖氣會一直耗油
    const lowAt = (k) => (k === 'fuel' && wc && wc.cold >= 0.3 ? Math.max(40, RES[k].cap * 0.08) : RES[k].cap * 0.08);
    for (const k of RES_KEYS) {
      const el = this.bar.querySelector(`.rc[data-k="${k}"]`); const net = r[k] - (r.cons[k] || 0); const v = Math.floor(s.res[k]);
      el.querySelector('b').textContent = v; const sm = el.querySelector('small'); sm.textContent = (net >= 0 ? '+' : '') + net.toFixed(1); sm.className = net >= 0 ? 'up' : 'dn';
      el.classList.toggle('low', s.res[k] < lowAt(k) && (k !== 'parts')); el.title = `${RES[k].name} ${v}/${RES[k].cap}　每分鐘：生產 +${r[k].toFixed(2)}　消耗 −${(r.cons[k] || 0).toFixed(2)}`;
    }
    { const cn = (v) => { v = Math.floor(v); return v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'k' : String(v); }; const pv = this.pill.querySelector('.pv'); pv.innerHTML = ['food', 'water', 'fuel'].map((k) => `<span class="${s.res[k] < lowAt(k) ? 'low' : ''}">${RES[k].icon}${cn(s.res[k])}</span>`).join(''); }
    const ce = this.bar.querySelector('.rc.cond'); ce.querySelector('b').textContent = Math.round(s.cond) + '%'; const u = ce.querySelector('u'); u.style.width = s.cond + '%'; u.style.background = s.cond < 30 ? '#ff6b5e' : s.cond < 60 ? '#ffc65e' : '#6fd78f'; ce.classList.toggle('low', s.cond < 30);
    const done = s.daily.tasks.filter((t) => t.progress >= t.target && !t.claimed).length; const bt = this.bar.querySelector('#btnTasks .bdg'); bt.textContent = done; bt.classList.toggle('hide', !done);
    const nTr = s.trips.length; const bb = this.bar.querySelector('#btnTrips .bdg'); bb.textContent = nTr; bb.classList.toggle('hide', !nTr);
    const fl = s.fleet; if (fl) { const bf = this.bar.querySelector('#btnFleet .bdg'); const idle = fl.ships.filter((x) => x.state === 'sail').length; bf.textContent = idle; bf.classList.toggle('hide', !idle); }
    if (fl && fl.world && fl.world.pos) { const evs = FL.pendingEvents(s, nowSec()); const bc = this.bar.querySelector('#btnChart .bdg'); bc.textContent = evs.length; bc.classList.toggle('hide', !evs.length); this._evSeen = this._evSeen || new Set(); for (const sh of evs) { const key = sh.id + ':' + sh.n; if (!this._evSeen.has(key)) { this._evSeen.add(key); this.ui.toast('🧭 海上事件：' + sh.name + ' 需要你的決定（按 M 開海圖）'); } } }
    this.renderCrew(force); this.refreshPrompt(force); this.updateTagStates(); if (this.modalKind) this.refreshModal(force);
  }
  renderCrew(force) {
    const bots = [...this.game.crew.bots.values()]; this.crewList.classList.toggle('closed', !this.crewOpen); this.bar.querySelector('#btnCrewL').classList.toggle('on', this.crewOpen);
    if (!this.crewOpen) return; const st = S.staffOf(this.s); const t = nowSec();
    if (force || this._n !== bots.length) { this._n = bots.length; this.crewList.innerHTML = '<div class="ch">👥 船員 <small>點一下走過去</small></div>'; this.rows.clear(); for (const b of bots) { const row = $(`<div class="cr"><span class="m"></span><span class="n"></span><span class="f"></span><span class="s"></span></div>`); row.onclick = () => { if (b.away) { this.ui.toast(`${b.title} 正在海上`); return; } this.play.walkToBot(b); this.ui.toast('走向 ' + b.title); }; this.crewList.append(row); this.rows.set(b, row); } if (!bots.length) this.crewList.append($(`<div class="cr dim">等待船員資料…</div>`)); }
    for (const b of bots) {
      const row = this.rows.get(b); if (!row) continue; const c = this.s.crew[b.key]; const away = !!(c && c.away); const hurt = !!(c && c.inj > t);
      const f = FAC_ORDER.find((x) => st[x] === b.key); const m = MOODS[b.mood] || MOODS.focus;
      row.querySelector('.m').textContent = hurt ? '🤕' : m.icon; row.querySelector('.n').textContent = b.title; row.querySelector('.f').textContent = f && this.s.fac[f].lv ? FAC[f].icon : '';
      row.querySelector('.s').textContent = away ? '🚣' : hurt ? '🩹' : b.sleeping ? '💤' : CAT_ICON[b.info.cat] || '';
      row.title = `${b.title}　${hurt ? '受傷休養中' : m.name}${f ? '　駐守：' + FAC[f].name : ''}${away ? '　出海中' : ''}`; row.classList.toggle('away', away);
    }
  }

  // ------------------------------------------------------------ 設施標籤（世界 → 螢幕）
  buildTags() {
    for (const f of FAC_ORDER) { const el = $(`<button class="ft"><i>${FAC[f].icon}</i><span class="t">${FAC[f].name}</span><span class="lv"></span></button>`); el.onclick = (e) => { e.stopPropagation(); this.play.walkToFac(f); }; this.tagLayer.append(el); this.tags.set(f, { el, v: new THREE.Vector3(), on: null }); }
  }
  updateTagStates() {
    const s = this.s; for (const f of FAC_ORDER) { const T = this.tags.get(f); const st = s.fac[f]; T.el.classList.toggle('empty', st.lv === 0); T.el.classList.toggle('dmg', st.dmg && st.lv > 0); T.el.querySelector('.lv').textContent = st.lv ? (st.dmg ? '⚠ 故障' : 'Lv' + st.lv) : '＋ 建造'; }
  }
  updateTags() {
    if (!this.play) return; const g = this.game, cam = g.camera, W = g.W, H = g.H; const play = this.play;
    const place = (T, v, deckOk, maxD = 150) => {
      let ok = deckOk; let dist = 0; if (ok) { dist = cam.position.distanceTo(v); v.project(cam); ok = !(v.z > 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05 || dist > maxD); }
      if (!ok) { if (T.on !== false) { T.el.style.display = 'none'; T.on = false; } return; }
      if (T.on !== true) { T.el.style.display = ''; T.on = true; }
      T.el.style.transform = `translate(${((v.x * 0.5 + 0.5) * W).toFixed(1)}px,${((-v.y * 0.5 + 0.5) * H).toFixed(1)}px) translate(-50%,-100%)`; T.el.style.zIndex = 500 - Math.round(dist); T.el.classList.toggle('far', dist > (g.small ? 22 : 60));
    };
    for (const f of FAC_ORDER) { const T = this.tags.get(f); const fv = play.fac[f]; const deckOk = !g.homeless && (g.deckVis ? g.deckVis[fv.deck] : true) && (g.controls.mode === 'overview' || fv.deck === g.viewDeck); fv.worldPos(T.v); place(T, T.v, deckOk); }
    const live = new Set(); for (const tr of this.s.trips) {
      live.add('b' + tr.id); let T = this.tags.get('b' + tr.id); if (!T) { const el = $(`<div class="ft boat"></div>`); this.tagLayer.append(el); T = { el, v: new THREE.Vector3(), on: null }; this.tags.set('b' + tr.id, T); }
      const site = SITES.find((x) => x.id === tr.site); T.el.innerHTML = `🚣 ${esc(site.name)}<small>${tr.crew.map(esc).join('、')} · ${mmss(tr.end - nowSec())}</small>`;
      const w = play.boatWorld(tr.id, T.v); if (w) place(T, T.v, true, 600); else T.el.style.display = 'none';
    }
    for (const [k, T] of this.tags) if (k[0] === 'b' && !live.has(k)) { T.el.remove(); this.tags.delete(k); }
  }

  // ------------------------------------------------------------ 互動提示
  setTarget(t) { this.refreshPrompt(true); }
  refreshPrompt(force) {
    const t = this.play && this.play.target; const el = this.prompt;
    if (!t) { if (!el.classList.contains('hide')) { el.classList.add('hide'); this.lastPromptKey = ''; } return; }
    const s = this.s, now = nowSec(); const key = JSON.stringify(t.type === 'spot' ? ['s', t.id, spotTaken(t.spot), this.play.games.nearBots(t.spot).map((b) => [b.key, b.mood, b.info.cat, !!b.hurt, Math.round(this.play.games.chance(b) * 20)])] : t.type === 'mascot' ? ['m', t.m.bub, t.m.type] : t.type === 'fac' ? [t.id, s.fac[t.id], Object.values(s.res).map(Math.floor), s.cond | 0] : [t.bot.key, t.bot.mood, !!t.bot.hurt, this.moreOpen, (s.cdCheer[t.bot.key] || 0) > now, t.bot.sleeping, t.bot.info.cat]);
    if (!force && key === this.lastPromptKey && !el.classList.contains('hide')) return; this.lastPromptKey = key; el.classList.remove('hide');
    if (t.type === 'spot') this.renderSpotPrompt(t.spot); else if (t.type === 'mascot') this.renderMascotPrompt(t.m); else if (t.type === 'fac') this.renderFacPrompt(t.id); else this.renderBotPrompt(t.bot);
    el.querySelectorAll('button[data-a]').forEach((b) => (b.onclick = () => this.promptClick(b.dataset.a, t, b.dataset.k)));
  }
  renderSpotPrompt(sp) {
    const s = this.s; const K = KIND[sp.kind]; const taken = spotTaken(sp); const best = s.rel && s.rel.best && s.rel.best[sp.kind]; const G = this.play.games; const vs = sp.kind === 'pickle' || sp.kind === 'pingpong';
    const inv = G.nearBots(sp).map((b) => { const aff = R.affOf(s, R.BOSS, b.key); return `<button data-a="invite" data-k="${esc(b.key)}" ${taken ? 'disabled' : ''}>🤝 邀 ${esc(b.title)} <small>${R.label(aff)}·${Math.round(G.chance(b) * 100)}%</small></button>`; }).join('');
    this.prompt.innerHTML = `<div class="ph"><span class="ic">${K.icon}</span><b>${K.name}</b><em>${taken ? '使用中' : '可以玩'}</em>${best ? `<em>🏆 ${best}${K.unit}</em>` : ''}</div><div class="pd">${esc(tt(K.desc))}</div><div class="pb"><button class="pri" data-a="play" ${taken ? 'disabled' : ''}><kbd>E</kbd> ${K.icon} ${vs ? '先跟發球機練習' : '開始玩'}</button>${inv}</div>${inv ? '<div class="pd2" style="opacity:.7">邀請成功率看對方的心情、忙不忙與你們的交情。</div>' : ''}`;
  }
  renderMascotPrompt(m) {
    const bn = m.type === 'benben'; const line = m.bub || (bn ? '戴著圓眼鏡、愛跑步的綠色毛球。' : '紅通通愛心形狀，最愛跟著奔奔。');
    this.prompt.innerHTML = `<div class="ph"><span class="ic">${bn ? '🟢' : '❤️'}</span><b>${bn ? '奔奔' : '抱抱'}</b><em>特別版吉祥物</em></div><div class="pd">${esc(line)}</div><div class="pb"><button class="pri" data-a="poke"><kbd>E</kbd> ${bn ? '摸摸奔奔' : '抱抱抱抱'}（附近船員心情 +）</button></div>`;
  }
  renderFacPrompt(f) {
    const s = this.s, F = FAC[f], st = s.fac[f], r = S.rates(s, s.simT); const stf = S.staffOf(s)[f]; const bot = stf && this.play.botOf(stf); const bonus = S.staffBonus(s, f, s.simT);
    let line = F.desc; if (st.lv && F.res) { const prod = F.base * LV_MULT[st.lv] * (st.dmg ? 0.5 : 1) * (1 + bonus); line = `${F.desc}　產出 ${RES[F.res].icon}${RES[F.res].name} +${prod.toFixed(1)}/分`; } else if (st.lv && f === 'infirmary') line = `${F.desc}（復原時間 ÷${(1 + 0.6 * st.lv).toFixed(1)}）`;
    const staff = stf ? `<div class="pd2">👤 駐守：<b>${esc(stf)}</b>${bot ? '（' + ({ work: '工作中', rest: '休息中', off: '下班' }[bot.info.cat] || '') + (bonus ? `，真實狀態加成 +${Math.round(bonus * 100)}%` : '') + '）' : ''}</div>` : '';
    const btns = []; const nc = S.nextCost(s, f);
    if (st.dmg) btns.push(`<button class="pri" data-a="repair"><kbd>E</kbd> 修理 ${costHTML(REPAIR_FAC_COST, s)}</button>`);
    if (nc && !st.dmg) btns.push(`<button class="${btns.length ? '' : 'pri'}" data-a="build"><kbd>E</kbd> ${st.lv ? '升級到 Lv' + (st.lv + 1) : '建造'} ${costHTML(nc, s)}</button>`);
    if (f === 'workshop' && st.lv) btns.push(`<button data-a="hull" class="${s.cond < 99 && !btns.length ? 'pri' : ''}">🛠 整修船體 +${REPAIR_HULL.gain}% ${costHTML({ parts: REPAIR_HULL.parts }, s)}</button>`);
    if (!nc && !st.dmg && !btns.length) btns.push(`<span class="maxed">已達最高等級 ✨</span>`);
    this.prompt.innerHTML = `<div class="ph"><span class="ic">${F.icon}</span><b>${F.name}</b><em>${st.lv ? 'Lv' + st.lv : '尚未建造'}</em>${st.dmg ? '<em class="bad">故障</em>' : ''}</div><div class="pd">${esc(line)}</div>${staff}<div class="pb">${btns.join('')}</div>`;
  }
  renderBotPrompt(b) {
    const s = this.s, now = nowSec(); const m = MOODS[b.mood] || MOODS.focus; const st = S.staffOf(s); const f = FAC_ORDER.find((x) => st[x] === b.key);
    const cool = (s.cdCheer[b.key] || 0) - now; const sleepy = b.sleeping || b.inBath;
    let info = `${m.icon} ${m.name} · ${{ work: '工作中', rest: '休息中', off: '下班' }[b.info.cat] || ''}${f && s.fac[f].lv ? ' · 駐守' + FAC[f].name : ''}`; if (b.hurt) info = '🤕 受傷休養中 · ' + info;
    const aff = R.affOf(s, R.BOSS, b.key); info += ` · 💞${R.label(aff)}`;
    const more = this.moreOpen ? `<div class="pd2">${esc(b.hurt ? '身體不舒服，需要休息。' : REASON[b.mood] || '')}${b.cheerUntil > Date.now() ? ' · 剛被你打氣 💖' : ''}</div>` : '';
    this.prompt.innerHTML = `<div class="ph"><span class="ic">${b.hurt ? '🤕' : m.icon}</span><b>${esc(b.title)}</b><em>${esc(info)}</em></div>${more}<div class="pb"><button class="pri" data-a="chat" ${sleepy ? 'disabled' : ''}><kbd>E</kbd> 💬 聊天</button><button data-a="mood">👀 看心情</button><button data-a="rel">💞 關係</button><button data-a="cheer" ${sleepy || cool > 0 ? 'disabled' : ''}>💖 打氣${cool > 0 ? ` (${Math.ceil(cool)}s)` : ''}</button></div>`;
  }
  promptClick(a, t, k) {
    if (t.type === 'spot') { if (a === 'invite') this.play.act('invite', { spot: t.spot, bot: this.play.botOf(k) }); else this.play.act('play', t.spot); return; }
    if (a === 'rel') { this.openModal('rel'); return; }
    if (a === 'mood') { this.moreOpen = !this.moreOpen; this.refreshPrompt(true); return; }
    if (t.type === 'mascot') this.play.act(a); else if (t.type === 'fac') this.play.act(a, t.id); else this.play.act(a, t.bot);
  }
  doPrimary(a) { this.play.act(a); }

  // ------------------------------------------------------------ 船員關係
  renderRel() {
    const c = this.modal.querySelector('.mcard'); const s = this.s; const now = nowSec(); const crew = this.game.crew; const keys = [...new Set([...Object.keys(s.crew), ...crew.bots.keys()])].sort(); const nm = (k) => { const b = crew.bots.get(k); return esc(b ? b.title : k); };
    const bar = (v) => `<span class="rbar"><i class="${v < 0 ? 'neg' : 'pos'}" style="${v < 0 ? 'right:50%' : 'left:50%'};width:${Math.min(50, Math.abs(v) / 2)}%"></i></span>`;
    const row = (name, aff, extra = '') => `<li><span class="rn">${name}</span>${bar(aff)}<span class="rv">${R.label(aff)} <small>${aff > 0 ? '+' : ''}${Math.round(aff)}</small>${extra}</span></li>`;
    const boss = keys.map((k) => [k, R.affOf(s, R.BOSS, k)]).sort((a, b) => b[1] - a[1]);
    const pairs = []; for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) { const a = R.affOf(s, keys[i], keys[j]); pairs.push([keys[i], keys[j], a, R.inFeud(s, keys[i], keys[j], now)]); }
    const fr = pairs.filter((p) => p[2] >= R.FRIEND).sort((a, b) => b[2] - a[2]).slice(0, 8), rv = pairs.filter((p) => p[2] <= R.RIVAL || p[3]).sort((a, b) => a[2] - b[2]).slice(0, 8);
    const team = keys.map((k) => [k, R.teamBonus(s, k, now)]).filter((x) => Math.abs(x[1]) >= 0.005);
    const best = s.rel && s.rel.best ? Object.keys(s.rel.best).filter((k) => KIND[k]) : [];
    c.innerHTML = `<h2>💞 船員關係 <button class="x" data-x="close">✕</button></h2><p class="sub">交情會因為一起玩、吃飯、共患難而變好，也會因為摩擦變差；氣氛好駐守效率 +，冷戰時 −。船員偶爾也會吵架、再和好。</p>
      <h3>你 ↔ 船員</h3><ul class="rlist">${boss.length ? boss.map(([k, a]) => row(nm(k), a)).join('') : '<li class="sub">還沒有船員</li>'}</ul>
      <h3>❤️ 好朋友</h3><ul class="rlist">${fr.length ? fr.map((p) => row(`${nm(p[0])} × ${nm(p[1])}`, p[2])).join('') : '<li class="sub">還沒有人特別要好——一起吃飯、打球、度過風暴就會慢慢變熟。</li>'}</ul>
      <h3>⚔️ 對頭 / 冷戰</h3><ul class="rlist">${rv.length ? rv.map((p) => row(`${nm(p[0])} × ${nm(p[1])}`, p[2], p[3] ? ` <em class="bad">💢 冷戰中 ${dur(R.feudUntil(s, p[0], p[1]) - now)}</em>` : '')).join('') : '<li class="sub">目前相安無事。</li>'}</ul>
      <h3>⚙️ 團隊氣氛對效率的影響</h3><ul class="rlist">${team.length ? team.map(([k, b]) => `<li><span class="rn">${nm(k)}</span><span class="rv ${b < 0 ? 'bad' : ''}">${b > 0 ? '+' : ''}${Math.round(b * 100)}%</span></li>`).join('') : '<li class="sub">氣氛普通，沒有加成。</li>'}</ul>
      ${best.length ? `<h3>🏆 個人紀錄</h3><div class="rbest">${best.map((k) => `<span>${KIND[k].icon} ${KIND[k].name} <b>${s.rel.best[k]}${KIND[k].unit}</b></span>`).join('')}</div>` : ''}
      <p class="sub" style="margin-top:8px">${(() => { const ks = [...new Set(this.play.games.spots.map((q) => KIND[q.kind].icon + KIND[q.kind].name))]; return ks.length ? '在 ' + ks.slice(0, 6).join('、') + (ks.length > 6 ? ' 等' : '') + tt(' 旁按 E 就能玩；也可以邀請附近的船員一起。') : '這艘船上暫時沒有可玩的設施。'; })()}</p>`;
    c.querySelector('.x').onclick = () => this.closeModal();
  }

  // ------------------------------------------------------------ 彈窗
  openModal(kind, payload) { this.modalKind = kind; this.payload = payload || this.payload; this.modal.classList.remove('hide'); this.modal.dataset.kind = kind; this.renderModal(); }
  closeModal() { if (this.modalKind === 'fleet' && !this.pvBar) this.play && this.play.clearPreview(); this.modalKind = null; this.modal.classList.add('hide'); this.modalOpenedAt = 0; }
  refreshModal(force) { if (this.modalKind === 'fleet') this.renderFleetLive(force); else if (this.modalKind === 'tasks') this.renderTasksLive(); else if (this.modalKind === 'trips') this.renderTripsLive(); }
  renderModal() { const c = this.modal.querySelector('.mcard'); c.scrollTop = 0; if (this.modalKind === 'report') this.renderReport(); else if (this.modalKind === 'tasks') this.renderTasks(); else if (this.modalKind === 'trips') this.renderTrips(); else if (this.modalKind === 'fleet') this.renderFleet(); else if (this.modalKind === 'pick') this.renderPick(); else if (this.modalKind === 'rel') this.renderRel(); else if (this.modalKind === 'char') this.renderChar(); else if (this.modalKind === 'puzzle') this.renderPuzzle(); }
  logEvent(ev) { this.log.unshift(ev); if (this.log.length > 10) this.log.pop(); }

  // -- 離線報告
  showReport(r) { this.payload = r; this.openModal('report', r); }
  renderReport() {
    const { first, away, rep } = this.payload; const c = this.modal.querySelector('.mcard'); const s = this.s;
    if (first) {
      c.innerHTML = `<h2>🚢 歡迎登上末日方舟，${this.game.owner ? 'T董' : '船長'}！</h2><p class="sub">這艘船即使你不在也會自己運轉（最多補算 48 小時）。</p>
      <ul class="how"><li>🍖💧⛽🔩 <b>四種資源</b>會隨時間生產與消耗，船員越多消耗越多。</li><li>🔨 走近設施<span class="nt">按 <kbd>E</kbd> </span><span class="to">點提示按鈕</span><b>建造／升級／修理</b>；點資源列旁的標籤可自動走過去。</li><li>💬 走近船員可以<b>聊天、看心情、打氣</b>（只影響遊戲裡的小人）。</li><li>🎾 走到<b>遊樂設施</b>（匹克球、桌球、籃框、街機、吧台、躺椅、泡湯…）<span class="nt">按 <kbd>E</kbd> 就能玩：指針掃到綠色區塊時按 <kbd>E</kbd>／點一下。</span><span class="to">點提示按鈕開始玩；指針到綠色區時點大按鈕。</span>可以邀請旁邊的船員一起玩，交情會變好；船員之間也會變成朋友、吵架、和好，點 💞 看關係。</li><li>🚣 點 🚣 派船員<b>出海探索</b>沉船殘骸：風險越高，收穫越多，也可能受傷。</li><li>📋 每天 3 個<b>每日任務</b>，完成可領資源。</li></ul>
      <div class="mb"><button class="pri" data-x="close">開始航行</button></div>`;
    } else {
      const sm = S.summarize(rep); const lost = rep.capped ? '（超過 48 小時的部分不計）' : '';
      const rows = RES_KEYS.map((k) => `<tr><td>${RES[k].icon} ${RES[k].name}</td><td class="up">+${Math.round(rep.produced[k])}</td><td class="dn">−${Math.round(rep.consumed[k])}</td><td><b>${sm.net[k] >= 0 ? '+' : ''}${Math.round(sm.net[k])}</b></td><td class="now">${Math.floor(s.res[k])}</td></tr>`).join('');
      const evs = rep.events.filter((e) => !(e.type === 'trip' && rep.trips.length)).slice(-10).map((e) => `<li><span class="ei">${EV_ICON[e.type] || '•'}</span><span class="et">${hm(e.t)}</span>${esc(e.text)}</li>`).join('') || '<li class="dim">一切平靜，沒有特別的事。</li>';
      const inj = sm.injuries.length ? `<p class="warn">🤕 受傷：${sm.injuries.map(esc).join('、')}</p>` : '';
      const trips = rep.trips.length ? `<h3>🚣 出海成果</h3><ul class="evl">${rep.trips.map((tr) => `<li><span class="ei">${tr.fail ? '🌫' : '📦'}</span>${esc(tr.text)}</li>`).join('')}</ul>` : '';
      c.innerHTML = `<h2>🌅 你不在的時候…</h2><p class="sub">離線 <b>${dur(away)}</b>，已補算 ${rep.ticks} 分鐘的航行 ${lost}</p>
      <table class="rt"><tr><th></th><th>生產</th><th>消耗</th><th>淨變化</th><th>目前</th></tr>${rows}</table>
      <div class="cndl">🛠 船體狀況 ${Math.round(s.cond)}%</div>${inj}${trips}<h3>📜 發生的事</h3><ul class="evl">${evs}</ul>${rep.newDay ? '<p class="note">📋 新的一天，每日任務已更新。</p>' : ''}
      <div class="mb"><button data-x="tasks">📋 今日任務</button><button class="pri" data-x="close">繼續航行</button></div>`;
    }
    c.querySelectorAll('[data-x]').forEach((b) => (b.onclick = () => { if (b.dataset.x === 'tasks') this.openModal('tasks'); else this.closeModal(); }));
  }

  // -- 每日任務
  renderTasks() {
    const c = this.modal.querySelector('.mcard'); c.innerHTML = `<h2>📋 每日任務 <button class="x" data-x="close">✕</button></h2><p class="sub" id="tkSub"></p><div id="tkList"></div><h3>📜 最近消息</h3><ul class="evl" id="tkLog"></ul>`;
    c.querySelector('.x').onclick = () => this.closeModal(); this.renderTasksLive();
  }
  renderTasksLive() {
    const s = this.s, c = this.modal.querySelector('.mcard'); if (!c.querySelector('#tkList')) return; const d = new Date(); const mid = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime() / 1000;
    c.querySelector('#tkSub').textContent = `每天本地時間 00:00 重置，距離重置 ${dur(mid - nowSec())}`;
    const list = c.querySelector('#tkList'); const sig = JSON.stringify(s.daily.tasks.map((t) => [Math.floor(t.progress), t.claimed])); if (list.dataset.sig === sig) return; list.dataset.sig = sig; list.innerHTML = '';
    s.daily.tasks.forEach((t, i) => {
      const pr = Math.min(t.progress, t.target); const ok = pr >= t.target; const el = $(`<div class="tk ${t.claimed ? 'done' : ''}"><div class="tt"><b>${esc(t.text)}</b><small>獎勵 ${costHTML(t.reward)}</small></div><div class="tb"><u style="width:${(pr / t.target) * 100}%"></u><span>${Math.floor(pr)}/${t.target}</span></div><button ${ok && !t.claimed ? 'class="pri"' : 'disabled'} data-i="${i}">${t.claimed ? '已領取' : ok ? '領取' : '進行中'}</button></div>`);
      el.querySelector('button').onclick = () => { this.play.act('claim', i); list.dataset.sig = ''; this.renderTasksLive(); }; list.append(el);
    });
    const lg = c.querySelector('#tkLog'); const items = [...this.s.log].slice(-6).reverse(); lg.innerHTML = items.map((e) => `<li><span class="ei">${EV_ICON[e.type] || '•'}</span><span class="et">${hm(e.t)}</span>${esc(e.text)}</li>`).join('') || '<li class="dim">還沒有消息。</li>';
  }


  // -- 艦隊
  statsRow(type, lv = 1) {
    const st = FL.shipStats({ type, lv }); const B = SHIPS[type];
    return `<span class="st" title="速度">💨 ${st.speed.toFixed(1)}</span><span class="st" title="載貨量（每趟收穫上限）">📦 ${st.cargo}</span><span class="st" title="耐久">🛡 ${st.hull}</span><span class="st" title="火力：降低遇襲風險、提高戰果">🎯 ${st.fp}</span><span class="st zn" title="可航行海域">${B.zones.map((z) => ZONES[z].icon).join('')}</span>`;
  }
  /** 角色挑選（非船東）：10 位角色；點一下立刻換上，存在存檔的 pl.c。 */
  renderChar() {
    const c = this.modal.querySelector('.mcard'); const cur = this.game.charId; let imgs = null;
    const html = () => `<h2>🧑‍✈️ 選擇你的角色 <button class="x" data-x="close">✕</button></h2><p class="sub">點一下就會換上，下次登入還是這位。</p>
    <div class="chargrid">${CHARS.map((ch) => `<button class="chc${ch.id === this.game.charId ? ' on' : ''}" data-c="${ch.id}"><span class="cp">${imgs && imgs[ch.id] ? `<img alt="${ch.name}" src="${imgs[ch.id]}">` : `<i>${ch.tag}</i>`}</span><b>${ch.name}</b><small>${ch.blurb}</small>${ch.id === this.game.charId ? '<em>✔ 使用中</em>' : ''}</button>`).join('')}</div>`;
    const bind = () => { c.querySelector('.x').onclick = () => this.closeModal(); c.querySelectorAll('.chc').forEach((el) => { el.onclick = () => { const id = el.dataset.c; if (id === this.game.charId) return; if (this.game.setChar(id)) { c.innerHTML = html(); bind(); this.ui.toast(`換上「${charById(id).name}」`); } }; }); };
    c.innerHTML = html(); bind();
    setTimeout(() => { if (this.modalKind !== 'char') return; imgs = charPreviews(CHARS.map((x) => x.id)); const sc = c.scrollTop; c.innerHTML = html(); c.scrollTop = sc; bind(); }, 30);
  }
  renderPick() {
    const c = this.modal.querySelector('.mcard');
    c.innerHTML = `<h2>⚓ 選擇你的第一艘船 <button class="x" data-x="close" title="稍後再選">✕</button></h2><p class="sub">每位船長都從一艘小船開始。它會在你離線時自動出海撈資源；賺到資源與稀有「藍圖」後，就能建造、升級更大的船，慢慢組成自己的艦隊。<b>選了就不能換</b>，但其他船型之後都能靠藍圖解鎖。</p>
    <div class="pickgrid">${STARTERS.map((t) => { const B = SHIPS[t]; return `<div class="pk" data-t="${t}"><div class="pi">${B.icon}</div><b>${B.name}</b><small>${B.role}</small><div class="strow">${this.statsRow(t)}</div><div class="pb"><button data-a="view">👁 看模型</button><button class="pri" data-a="pick">選這艘</button></div></div>`; }).join('')}</div>
    <p class="sub">之後在 ⚓ 艦隊 面板可建造更多船、升級、改變航向。</p>`;
    c.querySelector('.x').onclick = () => this.closeModal();
    c.querySelectorAll('.pk').forEach((el) => { const t = el.dataset.t; el.querySelector('[data-a=view]').onclick = () => this.preview(t, 1, 'pick'); el.querySelector('[data-a=pick]').onclick = () => { const r = this.play.fleetAct('pick', { type: t }); if (r && r.ok) { this.closeModal(); this.openModal('fleet'); } }; });
  }
  preview(type, lv, back) { this.showPvBar(type, back); this.play.viewType(type, lv); }
  showPvBar(type, back) {
    this.hidePvBar(); const B = SHIPS[type]; const f = this.s.fleet;
    const el = $(`<div id="pvbar"><b>${B.icon} ${B.name}</b><small>${B.role}　拖曳旋轉 · 滾輪縮放</small><button data-a="back">⬅ 返回</button>${back === 'pick' && !f.pick ? '<button class="pri" data-a="pick">選這艘</button>' : ''}</div>`);
    const done = () => { this.hidePvBar(); this.play.clearPreview(); };
    el.querySelector('[data-a=back]').onclick = () => { done(); this.game.showPanorama(); this.openModal(back || 'fleet'); };
    const pk = el.querySelector('[data-a=pick]'); if (pk) pk.onclick = () => { const r = this.play.fleetAct('pick', { type }); if (r && r.ok) { done(); this.game.showPanorama(); this.openModal('fleet'); } };
    this.pvBar = el; this.root.append(el);
  }
  hidePvBar() { if (this.pvBar) { this.pvBar.remove(); this.pvBar = null; } }
  fleetSig() { const f = this.s.fleet; return JSON.stringify([f.ships.map((x) => [x.id, x.name, x.lv, x.state, x.auto, x.zone, Math.round(x.hp), x.m && x.m.zone]), f.bp, RES_KEYS.map((k) => Math.floor(this.s.res[k] / 5)), f.pick, f.home]); }
  // ---- 特殊海域：材料 / 稀有藍圖 / 古碑謎題
  /** 材料列 + 稀有藍圖（艦隊視窗與海圖面板共用） */
  matHtml(s) {
    const m = (s.fleet && s.fleet.mat) || {}; const bp = (s.fleet && s.fleet.bp) || {};
    const mats = SZM.MAT_ORDER.map((k) => { const M = SZM.MATERIALS[k], Z = SZM.SPECIAL_ZONES[M.zone]; return `<span class="mt ${m[k] ? '' : 'z'}" title="${M.name}（${Z.name}）"><i>${M.icon}</i>${M.name}<b>${m[k] | 0}</b></span>`; }).join('');
    const bps = SZM.PROMO_BP_IDS.map((k) => `<span class="mt bp ${bp[k] ? '' : 'z'}" title="${SZM.PROMO_BP[k].name}">${bp[k] ? '🗺️' : '🔒'}${SZM.PROMO_BP[k].name.replace('藍圖', '')}</span>`).join('');
    return `<div class="matbar">${mats}</div><div class="matbar">${bps}</div>`;
  }
  szHtml() {
    const s = this.s, w = s.fleet.world; if (!w || !w.pos) return ''; const sz = w.sz || {}; const n = SZM.PROMO_BP_IDS.filter((k) => s.fleet.bp[k]).length;
    const zs = SZM.SZ_ORDER.map((id) => { const Z = SZM.SPECIAL_ZONES[id], seen = this.chart.szSeen && this.chart.szSeen[id]; return `<span class="zc ${seen ? '' : 'un'}" style="${seen ? `border-color:${Z.color};color:${Z.color}` : ''}" title="${seen ? Z.blurb : '還沒找到'}">${seen ? Z.icon + Z.short : '❓'}${sz.n && sz.n[id] ? ` ×${sz.n[id]}` : ''}</span>`; }).join('');
    return `<h3>特殊海域・稀有掉落 <small class="dim">稀有藍圖 ${n}/9（旗艦晉升用）</small></h3><div class="zonebar">${zs}</div>${this.matHtml(s)}<p class="sub">五個特殊海域藏在世界地圖上：🌫迷霧、🌀漩渦、🔥火焰、😈地獄、🗿巨石陣。裡面有危害，但會掉落旗艦晉升需要的稀有藍圖與材料。在海圖上找到它們（迷霧只有外緣看得到）。</p>`;
  }
  /** 頂部 / 膠囊的海域 chip：巨石陣中心 = 開古碑；其他 = 打開海圖 */
  szClick() { const fx = this.game.szFx; if (!fx) return; if (fx.id === 'stonehenge' && fx.depth >= 0.3) { this.openPuzzle(); return; } this.chart.open(); }
  openPuzzle() { const c = SZM.puzzleCan(this.s, nowSec()); if (!c.ok) { this.ui.toast('🗿 ' + c.why); return; } this.chart.close(); this.pz = { phase: 'ready', day: c.day, seq: SZM.puzzleSeq(this.s, c.day), got: [], lit: -1 }; this.openModal('puzzle'); }
  renderPuzzle() {
    const c = this.modal.querySelector('.mcard'), P = this.pz; if (!P) { this.closeModal(); return; } const SYM = ['◆', '●', '▲', '■', '★', '☾'];
    const tiles = SYM.map((y, i) => `<button class="pzt ${P.lit === i ? 'lit' : ''}" data-i="${i}" ${P.phase === 'input' ? '' : 'disabled'}>${y}</button>`).join('');
    const dots = P.seq.map((_, i) => `<i class="${i < P.got.length ? 'on' : ''}"></i>`).join('');
    const body = P.phase === 'ready' ? `<p class="sub">古碑會依序亮起 ${P.seq.length} 個符文。記住順序，再照樣點一遍。<br><b>每天只能讀一次</b>（失敗也算），答對有古碑殘片，還有機會得到科研 T3 藍圖。</p><div class="mb"><button class="pri" data-a="go">🗿 開始讀碑</button><button data-x="close">先不要</button></div>`
      : P.phase === 'show' ? '<p class="sub">看仔細…</p>' : P.phase === 'input' ? `<p class="sub">輪到你了：依序點擊符文</p><div class="pzd">${dots}</div>` : `<p class="${P.won ? 'ok' : 'warn'}">${P.msg}</p><div class="mb"><button class="pri" data-x="close">好</button></div>`;
    c.innerHTML = `<h2>🗿 古碑 <button class="x" data-x="close">✕</button></h2><div class="pzg">${tiles}</div>${body}`;
    c.querySelectorAll('[data-x=close]').forEach((b) => (b.onclick = () => { this.pz = null; this.closeModal(); }));
    const go = c.querySelector('[data-a=go]'); if (go) go.onclick = () => this.pzShow();
    c.querySelectorAll('.pzt').forEach((b) => (b.onclick = () => this.pzTap(+b.dataset.i)));
  }
  pzShow() { const P = this.pz; P.phase = 'show'; P.lit = -1; this.renderPuzzle(); let i = 0; const step = () => { if (!this.pz || this.pz !== P || this.modalKind !== 'puzzle') return; if (i >= P.seq.length) { P.phase = 'input'; P.lit = -1; P.got = []; this.renderPuzzle(); return; } P.lit = P.seq[i++]; this.renderPuzzle(); setTimeout(() => { if (this.pz === P) { P.lit = -1; this.renderPuzzle(); setTimeout(step, 220); } }, 620); }; setTimeout(step, 500); }
  pzTap(i) {
    const P = this.pz; if (!P || P.phase !== 'input') return; P.got.push(i); P.lit = i; const k = P.got.length - 1; const bad = P.seq[k] !== i, done = P.got.length >= P.seq.length;
    if (bad || done) { const r = this.play.worldAct('puzzle', { won: !bad }); P.phase = 'done'; P.won = !!(r && r.won); P.msg = (r && r.msg) || '…'; P.lit = -1; this.renderPuzzle(); return; }
    this.renderPuzzle(); setTimeout(() => { if (this.pz === P) { P.lit = -1; if (this.modalKind === 'puzzle') this.renderPuzzle(); } }, 180);
  }
  renderFleet() {
    const c = this.modal.querySelector('.mcard'); const s = this.s; const f = s.fleet; this.fleetSigV = this.fleetSig();
    const flag = f.flagship ? `<div class="shipc flag"><div class="sh"><span class="ic">${FLAGSHIP.icon}</span><div><b>${FLAGSHIP.name}</b><em>旗艦</em><small>${FLAGSHIP.role}</small></div></div><div class="strow"><span class="st">💨 ${FLAGSHIP.speed}</span><span class="st">📦 ${FLAGSHIP.cargo}</span><span class="st">🛡 ${FLAGSHIP.hull}</span><span class="st">🎯 ${FLAGSHIP.fp}</span><span class="st zn">${ZONE_ORDER.map((z) => ZONES[z].icon).join('')}</span></div></div>` : '';
    const ships = f.ships.map((sh) => this.shipCard(sh)).join('') || (f.pick ? '<p class="dim">還沒有船。到下方「船塢」建造第一艘吧。</p>' : `<p class="warn">你還沒選第一艘船。</p><div class="mb"><button class="pri" data-a="openpick">⚓ 選擇第一艘船</button></div>`);
    const known = FL.bpIds().filter((k) => f.bp[k]).length;
    const dock = SHIP_ORDER.map((t) => { const B = SHIPS[t]; const have = B.free || f.bp[t]; const cb = FL.canBuild(s, t); const own = f.ships.filter((x) => x.type === t).length;
      return `<div class="dk ${have ? '' : 'lock'}" data-t="${t}"><div class="dh"><span class="ic">${B.icon}</span><div><b>${B.name}</b><small>${B.role}</small></div><em class="${B.free ? 'st0' : have ? 'st1' : 'st2'}">${B.free ? '入門' : have ? '🗺️ 已有藍圖' : '🔒 需藍圖'}</em></div><div class="strow">${this.statsRow(t)}</div><div class="dc">${costHTML(B.cost, s)} · ⏱ ${B.build} 分${own ? ` · 已有 ${own}` : ''}</div><div class="pb"><button data-a="view">👁 看模型</button><button class="${cb.ok ? 'pri' : ''}" data-a="build" ${cb.ok ? '' : 'disabled'} title="${cb.ok ? '' : cb.why}">${have ? '建造' : '尚無藍圖'}</button></div></div>`; }).join('');
    const zones = ZONE_ORDER.map((z) => { const Z = ZONES[z]; return `<span class="zc" style="border-color:${Z.color};color:${Z.color}" title="航程≈${Z.min} 分(速度1.0) · 危險 ${Math.round(Z.danger * 100)}% · 收穫×${Z.rich}">${Z.icon} ${Z.name}</span>`; }).join('');
    c.innerHTML = `<h2>⚓ 艦隊 <button class="mini" data-a="chart" title="海圖 (M)">🧭 海圖</button><button class="x" data-x="close">✕</button></h2>
      <p class="sub">小船在你離線時也會自動出海（閒置任務）：依船的戰力挑海域，帶回資源，偶爾發現稀有藍圖。燃料至少會替方舟留 ${15}。艦隊上限 ${FLEET_MAX} 艘。</p>
      ${flag}<div id="flShips">${ships}</div>
      <h3>船塢・藍圖 <small class="dim">已取得 ${known}/5 張藍圖 — 出海探索與閒置任務都有機會找到</small></h3><div class="dockgrid" id="flDock">${dock}</div>
      ${this.szHtml()}
      <h3>海域</h3><div class="zonebar">${zones}</div><p class="sub">更遠的海域收穫更多、也更危險；潛艇能下深淵，破冰船能闖冰海。世界地圖在 🧭 海圖（按 M）：方舟可以航行、探索迷霧、決定海上事件。</p>`;
    c.querySelector('.x').onclick = () => this.closeModal(); c.querySelector('[data-a=chart]').onclick = () => this.chart.open();
    const op = c.querySelector('[data-a=openpick]'); if (op) op.onclick = () => this.openModal('pick');
    c.querySelectorAll('.dk').forEach((el) => { const t = el.dataset.t; el.querySelector('[data-a=view]').onclick = () => this.preview(t, 1, 'fleet'); el.querySelector('[data-a=build]').onclick = () => { this.play.fleetAct('build', { type: t }); this.renderFleet(); }; });
    c.querySelectorAll('.shipc[data-id]').forEach((el) => { const id = +el.dataset.id; const A = (n, fn) => { const b = el.querySelector(`[data-a=${n}]`); if (b) b.onclick = fn; };
      A('view', () => { const sh = FL.findShip(this.s, id); if (sh.state === 'sail') { this.ui.toast('船在海上，返港後再看'); return; } this.showPvBar(el.dataset.type, 'fleet'); this.play.viewShip(id); }); A('pilot', () => { this.closeModal(); this.play.startPilot(id); }); A('home', () => { this.play.fleetAct('home', { id }); }); A('up', () => { this.play.fleetAct('upgrade', { id }); this.renderFleet(); }); A('fix', () => { this.play.fleetAct('repair', { id }); this.renderFleet(); });
      A('auto', () => { const sh = FL.findShip(this.s, id); this.play.fleetAct('auto', { id, on: !sh.auto }); this.renderFleet(); }); A('rename', () => { const sh = FL.findShip(this.s, id); const n = prompt('幫船取個名字（最多 12 字）', sh.name); if (n) { this.play.fleetAct('rename', { id, name: n }); this.renderFleet(); } });
      const sel = el.querySelector('select'); if (sel) sel.onchange = () => { this.play.fleetAct('zone', { id, zone: sel.value }); this.renderFleet(); }; });
    this.renderFleetLive(true);
  }
  shipCard(sh) {
    const B = SHIPS[sh.type]; const s = this.s; const st = FL.shipStats(sh); const z = FL.zoneOf(sh); const uc = FL.upgradeCost(sh);
    const stateTxt = { dock: sh.auto ? '停港待命（即將出航）' : '停港中（自動出航已關）', build: '建造中', wreck: '重創擱淺，需整修', sail: sh.m ? `航向 ${ZONES[sh.m.zone].icon}${ZONES[sh.m.zone].name}` : '航行中', pilot: '🎮 T董駕駛中' }[sh.state];
    const opts = `<option value="auto" ${sh.zone === 'auto' ? 'selected' : ''}>自動（推薦：${ZONES[FL.autoZone(sh)].name}）</option>` + B.zones.map((q) => `<option value="${q}" ${sh.zone === q ? 'selected' : ''}>${ZONES[q].icon} ${ZONES[q].name}（危險 ${Math.round(FL.missionRisk(sh, q) * 100)}% · ${FL.missionMinutes(sh, q)} 分 · ⛽${FL.missionFuel(sh, q)}）</option>`).join('');
    const hs = this.game.small ? FL.homeShip(s.fleet) : null; const isHome = !!hs && hs.id === sh.id; const homeBtn = this.game.small && !isHome && FL.canBeHome(sh) && sh.state === 'dock' ? '<button data-a="home" title="把這艘換成你的家（甲板 / 船員都會搬過去）">⭐ 設為旗艦</button>' : '';
    return `<div class="shipc${isHome ? ' flag' : ''}" data-id="${sh.id}" data-type="${sh.type}"><div class="sh"><span class="ic">${B.icon}</span><div><b>${esc(sh.name)} <button class="mini" data-a="rename" title="改名">✎</button></b><em>${isHome ? '⭐ 旗艦 · ' : ''}Lv${sh.lv}</em><small>${stateTxt}</small></div><button data-a="view" ${sh.state === 'sail' ? 'title="航行中，返港後才能檢視"' : ''}>👁 檢視</button></div>
      <div class="strow">${this.statsRow(sh.type, sh.lv)}</div>
      <div class="hpbar" title="船況 ${Math.round(sh.hp)}%"><u style="width:${sh.hp}%;background:${sh.hp < 35 ? '#ff6b5e' : sh.hp < 65 ? '#ffc65e' : '#6fd78f'}"></u></div>
      ${sh.state === 'sail' || sh.state === 'build' ? `<div class="tb"><u data-prog></u><span data-eta></span></div>` : ''}
      <div class="ctl"><label>目標海域 <select ${sh.state === 'build' ? 'disabled' : ''}>${opts}</select></label></div>
      <div class="pb">${homeBtn}${sh.state === 'dock' ? `<button data-a="pilot">🎮 駕駛</button>` : ''}<button data-a="auto" class="${sh.auto ? 'pri' : ''}">${sh.auto ? '⏵ 自動出航：開' : '⏸ 自動出航：關'}</button>${sh.hp < 99 && sh.state !== 'sail' && sh.state !== 'build' ? `<button data-a="fix" class="${sh.state === 'wreck' ? 'pri' : ''}">🔧 整修 ${costHTML(FL.repairCostShip(sh), s)}</button>` : ''}${uc ? `<button data-a="up" ${sh.state === 'dock' ? '' : 'disabled'}>⬆ 升到 Lv${sh.lv + 1} ${costHTML(uc, s)}</button>` : '<span class="maxed">已達最高等級 ✨</span>'}</div></div>`;
  }
  renderFleetLive(force) {
    const c = this.modal.querySelector('.mcard'); if (!c.querySelector('#flShips')) return; const s = this.s; const now = nowSec();
    if (!force && this.fleetSigV !== this.fleetSig() && !(document.activeElement && document.activeElement.tagName === 'SELECT')) { this.renderFleet(); return; }
    c.querySelectorAll('.shipc[data-id]').forEach((el) => { const sh = FL.findShip(s, +el.dataset.id); if (!sh) return; const u = el.querySelector('[data-prog]'), e = el.querySelector('[data-eta]'); if (!u) return;
      const a = sh.state === 'build' ? sh.done - SHIPS[sh.type].build * 60 : sh.m && sh.m.start, b = sh.state === 'build' ? sh.done : sh.m && sh.m.end; if (a == null) return; u.style.width = Math.max(0, Math.min(1, (now - a) / (b - a))) * 100 + '%'; e.textContent = (sh.state === 'build' ? '建造 ' : '返航 ') + '剩 ' + mmss(b - now); });
  }

  // -- 出海
  renderTrips() {
    const c = this.modal.querySelector('.mcard'); this.sel = this.sel || { site: null, crew: new Set() };
    c.innerHTML = `<h2>🚣 出海探索 <button class="x">✕</button></h2><p class="sub">派 1–3 位船員駕救生艇去撈沉船殘骸。時間到自動返航；高風險收穫多但可能受傷（受傷時間會被醫療室縮短）。你離線時也會照常進行。</p>
    <div id="trActive"></div><h3>目的地</h3><div id="trSites" class="sites"></div><h3>船員</h3><div id="trCrew" class="crewsel"></div><div class="mb"><span id="trCost"></span><button class="pri" id="trGo">出發</button></div>`;
    c.querySelector('.x').onclick = () => this.closeModal();
    const sites = c.querySelector('#trSites'); SITES.forEach((st) => {
      const tier = TIERS[st.tier]; const res = Object.keys(st.w).sort((a, b) => st.w[b] - st.w[a]).slice(0, 3).map((k) => RES[k].icon).join(''); const fuel = 3 + st.tier * 4;
      const lo = Math.round(tier.units * 0.75), hi = Math.round(tier.units * 1.25);
      const el = $(`<button class="site" data-id="${st.id}"><b>${esc(st.name)}</b><span class="tier" style="color:${tier.color};border-color:${tier.color}">${tier.name}</span><small>⏱ ${tier.min} 分 · ⛽${fuel} · 受傷率 ≈${Math.round(tier.risk * 100)}%</small><small>可能收穫 ${res} ≈ ${lo}–${hi}（每多派一人 +25%）</small></button>`);
      el.onclick = () => { this.sel.site = st.id; this.renderTripsLive(true); }; sites.append(el);
    });
    c.querySelector('#trGo').onclick = () => {
      const keys = [...this.sel.crew]; if (!this.sel.site) { this.ui.toast('請先選目的地'); return; } const r = this.play.act('trip', { site: this.sel.site, crew: keys });
      if (r && r.ok) { this.sel.crew.clear(); this.sel.site = null; this.renderTripsLive(true); }
    };
    this.renderTripsLive(true);
  }
  renderTripsLive(force) {
    const s = this.s, c = this.modal.querySelector('.mcard'); if (!c.querySelector('#trSites')) return; const now = nowSec();
    const act = c.querySelector('#trActive'); act.innerHTML = s.trips.length ? `<h3>航行中</h3>` + s.trips.map((tr) => { const site = SITES.find((x) => x.id === tr.site); const p = Math.min(1, (now - tr.start) / (tr.end - tr.start)); return `<div class="atrip"><b>${esc(site.name)}</b><small>${tr.crew.map(esc).join('、')}</small><div class="tb"><u style="width:${p * 100}%"></u><span>剩 ${mmss(tr.end - now)}</span></div></div>`; }).join('') : '';
    c.querySelectorAll('.site').forEach((el) => el.classList.toggle('sel', el.dataset.id === this.sel.site));
    const av = S.availableCrew(s, now); const cs = c.querySelector('#trCrew'); const keys = S.crewKeys(s); const sig = JSON.stringify([keys, av, [...this.sel.crew], keys.map((k) => s.crew[k].away + ':' + (s.crew[k].inj > now ? 1 : 0))]); 
    if (cs.dataset.sig !== sig) {
      cs.dataset.sig = sig; cs.innerHTML = '';
      for (const k of keys) { const cr = s.crew[k]; const ok = av.includes(k); const why = cr.away ? '出海中' : cr.inj > now ? '受傷休養' : ''; const b = this.play.botOf(k); const m = b ? (MOODS[b.mood] || MOODS.focus).icon : '👤';
        const el = $(`<button class="cm ${this.sel.crew.has(k) ? 'sel' : ''}" ${ok ? '' : 'disabled'}>${m} ${esc(k)}${why ? `<small>${why}</small>` : ''}</button>`);
        el.onclick = () => { if (this.sel.crew.has(k)) this.sel.crew.delete(k); else if (this.sel.crew.size < 3) this.sel.crew.add(k); else this.ui.toast('最多 3 位'); this.renderTripsLive(true); }; cs.append(el); }
      if (!keys.length) cs.innerHTML = '<span class="dim">等待船員資料…</span>';
    }
    const st = SITES.find((x) => x.id === this.sel.site); const fuel = st ? 3 + st.tier * 4 : 0; const n = this.sel.crew.size; const can = !!st && n >= 1 && s.res.fuel >= fuel;
    c.querySelector('#trCost').innerHTML = st ? `燃料 <span class="${s.res.fuel < fuel ? 'lack' : ''}">⛽${fuel}</span> · 派 ${n} 人` : '請選擇目的地與船員'; const go = c.querySelector('#trGo'); go.disabled = !can; go.textContent = st ? '出發：' + st.name : '出發';
  }
}
