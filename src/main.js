import './style.css';
import { Game } from './game.js';
import { UI } from './ui/ui.js';
import { preloadAvatars } from './crew/avatar.js';
import { Play } from './play/play.js';
import { HUD } from './ui/hud.js';
import { initCloud, cloud } from './save/cloud.js';
import { bootSave, entryDecision, MODE_KEY } from './save/boot.js';
import { showEntry } from './ui/entry.js';
import { AccountUI, chooseSave } from './ui/account.js';
import { homeShip } from './sim/fleet.js';

const canvas = document.getElementById('gl');
const P = new URLSearchParams(location.search);
let game;
await Promise.all([preloadAvatars(), initCloud()]);
// 第一個畫面：沒登入、也沒選過訪客 → 先選 [Google 登入] / [訪客遊玩]（不再預設顯示 T董 的方舟）
{ const lm = localStorage.getItem(MODE_KEY); const dec = entryDecision({ user: cloud.user, mode: lm, params: P });
  if (dec === 'cloud' && lm !== 'google') localStorage.setItem(MODE_KEY, 'google');
  if (dec === 'ask') await showEntry({ cloud }); else if (dec === 'guest' && lm !== 'guest') localStorage.setItem(MODE_KEY, 'guest'); }
const boot = await bootSave({ cloud, choose: chooseSave, fresh: !!P.get('fresh'), demo: !!P.get('demo') });
try {
  // 非擁有者（訪客／其他帳號）的家 = 自己選的小船；尚未選船（home=null）時只看海面，不顯示任何船體
  const ownerView = boot.owner || (import.meta.env.DEV && P.get('devowner') === '1'); // devowner 只在 vite dev 有效，正式版會被移除
  const hs = ownerView ? null : homeShip(boot.state && boot.state.fleet);
  game = new Game(canvas, { owner: ownerView, home: hs ? hs.type : null, homeLv: hs ? hs.lv : 1 });
} catch (e) {
  document.getElementById('loading').innerHTML = '<div class="ld-title">😢</div><div class="ld-sub">你的瀏覽器不支援 WebGL，無法啟動末日方舟</div>';
  throw e;
}
if (P.get('help') === '0') localStorage.setItem('ark.helped', '1');
window.ark = game;
const ui = new UI(game);
const play = new Play(game); const hud = new HUD(game); game.play = play; game.hud = hud;
await play.init(hud, boot);
new AccountUI(game, cloud, boot); game.boot = boot;
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
