"use client";

import { StandardCalculator } from "@/components/calculators/StandardCalculator";

/**
 * Hero calculator: the FULL standard calculator (every key and feature —
 * memory, tax keys, GT, history) in the compact density, so the whole
 * keypad fits in the first screen without scrolling on typical laptop
 * and desktop viewports. Only the row heights/padding are tighter; the
 * logic and key set are identical to the full-size variant.
 */
export function HeroCalculator() {
  return (
    <div className="w-full max-w-3xl">
      <StandardCalculator compact maxWidthClass="max-w-3xl" />
    </div>
  );
}
