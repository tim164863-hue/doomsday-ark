// 駕駛母船純函式測試：node tools/helm-test.mjs
import { helmStep, toWorld, toLocal, HELM_K } from '../src/play/helmphys.js';
import { WORLD } from '../src/sim/fleetdefs.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const cfg = { vmax: 11, turn: 0.2, acc: 0.32, dec: 0.5, rudderLag: 1.1 };
const run = (st, inp, sec, c = cfg) => { for (let i = 0; i < sec * 60; i++) helmStep(st, inp, c, 1 / 60); return st; };
let st = { v: 0, w: 0, yaw: 0, x: 0, z: 0 };
run(st, { thr: 1, rud: 0 }, 30); ok(Math.abs(st.v - 11) < 0.2, `滿油門 30 秒後接近最高速（${st.v.toFixed(2)}）`); ok(st.x > 250 && Math.abs(st.z) < 1e-6 && Math.abs(st.yaw) < 1e-9, '直線前進沿 +x、不偏航');
run(st, { thr: 0, rud: 0 }, 5); ok(st.v < 11 && st.v > 0.3, `收油後有慣性、不會瞬停（5 秒後 ${st.v.toFixed(2)}）`); run(st, { thr: 0, rud: 0 }, 60); ok(st.v < 0.05, '收油後最終停下');
st = { v: 0, w: 0, yaw: 0, x: 0, z: 0 }; run(st, { thr: 0, rud: 1 }, 5); ok(Math.abs(st.yaw) < 1e-9, '停著打舵不會轉（舵效隨船速）');
st = { v: 0, w: 0, yaw: 0, x: 0, z: 0 }; run(st, { thr: 1, rud: 1 }, 20); ok(st.yaw > 0.5, `左舵（rud>0）使航向增加（${st.yaw.toFixed(2)}）`); ok(st.z < 0 || st.x > 0, '左轉時船往 -z（上方）彎');
st = { v: 0, w: 0, yaw: 0, x: 0, z: 0 }; run(st, { thr: 1, rud: -1 }, 20); ok(st.yaw < -0.5 && st.z > 0, '右舵反向');
st = { v: 0, w: 0, yaw: 0, x: 0, z: 0 }; run(st, { thr: -0.35, rud: 0 }, 30); ok(st.v < 0 && st.v > -4.5, `倒車比前進慢（${st.v.toFixed(2)}）`);
st = { v: 0, w: 0, yaw: 0, x: 0, z: 0 }; run(st, { thr: 1, rud: 1 }, 40); const dist = Math.hypot(st.x, st.z); ok(st.w <= cfg.turn + 1e-6, `角速度不超過上限（${st.w.toFixed(3)}）`);
// 座標轉換互逆
const H = { x: 120, z: -40, yaw: 0.7 }; for (const piv of [0, 5.6]) for (const p of [{ x: -30, z: 10 }, { x: 40, z: -21 }, { x: piv, z: 0 }]) { const w = toWorld(H, piv, p), l = toLocal(H, piv, w.x, w.z); ok(Math.hypot(l.x - p.x, l.z - p.z) < 1e-9, `toLocal(toWorld(p)) = p（piv ${piv}）`); }
const c0 = toWorld(H, 5.6, { x: 5.6, z: 0 }); ok(Math.hypot(c0.x - H.x, c0.z - H.z) < 1e-9, '樞軸點對應到 H');
const f = toWorld({ x: 0, z: 0, yaw: Math.PI / 2 }, 0, { x: 10, z: 0 }); ok(Math.abs(f.x) < 1e-9 && Math.abs(f.z + 10) < 1e-9, 'yaw=90° 時船頭（+x）指向世界 -z（海圖上方）');
// 與海圖的係數：滿速 1 分鐘 ≈ 自動航行 1 分鐘
ok(Math.abs(11 * 60 * HELM_K - WORLD.arkSpeed) < 1e-9, `滿速航行 1 分鐘 = ${WORLD.arkSpeed} 地圖單位（=自動航行速度）`);
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
