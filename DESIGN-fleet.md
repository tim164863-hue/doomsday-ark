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

### 4.1 階段⑤ PvP：實作用的 Firestore 結構與**建議規則**（僅文字，**未部署**，沒有改任何 Firebase 專案設定）
實作已把第 3 節的草案收斂成下面兩組集合（與草案的差異見 DESIGN-expansion.md §5.2）：
```
presence/{uid}                 公開快照（任何登入者可讀；只有本人可寫；船東 uid 不得寫 = 船東永遠不會出現在別人的海圖上）
                               {v, h(匿名代號), x, y, fp, res{food,water,fuel,parts}, cap, sh(護盾到期), ls(最後上線), t, ut(伺服器寫入時間), cells[≤16], rt?}
                               （第 14 輪：移除 hl / cd；新增 ut；x / y 取整 10、ls 取整 10 分鐘、res 取整儲存上限的 5%）
raids/{defender}/in/{attacker}_{bucket}   突襲文件：唯一的「跨使用者寫入」。只能 create；只有攻守雙方可讀
                               {v, attacker, defender, b(12 小時桶 = floor(t/43200)), t, ah(攻擊者代號), loot{food,water,fuel,parts}, ap{x,y}}
```
**完整規則在 repo 的 [`firestore.pvp.rules`](./firestore.pvp.rules)**（提案檔；**沒有部署**，沒有改任何 Firebase 專案設定）。現行 / 已部署的 `firestore.rules`（只有 `arks/{uid}` + 其他全拒）與 `firebase.json` 都沒動；`firestore.pvp.rules` 只被 `tools/rules-emulator` 的本機模擬器載入。要上線時由人工比對後再貼上，**不要讓任何自動流程部署這個檔**。它包含原封不動的 `arks` 規則，所以上線時是「整份取代」而不是「疊加」。

規則重點（對應審查第 13 輪的 5 項規則修正；全部由模擬器測試涵蓋，見下）：
| 項目 | 規則 |
|---|---|
| ① create / update 拆開 | `presence` 的 `create` 不讀 `resource`（create 時 `resource` 是 null，舊寫法 `resource.data.keys()` 會讓每一次第一次寫入都被拒絕）；`update` 另外要求 `request.time - resource.data.ut >= duration.value(10, 's')`（寫入頻率下限；**第 14 輪必修**：舊寫法比的是客戶端自己填的 `t`，`t = now-100` 連寫三次都過了。現在每份文件都必須帶 `ut`，且 `d.ut == request.time`（客戶端寫 `serverTimestamp()`），頻率只比對上一次的 `ut`） |
| ② 四種資源都有上限 | `loot.food / water / fuel / parts` 各自 ≤ 防守者 presence 的 8%、≤ `cap`（與 JS 鏡像一致） |
| ③ 欄位驗證 | presence：key 白名單 + 必備欄位、`h` 1–12 字、座標 0–2000、`fp` ≤ 200、`cap` ≤ 1000（`hl` / `cd` 第 14 輪移除，現在算多餘欄位）、`ut == request.time`、`res` 4 個鍵各 0–2000、`t` 在伺服器時間 ±120 秒、`ls` ∈ [t−1 天, t+600]（客戶端把 ls 進位到 10 分鐘）、`sh` ∈ [0, now+12 小時+120 秒]、`cells` 1–16 個 `"NN_NN"` 字串（每個 ≤ 5 字）、`rt`（若有）6 個數字欄位、`t1 ≥ t0`。raid：`v == 1`、`ah` ≤ 12 字、`ap` 只有 `x`、`y` 且是 0–2000 的數字、`loot` 只有 4 個鍵、每個是 0–400 的整數 |
| ④ 讀取拆開 | `presence`：`get`（登入者）與 `list`（要求 `request.query.limit <= 24`；沒帶 limit = 拒絕）；收件匣 `list` 只有防守者本人、`limit <= 60`。客戶端查詢（`firestorePvp.near / raidsFor`）永遠帶 `limit`，並夾在 24 / 60 以內 |
| ⑤ 攻擊者自己的 presence | raid 的 create 要 `get` 攻擊者的 `presence/{attacker}`：必須存在、`t` 與 `ls` 不早於 raid 的 `t` 15 分鐘、宣稱座標 `ap` 與它距離 ≤ 80 + 60、它與防守者的距離 ≤ 80 + 60。客戶端在送 raid 前先強制發佈一次 presence（`PvpClient.flush(s, own)`）。另外 `sh <= now + 12 小時` ⇒ 沒有永久護盾 |

`src/save/pvpnet.js` 的 `ruleCheckPresence / ruleCheckRaid / presenceShape` 是這份規則的 JS 鏡像（記憶體假後端用它模擬「被規則擋下」，`tools/pvp-test.mjs` 用偽造文件驗證兩邊界線一致）；`RULE` 常數集中放了界線。**真正的依據是模擬器測試**：
```
cd tools/rules-emulator && npm install          # firebase-tools + @firebase/rules-unit-testing（需要 Java 11+ 給模擬器）
npm test                                         # = 把 ../../firestore.pvp.rules 複製進本目錄 → firebase emulators:exec --only firestore → node rules.test.mjs
```
用的是 demo 專案（`demo-ark-rules`），模擬器完全在本機；不連雲端、不需要登入、不碰任何真實專案。

**跨使用者寫入（免費方案下怎麼運作）**
- 整個 PvP 只有**一種**跨使用者寫入：攻擊者在防守者的收件匣 `raids/{defender}/in/{attacker}_{bucket}` **create** 一份文件。沒有任何人能寫別人的 `arks/{uid}` 或 `presence/{uid}`。
- 防守者（本人）上線時讀自己的收件匣，把新文件抄進自己的存檔 `fleet.world.pv.in`（以 id 去重），再由 `simulateTo → pvTick` **決定性**結算（`f(seed, 時間, 收件匣)`；與一次補算 / 分段補算 / 逐 tick 結果完全相同，已有測試）。防守者**不需要、也不會**寫任何別人的文件，所以不需要伺服器、也不需要 Cloud Functions。
- 子集合放在防守者底下（`raids/{defender}/in/…`）是為了讓「讀自己的收件匣」只是一個 `where t >= since` 單欄位查詢（不需要複合索引）。附近玩家掃描則是對 `presence` 的 `cells array-contains-any`（單欄位，不需要複合索引）。
- 成本（Spark 配額 5 萬讀 / 2 萬寫 / 天）：每位玩家每 5 分鐘最多寫 1 次 presence（只有位置 / 資源明顯變動才寫）、掃描最多每 45 秒 1 次且手動 / 開海圖時才做（≤24 篇讀取）、收件匣 2 分鐘輪詢 1 次（空的時候 0 篇讀取，1 次查詢計 1 次讀取）、每次突襲 create 時規則內的 `get()` 多 1 次讀取。
- **被規則擋不下的事（所以防不了作弊）**：規則看不到戰鬥，無法證明攻擊者真的打贏守衛艦；`ap`（攻擊者座標）、`presence` 內容都是用戶端自己填的；攻擊者拿到的戰利品不會因為防守者那邊實際被上限 / 護盾擋下而扣回（所以防守者的實際損失 ≤ 宣稱值；為了避免通膨，宣稱值本身就被限制在 8% / `lootCap`）。最壞情況：惡意攻擊者可以對**離線且沒護盾**的人，每個 12 小時桶宣稱一次上限內的戰利品；防守者端再用「每次 8%、每日 20%、12 小時護盾、船體最低 50%」把實際損失鎖死。若要防作弊，只能升級 Blaze + Cloud Functions 做權威結算。
- **客戶端對應修正**：`pvIngest` 丟掉 `t > 現在 + 300 秒` 的文件（否則 24 份未來時間的文件能永遠塞滿收件匣）；raid 的 12 小時桶 `b` 在 `raidSubmit`（送出）當下才算，並且本機的「這個桶打過了」記錄用同一個桶（跨桶的突襲不會事後被規則擋掉）。
- **已知限制**：raid 文件的 `t` 要在伺服器時間 ±120 秒內才會被規則接受；離線時贏了、超過 2 分鐘才連上網的文件會被規則擋掉，客戶端把「被規則永久拒絕」的文件從 outbox 丟掉（戰利品在本機已經拿了）。要不要放寬 / 改成伺服器時間戳是待 Tim 決定的取捨（沒有動）。
- presence 會對所有登入者公開「取整的資源快照（儲存上限的 5%）+ 取整到 10 單位的位置 + 匿名代號 + 取整到 10 分鐘的最後上線時間」；不含 uid 以外的身分資訊、不含 email / 名稱。

**第 14 輪（保守預設值，Tim 之後可再調；細節見 DESIGN-expansion.md §5.4）**
- 規則：presence 新增 `ut`（`== request.time`），update 頻率比 `request.time - resource.data.ut >= 10 秒`；移除 `hl` / `cd`；`ls ≤ t + 600`；raid 桶 = `int(t / 43200)`（12 小時）；raid create 另外要求防守者 `ls ≥ t − 7 天`；presence `get` 讀不到 `ls` 超過 7 天的文件。**`list` 沒辦法用 `ls` 過濾**（要複合索引 = 要改專案索引設定，這輪不動），所以「掃描時不列出超過 7 天的幽靈船」由客戶端過濾，真正擋得住的是 raid create 與 `get`。
- **TTL 沒有設定**（這輪不碰任何 Firebase 專案設定）：過期的 `presence` / `raids` 文件會一直留著，直到本人隱身 / 登出時刪掉自己的 presence；raids 收件匣沒有自動清除。
- **規則仍然是提案、沒有部署**；模擬器 175 項。

## 5. 世界地圖、海圖、駕駛（Milestone 4）
- `src/sim/world.js`：區域格網、迷霧位元集、出生點、方舟位置與航行（`worldTick` 由 `stepTick` 呼叫，離線補算與線上一致）。
- `src/sim/seaevents.js`：海上事件與選項，結果由 `hash(seed, ship, n, choice)` 決定。
- 存檔：`fleet.world`、`fleet.pilot`、任務的 `from/to/ev` 皆為可選欄位，舊存檔相容。
- 駕駛：`play.startPilot/updatePilot`（不影響模擬，只有撿箱子有每日上限 80）。
- 吉祥物：不屬於模擬，純前端，不存檔。

## 6. 小船之家（非擁有者）
- `fleet.home`（選填，船 id）= 旗艦；沒有就用 `fleet.pick` 那艘，再不然第一艘可當家的船（`homeShip`）。`sanitizeFleet` 只保留有效的整數 id；潛艇不能當旗艦；出海中 / 建造中不能換。
- 沒有選船（`home=null`）→ `Game` 不建立任何船體，只有海面。擁有者路徑不變。
- 場景裡只有一層甲板（所有 `D.*` 層索引映射到 0）；船員人數 = `min(虛擬船員, spec.cap)`。旗艦出海任務時整艘船（含船員）一起航行，鏡頭跟隨。
- 精簡桌：`placeDesks` 先試標準桌（`FP.desk`），放不下才用 `FP.deskC`（`opts.compact`），保證桌數 = `spec.desks`。
- 小船人物標籤：`ui.js` 對 `game.small` 使用較近的 far / mid 門檻（28 / 20 m，大船 70 / 36 m）。

## 7. 遊玩與船員互動
- 小遊戲：`MiniGame`（`src/ui/minigame.js`）+ `Games`（`src/play/games.js`）；邀請由 `decide()`（`R.inviteChance` + 同分鐘固定的 `inviteRoll`）決定。
- 關係：`sim/rel.js` 的 `s.rel = { aff, feud, cool, party, cel, best }`，皆為選填、`sanitize` 後才存；離線模擬為決定性，不使用 `Math.random`。演出層 `crew/social.js` 只把已發生的事演出來，並把船員之間的小互動 `R.bump` 回交情。
- 驗證：`tools/rel-test.mjs`、`tools/rellines-test.mjs`、`tools/walk.cjs`。
- Firestore 規則（僅文字，尚未部署）：`rel` 為 `users/{uid}/ark` 文件內的 map，欄位大小限制同存檔；不新增集合。
- PvP 作弊風險：目前所有計時小遊戲成績只存在本機 / 自己的存檔，沒有排行榜；若日後加入排行榜或 PvP，成績必須由伺服器重算或只當展示，不可作為資源來源。

## 8. 駕駛母船與樓層檢視
- `src/play/helm.js`（`Helm`）+ `src/play/helmphys.js`（純函式：`helmStep` 物理、`toWorld`/`toLocal`、`HELM_K`）。測試：`node tools/helm-test.mjs`。
- 母船姿態 = `H = {x, z, yaw}`（樞軸＝船中心；擁有者方舟樞軸在 `SHIP_CX`，小船在 0）。根節點位置 `H − Ry(yaw)·pivot`；`Ship.yawOff / lean`（`rotation.order = 'YXZ'`）與 `SmallShip.lean` 負責航向與傾斜，波浪搖晃不受影響。
- 艦隊其他船（`fleetPose`）、探索小艇（`boatPose`）、領航小船的邊界／返港、展示台都經 `helm.world()` 放進母船座標系，所以母船被開走後它們仍在身邊。
- 海面：頂點著色器用 `uOrg` 把波浪相位換成世界座標，網格跟著鏡頭走（不再被 5200 單位的海面邊界限制）；`uArk` 讓方舟船殼的泡沫環跟著船。
- 地圖耦合：位移向量 × `HELM_K` 推 `fleet.world.pos`（1 Hz 批次，`syncWorld`），`insideWorld` 擋住世界邊界；不改 `worldTick`、不影響離線模擬。本地偏移不存檔（重開機後船回到出發點，位置以海圖為準）。
- 樓層檢視：`Game.updateDecks()` 單層模式也顯示「被選的層 + 以下所有層」，船殼剖面帶 `k < 被選層`。
