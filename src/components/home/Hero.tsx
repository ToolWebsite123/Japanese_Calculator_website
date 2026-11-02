"use client";

import { useLocale } from "@/context/LocaleContext";
import { HeroCalculator } from "@/components/home/HeroCalculator";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="border-b border-border bg-brand-muted/30 px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8 flex flex-col items-center">
      <h1 className="mb-3 text-center text-2xl font-semibold tracking-tight text-[#231942] sm:mb-4 sm:text-4xl dark:text-[#d6ccf0]">
        オンライン電卓
      </h1>
      <p className="max-w-2xl text-center text-base font-medium leading-relaxed text-text-secondary sm:text-lg">
        {t.home.heroTitle}
      </p>
      {/* BMI-page structure (owner's order 2026-10-31): centered heading,
          then the Web calculator, then content below. The hero intro
          paragraph was removed on 2026-10-31 at the owner's request so
          the calculator sits fully inside the hero. The prominent
          オンライン電卓 line became the real H1 on 2026-11-02 (it was a
          <p> before, while the small heroTitle line carried the H1). */}
      <div className="mt-3 flex w-full justify-center sm:mt-4">
        <HeroCalculator />
      </div>
      <ul className="mt-5 flex flex-wrap justify-center gap-2">
        {t.home.heroChips.map((chip) => (
          <li key={chip.label}>
            <a
              href={chip.href}
              className="inline-block rounded-full border border-border bg-surface-sunken px-3 py-1.5 text-sm text-text-primary"
            >
              {chip.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
