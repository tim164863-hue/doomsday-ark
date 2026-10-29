// 角色資料庫（純資料 + 純計算，無 three.js；node 測試用）。
//   - T董 是船東（owner uid）專屬角色，不在資料庫內，非船東帳號 / 訪客永遠拿不到。
//   - 其他玩家：10 位可選角色（CHARS）。新玩家隨機分到一位，可在「\ue085 角色」面板更換，存在存檔的可選欄位 pl.c。
//   - 小船船員：2–3 位隨機產生（名字 + 造型），由存檔的 pl.s（船員種子）決定，所以每次載入都一樣。
// look 格式（給 avatar.js）：{ model, shirt, acc:[配件], ac:{配件顏色}, col:{ cool, green, warm: 目標色相(0–360) }, scale }
import { hash, mulberry32 } from '../sim/rng.js';

export const MODELS = ['male-a', 'male-b', 'male-c', 'male-e', 'male-f', 'female-a', 'female-b', 'female-c', 'female-d', 'female-e', 'female-f'];
export const OWNER_MODEL = 'male-d'; // T董 專用的基底模型（皇冠 / 金領帶）

export const CHARS = [
  { id: 'sailor', name: '水手阿浪', tag: '\ue012', blurb: '愛唱歌的老水手', look: { model: 'male-a', shirt: 0x2a5aa8, acc: ['sailor'], ac: { sailor: 0x1f3f7a }, col: { green: 218 } } },
  { id: 'captain', name: '老船長金鬍子', tag: '\ue034', blurb: '航海二十年，什麼浪都見過', look: { model: 'male-b', shirt: 0xb83c2e, acc: ['captain'], ac: {}, col: {}, scale: 1.04 } },
  { id: 'angler', name: '釣客小魚', tag: '\ue044', blurb: '一桿在手，天下我有', look: { model: 'male-c', shirt: 0x5aa84a, acc: ['bucket', 'bag'], ac: { bucket: 0xe8c441, bag: 0x7a5a3a }, col: { warm: 92 } } },
  { id: 'mechanic', name: '技師小柴', tag: '\ue09d', blurb: '沒有修不好的引擎', look: { model: 'male-e', shirt: 0xe9a03a, acc: ['hardhat'], ac: { hardhat: 0xffc21a }, col: {} } },
  { id: 'cook', name: '主廚阿麵', tag: '\ue01f', blurb: '用有限的罐頭變出滿漢全席', look: { model: 'male-f', shirt: 0xe9eef2, acc: ['chef'], ac: { chef: 0xffffff }, col: { green: 8 }, scale: 0.97 } },
  { id: 'explorer', name: '探險家小葵', tag: '\ue034', blurb: '地圖上的空白就是用來走的', look: { model: 'female-a', shirt: 0x6c9a3a, acc: ['explorer', 'scarf'], ac: { explorer: 0xc9a766, scarf: 0xd9503a }, col: { cool: 98 } } },
  { id: 'scientist', name: '博士小晴', tag: '\ue064', blurb: '隨身帶著顯微鏡與好奇心', look: { model: 'female-b', shirt: 0x2fb5a8, acc: ['glasses'], ac: { glasses: 0x2b2f3a }, col: { warm: 172, cool: 335 } } },
  { id: 'singer', name: '歌手小雪', tag: '\ue051', blurb: '甲板就是她的舞台', look: { model: 'female-c', shirt: 0xe55a9a, acc: ['headphones', 'bow'], ac: { headphones: 0x2b2f3a, bow: 0xffffff }, col: { cool: 330 } } },
  { id: 'diver', name: '潛水員小藍', tag: '\ue004', blurb: '最愛海面下的世界', look: { model: 'female-e', shirt: 0x2a8ad9, acc: ['divermask', 'bag'], ac: { divermask: 0xff7a2a, bag: 0x2a8ad9 }, col: {} } },
  { id: 'ranger', name: '巡守小火', tag: '\ue042', blurb: '火辣脾氣、溫柔心腸', look: { model: 'female-f', shirt: 0xd9482f, acc: ['beanie'], ac: { beanie: 0xe0382b }, col: { cool: 8, warm: 275 } } },
];
export const CHAR_IDS = CHARS.map((c) => c.id);
export const charById = (id) => CHARS.find((c) => c.id === id) || null;
export const isChar = (id) => typeof id === 'string' && CHAR_IDS.includes(id);
/** 依亂數函式（預設 Math.random）挑一位角色 id。 */
export const randomChar = (rnd = Math.random) => CHAR_IDS[Math.min(CHAR_IDS.length - 1, Math.floor(rnd() * CHAR_IDS.length))];
/** 非船東玩家要用的 look；不認得的 id 一律退回第一位（絕不會回 T董）。 */
export const lookOf = (id) => (charById(id) || CHARS[0]).look;

/** 存檔可選欄位 pl = { c: 角色 id, s: 船員種子 } 的驗證；回傳乾淨的物件，無效欄位會被補成預設。 */
export function sanitizePl(p, rnd = Math.random) {
  const o = p && typeof p === 'object' ? p : {};
  const c = isChar(o.c) ? o.c : randomChar(rnd);
  const s = Number.isFinite(o.s) ? (o.s >>> 0) : ((rnd() * 2 ** 32) >>> 0);
  return { c, s };
}

// ---------------------------------------------------------------- 隨機船員（小船）
const ZH_A = ['阿', '小'];
const ZH_B = ['米', '星', '貝', '浪', '葵', '虎', '柚', '桃', '橙', '麥', '鯨', '燕', '松', '栗', '菇', '芽', '寶', '糖', '雲', '豆', '芝', '墨', '晴', '鷗', '蝦', '蚵', '帆', '錨'];
const EN = ['Kai', 'Nori', 'Pip', 'Juno', 'Otis', 'Bea', 'Finn', 'Mika', 'Luna', 'Rio', 'Coco', 'Zed', 'Yuki', 'Momo', 'Tide', 'Sol'];
const KINDS = ['manager', 'other', 'research', 'other'];
const HATS = [[], ['cap'], ['beanie'], ['headband'], ['bucket'], ['glasses'], ['scarf'], ['hardhat'], ['headphones'], []];
const HAT_COL = [0xe0382b, 0x2a8ad9, 0xf0c030, 0x3fae6b, 0x8a5ad8, 0xff7a2a, 0xffffff, 0x2b2f3a];
const CREW_MODELS = [...MODELS, 'male-d'].filter((m) => m !== OWNER_MODEL); // 隨機船員不用 T董 的基底模型，避免跟他撞臉

/** 該小船的 2–3 位隨機船員（確定性：同樣的 seed 永遠同樣的人）。nameBan = 不能重名的名字（玩家角色名）。 */
export function crewSpec(seed, cap = 3, nameBan = []) {
  const n = Math.max(0, Math.min(cap, 2 + (hash('crewn', seed >>> 0) % 2)));
  const out = [], used = new Set(nameBan);
  for (let i = 0; i < n; i++) {
    const r = mulberry32(hash('crew', seed >>> 0, i)); const pick = (a) => a[Math.floor(r() * a.length)];
    let name = '', tries = 0;
    do { name = r() < 0.6 ? pick(ZH_A) + pick(ZH_B) : pick(EN); if (tries++ > 20) name += i; } while (used.has(name));
    used.add(name);
    const model = pick(CREW_MODELS); const acc = pick(HATS).slice(); const ac = {}; for (const a of acc) ac[a] = pick(HAT_COL);
    const col = {}; if (r() < 0.85) { col.cool = Math.floor(r() * 360); col.green = Math.floor(r() * 360); col.warm = Math.floor(r() * 360); }
    const shirt = 0x4a6fc0; const scale = 0.94 + r() * 0.12;
    out.push({ title: name, kind: pick(KINDS), look: { model, shirt, acc, ac, col, scale } });
  }
  return out;
}
