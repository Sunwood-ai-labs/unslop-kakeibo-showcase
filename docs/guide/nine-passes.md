# The 9 Redline Passes & UI Subtraction Insights

## Complete 9-Pass Implementation Checklist

In the **[unslop](https://heydamir.design/unslop)** methodology, once the 5-Line Direction is locked, the interface undergoes nine sequential redline passes. Below is the exact engineering checklist applied across all four household ledger concepts.

| Pass | Domain | What AI Slop Does (Banned) | What This Showcase Enforces |
| :--- | :--- | :--- | :--- |
| **Pass 1** | **Spacing** | Arbitrary pixel values (`13px`, `27px`), cramped card padding, inconsistent gaps. | Strict `4px` spatial scale (`4, 8, 12, 16, 20, 24, 28, 32, 40, 48px`). In `00 Masu`: `256px` sidebar (`16px` padding, `34px` nav row height, `2px` row gap, `24px` top / `8px` bottom section spacing), `56px` topbar, `20px 24px` card padding. |
| **Pass 2** | **Color** | Glowing purple/cyan gradients, neon borders, saturated status pills everywhere. | Monochrome UI chrome (Quiet Graphite `#0f0f10`–`#232325` or Warm Paper `#f2efe9`–`#fdfbf7`). Color is reserved strictly for the 2 Moments and `6px` semantic envelope dots. Primary CTA uses high-contrast off-white (`#ededed`) or sumi ink (`#1c1b18`). |
| **Pass 3** | **Icons** | Emoji in navigation and category headers (`🏠`, `🍔`, `💰`, `✨`), mixed icon styles. | **Zero emojis (`0`)** in normal mode. All icons are `16px` inline SVGs with uniform `stroke-width="1.5"` inheriting `currentColor` from their parent text role. |
| **Pass 4** | **Copy** | Hype greetings (`Welcome back!! 👋`), unanchored percentages (`-8.4%` with no baseline), marketing jargon. | Period-anchored headings (`2026年 10月`). Every delta includes an explicit monospace comparison baseline (`前月比 -8.4%`, `目標差 +¥24,380`). |
| **Pass 5** | **Type** | Heavy `700`–`900` weights, ALL-CAPS tracking abuse, proportional numerals that jitter in tables. | Only font weights `400` and `500` are permitted. Every currency figure, date, percentage, and count enforces `font-variant-numeric: tabular-nums` with `'JetBrains Mono'`. |
| **Pass 6** | **Layout** | Uniform 4-card grids where every card has equal visual weight; centered marketing hero inside an app. | Full-height desktop workspace (`256px` sidebar or `56px` icon rail + `1440px` max main canvas). Asymmetric top summary row, `2:1` main chart & envelope column, and ledger table paired with a live receipt inspector. |
| **Pass 7** | **Details** | Identical border-radius on outer and inner containers; decorative mini-sparklines inside every KPI card. | Concentric nested radii (`4px` keycaps, `8px` buttons/inputs/nav rows, `12px` cards, `16px` modals). Zero mini-sparklines inside summary metric cards. |
| **Pass 8** | **Visuals** | Abstract 3D blobs, generic stock illustrations, or competing rainbow charts across the entire viewport. | Visual craft is concentrated exclusively into **Moment 1** (tactile payment card + thermal receipt / botanical voucher / oscilloscope / vermilion seal) and **Moment 2** (primary expenditure chart). |
| **Pass 9** | **Motion** | Bouncy springs, infinite pulsing badges, `hover:scale(1.05)` card zoom effects. | Zero continuous loop animations and zero scale transforms on hover. Only quiet color, border, and opacity transitions using a single easing curve: `cubic-bezier(0.22, 1, 0.36, 1)`. |

---

## Key Insight: Radical Subtraction & 100% Pure Japanese UI

During iterative visual QA across the four concepts, we discovered a subtle form of "designer slop" that often survives initial cleanup: **decorative bilingual duplication and pseudo-technical metadata labels**.

### 1. Eliminating Bilingual Label Duplication

When building Japanese web apps, AI models frequently concatenate English and Japanese on every single label (`Spent this month · 今月の支出`, `Overview · 概要`, ` OCTOBER 2026 · 2026年10月`) to make the interface look "international" or "editorial." In practice, this doubles visual density and slows down scanning.

| Component | Before Subtraction (Noisy Bilingual Slop) | After Subtraction (100% Natural Japanese UI) |
| :--- | :--- | :--- |
| **Brand Title** | `Masu 枡 — HOUSEHOLD LEDGER` | `枡` |
| **Navigation Items** | `Overview · 概要`, `Transactions · 明細`, `Envelopes · 予算` | `概要`, `明細台帳`, `予算の枡`, `カード・口座` |
| **Primary Metric Card** | `SPENT THIS MONTH · 今月の支出` | `今月の支出` |
| **Comparison Badge** | `-8.4% vs Sep 2026 (¥310,720)` | `前月比 -8.4%` / `9月実績 ¥310,720` |
| **Top Utility Controls** | `Unslop X-Ray [U]`, `Compare Slop [B]`, `Theme [T]` | `赤入れ検証 [U]`, `スロップ比較 [B]`, `配色 [T]` |

### 2. Stripping Pseudo-Technical Blueprint Codes

In atmospheric concepts like `01 Kakei Shiori`, `02 Pulse`, and `03 Tokonoma`, initial drafts included decorative serial numbers and architectural figure codes (`FOLIO NO. 2026-10`, `SYS-TELEMETRY // 02`, `FIG. 01 — MADORI ALLOCATION`).

While atmospheric at first glance, these labels violate **Pass 4 (Copy)** and **Pass 7 (Details)** because a person checking their household grocery budget does not need fake serial numbers competing with actual yen amounts. Removing every non-functional serial code immediately made the typography breathe and elevated the real financial numbers.

### 3. Moving Self-Referential Methodology Badges into X-Ray Mode `[U]`

A common trap when building a design showcase is plastering badges like `UNSLOP 9 PASSES APPLIED` or `4PX GRID VERIFIED` permanently across the application header.

- **Normal Mode**: The application behaves 100% as a genuine, quiet household ledger with zero meta-commentary about its own design rules.
- **X-Ray Mode (`[U]`)**: Pressing <kbd>U</kbd> reveals the redline audit layer (`data-xray` annotations and the inspection banner), cleanly separating the *product experience* from the *design critique*.

---

## Experiencing Before vs. After Live (`[B]` Key)

You do not need to imagine what the un-audited AI output looks like. Open any of the four live applications and press <kbd>B</kbd> (**スロップ比較 / Compare Slop**):

1. **[00 Masu Live Demo ↗](/unslop-kakeibo-showcase/demo/index.html){target="_blank"}** — Press <kbd>B</kbd> to see the quiet graphite ledger mutate into a purple-gradient SaaS dashboard with emoji labels and hype copy.
2. **[01 Kakei Shiori Live Demo ↗](/unslop-kakeibo-showcase/demo/concepts/shiori/index.html){target="_blank"}** — Press <kbd>B</kbd> to compare cotton archival paper against neon glassmorphism.
3. **[02 Pulse Live Demo ↗](/unslop-kakeibo-showcase/demo/concepts/pulse/index.html){target="_blank"}** — Press <kbd>B</kbd> to compare single-accent signal telemetry against multi-colored glowing widgets.
4. **[03 Tokonoma Live Demo ↗](/unslop-kakeibo-showcase/demo/concepts/tokonoma/index.html){target="_blank"}** — Press <kbd>B</kbd> to compare an exposed `1px` Swiss architectural grid against floating rounded shadow cards.
