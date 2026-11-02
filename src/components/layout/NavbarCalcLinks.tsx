"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { NAV_ITEMS } from "@/lib/constants";
import {
  CATEGORY_ORDER,
  CATEGORY_META,
  getCalculatorsByCategory,
  getNavLabel,
} from "@/lib/catalog";
import { pathsEqual } from "@/lib/path";

/**
 * Center navigation of the single site header (redesigned 2026-11-02):
 * ホーム / 電卓一覧 (dropdown with every category and tool) / 使い方.
 * The active item gets the brand-purple text colour and an underline bar
 * that sits on the header's bottom border. The dropdown closes on outside
 * click, on Escape (returning focus to its button) and on route change.
 */
export function NavbarCalcLinks() {
  const { t } = useLocale();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const homeActive = pathsEqual(pathname, "/");
  const listActive =
    pathsEqual(pathname, "/calculators") ||
    NAV_ITEMS.some((item) => pathsEqual(pathname, item.href));

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const linkClass = (active: boolean) =>
    [
      "relative flex h-full items-center gap-1 px-3 text-sm font-medium transition",
      active
        ? "text-brand dark:text-[#d6ccf0]"
        : "text-[#231942] hover:text-brand dark:text-[#d6ccf0] dark:hover:text-white",
    ].join(" ");

  const underline = (
    <span
      aria-hidden="true"
      className="absolute inset-x-3 bottom-0 h-[2.5px] rounded-full bg-brand dark:bg-[#a794e0]"
    />
  );

  return (
    <nav
      aria-label="メインナビゲーション"
      className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 items-stretch lg:flex"
      suppressHydrationWarning
    >
      <Link href="/" className={linkClass(homeActive)} aria-current={homeActive ? "page" : undefined}>
        {t.nav.home}
        {homeActive && underline}
      </Link>

      <div ref={dropdownRef} className="relative flex items-stretch">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          className={linkClass(listActive)}
        >
          {t.nav.calculatorsList}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
          {listActive && underline}
        </button>

        {dropdownOpen && (
          <div
            className="absolute left-1/2 top-full z-40 w-[640px] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-2"
            suppressHydrationWarning
          >
            <div
              className="max-h-[70vh] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface-raised p-5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <Link
                href="/calculators"
                onClick={() => setDropdownOpen(false)}
                className="mb-4 inline-block text-sm font-bold text-brand hover:underline dark:text-[#d6ccf0]"
              >
                {t.nav.allCalculators} →
              </Link>
              <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                {CATEGORY_ORDER.map((catId) => {
                  const items = getCalculatorsByCategory(catId);
                  if (items.length === 0) return null;
                  return (
                    <div key={catId} className="min-w-0">
                      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                        {t.categories[CATEGORY_META[catId].nameKey]}
                      </div>
                      <ul className="space-y-0.5">
                        {items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setDropdownOpen(false)}
                              className={[
                                "block truncate rounded-[var(--radius-sm)] px-1.5 py-1 text-sm transition",
                                pathsEqual(pathname, item.href)
                                  ? "font-semibold text-brand dark:text-[#d6ccf0]"
                                  : "text-text-secondary hover:bg-surface-sunken hover:text-brand",
                              ].join(" ")}
                            >
                              {getNavLabel(item)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <Link href="/#how-to" className={linkClass(false)}>
        {t.nav.howToUse}
      </Link>
    </nav>
  );
}
