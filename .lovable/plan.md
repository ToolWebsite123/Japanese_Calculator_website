## SEO / Content Duplication Audit — read-only findings

Method: fetched all 31 rendered routes listed in `public/sitemap.xml` from the running app and compared titles, meta descriptions, H1/H2/H3, body paragraphs, list items, and JSON-LD (exact + fuzzy matching at 0.80–0.90 similarity).

### 1. Meta titles — CLEAN
31/31 unique. No exact or near-duplicate (>0.90) pairs.

### 2. Meta descriptions — CLEAN
31/31 unique. No exact or near-duplicate pairs.

### 3. H1 headings — CLEAN
Every page has exactly one H1, and all 31 are unique.

### 4. H2/H3 duplicates — STRUCTURAL ONLY (low priority)

Remaining shared headings are all navigational chrome, not content:

- `関連する計算機` (x24) and `よくある質問` (x23) — section labels from `src/components/calculators/RelatedCalculators.tsx` and `src/components/calculator/CalculatorFaqSection.tsx`. Normal and expected.
- `使い方（ボタンの説明）` (x3) — `/scientific-calculator`, `/squareroot-calculator`, `/fraction-calculator`, from `src/components/calculator/ButtonGuideTable.tsx`.
- `このサイトについて` / `計算ツール` (x31) — footer H3s in `src/components/layout/Footer.tsx`.
- Calculator names as H3 (`金融電卓` x12, `複利計算機` x11, …) — these are the *link cards* inside the Related Calculators module, i.e. link anchors, not page content.

No page-content headings are duplicated.

### 5. Body content duplicates — ONLY LINK-CARD BLURBS

Exact-duplicate paragraphs across pages, all from shared components:

| Text (excerpt) | Pages | Source |
|---|---|---|
| `日常のニーズに対応するオンライン電卓を提供しています。簡単な計算から金融計算…` | 31 | `src/components/layout/Footer.tsx` |
| `Web電卓インストール不要のweb電卓。電卓webブラウザで動く電卓サイト…` | 6 | Related-calculator card, `src/lib/catalog.ts` descriptions |
| `パーセント計算機比率や増減率を求めるパーセント計算機…` | 6 | same |
| `割引 計算割引後の価格や割引率を計算…` | 5 | same |
| `分数電卓（乗算対応）分子・分母を入力する分数電卓…` | 5 | same |
| `ルート計算機平方根・n乗根に対応するルート計算機…` | 5 | same |
| `失業保険 計算退職前の給与、年齢、被保険者期間から…` | 4 | same |

These are one-line teaser texts inside `<Link>` cards, not article copy — Google treats them as navigation. **Near-duplicate prose paragraphs across pages: 0.**

### 6. FAQ content — CLEAN (exact), 8 low-grade near-misses

No FAQ question and no FAQ answer is duplicated exactly anywhere. Fuzzy matching surfaces 8 question pairs above 0.80 similarity, but in every case the **answers are 0.07–0.62 similar**, i.e. genuinely page-specific. The pattern is just shared phrasing shape:

- `入力した金額はサーバーに送られますか？` (`/financial-calculator`) vs `入力した年号はサーバーに送られますか？` (`/era-converter`) — 0.89 question / 0.62 answer. **The one pair worth rewording**, since both answers open with `いいえ、…はすべてブラウザ内で完結します。入力した…が外部へ送信されることはありません。`
- The other 7 pairs (`/interest-calculator` vs `/simultaneous-equations-calculator`, `/algebra-calculator`, `/social-insurance-calculator`; `/` vs `/income-tax-calculation`; `/time-calculator` vs `/algebra-calculator`) have answer similarity ≤ 0.38 — no action needed.

### 7. JSON-LD / structured data — no duplicates, 3 coverage gaps

- Zero identical schema blocks across pages (checked `@type` + `name` + `mainEntity`).
- `/` emits WebSite + FAQPage, `/calculators` emits ItemList, 25 calculator pages emit unique FAQPage.
- **Missing structured data:** `/furusato-nozei-calculation`, `/furusato-nozei-simulation-calculation` (both have FAQ content but no schema), and the 5 legal pages `/about`, `/privacy-policy`, `/terms`, `/contact`, `/disclaimer` (no schema at all — WebPage/ContactPage would be appropriate).

---

## Verdict

The high-severity categories the audit targeted — duplicate titles, descriptions, H1s, and copy-pasted body/FAQ prose — are **clean**. What remains is boilerplate chrome (expected) plus a small schema coverage gap.

## Optional cleanup (only if you approve)

1. Add FAQPage JSON-LD to `/furusato-nozei-calculation` and `/furusato-nozei-simulation-calculation` (`src/ported-pages/furusato-nozei-*/page.tsx`), sourcing the FAQ arrays already rendered by their calculator components.
2. Add WebPage / ContactPage JSON-LD to the 5 legal pages via `src/lib/seo/legal.ts` consumers.
3. Reword the `/era-converter` privacy FAQ answer so it no longer mirrors `/financial-calculator`'s opening sentence (`src/lib/i18n/ja.ts`).

No other changes are warranted by the data.
