import { createFileRoute } from "@tanstack/react-router";
import MahjongScoreCalculationPage, {
  metadata as mahjongMetadata,
} from "@/ported-pages/mahjong-score-calculation/page";

const title =
  typeof mahjongMetadata.title === "string"
    ? mahjongMetadata.title
    : mahjongMetadata.title?.absolute ?? "麻雀 点数 計算";
const description = mahjongMetadata.description ?? "";
const canonical =
  mahjongMetadata.alternates?.canonical ?? "/mahjong-score-calculation";
const keywords = mahjongMetadata.keywords ?? [];
const og = (mahjongMetadata.openGraph ?? {}) as Record<string, unknown>;
const tw = (mahjongMetadata.twitter ?? {}) as Record<string, unknown>;

function metaStr(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
}

export const Route = createFileRoute("/mahjong-score-calculation")({
  component: MahjongScoreCalculationPage,
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
