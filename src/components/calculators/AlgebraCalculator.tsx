"use client";

import { useState, type ReactNode } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import Link from "@/compat/next-link";
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
import { algebra, algebraPage } from "@/lib/i18n/pages/algebra";
import { useHistory } from "@/context/HistoryContext";
import {
  evaluateExpressionSafe,
  solveLinearEquationSafe,
} from "@/lib/calculators/algebra";
import {
  simplifyExpression,
  type SimplifyResult,
} from "@/lib/calculators/polynomial";
import { formatDisplayNumber } from "@/lib/format";

const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";
const tableWrapClass = "mt-4 overflow-x-auto";
const tableClass = "w-full border-collapse text-sm sm:text-base";
const thClass = "border-b border-border bg-surface-sunken px-3 py-2.5 text-left font-semibold text-text-primary";
const tdClass = "border-b border-border px-3 py-2.5 text-text-secondary";

function formatTemplate(template: string, ...values: string[]): string {
  return values.reduce((text, value, index) => text.replaceAll(`{${index}}`, value), template);
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
  return expr.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
}

/** Parse forms like 2x+3, -x-1, x+5, 2x */
function parseAxPlusB(expr: string): { a: number; b: number; op: "+" | "-" } | null {
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
  equation: string,
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
        {formatTemplate(page.evaluateExampleInput, expression.trim(), xValue.trim())}
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
                <Num>{fmt(linear.a)}</Num>(<Num>{fmt(x)}</Num>) <MathOp op={linear.op} />{" "}
                <Num>{fmt(linear.b)}</Num>
              </>
            }
          />
          <ExampleStep
            stepId="eval-2"
            title={page.evaluateStep2Title}
            math={
              <>
                <Num>{fmt(product!)}</Num> <MathOp op={linear.op} /> <Num>{fmt(linear.b)}</Num>
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
            <AxTerm a={a} /> <MathOp op={op} /> <Num>{fmt(b)}</Num> <MathOp op="=" />{" "}
            <Num>{fmt(c)}</Num>
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
            <AxTerm a={a} /> <MathOp op="=" /> <Num>{fmt(afterSubtract)}</Num>
          </>,
        ]}
      />
      <ExampleStep
        stepId="solve-2"
        title={formatTemplate(page.solveStep2Title, fmt(a))}
        math={
          <>
            <VarX /> <MathOp op="=" /> <MathFraction num={fmt(afterSubtract)} den={fmt(a)} />
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

function SimplifySteps({ input, data }: { input: string; data: SimplifyResult }) {
  const steps = data.expansionSteps.filter(
    (s, i) => !(i === data.expansionSteps.length - 1 && s === data.result),
  );
  return (
    <SurfacePanel className="space-y-2">
      <p className="font-semibold text-text-primary">{input.trim()}</p>
      {steps.map((line) => (
        <p key={line} className="text-sm text-text-secondary sm:text-base">
          ＝ {line}
          <span className="ml-2 text-xs text-text-tertiary">（展開）</span>
        </p>
      ))}
      <p className="text-sm text-text-secondary sm:text-base">
        ＝ <strong className="text-text-primary">{data.result}</strong>
        {steps.length > 0 && (
          <span className="ml-2 text-xs text-text-tertiary">（同類項をまとめる）</span>
        )}
      </p>
    </SurfacePanel>
  );
}

export function AlgebraCalculator() {
  const { t: core } = useLocale();
  const t = { ...core, algebra, algebraPage };
  const { addEntry } = useHistory();
  const [mode, setMode] = useState<"simplify" | "evaluate" | "solve">("simplify");
  const [simplifyExpr, setSimplifyExpr] = useState("(x + 2)(x + 3)");
  const [expression, setExpression] = useState("2x + 3");
  const [equation, setEquation] = useState("2x + 3 = 7");
  const [xValue, setXValue] = useState("5");

  // Result appears only after the user presses 計算する (site-wide
  // pattern, same as the BMI calculator). The state snapshots the
  // mode it was calculated in, so switching modes never shows a
  // result that belongs to another mode.
  const [computed, setComputed] = useState<{
    result: string | null;
    simplify: SimplifyResult | null;
    logExpression: string | null;
    error: string | null;
    forMode: "simplify" | "evaluate" | "solve" | null;
  }>({ result: null, simplify: null, logExpression: null, error: null, forMode: null });

  const result = computed.forMode === mode ? computed.result : null;
  const error = computed.forMode === mode ? computed.error : null;

  function handleCalculate() {
    try {
      let next: Omit<typeof computed, "forMode">;
      if (mode === "simplify") {
        const s = simplifyExpression(simplifyExpr);
        next = { result: s.result, simplify: s, logExpression: simplifyExpr, error: null };
      } else if (mode === "evaluate") {
        const val = evaluateExpressionSafe(expression, parseFloat(xValue));
        next = {
          result: formatDisplayNumber(val, 8),
          simplify: null,
          logExpression: `${expression}, x=${xValue}`,
          error: null,
        };
      } else {
        const sol = solveLinearEquationSafe(equation);
        next = {
          result: `x = ${formatDisplayNumber(sol, 8)}`,
          simplify: null,
          logExpression: equation,
          error: null,
        };
      }
      setComputed({ ...next, forMode: mode });
      if (next.result && next.logExpression) {
        addEntry({
          expression: next.logExpression,
          result: next.result,
          route: "/algebra-calculator",
        });
      }
    } catch (e) {
      setComputed({
        result: null,
        simplify: null,
        logExpression: null,
        error: e instanceof Error ? e.message : t.common.invalidInput,
        forMode: mode,
      });
    }
  }

  function handleClear() {
    setSimplifyExpr("");
    setExpression("");
    setEquation("");
    setXValue("");
    setComputed({ result: null, simplify: null, logExpression: null, error: null, forMode: null });
  }

  const page = t.algebraPage;

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.algebraPage.title}
      </h1>
      <CalculatorCard
        actions={result ? <CopyResultButton value={result} /> : undefined}
      >
        <div className="space-y-4">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            options={[
              { value: "simplify", label: t.algebra.simplify },
              { value: "evaluate", label: t.algebra.evaluate },
              { value: "solve", label: t.algebra.solve },
            ]}
          />

          {mode === "simplify" && (
            <FormField
              label={t.algebra.expression}
              type="text"
              value={simplifyExpr}
              onChange={(e) => setSimplifyExpr(e.target.value)}
              placeholder="例: (x + 2)(x + 3)"
            />
          )}
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
          ) : mode === "solve" ? (
            <FormField
              label={t.algebra.equation}
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder={t.algebra.placeholderEq}
            />
          ) : null}

          <PrimaryButton fullWidth onClick={handleCalculate}>
            {t.common.calculate}
          </PrimaryButton>

          <SecondaryButton fullWidth onClick={handleClear}>
            {t.common.clear}
          </SecondaryButton>

          {error && <ErrorMessage message={error} />}

          {result && (
            <div className="mt-8 space-y-6">
              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {page.answerHeading}
                </h3>
                <SurfacePanel className="flex items-center justify-center">
                  <MathEq>
                    {mode === "solve" ? (
                      <>
                        <VarX /> <MathOp op="=" /> <Num>{result.replace(/^x\s*=\s*/, "")}</Num>
                      </>
                    ) : (
                      <Num>{result}</Num>
                    )}
                  </MathEq>
                </SurfacePanel>
              </Divider>

              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {page.stepsHeading}
                </h3>
                {mode === "simplify" && computed.simplify ? (
                  <SimplifySteps input={simplifyExpr} data={computed.simplify} />
                ) : mode === "evaluate" ? (
                  <EvaluateSteps
                    expression={expression}
                    xValue={xValue}
                    resultLabel={page.resultLabel}
                    page={page}
                  />
                ) : (
                  <SolveSteps equation={equation} resultLabel={page.resultLabel} page={page} />
                )}
              </Divider>
            </div>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.algebraPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.algebraPage.introParagraph} />
      </p>

      <section aria-labelledby="algebra-formula-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="algebra-formula-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.algebraPage.formulaTitle}
        </h2>
        {t.algebraPage.formulaLines.map((line) => (
          <p key={line} className={guideBodyClass}>
            {line}
          </p>
        ))}
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>展開する式</th>
                <th scope="col" className={thClass}>展開した結果</th>
              </tr>
            </thead>
            <tbody>
              {t.algebraPage.formulaTableRows.map((row) => (
                <tr key={row[0]}>
                  <td data-label="展開する式" className={tdClass}>{row[0]}</td>
                  <td data-label="展開した結果" className={tdClass}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={guideBodyClass}>
          連立方程式の計算には、専用の
          <Link
            href="/simultaneous-equations-calculator"
            className="text-brand underline underline-offset-2 hover:text-brand/80 dark:text-[#d6ccf0] dark:hover:text-[#d6ccf0]/80"
          >
            連立方程式計算機
          </Link>
          が便利です。
        </p>
      </section>

      <section aria-labelledby="algebra-examples-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="algebra-examples-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.algebraPage.guideExamplesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.algebraPage.guideExamples.map((ex) => (
            <li key={ex} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {ex}
            </li>
          ))}
        </ul>
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>計算</th>
                <th scope="col" className={thClass}>答え</th>
              </tr>
            </thead>
            <tbody>
              {t.algebraPage.examplesTableRows.map((row) => (
                <tr key={row[0]}>
                  <td data-label="計算" className={tdClass}>{row[0]}</td>
                  <td data-label="答え" className={tdClass}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="algebra-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="algebra-mistakes-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.algebraPage.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.algebraPage.guideMistakes.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={t.algebraPage.howToTitle} steps={t.algebraPage.howToSteps} />

      <CalculatorFaqSection title={t.algebraPage.faqTitle} items={t.algebraPage.faqItems} />
      <RelatedCalculators activeHref="/algebra-calculator" />
    </>
  );
}
