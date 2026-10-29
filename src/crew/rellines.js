// 船員之間的對白（純資料 + 純函式，沒有 three.js / DOM，方便測試）。
// 全部是遊戲內的虛構台詞，只依「交情」決定語氣；不讀、不送任何外部資料。
const pick = (arr, rnd = Math.random) => arr[Math.floor(rnd() * arr.length) % arr.length];
const sub = (t, n) => t.replace(/\{a\}/g, n.a || '').replace(/\{b\}/g, n.b || '').replace(/\{n\}/g, n.n || '');

export const FRIEND_CONV = [
  ['{b}，等等下班一起去吃點東西？', '好啊！這次換我請客～'],
  ['你今天看起來心情不錯耶，{b}。', '跟你聊天就更好了！'],
  ['{b}，上次你教我的方法真的有用！', '太好了，我就說吧～'],
  ['有你在這艘船上真安心。', '哈哈，彼此彼此！'],
];
export const RIVAL_CONV = [
  ['{b}，上次的比分我還記著呢。', '哼，隨時奉陪。'],
  ['你又在偷懶？', '關你什麼事。'],
  ['別以為我會一直讓你。', '說大話誰不會。'],
  ['{b}，這次可別輸不起。', '輸的人才輸不起吧。'],
];
export const COLD_CONV = [['……', '（別過頭去）'], ['別跟我說話。', '我也不想理你。'], ['哼。', '哼。']];
export const FRIEND_MOOD = ['和{n}在一起真開心～', '{n}今天氣色不錯！', '待會找{n}聊聊天。'];
export const RIVAL_MOOD = ['哼，{n}又在那邊晃。', '{n}最好別來惹我。', '下一場我一定贏過{n}。'];
export const FIGHT = [[0, '你剛剛那句話是什麼意思？\ue078'], [1, '我說的是事實啊！'], [0, '每次都這樣，真受不了你！'], [1, '哼，不理你了！']];
export const MAKEUP = [[0, '……剛剛是我太衝動了，對不起。'], [1, '我也有不對，別氣了。'], [0, '和好吧？\ue050'], [1, '好啦，和好！\ue052']];
export const HELP = [[0, '{b}，還好嗎？我陪你一下。'], [1, '謝謝你…有你在好多了。']];
export const MEAL_OPEN = ['開飯囉！\ue047', '好餓～吃飯吃飯！', '今天的菜聞起來真香。'];
export const PARTY = ['乾杯！\ue09c', '派對時間！\ue035', '今晚好熱鬧～', '跳起來！\ue068', '這首歌我喜歡！'];
export const CELEB = ['大豐收！\ue035', '太棒了！今晚加菜！', '辛苦大家了～', '耶！\ue035'];
export const STORM = ['大家一起固定貨物！', '抓穩了！互相照應！', '別慌，我們一起撐過去。'];
export const INVITE = ['要不要來一局？', '來打一場吧！', '有空嗎？陪我打一場。'];
export const CHALLENGE = ['敢不敢跟我比一場？', '來啊，這次我不會輸！', '{b}，來決勝負吧。'];
export const ACCEPT = ['好啊！', '奉陪！', '來吧，不會手下留情。'];
export const DECLINE = ['今天不想打…', '改天吧，我有點累。', '這次先不了。'];

/** 兩人之間的閒聊（kind: friend / rival / feud / neutral）。neutral 回傳 null，由原本的對話系統處理。 */
export function convLines(kind, aName, bName, rnd = Math.random) {
  const n = { a: aName, b: bName };
  const pool = kind === 'friend' ? FRIEND_CONV : kind === 'rival' ? RIVAL_CONV : kind === 'feud' ? COLD_CONV : null;
  return pool ? pick(pool, rnd).map((t) => sub(t, n)) : null;
}
/** 看到好朋友 / 對頭時的心情台詞；沒有就回傳 null。 */
export function moodLineRel(kind, other, rnd = Math.random) {
  const pool = kind === 'friend' ? FRIEND_MOOD : kind === 'rival' ? RIVAL_MOOD : null; return pool ? sub(pick(pool, rnd), { n: other }) : null;
}
/** 劇情腳本：roles 0 / 1 對應 a / b。 */
export function script(kind, aName, bName) { const src = kind === 'fight' ? FIGHT : kind === 'makeup' ? MAKEUP : HELP; return src.map(([w, t]) => [w, sub(t, { a: aName, b: bName })]); }
export const pickLine = (arr, rnd = Math.random, n = {}) => sub(pick(arr, rnd), n);
/** 球友邀請能不能成：交情越好越容易，對頭反而愛挑戰。 */
export const botInviteAccept = (aff, compat = 0) => Math.max(0.2, Math.min(0.95, 0.6 + aff / 180 + (aff <= -25 ? 0.2 : 0) + compat * 0.08));
