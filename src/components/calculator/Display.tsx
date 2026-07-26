"use client";

import { useState } from "react";

type DisplayProps = {
  expression?: string;
  value: string;
  secondary?: string;
  memoryActive?: boolean;
  className?: string;
  compact?: boolean;
  copyValue?: string;
};

export function Display({
  expression,
  value,
  secondary,
  memoryActive = false,
  className = "",
  compact = false,
  copyValue,
}: DisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copyValue) return;
    navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-border",
        "bg-surface-sunken p-2.5 sm:p-4",
        compact ? "p-1.5 sm:p-2.5" : "",
        className,
      ].join(" ")}
      style={{ boxShadow: "var(--shadow-key-pressed)" }}
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5"
        aria-hidden
      />

      <div className="relative mb-0.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {memoryActive && (
            <span className="rounded-full bg-brand-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
              M
            </span>
          )}
          {copyValue && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-full bg-surface-raised/80 border border-border px-2 py-0.5 text-[10px] font-medium text-text-secondary hover:bg-surface-raised transition dark:bg-surface-dark/60"
              title="結果をコピー"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {copied ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                )}
              </svg>
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          )}
        </div>

        {expression ? (
          <div className="min-h-3 truncate text-right text-[11px] sm:text-xs font-medium text-text-tertiary">
            {expression}
          </div>
        ) : (
          <div className="min-h-3" />
        )}
      </div>

      <div
        className={[
          "tabular-display relative break-all text-right font-bold text-text-primary",
          value.length > 12
            ? compact
              ? "text-lg sm:text-xl"
              : "text-2xl sm:text-3xl"
            : compact
              ? "text-xl sm:text-2xl"
              : "text-3xl sm:text-4xl",
        ].join(" ")}
      >
        {value}
      </div>

      {secondary && (
        <div className="relative mt-0.5 text-right text-[11px] sm:text-xs text-text-tertiary">
          {secondary}
        </div>
      )}
    </div>
  );
}
