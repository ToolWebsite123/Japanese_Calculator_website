import { createFileRoute } from "@tanstack/react-router";
import UnemploymentInsurancePage, {
  metadata as unemploymentMetadata,
} from "@/ported-pages/unemployment-insurance-calculation/page";

const title =
  typeof unemploymentMetadata.title === "string"
    ? unemploymentMetadata.title
    : unemploymentMetadata.title?.absolute ?? "失業保険 計算";
const description = unemploymentMetadata.description ?? "";
const canonical =
  unemploymentMetadata.alternates?.canonical ?? "/unemployment-insurance-calculation";
const keywords = unemploymentMetadata.keywords ?? [];
const og = (unemploymentMetadata.openGraph ?? {}) as Record<string, unknown>;
const tw = (unemploymentMetadata.twitter ?? {}) as Record<string, unknown>;

function metaStr(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
}

export const Route = createFileRoute("/unemployment-insurance-calculation")({
  component: UnemploymentInsurancePage,
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
