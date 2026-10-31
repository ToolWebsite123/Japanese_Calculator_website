import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/squareroot-calculator/page";
import { metadata } from "@/ported-pages/squareroot-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/squareroot-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/squareroot-calculator"),
});
