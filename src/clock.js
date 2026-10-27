// 遊戲時鐘（秒）。遊戲進度只看這個時鐘，不看 dayT（攝影模式光線時間）。
// - 訪客：直接用裝置時間（localStorage 本來就能被改，沒有防竄改的意義）。
// - 登入：用「伺服器時間」當錨點（Firestore serverTimestamp 讀回），之後用 performance.now() 推進，
//   所以遊戲中途改裝置時鐘沒有用；每 10 分鐘 / 回到前景時重新對時（因為部分系統睡眠時 performance.now 會停）。
// - 登入但連不上伺服器：「未對時」→ 離線補算最多只承認上次存檔後 30 分鐘，避免用改時鐘刷離線收益。
export const UNSYNCED_GRACE = 30 * 60;

export const clock = {
  mode: 'wall',      // 'wall' | 'server'
  synced: false,
  skew: 0,           // 伺服器 - 裝置（秒），僅供顯示 / 偵測
  _a: 0, _p: 0,
  now() { return this.mode === 'wall' ? Date.now() / 1000 : this._a + (performance.now() - this._p) / 1000; },
  /** 取得伺服器時間（秒）後呼叫：錨定。 */
  syncServer(serverSec) {
    this.skew = serverSec - Date.now() / 1000; this._a = serverSec; this._p = performance.now(); this.mode = 'server'; this.synced = true;
  },
  /** 登入但無法對時：以最後已知時間為基準，最多承認 UNSYNCED_GRACE 秒的離線時間。 */
  syncUnverified(lastKnownSec) {
    const dev = Date.now() / 1000; this._a = Math.min(dev, lastKnownSec + UNSYNCED_GRACE); this._p = performance.now(); this.mode = 'server'; this.synced = false; this.skew = this._a - dev;
  },
  useWall() { this.mode = 'wall'; this.synced = false; this.skew = 0; },
};
