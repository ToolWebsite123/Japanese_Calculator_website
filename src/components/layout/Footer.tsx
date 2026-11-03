"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { getFooterLinkColumns, getNavLabel } from "@/lib/catalog";

/**
 * Site footer: a single row (owner decision 2026-11-03) — two columns
 * of the most-used calculator links on the left, the legal/site links
 * on the right. No brand block, category grid or copyright row; the
 * full tool list lives in the mega menu and on /calculators.
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
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
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
    </footer>
  );
}
