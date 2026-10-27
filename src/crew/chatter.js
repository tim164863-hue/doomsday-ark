import { pick, chance } from '../util.js';

/** 對話樣板：每組是輪流對話的句子陣列（A 先說）。不使用任何 LLM。 */
const WORK = [
  ['{b}，那份報表你看過了嗎？', '看過了，數字有點怪，我再核對一下。', '好，核對完跟我說一聲。'],
  ['資料來源好像延遲了。', '我這邊也是，大概是限流。', '那先用快取頂著。'],
  ['咖啡續了嗎？', '第三杯了…', '別讓老闆看到。'],
  ['方舟的網路今天特別慢。', '海浪太大，衛星天線在晃。', '難怪 ping 一直跳。'],
  ['這個 bug 到底在哪裡…', '要不要換個角度看 log？', '好，我再追一次。'],
  ['{b}，等下的回測可以一起看嗎？', '可以，我先把參數整理好。'],
  ['需求又改了嗎？', '放心，是小改動。', '你每次都這樣說。'],
];
const TIME = {
  night: [['今晚星星好多。', '對啊，沒有光害，銀河都看得到。', '難得這麼安靜。'], ['夜裡的海浪聲很催眠。', '我快睡著了…'], ['月亮好大。', '像一盞掛在海上的燈。']],
  dusk: [['夕陽真漂亮。', '這種時刻最適合發呆。', '明天也要加油。'], ['天空都燒起來了。', '拍起來存證！']],
  dawn: [['早安！日出了。', '海面金光閃閃的。', '新的一天，開工！'], ['今天的日出特別紅。', '好兆頭。']],
  day: [['今天海很平靜。', '剛剛有海豚跟著船跳！', '真的嗎？我也想去看。'], ['太陽好大，記得擦防曬。', '在海上曬得更快。'], ['剛剛好像看到鯨魚噴水了。', '哪裡哪裡！']],
};
const FLAVOR = [
  ['不知道岸上現在變成怎樣了…', '別想太多，至少我們有船。', '是啊，方舟會帶我們走很遠。'],
  ['看到遠方那些半沉的大樓了嗎？', '以前那是城市呢。', '現在成了海鷗的家。'],
  ['物資還夠嗎？', '儲藏室滿滿的，放心。', '那就好。'],
];
const LEISURE = [
  ['待會要不要打乒乓球？', '好啊，輸的請喝飲料。', '你別手下留情喔。'],
  ['吧台今天有新口味。', '是那個海鹽氣泡嗎？', '對，超好喝。'],
  ['我剛去跑了兩圈。', '厲害，我連一圈都撐不住。', '明天一起練。'],
  ['泳池水溫剛好。', '小心別被滑水道噴出去。', '那是設計的！'],
  ['今天吃什麼？', '廚房說是海鮮燉飯。', '又是海鮮…不過我愛。'],
  ['你看那邊，飛魚！', '哇，一大群。'],
];
const SPORT = ['好球！', '這球好刁！', '再來一局？', '我發球～', '手感來了！', '你剛剛出界啦。', '不錯喔！', '這分算我的！', '哇，差一點！', '換你發球。', '漂亮！'];
const TEASE = [
  ['哈，我的曲線比你漂亮。', '漂亮不能當飯吃，看最後。', '那就最後見真章。'],
  ['你又被掃停損了吧？', '那叫風控，專業的。', '嘴硬。'],
  ['要不要賭一杯珍奶？', '賭！輸的請全船。', '成交。'],
  ['你的倉位也太保守了吧。', '保守才活得久。', '活得久但賺得少。'],
  ['別一直盯我的螢幕！', '我只是剛好路過～'],
  ['今天行情是我的主場。', '你每天都這樣說。'],
];
const CONTEST = [
  ['競賽現在誰領先？', '看電視吧，{leader} 目前領先。', '{loser} 要加油了。'],
  ['{leader} 領先 {gap}U 耶。', '還有時間，勝負未定。'],
];
const GREET = ['董事長好！', '老闆好～', 'T董好！', '嗨，T董！', '歡迎視察！'];
const GREET_T = { night: '董事長還沒休息呀？', dawn: 'T董早安！', day: 'T董午安！', dusk: 'T董晚安～' };

export function phaseOf(env) { return env.nightF > 0.6 ? 'night' : env.duskF > 0.5 ? (env.es > 0 ? 'dusk' : 'dawn') : 'day'; }
export function fill(line, ctx) { return line.replace(/\{(\w+)\}/g, (m, k) => (ctx[k] ?? m)); }

/** 依情境挑一段對話；回傳句子陣列（已套入名字等）。 */
export function pickConversation(a, b, env, arena, mode) {
  const ctx = { b: b.title, a: a.title };
  let pool;
  const phase = env.phaseKey;
  if (mode === 'sport') return [pick(SPORT), pick(SPORT)];
  const traderPair = a.kind === 'trader' && b.kind === 'trader';
  if (traderPair && arena) {
    const [ta, tb] = [arena.traders.find((t) => t.name === a.title), arena.traders.find((t) => t.name === b.title)];
    if (ta && tb) { const lead = ta.equity >= tb.equity ? ta : tb, lose = lead === ta ? tb : ta; ctx.leader = lead.name; ctx.loser = lose.name; ctx.gap = Math.abs(ta.equity - tb.equity).toFixed(1); }
    pool = chance(0.55) ? TEASE : CONTEST;
    if (!ctx.leader) pool = TEASE;
  } else if (mode === 'work') pool = chance(0.2) ? TIME[phase] : chance(0.12) ? FLAVOR : WORK;
  else { const r = Math.random(); pool = r < 0.34 ? TIME[phase] : r < 0.5 ? FLAVOR : r < 0.58 && arena ? CONTEST : LEISURE; if (pool === CONTEST) { const ts = arena.traders; if (ts.length >= 2) { const s = [...ts].sort((x, y) => y.equity - x.equity); ctx.leader = s[0].name; ctx.loser = s[1].name; ctx.gap = (s[0].equity - s[1].equity).toFixed(1); } else pool = LEISURE; } }
  return pick(pool).map((l) => fill(l, ctx));
}
export function greeting(phase) { return chance(0.35) ? GREET_T[phase] : pick(GREET); }
