// 天氣與氣候（純函式、決定性）：天氣 = f(地圖種子, 遊戲時間, 地圖位置)。不依賴 three.js / DOM，離線補算與線上推進結果一致。
// 設計見 DESIGN-expansion.md §1。畫面上的粒子 / 閃電形狀只是裝飾；進度只看這裡。
import { hash } from './rng.js';
import { WORLD } from './fleetdefs.js';
import { RES } from './defs.js';
import { SPAWNS, arkPos } from './world.js';
import { resCap, flagStats } from './promo.js';
import { clamp, smoothstep } from '../util.js';

export const WX = {
  bucket: 3 * 3600, cell: 400,                 // 每 3 遊戲小時 × 每 400×400 地圖區塊一組天氣
  coldFrom: 560, coldFull: 940,                 // |y−1000| 從 560 開始變冷，940 = 極點
  snowCold: 0.35,                               // cold ≥ 此值，降水變成雪
  circle: 0.5,                                  // cold ≥ 此值 = 極圈
  shelterIn: 90, shelterOut: 180,               // 出生點避風半徑
  hullStorm: 0.02,                              // 暴風每 tick 船體損傷（%）
  strikeDiv: 180, strikeDmg: 2.5,                // 雷擊：每 tick 機率 i/180，船體 −2.5%
  slowSnow: 0.30, slowStorm: 0.15,              // 航速減損（乘強度）
  fuelCold: 0.02,                               // 暖氣耗油 / tick（乘 cold）
  fuelReserve: 20, fuelWarn: 40,                // 暖氣只會把燃料耗到保留量（讓方舟一定走得出極地）；低於警告值會提示
  rainWater: 0.1,                               // 接雨水 / tick
  auroraNight: 0.45, auroraGift: 0.004,         // 每晚出現機率；每 tick 恩賜機率
  luckBp: 1.5, luckHaul: 1.15,   // 極光：藍圖機率 ×1.5、任務收穫 ×1.15（DESIGN-expansion.md 同步）
};
const SEED = 20261029;
const U32 = 4294967296;
const C = WORLD.c;

export const shelterAt = (x, y) => { let d = 1e9; for (const p of SPAWNS) d = Math.min(d, Math.hypot(x - p.x, y - p.y)); return 1 - smoothstep(WX.shelterIn, WX.shelterOut, d); };
/** 緯度冷度（0 溫帶 … 1 極點），不含避風 */
export const coldRaw = (x, y) => smoothstep(WX.coldFrom, WX.coldFull, Math.abs(y - C));
/** 實際冷度（出生點避風會降低） */
export const coldAt = (x, y) => coldRaw(x, y) * (1 - 0.8 * shelterAt(x, y));
/** 'north' | 'south' | null（極圈） */
export const polarAt = (x, y) => (coldRaw(x, y) >= WX.circle ? (y < C ? 'north' : 'south') : null);

export const KINDS = {
  clear: { icon: '☀️', name: '晴朗' }, cloudy: { icon: '⛅', name: '多雲' }, rain: { icon: '🌧', name: '下雨' },
  storm: { icon: '⛈', name: '暴風雨' }, snow: { icon: '🌨', name: '下雪' }, blizzard: { icon: '❄️', name: '暴風雪' }, aurora: { icon: '🌌', name: '極光' },
};

/** 遊戲時間 t（秒）、地圖位置 (x,y) 的天氣。回傳新物件。 */
export function weatherAt(t, x, y) {
  const b = Math.floor(t / WX.bucket), frac = t / WX.bucket - b;
  const cx = Math.floor(x / WX.cell), cy = Math.floor(y / WX.cell);
  const craw = coldRaw(x, y), shelter = shelterAt(x, y), cold = craw * (1 - 0.8 * shelter);
  const u = hash(SEED, 'wx', cx, cy, b) / U32;
  const pStorm = 0.14 + 0.06 * craw, pPrec = 0.14 + 0.26 * craw, pCloud = 0.20 - 0.05 * craw;
  let kind = 'clear'; if (u < pStorm) kind = 'storm'; else if (u < pStorm + pPrec) kind = craw >= WX.snowCold ? 'snow' : 'rain'; else if (u < pStorm + pPrec + pCloud) kind = 'cloudy';
  const snowy = craw >= WX.snowCold && (kind === 'storm' || kind === 'snow');
  let i = 1; if (kind === 'storm' || kind === 'rain' || kind === 'snow') i = smoothstep(0, 0.12, frac) * smoothstep(1, 0.88, frac) * (1 - 0.9 * shelter);
  const h = (t / 3600) % 24, night = h >= 12;
  // 極光：極圈、夜晚、天空沒降水；每晚（每半球）45%
  let aur = 0;
  if (craw >= 0.55 && night && (kind === 'clear' || kind === 'cloudy')) {
    const d = Math.floor(t / 86400), nf = (h - 12) / 12;
    if (hash(SEED, 'aur', d, y < C ? 0 : 1) / U32 < WX.auroraNight) aur = smoothstep(0.55, 0.8, craw) * smoothstep(0, 0.08, nf) * smoothstep(1, 0.92, nf);
  }
  const temp = tempOf(cold, night, kind);
  return { kind, snowy, i, cold, craw, shelter, night, aur, temp, polar: polarAt(x, y), show: kind === 'storm' ? (snowy ? 'blizzard' : 'storm') : kind === 'snow' ? 'snow' : (aur > 0.3 ? 'aurora' : kind) };
}

/** 氣溫（°C）：冷度、夜晚、暴風 */
export const tempOf = (cold, night, kind) => Math.round(26 - 44 * cold - (night ? 3 : 0) - (kind === 'storm' ? 2 : 0));

/** 天氣對遊戲的效果（每 60 s tick）。純函式。 */
export function effectsOf(wx) {
  const st = wx.kind === 'storm' ? wx.i : 0, sn = wx.snowy ? wx.i : 0;
  const lucky = wx.aur > 0.3;
  return {
    slow: clamp(WX.slowSnow * sn + WX.slowStorm * st, 0, 0.6), hull: WX.hullStorm * st, strike: st / WX.strikeDiv,
    fuel: WX.fuelCold * wx.cold, water: wx.kind === 'rain' ? WX.rainWater * wx.i : 0, lucky,
    luckBp: lucky ? WX.luckBp : 1, luckHaul: lucky ? WX.luckHaul : 1, dmgMult: 1 + 0.5 * st, timeMult: 1 + 0.2 * sn,
  };
}
/** 手動駕駛用：最大速度倍率、耗油倍率 */
export const helmFactor = (wx, f) => { const e = effectsOf(wx); const c = f ? flagStats(f).cold : 0; return { speed: 1 - e.slow * (1 - 0.5 * c), fuel: 1 + 0.5 * wx.cold * (1 - c) }; };

/** 方舟當前位置的天氣（t 秒） */
export function arkWeather(s, t) { const w = s.fleet && s.fleet.world; if (!w || !w.pos) return null; const p = arkPos(w, t); return weatherAt(t, p.x, p.y); }

const NOTE = { storm: '⛈ 暴風雨來襲，船體會受損，雷擊危險！', blizzard: '❄️ 暴風雪來襲：航速下降、船體受損。', snow: '🌨 下雪了，航速變慢。', aurora: '🌌 極光出現！運氣提升（藍圖機率 ×1.5、收穫 ×1.15）。' };
/** 每個 tick（sim.stepTick，在 worldTick 之前）：暴風 / 雷擊 / 雪的減速 / 暖氣耗油 / 雨水 / 極光恩賜。s.fleet.world 不存在 → 什麼都不做。 */
export function weatherTick(s, t, tEnd, ev, xslow = 0) { // xslow = 特殊海域的額外減速（seazones.seaPre），跟天氣減速相乘合併
  const f = s.fleet, w = f && f.world; if (!w || !w.pos) return;
  const p = arkPos(w, t), wx = weatherAt(tEnd, p.x, p.y), E = effectsOf(wx), ti = Math.round(t / 60);
  { const FS = flagStats(f); if (FS.tier) { E.slow *= 1 - 0.5 * FS.cold; E.hull *= FS.armorMul; E.fuel *= 1 - FS.cold; E.strikeK = FS.armorMul; } }   // 旗艦階級：裝甲減船體傷害、抗寒減耗油 / 減速
  const st = w.wx && typeof w.wx === 'object' ? w.wx : (w.wx = { k: 'clear', hits: 0, storm: 0, snow: 0, aur: 0, polar: 0 });
  const dt = tEnd - t;
  // 雪 / 暴風減速：在 tEnd 重設航線起點（位置只前進 (1−slow) 的距離），終點時間順延；之後速度不變
  const r = w.route;
  const slow = 1 - (1 - E.slow) * (1 - xslow);
  if (r && p.moving && slow > 0.001 && r.t1 - t > dt * 1.5) {
    const rem = r.t1 - t, v = 1 / rem, adv = (1 - slow) * dt * v; r.x0 = p.x + (r.x1 - p.x) * adv; r.y0 = p.y + (r.y1 - p.y) * adv; r.t0 = tEnd; r.t1 = r.t1 + slow * dt;
  }
  if (E.hull) s.cond = Math.max(0, s.cond - E.hull);
  if (E.strike && hash(s.seed, 'wxl', ti) / U32 < E.strike) { const sd = WX.strikeDmg * (E.strikeK || 1); s.cond = Math.max(0, s.cond - sd); st.hits = (st.hits | 0) + 1; ev && ev({ t: tEnd, type: 'weather', sub: 'lightning', text: `雷擊！船體 −${+sd.toFixed(1)}%` }); }
  if (E.fuel) { const f0 = s.res.fuel; if (f0 > WX.fuelReserve) s.res.fuel = Math.max(WX.fuelReserve, f0 - E.fuel); const f1 = s.res.fuel; // 低油量提示（只在跨過門檻的那一刻，沒有額外存檔欄位）
    if (ev && f0 >= WX.fuelWarn && f1 < WX.fuelWarn) ev({ t: tEnd, type: 'weather', sub: 'lowfuel', text: `⛽ 燃料只剩 ${Math.floor(f1)}：極地暖氣耗油，儲備 ${WX.fuelReserve} 以下暖氣不再耗油。請盡快補給或駛離極地！` }); }
  if (E.water) s.res.water = Math.min(resCap(s, 'water'), s.res.water + E.water);
  if (wx.kind === 'storm' && wx.i > 0.3) st.storm = (st.storm | 0) + 1; else if (wx.snowy && wx.kind === 'snow' && wx.i > 0.3) st.snow = (st.snow | 0) + 1;
  if (E.lucky) { st.aur = (st.aur | 0) + 1; if (hash(s.seed, 'wxa', ti) / U32 < WX.auroraGift) { const r2 = hash(s.seed, 'wxg', ti); const n = 6 + (r2 % 7); const k = r2 & 1 ? 'parts' : 'fuel'; s.res[k] = Math.min(resCap(s, k), s.res[k] + n); ev && ev({ t: tEnd, type: 'weather', sub: 'aurora', text: `極光恩賜：${k === 'parts' ? '零件' : '燃料'} +${n}` }); } }
  const key = wx.show === 'storm' || wx.show === 'blizzard' || wx.show === 'snow' || wx.show === 'aurora' ? (wx.i > 0.35 || wx.show === 'aurora' ? wx.show : 'clear') : 'clear';
  if (key !== st.k) { st.k = key; if (NOTE[key]) ev && ev({ t: tEnd, type: 'weather', sub: key, text: NOTE[key] }); }
  const pol = wx.polar === 'north' ? 1 : wx.polar === 'south' ? 2 : 0; if (pol && !(st.polar & pol)) { st.polar |= pol; ev && ev({ t: tEnd, type: 'weather', sub: 'polar', text: pol === 1 ? '🐻‍❄️ 抵達北極圈：冰山、北極熊，氣溫驟降。' : '🐧 抵達南極圈：冰山、企鵝，氣溫驟降。' }); }
}
