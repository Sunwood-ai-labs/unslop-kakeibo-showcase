/**
 * 家計栞 — Warm Botanical Archival Ledger
 * 引き算の美学・余白の拡大・100%洗練された日本語UI
 * Design principles based on unslop by Damir Sokolovsky (@heydamir) — CC BY 4.0
 */

(() => {
  "use strict";

  const STORAGE_KEY = "kakei_shiori_ledger_v2";
  const MONTHLY_INCOME = 445000;
  const PREV_MONTH_OUTFLOW = 271420;
  const TARGET_RESERVE = 172000;

  // ---------------------------------------------------------------------------
  // 1. 月次推移データ (1月〜10月)
  //    10月（今月）のみフォレストインク (#1b5e43)、1月〜9月は銅版画ハッチング
  // ---------------------------------------------------------------------------
  const SEASONAL_MONTHS = [
    { key: "01", labelJp: "1月",  total: 262000, isCurrent: false },
    { key: "02", labelJp: "2月",  total: 249000, isCurrent: false },
    { key: "03", labelJp: "3月",  total: 258000, isCurrent: false },
    { key: "04", labelJp: "4月",  total: 269000, isCurrent: false },
    { key: "05", labelJp: "5月",  total: 251000, isCurrent: false },
    { key: "06", labelJp: "6月",  total: 244000, isCurrent: false },
    { key: "07", labelJp: "7月",  total: 261000, isCurrent: false },
    { key: "08", labelJp: "8月",  total: 266000, isCurrent: false },
    { key: "09", labelJp: "9月",  total: 271420, isCurrent: false },
    { key: "10", labelJp: "10月", total: 248620, isCurrent: true  }
  ];

  // ---------------------------------------------------------------------------
  // 2. 五つの費目 (住居・食費・文化・移動・予備)
  // ---------------------------------------------------------------------------
  const DEFAULT_ENVELOPES = [
    {
      id: "housing",
      nameJp: "住居",
      colorVar: "var(--env-housing)",
      budget: 125000,
      note: "家賃・共益費・光熱・通信回線"
    },
    {
      id: "food",
      nameJp: "食費",
      colorVar: "var(--env-food)",
      budget: 65000,
      note: "旬の青果・自家焙煎珈琲豆・日用食材"
    },
    {
      id: "culture",
      nameJp: "文化",
      colorVar: "var(--env-culture)",
      budget: 35000,
      note: "書物・万年筆インク・美術展・茶菓"
    },
    {
      id: "transit",
      nameJp: "移動",
      colorVar: "var(--env-transit)",
      budget: 20000,
      note: "鉄道乗車・秋の近郊散策"
    },
    {
      id: "special",
      nameJp: "予備",
      colorVar: "var(--env-special)",
      budget: 28000,
      note: "冬支度リネン寝具・靴の修繕・草花"
    }
  ];

  // ---------------------------------------------------------------------------
  // 3. 入出金台帳データ (合計支出 ¥248,620 / 純貯蓄 ¥196,380)
  // ---------------------------------------------------------------------------
  const DEFAULT_TRANSACTIONS = [
    {
      id: "tx-101",
      date: "2026-10-28",
      merchant: "成城石井 柿の木坂店",
      memo: "秋の根菜と発酵バター、週末の自炊食材一式。",
      envelope: "food",
      type: "expense",
      amount: 6480
    },
    {
      id: "tx-102",
      date: "2026-10-26",
      merchant: "丸善 丸の内本店",
      memo: "銅版画と活版印刷の意匠史、MDノートコットン判。",
      envelope: "culture",
      type: "expense",
      amount: 6800
    },
    {
      id: "tx-103",
      date: "2026-10-24",
      merchant: "蕪木 蔵前",
      memo: "深煎りブレンド「羚羊」200gと自家製板チョコレート。",
      envelope: "food",
      type: "expense",
      amount: 3840
    },
    {
      id: "tx-104",
      date: "2026-10-22",
      merchant: "リネンバード 二子玉川",
      memo: "冬支度の無漂白ベルギーリネン寝具カバーと蜜蝋燭。",
      envelope: "special",
      type: "expense",
      amount: 13400
    },
    {
      id: "tx-105",
      date: "2026-10-19",
      merchant: "伊東屋 銀座本店",
      memo: "万年筆ボトルインク（深緑）と美濃和紙の一筆箋。",
      envelope: "culture",
      type: "expense",
      amount: 8600
    },
    {
      id: "tx-106",
      date: "2026-10-18",
      merchant: "JR東日本 モバイルSuica",
      memo: "北鎌倉の古建築散策と月内の定期外乗車チャージ。",
      envelope: "transit",
      type: "expense",
      amount: 18200
    },
    {
      id: "tx-107",
      date: "2026-10-16",
      merchant: "ビオセボン 中目黒店",
      memo: "有機オリーブ油と平飼い卵、旬の林檎と無塩ナッツ。",
      envelope: "food",
      type: "expense",
      amount: 9600
    },
    {
      id: "tx-108",
      date: "2026-10-14",
      merchant: "ユニオンワークス 銀座",
      memo: "5年目を迎える革靴のハーフラバー張替と踵の手入れ。",
      envelope: "special",
      type: "expense",
      amount: 9400
    },
    {
      id: "tx-109",
      date: "2026-10-11",
      merchant: "東京都庭園美術館",
      memo: "秋季企画展の観覧券2名分とハードカバー展示図録。",
      envelope: "culture",
      type: "expense",
      amount: 15800
    },
    {
      id: "tx-110",
      date: "2026-10-09",
      merchant: "大地を守る会 旬菜便",
      memo: "新米ササニシキ5kgと十月の有機野菜定期便。",
      envelope: "food",
      type: "expense",
      amount: 38500
    },
    {
      id: "tx-111",
      date: "2026-10-05",
      merchant: "住居・光熱・通信 定期引落",
      memo: "十月分の住居賃料および秋季検針の電力・ガス・光回線。",
      envelope: "housing",
      type: "expense",
      amount: 118000
    }
  ];

  // ---------------------------------------------------------------------------
  // 4. 歳時記データ
  // ---------------------------------------------------------------------------
  const ALMANAC_NOTES = [
    {
      sekki: "霜始降（十月二十四日〜二十八日）",
      title: "銅ポットの手入れと、自宅焙煎珈琲への切り替え",
      body: "街角のカフェに立ち寄る習慣を週1回に絞り、平日の朝は蔵前『蕪木』の深煎り豆を自宅で挽くリズムに改めた。静かな集中の時間が手に入り、食費にも穏やかなゆとりが生まれている。"
    },
    {
      sekki: "蟋蟀在戸（十月十八日〜二十三日）",
      title: "「買い替え」より「修繕」を選ぶ秋の衣替え",
      body: "5年目を迎える革靴のソール張替と、ベルギーリネンの寝具カバーを予備費から支出。安価な消耗品を繰り返すより、経年変化を楽しめる道具を手入れして使い続けたい。"
    },
    {
      sekki: "菊花開（十月十三日〜十七日）",
      title: "書物への投資と、一冊を読み終えてから迎える習慣",
      body: "丸善と庭園美術館で計2冊の専門書・図録を購入。前の1冊の読書メモを手帖に書き終えてから次の本を迎える決まりを設けて以来、文化費が無理なく予算内に収まっている。"
    }
  ];

  // ---------------------------------------------------------------------------
  // 5. 設計仕様データ
  // ---------------------------------------------------------------------------
  const SPEC_CARDS = [
    {
      title: "引き算の美学と余白の設計",
      body: "説明過多なバッジや二重表記をすべて排し、コットン紙の余白と整然とした数字の並びだけで家計の佇まいを伝えます。"
    },
    {
      title: "コットン紙と万年筆インクの階層",
      body: "純白を避けた温かみのある紙色（#f7f4ee / #fdfbf7）に、フォレストインク（#1b5e43）とテラコッタ（#b84a39）の2色のみを効かせています。"
    },
    {
      title: "銅版画チケットと一箇所だけの彩度",
      body: "見開き左ページには銅版画の線画チケットと真鍮クリップを添え、月次推移チャートでは10月（今月）の1本のみを深い緑で染めています。"
    },
    {
      title: "一行で語る費目と台帳",
      body: "費目の栞は「ドット・費目名・細い進捗バー・金額」の1行に純化し、台帳の下部には和紙の余白に一行の万年筆メモが静かに佇みます。"
    }
  ];

  // ---------------------------------------------------------------------------
  // 6. State Management
  // ---------------------------------------------------------------------------
  let state = {
    theme: "light",
    activeTab: "spread",
    envelopeFilter: "all",
    searchQuery: "",
    selectedTxId: "tx-101",
    xrayActive: false,
    slopActive: false,
    envelopes: [],
    transactions: []
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state.envelopes =
          Array.isArray(parsed.envelopes) && parsed.envelopes.length === 5
            ? parsed.envelopes
            : structuredClone(DEFAULT_ENVELOPES);
        state.transactions =
          Array.isArray(parsed.transactions) && parsed.transactions.length > 0
            ? parsed.transactions
            : structuredClone(DEFAULT_TRANSACTIONS);
      } else {
        state.envelopes = structuredClone(DEFAULT_ENVELOPES);
        state.transactions = structuredClone(DEFAULT_TRANSACTIONS);
      }
    } catch {
      state.envelopes = structuredClone(DEFAULT_ENVELOPES);
      state.transactions = structuredClone(DEFAULT_TRANSACTIONS);
    }
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
    } catch {
      // Ignore storage errors
    }
  }

  function formatYen(amount) {
    return "¥" + Math.round(amount).toLocaleString("ja-JP");
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---------------------------------------------------------------------------
  // 7. 左ページ上部: 今月の支出 & 純貯蓄
  // ---------------------------------------------------------------------------
  function getEnvelopeSpentMap() {
    const map = { housing: 0, food: 0, culture: 0, transit: 0, special: 0 };
    for (const tx of state.transactions) {
      if (tx.type !== "income" && map[tx.envelope] !== undefined) {
        map[tx.envelope] += Number(tx.amount) || 0;
      }
    }
    return map;
  }

  function renderHeroMetrics() {
    const spentMap = getEnvelopeSpentMap();
    const totalOutflow = Object.values(spentMap).reduce((a, b) => a + b, 0);
    const netReserve = Math.max(0, MONTHLY_INCOME - totalOutflow);

    const diffPrevPct = (((totalOutflow - PREV_MONTH_OUTFLOW) / PREV_MONTH_OUTFLOW) * 100).toFixed(1);
    const diffTargetPct = (((netReserve - TARGET_RESERVE) / TARGET_RESERVE) * 100).toFixed(1);

    const elOutflow = document.getElementById("stat-outflow");
    const elOutflowDelta = document.getElementById("stat-outflow-delta");
    const elReserve = document.getElementById("stat-reserve");
    const elReserveDelta = document.getElementById("stat-reserve-delta");

    if (elOutflow) elOutflow.textContent = formatYen(totalOutflow);
    if (elOutflowDelta) {
      const sign = Number(diffPrevPct) > 0 ? "+" : "";
      elOutflowDelta.textContent = `${sign}${diffPrevPct}% 先月比`;
      elOutflowDelta.className = `stat-delta mono ${Number(diffPrevPct) <= 0 ? "positive" : "warning"}`;
    }

    if (elReserve) elReserve.textContent = formatYen(netReserve);
    if (elReserveDelta) {
      const sign = Number(diffTargetPct) >= 0 ? "+" : "";
      elReserveDelta.textContent = `${sign}${diffTargetPct}% 目標比`;
      elReserveDelta.className = `stat-delta mono ${Number(diffTargetPct) >= 0 ? "positive" : "warning"}`;
    }

    SEASONAL_MONTHS[9].total = totalOutflow;
  }

  // ---------------------------------------------------------------------------
  // 8. 左ページ中央 (Moment 2): 月次推移チャート (1月〜10月)
  // ---------------------------------------------------------------------------
  function renderSeasonalChart() {
    const container = document.getElementById("seasonal-chart-stage");
    if (!container) return;

    const values = SEASONAL_MONTHS.map((m) => m.total);
    const maxVal = Math.max(...values) * 1.15;
    const width = 540;
    const height = 196;
    const padLeft = 44;
    const padRight = 12;
    const padTop = 22;
    const padBottom = 28;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const stepX = plotW / SEASONAL_MONTHS.length;
    const barW = Math.min(26, stepX * 0.56);

    // 3ヶ月移動平均スプライン
    const splinePts = values.map((val, idx) => {
      const prev = idx > 0 ? values[idx - 1] : val;
      const prev2 = idx > 1 ? values[idx - 2] : prev;
      const avg = (val + prev + prev2) / 3;
      const cx = padLeft + idx * stepX + stepX / 2;
      const cy = padTop + plotH - (avg / maxVal) * plotH;
      return { x: cx, y: cy };
    });

    let splinePath = "";
    splinePts.forEach((pt, i) => {
      if (i === 0) {
        splinePath += `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      } else {
        const prev = splinePts[i - 1];
        const cpx = (prev.x + pt.x) / 2;
        splinePath += ` C ${cpx.toFixed(1)} ${prev.y.toFixed(1)}, ${cpx.toFixed(1)} ${pt.y.toFixed(1)}, ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      }
    });

    const gridSteps = 3;
    let gridLinesHtml = "";
    for (let i = 0; i <= gridSteps; i++) {
      const ratio = i / gridSteps;
      const y = padTop + plotH - ratio * plotH;
      const valLabel = Math.round((maxVal * ratio) / 10000) + "万";
      gridLinesHtml += `
        <line x1="${padLeft}" y1="${y.toFixed(1)}" x2="${width - padRight}" y2="${y.toFixed(1)}" stroke="var(--chart-grid)" stroke-width="1" />
        <text x="${padLeft - 8}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="10">
          ${i === 0 ? "0" : valLabel}
        </text>
      `;
    }

    let barsHtml = "";
    SEASONAL_MONTHS.forEach((m, idx) => {
      const val = values[idx];
      const barH = Math.max(4, (val / maxVal) * plotH);
      const x = padLeft + idx * stepX + (stepX - barW) / 2;
      const y = padTop + plotH - barH;
      const cx = x + barW / 2;

      const fillAttr = m.isCurrent ? "var(--chart-bright-fill)" : "url(#stoneHatchPattern)";
      const strokeAttr = m.isCurrent ? "var(--chart-bright-stroke)" : "var(--chart-stone-stroke)";
      const labelWeight = m.isCurrent ? "500" : "400";
      const labelColor = m.isCurrent ? "var(--accent-ink)" : "var(--text-secondary)";

      barsHtml += `
        <g class="chart-bar-group">
          <title>${m.labelJp}: ${formatYen(val)}</title>
          <rect
            class="bar-main"
            x="${x.toFixed(1)}"
            y="${y.toFixed(1)}"
            width="${barW.toFixed(1)}"
            height="${barH.toFixed(1)}"
            rx="2.5"
            fill="${fillAttr}"
            stroke="${strokeAttr}"
            stroke-width="${m.isCurrent ? "1.3" : "0.9"}"
          />
          <text
            x="${cx.toFixed(1)}"
            y="${height - 8}"
            text-anchor="middle"
            fill="${labelColor}"
            font-size="10.5"
            font-weight="${labelWeight}"
          >${m.labelJp}</text>
        </g>
      `;
    });

    const octSplinePt = splinePts[9];

    container.innerHTML = `
      <svg class="seasonal-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="月次推移チャート">
        <defs>
          <pattern id="stoneHatchPattern" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-42)">
            <rect width="5" height="5" fill="var(--chart-stone-fill)" />
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--chart-stone-stroke)" stroke-width="1.25" />
          </pattern>
        </defs>
        ${gridLinesHtml}
        ${barsHtml}
        <path
          d="${splinePath}"
          fill="none"
          stroke="var(--sub-accent)"
          stroke-width="1.6"
          stroke-linecap="round"
        />
        <circle
          cx="${octSplinePt.x.toFixed(1)}"
          cy="${octSplinePt.y.toFixed(1)}"
          r="4"
          fill="var(--bg-card)"
          stroke="var(--sub-accent)"
          stroke-width="2"
        />
      </svg>
    `;
  }

  // ---------------------------------------------------------------------------
  // 9. 左ページ下部: 5つの費目バー (6pxドット＋費目名＋細い進捗バー＋金額の1行のみ)
  // ---------------------------------------------------------------------------
  function renderLeftPageEnvelopes() {
    const listEl = document.getElementById("left-page-envelopes");
    if (!listEl) return;

    const spentMap = getEnvelopeSpentMap();
    listEl.innerHTML = state.envelopes
      .map((env) => {
        const spent = spentMap[env.id] || 0;
        const budget = Number(env.budget) || 1;
        const pct = Math.min(100, Math.round((spent / budget) * 100));
        const isActive = state.envelopeFilter === env.id;

        return `
          <div
            class="envelope-row-item ${isActive ? "active" : ""}"
            data-envelope-id="${env.id}"
            role="button"
            tabindex="0"
            aria-pressed="${isActive}"
            title="${env.nameJp} — 予算 ${formatYen(budget)} (${pct}%)"
          >
            <div class="envelope-label-cell">
              <span class="category-dot" style="background-color: ${env.colorVar};"></span>
              <span class="envelope-name">${env.nameJp}</span>
            </div>
            <div class="envelope-bar-track">
              <div class="envelope-bar-fill" style="width: ${pct}%; background-color: ${env.colorVar};"></div>
            </div>
            <div class="envelope-amount mono">${formatYen(spent)}</div>
          </div>
        `;
      })
      .join("");

    listEl.querySelectorAll(".envelope-row-item").forEach((item) => {
      item.addEventListener("click", () => {
        const envId = item.getAttribute("data-envelope-id");
        state.envelopeFilter = state.envelopeFilter === envId ? "all" : envId;
        const selectEl = document.getElementById("envelope-select-filter");
        if (selectEl) selectEl.value = state.envelopeFilter;
        renderLeftPageEnvelopes();
        renderLedgerTable();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 10. 右ページ: 入出金台帳 (4列・行高44px) ＆ 和紙の領収書プレビュー
  // ---------------------------------------------------------------------------
  function getFilteredTransactions() {
    return state.transactions.filter((tx) => {
      if (state.envelopeFilter !== "all" && tx.envelope !== state.envelopeFilter) {
        return false;
      }
      if (state.searchQuery.trim() !== "") {
        const q = state.searchQuery.trim().toLowerCase();
        const hay = `${tx.merchant} ${tx.memo || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderLedgerTable() {
    const tbody = document.getElementById("ledger-tbody");
    if (!tbody) return;

    const filtered = getFilteredTransactions();
    const envById = Object.fromEntries(state.envelopes.map((e) => [e.id, e]));

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 24px; color: var(--text-muted);">
            該当する記帳がありません
          </td>
        </tr>
      `;
      return;
    }

    if (!filtered.some((t) => t.id === state.selectedTxId)) {
      state.selectedTxId = filtered[0].id;
    }

    tbody.innerHTML = filtered
      .map((tx) => {
        const env = envById[tx.envelope] || state.envelopes[0];
        const isSelected = tx.id === state.selectedTxId;
        const shortDate = tx.date.slice(5).replace("-", "/");

        return `
          <tr class="${isSelected ? "selected" : ""}" data-tx-id="${tx.id}">
            <td class="col-date mono">${shortDate}</td>
            <td>
              <span class="tx-merchant-name">${escapeHtml(tx.merchant)}</span>
            </td>
            <td>
              <span class="tx-category-cell">
                <span class="category-dot" style="background-color: ${env.colorVar};"></span>
                <span>${env.nameJp}</span>
              </span>
            </td>
            <td class="col-amount mono">${formatYen(tx.amount)}</td>
          </tr>
        `;
      })
      .join("");

    tbody.querySelectorAll("tr[data-tx-id]").forEach((row) => {
      row.addEventListener("click", () => {
        state.selectedTxId = row.getAttribute("data-tx-id");
        renderLedgerTable();
        renderVoucherInspector();
      });
    });

    renderVoucherInspector();
  }

  function renderVoucherInspector() {
    const container = document.getElementById("voucher-inspector-container");
    if (!container) return;

    const tx =
      state.transactions.find((t) => t.id === state.selectedTxId) ||
      state.transactions[0];
    if (!tx) return;

    const formattedDate = tx.date.replace(/-/g, ".");
    const memoLine = tx.memo || `${tx.merchant}にて記帳。`;

    container.innerHTML = `
      <div class="washi-receipt-top">
        <div class="washi-shop-group">
          <span class="washi-shop-name">${escapeHtml(tx.merchant)}</span>
          <span class="washi-date mono">${formattedDate}</span>
        </div>
        <span class="washi-amount mono">${formatYen(tx.amount)}</span>
      </div>
      <div class="washi-memo-row">
        <p class="washi-fountain-memo">「${escapeHtml(memoLine)}」</p>
        <button type="button" class="btn-delete-quiet" id="delete-selected-tx-btn" title="この記帳を削除">
          削除
        </button>
      </div>
    `;

    const delBtn = document.getElementById("delete-selected-tx-btn");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        if (state.transactions.length <= 1) return;
        state.transactions = state.transactions.filter((t) => t.id !== tx.id);
        state.selectedTxId = state.transactions[0].id;
        saveState();
        renderAll();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 11. セカンダリタブ描画 (費目の栞・歳時記・設計仕様)
  // ---------------------------------------------------------------------------
  function renderSecondaryTabs() {
    const envGrid = document.getElementById("envelopes-folio-grid");
    if (envGrid) {
      const spentMap = getEnvelopeSpentMap();
      envGrid.innerHTML = state.envelopes
        .map((env) => {
          const spent = spentMap[env.id] || 0;
          const pct = Math.min(100, Math.round((spent / env.budget) * 100));
          return `
            <div class="envelope-folio-card">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="category-dot" style="background-color: ${env.colorVar};"></span>
                <h3 class="block-title">${env.nameJp}</h3>
              </div>
              <p style="font-size: 12.5px; color: var(--text-secondary);">${env.note}</p>
              <div class="mono" style="font-size: 18px; font-weight: 500; margin-top: 4px;">
                ${formatYen(spent)}
              </div>
              <div class="envelope-bar-track">
                <div class="envelope-bar-fill" style="width: ${pct}%; background-color: ${env.colorVar};"></div>
              </div>
              <div class="cap-input-row">
                <label style="font-size: 12px; color: var(--text-secondary);" for="cap-${env.id}">
                  月次予算
                </label>
                <input
                  type="number"
                  id="cap-${env.id}"
                  class="cap-input mono"
                  data-cap-env="${env.id}"
                  value="${env.budget}"
                  min="5000"
                  step="1000"
                />
              </div>
            </div>
          `;
        })
        .join("");

      envGrid.querySelectorAll("input[data-cap-env]").forEach((input) => {
        input.addEventListener("change", () => {
          const id = input.getAttribute("data-cap-env");
          const val = Math.max(1000, Number(input.value) || 0);
          const target = state.envelopes.find((e) => e.id === id);
          if (target) {
            target.budget = val;
            saveState();
            renderAll();
          }
        });
      });
    }

    const almanacGrid = document.getElementById("almanac-entries-grid");
    if (almanacGrid) {
      almanacGrid.innerHTML = ALMANAC_NOTES.map(
        (n) => `
          <article class="almanac-card">
            <div class="almanac-kigo">${n.sekki}</div>
            <h3 class="almanac-title">${n.title}</h3>
            <p class="almanac-body">${n.body}</p>
          </article>
        `
      ).join("");
    }

    const specGrid = document.getElementById("spec-documentation-grid");
    if (specGrid) {
      specGrid.innerHTML = SPEC_CARDS.map(
        (s) => `
          <article class="spec-card">
            <h3 class="block-title">${s.title}</h3>
            <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.7;">${s.body}</p>
          </article>
        `
      ).join("");
    }
  }

  // ---------------------------------------------------------------------------
  // 12. タブ切替・配色・赤入れ検証 [U]・スロップ比較 [B]
  // ---------------------------------------------------------------------------
  function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll(".shiori-tab").forEach((btn) => {
      const isMatch = btn.getAttribute("data-tab") === tabId;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    const views = ["spread", "envelopes", "journal", "spec"];
    views.forEach((v) => {
      const el = document.getElementById(`tab-view-${v}`);
      if (el) {
        el.style.display = v === tabId ? "flex" : "none";
      }
    });
  }

  function toggleTheme() {
    state.theme = state.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", state.theme);
  }

  function toggleXray() {
    state.xrayActive = !state.xrayActive;
    document.body.classList.toggle("xray-active", state.xrayActive);
  }

  function toggleSlopMode() {
    state.slopActive = !state.slopActive;
    document.body.classList.toggle("slop-mode", state.slopActive);

    const monthTitle = document.getElementById("folio-month-label");
    const ctaLabel = document.getElementById("primary-cta-label");
    const slopBtnLabel = document.getElementById("slop-btn-label");

    if (state.slopActive) {
      if (monthTitle) monthTitle.textContent = "🔥 AI家計スコア最大化ダッシュボード 💰";
      if (ctaLabel) ctaLabel.textContent = "✨ 今すぐ記帳 🚀";
      if (slopBtnLabel) slopBtnLabel.textContent = "通常表示";
    } else {
      if (monthTitle) monthTitle.textContent = "2026年 10月";
      if (ctaLabel) ctaLabel.textContent = "+ 記帳";
      if (slopBtnLabel) slopBtnLabel.textContent = "スロップ比較";
    }
  }

  function renderAll() {
    renderHeroMetrics();
    renderSeasonalChart();
    renderLeftPageEnvelopes();
    renderLedgerTable();
    renderSecondaryTabs();
  }

  // ---------------------------------------------------------------------------
  // 13. イベント設定・ショートカット
  // ---------------------------------------------------------------------------
  function bindEvents() {
    document.getElementById("bookmark-ribbon-toggle")?.addEventListener("click", toggleXray);
    document.getElementById("toggle-xray-btn")?.addEventListener("click", toggleXray);
    document.getElementById("toggle-slop-btn")?.addEventListener("click", toggleSlopMode);
    document.getElementById("toggle-theme-btn")?.addEventListener("click", toggleTheme);

    document.querySelectorAll(".shiori-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        if (tab) switchTab(tab);
      });
    });

    document.getElementById("reset-envelope-filter-btn")?.addEventListener("click", () => {
      state.envelopeFilter = "all";
      const sel = document.getElementById("envelope-select-filter");
      if (sel) sel.value = "all";
      renderLeftPageEnvelopes();
      renderLedgerTable();
    });

    const searchInput = document.getElementById("ledger-search-input");
    searchInput?.addEventListener("input", () => {
      state.searchQuery = searchInput.value;
      renderLedgerTable();
    });

    const selectFilter = document.getElementById("envelope-select-filter");
    selectFilter?.addEventListener("change", () => {
      state.envelopeFilter = selectFilter.value;
      renderLeftPageEnvelopes();
      renderLedgerTable();
    });

    const monthLabels = ["2026年 8月", "2026年 9月", "2026年 10月"];
    let labelIdx = 2;
    document.getElementById("month-prev-btn")?.addEventListener("click", () => {
      labelIdx = Math.max(0, labelIdx - 1);
      const el = document.getElementById("folio-month-label");
      if (el) el.textContent = monthLabels[labelIdx];
    });
    document.getElementById("month-next-btn")?.addEventListener("click", () => {
      labelIdx = Math.min(monthLabels.length - 1, labelIdx + 1);
      const el = document.getElementById("folio-month-label");
      if (el) el.textContent = monthLabels[labelIdx];
    });

    document.getElementById("reset-demo-data-btn")?.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      loadState();
      renderAll();
    });

    // 記帳モーダル
    const modalBackdrop = document.getElementById("entry-modal-backdrop");
    const openModal = () => {
      modalBackdrop?.classList.add("open");
      document.getElementById("entry-amount")?.focus();
    };
    const closeModal = () => {
      modalBackdrop?.classList.remove("open");
    };

    document.getElementById("open-entry-modal-btn")?.addEventListener("click", openModal);
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
    document.getElementById("cancel-modal-btn")?.addEventListener("click", closeModal);
    modalBackdrop?.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    const entryForm = document.getElementById("entry-form");
    entryForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const dateVal = document.getElementById("entry-date").value || "2026-10-29";
      const amountVal = Number(document.getElementById("entry-amount").value) || 0;
      const merchantVal = document.getElementById("entry-merchant").value.trim() || "季節の買い物";
      const envelopeVal = document.getElementById("entry-envelope").value || "food";
      const memoVal = document.getElementById("entry-memo").value.trim() || `${merchantVal}にて記帳。`;

      if (amountVal <= 0) return;

      const newId = "tx-" + (112 + state.transactions.length);
      const newTx = {
        id: newId,
        date: dateVal,
        merchant: merchantVal,
        memo: memoVal,
        envelope: envelopeVal,
        type: "expense",
        amount: amountVal
      };

      state.transactions.unshift(newTx);
      state.selectedTxId = newId;
      saveState();
      renderAll();
      entryForm.reset();
      document.getElementById("entry-date").value = "2026-10-29";
      closeModal();
    });

    // キーボードショートカット
    window.addEventListener("keydown", (e) => {
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
      const isTyping = tag === "input" || tag === "textarea" || tag === "select";

      if (e.key === "Escape") {
        closeModal();
        if (isTyping) e.target.blur();
        return;
      }

      if (isTyping) return;

      const k = e.key.toLowerCase();
      if (k === "n") {
        e.preventDefault();
        openModal();
      } else if (k === "/") {
        e.preventDefault();
        switchTab("spread");
        document.getElementById("ledger-search-input")?.focus();
      } else if (k === "u") {
        e.preventDefault();
        toggleXray();
      } else if (k === "b") {
        e.preventDefault();
        toggleSlopMode();
      } else if (k === "t") {
        e.preventDefault();
        toggleTheme();
      } else if (k === "1") {
        switchTab("spread");
      } else if (k === "2") {
        switchTab("envelopes");
      } else if (k === "3") {
        switchTab("journal");
      } else if (k === "4") {
        switchTab("spec");
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 14. 初期化
  // ---------------------------------------------------------------------------
  loadState();
  bindEvents();
  renderAll();
})();
