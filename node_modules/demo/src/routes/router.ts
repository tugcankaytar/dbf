import { createRouter, enableLinkNavigation } from "dbf-router";
import { renderHome } from "../pages/home";
import { renderDocs } from "../pages/docs";
import { renderComponents } from "../pages/components";

const root = document.querySelector<HTMLElement>("main.landing");
if (!root) {
  throw new Error("[router-demo] main.landing not found");
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


