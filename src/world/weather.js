// 天氣視覺：雨絲 / 雪片（繞著鏡頭循環的 GPU 粒子）、閃電（折線 + 閃光）、極光簾幕（夜晚，極圈）。
// 強度由 game 每 0.5 s 算好目標（來自 sim/weather.js 的 weatherAt），這裡只負責平滑與畫。env.wx 提供給 environment.js 調天色 / 霧 / 光；
// waveState.amp 讓大浪同時影響海面 shader 與 CPU 端的船搖晃（暴風 ×(1+1.1·強度)）。粒子數依畫質縮放。
import * as THREE from 'three';
import { clamp, smoothstep, damp } from '../util.js';
import { waveState } from './waves.js';

const precipVert = /* glsl */`
uniform float uTime, uFall, uLen, uSize, uPx, uSnow; uniform vec3 uBox, uCtr; uniform vec2 uWind;
attribute float aEnd; attribute float aR; varying float vA; varying float vS;
void main(){
  vec3 v = vec3(uWind.x, -uFall, uWind.y);
  vec3 p = position * uBox + v * uTime;
  if (uSnow > 0.5) { p.x += sin(uTime*0.8 + aR*40.0)*1.6; p.z += cos(uTime*0.6 + aR*55.0)*1.6; }
  p = mod(p, uBox) - 0.5*uBox;
  float d = length(p.xz) / (0.5*uBox.x); float dy = abs(p.y) / (0.5*uBox.y);
  vS = uSnow;
  vA = clamp(1.0 - d*d, 0.0, 1.0) * clamp(1.0 - dy*dy*dy, 0.0, 1.0);
  vec3 w = p + uCtr;
  w -= normalize(v) * uLen * aEnd;
  vec4 mv = viewMatrix * vec4(w, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uSize * (0.6 + aR*0.8) * uPx * 90.0 / max(1.0, -mv.z), 2.0, 18.0);
}`;
const precipFrag = /* glsl */`
precision mediump float; uniform vec3 uColor; uniform float uAlpha; varying float vA; varying float vS;
void main(){
  float a = vA * uAlpha;
  if (vS > 0.5) { vec2 q = gl_PointCoord - 0.5; float r = length(q); if (r > 0.5) discard; a *= smoothstep(0.5, 0.15, r); }
  gl_FragColor = vec4(uColor, a);
}`;
const auroraVert = /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const auroraFrag = /* glsl */`
precision mediump float; varying vec2 vUv; uniform float uTime, uI;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
void main(){
  float a = vUv.x * 6.2831853, y = vUv.y;
  float c = n2(vec2(cos(a)*2.4 + uTime*0.035, sin(a)*2.4 + uTime*0.02));
  float mask = smoothstep(0.36, 0.64, c);
  float rays = 0.5 + 0.5*n2(vec2(a*45.0 + uTime*0.25, y*2.0));
  float wave = n2(vec2(a*6.0 - uTime*0.08, y*2.5 + uTime*0.06));
  float prof = smoothstep(0.02, 0.16, y) * (1.0 - smoothstep(0.30, 0.95, y)) * (0.55 + 0.9*wave);
  vec3 col = mix(vec3(0.12, 1.0, 0.5), vec3(0.5, 0.25, 1.0), smoothstep(0.30, 0.85, y));
  col = mix(col, vec3(1.0, 0.25, 0.55), smoothstep(0.8, 1.0, y) * 0.4);
  gl_FragColor = vec4(col * mask * rays * prof * uI * 2.4, 1.0);
}`;
let softTex; const soft = () => { if (softTex) return softTex; const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 1, 32, 32, 31); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return (softTex = new THREE.CanvasTexture(c)); };

export const WX_QUALITY = { high: { rain: 2200, snow: 1600 }, mid: { rain: 1300, snow: 1000 }, low: { rain: 650, snow: 520 } };

export class WeatherFX {
  constructor(scene, env, quality, renderer) {
    this.scene = scene; this.env = env; this.q = quality; this.renderer = renderer;
    this.s = { storm: 0, rain: 0, snow: 0, cloud: 0, aurora: 0, cold: 0, flash: 0 }; env.wx = this.s;
    this.target = null; this.nextFlash = 3; this.flashes = []; this.boltT = 0; this.onThunder = null; this.ctr = new THREE.Vector3(); this.tmp = new THREE.Vector3();
    this.rain = this.mkPrecip(false); this.snow = this.mkPrecip(true);
    // 極光：以鏡頭為中心的開口圓柱（內側可見）
    const ag = new THREE.CylinderGeometry(1800, 1800, 1500, 128, 1, true); ag.translate(0, 60 + 750, 0);
    this.auMat = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uI: { value: 0 } }, vertexShader: auroraVert, fragmentShader: auroraFrag, side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, fog: false });
    this.aurora = new THREE.Mesh(ag, this.auMat); this.aurora.frustumCulled = false; this.aurora.renderOrder = -5; this.aurora.visible = false; scene.add(this.aurora);
    // 閃電
    this.bolt = new THREE.Group(); this.bolt.visible = false; this.boltLines = []; const bm = new THREE.LineBasicMaterial({ color: 0xe6edff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    for (let k = 0; k < 3; k++) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(16 * 3), 3)); const l = new THREE.Line(g, bm); l.frustumCulled = false; this.bolt.add(l); this.boltLines.push(l); }
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft(), color: 0xcfdcff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); this.glow.scale.set(500, 300, 1); this.bolt.add(this.glow); scene.add(this.bolt);
  }
  mkPrecip(snow) {
    const n = (WX_QUALITY[this.q.name] || WX_QUALITY.mid)[snow ? 'snow' : 'rain']; const g = new THREE.BufferGeometry(); const pos = new Float32Array(n * (snow ? 1 : 2) * 3), end = new Float32Array(n * (snow ? 1 : 2)), rr = new Float32Array(n * (snow ? 1 : 2));
    for (let i = 0; i < n; i++) { const x = Math.random(), y = Math.random(), z = Math.random(), r = Math.random(); const m = snow ? 1 : 2; for (let k = 0; k < m; k++) { const j = i * m + k; pos.set([x, y, z], j * 3); end[j] = k; rr[j] = r; } }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aEnd', new THREE.BufferAttribute(end, 1)); g.setAttribute('aR', new THREE.BufferAttribute(rr, 1));
    const u = { uTime: { value: 0 }, uFall: { value: snow ? 3.2 : 34 }, uLen: { value: 1.6 }, uSize: { value: snow ? 1.6 : 1 }, uPx: { value: 1 }, uSnow: { value: snow ? 1 : 0 }, uBox: { value: new THREE.Vector3(110, 60, 110) }, uCtr: { value: new THREE.Vector3() }, uWind: { value: new THREE.Vector2(4, 1.5) }, uColor: { value: new THREE.Color(snow ? 0xffffff : 0xb9cde0) }, uAlpha: { value: 0 } };
    const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: precipVert, fragmentShader: precipFrag, transparent: true, depthWrite: false, fog: false });
    const o = snow ? new THREE.Points(g, mat) : new THREE.LineSegments(g, mat); o.frustumCulled = false; o.visible = false; o.renderOrder = 5; this.scene.add(o); o.userData.u = u; return o;
  }
  /** 畫質改變：重建粒子（數量） */
  setQuality(q) { this.q = q; for (const o of [this.rain, this.snow]) { this.scene.remove(o); o.geometry.dispose(); o.material.dispose(); } this.rain = this.mkPrecip(false); this.snow = this.mkPrecip(true); }
  /** target: {kind,snowy,i,cold,aur}；snap = 立即到位（測試 / 載入） */
  setTarget(wx, snap) { this.target = wx; if (snap) this.snap = true; }
  /** 手動 / 事件觸發的閃電：dist 公尺。雷擊事件用很近的距離。 */
  strike(dist, camera) {
    this.flashes.push({ t: 0, big: dist < 200 }); this.boltT = 0.28; const d = camera ? this.dir(camera) : { x: 0, z: -1 }; const ang = Math.atan2(d.x, d.z) + (Math.random() - 0.5) * 1.5; // 大致在視野前方
    this.buildBolt((camera ? camera.position.x : 0) + Math.sin(ang) * dist, (camera ? camera.position.z : 0) + Math.cos(ang) * dist, dist);
    if (this.onThunder) this.onThunder(dist);
  }
  dir(cam) { return cam.getWorldDirection(this.tmp); }
  buildBolt(px, pz, dist) {
    const top = 260 + Math.random() * 120; const pts = []; let x = px, z = pz; const N = 16; for (let i = 0; i < N; i++) { const t = i / (N - 1); const y = top * (1 - t); pts.push(x, y, z); x += (Math.random() - 0.5) * 22 * (1 - t * 0.4); z += (Math.random() - 0.5) * 22 * (1 - t * 0.4); }
    this.boltLines.forEach((l, k) => { const a = l.geometry.attributes.position; for (let i = 0; i < N; i++) { a.setXYZ(i, pts[i * 3] + (k - 1) * 0.9, pts[i * 3 + 1], pts[i * 3 + 2] + (k - 1) * 0.6); } a.needsUpdate = true; });
    this.glow.position.set(px, top + 10, pz); const sc = 300 + dist * 0.5; this.glow.scale.set(sc * 1.4, sc * 0.8, 1);
  }
  update(dt, time, camera, es, helm) {
    const T = this.target, S = this.s; const tg = T ? this.derive(T, es) : { storm: 0, rain: 0, snow: 0, cloud: 0, aurora: 0, cold: 0 };
    const lam = this.snap ? 100 : 0.7; this.snap = false;
    for (const k of ['storm', 'rain', 'snow', 'cloud', 'aurora', 'cold']) S[k] = damp(S[k], tg[k], lam, dt);
    // 大浪
    waveState.amp = 1 + 1.1 * S.storm + 0.15 * S.rain; this.waveAmp = waveState.amp;
    // 粒子
    const pr = Math.max(S.rain, S.storm * 0.0), sn = S.snow; const cam = camera.position; const hy = clamp(cam.y - 12, 12, 70);
    this.ctr.set(cam.x + this.dir(camera).x * 25, hy, cam.z + this.dir(camera).z * 25);
    const px = this.renderer ? this.renderer.getPixelRatio() : 1; const wind = 4 + S.storm * 14 + sn * 3;
    const pu = (o, a, extra) => { const u = o.userData.u; const vis = a > 0.01; if (o.visible !== vis) o.visible = vis; if (!vis) return; u.uTime.value = time % 900; u.uAlpha.value = a; u.uCtr.value.copy(this.ctr); u.uPx.value = px; u.uWind.value.set(wind * (extra ? 0.6 : 1), 1.5 + S.storm * 5); u.uLen.value = 1.2 + this.camDist(camera) * 0.008 + S.storm * 0.8; u.uFall.value = extra ? 3.2 + S.storm * 6 + sn * 2 : 30 + S.storm * 14; };
    pu(this.rain, Math.min(1, S.rain * 0.85 + S.storm * (T && T.snowy ? 0 : 0.85)) * 0.55, false);
    pu(this.snow, Math.min(1, sn) * 0.9, true);
    // 極光
    const au = S.aurora; if (this.aurora.visible !== au > 0.01) this.aurora.visible = au > 0.01; if (au > 0.01) { this.aurora.position.set(cam.x, 0, cam.z); this.auMat.uniforms.uTime.value = time; this.auMat.uniforms.uI.value = au; }
    // 閃電：暴風中隨機；每次 1~3 次閃爍
    if (S.storm > 0.15 && !this.noLightning) { this.nextFlash -= dt; if (this.nextFlash <= 0) { this.nextFlash = (2.5 + Math.random() * 7) / Math.max(0.3, S.storm); this.strike(250 + Math.random() * 900, camera); } }
    let fl = 0; for (const f of this.flashes) { f.t += dt; const t = f.t; const v = t < 0.06 ? t / 0.06 : t < 0.12 ? 1 - (t - 0.06) / 0.06 * 0.6 : t < 0.2 ? 0.4 + (t - 0.12) / 0.08 * 0.6 : Math.max(0, 1 - (t - 0.2) / 0.35); fl = Math.max(fl, v * (f.big ? 1 : 0.55)); } this.flashes = this.flashes.filter((f) => f.t < 0.6);
    S.flash = fl; if (this.boltT > 0) { this.boltT -= dt; const on = this.boltT > 0; if (this.bolt.visible !== on) this.bolt.visible = on; this.glow.material.opacity = on ? 0.7 * (0.5 + 0.5 * Math.sin(this.boltT * 90)) : 0; this.boltLines[0].material.opacity = on ? 0.6 + 0.4 * Math.sin(this.boltT * 120) : 0; } else if (this.bolt.visible) this.bolt.visible = false;
  }
  camDist(camera) { return Math.hypot(camera.position.x - this.ctr.x, camera.position.z - this.ctr.z, camera.position.y); }
  derive(w, es) {
    const night = es ? Math.max(es.nightF || 0, 0) : 0;
    const storm = w.kind === 'storm' ? w.i : 0, rain = w.kind === 'rain' ? w.i : 0, snow = w.snowy && (w.kind === 'snow' || w.kind === 'storm') ? w.i : 0;
    return { storm, rain, snow, cloud: Math.max(storm, rain * 0.8, snow * 0.7, w.kind === 'cloudy' ? 0.35 : 0, w.aur > 0.2 ? 0.1 : 0), aurora: w.aur * smoothstep(0.25, 0.7, night), cold: w.cold };
  }
  dispose() { this.teardown = true; }
}
