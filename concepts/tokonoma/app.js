/**
 * 床の間 (Tokonoma) — 引き算と余白の家計月次明細
 * 月次ステートメント＆朱印、5区画の「暮らしの配分」、入出金台帳、取引詳細
 */

(() => {
  "use strict";

  const STORAGE_KEY = "tokonoma_kakeibo_statement_v2";
  const MONTHLY_INCOME = 445000;

  // ---------------------------------------------------------------------------
  // 1. 区画定義（4つの支出区画 ＋ 未来への余白・純貯蓄）
  // ---------------------------------------------------------------------------
  const ROOM_META = {
    housing: {
      nameJp: "住居",
      targetAmount: 111250, // 理想 25.0%
      sepAmount: 118000     // 先月 26.5%
    },
    food: {
      nameJp: "食と器",
      targetAmount: 62300,  // 理想 14.0%
      sepAmount: 74200      // 先月 16.7%
    },
    culture: {
      nameJp: "知性と文化",
      targetAmount: 44500,  // 理想 10.0%
      sepAmount: 41800      // 先月 9.4%
    },
    transit: {
      nameJp: "移動と交際",
      targetAmount: 26700,  // 理想 6.0%
      sepAmount: 37400      // 先月 8.4%
    }
  };

  // ---------------------------------------------------------------------------
  // 2. 2026年10月 入出金台帳データ
  //    住居: ¥118,000 (26.5%)
  //    食と器: ¥65,860 (14.8%)
  //    知性と文化: ¥36,490 (8.2%)
  //    移動と交際: ¥28,270 (6.4%)
  //    支出計: ¥248,620 (55.9%) / 純貯蓄: ¥196,380 (44.1%)
  // ---------------------------------------------------------------------------
  const DEFAULT_TRANSACTIONS = [
    {
      id: "TX-101",
      date: "2026-10-28",
      merchant: "成城石井 アトレ恵比寿店",
      memo: "週末食材・有機オリーブ油・熟成チーズ・発酵惣菜",
      room: "food",
      account: "三井住友カード（4821）",
      amount: 8480,
      items: [
        { name: "有機エクストラバージンオリーブ油", price: 2480 },
        { name: "北海道産純生クリーム・熟成チーズ", price: 2640 },
        { name: "季節の果物・ライ麦カンパーニュ・惣菜", price: 3360 }
      ]
    },
    {
      id: "TX-102",
      date: "2026-10-27",
      merchant: "丸善ジュンク堂書店 丸の内本店",
      memo: "スイス・タイポグラフィ建築図集・伝統木組専門書",
      room: "culture",
      account: "三井住友カード（4821）",
      amount: 10850,
      items: [
        { name: "グリッドシステムと建築平面の秩序", price: 5800 },
        { name: "日本の木組・床の間と数寄屋空間", price: 4170 },
        { name: "ミドリ MDノート 新書サイズ 無罫", price: 880 }
      ]
    },
    {
      id: "TX-103",
      date: "2026-10-26",
      merchant: "JR東日本 モバイルSuica チャージ",
      memo: "都内建築展巡回・日常移動オートチャージ",
      room: "transit",
      account: "モバイルSuica（9014）",
      amount: 6000,
      items: [
        { name: "残高基準オートチャージ", price: 6000 }
      ]
    },
    {
      id: "TX-104",
      date: "2026-10-24",
      merchant: "オーケー みなとみらい店",
      memo: "新米あきたこまち5kg・根菜・日用消耗品補充",
      room: "food",
      account: "三井住友カード（4821）",
      amount: 11920,
      items: [
        { name: "秋田県産あきたこまち 5kg（新米）", price: 4280 },
        { name: "旬の根菜・葉物野菜セット", price: 3460 },
        { name: "国産鶏むね肉・銀鮭切り身・消耗品", price: 4180 }
      ]
    },
    {
      id: "TX-105",
      date: "2026-10-22",
      merchant: "ブルーボトルコーヒー 清澄白河",
      memo: "ブレンド珈琲豆 200g・ハンドドリップ",
      room: "food",
      account: "モバイルSuica（9014）",
      amount: 3640,
      items: [
        { name: "ベラ・ドノヴァン ホールビーン 200g", price: 2460 },
        { name: "エチオピア ウォッシュド ハンドドリップ", price: 1180 }
      ]
    },
    {
      id: "TX-106",
      date: "2026-10-18",
      merchant: "トラヤあんスタンド 北青山店",
      memo: "設計事務所訪問時の季節手土産",
      room: "transit",
      account: "アメックス・ゴールド（3108）",
      amount: 5590,
      items: [
        { name: "あんペースト詰合せ（こしあん・黒砂糖）", price: 5590 }
      ]
    },
    {
      id: "TX-107",
      date: "2026-10-16",
      merchant: "ビストロ ロジウラ 渋谷",
      memo: "建築・編集同人との月次批評夕食会",
      room: "culture",
      account: "アメックス・ゴールド（3108）",
      amount: 14840,
      items: [
        { name: "季節の前菜・自家製シャルキュトリー", price: 5200 },
        { name: "鴨胸肉のロースト・自然派ワイン", price: 9640 }
      ]
    },
    {
      id: "TX-108",
      date: "2026-10-14",
      merchant: "無印良品 銀座",
      memo: "耐熱ガラス保存容器・麻ワッフルタオル新調",
      room: "food",
      account: "三井住友カード（4821）",
      amount: 7640,
      items: [
        { name: "耐熱ガラスバルブ付き保存容器 × 3", price: 3850 },
        { name: "リネン麻ワッフルフェイスタオル × 2", price: 3790 }
      ]
    },
    {
      id: "TX-109",
      date: "2026-10-08",
      merchant: "東海道新幹線 スマートEX",
      memo: "京都・桂離宮および聴竹居参観のための往復移動",
      room: "transit",
      account: "アメックス・ゴールド（3108）",
      amount: 16680,
      items: [
        { name: "のぞみ号 普通車指定席（品川↔京都）", price: 16680 }
      ]
    },
    {
      id: "TX-110",
      date: "2026-10-06",
      merchant: "ライフ 渋谷東店",
      memo: "平日自炊用の生鮮野菜・平飼い卵・木綿豆腐",
      room: "food",
      account: "モバイルSuica（9014）",
      amount: 11260,
      items: [
        { name: "平飼い有精卵・国産大豆木綿豆腐・納豆", price: 3420 },
        { name: "旬の秋刀魚・豚ロース・季節根菜", price: 7840 }
      ]
    },
    {
      id: "TX-111",
      date: "2026-10-04",
      merchant: "東京都現代美術館",
      memo: "建築・空間構成企画展チケットおよび公式図録",
      room: "culture",
      account: "モバイルSuica（9014）",
      amount: 10800,
      items: [
        { name: "企画展 観覧チケット", price: 2400 },
        { name: "展覧会公式ハードカバー図録・資料集", price: 8400 }
      ]
    },
    {
      id: "TX-112",
      date: "2026-10-02",
      merchant: "金継ぎ工房・漆器修理",
      memo: "日常使いの粉引飯碗（陶器）の呼び継ぎ・本漆補修",
      room: "food",
      account: "三菱UFJ銀行 口座振替",
      amount: 10800,
      items: [
        { name: "本漆・純金消粉による金継ぎ補修工程費", price: 10800 }
      ]
    },
    {
      id: "TX-113",
      date: "2026-10-01",
      merchant: "東急住宅リース（口座振替）",
      memo: "10月分 建物賃料および管理共益費",
      room: "housing",
      account: "三菱UFJ銀行 口座振替",
      amount: 118000,
      items: [
        { name: "月額建物賃料（1LDK / 南向き）", price: 110000 },
        { name: "共用部維持・管理共益費", price: 8000 }
      ]
    },
    {
      id: "TX-114",
      date: "2026-10-01",
      merchant: "ビオセボン 麻布十番店",
      memo: "月初まとめ買い（有機デュラム小麦パスタ・豆乳）",
      room: "food",
      account: "三井住友カード（4821）",
      amount: 12120,
      items: [
        { name: "イタリア産有機全粒粉パスタ・ホールトマト", price: 4860 },
        { name: "有機無調整豆乳・オーツミルク・素焼きナッツ", price: 7260 }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // 3. 状態管理
  // ---------------------------------------------------------------------------
  let state = {
    transactions: [],
    selectedRoom: "all",
    selectedTxId: "TX-102",
    treemapMode: "actual", // 'actual' | 'target' | 'prev'
    hankoStamped: true,
    searchQuery: "",
    theme: "light",
    xrayMode: false,
    slopMode: false
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.transactions) && parsed.transactions.length > 0) {
          state.transactions = parsed.transactions;
        } else {
          state.transactions = [...DEFAULT_TRANSACTIONS];
        }
        if (typeof parsed.hankoStamped === "boolean") {
          state.hankoStamped = parsed.hankoStamped;
        }
      } else {
        state.transactions = [...DEFAULT_TRANSACTIONS];
      }
    } catch {
      state.transactions = [...DEFAULT_TRANSACTIONS];
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transactions: state.transactions,
          hankoStamped: state.hankoStamped
        })
      );
    } catch {
      // Ignore quota errors
    }
  }

  function formatJpy(amount) {
    const sign = amount < 0 ? "-" : "";
    return `${sign}¥${Math.abs(Math.round(amount)).toLocaleString("ja-JP")}`;
  }

  // ---------------------------------------------------------------------------
  // 4. 集計計算
  // ---------------------------------------------------------------------------
  function computeMetrics() {
    const totalsByRoom = {
      housing: 0,
      food: 0,
      culture: 0,
      transit: 0
    };

    for (const tx of state.transactions) {
      const key = totalsByRoom[tx.room] !== undefined ? tx.room : "transit";
      totalsByRoom[key] += tx.amount;
    }

    const totalSpent =
      totalsByRoom.housing +
      totalsByRoom.food +
      totalsByRoom.culture +
      totalsByRoom.transit;

    const netSaved = Math.max(0, MONTHLY_INCOME - totalSpent);
    const spentRatio = (totalSpent / MONTHLY_INCOME) * 100;
    const savedRatio = (netSaved / MONTHLY_INCOME) * 100;

    return {
      totalsByRoom,
      totalSpent,
      netSaved,
      spentRatio,
      savedRatio
    };
  }

  // ---------------------------------------------------------------------------
  // 5. 上段左: 月次ステートメント ＆ 朱印の描画
  // ---------------------------------------------------------------------------
  function renderStatement(metrics) {
    const elTotalSpent = document.getElementById("stat-total-spent");
    const elSpentDelta = document.getElementById("stat-spent-delta");
    const elNetSaved = document.getElementById("stat-net-saved");
    const elSavingsRate = document.getElementById("stat-savings-rate");

    if (elTotalSpent) elTotalSpent.textContent = formatJpy(metrics.totalSpent);

    const sepTotal = 271400;
    const diffPct = (((metrics.totalSpent - sepTotal) / sepTotal) * 100).toFixed(1);
    if (elSpentDelta) {
      const sign = diffPct > 0 ? "+" : "";
      elSpentDelta.textContent = `${sign}${diffPct}% 先月比`;
    }

    if (elNetSaved) elNetSaved.textContent = formatJpy(metrics.netSaved);
    if (elSavingsRate) elSavingsRate.textContent = `貯蓄率 ${metrics.savedRatio.toFixed(1)}%`;

    const hankoBtn = document.getElementById("btn-hanko-seal");
    const hankoLabel = document.getElementById("hanko-status-label");
    if (hankoBtn) {
      hankoBtn.classList.toggle("is-stamped", state.hankoStamped);
      hankoBtn.setAttribute("aria-pressed", String(state.hankoStamped));
    }
    if (hankoLabel) {
      hankoLabel.textContent = state.hankoStamped ? "検印済" : "未検印";
    }
  }

  // ---------------------------------------------------------------------------
  // 6. 上段右: 5区画「暮らしの配分」の描画（部屋名・金額・比率の3要素のみ）
  // ---------------------------------------------------------------------------
  function renderFloorplanTreemap(metrics) {
    const mode = state.treemapMode;
    let roomAmounts = {};
    let spentTotal = 0;
    let reserveTotal = 0;

    if (mode === "actual") {
      roomAmounts = { ...metrics.totalsByRoom };
      spentTotal = metrics.totalSpent;
      reserveTotal = metrics.netSaved;
    } else if (mode === "target") {
      roomAmounts = {
        housing: ROOM_META.housing.targetAmount,
        food: ROOM_META.food.targetAmount,
        culture: ROOM_META.culture.targetAmount,
        transit: ROOM_META.transit.targetAmount
      };
      spentTotal = Object.values(roomAmounts).reduce((a, b) => a + b, 0);
      reserveTotal = MONTHLY_INCOME - spentTotal;
    } else {
      roomAmounts = {
        housing: ROOM_META.housing.sepAmount,
        food: ROOM_META.food.sepAmount,
        culture: ROOM_META.culture.sepAmount,
        transit: ROOM_META.transit.sepAmount
      };
      spentTotal = Object.values(roomAmounts).reduce((a, b) => a + b, 0);
      reserveTotal = MONTHLY_INCOME - spentTotal;
    }

    const spentPct = Math.min(80, Math.max(25, (spentTotal / MONTHLY_INCOME) * 100));
    const reservePct = 100 - spentPct;

    const occupiedWing = document.getElementById("floorplan-occupied-wing");
    const yohakuCell = document.getElementById("room-cell-yohaku");
    if (occupiedWing) occupiedWing.style.width = `${spentPct.toFixed(1)}%`;
    if (yohakuCell) yohakuCell.style.width = `${reservePct.toFixed(1)}%`;

    // 住居 vs 下層（食と器・知性と文化・移動と交際）の縦比率
    const housingHeightPct = Math.min(
      55,
      Math.max(36, (roomAmounts.housing / Math.max(1, spentTotal)) * 100)
    );
    const lowerHeightPct = 100 - housingHeightPct;

    const elHousingCell = document.getElementById("room-cell-housing");
    const elLowerWing = document.getElementById("floorplan-lower-wing");
    if (elHousingCell) elHousingCell.style.height = `${housingHeightPct.toFixed(1)}%`;
    if (elLowerWing) elLowerWing.style.height = `${lowerHeightPct.toFixed(1)}%`;

    // 下層内: 食と器 (左) vs 知性と文化＋移動と交際 (右) の横比率
    const lowerTotal = roomAmounts.food + roomAmounts.culture + roomAmounts.transit;
    const foodWidthPct = Math.min(
      60,
      Math.max(36, (roomAmounts.food / Math.max(1, lowerTotal)) * 100)
    );
    const culturalWingPct = 100 - foodWidthPct;

    const elFoodCell = document.getElementById("room-cell-food");
    const elCulturalWing = document.getElementById("floorplan-cultural-wing");
    if (elFoodCell) elFoodCell.style.width = `${foodWidthPct.toFixed(1)}%`;
    if (elCulturalWing) elCulturalWing.style.width = `${culturalWingPct.toFixed(1)}%`;

    // 右下スタック内: 知性と文化 (上) vs 移動と交際 (下) の縦比率
    const rightStackTotal = roomAmounts.culture + roomAmounts.transit;
    const cultureHeightPct = Math.min(
      65,
      Math.max(40, (roomAmounts.culture / Math.max(1, rightStackTotal)) * 100)
    );
    const transitHeightPct = 100 - cultureHeightPct;

    const elCultureCell = document.getElementById("room-cell-culture");
    const elTransitCell = document.getElementById("room-cell-transit");
    if (elCultureCell) elCultureCell.style.height = `${cultureHeightPct.toFixed(1)}%`;
    if (elTransitCell) elTransitCell.style.height = `${transitHeightPct.toFixed(1)}%`;

    // 4つの支出区画の金額・比率テキスト更新
    const rooms = ["housing", "food", "culture", "transit"];
    for (const r of rooms) {
      const amt = roomAmounts[r];
      const pct = ((amt / MONTHLY_INCOME) * 100).toFixed(1);
      const amtEl = document.getElementById(`room-amt-${r}`);
      const dimEl = document.getElementById(`room-dim-${r}`);
      const cellEl = document.getElementById(`room-cell-${r}`);

      if (amtEl) amtEl.textContent = formatJpy(amt);
      if (dimEl) dimEl.textContent = `${pct}%`;
      if (cellEl) cellEl.classList.toggle("is-selected", state.selectedRoom === r);
    }

    // 5つ目の区画: 未来への余白・純貯蓄
    const yohakuAmt = document.getElementById("room-amt-yohaku");
    const yohakuDim = document.getElementById("room-dim-yohaku");
    if (yohakuAmt) yohakuAmt.textContent = formatJpy(reserveTotal);
    if (yohakuDim) yohakuDim.textContent = `${reservePct.toFixed(1)}%`;
  }

  // ---------------------------------------------------------------------------
  // 7. 下段左: 入出金台帳（4列: 日付・内容・区画・金額）
  // ---------------------------------------------------------------------------
  function renderLedgerTable() {
    document.querySelectorAll(".room-filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === state.selectedRoom);
    });

    const q = state.searchQuery.trim().toLowerCase();
    const filtered = state.transactions.filter((tx) => {
      const matchRoom = state.selectedRoom === "all" || tx.room === state.selectedRoom;
      const matchQuery =
        !q ||
        tx.merchant.toLowerCase().includes(q) ||
        tx.memo.toLowerCase().includes(q);
      return matchRoom && matchQuery;
    });

    const tbody = document.getElementById("ledger-tbody");
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-muted); height: 88px;">
            該当する明細はありません
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
        const rm = ROOM_META[tx.room] || ROOM_META.culture;
        const isSelected = tx.id === state.selectedTxId;
        const shortDate = tx.date.slice(5).replace("-", ".");
        return `
          <tr data-tx-id="${tx.id}" class="${isSelected ? "is-selected" : ""}">
            <td class="col-date mono">${shortDate}</td>
            <td class="col-merchant">
              <div class="merchant-cell-wrap">
                <span class="merchant-primary">${tx.merchant}</span>
                <span class="merchant-memo">${tx.memo}</span>
              </div>
            </td>
            <td class="col-room">
              <span class="room-tag-cell">
                <span class="dot-indicator dot-${tx.room}"></span>
                <span>${rm.nameJp}</span>
              </span>
            </td>
            <td class="col-amount num-col mono">${formatJpy(tx.amount)}</td>
          </tr>
        `;
      })
      .join("");
  }

  // ---------------------------------------------------------------------------
  // 8. 下段右: 取引詳細（店名・金額・内訳・一行メモ）
  // ---------------------------------------------------------------------------
  function renderBlueprintDrawer() {
    const tx =
      state.transactions.find((t) => t.id === state.selectedTxId) ||
      state.transactions[0];
    if (!tx) return;

    const rm = ROOM_META[tx.room] || ROOM_META.culture;

    const elRoomTag = document.getElementById("spec-room-tag");
    const elDate = document.getElementById("spec-date");
    const elAccount = document.getElementById("spec-account");
    const elMerchant = document.getElementById("spec-merchant");
    const elMemo = document.getElementById("spec-memo");
    const elTotal = document.getElementById("spec-total-amount");
    const elItemsList = document.getElementById("spec-items-list");

    if (elRoomTag) elRoomTag.textContent = rm.nameJp;
    if (elDate) elDate.textContent = tx.date.replaceAll("-", ".");
    if (elAccount) elAccount.textContent = tx.account;
    if (elMerchant) elMerchant.textContent = tx.merchant;
    if (elMemo) elMemo.textContent = tx.memo;
    if (elTotal) elTotal.textContent = formatJpy(tx.amount);

    if (elItemsList) {
      const items =
        Array.isArray(tx.items) && tx.items.length > 0
          ? tx.items
          : [{ name: tx.memo, price: tx.amount }];
      elItemsList.innerHTML = items
        .map(
          (item) => `
          <li class="voucher-item-row">
            <span>${item.name}</span>
            <span class="mono">${formatJpy(item.price)}</span>
          </li>
        `
        )
        .join("");
    }
  }

  // ---------------------------------------------------------------------------
  // 9. 全体描画
  // ---------------------------------------------------------------------------
  function renderAll() {
    const metrics = computeMetrics();
    renderStatement(metrics);
    renderFloorplanTreemap(metrics);
    renderLedgerTable();
    renderBlueprintDrawer();
  }

  // ---------------------------------------------------------------------------
  // 10. イベント登録
  // ---------------------------------------------------------------------------
  function bindEvents() {
    document.querySelectorAll(".room-cell").forEach((cell) => {
      cell.addEventListener("click", () => {
        const room = cell.dataset.room || "all";
        if (room === "all") {
          state.selectedRoom = "all";
        } else {
          state.selectedRoom = state.selectedRoom === room ? "all" : room;
        }
        renderAll();
      });
    });

    document.querySelectorAll(".mode-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        state.treemapMode = tab.dataset.mode || "actual";
        document.querySelectorAll(".mode-tab").forEach((t) => {
          const active = t === tab;
          t.classList.toggle("active", active);
          t.setAttribute("aria-selected", String(active));
        });
        renderAll();
      });
    });

    document.querySelectorAll(".room-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedRoom = btn.dataset.filter || "all";
        renderAll();
      });
    });

    const tbody = document.getElementById("ledger-tbody");
    if (tbody) {
      tbody.addEventListener("click", (e) => {
        const tr = e.target.closest("tr[data-tx-id]");
        if (!tr) return;
        state.selectedTxId = tr.dataset.txId;
        renderAll();
      });
    }

    const searchInput = document.getElementById("ledger-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        state.searchQuery = searchInput.value;
        renderAll();
      });
    }

    const btnHanko = document.getElementById("btn-hanko-seal");
    if (btnHanko) {
      btnHanko.addEventListener("click", () => {
        state.hankoStamped = !state.hankoStamped;
        saveState();
        renderAll();
      });
    }

    const btnTheme = document.getElementById("btn-theme-toggle");
    if (btnTheme) {
      btnTheme.addEventListener("click", toggleTheme);
    }

    const btnXray = document.getElementById("btn-xray-toggle");
    if (btnXray) {
      btnXray.addEventListener("click", toggleXray);
    }

    const btnSlop = document.getElementById("btn-slop-toggle");
    if (btnSlop) {
      btnSlop.addEventListener("click", toggleSlopMode);
    }

    const modal = document.getElementById("modal-new-entry");
    const btnOpenModal = document.getElementById("btn-new-entry");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const btnCancelModal = document.getElementById("btn-cancel-modal");
    const formNewEntry = document.getElementById("form-new-entry");

    if (btnOpenModal) btnOpenModal.addEventListener("click", openNewEntryModal);
    if (btnCloseModal) btnCloseModal.addEventListener("click", closeNewEntryModal);
    if (btnCancelModal) btnCancelModal.addEventListener("click", closeNewEntryModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeNewEntryModal();
      });
    }

    if (formNewEntry) {
      formNewEntry.addEventListener("submit", (e) => {
        e.preventDefault();
        const dateVal = document.getElementById("input-date").value || "2026-10-29";
        const roomVal = document.getElementById("input-room").value || "culture";
        const merchantVal = document.getElementById("input-merchant").value.trim();
        const memoVal = document.getElementById("input-memo").value.trim();
        const amountVal = Number(document.getElementById("input-amount").value) || 0;
        const accountVal = document.getElementById("input-account").value || "三井住友カード（4821）";

        if (!merchantVal || amountVal <= 0) return;

        const nextNum = 101 + state.transactions.length;
        const newTx = {
          id: `TX-${nextNum}`,
          date: dateVal,
          merchant: merchantVal,
          memo: memoVal || merchantVal,
          room: roomVal,
          account: accountVal,
          amount: amountVal,
          items: [{ name: memoVal || merchantVal, price: amountVal }]
        };

        state.transactions.unshift(newTx);
        state.selectedTxId = newTx.id;
        saveState();
        closeNewEntryModal();
        formNewEntry.reset();
        document.getElementById("input-date").value = "2026-10-29";
        renderAll();
      });
    }

    window.addEventListener("keydown", (e) => {
      const tag = (e.target && e.target.tagName) || "";
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (e.key === "Escape") {
        if (modal && !modal.hidden) {
          closeNewEntryModal();
          return;
        }
        if (state.selectedRoom !== "all" || state.searchQuery !== "") {
          state.selectedRoom = "all";
          state.searchQuery = "";
          if (searchInput) searchInput.value = "";
          renderAll();
        }
        return;
      }

      if (isInput) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        openNewEntryModal();
      } else if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        state.hankoStamped = !state.hankoStamped;
        saveState();
        renderAll();
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === "u" || e.key === "U") {
        e.preventDefault();
        toggleXray();
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        toggleSlopMode();
      } else if (e.key === "/") {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      }
    });
  }

  function openNewEntryModal() {
    const modal = document.getElementById("modal-new-entry");
    if (!modal) return;
    modal.hidden = false;
    const merchantInput = document.getElementById("input-merchant");
    if (merchantInput) setTimeout(() => merchantInput.focus(), 40);
  }

  function closeNewEntryModal() {
    const modal = document.getElementById("modal-new-entry");
    if (!modal) return;
    modal.hidden = true;
  }

  function toggleTheme() {
    state.theme = state.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", state.theme);
  }

  function toggleXray() {
    state.xrayMode = !state.xrayMode;
    document.body.classList.toggle("xray-active", state.xrayMode);
    const btn = document.getElementById("btn-xray-toggle");
    if (btn) btn.classList.toggle("is-active", state.xrayMode);
  }

  function toggleSlopMode() {
    state.slopMode = !state.slopMode;
    document.body.classList.toggle("slop-mode", state.slopMode);
    const banner = document.getElementById("slop-audit-banner");
    const btn = document.getElementById("btn-slop-toggle");
    const headline = document.getElementById("main-headline-text");

    if (banner) banner.hidden = !state.slopMode;
    if (btn) btn.classList.toggle("is-active", state.slopMode);
    if (headline) {
      headline.textContent = state.slopMode
        ? "Welcome back, Smart Saver!! 🚀✨"
        : "2026年 10月";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadState();
    bindEvents();
    renderAll();
  });
})();
