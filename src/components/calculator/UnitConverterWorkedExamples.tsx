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

export function UnitConverterWorkedExamples({
  value,
  fromLabel,
  toLabel,
  result,
}: {
  value: string;
  fromLabel: string;
  toLabel: string;
  result: string;
}) {
  const { t } = useLocale();
  const page = t.unitsPage;

  return (
    <div className="mt-6">
      <h2
        id="unit-converter-examples-heading"
        className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
      >
        {page.examplesTitle}
      </h2>

      <div className="mt-8">
        <SurfacePanel className="space-y-2">
          <h3 className="text-lg font-bold text-text-primary">
            {page.exampleTitle}
          </h3>

          <div>
            <h4 className="font-bold text-text-primary">{page.inputLabel}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary sm:text-base">
              <li>
                {page.valueLabel}: {value}
              </li>
              <li>
                {page.fromLabel}: {fromLabel}
              </li>
              <li>
                {page.toLabel}: {toLabel}
              </li>
            </ul>
          </div>

          <ExampleStep
            stepId="unit-step1"
            title={page.step1Title}
            math={
              <>
                <span>{value} {fromLabel}</span>
                <MathOp op="=" />
                <span>{result} {toLabel}</span>
              </>
            }
          />

          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel} = {result} {toLabel}
          </p>
        </SurfacePanel>
      </div>
    </div>
  );
}
