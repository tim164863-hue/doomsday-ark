// 海面漂浮殘骸（末日廢土感）：木板 / 木箱 / 鐵皮，一個 InstancedMesh（1 draw call），跟著鏡頭「環狀重複」放置，隨波浪起伏、慢慢漂。
// 全部由程式生成（盒子 + 頂點色），沒有外部素材。?wl=0 關閉。
import * as THREE from 'three';
import { waveHeight, waveNormal } from './waves.js';
import { WL_ON } from '../ship/wasteland.js';

const SPAN = 300;                       // 重複的方塊大小（公尺）
const COLORS = [0x6b4a2e, 0x7a5a38, 0x4d4a44, 0x8a4a2a, 0x3d4650, 0x5a5648];
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export class Debris {
  constructor(scene, quality) {
    this.on = WL_ON; this.mesh = null; this.scene = scene; if (!this.on) return;
    const n = quality && quality.name === 'low' ? 26 : 52; this.n = n;
    const R = rng(20261029); this.d = [];
    for (let i = 0; i < n; i++) {
      const kind = R() < 0.55 ? 0 : R() < 0.6 ? 1 : 2;   // 0 木板 1 木箱 2 鐵皮
      this.d.push({ bx: R() * SPAN, bz: R() * SPAN, yaw: R() * 6.28, kind, s: 0.8 + R() * 0.9, ph: R() * 6.28, dx: (R() - 0.5) * 0.25, dz: (R() - 0.5) * 0.25, c: COLORS[(R() * COLORS.length) | 0] });
    }
    const g = new THREE.BoxGeometry(1, 1, 1); g.translate(0, 0.5, 0);
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0.1 });
    this.mesh = new THREE.InstancedMesh(g, m, n); this.mesh.frustumCulled = false; this.mesh.castShadow = false; this.mesh.receiveShadow = false; this.mesh.name = 'wl-debris';
    const col = new THREE.Color(); this.d.forEach((o, i) => { col.setHex(o.c); this.mesh.setColorAt(i, col); });
    this.mesh.instanceColor.needsUpdate = true; this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._e = new THREE.Euler(); this._p = new THREE.Vector3(); this._s = new THREE.Vector3(); this._n = new THREE.Vector3(); this._u = new THREE.Vector3(0, 1, 0); this._t = 0;
    scene.add(this.mesh);
  }
  /** fx, fz = 鏡頭焦點；keep = [{x,z,r}] 這些圓內不放（自己的船附近） */
  update(time, fx, fz, keep = []) {
    if (!this.mesh) return; if (time - this._t < 0.05) return; this._t = time;
    const half = SPAN / 2;
    for (let i = 0; i < this.n; i++) {
      const o = this.d[i];
      const ox = o.bx + o.dx * time, oz = o.bz + o.dz * time;
      const x = fx + ((((ox - fx + half) % SPAN) + SPAN) % SPAN) - half, z = fz + ((((oz - fz + half) % SPAN) + SPAN) % SPAN) - half;
      let hide = false; for (const k of keep) if (Math.hypot(x - k.x, z - k.z) < k.r) { hide = true; break; }
      const y = waveHeight(x, z, time) - 0.03 + (o.kind === 1 ? 0.0 : -0.02);
      waveNormal(x, z, time, this._n); this._q.setFromUnitVectors(this._u, this._n); this._e.set(0, o.yaw + Math.sin(time * 0.3 + o.ph) * 0.15, 0); const qy = new THREE.Quaternion().setFromEuler(this._e); this._q.multiply(qy);
      if (o.kind === 0) this._s.set(2.4 * o.s, 0.09, 0.38 * o.s); else if (o.kind === 1) this._s.set(0.7 * o.s, 0.55 * o.s, 0.7 * o.s); else this._s.set(1.6 * o.s, 0.04, 1.1 * o.s);
      if (hide) this._s.set(0, 0, 0);
      this._p.set(x, y, z); this._m.compose(this._p, this._q, this._s); this.mesh.setMatrixAt(i, this._m);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
