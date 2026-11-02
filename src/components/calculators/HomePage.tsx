"use client";

import { Hero } from "@/components/home/Hero";

export function HomePage() {
  return (
    <div suppressHydrationWarning>
      <Hero />

      {/* Homepage content sections removed 2026-11-02 at the owner's
          explicit request (option confirmed in chat): the homepage now
          shows only the header, the H1 and the Web calculator, so the
          calculator is fully visible without scrolling. The guide,
          showcase, intro, why-us, FAQ, trust and CTA components remain
          in the repo as orphans (same precedent as the popular-
          calculators section removed 2026-10-31); the homepage FAQ
          JSON-LD was removed from routes/index.tsx together with the
          FAQ section, since schema must match visible content. */}
    </div>
  );
}
