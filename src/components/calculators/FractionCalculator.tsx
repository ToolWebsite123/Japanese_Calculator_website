"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import { MathFraction, MathEq, MathOp } from "@/components/ui/MathDisplay";
import { Divider, SecondaryButton, SelectWell, SurfacePanel } from "@/components/ui/primitives";
import {
  decimalToFraction,
  formatFraction,
  fractionToDecimal,
  parseFractionInput,
  getFractionSteps,
  simplify,
  type Fraction,
  type FractionOp,
  type FractionStep,
} from "@/lib/calculators/fraction";

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";

const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";
const tableWrapClass = "mt-4 overflow-x-auto";
const tableClass = "w-full border-collapse text-sm sm:text-base";
const thClass = "border-b border-border bg-surface-sunken px-3 py-2.5 text-left font-semibold text-text-primary";
const tdClass = "border-b border-border px-3 py-2.5 text-text-secondary";

/**
 * Render (num/den) * scale as decimal text by exact long division:
 * exact string when the expansion terminates, otherwise 4 decimal
 * places (rounded) followed by "…". Display-only helper.
 */
function ratioText(num: number, den: number, scale: number): string {
  const s = simplify(num * scale, den);
  const sign = s.num < 0 ? "-" : "";
  let n = Math.abs(s.num);
  const d = s.den;
  const intPart = Math.floor(n / d);
  let rem = n % d;
  if (rem === 0) return `${sign}${intPart}`;
  let digits = "";
  for (let i = 0; i < 12 && rem !== 0; i++) {
    rem *= 10;
    digits += String(Math.floor(rem / d));
    rem %= d;
  }
  if (rem === 0) {
    return `${sign}${intPart}.${digits.replace(/0+$/, "")}`;
  }
  const arr = digits.slice(0, 4).padEnd(4, "0").split("").map(Number);
  if (Number(digits[4] ?? "0") >= 5) {
    let i = 3;
    while (i >= 0 && arr[i] === 9) {
      arr[i] = 0;
      i--;
    }
    if (i < 0) return `${sign}${intPart + 1}…`;
    arr[i]++;
  }
  const frac = arr.join("").replace(/0+$/, "");
  return `${sign}${intPart}${frac ? `.${frac}` : ""}…`;
}

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

  const [mode, setMode] = useState<"calc" | "decimal">("calc");
  const [aWhole, setAWhole] = useState("");
  const [aNum, setANum] = useState("1");
  const [aDen, setADen] = useState("2");
  const [bWhole, setBWhole] = useState("");
  const [bNum, setBNum] = useState("1");
  const [bDen, setBDen] = useState("3");
  const [op, setOp] = useState<FractionOp>("+");
  const [decimalInput, setDecimalInput] = useState("0.75");

  type CalcResult = {
    formatted: string;
    decimal: number;
    stepsData: {
      steps: FractionStep[];
      formulaSteps?: FractionStep[];
      finalResult: Fraction;
    };
    expression: string;
  };

  const computed = useMemo((): { result: CalcResult | null; error: string | null } => {
    if (mode !== "calc") return { result: null, error: null };
    try {
      const fa = parseFractionInput(aWhole, aNum, aDen);
      const fb = parseFractionInput(bWhole, bNum, bDen);
      const stepsData = getFractionSteps(fa, fb, op);
      const formatted = formatFraction(stepsData.finalResult);
      return {
        result: {
          formatted,
          decimal: fractionToDecimal(stepsData.finalResult),
          stepsData,
          expression: `${formatFraction(fa)} ${op} ${formatFraction(fb)}`,
        },
        error: null,
      };
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : t.common.invalidInput,
      };
    }
  }, [mode, aWhole, aNum, aDen, bWhole, bNum, bDen, op, t]);

  const result = computed.result;
  const error = mode === "calc" ? computed.error : null;

  const decimalComputed = useMemo(() => {
    if (mode !== "decimal") return null;
    try {
      return {
        value: decimalToFraction(decimalInput),
        error: null as string | null,
      };
    } catch (e) {
      return {
        value: null,
        error: e instanceof Error ? e.message : t.common.invalidInput,
      };
    }
  }, [mode, decimalInput, t]);

  // Log to history once a calculation settles, not on every keystroke.
  const lastLogged = useRef<string | null>(null);
  useEffect(() => {
    if (!result) return;
    const key = result.expression;
    const timer = setTimeout(() => {
      if (lastLogged.current !== key) {
        lastLogged.current = key;
        addEntry({
          expression: key,
          result: result.formatted,
          route: "/fraction-calculator",
        });
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [result, addEntry]);

  function handleClear() {
    setAWhole("");
    setANum("");
    setADen("");
    setBWhole("");
    setBNum("");
    setBDen("");
    setDecimalInput("");
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
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">モード</span>
            <SelectWell
              value={mode}
              onChange={(e) => setMode(e.target.value as "calc" | "decimal")}
              className="text-lg"
            >
              <option value="calc">分数の計算</option>
              <option value="decimal">小数を分数に変換</option>
            </SelectWell>
          </label>

          {mode === "calc" ? (
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
          ) : (
          <div className="space-y-2.5 py-2">
            <FormField
              label="小数"
              type="text"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              className="text-lg"
            />
            {decimalComputed?.error && (
              <ErrorMessage message={decimalComputed.error} />
            )}
            {decimalComputed?.value && (
              <div translate="no" className="pt-2">
                <Divider>
                  <h3 className="mb-4 text-xl font-semibold text-text-primary">
                    {t.fraction.answerHeading}
                  </h3>
                  <SurfacePanel className="flex flex-col items-center justify-center gap-2">
                    <MathEq>
                      <span>{decimalInput.trim()}</span>
                      <MathOp op="=" />
                      <MathFraction {...decimalComputed.value.fraction} />
                    </MathEq>
                    {decimalComputed.value.unreduced.num !==
                      decimalComputed.value.fraction.num ||
                    decimalComputed.value.unreduced.den !==
                      decimalComputed.value.fraction.den ? (
                      <p className="text-sm text-text-secondary">
                        {decimalComputed.value.unreduced.num}/
                        {decimalComputed.value.unreduced.den} を約分しました
                      </p>
                    ) : null}
                    {formatFraction(decimalComputed.value.fraction).includes(" ") && (
                      <p className="text-sm text-text-secondary">
                        帯分数では {formatFraction(decimalComputed.value.fraction)}
                      </p>
                    )}
                  </SurfacePanel>
                </Divider>
              </div>
            )}
          </div>
          )}

          <SecondaryButton fullWidth onClick={handleClear}>
            {t.common.clear}
          </SecondaryButton>

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
                <p className="mt-3 text-center text-sm text-text-secondary">
                  {Math.abs(result.stepsData.finalResult.num) >
                    result.stepsData.finalResult.den &&
                    `仮分数では ${result.stepsData.finalResult.num}/${result.stepsData.finalResult.den} ・ `}
                  小数では{" "}
                  {ratioText(
                    result.stepsData.finalResult.num,
                    result.stepsData.finalResult.den,
                    1,
                  )}{" "}
                  ・ パーセントでは{" "}
                  {ratioText(
                    result.stepsData.finalResult.num,
                    result.stepsData.finalResult.den,
                    100,
                  )}
                  ％
                </p>
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

      <section aria-labelledby="fraction-formula-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="fraction-formula-heading" className={guideHeadingClass}>
          {t.fractionPage.formulaTitle}
        </h2>
        {t.fractionPage.formulaLines.map((line) => (
          <p key={line} className={guideBodyClass}>
            {line}
          </p>
        ))}
      </section>

      <section aria-labelledby="fraction-examples-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="fraction-examples-heading" className={guideHeadingClass}>
          {t.fractionPage.guideExamplesTitle}
        </h2>
        <p className={guideBodyClass}>{t.fractionPage.examplesLead}</p>
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>計算</th>
                <th scope="col" className={thClass}>答え</th>
                <th scope="col" className={thClass}>小数</th>
              </tr>
            </thead>
            <tbody>
              {t.fractionPage.examplesTableRows.map((row) => (
                <tr key={row[0]}>
                  <td className={tdClass}>{row[0]}</td>
                  <td className={tdClass}>{row[1]}</td>
                  <td className={tdClass}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="fraction-quick-table-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="fraction-quick-table-heading" className={guideHeadingClass}>
          {t.fractionPage.quickTableTitle}
        </h2>
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>分数</th>
                <th scope="col" className={thClass}>小数</th>
                <th scope="col" className={thClass}>パーセント</th>
              </tr>
            </thead>
            <tbody>
              {t.fractionPage.quickTableRows.map((row) => (
                <tr key={row[0]}>
                  <td className={tdClass}>{row[0]}</td>
                  <td className={tdClass}>{row[1]}</td>
                  <td className={tdClass}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="fraction-basics-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="fraction-basics-heading" className={guideHeadingClass}>
          {t.fractionPage.basicsTitle}
        </h2>
        {t.fractionPage.basicsBlocks.map((block) => (
          <p key={block.lead} className={guideBodyClass}>
            <strong className="text-text-primary">{block.lead}</strong>
            ──{block.body}
          </p>
        ))}
      </section>

      <section aria-labelledby="fraction-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="fraction-mistakes-heading" className={guideHeadingClass}>
          {t.fractionPage.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.fractionPage.guideMistakes.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={t.fractionPage.howToTitle} steps={t.fractionPage.howToSteps} />

      <CalculatorFaqSection title={t.fractionPage.faqTitle} items={t.fractionPage.faqItems} />
      <RelatedCalculators activeHref="/fraction-calculator" />
    </>
  );
}
