import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/terms/page";
import { metadata } from "@/ported-pages/terms/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/terms")({
  component: Page,
  head: () => buildRouteHead(metadata, "/terms"),
});
