"use client";

import { StandardCalculator } from "@/components/calculators/StandardCalculator";

export function HeroCalculator() {
  return (
    <div className="w-full max-w-xl md:max-w-lg">
      <StandardCalculator compact />
    </div>
  );
}
