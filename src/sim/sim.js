// 末日方舟 · 純函式式模擬核心（無 three.js / DOM / Date.now）
// 線上與離線共用同一個 step：狀態 + 「現在時間（秒）」→ 固定 60 秒一格 tick，每格亂數由 (seed, tickIndex) 決定，
// 因此「離線一次補算」與「線上逐格推進」結果完全相同。
import { TICK, MAX_OFFLINE, SAVE_VERSION, RES, RES_KEYS, USE, SHIP_FUEL_USE, LV_MULT, MAX_LV, FAC, FAC_ORDER, REPAIR_FAC_COST, REPAIR_HULL, START, STATUS_BONUS, TIERS, SITES, TASKS } from './defs.js';
import { hash, mulberry32 } from './rng.js';
import { fleetTick, tripBlueprint, grantBlueprint } from './fleet.js';
import { SHIPS } from './fleetdefs.js';

const r2 = (x) => Math.round(x * 100) / 100;
export const dayKey = (ts, tz) => Math.floor((ts + tz * 60) / 86400);
const zeroRes = () => ({ food: 0, water: 0, fuel: 0, parts: 0 });

export function newState(seed, nowSec, tz = 0) {
  const t = Math.floor(nowSec / TICK) * TICK;
  const s = {
    v: SAVE_VERSION, seed: seed >>> 0, tz, created: t, simT: t, lastSeen: nowSec,
    res: { ...START.res }, cond: START.cond, fac: {}, crew: {}, statusSnap: {}, trips: [], nextTripId: 1,
    daily: null, log: [], stats: { trips: 0, built: 0, shortages: 0 }, cdCheer: {}, cdChat: {}, shortageAt: -1e9,
  };
  for (const k of FAC_ORDER) s.fac[k] = { lv: START.facs[k] || 0, dmg: false };
  s.daily = makeDaily(s, dayKey(t, tz));
  return s;
}

export function makeDaily(s, dk) {
  const rnd = mulberry32(hash(s.seed, 'daily', dk));
  const pool = TASKS.map((t, i) => [rnd(), t, i]).sort((a, b) => a[0] - b[0]);
  const picked = []; const types = new Set();
  for (const [, t] of pool) { const k = t.type + (t.res || ''); if (types.has(t.type === 'produce' ? 'produce' : t.type)) continue; types.add(t.type === 'produce' ? 'produce' : t.type); picked.push(t); if (picked.length === 3) break; }
  return { day: dk, tasks: picked.map((t) => ({ type: t.type, res: t.res || null, target: t.target, text: t.text, reward: { ...t.reward }, progress: 0, claimed: false })) };
}

/** 同步目前船員名單與真實 bot 狀態快照（唯讀資料 → 只影響小幅產能加成） */
export function syncCrew(s, list, nowSec = 0) {
  const keys = [];
  for (const c of list) { keys.push(c.key); if (!s.crew[c.key]) s.crew[c.key] = { inj: 0, away: 0, sick: false }; s.statusSnap[c.key] = c.cat; }
  // 清掉不在名單內的舊紀錄（例如示範 / 虛擬船員名字殘留在存檔裡）；仍在出海或受傷中的保留，等他們回來。
  if (list.length) for (const k of Object.keys(s.crew)) {
    if (keys.includes(k)) continue; const c = s.crew[k];
    if (c.away || (c.inj || 0) > nowSec) continue;
    delete s.crew[k]; delete s.statusSnap[k]; if (s.cdCheer) delete s.cdCheer[k]; if (s.cdChat) delete s.cdChat[k];
  }
  return s;
}
export function crewKeys(s) { return Object.keys(s.crew).sort(); }
/** 設施 → 駐守船員（依名稱排序、固定對應）；出海或受傷者不算 */
export function staffOf(s) {
  const keys = crewKeys(s); const out = {};
  FAC_ORDER.forEach((f, i) => { out[f] = keys.length ? keys[i % keys.length] : null; });
  return out;
}
export function staffBonus(s, f, nowSec) {
  const k = staffOf(s)[f]; if (!k) return 0; const c = s.crew[k]; if (!c || c.away || c.inj > nowSec) return 0;
  return STATUS_BONUS[s.statusSnap[k]] || 0;
}
export function rates(s, nowSec = s.simT) {
  const out = { food: 0, water: 0, fuel: 0, parts: 0, cons: { food: 0, water: 0, fuel: 0 } };
  const n = Object.keys(s.crew).length + 1;
  const power = s.res.fuel > 0 ? 1 : 0.6; const cf = s.cond < 30 ? 0.8 : 1;
  for (const f of FAC_ORDER) {
    const F = FAC[f], st = s.fac[f]; if (!F.res || !st.lv) continue;
    const bonus = staffBonus(s, f, nowSec);
    out[F.res] += F.base * LV_MULT[st.lv] * (st.dmg ? 0.5 : 1) * (1 + bonus) * (f === 'generator' ? 1 : power) * cf;
  }
  out.cons.food = USE.food * n; out.cons.water = USE.water * n; out.cons.fuel = USE.fuel * n + SHIP_FUEL_USE;
  return out;
}

function addRes(s, k, v, rep) { // 加資源（受上限），回傳實際增加量
  const cap = RES[k].cap; const before = s.res[k]; s.res[k] = Math.min(cap, s.res[k] + v); const d = s.res[k] - before;
  if (rep && d > 0) rep.produced[k] += d; return d;
}
function pushEvent(s, rep, ev) { s.log.push(ev); if (s.log.length > 60) s.log.shift(); if (rep) rep.events.push(ev); }

function ensureDay(s, dk, rep) {
  if (!s.daily || s.daily.day !== dk) { s.daily = makeDaily(s, dk); if (rep) rep.newDay = true; }
}

/** 單一 tick（時間區間 (t, t+TICK]） */
export function stepTick(s, t, rep) {
  const tEnd = t + TICK; const ti = t / TICK; const rnd = mulberry32(hash(s.seed, 'tick', ti));
  ensureDay(s, dayKey(tEnd, s.tz), rep);
  // 1. 出海返航
  for (const tr of s.trips.filter((x) => x.end <= tEnd).sort((a, b) => a.end - b.end || a.id - b.id)) resolveTrip(s, tr, tEnd, rep);
  s.trips = s.trips.filter((x) => x.end > tEnd);
  fleetTick(s, t, tEnd, rep);   // 艦隊：建造 / 返航 / 閒置自動出航（s.fleet 不存在時什麼都不做）
  // 2. 生產 / 消耗
  const r = rates(s, tEnd); const n = Object.keys(s.crew).length + 1;
  for (const k of RES_KEYS) if (r[k] > 0) { const d = addRes(s, k, r[k], rep); trackProd(s, k, d); }
  let short = false;
  for (const k of ['food', 'water', 'fuel']) { const need = r.cons[k]; const have = s.res[k]; const used = Math.min(need, have); s.res[k] -= used; if (rep) rep.consumed[k] += used; if (used < need - 1e-9 && k !== 'fuel') short = true; }
  // 工坊修復船體（耗零件）
  const wk = s.fac.workshop; if (wk.lv && s.res.parts >= 0.1 && s.cond < 100) { const g = 0.05 * LV_MULT[wk.lv] * (wk.dmg ? 0.5 : 1); s.res.parts -= 0.1; if (rep) rep.consumed.parts += 0.1; s.cond = Math.min(100, s.cond + g); }
  s.cond = Math.max(0, s.cond - (short ? 0.06 : 0.01));
  if (short && tEnd - s.shortageAt > 6 * 3600) { s.shortageAt = tEnd; s.stats.shortages++; pushEvent(s, rep, { t: tEnd, type: 'shortage', text: s.res.food <= 0 ? '食物見底了，大家餓著肚子工作…' : '飲水用完了，船員口渴難耐…' }); }
  // 3. 受傷復原
  for (const k of Object.keys(s.crew)) { const c = s.crew[k]; if (c.inj && c.inj <= tEnd) { c.inj = 0; c.sick = false; pushEvent(s, rep, { t: tEnd, type: 'recover', who: k, text: `${k} 傷勢痊癒，回到崗位。` }); } }
  // 4. 隨機事件（新手 3 小時內不會有壞事）
  const safe = tEnd - s.created < 3 * 3600; const roll = rnd(); const pick = rnd(); const amt = rnd();
  if (roll < 0.0030) { const p = 6 + Math.floor(amt * 9); addRes(s, 'parts', p, rep); pushEvent(s, rep, { t: tEnd, type: 'crate', text: `海面漂來一箱補給：零件 +${p}。` }); }
  else if (roll < 0.0050) { addRes(s, 'water', 25, rep); pushEvent(s, rep, { t: tEnd, type: 'rain', text: '一場驟雨，接水桶滿了：飲水 +25。' }); }
  else if (!safe && roll < 0.0062) {
    const loss = 5 + Math.floor(amt * 4); s.cond = Math.max(0, s.cond - loss); const built = FAC_ORDER.filter((f) => s.fac[f].lv && !s.fac[f].dmg); let txt = `風暴來襲，船體受損 −${loss}%`;
    if (built.length) { const f = built[Math.floor(pick * built.length)]; s.fac[f].dmg = true; txt += `，${FAC[f].name}故障。`; } else txt += '。';
    pushEvent(s, rep, { t: tEnd, type: 'storm', text: txt });
  } else if (!safe && roll < 0.0070) {
    const ks = crewKeys(s).filter((k) => !s.crew[k].away && !s.crew[k].inj);
    if (ks.length) { const k = ks[Math.floor(pick * ks.length)]; const dur = injDur(s, 30 * 60); s.crew[k].inj = tEnd + dur; s.crew[k].sick = true; if (rep) rep.injuries.push(k); pushEvent(s, rep, { t: tEnd, type: 'sick', who: k, text: `${k} 突然發燒，需要休養。` }); }
  }
  s.simT = tEnd;
}
function trackProd(s, k, d) { if (!s.daily) return; for (const t of s.daily.tasks) if (t.type === 'produce' && t.res === k) t.progress += d; }
const injDur = (s, base) => Math.round(base / (1 + 0.6 * (s.fac.infirmary.lv || 0)));

/** 推進到 now（秒）。回傳報告。超過 48 小時的部分直接略過（cap）。 */
export function simulateTo(s, nowSec) {
  const rep = { from: s.simT, to: s.simT, ticks: 0, capped: false, produced: zeroRes(), consumed: zeroRes(), events: [], injuries: [], trips: [], newDay: false };
  s.lastSeen = Math.max(s.lastSeen || 0, nowSec);
  const target = Math.floor(nowSec / TICK) * TICK;
  if (target <= s.simT) return rep;
  if (target - s.simT > MAX_OFFLINE) { s.simT = target - MAX_OFFLINE; rep.capped = true; rep.from = s.simT; }
  let t = s.simT; while (t + TICK <= target) { stepTick(s, t, rep); t += TICK; rep.ticks++; }
  rep.to = s.simT; return rep;
}

// ----------------------------------------------------------------- 出海
export function tripPlan(s, siteId, crew, startSec) {
  const site = SITES.find((x) => x.id === siteId); const tier = TIERS[site.tier]; const id = s.nextTripId;
  const rnd = mulberry32(hash(s.seed, 'trip', id));
  const n = crew.length; const mult = 1 + 0.25 * (n - 1);
  const fail = rnd() < tier.risk * 0.6;
  const total = tier.units * mult * (0.75 + rnd() * 0.5) * (fail ? 0.3 : 1);
  const res = zeroRes(); let wsum = 0; for (const k in site.w) wsum += site.w[k];
  for (const k in site.w) res[k] = Math.round(total * site.w[k] / wsum);
  let bonus = null; if (site.tier >= 1 && !fail && rnd() < (site.tier === 1 ? 0.15 : 0.35)) { const p = site.tier === 1 ? 20 : 55; res.parts += p; bonus = '意外找到一批完好的機械零件'; }
  const injured = []; for (const k of crew) if (rnd() < tier.risk * (fail ? 1.4 : 1)) injured.push(k);
  const bpFind = tripBlueprint(s, id, site.tier, fail);
  return { id, site: siteId, tier: site.tier, crew: crew.slice(), start: startSec, end: startSec + tier.min * 60, res, injured, fail, bonus, bpFind };
}
function resolveTrip(s, tr, tEnd, rep) {
  const site = SITES.find((x) => x.id === tr.site);
  for (const k of RES_KEYS) if (tr.res[k]) { const d = addRes(s, k, tr.res[k], rep); trackProd(s, k, d); }
  for (const k of tr.crew) { const c = s.crew[k]; if (!c) continue; c.away = 0; }
  for (const k of tr.injured) { const c = s.crew[k]; if (!c) continue; c.inj = tEnd + injDur(s, TIERS[tr.tier].injMin * 60); if (rep) rep.injuries.push(k); }
  const gains = RES_KEYS.filter((k) => tr.res[k]).map((k) => `${RES[k].icon}${tr.res[k]}`).join(' ');
  const gotBp = tr.bpFind && grantBlueprint(s, tr.bpFind);
  const text = (tr.fail ? `出海失利：${site.name}幾乎空手而歸（${gains}）` : `${site.name}探索完成：${gains}`) + (tr.bonus ? `，${tr.bonus}` : '') + (gotBp ? `，還發現「${SHIPS[tr.bpFind].name}」藍圖！` : '') + (tr.injured.length ? `。${tr.injured.join('、')} 受傷了。` : '。');
  const ev = { t: tEnd, type: 'trip', trip: tr.id, who: tr.crew[0], text, fail: tr.fail, injured: tr.injured.slice() };
  pushEvent(s, rep, ev); if (rep) rep.trips.push({ ...tr, text });
}

// ----------------------------------------------------------------- 玩家行動（以 T董 為主體；皆為純遊戲內效果）
const canPay = (s, c) => Object.keys(c).every((k) => s.res[k] >= c[k]);
const pay = (s, c) => { for (const k in c) s.res[k] -= c[k]; };
const bumpTask = (s, type, n = 1) => { if (!s.daily) return; for (const t of s.daily.tasks) if (t.type === type) t.progress += n; };
export const costText = (c) => Object.keys(c).map((k) => `${RES[k].icon}${c[k]}`).join(' ');
export function nextCost(s, f) { const st = s.fac[f]; return st.lv >= MAX_LV ? null : FAC[f].cost[st.lv]; }

export function build(s, f) {
  const st = s.fac[f]; if (!st) return { ok: false, msg: '沒有這個設施' }; if (st.lv >= MAX_LV) return { ok: false, msg: '已是最高等級' };
  if (st.dmg) return { ok: false, msg: '設施故障中，請先修理' };
  const c = FAC[f].cost[st.lv]; if (!canPay(s, c)) return { ok: false, msg: '資源不足：需要 ' + costText(c) };
  pay(s, c); st.lv++; s.stats.built++; bumpTask(s, 'build');
  const first = st.lv === 1; const text = first ? `建造完成：${FAC[f].name}` : `${FAC[f].name} 升到 Lv${st.lv}`; const ev = { t: s.simT, type: 'build', fac: f, text }; s.log.push(ev);
  return { ok: true, msg: text, first, ev };
}
export function repairFac(s, f) {
  const st = s.fac[f]; if (!st || !st.dmg) return { ok: false, msg: '不需要修理' }; if (!canPay(s, REPAIR_FAC_COST)) return { ok: false, msg: '零件不足：需要 ' + costText(REPAIR_FAC_COST) };
  pay(s, REPAIR_FAC_COST); st.dmg = false; bumpTask(s, 'repair'); return { ok: true, msg: `${FAC[f].name} 修好了` };
}
export function repairHull(s) {
  if (s.cond >= 99) return { ok: false, msg: '船體狀況良好' }; const c = { parts: REPAIR_HULL.parts }; if (!canPay(s, c)) return { ok: false, msg: '零件不足：需要 ' + costText(c) };
  pay(s, c); s.cond = Math.min(100, s.cond + REPAIR_HULL.gain); bumpTask(s, 'repair'); return { ok: true, msg: `船體整修完成 +${REPAIR_HULL.gain}%` };
}
export function availableCrew(s, nowSec) { return crewKeys(s).filter((k) => !s.crew[k].away && s.crew[k].inj <= nowSec); }
export function startTrip(s, siteId, crew, nowSec) {
  const site = SITES.find((x) => x.id === siteId); if (!site) return { ok: false, msg: '未知地點' };
  if (!crew.length || crew.length > 3) return { ok: false, msg: '請派 1–3 位船員' };
  const av = availableCrew(s, nowSec); if (!crew.every((k) => av.includes(k))) return { ok: false, msg: '有船員無法出海（受傷或已在外）' };
  const fuel = 3 + site.tier * 4; if (s.res.fuel < fuel) return { ok: false, msg: `燃料不足：需要 ⛽${fuel}` };
  const startSec = Math.floor(nowSec / TICK) * TICK > s.simT ? nowSec : s.simT; // 出海時間點以模擬時間為準，避免回溯
  s.res.fuel -= fuel; const tr = tripPlan(s, siteId, crew, Math.max(s.simT, startSec)); s.nextTripId++; s.trips.push(tr);
  for (const k of crew) s.crew[k].away = tr.id; s.stats.trips++; bumpTask(s, 'trip');
  return { ok: true, msg: `出發前往：${site.name}`, trip: tr, fuel };
}
export function cheer(s, key, nowSec) {
  if ((s.cdCheer[key] || 0) > nowSec) return { ok: false, msg: '剛剛才打過氣，讓他休息一下', wait: Math.ceil(s.cdCheer[key] - nowSec) };
  s.cdCheer[key] = nowSec + 180; bumpTask(s, 'cheer'); return { ok: true, msg: `你為 ${key} 打氣！` };
}
export function chat(s, key, nowSec) {
  if ((s.cdChat[key] || 0) > nowSec) return { ok: true, msg: '', again: true };
  s.cdChat[key] = nowSec + 120; bumpTask(s, 'chat'); return { ok: true, msg: '' };
}
export function claimTask(s, i) {
  const t = s.daily.tasks[i]; if (!t || t.claimed || t.progress < t.target) return { ok: false, msg: '尚未完成' };
  t.claimed = true; for (const k in t.reward) addRes(s, k, t.reward[k]); return { ok: true, msg: '已領取：' + costText(t.reward) };
}

/** 離線報告的摘要（給 UI 與測試用） */
export function summarize(rep) {
  const net = {}; for (const k of RES_KEYS) net[k] = r2(rep.produced[k] - rep.consumed[k]);
  return { hours: r2((rep.to - rep.from) / 3600), produced: Object.fromEntries(RES_KEYS.map((k) => [k, Math.round(rep.produced[k])])), consumed: Object.fromEntries(RES_KEYS.map((k) => [k, Math.round(rep.consumed[k])])), net, events: rep.events.length, injuries: [...new Set(rep.injuries)], trips: rep.trips.length };
}
