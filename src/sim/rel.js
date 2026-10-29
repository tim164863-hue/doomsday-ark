// 末日方舟 · 船員關係（純函式式；無 three.js / DOM / Date.now）
// 狀態 s.rel 是「可選欄位」：舊存檔沒有也能載入（ensureRel 補上），所以不需要升 SAVE_VERSION。
//   s.rel = { aff: {"A|B": -100..100}, feud: {"A|B": 吵架結束的秒數}, cool: {"A|B": 冷卻到}, party: 最近派對日, cel: 最近慶祝時間, best: {遊戲: 最高分} }
// T董 也是一個「人」：配對鍵 "T董|某bot" 記錄他和船員的交情（只由玩家的互動改變）。
// 其餘變化全部是 (seed, tick) 的決定性函式：離線一次補算與線上逐格推進結果完全相同。
import { TICK } from './defs.js';
import { hash, mulberry32 } from './rng.js';

export const BOSS = 'player'; // 玩家在關係表裡的中性鍵（舊存檔的 "T董|…" 會在 sanitizeRel 轉成這個）
const OLD_BOSS = 'T董';
export const FRIEND = 30, RIVAL = -25, FIGHT_AT = -22;
export const PARTY_MIN = 21 * 60, PARTY_LEN = 60;              // 當地 21:00–22:00
export const MEALS = [{ id: 'breakfast', name: '早餐', from: 7 * 60 + 30, to: 8 * 60 + 15 }, { id: 'lunch', name: '午餐', from: 12 * 60, to: 12 * 60 + 45 }, { id: 'dinner', name: '晚餐', from: 18 * 60 + 30, to: 19 * 60 + 15 }];
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const r2 = (x) => Math.round(x * 100) / 100;

export const pairKey = (a, b) => (a < b ? a + '|' + b : b + '|' + a);
export const localMin = (ts, tz) => ((Math.floor(ts / 60) + tz) % 1440 + 1440) % 1440;
export const dayOf = (ts, tz) => Math.floor((ts + tz * 60) / 86400);
export const mealAt = (min) => MEALS.find((m) => min >= m.from && min < m.to) || null;

export function ensureRel(s) { if (!s.rel || typeof s.rel !== 'object') s.rel = { aff: {}, feud: {}, cool: {}, party: -1, cel: 0, best: {} }; return s.rel; }
const migKey = (k) => { const i = k.indexOf('|'); const a = k.slice(0, i), b = k.slice(i + 1); return a === OLD_BOSS || b === OLD_BOSS ? pairKey(a === OLD_BOSS ? BOSS : a, b === OLD_BOSS ? BOSS : b) : k; };
const numMap = (o, lo, hi, max = 400) => { const out = {}; if (!o || typeof o !== 'object') return out; let n = 0; for (let k of Object.keys(o)) { const v = o[k]; if (typeof v !== 'number' || !Number.isFinite(v) || k.length > 60 || k.indexOf('|') < 1) continue; k = migKey(k); out[k] = r2(clamp(v, lo, hi)); if (++n >= max) break; } return out; };
/** 驗證 / 修正讀回的 rel；壞掉回傳 null（呼叫端直接刪掉，之後重建）。 */
export function sanitizeRel(r) {
  if (!r || typeof r !== 'object' || Array.isArray(r)) return null;
  const best = {}; if (r.best && typeof r.best === 'object') for (const k of Object.keys(r.best).slice(0, 30)) if (typeof r.best[k] === 'number' && Number.isFinite(r.best[k]) && k.length < 24) best[k] = clamp(Math.round(r.best[k]), 0, 100000);
  return { aff: numMap(r.aff, -100, 100), feud: numMap(r.feud, 0, 1e12), cool: numMap(r.cool, 0, 1e12), party: Number.isFinite(r.party) ? r.party : -1, cel: Number.isFinite(r.cel) ? r.cel : 0, best };
}

export const affOf = (s, a, b) => (s.rel && s.rel.aff[pairKey(a, b)]) || 0;
export function bump(s, a, b, d) { const R = ensureRel(s); const k = pairKey(a, b); const v = r2(clamp((R.aff[k] || 0) + d, -100, 100)); if (Math.abs(v) < 0.05) delete R.aff[k]; else R.aff[k] = v; return v; }
export const kindOf = (aff) => (aff >= FRIEND ? 'friend' : aff <= RIVAL ? 'rival' : 'neutral');
export const relKind = (s, a, b) => kindOf(affOf(s, a, b));
export const feudUntil = (s, a, b) => (s.rel && s.rel.feud[pairKey(a, b)]) || 0;
export const inFeud = (s, a, b, nowSec) => feudUntil(s, a, b) > nowSec;
export const label = (aff) => (aff >= 60 ? '摯友' : aff >= FRIEND ? '好朋友' : aff >= 12 ? '熟識' : aff > -12 ? '普通' : aff > RIVAL ? "不太對盤" : aff > -60 ? '死對頭' : '勢不兩立');
/** 兩人天生合不合得來（-1..1，由種子 + 名字決定，永遠相同）。 */
export function compat(s, a, b) { const u = hash(s.seed, 'compat', pairKey(a, b)) / 4294967296; return Math.round((u * 2 - 1) * 100) / 100; }
const crewList = (s) => Object.keys(s.crew).sort();
const pairsOf = (keys) => { const out = []; for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) out.push([keys[i], keys[j]]); return out; };

/** 每格（1 分鐘）關係演化。亂數只來自 (seed, tick)；push(ev) 由 sim 提供。 */
export function relTick(s, t, tEnd, push) {
  const keys = crewList(s); if (keys.length < 2) return;
  const R = ensureRel(s); const rnd = mulberry32(hash(s.seed, 'rel', t / TICK)); const n = keys.length;
  const draw = [rnd(), rnd(), rnd(), rnd(), rnd(), rnd()];
  // 1. 相處（偶爾幫忙 / 聊天 / 打球 → 交情上升）
  if (draw[0] < 0.14) {
    const i = Math.floor(draw[1] * n); let j = Math.floor(draw[2] * (n - 1)); if (j >= i) j++;
    const a = keys[i], b = keys[j]; const k = pairKey(a, b);
    if (!(R.feud[k] > tEnd)) { const sa = s.statusSnap[a], sb = s.statusSnap[b]; const base = sa === 'rest' && sb === 'rest' ? 2.2 : sa === 'work' && sb === 'work' ? 0.9 : 0.5; bump(s, a, b, base * Math.max(0.05, 1 + 1.1 * compat(s, a, b))); }
  }
  // 2. 摩擦（意見不合 → 交情下降）
  if (draw[3] < 0.045) {
    const i = Math.floor(draw[4] * n); let j = Math.floor(draw[5] * (n - 1)); if (j >= i) j++;
    const a = keys[i], b = keys[j]; bump(s, a, b, -(2 + 2.5 * draw[0]) * Math.max(0.1, 1 - 1.4 * compat(s, a, b)));
  }
  // 3. 自然淡化 + 吵架 / 和好
  const ps = pairsOf(keys);
  for (const [a, b] of ps) {
    const k = pairKey(a, b); const fr = rnd();
    if (R.aff[k]) { R.aff[k] = r2(R.aff[k] * 0.9997); if (Math.abs(R.aff[k]) < 0.05) delete R.aff[k]; }
    if (R.feud[k] && R.feud[k] <= tEnd) { delete R.feud[k]; R.cool[k] = tEnd + 30 * 3600; const v = bump(s, a, b, 28); push({ t: tEnd, type: 'makeup', who: a, with: b, text: `${a} 和 ${b} 和好了，互相道了歉。` }); void v; }
    else if (!R.feud[k] && (R.aff[k] || 0) <= FIGHT_AT && !(R.cool[k] > tEnd) && fr < 0.0005) {
      R.feud[k] = tEnd + (25 + Math.floor(fr * 40000) % 35) * 60; bump(s, a, b, -6); push({ t: tEnd, type: 'fight', who: a, with: b, text: `${a} 和 ${b} 吵起來了…氣氛有點僵。` });
    }
  }
  for (const k of Object.keys(R.cool)) if (R.cool[k] <= tEnd) delete R.cool[k];
  // 4. 夜間派對：當地 21:00 那一格決定今晚辦不辦（決定性）
  if (localMin(t, s.tz) === PARTY_MIN - 1 && n >= 3) { const dk = dayOf(tEnd, s.tz); if (partyOn(s, dk) && R.party !== dk) { R.party = dk; for (const [a, b] of ps) if (!(R.feud[pairKey(a, b)] > tEnd)) bump(s, a, b, 2.5); push({ t: tEnd, type: 'party', text: '\ue035 夜間派對開始了！大家聚到休閒甲板，氣氛很熱。' }); } }
}
/** 今晚有沒有派對（種子 + 日期決定）。 */
export const partyOn = (s, dk) => hash(s.seed, 'party', dk) % 100 < 35;
export const partyWindow = (s, ts) => { const m = localMin(ts, s.tz); return m >= PARTY_MIN && m < PARTY_MIN + PARTY_LEN && partyOn(s, dayOf(ts, s.tz)); };

/** 慶祝（例如大豐收）：全員交情上升。 */
export function celebrate(s, tEnd, push, text) {
  const keys = crewList(s); if (keys.length < 2) return; const R = ensureRel(s); R.cel = tEnd;
  for (const [a, b] of pairsOf(keys)) if (!(R.feud[pairKey(a, b)] > tEnd)) bump(s, a, b, 3);
  push({ t: tEnd, type: 'celebrate', text: '\ue035 ' + text });
}
/** 共患難：風暴 / 生病 / 缺糧時大家互相幫忙，交情上升（生病者額外多一位照顧他的人）。 */
export function rally(s, tEnd, push, kind, who, pickF = 0) {
  const keys = crewList(s); if (keys.length < 2) return; ensureRel(s);
  for (const [a, b] of pairsOf(keys)) bump(s, a, b, kind === 'sick' ? 0.5 : 1.5);
  if (kind === 'sick' && who && keys.includes(who)) { const others = keys.filter((k) => k !== who); const h = others[Math.floor(pickF * others.length) % others.length]; bump(s, who, h, 5); push({ t: tEnd, type: 'help', who: h, with: who, text: `${h} 悉心照顧生病的 ${who}。` }); }
}

/** 駐守者的團隊加成：和同船夥伴交情好 → 效率 +（最多 +10%）；交情差 / 正在吵架 → −（最多 −8%）。 */
export function teamBonus(s, k, nowSec) {
  if (!s.rel) return 0; const others = Object.keys(s.crew).filter((x) => x !== k && !s.crew[x].away); if (!others.length) return 0;
  let sum = 0; for (const o of others) sum += s.rel.aff[pairKey(k, o)] || 0;
  let b = clamp(sum / others.length / 100 * 0.25, -0.08, 0.10);
  for (const o of others) if ((s.rel.feud[pairKey(k, o)] || 0) > nowSec) { b -= 0.06; break; }
  return r2(clamp(b, -0.12, 0.10));
}
export const friendsOf = (s, k, minAff = FRIEND) => Object.keys(s.crew).filter((o) => o !== k && affOf(s, k, o) >= minAff).sort((a, b) => affOf(s, k, b) - affOf(s, k, a));
export const rivalsOf = (s, k, maxAff = RIVAL) => Object.keys(s.crew).filter((o) => o !== k && affOf(s, k, o) <= maxAff).sort((a, b) => affOf(s, k, a) - affOf(s, k, b));

// ----------------------------------------------------------------- T董 邀請船員一起玩
const MOOD_ADJ = { happy: 0.2, bored: 0.18, focus: -0.12, tired: -0.28, anxious: -0.15 };
/** 船員願不願意接受邀請（0..1）。 */
export function inviteChance(c) {
  if (c.sleeping || c.away) return 0; if (c.hurt) return 0.08;
  let p = 0.62 + (c.aff || 0) / 220 + (MOOD_ADJ[c.mood] ?? 0) + (c.cat === 'work' ? -0.18 : c.cat === 'rest' ? 0.08 : 0) + (c.cheered ? 0.1 : 0);
  return clamp(p, 0.05, 0.97);
}
/** 同一分鐘內同一個人的答案固定（避免狂按重抽）。 */
export function inviteRoll(s, key, nowSec) { return mulberry32(hash(s.seed, 'invite', key, Math.floor(nowSec / 60)))(); }
/** 一起玩完之後：交情 + 雙方心情由 UI 層處理。result 為 T董 視角：win / lose / draw。 */
export function playTogether(s, key, result) {
  const d = result === 'win' ? 2 : result === 'lose' ? 3 : 2.5; const v = bump(s, BOSS, key, d); return { ok: true, aff: v, kind: kindOf(v) };
}
export function inviteDeclined(s, key) { return bump(s, BOSS, key, -0.5); }
export function saveBest(s, game, score) { const R = ensureRel(s); if (!(R.best[game] >= score)) { R.best[game] = Math.round(score); return true; } return false; }

// ----------------------------------------------------------------- 計時小遊戲（純邏輯）
/** 指針來回掃：t 秒時的位置 0..1（三角波）。 */
export const markerPos = (t, speed, phase = 0) => { const u = ((t * speed + phase) % 2 + 2) % 2; return u < 1 ? u : 2 - u; };
/** 位置離甜蜜點中心越近越好：回傳 0..1（1 = 完美）；sweet 是甜蜜區半寬。 */
export const timingQuality = (pos, center = 0.5, sweet = 0.08) => { const d = Math.abs(pos - center); if (d <= sweet * 0.35) return 1; return clamp(1 - (d - sweet * 0.35) / (sweet * 3.2), 0, 1); };
export const gradeOf = (q) => (q >= 0.92 ? 'perfect' : q >= 0.6 ? 'good' : q >= 0.28 ? 'ok' : 'miss');
/** 對打：玩家這一拍的品質 → 對手能不能接到（skill 0..1；rnd 0..1）。 */
export const botReturns = (q, skill, rnd) => { const p = clamp(0.92 - q * 0.62 + (skill - 0.5) * 0.3, 0.12, 0.95); return rnd < p; };
