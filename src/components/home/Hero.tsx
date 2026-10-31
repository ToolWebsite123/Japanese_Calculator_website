"use client";

import { useLocale } from "@/context/LocaleContext";
import { HeroCalculator } from "@/components/home/HeroCalculator";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="border-b border-border bg-brand-muted/30 px-4 py-6 sm:px-6 sm:py-8 flex flex-col items-center">
      <p className="mb-4 text-center text-2xl font-semibold tracking-tight text-[#231942] sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        オンライン電卓
      </p>
      <h1 className="max-w-2xl text-center text-base font-medium leading-relaxed text-text-secondary sm:text-lg">
        {t.home.heroTitle}
      </h1>
      <p className="mt-4 max-w-2xl text-center text-sm leading-relaxed text-text-secondary sm:text-base">
        {t.home.heroIntro}
      </p>
      {/* BMI-page structure (owner's order 2026-10-31): centered heading,
          then the Web calculator, then content below. */}
      <div className="mt-6 flex w-full justify-center sm:mt-8">
        <HeroCalculator />
      </div>
    </section>
  );
}
