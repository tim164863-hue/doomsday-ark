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


## 3. PBR 貼圖（ambientCG，CC0）

來源 <https://ambientcg.com>，授權 **CC0 1.0**（可商用、免署名；我們仍列出來源）。`tools/fetch-assets.mjs tex` 下載 1K-JPG 包 → 取 Color + Displacement → 合成「RGB=底色、A=高度」一張 WebP（1024 與 512 各一）。
shader 以**物件空間三向投影**取樣（沒有 UV 也不會拉伸），高度圖用螢幕空間導數做凹凸，所以一組材質只佔 2 個貼圖單元（手機友善）。

| 檔案 | 用途 | ambientCG 素材 | 大小 |
|---|---|---|---|
| `public/tex/paint-1k.webp` | 旗艦船殼：白漆＋鏽痕 1024（桌機） | Metal041B | 326 KB |
| `public/tex/paint-512.webp` | 同上 512（手機 / low 畫質） | Metal041B | 95 KB |
| `public/tex/steel-1k.webp` | 小船船殼：灰鋼＋鏽 1024 | Metal063 | 314 KB |
| `public/tex/steel-512.webp` | 同上 512 | Metal063 | 61 KB |
| `public/tex/rust-1k.webp` | 重鏽斑塊 1024 | Rust009 | 296 KB |
| `public/tex/rust-512.webp` | 同上 512 | Rust009 | 84 KB |

素材頁：[Metal041B](https://ambientcg.com/a/Metal041B)（白漆鏽痕）、[Metal063](https://ambientcg.com/a/Metal063)（灰鋼鏽痕）、[Rust009](https://ambientcg.com/a/Rust009)（重鏽）。

## 4. 天空 HDRI（Poly Haven，CC0）

| 檔案 | 用途 | 素材 | 大小 |
|---|---|---|---|
| `public/env/sky.hdr` | 環境反射光 IBL（PMREM）＋ 水面倒影的雲層明暗；由 1k 版降採樣成 256×128 | [wasteland_clouds_puresky](https://polyhaven.com/a/wasteland_clouds_puresky)（Poly Haven，**CC0**） | 86 KB |

## 5. 道具模型（Poly Haven，CC0）

來源 <https://polyhaven.com>，全部 **CC0**。`tools/fetch-assets.mjs models`：下載 1k glTF → weld → meshopt 簡化到 600–4800 三角形 → 貼圖縮 512 WebP → quantize + meshopt 壓縮。
遊戲裡每種道具每艘船 1 個 `InstancedMesh`，載入完才出現；載入失敗用簡單幾何代替（`src/ship/props.js`）。道具只放艙頂 / 舷外，純視覺，不影響碰撞與走道。

| 檔案 | 用途 | 素材 | 大小 |
|---|---|---|---|
| `public/models/props/barrel_03.glb` | 艙頂油桶 | barrel_03 | 86 KB |
| `public/models/props/metal_jerrycan.glb` | 汽油罐 | metal_jerrycan | 122 KB |
| `public/models/props/propane_tank.glb` | 丙烷鋼瓶 | propane_tank | 85 KB |
| `public/models/props/old_tyre.glb` | 舷側輪胎護舷 | old_tyre | 100 KB |
| `public/models/props/lifebuoy.glb` | 救生圈（旗艦船殼） | lifebuoy | 118 KB |
| `public/models/props/wooden_crate_02.glb` | 木箱 | wooden_crate_02 | 97 KB |
| `public/models/props/portable_generator.glb` | 發電機（Lv2+ 艙頂） | portable_generator | 232 KB |

素材頁：`https://polyhaven.com/a/<素材名>`。每個檔案的 sha256、簡化前後三角形數在 `public/assets-manifest.json`。

## 6. 下載量與效能預算（里程碑 1）

- 新增的美術素材全部**延遲載入**（先出畫面、後補素材，失敗就維持程序式外觀）；桌機約 1.9 MB、手機（512 貼圖）約 1.2 MB，一次性，之後走瀏覽器快取。
- 預算：桌機 / 手機各自 ≤ 2.5 MB 延遲素材；draw calls 與基準版（舊廢土版）相比 ±5 以內（道具用 InstancedMesh、貼圖用 shader）；三角形每艘船 +≤ 20k。
- 重新產生全部素材：`cd tools/assets && npm i && cd ../.. && node tools/fetch-assets.mjs`（來源下載會快取在 `tools/assets/.cache/`，已 gitignore）。

（角色、生物、廢墟、冰山等之後的里程碑會繼續補在本檔。）
