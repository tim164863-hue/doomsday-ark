// 由 tools/icons/icon-map.mjs 產生圖示字型 src/assets/ark-icons.woff2 + src/ui/icons.js（名稱→私用區字元）。
// 來源：Phosphor Icons (MIT) 與 game-icons.net (CC BY 3.0)，皆由 @iconify-json 套件取得。
// 用法：cd tools/icons && npm i && cd ../.. && node tools/build-icon-font.mjs
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { Readable } from 'node:stream';
import { MAP, EXTRA } from './icons/icon-map.mjs';
const req = createRequire(path.resolve('tools/icons/') + '/');
const { SVGIcons2SVGFontStream } = await import(path.resolve('tools/icons/node_modules/svgicons2svgfont/dist/index.js')); const svg2ttf = req('svg2ttf'); const ttf2woff2 = (await import(path.resolve('tools/icons/node_modules/ttf2woff2/dist/index.js'))).default;
const SETS = { ph: req('@iconify-json/ph/icons.json'), gi: req('@iconify-json/game-icons/icons.json') };
const PUA_FILE = 'tools/icons/pua.json';
const pua = fs.existsSync(PUA_FILE) ? JSON.parse(fs.readFileSync(PUA_FILE, 'utf8')) : {}; // 圖示規格 → 碼位（穩定，不會因新增而重排）
let next = Math.max(0xdfff, ...Object.values(pua)) + 1;
const specs = [...new Set([...Object.values(MAP), ...Object.values(EXTRA)])].sort();
for (const s of specs) if (!pua[s]) pua[s] = next++;
fs.writeFileSync(PUA_FILE, JSON.stringify(pua, null, 1) + '\n');
const glyphs = [];
for (const s of specs) {
  const [p, n] = s.split(':'); const set = SETS[p]; const ic = set.icons[n]; if (!ic) throw new Error('missing icon ' + s);
  const w = ic.width || set.width || 16, h = ic.height || set.height || 16, pad = p === 'gi' ? w * 0.06 : 0;
  const body = ic.body.replace(/fill="currentColor"/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${w + 2 * pad} ${h + 2 * pad}" width="${w + 2 * pad}" height="${h + 2 * pad}">${body}</svg>`;
  const st = Readable.from([svg]); st.metadata = { unicode: [String.fromCodePoint(pua[s])], name: s.replace(':', '-') }; glyphs.push(st);
}
const chunks = [];
const font = new SVGIcons2SVGFontStream({ fontName: 'ArkIcons', fontHeight: 1000, descent: 150, normalize: true, fixedWidth: true, centerHorizontally: true, log() {} });
font.on('data', (d) => chunks.push(d));
font.on('end', () => {
  const ttf = svg2ttf(chunks.map(String).join(''), { ts: 1700000000 });
  const woff2 = ttf2woff2(Buffer.from(ttf.buffer));
  fs.mkdirSync('src/assets', { recursive: true }); fs.writeFileSync('src/assets/ark-icons.woff2', woff2);
  const names = {}; for (const [cp, s] of Object.entries(MAP)) { const key = s.split(':')[1].replace(/-(fill|bold)$/, '').replace(/-/g, '_'); names[key] = names[key] || String.fromCodePoint(pua[s]); }
  for (const [k, sp] of Object.entries(EXTRA)) names[k] = String.fromCodePoint(pua[sp]);
  const out = `// 自動產生（tools/build-icon-font.mjs）。圖示字型 ArkIcons 的私用區字元；程式碼裡直接用 \\uXXXX。\n// 授權：Phosphor Icons (MIT)、game-icons.net (CC BY 3.0)，詳見 ASSETS.md。\nexport const IC = {\n${Object.entries(names).map(([k, v]) => `  ${k}: '\\u${v.codePointAt(0).toString(16)}',`).join('\n')}\n};\nexport const ICON_FONT = 'ArkIcons';\n`;
  fs.writeFileSync('src/ui/icons.js', out);
  console.log('glyphs', glyphs.length, 'woff2 bytes', woff2.length);
});
for (const g of glyphs) font.write(g); font.end();
