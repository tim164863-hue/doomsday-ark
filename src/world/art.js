// 第三方 CC0 美術素材的延遲載入（貼圖 / HDRI 環境光 / 道具模型）。所有素材由 tools/fetch-assets.mjs 產生，來源與授權見 ASSETS.md。
//   · 全部「先出畫面、後補素材」：載入前用 1×1 中性占位貼圖（效果等於沒有），載完才淡入；載入失敗就維持原本的程序式外觀。
//   · 手機 / low 畫質用 512 貼圖、單向投影；桌機 1024、三向投影。
//   · ?wl=0 會整個不載（對照用）。
import * as THREE from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { detectQuality } from '../config.js';

const ON = typeof location === 'undefined' ? false : !/[?&]wl=0\b/.test(location.search);
const BASE = (import.meta.env && import.meta.env.BASE_URL) || './';
const Q = typeof location === 'undefined' ? 'high' : detectQuality().level;
export const ART = { on: ON, hi: Q === 'high', texSize: Q === 'high' ? '1k' : '512', env: null, envTex: null, envMean: 0.5, tex: {}, sets: {}, stat: { bytes: 0, files: 0, fail: 0 } };

const blank = () => { const c = document.createElement('canvas'); c.width = c.height = 1; const g = c.getContext('2d'); g.fillStyle = 'rgb(128,128,128)'; g.fillRect(0, 0, 1, 1); return c; };
function mkTex() { const t = new THREE.Texture(blank()); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.needsUpdate = true; return t; }
async function loadImg(url) { const r = await fetch(url); if (!r.ok) throw new Error(r.status); const b = await r.blob(); ART.stat.bytes += b.size; ART.stat.files++; return createImageBitmap(b, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' }); }
function meanLum(bm) { const c = document.createElement('canvas'); c.width = c.height = 16; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(bm, 0, 0, 16, 16); const d = g.getImageData(0, 0, 16, 16).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += (d[i] + d[i + 1] + d[i + 2]) / 765; return s / 256; }
function texFor(key) {
  if (ART.tex[key]) return ART.tex[key];
  const t = ART.tex[key] = mkTex(); t.userData.mean = 0.5; t.userData.ready = false; t.userData.ps = [];
  if (ON) loadImg(`${BASE}tex/${key}-${ART.texSize}.webp`).then((bm) => { t.image = bm; t.userData.mean = meanLum(bm); t.userData.ready = true; t.needsUpdate = true; t.anisotropy = ART.hi ? 4 : 1; t.userData.ps.forEach((f) => f()); }).catch(() => { ART.stat.fail++; });
  return t;
}
/** 取得一組 shader 共用的 uniform（A=主貼圖、R=鏽貼圖、T=淡入、Am/Rm=平均亮度）。載入完成後 T 才從 0 升到 1。 */
export function texSet(key) {
  if (ART.sets[key]) return ART.sets[key];
  const A = texFor(key), R = texFor('rust'); const u = ART.sets[key] = { uWlA: { value: A }, uWlR: { value: R }, uWlT: { value: 0 }, uWlAm: { value: 0.5 }, uWlRm: { value: 0.5 }, uWlB: { value: ART.hi ? 5 : 2.5 } };
  const chk = () => { if (A.userData.ready && R.userData.ready) { u.uWlAm.value = Math.max(0.12, A.userData.mean); u.uWlRm.value = Math.max(0.12, R.userData.mean); u.fade = 1e-3; } };
  A.userData.ps.push(chk); R.userData.ps.push(chk); chk(); return u;
}
/** 每幀呼叫：載入完成的貼圖組淡入（0.8 秒） */
export function artTick(dt) { for (const k in ART.sets) { const u = ART.sets[k]; if (u.fade && u.uWlT.value < 1) u.uWlT.value = Math.min(1, u.uWlT.value + dt / 0.8); } }

/** 環境光（IBL）：Poly Haven HDRI（CC0）→ PMREM，設成 scene.environment；亮度由 environment.js 依日夜 / 天氣調整。 */
export function loadEnv(renderer, scene) {
  if (!ON) return; scene.environmentIntensity = 0;
  new HDRLoader().loadAsync(`${BASE}env/sky.hdr`).then((tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping; tex.minFilter = tex.magFilter = THREE.LinearFilter; tex.generateMipmaps = false;
    const d = tex.image.data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4 * 7) { s += THREE.DataUtils.fromHalfFloat(d[i + 1]); n++; } ART.envMean = Math.max(0.05, s / n);
    const pm = new THREE.PMREMGenerator(renderer); ART.env = pm.fromEquirectangular(tex).texture; pm.dispose(); ART.envTex = tex; scene.environment = ART.env; ART.envReady && ART.envReady.forEach((f) => f(tex));
  }).catch(() => { ART.stat.fail++; });
}
export const onEnv = (f) => { (ART.envReady = ART.envReady || []).push(f); if (ART.envTex) f(ART.envTex); };

// ---------------------------------------------------------------- 道具模型（Poly Haven CC0，glb + meshopt）
const gl = new GLTFLoader(); gl.setMeshoptDecoder(MeshoptDecoder); const PM = new Map();
/** 取得道具 {parts:[{geo,mat,mw}], box}（mw = 該 mesh 在模型內的矩陣，已含壓縮還原縮放；沒載到 resolve null）。同一個道具只載一次。 */
export function loadProp(id) {
  if (!ON) return Promise.resolve(null);
  if (!PM.has(id)) PM.set(id, gl.loadAsync(`${BASE}models/props/${id}.glb`).then((g) => {
    g.scene.updateMatrixWorld(true); const parts = []; g.scene.traverse((o) => { if (o.isMesh) { o.geometry.computeBoundingSphere();
      for (const m of [].concat(o.material)) if (m.transmission > 0) { m.transmission = 0; m.thickness = 0; m.transparent = true; m.opacity = Math.min(m.opacity, 0.5); m.depthWrite = false; }   // 透射材質會讓 three 把整個場景多畫一遍（+120 draw calls）→ 改成普通半透明
      parts.push({ geo: o.geometry, mat: o.material, mw: o.matrixWorld.clone() }); } });
    if (!parts.length) return null; return { parts, box: new THREE.Box3().setFromObject(g.scene) };
  }).catch(() => { ART.stat.fail++; return null; }));
  return PM.get(id);
}
