// 特殊海域截圖 / 主控台檢查。用法: node tools/szshots.cjs <baseUrl> <desktop|mobile> [zone,zone,...] [prefix]
// 用 ark.szTeleport() 把方舟放進海域（除錯用，會存檔到這個瀏覽器的 localStorage，不影響別人）。
const puppeteer = require(process.env.PUPPETEER || '/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, dev = 'desktop', zl = 'fog,whirlpool,fire,hell,stonehenge', pre = 'sz', pick = ''] = process.argv.slice(2);   // pick = 船型（訪客小船，例如 tug / skiff）；不給 = 用 devowner 母船
  const [W, H] = dev === 'mobile' ? [390, 844] : [1280, 760]; const touch = dev === 'mobile';
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
  const errs = []; pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); pg.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); });
  const q = pick ? 'help=0&q=low&t=0.5&guest=1' : 'help=0&q=low&t=0.5&guest=1&devowner=1&demo=1';
  if (pick) { await pg.goto(base + '?' + q + '&fresh=1', { waitUntil: 'domcontentloaded', timeout: 60000 }); await w(5000); await pg.evaluate((t) => { ark.play.fleetAct('pick', { type: t }); ark.play.save(true); }, pick); await w(600); }
  await pg.goto(base + (base.includes('?') ? '&' : '?') + q, { waitUntil: 'domcontentloaded', timeout: 60000 }); await w(6000);
  for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(500); }
  console.log('bundle', await pg.evaluate(() => [...document.scripts].map((s) => s.src.split('/').pop()).join()));
  const shot = async (n) => { const f = `/workspace/doomsday-ark/shots/${n}.png`; await pg.screenshot({ path: f }); console.log('shot', f); };
  for (const z of zl.split(',')) {
    await pg.evaluate((z) => { ark.hud.closeModal(); ark.hud.chart.close(); ark.szTeleport(z, 0.35); if (ark.helm.on) ark.helm.stop(); ark.helm.start(); ark.helm.thr = 0.25; for (let i = 0; i < 60; i++) ark.step(0.1); }, z); await w(3500);
    await pg.evaluate(() => { for (let i = 0; i < 40; i++) ark.step(0.1); ark.ui.updSz(); }); await w(1500);
    console.log(z, JSON.stringify(await pg.evaluate(() => ({ fx: ark.szFx && { id: ark.szFx.id, d: +ark.szFx.depth.toFixed(2) }, zfx: ark.zonefx && { id: ark.zonefx.id, entries: ark.zonefx.entries, solid: ark.zonefx.solid, on: ark.helm.on, v: ark.helm.v }, chip: document.querySelector('#szChip').textContent, fps: ark.fps }))));
    await shot(`${pre}-${z}-${dev}`);
  }
  // 膠囊展開（手機）：資源列最下面一列是海域
  await pg.evaluate(() => { ark.helm.stop(); ark.hud.pill.click(); }); await w(1200); await shot(`${pre}-pill-${dev}`); await pg.evaluate(() => ark.hud.pill.click());
  // 海圖：全部海域（縮小到整張世界圖）+ 側欄打開
  await pg.evaluate(() => { for (const z of ['fog', 'whirlpool', 'fire', 'hell', 'stonehenge']) { ark.szTeleport(z, 0.3); } ark.szTeleport('hell', 0.9); });
  await pg.evaluate(() => { const c = ark.hud.chart; c.open(); c.view.x = 1000; c.view.y = 1000; c.view.k = c.minK; c.setPanel(false); }); await w(1500); await shot(`${pre}-chart-all-${dev}`); await pg.evaluate(() => { ark.hud.chart.setPanel(true); ark.hud.chart.refresh(true); }); await w(1000); await shot(`${pre}-chart-panel-${dev}`);
  // 海圖
  await pg.evaluate(() => { ark.hud.chart.open(); }); await w(1500); await shot(`${pre}-chart-${dev}`);
  console.log('console:', errs.join('\n') || 'none'); await b.close();
})();
