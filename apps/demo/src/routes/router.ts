import { createRouter, enableLinkNavigation } from "dbf-router";
import { renderHome } from "../pages/home";
import { renderDocs } from "../pages/docs";
import { renderComponents } from "../pages/components";
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

const router = createRouter({
  routes: [
    {
      path: "/",
      onEnter() {
        renderHome(root);
      },
    },
    {
      path: "/docs",
      onEnter() {
        renderDocs(root);
      },
    },
    {
      path: "/components",
      onEnter() {
        renderComponents(root);
      },
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
  }
});
