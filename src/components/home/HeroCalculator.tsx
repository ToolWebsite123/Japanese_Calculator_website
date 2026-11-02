"use client";

import { StandardCalculator } from "@/components/calculators/StandardCalculator";

export function HeroCalculator() {
  return (
    <div className="w-full max-w-3xl">
      <StandardCalculator maxWidthClass="max-w-3xl" />
    </div>
  );
}
