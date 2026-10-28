// 末日方舟 · 玩法常數（純資料；不依賴 three.js / DOM，離線模擬與測試共用）
import { tbl } from '../util.js';
export const TICK = 60;                 // 模擬時間粒度：1 分鐘
export const MAX_OFFLINE = 48 * 3600;   // 離線補算上限：48 小時
export const SAVE_VERSION = 1;

export const RES = tbl({
  food: { name: '食物', icon: '🍖', cap: 500 },
  water: { name: '飲水', icon: '💧', cap: 500 },
  fuel: { name: '燃料', icon: '⛽', cap: 400 },
  parts: { name: '零件', icon: '🔩', cap: 400 },
});
export const RES_KEYS = Object.keys(RES);

// 每位船員（含 T董）每分鐘消耗；船體本身另耗燃料
export const USE = { food: 0.06, water: 0.07, fuel: 0.025 };
export const SHIP_FUEL_USE = 0.16;
export const LV_MULT = [0, 1, 1.8, 2.8];
export const MAX_LV = 3;

// deck：設施所在樓層（0=1F … 4=5F）；cost[i] = 升到 i+1 級的花費
export const FAC = tbl({
  purifier: { name: '淨水器', icon: '💧', res: 'water', base: 1.2, deck: 0, desc: '把海水濾成飲用水', cost: [{ parts: 15 }, { parts: 35, fuel: 10 }, { parts: 80, fuel: 25 }] },
  greenhouse: { name: '溫室', icon: '🥬', res: 'food', base: 0.8, deck: 2, desc: '甲板上的蔬菜與藻類養殖', cost: [{ parts: 20, water: 20 }, { parts: 45, water: 30 }, { parts: 90, water: 50 }] },
  generator: { name: '發電機', icon: '⚡', res: 'fuel', base: 0.6, deck: 0, desc: '回收油脂、生質燃料', cost: [{ parts: 25 }, { parts: 55 }, { parts: 100 }] },
  infirmary: { name: '醫療室', icon: '🏥', res: null, base: 0, deck: 1, desc: '縮短受傷船員的復原時間', cost: [{ parts: 30, water: 15 }, { parts: 60, water: 25 }, { parts: 110, water: 40 }] },
  workshop: { name: '工坊', icon: '🔧', res: 'parts', base: 0.35, deck: 0, desc: '產出零件，並緩慢修復船體', cost: [{ parts: 12 }, { parts: 30, fuel: 10 }, { parts: 70, fuel: 20 }] },
});
export const FAC_ORDER = ['purifier', 'greenhouse', 'generator', 'infirmary', 'workshop'];
export const REPAIR_FAC_COST = { parts: 8 };           // 修復受損設施
export const REPAIR_HULL = { parts: 12, gain: 15 };    // 整修船體（+15%）
export const START = { res: { food: 150, water: 150, fuel: 80, parts: 70 }, cond: 82, facs: { purifier: 1 } };

// 常駐加成：駐守該設施的真實 bot 狀態（唯讀）
export const STATUS_BONUS = { work: 0.10, rest: 0.05, off: 0 };

export const TIERS = [
  { id: 'low', name: '低風險', min: 3, risk: 0.04, units: 24, injMin: 20, color: '#5fd08a' },
  { id: 'mid', name: '中風險', min: 15, risk: 0.16, units: 90, injMin: 45, color: '#ffd36b' },
  { id: 'high', name: '高風險', min: 60, risk: 0.38, units: 360, injMin: 90, color: '#ff7a6b' },
];
export const SITES = [
  { id: 'raft', name: '漂流木筏殘骸', tier: 0, w: { food: 0.3, water: 0.2, fuel: 0.1, parts: 0.4 }, angle: 0.5 },
  { id: 'dinghy', name: '翻覆的救生艇', tier: 0, w: { fuel: 0.4, parts: 0.4, food: 0.2 }, angle: 1.4 },
  { id: 'trawler', name: '擱淺的漁船', tier: 1, w: { food: 0.5, water: 0.2, fuel: 0.2, parts: 0.1 }, angle: 2.4 },
  { id: 'container', name: '沉沒的貨櫃船', tier: 1, w: { parts: 0.5, fuel: 0.2, food: 0.2, water: 0.1 }, angle: 3.3 },
  { id: 'rig', name: '廢棄鑽井平台', tier: 2, w: { fuel: 0.5, parts: 0.4, water: 0.1 }, angle: 4.3 },
  { id: 'mall', name: '半沉的購物中心', tier: 2, w: { food: 0.35, water: 0.25, parts: 0.3, fuel: 0.1 }, angle: 5.3 },
];

// 每日任務模板
export const TASKS = [
  { type: 'produce', res: 'water', target: 150, text: '生產 150 飲水', reward: { parts: 10 } },
  { type: 'produce', res: 'food', target: 100, text: '生產 100 食物', reward: { parts: 12 } },
  { type: 'produce', res: 'fuel', target: 60, text: '生產 60 燃料', reward: { water: 25 } },
  { type: 'produce', res: 'parts', target: 30, text: '生產 30 零件', reward: { fuel: 15, food: 15 } },
  { type: 'build', target: 1, text: '建造或升級 1 座設施', reward: { parts: 15 } },
  { type: 'trip', target: 1, text: '派出 1 次出海探索', reward: { food: 25, water: 25 } },
  { type: 'cheer', target: 2, text: '為船員打氣 2 次', reward: { food: 20 } },
  { type: 'chat', target: 2, text: '找船員聊天 2 次', reward: { water: 20 } },
  { type: 'repair', target: 1, text: '修理 1 次（設施或船體）', reward: { parts: 10 } },
];
