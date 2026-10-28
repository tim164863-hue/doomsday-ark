// 駕駛母船的純函式（物理步進、座標轉換、地圖係數）；可在 node 測試。
import { WORLD } from '../sim/fleetdefs.js';
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/** 1 公尺 = 多少地圖單位：母船滿速（11 m/s）剛好等於自動航行的 arkSpeed（單位/分鐘）。 */
export const HELM_K = (WORLD.arkSpeed / 60) / 11;
/** 純函式（可測）：船的一個步進。st = {v,w,yaw,x,z,thr}；in = {thr,rud}；cfg = {vmax,turn,acc,dec}。回傳新狀態。 */
export function helmStep(st, input, cfg, dt) {
  const tv = input.thr >= 0 ? input.thr * cfg.vmax : input.thr * cfg.vmax * 0.9;
  const k = Math.abs(tv) > Math.abs(st.v) ? cfg.acc : cfg.dec; st.v += (tv - st.v) * (1 - Math.exp(-k * dt));
  // 舵效隨船速：速度越快轉得越有力；倒車時舵反向
  const eff = clamp(Math.abs(st.v) / (cfg.vmax * 0.25), 0, 1) * Math.sign(st.v || 1);
  const tw = input.rud * cfg.turn * eff; st.w += (tw - st.w) * (1 - Math.exp(-cfg.rudderLag * dt)); st.yaw += st.w * dt;
  st.x += Math.cos(st.yaw) * st.v * dt; st.z -= Math.sin(st.yaw) * st.v * dt;
  return st;
}

/** 母船座標系的點 p → 世界。H = {x,z,yaw}（母船中心 / 樞軸的世界位置與航向），piv = 樞軸在母船座標系的 x。 */
export function toWorld(H, piv, p) { const a = p.x - piv, b = p.z, c = Math.cos(H.yaw), s = Math.sin(H.yaw); return { x: H.x + a * c + b * s, z: H.z - a * s + b * c }; }
export function toLocal(H, piv, x, z) { const X = x - H.x, Z = z - H.z, c = Math.cos(H.yaw), s = Math.sin(H.yaw); return { x: piv + X * c - Z * s, z: X * s + Z * c }; }
