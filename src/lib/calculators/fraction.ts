export type Fraction = {
  num: number;
  den: number;
  whole?: number;
};

export type FractionOp = "+" | "-" | "*" | "/";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function simplify(num: number, den: number): Fraction {
  if (den === 0) throw new Error("分母が0です");
  if (num === 0) return { num: 0, den: 1 };

  const sign = den < 0 ? -1 : 1;
  const g = gcd(num, den);
  return {
    num: (num / g) * sign,
    den: Math.abs(den) / g,
  };
}

export function toImproper(f: Fraction): { num: number; den: number } {
  const whole = f.whole ?? 0;
  const sign = f.num < 0 || whole < 0 ? -1 : 1;
  const absWhole = Math.abs(whole);
  const absNum = Math.abs(f.num);
  const num = absWhole * f.den + absNum;
  return simplify(num * sign, f.den);
}

export function formatFraction(f: Fraction): string {
  const imp = toImproper(f);
  if (imp.num === 0) return "0";

  const s = simplify(imp.num, imp.den);
  if (s.den === 1) return String(s.num);

  const whole = Math.trunc(s.num / s.den);
  const rem = Math.abs(s.num % s.den);
  if (whole !== 0 && rem !== 0) {
    const sign = s.num < 0 ? "-" : "";
    return `${sign}${Math.abs(whole)} ${rem}/${s.den}`;
  }
  return `${s.num}/${s.den}`;
}

export function operateFractions(a: Fraction, b: Fraction, op: FractionOp): Fraction {
  const A = toImproper(a);
  const B = toImproper(b);

  let num: number;
  let den: number;

  switch (op) {
    case "+":
      num = A.num * B.den + B.num * A.den;
      den = A.den * B.den;
      break;
    case "-":
      num = A.num * B.den - B.num * A.den;
      den = A.den * B.den;
      break;
    case "*":
      num = A.num * B.num;
      den = A.den * B.den;
      break;
    case "/":
      if (B.num === 0) throw new Error("0で割ることはできません");
      num = A.num * B.den;
      den = A.den * B.num;
      break;
    default:
      throw new Error("不明な演算");
  }

  return simplify(num, den);
}

export function fractionToDecimal(f: Fraction): number {
  const imp = toImproper(f);
  return imp.num / imp.den;
}

export function parseFractionInput(whole: string, num: string, den: string): Fraction {
  const w = whole.trim() ? parseInt(whole, 10) : 0;
  const n = parseInt(num, 10);
  const d = parseInt(den, 10);

  if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) {
    throw new Error("無効な分数です");
  }
  if (whole.trim() && !Number.isFinite(w)) {
    throw new Error("無効な整数部です");
  }

  return { whole: w, num: n, den: d };
}

// Helper to compute Least Common Multiple
function lcm(a: number, b: number): number {
  return Math.abs((a * b) / gcd(a, b));
}

export type FractionStepItem =
  | string
  | { f: Fraction | { num: number; den: number } }
  | {
      combined: {
        num1: number;
        num2: number;
        op: FractionOp;
        den?: number;
        den1?: number;
        den2?: number;
      };
    }
  | { formulaCombined: { A: Fraction; B: Fraction; op: FractionOp } };

export type FractionStep =
  | { type: "text"; textId: string; args?: (string | number)[] }
  | { type: "equation"; items: FractionStepItem[] };

export function getFractionSteps(
  a: Fraction,
  b: Fraction,
  op: FractionOp,
): { steps: FractionStep[]; formulaSteps?: FractionStep[]; finalResult: Fraction } {
  const steps: FractionStep[] = [];
  const A = toImproper(a);
  const B = toImproper(b);

  let resultNum = 0;
  let resultDen = 1;

  if (op === "+" || op === "-") {
    const commonDenom = lcm(A.den, B.den);
    const m1 = commonDenom / A.den;
    const m2 = commonDenom / B.den;

    if (A.den !== B.den) {
      steps.push({ type: "text", textId: "lcd_intro", args: [A.den, B.den, commonDenom] });
      steps.push({
        type: "equation",
        items: [
          { f: A },
          "×",
          { f: { num: m1, den: m1 } },
          op,
          { f: B },
          "×",
          { f: { num: m2, den: m2 } },
        ],
      });
      steps.push({ type: "text", textId: "lcd_multiplied" });
    }

    const newA = { num: A.num * m1, den: commonDenom };
    const newB = { num: B.num * m2, den: commonDenom };

    steps.push({
      type: "equation",
      items: [{ f: newA }, op, { f: newB }],
    });

    steps.push({ type: "text", textId: "add_numerators" });

    if (op === "+") {
      resultNum = newA.num + newB.num;
    } else {
      resultNum = newA.num - newB.num;
    }
    resultDen = commonDenom;

    steps.push({
      type: "equation",
      items: [
        { combined: { num1: newA.num, num2: newB.num, op, den: commonDenom } },
        "=",
        { f: { num: resultNum, den: resultDen } },
      ],
    });
  } else if (op === "*") {
    steps.push({ type: "text", textId: "multiply_intro" });
    steps.push({
      type: "equation",
      items: [
        { combined: { num1: A.num, num2: B.num, op, den1: A.den, den2: B.den } },
        "=",
        { f: { num: A.num * B.num, den: A.den * B.den } },
      ],
    });
    resultNum = A.num * B.num;
    resultDen = A.den * B.den;
  } else if (op === "/") {
    if (B.num === 0) throw new Error("0で割ることはできません");
    steps.push({ type: "text", textId: "divide_intro" });
    const flippedB = { num: B.den * Math.sign(B.num), den: Math.abs(B.num) };
    steps.push({
      type: "equation",
      items: [{ f: A }, "×", { f: flippedB }],
    });

    steps.push({ type: "text", textId: "multiply_intro" });
    steps.push({
      type: "equation",
      items: [
        { combined: { num1: A.num, num2: flippedB.num, op: "*", den1: A.den, den2: flippedB.den } },
        "=",
        { f: { num: A.num * flippedB.num, den: A.den * flippedB.den } },
      ],
    });
    resultNum = A.num * flippedB.num;
    resultDen = A.den * flippedB.den;
  }

  const reduced = simplify(resultNum, resultDen);
  if (reduced.num !== resultNum || reduced.den !== resultDen) {
    const g = gcd(resultNum, resultDen);
    steps.push({ type: "text", textId: "reduce_intro", args: [g] });
    steps.push({
      type: "equation",
      items: [{ f: { num: resultNum, den: resultDen } }, "=", { f: reduced }],
    });
  } else {
    steps.push({ type: "text", textId: "cannot_reduce" });
  }

  if (Math.abs(reduced.num) > reduced.den && reduced.den !== 1) {
    const whole = Math.trunc(reduced.num / reduced.den);
    const rem = Math.abs(reduced.num % reduced.den);
    steps.push({
      type: "text",
      textId: "mixed_intro",
      args: [reduced.num, reduced.den, whole, rem],
    });
    steps.push({
      type: "equation",
      items: [{ f: reduced }, "=", { f: { whole: whole, num: rem, den: reduced.den } }],
    });
  }

  // Solution by formulas (only for + and - right now for simplicity)
  let formulaSteps: FractionStep[] | undefined;
  if (op === "+" || op === "-") {
    formulaSteps = [];
    formulaSteps.push({ type: "text", textId: "formula_intro" });
    const crossNum1 = A.num * B.den;
    const crossNum2 = B.num * A.den;
    const crossDen = A.den * B.den;
    formulaSteps.push({
      type: "equation",
      items: [
        { formulaCombined: { A, B, op } },
        "=",
        { combined: { num1: crossNum1, num2: crossNum2, op, den: crossDen } },
        "=",
        { f: { num: crossNum1 + (op === "+" ? crossNum2 : -crossNum2), den: crossDen } },
      ],
    });
    if (gcd(crossNum1 + (op === "+" ? crossNum2 : -crossNum2), crossDen) > 1) {
      formulaSteps.push({ type: "text", textId: "reduce_intro_short" });
      formulaSteps.push({
        type: "equation",
        items: [
          { f: { num: crossNum1 + (op === "+" ? crossNum2 : -crossNum2), den: crossDen } },
          "=",
          { f: reduced },
        ],
      });
    }
  }

  return { steps, formulaSteps, finalResult: reduced };
}

/* ---------------- decimal -> fraction （小数を分数に変換) ---------------- */

export type DecimalToFractionResult = {
  /** Simplified improper fraction. */
  fraction: Fraction;
  /** How the decimal was first read, before reducing (e.g. 75/100). */
  unreduced: { num: number; den: number };
};

/**
 * Convert a typed decimal string to an exact fraction.
 * Works from the string itself (never through binary float), so what the
 * user typed is exactly what gets converted: "0.75" -> 75/100 -> 3/4,
 * "0.333" -> 333/1000. Throws on anything that is not a plain decimal.
 */
export function decimalToFraction(input: string): DecimalToFractionResult {
  const s = input.trim();
  if (!/^[+-]?\d+(\.\d+)?$/.test(s)) {
    throw new Error("小数の形式が正しくありません");
  }
  const negative = s.startsWith("-");
  const body = s.replace(/^[+-]/, "");
  const [intPart, fracPart = ""] = body.split(".");
  const den = 10 ** fracPart.length;
  const num = parseInt(intPart + fracPart, 10) * (negative ? -1 : 1);
  if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den)) {
    throw new Error("桁数が大きすぎます");
  }
  return { fraction: simplify(num, den), unreduced: { num, den } };
}
