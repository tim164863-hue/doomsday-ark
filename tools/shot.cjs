// 用法: node tools/shot.cjs "<url>" out.png [w] [h] [waitMs] [evalJS]
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
(async () => {
  const [url, out, w = 1400, h = 900, wait = 6000, js] = process.argv.slice(2);
  const touch = +w < 600;
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage();
  await pg.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
  const errs = [];
  pg.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); });
  pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message + (e.stack ? '\n' + e.stack.split('\n').slice(0, 4).join('\n') : '')));
  await pg.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, +wait));
  if (js) { const r = await pg.evaluate(js); if (r !== undefined) console.log('eval:', typeof r === 'string' ? r : JSON.stringify(r)); await new Promise((r) => setTimeout(r, 1500)); }
  await pg.screenshot({ path: out });
  const fps = await pg.evaluate(() => window.ark && window.ark.fps !== undefined ? window.ark.fps : null).catch(() => null);
  console.log('fps:', fps); console.log('console:', errs.join('\n') || 'none');
  await b.close();
})();
