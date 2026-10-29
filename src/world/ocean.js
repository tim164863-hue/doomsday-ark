import * as THREE from 'three';
import { WAVES } from './waves.js';
import { SHIP, HULL_XS, HULL_XB, HULL_TIP, SHIP_CX } from '../ship/config.js';
import { WL_ON } from '../ship/wasteland.js';

const N = WAVES.length;
const vert = /* glsl */`
uniform float uTime, uAmp;
uniform vec4 uW[${N}]; // dirx, dirz, k, A
uniform float uWs[${N}]; // omega
varying vec3 vWorld; varying float vH; varying float vDist; varying vec2 vGrad;
uniform vec2 uOrg;
void main(){
  vec3 p = position;
  float h = 0.0; vec2 g = vec2(0.0);
  for(int i=0;i<${N};i++){
    vec4 w = uW[i];
    float ph = w.z*(w.x*(p.x + uOrg.x) + w.y*(p.z + uOrg.y)) - uWs[i]*uTime;
    h += w.w*sin(ph);
    float c = w.w*w.z*cos(ph);
    g += c*w.xy;
  }
  h *= uAmp; g *= uAmp;
  p.y = h;
  vH = h; vGrad = g;
  vec4 wp = modelMatrix * vec4(p,1.0);
  vWorld = wp.xyz;
  vec4 mv = viewMatrix * wp;
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const frag = /* glsl */`
precision highp float;
uniform float uTime, uAmp, uDetail;
uniform vec3 uDeep, uShallow, uZenith, uHorizon, uGlow, uSunDir, uSunCol, uMoonDir, uFog;
uniform float uFogD, uDay, uMoonVis, uSunVis, uShipHL, uShipHW, uHullOn, uSmallOn;
uniform vec4 uSmall; uniform vec4 uArk; uniform float uWl;
varying vec3 vWorld; varying float vH; varying float vDist; varying vec2 vGrad;
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash2(i),hash2(i+vec2(1,0)),f.x), mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),f.x), f.y); }
vec3 skyCol(vec3 d){
  float y = clamp(d.y, 0.0, 1.0);
  vec3 c = mix(uHorizon, uZenith, pow(y, 0.5));
  float sd = max(dot(d, uSunDir), 0.0);
  c += uGlow * (pow(sd, 6.0)*0.3 + pow(sd,48.0)*0.5) * uSunVis;
  return c;
}
float hullHW(float x){
  // 與船體外形一致的簡化寬度
  float xs = ${HULL_XS.toFixed(2)}, xb = ${HULL_XB.toFixed(2)}, bl = ${SHIP.bowLen.toFixed(2)};
  if (x < xs) return 0.0;
  if (x < xs+3.0) return uShipHW*(0.84+0.16*(x-xs)/3.0);
  if (x < xb) return uShipHW;
  float u = (x-xb)/bl; if (u>1.0) return 0.0;
  return uShipHW*pow(max(1.0-pow(u,1.7),0.0),0.85);
}
void main(){
  vec3 V = normalize(cameraPosition - vWorld);
  vec2 wp = vWorld.xz;
  // 細節法線（高頻小波）
  float t = uTime;
  vec2 d1 = vec2(noise(wp*0.9 + vec2(t*0.35, t*0.2)), noise(wp*0.9 + 31.7 - vec2(t*0.25, -t*0.3)));
  vec2 d2 = vec2(noise(wp*2.7 + vec2(-t*0.6, t*0.5)), noise(wp*2.7 + 11.3 + vec2(t*0.5, t*0.4)));
  vec2 dn = ((d1-0.5)*0.55 + (d2-0.5)*0.35) * uDetail * (1.0/(1.0+vDist*0.012));
  vec3 N = normalize(vec3(-vGrad.x + dn.x, 1.0, -vGrad.y + dn.y));
  float ndv = max(dot(N,V), 0.0);
  float F = 0.02 + 0.98*pow(1.0-ndv, 5.0);
  F = clamp(F*1.0, 0.0, 1.0);
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  vec3 refl = skyCol(R);
  float sunSpec = pow(max(dot(R, uSunDir), 0.0), 220.0) * 3.2 + pow(max(dot(R, uSunDir), 0.0), 24.0)*0.18;
  float moonSpec = pow(max(dot(R, uMoonDir), 0.0), 400.0) * 1.6 + pow(max(dot(R, uMoonDir), 0.0), 40.0)*0.05;
  vec3 spec = uSunCol*sunSpec*uSunVis + vec3(0.7,0.8,1.0)*moonSpec*uMoonVis;
  // 水體：深色 + 浪尖次表面散射
  float crest = clamp(vH/(0.9*uAmp+0.001) * 0.5 + 0.5, 0.0, 1.0);
  vec3 body = mix(uDeep, uShallow, pow(crest, 2.2)*0.8 + (1.0-ndv)*0.12);
  // 末日廢土：海水變混濁（去飽和、偏灰綠、更暗）+ 大片油膜（薄膜干涉彩紋，只在近處）
  float wlOil = 0.0; vec3 wlFilm = vec3(0.0);
  if (uWl > 0.5) {
    float gr = dot(body, vec3(0.33));
    body = mix(body, vec3(gr*0.95, gr*1.04, gr*0.88) + vec3(0.012,0.02,0.0), 0.36) * 0.88;
    wlOil = smoothstep(0.64, 0.86, noise(wp*0.05 + vec2(t*0.012, -t*0.008))*0.65 + noise(wp*0.14 - vec2(t*0.01, t*0.006))*0.35) * (1.0 - smoothstep(160.0, 650.0, vDist));
    float ph = noise(wp*0.32 + t*0.03)*6.2832 + ndv*4.0 + vH*2.0;
    wlFilm = 0.5 + 0.5*cos(ph + vec3(0.0, 2.1, 4.2));
    body = mix(body, body*0.6 + wlFilm*0.06, wlOil*0.3);
  }
  vec3 col = mix(body, refl, F) + spec;
  col += wlFilm * wlOil * (0.012 + 0.1*pow(1.0-ndv, 2.5)) * (0.15 + 0.85*uDay);
  if (uWl > 0.5) col = mix(col, col*0.82, wlOil*0.2);
  // 泡沫：浪尖 + 船身周圍
  float fn = noise(wp*1.3 + vec2(t*0.1, -t*0.07)) * 0.6 + noise(wp*4.1 - t*0.2)*0.4;
  float foam = smoothstep(0.94, 1.05, crest + (fn-0.5)*0.3) * 0.16;
  vec2 aq = vWorld.xz - uArk.xy; float ac = cos(uArk.z), as_ = sin(uArk.z); float dx = uArk.w + aq.x*ac - aq.y*as_, dz = abs(aq.x*as_ + aq.y*ac);
  float hw = hullHW(dx);
  float dd = dz - hw;
  float outside = (hw > 0.0) ? dd : length(vec2(dx < ${SHIP_CX.toFixed(2)} ? dx - ${HULL_XS.toFixed(2)} : dx - ${HULL_TIP.toFixed(2)}, dz));
  float ring = 0.0;
  if (uHullOn > 0.5) { ring = smoothstep(1.7, 0.1, outside) * smoothstep(-8.0, 0.0, outside) * (0.25 + 0.6*fn); }
  else if (uSmallOn > 0.5) { vec2 pp = wp - uSmall.xy; float cc = cos(uSmall.z), ss = sin(uSmall.z); vec2 lq = vec2(pp.x*cc - pp.y*ss, pp.x*ss + pp.y*cc) / uSmall.w; vec2 q2 = vec2(lq.x / 1.0, lq.y / 0.34); float rr = length(q2); ring = smoothstep(1.55, 1.0, rr) * smoothstep(0.55, 1.0, rr) * (0.25 + 0.6*fn); }
  foam = max(foam, ring*0.55);
  vec3 foamCol = mix(vec3(0.8,0.88,0.92), uHorizon*1.1+0.1, 0.25) * (0.06 + 0.94*uDay);
  col = mix(col, foamCol, clamp(foam,0.0,1.0));
  // 霧
  float f = 1.0 - exp(-pow(vDist*uFogD, 2.0));
  col = mix(col, uFog, clamp(f,0.0,1.0));
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

function buildPolarGrid(rings, segs, rMax, rLin) {
  const pos = []; const idx = [];
  // 徑向：近處等距，遠處指數
  const radii = [0];
  const nLin = Math.floor(rings * 0.62);
  for (let i = 1; i <= nLin; i++) radii.push((i / nLin) * rLin);
  const nExp = rings - nLin;
  for (let i = 1; i <= nExp; i++) radii.push(rLin * Math.pow(rMax / rLin, i / nExp));
  pos.push(0, 0, 0);
  for (let r = 1; r < radii.length; r++) for (let s = 0; s < segs; s++) {
    const a = (s / segs) * Math.PI * 2; pos.push(Math.cos(a) * radii[r], 0, Math.sin(a) * radii[r]);
  }
  for (let s = 0; s < segs; s++) idx.push(0, 1 + ((s + 1) % segs), 1 + s);
  for (let r = 1; r < radii.length - 1; r++) for (let s = 0; s < segs; s++) {
    const a = 1 + (r - 1) * segs + s, b = 1 + (r - 1) * segs + ((s + 1) % segs), c = 1 + r * segs + s, d = 1 + r * segs + ((s + 1) % segs);
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), rMax * 1.1);
  return g;
}

export class Ocean {
  constructor(scene, env, quality) {
    this.env = env;
    const U = env.uniforms;
    this.uniforms = {
      uTime: { value: 0 }, uAmp: { value: 1 }, uDetail: { value: quality.waterDetail },
      uW: { value: WAVES.map((w) => new THREE.Vector4(w.dx, w.dz, w.k, w.A)) },
      uWs: { value: WAVES.map((w) => w.w) },
      uDeep: { value: env.waterDeep }, uShallow: { value: env.waterShallow },
      uZenith: U.uZenith, uHorizon: U.uHorizon, uGlow: U.uGlow, uSunDir: U.uSunDir, uSunCol: U.uSunCol, uMoonDir: U.uMoonDir,
      uFog: { value: scene.fog.color }, uFogD: { value: 0.0005 }, uDay: U.uDay, uMoonVis: U.uMoonVis, uSunVis: U.uSunVis,
      uShipHL: { value: (HULL_XB - HULL_XS) / 2 }, uShipHW: { value: 12.3 },
      uWl: { value: WL_ON ? 1 : 0 }, uHullOn: { value: 1 }, uOrg: { value: new THREE.Vector2(0, 0) }, uArk: { value: new THREE.Vector4(SHIP_CX, 0, 0, SHIP_CX) }, uSmallOn: { value: 0 }, uSmall: { value: new THREE.Vector4(0, 0, 0, 12) },
    };
    this.mat = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: vert, fragmentShader: frag, fog: false });
    this.scene = scene; this.build(quality);
  }
  build(q) {
    if (this.mesh) { this.scene.remove(this.mesh); this.mesh.geometry.dispose(); }
    const g = buildPolarGrid(q.oceanRings, q.oceanSegs, 5200, 170);
    this.mesh = new THREE.Mesh(g, this.mat); this.mesh.position.set(this.uniforms.uOrg.value.x, 0, this.uniforms.uOrg.value.y); this.mesh.frustumCulled = false; this.mesh.renderOrder = -1;
    this.scene.add(this.mesh); this.uniforms.uDetail.value = q.waterDetail;
  }
  /** 海面網格跟著鏡頭走（波浪以世界座標計算，所以看不出來）；母船駕駛時才會離開原點。 */
  follow(x, z) { this.mesh.position.set(x, 0, z); this.uniforms.uOrg.value.set(x, z); }
  update(time, waveAmp) {
    this.uniforms.uTime.value = time; this.uniforms.uAmp.value = waveAmp;
    this.uniforms.uFogD.value = this.env.scene.fog.density;
  }
}
