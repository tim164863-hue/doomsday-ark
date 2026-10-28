// 階段⑤ 第 14 輪：首次登入的「玩家對戰」隱私說明。看完（按任一顆按鈕）之前，什麼都不會公開。
// 這張卡片只列出「真的會公開的欄位」（與 pvp.js 的 pubOf 一一對應），不寫做不到的承諾。
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** onChoose('ok' | 'hide')。回傳 DOM 元素（已掛到 body）。 */
export function showPvNotice(handle, onChoose) {
  if (document.getElementById('pvnotice')) return document.getElementById('pvnotice');
  const el = document.createElement('div'); el.id = 'pvnotice'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  el.innerHTML = `<div class="mcard"><h3>🏴‍☠️ 玩家對戰：先看一下會公開什麼</h3>
    <p class="sub">登入後，你的方舟會出現在附近其他玩家的海圖上（他們也會出現在你的）。這是免費版，沒有伺服器裁判，所以先把話說清楚：</p>
    <div class="pvn"><b>🔓 所有登入的玩家都看得到：</b><ul>
      <li>匿名代號 <b>${esc(handle || '船#XXXX')}</b>（不含姓名、email、照片）</li>
      <li>船的位置（取整到 10 單位；航行中會公開航線端點）</li>
      <li>戰力、護盾剩餘時間</li>
      <li>四種資源的大約數量（取整到儲存上限的 5%）</li>
      <li>最後上線時間（取整到 10 分鐘）</li></ul>
      <b>🔒 不會公開：</b>姓名、email、頭像、存檔、船員、船體狀態、藍圖與材料。<br>
      <b>⚠️ 躲不掉的：</b>這份公開資料存在你的帳號 uid 底下（一串隨機字元，不是 email），雲端也會記下它最後一次更新的時間。</div>
    <div class="pvn"><b>⚔ 風險：</b>你離線超過 10 分鐘後，附近的玩家可以突襲你：每次最多搶 8% 資源（每天 ≤ 20%），事後有 12 小時護盾；你上線時會看到戰報。你突襲別人時，只能拿到宣稱量的 50%。</div>
    <div class="pvn"><b>🕶 隱身：</b>開啟後會<b>立刻刪除</b>你公開的資料，別人看不到你，你也不能突襲別人。登出時也會自動刪除。隨時可以在「附近的船」卡片或帳號選單裡切換。</div>
    <div class="mb"><button data-k="hide">🕶 先隱身</button><button data-k="ok" class="pri">知道了，開始</button></div></div>`;
  el.addEventListener('click', (e) => { const b = e.target.closest('button[data-k]'); if (!b) return; el.remove(); onChoose(b.dataset.k); });
  document.body.appendChild(el); return el;
}
