"use client";

import Link from "next/link";
import { CATEGORY_META, CATEGORY_ORDER, getCalculatorByHref, getNavLabel } from "@/lib/catalog";
import { NAV_ITEMS } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

/**
 * "Browse by purpose" block on the homepage (added 2026-11-02 in the
 * homepage overhaul): one card per category with its tool count and
 * direct links to the category's featured tools, so visitors can jump
 * straight to the kind of calculation they need. Data comes from the
 * shared catalog, grouped strictly by declared category (each tool
 * counted exactly once), so the block stays correct as tools are added.
 */
export function HomePurposeSection() {
  const { t } = useLocale();

  const groups = CATEGORY_ORDER.map((category) => {
    const items = NAV_ITEMS.filter((item) => item.category === category);
    return { category, meta: CATEGORY_META[category], items };
  }).filter((group) => group.items.length > 0);

  return (
    <section
      aria-labelledby="home-purpose-heading"
      className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16"
    >
      <h2
        id="home-purpose-heading"
        className="mb-4 text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
      >
        目的から探す
      </h2>
      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
        「何を計算したいか」から選べるように、計算機を6つのカテゴリに分けています。買い物の税込価格、給与の手取り、健康管理のBMI、長さの単位変換など、場面に合ったカテゴリから代表的なツールをそのまま開けます。
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(({ category, meta, items }) => (
          <div key={category} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-base font-bold text-text-primary">
                {t.categories[meta.nameKey]}
              </h3>
              <span className="shrink-0 text-xs font-medium text-text-tertiary">
                全{items.length}種
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              {t.categories[meta.descriptionKey]}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {meta.featuredHrefs.map((href) => {
                const item = getCalculatorByHref(href);
                if (!item) return null;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-block rounded-full border border-border bg-surface-sunken px-2.5 py-1 text-xs font-medium text-text-primary transition hover:border-brand/40 hover:text-brand"
                    >
                      {getNavLabel(item)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/calculators"
              className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
            >
              {t.categories[meta.nameKey]}の計算機をすべて見る →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
