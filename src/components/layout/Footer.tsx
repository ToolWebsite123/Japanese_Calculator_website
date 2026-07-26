"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

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

export function Footer() {
  const { t } = useLocale();

  const legalLinks = [
    { href: "/about", label: t.footer.aboutUs },
    { href: "/privacy-policy", label: t.footer.privacy },
    { href: "/terms", label: t.footer.terms },
    { href: "/contact", label: t.footer.contact },
    { href: "/disclaimer", label: t.footer.disclaimer },
  ];

  const calculatorLinks = [
    { href: "/scientific-calculator", label: t.footer.scientificCalculator },
    { href: "/squareroot-calculator", label: t.footer.squareRootCalculator },
    { href: "/bmi-calculator", label: t.footer.bmiCalculation },
    { href: "/due-date-calculation", label: t.footer.dueDateCalculation },
    { href: "/furusato-nozei-calculation", label: t.footer.hometownTaxDonation },
    { href: "/web-calculator", label: t.nav.webCalculator },
  ];

  const linkClass = "text-sm text-black transition hover:opacity-80 dark:text-foreground";

  return (
    <footer className="border-t border-border/20 px-4 py-12 sm:px-6 sm:py-16" suppressHydrationWarning>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-3 sm:max-w-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-lg font-bold text-black dark:text-foreground"
              suppressHydrationWarning
            >
              <LogoIcon className="h-5 w-5" />
              電卓
            </Link>
            <p className="text-sm leading-relaxed text-black/70 dark:text-foreground/70" suppressHydrationWarning>
              {t.home.footerTagline}
            </p>
          </div>

          <div className="flex flex-col gap-12 sm:flex-row sm:gap-16 lg:gap-24">
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

            <nav aria-label="フッター計算ツールナビゲーション" suppressHydrationWarning>
              <h3 className="mb-3 text-sm font-semibold text-black dark:text-foreground">
                {t.footer.calculators}
              </h3>
              <ul className="flex flex-col gap-2">
                {calculatorLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-border/20 pt-6">
          <p className="text-xs text-black/70 dark:text-foreground/70">{t.home.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
}
