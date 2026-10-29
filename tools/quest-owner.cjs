// 教學任務（T董 / 旗艦）輕量實測：用遊戲內事件推進 8 步，每步檢查面板位置（不壓互動卡 / 右側按鈕列 / 時間軸）、圈指狀態、獎勵只發一次、重新載入後進度仍在。
// node tools/quest-owner.cjs "<url>&guest=1&fresh=1&devowner=1" WIDTH HEIGHT
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const [url, W0, H0] = process.argv.slice(2); const W = +W0, H = +H0; const touch = W < 600;
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: touch, isMobile: touch });
  const errs = []; pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); pg.on('pageerror', (e) => errs.push('PE ' + e.message));
  const waitFor = async (fn, ms = 20000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await pg.evaluate(fn).catch(() => false)) return true; await sleep(250); } return false; };
  await pg.goto(url, { waitUntil: 'domcontentloaded' }); await sleep(5000);
  ok(await waitFor(() => !!(window.ark && window.ark.play && window.ark.play.ready && window.ark.hud && window.ark.hud.quest), 90000), '遊戲載入完成');
  await sleep(1500); await pg.evaluate(() => { const h = window.ark.hud; if (h.modalKind === 'report') h.closeModal(); }); await sleep(1500);
  const lay = () => pg.evaluate(() => {
    const R = (s) => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width > 1 ? { l: r.left, t: r.top, r: r.right, b: r.bottom } : null; };
    const qp = R('#quest'); if (!qp) return { shown: false }; const out = [];
    const ov = (a, b) => b && a.l < b.r - 1 && a.r > b.l + 1 && a.t < b.b - 1 && a.b > b.t + 1;
    for (const s of ['#prompt', '#timebar', '#joy', '#helmbar', '#pilotbar', '#crewmini', '#crew', '#right', '#resbar', '#top', '#tlpill', '#mg']) if (ov(qp, R(s))) out.push(s);
    const rg = document.getElementById('qring'); const ringOn = rg && !rg.classList.contains('hide');
    return { shown: true, overlaps: out, inV: qp.l >= 0 && qp.t >= 0 && qp.r <= innerWidth + 1 && qp.b <= innerHeight + 1, ring: ringOn ? rg.querySelector('.ql').textContent : null, step: (document.querySelector('#quest .qs') || {}).textContent };
  });
  const shot = (n) => pg.screenshot({ path: `/workspace/doomsday-ark/shots/${process.env.SHOTBASE || 288}-quest-o${W}-${n}.png` });
  const EV = ['move', 'talk', 'chart', 'sail', 'salvage', 'supply', 'upgrade', 'buildShip'];
  for (let i = 0; i < EV.length; i++) {
    await sleep(1200); const L = await lay(); const modal = await pg.evaluate(() => !!window.ark.hud.modalKind);
    ok(modal || L.shown, `[${EV[i]}] 面板有顯示 step=${L.step || ''} ring=${L.ring}`); if (L.shown) { ok(!L.overlaps.length, `[${EV[i]}] 面板沒壓到：${L.overlaps.join(',') || '無'}`); ok(L.inV, `[${EV[i]}] 面板在畫面內`); }
    await shot(`${i + 1}-${EV[i]}`);
    if (EV[i] === 'chart') { await pg.evaluate(() => { const s = [...document.querySelectorAll('button')].find((e) => /航海圖/.test(e.title + e.textContent) && e.offsetParent); window.__cb = !!s; }); }
    await pg.evaluate((e) => window.ark.play.qNote(e), EV[i]); await sleep(300);
    const A = await pg.evaluate((e) => window.ark.play.state.quest.done, EV[i]); ok(Object.keys(A).length === i + 1, `事件 ${EV[i]} → 完成 ${Object.keys(A).join()}`);
  }
  await sleep(1500); const S = await pg.evaluate(() => { const s = window.ark.play.state; return { q: s.quest, res: { ...s.res }, bp: Object.keys(s.fleet.bp) }; });
  ok(S.q.fin === 1 || Object.keys(S.q.done).length === 8, '8 步全部完成'); ok(S.bp.length > 0 || S.q.bp, '稀有藍圖已入手 ' + JSON.stringify([S.bp, S.q.bp]));
  await pg.evaluate(() => { window.ark.play.qNote('move'); window.ark.play.qNote('chart'); }); await sleep(300);
  const S2 = await pg.evaluate(() => ({ ...window.ark.play.state.res })); ok(JSON.stringify(S2) === JSON.stringify(S.res) || Math.abs(S2.food - S.res.food) < 40, '重複事件不會再發獎勵 ' + JSON.stringify([S.res, S2]));
  const fb = await lay(); await shot('9-finish'); ok(!fb.shown || !fb.overlaps.length, '完成後面板沒壓到');
  const rt = errs.filter((e) => !/Clock|PCFSoftShadowMap/.test(e)); console.log('errors:', rt.length ? rt.join(' | ') : '無'); ok(!rt.length, 'console 乾淨');
  console.log(fails ? `${fails} 項失敗` : '全部通過'); await Promise.race([pg.goto('about:blank').catch(() => {}), sleep(4000)]); await b.close(); process.exit(fails ? 1 : 0);
})().catch((e) => { console.log('CRASH', e); process.exit(2); });
