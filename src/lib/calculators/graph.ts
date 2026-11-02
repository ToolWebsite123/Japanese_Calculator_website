/**
 * Function plotting for the グラフ計算機 (graphing calculator).
 *
 * Parses an expression in x — numbers, + − × ÷, powers (^), parentheses,
 * implicit multiplication (2x, 2(x+1)), the constants π and e, and the
 * functions sin, cos, tan, sqrt, abs, log (base 10), ln and exp — and
 * evaluates it at any x. Angles are in radians. Implemented with a
 * tokenizer + shunting-yard evaluator (no eval), in the same style as
 * the standard calculator's evaluator.
 */

type Token =
  | { type: "number"; value: number }
  | { type: "variable" }
  | { type: "op"; value: string }
  | { type: "func"; value: string }
  | { type: "lparen" }
  | { type: "rparen" };

const FUNCTIONS: Record<string, (v: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sqrt: (v) => {
    if (v < 0) throw new Error("平方根の中は0以上にしてください");
    return Math.sqrt(v);
  },
  abs: Math.abs,
  log: (v) => {
    if (v <= 0) throw new Error("logの真数は正の数にしてください");
    return Math.log10(v);
  },
  ln: (v) => {
    if (v <= 0) throw new Error("lnの真数は正の数にしてください");
    return Math.log(v);
  },
  exp: Math.exp,
};

// Unary minus shares the power level and is right-associative, so it
// binds looser than ^ on its left (-x^2 = -(x^2) = -4, the school
// convention) yet still works inside an exponent (2^-2 = 1/4).
const PRECEDENCE: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3, "u-": 3 };
const RIGHT_ASSOC = new Set(["^", "u-"]);

function tokenize(input: string): Token[] {
  const s = input
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "pi");
  const tokens: Token[] = [];
  let i = 0;

  const pushImplicitMul = () => {
    const prev = tokens[tokens.length - 1];
    if (prev && (prev.type === "number" || prev.type === "variable" || prev.type === "rparen")) {
      tokens.push({ type: "op", value: "*" });
    }
  };

  while (i < s.length) {
    const ch = s[i];

    if ((ch >= "0" && ch <= "9") || ch === ".") {
      let num = "";
      while (i < s.length && ((s[i] >= "0" && s[i] <= "9") || s[i] === ".")) num += s[i++];
      const value = parseFloat(num);
      if (!Number.isFinite(value)) throw new Error("数値が不正です");
      pushImplicitMul();
      tokens.push({ type: "number", value });
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      let word = "";
      while (i < s.length && /[a-zA-Z]/.test(s[i])) word += s[i++];
      const lower = word.toLowerCase();
      if (lower === "x") {
        pushImplicitMul();
        tokens.push({ type: "variable" });
      } else if (lower === "pi") {
        pushImplicitMul();
        tokens.push({ type: "number", value: Math.PI });
      } else if (lower === "e") {
        pushImplicitMul();
        tokens.push({ type: "number", value: Math.E });
      } else if (lower in FUNCTIONS) {
        pushImplicitMul();
        tokens.push({ type: "func", value: lower });
      } else {
        throw new Error(`不明な名前です: ${word}`);
      }
      continue;
    }

    if (ch === "(") {
      pushImplicitMul();
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
      const isUnary =
        ch === "-" &&
        (!prev || prev.type === "op" || prev.type === "lparen" || prev.type === "func");
      tokens.push({ type: "op", value: isUnary ? "u-" : ch });
      i++;
      continue;
    }
    throw new Error("式に使えない文字が含まれています");
  }
  return tokens;
}

function toRpn(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const ops: Token[] = [];
  for (const token of tokens) {
    if (token.type === "number" || token.type === "variable") {
      output.push(token);
    } else if (token.type === "func") {
      ops.push(token);
    } else if (token.type === "op") {
      while (ops.length > 0) {
        const top = ops[ops.length - 1];
        if (top.type === "lparen") break;
        if (top.type === "func") {
          output.push(ops.pop()!);
          continue;
        }
        if (top.type !== "op") break;
        const pTop = PRECEDENCE[top.value] ?? 0;
        const pCur = PRECEDENCE[token.value] ?? 0;
        const shouldPop = RIGHT_ASSOC.has(token.value) ? pTop > pCur : pTop >= pCur;
        if (!shouldPop) break;
        output.push(ops.pop()!);
      }
      ops.push(token);
    } else if (token.type === "lparen") {
      ops.push(token);
    } else if (token.type === "rparen") {
      while (ops.length > 0 && ops[ops.length - 1].type !== "lparen") output.push(ops.pop()!);
      if (ops.length === 0) throw new Error("括弧が一致しません");
      ops.pop();
      if (ops.length > 0 && ops[ops.length - 1].type === "func") output.push(ops.pop()!);
    }
  }
  while (ops.length > 0) {
    const op = ops.pop()!;
    if (op.type === "lparen" || op.type === "rparen") throw new Error("括弧が一致しません");
    output.push(op);
  }
  return output;
}

/** Evaluate f(x) for the given expression at x. Throws on invalid input. */
export function evaluateFunction(expression: string, x: number): number {
  const trimmed = expression.trim();
  if (!trimmed) throw new Error("式を入力してください");
  const rpn = toRpn(tokenize(trimmed));
  const stack: number[] = [];
  for (const token of rpn) {
    if (token.type === "number") {
      stack.push(token.value);
    } else if (token.type === "variable") {
      stack.push(x);
    } else if (token.type === "func") {
      if (stack.length < 1) throw new Error("式が不正です");
      stack.push(FUNCTIONS[token.value](stack.pop()!));
    } else if (token.type === "op") {
      if (token.value === "u-") {
        if (stack.length < 1) throw new Error("式が不正です");
        stack.push(-stack.pop()!);
        continue;
      }
      if (stack.length < 2) throw new Error("式が不正です");
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token.value) {
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
          if (b === 0) throw new Error("0で割ることはできません");
          stack.push(a / b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error("不明な演算子です");
      }
    }
  }
  if (stack.length !== 1) throw new Error("式が不正です");
  return stack[0];
}

export type SamplePoint = { x: number; y: number | null };

/**
 * Sample the function across [xMin, xMax]. Points whose value cannot be
 * drawn (undefined, NaN, infinite) come back as y: null so the plot can
 * break the line there instead of drawing through a discontinuity.
 */
export function sampleFunction(
  expression: string,
  xMin: number,
  xMax: number,
  steps = 240,
): SamplePoint[] {
  const points: SamplePoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + ((xMax - xMin) * i) / steps;
    let y: number | null;
    try {
      const v = evaluateFunction(expression, x);
      y = Number.isFinite(v) ? v : null;
    } catch {
      y = null;
    }
    points.push({ x, y });
  }
  return points;
}
