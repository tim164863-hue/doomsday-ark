// 存檔轉接層：遊戲只依賴 { load(), save(state), clear() } 這三個非同步方法。
// 目前用 localStorage；之後要換成 Firebase（Google 登入 + Firestore）時，
// 只要寫一個同介面的 FirestoreAdapter（例如 users/{uid}/saves/main 文件）並在 createAdapter() 回傳即可，
// 遊戲其他地方完全不用改。這裡刻意「沒有」任何 Firebase 程式碼，也不會連任何網路服務。
import { SAVE_VERSION } from '../sim/defs.js';

/** @typedef {{ load(): Promise<object|null>, save(state: object): Promise<void>, clear(): Promise<void>, name: string }} SaveAdapter */

export class LocalStorageAdapter {
  constructor(key = 'ark.save.v' + SAVE_VERSION) { this.key = key; this.name = 'localStorage'; }
  async load() {
    try { const raw = localStorage.getItem(this.key); if (!raw) return null; const s = JSON.parse(raw); return s && s.v === SAVE_VERSION ? s : null; } catch (e) { return null; }
  }
  async save(state) { try { localStorage.setItem(this.key, JSON.stringify(state)); } catch (e) { /* 空間不足或無痕模式：略過 */ } }
  async clear() { try { localStorage.removeItem(this.key); } catch (e) { /* ignore */ } }
}

export function createAdapter() {
  // 之後：if (user is signed in) return new FirestoreAdapter(uid);
  return new LocalStorageAdapter();
}
