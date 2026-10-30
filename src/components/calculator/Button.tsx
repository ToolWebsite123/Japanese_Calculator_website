"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "number" | "operator" | "function" | "equals" | "memory" | "danger";

type CalcButtonProps = {
  label: ReactNode;
  variant?: ButtonVariant;
  span?: 1 | 2;
  active?: boolean;
  compact?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  number:
    "bg-key-number text-text-primary border-border hover:bg-surface-sunken dark:hover:bg-zinc-700",
  operator:
    "bg-key-operator text-text-primary border-border hover:brightness-95 dark:hover:brightness-110",
  function:
    "bg-key-function-bg text-key-function-text border-transparent hover:brightness-95 text-sm dark:hover:brightness-110",
  equals:
    "bg-gradient-to-b from-brand to-brand-hover text-white border-transparent hover:brightness-110",
  memory:
    "bg-key-memory-bg text-key-memory-text border-transparent hover:brightness-95 text-sm font-semibold dark:hover:brightness-110",
  danger:
    "bg-key-danger-bg text-key-danger-text border-transparent hover:brightness-95 font-semibold dark:hover:brightness-110",
};

export function Button({
  label,
  variant = "number",
  span = 1,
  active = false,
  compact = false,
  className = "",
  ...props
}: CalcButtonProps) {
  const isEquals = variant === "equals";

  return (
    <button
      type="button"
      className={[
        // H-09 touch targets: default keypad >= 44px (was min-h-10 = 40px);
        // compact >= 36px mobile / 40px desktop (was h-7 = 28px / h-8 = 32px).
        // Compact stays below 44px on purpose: the scientific keypad is a
        // 6-column grid, and 44px rows would overflow small phones; the wider
        // grid gap (ButtonGrid) keeps the effective tap area reasonable.
        "btn-interactive min-h-11 border text-sm sm:text-base px-1 sm:px-2",
        compact ? "h-9 sm:h-10 min-h-9 sm:min-h-10 text-[11px] sm:text-xs px-0.5 sm:px-1 py-0" : "",
        variantClasses[variant],
        span === 2 ? "col-span-2" : "",
        active
          ? "ring-2 ring-brand ring-offset-1 ring-offset-surface dark:ring-offset-surface"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={isEquals ? { boxShadow: "var(--shadow-brand)" } : undefined}
      {...props}
    >
      {label}
    </button>
  );
}
