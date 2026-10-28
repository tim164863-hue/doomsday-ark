// 末日方舟 · 艦隊資料（純資料，不依賴 three.js / DOM）
// 6 種小型船 + 旗艦郵輪。數值設計：速度決定航行時間、載貨量決定收穫、耐久決定受損、火力降低遇襲風險並提高戰果。
import { tbl } from '../util.js';
export const FLEET_MAX = 6;                  // 艦隊最多艘數（不含旗艦）
export const LV_MAX = 3;
export const LV_STAT = [0, 1, 1.3, 1.7];     // 載貨 / 耐久倍率
export const LV_SPEED = [0, 1, 1.12, 1.25];
export const RESERVE_FUEL = 15;              // 自動任務出發後至少保留的燃料，避免把方舟的燃料榨乾

// 海域：未來「共享世界地圖」的環帶（ring 為距離出生點的半徑範圍，單位=海里）。目前只用 min/fuel/danger/rich/rec/bp。
export const ZONES = tbl({
  near:  { id: 'near',  name: '近海',     icon: '🌊', min: 20,  fuel: 3,  danger: 0.03, rich: 0.8, rec: 0,  bpChance: 0.010, bp: ['speedboat', 'tug'],        w: { food: 0.3, water: 0.2, fuel: 0.2, parts: 0.3 },  ring: [0, 40],    color: '#5fd0e6' },
  reef:  { id: 'reef',  name: '珊瑚礁',   icon: '🪸', min: 45,  fuel: 6,  danger: 0.06, rich: 1.0, rec: 8,  bpChance: 0.030, bp: ['speedboat', 'tug', 'patrol'], w: { food: 0.5, water: 0.2, parts: 0.3 },              ring: [40, 90],   color: '#6fe0b0' },
  ruins: { id: 'ruins', name: '廢墟城市', icon: '🏙️', min: 90,  fuel: 10, danger: 0.14, rich: 1.5, rec: 18, bpChance: 0.070, bp: ['patrol', 'tug', 'sub'],    w: { parts: 0.55, fuel: 0.25, water: 0.1, food: 0.1 }, ring: [90, 160],  color: '#c9a56b' },
  ice:   { id: 'ice',   name: '冰海',     icon: '🧊', min: 120, fuel: 14, danger: 0.20, rich: 1.7, rec: 24, bpChance: 0.080, bp: ['icebreaker', 'patrol'],     w: { water: 0.45, fuel: 0.25, parts: 0.2, food: 0.1 }, ring: [160, 240], color: '#bfe6ff' },
  abyss: { id: 'abyss', name: '深淵',     icon: '🕳️', min: 180, fuel: 20, danger: 0.30, rich: 2.4, rec: 30, bpChance: 0.120, bp: ['sub', 'icebreaker'],        w: { parts: 0.6, fuel: 0.3, water: 0.1 },              ring: [240, 400], color: '#6a5cff' },
});
export const ZONE_ORDER = ['near', 'reef', 'ruins', 'ice', 'abyss'];

// 6 種船。cost = 建造花費；build = 建造分鐘；starter = 新手可選的第一艘（選了即獲得該船藍圖）；free = 任何人都能直接造（只有小漁船）；zones = 可航行海域
export const SHIPS = tbl({
  skiff:      { id: 'skiff',      name: '小漁船',     icon: '🛶', len: 7,  role: '入門款・便宜耐用',   speed: 1.0, cargo: 30,  hull: 40,  fp: 0, fuelUse: 1.0, zones: ['near'],                          cost: { parts: 40, fuel: 10 },                    build: 10,  starter: true,  free: true, up: { parts: 30 } },
  speedboat:  { id: 'speedboat',  name: '洋流號',     icon: '🚤', len: 9.5, role: '快艇・跑得快・貨艙小',     speed: 2.2, cargo: 22,  hull: 35,  fp: 1, fuelUse: 1.6, zones: ['near', 'reef'],                  cost: { parts: 90, fuel: 30 },                    build: 20,  starter: true,  up: { parts: 60, fuel: 15 } },
  tug:        { id: 'tug',        name: '打撈拖船',   icon: '⚓', len: 14, role: '貨艙大・慢而穩',     speed: 0.8, cargo: 120, hull: 90,  fp: 0, fuelUse: 1.2, zones: ['near', 'reef', 'ruins'],         cost: { parts: 160, fuel: 40, food: 30 },         build: 40,  starter: true,  up: { parts: 110, fuel: 25 } },
  sub:        { id: 'sub',        name: '潛水艇',     icon: '🛟', len: 16, role: '可下潛深淵',         speed: 1.2, cargo: 50,  hull: 80,  fp: 2, fuelUse: 1.4, zones: ['reef', 'ruins', 'abyss'],        cost: { parts: 300, fuel: 80, water: 60 },        build: 90,  starter: false, up: { parts: 200, fuel: 50, water: 30 } },
  patrol:     { id: 'patrol',     name: '武裝巡邏艇', icon: '🛡️', len: 18, role: '火力強・護航殲敵',   speed: 1.6, cargo: 40,  hull: 110, fp: 6, fuelUse: 1.8, zones: ['near', 'reef', 'ruins'],         cost: { parts: 260, fuel: 90, food: 40 },         build: 60,  starter: false, up: { parts: 170, fuel: 60 } },
  icebreaker: { id: 'icebreaker', name: '破冰船',     icon: '🧊', len: 26, role: '耐久最高・能闖冰海', speed: 0.9, cargo: 160, hull: 200, fp: 4, fuelUse: 2.2, zones: ['near', 'ruins', 'ice'],          cost: { parts: 380, fuel: 150, water: 80 },       build: 120, starter: false, up: { parts: 250, fuel: 90, water: 40 } },
});
export const SHIP_ORDER = ['skiff', 'speedboat', 'tug', 'sub', 'patrol', 'icebreaker'];
export const STARTERS = SHIP_ORDER.filter((k) => SHIPS[k].starter);

// 旗艦（只有擁有者帳號）：方舟本體；不可建造、不出任務，數值僅供顯示與未來世界地圖使用
export const FLAGSHIP = { id: 'cruise', name: '末日方舟（郵輪）', icon: '🚢', len: 91, role: '旗艦・移動基地', speed: 0.6, cargo: 400, hull: 500, fp: 8, zones: ZONE_ORDER };

// 組員出海（原有玩法）也可能找到藍圖：依風險等級
export const TRIP_BP = [{ chance: 0.02, pool: ['speedboat'] }, { chance: 0.06, pool: ['tug', 'patrol'] }, { chance: 0.12, pool: ['sub', 'icebreaker'] }];

// 共享世界地圖（第 3 步，目前只定義資料形狀；見 DESIGN-fleet.md）
export const WORLD = { size: 2000, cell: 25, grid: 80, c: 1000, spawnR: 800, slots: 8, spawnMinGap: 600, fogBits: 80 * 80,
  arkSpeed: 1.2,        // 方舟航速：地圖單位 / 分鐘
  fuelPerUnit: 0.08,    // 方舟每航行 1 單位耗油
  revealArk: 95, revealMission: 70, revealSpawn: 130, near: 120 /* 距離某海域 ≤ 此值 → 該海域任務較快較肥 */ };
