// 末日方舟 · 階段⑤：玩家對玩家（PvP）突襲。純函式、決定性。設計與限制見 DESIGN-expansion.md §5 / DESIGN-fleet.md §3–4。
//
// \ue099 免費 Firebase Spark：沒有 Cloud Functions、沒有可信伺服器 → 這裡的一切都「防不了作弊」。
//   存檔、presence 快照、raid 文件都是玩家自己寫的；Firestore 規則只能限制「形狀 / 大小 / 頻率 / 與對方快照比較的上限」。
//   所以掠奪量被設計得很小（每次 ≤ 8%、每天 ≤ 20%、12 小時護盾），就算有人偽造，傷害也有上限。
//
// 流程（攻擊方）：
//   scan presence → pvTargets（距離 / 迷霧 / 離線 / 護盾）→ raidStart（建立 att）→ 在砲戰場打「守衛艦」（arena.js，沿用階段④）
//   → raidSubmit（arenaWin 合理性檢查）→ 產生一份 raid 文件（唯一的跨使用者寫入：raids/{defender}/in/{attacker}_{bucket}，只能 create）。
// 流程（防守方，離線也一樣）：登入 / 輪詢時把 raid 文件抄進自己存檔的收件匣 pv.in（pvIngest），
//   之後由 pvTick（在 stepTick 內，tEnd >= raid.t 的第一個 tick）決定性地結算：每次 ≤ 8% 庫存、≤ lootCap、每日 ≤ 20%、12 小時護盾、船體最多受損到 50%（第 14 輪：損失 < 5 件不扣船體也沒有護盾；只結算 t 在最近 48 小時內的突襲；攻擊者只拿宣稱量的 50%）。
//   防守方什麼都不寫入別人的文件；結算只改自己的存檔，所以「一次跑完」「一小時一小時跑」「逐 tick 跑」結果完全相同。
import { hash } from './rng.js';
import { clamp } from '../util.js';
import { arkPos, cellOf, fogHas } from './world.js';
import { foeStats, arenaWin } from './battle.js';
import { hullDmg } from './szdata.js';
import { resCap } from './promo.js';
import { RES, RES_KEYS, MAX_OFFLINE } from './defs.js';

export const PV = Object.freeze({
  range: 80,            // 攻擊距離（世界單位；世界 2000×2000）
  block: 100,           // presence 的搜尋格邊長（range <= block → 掃 3×3 格一定涵蓋所有射程內的船）
  offlineAfter: 600,    // 防守方離線超過 10 分鐘（presence.ls 之後沒再更新）才可被突襲
  shield: 12 * 3600,    // 被突襲後的護盾
  take: 0.08,           // 每次最多掠走庫存的 8%
  dayCap: 0.20,         // 每個 UTC 日最多損失「當天第一次被襲時庫存」的 20%
  bucket: 12 * 3600,    // 同一個攻擊者對同一個目標：每 12 小時最多 1 次（第 14 輪預設值，Tim 可再調）
  hullFloor: 50,        // 防守方船體最多被打到 50%（只扣、絕不把更低的船體抬高）
  hullHit: [2, 6],      // 每次被襲損失的船體 %
  capBase: 30, capPerFp: 3,   // lootCap(fp)：每種資源單次掠奪的絕對上限
  minClaim: 5,          // 全部資源加起來不到這個數就不值得出手；防守方實際損失低於這個數也不扣船體、不啟動護盾（第 14 輪預設值）
  atkShare: 0.5,        // 攻擊者實際拿到「宣稱量」的 50%（防守者損失的是全額；第 14 輪預設值）
  window: MAX_OFFLINE,  // 只結算 t 在最近 48 小時內的突襲，更舊的作廢（第 14 輪預設值）
  staleAfter: 7 * 86400, // presence.ls 超過 7 天 = 幽靈船：不列入掃描、規則也不讓人對它出手
  posRound: 10, lsRound: 600, resStep: 0.05,   // 隱私：位置取整到 10 單位、ls 取整到 10 分鐘（進位）、資源取整到儲存上限的 5%（捨去）
  atkTtl: 150,          // 一場攻擊從開始到交戰報告的最長秒數（砲戰場 75 秒 + 緩衝）
  futureSlack: 300,     // 收件匣：t 比現在晚超過 300 秒的文件一律丟掉（pvIngest）
  atkCool: 900,         // 攻擊方：打完一場（贏 / 輸）後 15 分鐘內不能再出手
  pubGap: 300,          // presence 最短寫入間隔（上線中）
  scanGap: 45,          // 掃描間隔（本機節流，每次掃描 ≤ 24 次讀取）
  scanMax: 24,
  inMax: 24, logMax: 20, seenMax: 48, pbMax: 24, outMax: 12, outTtl: 24 * 3600,
  lootKeys: Object.freeze(['food', 'water', 'fuel', 'parts']),   // 只有這四種資源能被搶；船 / 藍圖 / 材料絕對不會
});
export const lootCap = (fp) => Math.round(PV.capBase + PV.capPerFp * Math.max(0, Math.min(200, +fp || 0)));
const num = (x) => typeof x === 'number' && Number.isFinite(x);
const ID = /^[A-Za-z0-9_-]{1,160}$/;
const UID = /^[A-Za-z0-9_-]{1,64}$/;
/** 匿名代號（不含任何個資）：船#1A2B */
export const handleOf = (uid) => '船#' + (hash('pvh', String(uid)) % 0x10000).toString(16).toUpperCase().padStart(4, '0');
export const bucketOf = (t) => Math.floor(t / PV.bucket);
export const blockOf = (x, y) => `${Math.max(0, Math.min(19, Math.floor(x / PV.block)))}_${Math.max(0, Math.min(19, Math.floor(y / PV.block)))}`;
/** 以目標的 presence 路線算出現在的位置（跟 arkPos 同一套公式） */
export const posOf = (p, t) => { const r = p && p.rt; if (!r) return { x: p.x, y: p.y }; const u = clamp((t - r.t0) / Math.max(1, r.t1 - r.t0), 0, 1); return { x: r.x0 + (r.x1 - r.x0) * u, y: r.y0 + (r.y1 - r.y0) * u }; };
/** 整條航線會經過的搜尋格（上限 16 格） */
export function blocksOfRoute(x0, y0, x1, y1) {
  const out = new Set([blockOf(x0, y0)]); const d = Math.hypot(x1 - x0, y1 - y0), n = Math.min(40, Math.ceil(d / 40));
  for (let i = 1; i <= n; i++) out.add(blockOf(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n)); return [...out].slice(0, 16);
}
export const nearBlocks = (x, y) => { const bx = Math.max(0, Math.min(19, Math.floor(x / PV.block))), by = Math.max(0, Math.min(19, Math.floor(y / PV.block))); const o = []; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const a = bx + i, b = by + j; if (a >= 0 && b >= 0 && a < 20 && b < 20) o.push(`${a}_${b}`); } return o; };

// ---------------------------------------------------------------- 存檔欄位（s.fleet.world.pv，選填；SAVE_VERSION 不變）
export const emptyPv = () => ({ in: [], seen: [], hw: 0, sh: 0, dy: { d: -1, base: {}, lost: {} }, log: [], st: { hit: 0, lost: 0, vd: 0, atk: 0, won: 0, loot: 0 }, att: null, cd: 0, pb: {}, out: [], hid: 0, nt: 0 });
const sanRes = (r, max = 1000) => { const o = {}; if (r && typeof r === 'object') for (const k of PV.lootKeys) if (num(r[k]) && r[k] > 0) o[k] = Math.min(max, Math.floor(r[k])); return o; };
const sanStr = (x, n) => (typeof x === 'string' ? x.replace(/[<>&"'`\u0000-\u001f]/g, '').slice(0, n) : '');
export function sanPv(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return null; const o = emptyPv(); const T = (x) => (num(x) ? clamp(x, 0, 1e11) : 0);
  if (Array.isArray(p.in)) for (const r of p.in.slice(0, PV.inMax)) { if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !ID.test(r.id) || !num(r.t) || r.t < 0 || r.t > 1e11) continue; o.in.push({ id: r.id, t: r.t, from: sanStr(r.from, 12) || '船#????', claim: sanRes(r.claim, 400) }); }
  o.in.sort(byT);
  if (Array.isArray(p.seen)) o.seen = p.seen.filter((x) => typeof x === 'string' && ID.test(x)).slice(-PV.seenMax);
  o.hw = T(p.hw); o.sh = T(p.sh); o.cd = T(p.cd); o.hid = p.hid ? 1 : 0; o.nt = p.nt ? 1 : 0;   // hid = 隱身（不公開 presence）、nt = 已看過隱私說明
  if (p.dy && typeof p.dy === 'object') o.dy = { d: num(p.dy.d) ? clamp(p.dy.d | 0, -1, 1e7) : -1, base: sanRes(p.dy.base, 1e4), lost: sanRes(p.dy.lost, 1e4) };
  if (Array.isArray(p.log)) for (const e of p.log.slice(-PV.logMax)) { if (!e || typeof e !== 'object' || !num(e.t)) continue; o.log.push({ t: T(e.t), from: sanStr(e.from, 12), res: sanRes(e.res, 400), hull: num(e.hull) ? clamp(e.hull, 0, 100) : 0, why: ['', 'shield', 'cap', 'poor', 'small', 'old'].includes(e.why) ? e.why : '' }); }
  if (p.st && typeof p.st === 'object') for (const k of Object.keys(o.st)) o.st[k] = num(p.st[k]) ? clamp(p.st[k] | 0, 0, 1e8) : 0;
  const a = p.att; if (a && typeof a === 'object' && typeof a.id === 'string' && UID.test(String(a.tgt)) && num(a.t0) && num(a.b)) o.att = { id: a.id.slice(0, 160), tgt: String(a.tgt), h: sanStr(a.h, 12), b: clamp(a.b | 0, 0, 1e8), t0: T(a.t0), lv: num(a.lv) ? clamp(a.lv, 0.5, 4) : 1, claim: sanRes(a.claim, 400) };
  if (p.pb && typeof p.pb === 'object' && !Array.isArray(p.pb)) { const ks = Object.keys(p.pb).filter((k) => UID.test(k) && num(p.pb[k])).slice(-PV.pbMax); for (const k of ks) o.pb[k] = clamp(p.pb[k] | 0, 0, 1e8); }
  if (Array.isArray(p.out)) for (const d of p.out.slice(0, PV.outMax)) { const c = sanRaidDoc(d); if (c) o.out.push(c); }
  return o;
}
const byT = (a, b) => a.t - b.t || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
/** raid 文件的形狀檢查（攻擊方送出前 / 防守方抄進收件匣前 / 記憶體後端模擬規則時用）；不合格回傳 null */
export function sanRaidDoc(d) {
  if (!d || typeof d !== 'object' || !UID.test(String(d.attacker)) || !UID.test(String(d.defender)) || d.attacker === d.defender || !num(d.t) || d.t < 0 || d.t > 1e11 || !num(d.b)) return null;
  const loot = sanRes(d.loot, 400); return { v: 1, attacker: String(d.attacker), defender: String(d.defender), b: d.b | 0, t: d.t, ah: sanStr(d.ah, 12), loot, ap: d.ap && num(d.ap.x) && num(d.ap.y) ? { x: clamp(d.ap.x, 0, 2000), y: clamp(d.ap.y, 0, 2000) } : { x: 0, y: 0 } };
}
export const pvOf = (s) => (s.fleet && s.fleet.world && s.fleet.world.pv) || null;
export const ensurePv = (s) => { const w = s.fleet && s.fleet.world; if (!w) return null; return w.pv || (w.pv = emptyPv()); };

// ---------------------------------------------------------------- 公開快照（presence/{uid}）
/** 要公開給附近玩家看的快照。沒有 uid（訪客）/ 船東 / 沒有世界地圖 → null（不會被列出、也不能被突襲）。 */
/** 隱私取整（第 14 輪）：位置 10 單位、資源「儲存上限的 5%」一格（捨去，所以宣稱量永遠不會超過防守者真實庫存的 8%）、ls 10 分鐘（進位 = 看起來只會比實際「更晚」離線，所以永遠不會讓人提早出手） */
export const roundPos = (v) => clamp(Math.round(v / PV.posRound) * PV.posRound, 0, 2000);
export const roundLs = (t) => Math.ceil(t / PV.lsRound) * PV.lsRound;
export const roundRes = (s, k, v) => { const step = Math.max(1, Math.round(resCap(s, k) * PV.resStep)); return clamp(Math.floor(Math.max(0, v || 0) / step) * step, 0, 2000); };
export function pubOf(s, uid, now, own, isOwnerUid) {
  const w = s.fleet && s.fleet.world; if (!uid || isOwnerUid || !w || !w.pos) return null; const pv = pvOf(s); if (pv && pv.hid) return null;   // 隱身：不公開任何東西
  const p = arkPos(w, now), r = w.route && now < w.route.t1 ? { x0: roundPos(w.route.x0), y0: roundPos(w.route.y0), x1: roundPos(w.route.x1), y1: roundPos(w.route.y1), t0: Math.floor(w.route.t0), t1: Math.ceil(w.route.t1) } : null;
  const res = {}; for (const k of PV.lootKeys) res[k] = roundRes(s, k, s.res[k]);
  const fp = clamp(Math.round(own.fp * 10) / 10, 0, 200), x = roundPos(p.x), y = roundPos(p.y);
  const o = { v: 1, h: handleOf(uid), x, y, fp, res, cap: lootCap(fp), sh: clamp(Math.floor(pv ? pv.sh : 0), 0, Math.floor(now) + PV.shield), ls: roundLs(Math.floor(now)), t: Math.floor(now), cells: r ? blocksOfRoute(r.x0, r.y0, r.x1, r.y1) : [blockOf(x, y)] };
  if (r) o.rt = r; return o;
}
/** presence 文件的形狀檢查（Firestore 規則的 JS 鏡像；見 DESIGN-fleet.md 的規則草案） */
export function sanPub(d) {
  if (!d || typeof d !== 'object') return null; if (![d.x, d.y, d.fp, d.cap, d.sh, d.ls, d.t].every(num)) return null;
  if (!Array.isArray(d.cells) || !d.cells.length || d.cells.length > 16 || !d.cells.every((c) => typeof c === 'string' && /^\d{1,2}_\d{1,2}$/.test(c))) return null;
  const o = { v: 1, h: sanStr(d.h, 12), x: clamp(d.x, 0, 2000), y: clamp(d.y, 0, 2000), fp: clamp(d.fp, 0, 200), res: sanRes(d.res, 2000), cap: clamp(d.cap | 0, 0, 1000), sh: clamp(d.sh, 0, 1e11), ls: clamp(d.ls, 0, 1e11), t: clamp(d.t, 0, 1e11), cells: d.cells.slice(0, 16) };
  const r = d.rt; if (r && [r.x0, r.y0, r.x1, r.y1, r.t0, r.t1].every(num)) o.rt = { x0: clamp(r.x0, 0, 2000), y0: clamp(r.y0, 0, 2000), x1: clamp(r.x1, 0, 2000), y1: clamp(r.y1, 0, 2000), t0: r.t0, t1: r.t1 };
  return o;
}
/** 本機已經有改變 / 超過間隔才需要重寫 presence */
export const pubChanged = (a, b) => !a || !b || a.sh !== b.sh || a.h !== b.h || Math.abs(a.x - b.x) >= PV.posRound || Math.abs(a.y - b.y) >= PV.posRound || Math.abs(a.fp - b.fp) > 0.5 || PV.lootKeys.some((k) => (a.res[k] || 0) !== (b.res[k] || 0));

// ---------------------------------------------------------------- 攻擊方
/** 單次掠奪的「宣稱量」：每種資源 ≤ 8% 目標庫存、≤ lootCap。 */
export function claimOf(pub) { const o = {}; for (const k of PV.lootKeys) { const v = Math.floor(Math.min((pub.res[k] || 0) * PV.take, pub.cap)); if (v >= 1) o[k] = v; } return o; }
/** 攻擊者實際拿到的量（宣稱量的 50%，無條件捨去；防守者損失的是全額） */
export const gainOf = (claim) => { const o = {}; for (const k of PV.lootKeys) { const v = Math.floor(((claim && claim[k]) | 0) * PV.atkShare); if (v >= 1) o[k] = v; } return o; };
const sum = (o) => Object.keys(o).reduce((a, k) => a + o[k], 0);
/** 這個目標現在能不能打？回傳 { ok, why, dist, x, y, claim }。why = self / owner / far / fog / online / shield / poor / done / cool / busy */
export function canRaid(s, pub, uid, selfUid, now, isOwnerUid) {
  const w = s.fleet && s.fleet.world, pv = pvOf(s) || emptyPv(); const bad = (why, o = {}) => ({ ok: false, why, ...o });
  if (!w || !w.pos) return bad('nomap'); if (!selfUid) return bad('guest'); if (isOwnerUid) return bad('owner');
  if (uid === selfUid) return bad('self'); if (!sanPub(pub)) return bad('bad'); if (pv.hid) return bad('hidden');   // 隱身中沒有自己的 presence → 規則不會放行，所以直接不給出手
  const me = arkPos(w, now), tp = posOf(pub, now), dist = Math.hypot(me.x - tp.x, me.y - tp.y), at = { dist, x: tp.x, y: tp.y };
  const [cx, cy] = cellOf(tp.x, tp.y); if (!fogHas(w, cx, cy)) return bad('fog', at);
  if (dist > PV.range) return bad('far', at);
  if (now - pub.ls > PV.staleAfter) return bad('stale', at);
  if (now - pub.ls < PV.offlineAfter) return bad('online', at);
  if (pub.sh > now) return bad('shield', at);
  const claim = claimOf(pub); if (sum(claim) < PV.minClaim) return bad('poor', at);
  if (pv.pb[uid] === bucketOf(now)) return bad('done', at);
  if (pv.att && now < pv.att.t0 + PV.atkTtl && pv.att.tgt !== uid) return bad('busy', at);
  if (now < pv.cd) return bad('cool', { ...at, wait: Math.ceil(pv.cd - now) });
  return { ok: true, why: '', claim, ...at };
}
/** 守衛艦：用目標公開的戰力換算成階段④的「海盜」數值（階段④的砲戰場 / 機器人 / 風險估計原封不動沿用）。 */
export function guardFoe(own, pub, nm) {
  const r = Math.max(0.2, (+pub.fp || 0) / Math.max(0.5, own.fp)); const lv = +clamp(0.75 * Math.pow(r, 0.55), 0.6, 1.9).toFixed(2);
  const f = foeStats({ k: 'pirate', lv, nm: nm || '守衛艦' }); return { ...f, icon: '\ue012', name: nm || '守衛艦', guard: true };
}
export const attLv = (own, pub) => guardFoe(own, pub).lv;
/** 開始一場攻擊（記下目標快照 + 宣稱量，之後交戰報告只能對應這一場） */
export function raidStart(s, pub, uid, selfUid, now, own, isOwnerUid) {
  const c = canRaid(s, pub, uid, selfUid, now, isOwnerUid); if (!c.ok) return { ok: false, why: c.why, msg: WHY[c.why] || '現在不能出手' };
  const pv = ensurePv(s), b = bucketOf(now), foe = guardFoe(own, pub, '守衛艦 ' + pub.h);
  pv.att = { id: `${selfUid}_${b}_${uid}`.slice(0, 160), tgt: uid, h: pub.h, b, t0: Math.floor(now), lv: foe.lv, claim: c.claim }; return { ok: true, att: pv.att, foe, claim: c.claim };
}
export const WHY = { guest: '登入後才能參加玩家對戰', owner: '船東帳號不參與 PvP', self: '那是你自己的船', far: '距離太遠，靠近一點（80 以內）', fog: '那片海域還沒探索過（迷霧中）', online: '對方還在線上，等他離線再說', shield: '對方在護盾保護中', poor: '對方沒什麼油水', done: '這 12 小時內已經對他出手過了', hidden: '你正在隱身：先關掉「隱身」才能出手', stale: '對方超過 7 天沒上線了', cool: '船員還在休整，等一下再出手', busy: '你還有一場突襲沒結束', nomap: '還沒有世界地圖', bad: '這份資料有問題，已略過' };
/**
 * 交戰報告（rep = { id, won, t, shots, hits, loss }）。
 * 贏（過 arenaWin 合理性檢查）→ 掠奪 att.claim（受自己資源上限限制）、產生 raid 文件（回傳 doc，由呼叫端 create 到雲端；失敗會放進 pv.out 重送）。
 * 輸 / 時間到 / 撤離（won:false）→ 沒有掠奪；船體損失 = 砲戰場實際傷害（一律用 hullDmg，保底 20%）。
 */
export const attFoe = (a) => { const f = foeStats({ k: 'pirate', lv: a.lv, nm: '守衛艦 ' + a.h }); return { ...f, icon: '\ue012', name: '守衛艦 ' + a.h, guard: true }; };
export function raidSubmit(s, now, rep, own, selfUid) {
  const pv = pvOf(s), a = pv && pv.att; if (!a) return { ok: false, msg: '沒有進行中的突襲' };
  if (!rep || rep.id !== a.id) return { ok: false, msg: '這份戰報不屬於目前這場突襲，已忽略' };
  if (now > a.t0 + PV.atkTtl) { pv.att = null; return { ok: false, msg: '突襲時間已過' }; }
  pv.att = null; pv.cd = Math.floor(now + PV.atkCool); pv.st.atk++;
  const tSub = Math.floor(now), bSub = bucketOf(tSub);      // 12 小時桶以「送出當下」為準（不是開打當下）：跨桶時文件的 b 與 t 才會一致，規則（b == floor(t/43200)）才不會事後擋掉
  const w = arenaWin(rep, attFoe(a), own);
  if (!w) { const h = hullDmg(s, num(rep && rep.loss) ? clamp(rep.loss, 0, 100) : 0); return { ok: true, win: false, hull: +h.toFixed(1), msg: `\ue012 突襲 ${a.h} 失敗，沒有搶到東西${h > 0 ? `，船體 −${h.toFixed(0)}%` : ''}` }; }
  const hull = hullDmg(s, w.loss), got = {};
  for (const k of PV.lootKeys) { const c = Math.floor((a.claim[k] | 0) * PV.atkShare); if (c < 1) continue; const b = s.res[k];   // 攻擊者只拿宣稱量的 50%（防守者損失的是全額）
       s.res[k] = Math.min(resCap(s, k), b + c); const g = Math.round(s.res[k] - b); if (g > 0) got[k] = g; }
  pv.pb[a.tgt] = bSub; const ks = Object.keys(pv.pb); if (ks.length > PV.pbMax) for (const k of ks.slice(0, ks.length - PV.pbMax)) delete pv.pb[k];
  pv.st.won++; pv.st.loot += sum(got);
  const doc = sanRaidDoc({ attacker: selfUid, defender: a.tgt, b: bSub, t: tSub, ah: handleOf(selfUid), loot: a.claim, ap: arkPos(s.fleet.world, now) });
  if (doc) { pv.out.push(doc); if (pv.out.length > PV.outMax) pv.out.shift(); }
  const txt = Object.keys(got).map((k) => `${RES[k].icon}+${got[k]}`).join(' ');
  return { ok: true, win: true, doc, got, hull: +hull.toFixed(1), msg: `\ue009 突襲 ${a.h} 成功！搶到 ${txt || '（你的倉庫滿了）'}${hull > 0 ? `，船體 −${hull.toFixed(0)}%` : ''}` };
}
export const raidDocId = (d) => `${d.attacker}_${d.b}`;
/** 送出成功的 raid 文件從 outbox 移除；超過 24 小時還沒送出的丟掉 */
export function outDone(s, doc) { const pv = pvOf(s); if (pv) pv.out = pv.out.filter((d) => !(d.defender === doc.defender && d.b === doc.b && d.attacker === doc.attacker)); }
export function outPrune(s, now) { const pv = pvOf(s); if (pv) pv.out = pv.out.filter((d) => now - d.t < PV.outTtl); }
export function attExpire(s, now) { const pv = pvOf(s); if (pv && pv.att && now > pv.att.t0 + PV.atkTtl) pv.att = null; }

// ---------------------------------------------------------------- 防守方（決定性）
/** 把雲端抓回來的 raid 文件抄進收件匣（去重、驗證、上限）。回傳新加入的數量。要在 simulateTo 之前呼叫。 */
export function pvIngest(s, docs, selfUid, isOwnerUid, now) {
  if (isOwnerUid || !selfUid || !num(now)) return 0; const pv = ensurePv(s); if (!pv || !Array.isArray(docs)) return 0; let n = 0;
  for (const raw of docs.slice(0, 80)) {
    const d = sanRaidDoc(raw); if (!d || d.defender !== selfUid) continue; if (d.t > now + PV.futureSlack || d.t < now - PV.window) continue;   // 未來時間（> now+300）或超過 48 小時的文件一律丟掉（否則 24 份「未來」文件能永遠塞滿收件匣）
    const id = raidDocId(d);
    if (!ID.test(id) || pv.seen.includes(id) || pv.in.some((r) => r.id === id)) continue;
    if (pv.in.length >= PV.inMax) break;
    const cap = lootCap(1e9) , claim = {}; for (const k of PV.lootKeys) if (d.loot[k] >= 1) claim[k] = Math.min(d.loot[k], cap);
    pv.in.push({ id, t: d.t, from: handleOf(d.attacker), claim }); n++; pv.hw = Math.max(pv.hw, d.t);
  }
  pv.in.sort(byT); return n;
}
/** 查詢收件匣時從哪個時間之後抓（留一點餘裕，靠 seen 去重） */
export const ingestSince = (s) => { const pv = pvOf(s); return Math.max(0, (pv ? pv.hw : 0) - 3600); };
const dayOf = (t) => Math.floor(t / 86400);
const fmt = (o) => Object.keys(o).filter((k) => o[k] > 0).map((k) => `${RES[k].icon}−${o[k]}`).join(' ');
/** 每個 tick：把 t <= tEnd 的收件匣突襲依 (t, id) 順序結算。沒有 pv / 沒有待處理的突襲 → 什麼都不做（stage 4 以前的存檔完全不受影響）。 */
export function pvTick(s, tEnd, ev, own) {
  const w = s.fleet && s.fleet.world, pv = w && w.pv; if (!pv || !pv.in.length || pv.in[0].t > tEnd) return;
  while (pv.in.length && pv.in[0].t <= tEnd) {
    const r = pv.in.shift(); pv.seen.push(r.id); if (pv.seen.length > PV.seenMax) pv.seen.shift();
    const e = { t: r.t, from: r.from, res: {}, hull: 0, why: '' };
    if (tEnd - r.t > PV.window) { e.why = 'old'; pv.st.vd++; }   // 只結算最近 48 小時內的突襲，更舊的作廢（沒有損失）
    else if (r.t < pv.sh) { e.why = 'shield'; pv.st.vd++; }
    else {
      const d = dayOf(r.t); if (pv.dy.d !== d) { pv.dy = { d, base: {}, lost: {} }; for (const k of PV.lootKeys) pv.dy.base[k] = Math.max(0, Math.floor(s.res[k] || 0)); }
      const cap = lootCap(own ? own() : 0); let capped = false;
      for (const k of PV.lootKeys) {
        const c = r.claim[k] | 0; if (c < 1) continue; const room = Math.max(0, Math.floor(PV.dayCap * (pv.dy.base[k] || 0)) - (pv.dy.lost[k] | 0));
        const q = Math.floor(Math.min(c, PV.take * Math.max(0, s.res[k]), cap, room)); if (q < c) capped = true; if (q > 0) { s.res[k] -= q; pv.dy.lost[k] = (pv.dy.lost[k] | 0) + q; e.res[k] = q; }
      }
      const tot = sum(e.res);
      if (tot >= PV.minClaim) {
        const h = PV.hullHit, dm = h[0] + (hash('pvh', s.seed, r.id) % (h[1] - h[0] + 1)); if (s.cond > PV.hullFloor) { const n = Math.max(PV.hullFloor, s.cond - dm); e.hull = +(s.cond - n).toFixed(1); s.cond = n; }
        pv.sh = Math.max(pv.sh, r.t + PV.shield); pv.st.hit++; pv.st.lost += tot; if (capped) e.why = 'cap';
      } else if (tot > 0) { e.why = 'small'; pv.st.hit++; pv.st.lost += tot; }   // 損失太小（< minClaim）：東西照扣，但不扣船體、不啟動護盾
      else { e.why = 'poor'; pv.st.vd++; }
    }
    pv.log.push(e); if (pv.log.length > PV.logMax) pv.log.shift();
    ev && ev({ t: r.t, type: 'raid', text: raidText(e) });
  }
}
export function raidText(e) {
  if (e.why === 'shield') return `\ue077 你離線時 ${e.from} 想突襲你的方舟，被護盾擋下了（沒有損失）。`;
  if (e.why === 'old') return `\ue053 你離線時 ${e.from} 的突襲通知太舊（超過 48 小時），已作廢，沒有任何損失。`;
  if (e.why === 'small') return `\ue009 你離線時 ${e.from} 來突襲，只搶走 ${fmt(e.res)}（太少了）。船體沒有受損，也沒有啟動護盾。`;
  if (e.why === 'poor') return `\ue009 你離線時 ${e.from} 來突襲，但倉庫已經達到今日損失上限，什麼都沒搶走。`;
  return `\ue009 你離線時 ${e.from} 突襲了你的方舟！損失 ${fmt(e.res)}${e.hull > 0 ? `，船體 −${e.hull}%` : ''}。已啟動 12 小時護盾。${e.why === 'cap' ? '（受每次 8% / 每日 20% 上限保護，實際損失比對方宣稱的少）' : ''}`;
}
/** 顯示用：護盾剩餘秒數 */
export const shieldLeft = (s, now) => { const pv = pvOf(s); return pv && pv.sh > now ? pv.sh - now : 0; };
export { RES_KEYS };
