// 階段⑤ PvP 截圖（只有 vite dev 有假雲端 / window.arkPv）。用法: node tools/pvpshots.cjs <baseUrl> <startNo>  （VW/VH 設視窗大小）
const puppeteer = require(process.env.PUPPETEER || '/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, no = '228'] = process.argv.slice(2); let n = +no; const W = +(process.env.VW || 1280), H = +(process.env.VH || 760); const touch = W < 700;
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errs = []; const mk = async (pre) => { const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch }); pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); pg.on('console', (m) => { if (['error', 'warning', 'warn'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); }); if (pre) await pg.evaluateOnNewDocument(pre); return pg; };
  const shot = async (pg, name) => { const f = `/workspace/doomsday-ark/shots/${n++}-pvp-${name}-${W}.png`; await pg.screenshot({ path: f }); console.log('shot', f); };
  const Q = '?fakecloud=alice&help=0&q=low&t=0.5';
  const go = async (pg, extra = '') => { await pg.goto(base + Q + extra, { waitUntil: 'domcontentloaded', timeout: 60000 }); await pg.waitForFunction('window.ark && ark.play && ark.play.ready', { timeout: 60000 }); await w(1500); for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(500); } };
  let pg = await mk(); await pg.evaluateOnNewDocument(() => { if (!sessionStorage.getItem('pvclean')) { sessionStorage.setItem('pvclean', '1'); localStorage.removeItem('ark.fakecloud'); localStorage.removeItem('ark.fakepvp'); } });
  await go(pg); await pg.evaluate(() => { ark.play.fleetAct('pick', { type: 'tug' }); ark.hud.closeModal(); ark.play.save(true); }); await w(1500); await go(pg);
  // 1 海圖：附近的船（尚未開啟 → 先看卡片）
  await pg.evaluate(() => ark.hud.chart.open()); await w(1200); await pg.evaluate(() => { ark.hud.chart.setPanel(true); ark.hud.chart.refresh(true); }); await w(500);
  await pg.evaluate(() => arkPv.seed()); await w(1500);
  await pg.evaluate(() => { const p = document.querySelector('.scPanel .pvp'); if (p) p.scrollIntoView({ block: 'start' }); }); await w(500); await shot(pg, 'chart-list');
  console.log('rows', await pg.evaluate(() => [...document.querySelectorAll('.pvr')].map((e) => e.innerText.replace(/\s+/g, ' ')).join(' | ')));
  await pg.evaluate(() => { ark.hud.chart.setPanel(false); }); await w(500); await shot(pg, 'chart-markers'); await pg.evaluate(() => ark.hud.chart.setPanel(true));
  // 2 突襲確認
  await pg.evaluate(() => { ark.hud.chart.close(); ark.hud.battle.openRaid('npc-aaa'); }); await w(700); await shot(pg, 'confirm');
  await pg.evaluate(() => ark.hud.battle.cf.querySelector('[data-a=go]').click()); await w(1800); await shot(pg, 'arena');
  // 3 用機器人把這場打完 → 結算
  const r = await pg.evaluate(async () => { const Bot = await import('/src/sim/arenabot.js'); const B = ark.hud.battle; cancelAnimationFrame(B.raf); Bot.playBot(B.arena, 0.85, 3); B.finish(); return JSON.stringify(ark.play.state.fleet.world.pv.st); });
  await w(1500); await shot(pg, 'result'); console.log('pv.st', r, await pg.evaluate(() => JSON.stringify(ark.play.state.fleet.world.pv.out.map((o) => o.loot))));
  await pg.evaluate(() => ark.hud.battle.el.querySelector('[data-a=ok]').click()); await w(500);
  await pg.evaluate(() => { ark.hud.chart.open(); ark.hud.chart.setPanel(true); ark.hud.chart.refresh(true); }); await w(900); await pg.evaluate(() => { const p = document.querySelector('.scPanel .pvp'); if (p) p.scrollIntoView({ block: 'start' }); }); await shot(pg, 'after-raid');
  // 4 防守方：被突襲 → 回來的離線報告（把存檔改成「4 小時前離線」）
  await pg.evaluate(() => { arkPv.raidMe('npc-aaa', { food: 24, water: 22, fuel: 17, parts: 12 }, 3 * 3600); arkPv.raidMe('npc-bbb', { food: 30, water: 10, fuel: 0, parts: 8 }, 90 * 60); }); await w(300);
  await pg.close(); await w(1500);
  const pre = () => { try { const sh = (o) => { o.simT -= 4 * 3600; o.lastSeen = o.simT; return o; }; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i), raw = localStorage.getItem(k); let v; try { v = JSON.parse(raw); } catch (e) { continue; } if (k === 'ark.fakecloud') { for (const [, d] of v) { const o = sh(JSON.parse(d.data)); d.data = JSON.stringify(o); d.lastSeen = o.lastSeen; } localStorage.setItem(k, JSON.stringify(v)); } else if (v && typeof v === 'object' && typeof v.simT === 'number' && typeof v.lastSeen === 'number') { localStorage.setItem(k, JSON.stringify(sh(v))); } } } catch (e) { console.error('pre', e.message); } };
  pg = await mk(pre); await pg.goto(base + Q + '&pvseed=0', { waitUntil: 'domcontentloaded', timeout: 60000 }); await pg.waitForFunction('window.ark && ark.play && ark.play.ready', { timeout: 60000 }); await w(2500);
  console.log('dbg', await pg.evaluate(() => JSON.stringify({ uid: ark.play.pvc && ark.play.pvc.uid, away: ark.play.away, rep: ark.play.rep && Object.keys(ark.play.rep), pv: ark.play.state.fleet.world.pv && { in: ark.play.state.fleet.world.pv.in, now: Date.now() / 1000, seen: ark.play.state.fleet.world.pv.seen, log: ark.play.state.fleet.world.pv.log.length }, raids: [...arkPv.store.raids.keys()], simT: ark.play.state.simT, ls: ark.play.state.lastSeen, docs: localStorage.getItem('ark.fakecloud').length })));
  await shot(pg, 'defender-report');
  console.log('log', await pg.evaluate(() => JSON.stringify(ark.play.state.fleet.world.pv.log.slice(0, 3))));
  for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(500); }
  await pg.evaluate(() => { ark.hud.chart.open(); ark.hud.chart.setPanel(true); ark.hud.chart.refresh(true); }); await w(900); await pg.evaluate(() => { const p = document.querySelector('.scPanel .pvp'); if (p) p.scrollIntoView({ block: 'end' }); }); await w(300); await shot(pg, 'defender-log');
  console.log('console:', errs.join('\n') || 'none'); await b.close();
})();
