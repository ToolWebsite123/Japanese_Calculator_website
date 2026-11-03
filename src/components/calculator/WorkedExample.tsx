"use client";

import type { ReactNode } from "react";
import { MathEq } from "@/components/ui/MathDisplay";

/**
 * Shared building blocks for the worked-example walkthroughs (compound
 * interest, interest method, percentage, unit converter, financial,
 * algebra, root). Each page supplies its own step titles and math; the
 * step layout itself lives only here.
 */

export function Num({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

export function Var({ children }: { children: ReactNode }) {
  return <span className="italic">{children}</span>;
}

export function ExampleStep({
  title,
  math,
  stepId,
}: {
  title: string;
  math: ReactNode | ReactNode[];
  stepId: string;
}) {
  const lines = Array.isArray(math) ? math : [math];

  return (
    <div className="mt-2">
      <p className="font-semibold text-text-primary">{title}</p>
      {lines.map((line, index) => (
        <MathEq key={`${stepId}-${index}`}>{line}</MathEq>
      ))}
    </div>
  );
}
