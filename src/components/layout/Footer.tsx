"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import {
  CATEGORY_ORDER,
  getCategoryMeta,
  getFooterCalculators,
  getNavLabel,
} from "@/lib/catalog";

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="2" width="18" height="20" rx="3" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <circle cx="8" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="17" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="17" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Site footer: brand block + site links on top, then the curated
 * most-used calculators grouped under their catalog categories
 * (data-driven from the shared catalog — the same source as the mega
 * menu and the hub page; the full 27-tool list lives in the mega menu
 * and on /calculators). The category grid is 2 columns on phones and
 * 3 on wider screens, so the six categories form two rows of three,
 * inside the footer's max-w-6xl container.
 */
export function Footer() {
  const { t } = useLocale();

  const legalLinks = [
    { href: "/about", label: t.footer.aboutUs },
    { href: "/privacy-policy", label: t.footer.privacy },
    { href: "/terms", label: t.footer.terms },
    { href: "/contact", label: t.footer.contact },
    { href: "/disclaimer", label: t.footer.disclaimer },
  ];

  const linkClass = "text-sm text-black transition hover:opacity-80 dark:text-text-primary";
  const headingClass = "mb-3 text-sm font-semibold text-black dark:text-text-primary";

  return (
    <footer className="border-t border-border/20 px-4 py-12 sm:px-6 sm:py-16" suppressHydrationWarning>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-3 sm:max-w-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-lg font-bold text-black dark:text-text-primary"
              suppressHydrationWarning
            >
              <LogoIcon className="h-5 w-5" />
              電卓
            </Link>
            <p className="text-sm leading-relaxed text-black/70 dark:text-text-secondary" suppressHydrationWarning>
              {t.home.footerTagline}
            </p>
            <p>
              <Link
                href="/calculators"
                className="text-sm font-semibold text-black transition hover:opacity-80 dark:text-text-primary"
                suppressHydrationWarning
              >
                {t.footer.allCalculators}
              </Link>
            </p>
          </div>

          <nav aria-label="フッター about ナビゲーション" suppressHydrationWarning>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass} suppressHydrationWarning>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <nav aria-label="フッター計算ツールナビゲーション" className="mt-12" suppressHydrationWarning>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {CATEGORY_ORDER.map((category) => {
              const meta = getCategoryMeta(category);
              const items = getFooterCalculators(category);
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <h3 className={headingClass}>{t.categories[meta.nameKey]}</h3>
                  <ul className="flex flex-col gap-2">
                    {items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className={linkClass}>
                          {getNavLabel(item)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="mt-10 border-t border-border/20 pt-6">
          <p className="text-xs text-black/70 dark:text-text-secondary">{t.home.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
}
