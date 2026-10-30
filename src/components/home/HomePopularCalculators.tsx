"use client";

import { CalculatorCard } from "@/components/home/CalculatorCard";
import { getNavDescription, getNavLabel } from "@/lib/catalog";
import { NAV_ITEMS, type NavItem } from "@/lib/constants";

/**
 * The eight most popular calculators, shown as cards directly under the
 * hero. Uses the same CalculatorCard and catalog data as the full
 * category showcase below, so labels and descriptions stay in sync.
 */
const POPULAR_HREFS = [
  "/web-calculator",
  "/scientific-calculator",
  "/bmi-calculator",
  "/consumption-tax-calculator",
  "/percentage-calculator",
  "/compound-interest-calculator",
  "/income-tax-calculation",
  "/unit-converter",
];

export function HomePopularCalculators() {
  const items = POPULAR_HREFS.map((href) =>
    NAV_ITEMS.find((item) => item.href === href),
  ).filter((item): item is NavItem => item !== undefined);

  return (
    <section
      aria-labelledby="home-popular-heading"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <h2
        id="home-popular-heading"
        className="mb-8 text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
      >
        人気の計算ツール
      </h2>

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
  );
}
