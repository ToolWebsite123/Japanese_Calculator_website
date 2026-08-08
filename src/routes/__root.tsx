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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
      { name: "google-site-verification", content: "google39f0ca4d252248af" },
      { name: "author", content: "電卓.online" },
      { property: "og:title", content: "電卓.online — Japanese Calculator" },
      {
        property: "og:description",
        content: "無料で使える日本語の電卓・科学計算・BMI・単位変換ツール。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap",
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
