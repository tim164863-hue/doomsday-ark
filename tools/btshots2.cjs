// 選項 A 海戰介面截圖：風險提示條、二次確認、撤退鍵、預設瞄準、砲戰勝利結算、來不及結算。
// 用法: node tools/btshots2.cjs <baseUrl> <startNo>  （環境變數 VW/VH；只有 vite dev 有 ark.btSpawn）
const puppeteer = require(process.env.PUPPETEER || '/tmp/shot/node_modules/puppeteer-core');
const w = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const [base, no = '193'] = process.argv.slice(2); let n = +no; const W = +(process.env.VW || 1280), H = +(process.env.VH || 760); const touch = W < 700;
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
  const errs = []; pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); pg.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); });
  await pg.goto(base + (base.includes('?') ? '&' : '?') + 'help=0&q=low&t=0.5&guest=1&devowner=1&demo=1', { waitUntil: 'domcontentloaded', timeout: 60000 }); await w(6000);
  for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(500); }
  const shot = async (name) => { const f = `/workspace/doomsday-ark/shots/${n++}-${name}-${W}.png`; await pg.screenshot({ path: f }); console.log('shot', f); };
  const spawn = (k, lv) => pg.evaluate((k, lv) => { ark.hud.closeModal(); ark.hud.chart.close(); const w = ark.play.state.fleet.world; w.bt = null; ark.btSpawn(k, lv); }, k, lv);
  const A_shots = (a) => a.st.shots; const st = () => pg.evaluate(() => { const B = ark.hud.battle, a = B.arena; return a ? { shots: a.st.shots, over: a.over, hull: a.hullPct } : null; });
  // 1 海妖：提示條 + 二次確認
  await spawn('kraken', 1.3); await w(1200); await shot('risk-pill');
  console.log('pill', await pg.evaluate(() => document.querySelector('#btpill, .btPill') ? document.querySelector('#btpill, .btPill').innerText : 'n/a'));
  await pg.evaluate(() => ark.hud.battle.take()); await w(600); await shot('confirm');
  await pg.evaluate(() => ark.hud.battle.cf.querySelector('[data-a=no]').click()); await pg.evaluate(() => ark.hud.chart.open()); await w(1500); await pg.evaluate(() => { ark.hud.chart.setPanel(true); ark.hud.chart.refresh(true); }); await w(600); await shot('chart-risk'); await pg.evaluate(() => ark.hud.chart.close());
  await pg.evaluate(() => ark.hud.battle.take()); await w(400);
  await pg.evaluate(() => ark.hud.battle.cf.querySelector('[data-a=go]').click()); await w(1200);
  // 預設瞄準：不點畫面，直接按開砲鈕
  { const r = await pg.evaluate(() => { const r = ark.hud.battle.el.querySelector('[data-a=fire]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); await pg.mouse.click(r.x, r.y); await w(900); }
  await w(2500); console.log('fire-without-aim', JSON.stringify(await st()), await pg.evaluate(() => ark.hud.battle.arena.t)); await shot('arena-retreat-btn');
  await pg.evaluate(() => ark.hud.battle.el.querySelector('[data-a=retreat]').click()); await w(700); await shot('retreat-result');
  await pg.evaluate(() => ark.hud.battle.el.querySelector('[data-a=ok]').click()); await w(400);
  // 2 海蛇：真的打（走位 + 預判瞄準）→ 砲戰勝利
  await spawn('serpent', 1); await w(600); await pg.evaluate(() => ark.hud.battle.open()); await w(600);
  // 砲戰場：用機器人在頁面內把一場打完（真的 arena 規則），再走真正的 battleSubmit → 結算卡路徑
  const ctx = await pg.evaluate(() => { const B = ark.hud.battle; return { seed: ark.play.state.seed, id: B.cid, foe: B.foe, own: B.own }; });
  const A = await import('../src/sim/arena.js'), Bot = await import('../src/sim/arenabot.js'); const a = A.createArena(ctx.seed, ctx.id, ctx.foe, ctx.own); Bot.playBot(a, 0.8, 3); const m = A.arenaMetrics(a); console.log('bot', a.over, JSON.stringify(m));
  await pg.evaluate((m) => { const B = ark.hud.battle; B.phase = 'done'; cancelAnimationFrame(B.raf); const r = ark.play.worldAct('battleSubmit', { rep: { id: B.cid, won: m.won, loss: m.loss, hits: m.hits, shots: m.shots, t: m.t, acc: m.acc, dodge: m.dodge } }); B.showResult(r, m, 'win', 'arena'); }, m);
  await w(2500); await shot('arena-result'); console.log('arena-last', JSON.stringify(await pg.evaluate(() => ark.play.state.fleet.world.bt.last)));
  await pg.evaluate(() => ark.hud.battle.el.querySelector('[data-a=ok]').click()); await w(400);
  // 3 來不及：開著砲戰場時倒數結束，船員已經處理
  await spawn('serpent', 1); await w(400); await pg.evaluate(() => ark.hud.battle.open()); await w(500);
  // 倒數結束時船員先結算了（同 battleAuto 的路徑），砲戰場的迴圈偵測到 → 秀「來不及」+ 那場的結果
  await pg.evaluate(() => { const B = ark.hud.battle; ark.play.worldAct('battleAuto', {}); B.phase = 'done'; cancelAnimationFrame(B.raf); B.showResult({ ok: false, msg: '遭遇已經由船員處理完了' }, null, null, 'crew'); }); await w(800); await shot('expired-result');
  console.log('console:', errs.join('\n') || 'none'); await b.close();
})();
