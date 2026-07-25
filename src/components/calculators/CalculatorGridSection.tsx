"use client";

import { CalculatorCard } from "@/components/home/CalculatorCard";
import { getNavDescription, getNavLabel } from "@/lib/catalog";
import { NAV_ITEMS } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

type CalculatorGridSectionProps = {
  activeHref?: string;
};

export function CalculatorGridSection({ activeHref }: CalculatorGridSectionProps) {
  const { t } = useLocale();

  return (
    <section aria-labelledby="calculators-heading">
      <h2
        id="calculators-heading"
        className="mb-8 text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
      >
        {t.home.allCalculators}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {NAV_ITEMS.map((item) => (
          <CalculatorCard
            key={item.href}
            href={item.href}
            label={getNavLabel(item)}
            description={getNavDescription(item)}
            active={activeHref === item.href}
          />
        ))}
      </div>
    </section>
  );
}
