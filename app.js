/**
 * 枡 (Masu) — 家計台帳
 * クライアントサイド台帳ロジック、5系列ベジェ曲線チャート、証憑プレビュー
 */

(() => {
  "use strict";

  const STORAGE_KEY = "masu_kakeibo_ledger_v2";

  // ---------------------------------------------------------------------------
  // 1. 5つの枡（費目定義）
  // ---------------------------------------------------------------------------
  const DEFAULT_ENVELOPES = [
    {
      id: "housing",
      nameJp: "住居・固定費",
      color: "#f5b82e",
      budget: 145000,
      note: "家賃・共益費・光熱費・通信回線",
      series6m: [138200, 139400, 141800, 142100, 139600, 138420],
      prev6m:   [136000, 137500, 139000, 140200, 141000, 139600],
      dailyOct: [118000, 118000, 129420, 133800, 138420, 138420]
    },
    {
      id: "food",
      nameJp: "食費・日用品",
      color: "#10b981",
      budget: 56000,
      note: "生鮮食品・スーパー・珈琲豆・日用消耗品",
      series6m: [51200, 48900, 54300, 52800, 55400, 46840],
      prev6m:   [49800, 52100, 51000, 54600, 53200, 55400],
      dailyOct: [8400, 16920, 25400, 34120, 40360, 46840]
    },
    {
      id: "culture",
      nameJp: "交際・文化",
      color: "#3b82f6",
      budget: 32000,
      note: "書籍・展示会・友人との食事",
      series6m: [28400, 31200, 24600, 29800, 34200, 26480],
      prev6m:   [26000, 28900, 27400, 31000, 29800, 34200],
      dailyOct: [3520, 8920, 14200, 19800, 22960, 26480]
    },
    {
      id: "transit",
      nameJp: "交通・移動",
      color: "#ec4899",
      budget: 18000,
      note: "Suicaオートチャージ・新幹線・移動",
      series6m: [14200, 16800, 15400, 19200, 17500, 14680],
      prev6m:   [15000, 14800, 16200, 17100, 18400, 17500],
      dailyOct: [3000, 5000, 8200, 10200, 12680, 14680]
    },
    {
      id: "special",
      nameJp: "特別・予備",
      color: "#8b5cf6",
      budget: 22000,
      note: "医療費・生活道具の修繕・季節の贈答",
      series6m: [18500, 12400, 26800, 15200, 24700, 22200],
      prev6m:   [16400, 19200, 21000, 18600, 22400, 24700],
      dailyOct: [0, 4800, 4800, 13400, 18200, 22200]
    }
  ];

  // ---------------------------------------------------------------------------
  // 2. 2026年10月 明細データ
  // ---------------------------------------------------------------------------
  const DEFAULT_TRANSACTIONS = [
    {
      id: "tx-101",
      date: "2026-10-28",
      merchant: "成城石井 アトレ恵比寿店",
      memo: "週末食材・オリーブ油・チーズ・惣菜",
      envelope: "food",
      account: "三井住友カード（4821）",
      type: "expense",
      amount: 6480,
      items: [
        { name: "有機エクストラバージンオリーブ油", price: 1980 },
        { name: "北海道産純生クリーム・チーズ類", price: 1640 },
        { name: "自家製ローストビーフサラダ", price: 1200 },
        { name: "季節の果物・ライ麦パン", price: 1660 }
      ]
    },
    {
      id: "tx-102",
      date: "2026-10-27",
      merchant: "丸善ジュンク堂書店 丸の内本店",
      memo: "設計関連専門書2冊・MDノート",
      envelope: "culture",
      account: "三井住友カード（4821）",
      type: "expense",
      amount: 5840,
      items: [
        { name: "タイポグラフィとグリッドの秩序", price: 3520 },
        { name: "日本の木組と伝統度量衡（枡）", price: 1440 },
        { name: "ミドリ MDノート 新書サイズ 無罫", price: 880 }
      ]
    },
    {
      id: "tx-103",
      date: "2026-10-26",
      merchant: "JR東日本 モバイルSuica チャージ",
      memo: "残高1,000円未満によるオートチャージ",
      envelope: "transit",
      account: "モバイルSuica（9014）",
      type: "expense",
      amount: 5000,
      items: [
        { name: "VIEW Suica オートチャージ", price: 5000 }
      ]
    },
    {
      id: "tx-104",
      date: "2026-10-25",
      merchant: "東京電力エナジーパートナー",
      memo: "10月分電気料金（従量電灯B・30A / 284kWh）",
      envelope: "housing",
      account: "三井住友カード（4821）",
      type: "fixed",
      amount: 11420,
      items: [
        { name: "基本料金（30A）", price: 935 },
        { name: "電力量料金（284kWh）", price: 9420 },
        { name: "再エネ発電賦課金・燃料費調整", price: 1065 }
      ]
    },
    {
      id: "tx-105",
      date: "2026-10-25",
      merchant: "10月度 給与振込（手取り支給額）",
      memo: "基本給＋住宅手当（社会保険・源泉税控除後）",
      envelope: "housing",
      account: "三菱UFJ銀行 口座振替",
      type: "income",
      amount: 445000,
      items: [
        { name: "月次手取り振込額（三菱UFJ銀行）", price: 445000 }
      ]
    },
    {
      id: "tx-106",
      date: "2026-10-24",
      merchant: "オーケー みなとみらい店",
      memo: "米5kg・野菜・日用消耗品まとめ買い",
      envelope: "food",
      account: "三井住友カード（4821）",
      type: "expense",
      amount: 8920,
      items: [
        { name: "秋田県産あきたこまち 5kg", price: 3280 },
        { name: "旬の根菜・葉物野菜セット", price: 2460 },
        { name: "国産鶏むね肉・鮭切り身", price: 1980 },
        { name: "キッチンペーパー・洗濯洗剤詰替", price: 1200 }
      ]
    },
    {
      id: "tx-107",
      date: "2026-10-22",
      merchant: "ブルーボトルコーヒー 清澄白河",
      memo: "ブレンド珈琲豆 200g・ドリップ",
      envelope: "food",
      account: "モバイルSuica（9014）",
      type: "expense",
      amount: 2640,
      items: [
        { name: "ベラ・ドノヴァン ホールビーン 200g", price: 1960 },
        { name: "本日のシングルオリジン ドリップ", price: 680 }
      ]
    },
    {
      id: "tx-108",
      date: "2026-10-20",
      merchant: "東京都水道局（口座振替）",
      memo: "令和8年9-10月検針分 上下水道料金",
      envelope: "housing",
      account: "三菱UFJ銀行 口座振替",
      type: "fixed",
      amount: 4380,
      items: [
        { name: "上水道料金（口径20mm）", price: 2540 },
        { name: "下水道料金", price: 1840 }
      ]
    },
    {
      id: "tx-109",
      date: "2026-10-18",
      merchant: "トラヤあんスタンド 北青山店",
      memo: "季節の手土産（あんペースト詰合せ）",
      envelope: "special",
      account: "アメックス・ゴールド（3108）",
      type: "expense",
      amount: 4800,
      items: [
        { name: "あんペースト（こしあん・黒砂糖とメープル）", price: 4800 }
      ]
    },
    {
      id: "tx-110",
      date: "2026-10-16",
      merchant: "ビストロ ロジウラ 渋谷",
      memo: "大学同期との夕食会（2名分）",
      envelope: "culture",
      account: "アメックス・ゴールド（3108）",
      type: "expense",
      amount: 12840,
      items: [
        { name: "季節の前菜・シャルキュトリー盛合せ", price: 4200 },
        { name: "鴨胸肉のロースト・自然派ワイン2杯", price: 8640 }
      ]
    },
    {
      id: "tx-111",
      date: "2026-10-14",
      merchant: "無印良品 銀座",
      memo: "耐熱ガラス保存容器・リネンタオル補充",
      envelope: "food",
      account: "三井住友カード（4821）",
      type: "expense",
      amount: 5420,
      items: [
        { name: "耐熱ガラスバルブ付き保存容器 × 3", price: 2850 },
        { name: "麻ワッフルフェイスタオル × 2", price: 2570 }
      ]
    },
    {
      id: "tx-112",
      date: "2026-10-12",
      merchant: "SONY Nuro光 通信回線",
      memo: "10月分 自宅光ファイバー通信費",
      envelope: "housing",
      account: "三井住友カード（4821）",
      type: "fixed",
      amount: 4620,
      items: [
        { name: "10Gbps 光回線基本料・プロバイダ料", price: 4620 }
      ]
    },
    {
      id: "tx-113",
      date: "2026-10-10",
      merchant: "北青山デンタルクリニック",
      memo: "半期ごとの歯科定期検診・クリーニング",
      envelope: "special",
      account: "三井住友カード（4821）",
      type: "expense",
      amount: 8600,
      items: [
        { name: "歯周基本検査・PMTCクリーニング", price: 8600 }
      ]
    },
    {
      id: "tx-114",
      date: "2026-10-08",
      merchant: "東海道新幹線 スマートEX",
      memo: "京都・桂離宮参観のための片道特急券",
      envelope: "transit",
      account: "アメックス・ゴールド（3108）",
      type: "expense",
      amount: 9680,
      items: [
        { name: "のぞみ号 普通車指定席（品川↔京都）", price: 9680 }
      ]
    },
    {
      id: "tx-115",
      date: "2026-10-06",
      merchant: "ライフ 渋谷東店",
      memo: "平日自炊用の生鮮野菜・納豆・豆腐・卵",
      envelope: "food",
      account: "モバイルSuica（9014）",
      type: "expense",
      amount: 11260,
      items: [
        { name: "平飼い有精卵・国産大豆豆腐・発酵食品", price: 3420 },
        { name: "旬の鮮魚・豚ロース・季節野菜", price: 7840 }
      ]
    },
    {
      id: "tx-116",
      date: "2026-10-04",
      merchant: "東京都現代美術館",
      memo: "企画展観覧券・図録購入",
      envelope: "culture",
      account: "モバイルSuica（9014）",
      type: "expense",
      amount: 7800,
      items: [
        { name: "企画展 一般観覧チケット", price: 2200 },
        { name: "展覧会公式ハードカバー図録", price: 5600 }
      ]
    },
    {
      id: "tx-117",
      date: "2026-10-02",
      merchant: "金継ぎ工房・漆器修理預かり内金",
      memo: "普段使いの飯碗（陶器）の欠け補修",
      envelope: "special",
      account: "三菱UFJ銀行 口座振替",
      type: "expense",
      amount: 8800,
      items: [
        { name: "本漆・純金粉による金継ぎ補修工程費", price: 8800 }
      ]
    },
    {
      id: "tx-118",
      date: "2026-10-01",
      merchant: "東急住宅リース（口座振替）",
      memo: "10月分 賃料および管理共益費",
      envelope: "housing",
      account: "三菱UFJ銀行 口座振替",
      type: "fixed",
      amount: 118000,
      items: [
        { name: "月額建物賃料（1LDK / 42.5㎡）", price: 110000 },
        { name: "共益費・管理維持費", price: 8000 }
      ]
    },
    {
      id: "tx-119",
      date: "2026-10-01",
      merchant: "ビオセボン 麻布十番店",
      memo: "月初まとめ買い（全粒粉パスタ・有機豆乳・珈琲）",
      envelope: "food",
      account: "三井住友カード（4821）",
      type: "expense",
      amount: 12120,
      items: [
        { name: "イタリア産有機デュラム小麦パスタ・トマト缶", price: 4860 },
        { name: "有機無調整豆乳・オーツミルク・ナッツ類", price: 7260 }
      ]
    }
  ];

  const RECURRING_ITEMS = [
    {
      day: "毎月 1日",
      biller: "東急住宅リース（賃料・共益費）",
      envelope: "housing",
      account: "三菱UFJ銀行 口座振替",
      status: "10/01 決済済",
      amount: 118000
    },
    {
      day: "毎月 10日",
      biller: "三井住友カード（4821 引き落とし）",
      envelope: "food",
      account: "三菱UFJ銀行 口座振替",
      status: "11/10 予定",
      amount: 142800
    },
    {
      day: "毎月 12日",
      biller: "SONY Nuro光 通信回線",
      envelope: "housing",
      account: "三井住友カード（4821）",
      status: "10/12 決済済",
      amount: 4620
    },
    {
      day: "毎月 25日",
      biller: "東京電力エナジーパートナー（従量電灯B）",
      envelope: "housing",
      account: "三井住友カード（4821）",
      status: "10/25 決済済",
      amount: 11420
    }
  ];

  // ---------------------------------------------------------------------------
  // 3. 状態管理
  // ---------------------------------------------------------------------------
  let state = {
    view: "overview",
    theme: "dark",
    xrayMode: false,
    slopMode: false,
    chartMode: "6m",
    activeEnvelope: null,
    txTypeFilter: "all",
    searchQuery: "",
    sortField: "date",
    sortAsc: false,
    selectedTxId: "tx-101",
    envelopes: [],
    transactions: []
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.envelopes) && Array.isArray(parsed.transactions)) {
          state.envelopes = parsed.envelopes;
          state.transactions = parsed.transactions;
          state.selectedTxId = state.transactions[0]?.id || null;
          return;
        }
      }
    } catch (e) {
      console.warn("LocalStorage unavailable, using default ledger state.", e);
    }
    state.envelopes = JSON.parse(JSON.stringify(DEFAULT_ENVELOPES));
    state.transactions = JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS));
    state.selectedTxId = state.transactions[0]?.id || null;
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          envelopes: state.envelopes,
          transactions: state.transactions
        })
      );
    } catch (e) {
      console.warn("Could not persist ledger state.", e);
    }
  }

  function formatYen(num) {
    const n = Math.round(Number(num) || 0);
    const abs = Math.abs(n).toLocaleString("ja-JP");
    return n < 0 ? `-¥${abs}` : `¥${abs}`;
  }

  function getEnvelopeById(id) {
    return state.envelopes.find((e) => e.id === id) || state.envelopes[0];
  }

  function computeEnvelopeSpend(envId) {
    return state.transactions
      .filter((t) => t.type !== "income" && t.envelope === envId)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }

  function computeTotals() {
    let spent = 0;
    let income = 0;
    for (const t of state.transactions) {
      if (t.type === "income") {
        income += Number(t.amount || 0);
      } else {
        spent += Number(t.amount || 0);
      }
    }
    const totalBudget = state.envelopes.reduce((s, e) => s + Number(e.budget || 0), 0);
    const netSavings = Math.max(0, income - spent);
    const remainingBudget = totalBudget - spent;
    return { spent, income, totalBudget, netSavings, remainingBudget };
  }

  // ---------------------------------------------------------------------------
  // 4. 描画関数群
  // ---------------------------------------------------------------------------
  function renderAll() {
    renderHeaderAndStats();
    renderSidebarEnvelopes();
    renderChartSection();
    renderOverviewEnvelopeBars();
    renderEnvelopeFilterChips();
    renderTransactionsTable();
    renderReceiptInspector();
    renderEnvelopesDetailView();
    renderCardsDetailView();
    renderRecurringView();
    renderSpecView();
    applySlopCopyOverrides();
  }

  function renderHeaderAndStats() {
    const { spent, income, totalBudget, netSavings, remainingBudget } = computeTotals();
    const septSpent = 271400;
    const diffPct = (((spent - septSpent) / septSpent) * 100).toFixed(1);
    const sign = diffPct > 0 ? "+" : "";

    const totalBudgetEl = document.getElementById("header-total-budget");
    const remBudgetEl = document.getElementById("header-remaining-budget");
    if (totalBudgetEl) totalBudgetEl.textContent = formatYen(totalBudget);
    if (remBudgetEl) {
      remBudgetEl.textContent = formatYen(remainingBudget);
      remBudgetEl.style.color = remainingBudget >= 0 ? "var(--sem-positive)" : "var(--sem-negative)";
    }

    const spentEl = document.getElementById("stat-spent-val");
    if (spentEl) spentEl.textContent = formatYen(spent);

    const delta1El = document.getElementById("stat-delta-1");
    if (delta1El && !state.slopMode) {
      const isLess = spent <= septSpent;
      delta1El.innerHTML = `
        <span class="delta-val ${isLess ? "positive" : "negative"}">${sign}${diffPct}%</span>
        <span class="delta-ref">先月比（${formatYen(septSpent)}）</span>
      `;
    }

    const savingsEl = document.getElementById("stat-savings-val");
    if (savingsEl) savingsEl.textContent = formatYen(netSavings);

    const savingsTarget = 172000;
    const savingsDiff = netSavings - savingsTarget;
    const savingsRate = income > 0 ? ((netSavings / income) * 100).toFixed(1) : "0.0";
    const delta2El = document.getElementById("stat-delta-2");
    if (delta2El && !state.slopMode) {
      const pos = savingsDiff >= 0;
      delta2El.innerHTML = `
        <span class="delta-val ${pos ? "positive" : "negative"}">${pos ? "+" : ""}${formatYen(savingsDiff)}</span>
        <span class="delta-ref">目標比 · 貯蓄率 ${savingsRate}%</span>
      `;
    }

    const navTxCount = document.getElementById("nav-tx-count");
    if (navTxCount) navTxCount.textContent = String(state.transactions.length);
  }

  function renderSidebarEnvelopes() {
    const container = document.getElementById("sidebar-envelopes-list");
    const hint = document.getElementById("sidebar-env-filter-hint");
    if (!container) return;

    if (hint) {
      hint.textContent = state.activeEnvelope
        ? getEnvelopeById(state.activeEnvelope).nameJp
        : "すべて";
    }

    container.innerHTML = state.envelopes
      .map((env) => {
        const spent = computeEnvelopeSpend(env.id);
        const isActive = state.activeEnvelope === env.id;
        return `
          <button
            type="button"
            class="env-row ${isActive ? "active-series" : ""}"
            data-env-select="${env.id}"
            title="${env.nameJp}で絞り込む"
          >
            <span class="icon-col">
              <span class="env-dot" style="background-color: ${env.color};"></span>
            </span>
            <span class="nav-label">${env.nameJp}</span>
            <span class="env-amount">${formatYen(spent)}</span>
          </button>
        `;
      })
      .join("");

    container.querySelectorAll("[data-env-select]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-env-select");
        state.activeEnvelope = state.activeEnvelope === id ? null : id;
        renderAll();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 5. 5系列ベジェ曲線チャート
  // ---------------------------------------------------------------------------
  function buildSmoothBezierPath(points) {
    if (!points || points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const tension = 0.22;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  function renderChartSection() {
    const legendEl = document.getElementById("chart-legend-strip");
    const svg = document.getElementById("envelope-chart-svg");
    const tooltip = document.getElementById("chart-tooltip");
    if (!legendEl || !svg) return;

    legendEl.innerHTML =
      state.envelopes
        .map((env) => {
          const dimmed = state.activeEnvelope && state.activeEnvelope !== env.id;
          return `
            <button
              type="button"
              class="legend-item ${dimmed ? "dimmed" : ""}"
              data-legend-env="${env.id}"
            >
              <span class="env-dot" style="background-color: ${env.color};"></span>
              <span>${env.nameJp}</span>
            </button>
          `;
        })
        .join("") +
      `<div class="legend-mirror-note">
        <span class="mirror-dash"></span>
        <span>下段破線：先月ペース</span>
      </div>`;

    legendEl.querySelectorAll("[data-legend-env]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-legend-env");
        state.activeEnvelope = state.activeEnvelope === id ? null : id;
        renderAll();
      });
    });

    const width = 720;
    const height = 256;
    const padLeft = 52;
    const padRight = 20;
    const padTop = 18;
    const padBottom = 28;
    const zeroY = 152;
    const upperHeight = zeroY - padTop;
    const lowerHeight = height - padBottom - zeroY;

    const xLabels =
      state.chartMode === "daily"
        ? ["10/01", "10/06", "10/12", "10/18", "10/24", "10/30"]
        : ["5月", "6月", "7月", "8月", "9月", "10月"];

    const seriesList = state.envelopes.map((env) => {
      const liveOctSpend = computeEnvelopeSpend(env.id);
      const rawUpper =
        state.chartMode === "daily"
          ? [...env.dailyOct.slice(0, 5), liveOctSpend]
          : [...env.series6m.slice(0, 5), liveOctSpend];
      const rawLower = [...env.prev6m];
      return { env, rawUpper, rawLower };
    });

    const maxVal = Math.max(
      150000,
      ...seriesList.flatMap((s) => [...s.rawUpper, ...s.rawLower])
    );

    const stepX = (width - padLeft - padRight) / (xLabels.length - 1);

    let svgContent = `
      <defs>
        <filter id="spline-glow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.35" />
        </filter>
      </defs>
    `;

    const gridLevels = [
      { label: "¥150k", y: padTop },
      { label: "¥100k", y: padTop + upperHeight * 0.333 },
      { label: "¥50k", y: padTop + upperHeight * 0.666 },
      { label: "¥0", y: zeroY, isZero: true },
      { label: "先月", y: zeroY + lowerHeight * 0.65 }
    ];

    for (const g of gridLevels) {
      svgContent += `
        <line
          x1="${padLeft}"
          y1="${g.y.toFixed(1)}"
          x2="${width - padRight}"
          y2="${g.y.toFixed(1)}"
          class="${g.isZero ? "chart-zero-line" : "chart-grid-line"}"
        />
        <text
          x="${padLeft - 8}"
          y="${(g.y + 4).toFixed(1)}"
          text-anchor="end"
          class="chart-axis-label"
        >${g.label}</text>
      `;
    }

    xLabels.forEach((lbl, idx) => {
      const x = padLeft + idx * stepX;
      svgContent += `
        <text
          x="${x.toFixed(1)}"
          y="${height - 6}"
          text-anchor="middle"
          class="chart-axis-label"
        >${lbl}</text>
      `;
    });

    seriesList.forEach(({ env, rawLower }) => {
      const isDimmed = state.activeEnvelope && state.activeEnvelope !== env.id;
      const mirrorPts = rawLower.map((val, idx) => ({
        x: padLeft + idx * stepX,
        y: zeroY + (val / maxVal) * lowerHeight * 0.88
      }));
      const dMirror = buildSmoothBezierPath(mirrorPts);
      svgContent += `
        <path
          d="${dMirror}"
          class="mirror-path"
          style="opacity: ${isDimmed ? 0.08 : state.chartMode === "mirror" ? 0.65 : 0.32};"
        />
      `;
    });

    seriesList.forEach(({ env, rawUpper }) => {
      const isDimmed = state.activeEnvelope && state.activeEnvelope !== env.id;
      const isHighlighted = state.activeEnvelope === env.id;
      const pts = rawUpper.map((val, idx) => ({
        x: padLeft + idx * stepX,
        y: zeroY - (val / maxVal) * upperHeight * 0.92,
        val,
        period: xLabels[idx]
      }));
      const d = buildSmoothBezierPath(pts);

      svgContent += `
        <path
          d="${d}"
          stroke="${env.color}"
          filter="url(#spline-glow)"
          class="spline-path ${isDimmed ? "dimmed" : ""} ${isHighlighted ? "highlighted" : ""}"
          data-series-id="${env.id}"
        />
      `;

      pts.forEach((pt, idx) => {
        if (idx === pts.length - 1 || isHighlighted) {
          svgContent += `
            <circle
              cx="${pt.x.toFixed(1)}"
              cy="${pt.y.toFixed(1)}"
              r="${idx === pts.length - 1 ? 4 : 3}"
              fill="${env.color}"
              stroke="var(--bg-card)"
              stroke-width="1.5"
              style="opacity: ${isDimmed ? 0.2 : 1}; cursor: pointer;"
              data-pt-env="${env.nameJp}"
              data-pt-val="${formatYen(pt.val)}"
              data-pt-period="${pt.period}"
            />
          `;
        }
      });
    });

    svg.innerHTML = svgContent;

    svg.querySelectorAll("circle[data-pt-env]").forEach((circle) => {
      circle.addEventListener("mouseenter", () => {
        if (!tooltip) return;
        const name = circle.getAttribute("data-pt-env");
        const val = circle.getAttribute("data-pt-val");
        const per = circle.getAttribute("data-pt-period");
        tooltip.innerHTML = `<span class="mono">${per}</span> · <strong>${name}</strong>: <span class="mono">${val}</span>`;
        tooltip.classList.add("visible");
      });
      circle.addEventListener("mouseleave", () => {
        if (tooltip) tooltip.classList.remove("visible");
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 6. 右1/3: 予算の枡リスト
  // ---------------------------------------------------------------------------
  function renderOverviewEnvelopeBars() {
    const container = document.getElementById("overview-envelope-bars");
    const resetBtn = document.getElementById("clear-envelope-filter-btn");
    if (!container) return;

    if (resetBtn) {
      resetBtn.style.display = state.activeEnvelope ? "inline-flex" : "none";
    }

    container.innerHTML = state.envelopes
      .map((env) => {
        const spent = computeEnvelopeSpend(env.id);
        const budget = Number(env.budget) || 1;
        const ratio = Math.min(100, Math.round((spent / budget) * 100));
        const remaining = budget - spent;
        const isSelected = state.activeEnvelope === env.id;

        return `
          <div
            class="envelope-item"
            data-env-bar="${env.id}"
            style="${isSelected ? "background-color: var(--bg-raised);" : ""}"
          >
            <div class="envelope-item-top">
              <div class="envelope-name-wrap">
                <span class="env-dot" style="background-color: ${env.color};"></span>
                <span>${env.nameJp}</span>
              </div>
              <div class="envelope-figures">
                <span>${formatYen(spent)}</span>
                <span class="budget-cap"> / ${formatYen(budget)}</span>
              </div>
            </div>
            <div class="envelope-bar-track">
              <div
                class="envelope-bar-fill"
                style="width: ${ratio}%; background-color: ${env.color};"
              ></div>
            </div>
            <div class="envelope-meta-row">
              <span>消化率 ${ratio}%</span>
              <span style="color: ${remaining >= 0 ? "var(--text-muted)" : "var(--sem-negative)"};">
                ${remaining >= 0 ? `残 ${formatYen(remaining)}` : `${formatYen(Math.abs(remaining))} 超過`}
              </span>
            </div>
          </div>
        `;
      })
      .join("");

    container.querySelectorAll("[data-env-bar]").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-env-bar");
        state.activeEnvelope = state.activeEnvelope === id ? null : id;
        renderAll();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 7. 入出金明細テーブル ＆ フィルタ
  // ---------------------------------------------------------------------------
  function renderEnvelopeFilterChips() {
    const bar = document.getElementById("envelope-chips-bar");
    if (!bar) return;

    const allChip = `
      <button
        type="button"
        class="filter-chip ${!state.activeEnvelope ? "active" : ""}"
        data-chip-env=""
      >
        <span>すべて</span>
      </button>
    `;

    const envChips = state.envelopes
      .map((env) => {
        const active = state.activeEnvelope === env.id;
        return `
          <button
            type="button"
            class="filter-chip ${active ? "active" : ""}"
            data-chip-env="${env.id}"
          >
            <span class="env-dot" style="background-color: ${env.color};"></span>
            <span>${env.nameJp}</span>
          </button>
        `;
      })
      .join("");

    bar.innerHTML = allChip + envChips;

    bar.querySelectorAll("[data-chip-env]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-chip-env");
        state.activeEnvelope = val || null;
        renderAll();
      });
    });
  }

  function getFilteredTransactions() {
    return state.transactions
      .filter((tx) => {
        if (state.activeEnvelope && tx.envelope !== state.activeEnvelope) return false;
        if (state.txTypeFilter !== "all" && tx.type !== state.txTypeFilter) return false;
        if (state.searchQuery.trim() !== "") {
          const q = state.searchQuery.trim().toLowerCase();
          const matchMerchant = tx.merchant.toLowerCase().includes(q);
          const matchMemo = (tx.memo || "").toLowerCase().includes(q);
          const matchAcc = (tx.account || "").toLowerCase().includes(q);
          if (!matchMerchant && !matchMemo && !matchAcc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (state.sortField === "amount") {
          return state.sortAsc ? a.amount - b.amount : b.amount - a.amount;
        }
        return state.sortAsc
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      });
  }

  function renderTransactionsTable() {
    const tbody = document.getElementById("ledger-tbody");
    if (!tbody) return;

    const list = getFilteredTransactions();

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); height: 96px;">
            該当する明細はありません
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list
      .map((tx) => {
        const env = getEnvelopeById(tx.envelope);
        const isSelected = state.selectedTxId === tx.id;
        const isIncome = tx.type === "income";
        const amountStr = isIncome ? `+${formatYen(tx.amount)}` : formatYen(tx.amount);

        return `
          <tr class="${isSelected ? "selected-row" : ""}" data-tx-row="${tx.id}">
            <td class="col-date">${tx.date}</td>
            <td class="col-merchant">
              <div class="merchant-cell">
                <span>${tx.merchant}</span>
                ${tx.memo ? `<span class="merchant-note">— ${tx.memo}</span>` : ""}
              </div>
            </td>
            <td class="col-envelope">
              <span class="envelope-cell">
                <span class="env-dot" style="background-color: ${env.color};"></span>
                <span>${env.nameJp}</span>
              </span>
            </td>
            <td class="col-account">${tx.account}</td>
            <td class="col-amount ${isIncome ? "amount-income" : ""}">${amountStr}</td>
          </tr>
        `;
      })
      .join("");

    tbody.querySelectorAll("[data-tx-row]").forEach((row) => {
      row.addEventListener("click", () => {
        state.selectedTxId = row.getAttribute("data-tx-row");
        renderTransactionsTable();
        renderReceiptInspector();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 8. 右カラム: 証憑プレビュー
  // ---------------------------------------------------------------------------
  function renderReceiptInspector() {
    const container = document.getElementById("receipt-inspector");
    if (!container) return;

    const tx =
      state.transactions.find((t) => t.id === state.selectedTxId) ||
      state.transactions[0];

    if (!tx) {
      container.innerHTML = `<p style="color: var(--text-muted);">明細を選択すると証憑を表示します</p>`;
      return;
    }

    const env = getEnvelopeById(tx.envelope);
    const items =
      Array.isArray(tx.items) && tx.items.length > 0
        ? tx.items
        : [{ name: tx.memo || tx.merchant, price: tx.amount }];

    const typeLabel =
      tx.type === "income" ? "収入" : tx.type === "fixed" ? "固定費" : "通常支出";

    container.innerHTML = `
      <div class="card-header" style="margin-bottom: 0;">
        <div class="card-title-group">
          <h3 class="card-title" style="font-size: 14px;">証憑プレビュー</h3>
        </div>
        <span class="envelope-cell">
          <span class="env-dot" style="background-color: ${env.color};"></span>
          <span>${env.nameJp}</span>
        </span>
      </div>

      <div class="receipt-preview-box">
        <div class="receipt-preview-header">
          <div>
            <div class="receipt-merchant-title">${tx.merchant}</div>
            <div style="opacity: 0.75; margin-top: 2px;">${tx.account}</div>
          </div>
          <div style="text-align: right;">
            <div>${tx.date}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 4px; margin: 10px 0;">
          ${items
            .map(
              (item) => `
            <div class="receipt-row">
              <span>${item.name}</span>
              <span>${formatYen(item.price)}</span>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="receipt-total-row">
          <span>合計（${typeLabel}）</span>
          <span>${formatYen(tx.amount)}</span>
        </div>
      </div>

      <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">メモ</span>
          <span>${tx.memo || "—"}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">種別</span>
          <span>${typeLabel}</span>
        </div>
      </div>

      <div class="inspector-actions">
        <button type="button" class="btn btn-secondary" id="inspector-filter-env-btn">
          ${env.nameJp}で絞り込む
        </button>
        <button type="button" class="btn btn-secondary btn-danger-quiet" id="inspector-delete-tx-btn">
          削除
        </button>
      </div>
    `;

    const filterBtn = document.getElementById("inspector-filter-env-btn");
    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        state.activeEnvelope = state.activeEnvelope === env.id ? null : env.id;
        renderAll();
      });
    }

    const deleteBtn = document.getElementById("inspector-delete-tx-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        if (state.transactions.length <= 1) return;
        state.transactions = state.transactions.filter((t) => t.id !== tx.id);
        state.selectedTxId = state.transactions[0]?.id || null;
        saveState();
        renderAll();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 9. サブビュー（予算の枡 / 口座・カード / 固定費 / 設計仕様）
  // ---------------------------------------------------------------------------
  function renderEnvelopesDetailView() {
    const grid = document.getElementById("envelopes-detail-grid");
    if (!grid) return;

    grid.innerHTML = state.envelopes
      .map((env) => {
        const spent = computeEnvelopeSpend(env.id);
        const ratio = Math.min(100, Math.round((spent / env.budget) * 100));
        return `
          <div class="card masu-box-card">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="env-dot" style="background-color: ${env.color};"></span>
                <strong style="font-weight: 500; font-size: 15px;">${env.nameJp}</strong>
              </div>
            </div>
            <p style="font-size: 12px; color: var(--text-secondary);">${env.note}</p>
            <div>
              <div class="stat-figure" style="font-size: 24px;">${formatYen(spent)}</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;" class="mono">
                上限 ${formatYen(env.budget)} の ${ratio}% 消化
              </div>
            </div>
            <div class="envelope-bar-track">
              <div class="envelope-bar-fill" style="width: ${ratio}%; background-color: ${env.color};"></div>
            </div>
            <div class="field-group" style="margin-top: 4px;">
              <label class="field-label">月次上限（円）</label>
              <div style="display: flex; gap: 8px;">
                <input
                  type="number"
                  class="field-input mono"
                  value="${env.budget}"
                  step="1000"
                  min="5000"
                  data-budget-input="${env.id}"
                  style="flex: 1;"
                />
                <button type="button" class="btn btn-secondary" data-budget-save="${env.id}">更新</button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    grid.querySelectorAll("[data-budget-save]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-budget-save");
        const input = grid.querySelector(`[data-budget-input="${id}"]`);
        if (!input) return;
        const target = state.envelopes.find((e) => e.id === id);
        if (target && Number(input.value) > 0) {
          target.budget = Math.round(Number(input.value));
          saveState();
          renderAll();
        }
      });
    });
  }

  function renderCardsDetailView() {
    const grid = document.getElementById("cards-detail-grid");
    if (!grid) return;

    const cards = [
      {
        styleClass: "graphite-metal",
        issuer: "三井住友カード（ナンバーレス）",
        shortLabel: "三井住友",
        number: "•••• •••• •••• 4821",
        holder: "主決済カード",
        closing: "月末締 · 翌月10日払",
        accountKey: "三井住友カード（4821）"
      },
      {
        styleClass: "brass-metal",
        issuer: "アメリカン・エキスプレス・ゴールド",
        shortLabel: "アメックス",
        number: "•••• •••••• •3108",
        holder: "交際・移動用",
        closing: "20日締 · 翌月10日払",
        accountKey: "アメックス・ゴールド（3108）"
      },
      {
        styleClass: "suica-ic",
        issuer: "JR東日本 モバイルSuica",
        shortLabel: "モバイルSuica",
        number: "JE70 •••• •••• 9014",
        holder: "オートチャージ連携",
        closing: "リアルタイム残高決済",
        accountKey: "モバイルSuica（9014）"
      }
    ];

    if (state.selectedCardAccount === undefined) {
      state.selectedCardAccount = "all";
    }

    grid.innerHTML = cards
      .map((c) => {
        const txList = state.transactions.filter(
          (t) => t.account === c.accountKey && t.type !== "income"
        );
        const total = txList.reduce((s, t) => s + t.amount, 0);
        const isActive = state.selectedCardAccount === c.accountKey;

        return `
          <div
            class="card"
            data-card-account="${c.accountKey}"
            style="display: flex; flex-direction: column; gap: 16px; cursor: pointer; ${
              isActive ? "border-color: var(--text-secondary);" : ""
            }"
          >
            <div class="physical-card-large ${c.styleClass}">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="emv-chip"></div>
                <span style="font-size: 11px; opacity: 0.85;">${c.issuer}</span>
              </div>
              <div>
                <div class="mono" style="font-size: 16px; letter-spacing: 0.1em; margin-bottom: 8px;">${c.number}</div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; opacity: 0.75;">
                  <span>${c.holder}</span>
                  <span>${c.closing}</span>
                </div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="color: var(--text-secondary); font-size: 13px;">10月 利用合計（${txList.length}件）</span>
              <span class="mono" style="font-size: 20px; font-weight: 500;">${formatYen(total)}</span>
            </div>
          </div>
        `;
      })
      .join("");

    grid.querySelectorAll("[data-card-account]").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        const acc = cardEl.getAttribute("data-card-account");
        state.selectedCardAccount = state.selectedCardAccount === acc ? "all" : acc;
        renderCardsDetailView();
      });
    });

    // 下段: 口座・カード別の利用明細と感熱紙レシート証憑プレビュー
    const tabsEl = document.getElementById("cards-account-tabs");
    const tbody = document.getElementById("cards-ledger-tbody");
    const inspector = document.getElementById("cards-receipt-inspector");
    if (!tabsEl || !tbody || !inspector) return;

    const tabItems = [
      { key: "all", label: "すべて" },
      ...cards.map((c) => ({ key: c.accountKey, label: c.shortLabel })),
      { key: "三菱UFJ銀行 口座振替", label: "口座振替" }
    ];

    tabsEl.innerHTML = tabItems
      .map(
        (t) => `
          <button
            type="button"
            class="seg-tab ${state.selectedCardAccount === t.key ? "active" : ""}"
            data-card-tab="${t.key}"
          >${t.label}</button>
        `
      )
      .join("");

    tabsEl.querySelectorAll("[data-card-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedCardAccount = btn.getAttribute("data-card-tab");
        renderCardsDetailView();
      });
    });

    const filtered = state.transactions.filter(
      (t) =>
        t.type !== "income" &&
        (state.selectedCardAccount === "all" || t.account === state.selectedCardAccount)
    );

    const activeTx =
      filtered.find((t) => t.id === state.selectedTxId) || filtered[0] || state.transactions[0];

    tbody.innerHTML = filtered
      .map((tx) => {
        const env = getEnvelopeById(tx.envelope);
        const isSelected = activeTx && activeTx.id === tx.id;
        return `
          <tr class="${isSelected ? "selected-row" : ""}" data-card-tx-row="${tx.id}">
            <td class="col-date">${tx.date}</td>
            <td class="col-merchant">
              <div class="merchant-cell">
                <span>${tx.merchant}</span>
                ${tx.memo ? `<span class="merchant-note">— ${tx.memo}</span>` : ""}
              </div>
            </td>
            <td class="col-envelope">
              <span class="envelope-cell">
                <span class="env-dot" style="background-color: ${env.color};"></span>
                <span>${env.nameJp}</span>
              </span>
            </td>
            <td class="col-account">${tx.account}</td>
            <td class="col-amount">${formatYen(tx.amount)}</td>
          </tr>
        `;
      })
      .join("");

    tbody.querySelectorAll("[data-card-tx-row]").forEach((row) => {
      row.addEventListener("click", () => {
        state.selectedTxId = row.getAttribute("data-card-tx-row");
        renderCardsDetailView();
        renderTransactionsTable();
        renderReceiptInspector();
      });
    });

    if (activeTx) {
      const env = getEnvelopeById(activeTx.envelope);
      const items =
        Array.isArray(activeTx.items) && activeTx.items.length > 0
          ? activeTx.items
          : [{ name: activeTx.memo || activeTx.merchant, price: activeTx.amount }];
      const typeLabel = activeTx.type === "fixed" ? "固定費" : "通常支出";

      inspector.innerHTML = `
        <div class="card-header" style="margin-bottom: 0;">
          <div class="card-title-group">
            <h3 class="card-title" style="font-size: 14px;">感熱紙レシート証憑</h3>
          </div>
          <span class="envelope-cell">
            <span class="env-dot" style="background-color: ${env.color};"></span>
            <span>${env.nameJp}</span>
          </span>
        </div>

        <div class="receipt-preview-box">
          <div class="receipt-preview-header">
            <div>
              <div class="receipt-merchant-title">${activeTx.merchant}</div>
              <div style="opacity: 0.75; margin-top: 2px;">${activeTx.account}</div>
            </div>
            <div style="text-align: right;">
              <div>${activeTx.date}</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; margin: 10px 0;">
            ${items
              .map(
                (item) => `
              <div class="receipt-row">
                <span>${item.name}</span>
                <span>${formatYen(item.price)}</span>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="receipt-total-row">
            <span>合計（${typeLabel}）</span>
            <span>${formatYen(activeTx.amount)}</span>
          </div>
        </div>

        <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">メモ</span>
            <span>${activeTx.memo || "—"}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">決済手段</span>
            <span class="mono">${activeTx.account}</span>
          </div>
        </div>
      `;
    }
  }

  function renderRecurringView() {
    const tbody = document.getElementById("recurring-tbody");
    if (!tbody) return;

    tbody.innerHTML = RECURRING_ITEMS.map((item) => {
      const env = getEnvelopeById(item.envelope);
      return `
        <tr>
          <td class="col-date">${item.day}</td>
          <td>${item.biller}</td>
          <td>
            <span class="envelope-cell">
              <span class="env-dot" style="background-color: ${env.color};"></span>
              <span>${env.nameJp}</span>
            </span>
          </td>
          <td style="font-size: 12px; color: var(--text-muted);">${item.account}</td>
          <td style="font-size: 12px; color: var(--text-secondary);">${item.status}</td>
          <td class="col-amount">${formatYen(item.amount)}</td>
        </tr>
      `;
    }).join("");
  }

  function renderSpecView() {
    const container = document.getElementById("unslop-spec-content");
    if (!container) return;

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="card" style="background-color: var(--bg-deepest);">
          <h3 class="card-title" style="margin-bottom: 12px;">基本設計方針</h3>
          <ol style="padding-left: 18px; display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--text-secondary);">
            <li><strong style="color: var(--text-primary);">目的：</strong> 個人の月次収支・5つの予算の枡・決済口座・明細を静かに記録し見通す家計台帳「枡」。</li>
            <li><strong style="color: var(--text-primary);">佇まい：</strong> 静謐・精確・手触りのある質感。</li>
            <li><strong style="color: var(--text-primary);">素材感：</strong> 黒鉛の筆記具、刷りたての感熱紙レシート、金属カード、日本の「枡」の端正な区切り。</li>
            <li><strong style="color: var(--text-primary);">造形焦点：</strong> (1) 重なり合う決済カードと感熱レシートの造形、(2) 5つの費目ドットと連動したベジェ曲線と前月対比チャート。</li>
            <li><strong style="color: var(--text-primary);">一貫した印：</strong> 控えめなキーキャップバッジ（<span class="keycap">⌘K</span> <span class="keycap">N</span> <span class="keycap">U</span>）と、各費目に付与される 6px のドット。</li>
          </ol>
        </div>

        <div class="card" style="background-color: var(--bg-deepest);">
          <h3 class="card-title" style="margin-bottom: 12px;">品質基準チェックリスト</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--text-secondary);">
            <li>・余白と寸法：4px グリッド基準（256px サイドバー、56px トップバー、24px カード余白）</li>
            <li>・配色：静かな黒鉛グラファイト階層（#0f0f10 / #141415 / #19191b / #232325）と和紙ライト配色</li>
            <li>・図像：絵文字の排除、16px・線幅 1.5px の単色アイコン</li>
            <li>・言葉遣い：日英二重表記を廃した端正な日本語ラベル、文脈のある先月比・目標比</li>
            <li>・文字組：ウェイト 400 / 500 のみ、すべての金額・日付に等幅数字（tabular-nums）を適用</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // 10. スロップ比較モード時の文言切替
  // ---------------------------------------------------------------------------
  function applySlopCopyOverrides() {
    const titleEl = document.getElementById("page-heading-title");
    const brandEl = document.getElementById("brand-title-text");
    const searchLbl = document.getElementById("sidebar-search-label");
    const primaryBtnLbl = document.getElementById("primary-btn-label");
    const slopBtnLbl = document.getElementById("slop-btn-label");
    const delta1El = document.getElementById("stat-delta-1");
    const delta2El = document.getElementById("stat-delta-2");
    const delta3El = document.getElementById("stat-delta-3");

    if (state.slopMode) {
      if (titleEl) titleEl.textContent = "Welcome back, Makoto! 👋✨";
      if (brandEl) brandEl.textContent = "✨ MasuAI PRO";
      if (searchLbl) searchLbl.textContent = "🔍 なんでもAI検索...";
      if (primaryBtnLbl) primaryBtnLbl.textContent = "✨ AI記帳!! 🚀";
      if (slopBtnLbl) slopBtnLbl.textContent = "通常表示に戻す";
      if (delta1El) delta1El.innerHTML = `<span class="delta-val positive">🔥 -8.4%!!</span>`;
      if (delta2El) delta2El.innerHTML = `<span class="delta-val positive">💰 +14.2%!!</span>`;
      if (delta3El) delta3El.innerHTML = `<span class="delta-val positive">😬 -2件!!</span>`;
    } else {
      if (titleEl) {
        const titles = {
          overview: "2026年 10月",
          transactions: "明細台帳",
          envelopes: "予算の枡",
          cards: "口座・カード",
          recurring: "固定費",
          spec: "設計仕様"
        };
        titleEl.textContent = titles[state.view] || "2026年 10月";
      }
      if (brandEl) brandEl.textContent = "枡";
      if (searchLbl) searchLbl.textContent = "検索";
      if (primaryBtnLbl) primaryBtnLbl.textContent = "記帳する";
      if (slopBtnLbl) slopBtnLbl.textContent = "スロップ比較";
    }
  }

  // ---------------------------------------------------------------------------
  // 11. ビュー切替 ＆ イベントリスナー
  // ---------------------------------------------------------------------------
  function switchView(viewName) {
    state.view = viewName;

    document.querySelectorAll("#main-nav .nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-view") === viewName);
    });

    const overviewEl = document.getElementById("view-overview");
    const envelopesEl = document.getElementById("view-envelopes");
    const cardsEl = document.getElementById("view-cards");
    const recurringEl = document.getElementById("view-recurring");
    const specEl = document.getElementById("view-spec");

    if (overviewEl) overviewEl.style.display = "none";
    if (envelopesEl) envelopesEl.style.display = "none";
    if (cardsEl) cardsEl.style.display = "none";
    if (recurringEl) recurringEl.style.display = "none";
    if (specEl) specEl.style.display = "none";

    if (viewName === "overview" || viewName === "transactions") {
      if (overviewEl) overviewEl.style.display = "flex";
      if (viewName === "transactions") {
        const ledgerSection = document.querySelector(".ledger-layout");
        if (ledgerSection) ledgerSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (viewName === "envelopes" && envelopesEl) {
      envelopesEl.style.display = "flex";
    } else if (viewName === "cards" && cardsEl) {
      cardsEl.style.display = "flex";
    } else if (viewName === "recurring" && recurringEl) {
      recurringEl.style.display = "flex";
    } else if (viewName === "spec" && specEl) {
      specEl.style.display = "flex";
    }

    renderAll();
  }

  function toggleXrayMode() {
    state.xrayMode = !state.xrayMode;
    document.body.classList.toggle("xray-active", state.xrayMode);
    const btn = document.getElementById("toggle-xray-btn");
    if (btn) btn.classList.toggle("active-toggle", state.xrayMode);
  }

  function toggleSlopMode() {
    state.slopMode = !state.slopMode;
    document.body.classList.toggle("slop-mode", state.slopMode);
    const btn = document.getElementById("toggle-slop-btn");
    if (btn) btn.classList.toggle("active-toggle", state.slopMode);
    renderAll();
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", state.theme);
  }

  function openEntryModal() {
    const backdrop = document.getElementById("entry-modal-backdrop");
    if (backdrop) {
      backdrop.classList.add("open");
      const merchantInput = document.getElementById("entry-merchant");
      if (merchantInput) setTimeout(() => merchantInput.focus(), 50);
    }
  }

  function closeEntryModal() {
    const backdrop = document.getElementById("entry-modal-backdrop");
    if (backdrop) backdrop.classList.remove("open");
  }

  function bindEvents() {
    document.querySelectorAll("#main-nav .nav-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-view");
        if (v) switchView(v);
      });
    });

    document.getElementById("toggle-xray-btn")?.addEventListener("click", toggleXrayMode);
    document.getElementById("toggle-slop-btn")?.addEventListener("click", toggleSlopMode);
    document.getElementById("exit-slop-banner-btn")?.addEventListener("click", toggleSlopMode);
    document.getElementById("spec-trigger-xray")?.addEventListener("click", toggleXrayMode);
    document.getElementById("spec-trigger-slop")?.addEventListener("click", toggleSlopMode);
    document.getElementById("toggle-theme-btn")?.addEventListener("click", toggleTheme);

    document.getElementById("open-entry-modal-btn")?.addEventListener("click", openEntryModal);
    document.getElementById("close-entry-modal-btn")?.addEventListener("click", closeEntryModal);
    document.getElementById("cancel-entry-btn")?.addEventListener("click", closeEntryModal);
    document.getElementById("entry-modal-backdrop")?.addEventListener("click", (e) => {
      if (e.target.id === "entry-modal-backdrop") closeEntryModal();
    });

    document.getElementById("entry-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const date = document.getElementById("entry-date").value || "2026-10-30";
      const amount = Math.round(Number(document.getElementById("entry-amount").value) || 0);
      const merchant = document.getElementById("entry-merchant").value.trim();
      const envelope = document.getElementById("entry-envelope").value;
      const account = document.getElementById("entry-account").value;
      const type = document.getElementById("entry-type").value;
      const memo = document.getElementById("entry-memo").value.trim();

      if (!merchant || amount <= 0) return;

      const newTx = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        date,
        merchant,
        memo,
        envelope,
        account,
        type,
        amount,
        items: [{ name: memo || merchant, price: amount }]
      };

      state.transactions.unshift(newTx);
      state.selectedTxId = newTx.id;
      saveState();
      closeEntryModal();
      e.target.reset();
      document.getElementById("entry-date").value = "2026-10-30";
      renderAll();
    });

    document.querySelectorAll("[data-chart-mode]").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.chartMode = tab.getAttribute("data-chart-mode");
        document.querySelectorAll("[data-chart-mode]").forEach((t) => {
          t.classList.toggle("active", t === tab);
        });
        renderChartSection();
      });
    });

    document.getElementById("clear-envelope-filter-btn")?.addEventListener("click", () => {
      state.activeEnvelope = null;
      renderAll();
    });

    document.querySelectorAll("#tx-type-filter [data-tx-type]").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.txTypeFilter = tab.getAttribute("data-tx-type");
        document.querySelectorAll("#tx-type-filter [data-tx-type]").forEach((t) => {
          t.classList.toggle("active", t === tab);
        });
        renderTransactionsTable();
      });
    });

    const searchInput = document.getElementById("ledger-search-input");
    searchInput?.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderTransactionsTable();
    });

    document.getElementById("sidebar-search-trigger")?.addEventListener("click", () => {
      searchInput?.focus();
      searchInput?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    document.querySelectorAll(".ledger-table th.sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const field = th.getAttribute("data-sort");
        if (state.sortField === field) {
          state.sortAsc = !state.sortAsc;
        } else {
          state.sortField = field;
          state.sortAsc = false;
        }
        renderTransactionsTable();
      });
    });

    document.getElementById("reset-demo-btn")?.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state.activeEnvelope = null;
      state.txTypeFilter = "all";
      state.searchQuery = "";
      if (searchInput) searchInput.value = "";
      loadState();
      renderAll();
    });

    window.addEventListener("keydown", (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || tag === "select";

      if (e.key === "Escape") {
        closeEntryModal();
        if (isTyping) document.activeElement.blur();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInput?.focus();
        return;
      }

      if (isTyping) return;

      const k = e.key.toLowerCase();
      if (k === "/") {
        e.preventDefault();
        searchInput?.focus();
      } else if (k === "n") {
        e.preventDefault();
        openEntryModal();
      } else if (k === "u") {
        e.preventDefault();
        toggleXrayMode();
      } else if (k === "b") {
        e.preventDefault();
        toggleSlopMode();
      } else if (k === "t") {
        e.preventDefault();
        toggleTheme();
      } else if (k === "1") {
        switchView("overview");
      } else if (k === "2") {
        switchView("envelopes");
      } else if (k === "3") {
        switchView("cards");
      } else if (k === "4") {
        switchView("spec");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadState();
    bindEvents();
    renderAll();
  });
})();
