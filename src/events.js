// 極簡事件匯流排與「系統」註冊點 —— 後續階段（登入存檔、資源、危機…）由此掛接
export const events = new EventTarget();
export const emit = (type, detail) => events.dispatchEvent(new CustomEvent(type, { detail }));
export const on = (type, fn) => { const h = (e) => fn(e.detail); events.addEventListener(type, h); return () => events.removeEventListener(type, h); };
// ctx.systems：每個系統 { name, update(dt, ctx) }。階段 2~4 的資源/危機/存檔系統從這裡註冊。
export const systems = [];
export function registerSystem(sys) { systems.push(sys); return sys; }
