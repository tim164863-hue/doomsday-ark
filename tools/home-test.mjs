// 小船之家測試：node tools/home-test.mjs
import { buildHome, HOME_TYPES } from '../src/ship/homespec.js';
import { newState } from '../src/sim/sim.js';
import * as F from '../src/sim/fleet.js';
import { validateState, serialize } from '../src/save/cloud.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const reach = (h, x, z, tol = 1.0) => { const q = h.nav.findPath(h.start[0], h.start[1], x, z); if (!q) return false; const e = q[q.length - 1]; return Math.hypot(e[0] - x, e[1] - z) <= tol; };
for (const t of HOME_TYPES) {
  const h = buildHome(t); const P = h.pois;
  ok(h.facs.length === 5 && h.facs.every((f) => f.ok), `${t}: 5 個設施都放得下`);
  ok(P.desks.length === h.spec.desks && P.seats.length >= 3 && P.chat.length >= 2, `${t}: 桌子數 = 規格 ${h.spec.desks}、至少 3 個座位 / 2 個聊天點 (${P.desks.length}/${P.seats.length}/${P.chat.length})`);
  ok(P.desks.every((p) => reach(h, p.x, p.z)) && P.chat.every((p) => reach(h, p.x, p.z)) && P.rail.every((p) => reach(h, p.x, p.z)), `${t}: 桌 / 聊天 / 欄杆點都走得到`);
  ok(P.loungers.every((p) => reach(h, p.x, p.z - p.head[1] * 1.3)), `${t}: 躺椅的入口走得到`);
  ok(reach(h, h.land[0], h.land[1]) && reach(h, h.door[0], h.door[1]), `${t}: 登船點與艙門走得到`);
  ok(P.rail.length >= 1 && P.rail.every((p) => p.face === 0 || Math.abs(p.face - Math.PI) < 1e-6), `${t}: 至少 1 個欄杆點（釣魚小遊戲用）`);
  ok(h.cap >= 3, `${t}: 載員上限 ${h.cap}`);
}
ok(buildHome('skiff').cap < buildHome('icebreaker').cap, '大船載員比小船多');
// 旗艦
const mk = () => { const s = newState(5, 1_800_000_000, 480); F.ensureFleet(s, false); s.res = { food: 999, water: 999, fuel: 999, parts: 999 }; return s; };
const s = mk(); ok(F.homeShip(s.fleet) === null, '沒選船 → 沒有家（只顯示海）');
F.pickStarter(s, 'speedboat', 1_800_000_000); ok(F.homeShip(s.fleet).type === 'speedboat', '選了洋流號 → 家=洋流號');
const f = s.fleet; f.ships.push({ id: f.nextId++, type: 'tug', name: 't', lv: 1, hp: 100, state: 'dock', auto: true, zone: 'auto', n: 0, done: 0, pilotAt: 0, m: null });
const tid = f.ships[1].id; const r = F.setHome(s, tid); ok(r.ok && F.homeShip(f).id === tid, '設定旗艦 → 換成拖船');
ok(F.setHome(s, tid).same === true, '已經是旗艦 → same');
ok(!F.setHome(s, 9999).ok, '找不到的船 → 失敗');
f.ships[0].state = 'sail'; ok(!F.setHome(s, f.ships[0].id).ok && F.homeShip(f).id === tid, '出海中的船不能當旗艦');
f.ships[0].state = 'dock';
const c = validateState(JSON.parse(serialize(s))); ok(c && c.fleet.home === tid, 'f.home 能存檔 / 驗證');
const bad = JSON.parse(serialize(s)); bad.fleet.home = 'x'; const sf = validateState(bad); ok(sf && sf.fleet.home === undefined, '壞的 home 被清掉');
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
