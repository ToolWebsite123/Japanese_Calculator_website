"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalculatorIcon } from "@/components/icons/CalculatorIcon";
import { SearchInput } from "@/components/home/SearchInput";
import { NavbarCalcLinks } from "@/components/layout/NavbarCalcLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { IconButton } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";

type NavbarProps = {
  onMenuOpen?: () => void;
  menuOpen?: boolean;
  menuId?: string;
};

/**
 * The site's single header (redesigned 2026-11-02): one sticky bar,
 * ~80px tall. Left: brand (logo + name + tagline). Center (desktop):
 * main navigation with the calculator dropdown. Right: search + theme
 * toggle. On small screens the search collapses to an icon that expands
 * a search row inside this same header; navigation moves to the
 * hamburger drawer (MobileNav). There is no second header anywhere.
 */

export function Navbar({ onMenuOpen, menuOpen = false, menuId }: NavbarProps) {
  const { t } = useLocale();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 border-b border-border bg-surface-raised"
      style={{
        boxShadow: scrolled
          ? "0 6px 20px rgba(35, 25, 66, 0.13)"
          : "0 1px 3px rgba(35, 25, 66, 0.05)",
      }}
      suppressHydrationWarning
    >
      <div className="relative mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <IconButton
            onClick={onMenuOpen}
            className="lg:hidden"
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            suppressHydrationWarning
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </IconButton>
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="電卓.online（トップページ）"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-brand text-white"
              aria-hidden="true"
            >
              <CalculatorIcon className="h-6 w-6" />
            </span>
            <span className="flex min-w-0 flex-col justify-center leading-tight">
              <span
                className="block truncate text-lg font-bold text-brand dark:text-[#d6ccf0]"
                suppressHydrationWarning
              >
                電卓.online
              </span>
              <span
                className="mt-0.5 hidden truncate text-[11px] text-text-tertiary sm:block"
                suppressHydrationWarning
              >
                {t.headerTagline}
              </span>
            </span>
          </Link>
        </div>

        <NavbarCalcLinks />

        <div className="ml-auto flex min-w-0 items-center gap-3">
          <div className="hidden w-48 min-w-0 md:block lg:w-60">
            <SearchInput size="compact" placeholder="計算機を検索…" />
          </div>
          <IconButton
            onClick={() => setSearchOpen((v) => !v)}
            className="md:hidden"
            aria-label={t.home.searchLabel}
            aria-expanded={searchOpen}
            suppressHydrationWarning
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </IconButton>
          <ThemeToggle />
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden" suppressHydrationWarning>
          <SearchInput size="compact" autoFocus placeholder="計算機を検索…" />
        </div>
      )}
    </header>
  );
}
