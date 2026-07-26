"use client";

import { useEffect, useId, useRef, useState } from "react";

export type UnitOption = { value: string; label: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: UnitOption[];
  ariaLabel?: string;
  className?: string;
};

export function UnitListbox({ value, onChange, options, ariaLabel, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      options.findIndex((o) => o.value === value),
    ),
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        !listRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      const idx = Math.max(
        0,
        options.findIndex((o) => o.value === value),
      );
      setActiveIndex(idx);
      listRef.current?.focus();
    }
  }, [open, options, value]);

  const commit = (idx: number) => {
    const opt = options[idx];
    if (opt) {
      onChange(opt.value);
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(activeIndex);
    }
  };

  return (
    <div className={`relative ${className}`} translate="no">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        translate="no"
        className={[
          "w-full min-h-11 rounded-[var(--radius-md)] border border-border",
          "bg-surface-sunken px-4 py-3 text-base text-text-primary outline-none transition",
          "focus:border-brand focus:ring-2 focus:ring-brand/20",
          "flex items-center justify-between text-left text-lg",
        ].join(" ")}
      >
        <span translate="no">{selected?.label}</span>
        <span aria-hidden="true" className="ml-2 text-text-tertiary">
          ▾
        </span>
      </button>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
          translate="no"
          className={[
            "absolute z-50 mt-1 w-full overflow-hidden rounded-[var(--radius-md)]",
            "border border-border bg-surface-sunken shadow-lg outline-none",
          ].join(" ")}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isActive = idx === activeIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => commit(idx)}
                translate="no"
                className={[
                  "cursor-pointer px-4 py-2.5 text-base text-text-primary",
                  isActive ? "bg-brand/10" : "",
                  isSelected ? "font-semibold" : "",
                ].join(" ")}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
