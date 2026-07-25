"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SearchInput } from "@/components/home/SearchInput";
import { type NavItem } from "@/lib/constants";
import {
  CATEGORY_ORDER,
  CATEGORY_META,
  getCalculatorsByCategory,
  getNavLabel,
} from "@/lib/catalog";
import { CalculatorIcon } from "@/components/icons/CalculatorIcon";
import { useLocale } from "@/context/LocaleContext";
import { pathsEqual } from "@/lib/path";
import { IconButton } from "@/components/ui/primitives";

type MobileNavProps = {
  menuOpen: boolean;
  onMenuClose: () => void;
  menuId?: string;
  showBottomBar?: boolean;
};

function DrawerLink({
  item,
  pathname,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
}) {
  const active = pathsEqual(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={[
        "group relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium transition-all duration-150",
        active
          ? "bg-brand-muted text-brand"
          : "text-brand hover:bg-surface-sunken hover:opacity-80 dark:text-[#d6ccf0]",
      ].join(" ")}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand" />
      )}
      <span
        className={[
          "flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)]",
          active
            ? "bg-brand text-white"
            : "bg-surface-sunken text-brand",
        ].join(" ")}
      >
        <CalculatorIcon className="h-4 w-4" />
      </span>
      {getNavLabel(item)}
    </Link>
  );
}

function CategorySection({
  title,
  items,
  pathname,
  onClose,
  defaultOpen,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onClose: () => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary hover:bg-surface-sunken"
      >
        <span>{title}</span>
        <span aria-hidden="true" className="text-xs">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="mt-1 space-y-1">
          {items.map((item) => (
            <DrawerLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}


export function MobileNav({
  menuOpen,
  onMenuClose,
  menuId,
  showBottomBar = false,
}: MobileNavProps) {
  const pathname = usePathname();
  const { t } = useLocale();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeButton = dialogRef.current?.querySelector<HTMLElement>(
      '[data-mobile-nav-close="true"]'
    );
    closeButton?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onMenuClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, onMenuClose]);

  return (
    <>
      {showBottomBar && null}

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onMenuClose}
            aria-hidden="true"
          />
          <div
            ref={dialogRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-surface-raised p-4 animate-fade-in lg:hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-brand">{t.appName}</div>
                <div className="text-xs text-text-tertiary">{t.appTagline}</div>
              </div>
              <IconButton
                onClick={onMenuClose}
                aria-label={t.common.close}
                data-mobile-nav-close="true"
              >
                ✕
              </IconButton>
            </div>

            <div className="mb-4 sm:hidden">
              <SearchInput size="compact" />
            </div>

            <nav className="space-y-2" aria-label="計算機メニュー">
              <Link
                href="/calculators"
                onClick={onMenuClose}
                className={[
                  "group relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium transition-all duration-150",
                  pathsEqual(pathname, "/calculators")
                    ? "bg-brand-muted text-brand"
                    : "text-brand hover:bg-surface-sunken hover:opacity-80 dark:text-[#d6ccf0]",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)]",
                    pathsEqual(pathname, "/calculators")
                      ? "bg-brand text-white"
                      : "bg-surface-sunken text-brand",
                  ].join(" ")}
                >
                  <CalculatorIcon className="h-4 w-4" />
                </span>
                {t.nav.allCalculators}
              </Link>

              {CATEGORY_ORDER.filter((catId) => catId !== "more").map((catId) => {
                const meta = CATEGORY_META[catId];
                const items = getCalculatorsByCategory(catId);
                if (items.length === 0) return null;
                const name = t.categories[meta.nameKey];
                const hasActive = items.some((i) => pathsEqual(pathname, i.href));
                return (
                  <CategorySection
                    key={catId}
                    title={name}
                    items={items}
                    pathname={pathname}
                    onClose={onMenuClose}
                    defaultOpen={hasActive}
                  />
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
