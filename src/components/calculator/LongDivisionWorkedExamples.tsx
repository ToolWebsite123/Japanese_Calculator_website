"use client";

import type { ReactNode } from "react";
import { MathEq, MathOp } from "@/components/ui/MathDisplay";
import { SurfacePanel } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";

function ExampleStep({
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

export function LongDivisionWorkedExamples() {
  const { t } = useLocale();
  const page = t.longDivisionPage;

  return (
    <section
      aria-labelledby="long-division-examples-heading"
      className="mt-16 border-t border-border pt-16"
    >
      <h2
        id="long-division-examples-heading"
        className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
      >
        {page.examplesTitle}
      </h2>

      <div className="mt-8">
        <SurfacePanel className="space-y-2">
          <h3 className="text-lg font-bold text-text-primary">{page.exampleTitle}</h3>

          <div>
            <h4 className="font-bold text-text-primary">{page.inputLabel}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary sm:text-base">
              <li>{page.dividendLabel}: 100</li>
              <li>{page.divisorLabel}: 3</li>
              <li>{page.decimalPlacesLabel}: 4</li>
            </ul>
          </div>

          <ExampleStep
            stepId="ld-step1"
            title={page.step1Title}
            math={
              <>
                <span>100</span>
                <MathOp op="÷" />
                <span>3</span>
                <MathOp op="=" />
                <span>33.333333…</span>
              </>
            }
          />

          <ExampleStep
            stepId="ld-step2"
            title={page.step2Title}
            math={
              <>
                <span>33.3333</span>
              </>
            }
          />

          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel}: 33.3333
          </p>
        </SurfacePanel>
      </div>
    </section>
  );
}
