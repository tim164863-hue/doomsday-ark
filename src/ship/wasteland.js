// 末日廢土感：程序式的鏽蝕 / 掉漆 / 補丁鋼板 / 土法煉鋼零件（沒有任何外部素材、沒有貼圖檔）。
//   · wornMat(m)：把一個 MeshStandardMaterial 複製成「舊化」版本——在 shader 裡以物件座標做噪聲：
//     鏽水痕（垂直條紋）、掉漆斑（露出底漆 / 裸鋼）、整體髒污褪色、粗糙度變高。不加貼圖、不加 draw call。
//   · patchShip(group, opts)：沿船殼側面（射線打在實際模型上）貼焊接補丁鋼板（螺栓 + 焊縫 + 鏽水痕）、掛輪胎當護舷、
//     在艙頂放土法天線 / 汽油桶 / 鐵皮棚。所有零件依「頂點色」合併成 1 個 mesh（每艘船只多 1 個 draw call）。
//   · 零件只放在船殼外側與艙頂，不放在可走甲板上（走道不受影響）。亂數以船型 + 等級為種子（同一艘船永遠長一樣）。
//   · 網址加 ?wl=0 可關閉（用來做前後對照 / 效能比較）。
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const WL_ON = typeof location === 'undefined' ? true : !/[?&]wl=0\b/.test(location.search);

const GLSL_NOISE = /* glsl */`
float wlH(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float wlN(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(wlH(i),wlH(i+vec2(1,0)),f.x), mix(wlH(i+vec2(0,1)),wlH(i+vec2(1,1)),f.x), f.y); }
float wlF(vec2 p){ return 0.55*wlN(p) + 0.3*wlN(p*2.3+7.1) + 0.15*wlN(p*5.1+3.3); }
`;

function injectWear(sh, str, sc = 1, cov = 0) {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWlP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWlP = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWlP;\n' + GLSL_NOISE)
      .replace('#include <color_fragment>', `#include <color_fragment>
      float wlM = 0.0; vec3 wlR = vec3(1.0);
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
        c = mix(c, bare, chip * 0.75 * S);
        wlR = clamp(c / max(diffuseColor.rgb, vec3(0.08)), 0.0, 1.3);
        diffuseColor.rgb = c; wlM = clamp(streak*0.75 + low + chip, 0.0, 1.0) * S; }`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = mix(roughnessFactor, 0.96, wlM*0.85);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n metalnessFactor *= (1.0 - wlM*0.6);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance *= wlR * 0.92;');
  
}
/** 不複製材質、直接在原材質上掛舊化 shader（給會被程式即時改 emissive 等參數的船殼用；applyDetail 會呼叫 userData.wlHook） */
export function wearInPlace(m, str = 1, sc = 1, cov = 0) {
  if (!WL_ON || !m || m.userData.worn) return m;
  m.userData.worn = true; m.userData.wlHook = (sh) => injectWear(sh, str, sc, cov);
  const prev = m.onBeforeCompile; m.onBeforeCompile = (sh) => { if (prev) prev.call(m, sh); m.userData.wlHook(sh); };
  m.customProgramCacheKey = () => 'wlip:' + str.toFixed(2) + ':' + sc + ':' + cov; m.needsUpdate = true; return m;
}
const WORN = new Map();
/** 舊化材質（同一個原材質只複製一次；透明 / 自發光的不處理）。 */
export function wornMat(m, str = 1) {
  if (!WL_ON) return m;
  if (!m || !m.isMeshStandardMaterial || m.userData.worn || m.transparent || (m.emissiveIntensity > 0.2 && m.emissive && m.emissive.getHex() > 0x303030)) return m;
  const key = m.uuid + ':' + str; if (WORN.has(key)) return WORN.get(key);
  const w = m.clone(); w.name = (m.name || 'mat') + '_worn'; w.userData = { ...m.userData, worn: true };
  w.onBeforeCompile = (sh) => injectWear(sh, str);
  w.customProgramCacheKey = () => 'wl1:' + str.toFixed(2);
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
const TIRE = 0x1d1d1f, WELD = 0xa59d8c, BOLT = 0x2a2724, DRIP = 0x4a2412;
const AXZ = new THREE.Vector3(0, 0, 1);

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
  const nTire = hullOnly ? (opts.tires || 0) : 2 + (lv > 1 ? 1 : 0);
  for (let i = 0, g = 0; i < nTire && g < 30; g++) { const sd = i % 2 ? -1 : 1, x = bb.min.x + sz.x * (0.25 + 0.5 * R()); const h = sideHit(x, 0.28 * sc, sd); if (!h) continue; i++;
    const nn = h.n.set(h.n.x, 0, h.n.z).normalize(); q3.setFromUnitVectors(AXZ, nn); const r = 0.22 * sc; P.add(new THREE.TorusGeometry(r, r * 0.42, 6, 14), TIRE, h.p.clone().addScaledVector(nn, r * 0.45), q3);
    P.add(new THREE.CylinderGeometry(0.012 * sc, 0.012 * sc, 0.5 * sc, 4), BOLT, h.p.clone().add(new THREE.Vector3(0, 0.25 * sc, 0)).addScaledVector(nn, 0.03)); }
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
      } else if (k === 1) { // 綁在艙頂的汽油桶 + 兩道鐵箍
        P.add(new THREE.CylinderGeometry(0.2, 0.2, 0.55, 10), [0x8a4a2a, 0x3a5a7a, 0x6b6a3a][i % 3], new THREE.Vector3(t.x, t.y + 0.275, t.z)); for (const yy of [0.14, 0.42]) P.add(new THREE.CylinderGeometry(0.21, 0.21, 0.03, 10), BOLT, new THREE.Vector3(t.x, t.y + yy, t.z));
        P.box(0.22, 0.3, 0.12, 0xa8a038, t.x + 0.38, t.y + 0.15, t.z + 0.1);
      } else { // 鐵皮棚：兩根撐竿 + 斜放的波浪鐵皮
        for (const dz of [-0.4, 0.4]) P.add(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4), 0x6b6258, new THREE.Vector3(t.x - 0.3, t.y + 0.4, t.z + dz));
        P.box(0.9, 0.025, 1.1, 0x7a5233, t.x, t.y + 0.78, t.z, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.18))); for (let j = -2; j <= 2; j++) P.box(0.9, 0.035, 0.03, 0x59605a, t.x, t.y + 0.8, t.z + j * 0.2, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.18)));
      }
    });
    // 升級後裝上的「土製加強」：Lv2 多一面鐵皮擋板、Lv3 再加一盞探照燈
    if (lv >= 2 && roofs.length) { const t = roofs[(R() * roofs.length) | 0]; P.box(0.9, 0.5, 0.04, 0x59605a, t.x, t.y + 0.28, t.z + 0.45, new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0))); }
    if (lv >= 3 && roofs.length) { const t = roofs[(R() * roofs.length) | 0]; P.add(new THREE.CylinderGeometry(0.1, 0.14, 0.2, 8), 0x4f5660, new THREE.Vector3(t.x, t.y + 0.5, t.z)); P.add(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 4), BOLT, new THREE.Vector3(t.x, t.y + 0.2, t.z)); }
  }
  const mesh = P.mesh(partMat()); if (mesh) { mesh.name = 'wasteland-parts'; model.add(mesh); }
  if (!hullOnly) wornTree(model); return mesh;
}
