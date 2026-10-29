// 末日方舟 · 海上事件（純函式）。任務出發時決定「會不會有事件、發生在航程的哪個時間點」，
// 玩家在線上可以在海圖替那艘船做決定；沒做決定 = 照原計畫（閒置玩法不變）。決定只改 m（任務）本身，所以離線補算仍然一致。
import { tbl } from '../util.js';
import { hash, mulberry32 } from './rng.js';
import { autoBattle, foeStats } from './battle.js';

// opt: res=收穫倍率, dmg=額外船體損傷, bp=額外藍圖機率, risk=失敗機率（會被火力降低；失敗：收穫再 ×0.6、再 −8% 船體）, delay=延後返航(分鐘)
export const EVENTS = tbl({
  drift:   { icon: '\ue06a', name: '漂流貨櫃', zones: ['near', 'reef', 'ruins', 'ice'], text: '前方有個半沉的貨櫃隨浪漂浮，封條還在。',
    opts: [{ t: '靠上去撬開', d: '收穫 +35%，有點風險', res: 1.35, dmg: 3, risk: 0.2 }, { t: '拖回去', d: '收穫 +20%，多花 8 分鐘', res: 1.2, delay: 8, risk: 0.05 }, { t: '繞過去', d: '平安最重要', res: 1, dmg: -2 }] },
  pirate:  { icon: '\ue009', name: '海盜小艇', zones: ['near', 'reef', 'ruins'], text: '遠處有艘改裝小艇朝你們全速駛來，船頭站著人。',
    opts: [{ t: '開火迎戰', d: '火力越高越安全，贏了收穫 +25%', res: 1.25, dmg: 5, risk: 0.45, fp: true }, { t: '丟下一些貨', d: '收穫 −25%，全身而退', res: 0.75, dmg: -3 }, { t: '全速甩開', d: '船體受點損傷', res: 0.95, dmg: 4, risk: 0.2 }] },
  signal:  { icon: '\ue021', name: '廢墟信號', zones: ['ruins', 'reef'], text: '殘破大樓頂上有盞燈在閃，像是求救，也像陷阱。',
    opts: [{ t: '登樓搜索', d: '可能找到藍圖，船體 −8%', res: 1.1, dmg: 8, bp: 0.28, risk: 0.3 }, { t: '記下座標離開', d: '什麼都不改變', res: 1 }] },
  berg:    { icon: '\ue007', name: '擋路的冰山', zones: ['ice'], text: '一座巨大冰山擋在航道上，兩側都是碎冰。',
    opts: [{ t: '撞開碎冰', d: '更快、收穫 +15%，船體受損', res: 1.15, dmg: 9, risk: 0.25 }, { t: '繞行', d: '多花 12 分鐘，平安', res: 1, delay: 12, dmg: -2 }] },
  glow:    { icon: '\ue029', name: '深淵異光', zones: ['abyss'], text: '海面下有一圈幽藍的光在脈動，聲納讀數很怪。',
    opts: [{ t: '下潛調查', d: '收穫 +60%，可能有藍圖，風險高', res: 1.6, dmg: 10, bp: 0.2, risk: 0.45 }, { t: '保持距離記錄', d: '收穫 +10%', res: 1.1 }] },
  battle:  { icon: '\ue00d', name: '海怪來襲', zones: ['reef', 'ruins', 'ice', 'abyss'], text: '浪裡鑽出一條巨大的海蛇，緊貼著船身繞圈。',
    opts: [{ t: '開砲迎戰', d: '用這艘船的火力打（階段④海戰規則）：贏了收穫 +30%，輸了 −40% 且受傷', battle: true }, { t: '全速逃離', d: '收穫 −5%，多半甩得掉', res: 0.95, dmg: 2, risk: 0.2 }, { t: '丟貨引開牠', d: '收穫 −20%，全身而退', res: 0.8 }] },
  whale:   { icon: '\ue00e', name: '鯨魚擱淺的訊號', zones: ['near', 'reef', 'ice', 'abyss'], text: '一頭大鯨魚在附近緩緩盤旋，似乎在帶路。',
    opts: [{ t: '跟著牠', d: '多花 6 分鐘，收穫 +25%', res: 1.25, delay: 6, risk: 0.05 }, { t: '保持航向', d: '照原計畫', res: 1 }] },
});
const KEYS = Object.keys(EVENTS);

/** 任務出發時呼叫：決定性地回傳 {k, at} 或 null（獨立亂數流，不影響任務本身的結果） */
export function planEvent(seed, shipId, n, zone, fail) {
  const rnd = mulberry32(hash(seed, 'fev', shipId, n)); const pool = KEYS.filter((k) => EVENTS[k].zones.includes(zone));
  if (!pool.length || fail || rnd() > 0.6) return null;
  return { k: pool[Math.floor(rnd() * pool.length)], at: +(0.12 + rnd() * 0.28).toFixed(3), c: -1 };
}
/** 事件是否已發生、還沒決定（且任務還沒結束） */
export const pending = (m, t) => !!(m && m.ev && m.ev.c === -1 && t >= m.start + m.ev.at * (m.end - m.start) && t < m.end);
export const eventInfo = (m) => (m && m.ev && EVENTS[m.ev.k]) || null;

/** 玩家的決定：套用到任務 m 上（確定性：由 seed/ship/n 決定） */
export function decide(seed, ship, st, choice, nowSec, bpPool) {
  const m = ship.m; if (!m || !m.ev) return { ok: false, msg: '沒有待決定的事件' };
  if (m.ev.c !== -1) return { ok: false, msg: '已經決定過了' }; if (!pending(m, nowSec)) return { ok: false, msg: '事件已過或還沒發生' };
  const E = EVENTS[m.ev.k]; const o = E.opts[choice]; if (!o) return { ok: false, msg: '沒有這個選項' };
  const rnd = mulberry32(hash(seed, 'evd', ship.id, ship.n, choice)); let res = o.res || 1; let dmg = o.dmg || 0; let bad = false; let btx = '';
  if (o.battle) {   // 艦隊小船遇到海蛇：用跟方舟海戰同一個決定性對戰（小船以放大後的戰力參戰，見 fleet.combatOf）
    const lv = { reef: 1, ruins: 1.15, ice: 1.3, abyss: 1.5 }[m.zone] || 1, own = { fp: 0.8 + st.fp * 1.5, hull: 90 + st.hull * 2.5, cond: 100, branch: null, spd: st.speed, scoutK: 1, haz: 0, trade: 0 };
    const out = autoBattle(seed, own, foeStats({ k: 'serpent', lv }), hash('fev', ship.id, ship.n)); btx = out.kind;
    if (out.kind === 'win') { res = 1.3; dmg = Math.round(out.loss * 0.4); } else if (out.kind === 'draw') { res = 1; dmg = Math.round(out.loss * 0.4); } else if (out.kind === 'fled') { res = 0.95; dmg = 1; } else { res = 0.6; dmg = Math.round(out.loss * 0.4) + 6; bad = true; }
  }
  const risk = o.battle ? 0 : (o.risk || 0) / (o.fp ? 1 + st.fp * 0.35 : 1 + st.fp * 0.08 + st.hull / 600); if (risk > 0 && rnd() < risk) { bad = true; res *= 0.6; dmg += 8; }
  for (const k in m.res) m.res[k] = Math.round(m.res[k] * res); m.dmg = Math.max(0, Math.round(m.dmg + dmg));
  if (o.delay) m.end += o.delay * 60; let gotBp = false;
  if (o.bp && !bad && !m.bp && bpPool && bpPool.length && rnd() < o.bp) { m.bp = bpPool[Math.floor(rnd() * bpPool.length)]; gotBp = true; }
  m.ev.c = choice; m.ev.bad = bad; const text = `${E.icon}${E.name}：${o.t} → ${o.battle ? ({ win: '擊退了牠！', draw: '兩敗俱傷…', fled: '對方沒追上來', lose: '被打得很慘…', caught: '被打得很慘…' }[btx] || '') : bad ? '不太順利…' : '順利！'}${gotBp ? '（似乎找到了藍圖的線索）' : ''}`; m.ev.txt = text;
  return { ok: true, msg: text, bad, gotBp };
}
