// 存檔轉接層：遊戲只依賴 { load(), save(state), clear() } 三個非同步方法。
//   - LocalStorageAdapter：訪客（key ark.save.v1）。
//   - CloudAdapter（cloud.js）：登入後 Firestore arks/{uid} + 本機鏡像 ark.cache.{uid}。
//   - MemoryAdapter：示範模式 / 雲端連不上又沒有鏡像時（不寫任何地方，避免蓋掉雲端存檔）。
// 要用哪一個由 boot.js 的 bootSave() 決定。
import { SAVE_VERSION } from '../sim/defs.js';

export class LocalStorageAdapter {
  constructor(key = 'ark.save.v' + SAVE_VERSION, store = null) { this.key = key; this.name = 'localStorage'; this.store = store || (typeof localStorage !== 'undefined' ? localStorage : null); }
  async load() {
    try { const raw = this.store.getItem(this.key); if (!raw) return null; const s = JSON.parse(raw); return s && s.v === SAVE_VERSION ? s : null; } catch (e) { return null; }
  }
  async save(state) { try { this.store.setItem(this.key, JSON.stringify(state)); } catch (e) { /* 空間不足或無痕模式：略過 */ } }
  async clear() { try { this.store.removeItem(this.key); } catch (e) { /* ignore */ } }
}

export class MemoryAdapter {
  constructor() { this.name = 'memory'; this.canWrite = false; }
  async load() { return null; } async save() {} async clear() {}
}
