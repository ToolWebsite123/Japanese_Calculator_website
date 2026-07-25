"use client";

import type { ReactNode } from "react";
import { MathEq, MathOp, MathPower } from "@/components/ui/MathDisplay";
import { Divider, SurfacePanel } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import {
  formatDisplayNumber,
  formatJapaneseUnits,
} from "@/lib/format";

function formatTemplate(template: string, ...values: string[]): string {
  return values.reduce(
    (text, value, index) => text.replace(`{${index}}`, value),
    template
  );
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

function PartResult({ label, text }: { label: string; text: string }) {
  return (
    <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
      {label}: {text}
    </p>
  );
}

export function InterestMethodWorkedExamples({
  principal,
  rate,
  years,
}: {
  principal: string;
  rate: string;
  years: string;
}) {
  const { t } = useLocale();
  const page = t.interestMethodPage;

  const p = parseFloat(principal);
  const ratePercent = parseFloat(rate);
  const y = parseFloat(years);
  const isValid =
    Number.isFinite(p) &&
    Number.isFinite(ratePercent) &&
    Number.isFinite(y) &&
    p >= 0 &&
    y >= 0;

  const r = ratePercent / 100;
  const simpleFactorRt = r * y;
  const simpleFactor = 1 + simpleFactorRt;
  const simple = p * simpleFactor;
  const compoundBase = 1 + r;
  const compoundFactor = Math.pow(compoundBase, y);
  const compound = p * compoundFactor;
  const diff = compound - simple;

  const valuesKey = `${principal}|${rate}|${years}`;

  return (
    <div className="mt-6">
        <SurfacePanel className="space-y-2">
          <h3 className="text-lg font-bold text-text-primary">{page.exampleTitle}</h3>

          {!isValid ? (
            <p className="text-sm text-text-secondary sm:text-base">
              {t.common.invalidInput}
            </p>
          ) : (
            <>
              <div>
                <h4 className="font-bold text-text-primary">{page.scenarioTitle}</h4>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
                  {formatTemplate(
                    page.scenarioText,
                    formatJapaneseUnits(p),
                    formatDisplayNumber(ratePercent),
                    formatDisplayNumber(y)
                  )}
                </p>
              </div>

              <div key={valuesKey} className="space-y-2">
                <div>
                  <h4 className="font-bold text-text-primary">{page.givenTitle}</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary sm:text-base">
                    <li>
                      元本（<Var>P</Var>）= <Num>{formatAmount(p)}</Num>
                    </li>
                    <li>
                      年利（<Var>r</Var>）= <Num>{formatDisplayNumber(ratePercent)}</Num>% ={" "}
                      <Num>{formatDisplayNumber(r)}</Num>
                    </li>
                    <li>
                      運用期間（<Var>t</Var>）= <Num>{formatDisplayNumber(y)}</Num>年
                    </li>
                  </ul>
                </div>

                <Divider className="pt-2">
                  <h4 className="font-bold text-text-primary">{page.partATitle}</h4>
                  <p className="mt-2 font-bold text-text-primary">
                    {page.partAFormulaTitle}
                  </p>
                  <MathEq>
                    合計（単利） <MathOp op="=" /> <Var>P</Var>{" "}
                    <MathOp op="×" /> (1 <MathOp op="+" /> <Var>r</Var>{" "}
                    <MathOp op="×" /> <Var>t</Var>)
                  </MathEq>

                  <ExampleStep
                    stepId="im-a1"
                    title={page.partAStep1Title}
                    math={
                      <>
                        <Var>r</Var> <MathOp op="×" /> <Var>t</Var>{" "}
                        <MathOp op="=" /> <Num>{formatDisplayNumber(r)}</Num>{" "}
                        <MathOp op="×" /> <Num>{formatDisplayNumber(y)}</Num>{" "}
                        <MathOp op="=" />{" "}
                        <Num>{formatDisplayNumber(simpleFactorRt)}</Num>
                      </>
                    }
                  />
                  <ExampleStep
                    stepId="im-a2"
                    title={page.partAStep2Title}
                    math={
                      <>
                        1 <MathOp op="+" />{" "}
                        <Num>{formatDisplayNumber(simpleFactorRt)}</Num>{" "}
                        <MathOp op="=" />{" "}
                        <Num>{formatDisplayNumber(simpleFactor)}</Num>
                      </>
                    }
                  />
                  <ExampleStep
                    stepId="im-a3"
                    title={page.partAStep3Title}
                    math={
                      <>
                        合計（単利） <MathOp op="=" />{" "}
                        <Num>{formatAmount(p)}</Num> <MathOp op="×" />{" "}
                        <Num>{formatDisplayNumber(simpleFactor)}</Num>{" "}
                        <MathOp op="=" /> <Num>{formatAmount(simple)}</Num>
                      </>
                    }
                  />
                  <PartResult
                    label={page.partAResultLabel}
                    text={formatTemplate(
                      page.partAResultText,
                      `${formatAmount(simple)}円`
                    )}
                  />
                </Divider>

                <Divider className="pt-2">
                  <h4 className="font-bold text-text-primary">{page.partBTitle}</h4>
                  <p className="mt-2 font-bold text-text-primary">
                    {page.partBFormulaTitle}
                  </p>
                  <MathEq>
                    合計（複利） <MathOp op="=" /> <Var>P</Var>{" "}
                    <MathOp op="×" />
                    <MathPower
                      base={
                        <>
                          1 <MathOp op="+" /> <Var>r</Var>
                        </>
                      }
                      exponent={<Var>t</Var>}
                    />
                  </MathEq>

                  <ExampleStep
                    stepId="im-b1"
                    title={page.partBStep1Title}
                    math={
                      <>
                        1 <MathOp op="+" /> <Num>{formatDisplayNumber(r)}</Num>{" "}
                        <MathOp op="=" />{" "}
                        <Num>{formatDisplayNumber(compoundBase)}</Num>
                      </>
                    }
                  />
                  <ExampleStep
                    stepId="im-b2"
                    title={page.partBStep2Title}
                    math={
                      <>
                        <MathPower
                          base={formatDisplayNumber(compoundBase)}
                          exponent={formatDisplayNumber(y)}
                        />{" "}
                        <MathOp op="=" />{" "}
                        <Num>{formatDisplayNumber(compoundFactor, 5)}</Num>
                      </>
                    }
                  />
                  <ExampleStep
                    stepId="im-b3"
                    title={page.partBStep3Title}
                    math={
                      <>
                        合計（複利） <MathOp op="=" />{" "}
                        <Num>{formatAmount(p)}</Num> <MathOp op="×" />{" "}
                        <Num>{formatDisplayNumber(compoundFactor, 5)}</Num>{" "}
                        <MathOp op="=" /> <Num>{formatAmount(compound)}</Num>
                      </>
                    }
                  />
                  <PartResult
                    label={page.partBResultLabel}
                    text={formatTemplate(
                      page.partBResultText,
                      `${formatAmount(compound)}円`
                    )}
                  />
                </Divider>

                <Divider className="pt-2">
                  <h4 className="font-bold text-text-primary">{page.partCTitle}</h4>
                  <ExampleStep
                    stepId="im-c1"
                    title={page.partCStepTitle}
                    math={[
                      <>
                        差額 <MathOp op="=" /> 合計（複利） <MathOp op="−" />{" "}
                        合計（単利）
                      </>,
                      <>
                        差額 <MathOp op="=" />{" "}
                        <Num>{formatAmount(compound)}</Num> <MathOp op="−" />{" "}
                        <Num>{formatAmount(simple)}</Num> <MathOp op="=" />{" "}
                        <Num>{formatAmount(diff)}</Num>
                      </>,
                    ]}
                  />
                  <PartResult
                    label={page.partCResultLabel}
                    text={formatTemplate(
                      page.partCResultText,
                      formatDisplayNumber(y),
                      `${formatAmount(diff)}円`
                    )}
                  />
                </Divider>
              </div>
            </>
          )}
        </SurfacePanel>
    </div>
  );
}
