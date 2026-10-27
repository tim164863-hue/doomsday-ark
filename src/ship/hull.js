import * as THREE from 'three';

/** 甲板外形：船尾略圓、兩側平行、船頭尖 */
export function halfWidth(x, p) {
  const { xs, xb, hz, bl } = p;
  if (x < xs || x > xb + bl) return 0;
  if (x < xs + 3) return hz * (0.84 + 0.16 * Math.sin(((x - xs) / 3) * Math.PI / 2));
  if (x <= xb) return hz;
  const u = (x - xb) / bl; return hz * Math.pow(Math.max(1 - Math.pow(u, 1.7), 0), 0.85);
}
export function outline(p, n = 16) {
  const pts = [];
  const top = [], bot = [];
  const xs = [p.xs, p.xs + 0.4, p.xs + 1.2, p.xs + 3];
  for (let i = 1; i <= 3; i++) xs.push(p.xs + 3 + (p.xb - p.xs - 3) * (i / 3));
  xs.pop(); xs.push(p.xb);
  for (let i = 1; i <= n; i++) xs.push(p.xb + p.bl * Math.min(i / n, 0.999));
  const tip = p.xb + p.bl;
  const up = xs.map((x) => [x, halfWidth(x, p)]);
  // 船頭尖端
  up[up.length - 1] = [tip - 0.05, Math.max(halfWidth(tip - 0.05, p), 0.02)];
  const poly = [];
  for (const [x, w] of up) poly.push([x, -w]);       // z 負側 (左舷)
  poly.push([tip, 0]);
  for (let i = up.length - 1; i >= 0; i--) poly.push([up[i][0], up[i][1]]);
  poly.push([p.xs, 0]);
  return poly;
}

export function pointInPoly(x, z, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
export function distToEdges(x, z, poly) {
  let m = 1e9;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x1, z1] = poly[j], [x2, z2] = poly[i];
    const dx = x2 - x1, dz = z2 - z1; const l2 = dx * dx + dz * dz || 1; let t = ((x - x1) * dx + (z - z1) * dz) / l2; t = Math.max(0, Math.min(1, t));
    m = Math.min(m, Math.hypot(x - (x1 + t * dx), z - (z1 + t * dz)));
  }
  return m;
}

/** 船殼放樣：頂部 y=topY，龍骨 y=keelY */
export function buildHull(hp, topY, keelY, M) {
  const stations = 90, sections = 14;
  const pos = [], col = [], idx = [];
  const white = new THREE.Color(0xeef1f3), navy = new THREE.Color(0x13233d), red = new THREE.Color(0x8c2a24), stripe = new THREE.Color(0xc9a24a);
  const xs = [];
  for (let i = 0; i <= stations; i++) {
    const t = i / stations; // 較密於船頭尾
    xs.push(hp.xs + (hp.xb + hp.bl - hp.xs) * (0.5 - 0.5 * Math.cos(Math.PI * t)) * 0.0 + (hp.xs + (hp.xb + hp.bl - hp.xs) * t - hp.xs));
  }
  for (let i = 0; i <= stations; i++) {
    const x = Math.min(xs[i], hp.xb + hp.bl - 0.02);
    const w = Math.max(halfWidth(x, hp), 0.02);
    const bowU = Math.max(0, (x - hp.xb) / hp.bl);
    const sheer = topY + 1.0 * bowU * bowU + 0.35 * Math.max(0, 1 - (x - hp.xs) / 14); // 船頭翹起
    const keel = keelY + (bowU > 0 ? 3.5 * Math.pow(bowU, 1.3) : 0) + (x < hp.xs + 6 ? 1.2 * (1 - (x - hp.xs) / 6) : 0);
    for (let sidx = 0; sidx <= sections * 2; sidx++) {
      const side = sidx <= sections ? -1 : 1;
      const k = sidx <= sections ? sections - sidx : sidx - sections - 1; // 0 = 頂，sections = 龍骨
      const s = (sidx <= sections ? (sections - sidx) : (sidx - sections - 1 + 0)) / sections;
      let ss, sgn;
      // 以對稱參數：從左舷頂 → 底 → 右舷頂
      const pidx = sidx; const tt = pidx / (sections * 2); // 0..1
      const q = tt <= 0.5 ? tt * 2 : (1 - tt) * 2; // 0 頂,1 底
      sgn = tt < 0.5 ? -1 : 1;
      const y = sheer + (keel - sheer) * q;
      const flare = 1 - 0.42 * Math.pow(q, 2.4) + 0.05 * Math.sin(q * Math.PI) ; // 側面鼓出再收到龍骨
      const z = sgn * w * flare * (tt === 0.5 ? 0 : 1);
      pos.push(x, y, z);
      const wl = y; let c;
      if (wl > 2.35) c = white; else if (wl > 2.0) c = stripe; else if (wl > 0.35) c = navy; else if (wl > -0.1) c = stripe; else c = red;
      c = c.clone();
      col.push(c.r, c.g, c.b);
    }
  }
  const per = sections * 2 + 1;
  for (let i = 0; i < stations; i++) for (let j = 0; j < sections * 2; j++) {
    const a = i * per + j, b = a + 1, c = a + per, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0.0, emissive: 0x242c38, side: THREE.DoubleSide }));
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}


// ===================================================== 船殼（分層）：基底 + 兩段舷側（1F / 2F 船殼層）
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const FLARE = (q) => 1 - 0.42 * Math.pow(q, 2.4) + 0.05 * Math.sin(q * Math.PI);
export function hullShape(hp, topY, keelY) {
  const sheer = (x) => { const bowU = Math.max(0, (x - hp.xb) / hp.bl); return topY + 1.0 * bowU * bowU + 0.35 * Math.max(0, 1 - (x - hp.xs) / 14); };
  const keel = (x) => { const bowU = Math.max(0, (x - hp.xb) / hp.bl); return keelY + (bowU > 0 ? 3.5 * Math.pow(bowU, 1.3) : 0) + (x < hp.xs + 6 ? 1.2 * (1 - (x - hp.xs) / 6) : 0); };
  const half = (x, y) => { const w = Math.max(halfWidth(x, hp), 0.02); const s = sheer(x), k = keel(x); return w * FLARE(clamp01((s - y) / (s - k))); };
  return { sheer, keel, half, hp };
}
/** 以船殼在高度 y 的斷面做甲板外形（內縮 inset） */
export function outlineHull(shape, y, inset = 0.3) {
  const { hp, half } = shape; const tip = hp.xb + hp.bl; const xsList = [hp.xs + inset];
  for (let x = hp.xs + 1; x < hp.xb; x += 1.5) xsList.push(x);
  xsList.push(hp.xb); const n = 18; for (let i = 1; i <= n; i++) xsList.push(hp.xb + hp.bl * Math.min(i / n, 0.985));
  const up = xsList.map((x) => [x, Math.max(half(x, y) - inset, 0.02)]);
  const poly = []; for (const [x, w] of up) poly.push([x, -w]);
  poly.push([tip - 0.6, 0]);
  for (let i = up.length - 1; i >= 0; i--) poly.push([up[i][0], up[i][1]]);
  return poly;
}

/** rows: [{ y:(x)=>number, c:Color }]（由上到下）；bottom=true 時封底（龍骨）*/
function loftBand(shape, rows, { bottom = false, stations = 110 } = {}) {
  const { hp, half } = shape; const tip = hp.xb + hp.bl - 0.02;
  const pos = [], col = [], idx = [];
  const R = rows.length;
  const xsArr = []; for (let i = 0; i <= stations; i++) { const t = i / stations; xsArr.push(hp.xs + (tip - hp.xs) * t); }
  for (const sgn of [-1, 1]) for (let i = 0; i <= stations; i++) { const x = xsArr[i]; for (let r = 0; r < R; r++) { const y = Math.max(rows[r].y(x), shape.keel(x)); pos.push(x, y, sgn * half(x, y)); const c = rows[r].c; col.push(c.r, c.g, c.b); } }
  const at = (sgnI, i, r) => (sgnI * (stations + 1) + i) * R + r;
  for (let sgnI = 0; sgnI < 2; sgnI++) for (let i = 0; i < stations; i++) for (let r = 0; r < R - 1; r++) {
    const a = at(sgnI, i, r), b = at(sgnI, i + 1, r), c = at(sgnI, i, r + 1), d = at(sgnI, i + 1, r + 1);
    if (sgnI === 0) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d);
  }
  // 船尾板（平面）
  const capStart = pos.length / 3;
  for (let r = 0; r < R; r++) for (const sgn of [-1, 1]) { const x = xsArr[0]; const y = Math.max(rows[r].y(x), shape.keel(x)); pos.push(x, y, sgn * half(x, y)); const c = rows[r].c; col.push(c.r, c.g, c.b); }
  for (let r = 0; r < R - 1; r++) { const a = capStart + r * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, c, b, b, c, d); }
  if (bottom) { for (let i = 0; i < stations; i++) { const a = at(0, i, R - 1), b = at(0, i + 1, R - 1), c = at(1, i, R - 1), d = at(1, i + 1, R - 1); idx.push(a, c, b, b, c, d); } }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  const mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, metalness: 0.0, emissive: 0xd0ccc6, side: THREE.DoubleSide }));
  mesh.castShadow = true; mesh.receiveShadow = true; return mesh;
}

/** 舷窗：沿船殼表面貼合（含法線朝向） */
function portholes(shape, y, mats, { x0 = -42, x1 = 56, step = 2.3, r = 0.27 } = {}) {
  const frame = new THREE.CylinderGeometry(r * 1.3, r * 1.3, 0.1, 14).rotateX(Math.PI / 2), glass = new THREE.CylinderGeometry(r, r, 0.12, 14).rotateX(Math.PI / 2);
  const pts = [];
  for (let x = x0; x <= x1; x += step) for (const sgn of [-1, 1]) {
    const yy = y(x); const w = shape.half(x, yy); if (w < 4.5) continue;
    const P = new THREE.Vector3(x, yy, sgn * w);
    const dx = 0.3, dy = 0.3;
    const tx = new THREE.Vector3(2 * dx, 0, sgn * (shape.half(x + dx, yy) - shape.half(x - dx, yy)));
    const ty = new THREE.Vector3(0, 2 * dy, sgn * (shape.half(x, yy + dy) - shape.half(x, yy - dy)));
    const n = new THREE.Vector3().crossVectors(sgn > 0 ? ty : tx, sgn > 0 ? tx : ty).normalize(); if (n.z * sgn < 0) n.negate();
    pts.push([P, new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n), n]);
  }
  const grp = new THREE.Group(); const m4 = new THREE.Matrix4();
  const fm = new THREE.InstancedMesh(frame, mats.frame, pts.length), gm = new THREE.InstancedMesh(glass, mats.glass, pts.length);
  pts.forEach(([P, q, n], i) => { m4.compose(P.clone().addScaledVector(n, 0.02), q, new THREE.Vector3(1, 1, 1)); fm.setMatrixAt(i, m4); m4.compose(P.clone().addScaledVector(n, 0.07), q, new THREE.Vector3(1, 1, 1)); gm.setMatrixAt(i, m4); });
  grp.add(fm, gm); return grp;
}

export function buildHullParts(hp, F, keelY, M, env) {
  const shape = hullShape(hp, F[2], keelY);
  const C = (h) => new THREE.Color(h); const white = C(0xffffff), navy = C(0x15284a), red = C(0xb02a26), gold = C(0xd8b04a);
  const S = shape.sheer; const k = (v) => () => v; const rel = (d) => (x) => S(x) - d;
  const base = loftBand(shape, [
    { y: k(F[0]), c: red }, { y: k(F[0] - 0.22), c: red }, { y: k(F[0] - 0.22), c: navy },
    { y: k(0.2), c: navy }, { y: k(-1.0), c: navy }, { y: k(-2.4), c: navy }, { y: k(-3.8), c: navy }, { y: (x) => shape.keel(x), c: navy },
  ], { bottom: true });
  const band = (yTop, yBot) => [
    { y: yTop, c: white }, { y: (x) => yTop(x) - 0.62, c: white }, { y: (x) => yTop(x) - 0.62, c: navy }, { y: (x) => yTop(x) - 0.5, c: navy }, { y: (x) => yTop(x) - 0.5, c: white },
    { y: (x) => yTop(x) - 0.2, c: white }, { y: (x) => yTop(x) - 0.2, c: gold }, { y: (x) => yTop(x) - 0.12, c: gold }, { y: (x) => yTop(x) - 0.12, c: white },
    { y: (x) => (yTop(x) + yBot(x)) / 2, c: white }, { y: yBot, c: white },
  ];
  const mats = { frame: M.steel, glass: env.windowMat };
  const mkBand = (yTop, yBot, py) => { const g = new THREE.Group(); g.add(loftBand(shape, band(yTop, yBot).sort((a, b) => 0))); g.add(portholes(shape, py, mats)); return g; };
  const b0 = mkBand(k(F[1]), k(F[0]), k(F[0] + 1.95));
  const b1 = mkBand(S, k(F[1]), k(F[1] + 1.95));
  return { shape, base, bands: [b0, b1] };
}
