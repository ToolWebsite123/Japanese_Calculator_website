import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/about/page";
import { metadata } from "@/ported-pages/about/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/about")({
  component: Page,
  head: () => buildRouteHead(metadata, "/about"),
});
