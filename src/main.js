import './style.css';
import { Game } from './game.js';
import { UI } from './ui/ui.js';
import { preloadAvatars } from './crew/avatar.js';

const canvas = document.getElementById('gl');
const P = new URLSearchParams(location.search);
let game;
await preloadAvatars();
try {
  game = new Game(canvas);
} catch (e) {
  document.getElementById('loading').innerHTML = '<div class="ld-title">😢</div><div class="ld-sub">你的瀏覽器不支援 WebGL，無法啟動末日方舟</div>';
  throw e;
}
if (P.get('help') === '0') localStorage.setItem('ark.helped', '1');
window.ark = game;
const ui = new UI(game);
game.ds.start();

// 偵錯 / 截圖用的網址參數：?t=0.74 &cam=yaw,pitch,dist,x,y,z &mode=free|overview|follow &explode=1 &deck=2 &q=low|mid|high &demo=cycle|1
if (P.get('t')) game.setTime(+P.get('t'));
if (P.get('speed')) game.speed = +P.get('speed');
if (P.get('pause')) game.paused = true;
const c = game.controls;
if (P.get('mode')) c.setMode(P.get('mode'));
if (P.get('cam')) { const a = P.get('cam').split(',').map(Number); [c.yaw, c.pitch, c.dist] = a; if (a.length >= 6) { c.target.set(a[3], a[4], a[5]); if (c.mode === 'overview') c.tgtOver.set(a[3], a[4], a[5]); } }
if (P.get('explode')) game.ship.setExplode(+P.get('explode'));
if (P.get('deck') != null && P.get('deck') !== '') { const d = +P.get('deck'); game.player.actor.place(d, 12, 6, 0); }

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  if (!game.frozen) game.step(dt); game.render(); ui.update();
  requestAnimationFrame(loop);
}
requestAnimationFrame((t) => { last = t; loop(t); setTimeout(() => document.getElementById('loading').classList.add('done'), 300); });
