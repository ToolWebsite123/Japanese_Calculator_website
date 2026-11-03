"use client";

import { useCallback, useState } from "react";
import {
  appendOperator,
  closeParenthesis,
  openParenthesis,
} from "@/lib/calculators/expression-input";
import { CALCULATOR_ERROR_DISPLAY, formatDisplayNumber } from "@/lib/format";

/**
 * Expression-input state and key behaviour shared by the standard and
 * scientific calculators: the display/entry state plus the digit,
 * operator, parenthesis, percent, backspace, sign and clear handlers
 * that are identical on both keypads. Each calculator keeps its own
 * equals, memory and keyboard handling on top of this. `onClear` lets
 * a calculator reset extra state of its own when AC clears the input
 * (the standard calculator resets its grand total).
 */
export function useCalculatorInput(onClear?: () => void) {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [awaitingOperand, setAwaitingOperand] = useState(true);
  const [error, setError] = useState(false);

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

  const handleClear = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setJustEvaluated(false);
    setAwaitingOperand(true);
    setError(false);
    onClear?.();
  }, [onClear]);

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

  const toggleSign = useCallback(() => {
    setDisplay((d) => {
      if (d === "0" || d === CALCULATOR_ERROR_DISPLAY) return d;
      setAwaitingOperand(false);
      return d.startsWith("-") ? d.slice(1) : `-${d}`;
    });
  }, []);

  return {
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
  };
}
