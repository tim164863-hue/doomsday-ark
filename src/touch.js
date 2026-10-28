/** 觸控裝置的提示文字：把「按 E」改成「點按鈕」（鍵盤裝置不變）。body.touch 由 controls 設定。 */
export const isTouchUI = () => typeof document !== 'undefined' && document.body.classList.contains('touch');
export const tt = (s) => (isTouchUI() ? String(s).replace(/按 ?E ?[\/／] ?空白(?: ?[\/／] ?點一下)? ?/g, '點按鈕').replace(/按 ?E ?[\/／] ?點一下/g, '點按鈕').replace(/按 ?E\b ?/g, '點按鈕').replace(/指針掃到綠(?:色)?區(?:塊)?時點按鈕/g, '指針到綠區時點按鈕') : s);
