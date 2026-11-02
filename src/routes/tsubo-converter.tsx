import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/tsubo-converter/page";
import { metadata } from "@/ported-pages/tsubo-converter/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/tsubo-converter")({
  component: Page,
  head: () => buildRouteHead(metadata, "/tsubo-converter"),
});
