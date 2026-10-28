// 階段⑤ PvP 測試：node tools/pvp-test.mjs
import { newState, simulateTo, syncCrew } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import * as W from '../src/sim/world.js';
import * as P from '../src/sim/pvp.js';
import * as B from '../src/sim/battle.js';
import { resCap } from '../src/sim/promo.js';
import * as A from '../src/sim/arena.js';
import { SZ } from '../src/sim/szdata.js';
import { TICK, SAVE_VERSION } from '../src/sim/defs.js';
import { validateState, serialize, OWNER_UIDS } from '../src/save/cloud.js';
import { createMemoryPvp, PvpClient, ruleCheckRaid, ruleCheckPresence } from '../src/save/pvpnet.js';
import { playBot } from './arena-bot.mjs';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const T0 = 1_800_000_000, H = 3600; const ingest = (s, d, u, o, now) => P.pvIngest(s, d, u, o, now ?? (d && d.length ? Math.max(...d.map((x) => (x && x.t) || 0)) + 100 : T0 + 200 * H));  /* 預設「現在」= 最新那份的 t + 100 秒（第 14 輪：超過 48 小時的突襲會被丟掉） */ const crew = ['a', 'b', 'c'].map((k) => ({ key: k, cat: 'work' }));
const strip = (s) => { const c = JSON.parse(JSON.stringify(s)); delete c.lastSeen; return JSON.stringify(c); };
const feed = (s) => { for (const k of ['water']) s.res[k] = Math.max(s.res[k], 3000); };
const mk = (uid, pos, o = {}) => { const s = newState(o.seed || 901, T0, 480); syncCrew(s, crew); F.ensureFleet(s, !!o.owner); F.ensureWorld(s, uid); s.fleet.flagship = o.owner ? 'cruise' : s.fleet.flagship; s.res = { food: 400, water: 400, fuel: 300, parts: 200, ...(o.res || {}) }; s.created = T0 - 10 * 3600; s.fleet.world.pos = { ...pos }; s.fleet.world.route = null; s.cond = o.cond == null ? 100 : o.cond; W.reveal(s.fleet.world, pos.x, pos.y, 300); return s; };
const runTo = (s, t) => { while (s.simT < t) { feed(s); simulateTo(s, Math.min(t, s.simT + 40 * H)); } return s; };
const own = (s) => F.combatOf(s);
const UA = 'uidAttacker1', UD = 'uidDefender1', UE = 'uidEve3';
const POS = { x: 1000, y: 1000 };
const raidDoc = (att, def, t, loot, o = {}) => ({ v: 1, attacker: att, defender: def, b: P.bucketOf(t), t, ah: P.handleOf(att), loot, ap: { x: 1010, y: 1000 }, ...o });
const T1 = T0 + 2 * H;

// ---- 純函式 / 形狀
ok(P.handleOf('x') === P.handleOf('x') && /^船#[0-9A-F]{4}$/.test(P.handleOf('x')) && !/@/.test(P.handleOf('a@b.c')), '代號：決定性、匿名（不含 uid / email）');
ok(P.lootCap(10) === 60 && P.lootCap(1e9) === 630 && P.lootCap(NaN) === 30, 'lootCap 隨戰力、有絕對上限');
ok(P.PV.take === 0.08 && P.PV.dayCap === 0.2 && P.PV.shield === 12 * H && P.PV.hullFloor === 50 && P.PV.bucket === 12 * H && P.PV.window === 48 * H && P.PV.staleAfter === 7 * 86400 && P.PV.atkShare === 0.5 && P.PV.minClaim === 5 && P.PV.range <= P.PV.block, '常數：8% / 20% / 12h 護盾 / 船體 50% / 12h 桶 / 48h 視窗 / 7 天幽靈 / 50% 分成，射程 ≤ 搜尋格邊長');
ok(P.PV.lootKeys.join() === 'food,water,fuel,parts', '可掠奪的只有 4 種資源（沒有船 / 藍圖 / 材料）');
{ const nb = P.nearBlocks(1000, 1000); ok(nb.length === 9 && nb.includes('10_10') && nb.includes('9_9'), '搜尋格：3×3');
  const nb2 = P.nearBlocks(5, 1995); ok(nb2.length === 4, '地圖角落搜尋格不會超出邊界'); }
{ // 射程內的目標一定在 3×3 搜尋格裡
  let miss = 0; for (let i = 0; i < 400; i++) { const x = 100 + (i * 37) % 1800, y = 100 + (i * 91) % 1800, a = i * 0.7, d = P.PV.range * (0.2 + (i % 5) / 5 * 0.8); const bx = x + Math.cos(a) * d, by = y + Math.sin(a) * d; if (!P.nearBlocks(x, y).includes(P.blockOf(bx, by))) miss++; } ok(miss === 0, '射程內的船一定落在掃描範圍內（400 組）'); }

// ---- presence 快照
const D0 = () => mk(UD, POS, { res: { food: 400, water: 400, fuel: 300, parts: 200 } });
{ const d = D0(), now = T1; const pub = P.pubOf(d, UD, now, own(d), false);
  ok(pub && P.sanPub(pub) && pub.res.food === 400 && pub.cap === P.lootCap(pub.fp) && pub.sh === 0 && pub.cells.includes(P.blockOf(1000, 1000)), 'presence：形狀正確、含資源 / 上限 / 搜尋格');
  ok(!JSON.stringify(pub).includes('@') && !JSON.stringify(pub).includes(UD), 'presence：沒有 uid / email（只有匿名代號）');
  ok(P.pubOf(d, UD, now, own(d), true) === null && P.pubOf(d, null, now, own(d), false) === null, '船東 / 訪客（沒 uid）不公開 presence');
  const mv = mk(UD, POS); W.sailTo(mv, 1200, 1000, T1, 0); const pm = P.pubOf(mv, UD, T1 + 60, own(mv), false); ok(pm.rt && pm.cells.length >= 2, '航行中的船公開路線與經過的格子');
  const p1 = P.posOf(pm, pm.rt.t0 + (pm.rt.t1 - pm.rt.t0) / 2); ok(Math.abs(p1.x - 1100) < 2, '別人用路線推算位置（跟 arkPos 同公式）');
  ok(!P.sanPub({ ...pub, cells: [] }) && !P.sanPub({ ...pub, x: 'a' }) && !P.sanPub({ ...pub, cells: ['x'] }) && !P.sanPub(null), 'sanPub：壞資料被擋'); }

// ---- 攻擊資格
const pubAt = (t, o = {}) => { const d = D0(); const p = P.pubOf(d, UD, t, own(d), false); return { ...p, ...o }; };
{ const a = mk(UA, { x: 1030, y: 1000 }); const now = T1 + 3600;
  const can = (pub, uid = UD, self = UA, ow = false, s = a) => P.canRaid(s, pub, uid, self, now, ow);
  const off = pubAt(T1, { ls: T1 }); ok(can(off).ok, '離線超過 10 分鐘、在射程內 → 可以突襲');
  ok(can(pubAt(T1, { ls: now - 300 })).why === 'online', '對方 5 分鐘前還在線 → 不行');
  ok(can(pubAt(T1, { ls: now - 599 })).why === 'online' && can(pubAt(T1, { ls: now - 601 })).ok, '離線門檻剛好 10 分鐘');
  ok(can(pubAt(T1, { ls: T1, sh: now + 10 })).why === 'shield', '護盾中 → 不行');
  ok(can(pubAt(T1, { ls: T1, x: 1125, y: 1000, cells: ['11_10'] })).why === 'far', '超過 80 單位 → 不行');
  ok(can(pubAt(T1, { ls: T1, x: 1110, y: 1000 })).ok && can(pubAt(T1, { ls: T1, x: 1111, y: 1000 })).why === 'far', '射程剛好 80');
  { const a2 = mk(UA, { x: 1030, y: 1000 }); a2.fleet.world.fog = ''; ok(can(pubAt(T1, { ls: T1 }), UD, UA, false, a2).why === 'fog', '迷霧中看不到 / 打不到');
    const a3 = mk(UA, { x: 1030, y: 1000 }); a3.fleet.world.fog = ''; W.reveal(a3.fleet.world, 1000, 1000, 20); ok(can(pubAt(T1, { ls: T1, x: 1000, y: 1000 }), UD, UA, false, a3).ok, '目標所在格探索過就看得到（以目標所在格為準）'); }
  ok(can(off, UD, UD).why === 'self', '不能打自己'); ok(can(off, UD, UA, true).why === 'owner', '船東帳號不能出手'); ok(can(off, UD, null).why === 'guest', '訪客不能出手');
  ok(can(pubAt(T1, { ls: T1, res: { food: 20, water: 20, fuel: 10, parts: 10 } })).why === 'poor', '對方太窮（宣稱量太小）不值得');
  const c = P.claimOf(off); ok(c.food === 32 && c.water === 32 && c.fuel === 24 && c.parts === 16, `宣稱量 = 8% 庫存（${JSON.stringify(c)}）`);
  const rich = P.claimOf(pubAt(T1, { res: { food: 5000, water: 5000, fuel: 5000, parts: 5000 } })); ok(rich.food === off.cap, `宣稱量 ≤ lootCap（${rich.food}）`); }

// ---- 守衛艦 / 攻擊流程（用階段④的砲戰場）
{ const a = mk(UA, { x: 1030, y: 1000 }, { cond: 100 }); const o = own(a), now = (Math.floor(T1 / P.PV.bucket) + 1) * P.PV.bucket + 3600; const pub = pubAt(T1, { ls: T1 });
  const g = P.guardFoe(o, pub, '守衛艦 ' + pub.h); ok(g.id === 'pirate' && g.guard && g.hp > 0 && g.atk > 0 && g.lv >= 0.6 && g.lv <= 1.9, '守衛艦：用階段④的海盜數值（等級依對方戰力）');
  const weak = P.guardFoe(o, { ...pub, fp: 0.5 }), strong = P.guardFoe(o, { ...pub, fp: 500 }); ok(weak.lv < strong.lv && strong.lv === 1.9 && weak.lv === 0.6, '對方越強、守衛艦越強（有上下限）');
  const st = P.raidStart(a, pub, UD, UA, now, o, false); ok(st.ok && a.fleet.world.pv.att && st.claim.food === 32, '開始突襲：記下目標與宣稱量');
  const id = a.fleet.world.pv.att.id;
  // 偽造 / 錯誤報告
  const forged = (rep) => { const x = JSON.parse(JSON.stringify(a)); const r = P.raidSubmit(x, now + 40, rep, o, UA); return { x, r }; };
  { const { r } = forged({ id: 'other', won: true, t: 30, shots: 30, hits: 30, loss: 0 }); ok(!r.ok, '別場的戰報被忽略'); }
  { const { x, r } = forged({ id, won: true, t: 0.5, shots: 1, hits: 1, loss: 0 }); ok(r.ok && !r.win && x.res.food === a.res.food && x.fleet.world.pv.out.length === 0, '太快打贏（不合理）→ 沒有戰利品、沒有 raid 文件'); }
  { const { x, r } = forged({ id, won: true, t: 40, shots: 100, hits: 100, loss: 0 }); ok(!r.win && x.res.food === a.res.food, '射擊次數超過冷卻允許 → 無效'); }
  { const { x, r } = forged({ id, won: false, t: 75, shots: 60, hits: 5, loss: 18 }); ok(r.ok && !r.win && x.cond === 82 && x.res.food === a.res.food, '輸 / 時間到：沒有掠奪，船體 −18%'); ok(x.fleet.world.pv.cd > now, '輸了也要冷卻 15 分鐘'); }
  { const lo = JSON.parse(JSON.stringify(a)); lo.cond = 25; const r = P.raidSubmit(lo, now + 40, { id, won: false, t: 75, shots: 60, hits: 5, loss: 40 }, o, UA); ok(lo.cond === SZ.floor, `攻擊方船體停在 ${SZ.floor}%（沿用階段④的保底）`); const l2 = JSON.parse(JSON.stringify(a)); l2.cond = 12; P.raidSubmit(l2, now + 40, { id, won: false, t: 75, shots: 60, hits: 5, loss: 40 }, o, UA); ok(l2.cond === 12, '已低於 20% 不會被抬高'); }
  // 真的打一場
  const ar = A.createArena(7, 1, g, o); playBot(ar, 1, 3); const m = A.arenaMetrics(ar);
  if (ar.over === 'win') { const x = JSON.parse(JSON.stringify(a)); const r = P.raidSubmit(x, now + 60, { id, ...m }, o, UA);
    ok(r.ok && r.win && r.doc && x.res.food === a.res.food + 16 && r.doc.loot.food === 32 && r.doc.attacker === UA && r.doc.defender === UD, '機器人打贏守衛艦 → 攻擊者拿到宣稱量的 50%（16）、raid 文件記全額（32 = 防守者的損失）');
    ok(x.fleet.world.pv.out.length === 1 && x.fleet.world.pv.pb[UD] === P.bucketOf(now) && !x.fleet.world.pv.att, '文件進 outbox、記下已打過這個目標');
    ok(x.fleet.world.pv.cd > now + 800, '贏了也有冷卻'); ok(P.raidSubmit(x, now + 61, { id, ...m }, o, UA).ok === false, '同一場戰報不能重複領獎');
    ok(P.canRaid(x, pub, UD, UA, now + 4000, false).why === 'done', '同一目標 12 小時內只能打一次'); ok(P.canRaid(x, pub, UD, UA, now + 13 * H, false).why !== 'done' && P.canRaid(x, pub, UD, UA, now + 10 * H, false).why === 'done', '12 小時過後可以再打（同一桶內 10 小時還不行）');
    const full = JSON.parse(JSON.stringify(a)); full.res.food = P.PV ? 500 : 0; P.raidStart(full, pub, UD, UA, now, o, false); const rr = P.raidSubmit(full, now + 60, { id, ...m }, o, UA); ok(full.res.food <= 500, '自己的倉庫上限照樣有效（不會爆倉）');
  } else ok(false, `機器人沒打贏守衛艦（${ar.over}）`);
  const stale = JSON.parse(JSON.stringify(a)); ok(!P.raidSubmit(stale, now + 400, { id, ...m }, o, UA).ok, '超過 150 秒的戰報作廢');
  const b2 = mk(UA, { x: 1030, y: 1000 }); P.raidStart(b2, pub, UD, UA, now, own(b2), false); ok(P.canRaid(b2, pub, 'uidOther2', UA, now + 5, false).why === 'busy' && P.canRaid(b2, pub, UD, UA, now + 5, false).ok, '有一場進行中時不能同時開另一場（同一個目標可以重來）'); }

// ---- 第 14 輪預設值：隱私取整 / 48 小時視窗 / 12 小時桶 / 50% 分成 / 小額不扣船體 / 隱身 / 幽靈船
{ const d = mk(UD, POS, { res: { food: 437, water: 1999, fuel: 3, parts: 0 } }); d.fleet.world.pos = { x: 1004, y: 996 }; const now = T1 + 123;
  const p = P.pubOf(d, UD, now, own(d), false); const st = (k) => Math.max(1, Math.round(0.05 * resCap(d, k)));
  ok(P.roundPos(1004) === 1000 && P.roundPos(1005) === 1010 && P.roundPos(-3) === 0 && P.roundPos(99999) === 2000, '隱私：位置取整到 10 單位（夾在地圖內）');
  ok(p.x % 10 === 0 && p.y % 10 === 0 && p.ls % 600 === 0 && p.ls >= now && p.ls - now < 600 && p.t === now, '隱私：x / y 是 10 的倍數、ls 進位到 10 分鐘（不會比實際更早 → 不會讓人提早出手）');
  ok(!['hl', 'cd', 'ut', 'uid', 'email'].some((k) => k in p) && !JSON.stringify(p).includes(UD), 'presence 沒有 hl / cd / ut / uid / email');
  ok(P.PV.lootKeys.every((k) => p.res[k] % st(k) === 0 && p.res[k] <= d.res[k] && d.res[k] - p.res[k] < st(k) || p.res[k] === 2000), `隱私：資源取整到儲存上限的 5%（捨去，公開值永遠 ≤ 真實值）：${JSON.stringify(p.res)}`);
  const mv = mk(UD, POS); W.sailTo(mv, 1203, 1007, T1, 0); const pm = P.pubOf(mv, UD, T1 + 60, own(mv), false); ok(pm.rt && [pm.rt.x0, pm.rt.y0, pm.rt.x1, pm.rt.y1].every((v) => v % 10 === 0), '隱私：航線端點也取整到 10');
  ok(!P.pubChanged(p, { ...p, x: p.x + 0 }) && P.pubChanged(p, { ...p, x: p.x + 10 }) && P.pubChanged(p, { ...p, res: { ...p.res, food: p.res.food + 5 } }), 'pubChanged：取整後的值改變才重新發布');
  ok(P.gainOf({ food: 33, water: 1, fuel: 24, parts: 0 }).food === 16 && !('water' in P.gainOf({ water: 1 })) && P.gainOf({ fuel: 24 }).fuel === 12, '攻擊者分成 = 宣稱量的 50%（無條件捨去）');
  const hs = mk(UD, POS); P.ensurePv(hs).hid = 1; ok(P.pubOf(hs, UD, now, own(hs), false) === null, '隱身中：pubOf 回傳 null（什麼都不公開）');
  const at = mk(UA, { x: 1030, y: 1000 }); const off = pubAt(T1, { ls: T1 }); const nowA = T1 + 3600; P.ensurePv(at).hid = 1;
  ok(P.canRaid(at, off, UD, UA, nowA, false).why === 'hidden', '隱身中不能出手（規則要求攻擊者自己有 presence）'); P.ensurePv(at).hid = 0;
  ok(P.canRaid(at, pubAt(T1, { ls: nowA - 7 * 86400 + 60 }), UD, UA, nowA, false).ok && P.canRaid(at, pubAt(T1, { ls: nowA - 7 * 86400 - 60 }), UD, UA, nowA, false).why === 'stale', '超過 7 天沒上線的幽靈船不能出手（7 天內可以）'); }
{ // 小額：總損失 < minClaim → 東西照扣、不扣船體、不啟動護盾；≥ 5 → 照舊
  const run = (claim) => { const d = mk(UD, POS, { cond: 100 }); d.res = { food: 400, water: 400, fuel: 300, parts: 200 }; d.simT = T0; d.lastSeen = T0; ingest(d, [raidDoc(UA, UD, T0 + 100, claim)], UD, false); P.pvTick(d, T0 + 160, null, () => 0); return d; };
  const sm = run({ food: 2, water: 2 }), e1 = sm.fleet.world.pv.log[0]; ok(e1.why === 'small' && e1.hull === 0 && sm.cond === 100 && sm.fleet.world.pv.sh === 0 && sm.res.food === 398 && sm.res.water === 398 && sm.fleet.world.pv.st.hit === 1, '小額（總共 4 < 5）：東西照扣，但不扣船體、不啟動護盾');
  ok(/船體沒有受損/.test(P.raidText(e1)) && !/12 小時護盾。/.test(P.raidText(e1)), '小額的戰報文字說明沒有受損、沒有護盾');
  const bg = run({ food: 3, water: 2 }); ok(bg.fleet.world.pv.log[0].why !== 'small' && bg.cond < 100 && bg.fleet.world.pv.sh === T0 + 100 + P.PV.shield, '剛好 5（= minClaim）：照舊扣船體、啟動護盾');
  const d = mk(UD, POS); d.res = { food: 400, water: 400, fuel: 300, parts: 200 }; d.simT = T0; ingest(d, [raidDoc(UA, UD, T0 + 100, { food: 2 }), raidDoc(UE, UD, T0 + 200, { food: 30 })], UD, false); P.pvTick(d, T0 + 300, null, () => 0);
  ok(d.fleet.world.pv.log[0].why === 'small' && d.fleet.world.pv.log[1].why !== 'shield' && d.fleet.world.pv.st.hit === 2, '小額沒有觸發護盾 → 緊接著的正常突襲照樣結算'); }
{ // 48 小時視窗
  const NOW = T0 + 100 * H, d = mk(UD, POS); const old = raidDoc(UA, UD, NOW - 48 * H - 1, { food: 30 }), edge = raidDoc(UE, UD, NOW - 48 * H, { food: 30 }), nw = raidDoc('n1', UD, NOW - H, { food: 30 });
  ok(P.pvIngest(d, [old, edge, nw], UD, false, NOW) === 2 && d.fleet.world.pv.in.every((r) => r.t >= NOW - 48 * H), '收件匣：t 超過 48 小時的文件不收（剛好 48 小時內的收）');
  const e = mk(UD, POS); e.res = { food: 400, water: 400, fuel: 300, parts: 200 }; const pv = P.ensurePv(e); pv.in.push({ id: 'o1', t: T0 + 100, from: '船#0001', claim: { food: 30 } }); e.simT = T0; const r0 = e.res.food;
  P.pvTick(e, T0 + 100 + 48 * H + 60, null, () => 0); ok(pv.log[0].why === 'old' && e.res.food === r0 && e.cond === 100 && pv.sh === 0 && pv.st.vd === 1 && /48 小時/.test(P.raidText(pv.log[0])), '結算：超過 48 小時的突襲作廢（沒有損失、沒有護盾）');
  const f = mk(UD, POS); f.res = { food: 400, water: 400, fuel: 300, parts: 200 }; P.ensurePv(f).in.push({ id: 'o2', t: T0 + 100, from: '船#0001', claim: { food: 30 } }); P.pvTick(f, T0 + 100 + 48 * H, null, () => 0); ok(f.fleet.world.pv.log[0].why !== 'old' && f.res.food < 400, '剛好 48 小時：照常結算'); }

// ---- 防守方：決定性離線結算
const withInbox = (s, docs) => { ingest(s, docs, UD, false); return s; };
{ const mkD = () => mk(UD, POS, { res: { food: 400, water: 400, fuel: 300, parts: 200 } });
  const raids = [raidDoc(UA, UD, T0 + 3 * H, { food: 32, water: 32, fuel: 24, parts: 16 }), raidDoc(UE, UD, T0 + 20 * H, { food: 32, water: 32 })];
  const a = withInbox(mkD(), raids), b = withInbox(mkD(), raids), c = withInbox(mkD(), raids);
  ok(a.fleet.world.pv.in.length === 2 && a.fleet.world.pv.in[0].from === P.handleOf(UA), '收件匣：2 份，依時間排序，來源是匿名代號');
  const tEnd = T0 + 30 * H; simulateTo(a, tEnd); runTo(b, tEnd); for (let t = T0 + 600; t <= tEnd; t += 2 * H) { feed(c); simulateTo(c, t); } simulateTo(c, tEnd);
  ok(a.fleet.world.pv.st.hit === 2 && a.fleet.world.pv.st.vd === 0, '兩次突襲相隔 17 小時（護盾 12 小時已過）→ 兩次都結算');
  ok(strip(a) === strip(b), '一次補算 = 每 40 小時分段補算（完全相同的存檔）');
  { const d = mkD(), e = mkD(); withInbox(d, raids); withInbox(e, raids); let t = d.simT; while (t < tEnd) { t = Math.min(tEnd, t + TICK); simulateTo(d, t); } simulateTo(e, tEnd); ok(strip(d) === strip(e), '逐 tick（每 60 秒）推進 = 一次補算'); }
  ok(a.fleet.world.pv.log.length === 2 && a.log.filter((e) => e.type === 'raid').length === 2, '被襲紀錄：pv.log + 事件 log（歡迎回來報告會顯示）');
  ok(/突襲了你的方舟/.test(a.log.find((e) => e.type === 'raid').text) && /12 小時護盾/.test(a.log.find((e) => e.type === 'raid').text), '紀錄文字有說明損失與護盾'); }
{ // 8% / lootCap
  const d = mk(UD, POS, { res: { food: 400, water: 400, fuel: 300, parts: 200 } }); ingest(d, [raidDoc(UA, UD, T0 + H, { food: 400, water: 1, fuel: 300, parts: 200 })], UD, false);
  simulateTo(d, T0 + 2 * H); const e = d.fleet.world.pv.log[0];
  ok(e.res.food <= Math.floor(0.08 * 400) + 0 && e.res.food >= 1, `偽造的超大宣稱量被壓到 8% 庫存（food −${e.res.food}）`); ok(e.res.fuel <= Math.floor(0.08 * 300) && e.res.parts <= Math.floor(0.08 * 200), '燃料 / 零件也是 8%');
  ok(e.why === 'cap', '標記「受上限保護」'); }
{ // 單次損失 = min(8% 庫存, lootCap)
  const big = mk(UD, POS); big.res = { food: 500, water: 500, fuel: 400, parts: 400 }; const fp = own(big).fp; const cp = P.lootCap(fp); ingest(big, [raidDoc(UA, UD, T0 + H, { food: 500 })], UD, false); simulateTo(big, T0 + 2 * H);
  const lost = big.fleet.world.pv.log[0].res.food; ok(lost <= 40 && lost >= 36 && lost <= cp, `單次損失 ≈ 8% 庫存（${lost}，庫存 500 在 1 小時內會因消耗略減）`);
  { const z = mk(UD, POS); z.res = { food: 500, water: 500, fuel: 400, parts: 400 }; z.simT = T0 + H; ingest(z, [raidDoc(UA, UD, T0 + H, { food: 500 })], UD, false); P.pvTick(z, T0 + H + 60, null, () => 0); ok(z.fleet.world.pv.log[0].res.food === 30 && z.res.food === 470, 'lootCap 比 8% 小時以 lootCap 為準（fp=0 → 30）'); } }
{ // 每日 20% 上限 + 護盾
  const d = mk(UD, POS, { res: { food: 400, water: 400, fuel: 300, parts: 200 } }); d.fleet.world.pv = P.emptyPv(); d.fleet.world.pv.sh = 0;
  const day = Math.floor((T0 + 24 * H) / 86400) * 86400 + 600; // 某 UTC 日的 00:10
  d.simT = day - 600; d.lastSeen = d.simT; const ids = []; for (let i = 0; i < 6; i++) ids.push(raidDoc('att' + i, UD, day + i * 13 * H / 6 * 0 + i * 3500, { food: 32, water: 32, fuel: 24, parts: 16 }));
  ingest(d, ids, UD, false); simulateTo(d, day + 8 * H); const pv = d.fleet.world.pv;
  ok(pv.st.hit === 1 && pv.st.vd === 5, `同一天內的連續突襲只有第一次成功，其餘被護盾擋下（hit ${pv.st.hit} / 擋 ${pv.st.vd}）`);
  // 護盾過後、同一個 UTC 日再被襲：總損失 ≤ 20% 當天基準
  const d2 = mk(UD, POS, { res: { food: 400, water: 400, fuel: 300, parts: 200 } }); const bigs = []; const dayStart = Math.floor((T0 + 48 * H) / 86400) * 86400; d2.simT = dayStart - 60; d2.lastSeen = d2.simT;
  for (let i = 0; i < 2; i++) bigs.push(raidDoc('bb' + i, UD, dayStart + 10 * 60 + i * 13 * H / 1, { food: 400, water: 400, fuel: 300, parts: 200 }));   // 第二次在 13 小時後（護盾已過）
  ingest(d2, bigs, UD, false); const base = d2.res.food; simulateTo(d2, dayStart + 20 * H); const p2 = d2.fleet.world.pv;
  ok(p2.st.hit === 2 && Math.floor(0.2 * p2.dy.base.food) >= p2.dy.lost.food, `當天累計損失 ≤ 當天基準 20%（${p2.dy.lost.food} ≤ ${Math.floor(0.2 * p2.dy.base.food)}）`); }
{ // 每日上限會擋下超過的部分：把基準壓小
  const d = mk(UD, POS, { res: { food: 100, water: 100, fuel: 100, parts: 100 } }); const dayStart = Math.floor((T0 + 72 * H) / 86400) * 86400; d.simT = dayStart - 60; d.lastSeen = d.simT; d.fleet.world.pv = P.emptyPv();
  d.fleet.world.pv.dy = { d: Math.floor(dayStart / 86400), base: { food: 100, water: 100, fuel: 100, parts: 100 }, lost: { food: 19, water: 0, fuel: 0, parts: 0 } };
  ingest(d, [raidDoc(UA, UD, dayStart + 600, { food: 8, water: 8 })], UD, false); simulateTo(d, dayStart + 2 * H); const e = d.fleet.world.pv.log[0]; ok(e.res.food === 1 && e.res.water === 8 || e.res.food === 1, `當日額度只剩 1 → food 最多再掉 1（掉了 ${e.res.food}）`); }
{ // 護盾：被襲後 12 小時內的第二份被擋、之後正常
  const d = mk(UD, POS); ingest(d, [raidDoc(UA, UD, T0 + H, { food: 30 }), raidDoc(UE, UD, T0 + 5 * H, { food: 30 }), raidDoc('late', UD, T0 + 14 * H, { food: 30 })], UD, false); simulateTo(d, T0 + 20 * H); const l = d.fleet.world.pv.log;
  ok(l.length === 3 && !l[0].why.includes('shield') && l[1].why === 'shield' && Object.keys(l[1].res).length === 0 && l[2].why !== 'shield', '12 小時護盾：第二份無效、第三份（13 小時後）有效'); ok(d.fleet.world.pv.sh === T0 + 14 * H + P.PV.shield, '護盾時間 = 最後一次成功被襲 + 12h'); }
{ // 船體：最多到 50%、不抬高
  const mkc = (c) => { const d = mk(UD, POS, { cond: c }); ingest(d, [raidDoc(UA, UD, T0 + 5 * 60, { food: 30 })], UD, false); return d; };
  const run1 = (d) => { d.simT = T0; d.lastSeen = T0; simulateTo(d, T0 + 60 * 8); return d.cond; };
  const r100 = mkc(100); const r = run1(r100); ok(r < 100 && r >= 93.5, `船體 100% → ${r.toFixed(1)}%（扣 2–6%）`);
  { const d = mkc(52); run1(d); ok(d.fleet.world.pv.log[0].hull <= 2.01 && d.fleet.world.pv.log[0].hull > 0, `船體 52% 這次最多只扣到 50%（記錄扣了 ${d.fleet.world.pv.log[0].hull}%）`); }
  { const d = mkc(40); run1(d); ok(d.fleet.world.pv.log[0].hull === 0 && d.fleet.world.pv.st.hit === 1, '船體已低於 50%（40%）：被襲照樣被搶，但船體不再受損'); }
  const d15 = mkc(15); const h15 = run1(d15); ok(h15 <= 15 && h15 >= 14, `船體 15%（< 20% 保底）不會被抬高（${h15.toFixed(2)}）`); ok(d15.fleet.world.pv.log[0].hull === 0, '低於 50% 時 hull 損失記為 0'); }
{ // 沒收到任何突襲 = 完全不影響既有結算（階段④ 以前的存檔）
  const a = mk(UD, POS, { seed: 5 }), b = mk(UD, POS, { seed: 5 }); b.fleet.world.pv = P.emptyPv(); runTo(a, T0 + 30 * H); runTo(b, T0 + 30 * H); const sb = JSON.parse(strip(b)); delete sb.fleet.world.pv; ok(strip(a) === JSON.stringify(sb), '沒有突襲時，有 / 沒有 pv 欄位結果完全一樣（stage 1–4 行為不變）'); }

// ---- 收件匣去重 / 驗證
{ const d = mk(UD, POS); const doc = raidDoc(UA, UD, T0 + H, { food: 10 }); ok(ingest(d, [doc, doc, raidDoc(UA, UE, T0 + H, { food: 10 }), raidDoc(UD, UD, T0 + H, { food: 10 }), { x: 1 }, null], UD, false) === 1, '收件匣：重複 / 不是給我 / 打自己 / 壞資料 → 只收 1 份');
  simulateTo(d, T0 + 2 * H); ok(ingest(d, [doc], UD, false) === 0, '已結算過的文件（seen）再抓到也不會重複結算');
  ok(ingest(mk(UD, POS), [doc], UD, true) === 0 && ingest(mk(UD, POS), [doc], null, false) === 0, '船東 / 訪客的存檔不收突襲');
  const many = Array.from({ length: 100 }, (_, i) => raidDoc('a' + i, UD, T0 + i, { food: 1 })); const e = mk(UD, POS); ingest(e, many, UD, false); ok(e.fleet.world.pv.in.length <= P.PV.inMax, `收件匣上限 ${P.PV.inMax}`); }

// ---- sanPv 惡意輸入 / 存檔往返
{ const evil = { in: [{ id: '../x', t: 1 }, { id: 'ok', t: 5, from: '<img onerror=1>', claim: { food: 1e9, gold: 5, water: -3 } }, null, { id: 'ok2', t: NaN }], seen: [1, 'a', '../b', 'c'], hw: -5, sh: 'x', dy: { d: 'a', base: { food: 1e12 }, lost: [] }, log: [{ t: 3, from: '<b>', res: { food: 9e9 }, hull: 1e9, why: '<x>' }, 3], st: { hit: -1, lost: 1e12, zzz: 1 }, att: { id: 'x'.repeat(500), tgt: '../a', t0: 1, b: 1 }, cd: Infinity, pb: { '../x': 1, good: 5, bad: 'x' }, out: [{ attacker: 'a', defender: 'a', t: 1, b: 1 }, raidDoc('a1', 'd1', 100, { food: 9e9, gold: 4 })] };
  const c = P.sanPv(evil); ok(c.in.length === 1 && c.in[0].id === 'ok' && !/[<>]/.test(c.in[0].from) && c.in[0].claim.food <= 400 && !('gold' in c.in[0].claim) && !('water' in c.in[0].claim), 'sanPv：收件匣壞項被丟掉、字串清乾淨、宣稱量夾住');
  ok(c.seen.join() === 'a,c' && c.hw === 0 && c.sh === 0 && c.cd === 0 && c.att === null, 'sanPv：seen / hw / sh / cd / att 壞值歸零'); ok(c.dy.d === -1 && c.dy.base.food <= 1e4 && c.log.length === 1 && c.log[0].res.food <= 400 && c.log[0].hull <= 100 && c.log[0].why === '', 'sanPv：dy / log 夾值');
  ok(c.st.hit === 0 && c.st.lost <= 1e8 && !('zzz' in c.st) && Object.keys(c.pb).join() === 'good' && c.out.length === 1 && c.out[0].loot.food <= 400, 'sanPv：統計 / pb / out 夾值');
  ok(P.sanPv(null) === null && P.sanPv([]) === null && P.sanPv('x') === null, 'sanPv：非物件 → null'); const big = { in: Array.from({ length: 999 }, (_, i) => ({ id: 'i' + i, t: i })), log: Array.from({ length: 999 }, (_, i) => ({ t: i })), seen: Array.from({ length: 999 }, (_, i) => 's' + i) }; const cb = P.sanPv(big); ok(cb.in.length <= P.PV.inMax && cb.log.length <= P.PV.logMax && cb.seen.length <= P.PV.seenMax, 'sanPv：陣列長度有上限'); }
{ const d = mk(UD, POS); ingest(d, [raidDoc(UA, UD, T0 + 3 * H, { food: 32 })], UD, false); simulateTo(d, T0 + 1 * H); d.fleet = F.sanitizeFleet(d.fleet);
  const j = serialize(d); ok(SAVE_VERSION === 1, 'SAVE_VERSION 仍是 1'); const back = validateState(JSON.parse(j.data || j)); ok(back && back.fleet.world.pv && back.fleet.world.pv.in.length === 1, '存檔往返：pv 欄位保留（雲端存檔驗證通過）');
  const oldSave = mk(UD, POS); delete oldSave.fleet.world.pv; const ob = validateState(JSON.parse(serialize(oldSave).data || serialize(oldSave))); ok(ob && !ob.fleet.world.pv, '舊存檔（沒有 pv）照常載入、不會憑空多出 pv'); }

// ---- 審查修正 ⑥：未來時間的文件一律丟掉（否則 24 份未來文件能永遠塞滿收件匣）
{ const NOW = T0 + 10 * H; const fut = Array.from({ length: 30 }, (_, i) => raidDoc('fut' + i, UD, NOW + 1000 + i * 600, { food: 3 }));
  const d = mk(UD, POS); ok(P.pvIngest(d, fut, UD, false, NOW) === 0 && d.fleet.world.pv.in.length === 0 && d.fleet.world.pv.hw === 0, '未來時間（> 現在 + 300 秒）的 30 份文件：全部丟掉，收件匣與高水位都不動');
  const good = raidDoc(UA, UD, NOW - H, { food: 3 }); ok(P.pvIngest(d, [...fut, good], UD, false, NOW) === 1 && d.fleet.world.pv.in.length === 1, '混著合法文件時，只收合法的那份（收件匣不會被塞滿）');
  const e = mk(UD, POS); ok(P.pvIngest(e, [raidDoc('edge1', UD, NOW + 300, { food: 3 })], UD, false, NOW) === 1, '剛好 now + 300 秒（時鐘誤差內）→ 收');
  ok(P.pvIngest(e, [raidDoc('edge2', UD, NOW + 301, { food: 3 })], UD, false, NOW) === 0, 'now + 301 秒 → 丟掉');
  ok(P.pvIngest(mk(UD, POS), [good], UD, false) === 0 && P.pvIngest(mk(UD, POS), [good], UD, false, NaN) === 0, '沒給 now（或不是數字）→ 一律不收（不會因為忘了傳參數而繞過檢查）');
  // 過了一陣子之後，原本「未來」的文件變成合法 → 之後的輪詢還是收得到（高水位沒被污染）
  P.pvIngest(d, fut, UD, false, NOW + 30 * H); ok(d.fleet.world.pv.in.length === P.PV.inMax, '時間到了以後，之前被丟掉的文件會被收進來（沒有永久污染）'); }
// ---- 審查修正 ⑦：12 小時桶以「送出」當下計算（跨桶不會被規則擋）
{ const B = (P.bucketOf(T0 + 30 * H) + 1) * P.PV.bucket; const a = mk(UA, { x: 1030, y: 1000 }); const o = own(a); const pubD = P.pubOf(mk(UD, POS), UD, B - 4 * H, own(mk(UD, POS)), false); pubD.ls = B - 3 * H; pubD.t = B - 3 * H;
  const st = P.raidStart(a, pubD, UD, UA, B - 30, o, false); ok(st.ok, '跨桶測試：在桶邊界前 30 秒開打'); const id = a.fleet.world.pv.att.id;
  const g = P.guardFoe(o, pubD, '守衛艦'); const ar = A.createArena(9, 1, g, o); playBot(ar, 1, 2); const m = A.arenaMetrics(ar);
  const r = P.raidSubmit(a, B + 20, { id, ...m }, o, UA);
  if (r.win) { ok(r.doc.b === P.bucketOf(B + 20) && r.doc.b === P.bucketOf(r.doc.t) && r.doc.b !== P.bucketOf(B - 30), `送出時才算桶：開打在桶 ${P.bucketOf(B - 30)}、送出在桶 ${P.bucketOf(B + 20)} → 文件 b = ${r.doc.b} 且 = floor(t/43200)`);
    ok(a.fleet.world.pv.pb[UD] === r.doc.b, '本機「這個桶已打過」記錄也用送出的桶（與文件一致）');
    const att = P.pubOf(a, UA, B + 20, o, false), def = { ...pubD, ls: B - 3 * H, sh: 0 };
    ok(ruleCheckRaid({ auth: UA, def: UD, id: `${UA}_${r.doc.b}`, doc: r.doc, pres: def, att, nowSec: B + 20, isOwnerUid: false }) === '', '規則（JS 鏡像）：跨桶的文件通過');
    ok(ruleCheckRaid({ auth: UA, def: UD, id: `${UA}_${P.bucketOf(B - 30)}`, doc: { ...r.doc, b: P.bucketOf(B - 30) }, pres: def, att, nowSec: B + 20, isOwnerUid: false }) === 'bad-bucket', '（對照）舊做法：用開打時的桶 → 被規則擋（修正前會發生的事）');
    ok(a.fleet.world.pv.out.length === 1 && a.fleet.world.pv.out[0].b === r.doc.b, 'outbox 裡的文件也是新的桶'); } else ok(false, '跨桶測試：機器人沒打贏'); }
// ---- 規則鏡像：與 firestore.pvp.rules 同步的界線（模擬器測試是真正的依據；這裡確認鏡像沒有漂移）
{ const NOW = T0 + 10 * H, OWN2 = P.pubOf(mk(UD, POS, { res: { food: 400, water: 400, fuel: 300, parts: 200 } }), UD, NOW, own(mk(UD, POS)), false); const pc = (doc, prev) => ruleCheckPresence({ auth: UD, uid: UD, doc: { ut: NOW, ...doc }, nowSec: NOW, isOwnerUid: false, prev });   // ut = 伺服器時間（客戶端寫 serverTimestamp()）
  ok(pc(OWN2, null) === '', '鏡像：第一次建立（沒有舊文件）→ 通過'); ok(pc(OWN2, { ut: NOW - 5 }) === 'too-frequent' && pc(OWN2, { ut: NOW - 10 }) === '', '鏡像：更新要距離上次 ≥ 10 秒（比的是上次的 ut；create 不受影響）');
  ok(pc({ ...OWN2, t: NOW - 100 }, { ut: NOW, t: NOW }) === 'too-frequent' && pc({ ...OWN2, t: NOW - 100 }, { ut: NOW - 3, t: NOW - 5000 }) === 'too-frequent' && pc(OWN2, { ut: NOW - 60, t: NOW }) === '', '鏡像（第 14 輪必修）：緊接著寫第二次、把 t 改成 now − 100 也擋得住；只看 ut，不看 t');
  ok(pc({ ...OWN2, ut: NOW - 100 }) === 'bad-ut' && pc({ ...OWN2, ut: undefined }) === 'bad-ut' && pc({ ...OWN2, ut: 'now' }) === 'bad-ut' && pc({ ...OWN2, ut: NOW + 1 }) === 'bad-ut', '鏡像：ut 一定要 == 伺服器時間（舊值 / 缺少 / 字串 / 未來 → 拒絕）');
  ok(pc({ ...OWN2, h: 'x'.repeat(100000) }) === 'bad-handle' && pc({ ...OWN2, junk: 'x'.repeat(100000) }) === 'bad-keys' && pc({ ...OWN2, cells: ['x'.repeat(100000)] }) === 'bad-cells' && pc({ ...OWN2, cells: Array(17).fill('1_1') }) === 'bad-cells', '鏡像：大字串 / 多餘欄位 / cells 太長 → 拒絕');
  ok(pc({ ...OWN2, sh: NOW + 13 * H }) === 'bad-shield' && pc({ ...OWN2, sh: 1e11 }) === 'bad-shield' && pc({ ...OWN2, sh: NOW + 12 * H }) === '', '鏡像：護盾最多再 12 小時，永久護盾 → 拒絕');
  ok(pc({ ...OWN2, hl: 400 }) === 'bad-keys' && pc({ ...OWN2, cd: 10 }) === 'bad-keys' && pc({ ...OWN2, ls: NOW + 601 }) === 'bad-ls' && pc({ ...OWN2, ls: NOW + 600 }) === '' && pc({ ...OWN2, ls: NOW - 90000 }) === 'bad-ls' && pc({ ...OWN2, t: NOW + 1000 }) === 'bad-time', '鏡像：hl / cd 已移除（多餘欄位）、ls ≤ t + 600（10 分鐘進位）、t 的界線');
  ok(!('hl' in OWN2) && !('cd' in OWN2) && !('ut' in OWN2), 'pubOf 不再含 hl / cd，也不含 ut（ut 由伺服器寫）');
  ok(pc({ ...OWN2, rt: 'x'.repeat(100000) }) === 'bad-route' && pc({ ...OWN2, rt: { x0: 1, y0: 1, x1: 2, y1: 2, t0: NOW, t1: NOW + 600 } }) === '' && pc({ ...OWN2, rt: { x0: 1, y0: 1, x1: 2, y1: 2, t0: NOW, t1: NOW - 1 } }) === 'bad-route', '鏡像：rt 要是 6 個欄位的 map、t1 ≥ t0');
  const dp = { ...OWN2, ls: NOW - 2 * H, sh: 0, res: { food: 2000, water: 2000, fuel: 2000, parts: 2000 }, cap: 500, x: 1000, y: 1000 }, ap = { ...dp, x: 1030, y: 1000, ls: NOW, t: NOW };
  const rc = (loot, o = {}) => ruleCheckRaid({ auth: UA, def: UD, id: `${UA}_${P.bucketOf(NOW)}`, doc: { v: 1, attacker: UA, defender: UD, b: P.bucketOf(NOW), t: NOW, ah: 'A', loot, ap: { x: 1010, y: 1000 }, ...(o.doc || {}) }, pres: o.pres || dp, att: 'att' in o ? o.att : ap, nowSec: NOW, isOwnerUid: false });
  ok(rc({ food: 100, water: 100, fuel: 100, parts: 100 }) === '', '鏡像：四種資源各 ≤ 8% → 通過');
  ok(rc({ food: 10 }, { pres: { ...dp, ls: NOW - 6 * 86400 } }) === '' && rc({ food: 10 }, { pres: { ...dp, ls: NOW - 8 * 86400 } }) === 'target-stale', '鏡像：防守者 ls 超過 7 天（幽靈船）→ 拒絕；6 天 → 通過');
  ok(P.bucketOf(NOW) === Math.floor(NOW / 43200) && rc({ food: 10 }, { doc: { b: Math.floor(NOW / 21600) } }) === 'bad-bucket', '鏡像：桶 = floor(t / 43200)（12 小時）；舊的 6 小時算法 → 拒絕');
  ok(['water', 'fuel', 'parts'].every((k) => rc({ food: 1, [k]: 161 }) === 'loot-too-big') && rc({ food: 161 }) === 'loot-too-big', '鏡像：water / fuel / parts 也檢查 8%（不只 food）');
  ok(rc({ parts: 401 }, { pres: { ...dp, cap: 1000 } }) === 'bad-loot' && rc({ food: 1.5 }) === 'bad-loot' && rc({ food: -1 }) === 'bad-loot', '鏡像：單項 > 400 → 拒絕');
  ok(rc({ food: 10 }, { doc: { ah: 'x'.repeat(13) } }) === 'bad-ah' && rc({ food: 10 }, { doc: { v: 2 } }) === 'bad-version' && rc({ food: 10 }, { doc: { ap: { x: 1010, y: 1000, z: 1 } } }) === 'bad-ap' && rc({ food: 10 }, { doc: { ap: { x: '1', y: 1 } } }) === 'bad-ap', '鏡像：v / ah ≤ 12 / ap 只能是數字 x、y');
  ok(rc({ food: 10 }, { att: null }) === 'attacker-no-presence' && rc({ food: 10 }, { att: { ...ap, ls: NOW - 3600, t: NOW - 3600 } }) === 'attacker-stale' && rc({ food: 10 }, { att: { ...ap, x: 1300 } }) !== '' && rc({ food: 10 }, { att: { ...ap, ls: NOW - 800, t: NOW - 800 } }) === '', '鏡像：攻擊者的 presence 必須存在、15 分鐘內、位置一致');
  ok(rc({ food: 10 }, { doc: { ap: { x: 1139, y: 1000 } }, att: { ...ap, x: 1139 } }) === '' && rc({ food: 10 }, { doc: { ap: { x: 1141, y: 1000 } }, att: { ...ap, x: 1141 } }) === 'too-far', '鏡像：ap 與目標距離 ≤ 80 + 60，超過 → 拒絕'); }
// ---- 雲端層（記憶體替身 = 規則的 JS 鏡像）
(async () => {
  const store = { presence: new Map(), raids: new Map() }; let clockT = T1 + 10 * H; const now = () => clockT;
  const be = (uid) => createMemoryPvp(store, uid, now, OWNER_UIDS);
  const NT = (s) => { P.ensurePv(s).nt = 1; return s; };   // 已看過隱私說明（沒看過就不會公開 presence）
  const dS = NT(mk(UD, POS, { res: { food: 400, water: 400, fuel: 300, parts: 200 } })); const aS = NT(mk(UA, { x: 1030, y: 1000 }));
  const dC = new PvpClient(be(UD), { uid: UD, owner: false, now }), aC = new PvpClient(be(UA), { uid: UA, owner: false, now });
  clockT = T1; ok(await dC.publish(dS, own(dS), true), '防守方發布 presence'); clockT = T1 + 10 * H;
  ok(await dC.publish(dS, own(dS), false), '超過間隔後可以再發布'); ok(!(await dC.publish(dS, own(dS), false)), '節流：5 分鐘內、沒變化 → 不寫入');
  // 掃描
  const list = await aC.scan(aS, true); ok(list.length === 1 && list[0].uid === UD && list[0].c.why === 'online', '掃描：附近有一艘船（但最後在線時間是剛剛 → 離線門檻還沒到）');
    // 重新以離線的 presence 做完整流程
  store.presence.get(UD).ls = clockT - 2 * H; store.presence.get(UD).t = clockT - 2 * H;
  const l3 = await aC.scan(aS, true); ok(l3[0].c.ok === true && l3[0].c.claim.food === 32, '離線 2 小時後可突襲');
  ok((await aC.scan(aS, false)) === aC.list && aC.counts.scan === 2, '掃描節流：45 秒內不重複讀取');
  const farS = NT(mk('uidFar', { x: 1600, y: 1000 })); const fc = new PvpClient(be('uidFar'), { uid: 'uidFar', owner: false, now }); ok((await fc.scan(farS, true)).length === 0, '很遠的玩家掃不到對方（不同搜尋格）');
  // 打一場 → raid 文件 → 防守方抄進存檔
  const o = own(aS); const pub = l3[0].pub; const st = P.raidStart(aS, pub, UD, UA, clockT, o, false); ok(st.ok, '開始突襲'); const g = P.guardFoe(o, pub, '守衛艦'); const ar = A.createArena(9, 1, g, o); playBot(ar, 1, 2); const m = A.arenaMetrics(ar);
  const r = P.raidSubmit(aS, clockT + 50, { id: aS.fleet.world.pv.att.id, ...m }, o, UA); ok(r.win && r.doc, '打贏、取得 raid 文件');
  clockT += 50; ok((await aC.flush(aS, o)) === 1 && store.raids.size === 1 && aS.fleet.world.pv.out.length === 0, '送出 raid 文件（唯一的跨使用者寫入），outbox 清空');
  const key = [...store.raids.keys()][0]; ok(key === `${UD}/${UA}_${P.bucketOf(clockT)}`, `文件路徑 raids/{defender}/in/{attacker}_{bucket}（${key}）`);
  // 防守方上線
  const n = await dC.pull(dS, true); ok(n === 1 && dS.fleet.world.pv.in.length === 1, '防守方登入：從自己的收件匣抄進存檔'); ok((await dC.pull(dS, true)) === 0, '重複抓取不會重複收');
  dS.simT = T1; dS.lastSeen = T1; simulateTo(dS, clockT + 60); ok(dS.fleet.world.pv.st.hit === 1 && dS.fleet.world.pv.st.lost > 0 && dS.fleet.world.pv.log[0].from === P.handleOf(UA), '防守方補算：被掠奪一次，紀錄裡是攻擊者的匿名代號');
  // 規則：偽造
  const fx = (uid) => be(uid); const pres = store.presence.get(UD); const okDoc = raidDoc(UE, UD, clockT, { food: 5 });
  const denied = async (fn, why) => { try { await fn(); return false; } catch (e) { return String(e.message).includes(why); } };
  const eS = NT(mk(UE, { x: 1030, y: 1000 })); ok(await new PvpClient(fx(UE), { uid: UE, owner: false, now }).publish(eS, own(eS), true), '第二個攻擊者（UE）先發佈自己的 presence（規則要比對）');
  store.presence.set(UD, { ...pres, ls: clockT - 2 * H, sh: 0 });
  ok(await denied(() => fx(UE).putRaid(UD, `${UE}_${P.bucketOf(clockT)}`, raidDoc(UA, UD, clockT, { food: 5 })), 'attacker-mismatch'), '規則：不能冒用別人當攻擊者');
  ok(await denied(() => fx(UE).putRaid(UD, `${UE}_${P.bucketOf(clockT)}`, { ...okDoc, loot: { food: 33 } }), 'loot-too-big'), '規則：宣稱量超過目標快照的 8% → 拒絕');
  ok(await denied(() => fx(UE).putRaid(UD, `${UE}_${P.bucketOf(clockT)}`, { ...okDoc, loot: { gold: 1 } }), 'bad-'), '規則：不是 4 種資源 → 拒絕');
  ok(await denied(() => fx(UE).putRaid(UD, 'wrong_id', okDoc), 'bad-id'), '規則：文件 id 不對（每個攻擊者×12 小時一份）→ 拒絕');
  ok(await denied(() => fx(UE).putRaid(UD, `${UE}_${P.bucketOf(clockT)}`, { ...okDoc, t: clockT - 5000, b: P.bucketOf(clockT - 5000) }), 'bad-time'), '規則：時間戳不靠近伺服器時間 → 拒絕');
  ok(await denied(() => fx(UE).putRaid(UD, `${UE}_${P.bucketOf(clockT)}`, { ...okDoc, ap: { x: 100, y: 100 } }), 'too-far'), '規則：宣稱的位置離目標太遠 → 拒絕（盡力而為）');
  ok(await denied(() => fx(UE).putRaid(UD, `${UE}_${P.bucketOf(clockT)}`, { ...okDoc, extra: 1 }), 'bad-keys'), '規則：多餘欄位 → 拒絕');
  store.presence.set(UD, { ...pres, ls: clockT - 60 }); ok(await denied(() => fx(UE).putRaid(UD, `${UE}_${P.bucketOf(clockT)}`, okDoc), 'target-online'), '規則：目標 10 分鐘內還在線 → 拒絕');
  store.presence.set(UD, { ...pres, ls: clockT - 2 * H, sh: clockT + 100 }); ok(await denied(() => fx(UE).putRaid(UD, `${UE}_${P.bucketOf(clockT)}`, okDoc), 'target-shielded'), '規則：目標在護盾中 → 拒絕');
  store.presence.set(UD, { ...pres, ls: clockT - 2 * H, sh: 0 });
  ok(await denied(() => fx(UA).putRaid(UD, key.split('/')[1], { ...okDoc, attacker: UA, loot: { food: 1 } }), 'exists'), '規則：同一個攻擊者 12 小時內第二次（文件已存在）→ 拒絕（只能 create）');
  ok(await denied(() => fx(UA).updateRaid(), 'update') && await denied(() => fx(UA).deleteRaid(), 'delete'), '規則：raid 文件不能 update / delete');
  ok(await denied(() => fx(UE).raidsFor(UD, 0), 'read'), '規則：別人讀不到我的收件匣');
  ok(await denied(() => fx(UE).putPresence(UD, pres), 'not-owner'), '規則：寫不了別人的 presence（也寫不了別人的 arks/{uid}）');
  ok(await denied(() => fx(UE).putPresence(UE, { ...pres, extra: 1 }), 'bad-keys') && await denied(() => fx(UE).putPresence(UE, { ...pres, t: pres.t - 9999 }), 'bad-time') && await denied(() => fx(UE).putPresence(UE, { ...pres, t: clockT, ls: clockT, cells: [] }), 'bad-cells'), '規則：presence 形狀 / 時間不對 → 拒絕');
  ok((await fx(UE).putRaid(UD, `${UE}_${P.bucketOf(clockT)}`, okDoc)) === undefined, '合法的 raid 文件可以建立');
  // 船東
  const OW = OWNER_UIDS[0]; const owS = mk(OW, POS, { owner: true }); const owC = new PvpClient(be(OW), { uid: OW, owner: true, now });
  ok(!owC.enabled && !(await owC.publish(owS, own(owS), true)) && (await owC.scan(owS, true)).length === 0, '船東帳號：不發布 presence、不掃描、不出手');
  ok(await denied(() => be(OW).putPresence(OW, P.pubOf(mk(UD, POS), OW, clockT, own(owS), false)), 'owner-no-presence'), '規則：船東 uid 寫不了 presence（自己也不行）');
  ok(await denied(() => be(OW).putRaid(UD, `${OW}_${P.bucketOf(clockT)}`, raidDoc(OW, UD, clockT, { food: 1 })), 'owner-no-pvp'), '規則：船東 uid 不能建立 raid');
  ok(P.canRaid(aS, pub, OW, UA, clockT, true).why === 'owner', '船東帳號不能出手');
  // 訪客
  const gc = new PvpClient(null, { uid: null, owner: false, now }); ok(!gc.enabled && gc.why === 'guest' && (await gc.scan(aS, true)).length === 0 && !(await gc.publish(aS, o, true)), '訪客：全部關閉');
  // 網路失敗不丟例外
  const bad = be(UA); bad.cfg.fail = true; const bc = new PvpClient(bad, { uid: UA, owner: false, now }); ok(!(await bc.publish(aS, o, true)) && (await bc.scan(aS, true)).length === 0 && (await bc.pull(aS, true)) === 0 && bc.err === 'network', '網路失敗：不丟例外、記下錯誤');
  // outbox 失敗保留、永久拒絕丟棄
  const ob = mk(UA, { x: 1030, y: 1000 }); P.ensurePv(ob).out.push(raidDoc(UA, UD, clockT, { food: 5 })); const oc = new PvpClient(bad, { uid: UA, owner: false, now }); await oc.flush(ob); ok(ob.fleet.world.pv.out.length === 1, '網路失敗：raid 文件留在 outbox 之後重送');
  const oc2 = new PvpClient(be(UA), { uid: UA, owner: false, now }); ob.fleet.world.pv.out[0].loot.food = 9999; await oc2.flush(ob); ok(ob.fleet.world.pv.out.length === 0, '被規則永久拒絕的文件會丟掉（不會一直重試）');
  // 審查修正 ④⑤：list 上限、flush 先發佈攻擊者自己的 presence
  { const b = be(UA); ok(await denied(() => b.near(['5_5'], 25), 'list-limit') && await denied(() => b.raidsFor(UA, 0, 61), 'list-limit') && (await b.near(['5_5'], 24)).length >= 0, '規則（鏡像）：掃描 limit > 24、收件匣 limit > 60 → 拒絕；24 / 60 以內 → 通過');
    const UG = 'uidG', gS = NT(mk(UG, { x: 1030, y: 1000 })); P.ensurePv(gS).out.push(raidDoc(UG, UD, clockT, { food: 5 })); const gC = new PvpClient(be(UG), { uid: UG, owner: false, now });
    ok(!store.presence.has(UG), '（前提）攻擊者還沒有自己的 presence'); ok((await gC.flush(gS, own(gS))) === 1 && store.presence.has(UG) && gS.fleet.world.pv.out.length === 0, 'flush(s, own)：先強制發佈自己的 presence，再送 raid 文件 → 成功');
    const UH = 'uidH', hS = NT(mk(UH, { x: 1030, y: 1000 })); P.ensurePv(hS).out.push(raidDoc(UH, UD, clockT, { food: 5 })); const hC = new PvpClient(be(UH), { uid: UH, owner: false, now });
    ok((await hC.flush(hS)) === 0 && hS.fleet.world.pv.out.length === 0 && /attacker-no-presence/.test(hC.err), '（對照）沒有先發佈 presence → 規則擋下（attacker-no-presence），永久失敗的文件被丟掉'); }
  // ---- 第 14 輪：隱私說明 / 隱身 / 登出刪除 / 幽靈船
  { const UP = 'uidPriv', pS = mk(UP, { x: 1030, y: 1000 }), pC = new PvpClient(be(UP), { uid: UP, owner: false, now });
    ok(!(await pC.publish(pS, own(pS), true)) && !store.presence.has(UP), '還沒看過隱私說明（nt = 0）→ 不公開任何東西');
    ok((await pC.setHidden(pS, false)).ok && pS.fleet.world.pv.nt === 1 && await pC.publish(pS, own(pS), true) && store.presence.has(UP), '看過說明後才公開 presence');
    const d0 = store.presence.get(UP); ok(!('hl' in d0) && !('cd' in d0) && d0.ut === clockT && d0.x % 10 === 0, '雲端文件：沒有 hl / cd、ut = 伺服器時間、x 取整');
    ok(!(await pC.publish(pS, own(pS), true)), '連續兩次發布（< 10 秒）→ 規則擋下（ut 頻率限制，客戶端自己的 t 騙不過）' ); ok(/too-frequent/.test(pC.err), '…錯誤是 too-frequent'); pC.err = ''; clockT += 11;
    ok(await pC.publish(pS, own(pS), true), '11 秒後可以再發布');
    const r1 = await pC.setHidden(pS, true); ok(r1.ok && pS.fleet.world.pv.hid === 1 && !store.presence.has(UP), '開隱身：自己的 presence 立刻被刪除');
    clockT += 20; ok(!(await pC.publish(pS, own(pS), true)) && !store.presence.has(UP), '隱身期間不會再發布（連 force 也不行）');
    ok(P.pubOf(pS, UP, clockT, own(pS), false) === null, '隱身期間 pubOf = null');
    const r2 = await pC.setHidden(pS, false); ok(r2.ok && pS.fleet.world.pv.hid === 0, '關隱身'); clockT += 20; ok(await pC.publish(pS, own(pS), true) && store.presence.has(UP), '取消隱身後重新公開');
    P.ensurePv(pS).out.push(raidDoc(UP, UD, clockT, { food: 5 })); const r3 = await pC.setHidden(pS, true); ok(!r3.ok && pS.fleet.world.pv.hid === 0 && store.presence.has(UP), '還有 raid 文件沒送出時不能開隱身（否則規則會擋掉）'); pS.fleet.world.pv.out = [];
    ok(await pC.wipe() && !store.presence.has(UP), 'wipe()（登出 / 刪帳號用）：刪掉自己的 presence'); ok(await pC.wipe() === true, '重複 wipe 不出錯');
    const badBe = be(UP); badBe.cfg.fail = true; const bw = new PvpClient(badBe, { uid: UP, owner: false, now }); ok((await bw.wipe()) === false, '網路失敗時 wipe() 回傳 false、不丟例外');
    ok(!(await new PvpClient(null, { uid: null, owner: false, now }).wipe()) && !(await new PvpClient(be(OWNER_UIDS[0]), { uid: OWNER_UIDS[0], owner: true, now }).wipe()), '訪客 / 船東：wipe 什麼都不做');
    ok(await denied(() => be('someoneElse').delPresence(UP), 'not-owner'), '規則（鏡像）：只有本人能刪自己的 presence');
    // 幽靈船：掃描不列出超過 7 天沒上線的
    const UQ = 'uidGhost'; store.presence.set(UQ, { ...store.presence.get(UD), h: P.handleOf(UQ), ls: clockT - 8 * 86400, t: clockT - 8 * 86400 }); store.presence.set(UD, { ...store.presence.get(UD), ls: clockT - 2 * H });
    const sc = await new PvpClient(be(UA), { uid: UA, owner: false, now }).scan(aS, true); ok(sc.some((x) => x.uid === UD) && !sc.some((x) => x.uid === UQ), '掃描：超過 7 天沒上線的幽靈船不列出'); }
  // 讀寫成本
  ok(dC.counts.pub <= 3 && aC.counts.scan <= 4 && dC.counts.pull <= 3, `讀寫成本很低：發布 ${dC.counts.pub} 次、掃描 ${aC.counts.scan} 次、收件匣 ${dC.counts.pull} 次`);
  console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
})();
