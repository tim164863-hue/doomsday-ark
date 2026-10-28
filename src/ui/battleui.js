// 末日方舟 · 階段④ 海戰介面：遭遇提示條、全螢幕即時砲戰場（2D canvas，搖桿 + 瞄準開砲）、結算卡、海圖面板。
// 規則在 sim/arena.js（固定步長）、結算在 sim/battle.js（決定性）；這裡只負責「看得到、摸得到」。
// 所有存檔動作都透過 play.worldAct('battleEngage' | 'battleAuto' | 'battleSubmit')，閒置 / 離線結果不依賴這個畫面。
import * as BT from '../sim/battle.js';
import * as A from '../sim/arena.js';
import { arenaRisk } from '../sim/btrisk.js';
import * as F from '../sim/fleet.js';
import { clock } from '../clock.js';
import { clamp } from '../util.js';

const nowSec = () => clock.now();
const $ = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mmss = (sec) => { sec = Math.max(0, Math.ceil(sec)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; };
const BR_COL = { war: '#ff7a6b', mer: '#ffd36b', sci: '#6fd3ff' };
const pc = (x) => Math.round(x * 100);
/** 風險說明：船員的打算 / 接管的公式勝率 / 預期船體損失（全力 → 一般）/ 撤退成功率 */
export function riskText(pv, rk) {
  const ls = (v) => '−' + Math.max(0, Math.round(v)) + '%';
  return { crew: `船員${pv.fight ? '迎戰' : '逃跑'}，預期船體 ${ls(pv.lossAuto)}`, take: `接管硬拚：試打勝率約 ${pc(rk.win)}%，預期船體 ${rk.lossBest < rk.loss - 1 ? ls(rk.lossBest) + '～' : ''}${ls(rk.loss)}`, retreat: `撤退成功率 ${pc(pv.flee)}%` };
}
/** 目前遭遇的完整風險：pv（船員 / 公式）+ ar（接管，機器人試打）+ 文字 */
export function riskOf(s, own) { const pv = BT.battlePreview(s, own), ar = arenaRisk(own, pv.foe); return { pv, ar, rk: riskText(pv, ar) }; }
export const KIND_TXT = { win: ['⚔️', '擊退了！'], draw: ['🤝', '僵持不下'], lose: ['💥', '被擊退…'], fled: ['💨', '甩開了'], caught: ['💥', '逃失敗'] };

/** 海圖側欄的「海戰」卡片（HTML）：目前遭遇 / 最近一場 / 戰績 / 圖鑑 */
export function btHtml(s, now) {
  const b = BT.btStats(s); if (!b) return ''; const c = BT.curOf(s); const own = F.combatOf(s); let cur = '';
  if (c && now < c.end) {
    const B = BT.FOES[c.k], { pv, ar, rk } = riskOf(s, own), left = c.end - now;
    cur = `<div class="btcur"><b>${B.icon} ${esc(c.nm || B.name)} <small>Lv ${c.lv}${B.boss ? ' · 首領' : ''}</small></b><br><small>${rk.crew}　·　${rk.take}${ar.risky ? ' ⚠️' : ''}　·　${rk.retreat}　· 剩 <span data-btleft>${mmss(left)}</span></small><div class="eo"><button data-a="btTake">🎯 接管指揮</button><button data-a="btCrew">交給船員</button></div></div>`;
  }
  const last = b.last ? `<p class="btlast">${esc(b.last.text)}</p>` : '<p class="dim">還沒遇過海怪。離開近海、停在遠海域或特殊海域，就會碰上牠們。</p>';
  const st = b.st, kills = BT.FOE_ORDER.map((k) => `<span class="zc ${(b.k[k] | 0) ? '' : 'un'}" title="${esc(BT.FOES[k].name)}">${(b.k[k] | 0) ? BT.FOES[k].icon + '×' + b.k[k] : '❓'}</span>`).join('');
  return `<div class="pk btp"><h4>⚔️ 海戰 <small>勝 ${st.w}・敗 ${st.l}・平 ${st.d}・逃 ${st.f}</small></h4>${cur}${last}<div class="zonebar">${kills}</div><p class="dim">船員會自動處理（離線也一樣）。在線時可接管：在砲戰場打倒敵人就算勝利（船體損失就是戰場上實際受的傷）；打輸 / 超時才照船的戰力公式結算，也可以中途撤退（機率逃脫）。接管是硬拚，風險比船員自己判斷高，不保證比自動好。</p></div>`;
}

export class BattleUI {
  constructor(hud) {
    this.hud = hud; this.phase = 'idle'; this.keys = new Set(); this.aim = null; this.fireHeld = false; this.latch = 0; this.ammo = 0; this.stick = { x: 0, y: 0 }; this.fx = []; this.msg = '';
    this.pill = $(`<div id="btpill" class="hide"><div class="bpt"></div><div class="bpb"><button class="pri" data-a="take">🎯 接管</button><button data-a="crew">交給船員</button></div></div>`);
    this.el = $(`<div id="btl" class="hide"><canvas></canvas><div class="btTop"><b class="btTitle"></b><span class="sp"></span><span class="btTimer"></span><button data-a="retreat" title="撤退：機率逃脫，失敗會被追著打">🏳️ 撤退</button><button data-a="crew" title="立刻讓船員用自動戰鬥結算">交給船員</button><button data-a="close" title="離開（遭遇還在，可以再回來）">✕</button></div>
      <div id="bjoy"><div class="ring"></div><i class="tri u"></i><i class="tri d"></i><i class="tri l"></i><i class="tri r"></i><div class="knob"></div></div>
      <div class="btCtl"><button data-a="inc" title="燃燒彈（Q）：持續燒傷，但裝填慢">🔥<b>5</b></button><button data-a="fire" class="pri">💥 開砲</button></div><div class="btHint"></div><div class="btRes hide"><div class="btCard"></div></div></div>`);
    this.cf = $(`<div id="btcf" class="hide"><div class="btCard"></div></div>`); hud.root.append(this.pill, this.el, this.cf); this.cv = this.el.querySelector('canvas'); this.ctx = this.cv.getContext('2d'); this.cv.style.touchAction = 'none';
    this.pill.querySelector('[data-a=take]').onclick = () => this.take(); this.pill.querySelector('[data-a=crew]').onclick = () => this.crew();
    this.el.querySelector('[data-a=close]').onclick = () => this.close(); this.el.querySelector('[data-a=crew]').onclick = () => this.crew(); this.el.querySelector('[data-a=retreat]').onclick = () => this.retreat();
    this.el.querySelector('[data-a=inc]').onclick = () => this.toggleInc(); const fb = this.el.querySelector('[data-a=fire]');
    fb.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); this.fireHeld = true; this.latch = 0.35; fb.setPointerCapture(e.pointerId); });
    const fu = () => { this.fireHeld = false; }; fb.addEventListener('pointerup', fu); fb.addEventListener('pointercancel', fu);
    const cv = this.cv; cv.addEventListener('pointerdown', (e) => { if (this.phase !== 'fight') return; cv.setPointerCapture(e.pointerId); this.setAim(e); this.fireHeld = true; this.latch = 0.35; this.aimPtr = e.pointerId; });
    cv.addEventListener('pointermove', (e) => { if (this.phase === 'fight' && (e.pointerType === 'mouse' || this.aimPtr === e.pointerId)) this.setAim(e); });
    const up = (e) => { if (this.aimPtr === e.pointerId) { this.aimPtr = null; this.fireHeld = false; } }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    this.initStick(); addEventListener('resize', () => this.isOpen() && this.resize());
    document.addEventListener('keydown', (e) => this.key(e, true), true); document.addEventListener('keyup', (e) => this.key(e, false), true);
    this.el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  get s() { return this.hud.play.state; }
  isOpen() { return !this.el.classList.contains('hide'); }
  // ---------------------------------------------------------------- 遭遇提示條（任何畫面都看得到）
  refresh() {
    const s = this.s, c = s && BT.curOf(s), now = nowSec(); const show = !!c && now < c.end && !this.isOpen();
    this.pill.classList.toggle('hide', !show); if (!show) return;
    const B = BT.FOES[c.k], own = F.combatOf(s), { pv, ar, rk } = riskOf(s, own), left = c.end - now;
    const t = `⚔️ ${B.icon} ${esc(c.nm || B.name)} Lv${c.lv} 來襲　<span class="tm">⏱ ${mmss(left)}</span><small>${rk.crew}${c.eng ? '・已接管' : ''}<br>${rk.take}${ar.risky ? ' ⚠️' : ''}・${rk.retreat}</small>`; const el = this.pill.querySelector('.bpt'); if (el.innerHTML !== t) el.innerHTML = t;
  }
  // ---------------------------------------------------------------- 玩家動作
  /** 接管入口（提示條 / 海圖卡共用）：勝率低或預期損失大 → 先二次確認 */
  take() {
    const s = this.s, now = nowSec(), c = BT.curOf(s); if (!c || now >= c.end) { this.hud.ui.toast('遭遇已經結束了'); return; }
    if (c.eng) { this.open(); return; }   // 已經接管過（回來繼續打）不用再問
    const { pv, ar, rk } = riskOf(s, F.combatOf(s)); if (!ar.risky) { this.open(); return; }
    const B = BT.FOES[c.k], box = this.cf.querySelector('.btCard');
    box.innerHTML = `<div class="rk">⚠️</div><h3>確定要接管嗎？</h3><p class="rtx">${B.icon} ${esc(c.nm || B.name)} Lv${c.lv} 對現在的船很危險。</p><p class="dim">${rk.take}${ar.winMax > ar.win + 0.02 ? '（全力指揮最好 ' + pc(ar.winMax) + '%）' : ''}<br>${rk.crew}<br>${rk.retreat}</p><p class="dim">在砲戰場打倒牠＝勝利；打輸 / 超時才照公式結算，船員自己判斷風險比較低。中途可以按「撤退」。</p><div class="eo"><button data-a="go" class="pri">仍要接管</button><button data-a="crew">交給船員</button><button data-a="no">再想想</button></div>`;
    box.querySelector('[data-a=go]').onclick = () => { this.cf.classList.add('hide'); this.open(); }; box.querySelector('[data-a=no]').onclick = () => this.cf.classList.add('hide');
    box.querySelector('[data-a=crew]').onclick = () => { this.cf.classList.add('hide'); this.crew(); }; this.cf.classList.remove('hide');
  }
  open() {
    const s = this.s, now = nowSec(), c = BT.curOf(s); if (!c || now >= c.end) { this.hud.ui.toast('遭遇已經結束了'); return; }
    const r = this.hud.play.worldAct('battleEngage', {}); if (!r || !r.ok) return;
    const g = this.hud.game; if (g.helm && g.helm.on) g.helm.stop(); g.controls && g.controls.keys.clear(); this.hud.chart.close(); this.hud.closeModal();
    this.own = F.combatOf(s); this.foe = BT.foeStats(BT.curOf(s)); this.arena = A.createArena(s.seed, c.id, this.foe, this.own); this.acc = 0; this.fx = []; this.aim = null; this.ammo = 0; this.msg = ''; this.cid = c.id; this.cf.classList.add('hide');
    this.phase = 'fight'; this.el.classList.remove('hide'); this.el.querySelector('.btRes').classList.add('hide'); this.el.querySelector('.btCtl').classList.remove('hide'); this.el.classList.remove('done');
    this.el.querySelector('.btTitle').textContent = `${this.foe.icon} ${c.nm || this.foe.name}　Lv ${c.lv}`; this.el.querySelector('.btHint').textContent = this.hint(); this.resize(); this.last = performance.now(); this.hud.syncJoy(); this.pill.classList.add('hide');
    cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame((t) => this.loop(t));
  }
  hint() { return matchMedia('(pointer:coarse)').matches ? '左下搖桿走位閃躲　點畫面瞄準開砲（砲彈有飛行時間，要預判）' : 'WASD 走位　滑鼠瞄準・點擊開砲　Q 燃燒彈　空白鍵 對準點再開一砲'; }
  close() {
    cancelAnimationFrame(this.raf); this.phase = 'idle'; this.el.classList.add('hide'); this.hud.syncJoy(); this.fireHeld = false; this.refresh();
    if (BT.curOf(this.s)) this.hud.ui.toast('先離開砲戰；倒數還在，隨時可以回來接管（再開一次會重打）'); this.hud.refresh(true);
  }
  crew() {
    const r = this.hud.play.worldAct('battleAuto', {}); if (this.isOpen()) { this.phase = 'idle'; cancelAnimationFrame(this.raf); this.showResult(r, null, null, 'crew'); } else this.refresh();
  }
  retreat() {
    if (this.phase !== 'fight') return; this.phase = 'idle'; cancelAnimationFrame(this.raf); this.fireHeld = false;
    const r = this.hud.play.worldAct('battleRetreat', { id: this.cid }); this.showResult(r, A.arenaMetrics(this.arena), this.arena.over, 'retreat');
  }
  toggleInc() { this.ammo = this.ammo ? 0 : 1; this.syncBtn(); }
  syncBtn() { const a = this.arena; const b = this.el.querySelector('[data-a=inc]'); if (!a) return; b.querySelector('b').textContent = a.p.inc; b.classList.toggle('on', !!this.ammo && a.p.inc > 0); b.disabled = a.p.inc <= 0; }
  finish(why) {
    const a = this.arena; this.phase = 'done'; cancelAnimationFrame(this.raf); const m = A.arenaMetrics(a); this.metrics = m;
    const r = this.hud.play.worldAct('battleSubmit', { rep: { id: this.cid, won: m.won, loss: m.loss, hits: m.hits, shots: m.shots, t: m.t, acc: m.acc, dodge: m.dodge } }); this.showResult(r, m, a.over, 'arena');
  }
  /** how: 'arena'（打完砲戰）/ 'retreat' / 'crew'（交給船員）；r 失敗 = 來不及（船員已經處理）→ 把那場的結果也秀出來 */
  showResult(r, m, over, how) {
    this.el.classList.add('done'); this.el.querySelector('.btCtl').classList.add('hide'); const box = this.el.querySelector('.btRes'), card = box.querySelector('.btCard'); box.classList.remove('hide');
    const b = BT.btStats(this.s), last = b && b.last && b.last.id === this.cid ? b.last : null;
    if (!r || !r.ok) {
      const [ic, tt] = last ? KIND_TXT[last.r] || ['⚔️', '結束'] : ['⏳', ''];
      card.innerHTML = last ? `<div class="rk">${ic}</div><h3>⏳ 來不及了，船員已經處理</h3><p class="rtx">${esc(last.text)}</p><p class="dim">結果：${tt}。倒數結束時，沒有人接管的遭遇會由船員自動結算（你剛才在砲戰場的表現不計入）。</p><div class="eo"><button data-a="ok" class="pri">回到海上</button></div>`
        : `<div class="rk">⏳</div><h3>${esc((r && r.msg) || '遭遇已經由船員處理')}</h3><div class="eo"><button data-a="ok" class="pri">回到海上</button></div>`;
    } else {
      const [ic, tt] = KIND_TXT[r.kind] || ['⚔️', '結束']; const B = BT.FOES[last ? last.k : 'serpent'];
      let why;
      if (how === 'retreat') why = '你下令撤退：能不能甩開看逃脫機率（跟砲戰表現無關），失敗會被追著打。';
      else if (how === 'arena' && r.arena) why = `你在砲戰場把牠打倒了＝<b>勝利</b>。船體損失就是砲戰中實際受到的傷害（${m ? m.loss : 0}%），照舊不會低於 20%。`;
      else if (how === 'arena') { const eff = BT.effSkill({ acc: m.acc, dodge: m.dodge, shots: m.shots });
        why = `砲戰${over === 'lose' ? '船撐不住了' : '時間到'}，沒打倒牠，這場改照船的戰力公式結算（命中 ${m.shots >= 3 ? Math.round(m.acc * 100) + '%' : '發數太少不計'}・閃避 ${Math.round(m.dodge * 100)}%，換算最多 +25% 命中 / +10 點閃避）。接管＝硬拚，結果可能比船員自己判斷更糟。`; }
      else why = '交給船員自動處理（決定性公式，離線也一樣）。';
      card.innerHTML = `<div class="rk">${ic}</div><h3>${B.icon} ${tt}</h3><p class="rtx">${esc(r.text || '')}</p><p class="dim">${why}</p><div class="eo"><button data-a="ok" class="pri">回到海上</button></div>`;
    }
    card.querySelector('[data-a=ok]').onclick = () => { this.phase = 'idle'; this.el.classList.add('hide'); this.hud.syncJoy(); this.hud.refresh(true); this.refresh(); };
  }
  // ---------------------------------------------------------------- 輸入
  key(e, down) {
    if (!this.isOpen() || e.target.tagName === 'INPUT') return; const k = e.key.toLowerCase(); const mine = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'q', 'escape', 'enter'].includes(k); if (!mine) return;
    e.preventDefault(); e.stopPropagation(); if (down && e.repeat && (k === 'q' || k === 'escape')) return;
    if (down) { this.keys.add(k); if (k === 'q' && this.phase === 'fight') this.toggleInc(); if (k === 'escape') { if (this.phase === 'fight') this.close(); } if ((k === ' ' || k === 'enter') && this.phase === 'fight') { this.latch = 0.35; this.fireHeld = true; } } else { this.keys.delete(k); if (k === ' ' || k === 'enter') this.fireHeld = false; }
  }
  setAim(e) { const r = this.cv.getBoundingClientRect(), L = this.lay; if (!L) return; this.aim = { x: clamp((e.clientX - r.left - L.ox) / L.sc, 0, 100), y: clamp((e.clientY - r.top - L.oy) / L.sc, 0, 100) }; }
  initStick() {
    const joy = this.el.querySelector('#bjoy'), knob = joy.querySelector('.knob'), R = 44; let id = null;
    const set = (e) => { const r = joy.getBoundingClientRect(); let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); const l = Math.hypot(dx, dy); if (l > R) { dx = dx / l * R; dy = dy / l * R; } knob.style.transform = `translate(${dx}px,${dy}px)`; this.stick.x = dx / R; this.stick.y = dy / R; };
    joy.addEventListener('pointerdown', (e) => { id = e.pointerId; joy.setPointerCapture(id); joy.classList.add('act'); set(e); e.stopPropagation(); }); joy.addEventListener('pointermove', (e) => { if (e.pointerId === id) set(e); });
    const end = (e) => { if (e.pointerId !== id) return; id = null; knob.style.transform = ''; this.stick.x = this.stick.y = 0; joy.classList.remove('act'); }; joy.addEventListener('pointerup', end); joy.addEventListener('pointercancel', end);
  }
  input() {
    const K = this.keys; let mx = (K.has('d') || K.has('arrowright') ? 1 : 0) - (K.has('a') || K.has('arrowleft') ? 1 : 0) + this.stick.x, my = (K.has('s') || K.has('arrowdown') ? 1 : 0) - (K.has('w') || K.has('arrowup') ? 1 : 0) + this.stick.y;
    const inp = { mx, my, aim: this.aim, fire: this.fireHeld || this.latch > 0, ammo: this.ammo }; return inp;
  }
  // ---------------------------------------------------------------- 主迴圈
  loop(t) {
    if (this.phase !== 'fight') return; const dt = Math.min(0.1, Math.max(0, (t - this.last) / 1000)); this.last = t; const a = this.arena; this.acc += dt;
    while (this.acc >= A.AR.dt && !a.over) { this.acc -= A.AR.dt; const inp = this.input(); const ev = A.stepArena(a, inp, A.AR.dt); this.latch = Math.max(0, this.latch - A.AR.dt); if (ev.some((x) => x.k === 'fire')) this.latch = 0; for (const e of ev) this.onArenaEvent(e); }
    this.syncBtn(); this.el.querySelector('.btTimer').textContent = `⏱ ${Math.max(0, Math.ceil(A.AR.time - a.t))}s`; this.draw(); const cc = BT.curOf(this.s);
    if (!cc || cc.id !== this.cid) { this.phase = 'done'; this.showResult({ ok: false, msg: '遭遇已經由船員處理完了' }, null, null, 'crew'); return; }
    if (a.over) { this.over0 = this.over0 || performance.now(); if (performance.now() - this.over0 > 900) { this.over0 = 0; this.finish(); return; } } else this.over0 = 0;
    this.raf = requestAnimationFrame((tt) => this.loop(tt));
  }
  onArenaEvent(e) {
    const g = this.hud.game;
    if (e.k === 'splash') this.fx.push({ k: e.hit ? 'hit' : 'splash', x: e.x, y: e.y, t: 0, T: 0.6 });
    else if (e.k === 'slam') this.fx.push({ k: 'slam', x: e.x, y: e.y, r: e.r, t: 0, T: 0.5 });
    else if (e.k === 'hurt') { this.fx.push({ k: 'hurt', x: e.x, y: e.y, t: 0, T: 0.5 }); this.shake = 0.25; try { g.audio && g.audio.event('crash', 14); } catch (x) { /* 沒音效就算了 */ } }
    else if (e.k === 'foehit') this.fx.push({ k: e.burn ? 'burn' : 'hit', x: e.x, y: e.y, t: 0, T: 0.4 });
    else if (e.k === 'dive') this.msg = '潛下去了！'; else if (e.k === 'surface') this.msg = '';
  }
  // ---------------------------------------------------------------- 畫面
  resize() {
    const r = this.el.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); this.W = r.width; this.H = r.height; this.cv.width = Math.round(r.width * dpr); this.cv.height = Math.round(r.height * dpr); this.dpr = dpr;
    const top = 46, bot = this.W < 700 ? 150 : 8, S = Math.max(120, Math.min(this.W - 8, this.H - top - bot)); this.lay = { sc: S / 100, ox: Math.round((this.W - S) / 2), oy: top + Math.round(Math.max(0, (this.H - top - bot - S) / 2)), S }; this.draw();
  }
  draw() {
    const a = this.arena, g = this.ctx, L = this.lay; if (!a || !L) return; const { sc, ox, oy, S } = L; g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); g.fillStyle = '#04101c'; g.fillRect(0, 0, this.W, this.H);
    let sx = 0, sy = 0; if (this.shake > 0) { this.shake -= 0.033; sx = (Math.random() - 0.5) * 6; sy = (Math.random() - 0.5) * 6; }
    g.save(); g.translate(ox + sx, oy + sy); g.beginPath(); g.rect(0, 0, S, S); g.clip();
    const grd = g.createLinearGradient(0, 0, 0, S); grd.addColorStop(0, '#12385a'); grd.addColorStop(1, '#0a2238'); g.fillStyle = grd; g.fillRect(0, 0, S, S);
    g.strokeStyle = '#ffffff12'; g.lineWidth = 1; const tt = a.t; for (let i = 0; i < 9; i++) { const y = ((i * 0.125 + tt * 0.02) % 1) * S; g.beginPath(); for (let x = 0; x <= S; x += 14) g.lineTo(x, y + Math.sin(x * 0.05 + tt * 1.4 + i) * 3); g.stroke(); }
    const P = (u) => u * sc; const circ = (x, y, r, fill, stroke, lw = 2) => { g.beginPath(); g.arc(P(x), P(y), P(r), 0, 7); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } };
    // 預警圈 / 衝撞軌跡
    for (const c of a.tele) {
      if (c.lane || c.kind === 'dash') { const L2 = c.lane || a.foe.lane; if (!L2) continue; const dx = L2.x1 - L2.x0, dy = L2.y1 - L2.y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, w = L2.w; const k = c.kind === 'dash' ? 1 : 0; g.fillStyle = k ? '#ff3b2f88' : '#ff3b2f22'; g.beginPath(); g.moveTo(P(L2.x0 + nx * w), P(L2.y0 + ny * w)); g.lineTo(P(L2.x0 + dx * 3 + nx * w), P(L2.y0 + dy * 3 + ny * w)); g.lineTo(P(L2.x0 + dx * 3 - nx * w), P(L2.y0 + dy * 3 - ny * w)); g.lineTo(P(L2.x0 - nx * w), P(L2.y0 - ny * w)); g.fill(); continue; }
      const k = clamp(c.t / c.T, 0, 1); circ(c.x, c.y, c.r, `rgba(255,70,50,${0.12 + 0.2 * k})`, '#ff6a58', 2); circ(c.x, c.y, c.r * k, null, '#ffd0c8', 1.5);
    }
    if (a.foe.st === 'charge' && a.foe.lane) { const L2 = a.foe.lane, dx = L2.x1 - L2.x0, dy = L2.y1 - L2.y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, w = L2.w, k = clamp(L2.t / L2.T, 0, 1); g.fillStyle = `rgba(255,59,47,${0.1 + 0.25 * k})`; g.beginPath(); g.moveTo(P(L2.x0 + nx * w), P(L2.y0 + ny * w)); g.lineTo(P(L2.x0 + dx * 3 + nx * w), P(L2.y0 + dy * 3 + ny * w)); g.lineTo(P(L2.x0 + dx * 3 - nx * w), P(L2.y0 + dy * 3 - ny * w)); g.lineTo(P(L2.x0 - nx * w), P(L2.y0 - ny * w)); g.fill(); }
    // 對手
    const F = a.foe; g.textAlign = 'center'; g.textBaseline = 'middle'; if (F.vis) { circ(F.x, F.y + F.r * 0.5, F.r * 1.05, '#00000040'); g.font = `${Math.round(P(F.r) * 2.3)}px system-ui,"Apple Color Emoji","Noto Color Emoji",sans-serif`; g.fillStyle = '#fff'; g.fillText(F.icon, P(F.x), P(F.y)); if (F.burn > 0) { g.font = `${Math.round(P(F.r))}px sans-serif`; g.fillText('🔥', P(F.x + F.r * 0.6), P(F.y - F.r * 0.6)); } } else { for (let i = 0; i < 3; i++) circ(F.x, F.y, F.r * (0.5 + i * 0.35 + (a.t * 0.8 % 0.35)), null, `rgba(255,255,255,${0.35 - i * 0.1})`, 1.5); }
    // 彈
    for (const q of a.proj) { circ(q.x, q.y, q.r, '#ff9a3c', '#fff3', 1); }
    for (const s of a.shells) { const k = clamp(s.t / s.T, 0, 1), x = s.x0 + (s.x1 - s.x0) * k, y = s.y0 + (s.y1 - s.y0) * k, h = Math.sin(k * Math.PI) * 6; circ(s.x1, s.y1, 1.8, null, '#ffffff55', 1); circ(x, y - h, 1.3, s.inc ? '#ff8a3c' : '#e8f3ff'); }
    // 特效
    for (const f of this.fx) { f.t += 0.033; const k = clamp(f.t / f.T, 0, 1); if (f.k === 'splash') circ(f.x, f.y, 1 + 4 * k, null, `rgba(190,230,255,${1 - k})`); else if (f.k === 'hit') circ(f.x, f.y, 1 + 5 * k, `rgba(255,220,120,${0.7 * (1 - k)})`, `rgba(255,255,255,${1 - k})`); else if (f.k === 'burn') circ(f.x, f.y, 1 + 2 * k, `rgba(255,120,40,${0.8 * (1 - k)})`); else if (f.k === 'slam') circ(f.x, f.y, f.r * (0.6 + 0.5 * k), `rgba(255,80,60,${0.35 * (1 - k)})`, `rgba(255,160,140,${1 - k})`); else if (f.k === 'hurt') circ(f.x, f.y, 3 + 5 * k, null, `rgba(255,70,60,${1 - k})`, 3); } this.fx = this.fx.filter((f) => f.t < f.T);
    // 玩家船
    const p = a.p; g.save(); g.translate(P(p.x), P(p.y)); g.rotate(p.ang + Math.PI / 2); const col = BR_COL[this.own.branch] || '#d8e6f2'; const hk = P(3.3); g.fillStyle = '#00000040'; g.beginPath(); g.ellipse(0, hk * 0.3, hk * 0.9, hk * 1.5, 0, 0, 7); g.fill();
    g.fillStyle = col; g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, -hk * 1.6); g.lineTo(hk * 0.85, hk * 0.2); g.lineTo(hk * 0.7, hk * 1.4); g.lineTo(-hk * 0.7, hk * 1.4); g.lineTo(-hk * 0.85, hk * 0.2); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#0b1b2d'; g.fillRect(-hk * 0.28, -hk * 0.3, hk * 0.56, hk * 0.8); g.restore();
    if (a.p.cd > 0) { g.strokeStyle = '#ffffff88'; g.lineWidth = 2; g.beginPath(); g.arc(P(p.x), P(p.y), P(4.6), -Math.PI / 2, -Math.PI / 2 + (1 - clamp(p.cd / A.AR.cd, 0, 1)) * Math.PI * 2); g.stroke(); }
    if (this.phase === 'fight') { const aim = this.aim || A.defaultAim(a); g.strokeStyle = this.ammo && p.inc > 0 ? '#ff9a3c' : '#9fe3ff'; g.lineWidth = 1.5; g.setLineDash([4, 5]); g.beginPath(); g.moveTo(P(p.x), P(p.y)); g.lineTo(P(aim.x), P(aim.y)); g.stroke(); g.setLineDash([]); circ(aim.x, aim.y, 1.9, null, g.strokeStyle, 2); g.beginPath(); g.moveTo(P(aim.x) - 5, P(aim.y)); g.lineTo(P(aim.x) + 5, P(aim.y)); g.moveTo(P(aim.x), P(aim.y) - 5); g.lineTo(P(aim.x), P(aim.y) + 5); g.stroke(); }
    // 血條
    const bar = (x, y, w, h, k, c, lab) => { g.fillStyle = '#00000088'; g.fillRect(x, y, w, h); g.fillStyle = c; g.fillRect(x, y, w * clamp(k, 0, 1), h); g.strokeStyle = '#ffffff55'; g.lineWidth = 1; g.strokeRect(x, y, w, h); if (lab) { g.fillStyle = '#fff'; g.font = '11px system-ui,sans-serif'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(lab, x + 6, y + h / 2 + 0.5); } };
    bar(10, 8, S - 20, 14, F.hp / F.max, F.phase === 2 ? '#ff5b4a' : '#e0803c', `${F.icon} ${F.name}${F.phase === 2 ? '・發怒' : ''}`);
    const hp = (a.hullPct - a.floor) / (100 - a.floor); bar(10, S - 22, Math.min(200, S - 20), 12, hp, hp < 0.3 ? '#ff6b5e' : '#6fd78f', `船體 ${Math.round(a.hullPct)}%`);
    if (this.msg) { g.fillStyle = '#fff'; g.font = '600 14px system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(this.msg, S / 2, 40); }
    if (a.over) { g.fillStyle = '#000a'; g.fillRect(0, S / 2 - 26, S, 52); g.fillStyle = '#fff'; g.font = '700 24px system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(a.over === 'win' ? '🎯 打倒了！' : a.over === 'lose' ? '💥 撐不住了' : '⏱ 時間到', S / 2, S / 2); }
    g.restore();
  }
}
