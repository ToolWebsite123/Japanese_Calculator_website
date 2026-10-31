import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/interest-calculator/page";
import { metadata } from "@/ported-pages/interest-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/interest-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/interest-calculator"),
});
