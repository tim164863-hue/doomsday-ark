// 船員的社交場景（活的那一層）：吵架 / 和好、照顧生病的人、三餐、夜間派對、慶祝、風暴時一起幫忙，
// 以及船員之間互相邀約打球。真正「會不會發生」由 sim/rel.js 的決定性模擬決定（離線也會算）；
// 這一層只負責把已經發生的事演出來，並把「船員之間」的小互動寫回交情（R.bump）。
import * as THREE from 'three';
import * as R from '../sim/rel.js';
import { clock } from '../clock.js';
import * as L from './rellines.js';
import { D } from './decks.js';

const PI = Math.PI; const rnd = Math.random; const pick = (a) => a[Math.floor(rnd() * a.length)];
const faceTo = (ax, az, bx, bz) => Math.atan2(bx - ax, bz - az);

class Confetti {
  constructor(group, cx, cz, r = 4, n = 90) {
    const g = new THREE.BufferGeometry(); this.n = n; this.p = new Float32Array(n * 3); const col = new Float32Array(n * 3); const pal = [0xff6b6b, 0xffd36b, 0x7dffb0, 0x6bb5ff, 0xd58bff];
    for (let i = 0; i < n; i++) { this.p[i * 3] = cx + (rnd() - 0.5) * 2 * r; this.p[i * 3 + 1] = rnd() * 3.2; this.p[i * 3 + 2] = cz + (rnd() - 0.5) * 2 * r; const c = new THREE.Color(pal[i % pal.length]); col.set([c.r, c.g, c.b], i * 3); }
    g.setAttribute('position', new THREE.BufferAttribute(this.p, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true, depthWrite: false })); this.pts.frustumCulled = false; group.add(this.pts); this.t = 0;
  }
  update(dt) { this.t += dt; for (let i = 0; i < this.n; i++) { this.p[i * 3 + 1] -= dt * (0.7 + (i % 5) * 0.12); if (this.p[i * 3 + 1] < 0.05) this.p[i * 3 + 1] = 3.2; this.p[i * 3] += Math.sin(this.t * 2 + i) * dt * 0.25; } this.pts.geometry.attributes.position.needsUpdate = true; }
  dispose() { this.pts.removeFromParent(); this.pts.geometry.dispose(); this.pts.material.dispose(); }
}

export class Social {
  constructor(play) {
    this.play = play; this.game = play.game; this.crew = play.game.crew; this.t = 3; this.mealKey = ''; this.partyDay = -9; this.later = []; this.fx = []; this.last = {};
  }
  get s() { return this.play.state; }
  now() { return clock.now(); }
  toast(t, type, ev = {}) { this.game.ui.toast(t); this.play.hud.logEvent({ t: this.s.simT, type, text: t.replace(/^\S+\s/, ''), ...ev }); }
  free(b) { return !!b && !b.away && !b.sleeping && !b.inBath && !b.playing && !b.match && b.state !== 'init' && !(b.sceneUntil > this.game.time) && !b.convo && !(this.play.games && this.play.games.active && this.play.games.active.bot === b); }
  busy(b, sec) { b.sceneUntil = this.game.time + sec; }
  at(sec, fn) { this.later.push({ t: sec, fn }); }
  update(dt) {
    for (let i = this.later.length - 1; i >= 0; i--) { const o = this.later[i]; o.t -= dt; if (o.t <= 0) { this.later.splice(i, 1); try { o.fn(); } catch (e) { console.error(e); } } }
    for (let i = this.fx.length - 1; i >= 0; i--) { const f = this.fx[i]; f.update(dt); f.left -= dt; if (f.left <= 0) { f.dispose(); this.fx.splice(i, 1); } }
    this.t -= dt; if (this.t > 0 || !this.play.ready || !this.s) return; this.t = 2.5;
    this.checkMeal(); this.checkParty();
  }
  confetti(deck, x, z, sec, r = 4) { const c = new Confetti(this.game.ship.decks[deck].group, x, z, r); c.left = sec; this.fx.push(c); }
  bots(filter) { return [...this.crew.bots.values()].filter((b) => this.free(b) && (!filter || filter(b))); }
  botOf(k) { return this.crew.bots.get(k) || null; }

  // ------------------------------------------------------------------ 親密度（船員之間，只有演出時才改）
  kind(a, b) { return R.inFeud(this.s, a.key, b.key, this.now()) ? 'feud' : R.relKind(this.s, a.key, b.key); }
  /** 閒聊對白：好朋友 / 對頭 / 冷戰各有自己的語氣；一般關係回傳 null。 */
  convLines(a, b) { const k = this.kind(a, b); if (k === 'neutral' || rnd() > (k === 'feud' ? 0.9 : 0.55)) return null; return L.convLines(k, a.title, b.title); }
  moodLine(b) {
    const near = [...this.crew.bots.values()].filter((o) => o !== b && !o.away && o.actor.deck === b.actor.deck && Math.hypot(o.actor.x - b.actor.x, o.actor.z - b.actor.z) < 9);
    const o = pick(near.length ? near : [null]); if (!o) return null; return L.moodLineRel(R.relKind(this.s, b.key, o.key), o.title);
  }
  /** 找球友：朋友優先、對頭會來挑戰，冷戰中的不會約。 */
  partnerWeight(b, o) { const k = this.kind(b, o); return k === 'feud' ? 0 : k === 'friend' ? 3 : k === 'rival' ? 1.6 : 1; }
  /** b 邀請 o 打球；回傳是否成立（兩邊都會說話）。 */
  invite(b, o) {
    const aff = R.affOf(this.s, b.key, o.key); const ok = rnd() < L.botInviteAccept(aff, R.compat(this.s, b.key, o.key)); const rival = R.kindOf(aff) === 'rival';
    b.say(L.pickLine(rival ? L.CHALLENGE : L.INVITE, rnd, { b: o.title }), 2.8, 'chat'); this.at(1.8, () => o.say(L.pickLine(ok ? L.ACCEPT : L.DECLINE), 2.6, 'chat'));
    if (!ok) R.bump(this.s, b.key, o.key, -0.3); return ok;
  }
  afterMatch(a, b, m) {
    const sa = m.score[0], sb = m.score[1]; const kind = R.relKind(this.s, a.key, b.key); const w = sa > sb ? a : sb > sa ? b : null; const l = w === a ? b : a;
    let d = kind === 'rival' ? (rnd() < 0.6 ? 1.0 : -1.2) : kind === 'friend' ? 1.6 : 0.8; if (kind === 'rival' && d < 0 && l) this.at(1.5, () => l.say(pick(['哼，下次一定贏你。', '運氣好而已！']), 3, 'chat'));
    else if (kind === 'rival') this.at(1.5, () => b.say(pick(['……你打得不錯。', '這次算你厲害。']), 3, 'chat'));
    R.bump(this.s, a.key, b.key, d);
  }

  // ------------------------------------------------------------------ 劇情：吵架 / 和好 / 照顧
  /** 兩人面對面演一段對白（劇本由 L.script 決定）；end() 之後各自走開再回到原本的行程。 */
  duo(kind, a, b, { mood, after } = {}) {
    if (!this.free(a) || !this.free(b) || a.actor.deck !== b.actor.deck) return false;
    const lines = L.script(kind, a.title, b.title); const deck = b.actor.deck; const nav = this.game.ship.decks[deck].nav;
    const meet = nav.nearestFree(b.actor.x + 1.3, b.actor.z) || [b.actor.x, b.actor.z]; const total = lines.length * 3 + 24; this.busy(a, total); this.busy(b, total);
    const sc = { end: false }; const away = (x, z, dir) => nav.nearestFree(x + dir * 4, z + (rnd() - 0.5) * 3) || [x, z];
    a.convo = b.convo = { t: 0 };
    b.interrupt(function* (bb) { bb.pose('stand'); bb.avatar.hold(null); yield* bb.waitUntil(() => sc.end, 70); bb.convo = null; bb.pose('stand'); if (after !== 'hug') { const p = away(bb.actor.x, bb.actor.z, 1); yield* bb.goTo(deck, p[0], p[1], 0); } });
    const self = this;
    a.interrupt(function* (aa) {
      aa.activity = kind === 'fight' ? '吵架' : kind === 'makeup' ? '和好' : '關心同伴'; yield* aa.goTo(deck, meet[0], meet[1], faceTo(meet[0], meet[1], b.actor.x, b.actor.z));
      aa.actor.yaw = faceTo(aa.actor.x, aa.actor.z, b.actor.x, b.actor.z); b.actor.yaw = faceTo(b.actor.x, b.actor.z, aa.actor.x, aa.actor.z); aa.pose('chat'); b.pose('chat');
      if (mood) { for (const x of [aa, b]) { x.moodForce = { m: mood, until: Date.now() + 120000 }; x.setMoodNow(); } }
      for (const [who, text] of lines) { const sp = who === 0 ? aa : b; sp.say(text, 2.9, 'chat'); if (kind === 'fight' && who === 1) sp.avatar.swingT = 0; yield* aa.wait(3); }
      if (kind === 'makeup') { aa.pose('hello'); b.pose('hello'); yield* aa.wait(2.2); aa.pose('wave'); b.pose('wave'); yield* aa.wait(1.4); for (const x of [aa, b]) { x.cheerUntil = Date.now() + 90000; x.setMoodNow(); } }
      else if (kind === 'help') { for (const x of [aa, b]) x.cheerUntil = Date.now() + 60000; }
      sc.end = true; aa.convo = null; aa.pose('stand'); b.pose('stand'); self.last[kind] = self.game.time;
      if (after !== 'hug') { const p = away(aa.actor.x, aa.actor.z, -1); yield* aa.goTo(deck, p[0], p[1], 0); }
    });
    return true;
  }
  fight(a, b) { return this.duo('fight', a, b, { mood: 'anxious' }); }
  makeup(a, b) { return this.duo('makeup', a, b, { after: 'hug' }); }
  help(h, sick) { if (!this.free(h) || !sick || sick.away) return false; if (sick.sleeping || sick.inBath || sick.actor.deck !== h.actor.deck) { h.say(pick(['好好休息，我會幫你顧著。', '別擔心，這邊有我。']), 4, 'mood'); return true; } return this.duo('help', h, sick, { after: 'hug' }); }

  // ------------------------------------------------------------------ 聚集（派對 / 慶祝 / 風暴）
  gather(bots, deck, cx, cz, { radius = 2, dur = 30, poses, lines, act = '聚會', speak = 0.5 }) {
    const nav = this.game.ship.decks[deck].nav; const n = bots.length; const self = this;
    bots.forEach((b, i) => {
      const ang = (i / n) * PI * 2 + rnd() * 0.5; const r = radius * (0.75 + rnd() * 0.5); const p = nav.nearestFree(cx + Math.cos(ang) * r, cz + Math.sin(ang) * r) || [cx, cz]; this.busy(b, dur + 40);
      b.interrupt(function* (bb) {
        bb.activity = act; yield* bb.goTo(deck, p[0], p[1], faceTo(p[0], p[1], cx, cz)); let t = 0; bb.actor.yaw = faceTo(bb.actor.x, bb.actor.z, cx, cz);
        while (t < dur) { const ps = pick(poses); bb.pose(ps[0], ps[1] || null); if (rnd() < speak) bb.say(pick(lines), 3, 'chat'); const w = 2 + rnd() * 3; yield* bb.wait(w); t += w; }
        bb.avatar.hold(null); bb.pose('stand'); self.busy(bb, 0);
      });
    });
  }
  party(force = false) {
    const bots = this.bots((b) => b.info.cat !== 'off' || force).filter((b) => b.info.cat === 'rest' || force || rnd() < 0.35).slice(0, 12); if (bots.length < 2 && !force) return false;
    const nav = this.game.ship.decks[D.fun].nav; const sa = this.game.ship.anchors; const c = (sa ? nav.nearestFree(sa.party.x, sa.party.z, 4) : nav.nearestFree(0.8, 0.6)) || (sa ? [sa.party.x, sa.party.z] : [0.8, 0.6]);
    this.gather(bots, D.fun, c[0], c[1], { radius: 2.1, dur: 110, poses: [['wave'], ['stretch'], ['hello'], ['drink', 'mug'], ['chat'], ['hello']], lines: L.PARTY, act: '夜間派對', speak: 0.6 });
    this.confetti(D.fun, c[0], c[1], 120); return true;
  }
  celebrate() {
    const bots = this.bots().slice(0, 10); if (bots.length < 2) return false; const nav = this.game.ship.decks[D.work].nav; const sa = this.game.ship.anchors; const c = (sa ? nav.nearestFree(sa.party.x, sa.party.z, 4) : nav.nearestFree(-15, 5)) || (sa ? [sa.party.x, sa.party.z] : [-15, 5]);
    this.gather(bots, D.work, c[0], c[1], { radius: 1.9, dur: 16, poses: [['hello'], ['wave'], ['stretch']], lines: L.CELEB, act: '慶祝', speak: 0.7 }); this.confetti(D.work, c[0], c[1], 22, 3); return true;
  }
  storm() {
    const bots = this.bots().slice(0, 6); if (bots.length < 2) return false; const nav = this.game.ship.decks[D.work].nav; const sa = this.game.ship.anchors; const c = (sa ? nav.nearestFree(sa.party.x, sa.party.z, 4) : nav.nearestFree(-4, 0)) || (sa ? [sa.party.x, sa.party.z] : [-4, 0]);
    this.gather(bots, D.work, c[0], c[1], { radius: 2.2, dur: 16, poses: [['lift'], ['stretch'], ['lift']], lines: L.STORM, act: '風暴應變', speak: 0.5 }); return true;
  }

  // ------------------------------------------------------------------ 三餐
  checkMeal() {
    const s = this.s; const now = this.now(); const min = R.localMin(now, s.tz); const m = R.mealAt(min); if (!m) return;
    const key = m.id + R.dayOf(now, s.tz); if (this.mealKey === key) return; this.mealKey = key; if (min - m.from > 25) return; this.meal(m.name);
  }
  /** 全員（醒著的）到餐廳吃飯：好朋友坐一桌，對頭盡量錯開。 */
  meal(name = '用餐', force = false) {
    const bots = this.bots((b) => force || b.info.cat === 'rest' || rnd() < 0.55).slice(0, 16); if (bots.length < 1) return false;
    const seats = this.game.ship.decks[D.cabin].pois.misc.canteen || []; const tables = [[], [], [], []]; const seatOf = new Map();
    const t4 = (i) => Math.min(3, Math.floor(i / 4)); seats.forEach((st, i) => tables[t4(i)].push(st));
    const occ = tables.map(() => []); const sorted = bots.slice().sort((a, b) => a.key.localeCompare(b.key));
    for (const b of sorted) {
      let best = -1, bs = -1e9; tables.forEach((tb, ti) => { if (occ[ti].length >= tb.length) return; let sc = rnd() * 0.5; for (const o of occ[ti]) { const a = R.affOf(this.s, b.key, o.key); sc += a >= R.FRIEND ? 4 : a <= R.RIVAL ? -6 : 0.5; } sc -= occ[ti].length * 0.15; if (sc > bs) { bs = sc; best = ti; } });
      if (best < 0) continue; occ[best].push(b); seatOf.set(b, tables[best][occ[best].length - 1]);
    }
    const dur = 55 + rnd() * 30; let n = 0;
    for (const [b, st] of seatOf) {
      n++; this.busy(b, dur + 60);
      b.interrupt(function* (bb) {
        bb.activity = '用餐'; yield* bb.goTo(D.cabin, st.x, st.z, st.face); yield* bb.glide(st.x, st.z, st.face); bb.pose('eat'); if (rnd() < 0.5) bb.say(pick(L.MEAL_OPEN), 3, 'chat');
        yield* bb.wait(dur - 6 + rnd() * 12); bb.pose('stand'); st.taken = null;
      });
    }
    // 同桌的人聊兩句（朋友更常聊）
    occ.forEach((tb) => { if (tb.length < 2) return; for (const delay of [24, 52]) this.at(delay + rnd() * 6, () => { const a = pick(tb); const b = pick(tb.filter((x) => x !== a)); if (!b || a.sleeping || a.convo || b.convo || a.avatar.poseName !== 'eat') return; const ls = this.convLines(a, b) || L.convLines('friend', a.title, b.title); this.crew.startConvo(a, b, ls); R.bump(this.s, a.key, b.key, R.relKind(this.s, a.key, b.key) === 'rival' ? 0 : 0.3); }); });
    this.toast(`\ue047 ${name}時間！${n} 位船員到餐廳用餐`, 'meal'); return true;
  }
  checkParty() {
    const s = this.s; const now = this.now(); if (!R.partyWindow(s, now)) return; const dk = R.dayOf(now, s.tz); if (this.partyDay === dk) return; this.partyDay = dk; if (this.party()) this.toast('\ue035 夜間派對開始了！大家聚到休閒甲板', 'party');
  }

  // ------------------------------------------------------------------ 模擬事件 → 演出
  onEvent(ev) {
    const a = ev.who && this.botOf(ev.who), b = ev.with && this.botOf(ev.with);
    if (ev.type === 'fight') { if (a && b) this.fight(a, b); }
    else if (ev.type === 'makeup') { if (a && b) this.makeup(a, b); }
    else if (ev.type === 'help') { if (a && b) this.help(a, b); }
    else if (ev.type === 'party') { const dk = R.dayOf(this.now(), this.s.tz); if (this.partyDay !== dk) { this.partyDay = dk; this.party(); } }
    else if (ev.type === 'celebrate') this.celebrate();
    else if (ev.type === 'storm') this.storm();
  }
  /** 開發 / 截圖用：強制演出某個場景。 */
  dev(kind, ka, kb) {
    const bots = [...this.crew.bots.values()]; const a = (ka && this.botOf(ka)) || bots[0], b = (kb && this.botOf(kb)) || bots[1];
    for (const x of bots) x.sceneUntil = 0;
    if (kind === 'fight') return this.fight(a, b); if (kind === 'makeup') return this.makeup(a, b); if (kind === 'help') return this.help(a, b);
    if (kind === 'party') return this.party(true); if (kind === 'celebrate') return this.celebrate(); if (kind === 'storm') return this.storm(); if (kind === 'meal') return this.meal('午餐', true); return false;
  }
}
