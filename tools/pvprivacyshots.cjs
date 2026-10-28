// 第 14 輪截圖：隱私說明 + 隱身開關（只有 vite dev 有假雲端）。用法: node tools/pvprivacyshots.cjs <baseUrl> <startNo>   （VW/VH 設視窗大小）
const puppeteer = require(process.env.PUPPETEER || '/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, no = '300'] = process.argv.slice(2); let n = +no; const W = +(process.env.VW || 1280), H = +(process.env.VH || 760); const touch = W < 700;
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errs = []; const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
  pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); pg.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type()) && !/THREE\.|PCFSoftShadowMap/.test(m.text())) errs.push(m.type() + ': ' + m.text()); });
  const shot = async (name) => { const f = `/workspace/doomsday-ark/shots/${n++}-pvp-${name}-${W}.png`; await pg.screenshot({ path: f }); console.log('shot', f); };
  await pg.evaluateOnNewDocument(() => { if (!sessionStorage.getItem('pvclean')) { sessionStorage.setItem('pvclean', '1'); localStorage.removeItem('ark.fakecloud'); localStorage.removeItem('ark.fakepvp'); } });
  const Q = '?fakecloud=bob&help=0&q=low&t=0.5&pvnotice=1';
  const go = async () => { await pg.goto(base + Q, { waitUntil: 'domcontentloaded', timeout: 60000 }); await pg.waitForFunction('window.ark && ark.play && ark.play.ready', { timeout: 60000 }); await w(1500); for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(400); } };
  await go(); await pg.evaluate(() => { ark.play.fleetAct('pick', { type: 'tug' }); ark.hud.closeModal(); ark.play.save(true); }); await w(1200); await go();
  // 1 首次登入：隱私說明（看完之前不公開）
  await pg.waitForSelector('#pvnotice', { timeout: 30000 }); await w(400); await shot('notice');
  console.log('before ack: presence', await pg.evaluate(() => arkPv.store.presence.size), 'nt', await pg.evaluate(() => ark.play.state.fleet.world.pv && ark.play.state.fleet.world.pv.nt));
  await pg.evaluate(() => document.querySelector('#pvnotice [data-k=ok]').click()); await w(2500);
  console.log('after ok: presence docs', await pg.evaluate(() => JSON.stringify([...arkPv.store.presence.values()].map((d) => Object.keys(d).join(',')))));
  // 2 海圖卡片：隱身 關 / 開
  await pg.evaluate(() => { ark.hud.chart.open(); }); await w(1200); await pg.evaluate(() => { ark.hud.chart.setPanel(true); ark.hud.chart.refresh(true); }); await w(500);
  await pg.evaluate(() => { const p = document.querySelector('.scPanel .pvp'); if (p) p.scrollIntoView({ block: 'start' }); }); await w(400); await shot('hide-off');
  await pg.evaluate(() => document.querySelector('[data-a=pvHide]').click()); await w(1500);
  await pg.evaluate(() => { const p = document.querySelector('.scPanel .pvp'); if (p) p.scrollIntoView({ block: 'start' }); }); await shot('hide-on');
  console.log('hidden: presence docs', await pg.evaluate(() => arkPv.store.presence.size), 'hid', await pg.evaluate(() => ark.play.state.fleet.world.pv.hid));
  // 3 帳號選單（非船東：沒有 uid / 複製鈕，有隱身開關）
  await pg.evaluate(() => { ark.hud.chart.close(); document.getElementById('acct').click(); }); await w(600); await shot('account-menu');
  console.log('menu uid row', await pg.evaluate(() => !!document.querySelector('#acctUid')), 'hide btn', await pg.evaluate(() => (document.getElementById('gHide') || {}).textContent));
  await pg.evaluate(() => document.getElementById('gHide').click()); await w(1200);
  console.log('after toggle off: presence docs', await pg.evaluate(() => arkPv.store.presence.size), 'hid', await pg.evaluate(() => ark.play.state.fleet.world.pv.hid));
  console.log('console:', errs.join('\n') || 'none'); await b.close();
})();
