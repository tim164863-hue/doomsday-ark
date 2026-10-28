// 共用小工具
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const damp = (cur, target, lambda, dt) => lerp(cur, target, 1 - Math.exp(-lambda * dt));
export function angDiff(a, b) { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; }
export function dampAngle(cur, target, lambda, dt) { return cur + angDiff(cur, target) * (1 - Math.exp(-lambda * dt)); }
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const chance = (p) => Math.random() < p;
export function fmtClock(t01) {
  const m = Math.floor(((t01 % 1) + 1) % 1 * 1440);
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}
export const isTouchDevice = () => (('ontouchstart' in window) || navigator.maxTouchPoints > 0) && matchMedia('(pointer: coarse)').matches;
/** 資料表（無原型物件）：用存檔 / 網址 / localStorage 讀進來的字串當 key 查表時，'__proto__' / 'constructor' / 'toString' 都查不到，不會誤判成有這一項。 */
export const tbl = (o) => Object.assign(Object.create(null), o);
/** Object.hasOwn 的相容寫法（舊版 Safari / Chrome 沒有 Object.hasOwn） */
export const OWN = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
