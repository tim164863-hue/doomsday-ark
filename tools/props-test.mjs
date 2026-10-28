// 海上固體物件碰撞測試：node tools/props-test.mjs
import { ruinBoxes, ruinLayout, debrisCircles, DEBRIS_CIRCLES, circleVsBox, circleVsCircle, hullCircles, deepest, sweepShip, impactDamage, IMPACT_MIN, pushOut, steerAround } from '../src/sim/seaprops.js';
import { SHIPS } from '../src/sim/fleetdefs.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const B = ruinBoxes(); const lay = ruinLayout();
ok(B.length > 60 && B.every((b) => isFinite(b.x) && isFinite(b.z) && b.hw > 0 && b.hd > 0), `廢墟有 ${B.length} 個水面上的固體（沉在水下的不算）`);
ok(JSON.stringify(ruinLayout()) === JSON.stringify(lay), '廢墟佈局決定性（畫面與碰撞共用）');
ok(B.some((b) => b.kind === 'bridge' && b.needLen === 24) && B.filter((b) => b.kind === 'bridge').length === 6, '兩座橋：4 個橋塔 + 2 個橋面（橋面只擋大船）');
// 船型：母船 + 每種小船（小船規格同 helm.cfg：len = 船長、hw ≈ 寬 / 2）
const types = [['母船', { len: 91.2, hw: 13.6, v: 11 }], ...Object.values(SHIPS).map((x) => [x.name, { len: x.len, hw: x.len * 0.2, v: 7 + x.speed * 4 }])];
const rampOf = (b) => Math.atan2(-b.uz, b.ux);   // 方塊 u 軸的 yaw（helm 慣例：方向 (cos, -sin)）
// 1) 每種船、朝每一棟廢墟正面全速衝過去（含 dt 很大的卡頓幀）：不能穿過去，也不能陷進去
for (const [name, c] of types) {
  const probes = [(x, z, r) => { let b = null; for (const q of B) { if (q.needLen && c.len < q.needLen) continue; const h = circleVsBox(x, z, r, q); if (h && (!b || h.pen > b.pen)) b = h; } return b; }];
  let tunnel = 0, inside = 0, hits = 0, tested = 0;
  for (const dt of [0.016, 0.1, 0.5, 2]) for (const q of B.filter((b) => b.kind === 'ruin').filter((_, i) => i % 3 === 0)) {
    const ang = rampOf(q) + Math.PI / 2 * ((tested++) % 4), dir = [Math.cos(ang), -Math.sin(ang)]; const dist = 60 + c.len; const st = { x: q.x - dir[0] * (q.hw + q.hd + dist), z: q.z - dir[1] * (q.hw + q.hd + dist), yaw: ang, v: c.v, w: 0 };
    if (deepest(st.x, st.z, st.yaw, c, probes)) continue;   // 起點剛好被別的樓擋住就略過
    for (let i = 0; i < 400; i++) { const x0 = st.x, z0 = st.z; st.x += Math.cos(st.yaw) * st.v * dt; st.z += -Math.sin(st.yaw) * st.v * dt; st.v = c.v; const h = sweepShip(st, x0, z0, c, probes, dt); if (h) hits++;
      if (deepest(st.x, st.z, st.yaw, c, probes) && deepest(st.x, st.z, st.yaw, c, probes).pen > 0.2) inside++;
      // 穿過：船心跑到方塊的另一側（沿航向，超過方塊中心）
      const lx = (st.x - q.x) * q.ux + (st.z - q.z) * q.uz, lz = -(st.x - q.x) * q.uz + (st.z - q.z) * q.ux; if (Math.abs(lx) < q.hw * 0.5 && Math.abs(lz) < q.hd * 0.5) tunnel++; }
  }
  ok(tunnel === 0 && inside === 0 && hits > 0, `${name}（${c.v.toFixed(1)} m/s、船長 ${c.len}）：撞廢墟 ${hits} 次、穿過 ${tunnel}、陷進去 ${inside}（dt 0.016 / 0.1 / 0.5 / 2 s）`);
}
// 2) 滑行：斜著撞牆 → 沿牆滑，不是停死
{ const q = { x: 0, z: 0, ux: 1, uz: 0, hw: 20, hd: 20, rad: 28.3, kind: 'ruin' }; const p = [(x, z, r) => circleVsBox(x, z, r, q)]; const c = { len: 10, hw: 2 };
  const st = { x: -60, z: -45, yaw: -Math.atan2(1, 1) * 0 - Math.PI / 4 * -1, v: 8, w: 0 }; st.yaw = -Math.PI / 4;   // 航向 (cos, -sin) = (0.7, 0.7)：往 +x +z 走
  let hitN = 0; for (let i = 0; i < 400; i++) { const x0 = st.x, z0 = st.z; st.x += Math.cos(st.yaw) * 8 * 0.05; st.z += -Math.sin(st.yaw) * 8 * 0.05; st.v = 8; const h = sweepShip(st, x0, z0, c, p, 0.05); if (h) hitN++; }
  ok(hitN > 0 && st.z > 20 && !deepest(st.x, st.z, st.yaw, c, p), `斜撞：被牆擋住、沿牆滑行繞過角落（最後在 x=${st.x.toFixed(0)}, z=${st.z.toFixed(0)}），沒有陷進去`); }
// 3) 漂流殘骸（圓）：掃過、不穿
{ const list = []; for (let k = 0; k < 7; k++) list.push({ x: k * 40, z: 0, yaw: k * 0.7, k }); const dc = debrisCircles(list); ok(dc.length === DEBRIS_CIRCLES.reduce((a, c) => a + c.length, 0), `7 種殘骸展開成 ${dc.length} 個碰撞圓`);
  const probes = [(x, z, r) => { let b = null; for (const c of dc) { const h = circleVsCircle(x, z, r, c.x, c.z, c.r, 'debris'); if (h && (!b || h.pen > b.pen)) b = h; } return b; }]; let bad = 0, hits = 0;
  for (const [name, c] of types) for (const dt of [0.016, 0.3, 3]) for (let k = 0; k < 7; k++) { const st = { x: k * 40 - 150, z: 0.3, yaw: 0, v: c.v, w: 0 }; for (let i = 0; i < 80; i++) { const x0 = st.x; st.x += st.v * dt; st.v = c.v; const h = sweepShip(st, x0, 0.3, c, probes, dt); if (h) hits++; if (deepest(st.x, st.z, st.yaw, c, probes) && deepest(st.x, st.z, st.yaw, c, probes).pen > 0.25) bad++; } }
  ok(hits > 0 && bad === 0, `殘骸：所有船型 / 卡頓幀都撞得到、不陷進去（${hits} 次、違規 ${bad}）`); }
// 4) 高速不穿牆：薄牆（寬 2 m）+ 一格 80 m
{ const q = { x: 0, z: 0, ux: 1, uz: 0, hw: 1, hd: 60, rad: 60, kind: 'ruin' }; const p = [(x, z, r) => circleVsBox(x, z, r, q)]; const c = { len: 8, hw: 1.6 }; const st = { x: -40, z: 0, yaw: 0, v: 11, w: 0 }; const x0 = st.x; st.x += 80; sweepShip(st, x0, 0, c, p, 7); ok(st.x < -1, `一格 80 m 衝向 2 m 薄牆也不會穿過（停在 x=${st.x.toFixed(1)}）`); }
// 5) 傷害
ok(impactDamage(0.5) === 0 && impactDamage(IMPACT_MIN) === 0 && impactDamage(2) > 0.5 && impactDamage(40) === 3, '輕碰 ≤ 1.2 m/s 不傷船；重撞 −0.4~3%（上限 3%）');
// 6) NPC / 自動返港避開
{ const q = { x: 0, z: 0, ux: 1, uz: 0, hw: 10, hd: 10, rad: 14.2, kind: 'ruin' }; const p = [(x, z, r) => circleVsBox(x, z, r, q)]; const o = pushOut(3, 2, 3, p); ok(!circleVsBox(o.x, o.z, 3, q), '船的位置被推到物件外面（NPC 出海 / 返航的船繞過去）');
  const a = steerAround(-40, 0, 0, 3, 50, p); ok(Math.abs(a) > 0.1, `自動返港：正前方有東西 → 轉向 ${a.toFixed(2)} rad 繞開`); const a2 = steerAround(-40, 30, 0, 3, 50, p); ok(a2 === 0, '前方沒東西 → 直走'); }
// 7) 橋面：小船過得去、大船撞得到
{ const deck = B.find((b) => b.needLen === 24); const p = (len) => [(x, z, r) => (deck.needLen && len < deck.needLen ? null : circleVsBox(x, z, r, deck))]; ok(!deepest(deck.x, deck.z, 0, { len: 9, hw: 2 }, p(9)) && !!deepest(deck.x, deck.z, 0, { len: 91, hw: 13 }, p(91)), '橋面：小船可從底下過，大船（母船）會撞到'); }
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
