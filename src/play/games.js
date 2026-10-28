// T董 的設施玩法：走到娛樂 / 運動設施旁按 E（或點提示的按鈕）→ 計時小遊戲（指針掃過綠色甜蜜區時按 E / 空白 / 點一下）。
// 可以「邀請附近的船員」一起玩：船員依心情與交情決定接不接受；玩完交情與心情會改變（R.playTogether）。
// 純遊戲內效果：只動 s.rel（可選存檔欄位）與 UI，不碰任何外部系統。
import * as THREE from 'three';
import { MiniGame, isAbort } from '../ui/minigame.js';
import * as R from '../sim/rel.js';
import { hash } from '../sim/rng.js';
import { clock } from '../clock.js';
import { D } from '../crew/decks.js';

const PI = Math.PI; const rnd = Math.random; const lerp = (a, b, t) => a + (b - a) * t;
const pick = (a) => a[Math.floor(rnd() * a.length)];
const yawOfDir = (hx, hz) => Math.atan2(-hx, -hz);
const faceTo = (ax, az, bx, bz) => Math.atan2(bx - ax, bz - az);

export const KIND = {
  pickle: { icon: '🥎', name: '匹克球', desc: '和對手在球網兩側來回對打，先拿 5 分。對方擊球後在甜蜜區按 E 回擊。', best: '匹克球最長連擊', unit: '拍' },
  pingpong: { icon: '🏓', name: '桌球', desc: '球速更快的對打，先拿 5 分。', best: '桌球最長連擊', unit: '拍' },
  hoop: { icon: '🏀', name: '投籃', desc: '連投 5 球，出手時在甜蜜區按 E；完美出手 3 分、普通進球 2 分。', best: '投籃', unit: '分' },
  arcade: { icon: '🕹️', name: '街機打靶', desc: '6 發子彈，指針掃到綠區時按 E，越準分越高。', best: '街機', unit: '分' },
  dive: { icon: '🏊', name: '跳水', desc: '兩個動作：起跳力道、空中入水姿勢。', best: '跳水', unit: '分' },
  slide: { icon: '🌊', name: '水上滑梯', desc: '爬上塔頂、蹬出去、衝進泳池，入水時機決定水花。', best: '滑梯', unit: '分' },
  treadmill: { icon: '🏃', name: '跑步機', desc: '配合節奏按 E 維持步頻，跑越準距離越長。', best: '跑步', unit: '公尺' },
  bench: { icon: '🏋️', name: '臥推', desc: '6 下，重量遞增；推起的瞬間按 E。', best: '臥推', unit: '公斤' },
  bar: { icon: '🍹', name: '吧台調酒', desc: '倒酒、搖勻、裝飾，三個動作調出一杯特調。', best: '調酒', unit: '分' },
  tub: { icon: '♨️', name: '泡湯', desc: '跟著呼吸的節奏按 E，放鬆身心。', best: '泡湯', unit: '分' },
  lounger: { icon: '🛋️', name: '躺椅放鬆', desc: '躺著曬太陽，跟著呼吸節奏按 E。', best: '放鬆', unit: '分' },
};

// ----------------------------------------------------------------- 場地清單（從船上的 POI 建出來）
export function buildSpots(ship) {
  const L = []; const misc = (d) => ship.decks[d].pois.misc || {};
  const add = (kind, deck, o) => { const sp = { id: kind + ':' + L.length, kind, deck, face: 0, ...o }; L.push(sp); return sp; };
  const gp = ship.decks[D.gym].pois;
  if (gp.pickle) { const pk = gp.pickle; for (const side of ['a', 'b']) add('pickle', D.gym, { x: pk[side].x, z: pk[side].z, face: pk[side].face, fac: pk, side, other: pk[side === 'a' ? 'b' : 'a'] }); }
  for (const t of misc(D.gym).pingpong || []) for (const side of ['a', 'b']) add('pingpong', D.gym, { x: t[side].x, z: t[side].z, face: t[side].face, fac: t, side, other: t[side === 'a' ? 'b' : 'a'] });
  for (const h of misc(D.gym).hoop || []) add('hoop', D.gym, { x: h.x, z: h.z, face: h.face, poi: h, hoop: h.hoop });
  for (const p of misc(D.gym).treadmill || []) add('treadmill', D.gym, { x: p.x, z: p.z, face: p.face, poi: p });
  for (const p of misc(D.gym).bench || []) add('bench', D.gym, { x: p.x, z: p.z + 1.0, face: PI, poi: p });
  for (const p of misc(D.fun).arcade || []) add('arcade', D.fun, { x: p.x, z: p.z, face: p.face, poi: p });
  for (const p of misc(D.fun).stool || []) add('bar', D.fun, { x: p.x, z: p.z - 0.12, face: p.face, poi: p });
  for (const p of misc(D.fun).pool || []) add('dive', D.fun, { x: p.x, z: p.z, face: p.face, poi: p });
  if (!ship.small) { const fn = ship.decks[D.fun].nav; const sp0 = (fn && fn.nearestFree && fn.nearestFree(-22.7, 0)) || [-22.7, 0];
  add('slide', D.fun, { x: sp0[0], z: sp0[1], face: -PI / 2, tower: { x: -24.9, z: 0 } }); }
  for (const dk of new Set([D.fun, D.boss])) for (const p of misc(dk).lounger || []) add('lounger', dk, { x: p.x - p.head[0] * 0.85, z: p.z - p.head[1] * 0.85, face: yawOfDir(p.head[0], p.head[1]), poi: p, stand: { x: p.x, z: p.z + (p.head[1] ? -p.head[1] * 1.3 : 0) } });
  for (const p of misc(D.boss).tub || []) add('tub', D.boss, { x: p.x - 1.4, z: p.z, face: PI / 2, poi: p });
  return L;
}
export const spotTaken = (sp) => !!((sp.fac && sp.fac.taken) || (sp.poi && sp.poi.taken));

const SLIDE_PTS = [[0, 4.9, 0], [1.9, 4.6, -2.3], [4.6, 4.0, -3.4], [8.0, 3.3, -2.9], [10.4, 2.5, 0], [8.6, 1.8, 3.0], [6.0, 1.3, 1.6], [7.6, 0.6, -0.2]];
const botSkill = (key) => 0.3 + 0.4 * (hash(7, 'skill', key) / 4294967296);

export class Games {
  constructor(play) {
    this.play = play; this.game = play.game; this.mg = new MiniGame(this.game.ui.root);
    this.active = null; this.spots = []; this.tw = new Set(); this.temp = [];
  }
  init() { this.spots = buildSpots(this.game.ship); }
  /** 場地附近可以邀請的船員（同層、醒著、沒在忙別的） */
  nearBots(sp) {
    return [...this.game.crew.bots.values()].filter((b) => !b.away && !b.sleeping && !b.inBath && !b.playing && !b.match && b.state !== 'init' && b.actor.deck === sp.deck && Math.hypot(b.actor.x - sp.x, b.actor.z - sp.z) < 16 && !(b.sceneUntil > this.game.time))
      .sort((a, b) => Math.hypot(a.actor.x - sp.x, a.actor.z - sp.z) - Math.hypot(b.actor.x - sp.x, b.actor.z - sp.z)).slice(0, 3);
  }
  get gaming() { return !!this.active; }
  get s() { return this.play.state; }
  get pl() { return this.game.player; }
  update(dt) {
    this.mg.update(dt);
    for (const o of [...this.tw]) { o.t += dt; const u = Math.min(1, o.t / o.dur); o.fn(u, o); if (u >= 1 || o.fin) { this.tw.delete(o); this.mg.resolvers.delete(o.rj); o.res(); } }
  }
  /** 補間：dur 秒內呼叫 fn(u)；fn 的第二個參數 o.fin = true 可提早結束。 */
  tween(dur, fn) { return new Promise((res, rej) => { const o = { t: 0, dur: Math.max(0.01, dur), fn, res, rj: rej }; this.tw.add(o); this.mg.resolvers.add(rej); }); }
  until(fn, max = 30) { return this.tween(max, (u, o) => { if (fn()) o.fin = true; }); }
  /** 結果畫面：回傳 'again' | 'exit'。 */
  ask({ title, lines, stars }) {
    return new Promise((res, rej) => { this.mg.resolvers.add(rej); const done = (v) => { this.mg.resolvers.delete(rej); res(v); };
      this.mg.result({ title, lines, stars, buttons: [{ text: '🔁 再玩一次', pri: true, fn: () => done('again') }, { text: '離開', fn: () => done('exit') }] }); });
  }
  mesh(deck, geo, color, x, y, z) { const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.6 })); m.position.set(x, y, z); this.game.ship.decks[deck].group.add(m); this.temp.push(m); return m; }
  ball(deck, color = 0xf2e94e, r = 0.11) { const m = this.mesh(deck, new THREE.SphereGeometry(r, 14, 10), color, 0, -9, 0); m.castShadow = true; return m; }

  // ---- 進入 / 離開
  enter(sp) {
    const pl = this.pl, a = pl.actor; a.clear(); pl.marker.visible = false; this.saved = { deck: a.deck, x: a.x, z: a.z, yaw: a.yaw };
    this.hudHide(true);
  }
  hudHide(on) { document.body.classList.toggle('gaming', on); }
  leave() {
    const pl = this.pl, a = pl.actor, av = pl.avatar; const act = this.active; this.active = null;
    this.tw.clear(); this.mg.close(); for (const m of this.temp) m.removeFromParent(); this.temp.length = 0;
    av.hold(null); av.setPose('stand'); av.fixedSpeed = null; av.fixedGait = null; av.body.rotation.x = 0; a.yOff = 0; a.mode = 'walk'; a.speed = 0; a.sync();
    if (act && act.bot && act.flags) { const b = act.bot; if (!act.flags.ready) b.restart(); else act.flags.done = true; if (act.spot.poi && act.spot.poi.taken === 'player') act.spot.poi.taken = null; }
    if (act && act.spot) { if (act.spot.fac && act.spot.fac.taken === 'player') act.spot.fac.taken = null; if (act.spot.poi && act.spot.poi.taken === 'player') act.spot.poi.taken = null; }
    this.hudHide(false); this.play.save(); this.play.hud.refresh(true);
  }
  async start(sp, bot = null) {
    if (this.active || this.play.pilot) return;
    if (spotTaken(sp)) { this.game.ui.toast('這裡有人在用，等一下吧'); return; }
    this.active = { spot: sp, bot, flags: bot ? { ready: false, done: false } : null };
    const claim = sp.fac || sp.poi; if (claim) claim.taken = 'player';
    this.enter(sp);
    try {
      if (bot && !this.decide(bot, sp)) return;
      await this.move(sp.x, sp.z, sp.face, sp.deck);
      if (bot && !(await this.summon(bot, sp))) return;
      let again = 'again';
      while (again === 'again') again = await this[sp.kind](sp, bot);
    } catch (e) { if (!isAbort(e)) console.error('[games]', e); }
    finally { this.leave(); }
  }
  /** 把 T董 滑到定位並站好 */
  async move(x, z, face, deck, pose = 'stand', hold = null, yOff = 0) {
    const a = this.pl.actor, av = this.pl.avatar; if (a.deck !== deck) a.place(deck, x, z, face);
    const x0 = a.x, z0 = a.z; const d = Math.hypot(x - x0, z - z0); av.setPose('stand'); av.hold(null);
    if (d > 0.05) { a.yaw = faceTo(x0, z0, x, z); await this.tween(Math.max(0.25, d / 3.2), (u) => { a.x = lerp(x0, x, u); a.z = lerp(z0, z, u); a.speed = 2.4; }); a.speed = 0; }
    a.x = x; a.z = z; a.yaw = face; a.yOff = yOff; av.setPose(pose); av.hold(hold); a.sync();
  }
  // ---- 邀請
  /** 對船員發出邀請；回傳是否接受（同一分鐘內答案固定）。 */
  decide(bot, sp) {
    const s = this.s; const ch = this.chance(bot); const roll = R.inviteRoll(s, bot.key, clock.now()); const ui = this.game.ui;
    if (roll >= ch) {
      R.inviteDeclined(s, bot.key);
      const why = bot.hurt ? '我還在養傷，下次吧…' : bot.info.cat === 'work' ? pick(['手邊的工作還沒忙完，晚點吧！', '現在有點忙，抱歉啦。']) : bot.mood === 'tired' ? pick(['有點累了，想休息…', '今天體力不太行，下次！']) : pick(['這次先不了，下次一定！', '嗯…我先看看就好。']);
      bot.say(why, 4, 'chat'); ui.toast(`🙅 ${bot.title}婉拒了邀請`); this.play.save(); return false;
    }
    bot.say(pick(['好啊，走！', '正好想活動一下！', '來吧，我可不會手下留情喔。', '好呀，等我一下！']), 3.2, 'chat'); ui.toast(`🤝 ${bot.title}接受了邀請`); return true;
  }
  async summon(bot, sp) {
    const f = this.active.flags; this.mg.open({ icon: KIND[sp.kind].icon, title: KIND[sp.kind].name, hint: `等 ${bot.title} 走過來…（Esc 取消）` });
    this.setupBot(bot, sp); await this.until(() => f.ready, 40); if (!f.ready) { this.game.ui.toast('對方沒有趕到，改天再約'); return false; } this.mg.close(); return true;
  }
  chance(bot) { return R.inviteChance({ aff: R.affOf(this.s, R.BOSS, bot.key), mood: bot.mood, cat: bot.info.cat, sleeping: bot.sleeping || bot.inBath, away: bot.away, hurt: !!bot.hurt, cheered: bot.cheerUntil > Date.now() }); }
  /** 讓船員站到定位（依設施種類）；flags.ready 表示到位。 */
  setupBot(bot, sp) {
    const f = this.active.flags; const k = sp.kind; const near = (list) => (list || []).filter((p) => p !== sp.poi && !p.taken).sort((a, b) => Math.hypot(a.x - sp.x, a.z - sp.z) - Math.hypot(b.x - sp.x, b.z - sp.z))[0];
    const misc = this.game.ship.decks[sp.deck].pois.misc || {}; let plan = null;
    const side = (d) => ({ x: sp.x + Math.cos(sp.face) * d, z: sp.z - Math.sin(sp.face) * d });
    if (k === 'pickle' || k === 'pingpong') plan = { x: sp.other.x, z: sp.other.z, face: sp.other.face, pose: 'swing', hold: 'racket' };
    else if (k === 'hoop') plan = { x: sp.x - 1.5, z: sp.z + 1.5, face: sp.face, pose: 'stand', hold: 'ball' };
    else if (k === 'arcade') { const p = near(misc.arcade); plan = p ? { x: p.x, z: p.z, face: p.face, pose: 'arcade', claim: p } : null; }
    else if (k === 'bar') { const p = near(misc.stool); plan = p ? { x: p.x, z: p.z - 0.12, face: p.face, pose: 'eat', hold: 'mug', y: 0.2, claim: p } : null; }
    else if (k === 'treadmill') { const p = near(misc.treadmill); plan = p ? { x: p.x, z: p.z, face: p.face, pose: 'stand', run: true, claim: p } : null; }
    else if (k === 'bench') { const p = near(misc.bench); plan = p ? { x: p.x, z: p.z + 1.0, face: PI, pose: 'lift', claim: p } : null; }
    else if (k === 'lounger') { const p = near(misc.lounger); plan = p ? { x: p.x - p.head[0] * 0.85, z: p.z - p.head[1] * 0.85, face: yawOfDir(p.head[0], p.head[1]), pose: 'lounge', y: 0.42, claim: p, stand: { x: p.x, z: p.z + (p.head[1] ? -p.head[1] * 1.3 : 0) } } : null; }
    else if (k === 'tub') plan = { x: sp.poi.x + 0.9, z: sp.poi.z + 0.2, face: -PI / 2, pose: 'sit', y: -0.18, stand: { x: sp.poi.x - 2.7, z: sp.poi.z } };
    if (!plan) { const q = side(1.7); plan = { x: q.x, z: q.z, face: sp.face, pose: 'hello' }; }
    const deck = sp.deck;
    bot.interrupt(function* (b) {
      b.playing = true; b.activity = '和T董一起玩'; if (plan.claim) b.claim(plan.claim); const st = plan.stand || plan;
      yield* b.goTo(deck, st.x, st.z, plan.face); if (plan.y != null || plan.stand) yield* b.glide(plan.x, plan.z, plan.face, plan.y || 0);
      b.pose(plan.pose, plan.hold || null); b.actor.x = plan.x; b.actor.z = plan.z; b.actor.yaw = plan.face; b.actor.yOff = plan.y || 0;
      if (plan.run) { b.avatar.fixedSpeed = 2.6; b.avatar.fixedGait = 'run'; b.actor.mode = 'run'; }
      f.ready = true; yield* b.waitUntil(() => f.done, 1500);
      b.avatar.hold(null); b.avatar.fixedSpeed = null; b.avatar.fixedGait = null; b.playing = false; b.actor.yOff = 0; b.pose('wave'); yield* b.wait(1.6); b.pose('stand');
    });
  }
  /** 玩完：交情變化、心情、提示。result 為 T董 視角 win / lose / draw */
  afterBot(bot, result) {
    if (!bot) return; const s = this.s; const before = R.affOf(s, R.BOSS, bot.key); const r = R.playTogether(s, bot.key, result); const ui = this.game.ui;
    bot.cheerUntil = Date.now() + 90000; bot.setMoodNow();
    bot.say(pick(result === 'win' ? ['被你打敗了，下次再來！', '打得好！我輸得心服口服。'] : result === 'lose' ? ['嘿嘿，這次我贏啦！', '承讓承讓～'] : ['玩得真開心！', '下次還要找我喔！']), 4.2, 'mood');
    const k0 = R.kindOf(before); const lab = R.label(r.aff); ui.toast(`💞 你和${bot.title}：${lab}（+${(r.aff - before).toFixed(1)}）${k0 !== r.kind ? ' ✨關係升級！' : ''}`);
  }
  /** 一款遊戲收尾：算星等、最高分、跟船員比較；回傳 'again' | 'exit' */
  async wrapUp(sp, { score, max, lines = [], vs = true, title, botScore }) {
    const bot = this.active.bot; const K = KIND[sp.kind]; const frac = max ? score / max : 0; const stars = frac >= 0.78 ? 3 : frac >= 0.5 ? 2 : frac >= 0.25 ? 1 : 0;
    const out = [...lines]; let result = 'draw';
    if (bot && vs) { const bs = botScore ?? Math.round(max * (0.38 + 0.42 * botSkill(bot.key)) * (0.8 + rnd() * 0.4)); result = score > bs ? 'win' : score < bs ? 'lose' : 'draw'; out.push(`${bot.title} 的成績：${bs}${K.unit}`); title = title || (result === 'win' ? '你贏了！' : result === 'lose' ? `${bot.title} 贏了` : '平手'); }
    else if (bot) title = title || '一起玩得很開心';
    if (R.saveBest(this.s, sp.kind, score)) out.push('🏆 新個人紀錄！'); else out.push(`個人紀錄：${R.ensureRel(this.s).best[sp.kind]}${K.unit}`);
    this.afterBot(bot, result); this.play.save(); this.mg.flash(stars >= 2 ? 'perfect' : 'good', '');
    return this.ask({ title: title || `${K.icon} ${K.name}：${Math.round(score)}${K.unit}`, lines: out, stars });
  }
  open(sp, hint, score = '') { this.mg.open({ icon: KIND[sp.kind].icon, title: KIND[sp.kind].name + (this.active.bot ? ` · 與 ${this.active.bot.title}` : ''), hint, score }); }

  // ===================================================================== 各設施
  /** 匹克球 / 桌球對打（有船員就是真人對手，沒有就是發球機） */
  async pickle(sp, bot) { return this.duel(sp, bot); }
  async pingpong(sp, bot) { return this.duel(sp, bot); }
  async duel(sp, bot) {
    const pp = sp.kind === 'pingpong'; const pl = this.pl, av = pl.avatar, mg = this.mg; const me = sp, ot = sp.other; const deck = sp.deck;
    await this.move(me.x, me.z, me.face, deck, 'swing', 'racket'); const ball = this.ball(deck, pp ? 0xffffff : 0xf2e94e, pp ? 0.07 : 0.11);
    let mach = null; if (!bot) { mach = this.mesh(deck, new THREE.BoxGeometry(0.6, 0.9, 0.6), 0x40505f, ot.x, 0.45, ot.z); this.mesh(deck, new THREE.SphereGeometry(0.1, 8, 6), 0xff5a4a, ot.x, 0.98, ot.z); }
    const sk = bot ? botSkill(bot.key) : 0.42; const T = pp ? 0.72 : 1.0, H = pp ? 0.55 : 0.95; const target = 5;
    const pts = [0, 0]; let server = rnd() < 0.5 ? 'me' : 'opp'; let best = 0;
    this.open(sp, `先拿 ${target} 分獲勝`, '0 : 0');
    const P = (who) => (who === 'me' ? me : ot);
    const fly = (from, to, y1 = 1.0, h = H, t = T) => this.tween(t, (u) => ball.position.set(lerp(from.x, to.x, u), lerp(1.0, y1, u) + 4 * h * u * (1 - u), lerp(from.z, to.z, u)));
    const hit = (who) => { if (who === 'me') av.swing(); else if (bot) bot.avatar.swing(); };
    while (pts[0] < target && pts[1] < target) {
      let hitter = server, rally = 0, winner = null, fl = null; mg.msg(server === 'me' ? '換你發球！' : '對手發球…'); await mg.wait(0.6);
      ball.position.set(P(server).x, 1.0, P(server).z);
      while (!winner) {
        const from = P(hitter), to = P(hitter === 'me' ? 'opp' : 'me'); let q = 1;
        if (hitter === 'me') {
          const sp2 = 1.12 + Math.min(rally, 9) * 0.07 + (pp ? 0.18 : 0), sw = Math.max(0.05, (pp ? 0.08 : 0.095) - rally * 0.004);
          const r = await mg.arm({ speed: sp2, sweet: sw, center: 0.28 + rnd() * 0.44, timeout: fl ? T - 0.06 : 0, label: fl ? '回擊！' : '發球！' }); if (fl) await fl;
          q = r.q; hit('me'); mg.flash(r.grade);
          if (q < 0.28) { await fly(from, { x: lerp(from.x, to.x, 0.5), z: from.z }, 0.3, 0.2, T * 0.5); winner = 'opp'; mg.msg(r.timedOut ? '沒接到…' : '球下網了…', '#ff8a7e'); break; }
        } else { await mg.wait(0.3); hit('opp'); if (rnd() < 0.05 + (1 - sk) * 0.1) { await fly(from, { x: lerp(from.x, to.x, 0.5), z: from.z }, 0.3, 0.2, T * 0.5); winner = 'me'; mg.msg('對手失誤！', '#7dffb0'); break; } }
        rally++; best = Math.max(best, rally);
        if (hitter === 'me') {
          fl = fly(from, to); await fl; fl = null;
          if (R.botReturns(q, sk, rnd())) { hitter = 'opp'; } else { await fly(to, { x: to.x + (to.x - from.x) * 0.25, z: to.z + (rnd() - 0.5) * 0.8 }, 0.2, 0.3, 0.5); winner = 'me'; mg.msg(`${bot ? bot.title : '發球機'}沒接到！`, '#7dffb0'); break; }
        } else { fl = fly(from, to); hitter = 'me'; }
      }
      pts[winner === 'me' ? 0 : 1]++; mg.setScore(`${pts[0]} : ${pts[1]}`); server = winner; ball.position.y = -9; await mg.wait(1.1);
    }
    const win = pts[0] > pts[1]; const bs = (bot ? bot.title : '發球機'); const lines = [`比數 ${pts[0]} : ${pts[1]}`, `最長連擊 ${best} 拍`];
    if (R.saveBest(this.s, sp.kind, best)) lines.push('🏆 連擊新紀錄！'); else lines.push(`連擊紀錄：${R.ensureRel(this.s).best[sp.kind]} 拍`);
    this.afterBot(bot, win ? 'win' : 'lose'); this.play.save(); void mach;
    return this.ask({ title: win ? `🎉 你贏了！（對 ${bs}）` : `${bs} 贏了`, lines, stars: win ? (pts[1] <= 2 ? 3 : 2) : pts[0] >= 4 ? 1 : 0 });
  }
  /** 投籃 */
  async hoop(sp, bot) {
    const pl = this.pl, av = pl.avatar, mg = this.mg, deck = sp.deck; const hp = sp.hoop; const ball = this.ball(deck, 0xd9732b, 0.12); ball.visible = false;
    await this.move(sp.x, sp.z, sp.face, deck, 'stand', 'ball'); this.open(sp, '出手時在甜蜜區按 E！', '0');
    const shoot = async (actor, avatar, make, perfect) => {
      avatar.setPose('shoot'); await mg.wait(0.42); avatar.hold(null); ball.visible = true; const sx = actor.x, sz = actor.z, y0 = 2.0;
      const ex = hp.x - (make ? 0 : 0.5), ez = hp.z + (make ? 0 : 0.35); await this.tween(1.1, (u) => ball.position.set(lerp(sx, ex, u), lerp(y0, hp.y, u) + 4 * 1.3 * u * (1 - u), lerp(sz, ez, u)));
      await this.tween(0.5, (u) => { ball.position.y = hp.y * (1 - u * u) + 0.12; if (!make) ball.position.x += 0.012; }); ball.visible = false; avatar.setPose('stand'); avatar.hold('ball');
    };
    let total = 0, bt = 0; const sk = bot ? botSkill(bot.key) : 0.5;
    for (let i = 0; i < 5; i++) {
      mg.msg(`第 ${i + 1} 球`); const r = await mg.arm({ speed: 1.25 + i * 0.12, sweet: 0.085, center: 0.3 + rnd() * 0.4, label: '出手！' });
      const make = r.q >= 0.92 || (r.q >= 0.6 && rnd() < 0.72) || (r.q >= 0.28 && rnd() < 0.2); const perfect = make && r.q >= 0.92; const pts = make ? (perfect ? 3 : 2) : 0; total += pts;
      mg.flash(r.grade, make ? `進！+${pts}` : '沒進'); mg.setScore(String(total)); await shoot(pl.actor, av, make, perfect); await mg.wait(0.25);
      if (bot) { const bm = rnd() < 0.2 + sk * 0.62; bt += bm ? 2 : 0; const b = bot; await shoot(b.actor, b.avatar, bm, false); b.say(bm ? '進！' : '可惜…', 1.6); }
    }
    return this.wrapUp(sp, { score: total, max: 15, lines: [`命中 ${total} 分（滿分 15）`], botScore: bot ? bt : undefined });
  }
  async arcade(sp, bot) {
    const mg = this.mg; await this.move(sp.x, sp.z, sp.face, sp.deck, 'arcade'); this.open(sp, '準星在綠區時按 E！共 6 發', '0'); let total = 0;
    for (let i = 0; i < 6; i++) { mg.msg(`第 ${i + 1} 發`); const r = await mg.arm({ speed: 1.1 + i * 0.2, sweet: 0.085 - i * 0.004, center: 0.25 + rnd() * 0.5, timeout: 2.8, label: '射擊！' }); const p = Math.round(r.q * 100); total += p; mg.flash(r.grade, `+${p}`); mg.setScore(String(total)); await mg.wait(0.65); }
    return this.wrapUp(sp, { score: total, max: 600, lines: [`總分 ${total}（滿分 600）`] });
  }
  async treadmill(sp, bot) {
    const mg = this.mg, av = this.pl.avatar, a = this.pl.actor; await this.move(sp.x, sp.z, sp.face, sp.deck, 'stand'); av.fixedGait = 'run'; a.mode = 'run'; av.fixedSpeed = 2.4;
    this.open(sp, '配合步頻按 E 維持速度', '0 m'); let dist = 0;
    for (let i = 0; i < 8; i++) { mg.msg(`第 ${i + 1} 段`); const r = await mg.arm({ speed: 1.0 + i * 0.1, sweet: 0.1, center: 0.5, timeout: 2.6, label: '踏！' }); av.fixedSpeed = 1.2 + r.q * 2.2; const m = Math.round(20 + r.q * 40); dist += m; mg.flash(r.grade, `+${m}m`); mg.setScore(dist + ' m'); await mg.wait(0.55); }
    av.fixedSpeed = null; av.fixedGait = null; a.mode = 'walk';
    return this.wrapUp(sp, { score: dist, max: 480, lines: [`跑了 ${dist} 公尺`] });
  }
  async bench(sp, bot) {
    const mg = this.mg; await this.move(sp.x, sp.z, PI, sp.deck, 'lift'); this.open(sp, '推起的瞬間按 E', '0 kg'); let kg = 0;
    for (let i = 0; i < 6; i++) { const w = 40 + i * 10; mg.msg(`第 ${i + 1} 下 · ${w}kg`); const r = await mg.arm({ speed: 1.2 + i * 0.1, sweet: 0.09 - i * 0.004, center: 0.3 + rnd() * 0.4, timeout: 2.4, label: '推！' }); const lift = Math.round(w * r.q); kg += lift; mg.flash(r.grade, `+${lift}kg`); mg.setScore(kg + ' kg'); await mg.wait(0.6); }
    return this.wrapUp(sp, { score: kg, max: 6 * 65, lines: [`總舉起 ${kg} 公斤`] });
  }
  async bar(sp, bot) {
    const mg = this.mg; await this.move(sp.x, sp.z, sp.face, sp.deck, 'eat', 'mug', 0.2); this.open(sp, '倒酒 → 搖勻 → 裝飾', ''); let sum = 0;
    for (const [i, nm] of ['倒酒', '搖勻', '裝飾'].entries()) { mg.msg(`第 ${i + 1} 步：${nm}`); const r = await mg.arm({ speed: 1.0 + i * 0.25, sweet: 0.09, center: 0.3 + rnd() * 0.4, label: nm + '！' }); sum += r.q; mg.flash(r.grade); await mg.wait(0.6); }
    const sc = Math.round(sum / 3 * 100); const nm = sc >= 85 ? '招牌特調 🍸' : sc >= 50 ? '清爽氣泡飲 🍹' : '有點奇怪的飲料 🥴';
    return this.wrapUp(sp, { score: sc, max: 100, vs: false, lines: [`調出了：${nm}`, `完成度 ${sc}%`] });
  }
  async relax(sp, bot, y, pose, hold = null) {
    const mg = this.mg; this.open(sp, '跟著呼吸的節奏按 E', ''); let sum = 0;
    for (let i = 0; i < 4; i++) { mg.msg(i % 2 ? '吐氣…' : '吸氣…'); const r = await mg.arm({ speed: 0.6, sweet: 0.16, center: 0.5, label: '放鬆' }); sum += r.q; mg.flash(r.grade); await mg.wait(0.5); }
    const sc = Math.round(sum / 4 * 100); return this.wrapUp(sp, { score: sc, max: 100, vs: false, lines: [`放鬆值 ${sc}%`, sc >= 70 ? '整個人都輕鬆了 😌' : '還有一點緊繃，再來一次吧'] });
  }
  async lounger(sp, bot) {
    const st = sp.stand; await this.move(st.x, st.z, sp.poi.face, sp.deck); await this.move(sp.x, sp.z, sp.face, sp.deck, 'lounge', null, 0.42); return this.relax(sp, bot);
  }
  async tub(sp, bot) {
    const p = sp.poi; await this.move(p.x - 2.7, p.z, PI / 2, sp.deck); await this.move(p.x, p.z, -PI / 2, sp.deck, 'sit', null, -0.18); return this.relax(sp, bot);
  }
  /** 跳水 */
  async dive(sp, bot) {
    const mg = this.mg, a = this.pl.actor, av = this.pl.avatar, deck = sp.deck; await this.move(sp.x, sp.z, sp.face, deck, 'stand'); this.open(sp, '先決定起跳力道', '0');
    const c = { x: -14.5, z: 0 }; const dx = c.x - sp.x, dz = c.z - sp.z; const L = Math.hypot(dx, dz) || 1;
    const r1 = await mg.arm({ speed: 1.15, sweet: 0.1, center: 0.75, label: '起跳！' }); mg.flash(r1.grade); await mg.wait(0.4);
    const reach = Math.min(L * 0.95, 3.0 + r1.q * (L - 2.4)); const ex = Math.min(-9.9, Math.max(-19.3, sp.x + dx / L * reach)), ez = Math.min(3.6, Math.max(-3.6, sp.z + dz / L * reach)); const x0 = a.x, z0 = a.z;
    mg.msg('空中！抓準入水姿勢', '#fff'); av.setPose('hello');
    const fly = this.tween(1.25, (u) => { a.x = lerp(x0, ex, u); a.z = lerp(z0, ez, u); a.yOff = 2.4 * 4 * u * (1 - u) - 0.3 * u * u; }); await mg.wait(0.4);
    const armP = mg.arm({ speed: 1.7, sweet: 0.1, center: 0.5, timeout: 0.75, label: '入水！' }); const [, r2] = await Promise.all([fly, armP]);
    av.setPose('swim'); a.yOff = 0.12; this.splash(deck, ex, ez, 0.8 + (r2.q + r1.q) * 0.6); mg.flash(r2.grade); const score = Math.round(50 * r1.q + 50 * r2.q); mg.setScore(String(score)); await mg.wait(1.0);
    await this.tween(0.9, (u) => { a.x = lerp(ex, sp.x, u); a.z = lerp(ez, sp.z, u); }); av.setPose('stand'); a.yOff = 0; a.x = sp.x; a.z = sp.z;
    return this.wrapUp(sp, { score, max: 100, lines: [`起跳 ${Math.round(r1.q * 100)}% · 入水 ${Math.round(r2.q * 100)}%`] });
  }
  splash(deck, x, z, size = 1) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.34, 28).rotateX(-PI / 2), new THREE.MeshBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.9, depthWrite: false })); m.position.set(x, 0.38, z); this.game.ship.decks[deck].group.add(m); this.temp.push(m);
    this.tween(1.1, (u) => { m.scale.setScalar(1 + u * 4.5 * size); m.material.opacity = 0.9 * (1 - u); }).then(() => m.removeFromParent()).catch(() => {});
  }
  /** 水上滑梯 */
  async slide(sp, bot) {
    const mg = this.mg, a = this.pl.actor, av = this.pl.avatar, deck = sp.deck; const T = sp.tower; this.open(sp, '爬上塔頂…', '0');
    const curve = new THREE.CatmullRomCurve3(SLIDE_PTS.map(([x, y, z]) => new THREE.Vector3(T.x + x, y, T.z + z))); const p0 = curve.getPoint(0);
    const x0 = a.x, z0 = a.z; a.yaw = faceTo(x0, z0, T.x, T.z); av.setPose('stand');
    await this.tween(1.5, (u) => { a.x = lerp(x0, p0.x, u); a.z = lerp(z0, p0.z, u); a.yOff = p0.y * u; a.speed = 1.2; }); a.speed = 0; av.setPose('sit');
    const r1 = await mg.arm({ speed: 1.2, sweet: 0.1, center: 0.7, label: '蹬出去！' }); mg.flash(r1.grade); await mg.wait(0.3);
    const dur = 6.4 - 2.4 * r1.q; const at = (u) => { const q = curve.getPoint(u), q2 = curve.getPoint(Math.min(1, u + 0.02)); a.x = q.x; a.z = q.z; a.yOff = q.y - 0.12; a.yaw = faceTo(q.x, q.z, q2.x, q2.z) || a.yaw; };
    await this.tween(dur * 0.72, (u) => at(u * 0.72)); mg.msg('快到水面了！抓準入水', '#fff');
    const rideB = this.tween(dur * 0.28, (u) => at(0.72 + u * 0.28)); const r2 = await mg.arm({ speed: 1.6, sweet: 0.11, center: 0.5, timeout: dur * 0.28 + 0.4, label: '入水！' }); await rideB;
    const e = curve.getPoint(1); av.setPose('swim'); await this.tween(0.35, (u) => { a.yOff = lerp(e.y - 0.12, 0.12, u); }); this.splash(deck, a.x, a.z, 1 + (r1.q + r2.q) * 0.7); mg.flash(r2.grade); const score = Math.round(50 * r1.q + 50 * r2.q); mg.setScore(String(score)); await mg.wait(1.2);
    const ox = -20.6, oz = 0; const sx = a.x, sz = a.z; await this.tween(1.0, (u) => { a.x = lerp(sx, ox, u); a.z = lerp(sz, oz, u); }); av.setPose('stand'); a.yOff = 0; await this.tween(0.8, (u) => { a.x = lerp(ox, sp.x, u); a.z = lerp(oz, sp.z, u); });
    return this.wrapUp(sp, { score, max: 100, lines: [`蹬出 ${Math.round(r1.q * 100)}% · 入水 ${Math.round(r2.q * 100)}%`] });
  }
}
