"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { getFooterLinkColumns, getNavLabel } from "@/lib/catalog";

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
 * Site footer: a single row (owner decision 2026-11-03) — the brand
 * box (logo, tagline, すべての電卓 link) on the left, and three link
 * columns on the right: two columns of the most-used calculators and
 * the legal/site links. No category grid or copyright row; the full
 * tool list lives in the mega menu and on /calculators.
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

  return (
    <footer className="border-t border-border/20 px-4 py-12 sm:px-6" suppressHydrationWarning>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
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

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav aria-label="フッター計算ツールナビゲーション" suppressHydrationWarning>
              <div className="grid grid-cols-2 gap-x-12">
                {getFooterLinkColumns().map((column, columnIndex) => (
                  <ul key={columnIndex} className="flex flex-col gap-2">
                    {column.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className={linkClass}>
                          {getNavLabel(item)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </nav>

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
        </div>
      </div>
    </footer>
  );
}
