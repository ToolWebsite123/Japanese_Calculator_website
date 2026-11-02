"use client";

import { useLocale } from "@/context/LocaleContext";
import { HeroCalculator } from "@/components/home/HeroCalculator";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="border-b border-border bg-brand-muted/30 px-4 pt-2 pb-4 sm:px-6 sm:pt-4 sm:pb-6 flex flex-col items-center">
      <h1 className="mb-3 text-center text-xl font-semibold tracking-tight text-[#231942] sm:mb-4 sm:text-3xl dark:text-[#d6ccf0]">
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
      <div className="mt-2 flex w-full justify-center sm:mt-3">
        <HeroCalculator />
      </div>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
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
