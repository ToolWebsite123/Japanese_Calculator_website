"use client";

import { useCallback, useEffect, useState } from "react";
import { Display } from "@/components/calculator/Display";
import { InlineHistoryTape } from "@/components/calculator/InlineHistoryTape";
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
  type AngleMode,
} from "@/lib/calculators/scientific";
import { formatDisplayNumber, parseNumericResult, CALCULATOR_ERROR_DISPLAY } from "@/lib/format";
import { SCIENTIFIC_BUTTON_GUIDE } from "@/lib/calculator-guides/scientific";

function toFraction(x: number, tolerance = 1.0E-6): string {
  if (x === 0) return "0";
  if (!Number.isFinite(x) || Number.isNaN(x)) return String(x);
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = x;
  do {
      const a = Math.floor(b);
      let aux = h1; h1 = a * h1 + h2; h2 = aux;
      aux = k1; k1 = a * k1 + k2; k2 = aux;
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
  const [invMode, setInvMode] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [awaitingOperand, setAwaitingOperand] = useState(true);
  const [error, setError] = useState(false);
  const [memory, setMemory] = useState(0);
  const [isFraction, setIsFraction] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

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
    [justEvaluated]
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
    [display, error, justEvaluated, awaitingOperand]
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

      const result = evaluateScientific(normalizeSciExpr(full), mode);
      const formatted = formatDisplayNumber(result);
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
  }, [justEvaluated, expression, display, awaitingOperand, error, mode, addEntry]);

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
    [display, justEvaluated, awaitingOperand]
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
    [display, memory, awaitingOperand]
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
    [display, justEvaluated, awaitingOperand]
  );

  const insertPi = useCallback(() => {
    setDisplay(formatDisplayNumber(Math.PI));
    setJustEvaluated(false);
    setAwaitingOperand(false);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
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
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [inputDigit, inputOperator, handleEquals, handleClear, handleBackspace, handlePercent, handleParen]);

  const keypad: ButtonConfig[] = [
    // Row 1
    { id: "m+", label: "M+", variant: "memory", onClick: () => handleMemory("M+") },
    { id: "m-", label: "M−", variant: "memory", onClick: () => handleMemory("M-") },
    { id: "mr", label: "MR", variant: "memory", onClick: () => handleMemory("MR") },
    { id: "mc", label: "MC", variant: "memory", onClick: () => handleMemory("MC") },
    { id: "abs", label: "Abs", variant: "function", onClick: () => applyFn("abs") },
    { id: "mod", label: "mod", variant: "function", onClick: () => inputOperator("mod") },
    { id: "sd", label: "S⇔D", variant: "function", onClick: () => setIsFraction(p => !p) },

    // Row 2
    { id: "sinh", label: invMode ? "sinh⁻¹" : "sinh", variant: "function", onClick: () => applyFn(invMode ? "asinh" : "sinh") },
    { id: "cosh", label: invMode ? "cosh⁻¹" : "cosh", variant: "function", onClick: () => applyFn(invMode ? "acosh" : "cosh") },
    { id: "tanh", label: invMode ? "tanh⁻¹" : "tanh", variant: "function", onClick: () => applyFn(invMode ? "atanh" : "tanh") },
    { id: "ncr", label: "nCr", variant: "function", onClick: () => inputOperator("nCr") },
    { id: "npr", label: "nPr", variant: "function", onClick: () => inputOperator("nPr") },
    { id: "gcd", label: "GCD", variant: "function", onClick: () => inputOperator("gcd") },
    { id: "lcm", label: "LCM", variant: "function", onClick: () => inputOperator("lcm") },

    // Row 3
    { id: "sq", label: "x²", variant: "function", onClick: () => applyFn("square") },
    { id: "cube", label: "x³", variant: "function", onClick: () => applyFn("cube") },
    { id: "inv_x", label: "x⁻¹", variant: "function", onClick: () => applyFn("inv") },
    { id: "cbrt", label: "∛", variant: "function", onClick: () => applyFn("cbrt") },
    { id: "ex", label: "eˣ", variant: "function", onClick: () => applyFn("exp") },
    { id: "pow10", label: "10ˣ", variant: "function", onClick: () => applyFn("pow10") },
    { id: "bs", label: "⌫", variant: "function", onClick: handleBackspace },

    // Row 4
    { id: "deg", label: "Deg", variant: "function", active: mode === "deg", onClick: () => setMode("deg") },
    { id: "rad", label: "Rad", variant: "function", active: mode === "rad", onClick: () => setMode("rad") },
    { id: "fact", label: "x!", variant: "function", onClick: () => applyFn("fact") },
    { id: "lp", label: "(", variant: "function", onClick: () => handleParen("(") },
    { id: "rp", label: ")", variant: "function", onClick: () => handleParen(")") },
    { id: "pct", label: "%", variant: "function", onClick: handlePercent },
    { id: "ac", label: "AC", variant: "danger", onClick: handleClear },

    // Row 5
    { id: "inv", label: "Inv", variant: "function", active: invMode, onClick: () => setInvMode((prev) => !prev) },
    { id: "sin", label: invMode ? "sin⁻¹" : "sin", variant: "function", onClick: () => applyFn(invMode ? "asin" : "sin") },
    { id: "ln", label: "ln", variant: "function", onClick: () => applyFn("ln") },
    { id: "7", label: "7", onClick: () => inputDigit("7") },
    { id: "8", label: "8", onClick: () => inputDigit("8") },
    { id: "9", label: "9", onClick: () => inputDigit("9") },
    { id: "div", label: "÷", variant: "operator", onClick: () => inputOperator("÷") },

    // Row 6
    { id: "pi", label: "π", variant: "function", onClick: insertPi },
    { id: "cos", label: invMode ? "cos⁻¹" : "cos", variant: "function", onClick: () => applyFn(invMode ? "acos" : "cos") },
    { id: "log", label: "log", variant: "function", onClick: () => applyFn("log") },
    { id: "4", label: "4", onClick: () => inputDigit("4") },
    { id: "5", label: "5", onClick: () => inputDigit("5") },
    { id: "6", label: "6", onClick: () => inputDigit("6") },
    { id: "mul", label: "×", variant: "operator", onClick: () => inputOperator("×") },

    // Row 7
    { id: "e", label: "e", variant: "function", onClick: insertE },
    { id: "tan", label: invMode ? "tan⁻¹" : "tan", variant: "function", onClick: () => applyFn(invMode ? "atan" : "tan") },
    { id: "sqrt", label: "√", variant: "function", onClick: () => applyFn("sqrt") },
    { id: "1", label: "1", onClick: () => inputDigit("1") },
    { id: "2", label: "2", onClick: () => inputDigit("2") },
    { id: "3", label: "3", onClick: () => inputDigit("3") },
    { id: "sub", label: "−", variant: "operator", onClick: () => inputOperator("−") },

    // Row 8
    { id: "ans", label: "Ans", variant: "function", onClick: handleAns },
    { id: "exp_btn", label: "EXP", variant: "function", onClick: handleEXP },
    { id: "pow", label: "xʸ", variant: "function", onClick: () => inputOperator("^") },
    { id: "0", label: "0", onClick: () => inputDigit("0") },
    { id: "dot", label: ".", onClick: () => inputDigit(".") },
    { id: "eq", label: "=", variant: "equals", onClick: handleEquals },
    { id: "add", label: "+", variant: "operator", onClick: () => inputOperator("+") },
  ];

  return (
    <>
      <CalculatorCard
        title={t.scientificPage.title}
        description={t.scientificPage.description}
        actions={
          <div className="flex items-center gap-2">
            <ChipButton onClick={() => setHistoryOpen(true)}>
              {t.nav.history}
            </ChipButton>
            <CopyResultButton value={error ? "" : display} />
          </div>
        }
      >
        <div className="space-y-4">
          <InlineHistoryTape
            onSelect={(expr, res) => {
              setExpression(expr);
              setDisplay(res);
              setJustEvaluated(true);
              setAwaitingOperand(true);
              setError(false);
            }}
            onOpenFullHistory={() => setHistoryOpen(true)}
          />
          <Display
            expression={expression}
            value={
              isFraction && justEvaluated && display !== CALCULATOR_ERROR_DISPLAY
                ? toFraction(parseFloat(display))
                : display
            }
            secondary={mode === "deg" ? t.scientific.deg : t.scientific.rad}
            memoryActive={memory !== 0}
          />
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <div className="min-w-[400px]">
              <ButtonGrid
                buttons={keypad}
                columns={7}
                separatorsBefore={[7, 28]}
              />
            </div>
          </div>
        </div>
      </CalculatorCard>

      <HistoryPanel
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


      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.scientificPage.introParagraph} />
      </p>

      <ButtonGuideTable
        title={t.scientificPage.buttonGuideTitle}
        rows={SCIENTIFIC_BUTTON_GUIDE}
      />

      <CalculatorFaqSection
        title={t.scientificPage.faqTitle}
        items={t.scientificPage.faqItems}
      />
      <RelatedCalculators activeHref="/scientific-calculator" />
        </>
  );
}
