"use client";

import { useRouterState } from "@tanstack/react-router";
import Link from "next/link";
import { CalculatorCard } from "@/components/home/CalculatorCard";
import {
  POPULAR_HREFS,
  getCalculatorsByCategory,
  getNavLabel,
  getNavDescription,
} from "@/lib/catalog";
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <CalculatorCard
            key={item.href}
            href={item.href}
            label={getNavLabel(item)}
            description={getNavDescription(item)}
          />
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
