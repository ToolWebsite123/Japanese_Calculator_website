"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { pathsEqual } from "@/lib/path";

export function NavbarCalcLinks() {
  const { t } = useLocale();
  const pathname = usePathname();
  const allCalculatorsActive = pathsEqual(pathname, "/calculators");

  return (
    <div className="hidden items-center lg:flex" suppressHydrationWarning>
      <nav aria-label="カテゴリ別ナビゲーション" suppressHydrationWarning>
        <Link
          href="/calculators"
          suppressHydrationWarning
          className={[
            "rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition",
            allCalculatorsActive
              ? "bg-brand-muted text-brand"
              : "text-[#231942] hover:bg-surface-sunken hover:opacity-80 dark:text-[#d6ccf0]",
          ].join(" ")}
        >
          {t.nav.allCalculators}
        </Link>
      </nav>
    </div>
  );
}
