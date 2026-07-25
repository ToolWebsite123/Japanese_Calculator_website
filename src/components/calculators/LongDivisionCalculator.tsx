"use client";

import { useState } from "react";
import { CalculatorCard } from "@/components/ui/FormField";
import { FormField } from "@/components/ui/FormField";
import {
  Divider,
  PrimaryButton,
  SurfacePanel,
} from "@/components/ui/primitives";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { MathEq, MathOp } from "@/components/ui/MathDisplay";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { useLocale } from "@/context/LocaleContext";
import {
  getLongDivisionSteps,
  type LongDivisionStep,
} from "@/lib/calculators/longDivision";

function formatStepText(template: string, args?: (string | number)[]): string {
  if (!args) return template;
  return args.reduce<string>(
    (str, arg, i) => str.replace(`{${i}}`, String(arg)),
    template
  );
}

function RenderStep({
  step,
  stepTexts,
  resultLabel,
}: {
  step: LongDivisionStep;
  stepTexts: Record<string, string>;
  resultLabel: string;
}) {
  if (step.type === "text") {
    const template = step.textId ? stepTexts[step.textId] : "";
    const text = template ? formatStepText(template, step.args) : "";

    return (
      <p className="mb-2 mt-4 font-medium text-text-secondary">{text}</p>
    );
  }

  if (step.type === "equation") {
    return (
      <MathEq>
        <span>{step.dividend}</span>
        <MathOp op="÷" />
        <span>{step.divisor}</span>
        <MathOp op="=" />
        <span>{step.result}</span>
      </MathEq>
    );
  }

  if (step.type === "roundedValue") {
    return (
      <MathEq>
        <span>{step.value}</span>
      </MathEq>
    );
  }

  return null;
}

export function LongDivisionCalculator() {
  const { t } = useLocale();

  const [dividend, setDividend] = useState<string>("100");
  const [divisor, setDivisor] = useState<string>("3");
  const [decimalPlaces, setDecimalPlaces] = useState<string>("4");
  const [stepsResult, setStepsResult] = useState<ReturnType<
    typeof getLongDivisionSteps
  > | null>(null);
  const [stepsError, setStepsError] = useState<string | null>(null);

  const calculate = () => {
    const a = parseInt(dividend, 10);
    const b = parseInt(divisor, 10);

    if (isNaN(a) || isNaN(b)) {
      return { quotient: "—", remainder: "—", error: t.common.invalidInput };
    }
    if (b === 0) {
      return { quotient: "—", remainder: "—", error: t.common.invalidInput };
    }

    const quotient = Math.floor(a / b);
    const remainder = a % b;
    return {
      quotient: quotient.toString(),
      remainder: remainder.toString(),
      error: null,
    };
  };

  function handleCalculate() {
    try {
      const a = parseInt(dividend, 10);
      const b = parseInt(divisor, 10);
      const n = parseInt(decimalPlaces, 10);

      const result = getLongDivisionSteps(a, b, n);
      setStepsResult(result);
      setStepsError(null);
    } catch (e) {
      setStepsResult(null);
      setStepsError(e instanceof Error ? e.message : t.common.invalidInput);
    }
  }

  const { quotient, remainder, error } = calculate();

  return (
    <>
      <CalculatorCard
        title={t.longDivisionPage.title}
        description={t.longDivisionPage.description}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <FormField
                label={t.longDivision.dividend}
                type="number"
                value={dividend}
                onChange={(e) => setDividend(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center text-2xl font-bold text-text-tertiary">
              ÷
            </div>
            <div className="flex-1">
              <FormField
                label={t.longDivision.divisor}
                type="number"
                value={divisor}
                onChange={(e) => setDivisor(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          <FormField
            label={t.longDivisionPage.decimalPlacesLabel}
            type="number"
            min={0}
            value={decimalPlaces}
            onChange={(e) => setDecimalPlaces(e.target.value)}
            className="text-lg"
          />

          {error && <ErrorMessage message={error} />}

          {!error && (
            <SurfacePanel className="border-brand/20 bg-brand-muted">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium text-text-tertiary">
                    {t.longDivision.quotient}
                  </div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {quotient}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-text-tertiary">
                    {t.longDivision.remainder}
                  </div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                    {remainder}
                  </div>
                </div>
              </div>
            </SurfacePanel>
          )}

          <PrimaryButton onClick={handleCalculate}>
            {t.common.calculate}
          </PrimaryButton>

          {stepsError && <ErrorMessage message={stepsError} />}

          {stepsResult && (
            <div className="mt-8 space-y-6">
              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {t.longDivisionPage.answerHeading}
                </h3>
                <SurfacePanel className="flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-8 text-center">
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">
                        {t.longDivision.quotient}
                      </div>
                      <div className="tabular-display mt-2 text-2xl font-bold text-text-primary">
                        {stepsResult.quotient}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">
                        {t.longDivision.remainder}
                      </div>
                      <div className="tabular-display mt-2 text-2xl font-bold text-text-primary">
                        {stepsResult.remainder}
                      </div>
                    </div>
                  </div>
                </SurfacePanel>
              </Divider>

              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {t.longDivisionPage.stepsHeading}
                </h3>
                <SurfacePanel className="space-y-2">
                  <MathEq>
                    <span>{dividend}</span>
                    <MathOp op="÷" />
                    <span>{divisor}</span>
                    <MathOp op="= ?" />
                  </MathEq>

                  <div className="mt-6 w-full text-left">
                    {stepsResult.steps.map((step, idx) => (
                      <RenderStep
                        key={idx}
                        step={step}
                        stepTexts={t.longDivisionPage.stepTexts}
                        resultLabel={t.longDivisionPage.stepTexts.decimalResult}
                      />
                    ))}
                  </div>
                </SurfacePanel>
              </Divider>
            </div>
          )}
        </div>
      </CalculatorCard>


      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.longDivisionPage.introParagraph} />
      </p>

      <CalculatorHowToSection
        title={t.longDivisionPage.howToTitle}
        steps={t.longDivisionPage.howToSteps}
      />

      <CalculatorFaqSection
        title={t.longDivisionPage.faqTitle}
        items={t.longDivisionPage.faqItems}
      />
      <RelatedCalculators activeHref="/long-division-calculator" />
        </>
  );
}
