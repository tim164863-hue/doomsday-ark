// 海戰介面檢查（需要 vite dev + puppeteer-core）：node tools/btui-check.cjs http://localhost:5173/doomsday-ark/
//  1) 砲戰分出勝負後撤退 / 交給船員被鎖住  2) 「來不及」卡片沒有重複標點  3) 勝率 < 10% 的二次確認預設是「交給船員」
const puppeteer = require(process.env.PUPPETEER || '/tmp/shot/node_modules/puppeteer-core'); const w = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
(async () => {
  const base = process.argv[2] || 'http://localhost:5173/doomsday-ark/';
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: 1280, height: 760 }); const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); });
  await pg.goto(base + '?help=0&q=low&t=0.5&guest=1&devowner=1&demo=1', { waitUntil: 'domcontentloaded', timeout: 60000 }); await w(6000);
  for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await w(500); }
  const spawn = (k, lv) => pg.evaluate((k, lv) => { ark.hud.closeModal(); ark.hud.chart.close(); ark.play.state.fleet.world.bt = null; return ark.btSpawn(k, lv); }, k, lv);
  // 1) 輸了之後不能撤退
  await spawn('kraken', 1.3); await pg.evaluate(() => { ark.hud.battle.open(); }); await w(800);
  const r1 = await pg.evaluate(() => { const B = ark.hud.battle, a = B.arena; a.over = 'lose'; B.syncBtn(); const dis = ['retreat', 'crew'].map((k) => B.el.querySelector(`.btTop [data-a=${k}]`).disabled); B.retreat(); B.crew(); const w = ark.play.state.fleet.world; return { phase: B.phase, cur: !!w.bt.cur, last: w.bt.last, st: JSON.stringify(w.bt.st), dis }; });
  ok(r1.dis[0] && r1.dis[1], '分出勝負後撤退 / 交給船員按鈕被鎖（disabled）'); ok(r1.phase === 'fight' && r1.cur && !r1.last && JSON.parse(r1.st).f === 0, '輸了之後呼叫 retreat() / crew()：沒有結算、狀態不變、仍等砲戰場結算');
  await w(3500); const r1b = await pg.evaluate(() => ({ last: ark.play.state.fleet.world.bt.last, txt: ark.hud.battle.el.querySelector('.btRes').innerText })); ok(r1b.last && r1b.last.r !== 'fled', `砲戰場自己結算：${r1b.last && r1b.last.r}（不是撤退成功）`);
  // 2) 來不及卡片標點
  await spawn('serpent', 1); await pg.evaluate(() => { const B = ark.hud.battle; B.open(); }); await w(600);
  const txt2 = await pg.evaluate(() => { const B = ark.hud.battle; ark.play.worldAct('battleAuto', {}); B.phase = 'done'; cancelAnimationFrame(B.raf); B.showResult({ ok: false, msg: 'x' }, null, null, 'crew'); return B.el.querySelector('.btRes').innerText; });
  ok(/結果：擊退了。/.test(txt2) && !/[！!][。.]/.test(txt2), '來不及卡片：「結果：擊退了。」沒有重複標點'); console.log('   ', txt2.replace(/\n/g, ' | '));
  // 3) 二次確認
  await pg.evaluate(() => ark.hud.battle.el.querySelector('[data-a=ok]').click()); await spawn('kraken', 1.3); await pg.evaluate(() => ark.hud.battle.take()); await w(500);
  const c3 = await pg.evaluate(() => { const cf = ark.hud.battle.cf, bs = [...cf.querySelectorAll('.eo button')]; return { txt: cf.innerText, pri: bs.filter((x) => x.classList.contains('pri')).map((x) => x.textContent), order: bs.map((x) => x.textContent) }; });
  ok(c3.pri.length === 1 && c3.pri[0] === '交給船員' && /這場幾乎打不贏/.test(c3.txt), `勝率 < 10%：預設按鈕＝交給船員（${c3.order.join(' / ')}），文字「這場幾乎打不贏」`);
  await pg.evaluate(() => ark.hud.battle.cf.querySelector('[data-a=no]').click()); await spawn('pirate', 1.2); await pg.evaluate(() => ark.hud.battle.take()); await w(400);
  const c4 = await pg.evaluate(() => { const B = ark.hud.battle, bs = [...B.cf.querySelectorAll('.eo button.pri')].map((x) => x.textContent); return { open: !B.cf.classList.contains('hide'), pri: bs, ar: ark.hud.battle.isOpen() }; }); console.log('    pirate confirm:', JSON.stringify(c4));
  ok(errs.length === 0, '主控台乾淨：' + (errs.join(' | ') || 'none')); await b.close(); console.log(fails ? fails + ' 項失敗' : '全部通過'); process.exit(fails ? 1 : 0);
})();
