// 特殊海域資料表（純資料 + 幾何，不依賴 world.js / three.js；世界、模擬、海圖、畫面共用）。設計見 DESIGN-expansion.md §2。
// 5 個固定位置的圓形海域：位置避開出生點環（半徑 800、各 130）。危害只在圓內生效，強度隨「深度」(0 邊緣 … 1 距邊緣 30% 以內) 平滑增加。
// 階段③（旗艦晉升）的材料 / 稀有藍圖 / 晉升配方也先定義在這裡（PROMO），階段③只需要讀。
import { clamp, tbl } from '../util.js';

/** 所有船體傷害（自然磨損 / 風暴 / 雷擊 / 海域 / 戰鬥）共用的保底：只把「高於 SZ.floor 的部分」扣掉，回傳實際扣掉的量；
 *  已經低於保底的船體不會被扣、也不會被抬高（修理才會讓它回升）。純函式式更新 s.cond，線上逐 tick = 離線補算。 */
export const hullDmg = (s, d) => { if (!(d > 0)) return 0; const b = s.cond, n = Math.max(Math.min(b, SZ.floor), b - d); s.cond = n; return b - n; };

export const SZ_ORDER = ['fog', 'whirlpool', 'fire', 'hell', 'stonehenge'];
export const SZ = {
  edge: 0.3,            // 深度 = (1 − 距離 / 半徑) / edge，上限 1
  floor: 20,            // 危害不會把船體打到這個百分比以下（離線 / 久停也不會直接沉船）
  unprep: 1.5,          // 沒達建議階級進入：船體傷害 / 士氣流失 ×1.5
  matCap: 99,           // 每種材料上限
  tickMat: 0.028,       // 每 tick 掉材料的機率（乘深度）
  tickBp: 0.0016,       // 每 tick 掉稀有藍圖的機率（乘深度）
  pullCap: 0.4,         // 手動駕駛：漩渦總拉力 ≤ 當下最高速的 40%（一定開得出去）
  helmMul: 3,           // 手動駕駛：在特殊海域裡，地圖座標的前進 ×3（畫面速度 / 碰撞 / 耗油不變），不然漩渦半徑 44 km 開不完
  trapU: 0.12,          // 漩渦：距中心 < 半徑 × 此值 = 被困住
  moCap: 100,           // 士氣流失上限
};

// haz：每 tick（遊戲 1 分鐘）的效果；slow = 航速減損（0..1）；pull = 向中心拉的地圖單位 / tick；hull = 船體 %；
// need = 進入條件（階段③）：hard = 未達就進不去（海圖出航 / 手動駕駛都擋）；非 hard（火焰）= 強條件：未達可以進、但危害 ×unprep。
//   tiers = 各分支要的最低階。注意解法順序：火焰的焰心鋼是戰艦 T1 要的、古碑殘片是科研 T2 要的，所以火焰 T0 可進（危害 ×3）、巨石陣科研 T1 就進得去。
export const SPECIAL_ZONES = tbl({
  fog: { id: 'fog', name: '迷霧海域', short: '迷霧', icon: '🌫', x: 620, y: 700, r: 90, color: '#c9d3dc', tint: [196, 208, 220],
    haz: { slow: 0.2, drift: 0.8, noReveal: true, mo: 0.15 }, mat: 'fogpearl', bp: ['bp_sci1', 'bp_sci2'], need: null,
    blurb: '能見度極低；海圖迷霧不會被揭開，航線會慢慢偏航；水手們有點發毛。' },
  whirlpool: { id: 'whirlpool', name: '漩渦海域', short: '漩渦', icon: '🌀', x: 1400, y: 640, r: 80, color: '#3fc7c0', tint: [48, 190, 188],
    haz: { slow: 0.6, pull: 0.22, hull: 0.05 }, mat: 'vortex', bp: ['bp_mer1', 'bp_mer2'], need: null,
    blurb: '被捲住：航速 ×0.4、一直往中心拉、船體受損；到了中心會被困住，要重新規劃航線駛離。' },
  fire: { id: 'fire', name: '火焰海域', short: '火焰', icon: '🔥', x: 1560, y: 1250, r: 85, color: '#ff8a3d', tint: [255, 128, 40],
    haz: { hull: 0.08, water: 0.25 }, mat: 'ember', bp: ['bp_war1', 'bp_war2'], need: { branches: ['war', 'sci'], tier: 1, tiers: { war: 1, sci: 1 }, hard: false, unprep: 3 },
    blurb: '海面起火：船體持續灼傷、飲水蒸發。建議戰艦或科研 T1 以上（耐熱）才進得去。' },
  hell: { id: 'hell', name: '地獄海域', short: '地獄', icon: '😈', x: 900, y: 1400, r: 70, color: '#c4223a', tint: [200, 24, 40],
    haz: { hull: 0.12, strike: 0.025, mo: 0.6 }, mat: 'hellstone', bp: ['bp_war3', 'bp_mer3', 'bp_sci3'], need: { branches: ['war', 'mer', 'sci'], tier: 2, tiers: { war: 2, sci: 2, mer: 2 }, hard: true },
    blurb: '岩漿與閃電：船體重傷、持續落雷、船員士氣一路下滑。建議 T2 以上旗艦。' },
  stonehenge: { id: 'stonehenge', name: '海上巨石陣', short: '巨石陣', icon: '🗿', x: 330, y: 1150, r: 75, color: '#9b8cc9', tint: [150, 130, 205],
    haz: { stuck: 1800, rock: 0.02, rockDmg: 1.2 }, mat: 'rune', bp: ['bp_sci3'], need: { branches: ['sci', 'war', 'mer'], tier: 1, tiers: { sci: 1, war: 2, mer: 2 }, hard: true },
    blurb: '石柱迷宮：自動航行進去會被卡住 +30 分鐘、可能撞上石柱；手動駕駛要穿過石柱；中心有古碑謎題。建議科研 T2 以上。' },
});

export const MAT_ORDER = ['fogpearl', 'vortex', 'ember', 'hellstone', 'rune'];
export const MATERIALS = tbl({
  fogpearl: { id: 'fogpearl', name: '迷霧珍珠', icon: '🫧', zone: 'fog' },
  vortex: { id: 'vortex', name: '渦流核心', icon: '🌀', zone: 'whirlpool' },
  ember: { id: 'ember', name: '焰心鋼', icon: '🔶', zone: 'fire' },
  hellstone: { id: 'hellstone', name: '煉獄晶', icon: '🔻', zone: 'hell' },
  rune: { id: 'rune', name: '古碑殘片', icon: '🪨', zone: 'stonehenge' },
});

// 稀有藍圖（旗艦晉升用；進 fleet.bp，與造船藍圖共用欄位）
export const PROMO_BP = tbl({
  bp_war1: { name: '戰艦 T1 藍圖', branch: 'war', tier: 1 }, bp_war2: { name: '戰艦 T2 藍圖', branch: 'war', tier: 2 }, bp_war3: { name: '戰艦 T3 藍圖', branch: 'war', tier: 3 },
  bp_mer1: { name: '商船 T1 藍圖', branch: 'mer', tier: 1 }, bp_mer2: { name: '商船 T2 藍圖', branch: 'mer', tier: 2 }, bp_mer3: { name: '商船 T3 藍圖', branch: 'mer', tier: 3 },
  bp_sci1: { name: '科研 T1 藍圖', branch: 'sci', tier: 1 }, bp_sci2: { name: '科研 T2 藍圖', branch: 'sci', tier: 2 }, bp_sci3: { name: '科研 T3 藍圖', branch: 'sci', tier: 3 },
});
export const PROMO_BP_IDS = Object.keys(PROMO_BP);

// 階段③資料：晉升需求（資源 + 藍圖 + 材料）。階段②不使用，只在測試裡確認每種材料 / 藍圖都有來源。
export const PROMO = tbl({
  war_1: { parts: 900, fuel: 300, food: 100, water: 80, bp: 'bp_war1', mat: { ember: 3 } },
  war_2: { parts: 1600, fuel: 500, food: 150, water: 120, bp: 'bp_war2', mat: { ember: 6, vortex: 2 } },
  war_3: { parts: 2600, fuel: 800, food: 220, water: 180, bp: 'bp_war3', mat: { ember: 10, hellstone: 3, vortex: 3 } },
  mer_1: { parts: 800, fuel: 250, food: 200, water: 120, bp: 'bp_mer1', mat: { vortex: 3 } },
  mer_2: { parts: 1500, fuel: 450, food: 320, water: 200, bp: 'bp_mer2', mat: { vortex: 6, fogpearl: 2 } },
  mer_3: { parts: 2400, fuel: 700, food: 500, water: 320, bp: 'bp_mer3', mat: { vortex: 10, hellstone: 3, rune: 2 } },
  sci_1: { parts: 800, fuel: 300, food: 150, water: 150, bp: 'bp_sci1', mat: { fogpearl: 3 } },
  sci_2: { parts: 1500, fuel: 500, food: 220, water: 250, bp: 'bp_sci2', mat: { fogpearl: 6, rune: 2 } },
  sci_3: { parts: 2400, fuel: 800, food: 320, water: 400, bp: 'bp_sci3', mat: { fogpearl: 10, rune: 6, hellstone: 3 } },
});

/** (x,y) 所在的特殊海域：{id,z,d,u,depth}（u = d / 半徑，depth 0 邊緣 … 1 深處）或 null */
export function zoneAtPoint(x, y) {
  for (const id of SZ_ORDER) { const z = SPECIAL_ZONES[id]; const d = Math.hypot(x - z.x, y - z.y); if (d < z.r) { const u = d / z.r; return { id, z, d, u, depth: clamp((1 - u) / SZ.edge, 0, 1) }; } }
  return null;
}
/** 線段 (x0,y0)→(x1,y1) 經過哪些特殊海域（海圖出航確認用）；回傳 id 陣列（依路徑順序） */
export function routeZones(x0, y0, x1, y1) {
  const out = []; const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1;
  for (const id of SZ_ORDER) { const z = SPECIAL_ZONES[id]; const t = clamp(((z.x - x0) * dx + (z.y - y0) * dy) / L2, 0, 1); const d = Math.hypot(x0 + dx * t - z.x, y0 + dy * t - z.y); if (d < z.r) out.push({ id, t }); }
  return out.sort((a, b) => a.t - b.t).map((o) => o.id);
}
/** 每個圓是否至少被揭開一格的判斷用：回傳圓內 / 邊緣附近的格子範圍（海圖用 reveal 位元圖） */
export const inZone = (id, x, y) => { const z = SPECIAL_ZONES[id]; return Math.hypot(x - z.x, y - z.y) < z.r; };
