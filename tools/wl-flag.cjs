// 旗艦（devowner）廢土前後對照：node tools/wl-flag.cjs <baseUrl> <desktop|mobile> [prefix]
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, dev = 'desktop', pre = '290-wl-flagship'] = process.argv.slice(2); const [W, H] = dev === 'mobile' ? [390, 844] : [1280, 760]; const touch = dev === 'mobile';
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const res = [];
  for (const wl of [0, 1]) {
    const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: touch, isMobile: touch }); pg.on('pageerror', (e) => console.log('PE', e.message)); pg.on('dialog', (d) => d.accept().catch(() => {}));
    await pg.goto(base + '?help=0&q=low&t=0.5&guest=1&devowner=1&demo=1' + (wl ? '' : '&wl=0'), { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 80 && !(await pg.evaluate(() => !!(window.ark && window.ark.play && window.ark.play.ready)).catch(() => false)); i++) await w(1000); await w(2500);
    await pg.evaluate(() => { const h = ark.hud; if (h.modalKind) h.closeModal(); for (let i = 0; i < 3; i++) { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); } const p = [...document.querySelectorAll('button')].find((e) => /全景/.test(e.textContent)); if (p) p.click(); }); await w(4000);
    const f = `/workspace/doomsday-ark/shots/${pre}-${wl ? 'after' : 'before'}-${dev}.png`; await pg.screenshot({ path: f });
    const m = await pg.evaluate(async () => { const r = ark.renderer; r.info.autoReset = false; const t0 = performance.now(); let n = 0; const calls = [], tris = []; await new Promise((res) => { const f = () => { n++; calls.push(r.info.render.calls); tris.push(r.info.render.triangles); r.info.reset(); if (performance.now() - t0 < 6000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); r.info.autoReset = true; const s = (a) => a.slice(2).reduce((x, y) => x + y, 0) / Math.max(1, a.length - 2); return { fps: +(n / ((performance.now() - t0) / 1000)).toFixed(2), calls: Math.round(s(calls)), tris: Math.round(s(tris)) }; });
    console.log('flagship', wl ? 'WL ' : 'old', JSON.stringify(m), f); res.push({ wl, ...m });
    await Promise.race([pg.goto('about:blank').catch(() => {}), w(5000)]); await Promise.race([pg.close().catch(() => {}), w(5000)]);
  }
  console.log('RESULT ' + JSON.stringify(res)); await b.close();
})().catch((e) => { console.error('FAIL', e); process.exit(2); });
