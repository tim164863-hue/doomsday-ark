// 船員對白測試：node tools/rellines-test.mjs
import * as L from '../src/crew/rellines.js';
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('✗', m); } else console.log('✓', m); };
const sets = { FRIEND_CONV: L.FRIEND_CONV, RIVAL_CONV: L.RIVAL_CONV, COLD_CONV: L.COLD_CONV, FIGHT: L.FIGHT, MAKEUP: L.MAKEUP, HELP: L.HELP };
const allText = [].concat(L.FRIEND_CONV.flat(), L.RIVAL_CONV.flat(), L.COLD_CONV.flat(), L.FIGHT.map((x) => x[1]), L.MAKEUP.map((x) => x[1]), L.HELP.map((x) => x[1]), L.FRIEND_MOOD, L.RIVAL_MOOD, L.MEAL_OPEN, L.PARTY, L.CELEB, L.STORM, L.INVITE, L.CHALLENGE, L.ACCEPT, L.DECLINE);
ok(allText.every((t) => typeof t === 'string' && t.length > 0), '所有對白都是非空字串');
ok(allText.every((t) => !/sessions|openclaw|http|token|@/i.test(t)), '對白不含外部資料 / 連結 / 帳號');
for (const k of ['friend', 'rival', 'feud']) { const r = L.convLines(k, '小A', '小B', () => 0.3); ok(Array.isArray(r) && r.length === 2 && r.every((x) => x && !/[{}]/.test(x)), `convLines(${k}) 兩句且已代入名字`); }
for (const k of ['fight', 'makeup', 'help']) { const sc = L.script(k, '小A', '小B'); ok(sc.length >= 2 && sc.every(([w, t]) => (w === 0 || w === 1) && !/[{}]/.test(t)), `script(${k}) 台詞已代入、說話者 0/1`); }
ok(L.script('help', '小A', '小B').some(([, t]) => t.includes('小B')), 'help 台詞有叫到對方名字');
const m = L.moodLineRel('rival', '小C', () => 0); ok(typeof m === 'string' && m.includes('小C') && !/[{}]/.test(m), '對頭的心情台詞會提到對方');
ok(L.moodLineRel('neutral', '小C') == null, '一般關係沒有特別台詞');
ok(L.botInviteAccept(80) > L.botInviteAccept(0) && L.botInviteAccept(-60) >= 0.2 && L.botInviteAccept(200, 9) <= 0.95, '邀請接受率：好友較高，並限制在 0.2–0.95');
ok(L.botInviteAccept(-30) > L.botInviteAccept(-10), '對頭（交情很低）反而更常接受挑戰');
const seen = new Set(); for (let i = 0; i < 40; i++) seen.add(L.pickLine(L.PARTY, Math.random)); ok(seen.size >= 3, '派對台詞有變化');
console.log(fails ? `\n${fails} 項失敗` : '\n全部通過'); process.exit(fails ? 1 : 0);
