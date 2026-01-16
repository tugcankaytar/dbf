/**
 * DBF Router
 *
 * Hedefler:
 * - HTML-first kullanım: <a dbf-link> ve <dbf-route-view> gibi elementlerle çalışsın
 * - Developer dostu API: küçük bir createRouter + navigate fonksiyonları
 * - Framework bağımsız: sadece History API ve DOM kullanır
 */
type RouteHandler = (params: Record<string, string>, query: Record<string, string>, hash: string, outlet?: HTMLElement) => void;
interface RouteConfig {
    path: string;
    onEnter: RouteHandler;
    beforeEnter?: (params: Record<string, string>, query: Record<string, string>, hash: string) => boolean | string | void;
    children?: RouteConfig[];
    layout?: (root: HTMLElement, outlet: HTMLElement) => void;
}
interface RouterOptions {
    basePath?: string;
    routes: RouteConfig[];
    /**
     * Called when no route matches the current location.
     */
    onNotFound?: (path: string) => void;
}
interface Router {
    navigate(path: string): void;
    start(): void;
    stop(): void;
}
interface LinkHandlerOptions {
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
declare function createRouter(options: RouterOptions): Router;
/**
 * Verilen router için HTML-first link navigasyonu ekler.
 *
 * Örn:
 *   enableLinkNavigation(router);
 *   // <a href="/docs" data-nav-route="/docs">Docs</a>
 */
declare function enableLinkNavigation(router: Router, options?: LinkHandlerOptions): () => void;

export { type LinkHandlerOptions, type RouteConfig, type RouteHandler, type Router, type RouterOptions, createRouter, enableLinkNavigation };
