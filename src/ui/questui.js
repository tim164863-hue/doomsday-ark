// 新手教學任務介面：右側小面板（可收合 / 可關閉）＋「點這裡」的高亮圈與箭頭。邏輯與獎勵在 sim/quests.js。
// 只在有的元素「看得到」時才畫圈；手機的選單收在 \ue025 後面，會先指 \ue025。面板放在右側，不會壓到底部的互動卡 / 時間軸 / 搖桿。
import * as THREE from 'three';
import * as Q from '../sim/quests.js';
import { SHIPS } from '../sim/fleetdefs.js';
import { clock } from '../clock.js';
const $ = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const ICON = { food: '\ue047', water: '\ue03c', fuel: '\ue049', parts: '\ue069' };
const rewardText = (r) => Q.RES4.filter((k) => r[k]).map((k) => ICON[k] + '+' + r[k]).join(' ');
const FAC_PREF = ['greenhouse', 'generator', 'workshop', 'infirmary', 'purifier'];

export class QuestUI {
  constructor(game, play, hud) {
    this.g = game; this.play = play; this.hud = hud; this.line = null; this.acc = 9; this.cur = null; this.sig = '';
    this.el = $(`<div id="quest" class="hide"><div class="qh"><b>\ue04e 新手教學</b><span class="qn"></span><button class="qc" data-a="fold" title="收合 / 展開">－</button><button class="qx" data-a="close" title="略過教學（之後可在「任務」重新打開）">✕</button></div><div class="qbody"><div class="qtabs"></div><div class="qs"></div><div class="qt"></div><div class="qr"></div><div class="qp"></div></div></div>`);
    this.ring = $(`<div id="qring" class="hide"><i class="qa">▼</i><span class="ql"></span><u></u></div>`);
    game.ui.root.append(this.el, this.ring);
    this.el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return; const q = this.q(); if (!q) return;
      if (b.dataset.a === 'fold') { q.c = q.c ? 0 : 1; this.sig = ''; this.render(); this.play.save(); }
      else if (b.dataset.a === 'close') { q.x = 1; this.sig = ''; this.render(); this.g.ui.toast('已略過教學　想再看：\ue02b 任務 → 新手教學'); this.play.save(); }
      else if (b.dataset.a === 'noauto') { this.play.fleetAct('auto', { id: +b.dataset.id, on: false }); this.acc = 9; this.sig = ''; }
      else if (b.dataset.l) { this.line = b.dataset.l; this.sig = ''; this.render(); }
    });
  }
  q() { return this.play.state && this.play.state.quest; }
  get s() { return this.play.state; }
  /** 互動卡（#prompt）出現而面板會壓到它時，面板自動縮成一條標題列（圈與標籤照常指路），卡片消失後恢復 */
  autoFold() {
    const el = this.el; el.classList.remove('afold'); const pr = document.querySelector('#prompt:not(.hide)'); if (!pr) return;
    const a = el.getBoundingClientRect(), b = pr.getBoundingClientRect(); if (a.width < 1 || b.width < 1) return;
    if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) el.classList.add('afold');
  }
  /** 旗艦（T董）右側按鈕列比較長：面板若壓到 #right 就往左挪到它旁邊 */
  avoidRight() {
    const el = this.el; el.style.right = ''; const rt = document.getElementById('right'); if (!rt) return;
    const a = el.getBoundingClientRect(), b = rt.getBoundingClientRect(); if (a.width < 1 || b.width < 1) return;
    if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) el.style.right = Math.round(innerWidth - b.left + 8) + 'px';
  }
  reopen() { const q = this.q(); if (!q) return; q.x = 0; q.c = 0; this.sig = ''; this.render(); this.play.save(); }
  refresh() { this.sig = ''; this.render(); }
  // ---- 目標解析：回傳 { el | pt(世界座標 Vector3) , label, text }
  vis(el) { if (!el || el.disabled) return false; const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight && getComputedStyle(el).visibility !== 'hidden'; }
  menu(sel, label, text) {   // 資源列按鈕；手機收在 \ue025 後面
    const b = document.querySelector(sel); if (this.vis(b)) return { el: b, label, text };
    const p = document.querySelector('#tlpill'); if (this.vis(p)) return { el: p, label: '先點這裡展開選單', text: '先點左上角的 \ue025 展開選單，再' + text };
    return { text };
  }
  nearBot() {
    const a = this.g.player && this.g.player.actor; if (!a) return null; let best = null, bd = 1e9;
    for (const b of this.g.crew.bots.values()) { if (b.away || !b.actor || b.actor.deck !== a.deck) continue; const d = Math.hypot(b.actor.x - a.x, b.actor.z - a.z); if (d < bd) { bd = d; best = b; } }
    return best ? { b: best, d: bd } : null;
  }
  botPt(b) { if (!this._v) this._v = new THREE.Vector3(); b.avatar.group.getWorldPosition(this._v); this._v.y += 0.9; return this._v.clone(); }
  resolve(step) {
    if (!step) return null; const hud = this.hud, id = step.id, mk = hud.modalKind; const touch = matchMedia('(pointer: coarse)').matches; const $1 = (s) => document.querySelector(s); const s = this.s;
    if (id === 'move') {
      const j = $1('#joy'); const nb = this.nearBot(); const t = touch ? '拖曳左下角的搖桿，或直接點甲板地面，走個幾步' : '用 W A S D（或方向鍵）移動，也可以直接點甲板地面';
      if (touch && j && this.vis(j) && getComputedStyle(j).display !== 'none') return { el: j, label: '拖這個搖桿', text: t };
      return nb ? { pt: this.botPt(nb.b), label: '走到這附近', text: t } : { text: t };
    }
    if (id === 'talk') {
      const pb = $1('#prompt:not(.hide) [data-a=chat]'); if (this.vis(pb)) return { el: pb, label: '點「聊天」', text: '點「聊天」和船員說說話' };
      const cr = [...document.querySelectorAll('#crewmini .cr')].find((e) => this.vis(e)); const nb = this.nearBot();
      if (cr && !$1('#crewmini.closed')) return { el: cr, label: '點船員名字', text: '點一位船員的名字，角色會自動走過去，再按「聊天」' };
      return nb ? { pt: this.botPt(nb.b), label: '走近船員', text: '走近一位船員，出現互動卡後按「聊天」' } : { text: '走近一位船員，出現互動卡後按「聊天」' };
    }
    if (id === 'chart') return this.menu('#btnChart', '點 \ue034 航海圖', '點上方的 \ue034 打開航海圖（也可以按 M）');
    if (id === 'sail') return this.menu('#btnHelm', '點 \ue00c 開船', '點 \ue00c 開船出航，再用搖桿 / WASD 駕駛（也可以按 G）');
    if (id === 'salvage') {
      if (mk === 'trips') {
        const sel = $1('#trSites .site.sel'); if (!sel) { const e = $1('#trSites .site'); return this.vis(e) ? { el: e, label: '先選目的地', text: '選一個目的地（近海最安全）' } : { text: '選一個目的地' }; }
        const cm = $1('#trCrew .cm.sel'); if (!cm) { const e = [...document.querySelectorAll('#trCrew .cm')].find((x) => !x.disabled); return e ? { el: e, label: '派一位船員', text: '點一位船員一起出海' } : { text: '船員都不在（受傷 / 出海中），等他們回來' }; }
        const go = $1('#trGo'); return { el: go, label: '按「出發」', text: '按「出發」！船員會把打撈的資源帶回來' };
      }
      return this.menu('#btnTrips', '點 \ue01e 出海', '點 \ue01e 出海探索：選目的地、派船員去打撈');
    }
    if (id === 'supply') {
      const pb = $1('#prompt:not(.hide) [data-a=build]'); if (this.vis(pb)) return { el: pb, label: '按「建造」', text: '按「建造」蓋好設施，就會開始生產補給' };
      for (const f of FAC_PREF) { if (s.fac[f].lv >= 3) continue; const T = hud.tags.get(f); if (T && T.el && T.on && this.vis(T.el)) return { el: T.el, label: '點這個設施', text: '點亮起的設施標籤走過去，再按「建造」（會產出糧 / 水 / 油）' }; }
      return { text: '在甲板上找設施標籤（例如 \ue05a 溫室），走過去按「建造」；零件不夠就先去打撈 \ue01e' };
    }
    if (id === 'upgrade') {
      { const f = s.fleet; if (f && f.ships.length && !f.ships.some((x) => x.state === 'dock')) { const sh = f.ships.find((x) => x.state === 'sail' && x.m); const eta = sh ? Math.max(1, Math.ceil((sh.m.end - clock.now()) / 60)) : 0; return { blocked: true, text: `小船正在出海，返港後才能升級${eta ? '（約 ' + eta + ' 分後）' : ''}。先做別的步驟；想讓它回來後留在港裡，按下面的「停止自動出航」（也可到 \ue012 艦隊關掉「自動」）。`, stop: (f.ships.find((x) => x.state === 'sail' && x.auto) || { id: -1 }).id }; } }
      if (mk === 'fleet') { const e = [...document.querySelectorAll('.shipc[data-id] [data-a=up]')].find((x) => !x.disabled && this.vis(x)); return e ? { el: e, label: '按「升級」', text: '按小船卡片上的「升級」（需要零件）' } : { text: '小船的「升級」需要零件；先去打撈 \ue01e 再回來' }; }
      return this.menu('#btnFleet', '點 \ue012 艦隊', '點 \ue012 艦隊，再按小船卡片上的「升級」');
    }
    if (id === 'build') {
      if (mk === 'fleet') { const bs = [...document.querySelectorAll('.dk:not(.lock) [data-a=build]')].filter((x) => !x.disabled && this.vis(x)); const e = bs.find((x) => x.closest('.dk').dataset.t === 'skiff') || bs[0]; return e ? { el: e, label: '按「建造」', text: '在船塢按「建造」（小漁船最便宜）' } : { text: '建造新船要零件與燃料；先去打撈 \ue01e 再回來' }; }
      return this.menu('#btnFleet', '點 \ue012 艦隊', '點 \ue012 艦隊，在下方「船塢」建造一艘新船');
    }
    return null;
  }
  // ---- 面板
  curLine() { const q = this.q(); const done = (l) => !Q.nextStep(this.s, l); if (!this.line || (this.line && done(this.line) && !done(this.line === 'basic' ? 'biz' : 'basic'))) this.line = Q.LINES.find((l) => !done(l.id)) ? Q.LINES.find((l) => !done(l.id)).id : this.line || 'basic'; return this.line; }
  render() {
    const q = this.q(); if (!q) return; const s = this.s; const pr = Q.questProgress(s); const line = this.curLine();
    const sig = JSON.stringify([q.c, q.x, line, q.done, q.fin, q.bp, Q.poolText(q), this.cur && this.cur.text, this.stopId, this.note, this.step && this.step.id]); if (sig === this.sig) return; this.sig = sig;
    this.el.classList.toggle('fold', !!q.c); this.el.querySelector('.qn').textContent = pr.n + '/' + pr.total; this.el.querySelector('.qc').textContent = q.c ? '＋' : '－';
    const tabs = this.el.querySelector('.qtabs'); tabs.innerHTML = Q.LINES.map((l) => { const n = Q.STEPS.filter((x) => x.line === l.id && q.done[x.id]).length; const t = Q.STEPS.filter((x) => x.line === l.id).length; return `<button data-l="${l.id}" class="${l.id === line ? 'on' : ''} ${n === t ? 'ok' : ''}">${l.icon} ${l.name} <small>${n}/${t}</small></button>`; }).join('');
    const st = this.step && !q.done[this.step.id] && this.step.line === line ? this.step : Q.nextStep(s, line); const sE = this.el.querySelector('.qs'), tE = this.el.querySelector('.qt'), rE = this.el.querySelector('.qr'), pE = this.el.querySelector('.qp');
    const dots = Q.STEPS.filter((x) => x.line === line).map((x) => `<i class="${q.done[x.id] ? 'ok' : x === st ? 'now' : ''}" title="${x.name}">${q.done[x.id] ? '\ue027' : x.icon}</i>`).join('');
    if (st) { sE.innerHTML = `<div class="qd">${dots}</div><b>${st.icon} ${st.name}</b>`; tE.textContent = (this.cur && this.cur.text) || ''; rE.innerHTML = '獎勵 ' + rewardText(st.r); }
    else if (q.fin) { sE.innerHTML = `<div class="qd">${dots}</div><b>\ue035 教學全部完成！</b>`; tE.textContent = q.bp === 'parts' ? '已領到所有獎勵。' : `稀有藍圖「${SHIPS[q.bp].icon}${SHIPS[q.bp].name}」已放進船塢。`; rE.textContent = ''; }
    else { sE.innerHTML = `<div class="qd">${dots}</div><b>\ue027 這條線完成了</b>`; tE.textContent = '切到另一條任務線繼續。'; rE.textContent = ''; }
    const pt = Q.poolText(q); pE.textContent = (this.note ? this.note + '\n' : '') + (pt ? '\ue06a 補給庫（倉庫有空位就補進來）：' + pt : ''); pE.style.display = pE.textContent ? '' : 'none'; pE.style.whiteSpace = 'pre-line'; if (this.stopId >= 0) { const bt = document.createElement('button'); bt.className = 'qstop'; bt.dataset.a = 'noauto'; bt.dataset.id = this.stopId; bt.textContent = '\ue086 停止自動出航'; pE.style.display = ''; pE.appendChild(bt); }
  }
  shouldShow() {
    const q = this.q(); const g = this.g; if (!q || q.x || g.homeless) return false; const cl = document.body.classList; const hud = this.hud;
    if (hud.modalKind || hud.helpOpen() || (hud.chart && hud.chart.isOpen()) || (hud.battle && hud.battle.isOpen()) || cl.contains('gaming') || cl.contains('mging') || document.getElementById('entry') || document.getElementById('pvbar') || document.querySelector('#syncdlg')) return false;
    return true;
  }
  /** 每幀（便宜）：高亮圈跟著目標；每 0.25 秒重解析目標、重畫面板 */
  frame(dt) {
    const q = this.q(); if (!q || !this.hud.play) return; this.acc += dt;
    if (this.acc >= 0.25) {
      this.acc = 0; const line = this.curLine(); const open = Q.STEPS.filter((x) => x.line === line && !q.done[x.id]); this.note = ''; let st = open[0] || null, cur = null;
      this.stopId = -1; let bl = null; for (const x of open) { const r = this.resolve(x); if (r && r.blocked) { this.note = '\ue054 ' + x.name + '：' + r.text; bl = r; if (r.stop >= 0 && this.stopId < 0) this.stopId = r.stop; continue; } st = x; cur = r; break; }
      if (!cur && bl) { cur = { text: bl.text }; this.note = ''; }
      this.step = st; const prev = (this.cur && this.cur.text) + '|' + this.note + '|' + (st && st.id); this.cur = q.fin ? null : cur; const now = (this.cur && this.cur.text) + '|' + this.note + '|' + (st && st.id);
      if (now !== prev) this.sig = ''; this.render(); const show = this.shouldShow(); this.el.classList.toggle('hide', !show); if (show) { this.avoidRight(); this.autoFold(); }
      this.ringOn = !!(this.cur && (this.cur.el || this.cur.pt) && !q.x && this.ringAllowed());
    }
    this.place();
  }
  ringAllowed() { const hud = this.hud; const g = this.g; if (g.homeless || (hud.chart && hud.chart.isOpen()) || (hud.battle && hud.battle.isOpen()) || document.body.classList.contains('gaming') || document.getElementById('entry') || hud.helpOpen()) return false; if (hud.modalKind && !(this.cur.el && this.cur.el.closest('#modal'))) return false; return true; }
  place() {
    const R = this.ring; if (!this.ringOn || !this.cur) { if (!R.classList.contains('hide')) R.classList.add('hide'); return; }
    let x, y, w = 46, h = 46, rad = '50%'; const c = this.cur;
    if (c.el) { if (!c.el.isConnected) { R.classList.add('hide'); return; } let r = c.el.getBoundingClientRect(); if (r.width < 2) { R.classList.add('hide'); return; }
      // 彈窗裡的目標若在可見範圍外（小螢幕要捲動），自動捲到中間讓圈真的指得到
      if ((r.bottom > innerHeight - 40 || r.top < 36) && c.el.closest('#modal') && performance.now() - (this._sc || 0) > 1200) { this._sc = performance.now(); try { c.el.scrollIntoView({ block: 'center' }); } catch (e) { /* ignore */ } r = c.el.getBoundingClientRect(); } x = r.left + r.width / 2; y = r.top + r.height / 2; w = r.width + 10; h = r.height + 10; rad = Math.min(w, h) > 60 ? '14px' : '99px'; }
    else { const v = c.pt.clone().project(this.g.camera); if (v.z > 1 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1) { R.classList.add('hide'); return; } x = (v.x * 0.5 + 0.5) * this.g.W; y = (-v.y * 0.5 + 0.5) * this.g.H; }
    R.classList.remove('hide'); const u = R.querySelector('u'); u.style.width = w + 'px'; u.style.height = h + 'px'; u.style.borderRadius = rad;
    const lab = R.querySelector('.ql'); if (lab.textContent !== c.label) lab.textContent = c.label || '';
    const below = y - h / 2 < 64; const bw = lab.offsetWidth || 90; const lx = Math.max(6 + bw / 2, Math.min(innerWidth - 6 - bw / 2, x));
    R.style.transform = `translate(${lx.toFixed(1)}px,${y.toFixed(1)}px)`; R.classList.toggle('below', below); u.style.transform = `translate(${(x - lx).toFixed(1)}px,0) translate(-50%,-50%)`;
    lab.parentElement.style.setProperty('--h', h / 2 + 'px'); R.dataset.x = Math.round(x); R.dataset.y = Math.round(y);
  }
  /** \ue02b 任務視窗裡的教學區塊 */
  fillModal(host) {
    const q = this.q(); if (!q || !host) return; const pr = Q.questProgress(this.s);
    const lines = Q.LINES.map((l) => `<div class="qml"><b>${l.icon} ${l.name}</b>${Q.STEPS.filter((x) => x.line === l.id).map((x) => `<div class="qms ${q.done[x.id] ? 'ok' : ''}"><span>${q.done[x.id] ? '\ue027' : x.icon} ${x.name}</span><small>${rewardText(x.r)}</small></div>`).join('')}</div>`).join('');
    host.innerHTML = `<h3>\ue04e 新手教學 <small class="dim">${pr.n}/${pr.total}${q.fin ? '・已全部完成' : ''}</small></h3><div class="qmod">${lines}<div class="qmb">${q.fin ? '' : `<button class="pri" data-a="qopen">${q.x ? '重新顯示教學提示' : '教學提示已顯示'}</button>`}<small class="dim">做完最後一步可得稀有藍圖「${SHIPS[Q.FINAL_BP[0]].icon}${SHIPS[Q.FINAL_BP[0]].name}」。每一步的獎勵只發一次。</small></div></div>`;
    const b = host.querySelector('[data-a=qopen]'); if (b) b.onclick = () => { this.reopen(); this.hud.closeModal(); };
  }
}
