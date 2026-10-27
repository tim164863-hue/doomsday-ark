// 船體設定：所有「船有多長、多寬、各層怎麼排」都集中在這裡。
// 日後換船型（艦隊）時，只要換一份 SHIP 設定即可。
//
// 佈局原本以「舊版 106 m 長船」的絕對座標手工擺放。為了縮短船身又不破壞既有房間：
//  - 舷側中段（sternEdge ~ bowEdge）原封不動（客艙、餐廳、辦公區、跑道、球場、樓梯、電梯）
//  - 船艉 / 船艏兩端的「景觀甲板」區域依 sternK / bowK 壓縮，裝飾座標經 ex() 重新對位
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
  ],
};

/** 舊版 x 座標 → 目前船體座標（中段不變，兩端壓縮） */
export function ex(x) {
  if (x < SHIP.sternEdge) return SHIP.sternEdge + (x - SHIP.sternEdge) * SHIP.sternK;
  if (x > SHIP.bowEdge) return SHIP.bowEdge + (x - SHIP.bowEdge) * SHIP.bowK;
  return x;
}
export const HULL_XS = ex(SHIP.legacy.xs), HULL_XB = ex(SHIP.legacy.xb);
export const HULL_TIP = HULL_XB + SHIP.bowLen;
export const SHIP_CX = (HULL_XS + HULL_TIP) / 2;     // 船體中心 x
export const SHIP_LEN = HULL_TIP - HULL_XS;
