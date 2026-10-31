import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";

import { PageLoading } from "@/components/layout/PageLoading";

import { metadata as aboutMetadata } from "@/ported-pages/about/metadata";
import { metadata as algebraMetadata } from "@/ported-pages/algebra-calculator/metadata";
import { metadata as bmiMetadata } from "@/ported-pages/bmi-calculator/metadata";
import { metadata as compoundInterestMetadata } from "@/ported-pages/compound-interest-calculator/metadata";
import { metadata as contactMetadata } from "@/ported-pages/contact/metadata";
import { metadata as disclaimerMetadata } from "@/ported-pages/disclaimer/metadata";
import { metadata as eraMetadata } from "@/ported-pages/era-converter/metadata";
import { metadata as factorizationMetadata } from "@/ported-pages/factorization-calculator/metadata";
import { metadata as financialMetadata } from "@/ported-pages/financial-calculator/metadata";
import { metadata as fractionMetadata } from "@/ported-pages/fraction-calculator/metadata";
import { metadata as interestMetadata } from "@/ported-pages/interest-calculator/metadata";
import { metadata as longDivisionMetadata } from "@/ported-pages/long-division-calculator/metadata";
import { metadata as percentageMetadata } from "@/ported-pages/percentage-calculator/metadata";
import { metadata as privacyPolicyMetadata } from "@/ported-pages/privacy-policy/metadata";
import { metadata as rootMetadata } from "@/ported-pages/squareroot-calculator/metadata";
import { metadata as scientificMetadata } from "@/ported-pages/scientific-calculator/metadata";
import { metadata as simultaneousEquationsMetadata } from "@/ported-pages/simultaneous-equations-calculator/metadata";
import { metadata as socialInsuranceMetadata } from "@/ported-pages/social-insurance-calculator/metadata";
import { metadata as termsMetadata } from "@/ported-pages/terms/metadata";
import { metadata as timeMetadata } from "@/ported-pages/time-calculator/metadata";
import { metadata as unitConverterMetadata } from "@/ported-pages/unit-converter/metadata";
import { metadata as webCalculatorMetadata } from "@/ported-pages/web-calculator/metadata";
import type { Metadata } from "@/lib/seo/metadata";
import { buildPageSchemaScripts } from "@/lib/seo/page-schema";
import { absoluteUrl, LEGAL_PATHS } from "@/lib/seo/site";

type Head = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
  openGraph?: Record<string, unknown>;
  twitter?: Record<string, unknown>;
};

const metadataByPath: Record<string, Metadata> = {
  "/about": aboutMetadata,
  "/algebra-calculator": algebraMetadata,
  "/bmi-calculator": bmiMetadata,
  "/compound-interest-calculator": compoundInterestMetadata,
  "/contact": contactMetadata,
  "/disclaimer": disclaimerMetadata,
  "/era-converter": eraMetadata,
  "/factorization-calculator": factorizationMetadata,
  "/financial-calculator": financialMetadata,
  "/fraction-calculator": fractionMetadata,
  "/interest-calculator": interestMetadata,
  "/long-division-calculator": longDivisionMetadata,
  "/percentage-calculator": percentageMetadata,
  "/privacy-policy": privacyPolicyMetadata,
  "/squareroot-calculator": rootMetadata,
  "/scientific-calculator": scientificMetadata,
  "/simultaneous-equations-calculator": simultaneousEquationsMetadata,
  "/social-insurance-calculator": socialInsuranceMetadata,
  "/terms": termsMetadata,
  "/time-calculator": timeMetadata,
  "/unit-converter": unitConverterMetadata,
  "/web-calculator": webCalculatorMetadata,
};

const routeHeads: Record<string, Head> = Object.fromEntries(
  Object.entries(metadataByPath).map(([path, metadata]) => [path, metadataToHead(metadata, path)]),
);

// Aliases (short paths) permanently redirect (301) to their canonical route.
// This map is the single source of truth for alias redirects: the route's
// beforeLoad throws a 301 for any path listed here, so aliases never serve
// duplicate content.
const aliasMap: Record<string, string> = {
  "/algebra": "/algebra-calculator",
  "/bmi": "/bmi-calculator",
  "/compound-interest": "/compound-interest-calculator",
  "/era": "/era-converter",
  "/factorization": "/factorization-calculator",
  "/financial": "/financial-calculator",
  "/fraction": "/fraction-calculator",
  "/interest": "/interest-calculator",
  "/long-division": "/long-division-calculator",
  "/percentage": "/percentage-calculator",
  "/root-calculator": "/squareroot-calculator",
  "/root": "/squareroot-calculator",
  "/scientific": "/scientific-calculator",
  "/simultaneous-equations": "/simultaneous-equations-calculator",
  "/time": "/time-calculator",
};

function normalizePath(path: string): string {
  return path.replace(/\/$/, "") || "/";
}

function resolveHead(path: string): Head | undefined {
  return routeHeads[normalizePath(path)];
}

function metadataTitleToString(title: Metadata["title"]): string {
  if (typeof title === "string") return title;
  return title?.absolute ?? "電卓.Online｜オールインワン計算プラットフォーム";
}

function metadataToHead(metadata: Metadata, fallbackPath: string): Head {
  return {
    title: metadataTitleToString(metadata.title),
    description: metadata.description ?? "無料で使える日本語の電卓・計算ツール。",
    canonical: absoluteUrl(metadata.alternates?.canonical ?? fallbackPath),
    keywords: metadata.keywords,
    openGraph: metadata.openGraph,
    twitter: metadata.twitter,
  };
}

function metaContent(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function openGraphMeta(openGraph: Record<string, unknown> | undefined) {
  if (!openGraph) return [];

  const propertyByKey: Record<string, string> = {
    title: "og:title",
    description: "og:description",
    url: "og:url",
    type: "og:type",
    locale: "og:locale",
    siteName: "og:site_name",
  };

  const base = Object.entries(propertyByKey)
    .map(([key, property]) => {
      const content = metaContent(openGraph[key]);
      return content ? { property, content } : undefined;
    })
    .filter((item): item is { property: string; content: string } => Boolean(item));

  const images = Array.isArray(openGraph.images)
    ? (openGraph.images as Record<string, unknown>[])
    : [];
  const imageMeta = images.flatMap((image) => {
    const url = metaContent(image.url);
    if (!url) return [];
    const entries = [{ property: "og:image", content: url }];
    const width = metaContent(image.width);
    const height = metaContent(image.height);
    const alt = metaContent(image.alt);
    if (width) entries.push({ property: "og:image:width", content: width });
    if (height) entries.push({ property: "og:image:height", content: height });
    if (alt) entries.push({ property: "og:image:alt", content: alt });
    return entries;
  });

  return [...base, ...imageMeta];
}

function twitterMeta(twitter: Record<string, unknown> | undefined) {
  if (!twitter) return [];

  return ["card", "title", "description", "image"]
    .map((key) => {
      const content = metaContent(twitter[key]);
      return content ? { name: `twitter:${key}`, content } : undefined;
    })
    .filter((item): item is { name: string; content: string } => Boolean(item));
}

export const Route = createFileRoute("/$")({
  // Alias short paths get a real 301 to the canonical URL, and anything that
  // is not a known page throws notFound() so SSR returns a true HTTP 404
  // (rendered by the root notFoundComponent) instead of a soft-404 200.
  beforeLoad: ({ params }) => {
    const raw = "/" + (params._splat ?? "").replace(/^\/+/, "");
    const path = normalizePath(raw);
    const target = aliasMap[path];
    if (target) {
      throw redirect({ href: target, statusCode: 301 });
    }
    if (!pages[path]) {
      throw notFound();
    }
  },
  component: CatchAllPage,
  head: ({ params }) => {
    const raw = "/" + (params._splat ?? "").replace(/^\/+/, "");
    const info = resolveHead(raw);
    if (!info)
      return {
        meta: [
          { title: "ページが見つかりません（404）｜電卓.Online" },
          {
            name: "description",
            content:
              "お探しのページは見つかりませんでした。電卓.Onlineのトップページから、目的の計算ツールをお探しください。",
          },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    const path = normalizePath(raw);
    return {
      meta: [
        { title: info.title },
        { name: "description", content: info.description },
        ...(info.keywords?.length ? [{ name: "keywords", content: info.keywords.join(", ") }] : []),
        ...openGraphMeta(info.openGraph),
        ...twitterMeta(info.twitter),
      ],
      links: [{ rel: "canonical", href: info.canonical }],
      scripts: buildPageSchemaScripts({
        path,
        title: info.title,
        description: info.description,
        isLegal: (LEGAL_PATHS as readonly string[]).includes(path),
      }),
    };
  },
});

// Canonical pages only. Alias short paths are NOT listed here on purpose:
// beforeLoad redirects them (301) via aliasMap before any rendering happens.
const pageLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  "/about": () => import("@/ported-pages/about/page"),
  "/algebra-calculator": () => import("@/ported-pages/algebra-calculator/page"),
  "/bmi-calculator": () => import("@/ported-pages/bmi-calculator/page"),
  "/compound-interest-calculator": () => import("@/ported-pages/compound-interest-calculator/page"),
  "/contact": () => import("@/ported-pages/contact/page"),
  "/disclaimer": () => import("@/ported-pages/disclaimer/page"),
  "/era-converter": () => import("@/ported-pages/era-converter/page"),
  "/factorization-calculator": () => import("@/ported-pages/factorization-calculator/page"),
  "/financial-calculator": () => import("@/ported-pages/financial-calculator/page"),
  "/fraction-calculator": () => import("@/ported-pages/fraction-calculator/page"),
  "/interest-calculator": () => import("@/ported-pages/interest-calculator/page"),
  "/long-division-calculator": () => import("@/ported-pages/long-division-calculator/page"),
  "/percentage-calculator": () => import("@/ported-pages/percentage-calculator/page"),
  "/privacy-policy": () => import("@/ported-pages/privacy-policy/page"),
  "/squareroot-calculator": () => import("@/ported-pages/squareroot-calculator/page"),
  "/scientific-calculator": () => import("@/ported-pages/scientific-calculator/page"),
  "/simultaneous-equations-calculator": () => import("@/ported-pages/simultaneous-equations-calculator/page"),
  "/social-insurance-calculator": () => import("@/ported-pages/social-insurance-calculator/page"),
  "/terms": () => import("@/ported-pages/terms/page"),
  "/time-calculator": () => import("@/ported-pages/time-calculator/page"),
  "/unit-converter": () => import("@/ported-pages/unit-converter/page"),
  "/web-calculator": () => import("@/ported-pages/web-calculator/page"),
};

// Each page component loads as its own chunk (React.lazy): a visitor only
// downloads the code for the page they open, not all 22 pages at once.
// SSR still renders the matched page on the server.
const pages: Record<string, LazyExoticComponent<ComponentType>> = Object.fromEntries(
  Object.entries(pageLoaders).map(([path, load]) => [path, lazy(load)]),
);

function CatchAllPage() {
  // Derive the path from THIS route's own params, not the global router
  // location. During a client-side navigation transition the global location
  // can point at the destination (or lag on the previous page) while this
  // route is already matched, and looking the page up by the global pathname
  // could miss and flash a 404. The matched route's _splat always agrees
  // with the page this route is supposed to render.
  const { _splat } = Route.useParams();
  const raw = "/" + (_splat ?? "").replace(/^\/+/, "");
  const Component = pages[normalizePath(raw)];

  if (Component) {
    return (
      <div suppressHydrationWarning>
        <Suspense fallback={<PageLoading />}>
          <Component />
        </Suspense>
      </div>
    );
  }

  // Unknown paths never reach this component: beforeLoad throws notFound()
  // for them, so SSR (and the client router) render the root
  // NotFoundComponent with a real 404 instead. This fallback only covers
  // transient client-navigation states, so it shows the neutral loading
  // indicator — never a 404 message.
  return <PageLoading />;
}
