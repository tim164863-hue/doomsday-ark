import * as THREE from 'three';
import { clamp, lerp, smoothstep } from '../util.js';

const C = (r, g, b) => new THREE.Color(r, g, b);
const tmpA = new THREE.Color(), tmpB = new THREE.Color();
const mix = (out, a, b, t) => out.copy(a).lerp(b, clamp(t, 0, 1));

const skyVert = /* glsl */`
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  vec4 p = modelViewMatrix * vec4(position,1.0);
  gl_Position = projectionMatrix * p;
  gl_Position.z = gl_Position.w; // 永遠在最遠處
}`;
const skyFrag = /* glsl */`
precision highp float;
varying vec3 vDir;
uniform vec3 uZenith, uHorizon, uGlow, uSunDir, uMoonDir, uSunCol;
uniform float uStars, uTime, uSunVis, uMoonVis, uCloudCover, uQual, uDay;
float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash2(i),hash2(i+vec2(1,0)),f.x), mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ if(float(i)>=uQual) break; s+=a*noise2(p); p=p*2.03+17.1; a*=.5; } return s; }
void main(){
  vec3 d = normalize(vDir);
  float y = d.y;
  vec3 col = mix(uHorizon, uZenith, pow(clamp(y,0.0,1.0), 0.55));
  if (y < 0.0) col = mix(uHorizon, uHorizon*0.7, clamp(-y*4.0,0.0,1.0));
  // 太陽光暈
  float sd = max(dot(d, uSunDir), 0.0);
  col += uGlow * (pow(sd, 6.0)*0.35 + pow(sd, 48.0)*0.5) * uSunVis;
  float disk = smoothstep(0.9996, 0.9999, sd);
  col += uSunCol * disk * 4.0 * uSunVis;
  // 星空
  if (y > -0.02 && uStars > 0.01) {
    vec3 p = d*220.0; vec3 id=floor(p); vec3 f=fract(p)-0.5;
    float h = hash(id); float st = step(0.965, h) * smoothstep(0.42, 0.0, length(f));
    float tw = 0.65 + 0.35*sin(uTime*(1.5+h*4.0)+h*60.0);
    vec3 p2 = d*70.0; vec3 id2=floor(p2); vec3 f2=fract(p2)-0.5; float h2=hash(id2+7.0);
    float st2 = step(0.985, h2) * smoothstep(0.35,0.0,length(f2)) * 1.6;
    vec3 sc = mix(vec3(0.7,0.8,1.0), vec3(1.0,0.9,0.75), fract(h*91.0));
    // 銀河
    vec3 bn = normalize(vec3(0.35,0.55,0.75));
    float band = exp(-pow(dot(d,bn)*3.2, 2.0));
    float mw = band * (0.25 + 0.75*noise2(d.xz*9.0+d.y*5.0)) * 0.22 * uQual/5.0;
    col += (sc*(st*tw + st2*tw)*1.4 + vec3(0.45,0.5,0.8)*mw) * uStars * smoothstep(-0.02,0.12,y);
  }
  // 月亮
  float md = dot(d, uMoonDir);
  float mdisk = smoothstep(0.99935, 0.99965, md);
  vec3 mcol = vec3(0.92,0.94,1.0) * (0.75 + 0.25*noise2(d.xz*400.0 + d.y*300.0));
  col = mix(col, mcol*1.25, mdisk * uMoonVis);
  col += vec3(0.35,0.42,0.7) * (pow(max(md,0.0), 90.0)*0.35 + pow(max(md,0.0), 14.0)*0.06) * uMoonVis;
  // 雲
  if (y > 0.015 && uCloudCover > 0.01) {
    vec2 q = d.xz / (y + 0.14) * 0.9 + vec2(uTime*0.004, uTime*0.0015);
    float n = fbm(q*1.6);
    float dens = smoothstep(1.0 - uCloudCover, 1.0 - uCloudCover + 0.28, n) * smoothstep(0.015, 0.22, y);
    float lit = 0.55 + 0.45*clamp(dot(normalize(vec3(d.x,0.3,d.z)), uSunDir)*0.5+0.5, 0.0, 1.0);
    vec3 cc = mix(uHorizon*0.55+vec3(0.05), vec3(1.0)*uDay + uGlow*0.9*(1.0-uDay)*0.6 + vec3(0.06,0.07,0.12), lit);
    cc = mix(cc, uGlow*1.1+uHorizon*0.4, pow(sd, 3.0)*0.7*uSunVis);
    col = mix(col, cc, dens*0.92);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export class Environment {
  constructor(scene, renderer, quality) {
    this.scene = scene; this.renderer = renderer; this.q = quality;
    this.uniforms = {
      uZenith: { value: new THREE.Color() }, uHorizon: { value: new THREE.Color() }, uGlow: { value: new THREE.Color() },
      uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uMoonDir: { value: new THREE.Vector3(0, -1, 0) }, uSunCol: { value: new THREE.Color(1, 1, 0.9) },
      uStars: { value: 0 }, uTime: { value: 0 }, uSunVis: { value: 1 }, uMoonVis: { value: 0 }, uCloudCover: { value: 0.5 }, uQual: { value: 5 }, uDay: { value: 1 },
    };
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.ShaderMaterial({
      uniforms: this.uniforms, vertexShader: skyVert, fragmentShader: skyFrag, side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false,
    }));
    this.sky.scale.setScalar(6000); this.sky.renderOrder = -10; this.sky.frustumCulled = false;
    scene.add(this.sky);
    scene.fog = new THREE.FogExp2(0x9ab6d0, 0.0005);

    this.sun = new THREE.DirectionalLight(0xffffff, 2.5);
    this.sun.castShadow = quality.shadows > 0;
    this.moon = new THREE.DirectionalLight(0x8fa8ff, 0.3);
    this.hemi = new THREE.HemisphereLight(0xbcd8ff, 0x405060, 0.7);
    scene.add(this.sun, this.sun.target, this.moon, this.moon.target, this.hemi);
    this.configureShadow();

    // 夜間燈光材質（船上所有燈具共用）
    this.lampMat = new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffd89a, emissiveIntensity: 0, roughness: 0.4 });
    this.windowMat = new THREE.MeshStandardMaterial({ color: 0x1a2430, emissive: 0xffd48a, emissiveIntensity: 0, roughness: 0.2 });
    this.shadowFocus = new THREE.Vector3();
    this.state = {};
    this.palette = {
      zenDay: C(0.16, 0.40, 0.78), zenNight: C(0.008, 0.014, 0.05), zenDusk: C(0.14, 0.17, 0.42),
      horDay: C(0.66, 0.80, 0.93), horNight: C(0.035, 0.055, 0.11), horDusk: C(1.0, 0.50, 0.26),
      glowDusk: C(1.0, 0.45, 0.16), glowDay: C(1.0, 0.85, 0.6),
    };
    this.waterDeep = new THREE.Color(); this.waterShallow = new THREE.Color();
    this.sunDir = new THREE.Vector3(); this.moonDir = new THREE.Vector3();
  }
  configureShadow() {
    const s = this.sun.shadow; const n = this.q.shadows;
    if (!n) { this.sun.castShadow = false; return; }
    this.sun.castShadow = true;
    s.mapSize.set(n, n); const r = 38;
    Object.assign(s.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: 260 });
    s.camera.updateProjectionMatrix(); s.bias = -0.0006; s.normalBias = 0.04;
    if (s.map) { s.map.dispose(); s.map = null; }
  }
  setQuality(q) { this.q = q; this.configureShadow(); this.uniforms.uQual.value = q.cloudOctaves; }

  /** t01: 0..1（0=午夜,0.25=日出,0.5=正午,0.75=日落） */
  update(t01, time, camera, focus) {
    const ang = (t01 - 0.25) * Math.PI * 2;
    const e = Math.sin(ang);               // 太陽高度 -1..1
    this.sunDir.set(Math.cos(ang) * 0.82 , e, Math.cos(ang) * 0.57 + 0.0).normalize();
    // 太陽偏南（避開正上方），並讓日出日落在船的側面
    this.sunDir.set(Math.cos(ang) * 0.9, Math.max(e, -1) * 0.92 + 0.0, -0.35 + Math.cos(ang) * 0.1).normalize();
    this.moonDir.set(-Math.cos(ang) * 0.7 - 0.2, -e * 0.9 + 0.05, 0.55).normalize();
    const es = this.sunDir.y;
    const dayF = smoothstep(-0.1, 0.25, es);
    const duskF = Math.exp(-Math.pow(es / 0.2, 2));
    const nightF = 1 - smoothstep(-0.14, 0.08, es);
    const P = this.palette;
    const U = this.uniforms;
    mix(U.uZenith.value, P.zenNight, P.zenDay, dayF); mix(U.uZenith.value, U.uZenith.value, P.zenDusk, duskF * 0.55);
    mix(U.uHorizon.value, P.horNight, P.horDay, dayF); mix(U.uHorizon.value, U.uHorizon.value, P.horDusk, duskF * 0.85);
    mix(U.uGlow.value, P.glowDay, P.glowDusk, duskF);
    U.uSunDir.value.copy(this.sunDir); U.uMoonDir.value.copy(this.moonDir);
    U.uSunVis.value = smoothstep(-0.12, 0.0, es);
    U.uMoonVis.value = smoothstep(-0.02, 0.15, this.moonDir.y) * (1 - dayF * 0.9);
    U.uStars.value = clamp(nightF * 1.2, 0, 1) * smoothstep(0.1, -0.04, es + 0.0);
    U.uStars.value = clamp(1 - smoothstep(-0.2, 0.02, es), 0, 1);
    U.uTime.value = time; U.uDay.value = dayF;
    U.uCloudCover.value = this.q.clouds ? 0.52 : 0;
    U.uSunCol.value.setRGB(1, lerp(0.55, 0.96, smoothstep(0.0, 0.4, es)), lerp(0.25, 0.85, smoothstep(0.0, 0.4, es)));
    this.sky.position.copy(camera.position);

    // 光源
    const sunI = 3.1 * smoothstep(-0.04, 0.32, es);
    tmpA.setRGB(1, lerp(0.52, 0.95, smoothstep(0.0, 0.45, es)), lerp(0.28, 0.86, smoothstep(0.0, 0.45, es)));
    this.sun.color.copy(tmpA); this.sun.intensity = sunI;
    this.focusSet(focus);
    this.sun.position.copy(this.shadowFocus).addScaledVector(this.sunDir, 120);
    this.sun.target.position.copy(this.shadowFocus);
    this.moon.intensity = 1.25 * smoothstep(-0.02, 0.2, this.moonDir.y) * (1 - dayF);
    this.moon.position.copy(this.shadowFocus).addScaledVector(this.moonDir, 100); this.moon.target.position.copy(this.shadowFocus);
    this.hemi.color.copy(U.uZenith.value).lerp(U.uHorizon.value, 0.45).multiplyScalar(1.0).addScalar(0.04);
    this.hemi.groundColor.setRGB(0.22, 0.2, 0.2).lerp(tmpB.setRGB(0.05, 0.06, 0.1), nightF);
    this.hemi.intensity = lerp(0.78, 0.95, dayF) + duskF * 0.0;
    // 霧
    const fogCol = this.scene.fog.color.copy(U.uHorizon.value);
    fogCol.multiplyScalar(0.92);
    this.scene.fog.density = lerp(0.00062, 0.00042, dayF) * (1 + duskF * 0.4);
    this.scene.background = null;
    // 燈光
    this.lampMat.emissiveIntensity = 0.05 + nightF * 2.4;
    this.windowMat.emissiveIntensity = nightF * 1.6;
    // 水色
    mix(this.waterDeep, C(0.004, 0.014, 0.035), C(0.02, 0.125, 0.21), dayF);
    this.waterDeep.lerp(C(0.03, 0.06, 0.12), duskF * 0.25);
    mix(this.waterShallow, C(0.01, 0.03, 0.06), C(0.07, 0.31, 0.37), dayF);
    this.renderer.toneMappingExposure = lerp(1.3, 0.9, dayF);
    Object.assign(this.state, { es, dayF, duskF, nightF });
    return this.state;
  }
  focusSet(f) {
    if (!f) return;
    // 讓陰影視錐跟著焦點，量化以避免閃爍
    const q = 2; this.shadowFocus.set(Math.round(f.x / q) * q, Math.round(f.y / q) * q, Math.round(f.z / q) * q);
  }
}
