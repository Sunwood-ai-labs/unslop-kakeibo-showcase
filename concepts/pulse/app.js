/**
 * 02 パルス (Pulse) — Deep Ink Precision Cashflow UI
 * - Moment 1: 60fps Canvas Glyph Contour Field (密度波形 / 予算軌道 / 費目マトリクス)
 * - Moment 2: Single-Accent (#ff5c28) 日次支出の推移 SVG Chart (日次バー / 累積ペース)
 * - Solari Split-Flap Tabular Counter
 * - 費目別の消化状況 (1行完結：ドット＋費目名＋細いバー＋金額)
 * - 入出金明細 & 取引詳細 / JSON表示
 */

(() => {
  "use strict";

  const STORAGE_KEY = "masu_kakeibo_pulse_jp_v2";

  // ---------------------------------------------------------------------------
  // 1. Default Shared Ledger Data (Total Budget: ¥420,000 / Spent: ¥248,620)
  // ---------------------------------------------------------------------------
  const DEFAULT_ENVELOPES = [
    {
      id: "housing",
      nameJp: "住居",
      budget: 165000
    },
    {
      id: "food",
      nameJp: "食費",
      budget: 90000
    },
    {
      id: "culture",
      nameJp: "文化",
      budget: 65000
    },
    {
      id: "transit",
      nameJp: "移動",
      budget: 45000
    },
    {
      id: "special",
      nameJp: "予備",
      budget: 55000
    }
  ];

  const DEFAULT_TRANSACTIONS = [
    {
      id: "tx-101",
      date: "2026-10-28",
      merchant: "成城石井 アトレ恵比寿店",
      memo: "週末食材・オリーブ油・チーズ・惣菜",
      envelope: "food",
      account: "三井住友カード",
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
      merchant: "丸善 丸の内本店",
      memo: "設計関連専門書2冊・MDノート",
      envelope: "culture",
      account: "三井住友カード",
      type: "expense",
      amount: 5840,
      items: [
        { name: "タイポグラフィとグリッドの秩序", price: 3520 },
        { name: "日本の木組と伝統度量衡", price: 1440 },
        { name: "ミドリ MDノート 新書サイズ 無罫", price: 880 }
      ]
    },
    {
      id: "tx-103",
      date: "2026-10-26",
      merchant: "モバイルSuica チャージ",
      memo: "オートチャージ実行",
      envelope: "transit",
      account: "モバイルSuica",
      type: "expense",
      amount: 5000,
      items: [{ name: "モバイルSuica オートチャージ", price: 5000 }]
    },
    {
      id: "tx-104",
      date: "2026-10-25",
      merchant: "東京電力エナジーパートナー",
      memo: "10月分電気料金（284kWh）",
      envelope: "housing",
      account: "三井住友カード",
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
      merchant: "10月度 給与振込",
      memo: "月次手取り支給額（社会保険・源泉税控除後）",
      envelope: "housing",
      account: "口座振替",
      type: "income",
      amount: 445000,
      items: [{ name: "月次手取り振込額", price: 445000 }]
    },
    {
      id: "tx-106",
      date: "2026-10-24",
      merchant: "オーケー みなとみらい店",
      memo: "米5kg・野菜・日用消耗品まとめ買い",
      envelope: "food",
      account: "三井住友カード",
      type: "expense",
      amount: 8920,
      items: [
        { name: "秋田県産あきたこまち 5kg", price: 3280 },
        { name: "旬の根菜・葉物野菜セット", price: 2460 },
        { name: "国産鶏むね肉・鮭切り身", price: 1980 },
        { name: "日用消耗品詰替", price: 1200 }
      ]
    },
    {
      id: "tx-107",
      date: "2026-10-22",
      merchant: "ブルーボトルコーヒー 清澄白河",
      memo: "ブレンド珈琲豆 200g・ドリップ",
      envelope: "food",
      account: "モバイルSuica",
      type: "expense",
      amount: 2640,
      items: [
        { name: "ブレンド ホールビーン 200g", price: 1960 },
        { name: "シングルオリジン ドリップ", price: 680 }
      ]
    },
    {
      id: "tx-108",
      date: "2026-10-20",
      merchant: "東京都水道局",
      memo: "9-10月検針分 上下水道料金",
      envelope: "housing",
      account: "口座振替",
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
      account: "アメックス",
      type: "expense",
      amount: 4800,
      items: [{ name: "あんペースト詰合せ", price: 4800 }]
    },
    {
      id: "tx-110",
      date: "2026-10-16",
      merchant: "ビストロ ロジウラ 渋谷",
      memo: "友人との夕食会（2名分）",
      envelope: "culture",
      account: "アメックス",
      type: "expense",
      amount: 12840,
      items: [
        { name: "季節の前菜盛合せ", price: 4200 },
        { name: "鴨胸肉のロースト・ワイン", price: 8640 }
      ]
    },
    {
      id: "tx-111",
      date: "2026-10-14",
      merchant: "無印良品 銀座",
      memo: "耐熱ガラス保存容器・リネンタオル",
      envelope: "food",
      account: "三井住友カード",
      type: "expense",
      amount: 5420,
      items: [
        { name: "耐熱ガラス保存容器 × 3", price: 2850 },
        { name: "麻ワッフルフェイスタオル × 2", price: 2570 }
      ]
    },
    {
      id: "tx-112",
      date: "2026-10-12",
      merchant: "ソニーネットワークコミュニケーションズ",
      memo: "10月分 光ファイバー通信費",
      envelope: "housing",
      account: "三井住友カード",
      type: "fixed",
      amount: 4620,
      items: [{ name: "光回線基本料・プロバイダ料", price: 4620 }]
    },
    {
      id: "tx-113",
      date: "2026-10-10",
      merchant: "北青山デンタルクリニック",
      memo: "歯科定期検診・クリーニング",
      envelope: "special",
      account: "三井住友カード",
      type: "expense",
      amount: 8600,
      items: [{ name: "定期検診・クリーニング", price: 8600 }]
    },
    {
      id: "tx-114",
      date: "2026-10-08",
      merchant: "東海道新幹線 スマートEX",
      memo: "品川↔京都 特急券",
      envelope: "transit",
      account: "アメックス",
      type: "expense",
      amount: 9680,
      items: [{ name: "のぞみ号 普通車指定席", price: 9680 }]
    },
    {
      id: "tx-115",
      date: "2026-10-06",
      merchant: "ライフ 渋谷東店",
      memo: "平日自炊用の生鮮野菜・豆腐・卵",
      envelope: "food",
      account: "モバイルSuica",
      type: "expense",
      amount: 11260,
      items: [
        { name: "有精卵・国産大豆豆腐・発酵食品", price: 3420 },
        { name: "旬の鮮魚・豚ロース・季節野菜", price: 7840 }
      ]
    },
    {
      id: "tx-116",
      date: "2026-10-04",
      merchant: "東京都現代美術館",
      memo: "企画展観覧券・図録購入",
      envelope: "culture",
      account: "モバイルSuica",
      type: "expense",
      amount: 7800,
      items: [
        { name: "企画展 一般観覧チケット", price: 2200 },
        { name: "展覧会公式図録", price: 5600 }
      ]
    },
    {
      id: "tx-117",
      date: "2026-10-02",
      merchant: "金継ぎ工房 漆器修理",
      memo: "飯碗の欠け補修内金",
      envelope: "special",
      account: "口座振替",
      type: "expense",
      amount: 8800,
      items: [{ name: "本漆・金継ぎ補修工程費", price: 8800 }]
    },
    {
      id: "tx-118",
      date: "2026-10-01",
      merchant: "東急住宅リース",
      memo: "10月分 賃料および管理共益費",
      envelope: "housing",
      account: "口座振替",
      type: "fixed",
      amount: 118000,
      items: [
        { name: "月額建物賃料（1LDK）", price: 110000 },
        { name: "共益費・管理維持費", price: 8000 }
      ]
    },
    {
      id: "tx-119",
      date: "2026-10-01",
      merchant: "ビオセボン 麻布十番店",
      memo: "月初まとめ買い（パスタ・有機豆乳・珈琲）",
      envelope: "food",
      account: "三井住友カード",
      type: "expense",
      amount: 12120,
      items: [
        { name: "有機デュラム小麦パスタ・トマト缶", price: 4860 },
        { name: "有機無調整豆乳・ナッツ類", price: 7260 }
      ]
    }
  ];

  const RECURRING_FIXED_ITEMS = [
    { id: "rec-1", name: "住居賃料・共益費", monthly: 118000, signal: true },
    { id: "rec-2", name: "開発・AIクラウドリソース", monthly: 15200, signal: true },
    { id: "rec-3", name: "東京電力（従量電灯）", monthly: 11420, signal: false },
    { id: "rec-4", name: "光ファイバー通信回線", monthly: 4620, signal: false },
    { id: "rec-5", name: "上下水道料金（月割）", monthly: 4380, signal: false }
  ];

  // ---------------------------------------------------------------------------
  // 2. Application State
  // ---------------------------------------------------------------------------
  let state = {
    theme: "dark",
    view: "cockpit",
    xrayMode: false,
    slopMode: false,
    glyphMode: "wave",          // 'wave' | 'runway' | 'matrix'
    horizonMode: "impulse",     // 'impulse' | 'combined'
    allocMode: "envelopes",     // 'envelopes' | 'recurring'
    inspectorMode: "voucher",   // 'voucher' | 'json'
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
          state.envelopes = DEFAULT_ENVELOPES.map((def, i) => ({
            ...def,
            budget: parsed.envelopes[i]?.budget || def.budget
          }));
          state.transactions = parsed.transactions;
          state.selectedTxId = state.transactions[0]?.id || "tx-101";
          return;
        }
      }
    } catch (err) {
      console.warn("LocalStorage unavailable, using default state.", err);
    }
    state.envelopes = JSON.parse(JSON.stringify(DEFAULT_ENVELOPES));
    state.transactions = JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS));
    state.selectedTxId = state.transactions[0]?.id || "tx-101";
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
    } catch (err) {
      console.warn("Could not persist state.", err);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Formatting & Calculation Helpers
  // ---------------------------------------------------------------------------
  function formatYen(num) {
    const n = Math.round(Number(num) || 0);
    const abs = Math.abs(n).toLocaleString("ja-JP");
    return n < 0 ? `-¥${abs}` : `¥${abs}`;
  }

  function formatShortDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}`;
    }
    return dateStr;
  }

  function getEnvelope(id) {
    return state.envelopes.find((e) => e.id === id) || state.envelopes[0];
  }

  function getTxTypeLabel(type) {
    if (type === "income") return "収入";
    if (type === "fixed") return "固定費";
    return "変動費";
  }

  function computeEnvelopeSpend(envId) {
    return state.transactions
      .filter((t) => t.type !== "income" && t.envelope === envId)
      .reduce((s, t) => s + Number(t.amount || 0), 0);
  }

  function computeTelemetryMetrics() {
    let spent = 0;
    let income = 0;
    let fixedSpent = 0;
    for (const t of state.transactions) {
      const amt = Number(t.amount || 0);
      if (t.type === "income") {
        income += amt;
      } else {
        spent += amt;
        if (t.type === "fixed") fixedSpent += amt;
      }
    }
    const totalBudget = state.envelopes.reduce((s, e) => s + Number(e.budget || 0), 0);
    const remainingBudget = totalBudget - spent;
    const netSavings = Math.max(0, income - spent);
    const daysElapsed = 31;
    const dailyBurn = Math.round(spent / daysElapsed);

    return {
      spent,
      income,
      fixedSpent,
      totalBudget,
      remainingBudget,
      netSavings,
      dailyBurn
    };
  }

  // ---------------------------------------------------------------------------
  // 4. Master Render Orchestrator
  // ---------------------------------------------------------------------------
  function renderAll() {
    renderHeroTelemetry();
    renderHorizonChart();
    renderAllocationPanel();
    renderStreamEnvelopeChips();
    renderTransactionStream();
    renderPacketInspector();
    applySlopOverrides();
  }

  // ---------------------------------------------------------------------------
  // 5. Hero KPI & Solari Split-Flap Counter
  // ---------------------------------------------------------------------------
  function buildSolariCells(formattedStr) {
    const chars = formattedStr.split("");
    return chars
      .map((ch) => {
        if (ch === ",") {
          return `<span class="solari-sep">,</span>`;
        }
        const isCurrency = ch === "¥" || ch === "-";
        return `<span class="solari-cell ${isCurrency ? "currency" : ""}">${ch}</span>`;
      })
      .join("");
  }

  function renderHeroTelemetry() {
    const {
      spent,
      income,
      remainingBudget,
      netSavings,
      dailyBurn
    } = computeTelemetryMetrics();

    // Solari Split-Flap Main Counter
    const solariStrip = document.getElementById("solari-spent-strip");
    if (solariStrip) {
      solariStrip.innerHTML = buildSolariCells(formatYen(spent));
    }

    const septSpent = 271400;
    const diffPct = (((spent - septSpent) / septSpent) * 100).toFixed(1);
    const sign = diffPct > 0 ? "+" : "";
    const isLess = spent <= septSpent;

    const deltaSpentEl = document.getElementById("hero-delta-spent");
    if (deltaSpentEl && !state.slopMode) {
      deltaSpentEl.innerHTML = `
        <span class="delta-badge ${isLess ? "positive" : "negative"}">${sign}${diffPct}% 先月比</span>
      `;
    }

    // Sub-Instruments: 純貯蓄 & 日次ペース
    const savingsValEl = document.getElementById("inst-savings-val");
    if (savingsValEl) savingsValEl.textContent = formatYen(netSavings);

    const savingsRate = income > 0 ? ((netSavings / income) * 100).toFixed(1) : "0.0";
    const savingsDeltaEl = document.getElementById("inst-savings-delta");
    if (savingsDeltaEl) {
      savingsDeltaEl.innerHTML = `貯蓄率 <span class="positive">${savingsRate}%</span>`;
    }

    const burnValEl = document.getElementById("inst-burn-val");
    if (burnValEl) burnValEl.innerHTML = `${formatYen(dailyBurn)} <small>/日</small>`;

    const burnDeltaEl = document.getElementById("inst-burn-delta");
    if (burnDeltaEl) {
      burnDeltaEl.innerHTML = `残予算 <span class="mono">${formatYen(remainingBudget)}</span>`;
    }

    // Canvas Pinned Callouts (Strictly 2 tags: ¥8,020 /日 & 残予算 ¥171,380)
    const pinBurn = document.getElementById("pin-burn-text");
    const pinRunway = document.getElementById("pin-runway-text");
    if (pinBurn) pinBurn.textContent = `${formatYen(dailyBurn)} /日`;
    if (pinRunway) pinRunway.textContent = formatYen(remainingBudget);
  }

  // ---------------------------------------------------------------------------
  // 6. MOMENT 1: Interactive 60fps Canvas Glyph Contour Field
  // ---------------------------------------------------------------------------
  function initCanvasGlyphEngine() {
    const canvas = document.getElementById("glyph-matrix-canvas");
    const stage = document.getElementById("glyph-canvas-stage");
    if (!canvas || !stage) return;

    const ctx = canvas.getContext("2d");
    const GLYPH_RAMP = ["·", "·", ":", "-", "=", "+", "1", "4", "0", "8", "¥"];

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pointer = { x: -999, y: -999, active: false };
    let startTime = performance.now();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const rect = stage.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width));
      height = Math.max(240, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    });

    canvas.addEventListener("mouseleave", () => {
      pointer.active = false;
    });

    function renderFrame(now) {
      const t = prefersReducedMotion ? 1.8 : (now - startTime) * 0.0016;
      const isLight = state.theme === "light";

      ctx.clearRect(0, 0, width, height);

      const cellW = 14;
      const cellH = 16;
      const cols = Math.floor(width / cellW);
      const rows = Math.floor(height / cellH);

      ctx.font = "500 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        const ny = r / Math.max(1, rows - 1);
        for (let c = 0; c < cols; c++) {
          const nx = c / Math.max(1, cols - 1);
          const px = c * cellW + cellW * 0.5;
          const py = r * cellH + cellH * 0.5;

          let intensity = 0;
          if (state.glyphMode === "wave") {
            const waveCenter =
              0.52 +
              0.18 * Math.sin(nx * 5.2 - t * 1.3) +
              0.09 * Math.cos(nx * 11.0 + t * 0.8);
            const dist = Math.abs(ny - waveCenter);
            const ridge = Math.exp(-dist * dist * 26);
            const carrier = 0.5 + 0.5 * Math.sin(nx * 14 - ny * 8 + t * 1.6);
            intensity = ridge * (0.68 + 0.32 * carrier);
          } else if (state.glyphMode === "runway") {
            const horizonY = 0.25 + 0.55 * Math.pow(nx, 1.35) + 0.04 * Math.sin(t + nx * 8);
            const d = Math.abs(ny - horizonY);
            const band = Math.exp(-d * d * 38);
            const gridPulse = (c % 5 === 0 || r % 4 === 0) ? 0.28 : 0.08;
            intensity = Math.min(1, band + gridPulse);
          } else {
            const bandIdx = Math.min(4, Math.floor(nx * 5));
            const env = state.envelopes[bandIdx];
            const ratio = env ? Math.min(1, computeEnvelopeSpend(env.id) / env.budget) : 0.6;
            const fillLine = 1.0 - ratio * 0.78;
            const insideBar = ny >= fillLine ? 0.72 : 0.14;
            const scanline = 0.18 * Math.sin(ny * 20 - t * 2.4 + bandIdx);
            intensity = Math.max(0.05, Math.min(1, insideBar + scanline));
          }

          let cursorBoost = 0;
          if (pointer.active) {
            const dx = px - pointer.x;
            const dy = py - pointer.y;
            const distSq = dx * dx + dy * dy;
            cursorBoost = Math.exp(-distSq / (92 * 92)) * 0.55;
          }

          const v = Math.max(0, Math.min(1, intensity + cursorBoost));
          const glyphIndex = Math.min(
            GLYPH_RAMP.length - 1,
            Math.floor(v * GLYPH_RAMP.length)
          );
          const ch = GLYPH_RAMP[glyphIndex];

          if (v > 0.78) {
            ctx.fillStyle = isLight
              ? `rgba(224, 72, 25, ${(0.65 + (v - 0.78) * 1.5).toFixed(2)})`
              : `rgba(255, 92, 40, ${(0.65 + (v - 0.78) * 1.5).toFixed(2)})`;
          } else if (v > 0.56) {
            ctx.fillStyle = isLight
              ? `rgba(15, 20, 28, ${(0.45 + (v - 0.56) * 1.4).toFixed(2)})`
              : `rgba(236, 239, 244, ${(0.45 + (v - 0.56) * 1.5).toFixed(2)})`;
          } else if (v > 0.34) {
            ctx.fillStyle = isLight
              ? "rgba(74, 85, 104, 0.38)"
              : "rgba(154, 163, 178, 0.34)";
          } else {
            ctx.fillStyle = isLight
              ? "rgba(113, 128, 150, 0.18)"
              : "rgba(99, 108, 126, 0.18)";
          }

          ctx.fillText(ch, px, py);
        }
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderFrame);
      }
    }

    requestAnimationFrame(renderFrame);
  }

  // ---------------------------------------------------------------------------
  // 7. MOMENT 2: 日次支出の推移 SVG Chart (日次バー / 累積ペース)
  // ---------------------------------------------------------------------------
  function build31DayTelemetrySeries() {
    const baseDaily = [
      130120, 8800, 1420, 7800, 2180, 11260, 1840, 9680, 1620, 8600,
      1950, 4620, 1480, 5420, 2100, 12840, 1920, 4800, 1540, 4380,
      1760, 2640, 1890, 8920, 11420, 5000, 5840, 6480, 1920, 2400, 1800
    ];

    const customTx = state.transactions.filter(
      (t) =>
        t.type !== "income" &&
        (!state.activeEnvelope || t.envelope === state.activeEnvelope)
    );

    const days = Array.from({ length: 31 }, (_, idx) => {
      const dayNum = idx + 1;
      const dateStr = `2026-10-${String(dayNum).padStart(2, "0")}`;
      const dayTx = customTx.filter((t) => t.date === dateStr);
      const txSum = dayTx.reduce((s, t) => s + Number(t.amount || 0), 0);

      const amount = state.activeEnvelope
        ? txSum
        : txSum > 0
          ? txSum
          : baseDaily[idx] % 3500;

      const topMerchant =
        dayTx[0]?.merchant ||
        (dayNum === 25 ? "東京電力・日次支出" : "日常支出");

      return {
        day: dayNum,
        dateStr,
        amount,
        topMerchant
      };
    });

    let cum = 0;
    return days.map((d) => {
      cum += d.amount;
      return { ...d, cumulative: cum };
    });
  }

  function renderHorizonChart() {
    const svg = document.getElementById("impulse-horizon-svg");
    const tooltip = document.getElementById("horizon-tooltip");
    if (!svg) return;

    const series = build31DayTelemetrySeries();
    const width = 780;
    const height = 264;
    const padLeft = 52;
    const padRight = state.horizonMode === "combined" ? 54 : 20;
    const padTop = 16;
    const padBottom = 28;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;
    const baseY = padTop + plotH;

    const maxDailyScale = 24000;
    const maxCumScale = Math.max(300000, series[series.length - 1]?.cumulative || 273000);
    const threshold = 10000;

    let html = "";

    const yTicks = [
      { ratio: 0, leftLbl: "¥2.4万", rightLbl: "¥30万" },
      { ratio: 0.5, leftLbl: "¥1.2万", rightLbl: "¥15万" },
      { ratio: 1 - threshold / maxDailyScale, leftLbl: "¥1.0万", rightLbl: "", isThreshold: true },
      { ratio: 1, leftLbl: "¥0", rightLbl: "¥0", isBase: true }
    ];

    for (const tk of yTicks) {
      const y = padTop + tk.ratio * plotH;
      const stroke = tk.isThreshold
        ? "rgba(255, 92, 40, 0.25)"
        : tk.isBase
          ? "var(--border-strong)"
          : "var(--slate-grid)";
      const dash = tk.isThreshold ? 'stroke-dasharray="3 3"' : "";
      html += `
        <line x1="${padLeft}" y1="${y.toFixed(1)}" x2="${width - padRight}" y2="${y.toFixed(1)}" stroke="${stroke}" stroke-width="1" ${dash} />
        <text x="${padLeft - 8}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" fill="${tk.isThreshold ? "var(--accent-signal)" : "var(--text-muted)"}" font-size="10" font-family="var(--font-mono)">${tk.leftLbl}</text>
      `;
      if (state.horizonMode === "combined" && tk.rightLbl) {
        html += `<text x="${width - padRight + 8}" y="${(y + 3.5).toFixed(1)}" text-anchor="start" fill="var(--text-muted)" font-size="10" font-family="var(--font-mono)">${tk.rightLbl}</text>`;
      }
    }

    const colStep = plotW / 31;
    const barW = Math.max(8, colStep * 0.58);
    const cumPoints = [];

    series.forEach((d, idx) => {
      const cx = padLeft + idx * colStep + colStep * 0.5;
      const clampedDaily = Math.min(maxDailyScale, d.amount);
      const barH = Math.max(3, (clampedDaily / maxDailyScale) * plotH);
      const barY = baseY - barH;
      const isSpike = d.amount >= threshold;

      const fill = isSpike ? "var(--accent-signal)" : "var(--slate-bar-hover)";
      const opacity = isSpike ? "0.95" : "0.75";

      html += `
        <g class="impulse-col" data-day="10/${String(d.day).padStart(2, "0")}" data-amt="${formatYen(d.amount)}" data-cum="${formatYen(d.cumulative)}" data-merchant="${d.topMerchant}">
          <rect
            x="${(cx - barW * 0.5).toFixed(1)}"
            y="${barY.toFixed(1)}"
            width="${barW.toFixed(1)}"
            height="${barH.toFixed(1)}"
            rx="1.5"
            fill="${fill}"
            opacity="${opacity}"
          />
          <rect
            x="${(cx - colStep * 0.5).toFixed(1)}"
            y="${padTop}"
            width="${colStep.toFixed(1)}"
            height="${plotH}"
            fill="transparent"
            style="cursor: crosshair;"
          />
        </g>
      `;

      if (d.day === 1 || (d.day % 5 === 0 && d.day < 30) || d.day === 31) {
        html += `
          <line x1="${cx.toFixed(1)}" y1="${baseY}" x2="${cx.toFixed(1)}" y2="${baseY + 5}" stroke="var(--border-strong)" />
          <text x="${cx.toFixed(1)}" y="${height - 6}" text-anchor="middle" fill="var(--text-muted)" font-size="10" font-family="var(--font-mono)">10/${String(d.day).padStart(2, "0")}</text>
        `;
      }

      const cumY = baseY - (d.cumulative / maxCumScale) * plotH;
      cumPoints.push({ x: cx, y: cumY, d });
    });

    if (state.horizonMode === "combined" && cumPoints.length > 1) {
      const pathD = cumPoints
        .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
        .join(" ");
      const areaD = `${pathD} L ${cumPoints[cumPoints.length - 1].x.toFixed(1)} ${baseY} L ${cumPoints[0].x.toFixed(1)} ${baseY} Z`;

      html += `
        <defs>
          <linearGradient id="pulse-trajectory-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-signal)" stop-opacity="0.22" />
            <stop offset="100%" stop-color="var(--accent-signal)" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#pulse-trajectory-grad)" pointer-events="none" />
        <path d="${pathD}" fill="none" stroke="var(--accent-signal)" stroke-width="2" pointer-events="none" />
      `;

      const lastPt = cumPoints[cumPoints.length - 1];
      html += `
        <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="4" fill="var(--accent-signal)" stroke="var(--bg-card)" stroke-width="1.5" pointer-events="none" />
      `;
    }

    svg.innerHTML = html;

    svg.querySelectorAll(".impulse-col").forEach((col) => {
      col.addEventListener("mouseenter", () => {
        if (!tooltip) return;
        const day = col.getAttribute("data-day");
        const amt = col.getAttribute("data-amt");
        const cum = col.getAttribute("data-cum");
        const merch = col.getAttribute("data-merchant");
        tooltip.innerHTML = `<span style="color:var(--accent-signal);">${day}</span> · 日次: <strong>${amt}</strong> · 累計: <strong>${cum}</strong> · <span style="color:var(--text-secondary);">${merch}</span>`;
        tooltip.classList.add("visible");
      });
      col.addEventListener("mouseleave", () => {
        if (tooltip) tooltip.classList.remove("visible");
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 8. 費目別の消化状況 (Single-Line Clean Rows: ドット＋費目名＋細いバー＋金額)
  // ---------------------------------------------------------------------------
  function renderAllocationPanel() {
    const container = document.getElementById("recurring-matrix-list");
    const titleEl = document.getElementById("side-allocation-title");
    if (!container) return;

    if (state.allocMode === "recurring") {
      if (titleEl) titleEl.textContent = "定期固定費の内訳";
      container.innerHTML = RECURRING_FIXED_ITEMS.map((item) => {
        const pct = Math.min(100, Math.max(8, Math.round((item.monthly / 118000) * 100)));
        return `
          <div class="alloc-row fixed-item-row">
            <span class="alloc-dot ${item.signal ? "signal" : "positive"}"></span>
            <span class="alloc-name">${item.name}</span>
            <div class="alloc-bar-track">
              <div class="alloc-bar-fill ${item.signal ? "signal" : ""}" style="width: ${pct}%;"></div>
            </div>
            <span class="alloc-amount">${formatYen(item.monthly)}</span>
          </div>
        `;
      }).join("");
      return;
    }

    if (titleEl) titleEl.textContent = "費目別の消化状況";

    container.innerHTML = state.envelopes
      .map((env) => {
        const spent = computeEnvelopeSpend(env.id);
        const pct = Math.min(100, Math.max(6, Math.round((spent / env.budget) * 100)));
        const isActive = state.activeEnvelope === env.id;
        const isHigh = pct >= 80;
        return `
          <button
            type="button"
            class="alloc-row ${isActive ? "active" : ""}"
            data-alloc-env="${env.id}"
            title="${env.nameJp}（予算 ${formatYen(env.budget)}）"
          >
            <span class="alloc-dot ${isHigh ? "signal" : ""}"></span>
            <span class="alloc-name">${env.nameJp}</span>
            <div class="alloc-bar-track">
              <div class="alloc-bar-fill ${isHigh ? "signal" : ""}" style="width: ${pct}%;"></div>
            </div>
            <span class="alloc-amount">${formatYen(spent)}</span>
          </button>
        `;
      })
      .join("");

    container.querySelectorAll("[data-alloc-env]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-alloc-env");
        state.activeEnvelope = state.activeEnvelope === id ? null : id;
        renderAll();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 9. 入出金明細 & 費目フィルタチップ
  // ---------------------------------------------------------------------------
  function renderStreamEnvelopeChips() {
    const strip = document.getElementById("stream-envelope-chips");
    if (!strip) return;

    const allChip = `
      <button type="button" class="filter-chip ${!state.activeEnvelope ? "active" : ""}" data-chip-env="">
        <span>全費目</span>
      </button>
    `;

    const envChips = state.envelopes
      .map((env) => {
        const active = state.activeEnvelope === env.id;
        return `
          <button type="button" class="filter-chip ${active ? "active" : ""}" data-chip-env="${env.id}">
            <span>${env.nameJp}</span>
          </button>
        `;
      })
      .join("");

    strip.innerHTML = allChip + envChips;

    strip.querySelectorAll("[data-chip-env]").forEach((btn) => {
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
        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          const hay = `${tx.merchant} ${tx.memo} ${tx.account} ${tx.date}`.toLowerCase();
          if (!hay.includes(q)) return false;
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

  function renderTransactionStream() {
    const tbody = document.getElementById("stream-tbody");
    if (!tbody) return;

    const rows = getFilteredTransactions();

    tbody.innerHTML = rows
      .map((tx) => {
        const env = getEnvelope(tx.envelope);
        const isSelected = tx.id === state.selectedTxId;
        const isIncome = tx.type === "income";
        const isSpike = !isIncome && tx.amount >= 10000;

        return `
          <tr class="${isSelected ? "selected" : ""}" data-tx-id="${tx.id}">
            <td class="mono" style="color:var(--text-secondary);">${formatShortDate(tx.date)}</td>
            <td>
              <div class="tx-merchant-cell">
                <span class="tx-merchant-name">${tx.merchant}</span>
                <span class="tx-merchant-memo">${tx.memo || ""}</span>
              </div>
            </td>
            <td>
              <span class="channel-tag">${env.nameJp}</span>
            </td>
            <td style="color:var(--text-secondary);">${tx.account}</td>
            <td class="col-amt mono ${isIncome ? "amt-income" : isSpike ? "amt-spike" : ""}">
              ${isIncome ? "+" : "-"}${formatYen(tx.amount)}
            </td>
          </tr>
        `;
      })
      .join("");

    tbody.querySelectorAll("tr[data-tx-id]").forEach((tr) => {
      tr.addEventListener("click", () => {
        state.selectedTxId = tr.getAttribute("data-tx-id");
        renderTransactionStream();
        renderPacketInspector();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 10. 取引詳細 & JSON表示
  // ---------------------------------------------------------------------------
  function renderPacketInspector() {
    const body = document.getElementById("packet-inspector-body");
    if (!body) return;

    const tx =
      state.transactions.find((t) => t.id === state.selectedTxId) ||
      state.transactions[0];
    if (!tx) {
      body.innerHTML = `<div class="voucher-card"><span style="color:var(--text-muted);">明細が選択されていません</span></div>`;
      return;
    }

    const env = getEnvelope(tx.envelope);
    const isIncome = tx.type === "income";

    if (state.inspectorMode === "json") {
      const payload = {
        日付: tx.date,
        店舗: tx.merchant,
        費目: env.nameJp,
        種別: getTxTypeLabel(tx.type),
        決済手段: tx.account,
        金額: tx.amount,
        メモ: tx.memo || "",
        内訳: (tx.items || [{ name: tx.merchant, price: tx.amount }]).map((it) => ({
          品目: it.name || it.品目,
          金額: it.price ?? it.金額
        }))
      };
      body.innerHTML = `<pre class="raw-json-pre">${JSON.stringify(payload, null, 2)}</pre>`;
      return;
    }

    const items = tx.items && tx.items.length
      ? tx.items
      : [{ name: tx.memo || tx.merchant, price: tx.amount }];

    body.innerHTML = `
      <div class="voucher-card">
        <div class="voucher-head">
          <div class="voucher-title">${tx.merchant}</div>
          <div class="voucher-amount-hero" style="color: ${isIncome ? "var(--sem-positive)" : "var(--accent-signal)"};">
            ${isIncome ? "+" : "-"}${formatYen(tx.amount)}
          </div>
        </div>

        <div class="voucher-kv-grid">
          <div class="v-kv">
            <span>日付</span>
            <span class="mono">${tx.date}</span>
          </div>
          <div class="v-kv">
            <span>費目 / 種別</span>
            <span>${env.nameJp}（${getTxTypeLabel(tx.type)}）</span>
          </div>
          <div class="v-kv">
            <span>決済手段</span>
            <span>${tx.account}</span>
          </div>
          <div class="v-kv">
            <span>メモ</span>
            <span>${tx.memo || "—"}</span>
          </div>
        </div>

        <div class="voucher-items">
          ${items
            .map(
              (it) => `
            <div class="voucher-line">
              <span>${it.name}</span>
              <span>${formatYen(it.price)}</span>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="voucher-footer-actions">
          <button type="button" class="btn-delete-tx" id="delete-selected-tx-btn">この明細を削除</button>
        </div>
      </div>
    `;

    document.getElementById("delete-selected-tx-btn")?.addEventListener("click", () => {
      if (state.transactions.length <= 1) return;
      state.transactions = state.transactions.filter((t) => t.id !== tx.id);
      state.selectedTxId = state.transactions[0]?.id || "";
      saveState();
      renderAll();
    });
  }

  // ---------------------------------------------------------------------------
  // 11. スロップ比較モード ([B])
  // ---------------------------------------------------------------------------
  function applySlopOverrides() {
    const titleEl = document.getElementById("topbar-heading-text");
    const ctaEl = document.getElementById("primary-cta-text");
    const deltaEl = document.getElementById("hero-delta-spent");

    if (state.slopMode) {
      if (titleEl) titleEl.textContent = "🚀 AI超スマート資産ダッシュボード ✨";
      if (ctaEl) ctaEl.textContent = "🔥 AI自動記帳!!";
      if (deltaEl) {
        deltaEl.innerHTML = `<span class="delta-badge positive">🚀 +999% 爆益達成!!</span>`;
      }
    } else {
      if (titleEl) titleEl.textContent = "2026年 10月";
      if (ctaEl) ctaEl.textContent = "+ 記帳";
    }
  }

  // ---------------------------------------------------------------------------
  // 12. Event Listeners & Keyboard Shortcuts ([N] [U] [B] [T] [/] [1-4])
  // ---------------------------------------------------------------------------
  function bindEvents() {
    // View Navigation (Left 56px Icon Rail)
    document.querySelectorAll(".rail-btn[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        switchView(view);
      });
    });

    // Glyph Canvas Mode Tabs
    document.querySelectorAll("[data-glyph-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.glyphMode = btn.getAttribute("data-glyph-mode");
        document.querySelectorAll("[data-glyph-mode]").forEach((b) =>
          b.classList.toggle("active", b === btn)
        );
      });
    });

    // Horizon Chart Mode Tabs
    document.querySelectorAll("[data-horizon-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.horizonMode = btn.getAttribute("data-horizon-mode");
        document.querySelectorAll("[data-horizon-mode]").forEach((b) =>
          b.classList.toggle("active", b === btn)
        );
        renderHorizonChart();
      });
    });

    // Allocation Panel Mode Tabs (費目別 / 固定費)
    document.querySelectorAll("[data-alloc-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.allocMode = btn.getAttribute("data-alloc-mode");
        document.querySelectorAll("[data-alloc-mode]").forEach((b) =>
          b.classList.toggle("active", b === btn)
        );
        renderAllocationPanel();
      });
    });

    // Stream Transaction Type Tabs
    document.querySelectorAll("#stream-type-tabs [data-tx-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.txTypeFilter = btn.getAttribute("data-tx-type");
        document.querySelectorAll("#stream-type-tabs [data-tx-type]").forEach((b) =>
          b.classList.toggle("active", b === btn)
        );
        renderTransactionStream();
      });
    });

    // Packet Inspector Mode Tabs (取引詳細 vs JSON表示)
    document.querySelectorAll("[data-insp-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.inspectorMode = btn.getAttribute("data-insp-mode");
        document.querySelectorAll("[data-insp-mode]").forEach((b) =>
          b.classList.toggle("active", b === btn)
        );
        renderPacketInspector();
      });
    });

    // Search Input
    const searchInput = document.getElementById("stream-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value.trim();
        renderTransactionStream();
      });
    }

    // Table Sorting
    document.querySelectorAll(".telemetry-table th.sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const field = th.getAttribute("data-sort");
        if (state.sortField === field) {
          state.sortAsc = !state.sortAsc;
        } else {
          state.sortField = field;
          state.sortAsc = false;
        }
        renderTransactionStream();
      });
    });

    // Toggle X-Ray [U]
    const toggleXray = () => {
      state.xrayMode = !state.xrayMode;
      document.body.classList.toggle("xray-active", state.xrayMode);
    };
    ["top-xray-btn", "dock-xray-btn"].forEach((id) => {
      document.getElementById(id)?.addEventListener("click", toggleXray);
    });

    // Toggle AI Slop Compare [B]
    const toggleSlop = () => {
      state.slopMode = !state.slopMode;
      document.body.classList.toggle("slop-active", state.slopMode);
      renderAll();
    };
    ["top-slop-btn", "exit-slop-btn"].forEach((id) => {
      document.getElementById(id)?.addEventListener("click", toggleSlop);
    });

    // Toggle Theme [T]
    const toggleTheme = () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", state.theme);
    };
    ["top-theme-btn", "dock-theme-btn"].forEach((id) => {
      document.getElementById(id)?.addEventListener("click", toggleTheme);
    });

    // Modal Open / Close [N]
    const modalBackdrop = document.getElementById("pulse-modal-backdrop");
    const openModal = () => {
      modalBackdrop?.classList.add("open");
      document.getElementById("pulse-amount")?.focus();
    };
    const closeModal = () => {
      modalBackdrop?.classList.remove("open");
    };
    ["top-log-btn", "dock-log-btn"].forEach((id) => {
      document.getElementById(id)?.addEventListener("click", openModal);
    });
    ["close-modal-btn", "cancel-modal-btn"].forEach((id) => {
      document.getElementById(id)?.addEventListener("click", closeModal);
    });
    modalBackdrop?.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    // Form Submit: 新規記帳
    const entryForm = document.getElementById("pulse-entry-form");
    entryForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const date = document.getElementById("pulse-date").value || "2026-10-30";
      const amount = Number(document.getElementById("pulse-amount").value || 0);
      const merchant = document.getElementById("pulse-merchant").value.trim();
      const envelope = document.getElementById("pulse-envelope").value;
      const account = document.getElementById("pulse-account").value;
      const type = document.getElementById("pulse-type").value;
      const memo = document.getElementById("pulse-memo").value.trim() || "";

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
      renderAll();
      entryForm.reset();
      document.getElementById("pulse-date").value = "2026-10-30";
      closeModal();
    });

    // Filter Stream Button in Dock
    document.getElementById("dock-filter-btn")?.addEventListener("click", () => {
      const input = document.getElementById("stream-search-input");
      if (input) {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
        input.focus();
      }
    });

    // Reset Sample State
    document.getElementById("rail-reset-btn")?.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      loadState();
      state.activeEnvelope = null;
      state.searchQuery = "";
      renderAll();
    });

    // Global Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      const tag = document.activeElement?.tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (e.key === "Escape") {
        closeModal();
        if (inInput) document.activeElement.blur();
        return;
      }
      if (inInput) return;

      const k = e.key.toLowerCase();
      if (k === "n") {
        e.preventDefault();
        openModal();
      } else if (k === "u") {
        e.preventDefault();
        toggleXray();
      } else if (k === "b") {
        e.preventDefault();
        toggleSlop();
      } else if (k === "t") {
        e.preventDefault();
        toggleTheme();
      } else if (k === "/") {
        e.preventDefault();
        document.getElementById("stream-search-input")?.focus();
      } else if (k === "1") {
        switchView("cockpit");
      } else if (k === "2") {
        switchView("horizon");
      } else if (k === "3") {
        switchView("recurring");
      } else if (k === "4") {
        switchView("stream");
      }
    });
  }

  function switchView(view) {
    state.view = view;
    document.querySelectorAll(".rail-btn[data-view]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-view") === view);
    });

    if (view === "recurring") {
      state.allocMode = state.allocMode === "envelopes" ? "recurring" : "envelopes";
      document.querySelectorAll("[data-alloc-mode]").forEach((b) =>
        b.classList.toggle("active", b.getAttribute("data-alloc-mode") === state.allocMode)
      );
      renderAllocationPanel();
    }

    const sectionMap = {
      cockpit: "section-hero",
      horizon: "section-horizon",
      recurring: "section-recurring",
      stream: "section-stream"
    };
    const targetId = sectionMap[view];
    if (view === "cockpit") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // ---------------------------------------------------------------------------
  // 13. Boot
  // ---------------------------------------------------------------------------
  loadState();
  renderAll();
  initCanvasGlyphEngine();
  bindEvents();
})();
