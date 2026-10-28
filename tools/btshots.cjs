// 海戰介面截圖 / 主控台檢查。用法: node tools/btshots.cjs <baseUrl> <desktop|mobile> [startNo]
// 用 ark.btSpawn()（只有 vite dev 有）生出遭遇；用真的滑鼠 / 鍵盤打一場。
const puppeteer = require(process.env.PUPPETEER || '/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, dev = 'desktop', no = '175', fight = '12'] = process.argv.slice(2); let n = +no;
  const [W, H] = process.env.VW ? [+process.env.VW, +process.env.VH] : dev === 'mobile' ? [390, 844] : [1280, 760]; const touch = dev === 'mobile';
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
  const errs = []; pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); pg.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); });
  await pg.goto(base + (base.includes('?') ? '&' : '?') + 'help=0&q=low&t=0.5&guest=1&devowner=1&demo=1', { waitUntil: 'domcontentloaded', timeout: 60000 }); await w(6000);
  for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(500); }
  const shot = async (name) => { const f = `/workspace/doomsday-ark/shots/${n++}-${name}-${dev}.png`; await pg.screenshot({ path: f }); console.log('shot', f); };
  await pg.evaluate(() => { ark.hud.closeModal(); ark.hud.chart.close(); const w = ark.play.state.fleet.world; w.bt = null; ark.btSpawn('kraken', 1.3); }); await w(1200); await shot('pill');
  await pg.evaluate(() => ark.hud.chart.open()); await w(1500); await pg.evaluate(() => { ark.hud.chart.setPanel(true); ark.hud.chart.refresh(true); }); await w(800); await shot('chart-panel'); await pg.evaluate(() => ark.hud.chart.close());
  await pg.evaluate(() => ark.hud.battle.open()); await w(800); await shot('arena-start');
  const fightFor = async (sec) => {   // 簡單的「人」：預判瞄準 + 走位
    const t0 = Date.now(); let k = 0;
    while (Date.now() - t0 < sec * 1000) {
      const st = await pg.evaluate(() => { const B = ark.hud.battle, a = B.arena; if (!a || a.over) return null; const L = B.lay, r = B.cv.getBoundingClientRect(); const F = a.foe; return { fx: r.left + L.ox + (F.x + F.vx * 0.9) * L.sc, fy: r.top + L.oy + (F.y + F.vy * 0.9) * L.sc, px: a.p.x, tele: a.tele.length + a.proj.length }; });
      if (!st) break; await pg.mouse.move(st.fx, st.fy); await pg.mouse.down(); await w(60); await pg.mouse.up();
      const key = k++ % 2 ? 'a' : 'd'; await pg.keyboard.down(key); await w(380); await pg.keyboard.up(key); await w(120);
    }
  };
  await fightFor(+fight); await shot('arena-fight');
  await pg.evaluate(() => { const a = ark.hud.battle.arena; a.foe.hp = 0; a.over = 'win'; }); await w(2200); await shot('result');
  await pg.evaluate(() => { const c = ark.hud.battle.el.querySelector('[data-a=ok]'); if (c) c.click(); }); await w(500);
  console.log('stats', JSON.stringify(await pg.evaluate(() => ark.play.state.fleet.world.bt.st)), JSON.stringify(await pg.evaluate(() => ark.play.state.fleet.world.bt.last)));
  // 大魔王
  await pg.evaluate(() => { ark.btSpawn('leviathan', 1.6); ark.hud.battle.open(); }); await w(600); await fightFor(8); await shot('arena-leviathan');
  await pg.evaluate(() => ark.hud.battle.close()); await w(400);
  console.log('console:', errs.join('\n') || 'none'); await b.close();
})();
