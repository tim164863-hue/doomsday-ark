// 走路測試：T董 能不能走到每個設施（建造點）、每個遊樂設施的定位，以及每位船員旁邊。
// 用法: node tools/walk.cjs [url] （預設 http://127.0.0.1:5173/?devowner=1&demo=1，需先 npm run dev；
// puppeteer-core 路徑可用 PUPPETEER 環境變數指定，預設 /tmp/shot/node_modules/puppeteer-core）
const puppeteer = require(process.env.PUPPETEER || '/tmp/shot/node_modules/puppeteer-core');
(async () => {
  const url = process.argv[2] || 'http://127.0.0.1:5173/?help=0&q=low&t=0.5&guest=1&devowner=1&demo=1';
  const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: 900, height: 600 });
  const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  await w(5000);
  for (let i = 0; i < 4; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(500); }
  const fails = []; let n = 0;
  const walk = async (label, deck, x, z) => {
    n++;
    const ok = await pg.evaluate(async (deck, x, z) => {
      const a = ark.player.actor; const nav = ark.ship.decks[deck].nav; const p = nav.nearestFree(x, z, 2.5); if (!p) return 'nofree';
      if (a.deck !== deck) a.place(deck, p[0] + 2.0, p[1], 0);
      ark.player.goTo(deck, p[0], p[1]);
      for (let i = 0; i < 400; i++) { await new Promise((r) => setTimeout(r, 100)); if (a.deck === deck && Math.hypot(a.x - p[0], a.z - p[1]) < 0.7) return 'ok'; }
      return 'timeout@' + a.x.toFixed(1) + ',' + a.z.toFixed(1);
    }, deck, x, z);
    if (ok !== 'ok') fails.push(`${label}: ${ok}`);
  };
  const facs = await pg.evaluate(() => Object.entries(ark.play.fac).map(([k, v]) => [k, v.deck, v.x, v.z]));
  for (const [k, d, x, z] of facs) await walk('fac:' + k, d, x, z);
  const spots = await pg.evaluate(() => { const seen = new Set(); return ark.play.games.spots.filter((s) => !seen.has(s.kind) && seen.add(s.kind)).map((s) => [s.kind, s.deck, s.x, s.z]); });
  for (const [k, d, x, z] of spots) await walk('spot:' + k, d, x, z);
  const bots = await pg.evaluate(() => [...ark.crew.bots.values()].filter((x) => !x.away).map((x) => [x.key, x.actor.deck, x.actor.x, x.actor.z]));
  for (const [k, d, x, z] of bots) await walk('bot:' + k, d, x, z);
  const st = await pg.evaluate(() => ark.selfTest());
  console.log(`walk: ${n} targets, ${fails.length} failed, selfTest=${JSON.stringify(st)}, errors=${errs.length}`);
  for (const f of fails) console.log('  ✗ ' + f); for (const e of errs.slice(0, 5)) console.log('  ! ' + e);
  await b.close(); process.exit(fails.length || st.length || errs.length ? 1 : 0);
})().catch((e) => { console.error('FAIL', e); process.exit(2); });
