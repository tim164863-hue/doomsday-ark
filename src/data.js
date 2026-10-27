import { emit } from './events.js';
import { hash, mulberry32 } from './sim/rng.js';

/** 唯讀資料來源：只 GET 公開的 sessions.json（辦公室既有輸出，已淨化），不會對 bot 送出任何東西。 */
export const DATA_URL = 'https://tim164863-hue.github.io/grokbot-office/sessions.json';
const WORKING = new Set(['thinking', 'tool', 'typing', 'waiting', 'error']);

/** 把原始 sessions.json 轉成遊戲用的精簡資料（只留名稱 / 狀態 / 類型 / 權益數字）。 */
export function normalize(raw) {
  const now = raw.now || raw.generatedAt || Date.now();
  const arena = raw.arena && Array.isArray(raw.arena.traders) ? {
    updated: raw.arena.updated || now,
    traders: raw.arena.traders.map((t) => ({ name: String(t.name), start: +t.start || 100, equity: +t.equity || 0, series: Array.isArray(t.series) ? t.series.filter((p) => Array.isArray(p)).map((p) => [+p[0], +p[1]]).slice(-160) : [] })),
  } : null;
  const crew = [];
  for (const s of raw.sessions || []) {
    if (s.subagent) continue;
    const title = String(s.title || s.project || s.agent || '?').slice(0, 24);
    const kind = (s.bot && s.bot.kind) || 'other';
    const status = String(s.status || 'idle');
    const last = +s.lastEventAt || +s.turnStartedAt || now; const ageMin = Math.max(0, (now - last) / 60000);
    let cat;
    if (WORKING.has(status)) cat = 'work';
    else if ((status === 'idle' && ageMin < 30) || ((status === 'done' || status === 'interrupted') && ageMin < 90)) cat = 'rest';
    else cat = 'off';
    const info = { key: title, title, kind, status, cat, ageMin, error: status === 'error', since: +s.turnStartedAt || last };
    if (kind === 'trader' && arena) {
      const t = arena.traders.find((x) => x.name === title);
      if (t) {
        info.equity = t.equity; info.start = t.start; info.pnl = (t.equity - t.start) / t.start * 100;
        const m = /(\d+)\s*倉/.exec(String(s.activity || '')); info.pos = m ? +m[1] : null;
      }
    }
    crew.push(info);
  }
  return { now, crew, arena, offline: false };
}

/** 虛擬船員（非船東帳號 / 訪客）：通用名字，狀態依裝置本地時段 + 時間桶決定（確定性），完全不含任何真實 bot / 交易資料。 */
export const VIRTUAL_CREW = [['舵手小艾', 'manager'], ['工程師阿鐵', 'other'], ['廚師小米', 'other'], ['醫護小安', 'research'], ['甲板長阿浪', 'other'], ['研究員小星', 'research']];
export function virtualData(nowMs = Date.now(), offline = false) {
  const h = new Date(nowMs).getHours(); const bucket = Math.floor(nowMs / (25 * 60000));
  const pWork = h >= 9 && h < 19 ? 0.62 : h >= 19 && h < 24 ? 0.3 : 0.1, pRest = h >= 9 && h < 24 ? 0.28 : 0.12;
  const crew = VIRTUAL_CREW.map(([title, kind], i) => {
    const r = mulberry32(hash('virt', i, bucket))(); const cat = r < pWork ? 'work' : r < pWork + pRest ? 'rest' : 'off';
    return { key: title, title, kind, status: cat === 'work' ? 'tool' : cat === 'rest' ? 'done' : 'idle', cat, ageMin: cat === 'rest' ? 12 : 600, since: nowMs - 600000, virtual: true };
  });
  return { now: nowMs, crew, arena: null, offline, demo: false, virtual: true };
}

const DEMO_NAMES = [['最高級打工仔', 'manager'], ['交易員-1', 'trader'], ['交易員-2', 'trader'], ['0xcat', 'research'], ['策略研究員', 'research'], ['鏈上獵手', 'research']];
export function demoData(tick = 0, cycle = false) {
  const now = Date.now();
  const arena = { updated: now, traders: [['交易員-1', 0], ['交易員-2', 1]].map(([name, i]) => { const series = []; let v = 100; for (let k = 0; k < 80; k++) { v += Math.sin(k * 0.3 + i * 2) * 1.6 + Math.cos(k * 0.11 + i) * 1.1 - 0.05; series.push([now - (80 - k) * 900000, v]); } return { name, start: 100, equity: v, series }; }) };
  const cats = ['work', 'rest', 'off'];
  const crew = DEMO_NAMES.map(([title, kind], i) => {
    const cat = cycle ? cats[(Math.floor(tick) + i) % 3] : ['work', 'work', 'work', 'rest', 'rest', 'off'][i];
    const t = arena.traders.find((x) => x.name === title);
    return { key: title, title, kind, status: cat === 'work' ? 'tool' : cat === 'rest' ? 'done' : 'idle', cat, ageMin: cat === 'rest' ? 12 : 600, since: now - 600000, ...(t ? { equity: t.equity, start: 100, pnl: t.equity - 100, pos: 1 } : {}) };
  });
  return { now, crew, arena, offline: true, demo: true };
}

export class DataSource {
  constructor(opts = {}) {
    this.url = opts.url || DATA_URL; this.every = opts.every || 45000; this.data = null; this.lastOk = 0; this.mode = opts.mode || 'live'; this.demoTick = 0;
    this.listeners = [];
  }
  onData(fn) { this.listeners.push(fn); }
  push(d) { this.data = d; for (const f of this.listeners) f(d); emit('data', d); }
  async fetchOnce() {
    try {
      const r = await fetch(this.url + '?t=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) throw new Error('http ' + r.status);
      const raw = await r.json(); this.lastOk = Date.now(); this.push(normalize(raw)); return true;
    } catch (e) {
      if (!this.data) this.push(virtualData(Date.now(), true));
      else if (Date.now() - this.lastOk > 5 * 60000 && !this.data.offline) this.push({ ...this.data, offline: true });
      return false;
    }
  }
  start() {
    if (this.mode === 'cycle') { this.push(demoData(0, true)); setInterval(() => { this.demoTick++; this.push(demoData(this.demoTick, true)); }, 30000); return; }
    if (this.mode === 'virtual') { this.push(virtualData()); setInterval(() => this.push(virtualData()), 60000); return; }
    if (this.mode === 'demo') { this.push(demoData(0, false)); return; }
    this.fetchOnce(); setInterval(() => this.fetchOnce(), this.every);
  }
}
