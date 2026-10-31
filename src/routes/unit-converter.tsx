import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/unit-converter/page";
import { metadata } from "@/ported-pages/unit-converter/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/unit-converter")({
  component: Page,
  head: () => buildRouteHead(metadata, "/unit-converter"),
});
