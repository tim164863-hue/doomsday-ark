// 計時小遊戲介面：一條橫條，指針來回掃，在綠色「甜蜜區」按 E / 空白鍵 / 點一下。手機：點大按鈕。
// 只負責 UI 與計時；各設施玩法在 src/play/games.js，用 await mg.arm(...) 一拍一拍串起來。
import { tt } from '../touch.js';
import { markerPos, timingQuality, gradeOf } from '../sim/rel.js';

const GRADE = { perfect: ['完美！', '#7dffb0'], good: ['不錯！', '#c8ff7a'], ok: ['差一點', '#ffd36b'], miss: ['失誤', '#ff8a7e'] };
const $ = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export class MiniGame {
  constructor(root) {
    this.el = $(`<div id="mg" class="hide"><div class="mgcard">
      <div class="mgh"><span class="mgi"></span><b class="mgt"></b><span class="mgs"></span><button class="mgx" title="離開 (Esc)">✕</button></div>
      <div class="mgmsg"></div>
      <div class="mgbar"><i class="zone"></i><b class="mk"></b></div>
      <button class="mgbtn pri"><kbd>E</kbd> 按下！</button>
      <div class="mgres hide"></div></div></div>`);
    root.append(this.el); const q = (s) => this.el.querySelector(s);
    this.ui = { icon: q('.mgi'), title: q('.mgt'), score: q('.mgs'), msg: q('.mgmsg'), bar: q('.mgbar'), zone: q('.zone'), mk: q('.mk'), btn: q('.mgbtn'), res: q('.mgres'), x: q('.mgx') };
    this.active = false; this.cur = null; this.pending = null; this.t = 0; this.onQuit = null; this.resolvers = new Set();
    const hit = (e) => { e.preventDefault(); e.stopPropagation(); this.press(); };
    this.ui.btn.addEventListener('pointerdown', hit); this.ui.bar.addEventListener('pointerdown', hit);
    this.ui.x.addEventListener('click', () => this.quit());
    addEventListener('keydown', (e) => {
      if (!this.active) return; const k = e.key.toLowerCase();
      if (k === 'e' || k === ' ' || k === 'enter') { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) this.press(); }
      else if (k === 'escape') { e.stopImmediatePropagation(); this.quit(); }
    }, true);
  }
  /** 開啟（或更新標題） */
  open({ icon = '🎮', title = '', hint = '', score = '' } = {}) {
    this.active = true; this.el.classList.remove('hide'); document.body.classList.add('mging'); this.ui.res.classList.add('hide'); this.ui.res.innerHTML = '';
    this.ui.icon.textContent = icon; this.ui.title.textContent = title; this.setScore(score); this.msg(hint); this.idle();
  }
  setScore(t) { this.ui.score.textContent = t; }
  msg(t, color) { this.ui.msg.textContent = tt(t); this.ui.msg.style.color = color || ''; }
  idle() { this.cur = null; this.ui.bar.classList.add('off'); this.ui.btn.disabled = true; this.ui.mk.style.left = '50%'; }
  /** 武裝一拍：回傳 Promise<{q, grade, timedOut, pos}>。timeout 秒內沒按 → q = 0。 */
  arm({ speed = 1.2, sweet = 0.09, center, timeout = 0, label = '' } = {}) {
    return new Promise((resolve, reject) => {
      const c = center ?? 0.5; const phase = Math.random() * 0.4;
      this.cur = { speed, sweet, center: c, timeout, t0: this.t, phase, resolve, reject, done: false, label };
      this.resolvers.add(reject); this.ui.bar.classList.remove('off'); this.ui.btn.disabled = false; this.ui.btn.innerHTML = `<kbd>E</kbd> ${esc(label || '按下！')}`;
      this.ui.zone.style.left = ((c - sweet) * 100) + '%'; this.ui.zone.style.width = (sweet * 2 * 100) + '%';
    });
  }
  press() {
    const c = this.cur; if (!c || c.done || !this.active) { if (this.btnAction) this.btnAction(); return; }
    const pos = markerPos(this.t - c.t0, c.speed, c.phase); const q = timingQuality(pos, c.center, c.sweet); this.finish({ q, grade: gradeOf(q), pos, timedOut: false });
  }
  finish(r) { const c = this.cur; if (!c) return; c.done = true; this.resolvers.delete(c.reject); this.cur = null; this.ui.btn.disabled = true; this.ui.bar.classList.add('off'); if (r.pos != null) this.ui.mk.style.left = (r.pos * 100) + '%'; c.resolve(r); }
  /** 顯示一拍的評語 */
  flash(grade, extra = '') { const g = GRADE[grade] || GRADE.miss; this.msg(g[0] + (extra ? '　' + extra : ''), g[1]); }
  wait(sec) { return new Promise((resolve, reject) => { const o = { t: sec, resolve, reject }; this.timers = this.timers || new Set(); this.timers.add(o); this.resolvers.add(reject); o.rm = () => { this.timers.delete(o); this.resolvers.delete(reject); }; }); }
  update(dt) {
    if (!this.active) return; this.t += dt;
    if (this.cur) { const c = this.cur; const el = this.t - c.t0; this.ui.mk.style.left = (markerPos(el, c.speed, c.phase) * 100) + '%'; if (c.timeout && el >= c.timeout) this.finish({ q: 0, grade: 'miss', timedOut: true, pos: null }); }
    if (this.timers) for (const o of [...this.timers]) { o.t -= dt; if (o.t <= 0) { o.rm(); o.resolve(); } }
  }
  /** 結果畫面：lines 為文字陣列，buttons = [{text, pri, fn}] */
  result({ title = '結束', lines = [], stars = null, buttons = [] } = {}) {
    this.idle(); this.ui.msg.textContent = ''; const r = this.ui.res; r.classList.remove('hide');
    r.innerHTML = `<div class="mgrt">${esc(title)}</div>${stars != null ? `<div class="mgst">${'★'.repeat(stars)}${'☆'.repeat(Math.max(0, 3 - stars))}</div>` : ''}<div class="mgl">${lines.map((l) => `<div>${esc(l)}</div>`).join('')}</div><div class="mgb">${buttons.map((b, i) => `<button data-i="${i}" class="${b.pri ? 'pri' : ''}">${b.pri ? '<kbd>E</kbd> ' : ''}${esc(b.text)}</button>`).join('')}</div>`;
    r.querySelectorAll('button').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); buttons[+b.dataset.i].fn(); }));
    const pri = buttons.find((b) => b.pri); this.btnAction = pri ? pri.fn : null; this.ui.btn.classList.add('hide'); this.ui.bar.classList.add('hide');
  }
  quit() { const f = this.onQuit; this.close(); if (f) f(); }
  /** 關閉並中止所有等待中的 Promise（呼叫端會收到 'abort'） */
  close() {
    this.active = false; this.el.classList.add('hide'); document.body.classList.remove('mging'); this.btnAction = null; this.ui.btn.classList.remove('hide'); this.ui.bar.classList.remove('hide');
    const rs = [...this.resolvers]; this.resolvers.clear(); this.cur = null; if (this.timers) this.timers.clear(); for (const rj of rs) rj('abort');
  }
}
export const isAbort = (e) => e === 'abort';
