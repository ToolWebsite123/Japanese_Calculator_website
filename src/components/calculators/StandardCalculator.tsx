"use client";

import { useCallback, useEffect, useState } from "react";
import { Display } from "@/components/calculator/Display";
import { ButtonGrid, type ButtonConfig } from "@/components/calculator/ButtonGrid";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { HistoryPanel } from "@/components/calculator/HistoryPanel";
import { FormCard } from "@/components/ui/FormField";
import { ChipButton } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import { buildEvalExpression } from "@/lib/calculators/expression-input";
import { useCalculatorInput } from "@/components/calculator/useCalculatorInput";
import { evaluateExpression } from "@/lib/calculators/standard";
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

  // Single memory cell; MC/MR/M+/M− act on it. (The options strip that
  // switched between M1–M3 cells, the tax rate, the evaluation order and
  // the decimal places was removed from the homepage calculator by the
  // owner's decision 2026-11-03, so the settings are fixed at their
  // defaults: memory cell 1, tax rate 10%, "math" evaluation order —
  // operator precedence, 2+2×2=6 — and automatic decimal formatting.)
  const [memory, setMemory] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const taxRate = 10;

  // AC also resets the grand total, like a physical desk calculator.
  const resetGrandTotal = useCallback(() => setGrandTotal(0), []);
  const {
    display,
    setDisplay,
    expression,
    setExpression,
    justEvaluated,
    setJustEvaluated,
    awaitingOperand,
    setAwaitingOperand,
    error,
    setError,
    inputDigit,
    inputOperator,
    handleClear,
    handleBackspace,
    handlePercent,
    handleParen,
    toggleSign,
  } = useCalculatorInput(resetGrandTotal);

  const handleEquals = useCallback(() => {
    if (justEvaluated) return;
    try {
      const full = buildEvalExpression(expression, display, awaitingOperand);
      if (!full) return;
      const result = evaluateExpression(normalizeExpr(full));
      const formatted = formatDisplayNumber(result);
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
  }, [justEvaluated, expression, display, awaitingOperand, addEntry]);

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

  const handleMemory = useCallback(
    (action: "MC" | "MR" | "M+" | "M-") => {
      const val = parseFloat(display);
      switch (action) {
        case "MC":
          setMemory(0);
          break;
        case "MR":
          setDisplay(formatDisplayNumber(memory));
          setJustEvaluated(false);
          setAwaitingOperand(false);
          break;
        case "M+":
          // Also allow right after "=" so the displayed result can be
          // stored, like a physical desk calculator (guide example).
          if (Number.isFinite(val) && (!awaitingOperand || justEvaluated))
            setMemory((m) => m + val);
          break;
        case "M-":
          if (Number.isFinite(val) && (!awaitingOperand || justEvaluated))
            setMemory((m) => m - val);
          break;
      }
    },
    [display, memory, awaitingOperand, justEvaluated],
  );

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
      <FormCard
        actions={
          <div className="flex items-center gap-2">
            <ChipButton onClick={() => setHistoryOpen(true)}>{t.nav.history}</ChipButton>
            <CopyResultButton value={error ? "" : display} />
          </div>
        }
        compact={compact}
        maxWidthClass={maxWidthClass}
      >
        <div className={compact ? "space-y-2 md:space-y-1" : "space-y-4"}>
          <Display
            expression={expression}
            value={display}
            memoryActive={memory !== 0}
            compact={compact}
          />
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <div className="min-w-[280px]">
              <ButtonGrid buttons={keypad} columns={4} compact={compact} />
            </div>
          </div>
        </div>
      </FormCard>
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
