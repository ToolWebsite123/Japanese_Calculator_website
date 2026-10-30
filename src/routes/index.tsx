import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/calculators/HomePage";
import { buildFaqPageJsonLd, buildWebSiteJsonLd } from "@/lib/seo/home-jsonld";
import { buildOrganizationJsonLd, OG_IMAGE_URL } from "@/lib/seo/page-schema";
import { absoluteUrl, HOME_META_DESCRIPTION, HOME_META_TITLE } from "@/lib/seo/site";

export const Route = createFileRoute("/")({
  head: () => {
    const url = absoluteUrl("/");

    return {
      meta: [
        { title: HOME_META_TITLE },
        { name: "description", content: HOME_META_DESCRIPTION },
        { property: "og:title", content: HOME_META_TITLE },
        { property: "og:description", content: HOME_META_DESCRIPTION },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_IMAGE_URL },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: HOME_META_TITLE },
        { name: "twitter:description", content: HOME_META_DESCRIPTION },
        { name: "twitter:image", content: OG_IMAGE_URL },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(buildWebSiteJsonLd()),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(buildOrganizationJsonLd()),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(buildFaqPageJsonLd()),
        },
      ],
    };
  },
  component: HomePage,
});
