"use client";

import { useState } from "react";
import { CalculatorCard } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { ButtonGuideTable } from "@/components/calculator/ButtonGuideTable";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import { MathFraction, MathEq, MathOp } from "@/components/ui/MathDisplay";
import { Divider, PrimaryButton, SecondaryButton, SurfacePanel } from "@/components/ui/primitives";
import { FRACTION_BUTTON_GUIDE } from "@/lib/calculator-guides/fraction";
import {
  formatFraction,
  fractionToDecimal,
  parseFractionInput,
  getFractionSteps,
  type Fraction,
  type FractionOp,
  type FractionStep,
} from "@/lib/calculators/fraction";

const OPS: { op: FractionOp; label: string }[] = [
  { op: "+", label: "+" },
  { op: "-", label: "−" },
  { op: "*", label: "×" },
  { op: "/", label: "÷" },
];

function formatStepText(template: string, args?: (string | number)[]): string {
  if (!args) return template;
  return args.reduce<string>((str, arg, i) => str.replace(`{${i}}`, String(arg)), template);
}

function FractionInputBox({
  whole,
  num,
  den,
  setWhole,
  setNum,
  setDen,
  wholeLabel,
  numLabel,
  denLabel,
}: {
  whole: string;
  num: string;
  den: string;
  setWhole: (v: string) => void;
  setNum: (v: string) => void;
  setDen: (v: string) => void;
  wholeLabel: string;
  numLabel: string;
  denLabel: string;
}) {
  const inputBase =
    "w-16 rounded-[var(--radius-sm)] border border-border bg-surface-raised px-2 py-1.5 text-center text-lg font-medium text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <SurfacePanel className="flex items-center gap-3">
      <input
        type="number"
        value={whole}
        onChange={(e) => setWhole(e.target.value)}
        className={`${inputBase} w-20 placeholder:text-text-tertiary`}
        placeholder={wholeLabel}
        aria-label={wholeLabel}
      />
      <div className="flex flex-col gap-2">
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className={inputBase}
          placeholder={numLabel}
          aria-label={numLabel}
        />
        <div className="h-[2px] w-full rounded-full bg-border" />
        <input
          type="number"
          value={den}
          onChange={(e) => setDen(e.target.value)}
          className={inputBase}
          placeholder={denLabel}
          aria-label={denLabel}
        />
      </div>
    </SurfacePanel>
  );
}

function RenderStep({
  step,
  stepTexts,
}: {
  step: FractionStep;
  stepTexts: Record<string, string>;
}) {
  if (step.type === "text") {
    const template = step.textId ? stepTexts[step.textId] : "";
    const text = template ? formatStepText(template, step.args) : "";

    return <p className="mb-2 mt-4 font-medium text-text-secondary">{text}</p>;
  }

  return (
    <MathEq>
      {step.items.map((item, i) => {
        if (typeof item === "string") return <MathOp key={i} op={item} />;
        if ("f" in item) return <MathFraction key={i} {...item.f} />;
        if ("combined" in item) {
          return (
            <div
              key={i}
              className="inline-flex flex-col items-center justify-center text-center mx-1 align-middle text-lg"
            >
              <span className="border-b-[1.5px] border-text-primary px-1 pb-[1px]">
                {item.combined.num1} {item.combined.op} {item.combined.num2}
              </span>
              <span className="px-1 pt-[1px]">
                {item.combined.den
                  ? item.combined.den
                  : `${item.combined.den1} × ${item.combined.den2}`}
              </span>
            </div>
          );
        }
        if ("formulaCombined" in item) {
          const { A, B, op } = item.formulaCombined;
          return (
            <div
              key={i}
              className="inline-flex flex-col items-center justify-center text-center mx-1 align-middle text-lg"
            >
              <span className="border-b-[1.5px] border-text-primary px-1 pb-[1px]">
                ({A.num} × {B.den}) {op} ({B.num} × {A.den})
              </span>
              <span className="px-1 pt-[1px]">
                {A.den} × {B.den}
              </span>
            </div>
          );
        }
        return null;
      })}
    </MathEq>
  );
}

export function FractionCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();

  const [aWhole, setAWhole] = useState("");
  const [aNum, setANum] = useState("-3");
  const [aDen, setADen] = useState("4");
  const [bWhole, setBWhole] = useState("");
  const [bNum, setBNum] = useState("-5");
  const [bDen, setBDen] = useState("8");
  const [op, setOp] = useState<FractionOp>("+");

  const [result, setResult] = useState<{
    formatted: string;
    decimal: number;
    stepsData: {
      steps: FractionStep[];
      formulaSteps?: FractionStep[];
      finalResult: Fraction;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate() {
    try {
      const fa = parseFractionInput(aWhole, aNum, aDen);
      const fb = parseFractionInput(bWhole, bNum, bDen);

      const stepsData = getFractionSteps(fa, fb, op);
      const formatted = formatFraction(stepsData.finalResult);
      const decimal = fractionToDecimal(stepsData.finalResult);

      setResult({ formatted, decimal, stepsData });
      setError(null);
      addEntry({
        expression: `${formatFraction(fa)} ${op} ${formatFraction(fb)}`,
        result: formatted,
        route: "/fraction-calculator",
      });
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : t.common.invalidInput);
    }
  }

  function handleClear() {
    setAWhole("");
    setANum("");
    setADen("");
    setBWhole("");
    setBNum("");
    setBDen("");
    setResult(null);
    setError(null);
  }

  const inputLabels = {
    wholeLabel: t.fraction.whole,
    numLabel: t.fraction.numerator,
    denLabel: t.fraction.denominator,
  };

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.fractionPage.title}
      </h1>
      <CalculatorCard
        compact
        maxWidthClass="max-w-[500px]"
        actions={result ? <CopyResultButton value={result.formatted} /> : undefined}
      >
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
            <FractionInputBox
              whole={aWhole}
              num={aNum}
              den={aDen}
              setWhole={setAWhole}
              setNum={setANum}
              setDen={setADen}
              {...inputLabels}
            />

            <div className="flex flex-row gap-1 rounded-[var(--radius-md)] border border-border bg-surface-sunken p-1.5 md:flex-col">
              {OPS.map(({ op: o, label }) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOp(o)}
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] text-2xl transition-all",
                    op === o
                      ? "bg-gradient-to-b from-brand to-brand-hover font-bold text-white"
                      : "text-text-secondary hover:bg-border-subtle",
                  ].join(" ")}
                  style={op === o ? { boxShadow: "var(--shadow-brand)" } : undefined}
                >
                  {label}
                </button>
              ))}
            </div>

            <FractionInputBox
              whole={bWhole}
              num={bNum}
              den={bDen}
              setWhole={setBWhole}
              setNum={setBNum}
              setDen={setBDen}
              {...inputLabels}
            />
          </div>

          <div className="flex gap-4">
            <SecondaryButton fullWidth onClick={handleClear} className="flex-1">
              {t.common.clear}
            </SecondaryButton>
            <PrimaryButton onClick={handleCalculate} fullWidth className="flex-[2]">
              {t.common.calculate}
            </PrimaryButton>
          </div>

          {error && <ErrorMessage message={error} />}

          {result && (
            <div className="mt-8 space-y-6">
              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {t.fraction.answerHeading}
                </h3>
                <SurfacePanel className="flex items-center justify-center">
                  <MathEq>
                    <MathFraction whole={aWhole} num={aNum} den={aDen} />
                    <MathOp op={op === "*" ? "×" : op === "/" ? "÷" : op} />
                    <MathFraction whole={bWhole} num={bNum} den={bDen} />
                    <MathOp op="=" />
                    <MathFraction {...result.stepsData.finalResult} />
                  </MathEq>
                </SurfacePanel>
              </Divider>

              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {t.fraction.stepsHeading}
                </h3>
                <SurfacePanel className="space-y-2">
                  <MathEq>
                    <MathFraction whole={aWhole} num={aNum} den={aDen} />
                    <MathOp op={op === "*" ? "×" : op === "/" ? "÷" : op} />
                    <MathFraction whole={bWhole} num={bNum} den={bDen} />
                    <MathOp op="= ?" />
                  </MathEq>

                  <div className="mt-6 text-left w-full">
                    {result.stepsData.steps.map((step, idx) => (
                      <RenderStep key={idx} step={step} stepTexts={t.fraction.stepTexts} />
                    ))}
                  </div>
                </SurfacePanel>
              </Divider>

              {result.stepsData.formulaSteps && (
                <Divider>
                  <h3 className="mb-4 text-xl font-semibold text-text-primary">
                    {t.fraction.formulaHeading}
                  </h3>
                  <SurfacePanel className="space-y-2">
                    <div className="mt-2 text-left w-full">
                      {result.stepsData.formulaSteps.map((step, idx) => (
                        <RenderStep key={idx} step={step} stepTexts={t.fraction.stepTexts} />
                      ))}
                    </div>
                  </SurfacePanel>
                </Divider>
              )}
            </div>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.fractionPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.fractionPage.introParagraph} />
      </p>

      <ButtonGuideTable title={t.fractionPage.buttonGuideTitle} rows={FRACTION_BUTTON_GUIDE} />

      <CalculatorFaqSection title={t.fractionPage.faqTitle} items={t.fractionPage.faqItems} />
      <RelatedCalculators activeHref="/fraction-calculator" />
    </>
  );
}
