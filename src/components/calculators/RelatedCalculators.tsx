"use client";

import { useRouterState } from "@tanstack/react-router";
import Link from "next/link";
import { CalculatorIcon } from "@/components/icons/CalculatorIcon";
import {
  CATEGORY_META,
  POPULAR_HREFS,
  getCalculatorsByCategory,
  getNavLabel,
  getNavDescription,
} from "@/lib/catalog";
import ja from "@/lib/i18n/ja";
import { NAV_ITEMS, type NavItem } from "@/lib/constants";

export function RelatedCalculators({
  activeHref: activeHrefProp,
}: {
  activeHref?: string;
} = {}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeHref = activeHrefProp ?? pathname;
  const current = NAV_ITEMS.find((i) => i.href === activeHref);
  if (!current) return null;

  const sameCategory = getCalculatorsByCategory(current.category).filter(
    (i) => i.href !== current.href,
  );

  const picked: NavItem[] = [...sameCategory];
  const takenHrefs = new Set<string>(picked.map((i) => i.href));
  takenHrefs.add(current.href);

  for (const href of POPULAR_HREFS) {
    if (picked.length >= 4) break;
    if (takenHrefs.has(href)) continue;
    const item = NAV_ITEMS.find((i) => i.href === href);
    if (!item) continue;
    picked.push(item);
    takenHrefs.add(href);
  }

  const items = picked.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="related-calculators-heading"
      className="mt-16 border-t border-border pt-16"
    >
      <h2
        id="related-calculators-heading"
        className="mb-6 text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
      >
        関連する計算機
      </h2>
      <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex h-full items-center gap-3.5 rounded-[var(--radius-xl)] border border-border bg-surface-raised p-4 transition duration-200 hover:border-brand/30 hover:shadow-[var(--shadow-card)] sm:p-5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-brand-muted text-brand transition group-hover:bg-brand group-hover:text-white">
              <CalculatorIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-bold text-text-primary group-hover:text-brand">
                {getNavLabel(item)}
                <span className="rounded-full bg-brand-muted px-2 py-0.5 text-[10px] font-bold text-brand">
                  {ja.categories[CATEGORY_META[item.category].nameKey]}
                </span>
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-text-tertiary">
                {getNavDescription(item)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Full index of every calculator. This guarantees that every
          calculator page links to every other one in the server-rendered
          HTML, so no page can become an orphan (audit H-02). */}
      <nav aria-label="すべての計算機" className="mt-10">
        <h3 className="mb-3 text-sm font-semibold text-text-secondary">すべての計算機</h3>
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {NAV_ITEMS.filter((item) => item.href !== current.href).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-text-secondary underline-offset-2 transition-colors hover:text-brand hover:underline"
              >
                {getNavLabel(item)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
