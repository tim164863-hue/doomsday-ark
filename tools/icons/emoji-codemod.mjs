// 把 src/ 與 index.html 裡的 emoji 換成圖示字型的私用區跳脫碼（JS: \uXXXX、CSS: \eXXX、HTML: &#xXXXX;）。可重複執行（沒有 emoji 就不動）。
// 用法：node tools/icons/emoji-codemod.mjs [--dry]
import fs from 'node:fs'; import path from 'node:path';
import { RE, files } from './emoji-scan.mjs'; import { MAP } from './icon-map.mjs';
const pua = JSON.parse(fs.readFileSync('tools/icons/pua.json', 'utf8')); const dry = process.argv.includes('--dry');
let total = 0; const unmapped = new Set();
for (const f of [...files('src'), 'index.html']) {
  const s = fs.readFileSync(f, 'utf8'); const ext = path.extname(f); let n = 0;
  const out = s.replace(RE, (m, off) => {
    const key = [...m.replace(/\uFE0F/g, '')].map((c) => c.codePointAt(0).toString(16)).join('-'); if (!key) return '';
    const spec = MAP[key]; if (!spec) { unmapped.add(m); return m; }
    const cp = pua[spec]; n++;
    if (ext === '.css') { const next = s[off + m.length] || ''; return '\\' + cp.toString(16) + (/[0-9a-fA-F\s]/.test(next) ? ' ' : ''); }
    if (ext === '.html') return '&#x' + cp.toString(16).toUpperCase() + ';';
    return '\\u' + cp.toString(16);
  });
  if (n) { total += n; if (!dry) fs.writeFileSync(f, out); console.log(f, n); }
}
console.log('replaced', total, unmapped.size ? 'UNMAPPED: ' + [...unmapped].join(' ') : '');
