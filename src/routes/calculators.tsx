import { createFileRoute } from "@tanstack/react-router";
import { AllCalculatorsPage } from "@/components/calculators/AllCalculatorsPage";
import { NAV_ITEMS } from "@/lib/constants";
import ja from "@/lib/i18n/ja";
import { absoluteUrl } from "@/lib/seo/site";

const title = "すべての計算機｜電卓.Online";
const description =
  "電卓.Onlineの全計算ツール一覧。関数電卓、金融電卓、BMI、分数、単位変換、ふるさと納税など、無料で使える計算機をカテゴリ別に探せます。";

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
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(buildCalculatorItemListJsonLd()),
        },
      ],
    };
  },
  component: AllCalculatorsPage,
});
