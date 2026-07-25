"use client";

import { useState, type ReactNode } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import {
  Divider,
  PrimaryButton,
  SecondaryButton,
  SegmentedControl,
  SurfacePanel,
} from "@/components/ui/primitives";
import { MathEq, MathFraction, MathOp } from "@/components/ui/MathDisplay";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import {
  evaluateExpressionSafe,
  solveLinearEquationSafe,
  type AlgebraMode,
} from "@/lib/calculators/algebra";
import { formatDisplayNumber } from "@/lib/format";

function formatTemplate(template: string, ...values: string[]): string {
  return values.reduce(
    (text, value, index) => text.replace(`{${index}}`, value),
    template
  );
}

function Num({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

function VarX() {
  return <span className="italic">x</span>;
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

function normalizeAlgebra(expr: string): string {
  return expr
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-");
}

/** Parse forms like 2x+3, -x-1, x+5, 2x */
function parseAxPlusB(
  expr: string
): { a: number; b: number; op: "+" | "-" } | null {
  const n = normalizeAlgebra(expr);
  const m = n.match(/^([+-]?(?:\d*\.?\d+)?)x([+-]\d*\.?\d+)?$/i);
  if (!m) return null;

  let a: number;
  if (m[1] === "" || m[1] === "+") a = 1;
  else if (m[1] === "-") a = -1;
  else a = parseFloat(m[1]);

  const b = m[2] === undefined ? 0 : parseFloat(m[2]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;

  const op: "+" | "-" = b < 0 ? "-" : "+";
  return { a, b: Math.abs(b), op };
}

/** Parse ax±b=c */
function parseLinearEquation(
  equation: string
): { a: number; b: number; c: number; op: "+" | "-" } | null {
  const cleaned = normalizeAlgebra(equation);
  const parts = cleaned.split("=");
  if (parts.length !== 2) return null;
  const left = parseAxPlusB(parts[0]);
  const c = parseFloat(parts[1]);
  if (!left || !Number.isFinite(c)) return null;
  return { a: left.a, b: left.b, c, op: left.op };
}

function fmt(n: number): string {
  return formatDisplayNumber(n, 8);
}

function AxTerm({ a }: { a: number }) {
  if (a === 1) return <VarX />;
  if (a === -1)
    return (
      <>
        −<VarX />
      </>
    );
  return (
    <>
      <Num>{fmt(a)}</Num>
      <VarX />
    </>
  );
}

function EvaluateSteps({
  expression,
  xValue,
  resultLabel,
  page,
}: {
  expression: string;
  xValue: string;
  resultLabel: string;
  page: {
    evaluateExampleInput: string;
    evaluateStep1Title: string;
    evaluateStep2Title: string;
    evaluateStep3Title: string;
  };
}) {
  const x = parseFloat(xValue);
  const linear = parseAxPlusB(expression);
  const result = evaluateExpressionSafe(expression, x);
  const product = linear ? linear.a * x : null;

  return (
    <SurfacePanel className="space-y-2">
      <p className="font-semibold text-text-primary">
        {formatTemplate(
          page.evaluateExampleInput,
          expression.trim(),
          xValue.trim()
        )}
      </p>

      <MathEq>
        <Num>{expression.trim()}</Num>
        <span className="mx-2 text-base text-text-secondary">
          （<VarX /> <MathOp op="=" /> <Num>{fmt(x)}</Num> のとき）
        </span>
      </MathEq>

      {linear ? (
        <>
          <ExampleStep
            stepId="eval-1"
            title={formatTemplate(page.evaluateStep1Title, fmt(x))}
            math={
              <>
                <Num>{fmt(linear.a)}</Num>(<Num>{fmt(x)}</Num>){" "}
                <MathOp op={linear.op} /> <Num>{fmt(linear.b)}</Num>
              </>
            }
          />
          <ExampleStep
            stepId="eval-2"
            title={page.evaluateStep2Title}
            math={
              <>
                <Num>{fmt(product!)}</Num> <MathOp op={linear.op} />{" "}
                <Num>{fmt(linear.b)}</Num>
              </>
            }
          />
          <ExampleStep
            stepId="eval-3"
            title={page.evaluateStep3Title}
            math={<Num>{fmt(result)}</Num>}
          />
        </>
      ) : (
        <>
          <ExampleStep
            stepId="eval-1"
            title={formatTemplate(page.evaluateStep1Title, fmt(x))}
            math={
              <>
                <Num>{expression.trim()}</Num>
                <span className="mx-2 text-base text-text-secondary">
                  （<VarX /> <MathOp op="=" /> <Num>{fmt(x)}</Num>）
                </span>
              </>
            }
          />
          <ExampleStep
            stepId="eval-2"
            title={page.evaluateStep2Title}
            math={<Num>{fmt(result)}</Num>}
          />
          <ExampleStep
            stepId="eval-3"
            title={page.evaluateStep3Title}
            math={<Num>{fmt(result)}</Num>}
          />
        </>
      )}

      <p className="mt-4 text-sm text-text-secondary sm:text-base">
        {resultLabel}: <Num>{fmt(result)}</Num>
      </p>
    </SurfacePanel>
  );
}

function SolveSteps({
  equation,
  resultLabel,
  page,
}: {
  equation: string;
  resultLabel: string;
  page: {
    solveExampleInput: string;
    solveStep1Title: string;
    solveStep2Title: string;
    solveStep3Title: string;
  };
}) {
  const parsed = parseLinearEquation(equation);
  const solution = solveLinearEquationSafe(equation);

  if (!parsed) {
    return (
      <SurfacePanel className="space-y-2">
        <p className="font-semibold text-text-primary">
          {formatTemplate(page.solveExampleInput, equation.trim())}
        </p>
        <ExampleStep
          stepId="solve-3"
          title={page.solveStep3Title}
          math={
            <>
              <VarX /> <MathOp op="=" /> <Num>{fmt(solution)}</Num>
            </>
          }
        />
        <p className="mt-4 text-sm text-text-secondary sm:text-base">
          {resultLabel}: <VarX /> <MathOp op="=" /> <Num>{fmt(solution)}</Num>
        </p>
      </SurfacePanel>
    );
  }

  const { a, b, c, op } = parsed;
  const signedB = op === "-" ? -b : b;
  const afterSubtract = c - signedB;

  return (
    <SurfacePanel className="space-y-2">
      <p className="font-semibold text-text-primary">
        {formatTemplate(page.solveExampleInput, equation.trim())}
      </p>

      <ExampleStep
        stepId="solve-1"
        title={formatTemplate(page.solveStep1Title, fmt(b))}
        math={[
          <>
            <AxTerm a={a} /> <MathOp op={op} /> <Num>{fmt(b)}</Num>{" "}
            <MathOp op="=" /> <Num>{fmt(c)}</Num>
          </>,
          <>
            <AxTerm a={a} /> <MathOp op="=" /> <Num>{fmt(c)}</Num>{" "}
            {signedB >= 0 ? (
              <>
                <MathOp op="−" /> <Num>{fmt(signedB)}</Num>
              </>
            ) : (
              <>
                <MathOp op="+" /> <Num>{fmt(-signedB)}</Num>
              </>
            )}
          </>,
          <>
            <AxTerm a={a} /> <MathOp op="=" />{" "}
            <Num>{fmt(afterSubtract)}</Num>
          </>,
        ]}
      />
      <ExampleStep
        stepId="solve-2"
        title={formatTemplate(page.solveStep2Title, fmt(a))}
        math={
          <>
            <VarX /> <MathOp op="=" />{" "}
            <MathFraction num={fmt(afterSubtract)} den={fmt(a)} />
          </>
        }
      />
      <ExampleStep
        stepId="solve-3"
        title={page.solveStep3Title}
        math={
          <>
            <VarX /> <MathOp op="=" /> <Num>{fmt(solution)}</Num>
          </>
        }
      />

      <p className="mt-4 text-sm text-text-secondary sm:text-base">
        {resultLabel}: <VarX /> <MathOp op="=" /> <Num>{fmt(solution)}</Num>
      </p>
    </SurfacePanel>
  );
}

export function AlgebraCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [mode, setMode] = useState<AlgebraMode>("evaluate");
  const [expression, setExpression] = useState("2x + 3");
  const [equation, setEquation] = useState("2x + 3 = 7");
  const [xValue, setXValue] = useState("5");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate() {
    try {
      let value: string;
      if (mode === "evaluate") {
        const x = parseFloat(xValue);
        const val = evaluateExpressionSafe(expression, x);
        value = formatDisplayNumber(val, 8);
        addEntry({
          expression: `${expression}, x=${xValue}`,
          result: value,
          route: "/algebra-calculator",
        });
      } else {
        const sol = solveLinearEquationSafe(equation);
        value = `x = ${formatDisplayNumber(sol, 8)}`;
        addEntry({
          expression: equation,
          result: value,
          route: "/algebra-calculator",
        });
      }
      setResult(value);
      setError(null);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : t.common.invalidInput);
    }
  }

  function handleClear() {
    setMode("evaluate");
    setExpression("2x + 3");
    setEquation("2x + 3 = 7");
    setXValue("5");
    setResult(null);
    setError(null);
  }

  const page = t.algebraPage;

  return (
    <>
      <CalculatorCard
        title={t.algebraPage.title}
        description={t.algebraPage.description}
        actions={result ? <CopyResultButton value={result} /> : undefined}
      >
        <div className="space-y-4">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            options={[
              { value: "evaluate", label: t.algebra.evaluate },
              { value: "solve", label: t.algebra.solve },
            ]}
          />

          {mode === "evaluate" ? (
            <>
              <FormField
                label={t.algebra.expression}
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder={t.algebra.placeholderExpr}
              />
              <FormField
                label={t.algebra.valueOfX}
                type="number"
                inputMode="decimal"
                value={xValue}
                onChange={(e) => setXValue(e.target.value)}
                placeholder={t.algebra.placeholderX}
              />
            </>
          ) : (
            <FormField
              label={t.algebra.equation}
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder={t.algebra.placeholderEq}
            />
          )}

          <div className="flex gap-4">
            <SecondaryButton fullWidth onClick={handleClear} className="flex-1">
              {t.common.clear}
            </SecondaryButton>
            <PrimaryButton
              onClick={handleCalculate}
              fullWidth
              className="flex-[2]"
            >
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
                    {mode === "evaluate" ? (
                      <Num>{result}</Num>
                    ) : (
                      <>
                        <VarX /> <MathOp op="=" />{" "}
                        <Num>{result.replace(/^x\s*=\s*/, "")}</Num>
                      </>
                    )}
                  </MathEq>
                </SurfacePanel>
              </Divider>

              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {page.stepsHeading}
                </h3>
                {mode === "evaluate" ? (
                  <EvaluateSteps
                    expression={expression}
                    xValue={xValue}
                    resultLabel={page.resultLabel}
                    page={page}
                  />
                ) : (
                  <SolveSteps
                    equation={equation}
                    resultLabel={page.resultLabel}
                    page={page}
                  />
                )}
              </Divider>
            </div>
          )}
        </div>
      </CalculatorCard>


      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.algebraPage.introParagraph} />
      </p>

      <CalculatorHowToSection
        title={t.algebraPage.howToTitle}
        steps={t.algebraPage.howToSteps}
      />

      <CalculatorFaqSection
        title={t.algebraPage.faqTitle}
        items={t.algebraPage.faqItems}
      />
      <RelatedCalculators activeHref="/algebra-calculator" />
        </>
  );
}
