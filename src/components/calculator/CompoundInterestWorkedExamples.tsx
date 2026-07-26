"use client";

import type { ReactNode } from "react";
import { MathEq, MathFraction, MathOp, MathPower } from "@/components/ui/MathDisplay";
import { SurfacePanel } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import { formatDisplayNumber, formatJapaneseUnits } from "@/lib/format";

function formatTemplate(template: string, ...values: string[]): string {
  return values.reduce((text, value, index) => text.replace(`{${index}}`, value), template);
}

function formatAmount(value: number): string {
  return Math.round(value).toLocaleString("ja-JP");
}

function Num({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

function Var({ children }: { children: ReactNode }) {
  return <span className="italic">{children}</span>;
}

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

export function CompoundInterestWorkedExamples({
  principal,
  rate,
  years,
  frequency,
}: {
  principal: string;
  rate: string;
  years: string;
  frequency: number;
}) {
  const { t } = useLocale();
  const page = t.compoundInterestPage;

  const p = parseFloat(principal);
  const ratePercent = parseFloat(rate);
  const y = parseFloat(years);
  const n = frequency;
  const isValid =
    Number.isFinite(p) &&
    Number.isFinite(ratePercent) &&
    Number.isFinite(y) &&
    Number.isFinite(n) &&
    p >= 0 &&
    y >= 0 &&
    n > 0;

  const r = ratePercent / 100;
  const rPerPeriod = r / n;
  const base = 1 + rPerPeriod;
  const exponents = n * y;
  const factor = Math.pow(base, exponents);
  const fv = p * factor;
  const interest = fv - p;

  const valuesKey = `${principal}|${rate}|${years}|${frequency}`;

  const frequencyLabel =
    n === 12
      ? t.compoundInterest.freqMonthly
      : n === 365
        ? t.compoundInterest.freqDaily
        : t.compoundInterest.freqYearly;

  return (
    <div className="mt-6">
      <SurfacePanel className="space-y-2">
        {!isValid ? (
          <p className="text-sm text-text-secondary sm:text-base">{t.common.invalidInput}</p>
        ) : (
          <>
            <div>
              <h3 className="font-bold text-text-primary">{page.scenarioTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
                {formatTemplate(
                  page.scenarioText,
                  formatJapaneseUnits(p),
                  formatDisplayNumber(ratePercent),
                  formatDisplayNumber(y),
                  frequencyLabel,
                )}
              </p>
            </div>

            <div key={valuesKey} className="space-y-2">
              <div>
                <h3 className="font-bold text-text-primary">{page.givenTitle}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary sm:text-base">
                  <li>
                    元本（<Var>P</Var>）= <Num>{formatAmount(p)}</Num>
                  </li>
                  <li>
                    年利（<Var>r</Var>）= <Num>{formatDisplayNumber(ratePercent)}</Num>% ={" "}
                    <Num>{formatDisplayNumber(r)}</Num>
                  </li>
                  <li>
                    複利の頻度（<Var>n</Var>）= <Num>{n}</Num>（{frequencyLabel}）
                  </li>
                  <li>
                    運用期間（<Var>t</Var>）= <Num>{formatDisplayNumber(y)}</Num>年
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-text-primary">{page.formulaTitle}</h3>
                <MathEq>
                  <Var>FV</Var> <MathOp op="=" /> <Var>P</Var> <MathOp op="×" />
                  <MathPower
                    base={
                      <>
                        1 <MathOp op="+" /> <MathFraction num="r" den="n" />
                      </>
                    }
                    exponent={
                      <>
                        <Var>n</Var> <MathOp op="×" /> <Var>t</Var>
                      </>
                    }
                  />
                </MathEq>
              </div>

              <ExampleStep
                stepId="ci-step1"
                title={page.step1Title}
                math={
                  <>
                    <Var>r</Var>/<Var>n</Var> <MathOp op="=" />{" "}
                    <MathFraction num={formatDisplayNumber(r)} den={formatDisplayNumber(n)} />{" "}
                    <MathOp op="=" /> <Num>{formatDisplayNumber(rPerPeriod)}</Num>
                  </>
                }
              />

              <ExampleStep
                stepId="ci-step2"
                title={page.step2Title}
                math={
                  <>
                    1 <MathOp op="+" /> <Num>{formatDisplayNumber(rPerPeriod)}</Num>{" "}
                    <MathOp op="=" /> <Num>{formatDisplayNumber(base)}</Num>
                  </>
                }
              />

              <ExampleStep
                stepId="ci-step3"
                title={page.step3Title}
                math={[
                  <>
                    <Var>n</Var> <MathOp op="×" /> <Var>t</Var> <MathOp op="=" />{" "}
                    <Num>{formatDisplayNumber(n)}</Num> <MathOp op="×" />{" "}
                    <Num>{formatDisplayNumber(y)}</Num> <MathOp op="=" />{" "}
                    <Num>{formatDisplayNumber(exponents)}</Num>
                  </>,
                  <>
                    <MathPower
                      base={formatDisplayNumber(base)}
                      exponent={formatDisplayNumber(exponents)}
                    />{" "}
                    <MathOp op="=" /> <Num>{formatDisplayNumber(factor, 5)}</Num>
                  </>,
                ]}
              />

              <ExampleStep
                stepId="ci-step4"
                title={page.step4Title}
                math={
                  <>
                    <Var>FV</Var> <MathOp op="=" /> <Num>{formatAmount(p)}</Num> <MathOp op="×" />{" "}
                    <Num>{formatDisplayNumber(factor, 5)}</Num>
                  </>
                }
              />

              <ExampleStep
                stepId="ci-step5"
                title={page.step5Title}
                math={
                  <>
                    <Var>FV</Var> <MathOp op="=" /> <Num>{formatAmount(fv)}</Num>
                  </>
                }
              />

              <ExampleStep
                stepId="ci-step6"
                title={page.step6Title}
                math={
                  <>
                    利息合計 <MathOp op="=" /> <Var>FV</Var> <MathOp op="−" /> <Var>P</Var>{" "}
                    <MathOp op="=" /> <Num>{formatAmount(fv)}</Num> <MathOp op="−" />{" "}
                    <Num>{formatAmount(p)}</Num> <MathOp op="=" />{" "}
                    <Num>{formatAmount(interest)}</Num>
                  </>
                }
              />

              <p className="mt-4 text-sm font-semibold text-text-primary sm:text-base">
                {page.resultLabel}:{" "}
                {formatTemplate(
                  page.resultText,
                  `${formatAmount(fv)}円`,
                  `${formatAmount(interest)}円`,
                )}
              </p>
            </div>
          </>
        )}
      </SurfacePanel>
    </div>
  );
}
