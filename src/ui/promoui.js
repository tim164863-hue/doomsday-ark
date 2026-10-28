// 旗艦晉升介面（階段③）：選分支、看需求與進度、投入資源、開工、改裝倒數。掛在 HUD 的 modal（kind = 'promo'）。
import * as PM from '../sim/promo.js';
import * as FL from '../sim/fleet.js';
import { SPECIAL_ZONES, SZ_ORDER, MATERIALS } from '../sim/szdata.js';
import { RES } from '../sim/defs.js';
import { clock } from '../clock.js';
const nowSec = () => clock.now();

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hm = (sec) => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60); return h ? `${h} 小時 ${m} 分` : `${m} 分`; };
/** 訪客：數值換成自己小船的真實數值 */
const homeBase = (hud) => { if (!hud.game.small) return null; const hs = FL.homeShip(hud.s.fleet); return hs ? FL.shipStats(hs) : null; };
const pct = (v) => `${Math.round(v * 100)}%`;
const zonesWith = (kind, id) => SZ_ORDER.map((z) => SPECIAL_ZONES[z]).filter((z) => (kind === 'mat' ? z.mat === id : z.bp.includes(id)));

/** 數值 chips；base 有值時顯示差異（▲▼） */
export function statChips(r, base, small) {
  const d = (k, f = (x) => x) => { if (!base) return ''; const a = r[k] - base[k]; if (Math.abs(a) < 1e-9) return ''; return `<i class="${a > 0 ? 'up' : 'dn'}">${a > 0 ? '▲' : '▼'}${f(Math.abs(a))}</i>`; };
  const P = (x) => Math.round(x * 100) + '%';
  const c = [['📏', `${r.len} m`, 'len'], ['🏢', `${r.decks} 層`, 'decks'], ['💨', `×${r.spd.toFixed(2)}`, 'spd', (x) => x.toFixed(2)], ['📦', r.cargo, 'cargo'], ['🛡', r.hull, 'hull'], ['🎯', r.fp, 'fp'], ['🔭', r.scout, 'scout'], ['❄️', P(r.cold), 'cold', P], ['🌋', P(r.haz), 'haz', P], ['💱', '+' + P(r.trade), 'trade', P]];
  if (small) c.splice(0, 2, ['🚢', '小船・外觀不變', 'none']);   // 訪客的旗艦是自己的小船：不加長、不加層，只提升數值
  return c.map(([ic, v, k, f]) => `<span class="st" title="${{ none: '訪客的小船不會變大或加層；晉升只提升下面的數值', len: '船長', decks: '甲板層數', spd: '航速倍率', cargo: '載貨（倉庫上限加成）', hull: '船體（裝甲）', fp: '火力（階段④海戰）', scout: '偵察：揭霧半徑', cold: '抗寒：極地耗油 / 減速', haz: '抗特殊海域危害', trade: '貿易加成' }[k]}">${ic} ${v}${d(k, f)}</span>`).join('');
}
const shipName = (hud, row) => { if (!hud.game.small) return row.name; const hs = FL.homeShip(hud.s.fleet); return `${hs ? esc(hs.name) : '小船'}・${row.name}級`; };

function reqHtml(q, picked, up) {
  const rs = q.res.map((r) => `<div class="rq ${r.have >= r.need ? 'ok' : ''}"><span>${r.icon} ${r.name}</span><div class="tb"><u style="width:${Math.min(1, r.have / r.need) * 100}%"></u></div><b>${r.have}/${r.need}</b></div>`).join('');
  const ms = q.mats.map((m) => `<div class="rq ${m.have >= m.need ? 'ok' : ''}"><span>${m.icon} ${m.name}</span><div class="tb"><u style="width:${Math.min(1, m.have / m.need) * 100}%"></u></div><b>${m.have}/${m.need}</b><small>${zonesWith('mat', m.k).map((z) => z.icon + z.name).join('、')}</small></div>`).join('');
  const bp = `<div class="rq ${q.bp.have ? 'ok' : ''}"><span>🗺️ 藍圖</span><div class="bpn">${q.bp.have ? '✓ ' : '🔒 '}${esc(q.bp.name)}</div><small>${q.bp.have ? '' : zonesWith('bp', q.bp.id).map((z) => z.icon + z.name).join('、')}</small></div>`;
  return `<div class="rqs">${rs}${ms}${bp}</div>`;
}

export function renderPromo(hud) {
  const c = hud.modal.querySelector('.mcard'), s = hud.s, now = nowSec(); const st = PM.promoStatus(s, now); const HB = homeBase(hud), SR = (row) => (HB ? PM.smallRow(row, HB) : row); const cur = SR(st.row); const B = PM.BRANCHES;
  const curB = cur.branch ? B[cur.branch] : null;
  const head = `<div class="pm-cur"><div class="pm-ic" style="${curB ? `border-color:${curB.color}` : ''}">${curB ? curB.icon : '🚢'}</div><div class="pm-nm"><b>${shipName(hud, cur)}</b><em>${curB ? `${curB.name} T${cur.tier}` : '基礎船（T0）'}</em><div class="strow">${statChips(cur, null, hud.game.small)}</div></div></div>`;
  const hold = PM.holdOf(s.fleet); const holdH = hold.length ? `<p class="sub pm-hold">🏦 待退回倉庫：${hold.map((x) => `${x.icon}${x.name} ${x.v}`).join('　')}（倉庫有空位就會自動補回，不會損失）</p>` : '';
  let body = '';
  if (st.up) {
    const u = st.up; body = `<div class="pm-up"><h3>🛠 改裝中：${esc(u.row.name)}（${B[u.row.branch].name} T${u.row.tier}）</h3><div class="tb big"><u style="width:${u.frac * 100}%" data-pmprog></u><span data-pmeta>${hm(u.left)}</span></div>
      <p class="sub">旗艦停泊在原地，改裝期間不能出航、不能手動駕駛（艦隊小船不受影響）。完成時間已經固定，離線也會繼續算；${hud.game.small ? '完成後數值提升（小船外觀不變）。' : `完成後船身會變大、多出 ${u.row.decks - cur.decks} 層甲板。`}</p>
      <div class="strow">${statChips(SR(u.row), cur, hud.game.small)}</div></div>`;
  } else {
    const cards = st.options.map((o) => {
      const b = B[o.branch], sel = st.pj && o.to && st.pj.to === o.to;
      if (o.locked) return `<div class="pm-br lock" style="--bc:${b.color}"><div class="bh"><span class="bi">${b.icon}</span><div><b>${b.name}</b><small>${b.blurb}</small></div></div><p class="sub">🔒 ${o.why}</p></div>`;
      const q = o.req, r = q.row;
      const tiers = [1, 2, 3].map((t) => { const R = PM.FLAG_ROWS[`${o.branch}_${t}`]; const have = cur.branch === o.branch && cur.tier >= t; const nxt = R.id === o.to; return `<span class="tr ${have ? 'have' : nxt ? 'next' : ''}" title="${R.hours} 小時改裝">T${t} ${R.name}</span>`; }).join('<i>›</i>');
      const act = sel ? `<button data-a="dep" ${q.resOk ? 'disabled' : ''}>📥 投入資源</button><button class="pri" data-a="start" ${q.ready ? '' : 'disabled'}>🔧 開工（${q.hours} 小時）</button><button data-a="cancel" class="mini" title="取消籌備，投入的資源退回倉庫（放不下的先存在待退回區，有空位就補回）">取消</button>` : `<button class="pri" data-a="plan" data-to="${o.to}">選擇這條路</button>`;
      return `<div class="pm-br ${sel ? 'sel' : ''}" style="--bc:${b.color}" data-to="${o.to}"><div class="bh"><span class="bi">${b.icon}</span><div><b>${b.name}</b><small>${b.blurb}</small></div></div>
        <div class="tiers">${tiers}</div>
        <h4>下一階：${esc(r.name)} <small>${hud.game.small ? '數值提升（小船外觀不變）' : `${r.len} m・${r.decks} 層甲板`}</small></h4><div class="strow">${statChips(SR(r), cur, hud.game.small)}</div>
        <h4>需求 <small>${q.done}/${q.total} 項達成${sel ? '' : '（選定後才能投入資源）'}</small></h4>${reqHtml(q, sel)}
        <div class="pb">${act}</div></div>`;
    }).join('');
    body = `<p class="sub">選一條晉升路線：每一階需要<b>資源 + 稀有藍圖 + 特殊海域材料</b>，開工後改裝 24 / 36 / 48 小時（旗艦停泊）。倉庫放不下整份資源（零件上限 ${PM.capOf(s.fleet, 'parts')}），所以可以<b>分批投入</b>；食物 / 飲水 / 燃料會替船員與航行保留一些。一階一階升，想換分支要先「改裝回基礎船」。</p><div class="pm-grid">${cards}</div>${cur.tier ? `<div class="mb"><button data-a="reset" class="mini">↩︎ 改裝回基礎船（階級歸零，不退費）</button></div>` : ''}`;
  }
  const zl = SZ_ORDER.map((id) => { const z = SPECIAL_ZONES[id]; const ok = PM.meetsNeed(s.fleet, z); return `<span class="zc ${ok ? '' : 'un'}" style="${ok ? `border-color:${z.color};color:${z.color}` : ''}" title="${z.need ? PM.needText(z) : '不需要階級'}">${z.icon}${z.short} ${!z.need ? '自由進出' : ok ? '✓ 可進' : '🔒 ' + PM.needText(z)}${z.need && !z.need.hard ? '（強條件）' : ''}</span>`; }).join('');
  c.innerHTML = `<h2>⭐ 旗艦晉升 <button class="x" data-x="close">✕</button></h2>${head}${holdH}${body}<h3>特殊海域進入條件</h3><div class="zonebar pm-z">${zl}</div><p class="sub">🔒 = 旗艦階級不夠，海圖出航與手動駕駛都進不去（火焰是強條件：可以進，但危害 ×3）。停泊仍會慢慢磨損、風暴也會受損，但船體最低停在 20%（不會沉船）；記得用工坊／零件修。</p>`;
  c.querySelector('[data-x=close]').onclick = () => hud.closeModal();
  const A = (sel, fn) => c.querySelectorAll(sel).forEach((b) => (b.onclick = () => fn(b)));
  A('[data-a=plan]', (b) => { hud.play.promoAct('plan', { to: b.dataset.to }); renderPromo(hud); });
  A('[data-a=dep]', () => { hud.play.promoAct('deposit'); renderPromo(hud); });
  A('[data-a=cancel]', () => { hud.play.promoAct('cancel'); renderPromo(hud); });
  A('[data-a=start]', () => { const r = hud.play.promoAct('start'); renderPromo(hud); if (r && r.ok) hud.ui.toast('🛠 開工！回來看看進度吧'); });
  A('[data-a=reset]', () => { if (confirm('改裝回基礎船？階級會歸零、已用掉的資源不退（籌備中的資源會退回）。')) { hud.play.promoAct('reset'); renderPromo(hud); } });
}
/** 每秒更新倒數條 */
export function livePromo(hud) {
  const c = hud.modal.querySelector('.mcard'), u = c.querySelector('[data-pmprog]'); const st = PM.promoStatus(hud.s, nowSec());
  if (!u) { if (st.up) renderPromo(hud); return; } if (!st.up) { renderPromo(hud); return; }
  u.style.width = st.up.frac * 100 + '%'; c.querySelector('[data-pmeta]').textContent = `剩 ${hm(st.up.left)}`;
}
