"use client";

import { useCallback, useEffect, useState } from "react";
import { Display } from "@/components/calculator/Display";
import { ButtonGrid, type ButtonConfig } from "@/components/calculator/ButtonGrid";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { HistoryPanel } from "@/components/calculator/HistoryPanel";
import { ButtonGuideTable } from "@/components/calculator/ButtonGuideTable";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
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
import {
  evaluateScientific,
  primeFactorize,
  formatPrimeFactors,
  detectRepeatingDecimal,
  formatComplex,
  type AngleMode,
} from "@/lib/calculators/scientific";
import { formatDisplayNumber, parseNumericResult, CALCULATOR_ERROR_DISPLAY } from "@/lib/format";
import { SCIENTIFIC_BUTTON_GUIDE } from "@/lib/calculator-guides/scientific";

function toFraction(x: number, tolerance = 1.0e-6): string {
  if (x === 0) return "0";
  if (!Number.isFinite(x) || Number.isNaN(x)) return String(x);
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  let h1 = 1,
    h2 = 0,
    k1 = 0,
    k2 = 1;
  let b = x;
  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(x - h1 / k1) > x * tolerance);
  return k1 === 1 ? String(sign * h1) : `${sign * h1}/${k1}`;
}

function normalizeSciExpr(expr: string): string {
  return expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, String(Math.PI));
}

export function ScientificCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();

  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [mode, setMode] = useState<AngleMode>("deg");
  const [complexMode, setComplexMode] = useState(false);
  const [invMode, setInvMode] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [awaitingOperand, setAwaitingOperand] = useState(true);
  const [error, setError] = useState(false);
  const [variables, setVariables] = useState<Record<string, number>>({
    x: 0,
    y: 0,
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  });
  const [stoMode, setStoMode] = useState(false);
  const [pFactResult, setPFactResult] = useState<string | null>(null);
  const [memory, setMemory] = useState(0);
  const [isFraction, setIsFraction] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handlePFact = useCallback(() => {
    try {
      const val = parseFloat(display);
      const factors = primeFactorize(val);
      const formatted = formatPrimeFactors(factors);
      setPFactResult(formatted ? `${val} = ${formatted}` : null);
    } catch (e) {
      setPFactResult(e instanceof Error ? e.message : "無効な数値");
    }
  }, [display]);

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
    if (error) return;
    try {
      let full = buildEvalExpression(expression, display, awaitingOperand);

      const openCount = (full.match(/\(/g) || []).length;
      const closeCount = (full.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        full += ")".repeat(openCount - closeCount);
      }

      const result = evaluateScientific(normalizeSciExpr(full), mode, complexMode);
      const formatted =
        typeof result === "number" ? formatDisplayNumber(result) : formatComplex(result);
      setExpression(full);
      setDisplay(formatted);
      setJustEvaluated(true);
      setAwaitingOperand(true);
      setError(false);

      addEntry({ expression: full, result: formatted, route: "/scientific-calculator" });
    } catch {
      setDisplay(CALCULATOR_ERROR_DISPLAY);
      setError(true);
      setJustEvaluated(true);
      setAwaitingOperand(true);
    }
  }, [justEvaluated, expression, display, awaitingOperand, error, mode, complexMode, addEntry]);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setJustEvaluated(false);
    setAwaitingOperand(true);
    setError(false);
  }, []);

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

  const insertE = useCallback(() => {
    setDisplay(formatDisplayNumber(Math.E));
    setJustEvaluated(false);
    setAwaitingOperand(false);
  }, []);

  const handleEXP = useCallback(() => {
    setDisplay((prev) => {
      if (prev.includes("e") || prev.includes("E")) return prev;
      return prev + "e";
    });
    setAwaitingOperand(false);
  }, []);

  const { history } = useHistory();
  const handleAns = useCallback(() => {
    if (history.length > 0) {
      const numeric = parseNumericResult(history[0].result);
      if (numeric !== null) {
        setDisplay(formatDisplayNumber(numeric));
        setJustEvaluated(false);
        setAwaitingOperand(false);
      }
    }
  }, [history]);

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
          if (Number.isFinite(val) && !awaitingOperand) setMemory((m) => m + val);
          break;
        case "M-":
          if (Number.isFinite(val) && !awaitingOperand) setMemory((m) => m - val);
          break;
      }
    },
    [display, memory, awaitingOperand],
  );

  const handleVariable = useCallback(
    (varName: string) => {
      if (stoMode) {
        const val = parseFloat(display);
        if (Number.isFinite(val)) {
          setVariables((prev) => ({ ...prev, [varName]: val }));
        }
        setStoMode(false);
      } else {
        const val = variables[varName] ?? 0;
        setDisplay(formatDisplayNumber(val));
        setJustEvaluated(false);
        setAwaitingOperand(false);
      }
    },
    [stoMode, display, variables],
  );

  const applyFn = useCallback(
    (fn: string) => {
      setError(false);

      const postfixFns = ["square", "cube", "inv", "fact"];
      const isPostfix = postfixFns.includes(fn);

      if (justEvaluated) {
        if (isPostfix) {
          setExpression(`${fn}(${display})`);
        } else {
          setExpression(`${fn}(`);
        }
        setDisplay("0");
        setJustEvaluated(false);
        setAwaitingOperand(true);
        return;
      }

      if (isPostfix && awaitingOperand) {
        return;
      }

      setExpression((prev) => {
        if (isPostfix) {
          return `${prev}${fn}(${display})`;
        }

        if (!awaitingOperand) {
          return `${prev}${fn}(${display})`;
        }
        return `${prev}${fn}(`;
      });

      setDisplay("0");
      setAwaitingOperand(true);
    },
    [display, justEvaluated, awaitingOperand],
  );

  const insertPi = useCallback(() => {
    setDisplay(formatDisplayNumber(Math.PI));
    setJustEvaluated(false);
    setAwaitingOperand(false);
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay((d) => {
      if (d === "0" || d === CALCULATOR_ERROR_DISPLAY) return d;
      setAwaitingOperand(false);
      return d.startsWith("-") ? d.slice(1) : `-${d}`;
    });
  }, []);

  const [advancedOpen, setAdvancedOpen] = useState(false);

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
      } else if (e.key === "*") {
        e.preventDefault();
        inputOperator("×");
      } else if (e.key === "/") {
        e.preventDefault();
        inputOperator("÷");
      } else if (e.key === "^") {
        e.preventDefault();
        inputOperator("^");
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
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        applyFn("sin");
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        applyFn("cos");
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        applyFn("tan");
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        applyFn("log");
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        applyFn("ln");
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        insertPi();
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
    applyFn,
    insertPi,
  ]);

  // Primary 6-column 8-row keypad
  const primaryKeypad: ButtonConfig[] = [
    // Row 1: sin, cos, tan, sin⁻¹, cos⁻¹, tan⁻¹
    { id: "sin", label: "sin", variant: "function", onClick: () => applyFn("sin") },
    { id: "cos", label: "cos", variant: "function", onClick: () => applyFn("cos") },
    { id: "tan", label: "tan", variant: "function", onClick: () => applyFn("tan") },
    { id: "asin", label: "sin⁻¹", variant: "function", onClick: () => applyFn("asin") },
    { id: "acos", label: "cos⁻¹", variant: "function", onClick: () => applyFn("acos") },
    { id: "atan", label: "tan⁻¹", variant: "function", onClick: () => applyFn("atan") },

    // Row 2: π, e, xʸ, x², x³, eˣ
    { id: "pi", label: "π", variant: "function", onClick: insertPi },
    { id: "e", label: "e", variant: "function", onClick: insertE },
    { id: "pow", label: "xʸ", variant: "function", onClick: () => inputOperator("^") },
    { id: "sq", label: "x²", variant: "function", onClick: () => applyFn("square") },
    { id: "cube", label: "x³", variant: "function", onClick: () => applyFn("cube") },
    { id: "ex", label: "eˣ", variant: "function", onClick: () => applyFn("exp") },

    // Row 3: 10ˣ, y√x, ∛, √, ln, log
    { id: "pow10", label: "10ˣ", variant: "function", onClick: () => applyFn("pow10") },
    { id: "y_root", label: "y√x", variant: "function", onClick: () => inputOperator("y√") },
    { id: "cbrt", label: "∛", variant: "function", onClick: () => applyFn("cbrt") },
    { id: "sqrt", label: "√", variant: "function", onClick: () => applyFn("sqrt") },
    { id: "ln", label: "ln", variant: "function", onClick: () => applyFn("ln") },
    { id: "log", label: "log", variant: "function", onClick: () => applyFn("log") },

    // Row 4: (, ), 1/x, %, x!, ⌫ (danger red Back)
    { id: "lp", label: "(", variant: "function", onClick: () => handleParen("(") },
    { id: "rp", label: ")", variant: "function", onClick: () => handleParen(")") },
    { id: "inv_x", label: "1/x", variant: "function", onClick: () => applyFn("inv") },
    { id: "pct", label: "%", variant: "function", onClick: handlePercent },
    { id: "fact", label: "x!", variant: "function", onClick: () => applyFn("fact") },
    { id: "bs", label: "⌫", variant: "danger", onClick: handleBackspace },

    // Row 5: 7, 8, 9, ÷, AC, ±
    { id: "7", label: "7", onClick: () => inputDigit("7") },
    { id: "8", label: "8", onClick: () => inputDigit("8") },
    { id: "9", label: "9", onClick: () => inputDigit("9") },
    { id: "div", label: "÷", variant: "operator", onClick: () => inputOperator("÷") },
    { id: "ac", label: "AC", variant: "danger", onClick: handleClear },
    { id: "pm", label: "±", variant: "function", onClick: toggleSign },

    // Row 6: 4, 5, 6, ×, M+, M-
    { id: "4", label: "4", onClick: () => inputDigit("4") },
    { id: "5", label: "5", onClick: () => inputDigit("5") },
    { id: "6", label: "6", onClick: () => inputDigit("6") },
    { id: "mul", label: "×", variant: "operator", onClick: () => inputOperator("×") },
    { id: "m+", label: "M+", variant: "memory", onClick: () => handleMemory("M+") },
    { id: "m-", label: "M−", variant: "memory", onClick: () => handleMemory("M-") },

    // Row 7: 1, 2, 3, −, MR, MC
    { id: "1", label: "1", onClick: () => inputDigit("1") },
    { id: "2", label: "2", onClick: () => inputDigit("2") },
    { id: "3", label: "3", onClick: () => inputDigit("3") },
    { id: "sub", label: "−", variant: "operator", onClick: () => inputOperator("−") },
    { id: "mr", label: "MR", variant: "memory", onClick: () => handleMemory("MR") },
    { id: "mc", label: "MC", variant: "memory", onClick: () => handleMemory("MC") },

    // Row 8: 0, ., Ans, +, = (spans 2)
    { id: "0", label: "0", onClick: () => inputDigit("0") },
    { id: "dot", label: ".", onClick: () => inputDigit(".") },
    { id: "ans", label: "Ans", variant: "function", onClick: handleAns },
    { id: "add", label: "+", variant: "operator", onClick: () => inputOperator("+") },
    { id: "eq", label: "=", variant: "equals", span: 2, onClick: handleEquals },
  ];

  // Secondary 6-column collapsible keypad (advanced tools)
  const secondaryKeypad: ButtonConfig[] = [
    {
      id: "inv",
      label: "INV",
      variant: "function",
      active: invMode,
      onClick: () => setInvMode((p) => !p),
    },
    {
      id: "sto",
      label: stoMode ? "STO" : "STO/RCL",
      variant: "function",
      active: stoMode,
      onClick: () => setStoMode((p) => !p),
    },
    {
      id: "var_x",
      label: stoMode ? "→x" : "x",
      variant: "memory",
      onClick: () => handleVariable("x"),
    },
    {
      id: "var_y",
      label: stoMode ? "→y" : "y",
      variant: "memory",
      onClick: () => handleVariable("y"),
    },
    {
      id: "var_a",
      label: stoMode ? "→a" : "a",
      variant: "memory",
      onClick: () => handleVariable("a"),
    },
    {
      id: "var_b",
      label: stoMode ? "→b" : "b",
      variant: "memory",
      onClick: () => handleVariable("b"),
    },
    {
      id: "var_c",
      label: stoMode ? "→c" : "c",
      variant: "memory",
      onClick: () => handleVariable("c"),
    },
    {
      id: "var_d",
      label: stoMode ? "→d" : "d",
      variant: "memory",
      onClick: () => handleVariable("d"),
    },
    { id: "abs", label: "Abs", variant: "function", onClick: () => applyFn("abs") },
    { id: "mod", label: "mod", variant: "function", onClick: () => inputOperator("mod") },
    { id: "sd", label: "S⇔D", variant: "function", onClick: () => setIsFraction((p) => !p) },
    { id: "pfact", label: "PFact", variant: "function", onClick: handlePFact },
    {
      id: "complex",
      label: "Cplx",
      variant: "function",
      active: complexMode,
      onClick: () => setComplexMode((p) => !p),
    },
    {
      id: "sinh",
      label: invMode ? "sinh⁻¹" : "sinh",
      variant: "function",
      onClick: () => applyFn(invMode ? "asinh" : "sinh"),
    },
    {
      id: "cosh",
      label: invMode ? "cosh⁻¹" : "cosh",
      variant: "function",
      onClick: () => applyFn(invMode ? "acosh" : "cosh"),
    },
    {
      id: "tanh",
      label: invMode ? "tanh⁻¹" : "tanh",
      variant: "function",
      onClick: () => applyFn(invMode ? "atanh" : "tanh"),
    },
    { id: "ncr", label: "nCr", variant: "function", onClick: () => inputOperator("nCr") },
    { id: "npr", label: "nPr", variant: "function", onClick: () => inputOperator("nPr") },
    { id: "gcd", label: "GCD", variant: "function", onClick: () => inputOperator("gcd") },
    { id: "lcm", label: "LCM", variant: "function", onClick: () => inputOperator("lcm") },
    { id: "logbase", label: "logₐ", variant: "function", onClick: () => inputOperator("logₐ") },
    { id: "i_btn", label: "i", variant: "function", onClick: () => inputDigit("i") },
    { id: "exp_btn", label: "EXP", variant: "function", onClick: handleEXP },
  ];

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.scientificPage.title}
      </h1>
      <CalculatorCard
        compact
        maxWidthClass="max-w-[480px]"
      >
        <div className="space-y-1.5 sm:space-y-2">
          {/* Top Actions Row: Deg/Rad Pill & History Button */}
          <div className="flex items-center justify-between gap-2 pb-0.5">
            {/* Segmented Pill Toggle for Deg / Rad */}
            <div className="inline-flex items-center rounded-full bg-surface-sunken p-0.5 border border-border">
              <button
                type="button"
                onClick={() => setMode("deg")}
                className={`rounded-full px-2.5 py-0.5 text-xs transition ${
                  mode === "deg"
                    ? "bg-brand text-white font-semibold shadow-sm"
                    : "text-text-secondary hover:text-text-primary font-medium"
                }`}
              >
                Deg
              </button>
              <button
                type="button"
                onClick={() => setMode("rad")}
                className={`rounded-full px-2.5 py-0.5 text-xs transition ${
                  mode === "rad"
                    ? "bg-brand text-white font-semibold shadow-sm"
                    : "text-text-secondary hover:text-text-primary font-medium"
                }`}
              >
                Rad
              </button>
            </div>

            {/* Circular Icon-Only History Button */}
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-sunken hover:bg-border text-text-secondary transition dark:hover:bg-zinc-700"
              aria-label={t.nav.history}
              title={t.nav.history}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
          <Display
            compact
            expression={expression}
            value={
              isFraction && justEvaluated && display !== CALCULATOR_ERROR_DISPLAY
                ? toFraction(parseFloat(display))
                : display
            }
            secondary={(() => {
              if (expression) {
                const match = expression.trim().match(/^(-?\d+)\s*[/÷]\s*(-?\d+)$/);
                if (match) {
                  const num = parseInt(match[1], 10);
                  const den = parseInt(match[2], 10);
                  const rep = detectRepeatingDecimal(num, den);
                  if (rep) return `循環小数: ${rep}`;
                }
              }
              return mode === "deg" ? t.scientific.deg : t.scientific.rad;
            })()}
            memoryActive={memory !== 0}
            copyValue={error ? "" : display}
          />
          {pFactResult && (
            <div className="rounded-lg border border-brand/20 bg-brand-muted/40 p-1.5 text-center text-xs font-semibold text-brand dark:border-brand/40 dark:text-[#d6ccf0]">
              素因数分解: {pFactResult}
            </div>
          )}

          {/* Primary 6-Column Keypad */}
          <ButtonGrid buttons={primaryKeypad} columns={6} compact />

          {/* Collapsible Secondary Panel Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setAdvancedOpen((prev) => !prev)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-surface-sunken/60 py-1 text-xs font-semibold text-text-secondary hover:bg-surface-sunken hover:text-text-primary transition sm:hidden"
            >
              <span>{advancedOpen ? "簡易表示 (Simple)" : "詳細機能 (More functions)"}</span>
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Secondary Keypad: always visible on sm+ screens; on phones it
              stays behind the toggle above so the basic keypad fits first. */}
          <div
            className={`${advancedOpen ? "block" : "hidden sm:block"} border-t border-border/60 pt-1.5`}
          >
            <p className="pb-1.5 text-[11px] font-semibold tracking-wide text-text-secondary">
              高度な関数
            </p>
            <ButtonGrid buttons={secondaryKeypad} columns={6} compact />
          </div>
        </div>
      </CalculatorCard>

      <HistoryPanel
        route="/scientific-calculator"
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

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.scientificPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.scientificPage.introParagraph} />
      </p>

      <ButtonGuideTable title={t.scientificPage.buttonGuideTitle} rows={SCIENTIFIC_BUTTON_GUIDE} />

      <section aria-labelledby="sci-examples-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-examples-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.guideExamplesTitle}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {t.scientificPage.guideExamples.map((ex) => (
            <li
              key={ex}
              className="rounded-full border border-border bg-surface-sunken px-3 py-1.5 text-sm text-text-primary"
            >
              {ex}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sci-keystroke-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-keystroke-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.keystrokeTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">計算</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">入力手順</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">結果</th>
              </tr>
            </thead>
            <tbody>
              {t.scientificPage.keystrokeExamples.map((row) => (
                <tr key={row.calc} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2.5 text-text-primary">{row.calc}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.keys}</td>
                  <td className="px-3 py-2.5 font-medium text-text-primary">{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sci-trig-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-trig-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.trigTableTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">角度</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">sin</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">cos</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">tan</th>
              </tr>
            </thead>
            <tbody>
              {t.scientificPage.trigTableRows.map((row) => (
                <tr key={row.angle} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2.5 font-medium text-text-primary">{row.angle}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.sin}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.cos}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.tan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sci-log-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-log-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.logLawsTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.scientificPage.logLaws.map((law) => (
            <li key={law} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {law}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-semibold text-text-primary">計算例</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          {t.scientificPage.logExamples.map((ex) => (
            <li key={ex} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {ex}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sci-exp-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-exp-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.expLawsTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.scientificPage.expLaws.map((law) => (
            <li key={law} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {law}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sci-shortcuts-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-shortcuts-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.shortcutsTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">キー</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">操作</th>
              </tr>
            </thead>
            <tbody>
              {t.scientificPage.shortcuts.map((row) => (
                <tr key={row.key} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2.5 font-medium whitespace-nowrap text-text-primary">{row.key}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sci-degrad-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-degrad-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.guideDegRadTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          {t.scientificPage.guideDegRadBody}
        </p>
      </section>

      <section aria-labelledby="sci-handcalc-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-handcalc-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.handCalcTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          {t.scientificPage.handCalcBody}
        </p>
      </section>

      <section aria-labelledby="sci-vsbasic-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-vsbasic-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.vsBasicTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          <LinkedText text={t.scientificPage.vsBasicBody} activeHref="/scientific-calculator" />
        </p>
      </section>

      <section aria-labelledby="sci-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="sci-mistakes-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.scientificPage.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.scientificPage.guideMistakes.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorFaqSection title={t.scientificPage.faqTitle} items={t.scientificPage.faqItems} />
      <RelatedCalculators activeHref="/scientific-calculator" />
    </>
  );
}
