import * as THREE from 'three';
import { applyDetail, KIND } from './detail.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function plankTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  const tones = ['#b08556', '#a67b4d', '#b88d5e', '#a07448', '#ad8254'];
  for (let i = 0; i < 8; i++) { g.fillStyle = tones[(i * 3) % tones.length]; g.fillRect(0, i * 32, 256, 32); g.fillStyle = 'rgba(60,35,15,.55)'; g.fillRect(0, i * 32, 256, 2);
    for (let k = 0; k < 3; k++) { g.fillStyle = 'rgba(60,35,15,.5)'; g.fillRect(((i * 97 + k * 83) % 256), i * 32, 2, 32); }
    for (let k = 0; k < 20; k++) { g.fillStyle = 'rgba(80,50,20,.08)'; g.fillRect(Math.random() * 256, i * 32 + Math.random() * 30, 40 + Math.random() * 60, 1); } }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.repeat.set(0.25, 0.25); return t;
}
const col = (hex, o = {}) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.7, metalness: 0.0, ...o });

export function makeMaterials(env, quality) {
  const m = {
    white: col(0xf1f3f5, { roughness: 0.55 }),
    offwhite: col(0xdfe3e6, { roughness: 0.6 }),
    hullBlue: col(0x14253f, { roughness: 0.5, metalness: 0.15 }),
    red: col(0xc23a32), darkred: col(0x7a1f1f), orange: col(0xe8782a), yellow: col(0xf2c230), green: col(0x3c9a54), darkgreen: col(0x2a6a3c),
    leaf: col(0x3f8f4a, { roughness: 0.85 }), leaf2: col(0x5aa85a, { roughness: 0.85 }),
    blue: col(0x2f66c8), lightblue: col(0x69b2e8), pink: col(0xd86a9a), purple: col(0x6d4aa8),
    teak: col(0xffffff, { roughness: 0.78, map: plankTexture() }), wood: col(0x8b5a2b, { roughness: 0.7 }), woodDark: col(0x4a2f1c, { roughness: 0.65 }), woodLight: col(0xd0a672, { roughness: 0.7 }),
    carpet: col(0x3a4a68, { roughness: 1 }), carpet2: col(0x7a3b3b, { roughness: 1 }), rug: col(0xb98f5a, { roughness: 1 }),
    tile: col(0xc9d3d8, { roughness: 0.35 }), tileBlue: col(0x3a9bc4, { roughness: 0.3 }), tileDark: col(0x6b7479, { roughness: 0.5 }),
    steel: col(0xa9b3bb, { roughness: 0.4, metalness: 0.3 }), steelDark: col(0x56606a, { roughness: 0.5, metalness: 0.2 }), black: col(0x14161a, { roughness: 0.5 }),
    rubber: col(0xb8442f, { roughness: 0.9 }), courtBlue: col(0x2d62b8, { roughness: 0.75 }), courtGreen: col(0x2f8a4a, { roughness: 0.8 }), courtLine: col(0xf5f5f5, { roughness: 0.6 }),
    asphalt: col(0x3b3f45, { roughness: 0.9 }), grass: col(0x3c8a3c, { roughness: 1 }),
    sofa: col(0x4b6a88, { roughness: 0.95 }), sofa2: col(0xa6524a, { roughness: 0.95 }), leather: col(0x2e2622, { roughness: 0.55 }),
    fabricW: col(0xe9e4da, { roughness: 1 }), fabricB: col(0x5b86c4, { roughness: 1 }), fabricP: col(0xc47aa0, { roughness: 1 }), fabricG: col(0x6fa87a, { roughness: 1 }), fabricY: col(0xd8b04a, { roughness: 1 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xbfe3f2, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false }),
    glassTint: new THREE.MeshStandardMaterial({ color: 0x5a7a8c, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.35, depthWrite: false }),
    rail: col(0xdfe6ea, { roughness: 0.3, metalness: 0.5 }),
    water: new THREE.MeshStandardMaterial({ color: 0x38b4e0, roughness: 0.08, metalness: 0.0, transparent: true, opacity: 0.82 }),
    pot: col(0xb0603a), concrete: col(0x8d9296, { roughness: 0.95 }), rust: col(0x8a4a2a, { roughness: 0.95 }),
    crate: col(0x9a7040, { roughness: 0.9 }), cargoBlue: col(0x2a5a8a), cargoRed: col(0x9a3a2a), cargoGreen: col(0x3a6a4a),
    lamp: env.lampMat, windowLit: env.windowMat,
    skin: col(0xf0c8a0, { roughness: 0.8 }), cream: col(0xf3ead8, { roughness: 0.9 }),
    heliBody: col(0xd8dde0, { roughness: 0.3, metalness: 0.3 }), heliRed: col(0xcc2b2b, { roughness: 0.4 }),
    sunshade: col(0xf5efe0, { roughness: 1 }),
    funnel: col(0xc83a2a, { roughness: 0.5 }),
  };
  m.sunshade.side = THREE.DoubleSide;
  if (quality && quality.name !== 'low') {
    const D = (names, kind) => names.forEach((n) => applyDetail(m[n], kind));
    D(['tile', 'tileBlue', 'tileDark'], KIND.tile); D(['carpet', 'carpet2', 'rug'], KIND.carpet); D(['wood', 'woodLight', 'woodDark'], KIND.wood);
    D(['rubber'], KIND.rubber); D(['asphalt', 'concrete'], KIND.grit); D(['courtBlue', 'courtGreen'], KIND.court); D(['steel', 'steelDark'], KIND.steel);
    D(['sofa', 'sofa2', 'fabricW', 'fabricB', 'fabricP', 'fabricG', 'fabricY'], KIND.fabric);
  }
  return m;
}

const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
export function xform(geo, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  _e.set(rx, ry, rz, 'YXZ'); _q.setFromEuler(_e); _p.set(x, y, z); _s.set(sx, sy, sz);
  _m4.compose(_p, _q, _s); geo.applyMatrix4(_m4); return geo;
}

/** 收集幾何（依材質合併），並記錄碰撞區塊 */
export class Builder {
  constructor(M) { this.M = M; this.parts = new Map(); this.blocks = []; this.extra = []; }
  add(mat, geo) {
    if (geo.index) geo = geo.toNonIndexed();
    for (const k of Object.keys(geo.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') geo.deleteAttribute(k);
    if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
    if (!this.parts.has(mat)) this.parts.set(mat, []);
    this.parts.get(mat).push(geo);
  }
  /** 底面在 y0 的方塊，中心 (x,z)，尺寸 w(d x), d(z), h */
  box(mat, x, z, w, d, h, y0 = 0, ry = 0) { this.add(this.M[mat], xform(new THREE.BoxGeometry(w, h, d), x, y0 + h / 2, z, 0, ry, 0)); }
  boxc(mat, x, y, z, w, h, d, ry = 0, rx = 0, rz = 0) { this.add(this.M[mat], xform(new THREE.BoxGeometry(w, h, d), x, y, z, rx, ry, rz)); }
  cyl(mat, x, z, r, h, y0 = 0, seg = 14, rTop = r) { this.add(this.M[mat], xform(new THREE.CylinderGeometry(rTop, r, h, seg), x, y0 + h / 2, z)); }
  cylc(mat, x, y, z, r, h, seg = 12, rx = 0, ry = 0, rz = 0, rTop = r) { this.add(this.M[mat], xform(new THREE.CylinderGeometry(rTop, r, h, seg), x, y, z, rx, ry, rz)); }
  sph(mat, x, y, z, r, sx = 1, sy = 1, sz = 1, seg = 10) { this.add(this.M[mat], xform(new THREE.SphereGeometry(r, seg, Math.max(6, seg - 2)), x, y, z, 0, 0, 0, sx, sy, sz)); }
  geo(mat, geo) { this.add(this.M[mat], geo); }
  block(x0, z0, x1, z1) { this.blocks.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]); }
  blockC(x, z, w, d, ry = 0) {
    const c = Math.abs(Math.cos(ry)), s = Math.abs(Math.sin(ry)); const hw = (w * c + d * s) / 2, hd = (w * s + d * c) / 2;
    this.block(x - hw, z - hd, x + hw, z + hd);
  }
  /** 軸向牆，doors: [[a,b],...] 沿牆軸的絕對座標縫隙 */
  // 精細：踢腳線、壓頂、玻璃框與窗欞（純視覺，不加碰撞）
  trimSeg(mat, alongX, mid, fixed, len, thick, h, y0) {
    if (len < 0.3) return;
    const T = (m, a, w, t, hh, yy) => (alongX ? this.box(m, a, fixed, w, t, hh, yy) : this.box(m, fixed, a, t, w, hh, yy));
    if (mat === 'white' && h >= 0.9) {
      T('steelDark', mid, len + 0.01, thick + 0.04, 0.12, y0);
      T('offwhite', mid, len + 0.01, thick + 0.035, 0.04, y0 + h);
    } else if (mat === 'glass' && h >= 0.6) {
      T('steelDark', mid, len, thick + 0.04, 0.05, y0);
      T('steelDark', mid, len, thick + 0.04, 0.05, y0 + h - 0.05);
      const n = Math.max(1, Math.round(len / 2.2));
      for (let i = 0; i <= n; i++) { const a = mid - len / 2 + (len * i) / n; T('steelDark', a, 0.06, thick + 0.03, h, y0); }
    }
  }

  wall(x0, z0, x1, z1, h, mat = 'white', thick = 0.16, doors = [], y0 = 0) {
    const alongX = Math.abs(x1 - x0) >= Math.abs(z1 - z0);
    const a0 = alongX ? Math.min(x0, x1) : Math.min(z0, z1), a1 = alongX ? Math.max(x0, x1) : Math.max(z0, z1);
    const fixed = alongX ? z0 : x0;
    const segs = []; let cur = a0;
    for (const [da, db] of [...doors].sort((p, q) => p[0] - q[0])) { if (da > cur) segs.push([cur, da]); cur = Math.max(cur, db); }
    if (cur < a1) segs.push([cur, a1]);
    for (const [s0, s1] of segs) {
      const len = s1 - s0, mid = (s0 + s1) / 2;
      if (alongX) { this.box(mat, mid, fixed, len, thick, h, y0); if (h > 0.2 && mat !== 'glass' && mat !== 'glassTint') this.block(s0 - 0.02, fixed - thick / 2 - 0.05, s1 + 0.02, fixed + thick / 2 + 0.05); else this.block(s0 - 0.02, fixed - thick / 2 - 0.05, s1 + 0.02, fixed + thick / 2 + 0.05); }
      else { this.box(mat, fixed, mid, thick, len, h, y0); this.block(fixed - thick / 2 - 0.05, s0 - 0.02, fixed + thick / 2 + 0.05, s1 + 0.02); }
      this.trimSeg(mat, alongX, mid, fixed, len, thick, h, y0);
    }
    if (mat === 'glass') for (const [da, db] of doors) if (db - da < 3.6 && da >= a0 - 0.01 && db <= a1 + 0.01) { const m = (da + db) / 2, l = db - da; if (alongX) this.box('steelDark', m, fixed, l, thick + 0.05, 0.07, y0 + h - 0.07); else this.box('steelDark', fixed, m, thick + 0.05, l, 0.07, y0 + h - 0.07); }
  }
  /** 合併後輸出 Group */
  build(shadow = true) {
    const g = new THREE.Group();
    for (const [mat, list] of this.parts) {
      const merged = mergeGeometries(list, false);
      list.forEach((x) => x.dispose());
      const mesh = new THREE.Mesh(merged, mat);
      const transparent = mat.transparent;
      mesh.castShadow = shadow && !transparent; mesh.receiveShadow = shadow;
      mesh.matrixAutoUpdate = false;
      g.add(mesh);
    }
    return g;
  }
}
