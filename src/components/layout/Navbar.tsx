"use client";

import Link from "next/link";
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

export function Navbar({ onMenuOpen, menuOpen = false, menuId }: NavbarProps) {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface-raised" suppressHydrationWarning>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <IconButton
            onClick={onMenuOpen}
            className="sm:hidden"
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
            className="flex min-w-0 items-center gap-2"
            aria-label="電卓.online（トップページ）"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-brand text-white"
              aria-hidden="true"
            >
              <CalculatorIcon className="h-5 w-5" />
            </span>
            <span className="flex min-w-0 flex-col justify-center leading-tight">
              <span
                className="block truncate text-base font-semibold text-brand dark:text-[#d6ccf0]"
                suppressHydrationWarning
              >
                電卓.online
              </span>
              <span
                className="mt-0.5 hidden truncate text-[11px] text-text-tertiary sm:block"
                suppressHydrationWarning
              >
                登録いらず、すぐ使える計算ツール
              </span>
            </span>
          </Link>
        </div>

        <NavbarCalcLinks />

        <div className="ml-auto flex min-w-0 items-center gap-2">
          <div className="hidden w-44 min-w-0 sm:block md:w-52 lg:w-60">
            <SearchInput size="compact" />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
