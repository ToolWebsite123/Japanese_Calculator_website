"use client";

import { Hero } from "@/components/home/Hero";
import { HomeIntroSection } from "@/components/home/HomeIntroSection";
import { HomeCalculatorsShowcase } from "@/components/home/HomeCalculatorsShowcase";
import { HomeCalculatorGuide } from "@/components/home/HomeCalculatorGuide";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeTrustSection } from "@/components/home/HomeTrustSection";

export function HomePage() {
  return (
    <div suppressHydrationWarning>
      <Hero />

      {/* Popular-calculators cards section removed 2026-10-31 at the
          owner's request (screenshot + tap confirmation). Homepage now
          follows the BMI-page structure (same day, owner's order):
          heading -> Web calculator (in the hero) -> guide -> intro ->
          FAQ -> all-calculators showcase last, as the "related" block. */}

      <HomeCalculatorGuide />

      <HomeIntroSection />

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16" suppressHydrationWarning>
        <HomeFaqSection />
        <HomeTrustSection />
      </div>

      <HomeCalculatorsShowcase />
    </div>
  );
}
