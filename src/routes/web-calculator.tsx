import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/web-calculator/page";
import { metadata } from "@/ported-pages/web-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/web-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/web-calculator"),
});
