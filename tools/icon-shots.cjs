// 船型圖示/海域標籤截圖：node tools/icon-shots.cjs <baseUrl> <prefix>   → shots/<prefix>-{pick,fleet}-{390,1280}.png（fleet 用高視窗一次拍到全部船型）
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, pre] = process.argv.slice(2);
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [W, H] of [[390, 844], [1280, 800]]) {
    for (const kind of ['pick', 'fleet']) {
      const pg = await b.newPage(); await pg.setViewport({ width: W, height: kind === 'fleet' ? 2300 : H, hasTouch: W < 500, isMobile: W < 500 });
      pg.on('pageerror', (e) => console.log('PE', e.message));
      await pg.goto(base + '?guest=1&fresh=1&help=0&q=low', { waitUntil: 'domcontentloaded' });
      for (let i = 0; i < 80 && !(await pg.evaluate(() => !!(window.ark && window.ark.play && window.ark.play.ready)).catch(() => false)); i++) await w(1000);
      await w(2500);
      await pg.evaluate((k) => { const h = ark.hud; if (h.modalKind) h.closeModal(); h.openModal(k); }, kind); await w(1500);
      await pg.evaluate(() => { const m = document.querySelector('.mcard'); if (m) m.scrollTop = 0; });
      const f = `/workspace/doomsday-ark/shots/${pre}-${kind}-${W}.png`; await pg.screenshot({ path: f }); console.log(f);
      await Promise.race([pg.close().catch(() => {}), w(5000)]);
    }
  }
  await b.close();
})().catch((e) => { console.error('FAIL', e); process.exit(2); });
