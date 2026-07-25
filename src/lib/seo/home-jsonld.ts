import ja from "@/lib/i18n/ja";
import { HOME_META_DESCRIPTION, HOME_META_TITLE, SITE_NAME, SITE_URL } from "./site";

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: HOME_META_DESCRIPTION,
    inLanguage: "ja-JP",
  };
}

export function buildFaqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: HOME_META_TITLE,
    mainEntity: ja.home.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
