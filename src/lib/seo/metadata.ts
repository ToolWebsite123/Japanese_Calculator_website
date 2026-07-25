import { absoluteUrl, SITE_NAME } from "./site";

export type Metadata = {
  title?: string | { absolute: string };
  description?: string;
  keywords?: string[];
  alternates?: { canonical?: string };
  openGraph?: Record<string, unknown>;
  twitter?: Record<string, unknown>;
};

type BuildPageMetadataParams = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  openGraphType?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  openGraphType = "website",
}: BuildPageMetadataParams): Metadata {
  const url = absoluteUrl(path);

  return {
    title: { absolute: title },
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      locale: "ja_JP",
      type: openGraphType,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildHomeMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  return buildPageMetadata({ title, description, path, keywords });
}
