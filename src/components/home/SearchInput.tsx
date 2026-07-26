"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchCalculators } from "@/lib/catalog";
import { CalculatorIcon } from "@/components/icons/CalculatorIcon";
import { useLocale } from "@/context/LocaleContext";

type SearchInputProps = {
  size?: "default" | "large" | "compact";
  className?: string;
  autoFocus?: boolean;
};

export function SearchInput({
  size = "default",
  className = "",
  autoFocus = false,
}: SearchInputProps) {
  const { t } = useLocale();
  const router = useRouter();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedQuery = query.trim();
  const results = useMemo(
    () => (trimmedQuery ? searchCalculators(trimmedQuery) : []),
    [trimmedQuery],
  );

  function handleQueryChange(value: string) {
    setQuery(value);
    const trimmed = value.trim();
    if (!trimmed) {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    const found = searchCalculators(trimmed);
    setOpen(true);
    setActiveIndex(found.length > 0 ? 0 : -1);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setQuery("");
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        const found = searchCalculators(query);
        if (found.length === 1) navigate(found[0].href);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          navigate(results[activeIndex].href);
        } else if (results.length === 1) {
          navigate(results[0].href);
        }
        break;
      case "Escape":
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  }

  const inputClasses =
    size === "large"
      ? "h-14 rounded-[var(--radius-xl)] px-5 pl-12 text-base"
      : size === "compact"
        ? "h-9 rounded-[var(--radius-md)] px-3 pl-9 text-sm"
        : "h-11 rounded-[var(--radius-lg)] px-4 pl-10 text-sm";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} suppressHydrationWarning>
      <div className="relative" role="search" suppressHydrationWarning>
        <label htmlFor={listboxId} className="sr-only" suppressHydrationWarning>
          {t.home.searchLabel}
        </label>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-text-tertiary ${
            size === "large"
              ? "left-4 h-5 w-5"
              : size === "compact"
                ? "left-2.5 h-3.5 w-3.5"
                : "left-3 h-4 w-4"
          }`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          ref={inputRef}
          id={listboxId}
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t.home.searchPlaceholder}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${listboxId}-listbox`}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          suppressHydrationWarning
          className={`w-full border border-border bg-surface-raised text-text-primary placeholder:text-text-tertiary transition focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20 ${inputClasses}`}
          style={{ boxShadow: "var(--shadow-card)" }}
        />
      </div>

      {open && (
        <ul
          id={`${listboxId}-listbox`}
          role="listbox"
          className="absolute top-full z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised py-1"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-text-tertiary">{t.home.searchNoResults}</li>
          ) : (
            results.map((item, index) => (
              <li
                key={item.href}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  onClick={() => navigate(item.href)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={[
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition",
                    index === activeIndex
                      ? "bg-brand-muted text-brand"
                      : "text-text-primary hover:bg-surface-sunken",
                  ].join(" ")}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-surface-sunken text-brand">
                    <CalculatorIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.label}</span>
                    {item.description && (
                      <span className="block truncate text-xs text-text-tertiary">
                        {item.description}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
