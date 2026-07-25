import { absoluteUrl, SITE_NAME, SITE_URL } from "./site";

type BuildLegalPageJsonLdParams = {
  type: "WebPage" | "ContactPage" | "AboutPage";
  name: string;
  description: string;
  path: string;
};

export function buildLegalPageJsonLd({
  type,
  name,
  description,
  path,
}: BuildLegalPageJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "ja-JP",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
