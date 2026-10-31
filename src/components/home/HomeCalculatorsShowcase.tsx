"use client";

import { CalculatorCard } from "@/components/home/CalculatorCard";
import { CATEGORY_META, CATEGORY_ORDER, getNavDescription, getNavLabel } from "@/lib/catalog";
import { NAV_ITEMS } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

/**
 * Full calculator catalogue on the homepage, grouped by category with the
 * same data and grouping as the /calculators hub (AllCalculatorsPage).
 * Server-rendered like the hub, so every calculator page is linked from the
 * homepage HTML. Headings start at H2/H3 — the homepage H1 lives in
 * Hero and must stay unique.
 */
export function HomeCalculatorsShowcase() {
  const { t } = useLocale();

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    meta: CATEGORY_META[category],
    items: NAV_ITEMS.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <section
      aria-labelledby="home-calculators-heading"
      className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16"
    >
      <h2
        id="home-calculators-heading"
        className="mb-4 text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
      >
        すべての計算機
      </h2>
      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
        計算機は目的に合わせて選ぶと、もっと速く正確に計算できます。当サイトでは、日常の計算に使う「基本」、三角関数や対数などの「関数」、税金や複利などの「金融」、BMIなどの「健康」、長さや重さの「変換」という5つのカテゴリに、全25種の計算ツールをまとめています。お探しの計算が決まっているときは、下のカテゴリからそのまま選んでください。
      </p>

      <div className="space-y-10">
        {groups.map(({ category, meta, items }) => (
          <section key={category} aria-labelledby={`home-category-${category}`}>
            <h3
              id={`home-category-${category}`}
              className="mb-4 text-lg font-bold tracking-tight text-[#231942] sm:text-xl dark:text-[#d6ccf0]"
            >
              {t.categories[meta.nameKey]}
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}
