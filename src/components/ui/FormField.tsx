"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { InputWell } from "./primitives";

type FormFieldProps = {
  label: string;
  children?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({ label, id, className = "", children, ...props }: FormFieldProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      {children ?? <InputWell id={inputId} className={className} {...props} />}
    </label>
  );
}

export function ResultCard({
  label,
  value,
  highlight = false,
  sub,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  sub?: string;
}) {
  return (
    <div
      className={[
        "rounded-[var(--radius-md)] border p-4",
        highlight ? "border-brand/20 bg-brand-muted" : "border-border bg-surface-sunken",
      ].join(" ")}
    >
      <div className="text-xs font-medium text-text-tertiary">{label}</div>
      <div
        className={[
          "tabular-display mt-1 text-xl font-bold tracking-tight",
          highlight ? "text-brand" : "text-text-primary",
        ].join(" ")}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-text-tertiary">{sub}</div>}
    </div>
  );
}

export function CalculatorCard({
  title,
  description,
  children,
  actions,
  compact = false,
  wide = false,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
  wide?: boolean;
}) {
  const showHeader = title || description || actions;

  return (
    <div className={["mx-auto w-full", wide ? "max-w-3xl" : "max-w-2xl"].join(" ")}>
      {showHeader && (
        <div
          className={[
            "flex items-start justify-between gap-3",
            compact ? "mb-2 sm:mb-3" : "mb-4 sm:mb-6",
          ].join(" ")}
        >
          <div>
            {title && (
              <h1 className="text-xl font-bold tracking-tight text-brand sm:text-2xl md:text-3xl dark:text-[#d6ccf0]">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-xs sm:text-sm text-text-secondary">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div
        className={[
          "rounded-[var(--radius-xl)] border border-border bg-surface-raised",
          compact ? "p-2 sm:p-3" : "p-4 sm:p-6",
        ].join(" ")}
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {children}
      </div>
    </div>
  );
}
