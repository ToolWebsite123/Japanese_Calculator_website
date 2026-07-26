"use client";

import { useState, type ReactNode } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { ButtonGuideTable } from "@/components/calculator/ButtonGuideTable";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import {
  ChipButton,
  Divider,
  PrimaryButton,
  SecondaryButton,
  SectionLabel,
  SegmentedControl,
  SurfacePanel,
} from "@/components/ui/primitives";
import { MathEq, MathOp, MathPower, MathRadical } from "@/components/ui/MathDisplay";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import {
  calculateRoot,
  ROOT_PRESETS,
  type RootMode,
  type RootResult,
} from "@/lib/calculators/root";
import { formatDisplayNumber } from "@/lib/format";
import { ROOT_BUTTON_GUIDE } from "@/lib/calculator-guides/root";

function formatTemplate(template: string, ...values: string[]): string {
  return values.reduce((text, value, index) => text.replace(`{${index}}`, value), template);
}

function Num({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

function ExampleStep({ title, math, stepId }: { title: string; math: ReactNode; stepId: string }) {
  return (
    <div className="mt-2">
      <p className="font-semibold text-text-primary">{title}</p>
      <MathEq key={stepId}>{math}</MathEq>
    </div>
  );
}

function productTerms(root: string, n: number): ReactNode {
  const parts: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    if (i > 0) parts.push(<MathOp key={`op-${i}`} op="×" />);
    parts.push(<Num key={`t-${i}`}>{root}</Num>);
  }
  return <>{parts}</>;
}

function tryCalculateNthRoot(
  radicand: number,
  index: number,
  invalidInput: string,
): { result: RootResult | null; error: string | null } {
  try {
    return { result: calculateRoot(radicand, index, "nth"), error: null };
  } catch (e) {
    return {
      result: null,
      error: e instanceof Error ? e.message : invalidInput,
    };
  }
}

function RootStepsPanel({
  result,
  title,
  step1Title,
  step2Title,
  step3Title,
  step4Title,
  step5Title,
  inputLabel,
}: {
  result: RootResult;
  title?: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  step5Title: string;
  inputLabel: string;
}) {
  const displayR = formatDisplayNumber(result.radicand);
  const exactRoot = result.isExact && result.exactText ? result.exactText : null;
  const approxRoot = formatDisplayNumber(result.value, 8);
  const index = result.index;

  return (
    <SurfacePanel className="space-y-2">
      {title && <h3 className="text-lg font-bold text-text-primary">{title}</h3>}
      <p className="font-semibold text-text-primary">{inputLabel}</p>
      <MathEq>
        <MathRadical index={index}>{displayR}</MathRadical>
        <MathOp op="=" />
        <MathPower base={displayR} exponent={{ num: 1, den: index }} />
      </MathEq>

      {exactRoot !== null ? (
        <>
          <ExampleStep
            stepId={`root-${index}-1`}
            title={step1Title}
            math={
              <>
                {productTerms(exactRoot, index)} <MathOp op="=" /> <Num>{displayR}</Num>
              </>
            }
          />
          <ExampleStep
            stepId={`root-${index}-2`}
            title={step2Title}
            math={
              <>
                <Num>{displayR}</Num> <MathOp op="=" />{" "}
                <MathPower base={exactRoot} exponent={index} />
              </>
            }
          />
          <ExampleStep
            stepId={`root-${index}-3`}
            title={step3Title}
            math={
              <>
                <MathPower base={displayR} exponent={{ num: 1, den: index }} />
                <MathOp op="=" />
                <MathPower
                  base={<MathPower base={exactRoot} exponent={index} />}
                  exponent={{ num: 1, den: index }}
                />
              </>
            }
          />
          <ExampleStep
            stepId={`root-${index}-4`}
            title={step4Title}
            math={
              <>
                <MathPower
                  base={<MathPower base={exactRoot} exponent={index} />}
                  exponent={{ num: 1, den: index }}
                />
                <MathOp op="=" />
                <MathPower
                  base={exactRoot}
                  exponent={{
                    factor: index,
                    fraction: { num: 1, den: index },
                  }}
                />
                <MathOp op="=" />
                <MathPower base={exactRoot} exponent={1} />
              </>
            }
          />
          <ExampleStep
            stepId={`root-${index}-5`}
            title={step5Title}
            math={
              <>
                <MathPower base={exactRoot} exponent={1} /> <MathOp op="=" /> <Num>{exactRoot}</Num>
              </>
            }
          />
        </>
      ) : (
        <>
          <ExampleStep
            stepId={`root-${index}-1`}
            title={step1Title}
            math={
              <>
                <MathRadical index={index}>{displayR}</MathRadical> <MathOp op="≈" />{" "}
                <Num>{approxRoot}</Num>
              </>
            }
          />
          <ExampleStep
            stepId={`root-${index}-2`}
            title={step2Title}
            math={
              <>
                <MathPower base={displayR} exponent={{ num: 1, den: index }} /> <MathOp op="≈" />{" "}
                <Num>{approxRoot}</Num>
              </>
            }
          />
          <ExampleStep
            stepId={`root-${index}-3`}
            title={step3Title}
            math={
              <>
                <MathPower base={approxRoot} exponent={index} /> <MathOp op="≈" />{" "}
                <Num>{displayR}</Num>
              </>
            }
          />
          <ExampleStep
            stepId={`root-${index}-4`}
            title={step4Title}
            math={
              <>
                <MathRadical index={index}>{displayR}</MathRadical> <MathOp op="≈" />{" "}
                <Num>{approxRoot}</Num>
              </>
            }
          />
          <ExampleStep
            stepId={`root-${index}-5`}
            title={step5Title}
            math={
              <>
                <MathRadical index={index}>{displayR}</MathRadical> <MathOp op="≈" />{" "}
                <Num>{approxRoot}</Num>
              </>
            }
          />
        </>
      )}
    </SurfacePanel>
  );
}

export function RootCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [mode, setMode] = useState<RootMode>("square");
  const [radicand, setRadicand] = useState("16");
  const [index, setIndex] = useState("3");
  const [result, setResult] = useState<RootResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate() {
    const r = parseFloat(radicand);
    const n = parseInt(index, 10);
    if (!Number.isFinite(r) || radicand.trim() === "") {
      setResult(null);
      setError(t.common.invalidInput);
      return;
    }
    try {
      const res = calculateRoot(r, n, mode);
      setResult(res);
      setError(null);
      addEntry({
        expression: res.index === 2 ? `√${res.radicand}` : `${res.index}√${res.radicand}`,
        result: formatDisplayNumber(res.value, 8),
        route: "/squareroot-calculator",
      });
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : t.common.invalidInput);
    }
  }

  function handleClear() {
    setMode("square");
    setRadicand("16");
    setIndex("3");
    setResult(null);
    setError(null);
  }

  function applyPreset(r: number, n: number) {
    setRadicand(String(r));
    setIndex(String(n));
    setMode(n === 2 ? "square" : "nth");
    setResult(null);
    setError(null);
  }

  const page = t.rootPage;
  const displayR = result
    ? formatDisplayNumber(result.radicand)
    : formatDisplayNumber(parseFloat(radicand) || 0);

  const cubePanel =
    result && mode === "nth"
      ? tryCalculateNthRoot(result.radicand, 3, t.common.invalidInput)
      : null;
  const fourthPanel =
    result && mode === "nth"
      ? tryCalculateNthRoot(result.radicand, 4, t.common.invalidInput)
      : null;
  const nthStepProps =
    result && mode === "nth"
      ? {
          step1Title: formatTemplate(page.step1Title, displayR),
          step2Title: page.step2Title,
          step3Title: page.step3Title,
          step4Title: page.step4Title,
          step5Title: page.step5Title,
        }
      : null;

  return (
    <>
      <CalculatorCard
        title={t.rootPage.title}
        description={t.rootPage.description}
        actions={
          result ? <CopyResultButton value={formatDisplayNumber(result.value, 8)} /> : undefined
        }
      >
        <div className="space-y-4">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            options={[
              { value: "square", label: t.root.squareRoot },
              { value: "nth", label: t.root.nthRoot },
            ]}
          />

          <FormField
            label={t.root.radicand}
            type="number"
            inputMode="decimal"
            value={radicand}
            onChange={(e) => setRadicand(e.target.value)}
          />

          {mode === "nth" && (
            <FormField
              label={t.root.index}
              type="number"
              inputMode="numeric"
              min={2}
              value={index}
              onChange={(e) => setIndex(e.target.value)}
            />
          )}

          <div>
            <SectionLabel>{t.root.presets}</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {ROOT_PRESETS.map((p) => (
                <ChipButton key={p.label} onClick={() => applyPreset(p.radicand, p.index)}>
                  {p.label}
                </ChipButton>
              ))}
            </div>
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
                  {page.answerHeading}
                </h3>
                <SurfacePanel className="flex items-center justify-center">
                  <MathEq>
                    <MathRadical index={result.index}>
                      {formatDisplayNumber(result.radicand)}
                    </MathRadical>
                    <MathOp op="=" />
                    <span>
                      {result.isExact && result.exactText
                        ? result.exactText
                        : formatDisplayNumber(result.value, 8)}
                    </span>
                  </MathEq>
                </SurfacePanel>
              </Divider>

              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {page.stepsHeading}
                </h3>
                <RootStepsPanel
                  result={result}
                  inputLabel={formatTemplate(page.rootInput, displayR, String(result.index))}
                  step1Title={formatTemplate(page.step1Title, displayR)}
                  step2Title={page.step2Title}
                  step3Title={page.step3Title}
                  step4Title={page.step4Title}
                  step5Title={page.step5Title}
                />
              </Divider>

              {mode === "nth" && cubePanel && fourthPanel && nthStepProps && (
                <div className="grid items-start gap-6 sm:grid-cols-2">
                  {cubePanel.result ? (
                    <RootStepsPanel
                      result={cubePanel.result}
                      title={page.cubeRootTitle}
                      inputLabel={formatTemplate(page.cubeRootInput, displayR)}
                      {...nthStepProps}
                    />
                  ) : (
                    <SurfacePanel className="space-y-2">
                      <h3 className="text-lg font-bold text-text-primary">{page.cubeRootTitle}</h3>
                      <p className="text-sm text-text-secondary sm:text-base">
                        {cubePanel.error ?? t.common.invalidInput}
                      </p>
                    </SurfacePanel>
                  )}

                  {fourthPanel.result ? (
                    <RootStepsPanel
                      result={fourthPanel.result}
                      title={page.fourthRootTitle}
                      inputLabel={formatTemplate(page.fourthRootInput, displayR)}
                      {...nthStepProps}
                    />
                  ) : (
                    <SurfacePanel className="space-y-2">
                      <h3 className="text-lg font-bold text-text-primary">
                        {page.fourthRootTitle}
                      </h3>
                      <p className="text-sm text-text-secondary sm:text-base">
                        {fourthPanel.error ?? t.common.invalidInput}
                      </p>
                    </SurfacePanel>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CalculatorCard>

      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.rootPage.introParagraph} />
      </p>

      <ButtonGuideTable title={t.rootPage.buttonGuideTitle} rows={ROOT_BUTTON_GUIDE} />

      <CalculatorFaqSection title={t.rootPage.faqTitle} items={t.rootPage.faqItems} />
      <RelatedCalculators activeHref="/squareroot-calculator" />
    </>
  );
}
