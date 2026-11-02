"use client";

import { HeroCalculator } from "@/components/home/HeroCalculator";

export function Hero() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-brand-muted/50 via-brand-muted/20 to-transparent px-4 pt-2 pb-3 sm:px-6 sm:pt-3 sm:pb-4 flex flex-col items-center">
      <h1 className="mb-1.5 text-center text-2xl font-semibold tracking-tight text-[#231942] sm:mb-2 sm:text-3xl dark:text-[#d6ccf0]">
        オンライン電卓
      </h1>
      {/* Calculator-only hero (owner's decision 2026-11-02): the homepage
          shows just the heading and the Web calculator — no lead copy, no
          chips, no content sections — so the full calculator is visible
          in the first screen without scrolling, even on short laptop
          viewports. The オンライン電卓 line is the page H1. */}
      <div className="mt-1 flex w-full justify-center sm:mt-1.5">
        <HeroCalculator />
      </div>
    </section>
  );
}
