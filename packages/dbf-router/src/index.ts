/**
 * DBF Router
 *
 * Hedefler:
 * - HTML-first kullanım: <a dbf-link> ve <dbf-route-view> gibi elementlerle çalışsın
 * - Developer dostu API: küçük bir createRouter + navigate fonksiyonları
 * - Framework bağımsız: sadece History API ve DOM kullanır
 */

export type RouteHandler = (params: Record<string, string>) => void;

export interface RouteConfig {
  path: string;
  onEnter: RouteHandler;
}

export interface RouterOptions {
  basePath?: string;
  routes: RouteConfig[];
}

export interface Router {
  navigate(path: string): void;
  start(): void;
  stop(): void;
}

export interface LinkHandlerOptions {
  /**
   * Tıklamaları dinleyecek kök element.
   * Varsayılan: document
   */
  root?: Document | HTMLElement;
  /**
   * Route link'lerini seçmek için CSS selector.
   * Varsayılan: '[data-nav-route]'
   */
  selector?: string;
}

function matchRoute(
  pathname: string,
  routes: RouteConfig[],
  basePath: string
): { route: RouteConfig; params: Record<string, string> } | null {
  const normalized = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname || "/";

  for (const route of routes) {
    if (route.path === normalized) {
      return { route, params: {} };
    }
  }

  return null;
}

export function createRouter(options: RouterOptions): Router {
  const basePath = options.basePath ?? "";
  let listening = false;

  const handleLocation = () => {
    const match = matchRoute(window.location.pathname, options.routes, basePath);
    if (!match) return;
    match.route.onEnter(match.params);
  };

  const onPopState = () => handleLocation();

  return {
    navigate(path: string) {
      const target = basePath + path;
      if (window.location.pathname !== target) {
        window.history.pushState({}, "", target);
        handleLocation();
      }
    },
    start() {
      if (listening) return;
      listening = true;
      window.addEventListener("popstate", onPopState);
      handleLocation();
    },
    stop() {
      if (!listening) return;
      listening = false;
      window.removeEventListener("popstate", onPopState);
    },
  };
}

/**
 * Verilen router için HTML-first link navigasyonu ekler.
 *
 * Örn:
 *   enableLinkNavigation(router);
 *   // <a href="/docs" data-nav-route="/docs">Docs</a>
 */
export function enableLinkNavigation(
  router: Router,
  options: LinkHandlerOptions = {}
): () => void {
  const root = options.root ?? document;
  const selector = options.selector ?? "[data-nav-route]";

  const onClick = (ev: Event) => {
    if (!(ev instanceof MouseEvent)) return;
    // Orta tık, modifier tuşları vs'yi router'a vermeyelim
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) {
      return;
    }

    const target = ev.target as HTMLElement | null;
    const link = target?.closest<HTMLElement>(selector);
    if (!link) return;

    const path = link.getAttribute("data-nav-route") ?? link.getAttribute("href");
    if (!path || path.startsWith("http")) return;

    ev.preventDefault();
    router.navigate(path);
  };

  root.addEventListener("click", onClick);

  // Temizlik fonksiyonu döndür
  return () => {
    root.removeEventListener("click", onClick);
  };
}


