import { isTouchDevice } from './util.js';
export const QUALITY = {
  high: { name: 'high', dpr: 2, shadows: 2048, oceanRings: 150, oceanSegs: 320, waterDetail: 1, clouds: true, cloudOctaves: 5, birds: 16, dolphins: 5, ruins: true, debris: 36 },
  mid: { name: 'mid', dpr: 1.5, shadows: 1024, oceanRings: 100, oceanSegs: 210, waterDetail: 0.8, clouds: true, cloudOctaves: 4, birds: 10, dolphins: 4, ruins: true, debris: 24 },
  low: { name: 'low', dpr: 1, shadows: 0, oceanRings: 64, oceanSegs: 120, waterDetail: 0.45, clouds: true, cloudOctaves: 2, birds: 6, dolphins: 3, ruins: true, debris: 14 },
};
export const ORDER = ['high', 'mid', 'low'];
export function detectQuality() {
  const p = new URLSearchParams(location.search);
  if (p.get('q') && QUALITY[p.get('q')]) return { level: p.get('q'), locked: true };
  const saved = localStorage.getItem('ark.quality');
  if (saved && QUALITY[saved]) return { level: saved, locked: true };
  const mobile = isTouchDevice() || Math.min(screen.width, screen.height) < 520;
  const mem = navigator.deviceMemory || 4;
  if (mobile) return { level: mem >= 6 ? 'mid' : 'low', locked: false };
  return { level: 'high', locked: false };
}
