"use client";

import Link from "@/compat/next-link";
import { useLocale } from "@/context/LocaleContext";
import { NAV_ITEMS, type CalculatorCategory } from "@/lib/constants";

// Fresh homepage category browser (2026-11-02 rewrite). Cards are built
// from the catalog data with strict declared-category filtering, so
// counts and links can never drift from the actual tool list.
const CATEGORY_CARDS: {
  slug: CalculatorCategory;
  nameKey:
    "basicName" | "scientificName" | "financeName" | "healthName" | "conversionName" | "moreName";
  glyph: string;
  description: string;
}[] = [
  {
    slug: "basic",
    nameKey: "basicName",
    glyph: "＋",
    description: "パーセントや割引、時間、文字数など、毎日の暮らしでよく使う計算をまとめました。",
  },
  {
    slug: "scientific",
    nameKey: "scientificName",
    glyph: "ƒ",
    description: "関数電卓や分数・文字式の計算、グラフ描画まで、学習や技術計算に役立つツールです。",
  },
  {
    slug: "finance",
    nameKey: "financeName",
    glyph: "¥",
    description: "消費税や所得税などの税金、複利・利息・ふるさと納税まで、お金の試算はこちらです。",
  },
  {
    slug: "health",
    nameKey: "healthName",
    glyph: "♥",
    description: "BMIの計算や出産予定日など、健康管理と暮らしの目安づけに使えます。",
  },
  {
    slug: "conversion",
    nameKey: "conversionName",
    glyph: "⇄",
    description: "長さ・重さなど11カテゴリの単位変換と、坪・畳・㎡の換算に対応しています。",
  },
  {
    slug: "more",
    nameKey: "moreName",
    glyph: "✦",
    description: "麻雀の点数計算など、趣味の場面で役立つ計算機です。",
  },
];

export function HomeCategoryNav() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="home-category-heading"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14"
    >
      <h2
        id="home-category-heading"
        className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
      >
        カテゴリから計算機を探す
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
        四則演算だけなら上部のWeb電卓で十分ですが、税金や健康、単位の換算など目的が決まっている計算は、専用の計算機のほうが速くて正確です。カテゴリから目的のツールを選んでください。
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_CARDS.map((card) => {
          const items = NAV_ITEMS.filter((item) => item.category === card.slug);
          const name = t.categories[card.nameKey];
          return (
            <div
              key={card.slug}
              className="flex flex-col rounded-2xl border border-border bg-surface p-4 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-base font-bold text-white"
                  aria-hidden="true"
                >
                  {card.glyph}
                </span>
                <p className="text-base font-bold text-text-primary">
                  {name}
                  <span className="ml-2 text-xs font-medium text-text-tertiary">
                    {items.length}種
                  </span>
                </p>
              </div>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-text-secondary">
                {card.description}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {items.slice(0, 3).map((item) => {
                  const key = item.labelKey.replace("nav.", "") as keyof typeof t.nav;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="inline-block rounded-full bg-brand-muted/60 px-2.5 py-1 text-xs font-medium text-brand transition hover:bg-brand-muted dark:text-[#d6ccf0]"
                      >
                        {t.nav[key]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center">
        <Link
          href="/calculators"
          className="text-sm font-semibold text-brand hover:underline dark:text-[#d6ccf0]"
        >
          すべての計算機を一覧で見る →
        </Link>
      </p>
    </section>
  );
}
