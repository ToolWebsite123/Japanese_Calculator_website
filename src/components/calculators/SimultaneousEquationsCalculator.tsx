"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorCard } from "@/components/ui/FormField";
import {
  Divider,
  InputWell,
  SecondaryButton,
  SegmentedControl,
  SurfacePanel,
} from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import {
  cramerNumerators3,
  eliminationSteps,
  equationText,
  fractionText,
  solveExactFractions,
  solveSimultaneous3,
  solveSimultaneousEquations,
  type Fraction,
} from "@/lib/calculators/simultaneous-equations";

const coeffInputClass =
  "w-full rounded-[var(--radius-sm)] border border-border bg-surface-raised px-3 py-2 text-center text-lg text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";
const tableWrapClass = "mt-4 overflow-x-auto";
const tableClass = "w-full border-collapse text-sm sm:text-base";
const thClass =
  "border-b border-border bg-surface-sunken px-3 py-2.5 text-left font-semibold text-text-primary";
const tdClass = "border-b border-border px-3 py-2.5 text-text-secondary";
const sectionH2Class =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const sectionClass = "mt-16 border-t border-border pt-16";

function disp(v: number): string {
  return Number.isInteger(v) ? `${v}` : `${Math.round(v * 10000) / 10000}`;
}

function answerText(frac: Fraction | null, value: number): string {
  if (!frac) return disp(value);
  if (frac.den === 1) return `${frac.num}`;
  return `${frac.num}/${frac.den}（約${disp(value)}）`;
}

function EquationRow({
  label,
  values,
  setters,
  labels,
  vars,
}: {
  label: string;
  values: string[];
  setters: ((v: string) => void)[];
  labels: string[];
  vars: string[];
}) {
  const coeffs = values.slice(0, vars.length);
  const constant = values[vars.length];
  return (
    <SurfacePanel>
      <div className="mb-3 block text-sm font-semibold text-text-primary">{label}</div>
      <div className="flex items-center gap-2">
        {coeffs.map((v, i) => (
          <span key={vars[i]} className="flex flex-1 items-center gap-2">
            {i > 0 && <span className="text-lg font-medium text-text-secondary">+</span>}
            <InputWell
              type="number"
              value={v}
              onChange={(e) => setters[i](e.target.value)}
              className={coeffInputClass}
              aria-label={labels[i]}
            />
            <span className="text-lg font-medium text-text-secondary">{vars[i]}</span>
          </span>
        ))}
        <span className="text-lg font-medium text-text-secondary">=</span>
        <span className="flex-1">
          <InputWell
            type="number"
            value={constant}
            onChange={(e) => setters[vars.length](e.target.value)}
            className={coeffInputClass}
            aria-label={labels[vars.length]}
          />
        </span>
      </div>
    </SurfacePanel>
  );
}

export function SimultaneousEquationsCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [vars, setVars] = useState<"2" | "3">("2");

  // 2-variable state: [a, b, c] per equation.
  const [eq1, setEq1] = useState<string[]>(["2", "3", "8"]);
  const [eq2, setEq2] = useState<string[]>(["5", "-1", "3"]);
  // 3-variable state: [a, b, c, k] per equation.
  const [eq31, setEq31] = useState<string[]>(["1", "1", "1", "6"]);
  const [eq32, setEq32] = useState<string[]>(["2", "1", "1", "7"]);
  const [eq33, setEq33] = useState<string[]>(["1", "2", "1", "8"]);

  const setterFor =
    (setEq: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    (v: string) =>
      setEq((prev) => prev.map((p, i) => (i === idx ? v : p)));

  const computed2 = useMemo(() => {
    const [a, b, c] = eq1.map((v) => parseFloat(v));
    const [d, e, f] = eq2.map((v) => parseFloat(v));
    if ([a, b, c, d, e, f].some((v) => Number.isNaN(v))) {
      return { status: "invalid" as const };
    }
    const solved = solveSimultaneousEquations(a, b, c, d, e, f);
    if (solved.status !== "success") return { status: solved.status };
    const exact = solveExactFractions(a, b, c, d, e, f);
    return {
      status: "success" as const,
      xText: answerText(exact?.x ?? null, solved.x),
      yText: answerText(exact?.y ?? null, solved.y),
      elimSteps: eliminationSteps(a, b, c, d, e, f),
      cramer: { a, b, c, d, e, f, D: solved.determinant, Dx: solved.dx, Dy: solved.dy },
      logExpression: `${equationText(a, b, c)} / ${equationText(d, e, f)}`,
    };
  }, [eq1, eq2]);

  const computed3 = useMemo(() => {
    const rows = [eq31, eq32, eq33].map((r) => r.map((v) => parseFloat(v)));
    if (rows.some((r) => r.some((v) => Number.isNaN(v)))) {
      return { status: "invalid" as const };
    }
    const typed = rows as [number, number, number, number][];
    const solved = solveSimultaneous3(typed);
    if (solved.status !== "success") return { status: solved.status };
    const nums = cramerNumerators3(typed);
    return {
      status: "success" as const,
      xText: fractionText(solved.x),
      yText: fractionText(solved.y),
      zText: fractionText(solved.z),
      det: fractionText(solved.determinant),
      dx: fractionText(nums.dx),
      dy: fractionText(nums.dy),
      dz: fractionText(nums.dz),
      equations: typed.map(
        (r) => `${r[0]}x + ${r[1]}y + ${r[2]}z = ${r[3]}`,
      ),
      logExpression: typed
        .map((r) => `${r[0]}x + ${r[1]}y + ${r[2]}z = ${r[3]}`)
        .join(" / "),
    };
  }, [eq31, eq32, eq33]);

  const active = vars === "2" ? computed2 : computed3;
  const copyValue =
    active.status === "success"
      ? vars === "2"
        ? `x = ${computed2.status === "success" ? computed2.xText : ""}, y = ${computed2.status === "success" ? computed2.yText : ""}`
        : `x = ${computed3.status === "success" ? computed3.xText : ""}, y = ${computed3.status === "success" ? computed3.yText : ""}, z = ${computed3.status === "success" ? computed3.zText : ""}`
      : undefined;

  // Log to history once a result settles.
  const lastLogged = useRef<string | null>(null);
  useEffect(() => {
    if (active.status !== "success") return;
    const logExpression = vars === "2"
      ? computed2.status === "success" ? computed2.logExpression : null
      : computed3.status === "success" ? computed3.logExpression : null;
    if (!logExpression || !copyValue) return;
    const key = `${vars}:${logExpression}`;
    const timer = setTimeout(() => {
      if (lastLogged.current !== key) {
        lastLogged.current = key;
        addEntry({ expression: logExpression, result: copyValue, route: "/simultaneous-equations-calculator" });
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [active, vars, computed2, computed3, copyValue, addEntry]);

  function handleClear() {
    if (vars === "2") {
      setEq1(["", "", ""]);
      setEq2(["", "", ""]);
    } else {
      setEq31(["", "", "", ""]);
      setEq32(["", "", "", ""]);
      setEq33(["", "", "", ""]);
    }
  }

  const page = t.simultaneousEquationsPage;
  const labels = t.simultaneousEquations;

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {page.title}
      </h1>
      <CalculatorCard
        compact
        actions={copyValue ? <CopyResultButton value={copyValue} /> : undefined}
      >
        <div className="space-y-6">
          <SegmentedControl
            value={vars}
            onChange={setVars}
            options={[
              { value: "2", label: labels.mode2 },
              { value: "3", label: labels.mode3 },
            ]}
          />

          {vars === "2" ? (
            <>
              <EquationRow
                label={labels.eq1}
                values={[...eq1.slice(0, 2), eq1[2]]}
                setters={[setterFor(setEq1, 0), setterFor(setEq1, 1), setterFor(setEq1, 2)]}
                labels={[labels.coeffA1, labels.coeffB1, labels.constant1]}
                vars={["x", "y"]}
              />
              <EquationRow
                label={labels.eq2}
                values={[...eq2.slice(0, 2), eq2[2]]}
                setters={[setterFor(setEq2, 0), setterFor(setEq2, 1), setterFor(setEq2, 2)]}
                labels={[labels.coeffA2, labels.coeffB2, labels.constant2]}
                vars={["x", "y"]}
              />
            </>
          ) : (
            <>
              <EquationRow
                label={labels.eq1}
                values={[...eq31.slice(0, 3), eq31[3]]}
                setters={[0, 1, 2, 3].map((i) => setterFor(setEq31, i))}
                labels={[labels.coeffA1, labels.coeffB1, labels.coeffC1, labels.constant1]}
                vars={["x", "y", "z"]}
              />
              <EquationRow
                label={labels.eq2}
                values={[...eq32.slice(0, 3), eq32[3]]}
                setters={[0, 1, 2, 3].map((i) => setterFor(setEq32, i))}
                labels={[labels.coeffA2, labels.coeffB2, labels.coeffC2, labels.constant2]}
                vars={["x", "y", "z"]}
              />
              <EquationRow
                label={labels.eq3}
                values={[...eq33.slice(0, 3), eq33[3]]}
                setters={[0, 1, 2, 3].map((i) => setterFor(setEq33, i))}
                labels={[labels.coeffA3, labels.coeffB3, labels.coeffC3, labels.constant3]}
                vars={["x", "y", "z"]}
              />
            </>
          )}

          <SecondaryButton fullWidth onClick={handleClear}>
            {t.common.clear}
          </SecondaryButton>

          <div className="mt-8 space-y-6">
            <SurfacePanel className="border-brand/20 bg-brand-muted">
              {active.status === "success" && vars === "2" && computed2.status === "success" && (
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">{labels.resultX}</div>
                    <div className="tabular-display mt-2 text-3xl font-bold text-brand">{computed2.xText}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">{labels.resultY}</div>
                    <div className="tabular-display mt-2 text-3xl font-bold text-brand">{computed2.yText}</div>
                  </div>
                </div>
              )}
              {active.status === "success" && vars === "3" && computed3.status === "success" && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    [labels.resultX, computed3.xText],
                    [labels.resultY, computed3.yText],
                    [labels.resultZ, computed3.zText],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="text-sm font-medium text-text-tertiary">{label}</div>
                      <div className="tabular-display mt-2 text-3xl font-bold text-brand">{value}</div>
                    </div>
                  ))}
                </div>
              )}
              {active.status === "infinite" && (
                <ErrorMessage message={labels.infiniteSolutions} />
              )}
              {active.status === "no_solution" && (
                <ErrorMessage message={labels.noSolution} />
              )}
              {active.status === "invalid" && <ErrorMessage message={t.common.invalidInput} />}
            </SurfacePanel>

            {vars === "2" && computed2.status === "success" && computed2.elimSteps.length > 0 && (
              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  ステップで解く（加減法）
                </h3>
                <SurfacePanel className="space-y-2">
                  <p className="font-semibold text-text-primary">
                    ① {equationText(computed2.cramer.a, computed2.cramer.b, computed2.cramer.c)}
                  </p>
                  <p className="font-semibold text-text-primary">
                    ② {equationText(computed2.cramer.d, computed2.cramer.e, computed2.cramer.f)}
                  </p>
                  {computed2.elimSteps.map((line) => (
                    <p key={line} className="text-sm text-text-secondary sm:text-base">
                      {line}
                    </p>
                  ))}
                </SurfacePanel>
              </Divider>
            )}

            {vars === "2" && computed2.status === "success" && computed2.elimSteps.length === 0 && (
              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  ステップで解く（クラメルの公式）
                </h3>
                <SurfacePanel className="space-y-2 text-left">
                  <p className="text-sm text-text-secondary sm:text-base">
                    D = ({computed2.cramer.a}) × ({computed2.cramer.e}) − ({computed2.cramer.d}) × ({computed2.cramer.b}) = {computed2.cramer.D}
                  </p>
                  <p className="text-sm text-text-secondary sm:text-base">
                    Dx = ({computed2.cramer.c}) × ({computed2.cramer.e}) − ({computed2.cramer.f}) × ({computed2.cramer.b}) = {computed2.cramer.Dx}
                  </p>
                  <p className="text-sm text-text-secondary sm:text-base">
                    Dy = ({computed2.cramer.a}) × ({computed2.cramer.f}) − ({computed2.cramer.d}) × ({computed2.cramer.c}) = {computed2.cramer.Dy}
                  </p>
                  <p className="text-sm text-text-secondary sm:text-base">
                    x = Dx ÷ D = {computed2.xText}、y = Dy ÷ D = {computed2.yText}
                  </p>
                </SurfacePanel>
              </Divider>
            )}

            {vars === "3" && computed3.status === "success" && (
              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  ステップで解く（クラメルの公式）
                </h3>
                <SurfacePanel className="space-y-2 text-left">
                  {computed3.equations.map((eq, i) => (
                    <p key={eq} className="font-semibold text-text-primary">
                      {["①", "②", "③"][i]} {eq}
                    </p>
                  ))}
                  <p className="text-sm text-text-secondary sm:text-base">
                    行列式 D = {computed3.det} ≠ 0 なので、解は1組だけです
                  </p>
                  <p className="text-sm text-text-secondary sm:text-base">
                    x = Dx ÷ D = {computed3.dx} ÷ {computed3.det} = {computed3.xText}
                  </p>
                  <p className="text-sm text-text-secondary sm:text-base">
                    y = Dy ÷ D = {computed3.dy} ÷ {computed3.det} = {computed3.yText}
                  </p>
                  <p className="text-sm text-text-secondary sm:text-base">
                    z = Dz ÷ D = {computed3.dz} ÷ {computed3.det} = {computed3.zText}
                  </p>
                </SurfacePanel>
              </Divider>
            )}
          </div>
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">{page.description}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={page.introParagraph} />
      </p>

      <section aria-labelledby="simul-methods-heading" className={sectionClass}>
        <h2 id="simul-methods-heading" className={sectionH2Class}>
          {page.methodsTitle}
        </h2>
        {page.methodsLines.map((line) => (
          <p key={line} className={guideBodyClass}>
            {line}
          </p>
        ))}
        <p className={guideBodyClass}>{page.guideUsageBody}</p>
      </section>

      <section aria-labelledby="simul-example-heading" className={sectionClass}>
        <h2 id="simul-example-heading" className={sectionH2Class}>
          {page.guideExampleTitle}
        </h2>
        <p className={guideBodyClass}>{page.guideExampleBody}</p>
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>連立方程式</th>
                <th scope="col" className={thClass}>解</th>
              </tr>
            </thead>
            <tbody>
              {page.examplesTableRows.map((row) => (
                <tr key={row[0]}>
                  <td className={tdClass}>{row[0]}</td>
                  <td className={tdClass}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="simul-judge-heading" className={sectionClass}>
        <h2 id="simul-judge-heading" className={sectionH2Class}>
          {page.judgeTableTitle}
        </h2>
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>条件</th>
                <th scope="col" className={thClass}>解</th>
              </tr>
            </thead>
            <tbody>
              {page.judgeTableRows.map((row) => (
                <tr key={row[0]}>
                  <td className={tdClass}>{row[0]}</td>
                  <td className={tdClass}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="simul-word-heading" className={sectionClass}>
        <h2 id="simul-word-heading" className={sectionH2Class}>
          {page.wordProblemTitle}
        </h2>
        {page.wordProblemLines.map((line) => (
          <p key={line} className={guideBodyClass}>
            {line}
          </p>
        ))}
      </section>

      <section aria-labelledby="simul-mistakes-heading" className={sectionClass}>
        <h2 id="simul-mistakes-heading" className={sectionH2Class}>
          {page.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {page.guideMistakes.map((mistake) => (
            <li key={mistake} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {mistake}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={page.howToTitle} steps={page.howToSteps} />

      <CalculatorFaqSection title={page.faqTitle} items={page.faqItems} />
      <RelatedCalculators activeHref="/simultaneous-equations-calculator" />
    </>
  );
}
