// 線上主控台檢查 + 截圖：node tools/live-check.cjs <url> <width> [shotPrefix]
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [url, W, pre] = process.argv.slice(2); const mobile = +W < 700; const H = mobile ? 780 : 760;
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: +W, height: H, hasTouch: mobile, isMobile: mobile });
  const bad = []; const bundles = new Set();
  pg.on('pageerror', (e) => bad.push('pageerror ' + e.message)); pg.on('response', (r) => { const m = r.url().match(/index-[\w-]+\.js/); if (m) bundles.add(m[0]); if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
  pg.on('console', (m) => { const t = m.text(); if (['error', 'warning'].includes(m.type()) && !/THREE\.Clock|PCFSoftShadowMap|GPU stall|swiftshader/i.test(t)) bad.push(m.type() + ' ' + t.slice(0, 200)); });
  await pg.goto(url + '?guest=1&cb=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await w(9000);
  if (pre) await pg.screenshot({ path: `/workspace/doomsday-ark/shots/${pre}-${W}.png` });
  console.log(W, [...bundles].join(','), bad.length ? bad.slice(0, 5).join(' | ') : 'console clean');
  await Promise.race([pg.goto('about:blank').catch(() => {}), w(5000)]); await b.close().catch(() => {});
})();
