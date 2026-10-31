"use client";

import { CalculatorCard } from "@/components/home/CalculatorCard";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CATEGORY_META, CATEGORY_ORDER, getNavDescription, getNavLabel } from "@/lib/catalog";
import { NAV_ITEMS, type CalculatorCategory } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

const HUB_INTRO =
  "電卓.onlineの計算ツールをすべてまとめました。関数電卓や税金・社会保険のシミュレーション、単位変換、麻雀の点数計算まで、全25種類のツールが無料・登録不要で使えます。入力した数値はブラウザの中で処理され、サーバーには送信されません。目的の計算をカテゴリからお選びください。";

export const HUB_FAQ = {
  title: "計算ツール一覧のよくある質問",
  items: [
    {
      question: "利用料金はかかりますか？",
      answer: "すべて無料です。会員登録も必要ありません。",
    },
    {
      question: "入力した数値は保存されますか？",
      answer:
        "いいえ。計算はお使いのブラウザ内で処理され、サーバーへ送信されることはありません。",
    },
    {
      question: "スマートフォンでも使えますか？",
      answer: "はい。スマートフォンやタブレットのブラウザでもそのまま使えます。",
    },
  ],
};

// Every category is rendered in full, including in the server-rendered HTML.
// The previous version only rendered the interactively selected category,
// which left most calculators unreachable (and unlinked) for crawlers.
const HUB_CATEGORIES: CalculatorCategory[] = CATEGORY_ORDER;

export function AllCalculatorsPage() {
  const { t } = useLocale();

  const groups = HUB_CATEGORIES.map((category) => ({
    category,
    meta: CATEGORY_META[category],
    items: NAV_ITEMS.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]">
        {t.nav.allCalculators}
      </h1>

      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
        {HUB_INTRO}
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav aria-label={t.home.categoriesTitle}>
            <ul className="flex flex-col gap-1">
              {groups.map(({ category, meta, items }) => {
                const name = t.categories[meta.nameKey];
                return (
                  <li key={category}>
                    <a
                      href={`#category-${category}`}
                      className="flex w-full items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-2 text-left text-sm font-semibold text-[#231942] transition-colors hover:bg-brand-muted/50 dark:text-[#d6ccf0]"
                    >
                      <span>{name}</span>
                      <span className="text-xs font-medium text-text-tertiary">{items.length}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-14">
          {groups.map(({ category, meta, items }) => (
            <section
              key={category}
              id={`category-${category}`}
              aria-labelledby={`heading-${category}`}
              className="scroll-mt-24"
            >
              <h2
                id={`heading-${category}`}
                className="mb-4 text-xl font-bold tracking-tight text-[#231942] dark:text-[#d6ccf0]"
              >
                {t.categories[meta.nameKey]}
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {items.map((item) => (
                  <CalculatorCard
                    key={item.href}
                    href={item.href}
                    label={getNavLabel(item)}
                    description={getNavDescription(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <CalculatorFaqSection title={HUB_FAQ.title} items={HUB_FAQ.items} />
    </div>
  );
}
