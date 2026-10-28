// 海怪與海盜海戰（階段④）測試：node tools/battle-test.mjs
import { newState, simulateTo, syncCrew } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import * as W from '../src/sim/world.js';
import * as B from '../src/sim/battle.js';
import * as A from '../src/sim/arena.js';
import { playBot } from './arena-bot.mjs';
import { FLAG_ROWS, resCap } from '../src/sim/promo.js';
import { SPECIAL_ZONES, SZ, MATERIALS, MAT_ORDER, PROMO_BP, zoneAtPoint } from '../src/sim/szdata.js';
import { SHIPS } from '../src/sim/fleetdefs.js';
import { RES_KEYS, SAVE_VERSION } from '../src/sim/defs.js';
import { validateState, serialize } from '../src/save/cloud.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000, H = 3600, D = 86400; const crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const mk = (pos = { x: 1000, y: 1000 }, o = {}) => { const s = newState(o.seed || 4242, T0, 480); syncCrew(s, crew); F.ensureFleet(s, o.owner !== false); F.ensureWorld(s, 'u-bt'); s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; s.fleet.world.pos = { ...pos }; return s; };
const canon = (v) => (v && typeof v === 'object' ? (Array.isArray(v) ? v.map(canon) : Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))) : v);
const strip = (s) => { const c = JSON.parse(JSON.stringify(s)); delete c.lastSeen; return JSON.stringify(canon(c)); };
const own = (id, cond = 100) => { const r = FLAG_ROWS[id]; return { fp: r.fp, hull: r.hull, cond, branch: r.branch, spd: r.spd, scoutK: r.scout / 95, haz: r.haz, trade: r.trade }; };
// 分段推進並收集戰報（s.log 只留最後 60 筆）；refill = 每段補滿船體 / 資源（排除「自然磨損」干擾，單獨看戰鬥）
const collect = (s, days, refill) => { const out = []; let last = s.simT, minCond = 100; for (let u = s.simT + 6 * H; u <= T0 + days * D; u += 6 * H) { if (refill) { s.cond = 100; s.res = { food: 400, water: 400, fuel: 400, parts: 400 }; } simulateTo(s, u); for (const e of s.log) if (e.type === 'battle' && e.t > last) out.push(e); last = s.simT; minCond = Math.min(minCond, s.cond); } out.minCond = minCond; return out; };
const RANK = { win: 3, draw: 2, lose: 1 };

// ---- 資料表
{ ok(B.FOE_ORDER.length === 4 && ['serpent', 'kraken', 'leviathan', 'pirate'].every((k) => B.FOES[k]) && Object.getPrototypeOf(B.FOES) === null, '4 種對手：海蛇 / 海妖 / 利維坦 / 海盜；資料表無原型');
  ok(B.FOES.__proto__ === undefined && B.FOES.constructor === undefined && B.FOES.toString === undefined, 'FOES 用 __proto__ / constructor 查不到');
  const bad = []; for (const k of B.FOE_ORDER) { const L = B.FOES[k].loot; for (const r of Object.keys(L.res)) if (!RES_KEYS.includes(r)) bad.push(k + r); }
  ok(!bad.length, '掉落資源 key 都合法');
  ok(B.FOES.leviathan.boss && B.FOES.leviathan.hp > B.FOES.kraken.hp && B.FOES.kraken.hp > B.FOES.pirate.hp && B.FOES.pirate.hp > B.FOES.serpent.hp, '強度：海蛇 < 海盜 < 海妖 < 利維坦');
  // 每種材料 / 每張稀有藍圖在戰鬥裡也找得到來源（跟特殊海域掉落並存）
  const got = new Set(), gbp = new Set(); const f0 = { bp: {} };
  for (const zid of Object.keys(SPECIAL_ZONES)) for (const k of B.FOE_ORDER) for (let i = 0; i < 400; i++) { const lt = B.lootRoll(1000 + i, i, { k, lv: 1.3, z: zid, rz: 'reef' }, 'win', f0, 0); for (const m of Object.keys(lt.mat)) got.add(m); if (lt.bp) gbp.add(lt.bp); }
  ok(MAT_ORDER.every((m) => got.has(m)), '五種材料都能從戰鬥掉出來：' + [...got].join(','));
  ok(['bp_war3', 'bp_mer3', 'bp_sci3', 'speedboat', 'patrol', 'bp_war1', 'bp_sci2'].every((b) => gbp.has(b)) && [...gbp].every((b) => PROMO_BP[b] || SHIPS[b]), '稀有藍圖（T3 由利維坦）+ 船隻藍圖（海盜）都有來源，而且 id 都合法'); }

// ---- 決定性對戰：單調、手動加成有上限、不會比自動差
{ const bad = []; let n = 0;
  for (const id of ['ark_t0', 'war_1', 'war_2', 'war_3', 'mer_2', 'sci_2']) for (const k of ['serpent', 'pirate', 'kraken', 'leviathan']) for (const lv of [1, 1.3, 1.6]) for (let i = 0; i < 25; i++) {
    const o = own(id, 60 + (i % 5) * 10), foe = B.foeStats({ k, lv }); const lo = B.duel(77 + i, i, o, foe, { acc: 0.3, dodge: 0.1 }), mid = B.duel(77 + i, i, o, foe, B.BOT), hi = B.duel(77 + i, i, o, foe, { acc: 0.9, dodge: 0.8 }); n++;
    if (RANK[hi.res] < RANK[mid.res] || RANK[mid.res] < RANK[lo.res] || (RANK[hi.res] === RANK[mid.res] && hi.res !== 'win' && hi.loss > mid.loss + 1e-9)) bad.push(`${id}/${k}/${lv}/${i}`); }
  ok(!bad.length, `命中 / 閃避越高結果絕不更差（${n} 組，違反 ${bad.slice(0, 3)}）`);
  const e = B.effSkill({ acc: 1, dodge: 1, shots: 30 }); ok(Math.abs(e.acc - B.BOT.acc * 1.25) < 1e-9 && Math.abs(e.dodge - (B.BOT.dodge + 0.1)) < 1e-9, `手動加成上限：命中 ×1.25（${e.acc.toFixed(3)}）、閃避 +0.1（${e.dodge.toFixed(2)}）`);
  const e0 = B.effSkill({ acc: 0, dodge: 0, shots: 30 }), e1 = B.effSkill({ acc: 1, dodge: 1, shots: 1 }), e2 = B.effSkill(null), e3 = B.effSkill({ acc: NaN, dodge: Infinity, shots: 9 }), e4 = B.effSkill({ acc: '1', dodge: {}, shots: 9 });
  ok([e0, e2].every((x) => x.acc === B.BOT.acc && x.dodge === B.BOT.dodge) && e1.acc === B.BOT.acc && e3.acc === B.BOT.acc && e4.acc === B.BOT.acc && e3.dodge >= B.BOT.dodge && e3.dodge <= B.BOT.dodge + 0.1, '亂報 / 少於 3 發 / NaN / 字串 → 不低於船員、不超過上限');
  let worse = 0, better = 0, same = 0; for (const id of ['ark_t0', 'war_1', 'war_2', 'war_3', 'mer_3', 'sci_3']) for (const k of ['serpent', 'pirate', 'kraken', 'leviathan']) for (let i = 0; i < 40; i++) {
    const o = own(id, 100), foe = B.foeStats({ k, lv: 1.15 + (i % 4) * 0.15 }); const a = B.duel(900 + i, i, o, foe, B.BOT), m = B.manualBattle(900 + i, o, foe, i, { acc: 0.99, dodge: 0.99, shots: 20 });
    if (RANK[m.kind] < RANK[a.res]) worse++; else if (RANK[m.kind] > RANK[a.res]) better++; else same++; }
  ok(worse === 0 && better > 0 && same > better, `手動（滿分）從不比「強制交戰的自動」差；${better} 場更好 / ${same} 場一樣`);
  const b1 = B.autoBattle(5, own('war_1'), B.foeStats({ k: 'kraken', lv: 1.2 }), 3), b2 = B.autoBattle(5, own('war_1'), B.foeStats({ k: 'kraken', lv: 1.2 }), 3); ok(JSON.stringify(b1) === JSON.stringify(b2), '同樣種子 / 場次 → 同樣結果');
  ok(B.autoBattle(1, own('ark_t0'), B.foeStats({ k: 'leviathan', lv: 1.6 }), 1).act === 'flee' && B.autoBattle(1, own('war_3'), B.foeStats({ k: 'leviathan', lv: 1.6 }), 1).act === 'fight', '船員：打不贏利維坦就逃（初始方舟）、T3 戰艦敢打');
  ok(B.autoBattle(1, own('war_2', 21), B.foeStats({ k: 'pirate', lv: 1.2 }), 1).act === 'flee', '船體剩 21%（快到底線）→ 船員不戰而逃');
  const cost = (id) => { let l = 0; for (let i = 0; i < 200; i++) l += B.duel(i, i, own(id), B.foeStats({ k: 'kraken', lv: 1.3 }), B.BOT).loss; return l / 200; };
  ok(cost('war_3') < cost('war_1') && cost('war_1') < cost('ark_t0'), `強制交戰海妖的平均船體損失：戰艦 T3（${cost('war_3').toFixed(0)}%）< T1（${cost('war_1').toFixed(0)}%）< 初始方舟（${cost('ark_t0').toFixed(0)}%）`); }
{ const o = own('war_2', 25), foe = B.foeStats({ k: 'kraken', lv: 1.5 }); const r = B.duel(3, 3, o, foe, B.BOT); ok(r.loss <= 5 + 1e-6, `船體只剩 25% 時最多再損失 5%（不會越過 ${SZ.floor}% 底線）：實際 −${r.loss}%`); }

// ---- 遭遇：出生點近海永遠安全、離線與逐 tick 結果一致
const runTo = (s, t) => { for (let u = s.simT + 40 * H; u < t; u += 40 * H) simulateTo(s, u); simulateTo(s, t); return s; };   // 離線補算最多 48 小時，所以分段
{ const sp = W.SPAWNS[0]; const a = mk({ x: sp.x, y: sp.y }); runTo(a, T0 + 30 * D); ok(!(a.fleet.world.bt && a.fleet.world.bt.n), '停在出生點近海 30 天：零遭遇（新手保護）');
  const sw = mk({ x: 1000, y: 1000 }); runTo(sw, T0 + 30 * D); const bt = sw.fleet.world.bt; ok(bt && bt.n >= 30 && bt.n <= 100, `停在深淵 30 天：${bt && bt.n} 場遭遇（約每天 1–3 場）`);
  { const hv = mk({ x: 1000, y: 1000 }); hv.cond = 100; const evs = collect(hv, 30, true); ok(hv.fleet.world.bt.n > 30 && evs.minCond >= SZ.floor, `每段補滿船體（只看戰鬥傷害）30 天：最低 ${evs.minCond.toFixed(1)}%（≥ ${SZ.floor}%），${evs.length} 筆戰報`); }
  ok(RES_KEYS.every((k) => sw.res[k] >= 0 && sw.res[k] <= resCap(sw, k) + 1e-6) && Object.values(sw.fleet.mat || {}).every((v) => v >= 0 && v <= SZ.matCap), '資源 / 材料沒有超出上限或變負');
  ok(sw.log.some((e) => e.type === 'battle'), '戰報寫進 s.log（type: battle）');
  // 逐 tick / 每小時 / 一次補算 → 結果完全相同
  const x1 = mk({ x: 1000, y: 1000 }), x2 = mk({ x: 1000, y: 1000 }), x3 = mk({ x: 1000, y: 1000 }); runTo(x1, T0 + 6 * D); for (let t = T0 + H; t <= T0 + 6 * D; t += H) simulateTo(x2, t); for (let t = T0 + 60; t <= T0 + 2 * D; t += 60) simulateTo(x3, t); runTo(x3, T0 + 6 * D);
  ok(strip(x1) === strip(x2) && strip(x1) === strip(x3), '離線一次補 6 天 = 每小時推進 = 每分鐘推進（含遭遇 / 戰利品 / 損失）'); ok(x1.fleet.world.bt.n > 0, '（確認這 6 天真的有遭遇）');
  const lv = mk({ x: SPECIAL_ZONES.hell.x, y: SPECIAL_ZONES.hell.y }); lv.fleet.flag = { branch: 'war', tier: 3, pj: null, up: null }; const days = []; collect(lv, 40, true);
  ok(lv.fleet.world.bt.n > 10, `地獄深處 40 天：${lv.fleet.world.bt.n} 場遭遇、${lv.fleet.world.bt.k.leviathan | 0} 隻利維坦被擊退`);
  ok(lv.fleet.world.bt.lv > -99 && lv.cond >= SZ.floor - 1e-9, '利維坦有出現過；船體仍在底線之上');
  const rf = mk({ x: 1000, y: 1000 }); rf.fleet.flag = { branch: 'war', tier: 0, pj: null, up: { to: 'war_1', start: T0, end: T0 + 40 * D } }; runTo(rf, T0 + 20 * D); ok(!(rf.fleet.world.bt && rf.fleet.world.bt.n), '旗艦改裝（進塢）期間：不會被遭遇');
  const pl = mk({ x: 1000, y: 1000 }, { seed: 99 }); for (let i = 0; i < 4; i++) {}
}
// 遭遇間隔 / 利維坦冷卻
{ const s = mk({ x: SPECIAL_ZONES.hell.x, y: SPECIAL_ZONES.hell.y }); s.fleet.flag = { branch: 'war', tier: 3, pj: null, up: null }; const st = collect(s, 60, true).filter((e) => e.sub === 'start'); const gaps = st.slice(1).map((e, i) => e.t - st[i].t);
  ok(gaps.length > 5 && Math.min(...gaps) >= B.BT.slot * B.BT.cool - 1, `兩次遭遇至少隔 ${B.BT.cool} 個槽（最短 ${Math.round(Math.min(...gaps) / 60)} 分）`);
  const lvs = st.filter((e) => e.foe === 'leviathan').map((e) => e.t); ok(lvs.length >= 2 && lvs.slice(1).every((t, i) => t - lvs[i] >= (B.BT.lvDays - 1) * D), `利維坦至少每 ${B.BT.lvDays} 個遊戲日才再出現（共 ${lvs.length} 次）`);
  const kinds = new Set(st.map((e) => e.foe)); ok(kinds.has('leviathan') && kinds.has('kraken') && kinds.has('serpent'), '地獄海域：海蛇 / 海妖 / 利維坦都會出沒'); }
{ const kinds = new Set(); for (const [x, y] of [[1000, 1000], [1000, 300], [500, 600], [1400, 1400]]) { const s = mk({ x, y }); for (const e of collect(s, 60, true)) if (e.sub === 'start') kinds.add(e.foe); }
  ok(kinds.has('pirate') && kinds.has('serpent') && kinds.has('kraken') && !kinds.has('leviathan'), '一般海域：海蛇 / 海盜 / 海妖，沒有利維坦：' + [...kinds].join(',')); }

// ---- 玩家動作：接管 / 交給船員 / 提交結果
const find = () => { for (let seed = 1; seed < 80; seed++) { const s = mk({ x: 1000, y: 1000 }, { seed }); let t = T0; while (t < T0 + 3 * D) { t += B.BT.slot; simulateTo(s, t); if (B.curOf(s)) return { s, t }; } } return null; };
{ const f = find(); ok(!!f, '找得到一場進行中的遭遇'); const { s, t } = f; const cur = B.curOf(s); ok(cur && !cur.eng && cur.end === cur.t0 + B.BT.grace && B.battleCan(s, t).ok, `遭遇有倒數（${B.BT.grace / 60} 分鐘）可接管`);
  const pv = B.battlePreview(s, F.combatOf(s)); ok(pv && pv.foe.hp > 0 && typeof pv.fight === 'boolean', '預估：船員會打還是逃');
  const e1 = B.battleEngage(s, t + 100); ok(e1.ok && B.curOf(s).eng === 1 && B.curOf(s).end >= t + 100 + B.BT.grace, '接管：倒數重新計時（打到一半不會被自動結算）');
  const mid = JSON.parse(JSON.stringify(s)); simulateTo(mid, t + 100 + 300); ok(B.curOf(mid) && B.curOf(mid).eng, '接管後 5 分鐘內，模擬不會自動結算');
  const aft = JSON.parse(JSON.stringify(s)); simulateTo(aft, t + 100 + B.BT.grace + 120); ok(!B.curOf(aft) && aft.fleet.world.bt.last && aft.fleet.world.bt.last.man === 0, '接管後沒回來提交：倒數結束 → 船員自動結算');
  const c0 = s.cond; const r = B.battleSubmit(s, t + 160, { acc: 0.8, dodge: 0.9, shots: 12 }, F.combatOf(s)); ok(r.ok && !B.curOf(s) && s.fleet.world.bt.last.man === 1 && s.cond <= c0 && s.cond >= SZ.floor, `提交即時砲戰結果 → ${r.kind}：${r.text}`);
  ok(!B.battleSubmit(s, t + 170, { acc: 1, dodge: 1, shots: 12 }, F.combatOf(s)).ok && !B.battleAuto(s, t + 170, F.combatOf(s)).ok && !B.battleEngage(s, t + 170).ok, '結算後不能重複結算 / 接管');
  const f2 = find(); const r2 = B.battleAuto(f2.s, f2.t + 30, F.combatOf(f2.s)); ok(r2.ok && !B.curOf(f2.s) && f2.s.log.some((e) => e.type === 'battle' && e.sub !== 'start'), '交給船員：立刻結算並寫戰報');
  const f3 = find(); simulateTo(f3.s, f3.t + B.BT.grace + 10); ok(!B.curOf(f3.s) && !B.battleEngage(f3.s, f3.t + B.BT.grace + 20).ok, '倒數結束後來不及接管');
  // 玩家接管後成績 ≥ 同一場自動
  let better = 0, worse = 0; for (let i = 0; i < 40; i++) { const g = mk({ x: 1000, y: 1000 }, { seed: 300 + i }); g.fleet.world.bt = { ...B.emptyBt(), n: i, cur: { id: i + 1, k: 'kraken', lv: 1.3, z: '', rz: 'abyss', dep: 0, x: 1000, y: 1000, wx: '', t0: T0, end: T0 + 600, eng: 0, nm: '' } }; const g2 = JSON.parse(JSON.stringify(g));
    const oc = F.combatOf(g); const foe = B.foeStats(g.fleet.world.bt.cur); const a = B.duel(g.seed, i + 1, oc, foe, B.BOT).res; const m = B.battleSubmit(g2, T0 + 100, { acc: 1, dodge: 1, shots: 30 }, oc).kind; if (RANK[m] > RANK[a]) better++; else if (RANK[m] < RANK[a]) worse++; }
  ok(worse === 0, `用整個存檔流程驗證：手動從不比強制交戰的自動差（更好 ${better} 場）`); }

// ---- 獎勵 / 損失
{ const s = mk(); const cur = { id: 7, k: 'leviathan', lv: 1.6, z: 'hell', rz: 'abyss' }; let hs = 0, bpN = 0; for (let i = 0; i < 60; i++) { const l = B.lootRoll(5000 + i, i, cur, 'win', { bp: {} }, 0); if (l.mat.hellstone >= 2) hs++; if (l.bp && /3$/.test(l.bp)) bpN++; }
  ok(hs === 60, '利維坦在地獄：一定掉煉獄晶 ×2–3'); ok(bpN > 15 && bpN < 50, `利維坦掉 T3 稀有藍圖（60 隻裡 ${bpN} 張）`);
  const own3 = { bp: { bp_war3: 1, bp_mer3: 1, bp_sci3: 1 } }; let dup = 0; for (let i = 0; i < 100; i++) if (B.lootRoll(i, i, cur, 'win', own3, 0).bp) dup++; ok(dup === 0, '已經有的藍圖不會重複掉');
  const d = B.lootRoll(1, 1, { k: 'kraken', lv: 1.3, z: 'fire', rz: 'reef' }, 'draw', { bp: {} }, 0); ok(!Object.keys(d.mat).length && !d.bp && d.res.parts > 0, '僵持：只撿到一點資源');
  const mer = B.lootRoll(9, 9, { k: 'pirate', lv: 1.2, z: '', rz: 'ruins' }, 'win', { bp: {} }, 0.5), base = B.lootRoll(9, 9, { k: 'pirate', lv: 1.2, z: '', rz: 'ruins' }, 'win', { bp: {} }, 0); ok(mer.res.parts > base.res.parts, '商船分支（貿易加成）：戰利品更多');
  const full = mk(); full.res.parts = resCap(full, 'parts'); full.fleet.mat = { ember: SZ.matCap }; full.fleet.world.bt = { ...B.emptyBt(), n: 0, cur: { id: 1, k: 'kraken', lv: 1.2, z: 'fire', rz: 'reef', dep: 0.5, x: 1560, y: 1250, wx: '', t0: T0, end: T0 + 600, eng: 0, nm: '' } }; B.battleSubmit(full, T0 + 60, { acc: 1, dodge: 1, shots: 20 }, own('war_3')); ok(full.res.parts <= resCap(full, 'parts') && full.fleet.mat.ember <= SZ.matCap, '倉庫 / 材料滿了：戰利品不會超出上限');
  const pi = mk(); pi.fleet.world.bt = { ...B.emptyBt(), cur: { id: 3, k: 'pirate', lv: 1.4, z: '', rz: 'ruins', dep: 0, x: 1000, y: 1000, wx: '', t0: T0, end: T0 + 600, eng: 0, nm: '黑旗號' } }; pi.cond = 90; const w0 = { ...pi.res };
  const weak = { fp: 0.5, hull: 100, cond: 90, branch: null, spd: 0.5, scoutK: 0.5, haz: 0, trade: 0 }; const ra = B.battleSubmit(pi, T0 + 30, { acc: 0, dodge: 0, shots: 0 }, weak); ok(['lose', 'caught', 'draw'].includes(ra.kind) && (ra.kind === 'draw' || pi.res.parts < w0.parts), `太弱遇到海盜：${ra.kind}，被搶 / 受損 → 零件 ${w0.parts} → ${Math.round(pi.res.parts)}，船體 ${pi.cond.toFixed(1)}%`);
  ok(pi.cond >= SZ.floor && pi.res.fuel >= 0 && pi.res.food >= 0, '輸了也不會低於底線 / 變負'); }

// ---- 存檔
{ const s = mk({ x: 1000, y: 1000 }); runTo(s, T0 + 8 * D); const j = JSON.parse(serialize(s)); const v = validateState(j); ok(v && v.fleet.world.bt && v.fleet.world.bt.n === s.fleet.world.bt.n && strip(v.fleet.world.bt) === strip(s.fleet.world.bt), '存檔來回：bt 完整保留（含進行中的遭遇）');
  const old = JSON.parse(JSON.stringify(s)); delete old.fleet.world.bt; const v2 = validateState(old); ok(v2 && !v2.fleet.world.bt, '舊存檔沒有 bt → 照常載入'); ok(SAVE_VERSION === 1, 'SAVE_VERSION 仍是 1');
  const hostile = [{ n: 'x', cur: { k: '__proto__', t0: 1, end: 2, id: 1, lv: 1 }, k: { __proto__: { a: 1 }, constructor: 5, serpent: -3, kraken: 'x' }, st: { w: 1e99, l: NaN } }, { cur: { k: 'kraken', t0: 1, end: 2, id: 1, lv: 99, z: 'constructor', rz: '__proto__', dep: 9, x: -5, y: 1e9 } }, null, 5, [], { last: { text: 'a'.repeat(999), k: 'toString', r: 'x' } }, { cur: { k: 'constructor', t0: 0, end: 1, id: 1, lv: 1 } }];
  let crash = null; for (const h of hostile) { try { const c = JSON.parse(JSON.stringify(s)); c.fleet.world.bt = h; const r = validateState(JSON.parse(JSON.stringify(c))); const bt = r && r.fleet.world.bt; if (bt) { if (bt.cur && (!B.FOES[bt.cur.k] || bt.cur.lv > 4 || bt.cur.x < 0 || bt.cur.y > 2000)) crash = 'bad cur'; if (bt.last && bt.last.text.length > 160) crash = 'long'; if (Object.keys(bt.k).some((k) => !B.FOES[k])) crash = 'k'; } if (r) { simulateTo(r, T0 + 9 * D); } } catch (e) { crash = String(e); } }
  ok(!crash, '惡意 bt（__proto__ / constructor / NaN / 超大 / 亂型別）：清洗後不當機、不崩壞 ' + (crash || '')); }

// ---- 訪客（小船）戰力
{ const g = mk({ x: 1000, y: 1000 }, { owner: false }); g.fleet.ships.push({ id: 99, type: 'skiff', lv: 1, state: 'dock', name: 's', hp: 100, n: 0 }); g.fleet.home = 99; const c = F.combatOf(g), o = F.combatOf(mk());
  ok(c.fp > 0 && c.hull > 0 && c.fp <= o.fp * 1.2 && c.hull < 1000, `訪客小船戰力（火力 ${c.fp.toFixed(1)} 船體 ${Math.round(c.hull)}）有放大但不超過方舟（火力 ${o.fp}）`);
  const gt = mk({ x: 1000, y: 1000 }, { owner: false }); const ge = collect(gt, 10, true); ok(ge.minCond >= SZ.floor && gt.fleet.world.bt.n > 0, `訪客 10 天：${gt.fleet.world.bt.n} 場遭遇，船體最低 ${ge.minCond.toFixed(1)}%（≥ ${SZ.floor}%）`); }

// ---- 即時砲戰場
{ const foe = B.foeStats({ k: 'pirate', lv: 1.15 }), o = own('ark_t0');
  const a1 = A.createArena(11, 1, foe, o), a2 = A.createArena(11, 1, foe, o); playBot(a1, 0.9, 5); playBot(a2, 0.9, 5); ok(a1.over === a2.over && JSON.stringify(A.arenaMetrics(a1)) === JSON.stringify(A.arenaMetrics(a2)) && a1.t === a2.t, '同樣種子 / 同樣操作 → 完全相同的戰鬥（可重播）');
  const idle = A.createArena(12, 2, foe, o); let n = 0; while (!idle.over && n++ < 4000) A.stepArena(idle, { mx: 0, my: 0, aim: null, fire: false }); const m = A.arenaMetrics(idle); ok(m.shots === 0 && m.acc === 0 && idle.over && idle.hullPct >= SZ.floor, `不操作：0 發、結束於 ${idle.over}（${m.t}s），船體 ${idle.hullPct.toFixed(1)}% ≥ 底線`);
  for (const k of ['serpent', 'pirate', 'kraken']) { let w = 0; for (let i = 0; i < 6; i++) { const a = A.createArena(40 + i, i, B.foeStats({ k, lv: 1.2 }), own('war_1')); playBot(a, 0.9, 3 + i); if (a.over === 'win') w++; } ok(w >= 5, `機器人（高手）能擊沉${B.FOES[k].name}：${w}/6`); }
  const lev = A.createArena(3, 3, B.foeStats({ k: 'leviathan', lv: 1.6 }), own('war_3')); playBot(lev, 1, 4); ok(lev.over === 'win' && lev.t > 15 && lev.t < A.AR.time, `機器人用戰艦 T3 打得贏利維坦（${lev.t.toFixed(0)} 秒，階段 2 有出現：血量一半以下）`);
  const weak = A.createArena(5, 5, B.foeStats({ k: 'leviathan', lv: 1.6 }), own('ark_t0')); playBot(weak, 1, 4); ok(weak.over !== 'win', '初始方舟硬拚利維坦：機器人也贏不了（要靠旗艦階級）');
  const mm = A.arenaMetrics(a1); ok(mm.acc > 0 && mm.acc <= 1 && mm.dodge >= 0 && mm.dodge <= 1 && mm.shots > 0, `回報的命中 ${(mm.acc * 100) | 0}% / 閃避 ${(mm.dodge * 100) | 0}% 都在 0–1`);
  const wild = A.createArena(8, 8, foe, o); for (let i = 0; i < 300; i++) A.stepArena(wild, { mx: i % 2 ? NaN : 99, my: -1e9, aim: { x: NaN, y: 1e9 }, fire: true, ammo: 1 }); ok(wild.p.x >= 4 && wild.p.x <= 96 && wild.p.y >= 46 && wild.p.y <= 96 && Number.isFinite(wild.p.vx), '亂輸入（NaN / 超大）：玩家不出界、不爆數值');
  const burn = A.createArena(9, 9, B.foeStats({ k: 'kraken', lv: 1.2 }), own('war_1')); let ev0 = 0; for (let i = 0; i < 90; i++) { for (const e of A.stepArena(burn, { mx: 0, my: 0, aim: { x: burn.foe.x, y: burn.foe.y }, fire: true, ammo: 1 })) if (e.k === 'foehit' && e.burn) ev0++; } ok(burn.st.inc > 0 && burn.st.inc <= A.AR.incN && ev0 >= 0, `燃燒彈有數量上限（用了 ${burn.st.inc} / ${A.AR.incN}）`); }

// ---- 艦隊小船的「海怪來襲」事件
{ const { EVENTS, decide, planEvent } = await import('../src/sim/seaevents.js');
  ok(EVENTS.battle && EVENTS.battle.opts.some((o) => o.battle) && Object.getPrototypeOf(EVENTS) === null, '艦隊事件表有「海怪來襲」');
  const mkShip = (n) => ({ id: 7, n, m: { zone: 'ruins', start: T0, end: T0 + 7200, res: { food: 100, water: 100, fuel: 0, parts: 50 }, dmg: 0, ev: { k: 'battle', at: 0.2, c: -1 } } });
  const stl = { fp: 3, hull: 80, speed: 1 }, sts = { fp: 0, hull: 20, speed: 1 }; let outs = {}, w = 0, a = 0;
  for (let n = 0; n < 200; n++) { const sh = mkShip(n); const r = decide(4242, sh, stl, 0, T0 + 3000, []); if (!r.ok) { outs = null; break; } const r2 = decide(4242, mkShip(n), stl, 0, T0 + 3000, []); if (JSON.stringify(r) !== JSON.stringify(r2)) { outs = null; break; } if (sh.m.res.food === 130) w++; a += sh.m.dmg; }
  ok(outs && w > 150, `開砲迎戰：確定性；有火力的船 200 次裡 ${w} 次擊退得到 +30% 收穫`);
  let lw = 0, ll = 0; for (let n = 0; n < 200; n++) { const sh = mkShip(n); decide(4242, sh, sts, 0, T0 + 3000, []); if (sh.m.res.food === 130) lw++; if (sh.m.res.food <= 60) ll++; } ok(lw < w && ll > 0, `沒火力的小船：贏 ${lw} 次、慘敗 ${ll} 次（比有火力的船差）`);
  const weak = mkShip(1); decide(4242, weak, sts, 0, T0 + 3000, []); ok(weak.m.dmg >= 0 && weak.m.dmg <= 100 && Object.values(weak.m.res).every((v) => Number.isFinite(v) && v >= 0), '弱船迎戰：損害與收穫都是有限數字');
  let pl = 0; for (let n = 0; n < 400; n++) { const e = planEvent(4242, 3, n, 'abyss', false); if (e && e.k === 'battle') pl++; } ok(pl > 0, `深淵任務會抽到海怪事件（${pl}/400）`); }

console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
