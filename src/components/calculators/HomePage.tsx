"use client";

import { Hero } from "@/components/home/Hero";
import { HomePopularCalculators } from "@/components/home/HomePopularCalculators";
import { HomeIntroSection } from "@/components/home/HomeIntroSection";
import { HomeCalculatorsShowcase } from "@/components/home/HomeCalculatorsShowcase";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeTrustSection } from "@/components/home/HomeTrustSection";

export function HomePage() {
  return (
    <div suppressHydrationWarning>
      <Hero />

      <HomePopularCalculators />

      <HomeCalculatorsShowcase />

      <HomeIntroSection />

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16" suppressHydrationWarning>
        <HomeFaqSection />
        <HomeTrustSection />
      </div>
    </div>
  );
}
