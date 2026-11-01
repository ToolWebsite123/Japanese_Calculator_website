"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import {
  Divider,
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
  return values.reduce((text, value, index) => text.replace(`{${index}}`, value), template);
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
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [mode, setMode] = useState<"simplify" | "evaluate" | "solve">("simplify");
  const [simplifyExpr, setSimplifyExpr] = useState("(x + 2)(x + 3)");
  const [expression, setExpression] = useState("2x + 3");
  const [equation, setEquation] = useState("2x + 3 = 7");
  const [xValue, setXValue] = useState("5");

  const computed = useMemo((): {
    result: string | null;
    simplify: SimplifyResult | null;
    logExpression: string | null;
    error: string | null;
  } => {
    try {
      if (mode === "simplify") {
        const s = simplifyExpression(simplifyExpr);
        return { result: s.result, simplify: s, logExpression: simplifyExpr, error: null };
      }
      if (mode === "evaluate") {
        const val = evaluateExpressionSafe(expression, parseFloat(xValue));
        return {
          result: formatDisplayNumber(val, 8),
          simplify: null,
          logExpression: `${expression}, x=${xValue}`,
          error: null,
        };
      }
      const sol = solveLinearEquationSafe(equation);
      return {
        result: `x = ${formatDisplayNumber(sol, 8)}`,
        simplify: null,
        logExpression: equation,
        error: null,
      };
    } catch (e) {
      return {
        result: null,
        simplify: null,
        logExpression: null,
        error: e instanceof Error ? e.message : t.common.invalidInput,
      };
    }
  }, [mode, simplifyExpr, expression, equation, xValue, t]);

  const result = computed.result;
  const error = computed.error;

  // Log to history once a calculation settles, not on every keystroke.
  const lastLogged = useRef<string | null>(null);
  useEffect(() => {
    if (!computed.result || !computed.logExpression) return;
    const key = `${mode}:${computed.logExpression}`;
    const timer = setTimeout(() => {
      if (lastLogged.current !== key) {
        lastLogged.current = key;
        addEntry({
          expression: computed.logExpression!,
          result: computed.result!,
          route: "/algebra-calculator",
        });
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [computed, mode, addEntry]);

  function handleClear() {
    setSimplifyExpr("");
    setExpression("");
    setEquation("");
    setXValue("");
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
                  <td className={tdClass}>{row[0]}</td>
                  <td className={tdClass}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  <td className={tdClass}>{row[0]}</td>
                  <td className={tdClass}>{row[1]}</td>
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
