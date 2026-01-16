/**
 * DBF Router
 *
 * Hedefler:
 * - HTML-first kullanım: <a dbf-link> ve <dbf-route-view> gibi elementlerle çalışsın
 * - Developer dostu API: küçük bir createRouter + navigate fonksiyonları
 * - Framework bağımsız: sadece History API ve DOM kullanır
 */

export type RouteHandler = (
  params: Record<string, string>,
  query: Record<string, string>,
  hash: string,
  outlet?: HTMLElement // Layout route'lar için outlet element
) => void;

export interface RouteConfig {
  path: string;
  onEnter: RouteHandler;
  beforeEnter?: (
    params: Record<string, string>,
    query: Record<string, string>,
    hash: string
  ) => boolean | string | void; // true/void = continue, false = block, string = redirect
  children?: RouteConfig[]; // Nested routes
  layout?: (root: HTMLElement, outlet: HTMLElement) => void; // Layout render function
}

export interface RouterOptions {
  basePath?: string;
  routes: RouteConfig[];
  /**
   * Called when no route matches the current location.
   */
  onNotFound?: (path: string) => void;
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
   * Varsayılan: 'a[href]'
   */
  selector?: string;
}

function parseQuery(search: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!search || !search.startsWith("?")) return params;
  const pairs = search.slice(1).split("&");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key) {
      params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : "";
    }
  }
  return params;
}

function matchRoute(
  pathname: string,
  routes: RouteConfig[],
  basePath: string,
  parentPath: string = ""
): {
  route: RouteConfig;
  params: Record<string, string>;
  query: Record<string, string>;
  hash: string;
  matchedPath: string;
  remainingPath: string;
} | null {
  const normalized = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname || "/";

  const [pathOnly, hashPart] = normalized.split("#");
  const hash = hashPart ? `#${hashPart}` : "";

  const [pathWithoutQuery, queryString] = pathOnly.split("?");
  const query = parseQuery(queryString ? `?${queryString}` : "");

  // Parent path'i çıkar
  const relativePath = parentPath
    ? pathWithoutQuery.startsWith(parentPath)
      ? pathWithoutQuery.slice(parentPath.length) || "/"
      : pathWithoutQuery
    : pathWithoutQuery;

  for (const route of routes) {
    const routeParams: Record<string, string> = {};
    const routePattern = route.path.startsWith("/") ? route.path : `/${route.path}`;
    const fullRoutePath = parentPath + routePattern;

    // Parametreli route pattern'ini parse et (örn: /users/:id)
    const routeParts = routePattern.split("/").filter(Boolean);
    const pathParts = relativePath.split("/").filter(Boolean);

    if (routeParts.length !== pathParts.length) {
      // Wildcard route kontrolü: /posts/* gibi
      if (routePattern.endsWith("/*")) {
        const basePattern = routePattern.slice(0, -2);
        if (relativePath.startsWith(basePattern)) {
          return {
            route,
            params: routeParams,
            query,
            hash,
            matchedPath: fullRoutePath,
            remainingPath: "",
          };
        }
      }
      continue;
    }

    let matches = true;
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i] || "";

      if (routePart.startsWith(":")) {
        // Parametre: :id -> { id: "123" }
        const paramName = routePart.slice(1);
        routeParams[paramName] = decodeURIComponent(pathPart);
      } else if (routePart === "*") {
        // Wildcard: kalan tüm path'i yakala
        routeParams["*"] = pathParts.slice(i).join("/");
        break;
      } else if (routePart !== pathPart) {
        // Literal eşleşme yok
        matches = false;
        break;
      }
    }

    if (matches) {
      const matchedPath = fullRoutePath;
      const remainingPath = "/" + pathParts.slice(routeParts.length).join("/");

      // Nested routes kontrolü
      if (route.children && route.children.length > 0 && remainingPath !== "/") {
        const nestedMatch = matchRoute(
          pathname,
          route.children,
          basePath,
          matchedPath
        );
        if (nestedMatch) {
          // Nested route bulundu, onu döndür
          return nestedMatch;
        }
      }

      return { route, params: routeParams, query, hash, matchedPath, remainingPath };
    }
  }

  return null;
}

export function createRouter(options: RouterOptions): Router {
  const basePath = options.basePath ?? "";
  let listening = false;

  const router: Router = {
    navigate(path: string) {
      // Path'te query/hash varsa koru
      const fullPath = path.startsWith("/") ? path : `/${path}`;
      const target = basePath + fullPath;
      const current = window.location.pathname + window.location.search + window.location.hash;
      if (current !== target) {
        window.history.pushState({}, "", target);
      }
      // Aynı path'e gitsek bile view'ı yeniden çalıştır (örn: dil değişimi)
      handleLocation();
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

  const handleLocation = () => {
    const match = matchRoute(
      window.location.pathname + window.location.search + window.location.hash,
      options.routes,
      basePath
    );
    if (!match) {
      options.onNotFound?.(
        window.location.pathname + window.location.search + window.location.hash
      );
      return;
    }

    // beforeEnter guard kontrolü
    if (match.route.beforeEnter) {
      const guardResult = match.route.beforeEnter(match.params, match.query, match.hash);
      if (guardResult === false) {
        // Navigasyon engellendi
        return;
      }
      if (typeof guardResult === "string") {
        // Redirect
        router.navigate(guardResult);
        return;
      }
    }

    // Layout varsa önce layout'u render et, sonra route'u
    if (match.route.layout) {
      // Router'ın render edeceği root element'i bul (genellikle main veya #app)
      // Bu, router'ın başlatıldığı yerde belirlenmeli, şimdilik document.body kullanıyoruz
      const appRoot = document.querySelector("main") || document.body;
      
      // Layout container oluştur
      const layoutContainer = document.createElement("div");
      layoutContainer.setAttribute("data-router-layout", "true");
      
      // Outlet element oluştur (içerik buraya render edilecek)
      const outlet = document.createElement("div");
      outlet.setAttribute("data-router-outlet", "true");
      
      // Layout'u render et
      match.route.layout(layoutContainer, outlet);
      
      // Layout container'ı DOM'a ekle
      appRoot.innerHTML = "";
      appRoot.appendChild(layoutContainer);
      
      // Route handler'a outlet'i geç
      match.route.onEnter(match.params, match.query, match.hash, outlet);
    } else {
      match.route.onEnter(match.params, match.query, match.hash);
    }
  };

  const onPopState = () => handleLocation();

  return router;
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
  const selector = options.selector ?? "a[href]";

  const onClick = (ev: Event) => {
    if (!(ev instanceof MouseEvent)) return;
    // Orta tık, modifier tuşları vs'yi router'a vermeyelim
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) {
      return;
    }

    const rawTarget = ev.target as HTMLElement | null;

    let link: HTMLElement | null = null;

    // Shadow DOM içindeki link'leri de desteklemek için composedPath kullan.
    const eventPath = (ev.composedPath && ev.composedPath()) || [];
    for (const el of eventPath) {
      if (el instanceof HTMLElement && el.matches(selector)) {
        link = el;
        break;
      }
    }

    // composedPath desteklenmiyorsa, klasik closest fallback'ine dön.
    if (!link && rawTarget) {
      link = rawTarget.closest<HTMLElement>(selector);
    }
    if (!link) return;

    // data-nav-route varsa override olarak kullanılır, yoksa href source of truth'tur.
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


