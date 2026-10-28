// 角色資料庫 / 隨機船員 / 小船無桌子 測試：node tools/chars-test.mjs
import { CHARS, CHAR_IDS, MODELS, OWNER_MODEL, charById, isChar, randomChar, lookOf, sanitizePl, crewSpec } from '../src/crew/characters.js';
import { buildHome, HOME_TYPES } from '../src/ship/homespec.js';
import { validateState } from '../src/save/cloud.js';
import { newState } from '../src/sim/sim.js';
import { virtualData } from '../src/data.js';
import { mulberry32 } from '../src/sim/rng.js';
import { recolorPixels } from '../src/crew/avatar.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };

// --- 資料庫
ok(CHARS.length === 10, '角色資料庫有 10 位');
ok(new Set(CHAR_IDS).size === 10 && new Set(CHARS.map((c) => c.name)).size === 10, 'id / 名字都不重複');
ok(CHARS.every((c) => !/T董/.test(c.name) && c.id !== 'T董' && !/T董/.test(c.blurb)), '資料庫裡沒有 T董');
ok(CHARS.every((c) => MODELS.includes(c.look.model) && c.look.model !== OWNER_MODEL), '全部用現有模型，且不是 T董 的基底模型 (male-d)');
const sig = (c) => JSON.stringify([c.look.model, c.look.acc, c.look.col, c.look.ac]);
ok(new Set(CHARS.map(sig)).size === 10, '每位的 模型 / 配件 / 換色 組合都不同');
ok(new Set(CHARS.map((c) => c.look.model)).size >= 9, '至少 9 種不同的基底模型 (' + new Set(CHARS.map((c) => c.look.model)).size + ')');
ok(CHARS.every((c) => c.tag && c.blurb && c.look.acc.length >= 1), '每位都有圖示 / 簡介 / 至少一件配件');
ok(isChar('sailor') && !isChar('T董') && !isChar('owner') && !isChar(null) && !isChar(5), 'isChar 只認資料庫 id（不認 T董）');
ok(lookOf('T董') === CHARS[0].look && lookOf(undefined) === CHARS[0].look && charById('zzz') === null, '不認得的 id → 退回第一位角色，絕不是 T董');

// --- 隨機分配
{ const r = mulberry32(7); const seen = new Set(); for (let i = 0; i < 400; i++) { const c = randomChar(r); if (!isChar(c)) ok(false, 'randomChar 回傳不合法 ' + c); seen.add(c); }
  ok(seen.size === 10, '隨機分配 400 次 → 10 位都會被抽到'); ok(randomChar(() => 0.9999999) === CHAR_IDS[9] && randomChar(() => 0) === CHAR_IDS[0], 'randomChar 邊界值'); }
{ const a = sanitizePl({ c: 'diver', s: 123 }); ok(a.c === 'diver' && a.s === 123, 'sanitizePl 保留合法值');
  const b = sanitizePl({ c: 'T董', s: 'x' }); ok(isChar(b.c) && b.c !== 'T董' && Number.isFinite(b.s), 'sanitizePl：T董 / 壞值 → 補成合法的資料庫角色');
  ok(isChar(sanitizePl(null).c) && isChar(sanitizePl(undefined).c) && isChar(sanitizePl('hi').c), 'sanitizePl：null / 字串也能處理'); }

// --- 存檔相容（SAVE_VERSION 不變、pl 是可選欄位）
{ const s = newState(1, 1e6); ok(s.v === 1 && !('pl' in s), '新存檔沒有 pl 也合法（舊存檔相容）'); ok(validateState({ ...s }) !== null, '沒有 pl 的存檔通過驗證');
  const g = validateState({ ...s, pl: { c: 'singer', s: 99 } }); ok(g && g.pl.c === 'singer' && g.pl.s === 99, '合法 pl 保留');
  const bad = validateState({ ...s, pl: { c: 'T董', s: 5 } }); ok(bad && !('pl' in bad), '存檔裡的 pl.c = T董 → 被丟掉（之後重新隨機）');
  const bad2 = validateState({ ...s, pl: 'x' }); ok(bad2 && !('pl' in bad2), '壞的 pl 被丟掉'); }

// --- 隨機船員
{ const cnt = { 0: 0, 1: 0, 2: 0, 3: 0 }; let allOk = true, uniq = true, det = true, ban = true, looks = true;
  for (let seed = 1; seed < 3000; seed += 7) {
    const a = crewSpec(seed, 8, ['水手阿浪']); cnt[a.length]++;
    if (a.length < 2 || a.length > 3) allOk = false;
    if (new Set(a.map((c) => c.title)).size !== a.length) uniq = false;
    if (JSON.stringify(a) !== JSON.stringify(crewSpec(seed, 8, ['水手阿浪']))) det = false;
    if (a.some((c) => c.title === '水手阿浪')) ban = false;
    if (a.some((c) => !MODELS.includes(c.look.model) || c.look.model === OWNER_MODEL || !c.title || /T董/.test(c.title))) looks = false;
  }
  ok(allOk && cnt[2] > 0 && cnt[3] > 0, `船員人數一律 2–3 位（2 位 ${cnt[2]} 次、3 位 ${cnt[3]} 次）`);
  ok(uniq, '同一艘船的船員名字不重複'); ok(det, '同一個種子 → 同樣的船員（確定性）'); ok(ban, '不會跟玩家角色重名'); ok(looks, '船員用現有模型、不是 T董 臉');
  ok(crewSpec(5, 0).length === 0 && crewSpec(5, 1).length === 1 && crewSpec(5, 2).length <= 2, '尚未選船（cap 0）沒有船員；cap 限制人數');
  const names = new Set(); for (let s = 0; s < 400; s++) for (const c of crewSpec(s, 3)) names.add(c.title); ok(names.size >= 30, `名字夠多樣 (${names.size} 種)`);
  const looksSet = new Set(); for (let s = 0; s < 200; s++) for (const c of crewSpec(s, 3)) looksSet.add(JSON.stringify(c.look)); ok(looksSet.size > 300, `造型夠多樣 (${looksSet.size} 種)`);
  const vd = virtualData(Date.now(), false, 3, crewSpec(42, 3)); ok(vd.virtual && vd.crew.length === crewSpec(42, 3).length && vd.crew.every((c) => c.look && c.virtual), 'virtualData 吃自訂船員、每位帶造型');
  const vd2 = virtualData(Date.now(), false, 3); ok(vd2.crew.length === 3, 'virtualData 不給 spec 仍相容舊行為'); }

// --- 換色
{ const px = (r, g, b) => Uint8ClampedArray.from([r, g, b, 255]);
  const blue = px(97, 125, 207); recolorPixels(blue, { cool: 0 }); ok(blue[0] > blue[2] + 40, '藍色衣服 → 轉成紅色系');
  const skin = px(236, 182, 144); recolorPixels(skin, { cool: 0, green: 0, warm: 200 }); ok(skin[0] === 236 && skin[1] === 182 && skin[2] === 144, '膚色不動');
  const hair = px(63, 63, 70); recolorPixels(hair, { cool: 90, green: 90, warm: 90 }); ok(hair[0] === 63 && hair[2] === 70, '深灰（頭髮 / 褲子）不動');
  const brown = px(183, 102, 70); recolorPixels(brown, { warm: 200 }); ok(brown[0] === 183, '棕色（髮色 / 深膚色）不動');
  const orange = px(255, 149, 47); recolorPixels(orange, { warm: 200 }); ok(orange[2] > orange[0], '橘色衣服 → 轉成藍色系');
  const bk = px(0, 0, 0); recolorPixels(bk, { cool: 90 }); ok(bk[0] === 0 && bk[1] === 0, '黑色背景不動');
  const none = px(97, 125, 207); recolorPixels(none, {}); ok(none[0] === 97, '沒指定的色系不動'); }

// --- 小船沒有辦公桌
for (const t of HOME_TYPES) {
  const h = buildHome(t);
  ok(h.spec.desks === 0 && h.pois.desks.length === 0 && h.props.desks.length === 0, `${t}: 甲板沒有辦公桌`);
  const free = []; for (let iz = 0; iz < 400; iz++) for (let ix = 0; ix < 400; ix++) { if (!h.nav.inb(ix, iz)) continue; const x = h.nav.cx(ix), z = h.nav.cz(iz); if (h.nav.walkable(x, z, 0.16)) free.push([x, z]); }
  const q = h.nav.findPath(h.start[0], h.start[1], h.land[0], h.land[1]); ok(!!q, `${t}: 起點走得到上船點`);
  const reachable = free.filter(([x, z]) => { const p = h.nav.findPath(h.start[0], h.start[1], x, z); return p && Math.hypot(p[p.length - 1][0] - x, p[p.length - 1][1] - z) < 1.0; });
  ok(free.length >= 8 && reachable.length / free.length > 0.99, `${t}: 可走區域 ${free.length} 格，走得到 ${(100 * reachable.length / free.length).toFixed(1)}%`);
}
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
