import { createFileRoute } from "@tanstack/react-router";
import DiscountCalculationPage, {
  metadata as discountMetadata,
} from "@/ported-pages/discount-calculation/page";

const title =
  typeof discountMetadata.title === "string"
    ? discountMetadata.title
    : (discountMetadata.title?.absolute ?? "割引 計算");
const description = discountMetadata.description ?? "";
const canonical = discountMetadata.alternates?.canonical ?? "/discount-calculation";
const keywords = discountMetadata.keywords ?? [];
const og = (discountMetadata.openGraph ?? {}) as Record<string, unknown>;
const tw = (discountMetadata.twitter ?? {}) as Record<string, unknown>;

function metaStr(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
}

export const Route = createFileRoute("/discount-calculation")({
  component: DiscountCalculationPage,
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
      ...(metaStr(tw.card) ? [{ name: "twitter:card", content: metaStr(tw.card)! }] : []),
      ...(metaStr(tw.title) ? [{ name: "twitter:title", content: metaStr(tw.title)! }] : []),
      ...(metaStr(tw.description)
        ? [{ name: "twitter:description", content: metaStr(tw.description)! }]
        : []),
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
});
