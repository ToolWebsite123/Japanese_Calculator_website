"use client";

import { useState } from "react";
import { CalculatorCard } from "@/components/home/CalculatorCard";
import {
  CATEGORY_META,
  getCalculatorsByCategory,
  getNavDescription,
  getNavLabel,
} from "@/lib/catalog";
import type { CalculatorCategory } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

const SIDEBAR_CATEGORIES: CalculatorCategory[] = [
  "basic",
  "scientific",
  "finance",
  "health",
  "conversion",
];

export function AllCalculatorsPage() {
  const { t } = useLocale();
  const [openCategory, setOpenCategory] = useState<CalculatorCategory>("basic");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]">
        {t.nav.allCalculators}
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav aria-label={t.home.categoriesTitle}>
            <ul className="flex flex-col gap-1">
              {SIDEBAR_CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat];
                const name = t.categories[meta.nameKey];
                const isOpen = openCategory === cat;
                return (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => setOpenCategory(cat)}
                      aria-current={isOpen ? "true" : undefined}
                      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                        isOpen
                          ? "border-brand bg-brand-muted text-brand"
                          : "border-border bg-surface-raised text-[#231942] hover:bg-brand-muted/50 dark:text-[#d6ccf0]"
                      }`}
                    >
                      <span>{name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <h2 className="mb-4 text-xl font-bold tracking-tight text-[#231942] dark:text-[#d6ccf0]">
            {t.categories[CATEGORY_META[openCategory].nameKey]}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {getCalculatorsByCategory(openCategory).map((item) => (
              <CalculatorCard
                key={item.href}
                href={item.href}
                label={getNavLabel(item)}
                description={getNavDescription(item)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
