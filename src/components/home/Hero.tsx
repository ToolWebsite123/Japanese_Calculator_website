"use client";

import { HeroCalculator } from "@/components/home/HeroCalculator";
import { useLocale } from "@/context/LocaleContext";

export function Hero() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-border bg-brand-muted/30 px-4 py-12 sm:px-6 sm:py-16 md:flex md:min-h-[calc(100dvh-4rem)] md:flex-col md:justify-center md:py-6 lg:py-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center sm:gap-10 md:gap-4 lg:gap-5">
        <div className="max-w-2xl shrink-0">
          <p className="text-sm font-medium tracking-wide text-brand md:text-xs">
            {t.home.heroEyebrow}
          </p>
          <h1
            id="hero-heading"
            className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#231942] sm:text-4xl md:text-3xl lg:text-4xl dark:text-[#d6ccf0]"
          >
            {t.home.heroTitle}
          </h1>
        </div>
        <div className="flex w-full justify-center">
          <HeroCalculator />
        </div>
      </div>
    </section>
  );
}
