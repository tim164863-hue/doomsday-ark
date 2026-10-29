// 掃描 src/ 與 index.html 裡所有 emoji（Extended_Pictographic + ZWJ 序列）。node tools/icons/emoji-scan.mjs [--json]
import fs from 'node:fs'; import path from 'node:path';
export const RE = /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation})(?:\uFE0F|\u{1F3FB}-\u{1F3FF})?(?:\u200D(?:\p{Extended_Pictographic}|\p{Emoji_Presentation})\uFE0F?)*|\uFE0F|\u20E3/gu;
export function files(dir, out = []) { for (const f of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, f.name); if (f.isDirectory()) files(p, out); else if (/\.(js|css|html|mjs)$/.test(f.name)) out.push(p); } return out; }
if (import.meta.url === `file://${process.argv[1]}`) {
  const all = [...files('src'), 'index.html']; const cnt = new Map(); const per = new Map();
  for (const f of all) { const s = fs.readFileSync(f, 'utf8'); for (const m of s.matchAll(RE)) { const k = m[0].replace(/\uFE0F/g, ''); if (!k) continue; cnt.set(k, (cnt.get(k) || 0) + 1); per.set(f, (per.get(f) || 0) + 1); } }
  if (process.argv.includes('--json')) console.log(JSON.stringify([...cnt].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ k, cp: [...k].map((c) => c.codePointAt(0).toString(16)).join('-'), n })), null, 1));
  else { console.log(cnt.size, 'distinct', [...cnt.values()].reduce((a, b) => a + b, 0), 'total'); for (const [k, n] of [...cnt].sort((a, b) => b[1] - a[1])) console.log(k, [...k].map((c) => c.codePointAt(0).toString(16)).join('-'), n); }
}
