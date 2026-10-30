import { createFileRoute } from "@tanstack/react-router";
import { AllCalculatorsPage } from "@/components/calculators/AllCalculatorsPage";
import { NAV_ITEMS } from "@/lib/constants";
import ja from "@/lib/i18n/ja";
import { buildBreadcrumbJsonLd, OG_IMAGE_URL } from "@/lib/seo/page-schema";
import { absoluteUrl } from "@/lib/seo/site";

const title = "計算ツール一覧｜関数電卓・税金・健康など全24種の計算機｜電卓.online";
const description =
  "電卓.onlineの計算ツール一覧ページ。関数電卓、BMI、分数、複利・積立、所得税、ふるさと納税、単位変換など、全24種類の無料計算機をカテゴリ別に探せます。会員登録不要で、スマホ・PCどちらからでもすぐ使えます。";

function buildCalculatorItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    itemListElement: NAV_ITEMS.map((item, index) => {
      const key = item.labelKey.replace("nav.", "") as keyof typeof ja.nav;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: ja.nav[key] ?? item.labelKey,
        url: absoluteUrl(item.href),
      };
    }),
  };
}

export const Route = createFileRoute("/calculators")({
  head: () => {
    const url = absoluteUrl("/calculators");

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_IMAGE_URL },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: OG_IMAGE_URL },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(buildCalculatorItemListJsonLd()),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "ホーム", path: "/" },
              { name: "計算機一覧", path: "/calculators" },
            ]),
          ),
        },
      ],
    };
  },
  component: AllCalculatorsPage,
});
