// 特殊海域模擬（純函式、決定性）：危害 = f(地圖座標, tick)；掉落 = hash(seed, 'sz', 海域, tick)。離線補算與線上推進結果一致。
// 設計見 DESIGN-expansion.md §2；資料表在 szdata.js。接在 sim.stepTick：seaPre（算減速）→ weatherTick（吃減速）→ seaTick → worldTick。
// 存檔欄位（全部選填、可加）：fleet.world.sz = { in, tr, mo, n, d, hull, hits, pz }、fleet.mat = { fogpearl, vortex, ember, hellstone, rune }、稀有藍圖進 fleet.bp。
import { hash } from './rng.js';
import { WORLD } from './fleetdefs.js';
import { arkPos, insideWorld } from './world.js';
import { SPECIAL_ZONES, SZ, SZ_ORDER, MAT_ORDER, MATERIALS, PROMO_BP, PROMO_BP_IDS, zoneAtPoint } from './szdata.js';
import { clamp } from '../util.js';
import { meetsNeed, needText, flagStats } from './promo.js';

const U32 = 4294967296;
const NONE = Object.freeze({ h: null, slow: 0, p: null, dep: 0, un: 1 });
export const HELM_KU = (WORLD.arkSpeed / 60) / 11;     // 1 公尺 = 多少地圖單位（跟 helmphys.HELM_K 同一個公式；這裡不引用 play/）

export const emptySz = () => ({ in: '', tr: 0, mo: 0, n: {}, d: {}, hull: 0, hits: 0, pz: -1 });
const ensureSz = (w) => w.sz || (w.sz = emptySz());
/** 存檔清洗（world.sz） */
export function sanSz(z) {
  if (!z || typeof z !== 'object') return null; const n = (x) => typeof x === 'number' && Number.isFinite(x); const o = emptySz();
  o.in = SZ_ORDER.includes(z.in) ? z.in : ''; o.tr = z.tr ? 1 : 0; o.mo = n(z.mo) ? clamp(z.mo, 0, SZ.moCap) : 0; o.hull = n(z.hull) ? clamp(z.hull, 0, 1e6) : 0; o.hits = n(z.hits) ? clamp(z.hits | 0, 0, 1e7) : 0; o.pz = n(z.pz) ? clamp(z.pz | 0, -1, 1e6) : -1;
  for (const k of SZ_ORDER) { if (z.n && n(z.n[k]) && z.n[k] > 0) o.n[k] = clamp(z.n[k] | 0, 0, 1e6); if (z.d && n(z.d[k]) && z.d[k] > 0) o.d[k] = clamp(z.d[k] | 0, 0, 1e6); }
  if (z.d && n(z.d.bp) && z.d.bp > 0) o.d.bp = clamp(z.d.bp | 0, 0, 1e4);
  return o;
}
/** 存檔清洗（fleet.mat） */
export function sanMat(m) { if (!m || typeof m !== 'object') return null; const o = {}; let any = false; for (const k of MAT_ORDER) if (typeof m[k] === 'number' && Number.isFinite(m[k]) && m[k] > 0) { o[k] = clamp(m[k] | 0, 0, SZ.matCap); any = true; } return any ? o : null; }

/** 旗艦階級是否達到該海域的建議階級（階段③才會有 fleet.flag；之前一律「未達」→ 危害 ×1.5 並提示，但仍可進入） */
export function unprepared(f, z) { return !!z.need && !meetsNeed(f, z); }
/** 未達進入條件時的危害倍率（火焰這類「強條件」海域；硬條件的海域進不去，這裡只是舊存檔 / 傳送進去時的保險） */
export const unprepK = (f, z) => (unprepared(f, z) ? (z.need.unprep || SZ.unprep) : 1);
export const moraleMul = (s) => { const w = s.fleet && s.fleet.world; const mo = w && w.sz ? w.sz.mo : 0; return mo > 0 ? 1 - 0.2 * mo / SZ.moCap : 1; };
export const matCount = (s, k) => (s.fleet && s.fleet.mat && s.fleet.mat[k]) | 0;

/** tick 開始時的位置所在海域與航速減損（給 weatherTick 合併）。 */
export function seaPre(s, t) {
  const f = s.fleet, w = f && f.world; if (!w || !w.pos) return NONE;
  const p = arkPos(w, t); const h = zoneAtPoint(p.x, p.y); if (!h) return { ...NONE, p };
  const dep = h.depth; return { p, h, dep, un: unprepK(f, h.z), slow: clamp((h.z.haz.slow || 0) * dep, 0, 0.9) };
}
const hullHit = (s, sz, d) => { if (d <= 0) return; const b = s.cond; s.cond = Math.max(Math.min(b, SZ.floor), b - d); sz.hull += b - s.cond; };

/** 每個 tick：危害 + 掉落。pre = seaPre 的結果（tick 開始位置）。 */
export function seaTick(s, t, tEnd, ev, pre) {
  const f = s.fleet, w = f && f.world; if (!w || !w.pos) return;
  const e = (sub, text, extra) => ev && ev({ t: tEnd, type: 'seazone', sub, text, ...extra });
  if (!pre || !pre.h) { const sz = w.sz; if (sz) { if (sz.in) { sz.in = ''; sz.tr = 0; } if (sz.mo > 0) sz.mo = Math.max(0, sz.mo - 0.25); } return; }
  const sz = ensureSz(w), z = pre.h.z, hz = z.haz, dep = pre.dep, un = pre.un, p = pre.p, ti = Math.round(t / 60), seed = s.seed, dt = tEnd - t, FS = flagStats(f);
  const r = w.route;
  if (sz.in !== z.id) { // 進入
    sz.in = z.id; sz.n[z.id] = (sz.n[z.id] | 0) + 1;
    e('enter', `${z.icon} 進入${z.name}：${z.blurb}${un > 1 ? `（旗艦階級未達（${needText(z)}），傷害 ×${un}）` : ''}`, { zone: z.id });
    if (hz.stuck && r && p.moving) { const stk = hz.stuck * FS.hazMul; r.t1 += stk; e('stuck', `\ue000 方舟卡在石柱之間，航程多花 ${Math.round(stk / 60)} 分鐘。`, { zone: z.id }); }
  }
  // 船體
  let dmg = (hz.hull || 0) * dep * un;
  if (hz.strike && hash(seed, 'szs', ti) / U32 < hz.strike * dep) { dmg += 2 * un; sz.hits++; if (sz.hits % 4 === 1) e('strike', `\ue05c 地獄落雷擊中方舟！船體受損。`, { zone: z.id }); }
  if (hz.rock && p.moving && hash(seed, 'szr', ti) / U32 < hz.rock * dep) { dmg += hz.rockDmg * un; sz.hits++; if (sz.hits % 3 === 1) e('rock', `\ue000 方舟擦撞巨石，船體 −${(hz.rockDmg * un).toFixed(1)}%。`, { zone: z.id }); }
  dmg *= FS.hazMul * FS.armorMul;   // 旗艦階級：抗危害 × 裝甲
  hullHit(s, sz, dmg);
  if (hz.water) s.res.water = Math.max(0, s.res.water - hz.water * dep * FS.hazMul);
  // 士氣（地獄 / 迷霧累積，離開慢慢恢復）
  if (hz.mo) sz.mo = Math.min(SZ.moCap, sz.mo + hz.mo * dep * un * FS.hazMul); else sz.mo = Math.max(0, sz.mo - 0.1);
  // 漩渦：向中心拉（手動駕駛時由 helm 自己在畫面上拉，這裡略過）；到中心被困住
  if (hz.pull) {
    const d = pre.h.d; if (!w.hm && d > 0.01) { const a = Math.min(d, hz.pull * dep), vx = (z.x - p.x) / d, vy = (z.y - p.y) / d;
      if (r && p.moving) { r.x0 += vx * a; r.y0 += vy * a; } else if (!r) w.pos = { x: p.x + vx * a, y: p.y + vy * a }; }
    const q = r ? arkPos(w, tEnd) : w.pos; const u2 = Math.hypot(q.x - z.x, q.y - z.y) / z.r; const was = sz.tr;
    if (u2 < SZ.trapU) { if (r && pre.h.u >= SZ.trapU) { w.pos = { x: q.x, y: q.y }; w.route = null; e('trap', '\ue093 方舟被漩渦困在中心！重新規劃航線駛離（航速 ×0.4，越靠外越快）。', { zone: z.id }); } else if (!was) e('trap', '\ue093 方舟被漩渦困在中心！重新規劃航線駛離。', { zone: z.id }); sz.tr = 1; } else sz.tr = 0;
  }
  // 迷霧：航線慢慢偏航（只在深處、只在航行中）
  if (hz.drift && w.route && p.moving && dep > 0.25 && w.route.t1 - t > dt * 1.5) {
    const rr = w.route, q = arkPos(w, tEnd), ang = ((hash(seed, 'szd', ti) / U32) * 2 - 1) * hz.drift * Math.PI / 180 * dep / FS.scoutK; const ex = rr.x1 - q.x, ey = rr.y1 - q.y, c = Math.cos(ang), sn = Math.sin(ang);
    const nx = q.x + ex * c - ey * sn, ny = q.y + ex * sn + ey * c;
    if (insideWorld(nx, ny)) { rr.x0 = q.x; rr.y0 = q.y; rr.t0 = Math.max(rr.t0, Math.min(tEnd, rr.t1 - 1)); rr.x1 = nx; rr.y1 = ny; }
  }
  // 掉落（材料 / 稀有藍圖）
  if (dep > 0.15) {
    if (hash(seed, 'sz', z.id, ti) / U32 < SZ.tickMat * dep) {
      const qty = 1 + (hash(seed, 'szq', z.id, ti) % 4 === 0 ? 1 : 0); const m = f.mat || (f.mat = {}); const cur = m[z.mat] | 0; const add = Math.min(qty, SZ.matCap - cur);
      if (add > 0) { m[z.mat] = cur + add; const before = sz.d[z.id] | 0; sz.d[z.id] = before + add; if (before % 4 === 0) e('mat', `${MATERIALS[z.mat].icon} 打撈到「${MATERIALS[z.mat].name}」×${add}（共 ${m[z.mat]}）`, { zone: z.id, mat: z.mat }); }
    }
    if (hash(seed, 'szb', z.id, ti) / U32 < SZ.tickBp * dep) {
      const pool = z.bp.filter((b) => !f.bp[b]);
      if (pool.length) { const b = pool[hash(seed, 'szp', z.id, ti) % pool.length]; f.bp[b] = 1; sz.d.bp = (sz.d.bp | 0) + 1; e('bp', `\ue062 在${z.name}找到稀有藍圖：${PROMO_BP[b].name}！`, { zone: z.id, bp: b }); }
    }
  }
}

/** 手動駕駛（畫面）用：地圖座標 (x,y) 的海域效果。pull = 每秒往中心推的公尺數、vx/vy = 往中心的單位向量（場景座標 x→x、y→z）。 */
export function helmFx(f, x, y) {
  const h = zoneAtPoint(x, y); if (!h) return null; const hz = h.z.haz, dep = h.depth; const d = h.d || 1;
  return { id: h.id, z: h.z, depth: dep, u: h.u, speed: 1 - clamp((hz.slow || 0) * dep, 0, 0.9), pull: hz.pull ? hz.pull * dep / 60 / HELM_KU : 0, vx: (h.z.x - x) / d, vy: (h.z.y - y) / d, lost: hz.drift ? dep : 0, un: unprepK(f, h.z), trapped: !!(hz.pull && h.u < SZ.trapU) };
}

/** 手動駕駛：漩渦對船的總「向內」速度（公尺 / 秒，場景 x/z）。pull（向中心）+ push（局部漩渦場）合成後，總量不超過
 *  當下最高速（已含漩渦減速 / 天氣）的 SZ.pullCap（40%），所以每種船都能開出去，淨外向速度 ≥ 60% × vmaxEff。 */
export function whirlDrift(fx, push, vmaxEff) {
  if (!fx || !(fx.pull > 0)) return { x: 0, z: 0 }; let x = fx.vx * fx.pull + (push ? push.x : 0) * fx.depth, z = fx.vy * fx.pull + (push ? push.z : 0) * fx.depth;
  const cap = SZ.pullCap * Math.max(0, vmaxEff), m = Math.hypot(x, z); if (m > cap && m > 1e-9) { x *= cap / m; z *= cap / m; } return { x, z };
}
/** 漩渦救援（燃料不夠自己開出去時）：拖船把方舟拖到漩渦外緣；收 10 零件（不夠就收光）。只在漩渦裡、而且燃料不足以出航時可用。 */
export const RESCUE = { parts: 10, out: 1.04 };
function rescueGeo(s, nowSec) {
  const f = s.fleet, w = f && f.world; if (!w || !w.pos) return null; const p = arkPos(w, Math.max(s.simT, nowSec)); const h = zoneAtPoint(p.x, p.y); if (!h || h.id !== 'whirlpool') return null;
  const z = h.z, d = h.d || 0.01, ux = d > 0.5 ? (p.x - z.x) / d : 1, uy = d > 0.5 ? (p.y - z.y) / d : 0; let q = { x: z.x + ux * z.r * RESCUE.out, y: z.y + uy * z.r * RESCUE.out };
  if (!insideWorld(q.x, q.y)) q = { x: z.x - ux * z.r * RESCUE.out, y: z.y - uy * z.r * RESCUE.out };
  const dist = Math.hypot(q.x - p.x, q.y - p.y); return { w, p, q, need: dist * WORLD.fuelPerUnit + 15 };
}
export function rescueCan(s, nowSec) {
  const g = rescueGeo(s, nowSec); if (!g) return { ok: false, why: '只有在漩渦海域裡才需要救援' };
  if (s.res.fuel >= g.need) return { ok: false, why: '燃料夠，直接在海圖重新出航（或手動駕駛）就能開出去' }; return { ok: true, need: g.need };
}
/** 在漩渦裡出航失敗（燃料不足）時附加的提示；不在漩渦裡回傳 ''。 */
export function rescueHint(s, nowSec) {
  const g = rescueGeo(s, nowSec); if (!g) return ''; return rescueCan(s, nowSec).ok ? `——你在漩渦裡：可以呼叫拖船救援（\ue069${RESCUE.parts}，海圖側欄），把方舟拖到外緣${s.res.parts < RESCUE.parts ? `。零件不夠 ${RESCUE.parts}（只剩 ${Math.floor(s.res.parts)}）：救援最多只收你現有的零件，剩 0 也免費` : ''}` : `——你在漩渦裡：燃料夠開出外緣（需要 \ue049${Math.ceil(g.need)}），先手動駕駛出去再補給；真的開不出去才能呼叫拖船救援`;
}
export function rescueDo(s, nowSec) {
  const c = rescueCan(s, nowSec); if (!c.ok) return { ok: false, msg: c.why }; const g = rescueGeo(s, nowSec), f = s.fleet, w = f.world;
  const pay = Math.min(RESCUE.parts, Math.floor(s.res.parts)); s.res.parts -= pay; w.route = null; w.pos = { x: g.q.x, y: g.q.y }; w.hm = 0;
  const sz = ensureSz(w); sz.tr = 0; s.log.push({ t: Math.max(s.simT, nowSec), type: 'seazone', sub: 'rescue', text: `\ue05b 拖船把方舟拖出漩渦${pay ? `（花了 \ue069${pay}）` : ''}。` });
  return { ok: true, msg: `\ue05b 拖船把方舟拖出漩渦${pay ? `（花了 \ue069${pay}）` : ''}。補點燃料再出航吧。`, pay };
}

// ---------------------------------------------------------------- 古碑謎題（海上巨石陣中心；每個遊戲日一次，贏了掉古碑殘片、有機會掉科研 T3 藍圖）
export const PZ = { symbols: 6, len: 4, day: 86400 };
export const puzzleDay = (nowSec) => Math.floor(nowSec / PZ.day);
export const puzzleSeq = (s, day) => Array.from({ length: PZ.len }, (_, i) => hash(s.seed, 'pz', day, i) % PZ.symbols);
export function puzzleCan(s, nowSec) {
  const f = s.fleet, w = f && f.world; if (!w || !w.pos) return { ok: false, why: '還沒有世界地圖' };
  const p = arkPos(w, Math.max(s.simT, nowSec)); const h = zoneAtPoint(p.x, p.y); if (!h || h.id !== 'stonehenge' || h.depth < 0.3) return { ok: false, why: '要把方舟停在海上巨石陣裡面才能讀碑' };
  if (w.sz && w.sz.pz === puzzleDay(nowSec)) return { ok: false, why: '今天已經讀過古碑了，明天再來' };
  return { ok: true, day: puzzleDay(nowSec) };
}
/** 玩家解完（或失敗）謎題。input = 玩家依序點的符文（陣列）；在這裡對照當天的正確順序，不信任用戶端說「贏了」。每天只能一次（失敗也算）。 */
export function puzzleResolve(s, nowSec, input) {
  const c = puzzleCan(s, nowSec); if (!c.ok) return { ok: false, msg: c.why }; const seq = puzzleSeq(s, c.day); const won = Array.isArray(input) && input.length === seq.length && seq.every((v, i) => input[i] === v); const f = s.fleet, w = f.world, sz = ensureSz(w); sz.pz = c.day;
  if (!won) return { ok: true, won: false, msg: '\ue000 古碑沉默了…符文黯淡下去（今天不能再試）。' };
  const m = f.mat || (f.mat = {}); const add = Math.min(2, SZ.matCap - (m.rune | 0)); if (add > 0) { m.rune = (m.rune | 0) + add; sz.d.stonehenge = (sz.d.stonehenge | 0) + add; }
  let bp = null; if (!f.bp.bp_sci3 && hash(s.seed, 'pzb', c.day) / U32 < 0.25) { f.bp.bp_sci3 = 1; bp = 'bp_sci3'; sz.d.bp = (sz.d.bp | 0) + 1; }
  return { ok: true, won: true, rune: add, bp, msg: `\ue000 古碑亮起！獲得「古碑殘片」×${add}${bp ? `，還有稀有藍圖：${PROMO_BP[bp].name}！` : '。'}` };
}

/** 給 UI：目前所在海域 + 累計 */
export function seaStatus(s, nowSec) {
  const f = s.fleet, w = f && f.world; if (!w || !w.pos) return null; const p = arkPos(w, nowSec); const h = zoneAtPoint(p.x, p.y); return { p, h, un: h ? unprepared(f, h.z) : false, sz: w.sz || null, mat: f.mat || {}, mo: w.sz ? w.sz.mo : 0 };
}
export { SPECIAL_ZONES, SZ, SZ_ORDER, MAT_ORDER, MATERIALS, PROMO_BP, PROMO_BP_IDS, zoneAtPoint };
