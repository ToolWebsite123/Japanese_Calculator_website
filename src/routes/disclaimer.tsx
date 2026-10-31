import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/disclaimer/page";
import { metadata } from "@/ported-pages/disclaimer/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/disclaimer")({
  component: Page,
  head: () => buildRouteHead(metadata, "/disclaimer"),
});
