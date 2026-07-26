export type AlgebraMode = "evaluate" | "solve";

export class AlgebraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlgebraError";
  }
}

function normalizeExpr(expr: string): string {
  return expr.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
}

type AT =
  | { type: "num"; value: number }
  | { type: "x" }
  | { type: "op"; value: string }
  | { type: "lparen" }
  | { type: "rparen" };

const PREC: Record<string, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 3,
  "u-": 4,
};

function tokenizeAlgebra(expr: string): AT[] {
  const tokens: AT[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === "x" || ch === "X") {
      tokens.push({ type: "x" });
      i++;
      continue;
    }

    if ((ch >= "0" && ch <= "9") || ch === ".") {
      let num = "";
      while (i < expr.length && ((expr[i] >= "0" && expr[i] <= "9") || expr[i] === ".")) {
        num += expr[i++];
      }
      tokens.push({ type: "num", value: parseFloat(num) });
      continue;
    }

    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }

    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }

    if ("+-*/^".includes(ch)) {
      const prev = tokens[tokens.length - 1];
      const isUnary = ch === "-" && (!prev || prev.type === "op" || prev.type === "lparen");
      tokens.push({ type: "op", value: isUnary ? "u-" : ch });
      i++;
      continue;
    }

    throw new AlgebraError(`無効な文字: ${ch}`);
  }

  const withImplicit: AT[] = [];
  for (let j = 0; j < tokens.length; j++) {
    const cur = tokens[j];
    const prev = withImplicit[withImplicit.length - 1];
    if (
      prev &&
      (prev.type === "num" || prev.type === "rparen") &&
      (cur.type === "x" || cur.type === "lparen" || cur.type === "num")
    ) {
      withImplicit.push({ type: "op", value: "*" });
    }
    if (prev && prev.type === "rparen" && cur.type === "x") {
      // already handled above
    }
    withImplicit.push(cur);
  }

  return withImplicit;
}

function toRpnAlgebra(tokens: AT[]): AT[] {
  const out: AT[] = [];
  const ops: AT[] = [];
  const rightAssoc = new Set(["^", "u-"]);

  for (const t of tokens) {
    if (t.type === "num" || t.type === "x") out.push(t);
    else if (t.type === "op") {
      while (ops.length) {
        const top = ops[ops.length - 1];
        if (top.type !== "op") break;
        const pTop = PREC[top.value] ?? 0;
        const pCur = PREC[t.value] ?? 0;
        const pop = rightAssoc.has(t.value) ? pTop > pCur : pTop >= pCur;
        if (!pop) break;
        out.push(ops.pop()!);
      }
      ops.push(t);
    } else if (t.type === "lparen") ops.push(t);
    else if (t.type === "rparen") {
      while (ops.length && ops[ops.length - 1].type !== "lparen") {
        out.push(ops.pop()!);
      }
      if (!ops.length) throw new AlgebraError("括弧が一致しません");
      ops.pop();
    }
  }

  while (ops.length) {
    const op = ops.pop()!;
    if (op.type === "lparen") throw new AlgebraError("括弧が一致しません");
    out.push(op);
  }
  return out;
}

function evalWithX(expr: string, xVal: number): number {
  const tokens = tokenizeAlgebra(expr);
  const rpn = toRpnAlgebra(tokens);
  const stack: number[] = [];

  for (const t of rpn) {
    if (t.type === "num") stack.push(t.value);
    else if (t.type === "x") stack.push(xVal);
    else if (t.type === "op") {
      if (t.value === "u-") {
        if (stack.length < 1) throw new AlgebraError("式が不正です");
        stack.push(-stack.pop()!);
        continue;
      }
      if (stack.length < 2) throw new AlgebraError("式が不正です");
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (t.value) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          if (b === 0) throw new AlgebraError("0で割ることはできません");
          stack.push(a / b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new AlgebraError("不明な演算子です");
      }
    }
  }

  if (stack.length !== 1) throw new AlgebraError("式が不正です");
  return stack[0];
}

function hasQuadratic(expr: string): boolean {
  const normalized = normalizeExpr(expr);
  return /x\s*\^?\s*2|x²|\^2/.test(normalized) || /x\*x/.test(normalized);
}

/** Evaluate expression with variable x at given value. */
export function evaluateExpressionSafe(expr: string, xVal: number): number {
  if (!Number.isFinite(xVal)) throw new AlgebraError("xの値が無効です");
  const normalized = normalizeExpr(expr);
  if (!normalized) throw new AlgebraError("式を入力してください");
  return evalWithX(normalized, xVal);
}

/** Solve linear equation like 2x+3=7 */
export function solveLinearEquationSafe(equation: string): number {
  const cleaned = equation.replace(/\s+/g, "");
  if (!cleaned) throw new AlgebraError("方程式を入力してください");

  if (hasQuadratic(cleaned)) {
    throw new AlgebraError("二次方程式には対応していません（一次方程式のみ）");
  }

  const parts = cleaned.split("=");
  let left: string;
  let right = "0";

  if (parts.length === 2) {
    [left, right] = parts;
  } else if (parts.length === 1) {
    left = parts[0];
  } else {
    throw new AlgebraError("方程式の形式が正しくありません");
  }

  const at0 = evalWithX(normalizeExpr(left), 0) - evalWithX(normalizeExpr(right), 0);
  const at1 = evalWithX(normalizeExpr(left), 1) - evalWithX(normalizeExpr(right), 1);
  const a = at1 - at0;
  const b = at0;

  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) < 1e-12) {
      throw new AlgebraError("無限に多くの解があります");
    }
    throw new AlgebraError("解がありません");
  }

  return -b / a;
}
