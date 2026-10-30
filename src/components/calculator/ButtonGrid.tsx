"use client";

import { Fragment } from "react";
import { Button, type ButtonVariant } from "./Button";

export type ButtonConfig = {
  id: string;
  label: React.ReactNode;
  variant?: ButtonVariant;
  span?: 1 | 2;
  active?: boolean;
  onClick: () => void;
  ariaLabel?: string;
};

type ButtonGridProps = {
  buttons: ButtonConfig[];
  columns?: 4 | 5 | 6 | 7;
  className?: string;
  compact?: boolean;
  /** Insert a visual separator before buttons at these indices */
  separatorsBefore?: number[];
};

const colClasses = {
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
};

export function ButtonGrid({
  buttons,
  columns = 4,
  className = "",
  compact = false,
  separatorsBefore = [],
}: ButtonGridProps) {
  const separatorSet = new Set(separatorsBefore);

  return (
    <div
      className={[
        "grid",
        // H-09: slightly wider compact gaps (6px/8px, was 4px/6px) so the
        // taller compact keys (36px+) read as separate tap targets.
        compact ? "gap-1.5 sm:gap-2" : "gap-2 sm:gap-2.5",
        colClasses[columns],
        className,
      ].join(" ")}
      role="group"
      aria-label="電卓キーパッド"
    >
      {buttons.map((btn, index) => (
        <Fragment key={btn.id}>
          {separatorSet.has(index) && (
            <div
              className="col-span-full my-0.5 h-px bg-border"
              style={{ gridColumn: "1 / -1" }}
              aria-hidden
            />
          )}
          <Button
            label={btn.label}
            variant={btn.variant}
            span={btn.span}
            active={btn.active}
            compact={compact}
            onClick={btn.onClick}
            aria-label={btn.ariaLabel ?? String(btn.label)}
            className="w-full"
          />
        </Fragment>
      ))}
    </div>
  );
}
