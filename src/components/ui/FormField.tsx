"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { InputWell } from "./primitives";

type FormFieldProps = {
  label: string;
  children?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({
  label,
  id,
  className = "",
  children,
  ...props
}: FormFieldProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-text-secondary">
        {label}
      </span>
      {children ?? (
        <InputWell id={inputId} className={className} {...props} />
      )}
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
        highlight
          ? "border-brand/20 bg-brand-muted"
          : "border-border bg-surface-sunken",
      ].join(" ")}
    >
      <div className="text-xs font-medium text-text-tertiary">
        {label}
      </div>
      <div
        className={[
          "tabular-display mt-1 text-xl font-bold tracking-tight",
          highlight ? "text-brand" : "text-text-primary",
        ].join(" ")}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-xs text-text-tertiary">
          {sub}
        </div>
      )}
    </div>
  );
}

export function CalculatorCard({
  title,
  description,
  children,
  actions,
  compact = false,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
}) {
  const showHeader = title || description || actions;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {showHeader && (
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-brand sm:text-3xl dark:text-[#d6ccf0]">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1.5 text-sm text-text-secondary">
                {description}
              </p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div
        className={[
          "rounded-[var(--radius-xl)] border border-border bg-surface-raised p-4 sm:p-6",
          compact ? "md:p-3" : "",
        ].join(" ")}
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {children}
      </div>
    </div>
  );
}
