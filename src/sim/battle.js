// 末日方舟 · 階段④：海怪與海盜海戰（純函式、決定性）。設計見 DESIGN-expansion.md §4。
// 遭遇 = f(seed, 遊戲時鐘, 方舟地圖位置)：每個 30 分鐘「槽」在槽邊界擲一次（出生點附近的近海永遠安全）。
// 遭遇出現後有 10 分鐘（BT.grace）讓玩家決定；沒人接管 = 時間到由船員「自動戰鬥」結算（離線 / 閒置一律如此）。
// 玩家上線接管 → 即時砲戰（arena.js，畫面 / 操作）。選項 A 結算：
//   · 在砲戰場把敵人打倒 = 這場「勝利」，船體損失 = 砲戰場裡實際受到的傷害（照舊不會低於 SZ.floor）。
//   · 砲戰場輸了 / 時間到 → 改用決定性公式結算（手動加成上限：命中 ×1.25、閃避 +0.1）。
//   · 撤退 → 機率逃脫（fleeChance），失敗被追著打。
//   · 每個遭遇 id 只能結算一次；戰報必須帶這場的 id（免費方案沒有伺服端驗證，所以只做合理性檢查，不是防作弊）。
// 接管 ≠ 一定比自動好：船員打不贏會逃，接管一定開打（硬拚），所以畫面顯示勝率 / 預期船體損失，風險高要二次確認。
// 自動戰鬥（含離線）完全不受砲戰場影響，仍是同一個決定性公式。
// 存檔欄位（全部選填、可加）：fleet.world.bt = { n, cur, ls, lv（上次利維坦結算的時間，秒）, st, k, h, last }。獎勵進 s.res / fleet.mat / fleet.bp。
import { hash, mulberry32 } from './rng.js';
import { clamp, tbl } from '../util.js';
import { arkPos, zoneAt } from './world.js';
import { weatherAt } from './weather.js';
import { SZ, SPECIAL_ZONES, MATERIALS, MAT_ORDER, PROMO_BP, zoneAtPoint } from './szdata.js';
import { resCap, refitting } from './promo.js';
import { RES_KEYS } from './defs.js';

const U32 = 4294967296;
const ARENA_TIME = 75, ARENA_CD = 1.0;   // = arena.js 的 AR.time / AR.cd（這裡不能反過來 import arena.js，會循環）
/** 砲戰場裡敵人的血量（arena.js 用同一個式子）。 */
export const arenaFoeHp = (foe, own) => clamp(Math.round(foe.hp / (ownPower(own) * BOT.acc) * 1.7), 6, 60);
export const BT = {
  slot: 1800,          // 遭遇判定槽（秒）
  grace: 600,          // 遭遇出現後多久沒人接管就由船員自動戰鬥
  cool: 4,             // 兩次遭遇至少隔幾個槽（2 小時）
  rounds: 20,          // 一場最多幾回合（超過 = 僵持，雙方退開）
  fpK: 3,              // 每點火力每回合的基本傷害
  botAcc: 0.55, botDodge: 0.35,       // 船員（自動戰鬥）的命中 / 閃避
  accCap: 1.25, dodgeCap: 0.1,        // 手動加成上限：命中 ×1.25、閃避 +0.1
  lvDays: 3,           // 利維坦：距離「上一隻利維坦結算」至少 3 個遊戲日（3×86400 秒）才會再出現
  confirmWin: 0.5, confirmLoss: 40,   // 接管時勝率 < 50% 或預期船體損失 > 40% → 要二次確認
  engCap: 2,           // 接管只在第一次延長倒數（最多再 1 個 grace）；cur.end 一律不超過 t0 + engCap×grace
  logCap: 40,
};
const BRANCH_FP = { war: 0.2, mer: 0, sci: 0.1 };   // 旗艦分支的火力加成（戰艦最強、科研有弱點分析）

// hp / atk 是「基準值」，實際 = 基準 × 海域與天氣縮放。loot.res = [最少, 最多]；loot.mat / loot.bp = 機率 + 數量 / 來源。
export const FOES = tbl({
  serpent: { id: 'serpent', name: '海蛇', icon: '\ue00d', hp: 70, atk: 9, loot: { res: { food: [28, 60], parts: [6, 16] }, mat: { p: 0.3, n: [1, 1] }, bp: { p: 0.04, pool: 't1' } },
    blurb: '成群出沒、動作快，單隻不算強。' },
  kraken: { id: 'kraken', name: '巨型海妖', icon: '\ue00f', hp: 260, atk: 26, loot: { res: { parts: [70, 150], fuel: [18, 40], food: [20, 40] }, mat: { p: 0.65, n: [1, 2] }, bp: { p: 0.1, pool: 'zone' } },
    blurb: '觸手會封住航道，會對準船砸下去。' },
  leviathan: { id: 'leviathan', name: '利維坦', icon: '\ue005', hp: 800, atk: 62, boss: true, loot: { res: { parts: [260, 480], fuel: [80, 140], food: [60, 110], water: [40, 80] }, mat: { p: 1, n: [2, 3] }, bp: { p: 0.55, pool: 't3' } },
    blurb: '特殊海域深處的 Boss。要有 T2 以上的戰艦才打得過。' },
  pirate: { id: 'pirate', name: '海盜船', icon: '\ue009', hp: 120, atk: 14, loot: { res: { parts: [50, 130], fuel: [24, 60], food: [14, 36], water: [10, 30] }, mat: { p: 0, n: [0, 0] }, bp: { p: 0.1, pool: 'ship' } },
    blurb: '改裝過的武裝船，贏了有零件、燃料，偶爾有船隻藍圖；輸了會被搶。' },
});
export const FOE_ORDER = ['serpent', 'kraken', 'leviathan', 'pirate'];
const PIRATE_NAMES = ['拾荒者快艇', '黑旗號', '掠奪者', '鐵鉤幫'];
const SHIP_BP = ['speedboat', 'tug', 'patrol', 'sub', 'icebreaker'];
const T1 = ['bp_war1', 'bp_mer1', 'bp_sci1'], T3 = ['bp_war3', 'bp_mer3', 'bp_sci3'];

// 區域縮放（hp、atk 的 lv 倍率）與遭遇機率 / 對手權重（一般海域 by world.zoneAt；特殊海域 by szdata.zoneAtPoint）
const LV_ZONE = { reef: 1, ruins: 1.15, ice: 1.3, abyss: 1.5, fog: 1.2, whirlpool: 1.3, fire: 1.4, hell: 1.6, stonehenge: 1.3 };
const P_ZONE = { reef: 0.024, ruins: 0.03, ice: 0.03, abyss: 0.034, fog: 0.032, whirlpool: 0.036, fire: 0.036, hell: 0.04, stonehenge: 0.033 };
const W_ZONE = {
  reef: { serpent: 6, pirate: 4 }, ruins: { serpent: 3.5, pirate: 5, kraken: 1.5 }, ice: { serpent: 5, kraken: 3.5, pirate: 1.5 }, abyss: { serpent: 2.5, kraken: 5.5, pirate: 2 },
  fog: { kraken: 4.5, serpent: 3.5, pirate: 2 }, whirlpool: { kraken: 6, serpent: 4, leviathan: 2 }, fire: { serpent: 5.5, pirate: 2.5, kraken: 2, leviathan: 1.5 },
  hell: { kraken: 4, serpent: 2, leviathan: 4 }, stonehenge: { pirate: 5, serpent: 3, kraken: 2 },
};
const LEVI_DEPTH = { whirlpool: 0.6, fire: 0.7, hell: 0.4 };   // 利維坦只在這些特殊海域的深處出沒

// ---------------------------------------------------------------- 存檔
export const emptyBt = () => ({ n: 0, cur: null, ls: -99, lv: -99, st: { w: 0, l: 0, d: 0, f: 0 }, k: {}, h: 0, last: null });
const num = (x) => typeof x === 'number' && Number.isFinite(x);
export function sanBt(b) {
  if (!b || typeof b !== 'object') return null; const o = emptyBt();
  o.n = num(b.n) ? clamp(b.n | 0, 0, 1e7) : 0; o.ls = num(b.ls) ? clamp(b.ls | 0, -99, 1e9) : -99; o.lv = num(b.lv) ? (b.lv > -99 && b.lv < 1e7 ? (Math.floor(b.lv) + 1) * 86400 : clamp(Math.floor(b.lv), -99, 1e11)) : -99; o.h = num(b.h) ? clamp(b.h, 0, 1e7) : 0;
  if (b.st && typeof b.st === 'object') for (const k of ['w', 'l', 'd', 'f']) o.st[k] = num(b.st[k]) ? clamp(b.st[k] | 0, 0, 1e7) : 0;
  if (b.k && typeof b.k === 'object') for (const k of FOE_ORDER) if (num(b.k[k]) && b.k[k] > 0) o.k[k] = clamp(b.k[k] | 0, 0, 1e7);
  const c = b.cur; if (c && typeof c === 'object' && typeof c.k === 'string' && Object.prototype.hasOwnProperty.call(FOES, c.k) && num(c.t0) && num(c.end) && num(c.id) && num(c.lv)) {
    o.cur = { id: clamp(c.id | 0, 0, 1e7), k: c.k, lv: clamp(c.lv, 0.5, 4), z: typeof c.z === 'string' && (c.z === '' || Object.prototype.hasOwnProperty.call(SPECIAL_ZONES, c.z)) ? c.z : '', rz: ['reef', 'ruins', 'ice', 'abyss', 'near'].includes(c.rz) ? c.rz : 'reef',
      dep: num(c.dep) ? clamp(c.dep, 0, 1) : 0, x: num(c.x) ? clamp(c.x, 0, 2000) : 1000, y: num(c.y) ? clamp(c.y, 0, 2000) : 1000, wx: c.wx === 'storm' ? 'storm' : '', t0: c.t0, end: clamp(c.end, c.t0, c.t0 + BT.grace * BT.engCap), eng: c.eng ? 1 : 0, nm: typeof c.nm === 'string' ? c.nm.slice(0, 12) : '' };
  }
  if (b.last && typeof b.last === 'object' && typeof b.last.text === 'string') o.last = { t: num(b.last.t) ? b.last.t : 0, id: num(b.last.id) ? clamp(b.last.id | 0, 0, 1e7) : 0, k: typeof b.last.k === 'string' && Object.prototype.hasOwnProperty.call(FOES, b.last.k) ? b.last.k : 'serpent', r: ['win', 'lose', 'draw', 'fled', 'caught'].includes(b.last.r) ? b.last.r : 'draw', text: b.last.text.slice(0, 160), man: b.last.man ? 1 : 0 };
  return o;
}
const ensureBt = (w) => w.bt || (w.bt = emptyBt());

// ---------------------------------------------------------------- 對手數值
export function foeStats(cur) {
  const B = FOES[cur.k], lv = cur.lv; return { id: cur.k, name: cur.nm || B.name, icon: B.icon, hp: Math.round(B.hp * lv), atk: +(B.atk * (1 + (lv - 1) * 0.6)).toFixed(1), boss: !!B.boss, lv };
}
/** own = fleet.combatOf(s)：{ fp, hull, cond, branch, spd, scoutK, haz, trade } */
export const ownPower = (own) => Math.max(0.5, own.fp) * (1 + (BRANCH_FP[own.branch] || 0)) * BT.fpK;
const margin = (own) => own.hull * Math.max(0, own.cond - SZ.floor) / 100;
const guardOf = (own) => 1 - clamp(own.haz || 0, 0, 0.8) * 0.5;
export const BOT = Object.freeze({ acc: BT.botAcc, dodge: BT.botDodge });

/** 回合制對戰（決定性：亂數只由 seed / 場次決定，跟技巧無關 → 命中 / 閃避越高結果一定不會更差）。
 *  回傳 { res: 'win'|'lose'|'draw', rounds, loss }（loss = 船體損失 %，不會把船體打到 SZ.floor 以下） */
export function duel(seed, n, own, foe, skill = BOT) {
  const rnd = mulberry32(hash(seed, 'bt', n)); const fort = 0.82 + 0.36 * rnd(), pw = ownPower(own) * fort, mg = margin(own), g = guardOf(own); let hp = foe.hp, taken = 0, res = 'draw', r = 0;
  for (r = 1; r <= BT.rounds; r++) {
    hp -= pw * skill.acc * (0.8 + 0.4 * rnd()); const dealt = foe.atk * (1 - skill.dodge) * g * (0.8 + 0.4 * rnd());
    if (hp <= 0) { res = 'win'; break; } taken += dealt; if (taken >= mg) { taken = mg; res = 'lose'; break; }
  }
  return { res, rounds: Math.min(r, BT.rounds), loss: own.hull > 0 ? +(taken / own.hull * 100).toFixed(2) : 0, foeLeft: Math.max(0, hp) };
}
/** 沒有亂數的期望值：船員決定要打還是逃 */
export function estimate(own, foe) {
  const pw = ownPower(own) * BT.botAcc, kill = foe.hp / pw, taken = kill * foe.atk * (1 - BT.botDodge) * guardOf(own), mg = margin(own);
  return { kill, taken, mg, fight: kill <= BT.rounds * 0.85 && taken <= mg * 0.8 && mg > 0 };
}
/** 硬拚的勝率估計（只給畫面顯示用：固定 40 個虛擬種子，不寫存檔、不影響結算）。skill 預設 = 船員；接管最多 = 加成上限。 */
export function winChance(own, foe, manual = false) {
  const sk = manual ? { acc: BOT.acc * BT.accCap, dodge: BOT.dodge + BT.dodgeCap } : BOT; let w = 0; for (let i = 0; i < 40; i++) if (duel(7, i, own, foe, sk).res === 'win') w++; return w / 40;
}
/** 硬拚的預期船體損失 %（40 個虛擬種子平均；含輸掉的場次）。只給畫面顯示。 */
export function lossChance(own, foe, manual = false) {
  const sk = manual ? { acc: BOT.acc * BT.accCap, dodge: BOT.dodge + BT.dodgeCap } : BOT; let l = 0; for (let i = 0; i < 40; i++) l += duel(7, i, own, foe, sk).loss; return l / 40;
}
/** 逃跑成功率：快、偵察強有利；Boss 更難甩開 */
export const fleeChance = (own, foe) => clamp((0.45 + ((own.spd || 1) - 1) * 0.6 + ((own.scoutK || 1) - 1) * 0.3) * (foe.boss ? 0.6 : 1), 0.2, 0.9);

/** 自動戰鬥（船員）：先估算 → 打不贏就逃（擲 hash(seed,'btf',n)）；逃不掉被追著打 4 回合。
 *  kind: win / lose / draw（交戰）、fled（逃掉）、caught（逃失敗被咬）。 */
export function autoBattle(seed, own, foe, n) {
  const e = estimate(own, foe);
  if (e.fight) { const d = duel(seed, n, own, foe, BOT); return { kind: d.res, loss: d.loss, rounds: d.rounds, act: 'fight' }; }
  const u = hash(seed, 'btf', n) / U32;
  if (u < fleeChance(own, foe)) return { kind: 'fled', loss: 0, rounds: 0, act: 'flee' };
  return { kind: 'caught', loss: caughtLoss(own, foe), rounds: 4, act: 'flee' };
}
/** 逃失敗：被追著打 4 回合的船體損失 % */
export function caughtLoss(own, foe) { const hit = Math.min(margin(own), foe.atk * 4 * (1 - BOT.dodge) * guardOf(own)); return own.hull > 0 ? +(hit / own.hull * 100).toFixed(2) : 0; }
/** 撤退（玩家在砲戰場中途按撤退）：逃脫機率同 fleeChance（擲 hash(seed,'btr',場次)），失敗 = 被追著打。 */
export function retreatBattle(seed, own, foe, n) {
  const u = hash(seed, 'btr', n) / U32; if (u < fleeChance(own, foe)) return { kind: 'fled', loss: 0, rounds: 0, act: 'retreat' };
  return { kind: 'caught', loss: caughtLoss(own, foe), rounds: 4, act: 'retreat' };
}
/** 公式結算用的手動技巧：rep = { acc, dodge, shots }（砲戰場沒打贏時才用）。加成有上限（命中 ×1.25、閃避 +0.1）。 */
export function effSkill(rep) {
  const acc = rep && num(rep.acc) && (rep.shots | 0) >= 3 ? clamp(rep.acc, 0, 1) : 0, dodge = rep && num(rep.dodge) ? clamp(rep.dodge, 0, 1) : 0;
  return { acc: Math.max(BOT.acc, Math.min(acc, BOT.acc * BT.accCap)), dodge: Math.max(BOT.dodge, Math.min(dodge, BOT.dodge + BT.dodgeCap)) };
}
/** 砲戰場戰報 rep = { id, won, loss, hits, shots, t, acc, dodge }：只有「打倒敵人」的宣稱要過合理性檢查，通過才算勝利。
 *  合理性：用的時間 ≤ 場上時限；發數受冷卻限制；命中 ≤ 發數；命中數（+ 燃燒彈最多 4 點）要夠打掉敵人血量。 */
export function arenaWin(rep, foe, own) {
  if (!rep || rep.won !== true || !num(rep.t) || !num(rep.shots) || !num(rep.hits) || !num(rep.loss)) return null;
  const maxHp = arenaFoeHp(foe, own), shots = rep.shots | 0, hits = rep.hits | 0;
  if (rep.t < 2 || rep.t > ARENA_TIME + 0.5 || shots < 1 || hits > shots || shots > Math.floor(rep.t / ARENA_CD) + 1 || hits + 4 < maxHp) return null;
  return { loss: clamp(rep.loss, 0, 100) };
}
export function manualBattle(seed, own, foe, n, rep) { const d = duel(seed, n, own, foe, effSkill(rep)); return { kind: d.res, loss: d.loss, rounds: d.rounds, act: 'manual' }; }

// ---------------------------------------------------------------- 獎勵 / 損失
const add = (s, k, v) => { const b = s.res[k]; s.res[k] = Math.min(resCap(s, k), b + v); return s.res[k] - b; };
/** 戰利品（決定性：hash(seed,'btl',場次)）；win 才有，draw 只有一點零件。 */
export function lootRoll(seed, n, cur, kind, f, trade = 0) {
  const B = FOES[cur.k], L = B.loot, rnd = mulberry32(hash(seed, 'btl', n)); const out = { res: {}, mat: {}, bp: null };
  const mul = kind === 'draw' ? 0.15 : 1 + clamp(cur.lv - 1, 0, 1) * 0.5; const tm = 1 + trade * 0.5;
  for (const k of RES_KEYS) { const r = L.res[k]; if (r) { const v = Math.round((r[0] + rnd() * (r[1] - r[0])) * mul * tm); if (v > 0) out.res[k] = v; } else rnd(); }
  if (kind !== 'win') return out;
  // 材料：在特殊海域掉該海域的材料；海外的海妖偶爾掉渦流核心。
  const zmat = cur.z ? SPECIAL_ZONES[cur.z].mat : (cur.k === 'kraken' || cur.k === 'serpent') && cur.rz === 'abyss' ? 'vortex' : null;
  if (zmat && L.mat.p > 0 && rnd() < L.mat.p * (cur.z ? 1 : 0.35)) { const q = L.mat.n[0] + Math.floor(rnd() * (L.mat.n[1] - L.mat.n[0] + 1)); out.mat[zmat] = q; if (cur.k === 'leviathan' && rnd() < 0.5) { const o = MAT_ORDER.filter((m) => m !== zmat)[Math.floor(rnd() * 4)]; out.mat[o] = 1; } } else { rnd(); rnd(); }
  // 藍圖：只掉還沒有的
  const pool = (L.bp.pool === 'zone' ? (cur.z ? SPECIAL_ZONES[cur.z].bp : T1) : L.bp.pool === 'ship' ? SHIP_BP : L.bp.pool === 't3' ? T3 : T1).filter((b) => !(f.bp && f.bp[b]));
  const rb = rnd(), pk = rnd(); if (pool.length && rb < L.bp.p * (cur.z && L.bp.pool !== 'zone' ? 1.5 : 1)) out.bp = pool[Math.floor(pk * pool.length)];
  return out;
}
/** 輸 / 被抓：海盜搶資源，海怪撞壞油槽。回傳實際損失 */
export function lossRoll(s, cur, kind) {
  const out = {}; if (kind !== 'lose' && kind !== 'caught') return out; const pir = cur.k === 'pirate', k = kind === 'caught' ? 0.5 : 1;
  const frac = pir ? 0.1 + 0.06 * (hash(s.seed, 'btx', cur.id) % 3) / 2 : 0;
  if (pir) for (const r of ['parts', 'fuel', 'food']) { const v = Math.floor(s.res[r] * frac * k); if (v > 0) { s.res[r] -= v; out[r] = v; } }
  else { const v = Math.floor(s.res.fuel * 0.05 * k); if (v > 0) { s.res.fuel -= v; out.fuel = v; } }
  return out;
}
const RIC = { food: '\ue047', water: '\ue03c', fuel: '\ue049', parts: '\ue069' };
export const resText = (o, sign = '+') => Object.keys(o).filter((k) => o[k] > 0).map((k) => `${RIC[k] || k}${sign}${o[k]}`).join(' ');
const matText = (m) => Object.keys(m).map((k) => `${MATERIALS[k].icon}${MATERIALS[k].name}×${m[k]}`).join(' ');

/** 套用結果到存檔（決定性）；回傳 { text, loot, loss } 並更新統計。 */
function settle(s, cur, out, own, tEnd, man) {   // man = 玩家接管過（撤退也算）
  const f = s.fleet, w = f.world, bt = ensureBt(w), B = FOES[cur.k], nm = cur.nm || B.name; let text = '', loot = null, lost = {};
  const b0 = s.cond; if (out.loss > 0) s.cond = Math.max(Math.min(b0, SZ.floor), b0 - out.loss); const hull = +(b0 - s.cond).toFixed(1); bt.h += hull;
  if (out.kind === 'win' || out.kind === 'draw') {
    loot = lootRoll(s.seed, cur.id, cur, out.kind, f, own.trade); for (const k in loot.res) loot.res[k] = Math.round(add(s, k, loot.res[k]));
    for (const k in loot.mat) { const m = f.mat || (f.mat = {}); const q = Math.min(loot.mat[k], SZ.matCap - (m[k] | 0)); if (q > 0) { m[k] = (m[k] | 0) + q; loot.mat[k] = q; } else delete loot.mat[k]; }
    if (loot.bp) { f.bp[loot.bp] = 1; }
  } else lost = lossRoll(s, cur, out.kind);
  const hl = hull > 0 ? `，船體 −${hull}%` : '';
  if (out.kind === 'win') { bt.st.w++; bt.k[cur.k] = (bt.k[cur.k] | 0) + 1; const bits = [resText(loot.res), matText(loot.mat), loot.bp ? `\ue062藍圖「${(PROMO_BP[loot.bp] || { name: loot.bp }).name}」` : ''].filter(Boolean).join('　');
    text = `\ue08b ${man ? '指揮擊退' : '船員擊退'}${B.icon}${nm}${bits ? '！戰利品：' + bits : '！'}${hl}`; }
  else if (out.kind === 'draw') { bt.st.d++; text = `\ue08b 與${B.icon}${nm}僵持不下，雙方退開${loot && Object.keys(loot.res).length ? '（撿到 ' + resText(loot.res) + '）' : ''}${hl}`; }
  else if (out.kind === 'fled') { bt.st.f++; text = out.act === 'retreat' ? `\ue045 指揮下令撤退，成功甩開${B.icon}${nm}，毫髮無傷。` : `\ue09b 船員發現${B.icon}${nm}打不贏，全速甩開了牠，毫髮無傷。`; }
  else if (out.kind === 'caught') { bt.st.l++; text = `\ue006 ${out.act === 'retreat' ? '撤退失敗，' : '想逃卻'}被${B.icon}${nm}追上咬了幾口${hl}${Object.keys(lost).length ? '，' + resText(lost, '−') : ''}。`; }
  else { bt.st.l++; text = `\ue006 被${B.icon}${nm}打得節節敗退${hl}${Object.keys(lost).length ? '，' + resText(lost, '−') : ''}。船體穩住在 ${SZ.floor}% 以上。`; }
  bt.last = { t: tEnd, id: cur.id, k: cur.k, r: out.kind, text, man: man ? 1 : 0 }; bt.cur = null; if (cur.k === 'leviathan') bt.lv = Math.floor(tEnd);
  return { text, loot, lost, hull };
}

// ---------------------------------------------------------------- 遭遇產生 / 結算（tick 內）
/** 一場遭遇的決定性產生：回傳 cur 或 null（不寫存檔）。 */
export function rollEncounter(seed, sl, p, lvAt, scoutK, tEnd) {
  const h = zoneAtPoint(p.x, p.y), rz = zoneAt(p.x, p.y); const zid = h ? h.id : '', zk = zid || rz; if (!h && rz === 'near') return null;
  const wx = weatherAt(tEnd, p.x, p.y).kind === 'storm' ? 'storm' : ''; const scout = clamp(((scoutK || 1) - 1) / 0.45, 0, 1);
  const chance = (P_ZONE[zk] || 0.05) * (h ? 0.7 + 0.5 * h.depth : 1) * (wx ? 1.4 : 1) * (1 - 0.4 * scout);
  if (hash(seed, 'bts', sl) / U32 >= chance) return null;
  const rnd = mulberry32(hash(seed, 'btk', sl)); const W0 = { ...W_ZONE[zk] };
  if (W0.leviathan && !(h && h.depth >= (LEVI_DEPTH[zid] || 2) && tEnd - lvAt >= BT.lvDays * 86400)) { W0.kraken = (W0.kraken || 0) + W0.leviathan; delete W0.leviathan; }
  let tot = 0; for (const k in W0) tot += W0[k]; let r = rnd() * tot, k = 'serpent'; for (const kk of FOE_ORDER) if (W0[kk]) { r -= W0[kk]; if (r <= 0) { k = kk; break; } }
  const lv = +((LV_ZONE[zk] || 1) * (wx ? 1.15 : 1) * (0.92 + rnd() * 0.16)).toFixed(2); const nm = k === 'pirate' ? PIRATE_NAMES[Math.floor(rnd() * PIRATE_NAMES.length)] : '';
  return { k, lv, z: zid, rz, dep: h ? +h.depth.toFixed(2) : 0, x: Math.round(p.x), y: Math.round(p.y), wx, nm };
}
/** 每 tick：到時間自動結算；剛好跨槽邊界就判定新遭遇。own = () => combatOf(s)（懶算）。 */
export function battleTick(s, t, tEnd, ev, own) {
  const f = s.fleet, w = f && f.world; if (!w || !w.pos) return; let bt = w.bt;
  if (bt && bt.cur && tEnd >= bt.cur.end) resolveCur(s, tEnd, ev, own(), null, false);
  const sl0 = Math.floor(t / BT.slot), sl1 = Math.floor(tEnd / BT.slot); if (sl1 <= sl0) return; bt = w.bt;
  if ((bt && bt.cur) || refitting(f)) return; if (bt && sl1 - bt.ls < BT.cool) return;
  const p = arkPos(w, tEnd); const enc = rollEncounter(s.seed, sl1, p, bt ? bt.lv : -99, own().scoutK, tEnd); if (!enc) return;
  bt = ensureBt(w); bt.n++; bt.ls = sl1; bt.cur = { id: bt.n, ...enc, t0: tEnd, end: tEnd + BT.grace, eng: 0 };
  const B = FOES[enc.k], Z = enc.z ? SPECIAL_ZONES[enc.z] : null; ev && ev({ t: tEnd, type: 'battle', sub: 'start', foe: enc.k, text: `\ue08b 遭遇${B.icon}${enc.nm || B.name}${Z ? `（${Z.icon}${Z.name}）` : ''}！${BT.grace / 60} 分鐘內可到海圖接管指揮，否則船員會自動處理。` });
}
function resolveCur(s, tEnd, ev, own, rep, man) {
  const bt = s.fleet.world.bt, cur = bt.cur, foe = foeStats(cur);
  let out, arena = false;
  if (man === 'retreat') out = retreatBattle(s.seed, own, foe, cur.id);
  else if (man) { const w = arenaWin(rep, foe, own); if (w) { out = { kind: 'win', loss: w.loss, rounds: 0, act: 'arena' }; arena = true; } else out = manualBattle(s.seed, own, foe, cur.id, rep); }
  else out = autoBattle(s.seed, own, foe, cur.id);
  const r = settle(s, cur, out, own, tEnd, man); ev && ev({ t: tEnd, type: 'battle', sub: out.kind, foe: cur.k, text: r.text }); return { ok: true, kind: out.kind, arena, ...r };
}

// ---------------------------------------------------------------- 玩家動作
export const curOf = (s) => { const b = s.fleet && s.fleet.world && s.fleet.world.bt; return b && b.cur ? b.cur : null; };
export const btStats = (s) => (s.fleet && s.fleet.world && s.fleet.world.bt) || null;
/** 有「還沒結算」的遭遇（時間還沒到）才能接管 */
export function battleCan(s, nowSec) { const c = curOf(s); if (!c) return { ok: false, why: '現在沒有遭遇戰' }; if (nowSec >= c.end) return { ok: false, why: '來不及了，船員已經處理' }; return { ok: true, cur: c }; }
/** 接管：只有「第一次」會延長倒數（即時砲戰最多 75 秒；上限 t0 + engCap×grace），重複呼叫不會再拉長，避免卡住新遭遇。 */
export function battleEngage(s, nowSec) { const c = battleCan(s, nowSec); if (!c.ok) return { ok: false, msg: c.why }; if (!c.cur.eng) { c.cur.eng = 1; c.cur.end = Math.min(Math.max(c.cur.end, nowSec + BT.grace), c.cur.t0 + BT.grace * BT.engCap); } return { ok: true, cur: c.cur }; }
/** 交給船員：立刻用自動戰鬥結算 */
export function battleAuto(s, nowSec, own) { const c = battleCan(s, nowSec); if (!c.ok) return { ok: false, msg: c.why }; return resolveCur(s, Math.max(s.simT, nowSec), (e) => s.log.push(e), own, null, false); }
/** 即時砲戰結束：結算。打倒敵人（過合理性檢查）= 勝利、損失 = 砲戰場實際傷害；否則走公式（rep 只影響手動加成，上限見 effSkill）。rep.id 必須等於目前遭遇。 */
export function battleSubmit(s, nowSec, rep, own) { const c = battleCan(s, nowSec); if (!c.ok) return { ok: false, msg: c.why };
  if (!rep || rep.id !== c.cur.id) return { ok: false, msg: '這份戰報不屬於目前這場遭遇，已忽略' }; return resolveCur(s, Math.max(s.simT, nowSec), (e) => s.log.push(e), own, rep, true); }
/** 撤退：砲戰場中途按撤退 → 機率逃脫（fleeChance），失敗被追著打；不看砲戰表現。 */
export function battleRetreat(s, nowSec, own, id) { const c = battleCan(s, nowSec); if (!c.ok) return { ok: false, msg: c.why }; if (id !== c.cur.id) return { ok: false, msg: '這個撤退指令不屬於目前這場遭遇，已忽略' }; return resolveCur(s, Math.max(s.simT, nowSec), (e) => s.log.push(e), own, null, 'retreat'); }
/** 給海圖 / 提示：這場遭遇的預估（船員會打還是逃） */
export function battlePreview(s, own) {
  const c = curOf(s); if (!c) return null; const foe = foeStats(c), e = estimate(own, foe), fl = fleeChance(own, foe), cl = caughtLoss(own, foe);
  const win = winChance(own, foe), lossTake = lossChance(own, foe);
  // 這裡的 win / lossTake / lossBest / winMax 是「砲戰沒打贏時改走公式」的數字；接管的實際風險（砲戰機器人試打）見 btrisk.js
  return { foe, fight: e.fight, win, winMax: winChance(own, foe, true), flee: fl, power: ownPower(own), margin: e.mg, lossTake, lossBest: lossChance(own, foe, true),
    lossAuto: e.fight ? lossTake : (1 - fl) * cl,   // 船員：打得贏才打（= 同樣開打的期望損失），否則逃（逃不掉才受傷）
    lossRetreat: (1 - fl) * cl };
}
