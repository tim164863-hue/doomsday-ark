// 船上的真實道具模型（Poly Haven CC0，見 ASSETS.md）：每種道具一個 InstancedMesh（每艘船每種 1 個 draw call），載入完成才出現；
// 載入失敗（或 ?wl=0）時改用 fallback 簡單幾何，所以沒有素材也不會缺東西。道具只放在艙頂 / 舷外，完全是視覺，不參與任何碰撞與走道。
import * as THREE from 'three';
import { loadProp, ART } from '../world/art.js';

const _m = new THREE.Matrix4(), _s = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3(0, 0, 1);
const qMount = (axis, n, roll) => { const q = new THREE.Quaternion().setFromUnitVectors(axis, n); return new THREE.Quaternion().setFromAxisAngle(n, roll || 0).multiply(q); };
/** list: [{ id, p: Vector3, q: Quaternion（或 n: 法線 + roll：把模型最薄的軸對齊法線，輪胎 / 救生圈用）, s: 縮放（1 = 模型原尺寸 × size[id]）, fb: (item) => Object3D | null }] */
export const PROP_SIZE = { metal_jerrycan: 0.5, barrel_03: 0.85, propane_tank: 0.62, old_tyre: 0.62, lifebuoy: 0.74, wooden_crate_02: 0.5, portable_generator: 0.7 };
// 以最長邊正規化成「公尺」，再乘 s
export function dressProps(model, list) {
  const by = new Map(); for (const it of list) { if (!by.has(it.id)) by.set(it.id, []); by.get(it.id).push(it); }
  const fallback = (arr) => { for (const it of arr) { const o = it.fb && it.fb(it); if (o) { o.position.copy(it.p); o.quaternion.copy(it.n ? qMount(_b, it.n, it.roll) : it.q); o.userData.wlParts = true; model.add(o); } } };
  for (const [id, arr] of by) {
    if (!ART.on) { fallback(arr); continue; }
    loadProp(id).then((P) => {
      if (!P) { fallback(arr); return; }
      const sz = P.box.getSize(new THREE.Vector3()); const norm = (PROP_SIZE[id] || 0.5) / Math.max(sz.x, sz.y, sz.z); const ctr = P.box.getCenter(new THREE.Vector3()); const axis = sz.x <= sz.y && sz.x <= sz.z ? _a.set(1, 0, 0) : sz.y <= sz.z ? _a.set(0, 1, 0) : _a.set(0, 0, 1); const ax = axis.clone();
      const T = new THREE.Matrix4(), M = new THREE.Matrix4();
      for (const part of P.parts) {
        const im = new THREE.InstancedMesh(part.geo, part.mat, arr.length); im.name = 'prop-' + id; im.userData.wlParts = true; im.receiveShadow = true; im.castShadow = false; im.frustumCulled = false;
        arr.forEach((it, i) => { const k = norm * it.s; _m.compose(it.p, it.n ? qMount(ax, it.n, it.roll) : it.q, _s.set(k, k, k)); /* sit（預設）：模型底面中心放在 p；sit:false：模型幾何中心放在 p（掛在舷側的輪胎 / 救生圈） */ T.makeTranslation(-ctr.x, it.sit === false ? -ctr.y : -P.box.min.y, -ctr.z); M.copy(_m).multiply(T).multiply(part.mw); im.setMatrixAt(i, M); });
        im.instanceMatrix.needsUpdate = true; model.add(im);
      }
    });
  }
}
