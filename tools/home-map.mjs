import { buildHome, HOME_TYPES } from '../src/ship/homespec.js';
import { CS, GX0, GZ0, GW, GH } from '../src/ship/nav.js';
const types = process.argv.slice(2).length ? process.argv.slice(2) : HOME_TYPES;
for (const t of types) {
  const h = buildHome(t); console.log('\n==', t, 'k', h.k, 'desks', h.pois.desks.length, 'seats', h.pois.seats.length, 'beds', h.pois.beds.length, 'loun', h.pois.loungers.length, 'chat', h.pois.chat.length, 'rail', h.pois.rail.length);
  const mk = new Map(); const put = (p, c) => mk.set(h.nav.ix(p.x) + ',' + h.nav.iz(p.z), c);
  h.pois.desks.forEach((p) => put(p, 'D')); h.pois.seats.forEach((p) => put(p, 's')); h.pois.beds.forEach((p) => put(p, 'B')); h.pois.loungers.forEach((p) => put(p, 'L')); h.pois.chat.forEach((p) => put(p, 'c')); h.pois.rail.forEach((p) => put(p, 'r')); put({ x: h.land[0], z: h.land[1] }, 'W'); put({ x: h.party[0], z: h.party[1] }, 'P');
  let zmin = 99, zmax = -99, xmin = 999, xmax = -999; for (let iz = 0; iz < GH; iz++) for (let ix = 0; ix < GW; ix++) if (h.nav.base[iz * GW + ix] || h.nav.cells[iz * GW + ix]) { zmin = Math.min(zmin, iz); zmax = Math.max(zmax, iz); xmin = Math.min(xmin, ix); xmax = Math.max(xmax, ix); }
  // blocked inside hull = '#'
  for (let iz = zmin - 1; iz <= zmax + 1; iz++) { let s = ''; for (let ix = xmin - 1; ix <= xmax + 1; ix++) { const m = mk.get(ix + ',' + iz); const x = h.nav.cx(ix), z = h.nav.cz(iz); const inH = Math.abs(z) <= h.hw(x) - h.spec.margin && x >= h.spec.xr[0] * h.k && x <= h.spec.xr[1] * h.k; s += m || (h.nav.cells[iz * GW + ix] ? '.' : inH ? '#' : ' '); } console.log(s); }
  // reachability
  const st = h.start; let bad = 0; for (const [n, l] of Object.entries(h.pois)) if (Array.isArray(l)) for (const p of l) { const q = h.nav.findPath(st[0], st[1], p.x, p.z); const e = q && q[q.length - 1]; if (!q || Math.hypot(e[0] - p.x, e[1] - p.z) > 1.0) { bad++; console.log('unreachable', n, p.x.toFixed(1), p.z.toFixed(1)); } }
  console.log("unreachable", bad, "facs", h.facs.map((f)=>(f.ok?"":"!")+f.x.toFixed(1)+","+f.z.toFixed(1)+"/"+f.sc.toFixed(2)).join(" "));
}
