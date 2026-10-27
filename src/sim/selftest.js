// 給 ark.selfTest() 用：快速檢查模擬核心的決定性；回傳問題清單（空 = 正常）
import { newState, simulateTo, syncCrew, build } from './sim.js';
export function runSelfTest() {
  const out = []; const T0 = 1_800_000_000; const crew = ['甲', '乙', '丙'].map((key, i) => ({ key, cat: ['work', 'rest', 'off'][i] }));
  const mk = () => { const s = newState(777, T0, 0); syncCrew(s, crew); build(s, 'greenhouse'); return s; };
  const a = mk(), b = mk(); simulateTo(a, T0 + 9 * 3600); for (let t = T0; t < T0 + 9 * 3600; t += 1234) simulateTo(b, t); simulateTo(b, T0 + 9 * 3600);
  const s1 = JSON.stringify({ ...a, lastSeen: 0 }), s2 = JSON.stringify({ ...b, lastSeen: 0 }); if (s1 !== s2) out.push('sim: 離線補算與逐格推進不一致');
  const c = mk(); simulateTo(c, T0 + 9 * 3600); if (JSON.stringify({ ...c, lastSeen: 0 }) !== s1) out.push('sim: 相同輸入結果不同');
  return out;
}
