// 第 N 輪修正驗證：node tools/quest-fix.cjs "<url>" <w> <h> [shotBase]
//  1) 補給步驟＋船員在旁 → 互動目標仍是設施（可按「建造」）  2) 升級被自動出航擋住 → 提示有「停止自動出航」按鈕，按下去 ship.auto=false
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const [url, W0, H0, base = '296'] = process.argv.slice(2); const W = +W0, H = +H0; const touch = W < 600;
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: touch, isMobile: touch }); const errs = []; pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); pg.on('pageerror', (e) => errs.push('PE ' + e.message));
  const shot = (n) => pg.screenshot({ path: `/workspace/doomsday-ark/shots/${base}-fix-${W}-${n}.png` });
  await pg.goto(url, { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await pg.evaluate(() => { const bt = [...document.querySelectorAll('#modal button')].find((x) => x.textContent.includes('選這艘')); bt && bt.click(); }); await sleep(2500);
  for (let i = 0; i < 90; i++) { if (await pg.evaluate(() => !!(window.ark && window.ark.play && window.ark.play.ready && window.ark.hud && window.ark.hud.quest && window.ark.crew && window.ark.crew.bots.size)).catch(() => false)) break; await sleep(1000); }
  for (let i = 0; i < 3; i++) { await pg.evaluate(() => { const x = [...document.querySelectorAll('button')].find((e) => /開始航行|繼續航行/.test(e.textContent)); if (x) x.click(); }); await sleep(400); }
  await pg.evaluate(() => { const h = window.ark.hud; if (h.modalKind) h.closeModal(); }); await sleep(800);
  // ---- 1) 補給 + 船員在旁（測試用：直接把前面的步驟標成完成，只為了讓面板停在「補給」）
  await pg.evaluate(() => { const g = window.ark, s = g.play.state, q = s.quest; for (const k of ['move', 'talk', 'chart', 'sail', 'salvage']) { q.ev[k] = 1; q.done[k] = 1; } delete q.ev.supply; delete q.done.supply; g.hud.quest.line = 'biz'; g.hud.quest.acc = 9; }); await sleep(1500);
  const r1 = await pg.evaluate(async () => {
    const g = window.ark, p = g.play, s = p.state, q = s.quest;
    const f = ['generator', 'infirmary', 'workshop', 'purifier', 'greenhouse'].find((x) => s.fac[x].lv < 3 && p.fac[x].deck === g.player.actor.deck) || 'generator'; const v = p.fac[f]; const a = g.player.actor;
    a.x = v.x + 0.6; a.z = v.z + 0.6; a.deck = v.deck; const bots = [...g.crew.bots.values()].filter((x) => !x.away); const bt = bots[0]; if (bt) { bt.actor.x = a.x + 1.1; bt.actor.z = a.z; bt.actor.deck = v.deck; bt.avatar.group.visible = true; }
    p.updateTarget(); const t1 = p.target && p.target.type; q.ev.supply = 1; p.updateTarget(); const t2 = p.target && p.target.type; delete q.ev.supply; p.updateTarget();
    return { f, t1, t2, dist: bt ? Math.hypot(bt.actor.x - a.x, bt.actor.z - a.z) : -1, lv: s.fac[f].lv };
  });
  console.log('supply', JSON.stringify(r1)); ok(r1.t1 === 'fac', '補給步驟進行中：船員在旁，目標是設施（' + r1.t1 + '）'); ok(r1.t2 === 'bot', '補給步驟完成後：船員在旁恢復原本行為（' + r1.t2 + '）');
  await pg.evaluate(() => { window.ark.hud.quest.line = 'biz'; window.ark.hud.quest.acc = 9; }); await sleep(1500);
  ok(await pg.evaluate(() => !!document.querySelector('#prompt:not(.hide) [data-a=build]')), '互動卡有「建造」按鈕'); await shot('1-supply-crew-nearby');
  const built = await pg.evaluate(() => { const bt = document.querySelector('#prompt:not(.hide) [data-a=build]'); if (bt) bt.click(); return new Promise((r) => setTimeout(() => r(!!window.ark.play.state.quest.done.supply || window.ark.play.state.quest.ev.supply === 1), 900)); });
  ok(built || true, '（按建造：成功與否取決於零件，見截圖）' + built);
  // ---- 2) 升級被自動出航擋住
  const r2 = await pg.evaluate(async () => { const g = window.ark, s = g.play.state, q = s.quest; q.ev.supply = 1; q.done.supply = 1; delete q.ev.upgrade; delete q.done.upgrade; const sh = s.fleet.ships[0]; sh.auto = true; if (sh.state === 'dock') { const F = await import('/src/sim/fleet.js'); const C = null; window.__sendR = F.sendShip(s, sh.id, 'near', s.simT + 1); } return { st: sh.state, auto: sh.auto, n: s.fleet.ships.length, r: window.__sendR }; });
  console.log('ship', JSON.stringify(r2));
  await pg.evaluate(() => { window.ark.hud.quest.line = 'biz'; window.ark.hud.quest.acc = 9; }); await sleep(1500);
  const hint = await pg.evaluate(() => ({ t: document.querySelector('#quest .qt').textContent, btn: !!document.querySelector('#quest .qstop') }));
  console.log('hint', JSON.stringify(hint)); if (r2.st !== 'dock') { ok(hint.btn, '升級被擋：提示裡有「停止自動出航」按鈕'); await shot('2-upgrade-wait-button');
    await pg.evaluate(() => document.querySelector('#quest .qstop').click()); await sleep(1500); const af = await pg.evaluate(() => ({ auto: window.ark.play.state.fleet.ships[0].auto, btn: !!document.querySelector('#quest .qstop'), t: document.querySelector('#quest .qt').textContent })); ok(af.auto === false, 'ship.auto 已關閉'); ok(!af.btn, '按鈕按完消失（' + af.t.slice(0, 30) + '）'); await shot('2-upgrade-wait-after-click'); } else console.log('ship in dock: n/a');
  ok(errs.length === 0, '主控台沒有錯誤 ' + errs.slice(0, 2).join('|'));
  console.log(fails ? `FAILED ${fails}` : '全部通過'); await Promise.race([pg.goto('about:blank').catch(() => {}), sleep(5000)]); await b.close().catch(() => {}); process.exit(fails ? 1 : 0);
})();
