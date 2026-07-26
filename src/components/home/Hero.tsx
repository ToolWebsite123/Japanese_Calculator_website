"use client";

import { HeroCalculator } from "@/components/home/HeroCalculator";
import { useLocale } from "@/context/LocaleContext";

export function Hero() {
  return (
    <section className="border-b border-border bg-brand-muted/30 px-4 py-6 sm:px-6 sm:py-8 flex justify-center">
      <div className="w-full flex justify-center max-w-6xl">
        <HeroCalculator />
      </div>
    </section>
  );
}
