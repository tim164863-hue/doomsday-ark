// 小船當「家」：訪客 / 其他帳號看不到 T董 的郵輪方舟，家就是自己選的那艘小船。
// 介面與 Ship（ship.js）相同的部分：root / decks[] / update / setVisibleDecks / setExplode / deckY / yAt / car / elevLock。
import * as THREE from 'three';
import { Builder, makeMaterials } from './builder.js';
import { buildShipModel } from './fleetmodels.js';
import { buildHome, SPECS } from './homespec.js';
import * as FN from './furniture.js';
import { waveHeight } from '../world/waves.js';
import { GW } from './nav.js';

const TITLES = { skiff: '小漁船 · 甲板', speedboat: '洋流號 · 甲板', tug: '打撈拖船 · 甲板', patrol: '巡邏艇 · 甲板', icebreaker: '破冰船 · 甲板' };
const NAMES = { skiff: '甲板', speedboat: '甲板', tug: '甲板', patrol: '甲板', icebreaker: '甲板' };

class SmallDeck {
  constructor(ship, home) {
    this.index = 0; this.ship = ship; this.name = NAMES[ship.type] || '甲板'; this.title = TITLES[ship.type] || '甲板'; this.M = ship.M; this.env = ship.env;
    this.hullDeck = false; this.group = new THREE.Group(); this.b = new Builder(this.M); this.nav = home.nav; this.poly = home.poly;
    this.tvs = []; this.screens = []; this.waters = []; this.rotors = []; this.doors = []; this.steams = []; this.dyn = []; this.holes = [];
    this.tvTex = ship.tvTex; this.home = home;
    this.pois = { desks: [], extraDesks: [], cabins: {}, misc: { chat: home.pois.chat, rail: home.pois.rail } };
  }
  hw(x) { return this.home.hw(x); }
  floorY() { return this.group.position.y; }
  setBlock(rect, on) { const [x0, z0, x1, z1] = rect; const nav = this.nav; for (let iz = nav.iz(z0); iz <= nav.iz(z1); iz++) for (let ix = nav.ix(x0); ix <= nav.ix(x1); ix++) if (nav.inb(ix, iz)) nav.cells[iz * GW + ix] = on ? 0 : nav.base[iz * GW + ix]; }
  blockRect(x0, z0, x1, z1) { const nav = this.nav; for (let iz = nav.iz(z0); iz <= nav.iz(z1); iz++) for (let ix = nav.ix(x0); ix <= nav.ix(x1); ix++) if (nav.inb(ix, iz)) { nav.cells[iz * GW + ix] = 0; nav.base[iz * GW + ix] = 0; } }
}

export class SmallShip {
  constructor(env, quality, tvTex, type, lv = 1) {
    if (!SPECS[type]) type = 'skiff';
    this.small = true; this.type = type; this.lv = lv; this.env = env; this.quality = quality; this.tvTex = tvTex; this.M = makeMaterials(env, quality);
    const S = this.spec = SPECS[type], k = this.k = S.k; const home = this.home = buildHome(type);
    this.root = new THREE.Group(); this.root.name = 'smallship:' + type; this.body = new THREE.Group(); this.root.add(this.body);
    // 模型（放大 k 倍），先隱藏擋路的小道具
    const model = this.model = buildShipModel(type, lv); this.body.add(model); model.scale.setScalar(k);
    model.updateMatrixWorld(true);
    for (const h of S.hide || []) this.hideProps(model, h.r, h.y);
    this.model.updateMatrixWorld(true);
    this.deckTop = this.measureDeckTop(model, home);
    const deck = this.deck = new SmallDeck(this, home); this.decks = [deck]; deck.group.position.y = this.deckTop + 0.02; this.body.add(deck.group);
    this.furnish(deck, home);
    this.explode = 0; this.explodeTarget = 0; this.elevLock = null; this.car = new THREE.Group(); this.carPos = 0; this.carTarget = 0;
    this.rockState = { roll: 0, pitch: 0, heave: 0 }; this.yawNow = 0;
    this.anchors = { party: { x: home.party[0], z: home.party[1] }, land: { x: home.land[0], z: home.land[1] }, start: { x: home.start[0], z: home.start[1] }, door: { x: home.door[0], z: home.door[1] } };
    this.land = home.land; this.door = home.door; this.start = home.start; this.cap = home.cap;
    // 夜間燈
    this.lights = []; for (const p of [home.party, home.start]) { const l = new THREE.PointLight(0xffd9a0, 0, 26, 1.5); l.position.set(p[0], this.deckTop + 3.2, p[1]); this.body.add(l); this.lights.push(l); }
    const Lw = S.L * k; this.body.updateMatrixWorld(true); const Hm = new THREE.Box3().setFromObject(this.model).max.y; const fd = Math.max(40, Lw * 1.6, Hm * 3.1); this.frame = { dist: fd, pitch: 0.55, yaw: 0.85, target: [((S.xr[0] + S.xr[1]) / 2) * k * 0.25, Math.max(this.deckTop * 0.4, Hm * 0.28), 0], zoom: [9, fd * 3] };
  }
  hideProps(model, r, yMax) {
    const kill = []; const bb = new THREE.Box3(); const e = 0.12;
    model.traverse((o) => { if (!o.isMesh) return; bb.setFromObject(o); const c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
      // 以模型座標（未縮放前 scale=k，故還原）
      const k = this.k; const mnx = bb.min.x / k, mxx = bb.max.x / k, mnz = bb.min.z / k, mxz = bb.max.z / k, mxy = bb.max.y / k;
      if (sz.x / k < 1.7 && sz.z / k < 1.7 && mnx >= r[0] - e && mxx <= r[2] + e && mnz >= r[1] - e && mxz <= r[3] + e && mxy <= yMax) kill.push(o); });
    for (const o of kill) o.removeFromParent();
  }
  measureDeckTop(model, home) {
    const rc = new THREE.Raycaster(); const ys = []; const pts = [home.start, home.land, home.party, ...home.pois.chat.map((c) => [c.x, c.z])];
    for (const p of pts) { rc.set(new THREE.Vector3(p[0], 60, p[1]), new THREE.Vector3(0, -1, 0)); const h = rc.intersectObject(model, true); if (h.length) ys.push(h[0].point.y); }
    ys.sort((a, b) => a - b); return ys.length ? ys[Math.floor(ys.length / 2)] : 2;
  }
  /** 甲板上的家具（桌、椅、躺椅）+ POI。 */
  furnish(deck, home) {
    const b = deck.b, P = home.pois;
    for (const d of home.props.desks) { const r = FN.workDesk(deck, d.x, d.z, d.ry, { compact: !!d.compact }); const p = P.desks.find((q) => Math.abs(q.x - d.x) < 1e-6 && Math.abs(q.z - d.z) < 1e-6); const o = { key: p.key, x: d.x, z: d.z, face: d.ry, screen: r.screenMat }; deck.pois.desks.push(o); deck.pois.extraDesks.push(o); deck.screens.push(r.screenMat); }
    for (const t of home.props.tables) FN.table(b, t.x, t.z, 1.1, 0.9, t.ry, 'woodLight', 0.74);
    for (const s of P.seats) FN.diningChair(b, s.x, s.z, s.face);
    deck.pois.misc.canteen = P.seats.map((s) => ({ x: s.x, z: s.z, face: s.face }));
    deck.pois.misc.lounger = P.loungers.map((l) => ({ ...l }));
    for (const l of home.props.loungers) FN.loungeChair(b, l.x, l.z, l.ry);
    // 簡單裝飾：幾個木箱與救生圈在不擋路的邊角（不加導航阻擋）
    deck.group.add(b.build(this.quality.shadows > 0));
    deck.group.traverse((o) => { if (o.isMesh) { o.castShadow = this.quality.shadows > 0; o.receiveShadow = true; } });
  }
  deckY() { return this.deckTop; }
  yAt() { return this.deckTop; }
  setExplode() {}
  setVisibleDecks(vis) { this.deck.group.visible = this.root.visible !== false && (vis ? vis[0] !== false : true); }
  /** 船在世界中的目前位置（航行 / 領航時由玩法層移動 root） */
  update(dt, time) {
    const yaw = this.root.rotation.y, c = Math.cos(yaw), s = Math.sin(yaw), rx = this.root.position.x, rz = this.root.position.z; const hl = this.spec.L * this.k * 0.4, hw = this.spec.W * this.k * 0.4;
    // 船本地 +x → 世界 (cos yaw, -sin yaw)
    const w = (lx, lz) => waveHeight(rx + lx * c + lz * s, rz - lx * s + lz * c, time);
    const hb = w(hl, 0), hs = w(-hl, 0), hp = w(0, -hw), hq = w(0, hw);
    const pitch = Math.atan2(hb - hs, hl * 2) * 0.9, roll = Math.atan2(hp - hq, hw * 2) * 0.8, heave = (hb + hs + hp + hq) / 4 * 0.75 + 0.05;
    const r = this.rockState; const a = 1 - Math.exp(-2.4 * dt); r.roll += (roll - r.roll) * a; r.pitch += (pitch - r.pitch) * a; r.heave += (heave - r.heave) * a;
    this.body.rotation.z = r.pitch; this.body.rotation.x = r.roll; this.body.position.y = r.heave;
    const nf = this.env.windowMat.emissiveIntensity / 1.6; for (const l of this.lights) l.intensity = nf * 26;
    for (const f of this.deck.dyn) f(dt, time);
  }
}
