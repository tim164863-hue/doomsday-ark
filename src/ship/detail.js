// 程序化材質細節：不用貼圖，直接在 shader 以「世界座標」疊上磁磚縫、地毯纖維、木板縫、
// 柏油顆粒、船殼鋼板縫與鉚釘。因為用世界座標，合併後的方塊/平面不需要 UV 也不會被拉伸。
import * as THREE from 'three';

export const KIND = { tile: 1, carpet: 2, wood: 3, rubber: 4, grit: 5, court: 6, hull: 7, steel: 8, fabric: 9 };

const GLSL = /* glsl */`
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fade(vec2 g, float a, float b){ float w = max(fwidth(g.x), fwidth(g.y)); return 1.0 - smoothstep(a, b, w); }
vec3 detailColor(int kind, vec3 wp, vec3 n){
  bool top = abs(n.y) > 0.6;
  vec2 p = top ? wp.xz : vec2(abs(n.x) > abs(n.z) ? wp.z : wp.x, wp.y);
  float m = 1.0; float lines = 0.0;
  if (kind == 1) {                                     // 磁磚：0.6 m 方磚 + 勾縫 + 逐磚色差
    vec2 g = p / 0.6; vec2 f = fract(g); vec2 d = min(f, 1.0 - f); vec2 id = floor(g);
    float ln = 1.0 - smoothstep(0.0, 0.03 + max(fwidth(g.x), fwidth(g.y)), min(d.x, d.y));
    m = (0.955 + h21(id) * 0.09) * (1.0 - 0.30 * ln * fade(g, 0.2, 0.7));
  } else if (kind == 2) {                              // 地毯纖維
    vec2 g = p * 46.0; float a = fade(g, 0.25, 0.8);
    m = 1.0 + ((h21(floor(g)) - 0.5) * 0.13 + (vn(p * 3.0) - 0.5) * 0.08) * a;
  } else if (kind == 3) {                              // 木地板：0.19 m 板寬、隨機接縫、木紋
    float row = floor(p.y / 0.19); float off = h21(vec2(row, 3.0)) * 2.7;
    vec2 g = vec2((p.x + off) / 1.9, p.y / 0.19); vec2 f = fract(g); vec2 id = floor(g);
    float seam = 1.0 - smoothstep(0.0, 0.04 + max(fwidth(g.x), fwidth(g.y)) * 0.6, min(min(f.y, 1.0 - f.y), min(f.x, 1.0 - f.x) * 0.1));
    float grain = vn(vec2(p.x * 4.0 + id.y * 7.0, p.y * 55.0));
    m = (0.9 + h21(id) * 0.18) * (1.0 + (grain - 0.5) * 0.12 * fade(g, 0.3, 0.9)) * (1.0 - 0.34 * seam * fade(g, 0.2, 0.7));
  } else if (kind == 4) {                              // 橡膠跑道顆粒
    vec2 g = p * 70.0; m = 1.0 + (h21(floor(g)) - 0.5) * 0.10 * fade(g, 0.25, 0.8) + (vn(p * 1.7) - 0.5) * 0.05;
  } else if (kind == 5) {                              // 柏油/水泥：顆粒 + 髒污
    vec2 g = p * 55.0; m = 1.0 + (h21(floor(g)) - 0.5) * 0.14 * fade(g, 0.25, 0.8) + (vn(p * 0.9) - 0.5) * 0.14 + (vn(p * 3.3) - 0.5) * 0.06;
  } else if (kind == 6) {                              // 球場塗層
    vec2 g = p * 60.0; m = 1.0 + (h21(floor(g)) - 0.5) * 0.06 * fade(g, 0.25, 0.8) + (vn(p * 1.3) - 0.5) * 0.04;
  } else if (kind == 7) {                              // 船殼鋼板：垂直接縫 2.4 m、水平 1.2 m、鉚釘、鏽跡/潮痕
    vec2 g = vec2(wp.x / 2.4, wp.y / 1.2); vec2 f = fract(g); vec2 d = min(f, 1.0 - f);
    float w = max(fwidth(g.x), fwidth(g.y));
    float ln = (1.0 - smoothstep(0.0, 0.012 + w, d.x)) + (1.0 - smoothstep(0.0, 0.02 + w, d.y));
    vec2 rg = vec2(wp.x / 0.3, wp.y / 1.2); vec2 rf = fract(rg) - 0.5; float ry = min(f.y, 1.0 - f.y);
    float rivet = (1.0 - smoothstep(0.045, 0.085, length(vec2(rf.x * 0.3, (ry - 0.035) * 1.2)))) * (1.0 - smoothstep(0.1, 0.35, w));
    float stain = vn(vec2(wp.x * 0.25 + wp.z * 0.25, wp.y * 0.9)) * smoothstep(1.0, -0.8, wp.y);
    m = (1.0 - 0.16 * clamp(ln, 0.0, 1.0) * fade(g, 0.12, 0.5)) * (1.0 - 0.10 * rivet) * (1.0 - 0.16 * stain) * (0.97 + 0.06 * h21(floor(g)));
  } else if (kind == 8) {                              // 金屬：拉絲
    vec2 g = vec2(p.x * 3.0, p.y * 90.0); m = 1.0 + (vn(g) - 0.5) * 0.08 * fade(g, 0.3, 0.9);
  } else if (kind == 9) {                              // 織物
    vec2 g = p * 38.0; float wv = (sin(g.x * 6.2832) * sin(g.y * 6.2832)) * 0.5 + 0.5; m = 1.0 + (wv - 0.5) * 0.10 * fade(g, 0.15, 0.4) + (h21(floor(g * 0.5)) - 0.5) * 0.04;
  }
  return vec3(m);
}`;

/** 為材質加上世界座標程序化細節 */
export function applyDetail(mat, kind) {
  mat.userData.detailKind = kind;
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uKind = { value: kind };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vDWP; varying vec3 vDWN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvDWP = (modelMatrix * vec4(transformed, 1.0)).xyz; vDWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vDWP; varying vec3 vDWN; uniform int uKind;\n' + GLSL)
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= detailColor(uKind, vDWP, normalize(vDWN));');
  };
  mat.customProgramCacheKey = () => 'detail' + kind;
  mat.needsUpdate = true;
  return mat;
}
