import { pick } from '../util.js';

export const MOODS = {
  happy: { icon: '\ue07a', name: '開心' }, focus: { icon: '\ue08c', name: '專注' }, tired: { icon: '\ue079', name: '疲累' },
  anxious: { icon: '\ue07b', name: '焦慮' }, bored: { icon: '\ue079', name: '無聊' },
};
export const MOOD_KEYS = Object.keys(MOODS);

/** 心情 = f(即時狀態, 連續工時, 時段, 交易員損益)。純規則、不呼叫任何模型。 */
export function computeMood(info, c) {
  const { nightF = 0, dayF = 1, workedMin = 0, sleeping = false, playing = false } = c;
  const pnl = info.pnl;
  if (sleeping) return 'tired';
  if (info.error) return 'anxious';
  if (info.kind === 'trader' && pnl != null) {
    if (pnl <= -8 && info.cat === 'work') return 'anxious';
    if (pnl >= 6) return 'happy';
  }
  if (info.cat === 'work') {
    if (workedMin > 50 || (nightF > 0.7 && workedMin > 12)) return 'tired';
    if (info.kind === 'trader' && pnl != null && pnl < -3) return 'anxious';
    return 'focus';
  }
  if (info.cat === 'rest') {
    if (playing || info.ageMin < 20) return 'happy';
    if (info.ageMin > 55) return 'bored';
    return nightF > 0.6 ? 'tired' : 'happy';
  }
  return 'tired';
}

const L = {
  happy: ['今天心情不錯～', '海風好舒服。', '剛完成一件事，爽！', '哼著歌，慢慢來。', '生活在方舟也不賴。', '中午的陽光好溫暖。'],
  focus: ['專心，別分心。', '這個問題快解開了。', '進入心流狀態。', '再一個小時就好。', '資料看起來很有趣。', '先把這段跑完。'],
  tired: ['好想睡一下…', '眼睛快睜不開了。', '咖啡呢？我需要咖啡。', '腦袋有點轉不動。', '今天真的有點累。', '呼…讓我喘口氣。'],
  anxious: ['這走勢…心跳好快。', '會不會又被洗出場？', '手心都是汗。', '別慌，風控最重要。', '希望下一根 K 棒是綠的。', '方舟的未來全靠它了。'],
  bored: ['好無聊喔…', '有沒有人要打球？', '沒事做的時候最難熬。', '來看看海豚在哪。', '要不要去吧台坐坐？', '發呆也是一種放鬆。'],
};
const NIGHT = { tired: ['夜深了，只剩星星陪我。', '好想把頭埋進枕頭。'], happy: ['今晚的星空真美。'], bored: ['夜裡的海好安靜。'], focus: ['夜班模式，安靜好專心。'], anxious: ['夜裡一個人盯盤，壓力更大。'] };
const PNL_UP = ['權益創新高了！', '賺錢的感覺真好。', '今天的倉位很漂亮。'];
const PNL_DN = ['帳面綠油油…不對是紅的。', '得想辦法把虧損補回來。', '停損果然很痛。'];

export function moodLine(mood, info, c) {
  const pool = [...L[mood]];
  if (c.nightF > 0.6 && NIGHT[mood]) pool.push(...NIGHT[mood], ...NIGHT[mood]);
  if (info.kind === 'trader' && info.pnl != null) { if (info.pnl > 3) pool.push(...PNL_UP); if (info.pnl < -3) pool.push(...PNL_DN); }
  return pick(pool);
}
