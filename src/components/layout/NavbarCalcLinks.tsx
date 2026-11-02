"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorIcon } from "@/components/icons/CalculatorIcon";
import { useLocale } from "@/context/LocaleContext";
import { NAV_ITEMS, type CalculatorCategory, type NavItem } from "@/lib/constants";
import {
  CATEGORY_ORDER,
  getCalculatorsByCategory,
  getNavLabel,
  searchCalculators,
} from "@/lib/catalog";
import { pathsEqual } from "@/lib/path";

/** Sidebar labels for the mega menu, as approved in the design spec. */
const MENU_CATEGORY_LABELS: Record<CalculatorCategory, string> = {
  basic: "基本",
  scientific: "関数・数学",
  finance: "金融",
  health: "健康",
  conversion: "変換",
  more: "その他",
};

/**
 * Center navigation of the single site header: ホーム / 電卓一覧 / 使い方.
 * 電卓一覧 opens a compact mega menu (redesigned 2026-11-02): a search
 * field at the top filters all calculators; below it a category sidebar
 * switches the calculator cards on the right. The menu closes on outside
 * click, on Escape (returning focus to its button) and on route change.
 * The active top-level item gets brand-purple text and an underline bar.
 */
export function NavbarCalcLinks() {
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CalculatorCategory>("basic");
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const homeActive = pathsEqual(pathname, "/");
  const listActive =
    pathsEqual(pathname, "/calculators") ||
    NAV_ITEMS.some((item) => pathsEqual(pathname, item.href));

  const searching = query.trim() !== "";
  const searchResults = useMemo(
    () => (searching ? searchCalculators(query.trim()) : []),
    [query, searching],
  );
  const visibleItems: NavItem[] = searching
    ? searchResults
    : getCalculatorsByCategory(activeCategory);

  // Every time the menu opens, start from the category of the page the
  // visitor is on (or 基本) with an empty search.
  useEffect(() => {
    if (!dropdownOpen) return;
    const current = NAV_ITEMS.find((item) => pathsEqual(pathname, item.href));
    setActiveCategory(current?.category ?? "basic");
    setQuery("");
  }, [dropdownOpen, pathname]);

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

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && searching) {
      // First Escape inside the search only clears the text; the global
      // handler still closes the menu on the next Escape.
      event.stopPropagation();
      setQuery("");
      return;
    }
    if (event.key === "Enter" && searchResults.length === 1) {
      event.preventDefault();
      setDropdownOpen(false);
      router.push(searchResults[0].href);
    }
  }

  function renderCard(item: NavItem) {
    const active = pathsEqual(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setDropdownOpen(false)}
        aria-current={active ? "page" : undefined}
        className={[
          "flex min-w-0 items-center gap-2.5 rounded-[var(--radius-md)] border px-2.5 py-2 transition",
          active
            ? "border-brand/30 bg-brand-muted/60 text-brand dark:text-[#d6ccf0]"
            : "border-transparent text-text-secondary hover:border-brand/25 hover:bg-brand-muted/50 hover:text-brand",
        ].join(" ")}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-surface-sunken text-brand"
          aria-hidden="true"
        >
          <CalculatorIcon className="h-4 w-4" />
        </span>
        <span className={`truncate text-sm ${active ? "font-semibold" : "font-medium"}`}>
          {getNavLabel(item)}
        </span>
      </Link>
    );
  }

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
            className="absolute left-1/2 top-full z-40 w-[720px] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-2"
            suppressHydrationWarning
          >
            <div
              className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-raised"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="border-b border-border p-3">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="電卓を検索…"
                    autoFocus
                    autoComplete="off"
                    aria-label="電卓を検索"
                    className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 pl-9 text-sm text-text-primary placeholder:text-text-tertiary transition focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>

              <div className="flex">
                <div className="flex w-44 shrink-0 flex-col gap-0.5 border-r border-border p-2">
                  {CATEGORY_ORDER.map((catId) => {
                    const count = getCalculatorsByCategory(catId).length;
                    if (count === 0) return null;
                    const selected = !searching && activeCategory === catId;
                    return (
                      <button
                        key={catId}
                        type="button"
                        onClick={() => {
                          setActiveCategory(catId);
                          setQuery("");
                        }}
                        aria-current={selected ? "true" : undefined}
                        className={[
                          "flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-left text-sm transition",
                          selected
                            ? "bg-brand-muted font-semibold text-brand dark:text-[#d6ccf0]"
                            : "text-text-secondary hover:bg-surface-sunken hover:text-brand",
                        ].join(" ")}
                      >
                        <span>{MENU_CATEGORY_LABELS[catId]}</span>
                        <span className="text-xs text-text-tertiary">{count}</span>
                      </button>
                    );
                  })}
                  <div className="mt-auto border-t border-border pt-2">
                    <Link
                      href="/calculators"
                      onClick={() => setDropdownOpen(false)}
                      className="block rounded-[var(--radius-md)] px-3 py-2 text-sm font-bold text-brand transition hover:bg-surface-sunken dark:text-[#d6ccf0]"
                    >
                      {t.nav.allCalculators} →
                    </Link>
                  </div>
                </div>

                <div className="max-h-[46vh] min-w-0 flex-1 overflow-y-auto p-3">
                  {searching && (
                    <div className="mb-2 px-1 text-xs text-text-tertiary">
                      検索結果（{searchResults.length}件）
                    </div>
                  )}
                  {visibleItems.length === 0 ? (
                    <p className="px-1 py-6 text-center text-sm text-text-tertiary">
                      該当する電卓が見つかりませんでした
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">{visibleItems.map(renderCard)}</div>
                  )}
                </div>
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
