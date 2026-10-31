/** Safe expression evaluator using shunting-yard (no eval). */

type Token =
  | { type: "number"; value: number }
  | { type: "op"; value: string }
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "percent" };

const PRECEDENCE: Record<string, number> = {
  "+": 1,
  "-": 1,
  "×": 2,
  "÷": 2,
  "*": 2,
  "/": 2,
  mod: 2,
  nCr: 2,
  nPr: 2,
  gcd: 2,
  lcm: 2,
  logb: 2,
  root: 3,
  "^": 3,
  "u-": 4,
};

function gcdFunc(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcmFunc(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcdFunc(a, b);
}

function factFunc(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("Invalid factorial");
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function nPrFunc(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r))
    throw new Error("Invalid nPr");
  return factFunc(n) / factFunc(n - r);
}

function nCrFunc(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r))
    throw new Error("Invalid nCr");
  return nPrFunc(n, r) / factFunc(r);
}

/** a root b = the b-th root of a (entered as "a y√ b"). */
function rootFunc(a: number, b: number): number {
  if (b === 0) throw new Error("0乗根は定義できません");
  if (a < 0) {
    if (!Number.isInteger(b) || Math.abs(b) % 2 === 0)
      throw new Error("負の数の偶数乗根は実数では定義できません");
    return -Math.pow(-a, 1 / b);
  }
  return Math.pow(a, 1 / b);
}

/** a logb b = logarithm of b with base a (entered as "a logₐ b"). */
function logbFunc(a: number, b: number): number {
  if (a <= 0 || a === 1) throw new Error("対数の底が無効です");
  if (b <= 0) throw new Error("対数の真数が無効です");
  return Math.log(b) / Math.log(a);
}

const RIGHT_ASSOC = new Set(["^", "u-"]);

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = input.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");

  while (i < s.length) {
    const ch = s[i];

    if ((ch >= "0" && ch <= "9") || ch === ".") {
      let num = "";
      while (i < s.length && ((s[i] >= "0" && s[i] <= "9") || s[i] === ".")) {
        num += s[i++];
      }
      if (i < s.length && (s[i] === "e" || s[i] === "E")) {
        num += s[i++];
        if (i < s.length && (s[i] === "+" || s[i] === "-")) {
          num += s[i++];
        }
        while (i < s.length && s[i] >= "0" && s[i] <= "9") {
          num += s[i++];
        }
      }
      const value = parseFloat(num);
      if (!Number.isFinite(value)) throw new Error("Invalid number");
      tokens.push({ type: "number", value });
      continue;
    }

    if (ch === "%") {
      tokens.push({ type: "percent" });
      i++;
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

    if (s.slice(i, i + 3) === "mod") {
      tokens.push({ type: "op", value: "mod" });
      i += 3;
      continue;
    }
    if (s.slice(i, i + 3) === "nCr") {
      tokens.push({ type: "op", value: "nCr" });
      i += 3;
      continue;
    }
    if (s.slice(i, i + 3) === "nPr") {
      tokens.push({ type: "op", value: "nPr" });
      i += 3;
      continue;
    }
    if (s.slice(i, i + 3) === "gcd") {
      tokens.push({ type: "op", value: "gcd" });
      i += 3;
      continue;
    }
    if (s.slice(i, i + 3) === "lcm") {
      tokens.push({ type: "op", value: "lcm" });
      i += 3;
      continue;
    }
    if (s.slice(i, i + 2) === "y√") {
      tokens.push({ type: "op", value: "root" });
      i += 2;
      continue;
    }
    if (s.slice(i, i + 4) === "logₐ") {
      tokens.push({ type: "op", value: "logb" });
      i += 4;
      continue;
    }

    if ("+-*/^".includes(ch)) {
      const prev = tokens[tokens.length - 1];
      const isUnary = ch === "-" && (!prev || prev.type === "op" || prev.type === "lparen");

      tokens.push({ type: "op", value: isUnary ? "u-" : ch });
      i++;
      continue;
    }

    throw new Error("Invalid character");
  }

  return tokens;
}

function toRpn(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const ops: Token[] = [];

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
    } else if (token.type === "percent") {
      output.push(token);
    } else if (token.type === "op") {
      while (ops.length > 0) {
        const top = ops[ops.length - 1];
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
      while (ops.length > 0 && ops[ops.length - 1].type !== "lparen") {
        output.push(ops.pop()!);
      }
      if (ops.length === 0) throw new Error("Mismatched parentheses");
      ops.pop();
    }
  }

  while (ops.length > 0) {
    const op = ops.pop()!;
    if (op.type === "lparen" || op.type === "rparen") {
      throw new Error("Mismatched parentheses");
    }
    output.push(op);
  }

  return output;
}

function evalRpn(rpn: Token[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === "number") {
      stack.push(token.value);
    } else if (token.type === "percent") {
      if (stack.length < 1) throw new Error("Invalid expression");
      stack.push(stack.pop()! / 100);
    } else if (token.type === "op") {
      if (token.value === "u-") {
        if (stack.length < 1) throw new Error("Invalid expression");
        stack.push(-stack.pop()!);
        continue;
      }

      if (stack.length < 2) throw new Error("Invalid expression");
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
          if (b === 0) throw new Error("Division by zero");
          stack.push(a / b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
        case "mod":
          if (b === 0) throw new Error("Modulo by zero");
          stack.push(a % b);
          break;
        case "nCr":
          stack.push(nCrFunc(a, b));
          break;
        case "nPr":
          stack.push(nPrFunc(a, b));
          break;
        case "gcd":
          stack.push(gcdFunc(a, b));
          break;
        case "lcm":
          stack.push(lcmFunc(a, b));
          break;
        case "root":
          stack.push(rootFunc(a, b));
          break;
        case "logb":
          stack.push(logbFunc(a, b));
          break;
        default:
          throw new Error("Unknown operator");
      }
    }
  }

  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

export function evaluateExpression(expression: string): number {
  const trimmed = expression.trim();
  if (!trimmed) throw new Error("Empty expression");
  const tokens = tokenize(trimmed);
  const rpn = toRpn(tokens);
  return evalRpn(rpn);
}

export function isValidPartialExpression(expression: string): boolean {
  try {
    if (!expression.trim()) return true;
    tokenize(expression);
    return true;
  } catch {
    return false;
  }
}
