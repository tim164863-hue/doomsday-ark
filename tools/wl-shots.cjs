// 廢土美術前後對照 + 效能量測：node tools/wl-shots.cjs <baseUrl> <desktop|mobile> [types] [lvs] [prefix]
// 每種船各開兩次（?wl=0 = 舊畫面、預設 = 廢土版），按「全景」拍整艘船，記錄 draw calls / 三角形 / 幀率。
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, dev = 'desktop', tl = 'skiff,speedboat,tug,patrol,icebreaker', ll = '1,3', pre = '290-wl'] = process.argv.slice(2);
  const [W, H] = dev === 'mobile' ? [390, 844] : [1280, 760]; const touch = dev === 'mobile';
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const out = [];
  const open = async (q) => { const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch }); pg.on('dialog', (d) => d.accept().catch(() => {})); pg.on('pageerror', (e) => console.log('PE', e.message)); await pg.goto(base + '?help=0&q=low&t=0.5&' + q, { waitUntil: 'domcontentloaded', timeout: 60000 }); for (let i = 0; i < 80 && !(await pg.evaluate(() => !!(window.ark && window.ark.play && window.ark.play.ready)).catch(() => false)); i++) await w(1000); await w(1500); return pg; };
  const dismiss = async (pg) => { for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(300); } };
  const closePg = async (pg) => { await Promise.race([pg.goto('about:blank').catch(() => {}), w(5000)]); await Promise.race([pg.close().catch(() => {}), w(5000)]); };
  const measure = async (pg) => pg.evaluate(async () => { const r = ark.renderer; r.info.autoReset = false; const t0 = performance.now(); let n = 0; const calls = [], tris = []; await new Promise((res) => { const f = () => { n++; calls.push(r.info.render.calls); tris.push(r.info.render.triangles); r.info.reset(); if (performance.now() - t0 < 6000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); r.info.autoReset = true; const s = (a) => a.slice(2).reduce((x, y) => x + y, 0) / Math.max(1, a.length - 2); return { fps: +(n / ((performance.now() - t0) / 1000)).toFixed(2), calls: Math.round(s(calls)), tris: Math.round(s(tris)) }; });
  for (const type of tl.split(',')) for (const lv of ll.split(',').map(Number)) {
    // 準備存檔（選船 + 設等級）
    let pg = await open('guest=1&fresh=1'); await dismiss(pg);
    await pg.evaluate(([t, lv]) => { ark.play.fleetAct('pick', { type: ['patrol', 'icebreaker'].includes(t) ? 'skiff' : t }); if (['patrol', 'icebreaker'].includes(t)) { const f = ark.play.state.fleet; f.ships[0].type = t; f.pick = t; } ark.play.state.fleet.ships[0].lv = lv; ark.play.save(true); }, [type, lv]).catch(() => {});
    for (let i = 0; i < 6; i++) { await w(700); const okp = await pg.evaluate(([t, lv]) => { const f = ark.play.state.fleet; if (f.pick === t && f.ships[0].type === t && f.ships[0].lv === lv) { ark.play.save(true); return true; } if (!['patrol', 'icebreaker'].includes(t) && f.pick !== t) ark.play.fleetAct('pick', { type: t }); else { f.ships[0].type = t; f.pick = t; } f.ships[0].lv = lv; ark.play.save(true); return false; }, [type, lv]).catch(() => false); if (okp) break; }
    await w(500); await closePg(pg);
    for (const wl of [0, 1]) {
      pg = await open('guest=1' + (wl ? '' : '&wl=0')); await dismiss(pg);
      await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /全景/.test(e.textContent)); if (x) x.click(); }).catch(() => {}); await w(3500);
      const f = `/workspace/doomsday-ark/shots/${pre}-${type}-lv${lv}-${wl ? 'after' : 'before'}-${dev}.png`; await pg.screenshot({ path: f });
      const m = await measure(pg); out.push({ type, lv, wl, ...m }); console.log(type, 'lv' + lv, wl ? 'WL ' : 'old', JSON.stringify(m), f);
      await closePg(pg);
    }
  }
  console.log('RESULT ' + JSON.stringify(out)); await b.close();
})().catch((e) => { console.error('FAIL', e); process.exit(2); });
