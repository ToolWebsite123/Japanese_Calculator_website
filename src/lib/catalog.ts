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
    featuredHrefs: ["/web-calculator", "/percentage-calculator", "/time-calculator"],
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
    featuredHrefs: ["/financial-calculator", "/compound-interest-calculator", "/interest-calculator"],
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
    featuredHrefs: ["/long-division-calculator", "/factorization-calculator", "/simultaneous-equations-calculator"],
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
  "/web-calculator",
] as const;

function getNavLabel(item: NavItem): string {
  const key = item.labelKey.replace("nav.", "") as keyof typeof ja.nav;
  return ja.nav[key] ?? item.labelKey;
}

function getNavDescription(item: NavItem): string {
  if (!item.descriptionKey) return "";
  const [section, field] = item.descriptionKey.split(".") as [
    keyof typeof ja,
    string,
  ];
  const sectionData = ja[section];
  if (sectionData && typeof sectionData === "object" && field in sectionData) {
    return (sectionData as Record<string, string>)[field];
  }
  return "";
}

export function getCategoryMeta(category: CalculatorCategory): CategoryMeta {
  return CATEGORY_META[category];
}

export function getCalculatorsByCategory(
  category: CalculatorCategory
): NavItem[] {
  if (category === "more") {
    return SECONDARY_NAV_ITEMS;
  }
  return NAV_ITEMS.filter((item) => item.category === category);
}

export function getFeaturedCalculators(
  category: CalculatorCategory
): NavItem[] {
  return CATEGORY_META[category].featuredHrefs
    .map((href) => NAV_ITEMS.find((item) => item.href === href))
    .filter((item): item is NavItem => item !== undefined);
}

export function getPopularCalculators(): NavItem[] {
  return POPULAR_HREFS.map((href) =>
    NAV_ITEMS.find((item) => item.href === href)
  ).filter((item): item is NavItem => item !== undefined);
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
