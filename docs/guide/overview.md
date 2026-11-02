# Overview & The 5-Line Direction

## Purpose of This Showcase

When prompted to build a financial dashboard or household ledger (Kakeibo), language models almost universally default to generic **"AI Slop"** patterns: glowing purple-to-cyan gradients, floating glassmorphic cards, emoji-stuffed category labels (`🏠 Housing`, `🍔 Food`), ultra-bold `800` weight headings, exclamation-heavy greetings (`Welcome back!! 👋`), and decorative mini-sparklines inside every metric card.

This repository verifies **[unslop](https://heydamir.design/unslop)** — an open UI design methodology created by **[Damir Sokolovsky (@heydamir)](https://x.com/heydamir)** (licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)) — by applying its two core pillars to a complete Japanese household ledger application:

1. **The 5-Line Direction**: Establishing a concrete material world, a three-adjective character, strictly two visual focal moments, and one recurring signature *before* writing code.
2. **The 9 Redline Passes**: Auditing spacing, color, icons, copy, typography, layout, details, visuals, and motion to strip out synthetic noise and leave only calm, functional clarity.

> [!IMPORTANT]
> To prove that `unslop` is not merely a single "dark minimalist skin," we built **four completely different visual worlds** (`00 Masu`, `01 Kakei Shiori`, `02 Pulse`, and `03 Tokonoma`) on top of the exact same household ledger dataset and the exact same 9 Passes.

---

## What Is the 5-Line Direction?

Before creating a layout or choosing hex codes, `unslop` requires writing a **5-Line Direction**:

| Line | Definition | Why It Prevents AI Slop |
| :--- | :--- | :--- |
| **1. Product** | One concise sentence stating what the tool does and for whom. | Stops feature creep and keeps every screen focused on the core ledger workflow. |
| **2. Character** | Exactly three adjectives (e.g., `calm, exact, tactile`). | Gives every spacing, border, and contrast decision an explicit emotional filter. |
| **3. World** | Tangible physical objects and materials the UI draws from. | Replaces generic SaaS tropes with authentic textures (graphite, cotton paper, oscilloscope phosphor, shikkui plaster). |
| **4. Moments** | **Strictly two** high-craft visual moments on the screen. | Prevents visual competition. If everything on screen screams for attention, nothing stands out. |
| **5. Signature** | One subtle, recurring structural motif across the interface. | Creates cohesive identity without relying on loud brand colors or oversized logos. |

---

## 5-Line Direction Across All 4 Concepts

Every concept in this showcase locks in its own 5-Line Direction while sharing the October 2026 ledger dataset:

| Dimension | `00` Masu (枡) | `01` Kakei Shiori (家計栞) | `02` Pulse (パルス) | `03` Tokonoma (床の間) |
| :--- | :--- | :--- | :--- | :--- |
| **Live Demo** | [Launch 00 Masu ↗](/unslop-kakeibo-showcase/demo/index.html){target="_blank"} | [Launch 01 Shiori ↗](/unslop-kakeibo-showcase/demo/concepts/shiori/index.html){target="_blank"} | [Launch 02 Pulse ↗](/unslop-kakeibo-showcase/demo/concepts/pulse/index.html){target="_blank"} | [Launch 03 Tokonoma ↗](/unslop-kakeibo-showcase/demo/concepts/tokonoma/index.html){target="_blank"} |
| **Character** | `calm, exact, tactile` | `warm, literary, unhurried` | `technical, high-precision, atmospheric` | `architectural, serene, structural` |
| **World** | Graphite pencils, fresh thermal receipts, brushed brass/metal cards, Japanese wooden *masu* boxes. | Fountain-pen ink on archival cotton paper, brass paperclips, letterpress botanical vouchers, cloth-bound books. | Studio audio analyzers, precision oscilloscopes, split-flap departure boards, dark anodized aluminum. | Shikkui white plaster, exposed `1px` architectural gridlines, Japanese *tokonoma* alcoves, vermilion hanko seals. |
| **Moment 1** | Stacked brushed-metal payment cards (`•••• 4821`) with a serrated thermal receipt peeking out behind. | Brass-clipped copperplate botanical voucher on the right folio margin. | Live Canvas 2D oscilloscope waveform paired with a mechanical split-flap digit counter. | Monumental serif monthly expenditure numerals (`¥284,620`) stamped with a single vermilion seal (`済`). |
| **Moment 2** | 5-envelope cubic Bézier spline chart with previous-month mirrored reflection below the zero baseline. | 6-month seasonal bar chart where only October is filled in fountain-pen viridian green (`#1e4d3b`). | 31-day daily expenditure impulse bar chart in signal orange (`#ff5722`) with a cumulative burn-rate curve. | Architectural floor-plan (*Madori*) 5-zone proportional treemap of monthly living expenses. |
| **Signature** | Subtle `4px`-radius keycap badges (`⌘K`, `N`, `1`–`4`, `U`, `B`, `T`) and `6px` envelope status dots. | Hanging crimson cloth bookmark ribbon (`栞`) at the top-right edge that toggles X-Ray mode. | `56px` compact left icon rail and monospace coordinate crosshairs. | Exposed `1px` edge-to-edge Swiss structural hairlines with zero floating card shadows. |

---

## Shared Dataset & Interactive Capabilities

All four apps operate on the same October 2026 household ledger state and persist user-added entries via `LocalStorage`:

- **Monthly Income**: `¥420,000`
- **Monthly Spend (October 2026)**: `¥284,620` (`-8.4%` vs September `¥310,720`)
- **Monthly Budget Target**: `¥310,000` (`¥25,380` remaining buffer)
- **5 Budget Envelopes**:
  1. Housing & Utilities (`住居・固定費`) — `¥118,000 / ¥120,000`
  2. Groceries & Daily (`食費・日用品`) — `¥68,420 / ¥75,000`
  3. Culture & Dining (`交際・文化`) — `¥44,800 / ¥45,000`
  4. Transit & Mobility (`交通・移動`) — `¥21,400 / ¥30,000`
  5. Reserve & Special (`特別・予備`) — `¥32,000 / ¥40,000`

### Global Keyboard Shortcuts

Inside any of the four live applications, use these keyboard shortcuts (or the top bar buttons) to inspect the implementation:

| Key | Action | Description |
| :---: | :--- | :--- |
| <kbd>U</kbd> | **Unslop X-Ray** | Overlays redline inspection tags showing how the 9 Passes (4px grid, monochrome chrome, tabular numerals, Moments) are applied to each element. |
| <kbd>B</kbd> | **Compare Slop** | Instantly switches the UI into a typical "AI Slop" template (purple neon gradients, emoji labels, hype copy, heavy shadows) using the exact same data. |
| <kbd>T</kbd> | **Theme Switch** | Toggles between Dark Mode (Quiet Graphite / Deep Ink) and Light Mode (Warm Archival Paper / Alabaster). |
| <kbd>N</kbd> | **New Entry Modal** | Opens the transaction entry dialog to record a new expense and recalculate all totals, envelopes, and charts live. |
| <kbd>/</kbd> or <kbd>⌘K</kbd> | **Search Ledger** | Filters transactions in real time by merchant, note, category, or payment method. |
| <kbd>1</kbd> – <kbd>4</kbd> | **Switch Sub-Views** | Navigates between Overview, Transactions/Trajectory, Envelopes/Allocation, and Cards/Spec views. |
