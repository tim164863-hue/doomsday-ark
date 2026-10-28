// 角色挑選面板的小預覽圖：用一個臨時的離螢幕 renderer 把每位角色畫成透明背景的 PNG（只在開面板時畫一次，畫完立刻釋放 WebGL context，手機不吃資源）。
import * as THREE from 'three';
import { Avatar } from '../crew/avatar.js';
import { lookOf } from '../crew/characters.js';

const cache = new Map();
export function charPreviews(ids, W = 180, H = 230) {
  const need = ids.filter((id) => !cache.has(id));
  if (need.length) {
    let r = null;
    try {
      r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setSize(W, H, false); r.setPixelRatio(1); r.outputColorSpace = THREE.SRGBColorSpace; r.setClearColor(0x000000, 0);
      const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff, 0x8a96a8, 1.35)); const dl = new THREE.DirectionalLight(0xfff2dc, 2.2); dl.position.set(1.5, 3, 3); sc.add(dl);
      const cam = new THREE.PerspectiveCamera(26, W / H, 0.1, 20); cam.position.set(0.55, 1.36, 4.2); cam.lookAt(0, 0.8, 0);
      for (const id of need) {
        const av = new Avatar('prev:' + id, lookOf(id)); av.setPose('stand'); av.group.rotation.y = -0.35; sc.add(av.group);
        for (let i = 0; i < 4; i++) av.update(0.05, i * 0.05);
        r.render(sc, cam); cache.set(id, r.domElement.toDataURL('image/png')); sc.remove(av.group);
      }
    } catch (e) { for (const id of need) if (!cache.has(id)) cache.set(id, ''); }
    finally { if (r) { r.dispose(); try { r.forceContextLoss(); } catch (e) { /* ignore */ } } }
  }
  return Object.fromEntries(ids.map((id) => [id, cache.get(id) || '']));
}
