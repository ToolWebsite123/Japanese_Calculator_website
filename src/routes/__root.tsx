import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useNavigate,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "../components/layout/AppShell";
import { Providers } from "../context/Providers";

const safeNavigationGuardScript = String.raw`
(function () {
  if (window.__dentakuSafeNavigationGuard) return;
  window.__dentakuSafeNavigationGuard = true;

  var blockedHostPattern = /(^|\.)(api\.whatsapp\.com|whatsapp\.com|whatsapp\.net|wa\.me)$/i;

  function getUrl(value) {
    try {
      return new URL(String(value || ""), window.location.href);
    } catch (_) {
      return null;
    }
  }

  function isBlockedDestination(value) {
    var url = getUrl(value);
    return !!url && blockedHostPattern.test(url.hostname);
  }

  function shouldHandleInternalLink(event, anchor) {
    if (!anchor || isBlockedDestination(anchor.href)) return true;
    if (event.type === "auxclick") return true;
    if (event.button !== 0 || event.defaultPrevented || anchor.hasAttribute("download")) return false;
    var url = getUrl(anchor.href);
    return !!url && url.origin === window.location.origin;
  }

  function blockEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
  }

  var nativeOpen = window.open;
  window.open = function (url) {
    if (isBlockedDestination(url)) return null;
    return nativeOpen.apply(window, arguments);
  };

  try {
    var nativeAssign = window.location.assign.bind(window.location);
    var nativeReplace = window.location.replace.bind(window.location);
    window.location.assign = function (url) {
      if (isBlockedDestination(url)) return;
      return nativeAssign(url);
    };
    window.location.replace = function (url) {
      if (isBlockedDestination(url)) return;
      return nativeReplace(url);
    };
  } catch (_) {}

  try {
    var nativeAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (isBlockedDestination(this.href)) return;
      return nativeAnchorClick.apply(this, arguments);
    };
  } catch (_) {}

  function handleDocumentNavigation(event) {
    var target = event.target;
    var anchor = target && target.closest ? target.closest("a[href]") : null;
    if (!anchor) return;
    // Only intercept blocked destinations (e.g. WhatsApp). Let all normal
    // internal and external links flow through the router / browser.
    if (!isBlockedDestination(anchor.href)) return;
    blockEvent(event);
  }

  window.addEventListener("click", handleDocumentNavigation, true);
  document.addEventListener("click", handleDocumentNavigation, true);
  window.addEventListener("auxclick", handleDocumentNavigation, true);
  document.addEventListener("auxclick", handleDocumentNavigation, true);
})();
`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-surface-dark">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-text-primary">ページが見つかりません</h2>
        <p className="mt-2 text-sm text-text-secondary">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            トップページへ戻る
          </Link>
          <Link
            to="/calculators"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-raised px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-sunken"
          >
            計算機一覧を見る
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-surface-dark">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          ページを読み込めませんでした
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          問題が発生しました。再読み込みするか、トップページへお戻りください。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            もう一度試す
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-raised px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-sunken"
          >
            トップページへ戻る
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "電卓.online — Japanese Calculator" },
      { name: "description", content: "無料で使える日本語の電卓・科学計算・BMI・単位変換ツール。" },
      { name: "author", content: "電卓.online" },
      { property: "og:title", content: "電卓.online — Japanese Calculator" },
      {
        property: "og:description",
        content: "無料で使える日本語の電卓・科学計算・BMI・単位変換ツール。",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.xn--2kr778m.online/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.xn--2kr778m.online/og-image.svg" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: safeNavigationGuardScript }} />
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SafeNavigationListener() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleSafeNavigate(event: Event) {
      const detail = (event as CustomEvent<{ href?: string; handled?: boolean }>).detail;
      if (!detail?.href) return;
      detail.handled = true;
      void navigate({ to: detail.href as never });
    }

    window.addEventListener("dentaku:safe-navigate", handleSafeNavigate);
    return () => window.removeEventListener("dentaku:safe-navigate", handleSafeNavigate);
  }, [navigate]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <SafeNavigationListener />
        <AppShell>
          <Outlet />
        </AppShell>
      </Providers>
    </QueryClientProvider>
  );
}
