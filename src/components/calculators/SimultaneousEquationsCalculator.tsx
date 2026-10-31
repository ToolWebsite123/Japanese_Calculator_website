"use client";

import { useState } from "react";
import { CalculatorCard } from "@/components/ui/FormField";
import { InputWell, SurfacePanel, PrimaryButton, Divider } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useLocale } from "@/context/LocaleContext";
import { solveSimultaneousEquations } from "@/lib/calculators/simultaneous-equations";

const coeffInputClass =
  "w-full rounded-[var(--radius-sm)] border border-border bg-surface-raised px-3 py-2 text-center text-lg text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

function EquationRow({
  label,
  a,
  b,
  c,
  setA,
  setB,
  setC,
  coeffALabel,
  coeffBLabel,
  constantLabel,
}: {
  label: string;
  a: string;
  b: string;
  c: string;
  setA: (v: string) => void;
  setB: (v: string) => void;
  setC: (v: string) => void;
  coeffALabel: string;
  coeffBLabel: string;
  constantLabel: string;
}) {
  return (
    <SurfacePanel>
      <div className="mb-3 block text-sm font-semibold text-text-primary">{label}</div>
      <div className="flex items-center gap-2">
        <InputWell
          type="number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className={coeffInputClass}
          aria-label={coeffALabel}
        />
        <span className="text-lg font-medium text-text-secondary">x +</span>
        <InputWell
          type="number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className={coeffInputClass}
          aria-label={coeffBLabel}
        />
        <span className="text-lg font-medium text-text-secondary">y =</span>
        <InputWell
          type="number"
          value={c}
          onChange={(e) => setC(e.target.value)}
          className={coeffInputClass}
          aria-label={constantLabel}
        />
      </div>
    </SurfacePanel>
  );
}

export function SimultaneousEquationsCalculator() {
  const { t } = useLocale();

  const [a1, setA1] = useState<string>("2");
  const [b1, setB1] = useState<string>("3");
  const [c1, setC1] = useState<string>("8");
  const [a2, setA2] = useState<string>("5");
  const [b2, setB2] = useState<string>("-1");
  const [c2, setC2] = useState<string>("3");

  const [result, setResult] = useState<{
    x: string;
    y: string;
    status: "success" | "infinite" | "no_solution" | "invalid";
    stepsData?: {
      a: number;
      b: number;
      c: number;
      d: number;
      e: number;
      f: number;
      D: number;
      Dx: number;
      Dy: number;
    };
  } | null>(null);

  const handleCalculate = () => {
    const a = parseFloat(a1);
    const b = parseFloat(b1);
    const c = parseFloat(c1);
    const d = parseFloat(a2);
    const e = parseFloat(b2);
    const f = parseFloat(c2);

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) {
      setResult({ x: "—", y: "—", status: "invalid" as const });
      return;
    }

    const solved = solveSimultaneousEquations(a, b, c, d, e, f);

    if (solved.status !== "success") {
      setResult({ x: "—", y: "—", status: solved.status });
      return;
    }

    const { x, y, determinant, dx, dy } = solved;

    setResult({
      x: Number.isInteger(x) ? x.toString() : x.toFixed(4),
      y: Number.isInteger(y) ? y.toString() : y.toFixed(4),
      status: "success" as const,
      stepsData: { a, b, c, d, e, f, D: determinant, Dx: dx, Dy: dy },
    });
  };

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.simultaneousEquationsPage.title}
      </h1>
      <CalculatorCard compact>
        <div className="space-y-6">
          <EquationRow
            label={t.simultaneousEquations.eq1}
            a={a1}
            b={b1}
            c={c1}
            setA={setA1}
            setB={setB1}
            setC={setC1}
            coeffALabel={t.simultaneousEquations.coeffA1}
            coeffBLabel={t.simultaneousEquations.coeffB1}
            constantLabel={t.simultaneousEquations.constant1}
          />
          <EquationRow
            label={t.simultaneousEquations.eq2}
            a={a2}
            b={b2}
            c={c2}
            setA={setA2}
            setB={setB2}
            setC={setC2}
            coeffALabel={t.simultaneousEquations.coeffA2}
            coeffBLabel={t.simultaneousEquations.coeffB2}
            constantLabel={t.simultaneousEquations.constant2}
          />

          <PrimaryButton onClick={handleCalculate} fullWidth>
            {t.common.calculate}
          </PrimaryButton>

          {result && (
            <div className="mt-8 space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted">
                {result.status === "success" && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">
                        {t.simultaneousEquations.resultX}
                      </div>
                      <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                        {result.x}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">
                        {t.simultaneousEquations.resultY}
                      </div>
                      <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                        {result.y}
                      </div>
                    </div>
                  </div>
                )}
                {result.status === "infinite" && (
                  <ErrorMessage message={t.simultaneousEquations.infiniteSolutions} />
                )}
                {result.status === "no_solution" && (
                  <ErrorMessage message={t.simultaneousEquations.noSolution} />
                )}
                {result.status === "invalid" && <ErrorMessage message={t.common.invalidInput} />}
              </SurfacePanel>

              {result.status === "success" && result.stepsData && (
                <Divider>
                  <h3 className="mb-4 text-xl font-semibold text-text-primary">
                    ステップで解く (クラメルの公式)
                  </h3>
                  <SurfacePanel className="space-y-6 text-left">
                    <div>
                      <p className="font-semibold text-text-primary mb-2">1. 方程式:</p>
                      <div className="ml-4 tabular-nums text-lg text-text-secondary space-y-1">
                        <p>
                          {result.stepsData.a}x {result.stepsData.b >= 0 ? "+" : "−"}{" "}
                          {Math.abs(result.stepsData.b)}y = {result.stepsData.c}
                        </p>
                        <p>
                          {result.stepsData.d}x {result.stepsData.e >= 0 ? "+" : "−"}{" "}
                          {Math.abs(result.stepsData.e)}y = {result.stepsData.f}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-text-primary mb-2">
                        2. 行列式 D を計算する (D = a₁b₂ − a₂b₁):
                      </p>
                      <div className="ml-4 tabular-nums text-lg text-text-secondary space-y-1">
                        <p>
                          D = ({result.stepsData.a}) × ({result.stepsData.e}) − (
                          {result.stepsData.d}) × ({result.stepsData.b})
                        </p>
                        <p>
                          D = {result.stepsData.a * result.stepsData.e} − (
                          {result.stepsData.d * result.stepsData.b}) = {result.stepsData.D}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-text-primary mb-2">
                        3. Dx を計算する (Dx = c₁b₂ − c₂b₁):
                      </p>
                      <div className="ml-4 tabular-nums text-lg text-text-secondary space-y-1">
                        <p>
                          Dx = ({result.stepsData.c}) × ({result.stepsData.e}) − (
                          {result.stepsData.f}) × ({result.stepsData.b})
                        </p>
                        <p>
                          Dx = {result.stepsData.c * result.stepsData.e} − (
                          {result.stepsData.f * result.stepsData.b}) = {result.stepsData.Dx}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-text-primary mb-2">
                        4. Dy を計算する (Dy = a₁c₂ − a₂c₁):
                      </p>
                      <div className="ml-4 tabular-nums text-lg text-text-secondary space-y-1">
                        <p>
                          Dy = ({result.stepsData.a}) × ({result.stepsData.f}) − (
                          {result.stepsData.d}) × ({result.stepsData.c})
                        </p>
                        <p>
                          Dy = {result.stepsData.a * result.stepsData.f} − (
                          {result.stepsData.d * result.stepsData.c}) = {result.stepsData.Dy}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-text-primary mb-2">
                        5. x と y の値を求める:
                      </p>
                      <div className="ml-4 tabular-nums text-lg text-text-secondary space-y-1">
                        <p>
                          x = Dx ÷ D = {result.stepsData.Dx} ÷ {result.stepsData.D} = {result.x}
                        </p>
                        <p>
                          y = Dy ÷ D = {result.stepsData.Dy} ÷ {result.stepsData.D} = {result.y}
                        </p>
                      </div>
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
          {t.simultaneousEquationsPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.simultaneousEquationsPage.introParagraph} />
      </p>

      <CalculatorHowToSection
        title={t.simultaneousEquationsPage.howToTitle}
        steps={t.simultaneousEquationsPage.howToSteps}
      />

      <section aria-labelledby="simul-example-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="simul-example-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.simultaneousEquationsPage.guideExampleTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          {t.simultaneousEquationsPage.guideExampleBody}
        </p>
      </section>

      <section aria-labelledby="simul-usage-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="simul-usage-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.simultaneousEquationsPage.guideUsageTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          {t.simultaneousEquationsPage.guideUsageBody}
        </p>
      </section>

      <CalculatorFaqSection
        title={t.simultaneousEquationsPage.faqTitle}
        items={t.simultaneousEquationsPage.faqItems}
      />
      <RelatedCalculators activeHref="/simultaneous-equations-calculator" />
    </>
  );
}
