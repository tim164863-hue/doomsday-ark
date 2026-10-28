// 末日方舟 · 階段④：接管的風險估計（只給畫面顯示 / 二次確認用，不寫存檔、不影響結算）。
// 用「機器人玩家」在砲戰場裡試打（固定 8 個虛擬種子，一般操作 skill 0.6 / 全力 0.95），得到勝率與平均船體損失；
// 結果有快取（遭遇 + 船況不變就不重算）。真正結算仍以玩家實際的砲戰為準（見 battle.js 檔頭）。
import { createArena, arenaMetrics } from './arena.js';
import { playBot } from './arenabot.js';
import { BT } from './battle.js';

const cache = new Map(); const N = 8;
function run(foe, own, skill) { let w = 0, l = 0; for (let i = 0; i < N; i++) { const a = createArena(7001 + i, i, foe, own); playBot(a, skill, i + 1); if (a.over === 'win') w++; l += arenaMetrics(a).loss; } return { win: w / N, loss: l / N }; }
/** 回傳 { win, loss（一般操作）, winMax, lossBest（全力）, risky }。win 0–1，loss = 平均船體損失 %。 */
export function arenaRisk(own, foe) {
  const key = [foe.id, foe.lv, foe.hp, foe.atk, own.fp.toFixed(2), Math.round(own.hull), own.branch || '', Math.round(own.cond), (own.spd || 1).toFixed(2)].join('|'); let r = cache.get(key); if (r) return r;
  const n = run(foe, own, 0.6), g = run(foe, own, 0.95);
  r = { win: n.win, loss: n.loss, winMax: g.win, lossBest: g.loss, risky: n.win < BT.confirmWin || n.loss > BT.confirmLoss };
  if (cache.size > 40) cache.clear(); cache.set(key, r); return r;
}
