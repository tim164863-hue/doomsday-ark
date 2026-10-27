// 〈預留〉登船 API（Boarding API）的資料形狀 —— 僅預留，**尚未開放**：沒有任何端點、沒有 Firestore 規則、沒有任何呼叫它的程式。
//
// 構想：其他人的 AI bot 之後可以「登船」成為某座方舟的虛擬船員，只提供 *狀態*（唯讀），不接受任何指令：
//   - 方向：bot → 方舟（單向、唯讀）。方舟不會對 bot 送出任何東西，bot 也不能操作方舟。
//   - 內容：只有名稱 / 狀態分類 / 類型，與 data.js 的 normalize() 輸出（crew[]）同一格式。
//   - 不含：路徑、金鑰、備註、對話內容、交易資料。
// 開放之前需要：方舟主人同意（ark.boarding.enabled）、每船員簽發的唯讀 token、速率限制、獨立的 Firestore 規則。
export const BOARDING_ENABLED = false;
export const BOARDING_VERSION = 1;

/** @typedef {{ name: string, cat: 'work'|'rest'|'off', kind?: 'manager'|'research'|'trader'|'other', at: number }} BoardingStatus */

/** 驗證 / 淨化一筆 bot 狀態（形狀固定；未知欄位一律丟棄）。回傳 null 代表不合法。 */
export function sanitizeBoardingStatus(x, nowMs = Date.now()) {
  if (!x || typeof x !== 'object') return null;
  const name = String(x.name || '').slice(0, 24).replace(/[\u0000-\u001f<>]/g, '').trim(); if (!name) return null;
  const cat = ['work', 'rest', 'off'].includes(x.cat) ? x.cat : null; if (!cat) return null;
  const kind = ['manager', 'research', 'trader', 'other'].includes(x.kind) ? x.kind : 'other';
  const at = Number.isFinite(+x.at) ? Math.min(+x.at, nowMs) : nowMs;
  return { name, cat, kind, at };
}

/** 轉成遊戲的 crew info（與 normalize() 同格式），讓虛擬船員走同一條管線。 */
export function boardingToCrewInfo(st, nowMs = Date.now()) {
  const s = sanitizeBoardingStatus(st, nowMs); if (!s) return null;
  const ageMin = Math.max(0, (nowMs - s.at) / 60000);
  return { key: s.name, title: s.name, kind: s.kind, status: s.cat === 'work' ? 'tool' : s.cat === 'rest' ? 'done' : 'idle', cat: s.cat, ageMin, since: s.at, virtual: true };
}
