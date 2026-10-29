// 小船（訪客 / 其他帳號的家）走路測試：每種起始小船各開一次遊戲，檢查
//   · 甲板上沒有辦公桌（pois.desks 空）、不是 T董（avatar 是資料庫角色）、船員只有 2–3 位隨機人物
//   · 角色走得到：甲板兩端、每個聊天點 / 欄杆點 / 座位 / 躺椅 / 設施 / 每位船員旁邊
//   · 用「搖桿」直線走（nav.move）能從船尾走到船頭、左右舷
// 用法: node tools/walk-small.cjs [baseUrl]   （需先 npm run dev；預設 http://127.0.0.1:5173/）
const puppeteer = require(process.env.PUPPETEER || '/tmp/shot/node_modules/puppeteer-core');
const BASE = process.argv[2] || 'http://127.0.0.1:5173/';
const TYPES = (process.env.TYPES || 'skiff,speedboat,tug,patrol,icebreaker').split(',');
const LVS = (process.env.LVS || '1,2,3').split(',').map(Number); // 升級等級：每種船 × Lv1–3 都要走
const COMBOS = TYPES.flatMap((t) => LVS.map((l) => [t, l]));
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  // 頁面有 beforeunload 存檔：直接 close 可能卡住 → 先導到 about:blank（自動接受對話框），再限時關閉
  const closePg = async (pg) => { pg.on('dialog', (d) => d.accept().catch(() => {})); await Promise.race([pg.goto('about:blank').catch(() => {}), w(5000)]); await Promise.race([pg.close().catch(() => {}), w(5000)]); };
  const fails = [], errs = []; let n = 0;
  const open = async (q) => { const pg = await b.newPage(); await pg.setViewport({ width: 900, height: 600 }); pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); await pg.goto(BASE + '?help=0&q=low&t=0.5&' + q, { waitUntil: 'domcontentloaded', timeout: 60000 }); await w(4500); return pg; };
  const dismiss = async (pg) => { for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(300); } };
  for (const [type0, lv] of COMBOS) {
    const type = type0 + '-Lv' + lv; console.log('…' + type);
    // 1) 全新訪客存檔 → 選這艘小船並存檔
    console.log("  a"); let pg = await open("guest=1&fresh=1"); console.log("  b"); await dismiss(pg); console.log("  c");
    await pg.evaluate(([t, lv]) => { ark.play.fleetAct('pick', { type: ['patrol', 'icebreaker'].includes(t) ? 'skiff' : t }); if (['patrol', 'icebreaker'].includes(t)) { const f = ark.play.state.fleet; f.ships[0].type = t; f.pick = t; } ark.play.state.fleet.ships[0].lv = lv; ark.play.save(true); }, [type0, lv]); console.log("  saved");
    // 第 17 輪：pick 會觸發 reloadHome（隨機起始小船 ≠ 選的船時），重新載入完成前存檔可能存到舊船 → 先等狀態穩定，確認存下來的就是要測的船，否則重選（決定性）
    for (let i = 0; i < 6; i++) { await w(700); const okp = await pg.evaluate(([t, lv]) => { const f = ark.play.state.fleet; if (f.pick === t && f.ships[0] && f.ships[0].type === t && f.ships[0].lv === lv) { ark.play.save(true); return true; } if (!['patrol', 'icebreaker'].includes(t) && f.pick !== t) ark.play.fleetAct('pick', { type: t }); else { f.ships[0].type = t; f.pick = t; } ark.play.state.fleet.ships[0].lv = lv; ark.play.save(true); return false; }, [type0, lv]).catch(() => false); if (okp) break; }
    await w(500); await closePg(pg); console.log("  closed");
    // 2) 重新載入（不 fresh）：這時才是真正的「小船」家
    console.log("  reopen"); pg = await open("guest=1"); await dismiss(pg); console.log("  opened");
    const info = await pg.evaluate(() => ({ small: ark.small, type: ark.ship.type, lv: ark.play.state.fleet.ships[0].lv, key: ark.player.avatar.key, pkey: ark.player.key, owner: ark.owner, ch: ark.charId, nd: ark.ship.decks[0].pois.desks.length, ne: ark.ship.decks[0].pois.extraDesks.length, crew: [...ark.crew.bots.values()].map((x) => [x.key, x.avatar.look.model, !!x.info.look]), pl: ark.play.state.pl }));
    const chk = (ok, msg) => { n++; if (!ok) fails.push(`${type}: ${msg}`); };
    chk(info.small && info.type === type0 && info.lv === lv && !info.owner, `不是小船家 ${JSON.stringify([info.small, info.type, info.owner])}`);
    chk(info.pkey === 'player', `玩家鍵不是 T董 (${info.pkey})`);
    chk(info.nd === 0 && info.ne === 0, `甲板上不該有辦公桌 (${info.nd}/${info.ne})`);
    chk(/^P:/.test(info.key) && info.key !== 'P:T董' && info.pl && info.pl.c === info.ch, `玩家角色不是資料庫角色 (${info.key})`);
    chk(info.crew.length >= 2 && info.crew.length <= 3 && info.crew.every((c) => c[2]) && new Set(info.crew.map((c) => c[0])).size === info.crew.length, `船員人數 / 外觀 ${JSON.stringify(info.crew)}`);
    chk(!info.crew.some((c) => ['舵手小艾', '工程師阿鐵', '廚師小米', '最高級打工仔', '交易員-1', '0xcat', 'T董'].includes(c[0])), '不該出現固定 bot 名單');
    console.log("  walking");
    // 3) 走路
    const targets = await pg.evaluate(() => {
      const S = ark.ship, d = S.decks[0], nav = d.nav, m = d.pois.misc, T = [];
      let lo = null, hi = null; for (let iz = 0; iz < 64; iz++) for (let ix = 0; ix < 232; ix++) { const x = nav.cx(ix), z = nav.cz(iz); if (nav.walkable(x, z, 0.24)) { if (!lo || x < lo[0]) lo = [x, z]; if (!hi || x > hi[0]) hi = [x, z]; } }
      const p0 = nav.nearestFree(S.start[0], S.start[1], 4);
      for (const [k, l] of [['chat', m.chat], ['rail', m.rail], ['seat', m.canteen], ['lounger', m.lounger]]) (l || []).forEach((p, i) => T.push([k + i, p.x, p.z]));
      for (const [k, v] of Object.entries(ark.play.fac)) { T.push(['fac:' + k, v.x, v.z]); const sp = ark.play.standPos(k); if (sp) T.push(['stand:' + k, sp[0], sp[1]]); }
      T.push(['land', S.land[0], S.land[1]], ['party', S.anchors.party.x, S.anchors.party.z], ['door', S.door[0], S.door[1]]);
      if (lo) T.push(['end-stern', lo[0], lo[1]]); if (hi) T.push(['end-bow', hi[0], hi[1]]);
      for (const x of ark.crew.bots.values()) T.push(['crew:' + x.key, x.actor.x, x.actor.z]);
      return T;
    });
    for (const [label, x, z] of targets) {
      n++;
      const r = await pg.evaluate((x, z) => {
        const a = ark.player.actor, nav = ark.ship.decks[0].nav; const p = nav.nearestFree(x, z, 2.5); if (!p) return 'nofree';
        const st = nav.nearestFree(ark.ship.start[0], ark.ship.start[1], 4); a.place(0, st[0], st[1], 0);
        if (!nav.findPath(st[0], st[1], p[0], p[1])) return 'unreachable';
        ark.player.goTo(0, p[0], p[1]);
        for (let i = 0; i < 900; i++) { ark.step(0.1); if (Math.hypot(a.x - p[0], a.z - p[1]) < 1.3) return 'ok'; }
        return 'timeout@' + a.x.toFixed(1) + ',' + a.z.toFixed(1) + ' goal ' + p[0].toFixed(1) + ',' + p[1].toFixed(1);
      }, x, z);
      if (r !== 'ok' && !(r === 'nofree' && label.startsWith('crew:'))) fails.push(`${type} ${label}: ${r}`);
    }
    // 4) 搖桿走：從船尾端走到船頭端（沿 A* 路徑的路點，用 nav.move 一步一步「推搖桿」；甲板中間有艙室時要繞過去）
    const sweep = await pg.evaluate(() => {
      const a = ark.player.actor, nav = ark.ship.decks[0].nav; let lo = null, hi = null; for (let iz = 0; iz < 64; iz++) for (let ix = 0; ix < 232; ix++) { const x = nav.cx(ix), z = nav.cz(iz); if (nav.walkable(x, z, 0.24)) { if (!lo || x < lo[0]) lo = [x, z]; if (!hi || x > hi[0]) hi = [x, z]; } }
      if (!lo) return { ok: false, why: 'no walkable cells' }; const x0 = lo[0], x1 = hi[0], s0 = lo, e0 = hi; const path = nav.findPath(s0[0], s0[1], e0[0], e0[1]); if (!path) return { ok: false, why: 'no path', x0, x1 };
      a.place(0, s0[0], s0[1], 0); let x = s0[0], z = s0[1], steps = 0, stuck = 0;
      for (const [px, pz] of path) { for (let i = 0; i < 400; i++) { const dx = px - x, dz = pz - z, d = Math.hypot(dx, dz); if (d < 0.25) break; const r = nav.move(x, z, (dx / d) * 0.12, (dz / d) * 0.12, 0.16); if (Math.hypot(r[0] - x, r[1] - z) < 1e-4) { stuck++; if (stuck > 30) return { ok: false, why: 'stuck', x, z }; } else stuck = 0; x = r[0]; z = r[1]; steps++; } }
      return { ok: Math.hypot(x - e0[0], z - e0[1]) < 1.2, steps, len: +(x1 - x0).toFixed(1) };
    });
    chk(sweep.ok, `搖桿從船尾走不到船頭 ${JSON.stringify(sweep)}`);
    const st2 = await pg.evaluate(() => ark.selfTest()); chk(st2.length === 0, 'selfTest ' + JSON.stringify(st2));
    console.log(`${type}: crew=${info.crew.map((c) => c[0]).join('/')} char=${info.ch} targets=${targets.length} sweep=${JSON.stringify(sweep)}`);
    await closePg(pg);
  }
  console.log(`walk-small: ${n} checks, ${fails.length} failed, errors=${errs.length}`);
  for (const f of fails) console.log('  ✗ ' + f); for (const e of errs.slice(0, 5)) console.log('  ! ' + e);
  await b.close(); process.exit(fails.length || errs.length ? 1 : 0);
})().catch((e) => { console.error('FAIL', e); process.exit(2); });
