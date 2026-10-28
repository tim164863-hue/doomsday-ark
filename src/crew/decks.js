// 各「功能區」對應的甲板編號。方舟（5 層）是預設；小船只有一層甲板，啟動時把全部映射到 0（見 ship/smallship.js）。
export const D = { cabin: 0, gym: 1, work: 2, fun: 3, boss: 4 };
export function mapDecksTo(n) { for (const k of Object.keys(D)) D[k] = n; }
