// 船體設定：所有「船有多長、多寬、各層怎麼排」都集中在這裡。
// 日後換船型（艦隊）時，只要換一份 SHIP 設定即可。
//
// 佈局原本以「舊版 106 m 長船」的絕對座標手工擺放。為了縮短船身又不破壞既有房間：
//  - 舷側中段（sternEdge ~ bowEdge）原封不動（客艙、餐廳、辦公區、跑道、球場、樓梯、電梯）
//  - 船艉 / 船艏兩端的「景觀甲板」區域依 sternK / bowK 壓縮，裝飾座標經 ex() 重新對位
import { FLAG_ROWS } from '../sim/promo.js';
const OWN = (o, k) => Object.prototype.hasOwnProperty.call(o, k);   // config.js 保持零相依

// 旗艦階級（階段③）：船身長度 / 甲板數在「開機時」依階級決定（升階完成後存好、重新載入一次），所以下面的常數都是 module 載入時算好的。
// 階級來源：?tier=war_2（預覽用，不寫入）> localStorage 'ark.tier'（play.js 的 tierSync 依存檔寫入）> 基礎船。
export const TIER_KEY = 'ark.tier';
function readTier() {
  // ?tier= 只有開發版（vite dev）有效；localStorage 的值要在資料表裡才算數，壞掉的值直接清掉（自我修復）。FLAG_ROWS 是無原型物件，所以 'constructor' / '__proto__' 也查不到。
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) { const q = new URLSearchParams(location.search).get('tier'); if (q && OWN(FLAG_ROWS, q)) return { id: q, preview: true }; }
    const v = localStorage.getItem(TIER_KEY); if (v != null) { if (OWN(FLAG_ROWS, v)) return { id: v, preview: false }; localStorage.removeItem(TIER_KEY); }
  } catch (e) { /* node / 無 storage */ }
  return { id: 'ark_t0', preview: false };
}
const _T = readTier();
export const CUR_TIER = _T.id, TIER_PREVIEW = _T.preview;
export const TIER = (() => { const r = FLAG_ROWS[CUR_TIER], T0 = FLAG_ROWS.ark_t0; const ext = (r.len - T0.len) / 2; const t = r.tier; return { id: r.id, branch: r.branch, tier: t, decks: r.decks, len: r.len, ext, gap: Math.max(0, ext - 2 * t), endK: 0.4 + 0.2 * t, lenK: r.len / T0.len }; })();

export const NDECK = TIER.decks, TOP = TIER.decks - 1;   // 甲板數 / 最頂層編號（5 / 6 / 7 / 8 層）

export const SHIP = {
  name: '方舟號',
  hz: 13.6,               // 半寬（m）
  keelY: -4.8,
  bowLen: 10,             // 船艏尖端長度（舊版 14）
  legacy: { xs: -46, xb: 46, bl: 14 },   // 舊版座標系的船體（佈局以此為基準）
  sternEdge: -36, sternK: 0.4,           // x < sternEdge 的區域壓縮係數
  bowEdge: 38, bowK: 0.4,                // x > bowEdge 的區域壓縮係數
  hullDecks: 2,           // 1F、2F 在船殼內；3F 為主甲板
  deckH: 3.7, baseY: 1.4,
  decks: [                // 各層外形（舊版座標，會經 ex() 轉換）；寬度 hz
    { name: '1F 員工生活層', xs: -45.9, xb: 45.9, hz: 12.8 },
    { name: '2F 運動健康層', xs: -45.9, xb: 45.9, hz: 13.3 },
    { name: '3F 會議工作層', xs: -45.7, xb: 45.7, hz: 13.5 },
    { name: '4F 娛樂休閒層', xs: -28, xb: 28, hz: 9, bl: 8 },
    { name: '5F 辦公天台層', xs: -22, xb: 27, hz: 7.5, bl: 6 },
    // 6F–8F：晉升後的塔樓（樓梯 / 電梯沿用同一組座標，所以都得蓋住 x 10.7–25.5、z ±6.8）
    { name: '6F', xs: 8, xb: 29, hz: 7.3, bl: 2.2 },
    { name: '7F', xs: 9.5, xb: 29, hz: 7.1, bl: 2.2 },
    { name: '8F', xs: 10, xb: 29, hz: 6.9, bl: 2.2 },
  ],
};

/** 舊版 x 座標 → 目前船體座標（中段不變，兩端壓縮） */
export function ex(x) {   // 階級越高：兩端的景觀裝飾越不壓縮（endK 0.4→1.0），再往外推出 gap 公尺的「加長段」
  if (x < SHIP.sternEdge) return SHIP.sternEdge - TIER.gap + (x - SHIP.sternEdge) * TIER.endK;
  if (x > SHIP.bowEdge) return SHIP.bowEdge + TIER.gap + (x - SHIP.bowEdge) * TIER.endK;
  return x;
}
/** 加長段（兩端中段與裝飾之間）：[stern x0,x1], [bow x0,x1]；沒有升階 = 空 */
export const ANNEX = TIER.gap > 0.5 ? { stern: [SHIP.sternEdge - TIER.gap, SHIP.sternEdge], bow: [SHIP.bowEdge, SHIP.bowEdge + TIER.gap] } : null;
export const HULL_XS = ex(SHIP.legacy.xs), HULL_XB = ex(SHIP.legacy.xb);
export const HULL_TIP = HULL_XB + SHIP.bowLen;
export const SHIP_CX = (HULL_XS + HULL_TIP) / 2;     // 船體中心 x
export const SHIP_LEN = HULL_TIP - HULL_XS;
