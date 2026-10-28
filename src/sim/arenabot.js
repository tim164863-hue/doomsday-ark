// 即時砲戰的機器人玩家（測試 / 校準用）：skill 0..1 = 瞄準誤差與閃避反應。
import { stepArena, AR } from './arena.js';
export function playBot(a, skill = 1, seedNoise = 1) {
  let s = seedNoise >>> 0; const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const inp = { mx: 0, my: 0, aim: null, fire: false, ammo: 0 }; let steps = 0;
  while (!a.over && steps++ < 4000) {
    const F = a.foe, P = a.p; let mx = 0, my = 0;
    for (const c of a.tele) { if (c.kind === 'dash' || c.done) continue; const d = Math.hypot(P.x - c.x, P.y - c.y); if (d < c.r + 7 && c.t > (1 - skill) * 0.5) { const g = Math.atan2(P.y - c.y, P.x - c.x); mx += Math.cos(g) * 2; my += Math.sin(g) * 2; } if (c.lane) { /* dash lane handled below */ } }
    for (const q of a.proj) { const d = Math.hypot(q.x - P.x, q.y - P.y); if (d < 24 && (q.vx * (P.x - q.x) + q.vy * (P.y - q.y)) > 0) { const px = -q.vy, py = q.vx, l = Math.hypot(px, py) || 1; const sg = (px * (P.x - q.x) + py * (P.y - q.y)) >= 0 ? 1 : -1; mx += px / l * sg * 2 * skill; my += py / l * sg * 2 * skill; } }
    if (F.lane && F.st === 'charge') { const L = F.lane, dx = L.x1 - L.x0, dy = L.y1 - L.y0, l = Math.hypot(dx, dy) || 1; const side = ((P.x - L.x0) * dy - (P.y - L.y0) * dx) / l; if (Math.abs(side) < 14) { mx += (dy / l) * (side >= 0 ? 1 : -1) * 3 * skill; my += (-dx / l) * (side >= 0 ? 1 : -1) * 3 * skill; } }
    mx += (50 - P.x) * 0.01; my += (80 - P.y) * 0.02;   // 回到中下方
    const err = (1 - skill) * 14 * (rnd() - 0.5) * 2;
    inp.mx = mx; inp.my = my; const T = Math.min(1.5, Math.max(0.4, Math.hypot(F.x - P.x, F.y - P.y) / AR.shellV)); inp.aim = { x: F.x + (F.vx || 0) * T * skill + err, y: F.y + (F.vy || 0) * T * skill + err * 0.5 }; inp.fire = a.p.cd <= 0 && F.vis; inp.ammo = a.p.inc > 0 && F.id !== 'serpent' && a.st.shots % 4 === 3 ? 1 : 0;
    stepArena(a, inp);
  }
  return a;
}
