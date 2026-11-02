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
      text: "00 枡 (Masu) を起動 ↗"
      link: "/demo/index.html"
      target: "_blank"
    - theme: alt
      text: "01 家計栞 (Shiori) ↗"
      link: "/demo/concepts/shiori/index.html"
      target: "_blank"
    - theme: alt
      text: "02 パルス (Pulse) ↗"
      link: "/demo/concepts/pulse/index.html"
      target: "_blank"
    - theme: alt
      text: "03 床の間 (Tokonoma) ↗"
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
    target: "_blank"
---

## 4つの家計簿アプリを今すぐ開く（ライブデモ）

以下のカードをクリックすると、外部フレームワークに依存しないスタンドアロンの家計簿ウェブアプリが別タブ（全画面）で開きます。4つのアプリはすべて2026年10月の同一家計データ（月次支出 `¥284,620`・5つの予算費目）を共有し、新規記帳（`[N]`）、赤入れ検証（`[U]`）、AIスロップ比較（`[B]`）、ダーク/ライト配色切替（`[T]`）が完動します。

<div class="app-launcher-grid">
  <div class="app-launcher-card">
    <a class="app-launcher-thumb" href="/unslop-kakeibo-showcase/demo/index.html" target="_blank" rel="noopener external">
      <img src="/screenshots/shot-00-masu-1-overview-dark.png" alt="00 枡 ダークモード概要画面" />
    </a>
    <div class="app-launcher-body">
      <div class="app-launcher-header">
        <span class="app-launcher-id">00 枡 (Masu)</span>
        <span class="app-launcher-trait">calm, exact, tactile</span>
      </div>
      <h3 class="app-launcher-title">静謐なグラファイトと感熱紙レシートの台帳</h3>
      <p class="app-launcher-desc">ブラッシュドメタルの物理決済カード＆感熱レシート（Moment 1）と、5費目ミラーリング・スプライン曲線（Moment 2）を備えた王道デスクトップ台帳。</p>
      <div class="app-launcher-actions">
        <a class="app-launch-btn" href="/unslop-kakeibo-showcase/demo/index.html" target="_blank" rel="noopener external">00 枡 を全画面で開く ↗</a>
        <a class="app-launch-sub" href="/unslop-kakeibo-showcase/masu/index.html" target="_blank" rel="noopener external">/masu/ ↗</a>
      </div>
    </div>
  </div>

  <div class="app-launcher-card">
    <a class="app-launcher-thumb" href="/unslop-kakeibo-showcase/demo/concepts/shiori/index.html" target="_blank" rel="noopener external">
      <img src="/screenshots/shot-01-shiori-1-spread-light.png" alt="01 家計栞 ライトモード見開き画面" />
    </a>
    <div class="app-launcher-body">
      <div class="app-launcher-header">
        <span class="app-launcher-id">01 家計栞 (Kakei Shiori)</span>
        <span class="app-launcher-trait">warm, literary, unhurried</span>
      </div>
      <h3 class="app-launcher-title">書斎のコットン紙と万年筆インクの見開き帳面</h3>
      <p class="app-launcher-desc">真鍮クリップ留めの銅版画ボタニカル証憑（Moment 1）、10月のみ万年筆グリーンで塗られた季節棒グラフ（Moment 2）、右上の深紅の栞紐。</p>
      <div class="app-launcher-actions">
        <a class="app-launch-btn" href="/unslop-kakeibo-showcase/demo/concepts/shiori/index.html" target="_blank" rel="noopener external">01 家計栞 を全画面で開く ↗</a>
        <a class="app-launch-sub" href="/unslop-kakeibo-showcase/shiori/index.html" target="_blank" rel="noopener external">/shiori/ ↗</a>
      </div>
    </div>
  </div>

  <div class="app-launcher-card">
    <a class="app-launcher-thumb" href="/unslop-kakeibo-showcase/demo/concepts/pulse/index.html" target="_blank" rel="noopener external">
      <img src="/screenshots/shot-02-pulse-1-overview-dark.png" alt="02 パルス ダークモード概要画面" />
    </a>
    <div class="app-launcher-body">
      <div class="app-launcher-header">
        <span class="app-launcher-id">02 パルス (Pulse)</span>
        <span class="app-launcher-trait">technical, high-precision, atmospheric</span>
      </div>
      <h3 class="app-launcher-title">ディープインクと高精度オシロスコープの計測台帳</h3>
      <p class="app-launcher-desc">リアルタイム Canvas 2D オシロスコープ波形＋反転フラップ表示器（Moment 1）と、31日間のシグナルオレンジ日次インパルス波形（Moment 2）。</p>
      <div class="app-launcher-actions">
        <a class="app-launch-btn" href="/unslop-kakeibo-showcase/demo/concepts/pulse/index.html" target="_blank" rel="noopener external">02 パルス を全画面で開く ↗</a>
        <a class="app-launch-sub" href="/unslop-kakeibo-showcase/pulse/index.html" target="_blank" rel="noopener external">/pulse/ ↗</a>
      </div>
    </div>
  </div>

  <div class="app-launcher-card">
    <a class="app-launcher-thumb" href="/unslop-kakeibo-showcase/demo/concepts/tokonoma/index.html" target="_blank" rel="noopener external">
      <img src="/screenshots/shot-03-tokonoma-1-overview-light.png" alt="03 床の間 ライトモード概要画面" />
    </a>
    <div class="app-launcher-body">
      <div class="app-launcher-header">
        <span class="app-launcher-id">03 床の間 (Tokonoma)</span>
        <span class="app-launcher-trait">architectural, serene, structural</span>
      </div>
      <h3 class="app-launcher-title">漆喰の余白と1px露出スイスグリッドの建築的台帳</h3>
      <p class="app-launcher-desc">大判明朝体の月次支出額と一滴の朱印「済」（Moment 1）、そして5つの予算費目を空間面積で区画した「暮らしの間取り図」ツリーマップ（Moment 2）。</p>
      <div class="app-launcher-actions">
        <a class="app-launch-btn" href="/unslop-kakeibo-showcase/demo/concepts/tokonoma/index.html" target="_blank" rel="noopener external">03 床の間 を全画面で開く ↗</a>
        <a class="app-launch-sub" href="/unslop-kakeibo-showcase/tokonoma/index.html" target="_blank" rel="noopener external">/tokonoma/ ↗</a>
      </div>
    </div>
  </div>
</div>

## ページ内ライブ・プレビュー

下のプレビュー枠内の最上部バー（`00 枡` / `01 家計栞` / `02 パルス` / `03 床の間`）をクリックして、このページのまま4つの家計簿アプリを操作・比較することもできます。

<div class="live-embed-box">
  <div class="live-embed-toolbar">
    <span><strong>インタラクティブ・プレビュー</strong> — 最上部バーで4つのコンセプトを切替可能（<kbd>U</kbd> 赤入れ検証 / <kbd>B</kbd> スロップ比較 / <kbd>T</kbd> 配色切替）</span>
    <a class="app-launch-btn" href="/unslop-kakeibo-showcase/demo/index.html" target="_blank" rel="noopener external">別タブで全画面起動 ↗</a>
  </div>
  <iframe class="live-embed-frame" src="/unslop-kakeibo-showcase/demo/index.html" title="Masu Kakeibo Live Interactive Showcase"></iframe>
</div>

> ライト/ダーク両モード、サブビュー、赤入れ検証（X-Ray）を含む全16枚のスクリーンショットと詳細解説は **[4つのデザインコンセプトと全画面一覧](/ja/guide/concepts)** をご覧ください。
