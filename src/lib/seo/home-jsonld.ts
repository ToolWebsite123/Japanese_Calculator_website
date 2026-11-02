import { HOME_META_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";
import { buildWebApplicationJsonLd } from "./page-schema";

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

export function buildHomeCalculatorJsonLd() {
  return buildWebApplicationJsonLd({
    name: "オンライン電卓（Web電卓）",
    description:
      "ブラウザですぐ使える無料のオンライン電卓。税込・税抜（10%/8%）、GT、メモリ機能、計算履歴、キーボード入力に対応し、入力データは端末内でのみ処理されます。",
    path: "/",
  });
}

