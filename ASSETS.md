# ASSETS.md — 第三方素材來源與授權

原則：只用 **CC0 / MIT / 同等寬鬆**授權的素材；唯一例外是 game-icons.net（CC BY 3.0），因為需要「企鵝／北極熊／海盜旗」這類 CC0 圖示庫沒有的圖，所以放在這裡並標示作者。
每個素材都由腳本重現（`tools/fetch-assets.mjs`、`tools/build-icon-font.mjs`），不是手動下載。

## 1. UI 圖示（取代全部 emoji）

遊戲介面原本到處是系統 emoji（各平台長得都不一樣、顏色花、風格廉價）。現在全部換成**一套自建圖示字型 `ArkIcons`**（`src/assets/ark-icons.woff2`，約 22 KB，160 個字形）：

| 來源 | 授權 | 用途 | 取得方式 |
|---|---|---|---|
| [Phosphor Icons](https://phosphoricons.com) `-fill` / `-bold`（npm `@iconify-json/ph`） | **MIT** © Phosphor Icons | 絕大多數圖示（資源、按鈕、天氣、表情、狀態…） | `tools/build-icon-font.mjs` |
| [game-icons.net](https://game-icons.net)（npm `@iconify-json/game-icons`）：pirate-flag、penguin、polar-bear、cruiser、ship-bow、fishing-boat、speed-boat、submarine、ancient-ruins、explosion-rays、ice-cube、snake、squid、sperm-whale、dragon-head、coral、volcano、rock、wood-pile、bubbles、diving-helmet | **CC BY 3.0**（必須署名）— 作者：Lorc、Delapouite 及 game-icons.net 貢獻者，<https://game-icons.net> | 同上 |

- 圖示是**字型字元**（私用區 U+E000…），顏色跟著文字，所以能用 CSS 上「生鏽金屬／模板噴漆」的色調，手機上是向量、永遠清晰；Canvas（海圖、戰鬥、電視）也用同一個字型畫。
- 對照表：`tools/icons/icon-map.mjs`（emoji → 圖示）、`tools/icons/pua.json`（圖示 → 碼位，穩定不重排）、`src/ui/icons.js`（`IC.anchor` 這類名稱，新程式碼用它）。
- 防止 emoji 回來：`node tools/check-emoji.mjs` 掃 `src/`、`index.html` 與正式版 `docs/`（含 `\u{1F…}` 跳脫），有任何 emoji 就失敗。
- 重建：`cd tools/icons && npm i && cd ../.. && node tools/build-icon-font.mjs`。

## 2. 角色

| 素材 | 授權 | 來源 |
|---|---|---|
| Kenney Mini Characters（`public/models/character-*.glb`，12 個） | **CC0** | <https://kenney.nl/assets/mini-characters>，授權文字 `public/models/LICENSE-kenney-mini-characters.txt` |

（本檔之後會隨美術升級持續補上：PBR 貼圖、HDRI、模型等，每項都附來源、授權與下載腳本。）
