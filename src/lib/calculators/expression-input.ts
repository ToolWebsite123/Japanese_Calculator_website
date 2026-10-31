/** Helpers for keypad calculator expression building (avoid trailing placeholder 0). */

export function shouldSkipOperand(display: string, awaitingOperand: boolean): boolean {
  if (!awaitingOperand) return false;
  return display === "0" || display === "";
}

export function getOperandForAppend(display: string, awaitingOperand: boolean): string {
  return shouldSkipOperand(display, awaitingOperand) ? "" : display;
}

export function buildEvalExpression(
  expression: string,
  display: string,
  awaitingOperand: boolean,
): string {
  const operand = getOperandForAppend(display, awaitingOperand);
  return `${expression}${operand}`.trim();
}

const TRAILING_OPERATOR = /(?:mod|nCr|nPr|gcd|lcm|y√|logₐ|[+\-−×÷^])\s*$/;

export function appendOperator(
  expr: string,
  operand: string,
  op: string,
  awaitingOperand: boolean,
): string {
  const part = getOperandForAppend(operand, awaitingOperand);
  if (expr && TRAILING_OPERATOR.test(expr) && part === "") {
    return expr.replace(TRAILING_OPERATOR, `${op} `);
  }
  return `${expr}${part} ${op} `;
}

export function openParenthesis(expr: string, operand: string, awaitingOperand: boolean): string {
  const part = getOperandForAppend(operand, awaitingOperand);
  if (part && part !== "0") {
    return `${expr}${part} × (`;
  }
  return `${expr}(`;
}

export function closeParenthesis(expr: string, operand: string, awaitingOperand: boolean): string {
  const part = getOperandForAppend(operand, awaitingOperand);
  return `${expr}${part})`;
}
