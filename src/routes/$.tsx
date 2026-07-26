import { createFileRoute, useRouterState } from "@tanstack/react-router";
import type { ReactElement } from "react";

import AboutPage, { metadata as aboutMetadata } from "@/ported-pages/about/page";
import AlgebraPage, { metadata as algebraMetadata } from "@/ported-pages/algebra-calculator/page";
import BmiPage, { metadata as bmiMetadata } from "@/ported-pages/bmi-calculator/page";
import CompoundInterestPage, {
  metadata as compoundInterestMetadata,
} from "@/ported-pages/compound-interest-calculator/page";
import ContactPage, { metadata as contactMetadata } from "@/ported-pages/contact/page";
import DisclaimerPage, { metadata as disclaimerMetadata } from "@/ported-pages/disclaimer/page";
import EraPage, { metadata as eraMetadata } from "@/ported-pages/era-converter/page";
import FactorizationPage, {
  metadata as factorizationMetadata,
} from "@/ported-pages/factorization-calculator/page";
import FinancialPage, {
  metadata as financialMetadata,
} from "@/ported-pages/financial-calculator/page";
import FractionPage, {
  metadata as fractionMetadata,
} from "@/ported-pages/fraction-calculator/page";
import InterestPage, {
  metadata as interestMetadata,
} from "@/ported-pages/interest-calculator/page";
import LongDivisionPage, {
  metadata as longDivisionMetadata,
} from "@/ported-pages/long-division-calculator/page";
import PercentagePage, {
  metadata as percentageMetadata,
} from "@/ported-pages/percentage-calculator/page";
import PrivacyPolicyPage, {
  metadata as privacyPolicyMetadata,
} from "@/ported-pages/privacy-policy/page";
import RootRedirectPage from "@/ported-pages/root-calculator/page";
import RootPage, { metadata as rootMetadata } from "@/ported-pages/squareroot-calculator/page";
import ScientificPage, {
  metadata as scientificMetadata,
} from "@/ported-pages/scientific-calculator/page";
import SimultaneousEquationsPage, {
  metadata as simultaneousEquationsMetadata,
} from "@/ported-pages/simultaneous-equations-calculator/page";
import SocialInsurancePage, {
  metadata as socialInsuranceMetadata,
} from "@/ported-pages/social-insurance-calculator/page";
import TermsPage, { metadata as termsMetadata } from "@/ported-pages/terms/page";
import TimePage, { metadata as timeMetadata } from "@/ported-pages/time-calculator/page";
import UnitConverterPage, {
  metadata as unitConverterMetadata,
} from "@/ported-pages/unit-converter/page";
import WebCalculatorPage, {
  metadata as webCalculatorMetadata,
} from "@/ported-pages/web-calculator/page";
import type { Metadata } from "@/lib/seo/metadata";

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

// Aliases (short paths) point to the same head as their canonical route.
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

function resolveHead(path: string): Head | undefined {
  const p = path.replace(/\/$/, "") || "/";
  if (routeHeads[p]) return routeHeads[p];
  const target = aliasMap[p];
  if (target) return routeHeads[target];
  return undefined;
}

function metadataTitleToString(title: Metadata["title"]): string {
  if (typeof title === "string") return title;
  return title?.absolute ?? "電卓.Online｜オールインワン計算プラットフォーム";
}

function metadataToHead(metadata: Metadata, fallbackPath: string): Head {
  return {
    title: metadataTitleToString(metadata.title),
    description: metadata.description ?? "無料で使える日本語の電卓・計算ツール。",
    canonical: metadata.alternates?.canonical ?? fallbackPath,
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

  return Object.entries(propertyByKey)
    .map(([key, property]) => {
      const content = metaContent(openGraph[key]);
      return content ? { property, content } : undefined;
    })
    .filter((item): item is { property: string; content: string } => Boolean(item));
}

function twitterMeta(twitter: Record<string, unknown> | undefined) {
  if (!twitter) return [];

  return ["card", "title", "description"]
    .map((key) => {
      const content = metaContent(twitter[key]);
      return content ? { name: `twitter:${key}`, content } : undefined;
    })
    .filter((item): item is { name: string; content: string } => Boolean(item));
}

export const Route = createFileRoute("/$")({
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
    return {
      meta: [
        { title: info.title },
        { name: "description", content: info.description },
        ...(info.keywords?.length ? [{ name: "keywords", content: info.keywords.join(", ") }] : []),
        ...openGraphMeta(info.openGraph),
        ...twitterMeta(info.twitter),
      ],
      links: [{ rel: "canonical", href: info.canonical }],
    };
  },
});

const pages: Record<string, () => ReactElement> = {
  "/about": AboutPage,
  "/algebra-calculator": AlgebraPage,
  "/algebra": AlgebraPage,
  "/bmi-calculator": BmiPage,
  "/bmi": BmiPage,
  "/compound-interest-calculator": CompoundInterestPage,
  "/compound-interest": CompoundInterestPage,
  "/contact": ContactPage,
  "/disclaimer": DisclaimerPage,
  "/era-converter": EraPage,
  "/era": EraPage,
  "/factorization-calculator": FactorizationPage,
  "/factorization": FactorizationPage,
  "/financial-calculator": FinancialPage,
  "/financial": FinancialPage,
  "/fraction-calculator": FractionPage,
  "/fraction": FractionPage,
  "/interest-calculator": InterestPage,
  "/interest": InterestPage,
  "/long-division-calculator": LongDivisionPage,
  "/long-division": LongDivisionPage,
  "/percentage-calculator": PercentagePage,
  "/percentage": PercentagePage,
  "/privacy-policy": PrivacyPolicyPage,
  "/root-calculator": RootRedirectPage,
  "/squareroot-calculator": RootPage,
  "/root": RootPage,
  "/scientific-calculator": ScientificPage,
  "/scientific": ScientificPage,
  "/simultaneous-equations-calculator": SimultaneousEquationsPage,
  "/simultaneous-equations": SimultaneousEquationsPage,
  "/social-insurance-calculator": SocialInsurancePage,
  "/terms": TermsPage,
  "/time-calculator": TimePage,
  "/time": TimePage,
  "/unit-converter": UnitConverterPage,
  "/web-calculator": WebCalculatorPage,
};

function CatchAllPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname }).replace(
    /\/$/,
    "",
  );
  const Component = pages[pathname];

  if (Component) {
    return (
      <div suppressHydrationWarning>
        <Component />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-4xl font-bold text-brand">404</h1>
      <p className="mt-3 text-text-secondary">ページが見つかりません。</p>
      <a
        className="mt-6 inline-flex rounded-[var(--radius-md)] bg-brand px-4 py-2 text-white"
        href="/"
      >
        ホームへ戻る
      </a>
    </main>
  );
}
