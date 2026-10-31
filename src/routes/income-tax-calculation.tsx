import { createFileRoute } from "@tanstack/react-router";
import Page from "@/ported-pages/income-tax-calculation/page";
import { absoluteUrl } from "@/lib/seo/site";
import { buildPageSchemaScripts } from "@/lib/seo/page-schema";
import { metadata as incomeTaxMetadata } from "@/ported-pages/income-tax-calculation/metadata";

const title =
  typeof incomeTaxMetadata.title === "string"
    ? incomeTaxMetadata.title
    : (incomeTaxMetadata.title?.absolute ?? "所得税 計算");
const description = incomeTaxMetadata.description ?? "";
const canonical = absoluteUrl(incomeTaxMetadata.alternates?.canonical ?? "/income-tax-calculation");
const keywords = incomeTaxMetadata.keywords ?? [];
const og = (incomeTaxMetadata.openGraph ?? {}) as Record<string, unknown>;
const tw = (incomeTaxMetadata.twitter ?? {}) as Record<string, unknown>;
const ogImages = Array.isArray(og.images) ? (og.images as Record<string, unknown>[]) : [];
const ogImage = ogImages.length ? metaStr(ogImages[0].url) : undefined;
const twImage = metaStr(tw.image);

function metaStr(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
}

export const Route = createFileRoute("/income-tax-calculation")({
  component: Page,
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
      path: "/income-tax-calculation",
      title,
      description,
      isLegal: false,
    }),
  }),
});
