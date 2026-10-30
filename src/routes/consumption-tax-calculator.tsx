import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo/site";
import { buildPageSchemaScripts } from "@/lib/seo/page-schema";
import ConsumptionTaxCalculatorPage, {
  metadata as consumptionTaxMetadata,
} from "@/ported-pages/consumption-tax-calculator/page";

const title =
  typeof consumptionTaxMetadata.title === "string"
    ? consumptionTaxMetadata.title
    : (consumptionTaxMetadata.title?.absolute ?? "消費税 計算");
const description = consumptionTaxMetadata.description ?? "";
const canonical = absoluteUrl(consumptionTaxMetadata.alternates?.canonical ?? "/consumption-tax-calculator");
const keywords = consumptionTaxMetadata.keywords ?? [];
const og = (consumptionTaxMetadata.openGraph ?? {}) as Record<string, unknown>;
const tw = (consumptionTaxMetadata.twitter ?? {}) as Record<string, unknown>;
const ogImages = Array.isArray(og.images) ? (og.images as Record<string, unknown>[]) : [];
const ogImage = ogImages.length ? metaStr(ogImages[0].url) : undefined;
const twImage = metaStr(tw.image);

function metaStr(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
}

export const Route = createFileRoute("/consumption-tax-calculator")({
  component: ConsumptionTaxCalculatorPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      ...(keywords.length ? [{ name: "keywords", content: keywords.join(", ") }] : []),
      ...(metaStr(og.title) ? [{ property: "og:title", content: metaStr(og.title)! }] : []),
      ...(metaStr(og.description)
        ? [{ property: "og:description", content: metaStr(og.description)! }]
        : []),
      ...(metaStr(og.url) ? [{ property: "og:url", content: metaStr(og.url)! }] : []),
      ...(metaStr(og.type) ? [{ property: "og:type", content: metaStr(og.type)! }] : []),
      ...(metaStr(og.locale) ? [{ property: "og:locale", content: metaStr(og.locale)! }] : []),
      ...(metaStr(og.siteName)
        ? [{ property: "og:site_name", content: metaStr(og.siteName)! }]
        : []),
      ...(ogImage ? [{ property: "og:image", content: ogImage }] : []),
      ...(metaStr(tw.card) ? [{ name: "twitter:card", content: metaStr(tw.card)! }] : []),
      ...(metaStr(tw.title) ? [{ name: "twitter:title", content: metaStr(tw.title)! }] : []),
      ...(metaStr(tw.description)
        ? [{ name: "twitter:description", content: metaStr(tw.description)! }]
        : []),
      ...(twImage ? [{ name: "twitter:image", content: twImage }] : []),
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: buildPageSchemaScripts({
      path: "/consumption-tax-calculator",
      title,
      description,
      isLegal: false,
    }),
  }),
});
