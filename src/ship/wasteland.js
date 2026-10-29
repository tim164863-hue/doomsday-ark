// 末日廢土感：程序式的鏽蝕 / 掉漆 / 補丁鋼板 / 土法煉鋼零件（沒有任何外部素材、沒有貼圖檔）。
//   · wornMat(m)：把一個 MeshStandardMaterial 複製成「舊化」版本——在 shader 裡以物件座標做噪聲：
//     鏽水痕（垂直條紋）、掉漆斑（露出底漆 / 裸鋼）、整體髒污褪色、粗糙度變高。不加貼圖、不加 draw call。
//   · patchShip(group, opts)：沿船殼側面（射線打在實際模型上）貼焊接補丁鋼板（螺栓 + 焊縫 + 鏽水痕）、掛輪胎當護舷、
//     在艙頂放土法天線 / 汽油桶 / 鐵皮棚。所有零件依「頂點色」合併成 1 個 mesh（每艘船只多 1 個 draw call）。
//   · 零件只放在船殼外側與艙頂，不放在可走甲板上（走道不受影響）。亂數以船型 + 等級為種子（同一艘船永遠長一樣）。
//   · 旗艦：wearInPlace(m) 就地改船殼材質（材質每幀被改 emissive，不能複製）；patchShip 的 meshes/yRange/n/sc 選項把補丁板貼在旗艦船殼上。
//   · 網址加 ?wl=0 可關閉（用來做前後對照 / 效能比較）。
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ART, texSet } from '../world/art.js';
import { dressProps } from './props.js';

export const WL_ON = typeof location === 'undefined' ? true : !/[?&]wl=0\b/.test(location.search);

const GLSL_NOISE = /* glsl */`
float wlH(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float wlN(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(wlH(i),wlH(i+vec2(1,0)),f.x), mix(wlH(i+vec2(0,1)),wlH(i+vec2(1,1)),f.x), f.y); }
float wlF(vec2 p){ return 0.55*wlN(p) + 0.3*wlN(p*2.3+7.1) + 0.15*wlN(p*5.1+3.3); }
`;

const GLSL_TEX = /* glsl */`
varying vec3 vWlN; uniform sampler2D uWlA, uWlR; uniform float uWlT, uWlAm, uWlRm, uWlB;
vec4 wlTri(sampler2D t, vec3 p, vec3 n){
  #ifdef WL_TRI
    vec3 w = pow(abs(n), vec3(5.0)); w /= (w.x + w.y + w.z + 1e-4);
    return texture2D(t, p.zy)*w.x + texture2D(t, p.xz)*w.y + texture2D(t, p.xy)*w.z;
  #else
    vec3 a = abs(n); return (a.x > a.y && a.x > a.z) ? texture2D(t, p.zy) : (a.y > a.z ? texture2D(t, p.xz) : texture2D(t, p.xy));
  #endif
}
vec3 wlBump(vec3 pos, vec3 N, vec2 dH){
  vec3 sx = normalize(dFdx(pos)), sy = normalize(dFdy(pos)); vec3 r1 = cross(sy, N), r2 = cross(N, sx);
  float det = dot(sx, r1); det *= (float(gl_FrontFacing) * 2.0 - 1.0); vec3 g = sign(det) * (dH.x * r1 + dH.y * r2); return normalize(abs(det) * N - g);
}`;
function injectWear(sh, str, sc = 1, cov = 0, chipK = 1, tk = 'steel') {
    const TS = texSet(tk); for (const k in TS) if (k[0] === 'u') sh.uniforms[k] = TS[k];
    const TK = Math.max(0.35, sc * 0.7).toFixed(3);
    if (ART.hi) sh.fragmentShader = '#define WL_TRI\n' + sh.fragmentShader;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWlP; varying vec3 vWlN;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWlP = position; vWlN = objectNormal;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWlP;\n' + GLSL_NOISE + GLSL_TEX)
      .replace('#include <color_fragment>', `#include <color_fragment>
      float wlM = 0.0; vec3 wlR = vec3(1.0); float wlHt = 0.5;
      { vec3 P = vWlP * ${sc.toFixed(3)}; float S = ${str.toFixed(2)};
        float sx = P.x*1.7 + P.z*2.1;
        float streak = smoothstep(${(0.6 - cov).toFixed(2)}, ${(0.92 - cov).toFixed(2)}, wlF(vec2(sx, P.y*0.28 + wlN(vec2(sx*0.6, 1.7))*1.2)));
        float low = smoothstep(2.4, -0.4, vWlP.y) * 0.35;
        float chip = smoothstep(${(0.74 - cov * 0.25).toFixed(2)}, ${(0.8 - cov * 0.2).toFixed(2)}, wlN(P.xz*6.5 + P.y*4.0)*0.55 + wlN(P.xy*11.0 + P.z*2.0)*0.45);
        float grime = wlF(P.xz*0.9 + P.y*0.5);
        vec3 base = diffuseColor.rgb * vec3(0.8, 0.76, 0.7) * (0.82 + 0.18*grime);
        vec3 rust = mix(vec3(0.33,0.15,0.07), vec3(0.58,0.3,0.11), wlN(P.xz*5.0 + P.y*3.0));
        vec3 bare = vec3(0.30,0.28,0.26) * (0.8 + 0.4*wlN(P.xz*20.0));
        vec3 c = mix(base, rust, clamp(streak*0.75 + low, 0.0, 1.0) * S);
        c = mix(c, bare, chip * 0.75 * S * ${chipK.toFixed(2)});
        // 真實貼圖（ambientCG CC0）：疊在程序式遮罩上——污垢明暗、貼圖自帶的鏽、鏽區改用鏽貼圖，高度圖給凹凸
        vec3 nO = normalize(vWlN); vec4 tA = wlTri(uWlA, vWlP*${TK}, nO); vec4 tR = wlTri(uWlR, vWlP*${TK}*0.6 + 3.7, nO);
        float rustAmt = clamp(streak*0.75 + low, 0.0, 1.0) * S, T = uWlT;
        c *= mix(1.0, clamp(pow(dot(tA.rgb, vec3(0.333))/uWlAm, 1.6), 0.3, 1.7), 0.9*T);
        c = mix(c, tA.rgb*vec3(1.0,0.88,0.8), smoothstep(0.05, 0.22, tA.r - tA.b) * 0.85 * S * T);
        c = mix(c, tR.rgb*(0.75 + 0.5*dot(tR.rgb, vec3(0.333))/uWlRm*0.5), smoothstep(0.1, 0.55, rustAmt*1.3 + (tR.a - 0.5)*0.6) * clamp(rustAmt*1.5, 0.0, 1.0) * 0.92 * T);
        wlHt = mix(tA.a, tR.a, rustAmt) * T + 0.5*(1.0 - T);
        wlR = clamp(c / max(diffuseColor.rgb, vec3(0.08)), 0.0, 1.3);
        diffuseColor.rgb = c; wlM = clamp(streak*0.75 + low + chip*${chipK.toFixed(2)}, 0.0, 1.0) * S; }`)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n if (uWlT > 0.01) normal = wlBump(-vViewPosition, normal, vec2(dFdx(wlHt), dFdy(wlHt)) * uWlB);')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = mix(roughnessFactor, 0.96, wlM*0.85);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n metalnessFactor *= (1.0 - wlM*0.6);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance *= wlR * 0.92;');
  
}
/** 不複製材質、直接在原材質上掛舊化 shader（給會被程式即時改 emissive 等參數的船殼用；applyDetail 會呼叫 userData.wlHook） */
export function wearInPlace(m, str = 1, sc = 1, cov = 0, chipK = 1, tk = 'paint') {
  if (!WL_ON || !m || m.userData.worn) return m;
  m.userData.worn = true; m.userData.wlHook = (sh) => injectWear(sh, str, sc, cov, chipK, tk);
  const prev = m.onBeforeCompile; m.onBeforeCompile = (sh) => { if (prev) prev.call(m, sh); m.userData.wlHook(sh); };
  m.customProgramCacheKey = () => 'wlip:' + str.toFixed(2) + ':' + sc + ':' + cov + ':' + chipK + ':' + tk + (ART.hi ? 'h' : 'l'); m.needsUpdate = true; return m;
}
const WORN = new Map();
/** 舊化材質（同一個原材質只複製一次；透明 / 自發光的不處理）。 */
export function wornMat(m, str = 1) {
  if (!WL_ON) return m;
  if (!m || !m.isMeshStandardMaterial || m.userData.worn || m.transparent || (m.emissiveIntensity > 0.2 && m.emissive && m.emissive.getHex() > 0x303030)) return m;
  const key = m.uuid + ':' + str; if (WORN.has(key)) return WORN.get(key);
  const w = m.clone(); w.name = (m.name || 'mat') + '_worn'; w.userData = { ...m.userData, worn: true };
  w.onBeforeCompile = (sh) => injectWear(sh, str);
  w.customProgramCacheKey = () => 'wl1:' + str.toFixed(2) + (ART.hi ? 'h' : 'l');
  WORN.set(key, w); return w;
}
/** 整個 Group 下的材質全換成舊化版 */
export function wornTree(root, str = 1) { root.traverse((o) => { if (o.isMesh && o.material && !o.userData.wlSkip) o.material = Array.isArray(o.material) ? o.material.map((m) => wornMat(m, str)) : wornMat(o.material, str); }); }

// ---------------------------------------------------------------- 零件（頂點色合併）
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _c = new THREE.Color();
class Parts {
  constructor() { this.g = []; }
  add(geo, hex, pos, quat, scl) { const g = geo.index ? geo : geo.toNonIndexed(); _m.compose(pos, quat || _q.identity(), scl || _s.set(1, 1, 1)); g.applyMatrix4(_m); const n = g.attributes.position.count, col = new Float32Array(n * 3); _c.setHex(hex); for (let i = 0; i < n; i++) { col[i * 3] = _c.r; col[i * 3 + 1] = _c.g; col[i * 3 + 2] = _c.b; } g.setAttribute('color', new THREE.BufferAttribute(col, 3)); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) g.deleteAttribute(k); this.g.push(g); }
  box(w, h, d, hex, x, y, z, q) { this.add(new THREE.BoxGeometry(w, h, d), hex, new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1)); }
  mesh(mat) { if (!this.g.length) return null; const geo = mergeGeometries(this.g, false); if (!geo) return null; const o = new THREE.Mesh(geo, mat); o.castShadow = true; o.receiveShadow = true; o.userData.wlParts = true; o.userData.wlSkip = true; return o; }
}
let PARTMAT = null;
const partMat = () => PARTMAT || (PARTMAT = wornMat(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.25 }), 0.7));

const PLATE = [0x9a6a44, 0x80786c, 0x6c746e, 0xa85f38, 0x5f6670];
let _TM = null; const TIREMAT = () => _TM || (_TM = new THREE.MeshStandardMaterial({ color: 0x1d1d1f, roughness: 0.95 })); let _BM = null;
const buoyFb = (it) => new THREE.Mesh(new THREE.TorusGeometry(0.3 * it.s, 0.09 * it.s, 6, 16), _BM || (_BM = new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.8 })));
const TIRE = 0x1d1d1f, WELD = 0xa59d8c, BOLT = 0x2a2724, DRIP = 0x4a2412;
const AXZ = new THREE.Vector3(0, 0, 1), AXY = new THREE.Vector3(0, 1, 0);

/** 對一艘「小船模型」（模型座標、+x 船頭、水線 y=0）加上廢土零件。opts = { type, lv, seed } */
export function patchShip(model, opts = {}) {
  if (!WL_ON) return null;
  const { type = 'skiff', lv = 1 } = opts; const R = rng(hashStr(type + ':' + lv + ':' + (opts.seed || 0)));
  model.updateMatrixWorld(true); const hullOnly = !!opts.meshes; const bb = new THREE.Box3(); if (hullOnly) opts.meshes.forEach((m) => bb.expandByObject(m)); else bb.setFromObject(model); const sz = bb.getSize(new THREE.Vector3());
  const rc = new THREE.Raycaster(); const meshes = hullOnly ? opts.meshes.slice() : []; if (!hullOnly) model.traverse((o) => { if (o.isMesh && !o.userData.wlParts) meshes.push(o); });
  const hit = (o, d) => { rc.set(o, d); const h = rc.intersectObjects(meshes, false); return h.length ? h[0] : null; };
  const P = new Parts();
  const fb = Math.min(sz.y * 0.5, { skiff: 0.9, speedboat: 0.8, tug: 1.5, sub: 0.6, patrol: 1.5, icebreaker: 2.8 }[type] || 1.0); // 乾舷高度（補丁貼的範圍）
  const nPlate = opts.n || (5 + lv * 2 + Math.round(sz.x / 8));
  const n3 = new THREE.Vector3(), q3 = new THREE.Quaternion();
  const spots = [];
  const sideHit = (x, y, sd) => { const h = hit(new THREE.Vector3(x, y, sd * (sz.z + 2)), new THREE.Vector3(0, 0, -sd)); if (!h || !h.face) return null; const nm = h.face.normal.clone().transformDirection(h.object.matrixWorld); if (Math.abs(nm.y) > 0.55) return null; return { p: h.point.clone(), n: nm }; };
  let guard = 0;
  while (spots.length < nPlate && guard++ < nPlate * 14) {
    const sd = R() < 0.5 ? -1 : 1, x = bb.min.x + sz.x * (0.12 + 0.72 * R()), y = opts.yRange ? opts.yRange[0] + (opts.yRange[1] - opts.yRange[0]) * R() : 0.12 + fb * (0.15 + 0.75 * R()); const h = sideHit(x, y, sd); if (!h) continue;
    if (spots.some((s) => s.sd === sd && Math.hypot(s.p.x - h.p.x, s.p.y - h.p.y) < 0.9)) continue; spots.push({ ...h, sd, y });
  }
  const sc = opts.sc || Math.max(0.8, Math.min(2.2, sz.x / 7)); // 大船補丁大一點
  for (const s of spots) {
    const w = (0.5 + R() * 0.7) * sc, h = (0.3 + R() * 0.45) * sc, hex = PLATE[(R() * PLATE.length) | 0]; q3.setFromUnitVectors(AXZ, s.n.set(s.n.x, 0, s.n.z).normalize()); const roll = (R() - 0.5) * 0.12;
    _q.setFromAxisAngle(AXZ, roll); q3.multiply(_q); const at = (lx, ly, lz) => new THREE.Vector3(lx, ly, lz).applyQuaternion(q3).add(s.p).addScaledVector(s.n, 0.012 * sc);
    P.add(new THREE.BoxGeometry(w, h, 0.045 * sc), hex, at(0, 0, 0.02 * sc), q3);
    for (const [ex, ey, ew, eh] of [[0, h / 2, w, 0.035 * sc], [0, -h / 2, w, 0.035 * sc], [-w / 2, 0, 0.035 * sc, h], [w / 2, 0, 0.035 * sc, h]]) P.add(new THREE.BoxGeometry(ew, eh, 0.05 * sc), WELD, at(ex, ey, 0.025 * sc), q3);
    for (const [bx, by] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) P.add(new THREE.CylinderGeometry(0.03 * sc, 0.03 * sc, 0.04 * sc, 6).rotateX(Math.PI / 2), BOLT, at(bx * (w / 2 - 0.07 * sc), by * (h / 2 - 0.07 * sc), 0.05 * sc), q3);
    const dl = (0.35 + R() * 0.7) * sc; P.add(new THREE.BoxGeometry(0.05 * sc, dl, 0.02 * sc), DRIP, at((R() - 0.5) * w * 0.7, -h / 2 - dl / 2, 0.01 * sc), q3);
  }
  // 掛在舷側的輪胎護舷（2–3 個，離水面 ~0.2m）
  const nTire = hullOnly ? (opts.tires || 0) : 2 + (lv > 1 ? 1 : 0); const PR = [];   // PR：真實道具（ship/props.js；載入失敗用 fb 的簡單幾何）
  const tireFb = (it) => new THREE.Mesh(new THREE.TorusGeometry(0.22 * it.s, 0.22 * it.s * 0.42, 6, 14), TIREMAT());
  for (let i = 0, g = 0; i < nTire && g < 30; g++) { const sd = i % 2 ? -1 : 1, x = bb.min.x + sz.x * (0.25 + 0.5 * R()); const h = sideHit(x, 0.28 * sc, sd); if (!h) continue; i++;
    const nn = h.n.set(h.n.x, 0, h.n.z).normalize(); const r = 0.22 * sc; PR.push({ id: 'old_tyre', p: h.p.clone().addScaledVector(nn, r * 0.45), n: nn.clone(), roll: R() * 6.28, s: sc, sit: false, fb: tireFb });
    P.add(new THREE.CylinderGeometry(0.012 * sc, 0.012 * sc, 0.5 * sc, 4), BOLT, h.p.clone().add(new THREE.Vector3(0, 0.25 * sc, 0)).addScaledVector(nn, 0.03)); }
  // 旗艦：舷側成排輪胎護舷 + 救生圈（掛在船殼上）
  if (hullOnly && opts.yRange) {
    const y0 = opts.yRange[0];
    for (let i = 0, g = 0; i < (opts.fenders || 0) && g < 80; g++) { const sd = i % 2 ? -1 : 1, x = bb.min.x + sz.x * (0.14 + 0.7 * ((i >> 1) + R() * 0.5) / ((opts.fenders || 2) / 2)); const h = sideHit(x, y0 + 0.2, sd); if (!h) continue; i++;
      const nn = h.n.set(h.n.x, 0, h.n.z).normalize(); PR.push({ id: 'old_tyre', p: h.p.clone().addScaledVector(nn, 0.38), n: nn.clone(), roll: R() * 6.28, s: 1.9, sit: false, fb: tireFb }); }
    for (let i = 0, g = 0; i < (opts.buoys || 0) && g < 80; g++) { const sd = i % 2 ? -1 : 1, x = bb.min.x + sz.x * (0.2 + 0.6 * R()); const h = sideHit(x, y0 + 2.6 + R() * 2.2, sd); if (!h) continue; i++;
      const nn = h.n.set(h.n.x, 0, h.n.z).normalize(); PR.push({ id: 'lifebuoy', p: h.p.clone().addScaledVector(nn, 0.12), n: nn.clone(), roll: R() * 6.28, s: 1.7, sit: false, fb: buoyFb }); }
  }
  // 艙頂：往下打射線找「比甲板高」的上表面
  const tops = []; const step = Math.max(0.6, sz.x / 16);
  if (!hullOnly) for (let x = bb.min.x + 0.6; x < bb.max.x - 0.4; x += step) for (let z = -sz.z * 0.3; z <= sz.z * 0.3; z += Math.max(0.5, sz.z / 6)) { const h = hit(new THREE.Vector3(x, bb.max.y + 2, z), new THREE.Vector3(0, -1, 0)); if (h && h.face) { const nm = h.face.normal.clone().transformDirection(h.object.matrixWorld); if (nm.y > 0.9) tops.push(h.point.clone()); } }
  if (tops.length && !hullOnly) {
    const ys = tops.map((t) => t.y).sort((a, b) => a - b), lowY = ys[Math.floor(ys.length * 0.2)]; const roofs = tops.filter((t) => t.y > lowY + 0.9 && t.y < bb.max.y - 0.05);
    const pick = []; for (let g = 0; g < 40 && pick.length < 3 && roofs.length; g++) { const t = roofs[(R() * roofs.length) | 0]; if (pick.every((u) => Math.hypot(u.x - t.x, u.z - t.z) > 1.3)) pick.push(t); }
    pick.forEach((t, i) => {
      const k = (i + (R() * 3) | 0) % 3;
      if (k === 0) { // 土法天線 + 破布旗 + 拉線
        P.add(new THREE.CylinderGeometry(0.018, 0.024, 1.5, 5), 0x6b6258, new THREE.Vector3(t.x, t.y + 0.75, t.z)); P.box(0.55, 0.025, 0.025, 0x6b6258, t.x, t.y + 1.2, t.z); P.box(0.4, 0.28, 0.01, 0xa33a2a, t.x + 0.22, t.y + 1.38, t.z);
        P.box(0.9, 0.01, 0.01, 0x2a2724, t.x + 0.4, t.y + 0.7, t.z + 0.2, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.4, -0.6)));
      } else if (k === 1) { // 綁在艙頂的油桶（真實模型 barrel_03；沒載到就用圓柱 + 鐵箍）
        PR.push({ id: 'barrel_03', p: new THREE.Vector3(t.x, t.y, t.z), q: new THREE.Quaternion().setFromAxisAngle(AXY, R() * 6.28), s: 0.72, fb: (it) => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: [0x8a4a2a, 0x3a5a7a, 0x6b6a3a][i % 3], roughness: 0.8, metalness: 0.3 }); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.55, 10), m); c.position.y = 0.275; g.add(c); return g; } });
        PR.push({ id: 'metal_jerrycan', p: new THREE.Vector3(t.x + 0.38, t.y, t.z + 0.1), q: new THREE.Quaternion().setFromAxisAngle(AXY, R() * 6.28), s: 0.6, fb: (it) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 0.12), new THREE.MeshStandardMaterial({ color: 0xa8a038, roughness: 0.8 })); m.position.y = 0.15; const g = new THREE.Group(); g.add(m); return g; } });
      } else { // 鐵皮棚：兩根撐竿 + 斜放的波浪鐵皮
        for (const dz of [-0.4, 0.4]) P.add(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4), 0x6b6258, new THREE.Vector3(t.x - 0.3, t.y + 0.4, t.z + dz));
        P.box(0.9, 0.025, 1.1, 0x7a5233, t.x, t.y + 0.78, t.z, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.18))); for (let j = -2; j <= 2; j++) P.box(0.9, 0.035, 0.03, 0x59605a, t.x, t.y + 0.8, t.z + j * 0.2, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.18)));
      }
    });
    // 真實道具點綴（只放在艙頂上、離主件 0.5 m 內，且那一點下方確實是同高度的艙頂；lv 越高越雜）
    const topAt = (x, z, y) => { const h = hit(new THREE.Vector3(x, bb.max.y + 2, z), new THREE.Vector3(0, -1, 0)); return h && h.face && Math.abs(h.point.y - y) < 0.12 && h.face.normal.y > 0.7; };
    const crateFb = (it) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0x7a5a38, roughness: 0.9 })); m.position.y = 0.25; const g = new THREE.Group(); g.add(m); return g; };
    const tankFb = (it) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.5, 10), new THREE.MeshStandardMaterial({ color: 0x9aa0a4, roughness: 0.6, metalness: 0.4 })); m.position.y = 0.25; const g = new THREE.Group(); g.add(m); return g; };
    pick.forEach((t, i) => {
      const spot = (dx, dz) => { for (const [ax, az] of [[dx, dz], [-dx, dz], [dx, -dz], [-dx, -dz]]) if (topAt(t.x + ax, t.z + az, t.y)) return new THREE.Vector3(t.x + ax, t.y, t.z + az); return null; };
      const qy = () => new THREE.Quaternion().setFromAxisAngle(AXY, R() * 6.28);
      if (i % 3 === 0) { const a = spot(0.0, 0.55), b = spot(0.5, 0.5); if (a) PR.push({ id: 'wooden_crate_02', p: a, q: qy(), s: 1, fb: crateFb }); if (b) PR.push({ id: 'metal_jerrycan', p: b, q: qy(), s: 0.7, fb: null }); }
      else if (i % 3 === 1) { const a = spot(0.55, 0.0); if (a) PR.push({ id: 'metal_jerrycan', p: a, q: qy(), s: 0.7, fb: null }); }
      else { const a = spot(0.0, 0.6), b = spot(0.3, 0.7); if (a) PR.push({ id: 'propane_tank', p: a, q: qy(), s: 1, fb: tankFb }); if (b) PR.push({ id: 'propane_tank', p: b, q: qy(), s: 0.9, fb: tankFb }); }
    });
    if (lv >= 2 && roofs.length) for (let g = 0; g < 12; g++) { const t = roofs[(R() * roofs.length) | 0]; if (topAt(t.x, t.z, t.y) && pick.every((u) => Math.hypot(u.x - t.x, u.z - t.z) > 0.9)) { PR.push({ id: 'portable_generator', p: new THREE.Vector3(t.x, t.y, t.z), q: new THREE.Quaternion().setFromAxisAngle(AXY, R() * 6.28), s: 1, fb: null }); break; } }
    // 升級後裝上的「土製加強」：Lv2 多一面鐵皮擋板、Lv3 再加一盞探照燈
    if (lv >= 2 && roofs.length) { const t = roofs[(R() * roofs.length) | 0]; P.box(0.9, 0.5, 0.04, 0x59605a, t.x, t.y + 0.28, t.z + 0.45, new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0))); }
    if (lv >= 3 && roofs.length) { const t = roofs[(R() * roofs.length) | 0]; P.add(new THREE.CylinderGeometry(0.1, 0.14, 0.2, 8), 0x4f5660, new THREE.Vector3(t.x, t.y + 0.5, t.z)); P.add(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 4), BOLT, new THREE.Vector3(t.x, t.y + 0.2, t.z)); }
  }
  const mesh = P.mesh(partMat()); if (mesh) { mesh.name = 'wasteland-parts'; model.add(mesh); }
  if (PR.length) dressProps(model, PR);
  if (!hullOnly) wornTree(model); return mesh;
}
