import type { Metadata } from "@/lib/seo/metadata";
import { buildPageSchemaScripts } from "@/lib/seo/page-schema";
import { absoluteUrl, LEGAL_PATHS } from "@/lib/seo/site";

// Head builder shared by the per-page route files. Faithful port of the
// logic that used to live inline in the splat route ($.tsx): same meta
// array, same canonical link, same schema scripts — only the delivery
// changed (each page is now its own route instead of a lazy splat page).

type Head = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
  openGraph?: Record<string, unknown>;
  twitter?: Record<string, unknown>;
};

function metadataTitleToString(title: Metadata["title"]): string {
  if (typeof title === "string") return title;
  return title?.absolute ?? "電卓.Online｜オールインワン計算プラットフォーム";
}

function metadataToHead(metadata: Metadata, fallbackPath: string): Head {
  return {
    title: metadataTitleToString(metadata.title),
    description: metadata.description ?? "無料で使える日本語の電卓・計算ツール。",
    canonical: absoluteUrl(metadata.alternates?.canonical ?? fallbackPath),
    keywords: metadata.keywords,
    openGraph: metadata.openGraph,
    twitter: metadata.twitter,
  };
}

function metaContent(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function openGraphMeta(openGraph: Record<string, unknown> | undefined) {
  if (!openGraph) return [];

  const propertyByKey: Record<string, string> = {
    title: "og:title",
    description: "og:description",
    url: "og:url",
    type: "og:type",
    locale: "og:locale",
    siteName: "og:site_name",
  };

  const base = Object.entries(propertyByKey)
    .map(([key, property]) => {
      const content = metaContent(openGraph[key]);
      return content ? { property, content } : undefined;
    })
    .filter((item): item is { property: string; content: string } => Boolean(item));

  const images = Array.isArray(openGraph.images)
    ? (openGraph.images as Record<string, unknown>[])
    : [];
  const imageMeta = images.flatMap((image) => {
    const url = metaContent(image.url);
    if (!url) return [];
    const entries = [{ property: "og:image", content: url }];
    const width = metaContent(image.width);
    const height = metaContent(image.height);
    const alt = metaContent(image.alt);
    if (width) entries.push({ property: "og:image:width", content: width });
    if (height) entries.push({ property: "og:image:height", content: height });
    if (alt) entries.push({ property: "og:image:alt", content: alt });
    return entries;
  });

  return [...base, ...imageMeta];
}

function twitterMeta(twitter: Record<string, unknown> | undefined) {
  if (!twitter) return [];

  return ["card", "title", "description", "image"]
    .map((key) => {
      const content = metaContent(twitter[key]);
      return content ? { name: `twitter:${key}`, content } : undefined;
    })
    .filter((item): item is { name: string; content: string } => Boolean(item));
}

export function buildRouteHead(metadata: Metadata, path: string) {
  const info = metadataToHead(metadata, path);
  return {
    meta: [
      { title: info.title },
      { name: "description", content: info.description },
      ...(info.keywords?.length
        ? [{ name: "keywords", content: info.keywords.join(", ") }]
        : []),
      ...openGraphMeta(info.openGraph),
      ...twitterMeta(info.twitter),
    ],
    links: [{ rel: "canonical", href: info.canonical }],
    scripts: buildPageSchemaScripts({
      path,
      title: info.title,
      description: info.description,
      isLegal: (LEGAL_PATHS as readonly string[]).includes(path),
    }),
  };
}
