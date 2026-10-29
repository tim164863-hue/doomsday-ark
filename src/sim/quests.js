// 新手教學任務（兩條任務線）——純邏輯、決定性、可存檔。
// 設計與獎勵換算見 DESIGN-quests.md。存檔欄位：state.quest（可選；舊存檔沒有就在第一次 ensureQuest 時建立；SAVE_VERSION 不變）。
//   state.quest = { v:1, ev:{move,talk,chart,sail,salvage,supply,upgrade,buildShip}:1, done:{stepId:1}, pool:{food,water,fuel,parts}, bp:'patrol'|'parts'|0, fin:0|1, c:0|1(收合), x:0|1(關閉教學) }
// 獎勵只在「步驟第一次完成」時發一次（done 旗標），塞不下的部分暫存在 pool（補給庫），倉庫有空位再補進來——總量固定、不可重複刷。
import { resCap } from './promo.js';
import { LV_MAX, FLEET_MAX } from './fleetdefs.js';
import { grantBlueprint } from './fleet.js';
import { MAX_LV, USE, SHIP_FUEL_USE } from './defs.js';

export const RES4 = ['food', 'water', 'fuel', 'parts'];
export const LINES = [
  { id: 'basic', icon: '🧭', name: '基本操作' },
  { id: 'biz', icon: '⚓', name: '經營' },
];
// ev = 事件旗標（由遊戲層的動作掛勾設定）；r = 完成這一步的獎勵（一次）
export const STEPS = [
  { id: 'move', line: 'basic', ev: 'move', icon: '🚶', name: '走動一下', r: { food: 50, water: 60, fuel: 60, parts: 10 } },
  { id: 'talk', line: 'basic', ev: 'talk', icon: '💬', name: '和船員聊聊', r: { food: 50, water: 60, fuel: 60, parts: 10 } },
  { id: 'chart', line: 'basic', ev: 'chart', icon: '🧭', name: '打開航海圖', r: { food: 60, water: 70, fuel: 80, parts: 20 } },
  { id: 'sail', line: 'basic', ev: 'sail', icon: '🛳️', name: '開船出航', r: { food: 60, water: 70, fuel: 100, parts: 20 } },
  { id: 'salvage', line: 'biz', ev: 'salvage', icon: '🚣', name: '出海打撈', r: { food: 130, water: 150, fuel: 120, parts: 40 } },
  { id: 'supply', line: 'biz', ev: 'supply', icon: '📦', name: '補給：蓋設施', r: { food: 120, water: 130, fuel: 140, parts: 40 } },
  { id: 'upgrade', line: 'biz', ev: 'upgrade', icon: '⬆️', name: '升級小船', r: { food: 140, water: 160, fuel: 160, parts: 50 } },
  { id: 'build', line: 'biz', ev: 'buildShip', icon: '🛠️', name: '建造新船', r: { food: 150, water: 180, fuel: 160, parts: 50 } },
];
export const STEP_IDS = STEPS.map((x) => x.id);
export const EVENTS = STEPS.map((x) => x.ev);
export const REWARD_TOTAL = Object.fromEntries(RES4.map((k) => [k, STEPS.reduce((a, x) => a + (x.r[k] || 0), 0)]));
/** 最後一步完成後的稀有藍圖（依序找第一張還沒有的；全有就改給零件） */
export const FINAL_BP = ['patrol', 'sub', 'icebreaker', 'tug', 'speedboat'];
export const FINAL_FALLBACK = { parts: 100 };
export const POOL_MAX = 3000;
const STEP_BY = Object.fromEntries(STEPS.map((x) => [x.id, x]));
export const stepOf = (id) => STEP_BY[id] || null;

/** 「正常消耗」換算：一天 = 1440 分鐘。n = 船員數 + 1（小船 2–3 位船員 → n = 3–4）。 */
export function dayUse(n) { return { food: USE.food * n * 1440, water: USE.water * n * 1440, fuel: (USE.fuel * n + SHIP_FUEL_USE) * 1440 }; }
export function rewardDays(n) { const u = dayUse(n); return { food: REWARD_TOTAL.food / u.food, water: REWARD_TOTAL.water / u.water, fuel: REWARD_TOTAL.fuel / u.fuel }; }

const bit = (x) => (x ? 1 : 0);
const num = (x, mx) => (typeof x === 'number' && Number.isFinite(x) ? Math.max(0, Math.min(mx, Math.round(x * 10) / 10)) : 0);
/** 讀回存檔時清理：未知欄位丟掉、數值夾住。回傳 null 代表沒有（舊存檔）。 */
export function sanitizeQuest(q) {
  if (!q || typeof q !== 'object' || q.v !== 1) return null;
  const o = { v: 1, ev: {}, done: {}, pool: {}, bp: 0, fin: bit(q.fin), c: bit(q.c), x: bit(q.x) };
  for (const e of EVENTS) if (q.ev && q.ev[e]) o.ev[e] = 1;
  for (const id of STEP_IDS) if (q.done && q.done[id]) o.done[id] = 1;
  for (const k of RES4) o.pool[k] = num(q.pool && q.pool[k], Math.min(POOL_MAX, REWARD_TOTAL[k]));
  o.bp = q.bp === 'parts' ? 'parts' : FINAL_BP.includes(q.bp) ? q.bp : 0;
  if (!STEP_IDS.every((id) => o.done[id])) { o.fin = 0; o.bp = 0; }
  return o;
}
export function newQuest() { return { v: 1, ev: {}, done: {}, pool: { food: 0, water: 0, fuel: 0, parts: 0 }, bp: 0, fin: 0, c: 0, x: 0 }; }
/** 確保 s.quest 存在且乾淨（沒有就建立）。 */
export function ensureQuest(s) { const q = sanitizeQuest(s.quest) || newQuest(); s.quest = q; return q; }

function give(s, q, r) {   // 發獎勵：先進倉庫（受上限），塞不下的進補給庫
  const got = {};
  for (const k of RES4) {
    const v = r[k] || 0; if (!v) continue; const cap = resCap(s, k); const room = Math.max(0, cap - s.res[k]); const a = Math.min(v, room);
    s.res[k] += a; q.pool[k] = Math.min(POOL_MAX, q.pool[k] + (v - a)); got[k] = v;
  }
  return got;
}
/** 補給庫 → 倉庫（有空位才補）。回傳是否有變動。 */
export function flushPool(s) {
  const q = s.quest; if (!q) return false; let ch = false;
  for (const k of RES4) { const p = q.pool[k]; if (!(p > 0)) continue; const room = Math.max(0, resCap(s, k) - s.res[k]); const a = Math.min(p, room); if (a > 0.01) { s.res[k] += a; q.pool[k] = Math.round((p - a) * 100) / 100; ch = true; } }
  return ch;
}
/** 玩家做不到的步驟（已經到頂）視為已達成，避免卡關。 */
function impossible(s, ev) {
  const f = s.fleet; if (!f) return false;
  if (ev === 'upgrade') return f.ships.length > 0 && f.ships.every((x) => x.lv >= LV_MAX);
  if (ev === 'buildShip') return f.ships.length >= FLEET_MAX;
  if (ev === 'supply') return Object.values(s.fac).every((x) => x.lv >= MAX_LV);
  return false;
}
/** 檢查完成條件並發獎勵（同步、決定性）。回傳這次新完成的步驟 [{step, got, bp}]。 */
export function evalQuest(s) {
  const q = ensureQuest(s); const out = [];
  for (const st of STEPS) {
    if (q.done[st.id]) continue;
    if (!(q.ev[st.ev] || impossible(s, st.ev))) continue;
    q.done[st.id] = 1; out.push({ step: st, got: give(s, q, st.r) });
  }
  if (!q.fin && STEP_IDS.every((id) => q.done[id])) {
    q.fin = 1; let bp = 0;
    for (const b of FINAL_BP) if (grantBlueprint(s, b)) { bp = b; break; }
    if (!bp) { give(s, q, FINAL_FALLBACK); bp = 'parts'; }
    q.bp = bp; out.push({ step: null, final: true, bp });
  }
  flushPool(s);
  return out;
}
/** 事件掛勾：回傳新完成的步驟（可能為空）。 */
export function noteQuest(s, ev) { const q = ensureQuest(s); if (!EVENTS.includes(ev)) return []; q.ev[ev] = 1; return evalQuest(s); }
export const questDone = (s, id) => !!(s.quest && s.quest.done && s.quest.done[id]);
export function questProgress(s) { const q = s.quest || newQuest(); const n = STEP_IDS.filter((id) => q.done[id]).length; return { n, total: STEPS.length, fin: !!q.fin }; }
/** 這條線第一個還沒完成的步驟（沒有 = 這條線完成）。 */
export function nextStep(s, line) { const q = s.quest || newQuest(); return STEPS.find((x) => x.line === line && !q.done[x.id]) || null; }
export const poolText = (q) => RES4.filter((k) => q && q.pool[k] > 0.5).map((k) => ({ food: '🍖', water: '💧', fuel: '⛽', parts: '🔩' }[k] + Math.round(q.pool[k]))).join(' ');
