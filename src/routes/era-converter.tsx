import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/era-converter/page";
import { metadata } from "@/ported-pages/era-converter/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/era-converter")({
  component: Page,
  head: () => buildRouteHead(metadata, "/era-converter"),
});
