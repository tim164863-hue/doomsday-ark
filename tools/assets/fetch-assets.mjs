// 抓取並轉檔所有第三方 CC0 素材（可重現）。用法：cd tools/assets && npm i && cd ../.. && node tools/fetch-assets.mjs [tex|hdri|models|all]
// 來源與授權見 ASSETS.md；每個素材的 URL、授權、大小、sha256 寫進 public/assets-manifest.json。
//   · ambientCG（CC0）PBR 貼圖 → 1024 / 512 WebP（RGB=底色、A=高度圖，給 shader 做凹凸）
//   · Poly Haven（CC0）HDRI → 256×128 Radiance .hdr（只拿來做環境反射光，所以很小）
//   · Poly Haven（CC0）道具模型 → 簡化 + 貼圖縮到 512 WebP + meshopt 壓縮的 .glb
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, textureCompress, prune, dedup, quantize, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';

const ROOT = path.resolve(import.meta.dirname, '../..'); const PUB = path.join(ROOT, 'public'); const CACHE = path.join(ROOT, 'tools/assets/.cache');
const what = process.argv[2] || 'all'; fs.mkdirSync(CACHE, { recursive: true });
const manifestFile = path.join(PUB, 'assets-manifest.json'); const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : { note: '由 tools/fetch-assets.mjs 產生；授權說明見 ASSETS.md', items: {} };
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);
const UA = { headers: { 'user-agent': 'Mozilla/5.0 doomsday-ark-asset-fetch' } };
async function dl(url, file) { if (fs.existsSync(file) && fs.statSync(file).size > 0) return file; fs.mkdirSync(path.dirname(file), { recursive: true }); const r = await fetch(url, UA); if (!r.ok) throw new Error(r.status + ' ' + url); fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); return file; }
const note = (key, o) => { manifest.items[key] = o; fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 1) + '\n'); };

// ---------------------------------------------------------------- 1. 貼圖（ambientCG, CC0）
const TEX = [
  { key: 'paint', id: 'Metal041B', use: '旗艦船殼 / 白漆鏽痕' },
  { key: 'steel', id: 'Metal063', use: '小船船殼 / 灰鋼鏽痕' },
  { key: 'rust', id: 'Rust009', use: '重鏽斑塊' },
];
async function textures() {
  for (const t of TEX) {
    const zip = await dl(`https://ambientcg.com/get?file=${t.id}_1K-JPG.zip`, path.join(CACHE, t.id + '.zip'));
    const dir = path.join(CACHE, t.id); fs.mkdirSync(dir, { recursive: true }); execFileSync('unzip', ['-oq', zip, '-d', dir]);
    const color = path.join(dir, `${t.id}_1K-JPG_Color.jpg`), disp = path.join(dir, `${t.id}_1K-JPG_Displacement.jpg`);
    for (const [size, tag] of [[1024, '1k'], [512, '512']]) {
      const h = await sharp(disp).resize(size, size).greyscale().raw().toBuffer(); const rgb = await sharp(color).resize(size, size).removeAlpha().raw().toBuffer();
      const out = Buffer.alloc(size * size * 4); for (let i = 0; i < size * size; i++) { out[i * 4] = rgb[i * 3]; out[i * 4 + 1] = rgb[i * 3 + 1]; out[i * 4 + 2] = rgb[i * 3 + 2]; out[i * 4 + 3] = h[i]; }
      const f = path.join(PUB, 'tex', `${t.key}-${tag}.webp`); fs.mkdirSync(path.dirname(f), { recursive: true });
      await sharp(out, { raw: { width: size, height: size, channels: 4 } }).webp({ quality: tag === '1k' ? 72 : 70, alphaQuality: 60, effort: 5 }).toFile(f);
      note(`tex/${t.key}-${tag}.webp`, { source: `https://ambientcg.com/a/${t.id}`, asset: t.id, license: 'CC0-1.0', use: t.use, bytes: fs.statSync(f).size, sha256: sha(fs.readFileSync(f)) });
    }
    console.log('tex', t.key, t.id);
  }
}

// ---------------------------------------------------------------- 2. HDRI（Poly Haven, CC0）→ 256×128 .hdr
const HDRI = { id: 'wasteland_clouds_puresky', w: 256, h: 128 };
async function hdri() {
  const files = await (await fetch(`https://api.polyhaven.com/files/${HDRI.id}`, UA)).json(); const url = files.hdri['1k'].hdr.url;
  const src = await dl(url, path.join(CACHE, HDRI.id + '_1k.hdr')); const THREE = await import('three'); const { RGBELoader } = await import('three/examples/jsm/loaders/RGBELoader.js');
  const buf = fs.readFileSync(src); const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength); const ld = new RGBELoader(); ld.setDataType(THREE.FloatType); const im = ld.parse(ab);
  const { width: W, height: H, data } = im; const w = HDRI.w, h = HDRI.h, fx = W / w, fy = H / h; const px = new Float32Array(w * h * 3);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let r = 0, g = 0, b = 0, n = 0; for (let j = 0; j < fy; j++) for (let i = 0; i < fx; i++) { const k = (((y * fy + j) | 0) * W + ((x * fx + i) | 0)) * 4; r += data[k]; g += data[k + 1]; b += data[k + 2]; n++; } const o = (y * w + x) * 3; px[o] = r / n; px[o + 1] = g / n; px[o + 2] = b / n; }
  const enc = (r, g, b) => { const m = Math.max(r, g, b); if (m < 1e-32) return [0, 0, 0, 0]; const e = Math.ceil(Math.log2(m) + 1e-9); const s = 256 / 2 ** e; return [Math.min(255, r * s | 0), Math.min(255, g * s | 0), Math.min(255, b * s | 0), e + 128]; };
  const parts = [Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${h} +X ${w}\n`)];
  for (let y = 0; y < h; y++) { const line = []; for (let x = 0; x < w; x++) { const o = (y * w + x) * 3; line.push(enc(px[o], px[o + 1], px[o + 2])); } parts.push(Buffer.from([2, 2, w >> 8, w & 255]));
    for (let c = 0; c < 4; c++) { const ch = line.map((p) => p[c]); for (let i = 0; i < w;) { let run = 1; while (i + run < w && ch[i + run] === ch[i] && run < 127) run++; if (run > 2) { parts.push(Buffer.from([128 + run, ch[i]])); i += run; } else { const n = Math.min(128, w - i); let k = 0; while (k < n && !(i + k + 2 < w && ch[i + k] === ch[i + k + 1] && ch[i + k] === ch[i + k + 2])) k++; k = Math.max(1, k); parts.push(Buffer.from([k, ...ch.slice(i, i + k)])); i += k; } } } }
  const out = Buffer.concat(parts); const f = path.join(PUB, 'env', 'sky.hdr'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, out);
  note('env/sky.hdr', { source: `https://polyhaven.com/a/${HDRI.id}`, asset: HDRI.id, license: 'CC0-1.0', use: '環境反射光 IBL（256×128，由 1k 降採樣）', bytes: out.length, sha256: sha(out) }); console.log('hdri', out.length);
}

// ---------------------------------------------------------------- 3. 道具模型（Poly Haven, CC0）
export const PROPS = [
  { id: 'metal_jerrycan', tris: 1400, use: '艙頂汽油罐' }, { id: 'barrel_03', tris: 1400, use: '艙頂油桶' }, { id: 'propane_tank', tris: 1200, use: '丙烷鋼瓶' },
  { id: 'old_tyre', tris: 1200, use: '舷側輪胎護舷' }, { id: 'lifebuoy', tris: 900, use: '救生圈' }, { id: 'wooden_crate_02', tris: 600, use: '木箱' },
  { id: 'portable_generator', tris: 3000, use: '發電機' },
  // 之後的里程碑（海盜砲、海面浮標、無線電…）再加進這個清單。
];
async function models() {
  await MeshoptEncoder.ready; await MeshoptDecoder.ready; await MeshoptSimplifier.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
  for (const p of PROPS) {
    const info = await (await fetch(`https://api.polyhaven.com/files/${p.id}`, UA)).json(); const g = info.gltf['1k'].gltf; const dir = path.join(CACHE, 'm', p.id);
    await dl(g.url, path.join(dir, p.id + '.gltf')); for (const [rel, v] of Object.entries(g.include)) await dl(v.url, path.join(dir, rel));
    const doc = await io.read(path.join(dir, p.id + '.gltf')); const tris0 = doc.getRoot().listMeshes().flatMap((m) => m.listPrimitives()).reduce((a, pr) => a + (pr.getIndices() ? pr.getIndices().getCount() : pr.getAttribute('POSITION').getCount()) / 3, 0);
    await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: Math.min(1, p.tris / tris0), error: 0.02, lockBorder: false }),
      textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [512, 512], quality: 78 }), dedup(), prune(), quantize({ quantizePosition: 14 }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
    const f = path.join(PUB, 'models/props', p.id + '.glb'); fs.mkdirSync(path.dirname(f), { recursive: true }); await io.write(f, doc);
    const tris1 = doc.getRoot().listMeshes().flatMap((m) => m.listPrimitives()).reduce((a, pr) => a + (pr.getIndices() ? pr.getIndices().getCount() : 0) / 3, 0);
    note(`models/props/${p.id}.glb`, { source: `https://polyhaven.com/a/${p.id}`, asset: p.id, license: 'CC0-1.0', use: p.use, trisBefore: Math.round(tris0), trisAfter: Math.round(tris1), bytes: fs.statSync(f).size, sha256: sha(fs.readFileSync(f)) });
    console.log('model', p.id, Math.round(tris0), '→', Math.round(tris1), (fs.statSync(f).size / 1024) | 0, 'KB');
  }
}
if (what === 'tex' || what === 'all') await textures(); if (what === 'hdri' || what === 'all') await hdri(); if (what === 'models' || what === 'all') await models();
console.log('done');
