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
                               {v, h(匿名代號), x, y, fp, hl, cd, res{food,water,fuel,parts}, cap, sh(護盾到期), ls(最後上線), t, cells[≤16], rt?}
raids/{defender}/in/{attacker}_{bucket}   突襲文件：唯一的「跨使用者寫入」。只能 create；只有攻守雙方可讀
                               {v, attacker, defender, b(6 小時桶), t, ah(攻擊者代號), loot{food,water,fuel,parts}, ap{x,y}}
```
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    // 既有：match /arks/{uid} { allow read, write: if request.auth.uid == uid; }   ← 不變，別人永遠碰不到你的 arks/{uid}

    function nowS()     { return request.time.toMillis() / 1000; }
    function isOwner(u) { return u in ['<OWNER_UID>']; }                 // 與 src/save/cloud.js 的 OWNER_UIDS 相同
    function int0(v)    { return v is int && v >= 0; }

    match /presence/{uid} {
      allow read: if request.auth != null;                                  // 掃描附近：array-contains-any(cells) limit 24
      allow create, update: if request.auth.uid == uid && !isOwner(uid)     // 只有本人；船東不公開
        && request.resource.data.keys().hasOnly(['v','h','x','y','fp','hl','cd','res','cap','sh','ls','t','cells','rt'])
        && request.resource.data.v == 1
        && request.resource.data.h is string && request.resource.data.h.size() <= 8
        && request.resource.data.x is number && request.resource.data.x >= 0 && request.resource.data.x <= 2000
        && request.resource.data.y is number && request.resource.data.y >= 0 && request.resource.data.y <= 2000
        && request.resource.data.fp is number && request.resource.data.fp >= 0 && request.resource.data.fp <= 200
        && request.resource.data.cap is number && request.resource.data.cap <= 1000
        && request.resource.data.res.keys().hasOnly(['food','water','fuel','parts'])
        && request.resource.data.res.food <= 2000 && request.resource.data.res.water <= 2000
        && request.resource.data.res.fuel <= 2000 && request.resource.data.res.parts <= 2000
        && request.resource.data.cells is list && request.resource.data.cells.size() <= 16
        && request.resource.data.ls <= request.resource.data.t + 5
        && math.abs(request.resource.data.t - nowS()) <= 120                // t 必須接近伺服器時間
        && (!resource.data.keys().hasAny(['t']) || nowS() - resource.data.t >= 20);   // 寫入頻率下限
      allow delete: if request.auth.uid == uid;
    }

    match /raids/{defender}/in/{rid} {
      allow read: if request.auth != null
        && (request.auth.uid == defender || request.auth.uid == resource.data.attacker);
      allow create: if request.auth != null && !isOwner(request.auth.uid)
        && request.resource.data.keys().hasOnly(['v','attacker','defender','b','t','ah','loot','ap'])
        && request.resource.data.attacker == request.auth.uid               // 只能用自己的名義
        && request.resource.data.defender == defender && defender != request.auth.uid
        && rid == request.auth.uid + '_' + string(request.resource.data.b)  // 每個「攻擊者×目標×6 小時桶」只有一份（create-only ⇒ 無法重複）
        && request.resource.data.b is int && request.resource.data.b == int(request.resource.data.t / 21600)
        && math.abs(request.resource.data.t - nowS()) <= 120
        && request.resource.data.loot.keys().hasOnly(['food','water','fuel','parts'])
        && (!('food' in request.resource.data.loot)  || int0(request.resource.data.loot.food))
        && (!('water' in request.resource.data.loot) || int0(request.resource.data.loot.water))
        && (!('fuel' in request.resource.data.loot)  || int0(request.resource.data.loot.fuel))
        && (!('parts' in request.resource.data.loot) || int0(request.resource.data.loot.parts))
        // 與「被攻擊者自己公開的 presence 快照」比對（get 每次計 1 次讀取）：
        && exists(/databases/$(db)/documents/presence/$(defender))
        && get(/databases/$(db)/documents/presence/$(defender)).data.ls <= request.resource.data.t - 600     // 對方已離線 ≥10 分鐘
        && get(/databases/$(db)/documents/presence/$(defender)).data.sh <= request.resource.data.t           // 沒有護盾
        && request.resource.data.loot.get('food', 0)  <= get(/databases/$(db)/documents/presence/$(defender)).data.res.food  * 0.08
        && request.resource.data.loot.get('water', 0) <= get(/databases/$(db)/documents/presence/$(defender)).data.res.water * 0.08
        && request.resource.data.loot.get('fuel', 0)  <= get(/databases/$(db)/documents/presence/$(defender)).data.res.fuel  * 0.08
        && request.resource.data.loot.get('parts', 0) <= get(/databases/$(db)/documents/presence/$(defender)).data.res.parts * 0.08
        && request.resource.data.loot.get('food', 0) <= get(/databases/$(db)/documents/presence/$(defender)).data.cap   // 每種 ≤ lootCap
        && math.abs(request.resource.data.ap.x - get(/databases/$(db)/documents/presence/$(defender)).data.x) <= 140   // 宣稱座標在範圍內（80 + 60）
        && math.abs(request.resource.data.ap.y - get(/databases/$(db)/documents/presence/$(defender)).data.y) <= 140;
      allow update, delete: if false;                                       // 突襲文件寫了就不能改（也不能刪；過期靠客戶端忽略 + 日後手動清理）
    }
  }
}
```
（`cap` 的其餘三種資源上限檢查寫法同 food 那一行；`pvpnet.js` 的 `ruleCheckPresence / ruleCheckRaid` 是這份規則的 JS 鏡像，記憶體假後端用它模擬「被規則擋下」，`tools/pvp-test.mjs` 用大量偽造文件驗證。**實際貼進主控台前請用 Rules Playground / emulator 再驗一次語法**——本專案沒有部署也沒有在 emulator 跑過這段文字。）

**跨使用者寫入（免費方案下怎麼運作）**
- 整個 PvP 只有**一種**跨使用者寫入：攻擊者在防守者的收件匣 `raids/{defender}/in/{attacker}_{bucket}` **create** 一份文件。沒有任何人能寫別人的 `arks/{uid}` 或 `presence/{uid}`。
- 防守者（本人）上線時讀自己的收件匣，把新文件抄進自己的存檔 `fleet.world.pv.in`（以 id 去重），再由 `simulateTo → pvTick` **決定性**結算（`f(seed, 時間, 收件匣)`；與一次補算 / 分段補算 / 逐 tick 結果完全相同，已有測試）。防守者**不需要、也不會**寫任何別人的文件，所以不需要伺服器、也不需要 Cloud Functions。
- 子集合放在防守者底下（`raids/{defender}/in/…`）是為了讓「讀自己的收件匣」只是一個 `where t >= since` 單欄位查詢（不需要複合索引）。附近玩家掃描則是對 `presence` 的 `cells array-contains-any`（單欄位，不需要複合索引）。
- 成本（Spark 配額 5 萬讀 / 2 萬寫 / 天）：每位玩家每 5 分鐘最多寫 1 次 presence（只有位置 / 資源明顯變動才寫）、掃描最多每 45 秒 1 次且手動 / 開海圖時才做（≤24 篇讀取）、收件匣 2 分鐘輪詢 1 次（空的時候 0 篇讀取，1 次查詢計 1 次讀取）、每次突襲 create 時規則內的 `get()` 多 1 次讀取。
- **被規則擋不下的事（所以防不了作弊）**：規則看不到戰鬥，無法證明攻擊者真的打贏守衛艦；`ap`（攻擊者座標）、`presence` 內容都是用戶端自己填的；攻擊者拿到的戰利品不會因為防守者那邊實際被上限 / 護盾擋下而扣回（所以防守者的實際損失 ≤ 宣稱值；為了避免通膨，宣稱值本身就被限制在 8% / `lootCap`）。最壞情況：惡意攻擊者可以對**離線且沒護盾**的人，每個 6 小時桶宣稱一次上限內的戰利品；防守者端再用「每次 8%、每日 20%、12 小時護盾、船體最低 50%」把實際損失鎖死。若要防作弊，只能升級 Blaze + Cloud Functions 做權威結算。
- presence 會對所有登入者公開「取整的資源快照 + 約略位置 + 匿名代號」；不含 uid 以外的身分資訊、不含 email / 名稱。

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
