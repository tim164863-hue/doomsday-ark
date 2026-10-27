// 波浪參數：GPU（海面 shader）與 CPU（船搖晃、海洋生物、漂流物）共用同一組
export const WAVES = [
  { a: 0.35, L: 78, A: 0.62 },
  { a: -0.55, L: 46, A: 0.38 },
  { a: 1.15, L: 28, A: 0.2 },
  { a: 2.3, L: 17, A: 0.1 },
  { a: 0.8, L: 10, A: 0.05 },
];
const G = 9.8;
for (const w of WAVES) { w.k = (Math.PI * 2) / w.L; w.w = Math.sqrt(G * w.k); w.dx = Math.cos(w.a); w.dz = Math.sin(w.a); }
export const waveState = { amp: 1 };
export function waveHeight(x, z, t) {
  let h = 0;
  for (const w of WAVES) h += w.A * Math.sin(w.k * (w.dx * x + w.dz * z) - w.w * t);
  return h * waveState.amp;
}
export function waveNormal(x, z, t, out) {
  let gx = 0, gz = 0;
  for (const w of WAVES) { const c = w.A * w.k * Math.cos(w.k * (w.dx * x + w.dz * z) - w.w * t); gx += c * w.dx; gz += c * w.dz; }
  out.set(-gx * waveState.amp, 1, -gz * waveState.amp).normalize();
  return out;
}
