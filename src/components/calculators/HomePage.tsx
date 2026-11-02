"use client";

import { Hero } from "@/components/home/Hero";
import { HomeCategoryNav } from "@/components/home/HomeCategoryNav";
import { HomeCalcGuide } from "@/components/home/HomeCalcGuide";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeCta } from "@/components/home/HomeCta";

export function HomePage() {
  return (
    <div suppressHydrationWarning>
      <Hero />

      {/* Homepage content was rewritten from scratch on 2026-11-02 at
          the owner's request ("fresh content, new method, good design;
          no old content left in the backend"). The hero stays
          calculator-only so the full calculator fits the first screen;
          all content lives below it: category browser -> calculator
          guide -> about -> FAQ -> closing banner. The previous
          sections (guide / purpose / showcase / intro / why-us / FAQ /
          trust / CTA components and their ja.ts strings) were deleted
          outright, not left as orphans. */}

      <HomeCategoryNav />

      <HomeCalcGuide />

      <HomeAbout />

      <HomeFaq />

      <HomeCta />
    </div>
  );
}
