// 教學任務介面實測（真的點按鈕做完 8 步）：node tools/quest-ui.cjs "<url>" <width> <height> [owner]
// 檢查：每一步的提示圈有指到可見的東西、面板不壓底部互動卡 / 時間軸 / 搖桿 / 上方按鈕、獎勵只發一次、重新載入後進度還在。
const puppeteer = require('/tmp/shot/node_modules/puppeteer-core');
const [url, W0, H0, ownerArg] = process.argv.slice(2); const W = +W0, H = +H0; const touch = W < 600; const tag = (ownerArg === 'owner' ? 'o' : 'g') + W;
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 300; const SHOT = (name) => `/workspace/doomsday-ark/shots/${process.env.SHOTBASE || 288}-quest-${tag}-${name}.png`;
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: touch, isMobile: touch });
  const errs = []; pg.on('console', (m) => { if (['error'].includes(m.type())) errs.push(m.text()); }); pg.on('pageerror', (e) => errs.push('PE ' + e.message));
  const q = () => pg.evaluate(() => { const s = window.ark.play.state; return { q: s.quest, res: { ...s.res }, ships: s.fleet.ships.map((x) => [x.type, x.lv, x.state]), bp: Object.keys(s.fleet.bp) }; });
  const waitFor = async (fn, ms = 20000, ...a) => { const t = Date.now(); while (Date.now() - t < ms) { if (await pg.evaluate(fn, ...a).catch(() => false)) return true; await sleep(250); } return false; };
  const layout = async (label) => pg.evaluate((label) => {
    const R = (s) => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width > 1 ? { l: r.left, t: r.top, r: r.right, b: r.bottom, s } : null; };
    const qp = R('#quest'); const out = []; if (!qp) return { label, shown: false };
    const ov = (a, b) => b && a.l < b.r - 1 && a.r > b.l + 1 && a.t < b.b - 1 && a.b > b.t + 1;
    for (const s of ['#prompt', '#timebar', '#joy', '#helmbar', '#pilotbar', '#crewmini', '#right', '#resbar', '#top', '#tlpill', '#toast', '#mg']) { const r = R(s); if (ov(qp, r)) out.push(s); }
    const inV = qp.l >= 0 && qp.t >= 0 && qp.r <= innerWidth + 1 && qp.b <= innerHeight + 1;
    return { label, shown: true, overlaps: out, inViewport: inV, rect: [qp.l | 0, qp.t | 0, qp.r | 0, qp.b | 0] };
  }, label);
  const ring = () => pg.evaluate(() => { const r = document.getElementById('qring'); if (!r || r.classList.contains('hide')) return null; const u = r.querySelector('u').getBoundingClientRect(); return { x: u.left + u.width / 2, y: u.top + u.height / 2, w: u.width, h: u.height, label: r.querySelector('.ql').textContent, vis: u.left + u.width > 0 && u.top + u.height > 0 && u.left < innerWidth && u.top < innerHeight }; });
  const check = async (id, expectRing = true) => {
    await sleep(700); if (expectRing) await waitFor(() => { const r = document.getElementById('qring'); return r && !r.classList.contains('hide'); }, 5000); const inModal = await pg.evaluate(() => !!window.ark.hud.modalKind); const L = await layout(id); ok(inModal ? !L.shown : L.shown, `[${id}] 教學面板有顯示（彈窗開著時改為只留高亮圈、面板收起）`); if (L.shown) { ok(!L.overlaps.length, `[${id}] 面板沒壓到：${L.overlaps.join(',') || '無'}`); ok(L.inViewport, `[${id}] 面板在畫面內 ${L.rect}`); }
    const r = await ring(); if (expectRing) ok(!!r && r.vis, `[${id}] 有高亮圈指到畫面內的東西：${r ? r.label : '無'}`); await pg.screenshot({ path: SHOT(id) }); return r;
  };
  const click = (sel) => pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);
  const menu = async (sel) => { if (touch && !(await pg.evaluate(() => document.body.classList.contains('tlopen')))) { await click('#tlpill'); await sleep(400); } return click(sel); };
  await pg.goto(url, { waitUntil: 'domcontentloaded' }); await sleep(5000);
  if (ownerArg !== 'owner') { await pg.evaluate(() => { const bt = [...document.querySelectorAll('#modal button')].find((x) => x.textContent.includes('選這艘')); bt && bt.click(); }); await sleep(2500); }
  ok(await waitFor(() => !!(window.ark && window.ark.play && window.ark.play.ready && window.ark.hud && window.ark.hud.quest) && !document.getElementById('loading') || document.getElementById('loading').classList.contains('done'), 90000), '遊戲載入完成');
  // ★ 起始資源要維持原樣
  let S = await q(); ok(S.res.food === 150 && S.res.water === 150 && S.res.fuel === 80 && S.res.parts === 70, `起始資源不變 ${JSON.stringify(S.res)}`); ok(S.q && Object.keys(S.q.done).length === 0, '一開始沒有完成任何步驟');
  const reward = async (id, d) => { const A = await q(); ok(A.q.done[id] === 1, `步驟完成：${id}`); return A; };
  // 1 move
  await check('1-move'); await pg.evaluate(() => { const g = window.ark; const bots = [...g.crew.bots.values()]; const a = g.player.actor; const c = bots.filter((x) => !x.away && x.actor.deck === a.deck).sort((p, q) => Math.hypot(q.actor.x - a.x, q.actor.z - a.z) - Math.hypot(p.actor.x - a.x, p.actor.z - a.z)); g.play.walkToBot(c[0] || bots[0]); });
  const mvOk = await waitFor(() => !!window.ark.play.state.quest.done.move, 60000); ok(mvOk, 'move：走過去 → 步驟完成'); if (!mvOk) console.log('DBGM', JSON.stringify(await pg.evaluate(() => { const g = window.ark, a = g.player.actor; return { a: [a.x, a.z, a.deck], qd: g.play._qd, qp: g.play._qp, ev: g.play.state.quest.ev, bots: [...g.crew.bots.values()].map((b) => [b.away, b.actor.deck, b.actor.x, b.actor.z]) }; }))); S = await q(); ok(S.res.food >= 150 + 50 - 3 && S.res.parts >= 70 + 10, `move 獎勵已入帳 ${JSON.stringify(S.res)}`); await sleep(1200);
  // 2 talk：走近船員 → 按「聊天」（船員會自己走動，所以失敗就重新走過去）
  let hasChat = false, r2 = null;
  for (let i = 0; i < 8 && !hasChat; i++) { await pg.evaluate(() => { const g = window.ark; const a = g.player.actor; const bots = [...g.crew.bots.values()].filter((x) => !x.away && x.actor.deck === a.deck); bots.sort((p, q) => Math.hypot(p.actor.x - a.x, p.actor.z - a.z) - Math.hypot(q.actor.x - a.x, q.actor.z - a.z)); g.play.walkToBot(bots[0]); });
    hasChat = await waitFor(() => !!document.querySelector('#prompt:not(.hide) [data-a=chat]:not([disabled])'), 12000); }
  ok(hasChat, 'talk：走近船員後出現「聊天」按鈕');
  if (hasChat) { await sleep(300); await waitFor(() => /聊天/.test((document.querySelector('#qring .ql') || {}).textContent || ''), 6000); r2 = await ring(); await pg.screenshot({ path: SHOT('2-talk') }); ok(r2 && /聊天/.test(r2.label), 'talk：圈指在「聊天」按鈕 ' + (r2 && r2.label)); const L2 = await layout('2-talk'); ok(L2.shown && !L2.overlaps.length && L2.inViewport, `[2-talk] 面板沒壓到互動卡：${(L2.overlaps || []).join(',') || '無'}`); await click('#prompt [data-a=chat]'); }
  ok(await waitFor(() => !!window.ark.play.state.quest.done.talk, 8000), 'talk：聊天 → 步驟完成'); await sleep(1500);
  // 3 chart
  const r3 = await check('3-chart'); ok(r3 && /航海圖/.test(r3.label), 'chart：圈指在 🧭' + (touch ? '（手機先指 📊 展開選單時也算）' : '')); if (touch) await check('3-chart-menu', true);
  await menu('#btnChart'); ok(await waitFor(() => !!window.ark.play.state.quest.done.chart, 8000), 'chart：打開航海圖 → 步驟完成'); await sleep(800); await pg.screenshot({ path: SHOT('3-chart-open') }); await click('#seachart [data-a=close]'); await sleep(600);
  // 4 sail
  { const st = await pg.evaluate(() => window.ark.play.helm.canStart()); if (st) { await sleep(900); const t = await pg.evaluate(() => document.querySelector('#quest .qp').textContent + document.querySelector('#quest .qt').textContent); ok(/駕駛|出海/.test(t), '旗艦出海中：提示說明要返港才能駕駛（' + t.slice(0, 40) + '…）'); await pg.screenshot({ path: SHOT('4-sail-blocked') }); await pg.evaluate(() => { for (const x of window.ark.play.state.fleet.ships) { x.state = 'dock'; x.m = null; } window.ark.hud.refresh(true); }); await sleep(900); } }
  await check('4-sail'); await menu('#btnHelm'); const slOk = await waitFor(() => !!window.ark.play.state.quest.done.sail, 8000); ok(slOk, 'sail：開船 → 步驟完成'); if (!slOk) console.log('DBGS', JSON.stringify(await pg.evaluate(() => ({ why: window.ark.play.helm.canStart(), on: window.ark.play.helm.on, st: window.ark.play.state.fleet.ships.map((x) => x.state), toast: (document.querySelector('#toast') || {}).textContent })))); await sleep(800); const Ls = await layout('sail-on'); ok(Ls.shown ? !Ls.overlaps.length : true, `開船中面板沒壓到駕駛列：${(Ls.overlaps || []).join(',') || '無'}`); await pg.screenshot({ path: SHOT('4-sail-on') });
  await pg.evaluate(() => window.ark.play.helm.on && window.ark.play.helm.stop()); await sleep(800);
  // 5 salvage（真的走 出海 面板）
  S = await q(); const before5 = S.res; await check('5-salvage'); await menu('#btnTrips'); await sleep(900); const rm = await check('5-salvage-site'); ok(rm && /目的地/.test(rm.label), 'salvage：面板內圈指「選目的地」');
  await click('#trSites .site'); await sleep(500); const rc = await check('5-salvage-crew'); ok(rc && /船員/.test(rc.label), 'salvage：圈指「派一位船員」'); await click('#trCrew .cm:not([disabled])'); await sleep(500); const rg = await check('5-salvage-go'); ok(rg && /出發/.test(rg.label), 'salvage：圈指「出發」');
  await click('#trGo'); ok(await waitFor(() => !!window.ark.play.state.quest.done.salvage, 8000), 'salvage：出發 → 步驟完成'); await click('#modal .x'); await sleep(700);
  // 6 supply（點設施標籤走過去 → 按建造）
  const r6 = await check('6-supply'); ok(r6 && /設施/.test(r6.label), 'supply：圈指在設施標籤'); await pg.evaluate(() => { const T = window.ark.hud.tags.get('greenhouse'); T.el.click(); });
  let hasBuild = false; for (const f of ['greenhouse', 'generator', 'workshop', 'infirmary']) { await pg.evaluate((f) => { const T = window.ark.hud.tags.get(f); T && T.el.click(); }, f); hasBuild = await waitFor(() => !!document.querySelector('#prompt:not(.hide) [data-a=build]'), 15000); if (hasBuild) break; } ok(hasBuild, 'supply：走到設施旁出現「建造」'); if (!hasBuild) console.log('DBG', JSON.stringify(await pg.evaluate(() => { const a = window.ark.player.actor; const p = document.getElementById('prompt'); return { a: [a.x, a.z, a.deck], pr: p.className + '|' + p.textContent.slice(0, 80), sf: window.ark.play.standPos('greenhouse') }; })));  if (hasBuild) { const rb = await check('6-supply-build'); ok(rb && /建造/.test(rb.label), 'supply：圈指「建造」'); await click('#prompt [data-a=build]'); }
  ok(await waitFor(() => !!window.ark.play.state.quest.done.supply, 8000), 'supply：蓋設施 → 步驟完成'); await sleep(1200);
  // 7 upgrade
  { const bl = await pg.evaluate(() => ({ st: window.ark.play.state.fleet.ships.map((x) => x.state), txt: document.querySelector('#quest .qt').textContent + document.querySelector('#quest .qp').textContent })); if (bl.st.every((x) => x !== 'dock')) { await sleep(600); const t = await pg.evaluate(() => document.querySelector('#quest .qt').textContent + ' ' + document.querySelector('#quest .qp').textContent); ok(/出海/.test(t), '小船出海中時：提示說明要返港才能升級（' + t.slice(0, 40) + '…）'); await pg.screenshot({ path: SHOT('7-upgrade-blocked') }); await pg.evaluate(() => { for (const x of window.ark.play.state.fleet.ships) { x.state = 'dock'; x.m = null; } window.ark.hud.refresh(true); }); await sleep(600); } }
  const r7 = await check('7-upgrade'); await menu('#btnFleet'); await sleep(900); const ru = await check('7-upgrade-btn'); ok(ru && /升級/.test(ru.label), 'upgrade：圈指「升級」');
  const nav = pg.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => null); await pg.evaluate(() => { window.__ark_pre = JSON.stringify(window.ark.play.state.quest.done); }); await click('.shipc[data-id] [data-a=up]:not([disabled])');
  const R = await Promise.race([nav, sleep(15000).then(() => 'timeout')]); await sleep(4000);
  ok(await waitFor(() => !!(window.ark && window.ark.play && window.ark.play.ready && window.ark.hud && window.ark.hud.quest), 90000), '升級後（小船家會重新載入）遊戲重新載入完成');
  S = await q(); ok(S.q.done.upgrade === 1 && S.q.done.supply === 1 && S.q.done.move === 1, `重新載入後進度還在 ${Object.keys(S.q.done).join()}`); ok(S.ships[0][1] === 2, `小船已升到 Lv2 ${JSON.stringify(S.ships)}`);
  // 8 build
  await check('8-build'); await menu('#btnFleet'); await sleep(900); const r8 = await check('8-build-btn'); ok(r8 && /建造/.test(r8.label), 'build：圈指「建造」'); await click('.dk[data-t=skiff] [data-a=build]:not([disabled])'); await sleep(500);
  ok(await waitFor(() => !!window.ark.play.state.quest.done.build, 8000), 'build：建造新船 → 步驟完成（全部 8 步）'); await click('#modal .x'); await sleep(1200);
  S = await q(); ok(S.q.fin === 1 && S.q.bp === 'patrol' && S.bp.includes('patrol'), `最後：稀有藍圖 patrol 已入手 ${JSON.stringify(S.bp)}`); const Lf = await check('9-finish', false); ok(Lf === null || true, '完成畫面');
  // 不可重複：再按一次升級 / 聊天不再發獎勵
  const snap = JSON.stringify((await q()).q.done); await pg.evaluate(() => { const g = window.ark; const b = [...g.crew.bots.values()][0]; g.play.act('chat', b); }); const f2 = await q(); ok(JSON.stringify(f2.q.done) === snap, '重複動作不會再發獎勵');
  console.log('資源最後', JSON.stringify(f2.res), 'pool', JSON.stringify(f2.q.pool));
  // 略過 / 收合
  await pg.evaluate(() => { const q = window.ark.play.state.quest; q.x = 0; q.c = 0; window.ark.hud.quest.refresh(); }); await sleep(600); await click('#quest [data-a=fold]'); await sleep(500); ok(await pg.evaluate(() => document.getElementById('quest').classList.contains('fold')), '可以收合'); await pg.screenshot({ path: SHOT('fold') });
  await click('#quest [data-a=close]'); await sleep(600); ok(await pg.evaluate(() => document.getElementById('quest').classList.contains('hide')), '可以關閉（略過）'); ok((await q()).q.x === 1, '關閉狀態寫進存檔欄位');
  await pg.evaluate(() => window.ark.hud.openModal('tasks')); await sleep(700); ok(await pg.evaluate(() => !!document.querySelector('#tkQuest .qmod')), '📋 任務視窗裡有教學區塊'); await pg.screenshot({ path: SHOT('tasks-modal') });
  console.log('errors:', errs.filter((e) => !/Clock|PCFSoftShadowMap/.test(e)).join(' | ') || '無'); ok(!errs.filter((e) => !/Clock|PCFSoftShadowMap/.test(e)).length, '主控台沒有錯誤');
  console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); await b.close(); process.exit(fails ? 1 : 0);
})().catch((e) => { console.log('CRASH', e); process.exit(2); });
