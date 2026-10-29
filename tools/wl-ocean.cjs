const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, dev = 'desktop', pre = '290-wl-ocean'] = process.argv.slice(2); const [W, H] = dev === 'mobile' ? [390, 844] : [1280, 760]; const touch = dev === 'mobile';
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const wl of [0, 1]) {
    const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: touch, isMobile: touch }); const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); pg.on('dialog', (d) => d.accept().catch(() => {}));
    await pg.goto(base + '?help=0&q=low&t=0.5&guest=1&devowner=1&demo=1' + (wl ? '' : '&wl=0'), { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 80 && !(await pg.evaluate(() => !!(window.ark && window.ark.play && window.ark.play.ready)).catch(() => false)); i++) await w(1000); await w(2500);
    await pg.evaluate(() => { const h = ark.hud; if (h.modalKind) h.closeModal(); for (let i = 0; i < 3; i++) { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); } const c = ark.controls; c.setMode && c.setMode('free'); const p = [...document.querySelectorAll('button')].find((e) => /全景/.test(e.textContent)); if (p) p.click(); });
    await w(1500); await pg.evaluate(() => { const c = ark.controls; c.target.set(60, 0, 40); c.pitch = 0.32; c.dist = 90; c.yaw = 0.9; }); await w(4000);
    await pg.screenshot({ path: `/workspace/doomsday-ark/shots/${pre}-${wl ? 'after' : 'before'}-${dev}.png` });
    console.log(wl, errs.length ? errs.slice(0, 3).join('|') : 'no errors');
    await Promise.race([pg.goto('about:blank').catch(() => {}), w(5000)]); await Promise.race([pg.close().catch(() => {}), w(5000)]);
  }
  await b.close();
})();
