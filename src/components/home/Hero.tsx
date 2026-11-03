"use client";

import { HeroCalculator } from "@/components/home/HeroCalculator";

export function Hero() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-brand-muted/50 via-brand-muted/20 to-transparent px-4 pt-1 pb-3 sm:px-6 sm:pt-2 sm:pb-4 flex flex-col items-center">
      {/* Professional heading treatment (owner decision 2026-11-03):
          a small brand pill above the H1, the H1 itself two-tone with
          the 電卓 part in a brand gradient, and a short brand accent
          bar under it — the same accent the site's H2s and nav use.
          The hero stays calculator-only below the heading, so the full
          calculator remains visible in the first screen. */}
      <span className="mb-1.5 rounded-full bg-brand-muted px-3 py-0.5 text-[11px] font-bold tracking-wide text-brand dark:text-[#d6ccf0]">
        無料・登録不要
      </span>
      <h1 className="hp-h1 text-center text-3xl font-bold tracking-tight text-[#231942] sm:text-4xl dark:text-[#d6ccf0]">
        オンライン
        <span className="bg-gradient-to-r from-[#3f2d78] to-[#6d5bd0] bg-clip-text text-transparent dark:from-[#a794e0] dark:to-[#d6ccf0]">
          電卓
        </span>
      </h1>
      <div aria-hidden="true" className="mt-2 h-1 w-14 rounded-full bg-brand dark:bg-[#a794e0]" />
      <div className="mt-2 flex w-full justify-center sm:mt-2.5">
        <HeroCalculator />
      </div>
    </section>
  );
}
