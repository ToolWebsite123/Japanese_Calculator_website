import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/scientific-calculator/page";
import { metadata } from "@/ported-pages/scientific-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/scientific-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/scientific-calculator"),
});
