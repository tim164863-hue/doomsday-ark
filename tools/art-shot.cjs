// 美術截圖：node tools/art-shot.cjs <baseUrl> <W> <H> <out.png> "<query>" [flag|small:<type>:<lv>] [waitMs]
// flag = 旗艦全景（devowner）；small:skiff:2 = 小船（guest）。query 例如 "q=high&wl=0"。會等貼圖 / HDRI 載完再拍，並印出 draw calls / 三角形 / 下載量。
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, Ws, Hs, out, q = '', what = 'flag', wait = '3500'] = process.argv.slice(2); const W = +Ws, H = +Hs; const touch = W < 600;
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage'] });
  const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: touch, isMobile: touch, deviceScaleFactor: 1 }); pg.on('pageerror', (e) => console.log('PE', e.message)); pg.on('dialog', (d) => d.accept().catch(() => {}));
  let bytes = 0; pg.on('response', async (r) => { try { const u = r.url(); if (/\/(tex|env|models)\//.test(u)) { const l = +r.headers()['content-length'] || (await r.buffer()).length; bytes += l; } } catch (e) {} });
  const [kind, type = 'skiff', lv = '1'] = what.split(':');
  const url = base + '?help=0&t=0.5&guest=1&demo=1' + (kind === 'flag' ? '&devowner=1' : `&home=${type}&homeLv=${lv}`) + (q ? '&' + q : '');
  await pg.goto(url, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 80 && !(await pg.evaluate(() => !!(window.ark && window.ark.play && window.ark.play.ready)).catch(() => false)); i++) await w(1000); await w(+wait);
  await pg.evaluate(() => { const h = ark.hud; if (h.modalKind) h.closeModal(); for (let i = 0; i < 3; i++) { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); } const p = [...document.querySelectorAll('button')].find((e) => /全景/.test(e.textContent)); if (p) p.click(); }); await w(4000);
  await pg.screenshot({ path: out });
  const m = await pg.evaluate(async () => { const r = ark.renderer; r.info.autoReset = false; const t0 = performance.now(); let n = 0; const calls = [], tris = []; await new Promise((res) => { const f = () => { n++; calls.push(r.info.render.calls); tris.push(r.info.render.triangles); r.info.reset(); if (performance.now() - t0 < 5000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); r.info.autoReset = true; const s = (a) => a.slice(2).reduce((x, y) => x + y, 0) / Math.max(1, a.length - 2); return { fps: +(n / ((performance.now() - t0) / 1000)).toFixed(2), calls: Math.round(s(calls)), tris: Math.round(s(tris)), geos: r.info.memory.geometries, tex: r.info.memory.textures }; });
  const pr = await pg.evaluate(() => { const o = {}; ark.scene.traverse((x) => { if (x.name && x.name.startsWith('prop-')) { o[x.name] = (o[x.name] || 0) + 1; } }); const sh = []; ark.scene.traverse((x) => { if (x.isMesh && x.castShadow) sh.push(1); }); return { props: o, shadowCasters: sh.length }; });
  console.log(out, JSON.stringify({ ...m, artKB: Math.round(bytes / 1024), ...pr })); await Promise.race([b.close(), w(8000)]); process.exit(0);
})().catch((e) => { console.error('FAIL', e); process.exit(2); });
