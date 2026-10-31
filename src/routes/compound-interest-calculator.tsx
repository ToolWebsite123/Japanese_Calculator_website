import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/compound-interest-calculator/page";
import { metadata } from "@/ported-pages/compound-interest-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/compound-interest-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/compound-interest-calculator"),
});
