"use client";

import { useState, type ReactNode } from "react";
import { CalculatorCard, FormField, ResultCard } from "@/components/ui/FormField";
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
import {
  MathEq,
  MathFraction,
  MathOp,
  MathPower,
} from "@/components/ui/MathDisplay";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import {
  solveTimeValueOfMoney,
  tvmFutureValue,
  type TvmResult,
  type TvmSolveTarget,
} from "@/lib/calculators/financial";
import { formatDisplayNumber, formatYen } from "@/lib/format";

const SOLVE_TARGETS: TvmSolveTarget[] = ["PV", "FV", "PMT", "IY", "N"];

function formatTvmValue(target: TvmSolveTarget, value: number): string {
  if (target === "IY") {
    return `${formatDisplayNumber(value, 6)}%`;
  }
  if (target === "N") {
    return formatDisplayNumber(value, 4);
  }
  return formatYen(value);
}

function formatTemplate(template: string, ...values: string[]): string {
  return values.reduce(
    (text, value, index) => text.replace(`{${index}}`, value),
    template
  );
}

function formatAmount(value: number): string {
  return Math.round(value).toLocaleString("ja-JP");
}

function Num({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

function Var({ children }: { children: ReactNode }) {
  return <span className="italic">{children}</span>;
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

function fmt(n: number, max = 8): string {
  return formatDisplayNumber(n, max);
}

function GivenList({
  solveFor,
  pv,
  fv,
  pmt,
  rate,
  periods,
  givenTitle,
}: {
  solveFor: TvmSolveTarget;
  pv: number;
  fv: number;
  pmt: number;
  rate: number;
  periods: number;
  givenTitle: string;
}) {
  const items: { key: TvmSolveTarget; label: ReactNode; value: string }[] = [
    {
      key: "PV",
      label: (
        <>
          <Var>PV</Var>
        </>
      ),
      value: `${formatAmount(pv)}円`,
    },
    {
      key: "FV",
      label: (
        <>
          <Var>FV</Var>
        </>
      ),
      value: `${formatAmount(fv)}円`,
    },
    {
      key: "PMT",
      label: (
        <>
          <Var>PMT</Var>
        </>
      ),
      value: `${formatAmount(pmt)}円`,
    },
    {
      key: "IY",
      label: (
        <>
          <Var>I/Y</Var>
        </>
      ),
      value: `${fmt(rate)}%`,
    },
    {
      key: "N",
      label: (
        <>
          <Var>N</Var>
        </>
      ),
      value: fmt(periods, 4),
    },
  ];

  return (
    <div>
      <h3 className="font-bold text-text-primary">{givenTitle}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary sm:text-base">
        {items
          .filter((item) => item.key !== solveFor)
          .map((item) => (
            <li key={item.key}>
              {item.label} = <Num>{item.value}</Num>
            </li>
          ))}
      </ul>
    </div>
  );
}

function RateGrowthSteps({
  rate,
  periods,
  i,
  base,
  growth,
  page,
}: {
  rate: number;
  periods: number;
  i: number;
  base: number;
  growth: number;
  page: {
    stepRateTitle: string;
    stepAddOneTitle: string;
    stepPowerTitle: string;
  };
}) {
  return (
    <>
      <ExampleStep
        stepId="fin-rate"
        title={page.stepRateTitle}
        math={
          <>
            <Var>i</Var> <MathOp op="=" />{" "}
            <MathFraction num={fmt(rate)} den={100} /> <MathOp op="=" />{" "}
            <Num>{fmt(i)}</Num>
          </>
        }
      />
      <ExampleStep
        stepId="fin-add1"
        title={page.stepAddOneTitle}
        math={
          <>
            1 <MathOp op="+" /> <Num>{fmt(i)}</Num> <MathOp op="=" />{" "}
            <Num>{fmt(base)}</Num>
          </>
        }
      />
      <ExampleStep
        stepId="fin-pow"
        title={page.stepPowerTitle}
        math={
          <>
            <MathPower base={fmt(base)} exponent={fmt(periods, 4)} />{" "}
            <MathOp op="=" /> <Num>{fmt(growth, 5)}</Num>
          </>
        }
      />
    </>
  );
}

function FinancialStepsPanel({
  solveFor,
  pv,
  fv,
  pmt,
  rate,
  periods,
  solved,
  page,
}: {
  solveFor: TvmSolveTarget;
  pv: number;
  fv: number;
  pmt: number;
  rate: number;
  periods: number;
  solved: number;
  page: {
    scenarioTitle: string;
    scenarioFv: string;
    scenarioPv: string;
    scenarioPmt: string;
    scenarioIy: string;
    scenarioN: string;
    givenTitle: string;
    formulaTitle: string;
    stepRateTitle: string;
    stepAddOneTitle: string;
    stepPowerTitle: string;
    stepAnnuityTitle: string;
    stepFvMultiplyTitle: string;
    stepFvResultTitle: string;
    stepPvDivideTitle: string;
    stepPvResultTitle: string;
    stepPmtNumTitle: string;
    stepPmtDivideTitle: string;
    stepPmtResultTitle: string;
    stepIyBracketTitle: string;
    stepIyMidTitle: string;
    stepIyConvergeTitle: string;
    stepIyResultTitle: string;
    stepNLogTitle: string;
    stepNBisectionTitle: string;
    stepNResultTitle: string;
    resultLabel: string;
    resultFv: string;
    resultPv: string;
    resultPmt: string;
    resultIy: string;
    resultN: string;
  };
}) {
  const i = rate / 100;
  const base = 1 + i;
  const growth = Math.abs(i) < 1e-12 ? 1 : Math.pow(base, periods);
  const annuity =
    Math.abs(i) < 1e-12 ? periods : (Math.pow(base, periods) - 1) / i;
  const pmtNearZero = Math.abs(pmt) < 1e-12;

  let iyMid1 = 0;
  let iyFv1 = 0;
  if (solveFor === "IY") {
    const lo = -99.99;
    const hi = 1000;
    iyMid1 = (lo + hi) / 2;
    try {
      iyFv1 = tvmFutureValue(pv, pmt, iyMid1, periods);
    } catch {
      iyFv1 = NaN;
    }
  }

  const scenario = (() => {
    switch (solveFor) {
      case "FV":
        return formatTemplate(
          page.scenarioFv,
          formatAmount(pv),
          formatAmount(pmt),
          fmt(rate),
          fmt(periods, 4)
        );
      case "PV":
        return formatTemplate(
          page.scenarioPv,
          formatAmount(fv),
          formatAmount(pmt),
          fmt(rate),
          fmt(periods, 4)
        );
      case "PMT":
        return formatTemplate(
          page.scenarioPmt,
          formatAmount(pv),
          formatAmount(fv),
          fmt(rate),
          fmt(periods, 4)
        );
      case "IY":
        return formatTemplate(
          page.scenarioIy,
          formatAmount(pv),
          formatAmount(fv),
          formatAmount(pmt),
          fmt(periods, 4)
        );
      case "N":
        return formatTemplate(
          page.scenarioN,
          formatAmount(pv),
          formatAmount(fv),
          formatAmount(pmt),
          fmt(rate)
        );
    }
  })();

  return (
    <SurfacePanel className="space-y-2">
      <div>
        <h3 className="font-bold text-text-primary">{page.scenarioTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
          {scenario}
        </p>
      </div>

      <GivenList
        solveFor={solveFor}
        pv={pv}
        fv={fv}
        pmt={pmt}
        rate={rate}
        periods={periods}
        givenTitle={page.givenTitle}
      />

      <div>
        <h3 className="font-bold text-text-primary">{page.formulaTitle}</h3>
        {solveFor === "FV" && (
          <MathEq>
            {pmtNearZero ? (
              <>
                <Var>FV</Var> <MathOp op="=" /> <Var>PV</Var>{" "}
                <MathOp op="×" /> (1 <MathOp op="+" /> <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>
              </>
            ) : (
              <>
                <Var>FV</Var> <MathOp op="=" /> <Var>PV</Var>{" "}
                <MathOp op="×" /> (1 <MathOp op="+" /> <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>{" "}
                <MathOp op="+" /> <Var>PMT</Var> <MathOp op="×" /> ((1{" "}
                <MathOp op="+" /> <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>{" "}
                <MathOp op="−" /> 1) <MathOp op="/" /> <Var>i</Var>
              </>
            )}
          </MathEq>
        )}
        {solveFor === "PV" && (
          <MathEq>
            {pmtNearZero ? (
              <>
                <Var>PV</Var> <MathOp op="=" /> <Var>FV</Var>{" "}
                <MathOp op="/" /> (1 <MathOp op="+" /> <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>
              </>
            ) : (
              <>
                <Var>PV</Var> <MathOp op="=" /> (<Var>FV</Var>{" "}
                <MathOp op="−" /> <Var>PMT</Var> <MathOp op="×" /> af){" "}
                <MathOp op="/" /> (1 <MathOp op="+" /> <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>
              </>
            )}
          </MathEq>
        )}
        {solveFor === "PMT" && (
          <MathEq>
            <Var>PMT</Var> <MathOp op="=" /> (<Var>FV</Var>{" "}
            <MathOp op="−" /> <Var>PV</Var> <MathOp op="×" /> (1{" "}
            <MathOp op="+" /> <Var>i</Var>)
            <sup className="ml-0.5 text-[0.65em] font-medium">
              <Var>n</Var>
            </sup>
            ) <MathOp op="/" /> (((1 <MathOp op="+" /> <Var>i</Var>)
            <sup className="ml-0.5 text-[0.65em] font-medium">
              <Var>n</Var>
            </sup>{" "}
            <MathOp op="−" /> 1) <MathOp op="/" /> <Var>i</Var>)
          </MathEq>
        )}
        {solveFor === "IY" && (
          <MathEq>
            <Var>FV</Var> <MathOp op="=" /> <Var>PV</Var>{" "}
            <MathOp op="×" /> (1 <MathOp op="+" /> <Var>i</Var>)
            <sup className="ml-0.5 text-[0.65em] font-medium">
              <Var>n</Var>
            </sup>{" "}
            <MathOp op="+" /> <Var>PMT</Var> <MathOp op="×" /> af →{" "}
            <Var>i</Var> を二分法で逆算
          </MathEq>
        )}
        {solveFor === "N" && (
          <MathEq>
            {pmtNearZero ? (
              <>
                <Var>N</Var> <MathOp op="=" /> log(<Var>FV</Var>{" "}
                <MathOp op="/" /> <Var>PV</Var>) <MathOp op="/" /> log(1{" "}
                <MathOp op="+" /> <Var>i</Var>)
              </>
            ) : (
              <>
                <Var>FV</Var> <MathOp op="=" /> f(<Var>N</Var>) →{" "}
                <Var>N</Var> を二分法で逆算
              </>
            )}
          </MathEq>
        )}
      </div>

      {(solveFor === "FV" || solveFor === "PV" || solveFor === "PMT") && (
        <RateGrowthSteps
          rate={rate}
          periods={periods}
          i={i}
          base={base}
          growth={growth}
          page={page}
        />
      )}

      {(solveFor === "FV" || solveFor === "PV" || solveFor === "PMT") &&
        !pmtNearZero && (
          <ExampleStep
            stepId="fin-af"
            title={page.stepAnnuityTitle}
            math={
              <>
                ((1 <MathOp op="+" /> <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>{" "}
                <MathOp op="−" /> 1) <MathOp op="/" /> <Var>i</Var>{" "}
                <MathOp op="=" /> <Num>{fmt(annuity, 5)}</Num>
              </>
            }
          />
        )}

      {solveFor === "FV" && (
        <>
          <ExampleStep
            stepId="fin-fv-mul"
            title={page.stepFvMultiplyTitle}
            math={
              pmtNearZero ? (
                <>
                  <Var>FV</Var> <MathOp op="=" />{" "}
                  <Num>{formatAmount(pv)}</Num> <MathOp op="×" />{" "}
                  <Num>{fmt(growth, 5)}</Num>
                </>
              ) : (
                <>
                  <Var>FV</Var> <MathOp op="=" />{" "}
                  <Num>{formatAmount(pv)}</Num> <MathOp op="×" />{" "}
                  <Num>{fmt(growth, 5)}</Num> <MathOp op="+" />{" "}
                  <Num>{formatAmount(pmt)}</Num> <MathOp op="×" />{" "}
                  <Num>{fmt(annuity, 5)}</Num>
                </>
              )
            }
          />
          <ExampleStep
            stepId="fin-fv-res"
            title={page.stepFvResultTitle}
            math={
              <>
                <Var>FV</Var> <MathOp op="=" />{" "}
                <Num>{formatAmount(solved)}</Num>
              </>
            }
          />
          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel}:{" "}
            {formatTemplate(page.resultFv, `${formatAmount(solved)}円`)}
          </p>
        </>
      )}

      {solveFor === "PV" && (
        <>
          <ExampleStep
            stepId="fin-pv-div"
            title={page.stepPvDivideTitle}
            math={
              pmtNearZero ? (
                <>
                  <Var>PV</Var> <MathOp op="=" />{" "}
                  <Num>{formatAmount(fv)}</Num> <MathOp op="/" />{" "}
                  <Num>{fmt(growth, 5)}</Num>
                </>
              ) : (
                <>
                  <Var>PV</Var> <MathOp op="=" /> (
                  <Num>{formatAmount(fv)}</Num> <MathOp op="−" />{" "}
                  <Num>{formatAmount(pmt)}</Num> <MathOp op="×" />{" "}
                  <Num>{fmt(annuity, 5)}</Num>) <MathOp op="/" />{" "}
                  <Num>{fmt(growth, 5)}</Num>
                </>
              )
            }
          />
          <ExampleStep
            stepId="fin-pv-res"
            title={page.stepPvResultTitle}
            math={
              <>
                <Var>PV</Var> <MathOp op="=" />{" "}
                <Num>{formatAmount(solved)}</Num>
              </>
            }
          />
          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel}:{" "}
            {formatTemplate(page.resultPv, `${formatAmount(solved)}円`)}
          </p>
        </>
      )}

      {solveFor === "PMT" && (
        <>
          <ExampleStep
            stepId="fin-pmt-num"
            title={page.stepPmtNumTitle}
            math={
              <>
                <Num>{formatAmount(fv)}</Num> <MathOp op="−" />{" "}
                <Num>{formatAmount(pv)}</Num> <MathOp op="×" />{" "}
                <Num>{fmt(growth, 5)}</Num> <MathOp op="=" />{" "}
                <Num>{formatAmount(fv - pv * growth)}</Num>
              </>
            }
          />
          <ExampleStep
            stepId="fin-pmt-div"
            title={page.stepPmtDivideTitle}
            math={
              <>
                <Var>PMT</Var> <MathOp op="=" />{" "}
                <Num>{formatAmount(fv - pv * growth)}</Num>{" "}
                <MathOp op="/" /> <Num>{fmt(annuity, 5)}</Num>
              </>
            }
          />
          <ExampleStep
            stepId="fin-pmt-res"
            title={page.stepPmtResultTitle}
            math={
              <>
                <Var>PMT</Var> <MathOp op="=" />{" "}
                <Num>{formatAmount(solved)}</Num>
              </>
            }
          />
          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel}:{" "}
            {formatTemplate(page.resultPmt, `${formatAmount(solved)}円`)}
          </p>
        </>
      )}

      {solveFor === "IY" && (
        <>
          <ExampleStep
            stepId="fin-iy-br"
            title={page.stepIyBracketTitle}
            math={
              <>
                lo <MathOp op="=" /> −99.99%、hi <MathOp op="=" /> 1000%
              </>
            }
          />
          <ExampleStep
            stepId="fin-iy-mid"
            title={page.stepIyMidTitle}
            math={[
              <>
                mid <MathOp op="=" /> (lo <MathOp op="+" /> hi){" "}
                <MathOp op="/" /> 2 <MathOp op="≈" />{" "}
                <Num>{fmt(iyMid1, 4)}</Num>%
              </>,
              <>
                FV(mid) <MathOp op="≈" />{" "}
                <Num>
                  {Number.isFinite(iyFv1) ? formatAmount(iyFv1) : "—"}
                </Num>
                、目標 FV <MathOp op="=" /> <Num>{formatAmount(fv)}</Num>
              </>,
            ]}
          />
          <ExampleStep
            stepId="fin-iy-conv"
            title={page.stepIyConvergeTitle}
            math={
              <>
                |FV(mid) <MathOp op="−" /> FV| が十分小さくなるまで mid
                を更新
              </>
            }
          />
          <ExampleStep
            stepId="fin-iy-res"
            title={page.stepIyResultTitle}
            math={
              <>
                <Var>I/Y</Var> <MathOp op="=" /> <Num>{fmt(solved, 6)}</Num>%
              </>
            }
          />
          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel}: {formatTemplate(page.resultIy, fmt(solved, 6))}
          </p>
        </>
      )}

      {solveFor === "N" && (
        <>
          {pmtNearZero ? (
            <ExampleStep
              stepId="fin-n-log"
              title={page.stepNLogTitle}
              math={
                <>
                  <Var>N</Var> <MathOp op="=" /> log(
                  <Num>{formatAmount(fv)}</Num> <MathOp op="/" />{" "}
                  <Num>{formatAmount(pv)}</Num>) <MathOp op="/" /> log(
                  <Num>{fmt(base)}</Num>) <MathOp op="=" />{" "}
                  <Num>{fmt(solved, 4)}</Num>
                </>
              }
            />
          ) : (
            <ExampleStep
              stepId="fin-n-bis"
              title={page.stepNBisectionTitle}
              math={
                <>
                  FV(N) <MathOp op="=" /> 目標 <Num>{formatAmount(fv)}</Num>{" "}
                  になる N を二分法で探索
                </>
              }
            />
          )}
          <ExampleStep
            stepId="fin-n-res"
            title={page.stepNResultTitle}
            math={
              <>
                <Var>N</Var> <MathOp op="=" /> <Num>{fmt(solved, 4)}</Num>
              </>
            }
          />
          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel}: {formatTemplate(page.resultN, fmt(solved, 4))}
          </p>
        </>
      )}
    </SurfacePanel>
  );
}

export function FinancialCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const tFin = t.financial;
  const tPage = t.financialPage;

  const [solveFor, setSolveFor] = useState<TvmSolveTarget>("FV");
  const [pv, setPv] = useState("100000");
  const [fv, setFv] = useState("0");
  const [pmt, setPmt] = useState("0");
  const [rate, setRate] = useState("5");
  const [periods, setPeriods] = useState("10");
  const [result, setResult] = useState<TvmResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const values: Record<TvmSolveTarget, string> = {
    PV: pv,
    FV: fv,
    PMT: pmt,
    IY: rate,
    N: periods,
  };

  const setters: Record<TvmSolveTarget, (v: string) => void> = {
    PV: setPv,
    FV: setFv,
    PMT: setPmt,
    IY: setRate,
    N: setPeriods,
  };

  function handleCalculate() {
    try {
      const inputs = {
        pv: parseFloat(pv),
        fv: parseFloat(fv),
        pmt: parseFloat(pmt),
        ratePercent: parseFloat(rate),
        periods: parseFloat(periods),
      };

      const res = solveTimeValueOfMoney(solveFor, inputs);
      setResult(res);
      setError(null);
      addEntry({
        expression: `TVM solve ${solveFor}`,
        result: formatTvmValue(solveFor, res.solvedValue),
        route: "/financial-calculator",
      });
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : t.common.invalidInput);
    }
  }

  function handleClear() {
    setSolveFor("FV");
    setPv("100000");
    setFv("0");
    setPmt("0");
    setRate("5");
    setPeriods("10");
    setResult(null);
    setError(null);
  }

  const solveLabels: Record<TvmSolveTarget, string> = {
    PV: tFin.presentValue,
    FV: tFin.futureValue,
    PMT: tFin.periodicPayment,
    IY: tFin.ratePerPeriod,
    N: tFin.periods,
  };

  const pvNum = parseFloat(pv);
  const fvNum = parseFloat(fv);
  const pmtNum = parseFloat(pmt);
  const rateNum = parseFloat(rate);
  const periodsNum = parseFloat(periods);

  return (
    <>
      <CalculatorCard
        title={tPage.title}
        description={tPage.description}
        actions={
          result ? (
            <CopyResultButton
              value={formatTvmValue(solveFor, result.solvedValue)}
            />
          ) : undefined
        }
      >
        <div className="space-y-4">
          <div>
            <span className="mb-2 block text-sm font-medium text-text-secondary">
              {tFin.solveFor}
            </span>
            <SegmentedControl
              value={solveFor}
              onChange={setSolveFor}
              columns={5}
              options={SOLVE_TARGETS.map((target) => ({
                value: target,
                label: target,
              }))}
            />
          </div>

          {SOLVE_TARGETS.map((target) => {
            if (target === solveFor) return null;
            return (
              <FormField
                key={target}
                label={solveLabels[target]}
                type="number"
                inputMode="decimal"
                value={values[target]}
                onChange={(e) => setters[target](e.target.value)}
              />
            );
          })}

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
              <div className="space-y-3">
                <ResultCard
                  label={tFin.solvedValue}
                  value={formatTvmValue(solveFor, result.solvedValue)}
                  highlight
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultCard
                    label={tFin.totalPayments}
                    value={formatYen(result.totalPayments)}
                  />
                  <ResultCard
                    label={tFin.interestDifference}
                    value={formatYen(result.interestDifference)}
                  />
                </div>
              </div>

              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {tPage.answerHeading}
                </h3>
                <SurfacePanel className="flex items-center justify-center">
                  <MathEq>
                    <Var>{solveFor === "IY" ? "I/Y" : solveFor}</Var>
                    <MathOp op="=" />
                    <span>
                      {formatTvmValue(solveFor, result.solvedValue)}
                    </span>
                  </MathEq>
                </SurfacePanel>
              </Divider>

              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">
                  {tPage.stepsHeading}
                </h3>
                <FinancialStepsPanel
                  solveFor={solveFor}
                  pv={pvNum}
                  fv={fvNum}
                  pmt={pmtNum}
                  rate={rateNum}
                  periods={periodsNum}
                  solved={result.solvedValue}
                  page={tPage}
                />
              </Divider>
            </div>
          )}

          <SurfacePanel className="mt-4">
            <h3 className="text-sm font-semibold text-text-primary">
              {tFin.explanationTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {tFin.explanationText}
            </p>
          </SurfacePanel>
        </div>
      </CalculatorCard>


      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={tPage.introParagraph} />
      </p>

      <CalculatorHowToSection
        title={tPage.howToTitle}
        steps={tPage.howToSteps}
      />

      <CalculatorFaqSection
        title={tPage.faqTitle}
        items={tPage.faqItems}
      />
      <RelatedCalculators activeHref="/financial-calculator" />
        </>
  );
}
