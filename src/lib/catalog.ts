import ja from "@/lib/i18n/ja";
import {
  NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  type CalculatorCategory,
  type NavItem,
} from "@/lib/constants";

export type CategoryMeta = {
  id: CalculatorCategory;
  nameKey: keyof typeof ja.categories;
  descriptionKey: keyof typeof ja.categories;
  accentClass: string;
  accentMutedClass: string;
  borderClass: string;
  featuredHrefs: string[];
};

export const CATEGORY_ORDER: CalculatorCategory[] = [
  "basic",
  "scientific",
  "finance",
  "health",
  "conversion",
  "more",
];

export const CATEGORY_META: Record<CalculatorCategory, CategoryMeta> = {
  basic: {
    id: "basic",
    nameKey: "basicName",
    descriptionKey: "basicDescription",
    accentClass: "text-brand",
    accentMutedClass: "bg-brand-muted",
    borderClass: "border-l-brand",
    featuredHrefs: ["/consumption-tax-calculator", "/percentage-calculator", "/time-calculator"],
  },
  scientific: {
    id: "scientific",
    nameKey: "scientificName",
    descriptionKey: "scientificDescription",
    accentClass: "text-brand",
    accentMutedClass: "bg-brand-muted",
    borderClass: "border-l-brand",
    featuredHrefs: ["/scientific-calculator", "/fraction-calculator", "/algebra-calculator"],
  },
  finance: {
    id: "finance",
    nameKey: "financeName",
    descriptionKey: "financeDescription",
    accentClass: "text-brand",
    accentMutedClass: "bg-brand-muted",
    borderClass: "border-l-brand",
    featuredHrefs: [
      "/financial-calculator",
      "/compound-interest-calculator",
      "/interest-calculator",
    ],
  },
  health: {
    id: "health",
    nameKey: "healthName",
    descriptionKey: "healthDescription",
    accentClass: "text-brand",
    accentMutedClass: "bg-brand-muted",
    borderClass: "border-l-brand",
    featuredHrefs: ["/bmi-calculator"],
  },
  conversion: {
    id: "conversion",
    nameKey: "conversionName",
    descriptionKey: "conversionDescription",
    accentClass: "text-brand",
    accentMutedClass: "bg-brand-muted",
    borderClass: "border-l-brand",
    featuredHrefs: ["/unit-converter", "/era-converter"],
  },
  more: {
    id: "more",
    nameKey: "moreName",
    descriptionKey: "moreDescription",
    accentClass: "text-brand",
    accentMutedClass: "bg-brand-muted",
    borderClass: "border-l-brand",
    featuredHrefs: [
      "/long-division-calculator",
      "/factorization-calculator",
      "/simultaneous-equations-calculator",
    ],
  },
};

export const POPULAR_HREFS = [
  "/scientific-calculator",
  "/financial-calculator",
  "/compound-interest-calculator",
  "/bmi-calculator",
  "/fraction-calculator",
  "/percentage-calculator",
  "/unit-converter",
] as const;

function getNavLabel(item: NavItem): string {
  const key = item.labelKey.replace("nav.", "") as keyof typeof ja.nav;
  return ja.nav[key] ?? item.labelKey;
}

function getNavDescription(item: NavItem): string {
  if (!item.descriptionKey) return "";
  const [section, field] = item.descriptionKey.split(".") as [keyof typeof ja, string];
  const sectionData = ja[section];
  if (sectionData && typeof sectionData === "object" && field in sectionData) {
    return (sectionData as Record<string, string>)[field];
  }
  return "";
}

export function getCategoryMeta(category: CalculatorCategory): CategoryMeta {
  return CATEGORY_META[category];
}

export function getCalculatorsByCategory(category: CalculatorCategory): NavItem[] {
  if (category === "more") {
    return SECONDARY_NAV_ITEMS;
  }
  return NAV_ITEMS.filter((item) => item.category === category);
}

/**
 * Tools grouped strictly by each item's declared category, so every
 * calculator appears exactly once. (getCalculatorsByCategory treats
 * "more" as a catch-all list of all secondary tools, which would flood
 * grouped listings with duplicates; here "more" holds only its own
 * tools.) Used by the mega menu and the footer.
 */
export function getCalculatorsByDeclaredCategory(category: CalculatorCategory): NavItem[] {
  return NAV_ITEMS.filter((item) => item.category === category);
}

/**
 * The footer's link list, in display order: only the 12 most-used
 * calculators (owner decision 2026-11-03), shown as two plain columns
 * of six next to the legal links in the footer's single row. Every
 * other tool stays reachable from the mega menu, the /calculators hub
 * and in-page links.
 */
export const FOOTER_HREFS = [
  // first column
  "/character-counter",
  "/bmi-calculator",
  "/furusato-nozei-calculation",
  "/scientific-calculator",
  "/unit-converter",
  "/consumption-tax-calculator",
  // second column
  "/time-calculator",
  "/percentage-calculator",
  "/compound-interest-calculator",
  "/discount-calculation",
  "/due-date-calculation",
  "/income-tax-calculation",
] as const;

export function getFooterLinkColumns(): NavItem[][] {
  const items = FOOTER_HREFS.map((href) => NAV_ITEMS.find((item) => item.href === href)).filter(
    (item): item is NavItem => item !== undefined,
  );
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
}

export function getFeaturedCalculators(category: CalculatorCategory): NavItem[] {
  return CATEGORY_META[category].featuredHrefs
    .map((href) => NAV_ITEMS.find((item) => item.href === href))
    .filter((item): item is NavItem => item !== undefined);
}

export function getPopularCalculators(): NavItem[] {
  return POPULAR_HREFS.map((href) => NAV_ITEMS.find((item) => item.href === href)).filter(
    (item): item is NavItem => item !== undefined,
  );
}

export function getCalculatorByHref(href: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.href === href);
}

export type SearchResult = NavItem & {
  label: string;
  description: string;
};

export function searchCalculators(query: string): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return NAV_ITEMS.filter((item) => {
    const label = getNavLabel(item).toLowerCase();
    const description = getNavDescription(item).toLowerCase();
    return label.includes(normalized) || description.includes(normalized);
  }).map((item) => ({
    ...item,
    label: getNavLabel(item),
    description: getNavDescription(item),
  }));
}

export { getNavLabel, getNavDescription };
