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
