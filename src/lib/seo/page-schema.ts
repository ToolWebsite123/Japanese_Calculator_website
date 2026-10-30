import { absoluteUrl, SITE_NAME, SITE_URL } from "./site";

/** Default social image (SVG). Some platforms ignore SVG og images; a PNG
 *  replacement can be dropped in later without changing the meta wiring. */
export const OG_IMAGE_PATH = "/og-image.svg";
export const OG_IMAGE_URL = absoluteUrl(OG_IMAGE_PATH);
export const OG_IMAGE_ALT = "電卓.online｜無料のオンライン計算ツール集";

const FINANCE_PATHS = new Set([
  "/discount-calculation",
  "/financial-calculator",
  "/compound-interest-calculator",
  "/interest-calculator",
  "/income-tax-calculation",
  "/social-insurance-calculator",
  "/unemployment-insurance-calculation",
  "/furusato-nozei-calculation",
  "/furusato-nozei-simulation-calculation",
]);

/** Short display name for schema: page title without the brand suffix. */
export function schemaNameFromTitle(title: string): string {
  return title.split("｜")[0]?.trim() || title;
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/favicon.ico"),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebApplicationJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: absoluteUrl(path),
    description,
    applicationCategory: FINANCE_PATHS.has(path) ? "FinanceApplication" : "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: "ja-JP",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

type JsonLdScript = { type: "application/ld+json"; children: string };

function script(data: unknown): JsonLdScript {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

/**
 * Central per-page schema scripts.
 * - Calculator pages: WebApplication + BreadcrumbList (Home > 計算機一覧 > page)
 * - Legal pages: BreadcrumbList only (Home > page); their WebPage/ContactPage
 *   JSON-LD is emitted by the page components themselves.
 * FAQPage JSON-LD is intentionally NOT handled here: it stays where the
 * ported pages already emit it.
 */
export function buildPageSchemaScripts({
  path,
  title,
  description,
  isLegal,
}: {
  path: string;
  title: string;
  description: string;
  isLegal: boolean;
}): JsonLdScript[] {
  const name = schemaNameFromTitle(title);
  const crumbs = isLegal
    ? [
        { name: "ホーム", path: "/" },
        { name, path },
      ]
    : [
        { name: "ホーム", path: "/" },
        { name: "計算機一覧", path: "/calculators" },
        { name, path },
      ];

  const scripts: JsonLdScript[] = [];
  if (!isLegal) {
    scripts.push(script(buildWebApplicationJsonLd({ name, description, path })));
  }
  scripts.push(script(buildBreadcrumbJsonLd(crumbs)));
  return scripts;
}
