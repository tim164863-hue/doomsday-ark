// 檢查：原始碼（src、index.html）與正式版 bundle（docs/）不得含任何 emoji。node tools/check-emoji.mjs [--src-only]
import fs from 'node:fs'; import path from 'node:path';
import { RE, files } from './icons/emoji-scan.mjs';
const ESC = /\\u\{1f[0-9a-f]{3}\}|\\ud83[c-e][0-9a-f]{2}|\\u(?:2600|2601|2614|2615|2640|2642|2693|26a0|26a1|26d4|26fd|2705|2728|274c|2753|2757|2764|2b50)\b|&#x?1f[0-9a-f]{3};/i;
const targets = [...files('src'), 'index.html']; if (!process.argv.includes('--src-only') && fs.existsSync('docs')) targets.push(...files('docs').filter((f) => !/\.map$/.test(f)));
let bad = 0;
for (const f of targets) { const s = fs.readFileSync(f, 'utf8'); const m = [...s.matchAll(RE)].filter((x) => x[0].replace(/\uFE0F/g, '')); const e = s.match(ESC);
  if (m.length || e) { bad++; console.log('✗', f, m.slice(0, 5).map((x) => x[0]).join(' '), e ? 'escape:' + e[0] : ''); } }
console.log(bad ? `FAIL：${bad} 個檔案含 emoji` : `OK：${targets.length} 個檔案（${process.argv.includes('--src-only') ? 'src' : 'src + docs'}）沒有 emoji`); process.exit(bad ? 1 : 0);
