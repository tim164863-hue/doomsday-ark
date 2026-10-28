// 第一個畫面：新瀏覽器（沒有登入、也沒選過訪客）先選 [用 Google 登入] 或 [訪客遊玩]。
// 只有船東帳號登入後才會載入 T董 的遊輪方舟；訪客與其他 Google 帳號從選船開始（小漁船 / 洋流號快艇 / 打撈拖船）。
import { signIn, inAppBrowser } from '../save/cloud.js';
import { MODE_KEY } from '../save/boot.js';

const GSVG = '<svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.9 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';

/** @returns {Promise<'guest'|'google'>} 選了訪客 → 'guest'（已寫入記憶）；Google 登入成功 / 跳轉 → 永遠不會 resolve（頁面會重新載入）。 */
export function showEntry({ cloud }) {
  return new Promise((resolve) => {
    const un = !cloud.available, bad = inAppBrowser();
    const el = document.createElement('div'); el.id = 'entry';
    el.innerHTML = `<div class="ecard"><div class="et">末日方舟</div><div class="es">DOOMSDAY ARK</div>
      <p class="ep">在末日的海上，開著你的方舟，探索、打撈、經營船員。</p>
      <button class="gbtn" id="eGoogle"${un ? ' disabled' : ''}>${GSVG}<span>用 Google 登入</span></button>
      <button class="guest" id="eGuest">🧑‍✈️ 訪客遊玩</button>
      <p class="en">登入可雲端保存、換裝置繼續。訪客進度只存在這台裝置。<br>兩種玩法都從挑選第一艘小船開始：小漁船 / 洋流號快艇 / 打撈拖船。</p>
      ${un ? '<p class="ew">雲端服務暫時連不上，目前只能訪客遊玩。</p>' : ''}${bad ? '<p class="ew">偵測到內建瀏覽器（LINE / Facebook 等），Google 會擋下登入。請用 Safari / Chrome 開啟本頁。</p>' : ''}<div class="em" id="eMsg"></div></div>`;
    document.body.appendChild(el); const msg = (t) => { el.querySelector('#eMsg').textContent = t; };
    el.querySelector('#eGuest').onclick = () => { try { localStorage.setItem(MODE_KEY, 'guest'); } catch (e) { /* ignore */ } el.remove(); resolve('guest'); };
    el.querySelector('#eGoogle').onclick = async () => {
      msg('開啟 Google 登入視窗…'); const r = await signIn();
      if (r.ok) { try { localStorage.setItem(MODE_KEY, 'google'); } catch (e) { /* ignore */ } msg('登入成功，載入中…'); setTimeout(() => location.reload(), 300); }
      else if (r.redirecting) { try { localStorage.setItem(MODE_KEY, 'google'); } catch (e) { /* ignore */ } msg('前往 Google 登入…'); }
      else if (r.cancelled) msg('已取消登入，可以再按一次，或選擇訪客遊玩');
      else { const c = r.error && r.error.code; msg(c === 'auth/unauthorized-domain' ? '此網址尚未加入授權網域' : c === 'auth/network-request-failed' ? '網路連線失敗' : '登入失敗，請再試一次'); }
    };
  });
}
