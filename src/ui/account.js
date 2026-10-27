// 帳號 UI：Google 登入按鈕 / 頭像與登出選單 / 雲端同步狀態 / 首次登入的存檔選擇對話框
import { signIn, signOutNow, inAppBrowser, OWNER_EMAIL } from '../save/cloud.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (sec) => { const d = new Date(sec * 1000); const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
const hm = (ms) => { const d = new Date(ms); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const GSVG = '<svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.9 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';

/** 首次登入 / 本機與雲端都有存檔時的選擇。回傳 'local' | 'cloud'。 */
export function chooseSave({ cloud, local, newer }) {
  return new Promise((resolve) => {
    const card = (key, title, s, btn) => `<div class="sc${cloud && newer === key ? ' newer' : ''}"><div class="st">${title}${cloud && newer === key ? ' <i>較新</i>' : ''}</div>${s ? `<div class="sd">最後遊玩 ${fmt(s.lastSeen)}<br>建立 ${fmt(s.created)}<br>設施等級合計 ${s.facLv} · 出海 ${s.trips} 次</div>` : '<div class="sd">（目前是空的）</div>'}<button data-k="${key}" class="${newer === key ? 'pri' : ''}">${btn}</button></div>`;
    const el = document.createElement('div'); el.id = 'syncdlg';
    el.innerHTML = `<div class="mcard"><h3>☁️ 發現本機進度</h3><p class="sub">${cloud ? '雲端和這台裝置各有一份進度，選一份繼續（預設保留較新的）。沒選的那份不會被合併。' : '你的雲端方舟還是空的。要把這台裝置上的進度上傳嗎？'}</p><div class="scs">${cloud ? card('cloud', '☁️ 雲端存檔', cloud, '用雲端的') : ''}${card('local', '📱 本機存檔', local, cloud ? '用本機的（覆蓋雲端）' : '上傳到雲端')}</div>${cloud ? '' : '<button data-k="cloud" class="ghost">不用，從全新方舟開始</button>'}</div>`;
    el.addEventListener('click', (e) => { const k = e.target.closest('button[data-k]'); if (!k) return; el.remove(); resolve(k.dataset.k); });
    document.body.appendChild(el);
  });
}

export class AccountUI {
  constructor(game, cloud, boot) {
    this.game = game; this.cloud = cloud; this.boot = boot; this.user = boot.user; this.open = false; this.busy = false;
    const tools = document.querySelector('#top .tools'); this.btn = document.createElement('button'); this.btn.id = 'acct'; tools.insertBefore(this.btn, tools.firstChild);
    this.menu = document.createElement('div'); this.menu.id = 'acctMenu'; this.menu.hidden = true; document.getElementById('ui').appendChild(this.menu);
    this.btn.onclick = (e) => { e.stopPropagation(); this.toggle(); };
    document.addEventListener('pointerdown', (e) => { if (this.open && !this.menu.contains(e.target) && e.target !== this.btn && !this.btn.contains(e.target)) this.toggle(false); });
    const ad = boot.adapter; if (ad && ad.onStatus) ad.onStatus(() => { this.renderBtn(); if (this.open) this.renderMenu(); });
    this.renderBtn();
    // 登入沒完成（redirect 被瀏覽器擋 / 初始化失敗 / 網域未授權）時提示
    const ae = cloud.authError; if (ae && ae.code === 'ark/redirect-lost') setTimeout(() => game.ui.toast('登入沒有完成（此瀏覽器擋掉了跳轉登入），請改用電腦版或換瀏覽器再試'), 2500);
    else if (ae && ae.code === 'auth/unauthorized-domain') setTimeout(() => game.ui.toast('這個網址尚未加入 Firebase 授權網域'), 2500);
    for (const n of boot.notes || []) {
      if (n === 'cloud-offline') setTimeout(() => game.ui.toast(boot.mode === 'mirror' ? '⚠️ 雲端連不上，先用本機暫存進度' : '⚠️ 雲端連不上，這次進度不會儲存'), 3000);
      if (n === 'cloud-corrupt') setTimeout(() => game.ui.toast('雲端存檔損毀，已改用新的方舟'), 3000);
    }
  }
  syncText() {
    const a = this.boot.adapter; if (this.boot.mode === 'mirror') return '⚠️ 雲端連不上 · 暫存於本機';
    if (this.boot.mode === 'memory') return '⚠️ 雲端連不上 · 本次不儲存';
    if (!a || !a.status) return ''; if (a.status === 'saving') return '☁️ 同步中…';
    if (a.status === 'error' || a.status === 'offline') return '⚠️ 同步失敗，稍後重試'; if (a.status === 'ok') return '☁️ 已同步 ' + hm(a.lastOk); return a.dirty ? '☁️ 待同步' : '☁️ 已連線';
  }
  renderBtn() {
    const u = this.user;
    if (!u) { this.btn.className = 'guest'; this.btn.innerHTML = '🔑<span class="lbl"> 登入</span>'; this.btn.title = 'Google 登入（雲端存檔）'; return; }
    const st = this.boot.adapter && this.boot.adapter.status; const bad = st === 'error' || st === 'offline' || this.boot.mode !== 'cloud';
    this.btn.className = 'in' + (bad ? ' bad' : ''); this.btn.title = (u.displayName || u.email) + '（點開選單）';
    const av = u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : `<b>${esc((u.displayName || u.email || '?').slice(0, 1).toUpperCase())}</b>`;
    this.btn.innerHTML = av + `<span class="lbl"> ${esc((u.displayName || u.email).split(' ')[0].slice(0, 10))}</span><i class="dot"></i>`;
  }
  toggle(v) { this.open = v === undefined ? !this.open : v; this.menu.hidden = !this.open; if (this.open) this.renderMenu(); }
  renderMenu() {
    const u = this.user, m = this.menu;
    if (!u) {
      const bad = inAppBrowser(); const un = !this.cloud.available;
      m.innerHTML = `<div class="ah">訪客模式</div><p>進度只存在這台裝置（清除瀏覽器資料會消失）。登入後可雲端保存、換裝置繼續，並擁有自己的方舟與虛擬船員。</p>
        <button class="gbtn" id="gLogin"${un ? ' disabled' : ''}>${GSVG}<span>使用 Google 登入</span></button>
        ${un ? '<p class="warn">雲端服務暫時連不上，稍後重新整理再試。</p>' : ''}${bad ? '<p class="warn">偵測到內建瀏覽器（LINE / Facebook 等），Google 會擋下登入。請用 Safari / Chrome 開啟本頁。</p>' : ''}<div class="msg" id="acctMsg"></div>`;
      m.querySelector('#gLogin').onclick = () => this.login();
    } else {
      const owner = this.boot.owner;
      m.innerHTML = `<div class="ap">${u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : '<b>' + esc((u.displayName || u.email).slice(0, 1).toUpperCase()) + '</b>'}<div><div class="an">${esc(u.displayName || '玩家')}</div><div class="ae">${esc(u.email)}</div></div></div>
        <div class="ar">${owner ? '⚓ 船東：顯示真實 bot 與交易電視' : '🧑‍✈️ 虛擬船員（不含任何真人 bot 資料）'}</div><div class="ar" id="acctSync">${this.syncText()}</div>
        <button id="gSync" class="ghost">立即同步</button><button id="gOut" class="out">登出</button><div class="msg" id="acctMsg"></div>`;
      m.querySelector('#gOut').onclick = () => this.logout(); m.querySelector('#gSync').onclick = async () => { const a = this.boot.adapter; if (a && a.canWrite) { await this.game.play.save(true); this.renderMenu(); } else this.say('目前無法同步'); };
    }
  }
  say(t) { const e = this.menu.querySelector('#acctMsg'); if (e) e.textContent = t; }
  async login() {
    if (this.busy) return; this.busy = true; this.say('開啟 Google 登入視窗…');
    const r = await signIn(); this.busy = false;
    if (r.ok) { this.say('登入成功，載入你的方舟…'); this.game.play && this.game.play.save(true); setTimeout(() => location.reload(), 400); }
    else if (r.redirecting) this.say('前往 Google 登入…');
    else if (r.cancelled) this.say('已取消登入');
    else { const c = r.error && r.error.code; this.say(c === 'auth/unauthorized-domain' ? '此網址尚未加入授權網域' : c === 'auth/network-request-failed' ? '網路連線失敗' : '登入失敗，請再試一次'); }
  }
  async logout() {
    this.say('登出中…'); try { await this.game.play.save(true); } catch (e) { /* ignore */ }
    try { await signOutNow(); } catch (e) { /* ignore */ } location.reload();
  }
}
