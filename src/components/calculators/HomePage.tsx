"use client";

import { Hero } from "@/components/home/Hero";
import { HomeIntroSection } from "@/components/home/HomeIntroSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeTrustSection } from "@/components/home/HomeTrustSection";

export function HomePage() {
  return (
    <>
      <Hero />

      <HomeIntroSection />

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <HomeFaqSection />
        <HomeTrustSection />
      </div>
    </>
  );
}
