import { createRouter, enableLinkNavigation, type RouteHandler } from "dbf-router";
import { renderHome } from "../pages/home";
import { renderDocs } from "../pages/docs";
import { renderComponents } from "../pages/components";
import { renderDataFetch } from "../pages/data-fetch";
import { installGlobalErrorHandler, onLanguageChange } from "dbf-core";

// Install a simple global error banner + console logging
installGlobalErrorHandler(
  {
    getMessage(error) {
      if (!root) {
        console.error("Unhandled router error:", error);
        return "router error check root element and console for details";
      }
      return "Unexpected router error. Please check the console.";
    },
  }
);

const root = document.querySelector<HTMLElement>("main.landing");
if (!root) {
  throw new Error("main.landing element not found");
}

const homeHandler: RouteHandler = ((_params: Record<string, string>, _query: Record<string, string>, _hash: string, outlet?: HTMLElement) => {
  const target = outlet || root;
  renderHome(target);
}) as RouteHandler;

const docsHandler: RouteHandler = ((_params: Record<string, string>, _query: Record<string, string>, _hash: string, outlet?: HTMLElement) => {
  const target = outlet || root;
  renderDocs(target);
}) as RouteHandler;

const componentsHandler: RouteHandler = ((_params: Record<string, string>, _query: Record<string, string>, _hash: string, outlet?: HTMLElement) => {
  const target = outlet || root;
  renderComponents(target);
}) as RouteHandler;

const dataFetchHandler: RouteHandler = ((_params: Record<string, string>, _query: Record<string, string>, _hash: string, outlet?: HTMLElement) => {
  const target = outlet || root;
  renderDataFetch(target);
}) as RouteHandler;

const router = createRouter({
  routes: [
    {
      path: "/",
      onEnter: homeHandler,
    },
    {
      path: "/docs",
      onEnter: docsHandler,
    },
    {
      path: "/components",
      onEnter: componentsHandler,
    },
    {
      path: "/data-fetch",
      onEnter: dataFetchHandler,
    },
  ],
});

// Router motoru link click'lerini otomatik yönetir
enableLinkNavigation(router);
router.start();

// Dil değiştiğinde aktif path'e göre sayfa içeriğini yeniden çiz
onLanguageChange(() => {
  const path = window.location.pathname || "/";

  if (path === "/") {
    renderHome(root);
  } else if (path === "/docs") {
    renderDocs(root);
  } else if (path === "/components") {
    renderComponents(root);
  } else if (path === "/data-fetch") {
    renderDataFetch(root);
  }
});
