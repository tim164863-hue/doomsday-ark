// 階段⑤ PvP 的 Firestore 規則：本機模擬器測試（不碰任何真實 Firebase 專案、不部署）。
// 用法：cd tools/rules-emulator && npm i && PATH=<jre>/bin:$PATH npx firebase emulators:exec --only firestore --project demo-ark-rules 'node rules.test.mjs'
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app'; import 'firebase/compat/firestore';
const rules = readFileSync(new URL('../../firestore.pvp.rules', import.meta.url), 'utf8');
const OWNER = '7yB5MDDkd3bymKEDHczUyb3buK63';
const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8089').split(':');
const env = await initializeTestEnvironment({ projectId: 'demo-ark-rules', firestore: { rules, host, port: +port } });
let pass = 0, fail = 0; const bad = [];
const t = async (name, p, want = true) => { try { await (want ? assertSucceeds(p) : assertFails(p)); pass++; console.log('  ✓', (want ? 'ALLOW ' : 'DENY  ') + name); } catch (e) { fail++; bad.push(name); console.log('  ✗', (want ? 'ALLOW ' : 'DENY  ') + name, '→', String(e.message || e).slice(0, 160)); } };
const ok = (n, p) => t(n, p, true), no = (n, p) => t(n, p, false);
const now = () => Math.floor(Date.now() / 1000);
const BUCKET = 21600;
const pub = (o = {}) => { const n = now(); return { v: 1, h: '船#A1B2', x: 500, y: 500, fp: 8, hl: 400, cd: 100, res: { food: 300, water: 300, fuel: 300, parts: 300 }, cap: 30, sh: 0, ls: n, t: n, cells: ['5_5'], ...o }; };
const raid = (att, o = {}) => { const n = now(); return { v: 1, attacker: att, defender: 'dd', b: Math.floor(n / BUCKET), t: n, ah: '船#C3D4', loot: { food: 24, water: 24, fuel: 24, parts: 24 }, ap: { x: 480, y: 490 }, ...o }; };
const ctx = (u) => env.authenticatedContext(u).firestore(); const anon = () => env.unauthenticatedContext().firestore();
const seed = (fn) => env.withSecurityRulesDisabled(async (c) => fn(c.firestore()));
const reset = async () => { await env.clearFirestore(); };
const P = (db, u) => db.collection('presence').doc(u);
const R = (db, def, id) => db.collection('raids').doc(def).collection('in').doc(id);
const SV = () => firebase.firestore.FieldValue.serverTimestamp();
const idOf = (att, b) => `${att}_${b ?? Math.floor(now() / BUCKET)}`;
const withBig = (n) => 'x'.repeat(n);

console.log('\n[1] presence — 建立 / 更新（第 1 項：create 時 resource 是 null）');
await reset();
await ok('第一次建立 presence（本人、合法文件）成功', P(ctx('aa'), 'aa').set(pub()));
await ok('第一次建立（帶合法 rt 航線）成功', P(ctx('rt1'), 'rt1').set(pub({ rt: { x0: 100, y0: 100, x1: 300, y1: 200, t0: now(), t1: now() + 600 }, cells: ['1_1', '2_1', '3_2'] })));
await seed((db) => P(db, 'old').set(pub({ t: now() - 60, ls: now() - 60 })));
await ok('更新自己的 presence（距離上次寫入 ≥ 10 秒）成功', P(ctx('old'), 'old').set(pub({ x: 520 })));
await seed((db) => P(db, 'fresh').set(pub({ t: now() - 1, ls: now() - 1 })));
await no('更新太頻繁（< 10 秒）被擋', P(ctx('fresh'), 'fresh').set(pub({ x: 520 })));
await no('寫別人的 presence 被擋', P(ctx('bb'), 'aa').set(pub()));
await no('未登入寫 presence 被擋', P(anon(), 'zz').set(pub()));
await no('船東 uid 不得建立 presence（船東不公開）', P(ctx(OWNER), OWNER).set(pub()));
await ok('本人可以刪自己的 presence', P(ctx('aa'), 'aa').delete());
await no('別人不能刪我的 presence', (async () => { await seed((db) => P(db, 'keep').set(pub())); return P(ctx('bb'), 'keep').delete(); })());

console.log('\n[2] presence — 欄位驗證（第 3 項：不能存 1MB 字串）');
await reset();
const bads = {
  'h = 1MB 字串': pub({ h: withBig(900000) }), 'h 超過 12 字': pub({ h: withBig(13) }), 'h 空字串': pub({ h: '' }), 'h 不是字串': pub({ h: 5 }),
  'x 是字串': pub({ x: '500' }), 'x 超出地圖 (>2000)': pub({ x: 5000 }), 'y 負數': pub({ y: -1 }), 'fp 超過 200': pub({ fp: 999 }), 'hl 超過 5000': pub({ hl: 1e9 }), 'hl 是字串': pub({ hl: withBig(1000) }),
  'cd 超過 100': pub({ cd: 101 }), 'cd 負數': pub({ cd: -5 }), 'cap 超過 1000': pub({ cap: 1001 }), 'v = 2': pub({ v: 2 }), 'v 缺少': (() => { const d = pub(); delete d.v; return d; })(),
  '多餘欄位 (junk)': pub({ junk: 1 }), '多餘欄位 (1MB junk)': pub({ junk: withBig(900000) }), '缺少 res': (() => { const d = pub(); delete d.res; return d; })(),
  'res.food 是字串': pub({ res: { food: 'a', water: 1, fuel: 1, parts: 1 } }), 'res.food = 5000': pub({ res: { food: 5000, water: 1, fuel: 1, parts: 1 } }), 'res 多一種 (gold)': pub({ res: { food: 1, water: 1, fuel: 1, parts: 1, gold: 1 } }), 'res 缺 parts': pub({ res: { food: 1, water: 1, fuel: 1 } }), 'res.fuel 負數': pub({ res: { food: 1, water: 1, fuel: -1, parts: 1 } }),
  't 太舊（現在 − 1000 秒）': pub({ t: now() - 1000, ls: now() - 1000 }), 't 在未來（+1000 秒）': pub({ t: now() + 1000 }), 'ls 超過 t（未來）': pub({ ls: now() + 500 }), 'ls 比 t 早超過一天': pub({ ls: now() - 200000 }), 'ls 是字串': pub({ ls: 'now' }), 't 是字串': pub({ t: withBig(500) }),
  'cells 17 個': pub({ cells: Array.from({ length: 17 }, (_, i) => `${i}_1`) }), 'cells 空陣列': pub({ cells: [] }), 'cells 元素是數字': pub({ cells: [5] }), 'cells 元素 1MB 字串': pub({ cells: [withBig(900000)] }), 'cells 元素格式錯': pub({ cells: ['abc'] }), 'cells 後段元素壞掉': pub({ cells: ['1_1', '2_2', 3, '4_4'] }), 'cells 不是陣列': pub({ cells: '5_5' }),
};
for (const [n, d] of Object.entries(bads)) await no('create 被擋：' + n, P(ctx('bad'), 'bad').set(d));
await ok('cells 剛好 16 個合法元素可以', P(ctx('c16'), 'c16').set(pub({ cells: Array.from({ length: 16 }, (_, i) => `${i}_${i}`) })));
const rtBad = { 'rt 多餘欄位': { x0: 1, y0: 1, x1: 2, y1: 2, t0: now(), t1: now() + 5, z: 1 }, 'rt 座標是字串': { x0: '1', y0: 1, x1: 2, y1: 2, t0: now(), t1: now() + 5 }, 'rt 座標超出地圖': { x0: 9999, y0: 1, x1: 2, y1: 2, t0: now(), t1: now() + 5 }, 'rt 缺 t1': { x0: 1, y0: 1, x1: 2, y1: 2, t0: now() }, 'rt 是 1MB 字串': withBig(900000), 'rt t1 < t0': { x0: 1, y0: 1, x1: 2, y1: 2, t0: now() + 100, t1: now() }, 'rt t1 在遙遠的未來': { x0: 1, y0: 1, x1: 2, y1: 2, t0: now(), t1: now() + 1e9 } };
for (const [n, rt] of Object.entries(rtBad)) await no('create 被擋：' + n, P(ctx('bad'), 'bad').set(pub({ rt })));

console.log('\n[3] presence — 護盾上限（第 5 項：沒有永久護盾）');
await ok('sh = 現在 + 12 小時 可以', P(ctx('s1'), 's1').set(pub({ sh: now() + 43200 })));
await ok('sh = 0 可以', P(ctx('s2'), 's2').set(pub({ sh: 0 })));
await no('sh = 現在 + 13 小時 被擋', P(ctx('s3'), 's3').set(pub({ sh: now() + 46800 })));
await no('永久護盾 sh = 1e11 被擋', P(ctx('s4'), 's4').set(pub({ sh: 1e11 })));
await no('sh 是字串 被擋', P(ctx('s5'), 's5').set(pub({ sh: 'forever' })));
await no('sh 負數 被擋', P(ctx('s6'), 's6').set(pub({ sh: -1 })));
await seed((db) => P(db, 's7').set(pub({ t: now() - 60 })));
await no('更新成永久護盾 被擋', P(ctx('s7'), 's7').set(pub({ sh: 4e9 })));

console.log('\n[4] presence — 讀取（第 4 項：get / list 分開，list limit ≤ 24）');
await reset(); await seed((db) => Promise.all(['p1', 'p2', 'p3'].map((u) => P(db, u).set(pub({ cells: ['5_5'] })))));
const q = (db, n) => { let x = db.collection('presence').where('cells', 'array-contains-any', ['5_5', '5_6', '4_5']); if (n != null) x = x.limit(n); return x.get(); };
await ok('單篇 get（已登入）成功', P(ctx('aa'), 'p1').get());
await no('單篇 get（未登入）被擋', P(anon(), 'p1').get());
await ok('list limit 24 成功', q(ctx('aa'), 24));
await ok('list limit 1 成功', q(ctx('aa'), 1));
await no('list limit 25 被擋', q(ctx('aa'), 25));
await no('list limit 1000 被擋', q(ctx('aa'), 1000));
await no('list 沒帶 limit 被擋', q(ctx('aa'), null));
await no('list（未登入）被擋', q(anon(), 24));

console.log('\n[5] raids — 合法建立與基本防護');
const mk = async (o = {}) => { await reset(); await seed(async (db) => { await P(db, 'dd').set(pub({ x: 500, y: 500, ls: now() - 3600, t: now() - 3600, sh: 0, ...(o.def || {}) })); if (o.att !== null) await P(db, 'aa').set(pub({ x: 470, y: 480, ...(o.att || {}) })); }); };
await mk();
const A = ctx('aa');
await ok('合法突襲文件 create 成功', R(A, 'dd', idOf('aa')).set(raid('aa')));
await no('同一個 id 再 create 一次（重複）被擋', R(A, 'dd', idOf('aa')).set(raid('aa')));
await no('update 已存在的突襲文件被擋', R(A, 'dd', idOf('aa')).update({ 'loot.food': 1 }));
await no('delete 突襲文件被擋', R(A, 'dd', idOf('aa')).delete());
await no('防守者本人也不能改 / 刪突襲文件', R(ctx('dd'), 'dd', idOf('aa')).delete());
await mk();
await no('用別人的名義建立（attacker ≠ auth）被擋', R(ctx('bb'), 'dd', idOf('aa')).set(raid('aa')));
await no('未登入建立被擋', R(anon(), 'dd', idOf('aa')).set(raid('aa')));
await no('船東 uid 不能當攻擊者', R(ctx(OWNER), 'dd', idOf(OWNER)).set(raid(OWNER)));
await no('自己打自己被擋', R(ctx('dd'), 'dd', idOf('dd')).set(raid('dd', { defender: 'dd' })));
await no('文件裡的 defender 與路徑不同被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { defender: 'ee' })));
await no('id 不是 attacker_bucket 被擋', R(A, 'dd', 'whatever').set(raid('aa')));
await no('b 與 t 不符（桶算錯）被擋', R(A, 'dd', idOf('aa', Math.floor(now() / BUCKET) + 1)).set(raid('aa', { b: Math.floor(now() / BUCKET) + 1 })));
await no('t 離伺服器時間太遠（−1000 秒）被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { t: now() - 1000 })));
await no('t 在未來（+1000 秒）被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { t: now() + 1000 })));

console.log('\n[6] raids — 戰利品上限（第 2、3 項：四種資源都檢查）');
await mk({ def: { res: { food: 300, water: 300, fuel: 300, parts: 300 }, cap: 30 } });
for (const k of ['food', 'water', 'fuel', 'parts']) {
  await no(`${k} 超過 cap(30) 被擋`, R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { [k]: 31 } })));
  await no(`${k} 超過 8% 被擋（庫存 300 → 上限 24，宣稱 25）`, R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { [k]: 25 } })));
}
await no('四種各超過 cap 被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: 31, water: 31, fuel: 31, parts: 31 } })));
await no('只有 water 超過（其他合法）被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: 10, water: 31, fuel: 10, parts: 10 } })));
await no('只有 parts 超過（其他合法）被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: 10, water: 10, fuel: 10, parts: 31 } })));
await no('戰利品是小數 被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: 1.5 } })));
await no('戰利品是負數 被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: -1 } })));
await no('戰利品是字串 被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: '10' } })));
await no('戰利品多一種 (gold) 被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: 1, gold: 1 } })));
await no('loot 不是 map 被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: 'all' })));
await ok('只搶一種（food 24 = 8%）成功', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: 24 } })));
await mk({ def: { res: { food: 2000, water: 2000, fuel: 2000, parts: 2000 }, cap: 1000 } });
await no('單項 > 400 被擋（庫存與 cap 都夠大）', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: 401 } })));
await no('單項 160 以上超過 8%（庫存 2000 → 160）：161 被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: 161 } })));
await ok('單項 160（= 8% of 2000）成功', R(A, 'dd', idOf('aa')).set(raid('aa', { loot: { food: 160 } })));

console.log('\n[7] raids — 欄位驗證（第 3 項）');
await mk();
const rb = {
  'v = 2': raid('aa', { v: 2 }), 'v 是字串': raid('aa', { v: '1' }), 'v 缺少': (() => { const d = raid('aa'); delete d.v; return d; })(),
  'ah 13 字': raid('aa', { ah: withBig(13) }), 'ah 1MB 字串': raid('aa', { ah: withBig(900000) }), 'ah 不是字串': raid('aa', { ah: 7 }), 'ah 缺少': (() => { const d = raid('aa'); delete d.ah; return d; })(),
  'ap 多餘欄位': raid('aa', { ap: { x: 480, y: 490, z: 1 } }), 'ap x 是字串': raid('aa', { ap: { x: '480', y: 490 } }), 'ap 缺 y': raid('aa', { ap: { x: 480 } }), 'ap 不是 map': raid('aa', { ap: 'here' }), 'ap 超出地圖': raid('aa', { ap: { x: 9e9, y: 1 } }), 'ap 缺少': (() => { const d = raid('aa'); delete d.ap; return d; })(),
  '多餘欄位 junk': raid('aa', { junk: 1 }), '多餘欄位 1MB junk': raid('aa', { junk: withBig(900000) }), 'b 是小數': raid('aa', { b: 1.5 }), 't 是字串': raid('aa', { t: 'x' }),
};
for (const [n, d] of Object.entries(rb)) await no('create 被擋：' + n, R(A, 'dd', idOf('aa')).set(d));

console.log('\n[8] raids — 與雙方 presence 比對（第 1、5 項）');
await mk(); await no('宣稱座標離防守者太遠（ap = 900,900）被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { ap: { x: 900, y: 900 } })));
await mk(); await ok('ap 在邊際內（防守者 500,500；ap 620,500 ≤ 140 且貼近攻擊者）成功', (async () => { await seed((db) => P(db, 'aa').set(pub({ x: 600, y: 500 }))); return R(ctx('aa'), 'dd', idOf('aa')).set(raid('aa', { ap: { x: 620, y: 500 } })); })());
await mk(); await no('ap 離防守者 141 被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { ap: { x: 641, y: 500 } })));
await mk({ att: null }); await no('攻擊者沒有 presence 被擋', R(A, 'dd', idOf('aa')).set(raid('aa')));
await mk({ att: { t: now() - 3600, ls: now() - 3600 } }); await no('攻擊者的 presence 過期（1 小時前）被擋', R(A, 'dd', idOf('aa')).set(raid('aa')));
await mk({ att: { t: now() - 600, ls: now() - 600 } }); await ok('攻擊者的 presence 10 分鐘前（≤ 15 分鐘）成功', R(A, 'dd', idOf('aa')).set(raid('aa')));
await mk({ att: { x: 100, y: 100 } }); await no('攻擊者 presence 位置離防守者很遠（100,100 vs 500,500）被擋', R(A, 'dd', idOf('aa')).set(raid('aa')));
await mk({ att: { x: 100, y: 100 } }); await no('攻擊者 presence 很遠、但 ap 偽報在目標旁邊 被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { ap: { x: 505, y: 505 } })));
await mk({ att: { x: 400, y: 420 } }); await no('ap 離攻擊者自己的 presence 太遠（ap 在目標旁、但離攻擊者 presence > 140）被擋', R(A, 'dd', idOf('aa')).set(raid('aa', { ap: { x: 545, y: 590 } })));

console.log('\n[9] raids — 防守者狀態（離線 / 護盾 / 存在）');
await mk({ def: { ls: now() - 100, t: now() - 100 } }); await no('防守者還在線（ls 100 秒前）被擋', R(A, 'dd', idOf('aa')).set(raid('aa')));
await mk({ def: { ls: now() - 599 } }); await no('防守者離線不到 10 分鐘（599 秒）被擋', R(A, 'dd', idOf('aa')).set(raid('aa')));
await mk({ def: { sh: now() + 3000 } }); await no('防守者有護盾 被擋', R(A, 'dd', idOf('aa')).set(raid('aa')));
await mk(); await no('防守者沒有 presence（例如船東 / 訪客）被擋', R(A, 'ghost', idOf('aa')).set(raid('aa', { defender: 'ghost' })));
await mk(); await no('防守者是船東 uid（沒有 presence）被擋', R(A, OWNER, idOf('aa')).set(raid('aa', { defender: OWNER })));

console.log('\n[10] raids — 讀取');
await mk(); await seed((db) => R(db, 'dd', 'aa_1').set(raid('aa')));
const inbox = (db, def, n) => { let x = db.collection('raids').doc(def).collection('in').where('t', '>=', 0); if (n != null) x = x.limit(n); return x.get(); };
await ok('防守者讀自己的收件匣 limit 60 成功', inbox(ctx('dd'), 'dd', 60));
await no('防守者收件匣 limit 61 被擋', inbox(ctx('dd'), 'dd', 61));
await no('防守者收件匣沒帶 limit 被擋', inbox(ctx('dd'), 'dd', null));
await no('別人讀 dd 的收件匣被擋', inbox(ctx('aa'), 'dd', 24));
await no('未登入讀收件匣被擋', inbox(anon(), 'dd', 24));
await ok('攻擊者 get 自己送出的那一份 成功', R(ctx('aa'), 'dd', 'aa_1').get());
await ok('防守者 get 那一份 成功', R(ctx('dd'), 'dd', 'aa_1').get());
await no('第三者 get 那一份 被擋', R(ctx('bb'), 'dd', 'aa_1').get());

console.log('\n[11] 跨使用者寫入（arks / presence 永遠只有本人）');
await reset(); await seed((db) => db.collection('arks').doc('aa').set({ v: 1, data: '{"a":1}', lastSeen: 1, updatedAt: new Date() }));
const ark = { v: 1, data: '{"a":1}', lastSeen: 1 };
await ok('本人寫自己的 arks/{uid}（既有規則）成功', ctx('aa').collection('arks').doc('aa').set({ ...ark, updatedAt: SV() }));
await no('別人寫 arks/{uid} 被擋', ctx('bb').collection('arks').doc('aa').set({ ...ark, updatedAt: SV() }));
await no('別人讀 arks/{uid} 被擋', ctx('bb').collection('arks').doc('aa').get());
await no('別人刪 arks/{uid} 被擋', ctx('bb').collection('arks').doc('aa').delete());
await no('別人寫 presence/{uid} 被擋', P(ctx('bb'), 'aa').set(pub()));
await no('別人 update presence/{uid} 被擋', (async () => { await seed((db) => P(db, 'aa').set(pub({ t: now() - 60 }))); return P(ctx('bb'), 'aa').update({ sh: 0 }); })());
await no('攻擊者不能把突襲文件寫進自己以外的路徑（寫到別人的 arks 子集合）', ctx('aa').collection('arks').doc('dd').collection('x').doc('y').set({ a: 1 }));
await no('其他集合一律拒絕（junk/anything）', ctx('aa').collection('junk').doc('x').set({ a: 1 }));
await no('presence 底下子集合一律拒絕', ctx('aa').collection('presence').doc('aa').collection('sub').doc('x').set({ a: 1 }));

await env.cleanup();
console.log(`\nrules-emulator: ${pass + fail} cases, ${pass} passed, ${fail} failed`); if (fail) console.log('FAILED:', bad.join(' | ')); process.exit(fail ? 1 : 0);
