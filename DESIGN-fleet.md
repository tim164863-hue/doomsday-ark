# 艦隊與世界地圖設計（Fleet & World design）

只用 Firebase Spark 免費方案：沒有 Cloud Functions、沒有 Blaze。所有遊戲邏輯在客戶端、純函式、可重現。

## 1. 艦隊資料模型（已實作）
`src/sim/fleetdefs.js`（靜態定義）＋ `src/sim/fleet.js`（邏輯）。存檔欄位 `state.fleet`（選填，加性，`SAVE_VERSION` 仍為 1；舊檔沒有 fleet 會自動補）。

```
fleet = {
  v: 1, flagship: 'cruise'|null, pick: 'owner'|'pending'|'done',
  bp: { speedboat:1, tug:1, ... },       // 已取得藍圖（skiff 免藍圖）
  ships: [ { id, type, name, lv(1..3), hp, fuel, state:'idle'|'build'|'sail'|'dock',
             build:{start,end}, m:{zone,start,end,fuel,res,dmg,fail,bp}, auto:true, zone:'auto'|zoneId, n } ],
  world: { spawn, fog, seen, pos }        // 佔位：下一步（共享地圖）使用
}
```
- 6 種船：小漁船、快艇、打撈拖船、潛水艇、武裝巡邏艇、破冰船；各有速度／載貨／耐久／火力／可航海域／造價／建造時間／升級（Lv1~3）。
- 建造 = 資源 + 稀有藍圖；藍圖由閒置任務或船員外出探索掉落（`TRIP_BP`、各海域 `bpChance`）。只有小漁船免藍圖。
- 艦隊上限 6；Tim（owner）旗艦是郵輪，並可建小船成艦隊；其他帳號進遊戲會跳出「選一艘小船」畫面（小漁船／快艇／拖船，並授予該型藍圖）。
- 閒置任務：`auto` 開啟時，船在港且 hp≥50、燃料≥任務耗油+15 就依戰力自動挑海域出海；任務結果在出發時由 `mulberry32(hash(seed,'fm',shipId,n))` 決定，所以線上與離線（`stepTick`，最多 48 小時）完全一致。
- 3D：`src/ship/fleetmodels.js` 每型一個精緻模型（Lv2/Lv3 有額外裝備），可在艦隊面板按「檢視」到展示平台旁看；停泊在方舟旁，出海時沿著海域方向駛離再回來。

## 2. 世界地圖設計（尚未實作，資料已預留）
- 海域：近海 `near`、珊瑚礁 `reef`、廢墟城市 `ruins`、冰海 `ice`、深淵 `abyss`；`ZONES[*].ring` 為預留的同心環半徑。
- 共享世界：種子固定的格狀地圖，戰爭迷霧（`fog` 位元圖，只記錄自己探索過的格）；出生點放在彼此相距很遠的環上（`spawn`，由 uid 雜湊決定）。
- 可選即時海圖：玩家可打開海圖看艦隊位置並對事件（遇襲、漂流物）做決定；T董可以親自駕一艘小船。
- 目前 `fleet.world` 只存 `{spawn, fog, seen, pos}` 佔位，不影響現有玩法。

## 3. 未來 Firestore 結構與規則（僅文字，**未部署**）
```
arks/{uid}                    既有：自己讀寫（目前規則）
presence/{uid}                {name, x, y, zone, power, t}      公開讀；只有本人寫；t 必須接近 request.time
trades/{id}                   {from,to,give,want,status,t}       from/to 雙方可讀；from 建立、to 更新 status
gifts/{id}                    {from,to,res,t}                    收件者可讀；寄件者只能建立，數量上限
raids/{id}                    {attacker,defender,power,loot,t}   攻守雙方可讀；loot 必須 <= 守方資源 * 0.1
```
建議規則重點：
1. `presence` 只有本人可寫，欄位型別/範圍檢查，`request.time` 限制寫入頻率（`t > resource.data.t + 10s`）。
2. `trades/gifts` 單筆數量上限（例如每項 ≤ 200），每日總量由 `arks/{uid}.daily` 計數並在規則中以 `getAfter` 檢查。
3. `raids` 離線被襲擊最多掠奪守方資源的 10%、每 24 小時最多一次（以 `arks/{uid}.lastRaided` 判斷）。
4. 僅開放讀取他人 `arks/{uid}` 的公開摘要子文件（`arks/{uid}/pub/summary`），不開放整份存檔。

## 4. PvP 在 Spark 上的作法與作弊風險
- 只能用 Firestore + 客戶端模擬：自動戰鬥用雙方公開戰力與種子在雙方客戶端各自重算；線上時可手動下指令。
- **作弊風險**：沒有伺服器權威（無 Cloud Functions），惡意客戶端可竄改自己的存檔與上傳的結果；規則只能做「上限、頻率、型別」檢查，不能驗證戰鬥過程。因此：離線襲擊限制在小比例（≤10%）、有冷卻、只掠奪資源不毀船，並把 PvP 當作「朋友間的玩法」而非排名競技。若日後要防作弊，需升級到 Blaze + Cloud Functions 做權威結算。

## 5. 世界地圖、海圖、駕駛（Milestone 4）
- `src/sim/world.js`：區域格網、迷霧位元集、出生點、方舟位置與航行（`worldTick` 由 `stepTick` 呼叫，離線補算與線上一致）。
- `src/sim/seaevents.js`：海上事件與選項，結果由 `hash(seed, ship, n, choice)` 決定。
- 存檔：`fleet.world`、`fleet.pilot`、任務的 `from/to/ev` 皆為可選欄位，舊存檔相容。
- 駕駛：`play.startPilot/updatePilot`（不影響模擬，只有撿箱子有每日上限 80）。
- 吉祥物：不屬於模擬，純前端，不存檔。
