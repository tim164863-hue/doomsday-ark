// node tools/save-test.mjs —— 存檔開機邏輯 / 雲端轉接器 / 時鐘防竄改 / 船東判定（用記憶體後端，不連網）
import { bootSave } from '../src/save/boot.js';
import { createMemoryBackend, isOwner, serialize, validateState, CloudAdapter, cloud, OWNER_EMAIL } from '../src/save/cloud.js';
import { clock } from '../src/clock.js';
import * as S from '../src/sim/sim.js';
import { virtualData, VIRTUAL_CREW } from '../src/data.js';
import { sanitizeBoardingStatus } from '../src/api/boarding.js';

let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const mkStore = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m }; };
const now = () => Date.now() / 1000;
const mk = (seed, lastSeen) => { const s = S.newState(seed, lastSeen); s.lastSeen = lastSeen; return s; };
const setup = (opts = {}) => { const be = createMemoryBackend(opts); cloud.backend = be; return be; };
const U = { uid: 'u1', email: 'x@example.com', emailVerified: true };
const put = (be, uid, s, ms) => be.docs.set(uid, { v: 1, data: serialize(s), lastSeen: s.lastSeen, updatedMs: ms || Date.now() });

// 船東判定
ok(isOwner({ uid: 'a', email: OWNER_EMAIL, emailVerified: true }), 'owner by verified email');
ok(isOwner({ uid: 'a', email: OWNER_EMAIL.toUpperCase(), emailVerified: true }), 'owner email case-insensitive');
ok(!isOwner({ uid: 'a', email: OWNER_EMAIL, emailVerified: false }), 'unverified email is not owner');
ok(!isOwner({ uid: 'a', email: 'other@x.com', emailVerified: true }) && !isOwner(null), 'other / null not owner');

// 訪客
{ const st = mkStore(); const b = await bootSave({ cloud: { user: null }, storage: st }); ok(b.mode === 'guest' && !b.owner && b.state === null, 'guest boots empty'); }
{ const st = mkStore(); const be = setup(); const c = { ...cloud, user: U, adapterFor: (u, o) => new CloudAdapter(be, u, o) };
  // 雲端空 + 本機有 → 問，選上傳
  const g = mk(7, now() - 3600); st.setItem('ark.save.v1', JSON.stringify(g));
  let asked = null; const b = await bootSave({ cloud: c, storage: st, choose: async (i) => { asked = i; return 'local'; } });
  ok(asked && asked.cloud === null && asked.local, 'cloud empty + guest save → asks to upload'); ok(b.state.seed === 7 && b.needPush, 'chose local → needPush');
  await b.adapter.save(b.state, { force: true }); ok(be.docs.get('u1') && JSON.parse(be.docs.get('u1').data).seed === 7, 'uploaded to cloud');
  // 再次開機：本機沒變 → 不再問
  asked = null; const b2 = await bootSave({ cloud: c, storage: st, choose: async (i) => { asked = i; return 'cloud'; } }); ok(asked === null && b2.state.seed === 7, 'no re-ask when guest save unchanged');
  // 本機又玩了（lastSeen 較新）→ 兩份都有，newer=local，選雲端
  const g2 = mk(9, now() - 10); st.setItem('ark.save.v1', JSON.stringify(g2)); asked = null;
  const b3 = await bootSave({ cloud: c, storage: st, choose: async (i) => { asked = i; return 'cloud'; } });
  ok(asked && asked.cloud && asked.newer === 'local' && b3.state.seed === 7 && !b3.needPush, 'both exist → choice (newer=local), picked cloud keeps cloud');
  const g3 = mk(11, now() - 5000); st.setItem('ark.save.v1', JSON.stringify(g3)); asked = null;
  await bootSave({ cloud: c, storage: st, choose: async (i) => { asked = i; return 'cloud'; } }); ok(asked && asked.newer === 'cloud', 'older guest save → newer=cloud');
}
// 雲端有、無本機 → 直接載入；mirror 較新 → 用 mirror
{ const st = mkStore(); const be = setup(); const c = { ...cloud, user: U, adapterFor: (u, o) => new CloudAdapter(be, u, o) };
  put(be, 'u1', mk(5, now() - 7200)); const b = await bootSave({ cloud: c, storage: st, choose: async () => { throw new Error('should not ask'); } }); ok(b.state.seed === 5 && !b.needPush, 'cloud only → load, no prompt');
  st.setItem('ark.cache.u1', serialize(mk(6, now() - 100))); const b2 = await bootSave({ cloud: c, storage: st }); ok(b2.state.seed === 6 && b2.needPush, 'newer local mirror wins (unload save lost) → push');
}
// 雲端連不上
{ const st = mkStore(); const be = setup({ fail: true }); const c = { ...cloud, user: U, adapterFor: (u, o) => new CloudAdapter(be, u, o) };
  const b = await bootSave({ cloud: c, storage: st }); ok(b.mode === 'memory' && b.adapter.name === 'memory' && b.notes.includes('no-save'), 'cloud down, no mirror → memory adapter (never overwrite cloud)');
  st.setItem('ark.cache.u1', serialize(mk(3, now() - 60))); const b2 = await bootSave({ cloud: c, storage: st }); ok(b2.mode === 'mirror' && b2.state.seed === 3 && !b2.adapter.canWrite, 'cloud down + mirror → mirror, no cloud writes');
  const lastSeen = b2.state.lastSeen; clock.syncUnverified(lastSeen); ok(clock.now() <= lastSeen + 1801, 'unsynced clock caps offline credit at 30 min');
}
// 時鐘竄改：裝置時鐘快 1 天，伺服器正常
{ const st = mkStore(); const be = setup({ skewMs: -86400000 }); const c = { ...cloud, user: U, adapterFor: (u, o) => new CloudAdapter(be, u, o) };
  const serverNow = (Date.now() - 86400000) / 1000; put(be, 'u1', mk(5, serverNow - 600), Date.now() - 86400000);
  const b = await bootSave({ cloud: c, storage: st }); ok(clock.mode === 'server' && clock.synced, 'clock synced to server'); ok(Math.abs(clock.now() - serverNow) < 5, 'game clock follows server, not device (device +1d)');
  const t0 = clock.now(); await new Promise((r) => setTimeout(r, 30)); ok(clock.now() - t0 < 1, 'clock advances smoothly');
  const away = clock.now() - b.state.lastSeen; ok(away > 590 && away < 620, 'catch-up uses server time (~10 min), not +1 day');
  // 新帳號、裝置時鐘錯很多：寫入後讀回 skew
  const be2 = setup({ skewMs: 3 * 3600 * 1000 }); const c2 = { ...cloud, user: { ...U, uid: 'u2' }, adapterFor: (u, o) => new CloudAdapter(be2, u, o) };
  const b2 = await bootSave({ cloud: c2, storage: mkStore() }); ok(b2.state === null && b2.adapter.canWrite, 'new account → no state yet');
  await b2.adapter.save(S.newState(1, now()), { force: true }); ok(clock.synced && Math.abs(clock.skew - 3 * 3600) < 5, 'first write reveals server skew (+3h)');
}
// 節流
{ const be = setup(); const a = new CloudAdapter(be, 'u3', { storage: mkStore(), minGap: 200 }); a.canWrite = true; const s = mk(1, now());
  await a.save(s, { force: true }); a.save(s); a.save(s); a.save(s); ok(be.calls.set === 1, 'writes throttled within min gap'); await new Promise((r) => setTimeout(r, 320)); ok(be.calls.set === 2, 'trailing flush after gap (coalesced)');
  const be2 = setup({ fail: true }); const a2 = new CloudAdapter(be2, 'u4', { storage: mkStore(), minGap: 0 }); a2.canWrite = true; await a2.save(s, { force: true }); ok(a2.status === 'error' && a2.dirty, 'failed write marks dirty/error, retried later');
}
// 驗證 / 大小
ok(validateState({ v: 1 }) === null && validateState(null) === null, 'validateState rejects junk');
{ const s = mk(1, now()); s.log = Array.from({ length: 500 }, (_, i) => ({ t: i, type: 'x', text: '很長的紀錄'.repeat(30) })); const j = serialize(s); ok(j.length <= 100000 && JSON.parse(j).log.length <= 60, 'serialize trims log (' + j.length + ' chars)'); ok(serialize(S.newState(1, now())).length < 20000, 'typical save is small'); }
// 虛擬船員 / 清除殘留
{ const d = virtualData(Date.now()); ok(d.crew.length === VIRTUAL_CREW.length && d.arena === null && d.crew.every((c) => c.virtual), 'virtual crew: no arena, all virtual'); ok(JSON.stringify(virtualData(1e12)) === JSON.stringify(virtualData(1e12)), 'virtual crew deterministic');
  const s = S.newState(1, now()); S.syncCrew(s, [{ key: '最高級打工仔', cat: 'work' }, { key: '0xcat', cat: 'rest' }], now()); s.crew['0xcat'].away = 1;
  S.syncCrew(s, d.crew.map((c) => ({ key: c.key, cat: c.cat })), now()); ok(!s.crew['最高級打工仔'] && s.crew['0xcat'] && s.crew['舵手小艾'], 'syncCrew prunes stale names but keeps crew on a trip'); }
{ ok(sanitizeBoardingStatus({ name: '<b>x</b>', cat: 'work', secret: 'k' }) && !('secret' in sanitizeBoardingStatus({ name: 'x', cat: 'work', secret: 'k' })), 'boarding status sanitized (unknown fields dropped)'); ok(sanitizeBoardingStatus({ name: 'x', cat: 'hack' }) === null, 'boarding rejects bad cat'); }
console.log(fails ? `\n${fails} FAILED` : '\n全部通過'); process.exit(fails ? 1 : 0);
