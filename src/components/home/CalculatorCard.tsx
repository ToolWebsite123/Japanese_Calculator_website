"use client";

import Link from "next/link";
import { CalculatorIcon } from "@/components/icons/CalculatorIcon";

type CalculatorCardProps = {
  href: string;
  label: string;
  description?: string;
  active?: boolean;
};

export function CalculatorCard({ href, label, description, active = false }: CalculatorCardProps) {
  return (
    <Link
      href={href}
      className={[
        "group flex min-h-[148px] h-full flex-col rounded-[var(--radius-xl)] border bg-surface-raised p-5 transition duration-200 sm:p-6",
        "hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[var(--shadow-card)]",
        active ? "border-brand/40 ring-2 ring-brand/30" : "border-border",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition",
          active
            ? "bg-brand text-white"
            : "bg-brand-muted text-brand group-hover:bg-brand group-hover:text-white",
        ].join(" ")}
      >
        <CalculatorIcon className="h-6 w-6" />
      </div>
      <h3
        className={[
          "mt-4 text-base font-bold",
          active ? "text-brand" : "text-text-primary group-hover:text-brand",
        ].join(" ")}
      >
        {label}
      </h3>
      {description && (
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-text-tertiary">
          {description}
        </p>
      )}
    </Link>
  );
}
