"use client";

type DisplayProps = {
  expression?: string;
  value: string;
  secondary?: string;
  memoryActive?: boolean;
  className?: string;
  compact?: boolean;
};

export function Display({
  expression,
  value,
  secondary,
  memoryActive = false,
  className = "",
  compact = false,
}: DisplayProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-border",
        "bg-surface-sunken p-4 sm:p-5",
        compact ? "md:p-3" : "",
        className,
      ].join(" ")}
      style={{ boxShadow: "var(--shadow-key-pressed)" }}
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5"
        aria-hidden
      />
      {memoryActive && (
        <span className="absolute left-3 top-2.5 rounded-full bg-brand-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
          M
        </span>
      )}
      {expression && (
        <div className="relative mb-1 min-h-5 truncate text-right text-sm font-medium text-text-tertiary">
          {expression}
        </div>
      )}
      <div
        className={[
          "tabular-display relative break-all text-right font-bold text-text-primary",
          value.length > 12
            ? compact
              ? "text-2xl sm:text-3xl md:text-xl"
              : "text-2xl sm:text-3xl"
            : compact
              ? "text-3xl sm:text-4xl md:text-2xl"
              : "text-3xl sm:text-4xl",
        ].join(" ")}
      >
        {value}
      </div>
      {secondary && (
        <div className="relative mt-1 text-right text-xs text-text-tertiary">
          {secondary}
        </div>
      )}
    </div>
  );
}
