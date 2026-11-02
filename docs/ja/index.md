---
layout: home

hero:
  name: "枡 (Masu)"
  text: "Unslop 家計簿ショーケース"
  tagline: "Damir Sokolovsky 氏の UI 設計スキル「unslop」（5行の Direction と 9つの赤入れ Pass）を徹底検証する、4つのデザインコンセプトによる日本語家計簿ウェブアプリ集。"
  image:
    src: /assets/icon.svg
    alt: Masu Kakeibo Icon
  actions:
    - theme: brand
      text: "00 枡 (Masu) を起動"
      link: "/demo/index.html"
      target: "_blank"
    - theme: alt
      text: "01 家計栞 (Shiori)"
      link: "/demo/concepts/shiori/index.html"
      target: "_blank"
    - theme: alt
      text: "02 パルス (Pulse)"
      link: "/demo/concepts/pulse/index.html"
      target: "_blank"
    - theme: alt
      text: "03 床の間 (Tokonoma)"
      link: "/demo/concepts/tokonoma/index.html"
      target: "_blank"
    - theme: brand
      text: "検証ガイドを読む →"
      link: "/ja/guide/overview"

features:
  - title: "コードを書く前の「5行の Direction」"
    details: "実装に入る前に Product・Character（3つの形容詞）・World（物質的メタファー）・画面内2箇所限定の Moments・一貫した Signature の5行を定義し、ブレのない造形を確立します。"
    link: "/ja/guide/overview"
  - title: "同一データで旅する4つの世界観"
    details: "00 枡（静謐なグラファイト）、01 家計栞（書斎のコットン紙）、02 パルス（高精度テレメトリ）、03 床の間（1pxスイスグリッド）の4つの家計簿を上部のスイッチャーで自在に行き来できます。"
    link: "/ja/guide/concepts"
  - title: "9つの赤入れ Pass と「引き算」の徹底"
    details: "4pxグリッド、無彩色クローム、1.5pxストロークの単色SVG、ウェイト400/500＋等幅数字、そして不要な英語併記や装飾バッジを削ぎ落とした100%日本語UIを実現しています。"
    link: "/ja/guide/nine-passes"
  - title: "赤入れ検証 [U] とスロップ比較 [B]"
    details: "アプリ内で [U] キーを押せば各要素に適用された Pass の赤入れオーバーレイが表示され、[B] キーを押せば典型的なAI生成テンプレート（紫グラデーション・絵文字過多）との比較を体験できます。"
    link: "/demo/index.html"
---

## ライブ・インタラクティブ・ショーケース

4つの家計簿アプリケーションはすべて外部フレームワークに依存しない純粋な HTML / CSS / JavaScript で実装されており、ブラウザ上でそのままライブ操作できます。全コンセプトで2026年10月の同一家計データ（月次支出 `¥284,620`・5つの予算費目）を共有し、新規記帳（`[N]`）、赤入れ検証（`[U]`）、AIスロップ比較（`[B]`）、ダーク/ライト配色切替（`[T]`）が完動します。

| ID | コンセプト名 | Character & 物質的世界観 | ライブアプリ起動 |
| :--- | :--- | :--- | :--- |
| **`00`** | **枡 (Masu)** | `calm, exact, tactile` — 静謐なグラファイト（`#141415`）、物理決済カード＆感熱レシート、5費目ミラーリング・スプライン曲線。 | [00 枡 を開く ↗](/unslop-kakeibo-showcase/demo/index.html){target="_blank"} |
| **`01`** | **家計栞 (Kakei Shiori)** | `warm, literary, unhurried` — コットン紙（`#f7f4ee`）、真鍮クリップ留めの銅版画証憑、10月のみ万年筆グリーンで塗られた季節棒グラフ。 | [01 家計栞 を開く ↗](/unslop-kakeibo-showcase/demo/concepts/shiori/index.html){target="_blank"} |
| **`02`** | **パルス (Pulse)** | `technical, high-precision, atmospheric` — ディープインク（`#0a0b0d`）、オシロスコープ波形、パタパタ時計、31日間のシグナルオレンジ波形。 | [02 パルス を開く ↗](/unslop-kakeibo-showcase/demo/concepts/pulse/index.html){target="_blank"} |
| **`03`** | **床の間 (Tokonoma)** | `architectural, serene, structural` — 漆喰の白と1px露出スイスグリッド（`#f4f3ef`）、大判明朝数字と朱印「済」、建築間取り図ツリーマップ。 | [03 床の間 を開く ↗](/unslop-kakeibo-showcase/demo/concepts/tokonoma/index.html){target="_blank"} |

## ビジュアル・プレビュー

![00 枡 ダークモード概要画面](/screenshots/shot-00-masu-1-overview-dark.png)

> ライト/ダーク両モード、サブビュー、赤入れ検証（X-Ray）を含む全16枚のスクリーンショットと詳細解説は **[4つのデザインコンセプトと全画面一覧](/ja/guide/concepts)** をご覧ください。
