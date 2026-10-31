"use client";

import { useLocale } from "@/context/LocaleContext";
import { HeroCalculator } from "@/components/home/HeroCalculator";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="border-b border-border bg-brand-muted/30 px-4 pt-2 pb-4 sm:px-6 sm:pt-4 sm:pb-6 flex flex-col items-center">
      <p className="mb-3 text-center text-xl font-semibold tracking-tight text-[#231942] sm:mb-4 sm:text-3xl dark:text-[#d6ccf0]">
        オンライン電卓
      </p>
      <h1 className="max-w-2xl text-center text-base font-medium leading-relaxed text-text-secondary sm:text-lg">
        {t.home.heroTitle}
      </h1>
      {/* BMI-page structure (owner's order 2026-10-31): centered heading,
          then the Web calculator, then content below. The hero intro
          paragraph was removed on 2026-10-31 at the owner's request so
          the calculator sits fully inside the hero. */}
      <div className="mt-2 flex w-full justify-center sm:mt-3">
        <HeroCalculator />
      </div>
    </section>
  );
}
