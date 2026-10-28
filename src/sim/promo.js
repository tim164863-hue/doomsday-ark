// 階段③：旗艦晉升（純函式、決定性；不依賴 three.js / DOM）。設計見 DESIGN-expansion.md §3。
// 存檔（選填、可加，SAVE_VERSION 仍是 1）：
//   fleet.flag = { branch: 'war'|'mer'|'sci'|null, tier: 0..3, pj: {to, parts, fuel, food, water} | null, up: {to, start, end} | null }
//   pj = 「籌備中」的晉升專案（資源可分批投入，因為倉庫上限比晉升總量小）；up = 已開工的改裝（完成時間在開工時就寫死，離線補算只看 end）。
// 擁有者的旗艦是郵輪；訪客的旗艦是自己的家（小船）——同一份 flag，數值用「相對 T0 的倍率」套用到該船。
import { RES, RES_KEYS } from './defs.js';
import { WORLD } from './fleetdefs.js';
import { PROMO, PROMO_BP, MATERIALS, MAT_ORDER, SPECIAL_ZONES, SZ_ORDER, routeZones, zoneAtPoint } from './szdata.js';
import { clamp, tbl } from '../util.js';

export const BRANCHES = tbl({
  war: { id: 'war', name: '戰艦', icon: '⚔️', color: '#7f9bb5', blurb: '火力與裝甲：為階段④海戰準備；耐火、抗地獄。' },
  mer: { id: 'mer', name: '商船', icon: '📦', color: '#ff7a3d', blurb: '載貨與貿易：倉庫更大、艦隊任務收穫更多。' },
  sci: { id: 'sci', name: '科研探險船', icon: '🔭', color: '#6fc8ff', blurb: '偵察、抗寒、抗危害：揭霧半徑大、極地省油、特殊海域最穩。' },
});
export const BRANCH_ORDER = ['war', 'mer', 'sci'];
// 設計表 §3.3：len 船長、decks 層數、spd 航速倍率、cargo、hull、fp、scout 揭霧半徑、cold 抗寒、haz 抗特殊海域危害、trade 貿易加成、hours 改裝時數
export const FLAG_ROWS = tbl({
  ark_t0: { id: 'ark_t0', name: '末日方舟', en: 'Ark', branch: null, tier: 0, len: 91, decks: 5, spd: 1.0, cargo: 400, hull: 500, fp: 8, scout: 95, cold: 0, haz: 0, trade: 0, hours: 0 },
  war_1: { id: 'war_1', name: '鐵壁艦', en: 'Ironwall', branch: 'war', tier: 1, len: 108, decks: 6, spd: 1.0, cargo: 440, hull: 700, fp: 16, scout: 95, cold: 0.10, haz: 0.15, trade: 0, hours: 24 },
  war_2: { id: 'war_2', name: '無畏艦', en: 'Dreadnought', branch: 'war', tier: 2, len: 128, decks: 7, spd: 0.95, cargo: 480, hull: 1000, fp: 28, scout: 100, cold: 0.15, haz: 0.30, trade: 0, hours: 36 },
  war_3: { id: 'war_3', name: '天罰戰艦', en: 'Wrath', branch: 'war', tier: 3, len: 152, decks: 8, spd: 0.90, cargo: 520, hull: 1500, fp: 46, scout: 110, cold: 0.25, haz: 0.50, trade: 0, hours: 48 },
  mer_1: { id: 'mer_1', name: '貨運巨輪', en: 'Freighter', branch: 'mer', tier: 1, len: 112, decks: 6, spd: 1.05, cargo: 800, hull: 560, fp: 6, scout: 95, cold: 0, haz: 0.05, trade: 0.10, hours: 24 },
  mer_2: { id: 'mer_2', name: '貿易旗艦', en: 'Trade Liner', branch: 'mer', tier: 2, len: 134, decks: 7, spd: 1.10, cargo: 1300, hull: 650, fp: 10, scout: 100, cold: 0.05, haz: 0.10, trade: 0.25, hours: 36 },
  mer_3: { id: 'mer_3', name: '海上集市', en: 'Floating Market', branch: 'mer', tier: 3, len: 160, decks: 8, spd: 1.15, cargo: 2200, hull: 800, fp: 14, scout: 105, cold: 0.10, haz: 0.15, trade: 0.50, hours: 48 },
  sci_1: { id: 'sci_1', name: '考察船', en: 'Surveyor', branch: 'sci', tier: 1, len: 102, decks: 6, spd: 1.10, cargo: 450, hull: 580, fp: 8, scout: 130, cold: 0.35, haz: 0.25, trade: 0, hours: 24 },
  sci_2: { id: 'sci_2', name: '極地探險船', en: 'Polar Explorer', branch: 'sci', tier: 2, len: 120, decks: 7, spd: 1.15, cargo: 520, hull: 720, fp: 12, scout: 170, cold: 0.65, haz: 0.45, trade: 0, hours: 36 },
  sci_3: { id: 'sci_3', name: '星圖號', en: 'Atlas', branch: 'sci', tier: 3, len: 144, decks: 8, spd: 1.25, cargo: 600, hull: 900, fp: 16, scout: 230, cold: 0.90, haz: 0.70, trade: 0.10, hours: 48 },
});
export const rowId = (branch, tier) => (branch && tier > 0 ? `${branch}_${tier}` : 'ark_t0');
export const PROMO_KEEP = { food: 40, water: 40, fuel: 15, parts: 0 };   // 投入資源時替船員 / 航行保留的量
export const DEP_KEYS = ['parts', 'fuel', 'food', 'water'];
const HOLD_MAX = 20000;   // 「待退回倉庫」暫存區的單項上限（防存檔灌水）

/** 乾淨的 flag（舊存檔沒有 flag → T0） */
export function flagOf(f) {
  const fl = f && f.flag; const ok = fl && typeof fl === 'object' && typeof fl.branch === 'string' && Object.hasOwn(BRANCHES, fl.branch) && (fl.tier | 0) >= 1 && (fl.tier | 0) <= 3;
  return { branch: ok ? fl.branch : null, tier: ok ? fl.tier | 0 : 0, pj: fl && fl.pj || null, up: fl && fl.up || null, hold: fl && fl.hold || null };
}
export const flagRow = (f) => { const o = flagOf(f); return FLAG_ROWS[rowId(o.branch, o.tier)]; };
/** 存檔清洗 */
export function sanFlag(fl) {
  if (!fl || typeof fl !== 'object') return null; const n = (x) => typeof x === 'number' && Number.isFinite(x);
  const has = (o, k) => typeof k === 'string' && Object.hasOwn(o, k); const branch = has(BRANCHES, fl.branch) ? fl.branch : null; let tier = branch ? clamp(fl.tier | 0, 0, 3) : 0; if (!tier) tier = 0;
  const o = { branch: tier ? branch : null, tier, pj: null, up: null, hold: null };
  if (fl.pj && typeof fl.pj === 'object' && has(PROMO, fl.pj.to)) { const p = { to: fl.pj.to }; for (const k of DEP_KEYS) p[k] = n(fl.pj[k]) ? clamp(fl.pj[k], 0, PROMO[fl.pj.to][k]) : 0; o.pj = p; }
  if (fl.up && typeof fl.up === 'object' && has(PROMO, fl.up.to) && n(fl.up.start) && n(fl.up.end) && fl.up.end >= fl.up.start) o.up = { to: fl.up.to, start: fl.up.start, end: fl.up.end };
  if (fl.hold && typeof fl.hold === 'object') { const h = {}; let any = false; for (const k of DEP_KEYS) if (n(fl.hold[k]) && fl.hold[k] >= 1) { h[k] = clamp(Math.floor(fl.hold[k]), 0, HOLD_MAX); any = true; } if (any) o.hold = h; }
  if (!o.hold) delete o.hold;
  return o.tier || o.pj || o.up || o.hold ? o : null;
}

// ---------------------------------------------------------------- 數值（全部是「相對 T0 的倍率」，擁有者 / 訪客共用）
const T0 = FLAG_ROWS.ark_t0;
export function flagStats(f) {
  const r = flagRow(f);
  return { row: r, id: r.id, branch: r.branch, tier: r.tier, decks: r.decks, len: r.len, lenK: r.len / T0.len, spd: r.spd, cargo: r.cargo, capMul: 1 + (r.cargo - T0.cargo) / 1000,
    hull: r.hull, armor: r.hull / T0.hull, armorMul: 1 / Math.sqrt(r.hull / T0.hull), fp: r.fp, scout: r.scout, scoutK: r.scout / T0.scout, cold: r.cold, haz: r.haz, hazMul: 1 - r.haz, trade: r.trade };
}
/** 給階段④海戰用：火力 / 船體（還沒有戰鬥系統；只是把數值固定下來） */
export const flagCombat = (f) => { const st = flagStats(f); return { fp: st.fp, hull: st.hull, armor: st.armor }; };
/** 資源倉庫上限（載貨加成）。f = s.fleet 或 null。 */
export const capOf = (f, k) => Math.round(RES[k].cap * flagStats(f).capMul);
export const resCap = (s, k) => capOf(s && s.fleet, k);
/** 方舟自動航行速度（地圖單位 / 分鐘） */
export const arkSpeedOf = (f) => WORLD.arkSpeed * flagStats(f).spd;
export const revealArkOf = (f) => WORLD.revealArk * flagStats(f).scoutK;
export const tradeMul = (f) => 1 + flagStats(f).trade;

// ---------------------------------------------------------------- 海域進入條件（階段②的軟條件 → 硬條件）
export function needText(z) {
  const n = z && z.need; if (!n) return ''; const by = {}; for (const b of n.branches) { const t = n.tiers ? n.tiers[b] : n.tier; (by[t] || (by[t] = [])).push(BRANCHES[b].name); }
  return Object.keys(by).sort().map((t) => `${by[t].join('/')} T${t}`).join(' 或 ') + ' 以上';
}
export function meetsNeed(f, z) { if (!z || !z.need) return true; const o = flagOf(f); if (!o.branch || !z.need.branches.includes(o.branch)) return false; return o.tier >= (z.need.tiers ? z.need.tiers[o.branch] : z.need.tier); }
export const gateMsg = (z) => `${z.icon} ${z.name}進不去：需要 ${needText(z)} 的旗艦（⚓ 艦隊 → ⭐ 旗艦晉升）`;
/** 這條航線會不會被硬條件擋下？回傳第一個擋住的海域 {id, z} 或 null。已經在該海域裡 → 放行（可以開出來，不被困死）。 */
export function routeGate(f, x0, y0, x1, y1) {
  const here = zoneAtPoint(x0, y0);
  for (const id of routeZones(x0, y0, x1, y1)) { const z = SPECIAL_ZONES[id]; if (!z.need || !z.need.hard || meetsNeed(f, z)) continue; if (here && here.id === id) continue; return { id, z }; }
  return null;
}
/** 手動駕駛：(x,y) 進得去嗎？（from = 目前位置；已經在裡面就放行） */
export function pointGate(f, x, y, from) {
  const h = zoneAtPoint(x, y); if (!h || !h.z.need || !h.z.need.hard || meetsNeed(f, h.z)) return null; const cur = from && zoneAtPoint(from.x, from.y); if (cur && cur.id === h.id) return null; return { id: h.id, z: h.z };
}

// ---------------------------------------------------------------- 晉升流程
export const refitHours = (id) => FLAG_ROWS[id].hours;
/** 某分支的下一階（只能一階一階往上；換分支要先「改裝回基礎船」）；null = 已滿階 / 不是這條分支 */
export function nextRowId(f, branch) { const o = flagOf(f); if (o.tier >= 3) return null; if (o.branch && o.branch !== branch) return null; return `${branch}_${o.tier + 1}`; }
const matHave = (f, k) => (f && f.mat && f.mat[k]) | 0;

/** 一個晉升目標的需求與目前進度 */
export function reqOf(s, to, pj) {
  const f = s.fleet, P = PROMO[to], row = FLAG_ROWS[to]; const dep = pj && pj.to === to ? pj : null;
  const res = DEP_KEYS.map((k) => ({ k, need: P[k], have: dep ? dep[k] | 0 : 0, icon: RES[k].icon, name: RES[k].name }));
  const mats = Object.keys(P.mat).sort((a, b) => MAT_ORDER.indexOf(a) - MAT_ORDER.indexOf(b)).map((k) => ({ k, need: P.mat[k], have: matHave(f, k), icon: MATERIALS[k].icon, name: MATERIALS[k].name }));
  const bp = { id: P.bp, name: PROMO_BP[P.bp].name, have: !!(f.bp && f.bp[P.bp]) };
  const resOk = res.every((r) => r.have >= r.need), matOk = mats.every((m) => m.have >= m.need);
  const total = res.length + mats.length + 1, done = res.filter((r) => r.have >= r.need).length + mats.filter((m) => m.have >= m.need).length + (bp.have ? 1 : 0);
  return { to, row, res, mats, bp, resOk, matOk, bpOk: bp.have, ready: resOk && matOk && bp.have, done, total, hours: row.hours };
}
/** 目前狀態：現況、改裝中、各分支選項 */
export function promoStatus(s, nowSec) {
  const f = s.fleet, o = flagOf(f), st = flagStats(f); const up = o.up && Object.hasOwn(PROMO, o.up.to) ? { ...o.up, row: FLAG_ROWS[o.up.to], left: Math.max(0, o.up.end - nowSec), frac: clamp((nowSec - o.up.start) / Math.max(1, o.up.end - o.up.start), 0, 1) } : null;
  const w = f && f.world; const moving = !!(w && w.route);
  const options = BRANCH_ORDER.map((b) => { const to = nextRowId(f, b); return { branch: b, to, req: to ? reqOf(s, to, o.pj) : null, locked: !to, why: !to ? (o.tier >= 3 ? '已經是最高階' : `目前是${BRANCHES[o.branch].name}；要換分支請先「改裝回基礎船」（階級歸零、資源重付）`) : '' }; });
  return { cur: o, stats: st, row: st.row, up, pj: o.pj, moving, options, busy: !!up };
}
/** 選定（或改選）晉升專案。已投入的資源退回倉庫；放不下的進「待退回」暫存區（不損失）。 */
export function promoPlan(s, to) {
  const f = s.fleet, o = flagOf(f); if (typeof to !== 'string' || !Object.hasOwn(PROMO, to)) return { ok: false, msg: '沒有這個晉升項目' }; if (o.up) return { ok: false, msg: '旗艦正在改裝' };
  if (nextRowId(f, FLAG_ROWS[to].branch) !== to) return { ok: false, msg: '只能晉升到目前分支的下一階' };
  const fl = f.flag || (f.flag = { branch: o.branch, tier: o.tier, pj: null, up: null }); if (fl.pj && fl.pj.to !== to) { const old = fl.pj; fl.pj = null; refund(s, old); } fl.pj = { to, parts: 0, fuel: 0, food: 0, water: 0 };
  return { ok: true, msg: `已選定：${FLAG_ROWS[to].name}` };
}
/** 退回倉庫；放不下的部分進「待退回」暫存區（fleet.flag.hold），倉庫有空位就每個 tick 補回去，不會損失。 */
function refund(s, pj) { for (const k of DEP_KEYS) { const a = Math.floor(pj[k] || 0); if (a <= 0) continue; const put = Math.max(0, Math.min(a, resCap(s, k) - s.res[k])); s.res[k] += put; if (a > put) holdAdd(s, k, a - put); } }
function holdAdd(s, k, v) { const f = s.fleet; const fl = f.flag || (f.flag = { branch: null, tier: 0, pj: null, up: null }); const h = fl.hold || (fl.hold = {}); h[k] = Math.min(HOLD_MAX, (h[k] | 0) + Math.floor(v)); }
const holdLeft = (fl) => !!(fl && fl.hold && DEP_KEYS.some((k) => fl.hold[k] > 0));
/** 暫存區 → 倉庫（有空位才補；每個 tick 呼叫，決定性） */
export function holdDrain(s) { const fl = s.fleet && s.fleet.flag; if (!fl || !fl.hold) return; for (const k of DEP_KEYS) { const h = fl.hold[k] | 0; if (h <= 0) { delete fl.hold[k]; continue; } const room = resCap(s, k) - s.res[k]; if (room <= 0) continue; const put = Math.min(h, Math.floor(room)); s.res[k] += put; if (put >= h) delete fl.hold[k]; else fl.hold[k] = h - put; } if (!holdLeft(fl)) { delete fl.hold; if (!fl.tier && !fl.pj && !fl.up) delete s.fleet.flag; } }
/** 暫存區總量（UI 顯示用） */
export const holdOf = (f) => { const h = f && f.flag && f.flag.hold; return h ? DEP_KEYS.filter((k) => h[k] > 0).map((k) => ({ k, v: h[k], icon: RES[k].icon, name: RES[k].name })) : []; };
/** 倉庫上限變小時（例如改裝回基礎船），超過新上限的資源也進暫存區而不是消失 */
function spill(s) { for (const k of DEP_KEYS) { const over = Math.floor(s.res[k] - resCap(s, k)); if (over > 0) { s.res[k] -= over; holdAdd(s, k, over); } } }
export function promoCancelPlan(s) { const fl = s.fleet.flag; if (!fl || !fl.pj) return { ok: false, msg: '沒有籌備中的專案' }; const pj = fl.pj; fl.pj = null; refund(s, pj); const g = s.fleet.flag; if (g && !g.tier && !g.up && !holdLeft(g)) delete s.fleet.flag; const h = holdOf(s.fleet); return { ok: true, msg: '已取消籌備，投入的資源退回倉庫' + (h.length ? `（倉庫放不下的 ${h.map((x) => x.icon + x.v).join(' ')} 先存在「待退回」，有空位就補回）` : '') }; }
/** 把倉庫裡的資源（扣掉船員 / 航行保留量）盡量投入晉升專案 */
export function promoDeposit(s) {
  const fl = s.fleet.flag; if (!fl || !fl.pj) return { ok: false, msg: '先選一個晉升目標' }; if (fl.up) return { ok: false, msg: '旗艦正在改裝' };
  const P = PROMO[fl.pj.to]; let moved = 0; const parts = [];
  for (const k of DEP_KEYS) { const room = P[k] - fl.pj[k]; if (room <= 0) continue; const give = Math.floor(Math.max(0, Math.min(room, s.res[k] - PROMO_KEEP[k]))); if (give > 0) { s.res[k] -= give; fl.pj[k] += give; moved += give; parts.push(`${RES[k].icon}${give}`); } }
  return moved ? { ok: true, msg: `投入 ${parts.join(' ')}`, moved } : { ok: false, msg: '沒有可投入的資源（食物 / 飲水 / 燃料要保留一些給航行與船員）' };
}
/** 開工：資源投滿、有藍圖、材料夠、船停著 → 扣材料，完成時間寫死 */
export function promoStart(s, nowSec) {
  const f = s.fleet, fl = f.flag; if (!fl || !fl.pj) return { ok: false, msg: '先選一個晉升目標' }; if (fl.up) return { ok: false, msg: '已經在改裝了' };
  if (nextRowId(f, FLAG_ROWS[fl.pj.to].branch) !== fl.pj.to) { fl.pj = null; return { ok: false, msg: '這個晉升目標已經不是下一階，請重新選擇' }; }
  const q = reqOf(s, fl.pj.to, fl.pj); const w = f.world;
  if (w && w.route) return { ok: false, msg: '方舟航行中：先下錨（海圖 → 就地下錨）再開工' };
  if (!q.bpOk) return { ok: false, msg: `缺少藍圖「${q.bp.name}」（到特殊海域找）` };
  if (!q.matOk) return { ok: false, msg: `材料不夠：${q.mats.filter((m) => m.have < m.need).map((m) => `${m.icon}${m.name} ${m.have}/${m.need}`).join('、')}` };
  if (!q.resOk) return { ok: false, msg: '資源還沒投滿' };
  for (const m of q.mats) f.mat[m.k] -= m.need; for (const k of Object.keys(f.mat)) if (!(f.mat[k] > 0)) delete f.mat[k]; if (!Object.keys(f.mat).length) delete f.mat;
  const t = Math.max(s.simT, nowSec); fl.up = { to: fl.pj.to, start: t, end: t + q.hours * 3600 }; fl.pj = null;
  return { ok: true, msg: `開工：${q.row.name}改裝需要 ${q.hours} 小時（改裝期間旗艦停泊、不能出航）`, end: fl.up.end };
}
/** 改裝回基礎船（階級歸零；已用掉的資源不退）。為了換分支。 */
export function promoReset(s) {
  const f = s.fleet, o = flagOf(f); if (o.up) return { ok: false, msg: '旗艦正在改裝' }; if (!o.tier && !o.pj) return { ok: false, msg: '已經是基礎船' };
  const hold = f.flag && f.flag.hold; if (o.pj) refund(s, o.pj); const keep = f.flag && f.flag.hold || hold; delete f.flag; if (keep) f.flag = { branch: null, tier: 0, pj: null, up: null, hold: keep }; spill(s); return { ok: true, msg: '已改裝回基礎船；可以重新選分支（資源重付）' };
}
/** 每個 tick（fleetTick 呼叫）：改裝完成 */
export function promoTick(s, tEnd, ev) {
  const f = s.fleet, fl = f && f.flag; holdDrain(s); if (!fl || !fl.up) return; if (tEnd < fl.up.end) return;
  const row = Object.hasOwn(FLAG_ROWS, fl.up.to) ? FLAG_ROWS[fl.up.to] : null; if (!row) { fl.up = null; return; } fl.branch = row.branch; fl.tier = row.tier; fl.up = null;
  ev && ev({ t: Math.min(tEnd, tEnd), type: 'promo', sub: 'done', text: `⭐ 旗艦晉升完成：${BRANCHES[row.branch].icon}${row.name}（${BRANCHES[row.branch].name} T${row.tier}）！船身加長到 ${row.len} m、${row.decks} 層甲板。`, to: row.id });
}
export const refitting = (f) => { const fl = f && f.flag; return !!(fl && fl.up); };
