import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/graph-calculator/page";
import { metadata } from "@/ported-pages/graph-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/graph-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/graph-calculator"),
});
