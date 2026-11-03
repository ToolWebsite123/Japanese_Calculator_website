"use client";

import { HeroCalculator } from "@/components/home/HeroCalculator";

export function Hero() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-brand-muted/50 via-brand-muted/20 to-transparent px-4 pt-0 pb-3 sm:px-6 sm:pt-1 sm:pb-4 flex flex-col items-center">
      {/* Professional heading treatment (owner decision 2026-11-03):
          the heading group sits in a clean raised box with the site's
          card shadow — a small brand pill above the H1, the H1 itself
          two-tone with the 電卓 part in a brand gradient, and a short
          brand accent bar under it — the same accent the site's H2s
          and nav use. The hero stays calculator-only below the
          heading, so the full calculator remains visible in the
          first screen. */}
      <div
        className="flex flex-col items-center rounded-2xl bg-surface-raised px-5 py-2.5 ring-1 ring-border dark:ring-white/10"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <span className="mb-1 rounded-full bg-brand-muted px-3 py-0.5 text-[11px] font-bold tracking-wide text-brand dark:text-[#d6ccf0]">
          無料・登録不要
        </span>
        <h1 className="hp-h1 text-center text-3xl font-bold tracking-tight text-[#231942] sm:text-4xl dark:text-[#d6ccf0]">
          オンライン
          <span className="bg-gradient-to-r from-[#3f2d78] to-[#6d5bd0] bg-clip-text text-transparent dark:from-[#a794e0] dark:to-[#d6ccf0]">
            電卓
          </span>
        </h1>
        <div aria-hidden="true" className="mt-1.5 h-1 w-14 rounded-full bg-brand dark:bg-[#a794e0]" />
      </div>
      <div className="mt-2 flex w-full justify-center sm:mt-2.5">
        <HeroCalculator />
      </div>
    </section>
  );
}
