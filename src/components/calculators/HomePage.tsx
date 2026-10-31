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
          owner's request (screenshot + tap confirmation). All 25 tools
          remain reachable via the category showcase below, the guide's
          links, and the /calculators hub. */}

      <HomeCalculatorsShowcase />

      <HomeCalculatorGuide />

      <HomeIntroSection />

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16" suppressHydrationWarning>
        <HomeFaqSection />
        <HomeTrustSection />
      </div>
    </div>
  );
}
