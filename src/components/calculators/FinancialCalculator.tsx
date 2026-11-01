"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CalculatorCard, FormField, ResultCard } from "@/components/ui/FormField";
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
import { MathEq, MathFraction, MathOp, MathPower } from "@/components/ui/MathDisplay";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import {
  solveTimeValueOfMoney,
  tvmFutureValue,
  type TvmResult,
  type TvmSolveTarget,
} from "@/lib/calculators/financial";
import { formatDisplayNumber, formatYen } from "@/lib/format";
import { calculateLoan, type RepaymentType } from "@/lib/calculators/loan";

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
  return values.reduce((text, value, index) => text.replace(`{${index}}`, value), template);
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
            <Var>i</Var> <MathOp op="=" /> <MathFraction num={fmt(rate)} den={100} />{" "}
            <MathOp op="=" /> <Num>{fmt(i)}</Num>
          </>
        }
      />
      <ExampleStep
        stepId="fin-add1"
        title={page.stepAddOneTitle}
        math={
          <>
            1 <MathOp op="+" /> <Num>{fmt(i)}</Num> <MathOp op="=" /> <Num>{fmt(base)}</Num>
          </>
        }
      />
      <ExampleStep
        stepId="fin-pow"
        title={page.stepPowerTitle}
        math={
          <>
            <MathPower base={fmt(base)} exponent={fmt(periods, 4)} /> <MathOp op="=" />{" "}
            <Num>{fmt(growth, 5)}</Num>
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
  const annuity = Math.abs(i) < 1e-12 ? periods : (Math.pow(base, periods) - 1) / i;
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
          fmt(periods, 4),
        );
      case "PV":
        return formatTemplate(
          page.scenarioPv,
          formatAmount(fv),
          formatAmount(pmt),
          fmt(rate),
          fmt(periods, 4),
        );
      case "PMT":
        return formatTemplate(
          page.scenarioPmt,
          formatAmount(pv),
          formatAmount(fv),
          fmt(rate),
          fmt(periods, 4),
        );
      case "IY":
        return formatTemplate(
          page.scenarioIy,
          formatAmount(pv),
          formatAmount(fv),
          formatAmount(pmt),
          fmt(periods, 4),
        );
      case "N":
        return formatTemplate(
          page.scenarioN,
          formatAmount(pv),
          formatAmount(fv),
          formatAmount(pmt),
          fmt(rate),
        );
    }
  })();

  return (
    <SurfacePanel className="space-y-2">
      <div>
        <h3 className="font-bold text-text-primary">{page.scenarioTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">{scenario}</p>
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
                <Var>FV</Var> <MathOp op="=" /> <Var>PV</Var> <MathOp op="×" /> (1 <MathOp op="+" />{" "}
                <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>
              </>
            ) : (
              <>
                <Var>FV</Var> <MathOp op="=" /> <Var>PV</Var> <MathOp op="×" /> (1 <MathOp op="+" />{" "}
                <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>{" "}
                <MathOp op="+" /> <Var>PMT</Var> <MathOp op="×" /> ((1 <MathOp op="+" />{" "}
                <Var>i</Var>)
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
                <Var>PV</Var> <MathOp op="=" /> <Var>FV</Var> <MathOp op="/" /> (1 <MathOp op="+" />{" "}
                <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>
              </>
            ) : (
              <>
                <Var>PV</Var> <MathOp op="=" /> (<Var>FV</Var> <MathOp op="−" /> <Var>PMT</Var>{" "}
                <MathOp op="×" /> af) <MathOp op="/" /> (1 <MathOp op="+" /> <Var>i</Var>)
                <sup className="ml-0.5 text-[0.65em] font-medium">
                  <Var>n</Var>
                </sup>
              </>
            )}
          </MathEq>
        )}
        {solveFor === "PMT" && (
          <MathEq>
            <Var>PMT</Var> <MathOp op="=" /> (<Var>FV</Var> <MathOp op="−" /> <Var>PV</Var>{" "}
            <MathOp op="×" /> (1 <MathOp op="+" /> <Var>i</Var>)
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
            <Var>FV</Var> <MathOp op="=" /> <Var>PV</Var> <MathOp op="×" /> (1 <MathOp op="+" />{" "}
            <Var>i</Var>)
            <sup className="ml-0.5 text-[0.65em] font-medium">
              <Var>n</Var>
            </sup>{" "}
            <MathOp op="+" /> <Var>PMT</Var> <MathOp op="×" /> af → <Var>i</Var> を二分法で逆算
          </MathEq>
        )}
        {solveFor === "N" && (
          <MathEq>
            {pmtNearZero ? (
              <>
                <Var>N</Var> <MathOp op="=" /> log(<Var>FV</Var> <MathOp op="/" /> <Var>PV</Var>){" "}
                <MathOp op="/" /> log(1 <MathOp op="+" /> <Var>i</Var>)
              </>
            ) : (
              <>
                <Var>FV</Var> <MathOp op="=" /> f(<Var>N</Var>) → <Var>N</Var> を二分法で逆算
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

      {(solveFor === "FV" || solveFor === "PV" || solveFor === "PMT") && !pmtNearZero && (
        <ExampleStep
          stepId="fin-af"
          title={page.stepAnnuityTitle}
          math={
            <>
              ((1 <MathOp op="+" /> <Var>i</Var>)
              <sup className="ml-0.5 text-[0.65em] font-medium">
                <Var>n</Var>
              </sup>{" "}
              <MathOp op="−" /> 1) <MathOp op="/" /> <Var>i</Var> <MathOp op="=" />{" "}
              <Num>{fmt(annuity, 5)}</Num>
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
                  <Var>FV</Var> <MathOp op="=" /> <Num>{formatAmount(pv)}</Num> <MathOp op="×" />{" "}
                  <Num>{fmt(growth, 5)}</Num>
                </>
              ) : (
                <>
                  <Var>FV</Var> <MathOp op="=" /> <Num>{formatAmount(pv)}</Num> <MathOp op="×" />{" "}
                  <Num>{fmt(growth, 5)}</Num> <MathOp op="+" /> <Num>{formatAmount(pmt)}</Num>{" "}
                  <MathOp op="×" /> <Num>{fmt(annuity, 5)}</Num>
                </>
              )
            }
          />
          <ExampleStep
            stepId="fin-fv-res"
            title={page.stepFvResultTitle}
            math={
              <>
                <Var>FV</Var> <MathOp op="=" /> <Num>{formatAmount(solved)}</Num>
              </>
            }
          />
          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel}: {formatTemplate(page.resultFv, `${formatAmount(solved)}円`)}
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
                  <Var>PV</Var> <MathOp op="=" /> <Num>{formatAmount(fv)}</Num> <MathOp op="/" />{" "}
                  <Num>{fmt(growth, 5)}</Num>
                </>
              ) : (
                <>
                  <Var>PV</Var> <MathOp op="=" /> (<Num>{formatAmount(fv)}</Num> <MathOp op="−" />{" "}
                  <Num>{formatAmount(pmt)}</Num> <MathOp op="×" /> <Num>{fmt(annuity, 5)}</Num>){" "}
                  <MathOp op="/" /> <Num>{fmt(growth, 5)}</Num>
                </>
              )
            }
          />
          <ExampleStep
            stepId="fin-pv-res"
            title={page.stepPvResultTitle}
            math={
              <>
                <Var>PV</Var> <MathOp op="=" /> <Num>{formatAmount(solved)}</Num>
              </>
            }
          />
          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel}: {formatTemplate(page.resultPv, `${formatAmount(solved)}円`)}
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
                <Num>{formatAmount(fv)}</Num> <MathOp op="−" /> <Num>{formatAmount(pv)}</Num>{" "}
                <MathOp op="×" /> <Num>{fmt(growth, 5)}</Num> <MathOp op="=" />{" "}
                <Num>{formatAmount(fv - pv * growth)}</Num>
              </>
            }
          />
          <ExampleStep
            stepId="fin-pmt-div"
            title={page.stepPmtDivideTitle}
            math={
              <>
                <Var>PMT</Var> <MathOp op="=" /> <Num>{formatAmount(fv - pv * growth)}</Num>{" "}
                <MathOp op="/" /> <Num>{fmt(annuity, 5)}</Num>
              </>
            }
          />
          <ExampleStep
            stepId="fin-pmt-res"
            title={page.stepPmtResultTitle}
            math={
              <>
                <Var>PMT</Var> <MathOp op="=" /> <Num>{formatAmount(solved)}</Num>
              </>
            }
          />
          <p className="mt-2 text-sm font-semibold text-text-primary sm:text-base">
            {page.resultLabel}: {formatTemplate(page.resultPmt, `${formatAmount(solved)}円`)}
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
                mid <MathOp op="=" /> (lo <MathOp op="+" /> hi) <MathOp op="/" /> 2{" "}
                <MathOp op="≈" /> <Num>{fmt(iyMid1, 4)}</Num>%
              </>,
              <>
                FV(mid) <MathOp op="≈" />{" "}
                <Num>{Number.isFinite(iyFv1) ? formatAmount(iyFv1) : "—"}</Num>
                、目標 FV <MathOp op="=" /> <Num>{formatAmount(fv)}</Num>
              </>,
            ]}
          />
          <ExampleStep
            stepId="fin-iy-conv"
            title={page.stepIyConvergeTitle}
            math={
              <>
                |FV(mid) <MathOp op="−" /> FV| が十分小さくなるまで mid を更新
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
                  <Num>{formatAmount(fv)}</Num> <MathOp op="/" /> <Num>{formatAmount(pv)}</Num>){" "}
                  <MathOp op="/" /> log(
                  <Num>{fmt(base)}</Num>) <MathOp op="=" /> <Num>{fmt(solved, 4)}</Num>
                </>
              }
            />
          ) : (
            <ExampleStep
              stepId="fin-n-bis"
              title={page.stepNBisectionTitle}
              math={
                <>
                  FV(N) <MathOp op="=" /> 目標 <Num>{formatAmount(fv)}</Num> になる N を二分法で探索
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
  const [mode, setMode] = useState<"tvm" | "loan">("tvm");
  const [loanPrincipal, setLoanPrincipal] = useState("3000000");
  const [loanRate, setLoanRate] = useState("3");
  const [loanYears, setLoanYears] = useState("5");
  const [repaymentType, setRepaymentType] = useState<RepaymentType>("equal_payment");

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

  const computed = useMemo(() => {
    try {
      const res = solveTimeValueOfMoney(solveFor, {
        pv: parseFloat(pv),
        fv: parseFloat(fv),
        pmt: parseFloat(pmt),
        ratePercent: parseFloat(rate),
        periods: parseFloat(periods),
      });
      return { result: res as TvmResult, error: null as string | null };
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : t.common.invalidInput,
      };
    }
  }, [solveFor, pv, fv, pmt, rate, periods, t.common.invalidInput]);
  const result = computed.result;
  const error = mode === "tvm" ? computed.error : null;

  const loanComputed = useMemo(() => {
    try {
      const res = calculateLoan(
        parseFloat(loanPrincipal),
        parseFloat(loanRate),
        parseFloat(loanYears),
        repaymentType,
      );
      return { result: res, error: null as string | null };
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : t.common.invalidInput,
      };
    }
  }, [loanPrincipal, loanRate, loanYears, repaymentType, t.common.invalidInput]);

  const loggedKeyRef = useRef<string>("");
  useEffect(() => {
    if (mode === "tvm") {
      if (!computed.result) return;
      const key = `TVM|${solveFor}|${pv}|${fv}|${pmt}|${rate}|${periods}`;
      if (loggedKeyRef.current === key) return;
      const timer = setTimeout(() => {
        loggedKeyRef.current = key;
        addEntry({
          expression: `TVM solve ${solveFor}`,
          result: formatTvmValue(solveFor, computed.result!.solvedValue),
          route: "/financial-calculator",
        });
      }, 1200);
      return () => clearTimeout(timer);
    }
    if (!loanComputed.result) return;
    const key = `LOAN|${loanPrincipal}|${loanRate}|${loanYears}|${repaymentType}`;
    if (loggedKeyRef.current === key) return;
    const timer = setTimeout(() => {
      loggedKeyRef.current = key;
      addEntry({
        expression: `ローン ${loanPrincipal}円 ${loanRate}% ${loanYears}年`,
        result: formatYen(loanComputed.result!.monthlyPayment),
        route: "/financial-calculator",
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [mode, computed, loanComputed, solveFor, pv, fv, pmt, rate, periods, loanPrincipal, loanRate, loanYears, repaymentType, addEntry]);

  function handleClear() {
    if (mode === "loan") {
      setLoanPrincipal("3000000");
      setLoanRate("3");
      setLoanYears("5");
      setRepaymentType("equal_payment");
      return;
    }
    setSolveFor("FV");
    setPv("100000");
    setFv("0");
    setPmt("0");
    setRate("5");
    setPeriods("10");
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
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {tPage.title}
      </h1>
      <CalculatorCard
        compact
        actions={
          mode === "tvm" && result ? (
            <CopyResultButton value={formatTvmValue(solveFor, result.solvedValue)} />
          ) : mode === "loan" && loanComputed.result ? (
            <CopyResultButton value={formatYen(loanComputed.result.monthlyPayment)} />
          ) : undefined
        }
      >
        <div className="space-y-4">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            columns={2}
            options={[
              { value: "tvm" as const, label: tFin.modeTvm },
              { value: "loan" as const, label: tFin.modeLoan },
            ]}
          />
          {mode === "loan" ? (
            <>
              <FormField
                label={tFin.loanPrincipal}
                type="number"
                inputMode="decimal"
                value={loanPrincipal}
                onChange={(e) => setLoanPrincipal(e.target.value)}
              />
              <FormField
                label={tFin.loanRate}
                type="number"
                inputMode="decimal"
                value={loanRate}
                onChange={(e) => setLoanRate(e.target.value)}
              />
              <FormField
                label={tFin.loanYears}
                type="number"
                inputMode="decimal"
                value={loanYears}
                onChange={(e) => setLoanYears(e.target.value)}
              />
              <div>
                <span className="mb-2 block text-sm font-medium text-text-secondary">
                  {tFin.repaymentType}
                </span>
                <SegmentedControl
                  value={repaymentType}
                  onChange={setRepaymentType}
                  columns={2}
                  options={[
                    { value: "equal_payment" as const, label: tFin.equalPayment },
                    { value: "equal_principal" as const, label: tFin.equalPrincipal },
                  ]}
                />
              </div>
              <SecondaryButton fullWidth onClick={handleClear}>
                {t.common.clear}
              </SecondaryButton>
              {loanComputed.error && <ErrorMessage message={loanComputed.error} />}
              {loanComputed.result && (
                <div className="mt-8 space-y-6">
                  <div className="space-y-3">
                    <ResultCard
                      label={
                        repaymentType === "equal_payment"
                          ? tFin.monthlyPayment
                          : tFin.firstPayment
                      }
                      value={formatYen(loanComputed.result.monthlyPayment)}
                      highlight
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <ResultCard
                        label={tFin.loanTotalPayment}
                        value={formatYen(loanComputed.result.totalPayment)}
                      />
                      <ResultCard
                        label={tFin.loanTotalInterest}
                        value={formatYen(loanComputed.result.totalInterest)}
                      />
                      <ResultCard
                        label={tFin.lastPayment}
                        value={formatYen(loanComputed.result.lastPayment)}
                      />
                    </div>
                  </div>
                  <Divider>
                    <h3 className="mb-4 text-xl font-semibold text-text-primary">
                      {tFin.scheduleTitle}
                    </h3>
                    <div className="max-h-96 overflow-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-border bg-surface-sunken text-left">
                            <th className="px-3 py-2.5 font-semibold text-text-primary">回</th>
                            <th className="px-3 py-2.5 font-semibold text-text-primary">返済額</th>
                            <th className="px-3 py-2.5 font-semibold text-text-primary">元金</th>
                            <th className="px-3 py-2.5 font-semibold text-text-primary">利息</th>
                            <th className="px-3 py-2.5 font-semibold text-text-primary">残高</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loanComputed.result.schedule.map((row) => (
                            <tr key={row.period} className="border-b border-border">
                              <td className="px-3 py-2 text-text-secondary">{row.label}</td>
                              <td className="px-3 py-2 text-text-primary">{formatYen(row.payment)}</td>
                              <td className="px-3 py-2 text-text-secondary">{formatYen(row.principal)}</td>
                              <td className="px-3 py-2 text-text-secondary">{formatYen(row.interest)}</td>
                              <td className="px-3 py-2 text-text-secondary">{formatYen(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {loanComputed.result.scheduleMode === "yearly" && (
                      <p className="mt-3 text-sm text-text-secondary">{tFin.scheduleNote}</p>
                    )}
                  </Divider>
                </div>
              )}
            </>
          ) : (
            <>
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

          <SecondaryButton fullWidth onClick={handleClear}>
            {t.common.clear}
          </SecondaryButton>

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
                  <ResultCard label={tFin.totalPayments} value={formatYen(result.totalPayments)} />
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
                    <span>{formatTvmValue(solveFor, result.solvedValue)}</span>
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
            <h3 className="text-sm font-semibold text-text-primary">{tFin.explanationTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {tFin.explanationText}
            </p>
          </SurfacePanel>
            </>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {tPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={tPage.introParagraph} />
      </p>

      <section aria-labelledby="financial-formula-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="financial-formula-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {tPage.contentFormulaTitle}
        </h2>
        <div className="mt-4 space-y-3">
          {tPage.contentFormulaLines.map((line) => (
            <p key={line} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {line}
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="financial-examples-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="financial-examples-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {tPage.contentExamplesTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-left">
                <th className="px-3 py-2.5 font-semibold text-text-primary">条件</th>
                <th className="px-3 py-2.5 font-semibold text-text-primary">結果</th>
              </tr>
            </thead>
            <tbody>
              {tPage.contentExamplesRows.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  <td className="px-3 py-2.5 text-text-secondary">{row[0]}</td>
                  <td className="px-3 py-2.5 text-text-primary">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="financial-terms-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="financial-terms-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {tPage.guideTermsTitle}
        </h2>
        <div className="mt-6 space-y-3">
          {tPage.guideTerms.map((item) => (
            <div
              key={item.term}
              className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3"
            >
              <h3 className="text-sm font-semibold text-text-primary sm:text-base">{item.term}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary sm:text-base">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="financial-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="financial-mistakes-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {tPage.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {tPage.guideMistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={tPage.howToTitle} steps={tPage.howToSteps} />

      <CalculatorFaqSection title={tPage.faqTitle} items={tPage.faqItems} />
      <RelatedCalculators activeHref="/financial-calculator" />
    </>
  );
}
