"use client";

import { HeroCalculator } from "@/components/home/HeroCalculator";
import { useLocale } from "@/context/LocaleContext";

export function Hero() {
  return (
    <section className="border-b border-border bg-brand-muted/30 px-4 py-6 sm:px-6 sm:py-8 flex flex-col items-center">
      <p className="mb-4 text-center text-2xl font-semibold tracking-tight text-[#231942] sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        Calculator Online
      </p>
      <div className="w-full flex justify-center max-w-6xl">
        <HeroCalculator />
      </div>
    </section>
  );
}
