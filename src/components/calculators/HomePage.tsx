"use client";

import { Hero } from "@/components/home/Hero";
import { HomeExamples } from "@/components/home/HomeExamples";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeFeatures } from "@/components/home/HomeFeatures";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomeMobileNote } from "@/components/home/HomeMobileNote";
import { HomeToolChooser } from "@/components/home/HomeToolChooser";
import { HomeUsageGuide } from "@/components/home/HomeUsageGuide";

export function HomePage() {
  return (
    <div suppressHydrationWarning>
      <Hero />

      {/* Homepage SEO content (owner-approved HOMEPAGE-SEO-MASTER-REPORT
          draft, Phase 10 implementation 2026-11-02). The hero stays
          exactly as it is; all content lives below the fold so the
          calculator keeps fitting the first screen. This supersedes
          the earlier calculator-only note — the owner approved this
          content explicitly after reviewing the full draft. */}
      <HomeIntro />
      <HomeExamples />
      <HomeUsageGuide />
      <HomeFeatures />
      <HomeToolChooser />
      <HomeMobileNote />
      <HomeFaq />
    </div>
  );
}
