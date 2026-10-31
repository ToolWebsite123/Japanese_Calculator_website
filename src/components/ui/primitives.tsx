"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({
  children,
  className = "",
  ...props
}: BaseButtonProps & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={[
        "flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)]",
        "bg-surface-sunken text-brand transition-all duration-150 dark:text-[#d6ccf0]",
        "hover:bg-border hover:text-text-primary",
        "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        "dark:hover:bg-zinc-700",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  className = "",
  fullWidth = true,
  ...props
}: BaseButtonProps & { children: ReactNode; fullWidth?: boolean }) {
  return (
    <button
      type="button"
      className={[
        "btn-interactive min-h-11 bg-gradient-to-b from-brand to-brand-hover text-white",
        "text-sm font-semibold hover:brightness-110",
        fullWidth ? "w-full" : "",
        "py-3",
        className,
      ].join(" ")}
      style={{ boxShadow: "var(--shadow-brand)" }}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  fullWidth = false,
  ...props
}: BaseButtonProps & { children: ReactNode; fullWidth?: boolean }) {
  return (
    <button
      type="button"
      className={[
        "btn-interactive min-h-11 bg-surface-sunken text-brand dark:text-[#d6ccf0]",
        "border border-border text-sm font-semibold",
        "hover:bg-border-subtle",
        fullWidth ? "w-full" : "",
        "py-3",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

type SegmentedOption<T extends string> = {
  value: T;
  label: ReactNode;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  columns,
  className = "",
  size = "md",
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: number;
  className?: string;
  size?: "md" | "lg";
}) {
  const cols = columns ?? options.length;
  return (
    <div
      className={[
        "grid gap-2",
        cols === 2
          ? "grid-cols-2"
          : cols === 3
            ? "grid-cols-3"
            : cols === 4
              ? "grid-cols-4"
              : cols === 5
                ? "grid-cols-2 sm:grid-cols-5"
                : "grid-cols-2",
        className,
      ].join(" ")}
      role="group"
      aria-label="選択"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              "btn-interactive font-semibold",
              size === "lg" ? "min-h-14 py-4 text-2xl" : "min-h-11 py-3 text-sm",
              active
                ? "bg-gradient-to-b from-brand to-brand-hover text-white"
                : "border border-border bg-surface-sunken text-[#231942] hover:bg-border-subtle dark:text-[#d6ccf0]",
            ].join(" ")}
            style={active ? { boxShadow: "var(--shadow-brand)" } : undefined}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ChipButton({
  children,
  active = false,
  className = "",
  ...props
}: BaseButtonProps & { children: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      className={[
        "btn-interactive min-h-9 rounded-[var(--radius-sm)] px-3 text-sm font-medium",
        active
          ? "bg-gradient-to-b from-brand to-brand-hover text-white"
          : "border border-border bg-surface-sunken text-[#231942] hover:bg-border-subtle dark:text-[#d6ccf0]",
        className,
      ].join(" ")}
      style={active ? { boxShadow: "var(--shadow-brand)" } : undefined}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mb-1.5 text-sm font-medium text-text-secondary">{children}</div>;
}

export function InputWell({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "w-full min-h-11 rounded-[var(--radius-md)] border border-border",
        "bg-surface-sunken px-4 py-3 text-base text-text-primary outline-none transition",
        "focus:border-brand focus:ring-2 focus:ring-brand/20",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function SelectWell({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={[
        "w-full min-h-11 rounded-[var(--radius-md)] border border-border",
        "bg-surface-sunken px-4 py-3 text-base text-text-primary outline-none transition",
        "focus:border-brand focus:ring-2 focus:ring-brand/20",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}

export function SurfacePanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-[var(--radius-lg)] border border-border bg-surface-sunken p-4 sm:p-5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Divider({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={["border-t border-border pt-6", className].join(" ")}>{children}</div>;
}
