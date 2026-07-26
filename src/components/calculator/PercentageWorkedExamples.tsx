"use client";

import type { ReactNode } from "react";
import { MathEq, MathFraction, MathOp } from "@/components/ui/MathDisplay";
import { SurfacePanel } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import { formatDisplayNumber } from "@/lib/format";

function formatTemplate(template: string, ...values: string[]): string {
  return values.reduce((text, value, index) => text.replace(`{${index}}`, value), template);
}

function formatAmount(value: number): string {
  return Math.round(value * 100) / 100 === Math.round(value)
    ? Math.round(value).toLocaleString("ja-JP")
    : formatDisplayNumber(value, 8);
}

function formatPercentResult(value: number): string {
  const rounded = Number(value.toFixed(2));
  const body = formatDisplayNumber(Math.abs(rounded), 8);
  if (rounded > 0) return `+${body}`;
  if (rounded < 0) return `-${body}`;
  return body;
}

function Num({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

function Var({ children }: { children: ReactNode }) {
  return <span className="italic">{children}</span>;
}

function ExampleStep({ title, math, stepId }: { title: string; math: ReactNode; stepId: string }) {
  return (
    <div className="mt-2">
      <p className="font-semibold text-text-primary">{title}</p>
      <MathEq key={stepId}>{math}</MathEq>
    </div>
  );
}

function DiscountExample({
  originalPrice,
  discountPercent,
  page,
  invalidInput,
}: {
  originalPrice: string;
  discountPercent: string;
  page: {
    exampleTitle: string;
    scenarioTitle: string;
    scenarioText: string;
    givenTitle: string;
    formulaTitle: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    step3MathLabel: string;
    resultLabel: string;
    resultText: string;
  };
  invalidInput: string;
}) {
  const y = parseFloat(originalPrice);
  const x = parseFloat(discountPercent);
  const isValid = Number.isFinite(y) && Number.isFinite(x) && y >= 0;

  const decimal = x / 100;
  const discount = y * decimal;
  const finalPrice = y - discount;
  const valuesKey = `${originalPrice}|${discountPercent}`;

  return (
    <SurfacePanel className="space-y-2">
      <h3 className="text-lg font-bold text-text-primary">{page.exampleTitle}</h3>

      {!isValid ? (
        <p className="text-sm text-text-secondary sm:text-base">{invalidInput}</p>
      ) : (
        <>
          <div>
            <h4 className="font-bold text-text-primary">{page.scenarioTitle}</h4>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
              {formatTemplate(page.scenarioText, formatAmount(y), formatDisplayNumber(x))}
            </p>
          </div>

          <div key={valuesKey} className="space-y-2">
            <div>
              <h4 className="font-bold text-text-primary">{page.givenTitle}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary sm:text-base">
                <li>
                  元の価格（<Var>Y</Var>）= <Num>{formatAmount(y)}</Num>
                </li>
                <li>
                  割引率（<Var>X</Var>）= <Num>{formatDisplayNumber(x)}</Num>%
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-text-primary">{page.formulaTitle}</h4>
              <MathEq>
                割引額 <MathOp op="=" /> <Var>Y</Var> <MathOp op="×" /> (<Var>X</Var>{" "}
                <MathOp op="/" /> 100)
              </MathEq>
            </div>

            <ExampleStep
              stepId="pct-d1"
              title={page.step1Title}
              math={
                <>
                  <MathFraction num={formatDisplayNumber(x)} den={100} /> <MathOp op="=" />{" "}
                  <Num>{formatDisplayNumber(decimal, 8)}</Num>
                </>
              }
            />

            <ExampleStep
              stepId="pct-d2"
              title={page.step2Title}
              math={
                <>
                  <Num>{formatAmount(y)}</Num> <MathOp op="×" />{" "}
                  <Num>{formatDisplayNumber(decimal, 8)}</Num> <MathOp op="=" />{" "}
                  <Num>{formatAmount(discount)}</Num>
                </>
              }
            />

            <ExampleStep
              stepId="pct-d3"
              title={page.step3Title}
              math={<>{formatTemplate(page.step3MathLabel, formatAmount(discount))}</>}
            />

            <ExampleStep
              stepId="pct-d4"
              title={page.step4Title}
              math={
                <>
                  <Num>{formatAmount(y)}</Num> <MathOp op="−" /> <Num>{formatAmount(discount)}</Num>{" "}
                  <MathOp op="=" /> <Num>{formatAmount(finalPrice)}</Num>
                </>
              }
            />

            <p className="mt-4 text-sm font-semibold text-text-primary sm:text-base">
              {page.resultLabel}:{" "}
              {formatTemplate(page.resultText, formatAmount(discount), formatAmount(finalPrice))}
            </p>
          </div>
        </>
      )}
    </SurfacePanel>
  );
}

function ProportionExample({
  proportionPart,
  proportionWhole,
  page,
  invalidInput,
}: {
  proportionPart: string;
  proportionWhole: string;
  page: {
    exampleTitleProportion: string;
    scenarioTitle: string;
    scenarioTextProportion: string;
    givenTitle: string;
    formulaTitle: string;
    proportionWholeLabel: string;
    proportionPartLabel: string;
    formulaProportion: string;
    proportionStep1Title: string;
    proportionStep2Title: string;
    proportionStep3Title: string;
    resultLabel: string;
    resultTextProportion: string;
  };
  invalidInput: string;
}) {
  const x = parseFloat(proportionPart);
  const y = parseFloat(proportionWhole);
  const isValid = Number.isFinite(x) && Number.isFinite(y) && y !== 0;

  const ratio = x / y;
  const percent = ratio * 100;
  const valuesKey = `${proportionPart}|${proportionWhole}`;
  const percentDisplay = formatDisplayNumber(Number(percent.toFixed(2)), 8);

  return (
    <SurfacePanel className="space-y-2">
      <h3 className="text-lg font-bold text-text-primary">{page.exampleTitleProportion}</h3>

      {!isValid ? (
        <p className="text-sm text-text-secondary sm:text-base">{invalidInput}</p>
      ) : (
        <>
          <div>
            <h4 className="font-bold text-text-primary">{page.scenarioTitle}</h4>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
              {formatTemplate(page.scenarioTextProportion, formatAmount(y), formatAmount(x))}
            </p>
          </div>

          <div key={valuesKey} className="space-y-2">
            <div>
              <h4 className="font-bold text-text-primary">{page.givenTitle}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary sm:text-base">
                <li>
                  {page.proportionWholeLabel} = <Num>{formatAmount(y)}</Num>
                </li>
                <li>
                  {page.proportionPartLabel} = <Num>{formatAmount(x)}</Num>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-text-primary">{page.formulaTitle}</h4>
              <MathEq>
                {page.formulaProportion} <MathOp op="=" /> (<Var>X</Var> <MathOp op="/" />{" "}
                <Var>Y</Var>) <MathOp op="×" /> 100
              </MathEq>
            </div>

            <ExampleStep
              stepId="pct-p1"
              title={page.proportionStep1Title}
              math={
                <>
                  <Var>X</Var> <MathOp op="/" /> <Var>Y</Var> <MathOp op="=" />{" "}
                  <Num>{formatAmount(x)}</Num> <MathOp op="/" /> <Num>{formatAmount(y)}</Num>{" "}
                  <MathOp op="=" /> <Num>{formatDisplayNumber(ratio, 8)}</Num>
                </>
              }
            />

            <ExampleStep
              stepId="pct-p2"
              title={page.proportionStep2Title}
              math={
                <>
                  <Num>{formatDisplayNumber(ratio, 8)}</Num> <MathOp op="×" /> 100 <MathOp op="=" />{" "}
                  <Num>{percentDisplay}</Num>
                </>
              }
            />

            <ExampleStep
              stepId="pct-p3"
              title={page.proportionStep3Title}
              math={
                <>
                  <Num>{percentDisplay}</Num>%
                </>
              }
            />

            <p className="mt-4 text-sm font-semibold text-text-primary sm:text-base">
              {page.resultLabel}: {formatTemplate(page.resultTextProportion, percentDisplay)}
            </p>
          </div>
        </>
      )}
    </SurfacePanel>
  );
}

function ChangeExample({
  changeFrom,
  changeTo,
  page,
  invalidInput,
}: {
  changeFrom: string;
  changeTo: string;
  page: {
    exampleTitleChange: string;
    scenarioTitle: string;
    scenarioTextChange: string;
    givenTitle: string;
    formulaTitle: string;
    changeFromLabel: string;
    changeToLabel: string;
    formulaChange: string;
    changeStep1Title: string;
    changeStep2Title: string;
    changeStep3Title: string;
    changeStep4Title: string;
    resultLabel: string;
    resultTextChange: string;
  };
  invalidInput: string;
}) {
  const x = parseFloat(changeFrom);
  const y = parseFloat(changeTo);
  const isValid = Number.isFinite(x) && Number.isFinite(y) && x !== 0;

  const diff = y - x;
  const absX = Math.abs(x);
  const quotient = diff / absX;
  const rate = quotient * 100;
  const valuesKey = `${changeFrom}|${changeTo}`;
  const rateDisplay = formatPercentResult(rate);

  return (
    <SurfacePanel className="space-y-2">
      <h3 className="text-lg font-bold text-text-primary">{page.exampleTitleChange}</h3>

      {!isValid ? (
        <p className="text-sm text-text-secondary sm:text-base">{invalidInput}</p>
      ) : (
        <>
          <div>
            <h4 className="font-bold text-text-primary">{page.scenarioTitle}</h4>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
              {formatTemplate(page.scenarioTextChange, formatAmount(x), formatAmount(y))}
            </p>
          </div>

          <div key={valuesKey} className="space-y-2">
            <div>
              <h4 className="font-bold text-text-primary">{page.givenTitle}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary sm:text-base">
                <li>
                  {page.changeFromLabel} = <Num>{formatAmount(x)}</Num>
                </li>
                <li>
                  {page.changeToLabel} = <Num>{formatAmount(y)}</Num>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-text-primary">{page.formulaTitle}</h4>
              <MathEq>
                {page.formulaChange} <MathOp op="=" /> ((<Var>Y</Var> <MathOp op="−" /> <Var>X</Var>
                ) <MathOp op="/" /> |<Var>X</Var>
                |) <MathOp op="×" /> 100
              </MathEq>
            </div>

            <ExampleStep
              stepId="pct-c1"
              title={page.changeStep1Title}
              math={
                <>
                  <Var>Y</Var> <MathOp op="−" /> <Var>X</Var> <MathOp op="=" />{" "}
                  <Num>{formatAmount(y)}</Num> <MathOp op="−" /> <Num>{formatAmount(x)}</Num>{" "}
                  <MathOp op="=" /> <Num>{formatAmount(diff)}</Num>
                </>
              }
            />

            <ExampleStep
              stepId="pct-c2"
              title={page.changeStep2Title}
              math={
                <>
                  <Num>{formatAmount(diff)}</Num> <MathOp op="/" /> <Num>{formatAmount(absX)}</Num>{" "}
                  <MathOp op="=" /> <Num>{formatDisplayNumber(quotient, 8)}</Num>
                </>
              }
            />

            <ExampleStep
              stepId="pct-c3"
              title={page.changeStep3Title}
              math={
                <>
                  <Num>{formatDisplayNumber(quotient, 8)}</Num> <MathOp op="×" /> 100{" "}
                  <MathOp op="=" /> <Num>{formatDisplayNumber(Number(rate.toFixed(2)), 8)}</Num>
                </>
              }
            />

            <ExampleStep
              stepId="pct-c4"
              title={page.changeStep4Title}
              math={
                <>
                  <Num>{rateDisplay}</Num>%
                </>
              }
            />

            <p className="mt-4 text-sm font-semibold text-text-primary sm:text-base">
              {page.resultLabel}: {formatTemplate(page.resultTextChange, rateDisplay)}
            </p>
          </div>
        </>
      )}
    </SurfacePanel>
  );
}

export function PercentageWorkedExamples({
  originalPrice,
  discountPercent,
  proportionPart,
  proportionWhole,
  changeFrom,
  changeTo,
}: {
  originalPrice: string;
  discountPercent: string;
  proportionPart: string;
  proportionWhole: string;
  changeFrom: string;
  changeTo: string;
}) {
  const { t } = useLocale();
  const page = t.percentagePage;

  return (
    <div className="mt-6 space-y-8">
      <DiscountExample
        originalPrice={originalPrice}
        discountPercent={discountPercent}
        page={page}
        invalidInput={t.common.invalidInput}
      />
      <ProportionExample
        proportionPart={proportionPart}
        proportionWhole={proportionWhole}
        page={page}
        invalidInput={t.common.invalidInput}
      />
      <ChangeExample
        changeFrom={changeFrom}
        changeTo={changeTo}
        page={page}
        invalidInput={t.common.invalidInput}
      />
    </div>
  );
}
