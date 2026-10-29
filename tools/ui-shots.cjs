// UI 截圖（前後對照用）：node tools/ui-shots.cjs "<url>" <width> <prefix> [owner]
// 依序開各面板並截圖：home / trips / tasks / fleet / chart / crew / rel / help（owner 另加 char）。同一支腳本跑「前」與「後」就能一一對照。
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const [url, W0, pre, ownerArg] = process.argv.slice(2); const W = +W0; const touch = W < 700; const H = touch ? 780 : 760;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: touch, isMobile: touch });
  const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
  const sep = url.includes('?') ? '&' : '?'; await pg.goto(url + sep + (ownerArg === 'owner' ? 'devowner=1' : 'guest=1'), { waitUntil: 'domcontentloaded' }); await sleep(6000);
  if (ownerArg !== 'owner') { await pg.evaluate(() => { const bt = [...document.querySelectorAll('#modal button')].find((x) => x.textContent.includes('選這艘')); bt && bt.click(); }); await sleep(3000); }
  await pg.evaluate(() => { const h = document.querySelector('#help:not(.hide) button'); h && h.click(); }); await sleep(800);
  const shot = (n) => pg.screenshot({ path: `/workspace/doomsday-ark/shots/${pre}-ui-${W}-${n}.png` });
  const esc = async () => { await pg.keyboard.press('Escape'); await sleep(300); await pg.evaluate(() => { for (const e of document.querySelectorAll('#help:not(.hide) .x, #help:not(.hide) button[data-k=close]')) e.click(); }); await sleep(300); };
  await shot('home');
  const open = async (name, sel) => {
    if (touch && !(await pg.evaluate(() => document.body.classList.contains('tlopen')))) { await pg.evaluate(() => { const t = document.querySelector('#tlpill'); t && t.click(); }); await sleep(400); }
    const ok = await pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel); await sleep(1200); await shot(name); if (!ok) console.log('missing', sel); await esc();
  };
  for (const [n, s] of [['trips', '#btnTrips'], ['tasks', '#btnTasks'], ['fleet', '#btnFleet'], ['chart', '#btnChart'], ['crew', '#btnCrewL'], ['rel', '#btnRel'], ['help', '#helpBtn']].concat(ownerArg === 'owner' ? [['char', '#btnChar']] : [])) await open(n, s);
  console.log(W, pre, errs.length ? 'ERR ' + errs.slice(0, 3).join(' | ') : 'ok');
  await Promise.race([pg.goto('about:blank').catch(() => {}), sleep(4000)]); await b.close().catch(() => {});
})();
