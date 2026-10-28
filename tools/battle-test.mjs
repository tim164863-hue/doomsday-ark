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
import { measure } from './battle-rate.mjs';
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

// ---- 決定性對戰（公式）：單調、手動加成有上限。注意這只是公式的性質，不代表「接管一定比自動好」（船員會逃、接管一定開打）
{ const bad = []; let n = 0;
  for (const id of ['ark_t0', 'war_1', 'war_2', 'war_3', 'mer_2', 'sci_2']) for (const k of ['serpent', 'pirate', 'kraken', 'leviathan']) for (const lv of [1, 1.3, 1.6]) for (let i = 0; i < 25; i++) {
    const o = own(id, 60 + (i % 5) * 10), foe = B.foeStats({ k, lv }); const lo = B.duel(77 + i, i, o, foe, { acc: 0.3, dodge: 0.1 }), mid = B.duel(77 + i, i, o, foe, B.BOT), hi = B.duel(77 + i, i, o, foe, { acc: 0.9, dodge: 0.8 }); n++;
    if (RANK[hi.res] < RANK[mid.res] || RANK[mid.res] < RANK[lo.res] || (RANK[hi.res] === RANK[mid.res] && hi.res !== 'win' && hi.loss > mid.loss + 1e-9)) bad.push(`${id}/${k}/${lv}/${i}`); }
  ok(!bad.length, `公式內：命中 / 閃避越高、同一場結果不會更差（${n} 組，違反 ${bad.slice(0, 3)}）`);
  const e = B.effSkill({ acc: 1, dodge: 1, shots: 30 }); ok(Math.abs(e.acc - B.BOT.acc * 1.25) < 1e-9 && Math.abs(e.dodge - (B.BOT.dodge + 0.1)) < 1e-9, `手動加成上限：命中 ×1.25（${e.acc.toFixed(3)}）、閃避 +0.1（${e.dodge.toFixed(2)}）`);
  const e0 = B.effSkill({ acc: 0, dodge: 0, shots: 30 }), e1 = B.effSkill({ acc: 1, dodge: 1, shots: 1 }), e2 = B.effSkill(null), e3 = B.effSkill({ acc: NaN, dodge: Infinity, shots: 9 }), e4 = B.effSkill({ acc: '1', dodge: {}, shots: 9 });
  ok([e0, e2].every((x) => x.acc === B.BOT.acc && x.dodge === B.BOT.dodge) && e1.acc === B.BOT.acc && e3.acc === B.BOT.acc && e4.acc === B.BOT.acc && e3.dodge >= B.BOT.dodge && e3.dodge <= B.BOT.dodge + 0.1, '亂報 / 少於 3 發 / NaN / 字串 → 不低於船員、不超過上限');
  let worse = 0, better = 0, same = 0; for (const id of ['ark_t0', 'war_1', 'war_2', 'war_3', 'mer_3', 'sci_3']) for (const k of ['serpent', 'pirate', 'kraken', 'leviathan']) for (let i = 0; i < 40; i++) {
    const o = own(id, 100), foe = B.foeStats({ k, lv: 1.15 + (i % 4) * 0.15 }); const a = B.duel(900 + i, i, o, foe, B.BOT), m = B.manualBattle(900 + i, o, foe, i, { acc: 0.99, dodge: 0.99, shots: 20 });
    if (RANK[m.kind] < RANK[a.res]) worse++; else if (RANK[m.kind] > RANK[a.res]) better++; else same++; }
  ok(worse === 0 && better > 0 && same > better, `公式內：滿分技巧 vs 同樣強制交戰的自動，不會更差；${better} 場更好 / ${same} 場一樣`);
  const b1 = B.autoBattle(5, own('war_1'), B.foeStats({ k: 'kraken', lv: 1.2 }), 3), b2 = B.autoBattle(5, own('war_1'), B.foeStats({ k: 'kraken', lv: 1.2 }), 3); ok(JSON.stringify(b1) === JSON.stringify(b2), '同樣種子 / 場次 → 同樣結果');
  ok(B.autoBattle(1, own('ark_t0'), B.foeStats({ k: 'leviathan', lv: 1.6 }), 1).act === 'flee' && B.autoBattle(1, own('war_3'), B.foeStats({ k: 'leviathan', lv: 1.6 }), 1).act === 'fight', '船員：打不贏利維坦就逃（初始方舟）、T3 戰艦敢打');
  ok(B.autoBattle(1, own('war_2', 21), B.foeStats({ k: 'pirate', lv: 1.2 }), 1).act === 'flee', '船體剩 21%（快到底線）→ 船員不戰而逃');
  const cost = (id) => { let l = 0; for (let i = 0; i < 200; i++) l += B.duel(i, i, own(id), B.foeStats({ k: 'kraken', lv: 1.3 }), B.BOT).loss; return l / 200; };
  ok(cost('war_3') < cost('war_1') && cost('war_1') < cost('ark_t0'), `強制交戰海妖的平均船體損失：戰艦 T3（${cost('war_3').toFixed(0)}%）< T1（${cost('war_1').toFixed(0)}%）< 初始方舟（${cost('ark_t0').toFixed(0)}%）`); }
{ const o = own('war_2', 25), foe = B.foeStats({ k: 'kraken', lv: 1.5 }); const r = B.duel(3, 3, o, foe, B.BOT); ok(r.loss <= 5 + 1e-6, `船體只剩 25% 時最多再損失 5%（不會越過 ${SZ.floor}% 底線）：實際 −${r.loss}%`); }

// ---- 遭遇：出生點近海永遠安全、離線與逐 tick 結果一致
const runTo = (s, t) => { for (let u = s.simT + 40 * H; u < t; u += 40 * H) simulateTo(s, u); simulateTo(s, t); return s; };   // 離線補算最多 48 小時，所以分段
{ const sp = W.SPAWNS[0]; const a = mk({ x: sp.x, y: sp.y }); runTo(a, T0 + 30 * D); ok(!(a.fleet.world.bt && a.fleet.world.bt.n), '停在出生點近海 30 天：零遭遇（新手保護）');
  const sw = mk({ x: 1000, y: 1000 }); runTo(sw, T0 + 30 * D); const bt = sw.fleet.world.bt; ok(bt && bt.n >= 30 && bt.n <= 62, `停在深淵 30 天：${bt && bt.n} 場遭遇（每天 1–2 場）`);
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
  const lvs = st.filter((e) => e.foe === 'leviathan').map((e) => e.t); ok(lvs.length >= 2 && lvs.slice(1).every((t, i) => t - lvs[i] >= B.BT.lvDays * D), `利維坦：距離上一隻（結算時間）至少 ${B.BT.lvDays} 個遊戲日才再出現（共 ${lvs.length} 次，最短間隔 ${(Math.min(...lvs.slice(1).map((t, i) => t - lvs[i])) / D).toFixed(2)} 天）`);
  const kinds = new Set(st.map((e) => e.foe)); ok(kinds.has('leviathan') && kinds.has('kraken') && kinds.has('serpent'), '地獄海域：海蛇 / 海妖 / 利維坦都會出沒'); }
{ const kinds = new Set(); for (const [x, y] of [[1000, 1000], [1000, 300], [500, 600], [1400, 1400]]) { const s = mk({ x, y }); for (const e of collect(s, 60, true)) if (e.sub === 'start') kinds.add(e.foe); }
  ok(kinds.has('pirate') && kinds.has('serpent') && kinds.has('kraken') && !kinds.has('leviathan'), '一般海域：海蛇 / 海盜 / 海妖，沒有利維坦：' + [...kinds].join(',')); }

// ---- 玩家動作：接管 / 交給船員 / 提交結果
const find = () => { for (let seed = 1; seed < 80; seed++) { const s = mk({ x: 1000, y: 1000 }, { seed }); let t = T0; while (t < T0 + 3 * D) { t += B.BT.slot; simulateTo(s, t); if (B.curOf(s)) return { s, t }; } } return null; };
{ const f = find(); ok(!!f, '找得到一場進行中的遭遇'); const { s, t } = f; const cur = B.curOf(s); ok(cur && !cur.eng && cur.end === cur.t0 + B.BT.grace && B.battleCan(s, t).ok, `遭遇有倒數（${B.BT.grace / 60} 分鐘）可接管`);
  const pv = B.battlePreview(s, F.combatOf(s)); ok(pv && pv.foe.hp > 0 && typeof pv.fight === 'boolean', '預估：船員會打還是逃');
  const e1 = B.battleEngage(s, t + 100); ok(e1.ok && B.curOf(s).eng === 1 && B.curOf(s).end >= t + 100 + B.BT.grace, '接管：倒數重新計時（打到一半不會被自動結算）');
  { const e2 = B.battleEngage(s, t + 400), e3 = B.battleEngage(s, t + 500); ok(e2.ok && e3.ok && B.curOf(s).end === t + 100 + B.BT.grace && B.curOf(s).end <= cur.t0 + B.BT.grace * B.BT.engCap, `重複接管只在第一次延長倒數（end 不變，且 ≤ t0 + ${B.BT.engCap}×grace）`);
    const sp = JSON.parse(JSON.stringify(s)); for (let i = 0; i < 400; i++) B.battleEngage(sp, t + 100 + i * 60 > B.curOf(sp).end ? B.curOf(sp).end - 1 : t + 100 + i * 60); ok(B.curOf(sp).end - cur.t0 <= B.BT.grace * B.BT.engCap, '狂按接管 400 次也拉不長：封頂 ' + (B.curOf(sp).end - cur.t0) / 60 + ' 分鐘'); }
  const mid = JSON.parse(JSON.stringify(s)); simulateTo(mid, t + 100 + 300); ok(B.curOf(mid) && B.curOf(mid).eng, '接管後 5 分鐘內，模擬不會自動結算');
  const aft = JSON.parse(JSON.stringify(s)); simulateTo(aft, t + 100 + B.BT.grace + 120); ok(!B.curOf(aft) && aft.fleet.world.bt.last && aft.fleet.world.bt.last.man === 0, '接管後沒回來提交：倒數結束 → 船員自動結算');
  const c0 = s.cond; const r = B.battleSubmit(s, t + 160, { id: B.curOf(s).id, acc: 0.8, dodge: 0.9, shots: 12 }, F.combatOf(s)); ok(r.ok && !B.curOf(s) && s.fleet.world.bt.last.man === 1 && s.cond <= c0 && s.cond >= SZ.floor, `提交即時砲戰結果 → ${r.kind}：${r.text}`);
  ok(!B.battleSubmit(s, t + 170, { id: cur.id, acc: 1, dodge: 1, shots: 12 }, F.combatOf(s)).ok && !B.battleAuto(s, t + 170, F.combatOf(s)).ok && !B.battleEngage(s, t + 170).ok, '結算後不能重複結算 / 接管');
  const f2 = find(); const r2 = B.battleAuto(f2.s, f2.t + 30, F.combatOf(f2.s)); ok(r2.ok && !B.curOf(f2.s) && f2.s.log.some((e) => e.type === 'battle' && e.sub !== 'start'), '交給船員：立刻結算並寫戰報');
  const f3 = find(); simulateTo(f3.s, f3.t + B.BT.grace + 10); ok(!B.curOf(f3.s) && !B.battleEngage(f3.s, f3.t + B.BT.grace + 20).ok, '倒數結束後來不及接管');
  // 玩家接管後成績 ≥ 同一場自動
  let better = 0, worse = 0; for (let i = 0; i < 40; i++) { const g = mk({ x: 1000, y: 1000 }, { seed: 300 + i }); g.fleet.world.bt = { ...B.emptyBt(), n: i, cur: { id: i + 1, k: 'kraken', lv: 1.3, z: '', rz: 'abyss', dep: 0, x: 1000, y: 1000, wx: '', t0: T0, end: T0 + 600, eng: 0, nm: '' } }; const g2 = JSON.parse(JSON.stringify(g));
    const oc = F.combatOf(g); const foe = B.foeStats(g.fleet.world.bt.cur); const a = B.duel(g.seed, i + 1, oc, foe, B.BOT).res; const m = B.battleSubmit(g2, T0 + 100, { id: i + 1, acc: 1, dodge: 1, shots: 30 }, oc).kind; if (RANK[m] > RANK[a]) better++; else if (RANK[m] < RANK[a]) worse++; }
  ok(worse === 0, `用整個存檔流程驗證（砲戰沒打贏 → 公式）：不會比同樣強制交戰的自動差（更好 ${better} 場）`); }

// ---- 獎勵 / 損失
{ const s = mk(); const cur = { id: 7, k: 'leviathan', lv: 1.6, z: 'hell', rz: 'abyss' }; let hs = 0, bpN = 0; for (let i = 0; i < 60; i++) { const l = B.lootRoll(5000 + i, i, cur, 'win', { bp: {} }, 0); if (l.mat.hellstone >= 2) hs++; if (l.bp && /3$/.test(l.bp)) bpN++; }
  ok(hs === 60, '利維坦在地獄：一定掉煉獄晶 ×2–3'); ok(bpN > 15 && bpN < 50, `利維坦掉 T3 稀有藍圖（60 隻裡 ${bpN} 張）`);
  const own3 = { bp: { bp_war3: 1, bp_mer3: 1, bp_sci3: 1 } }; let dup = 0; for (let i = 0; i < 100; i++) if (B.lootRoll(i, i, cur, 'win', own3, 0).bp) dup++; ok(dup === 0, '已經有的藍圖不會重複掉');
  const d = B.lootRoll(1, 1, { k: 'kraken', lv: 1.3, z: 'fire', rz: 'reef' }, 'draw', { bp: {} }, 0); ok(!Object.keys(d.mat).length && !d.bp && d.res.parts > 0, '僵持：只撿到一點資源');
  const mer = B.lootRoll(9, 9, { k: 'pirate', lv: 1.2, z: '', rz: 'ruins' }, 'win', { bp: {} }, 0.5), base = B.lootRoll(9, 9, { k: 'pirate', lv: 1.2, z: '', rz: 'ruins' }, 'win', { bp: {} }, 0); ok(mer.res.parts > base.res.parts, '商船分支（貿易加成）：戰利品更多');
  const full = mk(); full.res.parts = resCap(full, 'parts'); full.fleet.mat = { ember: SZ.matCap }; full.fleet.world.bt = { ...B.emptyBt(), n: 0, cur: { id: 1, k: 'kraken', lv: 1.2, z: 'fire', rz: 'reef', dep: 0.5, x: 1560, y: 1250, wx: '', t0: T0, end: T0 + 600, eng: 0, nm: '' } }; B.battleSubmit(full, T0 + 60, { id: 1, acc: 1, dodge: 1, shots: 20 }, own('war_3')); ok(full.res.parts <= resCap(full, 'parts') && full.fleet.mat.ember <= SZ.matCap, '倉庫 / 材料滿了：戰利品不會超出上限');
  const pi = mk(); pi.fleet.world.bt = { ...B.emptyBt(), cur: { id: 3, k: 'pirate', lv: 1.4, z: '', rz: 'ruins', dep: 0, x: 1000, y: 1000, wx: '', t0: T0, end: T0 + 600, eng: 0, nm: '黑旗號' } }; pi.cond = 90; const w0 = { ...pi.res };
  const weak = { fp: 0.5, hull: 100, cond: 90, branch: null, spd: 0.5, scoutK: 0.5, haz: 0, trade: 0 }; const ra = B.battleSubmit(pi, T0 + 30, { id: 3, acc: 0, dodge: 0, shots: 0 }, weak); ok(['lose', 'caught', 'draw'].includes(ra.kind) && (ra.kind === 'draw' || pi.res.parts < w0.parts), `太弱遇到海盜：${ra.kind}，被搶 / 受損 → 零件 ${w0.parts} → ${Math.round(pi.res.parts)}，船體 ${pi.cond.toFixed(1)}%`);
  ok(pi.cond >= SZ.floor && pi.res.fuel >= 0 && pi.res.food >= 0, '輸了也不會低於底線 / 變負'); }

// ---- 存檔
{ const s = mk({ x: 1000, y: 1000 }); runTo(s, T0 + 8 * D); const j = JSON.parse(serialize(s)); const v = validateState(j); ok(v && v.fleet.world.bt && v.fleet.world.bt.n === s.fleet.world.bt.n && strip(v.fleet.world.bt) === strip(s.fleet.world.bt), '存檔來回：bt 完整保留（含進行中的遭遇）');
  const old = JSON.parse(JSON.stringify(s)); delete old.fleet.world.bt; const v2 = validateState(old); ok(v2 && !v2.fleet.world.bt, '舊存檔沒有 bt → 照常載入'); ok(SAVE_VERSION === 1, 'SAVE_VERSION 仍是 1');
  const hostile = [{ n: 'x', cur: { k: '__proto__', t0: 1, end: 2, id: 1, lv: 1 }, k: { __proto__: { a: 1 }, constructor: 5, serpent: -3, kraken: 'x' }, st: { w: 1e99, l: NaN } }, { cur: { k: 'kraken', t0: 1, end: 2, id: 1, lv: 99, z: 'constructor', rz: '__proto__', dep: 9, x: -5, y: 1e9 } }, null, 5, [], { last: { text: 'a'.repeat(999), k: 'toString', r: 'x' } }, { cur: { k: 'constructor', t0: 0, end: 1, id: 1, lv: 1 } }, { cur: { k: ['kraken'], t0: 1, end: 2, id: 1, lv: 1 } }, { cur: { k: { toString: 1 }, t0: 1, end: 2, id: 1, lv: 1 } }, { last: { text: 'x', k: ['kraken'] } }];
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

// ---- 勝率估計（畫面顯示用）
{ const foe = B.foeStats({ k: 'kraken', lv: 1.3 }); const a = B.winChance(own('ark_t0'), foe), b = B.winChance(own('war_3'), foe), m = B.winChance(own('ark_t0'), foe, true);
  ok(a >= 0 && a <= 1 && b > a && m >= a, `勝率估計：初始方舟 ${(a * 100) | 0}% < 戰艦 T3 ${(b * 100) | 0}%；全力指揮 ${(m * 100) | 0}% ≥ 船員`);
  ok(B.winChance(own('ark_t0'), foe) === a, '勝率估計是決定性的（同輸入同輸出）');
  const s = mk({ x: 1000, y: 1000 }); s.fleet.world.bt = B.emptyBt(); s.fleet.world.bt.cur = { id: 1, k: 'kraken', lv: 1.3, z: '', rz: 'reef', dep: 0, x: 1000, y: 1000, wx: '', t0: T0, end: T0 + 600, eng: 0, nm: '' }; const pv = B.battlePreview(s, F.combatOf(s)); ok(pv && typeof pv.fight === 'boolean' && pv.win >= 0 && pv.winMax >= pv.win - 1e-9, '預覽含「船員打算 / 勝率 / 全力指揮勝率」'); }

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

// ---- 選項 A：砲戰打贏 = 勝利；實際傷害當損失（底線 20%）；輸 / 超時走公式；撤退 = 機率；一場只結算一次；戰報不能冒充別場
import { arenaRisk } from '../src/sim/btrisk.js';
const mkEnc = (seed, id, k, lv, cond = 100, who = 'ark_t0') => { const g = mk({ x: 1000, y: 1000 }, { seed }); g.cond = cond; g.fleet.world.bt = { ...B.emptyBt(), n: id, cur: { id, k, lv, z: '', rz: 'abyss', dep: 0, x: 1000, y: 1000, wx: '', t0: T0, end: T0 + 600, eng: 1, nm: '' } }; return g; };
const repOf = (a, id) => { const m = A.arenaMetrics(a); return { id, won: m.won, loss: m.loss, hits: m.hits, shots: m.shots, t: m.t, acc: m.acc, dodge: m.dodge }; };
{ // 公式會輸、但在砲戰場打贏 → 一定算勝利（初始方舟 vs 海妖，公式勝率 < 100%）
  const o = own('ark_t0'); let tested = 0, formulaLose = 0, bad = [];
  for (let i = 0; i < 80 && tested < 12; i++) { const foe = B.foeStats({ k: 'kraken', lv: 1.0 }); const a = A.createArena(500 + i, i + 1, foe, o); playBot(a, 0.9, i + 1); if (a.over !== 'win') continue;
    const g = mkEnc(600 + i, i + 1, 'kraken', 1.0), c0 = g.cond, rep = repOf(a, i + 1); const fr = B.duel(g.seed, i + 1, o, foe, B.BOT).res; if (fr !== 'win') formulaLose++;   // 同一場如果交給公式（船員同樣開打）
    const r = B.battleSubmit(g, T0 + 60, rep, F.combatOf(g)); tested++;
    const expectCond = Math.max(SZ.floor, c0 - rep.loss);
    if (!(r.ok && r.kind === 'win' && r.arena === true && g.fleet.world.bt.last.r === 'win' && Math.abs(g.cond - expectCond) < 0.06 && g.cond >= SZ.floor - 1e-9)) bad.push(`${i}:${r.kind}/${g.cond}/${expectCond}`); }
  ok(tested >= 5 && formulaLose >= 1 && !bad.length, `砲戰打倒敵人 = 勝利（${tested} 場，其中 ${formulaLose} 場公式本來會輸 / 僵持）；損失 = 砲戰實際傷害（${bad.slice(0, 3)}）`); }
{ // 損失不會把船體打到 20% 以下：船體 25% 打贏、損失宣稱 70% → 最多掉到 20%
  const g = mkEnc(31, 5, 'serpent', 1.0, 25), foe = B.foeStats({ k: 'serpent', lv: 1.0 }), hp = B.arenaFoeHp(foe, own('ark_t0')); const rep = { id: 5, won: true, loss: 70, hits: hp, shots: hp + 2, t: hp + 6, acc: 0.8, dodge: 0.5 };
  const r = B.battleSubmit(g, T0 + 60, rep, F.combatOf(g)); ok(r.ok && r.kind === 'win' && Math.abs(g.cond - SZ.floor) < 1e-6, `砲戰贏了但損失 70%：船體 25% → ${g.cond.toFixed(1)}%（不低於 ${SZ.floor}%）`);
  const g2 = mkEnc(32, 6, 'serpent', 1.0, 100); const r2 = B.battleSubmit(g2, T0 + 60, { ...rep, id: 6, loss: -50 }, F.combatOf(g2)); ok(r2.ok && g2.cond <= 100 + 1e-9, '宣稱負的損失：船體不會被「補」超過 100%');
  const g3 = mkEnc(33, 7, 'kraken', 1.2, 100); g3.cond = 21; const rl = B.battleSubmit(g3, T0 + 60, { id: 7, won: false, loss: 99, hits: 0, shots: 0, t: 75, acc: 0, dodge: 0 }, F.combatOf(g3)); ok(rl.ok && g3.cond >= SZ.floor - 1e-9, `砲戰輸 / 超時走公式：船體 21% → ${g3.cond.toFixed(1)}%（不低於底線）`); }
{ // 砲戰輸 / 超時 → 公式（跟同一場的 manualBattle 完全一樣）
  const o = own('war_1'); let same = 0, n = 0; for (let i = 0; i < 20; i++) { const g = mkEnc(700 + i, i + 1, 'kraken', 1.3, 100); const oc = F.combatOf(g), rep = { id: i + 1, won: false, loss: 30, hits: 6, shots: 12, t: 75, acc: 0.5, dodge: 0.5 }; const m = B.manualBattle(g.seed, oc, B.foeStats(g.fleet.world.bt.cur), i + 1, rep); const r = B.battleSubmit(g, T0 + 60, rep, oc); n++; if (r.ok && r.kind === m.kind && !r.arena) same++; }
  ok(same === n, `砲戰沒打贏 / 超時 → 照公式結算（${same}/${n} 與 manualBattle 一致、不算砲戰勝利）`); }
{ // 戰報合理性：宣稱打贏但發數 / 命中 / 時間不合理 → 不算勝利（改走公式）
  const foe = B.foeStats({ k: 'kraken', lv: 1.2 }), o = own('ark_t0'), hp = B.arenaFoeHp(foe, o); const base = { id: 1, won: true, loss: 10, hits: hp, shots: hp + 3, t: hp + 10, acc: 0.8, dodge: 0.8 };
  ok(B.arenaWin(base, foe, o) !== null, `合理的勝利戰報被接受（敵人血量 ${hp}）`);
  const forged = [{ ...base, hits: 1, shots: 1 }, { ...base, t: 1 }, { ...base, t: 999 }, { ...base, shots: 3, hits: 3 }, { ...base, hits: base.shots + 5 }, { ...base, shots: 500 }, { ...base, won: 'true' }, { ...base, loss: NaN }, { ...base, hits: NaN }, null, 7, 'x'];
  ok(forged.every((r) => B.arenaWin(r, foe, o) === null), `偽造 / 亂報的勝利戰報（${forged.length} 種）都不算勝利`);
  const g = mkEnc(41, 1, 'kraken', 1.2); const fg = { ...base, hits: 1, shots: 1, id: 1 }; const r = B.battleSubmit(g, T0 + 60, fg, F.combatOf(g)); ok(r.ok && !r.arena, '亂報的勝利：照公式結算，不算砲戰勝利'); }
{ // 一場只能結算一次；戰報不能結算別場
  const foe = B.foeStats({ k: 'serpent', lv: 1 }), o = own('ark_t0'), hp = B.arenaFoeHp(foe, o); const win = (id) => ({ id, won: true, loss: 3, hits: hp, shots: hp + 2, t: hp + 6, acc: 0.8, dodge: 0.8 });
  const g = mkEnc(51, 9, 'serpent', 1.0); const r1 = B.battleSubmit(g, T0 + 60, win(9), F.combatOf(g)), snap = JSON.stringify(canon(g.fleet.world.bt)), res1 = JSON.stringify(g.res), cond1 = g.cond;
  const r2 = B.battleSubmit(g, T0 + 61, win(9), F.combatOf(g)), r3 = B.battleRetreat(g, T0 + 62, F.combatOf(g), 9), r4 = B.battleAuto(g, T0 + 63, F.combatOf(g)), r5 = B.battleEngage(g, T0 + 64);
  ok(r1.ok && r1.kind === 'win' && !r2.ok && !r3.ok && !r4.ok && !r5.ok && snap === JSON.stringify(canon(g.fleet.world.bt)) && res1 === JSON.stringify(g.res) && cond1 === g.cond, '同一場遭遇只能結算一次：再提交 / 撤退 / 交給船員 / 接管全被拒絕，存檔不變（不能重複領獎）');
  const st = g.fleet.world.bt.st.w; simulateTo(g, T0 + 3 * H); ok(g.fleet.world.bt.st.w >= st, '（結算後繼續模擬沒有把同一場再結算一次）');
  const h = mkEnc(52, 10, 'serpent', 1.0); const c0 = JSON.stringify(canon(h.fleet.world.bt.cur)), cond0 = h.cond;
  const bad = [win(9), win(11), win('10'), win(undefined), { ...win(10), id: 10.5 }, { ...win(10), id: [10] }].map((r) => B.battleSubmit(h, T0 + 60, r, F.combatOf(h)));
  ok(bad.every((r) => !r.ok) && JSON.stringify(canon(h.fleet.world.bt.cur)) === c0 && h.cond === cond0 && !h.fleet.world.bt.last, '戰報 id 不符（別的遭遇 / 字串 / 陣列 / 缺）：全部被拒絕，目前這場完全沒被動到');
  ok(!B.battleSubmit(h, T0 + 60, null, F.combatOf(h)).ok && !B.battleRetreat(h, T0 + 60, F.combatOf(h), 99).ok && !B.battleRetreat(h, T0 + 60, F.combatOf(h)).ok, '沒有戰報 / 撤退指令 id 不對 → 拒絕');
  const old = mkEnc(53, 12, 'serpent', 1.0); B.battleSubmit(old, T0 + 60, win(12), F.combatOf(old)); old.fleet.world.bt.cur = { ...mkEnc(54, 13, 'serpent', 1.0).fleet.world.bt.cur }; ok(!B.battleSubmit(old, T0 + 70, win(12), F.combatOf(old)).ok && B.curOf(old).id === 13, '已結算的舊戰報（id 12）不能拿去結算新的一場（id 13）'); }
{ // 撤退：機率逃脫（決定性、跟砲戰表現無關），失敗被追著打；底線仍在
  let fled = 0, caught = 0, same = 0; for (let i = 0; i < 80; i++) { const g = mkEnc(800 + i, i + 1, 'kraken', 1.3); const g2 = JSON.parse(JSON.stringify(g)); const oc = F.combatOf(g); const r = B.battleRetreat(g, T0 + 60, oc, i + 1), r2 = B.battleRetreat(g2, T0 + 60, oc, i + 1); if (r.kind === 'fled') fled++; else if (r.kind === 'caught') caught++; if (r.kind === r2.kind && strip(g) === strip(g2)) same++; if (g.cond < SZ.floor - 1e-9) fled = -999; }
  const p = B.fleeChance(own('ark_t0'), B.foeStats({ k: 'kraken', lv: 1.3 })); ok(fled > 0 && caught > 0 && same === 80 && Math.abs(fled / 80 - p) < 0.2, `撤退：${fled} 次逃掉 / ${caught} 次被追上（期望逃脫率 ${(p * 100) | 0}%），決定性，不低於底線`);
  const g = mkEnc(900, 3, 'pirate', 1.2); const r = B.battleRetreat(g, T0 + 60, F.combatOf(g), 3); ok(r.ok && g.fleet.world.bt.last.man === 1 && /撤退/.test(r.text) && !B.curOf(g), `撤退結果寫進戰報：${r.text}`); }
// 預覽 / 風險估計
{ const g = mkEnc(61, 1, 'kraken', 1.0); const oc = F.combatOf(g), foe = B.foeStats(B.curOf(g)); const pv = B.battlePreview(g, oc), ar = arenaRisk(oc, foe), ar2 = arenaRisk(oc, foe);
  ok(pv.lossAuto >= 0 && pv.lossAuto < pv.lossTake && pv.lossRetreat >= 0 && pv.flee > 0, `預覽：船員預期 −${pv.lossAuto.toFixed(0)}% < 公式硬拚 −${pv.lossTake.toFixed(0)}%；撤退預期 −${pv.lossRetreat.toFixed(0)}%、逃脫率 ${(pv.flee * 100) | 0}%`);
  ok(JSON.stringify(ar) === JSON.stringify(ar2) && ar.risky && ar.loss > 40 && ar.lossBest <= ar.loss + 1e-9, `初始方舟接管海妖：砲戰試打勝率 ${(ar.win * 100) | 0}%、預期船體 −${ar.lossBest.toFixed(0)}%～−${ar.loss.toFixed(0)}% → 要二次確認`);
  const g2 = mkEnc(62, 2, 'serpent', 1.0); const ar3 = arenaRisk(F.combatOf(g2), B.foeStats(B.curOf(g2))); ok(!ar3.risky, `初始方舟接管海蛇不用二次確認（勝率 ${(ar3.win * 100) | 0}%、損失 −${ar3.loss.toFixed(0)}%）`);
  const g3 = mkEnc(63, 3, 'kraken', 1.3); g3.fleet.flag = { branch: 'war', tier: 3, pj: null, up: null }; const ar4 = arenaRisk(F.combatOf(g3), B.foeStats(B.curOf(g3))); ok(!ar4.risky, `戰艦 T3 接管海妖不用二次確認（勝率 ${(ar4.win * 100) | 0}%、損失 −${ar4.loss.toFixed(0)}%）`); }
// 預設瞄準：沒點瞄準點也能開砲（手機）
{ const a = A.createArena(1, 1, B.foeStats({ k: 'serpent', lv: 1 }), own('war_1')); let sh = 0; for (let i = 0; i < 150; i++) { A.stepArena(a, { mx: 0, my: 0, aim: null, fire: true, ammo: 0 }); } sh = a.st.shots;
  const d = A.defaultAim(a); ok(sh >= 3 && d.y < a.p.y && Math.abs(d.x - a.p.x) < 1, `沒瞄準點按開砲：5 秒開了 ${sh} 砲，預設朝船頭正前方（敵人方向）`);
  const b = A.createArena(1, 1, B.foeStats({ k: 'serpent', lv: 1 }), own('war_1')); for (let i = 0; i < 30; i++) A.stepArena(b, { mx: 1, my: 0, aim: null, fire: false }); ok(A.defaultAim(b).y < b.p.y, '船往側面開時，預設瞄準仍朝敵人那一側（不會朝後 / 朝岸）'); }
// 存檔：cur.end 封頂、舊的 lv（日序）轉成秒、陣列 k 被擋
{ const raw = { n: 3, lv: 20000, cur: { id: 3, k: 'kraken', lv: 1, t0: 1000, end: 1e9, eng: 1 }, last: { text: 'x', k: 'kraken', r: 'win', id: 3 } }; const c = B.sanBt(raw); ok(c.cur.end === 1000 + B.BT.grace * B.BT.engCap, `存檔裡 cur.end 被封頂（${c.cur.end - 1000} 秒）：竄改也拉不長遭遇倒數`);
  ok(c.lv === 20001 * 86400 && B.sanBt({ lv: -99 }).lv === -99 && B.sanBt({ lv: 1.7e9 }).lv === 1.7e9 && c.last.id === 3, '舊存檔的 lv（第幾天）轉成秒；新格式（秒）原樣保留；last.id 保留');
  ok(B.sanBt({ cur: { id: 1, k: ['kraken'], t0: 1, end: 2, lv: 1 } }).cur === null && B.sanBt({ cur: { id: 1, k: { toString: () => 'kraken' }, t0: 1, end: 2, lv: 1 } }).cur === null && B.sanBt({ last: { text: 't', k: ['leviathan'] } }).last.k === 'serpent', 'cur.k / last.k 是陣列或物件 → 擋掉（不能繞過利維坦冷卻）'); }
// 利維坦冷卻：上次結算 + 3 天（用結算時間，不是日曆日）
{ const p = { x: SPECIAL_ZONES.hell.x, y: SPECIAL_ZONES.hell.y }, mkp = (n) => { let c = null; for (let sl = 1; sl < 4000 && !c; sl++) { const e = B.rollEncounter(n, sl, p, -99, 1, T0 + sl * 1800); if (e && e.k === 'leviathan') c = { sl, e }; } return c; };
  let early = 0, late = 0, tried = 0; for (let seed = 1; seed < 40; seed++) { const c = mkp(seed); if (!c) continue; tried++; const tEnd = T0 + c.sl * 1800; const t1 = B.rollEncounter(seed, c.sl, p, tEnd - 2.2 * D, 1, tEnd), t2 = B.rollEncounter(seed, c.sl, p, tEnd - 3.01 * D, 1, tEnd); if (t1 && t1.k === 'leviathan') early++; if (t2 && t2.k === 'leviathan') late++; }
  ok(tried > 5 && early === 0 && late === tried, `利維坦：上次結算後 2.2 天 → 不會出現（${early}/${tried}）；3.01 天 → 會（${late}/${tried}）`); }
// 遭遇頻率 / 離線損失
{ const rows = []; let okRate = true, worst = 0; for (const [nm, pos] of [['深淵', [1000, 1000]], ['西', [500, 600]], ['東南', [1400, 1400]], ['迷霧', [SPECIAL_ZONES.fog.x, SPECIAL_ZONES.fog.y]], ['地獄', [SPECIAL_ZONES.hell.x, SPECIAL_ZONES.hell.y]]]) { const r = measure(pos, [1, 2], null); rows.push(`${nm} ${r.enc.toFixed(2)}`); if (r.enc < 0.8 || r.enc > 2.2) okRate = false; if (nm !== '地獄' && nm !== '迷霧') worst = Math.max(worst, r.hullB); }
  ok(okRate, `遭遇頻率（每天，初始方舟離線）都在 1–2 場上下：${rows.join('、')}`); ok(worst <= 25, `離線閒置：一般海域戰鬥造成的船體損失最高 ${worst.toFixed(1)}%/天（≤ 25%；不含自然磨損）`); }

console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
