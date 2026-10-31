import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/long-division-calculator/page";
import { metadata } from "@/ported-pages/long-division-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/long-division-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/long-division-calculator"),
});
