// 末日方舟 · 階段⑤ 玩家對戰介面：海圖的「附近的船」卡片 + 突襲用的砲戰場（沿用階段④的 BattleUI，只在子類別裡加突襲模式）。
// 規則在 sim/pvp.js；雲端在 save/pvpnet.js。這裡只負責「看得到、摸得到」。階段④ 的 battleui.js 一個字都沒改。
import { BattleUI } from './battleui.js';
import * as A from '../sim/arena.js';
import * as F from '../sim/fleet.js';
import * as PVP from '../sim/pvp.js';
import { arenaRisk } from '../sim/btrisk.js';
import { RES } from '../sim/defs.js';
import { hash } from '../sim/rng.js';
import { clock } from '../clock.js';

const nowSec = () => clock.now();
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pc = (x) => Math.round(x * 100);
const hm = (t) => { const d = new Date(t * 1000); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const dhm = (sec) => { sec = Math.max(0, Math.ceil(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60); return h ? `${h} 小時 ${m} 分` : `${m} 分`; };
const resTxt = (o, sign = '') => PVP.PV.lootKeys.filter((k) => o && o[k] > 0).map((k) => `${RES[k].icon}${sign}${o[k]}`).join(' ');
const WHY_TXT = { online: '\ue02a 在線中', shield: '\ue077 護盾中', far: '\ue074 太遠', done: '\ue028 剛打過', poor: '\ue01c 沒油水', cool: '\ue054 休整中', busy: '\ue054 進行中', hidden: '\ue08a 你在隱身', stale: '\ue04b 很久沒上線' };

/** 海圖側欄的卡片（pc = play.pvc，可能是 null） */
export function pvHtml(s, now, pcl) {
  const pv = PVP.pvOf(s); const head = '<h4>\ue009 附近的船 <small>玩家對戰</small></h4>';
  const rules = `<p class="dim">規則：只能突襲<b>離線超過 10 分鐘</b>、距離 ${PVP.PV.range} 以內、迷霧已揭開的玩家；每次最多搶 8%（每天 ≤ 20%），你實際拿到宣稱量的 50%；被襲的人損失全額、有 12 小時護盾（損失太小 &lt; ${PVP.PV.minClaim} 件則不扣船體、也沒有護盾），回來會看到紀錄。同一個人 12 小時內只能打一次；超過 7 天沒上線的船不會出現。只搶食物 / 飲水 / 燃料 / 零件，不搶船或藍圖。<br>\ue099 免費版沒有伺服器裁判，防不了作弊，所以掠奪量刻意設得很小。</p>`;
  if (!pcl || !pcl.enabled) {
    const why = !pcl || pcl.why === 'guest' ? '登入 Google 帳號後，才能和附近的其他玩家互動（你的方舟也才會出現在別人的海圖上）。' : pcl.why === 'owner' ? '船東帳號不參與玩家對戰，T董與遊輪保持專屬。' : '目前連不上雲端，玩家對戰暫停。';
    return `<div class="pk pvp" data-pv="off">${head}<p class="dim">${why}</p>${logHtml(pv)}</div>`;
  }
  const hid = !!(pv && pv.hid), sh = PVP.shieldLeft(s, now); const mine = hid ? '<p class="pvsh">\ue08a 你正在隱身：別人看不到你，你也暫時不能出手（掃描仍可用）。</p>' : sh > 0 ? `<p class="pvsh">\ue077 你有護盾，還剩 ${dhm(sh)}（這段時間不會再被突襲）</p>` : '<p class="dim">你的方舟：離線 10 分鐘後，附近的玩家就可能來突襲（每次最多損失 8%）。</p>';
  const pend = pv && pv.in.length ? `<p class="warn">\ue03e 有 ${pv.in.length} 份突襲通知正在結算</p>` : '';
  const cd = pv && pv.cd > now ? `<p class="dim">船員休整中，${dhm(pv.cd - now)}後可再出手。</p>` : '';
  const rows = pcl.list.map((e) => {
    const c = e.c, p = e.pub, claim = c.claim || PVP.claimOf(p); const act = c.ok ? `<button class="pri" data-a="pvRaid">\ue08b 突襲</button>` : `<span class="pvw">${WHY_TXT[c.why] || '不可'}</span>`;
    return `<div class="pvr${c.ok ? ' ok' : ''}" data-u="${esc(e.uid)}"><div><b>${esc(p.h)}</b> <small>戰力 ${Math.round(p.fp)}・距離 ${Math.round(c.dist || 0)}${c.ok ? '' : ''}</small><br><small class="dim">${c.ok ? `你可拿 ${resTxt(PVP.gainOf(claim))}（對方損失 ${resTxt(claim)}）` : c.why === 'online' ? '對方還在線上（或剛離線不到 10 分鐘）' : c.why === 'shield' ? `護盾剩 ${dhm(p.sh - now)}` : c.why === 'cool' ? `還要等 ${dhm(c.wait)}` : ''}</small></div>${act}</div>`;
  }).join('');
  const body = pcl.scanning && !pcl.scanned ? '<p class="dim">掃描中…</p>' : rows || `<p class="dim">${pcl.scanned ? '附近 80 單位內沒有其他玩家的船（或還在迷霧裡）。' : '按「掃描附近」看看海上有沒有別的玩家。'}</p>`;
  return `<div class="pk pvp" data-pv="on">${head}${mine}${pend}${cd}<div class="pvl">${body}</div><div class="eo"><button data-a="pvScan">${pcl.scanning ? '掃描中…' : '\ue060 掃描附近'}</button><button data-a="pvHide" class="pvhide${hid ? ' on' : ''}" title="開啟後會立刻刪除你公開的位置與資源，別人看不到你">\ue08a 隱身：${hid ? '開' : '關'}</button></div>${pcl.err ? `<p class="dim">（雲端暫時連不上，稍後自動重試）</p>` : ''}${logHtml(pv)}${rules}</div>`;
}
function logHtml(pv) {
  if (!pv) return ''; const st = pv.st, lg = pv.log.slice(-5).reverse();
  const stat = st.hit + st.atk ? `<p class="dim">戰績：突襲 ${st.atk} 次・成功 ${st.won} 次・搶到 ${st.loot} 件；被襲 ${st.hit} 次・損失 ${st.lost} 件</p>` : '';
  if (!lg.length) return stat;
  return `${stat}<h5>被襲紀錄（你離線時發生的事）</h5><ul class="evl pvlog">${lg.map((e) => `<li><span class="et">${hm(e.t)}</span>${esc(PVP.raidText(e).replace(/^[^ ]+ /, ''))}</li>`).join('')}</ul>`;
}

/** 戰鬥介面 + 突襲模式。非突襲時完全沿用 BattleUI。 */
export class PvpBattleUI extends BattleUI {
  constructor(hud) { super(hud); this.raid = null; const r = this.el.querySelector('[data-a=retreat]'); this.rt0 = r ? r.textContent : '\ue045 撤退'; }
  open() { this.raid = null; this.setRaidChrome(false); return super.open(); }
  setRaidChrome(on) { const c = this.el.querySelector('.btTop [data-a=crew]'); if (c) c.style.display = on ? 'none' : ''; this.el.classList.toggle('raid', on); const r = this.el.querySelector('[data-a=retreat]'); if (r) r.textContent = on ? '\ue045 撤離' : this.rt0; }
  /** 海圖卡片的「突襲」按鈕：先給一張確認卡（勝率 / 損失 / 後果），再進場 */
  openRaid(uid) {
    const s = this.s, now = nowSec(), pcl = this.hud.play.pvc, e = pcl && pcl.list.find((x) => x.uid === uid);
    if (!e) { this.hud.ui.toast('目標已經不在附近了，請重新掃描'); return; }
    const c = PVP.canRaid(s, e.pub, e.uid, pcl.uid, now, pcl.owner); if (!c.ok) { this.hud.ui.toast(PVP.WHY[c.why] || '現在不能出手'); return; }
    const own = F.combatOf(s), foe = PVP.guardFoe(own, e.pub, '守衛艦 ' + e.pub.h), ar = arenaRisk(own, foe), box = this.cf.querySelector('.btCard');
    box.innerHTML = `<div class="rk">\ue009</div><h3>突襲 ${esc(e.pub.h)}？</h3><p class="rtx">對方離線中，只有一艘守衛艦（Lv ${foe.lv}）看家。在砲戰場打倒它就能搶：你可拿 <b>${resTxt(PVP.gainOf(c.claim))}</b>（宣稱量 ${resTxt(c.claim)} 的 50%；對方損失全額）。</p>
      <p class="dim">預估勝率 ${pc(ar.win)}%（全力指揮最好 ${pc(ar.winMax)}%）・打輸 / 超時：沒收穫，船體 −${Math.round(ar.loss * 100) / 100 > 0 ? Math.round(ar.loss) : 0}% 左右（不會低於 20%），船員休整 15 分鐘。<br>中途可以「撤離」，沒有損失。同一個人 12 小時內只能打一次。對方被襲後有 12 小時護盾（損失太小則沒有），回來會看到你的代號 <b>${esc(PVP.handleOf(pcl.uid))}</b>。</p>
      <div class="eo"><button data-a="go" class="pri">出擊</button><button data-a="no">算了</button></div>`;
    box.querySelector('[data-a=go]').onclick = () => { this.cf.classList.add('hide'); this.startRaid(uid); }; box.querySelector('[data-a=no]').onclick = () => this.cf.classList.add('hide'); this.cf.classList.remove('hide');
  }
  startRaid(uid) {
    const r = this.hud.play.pvpAct('raidStart', { uid }); if (!r || !r.ok) { this.hud.ui.toast('\ue099 ' + ((r && r.msg) || '現在不能出手')); this.hud.chart.refresh && this.hud.chart.refresh(true); return; }
    const s = this.s, g = this.hud.game; if (g.helm && g.helm.on) g.helm.stop(); g.controls && g.controls.keys.clear(); this.hud.chart.close(); this.hud.closeModal();
    this.raid = { att: r.att, foe: r.foe }; this.own = F.combatOf(s); this.foe = r.foe; this.arena = A.createArena(s.seed, hash(r.att.id), this.foe, this.own); this.acc = 0; this.fx = []; this.aim = null; this.ammo = 0; this.msg = ''; this.cid = 0; this.cf.classList.add('hide');
    this.phase = 'fight'; this.el.classList.remove('hide'); this.el.querySelector('.btRes').classList.add('hide'); this.el.querySelector('.btCtl').classList.remove('hide'); this.el.classList.remove('done'); this.setRaidChrome(true);
    this.el.querySelector('.btTitle').textContent = `\ue009 突襲 ${r.att.h}　\ue012 守衛艦 Lv ${this.foe.lv}`; this.el.querySelector('.btHint').textContent = this.hint(); this.resize(); this.last = performance.now(); this.hud.syncJoy(); this.pill.classList.add('hide');
    cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame((t) => this.loop(t));
  }
  loop(t) {
    if (!this.raid) return super.loop(t); if (this.phase !== 'fight') return;
    const dt = Math.min(0.1, Math.max(0, (t - this.last) / 1000)); this.last = t; const a = this.arena; this.acc += dt;
    while (this.acc >= A.AR.dt && !a.over) { this.acc -= A.AR.dt; const ev = A.stepArena(a, this.input(), A.AR.dt); this.latch = Math.max(0, this.latch - A.AR.dt); if (ev.some((x) => x.k === 'fire')) this.latch = 0; for (const e of ev) this.onArenaEvent(e); }
    this.syncBtn(); this.el.querySelector('.btTimer').textContent = `\ue091 ${Math.max(0, Math.ceil(A.AR.time - a.t))}s`; this.draw();
    if (nowSec() > this.raid.att.t0 + PVP.PV.atkTtl) { this.phase = 'done'; this.hud.play.pvpAct('raidAbort'); this.raid = null; this.showRaidResult({ ok: false, msg: '突襲時間已過，守衛艦逃走了' }); return; }
    if (a.over) { this.over0 = this.over0 || performance.now(); if (performance.now() - this.over0 > 900) { this.over0 = 0; this.finish(); return; } } else this.over0 = 0;
    this.raf = requestAnimationFrame((tt) => this.loop(tt));
  }
  finish(why) {
    if (!this.raid) return super.finish(why); const a = this.arena; this.phase = 'done'; cancelAnimationFrame(this.raf); const m = A.arenaMetrics(a); this.metrics = m;
    const r = this.hud.play.pvpAct('raidSubmit', { rep: { id: this.raid.att.id, won: m.won, loss: m.loss, hits: m.hits, shots: m.shots, t: m.t } }); const h = this.raid.att.h; this.raid = null; this.showRaidResult(r, m, h);
  }
  retreat() { if (!this.raid) return super.retreat(); if (this.phase !== 'fight' || this.arena.over) return; this.leaveRaid(); }
  close() { if (!this.raid) return super.close(); if (this.phase === 'fight' && !this.arena.over) this.leaveRaid(); else if (this.phase === 'done') { this.el.classList.add('hide'); this.hud.syncJoy(); } }
  crew() { if (this.raid) return; return super.crew(); }
  leaveRaid() { cancelAnimationFrame(this.raf); this.phase = 'idle'; this.fireHeld = false; this.hud.play.pvpAct('raidAbort'); this.raid = null; this.el.classList.add('hide'); this.hud.syncJoy(); this.hud.ui.toast('\ue045 撤離了，沒有損失'); this.hud.refresh(true); }
  showRaidResult(r, m, h) {
    this.el.classList.add('done'); this.el.querySelector('.btCtl').classList.add('hide'); const box = this.el.querySelector('.btRes'), card = box.querySelector('.btCard'); box.classList.remove('hide');
    if (!r || !r.ok) card.innerHTML = `<div class="rk">\ue054</div><h3>${esc((r && r.msg) || '這場突襲已經結束')}</h3><div class="eo"><button data-a="ok" class="pri">回到海上</button></div>`;
    else if (r.win) card.innerHTML = `<div class="rk">\ue009</div><h3>突襲成功！</h3><p class="rtx">${esc(r.msg)}</p><p class="dim">守衛艦被你擊沉了（砲戰場實際受到的傷害 ${m ? m.loss : 0}%，船體不會低於 20%）。對方有 12 小時護盾；他回來時會在報告裡看到「${esc(PVP.handleOf(this.hud.play.pvc.uid))}」來過。<br>※ 對方實際損失由他的存檔依 8% / 每日 20% 上限決定，可能比你搶到的少。</p><div class="eo"><button data-a="ok" class="pri">回到海上</button></div>`;
    else card.innerHTML = `<div class="rk">\ue006</div><h3>突襲失敗</h3><p class="rtx">${esc(r.msg)}</p><p class="dim">${m && m.won === false && m.t >= 74 ? '時間到了，守衛艦還沒倒。' : '守衛艦太硬了。'}船員休整 15 分鐘後可以再出手；也可以挑戰力比較弱的目標。</p><div class="eo"><button data-a="ok" class="pri">回到海上</button></div>`;
    card.querySelector('[data-a=ok]').onclick = () => { this.phase = 'idle'; this.el.classList.add('hide'); this.hud.syncJoy(); this.hud.refresh(true); this.refresh(); };
  }
}
