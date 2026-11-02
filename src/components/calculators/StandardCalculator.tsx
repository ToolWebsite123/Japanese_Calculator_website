"use client";

import { useCallback, useEffect, useState } from "react";
import { Display } from "@/components/calculator/Display";
import { ButtonGrid, type ButtonConfig } from "@/components/calculator/ButtonGrid";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { HistoryPanel } from "@/components/calculator/HistoryPanel";
import { CalculatorCard } from "@/components/ui/FormField";
import { ChipButton } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import {
  appendOperator,
  buildEvalExpression,
  closeParenthesis,
  openParenthesis,
} from "@/lib/calculators/expression-input";
import { evaluateExpression, type EvaluationMode } from "@/lib/calculators/standard";
import { sqrtValue, taxExcluded, taxIncluded } from "@/lib/calculators/desk-features";
import { formatDisplayNumber, CALCULATOR_ERROR_DISPLAY } from "@/lib/format";

function normalizeExpr(expr: string): string {
  return expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
}

export function StandardCalculator({
  title,
  description,
  compact = false,
  maxWidthClass,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
  maxWidthClass?: string;
} = {}) {
  const { t } = useLocale();
  const { addEntry } = useHistory();

  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  // Three independent memory cells (M1–M3); the M1 chip cycles the
  // active cell and MC/MR/M+/M− act on the active one.
  const [memoryCells, setMemoryCells] = useState<[number, number, number]>([0, 0, 0]);
  const [activeCell, setActiveCell] = useState(0);
  const memory = memoryCells[activeCell];
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [awaitingOperand, setAwaitingOperand] = useState(true);
  const [error, setError] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [taxRate, setTaxRate] = useState<10 | 8>(10);
  // "math" applies operator precedence (2+2×2=6); "chain" evaluates
  // strictly left-to-right like a basic desk calculator (2+2×2=8).
  const [mode, setMode] = useState<EvaluationMode>("math");
  // Fixed decimal places for results, or "auto" for the default format.
  const [decimals, setDecimals] = useState<"auto" | number>("auto");

  const formatResult = useCallback(
    (value: number): string =>
      decimals === "auto" ? formatDisplayNumber(value) : value.toFixed(decimals),
    [decimals],
  );

  const inputDigit = useCallback(
    (digit: string) => {
      setError(false);
      setAwaitingOperand(false);
      if (justEvaluated) {
        setDisplay(digit === "." ? "0." : digit);
        setExpression("");
        setJustEvaluated(false);
        return;
      }
      setDisplay((prev) => {
        if (prev === "0" && digit !== ".") return digit;
        if (digit === "." && prev.includes(".")) return prev;
        if (prev.length >= 16) return prev;
        return prev + digit;
      });
    },
    [justEvaluated],
  );

  const inputOperator = useCallback(
    (op: string) => {
      setError(false);
      const current = error ? "0" : display;
      if (justEvaluated) {
        setExpression(`${current} ${op} `);
        setJustEvaluated(false);
        setDisplay("0");
        setAwaitingOperand(true);
        return;
      }
      setExpression((prev) => appendOperator(prev, current, op, awaitingOperand));
      setDisplay("0");
      setAwaitingOperand(true);
    },
    [display, error, justEvaluated, awaitingOperand],
  );

  const handleEquals = useCallback(() => {
    if (justEvaluated) return;
    try {
      const full = buildEvalExpression(expression, display, awaitingOperand);
      if (!full) return;
      const result = evaluateExpression(normalizeExpr(full), mode);
      const formatted = formatResult(result);
      setExpression(full);
      setDisplay(formatted);
      setJustEvaluated(true);
      setAwaitingOperand(true);
      setError(false);
      setGrandTotal((gt) => gt + result);
      addEntry({ expression: full, result: formatted, route: "/" });
    } catch {
      setDisplay(CALCULATOR_ERROR_DISPLAY);
      setError(true);
      setJustEvaluated(true);
      setAwaitingOperand(true);
    }
  }, [justEvaluated, expression, display, awaitingOperand, addEntry, mode, formatResult]);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setJustEvaluated(false);
    setAwaitingOperand(true);
    setError(false);
    // AC also resets the grand total, like a physical desk calculator.
    setGrandTotal(0);
  }, []);

  const handleGrandTotal = useCallback(() => {
    setError(false);
    setDisplay(formatDisplayNumber(grandTotal));
    setJustEvaluated(false);
    setAwaitingOperand(false);
  }, [grandTotal]);

  const handleTax = useCallback(
    (included: boolean) => {
      const val = parseFloat(display);
      if (!Number.isFinite(val) || error) return;
      const converted = included ? taxIncluded(val, taxRate) : taxExcluded(val, taxRate);
      setDisplay(formatDisplayNumber(converted));
      setAwaitingOperand(false);
      setError(false);
    },
    [display, error, taxRate],
  );

  const handleSqrt = useCallback(() => {
    const val = parseFloat(display);
    const result = Number.isFinite(val) ? sqrtValue(val) : null;
    if (result === null) {
      setDisplay(CALCULATOR_ERROR_DISPLAY);
      setError(true);
      setJustEvaluated(true);
      setAwaitingOperand(true);
      return;
    }
    setDisplay(formatDisplayNumber(result));
    setAwaitingOperand(false);
    setError(false);
  }, [display]);

  const handleDoubleZero = useCallback(() => {
    setError(false);
    setAwaitingOperand(false);
    if (justEvaluated) {
      setDisplay("0");
      setExpression("");
      setJustEvaluated(false);
      return;
    }
    setDisplay((prev) => {
      if (prev === "0" || prev.length >= 15) return prev;
      return `${prev}00`;
    });
  }, [justEvaluated]);

  const handleBackspace = useCallback(() => {
    if (justEvaluated || error) {
      handleClear();
      return;
    }
    setDisplay((prev) => {
      const next = prev.length <= 1 ? "0" : prev.slice(0, -1);
      if (next === "0") setAwaitingOperand(true);
      return next;
    });
  }, [justEvaluated, error, handleClear]);

  const handlePercent = useCallback(() => {
    const val = parseFloat(display);
    if (!Number.isFinite(val)) return;
    setDisplay(formatDisplayNumber(val / 100));
    setAwaitingOperand(false);
  }, [display]);

  const handleParen = useCallback(
    (paren: "(" | ")") => {
      setError(false);
      if (justEvaluated) {
        setExpression(paren === "(" ? "(" : "");
        setDisplay("0");
        setJustEvaluated(false);
        setAwaitingOperand(true);
        return;
      }
      if (paren === "(") {
        setExpression((prev) => openParenthesis(prev, display, awaitingOperand));
        setDisplay("0");
        setAwaitingOperand(true);
      } else {
        setExpression((prev) => closeParenthesis(prev, display, awaitingOperand));
        setDisplay("0");
        setAwaitingOperand(true);
      }
    },
    [display, justEvaluated, awaitingOperand],
  );

  const handleMemory = useCallback(
    (action: "MC" | "MR" | "M+" | "M-") => {
      const val = parseFloat(display);
      const setCell = (fn: (v: number) => number) =>
        setMemoryCells(
          (cells) =>
            cells.map((c, i) => (i === activeCell ? fn(c) : c)) as [number, number, number],
        );
      switch (action) {
        case "MC":
          setCell(() => 0);
          break;
        case "MR":
          setDisplay(formatDisplayNumber(memory));
          setJustEvaluated(false);
          setAwaitingOperand(false);
          break;
        case "M+":
          // Also allow right after "=" so the displayed result can be
          // stored, like a physical desk calculator (guide example).
          if (Number.isFinite(val) && (!awaitingOperand || justEvaluated)) setCell((m) => m + val);
          break;
        case "M-":
          if (Number.isFinite(val) && (!awaitingOperand || justEvaluated)) setCell((m) => m - val);
          break;
      }
    },
    [display, memory, awaitingOperand, justEvaluated, activeCell],
  );

  const toggleSign = useCallback(() => {
    setDisplay((d) => {
      if (d === "0" || d === CALCULATOR_ERROR_DISPLAY) return d;
      setAwaitingOperand(false);
      return d.startsWith("-") ? d.slice(1) : `-${d}`;
    });
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        inputDigit(e.key);
      } else if (e.key === ".") {
        e.preventDefault();
        inputDigit(".");
      } else if (e.key === "+") {
        e.preventDefault();
        inputOperator("+");
      } else if (e.key === "-") {
        e.preventDefault();
        inputOperator("−");
      } else if (e.key === "*" || e.key === "x") {
        e.preventDefault();
        inputOperator("×");
      } else if (e.key === "/") {
        e.preventDefault();
        inputOperator("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClear();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "%") {
        e.preventDefault();
        handlePercent();
      } else if (e.key === "(") {
        e.preventDefault();
        handleParen("(");
      } else if (e.key === ")") {
        e.preventDefault();
        handleParen(")");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    inputDigit,
    inputOperator,
    handleEquals,
    handleClear,
    handleBackspace,
    handlePercent,
    handleParen,
  ]);

  const keypad: ButtonConfig[] = [
    { id: "mc", label: "MC", variant: "memory", onClick: () => handleMemory("MC") },
    { id: "mr", label: "MR", variant: "memory", onClick: () => handleMemory("MR") },
    { id: "m+", label: "M+", variant: "memory", onClick: () => handleMemory("M+") },
    { id: "m-", label: "M−", variant: "memory", onClick: () => handleMemory("M-") },
    { id: "tax-in", label: "税込", variant: "function", onClick: () => handleTax(true) },
    { id: "tax-out", label: "税抜", variant: "function", onClick: () => handleTax(false) },
    { id: "gt", label: "GT", variant: "function", onClick: handleGrandTotal },
    { id: "sqrt", label: "√", variant: "function", onClick: handleSqrt },
    { id: "ac", label: "AC", variant: "danger", onClick: handleClear },
    { id: "bs", label: "⌫", variant: "function", onClick: handleBackspace },
    { id: "pct", label: "%", variant: "function", onClick: handlePercent },
    { id: "div", label: "÷", variant: "operator", onClick: () => inputOperator("÷") },
    { id: "lp", label: "(", variant: "function", onClick: () => handleParen("(") },
    { id: "rp", label: ")", variant: "function", onClick: () => handleParen(")") },
    { id: "pm", label: "±", variant: "function", onClick: toggleSign },
    { id: "mul", label: "×", variant: "operator", onClick: () => inputOperator("×") },
    { id: "7", label: "7", onClick: () => inputDigit("7") },
    { id: "8", label: "8", onClick: () => inputDigit("8") },
    { id: "9", label: "9", onClick: () => inputDigit("9") },
    { id: "sub", label: "−", variant: "operator", onClick: () => inputOperator("−") },
    { id: "4", label: "4", onClick: () => inputDigit("4") },
    { id: "5", label: "5", onClick: () => inputDigit("5") },
    { id: "6", label: "6", onClick: () => inputDigit("6") },
    { id: "add", label: "+", variant: "operator", onClick: () => inputOperator("+") },
    { id: "1", label: "1", onClick: () => inputDigit("1") },
    { id: "2", label: "2", onClick: () => inputDigit("2") },
    { id: "3", label: "3", onClick: () => inputDigit("3") },
    { id: "eq", label: "=", variant: "equals", onClick: handleEquals },
    { id: "0", label: "0", span: 2, onClick: () => inputDigit("0") },
    { id: "00", label: "00", onClick: handleDoubleZero },
    { id: "dot", label: ".", onClick: () => inputDigit(".") },
  ];

  return (
    <>
      <CalculatorCard
        actions={
          <div className="flex items-center gap-2">
            <ChipButton onClick={() => setHistoryOpen(true)}>{t.nav.history}</ChipButton>
            <CopyResultButton value={error ? "" : display} />
          </div>
        }
        compact={compact}
        maxWidthClass={maxWidthClass}
      >
        <div className={compact ? "space-y-3 md:space-y-1.5" : "space-y-4"}>
          <Display
            expression={expression}
            value={display}
            memoryActive={memory !== 0}
            compact={compact}
          />
          <div className="flex items-center justify-between gap-2 px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-text-secondary">税率</span>
              {([10, 8] as const).map((rate) => (
                <button
                  key={rate}
                  type="button"
                  aria-pressed={taxRate === rate}
                  onClick={() => setTaxRate(rate)}
                  className={
                    taxRate === rate
                      ? "rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white"
                      : "rounded-full border border-border bg-surface-sunken/80 px-2.5 py-1 text-xs font-medium text-text-secondary transition hover:text-text-primary dark:bg-surface-dark/60"
                  }
                >
                  {rate}%
                </button>
              ))}
            </div>
            {grandTotal !== 0 && (
              <span className="text-xs font-medium text-text-secondary">
                GT: {formatDisplayNumber(grandTotal)}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-text-secondary">計算順序</span>
              {(
                [
                  { value: "math", label: "標準", title: "乗除を先に計算します（2+2×2=6）" },
                  {
                    value: "chain",
                    label: "左から順に",
                    title: "入力した順に計算します（2+2×2=8）",
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  title={opt.title}
                  aria-pressed={mode === opt.value}
                  onClick={() => setMode(opt.value)}
                  className={
                    mode === opt.value
                      ? "rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white"
                      : "rounded-full border border-border bg-surface-sunken/80 px-2.5 py-1 text-xs font-medium text-text-secondary transition hover:text-text-primary dark:bg-surface-dark/60"
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                title="メモリーセルを切り替えます（M1〜M3）"
                aria-label={`メモリーセル切り替え、現在 M${activeCell + 1}`}
                onClick={() => setActiveCell((c) => (c + 1) % 3)}
                className="rounded-full border border-border bg-surface-sunken/80 px-2.5 py-1 text-xs font-bold text-brand transition hover:text-brand dark:bg-surface-dark/60"
              >
                M{activeCell + 1}
              </button>
              <label className="flex items-center gap-1 text-xs font-medium text-text-secondary">
                小数
                <select
                  value={String(decimals)}
                  onChange={(e) =>
                    setDecimals(e.target.value === "auto" ? "auto" : Number(e.target.value))
                  }
                  aria-label="結果の小数点以下の桁数"
                  className="rounded-full border border-border bg-surface-sunken/80 px-2 py-1 text-xs font-medium text-text-secondary dark:bg-surface-dark/60"
                >
                  <option value="auto">自動</option>
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}桁
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <div className="min-w-[280px]">
              <ButtonGrid buttons={keypad} columns={4} compact={compact} />
            </div>
          </div>
        </div>
      </CalculatorCard>
      <HistoryPanel
        route="/"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={(expression, result) => {
          setExpression(expression);
          setDisplay(result);
          setJustEvaluated(true);
          setAwaitingOperand(true);
          setError(false);
        }}
      />
    </>
  );
}
