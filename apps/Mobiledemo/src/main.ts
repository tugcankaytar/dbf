import "./style.css";
import { registerMobileUI } from "dbf-mobileui";
import { createRouter, enableLinkNavigation, type RouteHandler } from "dbf-router";
import { renderHome } from "./pages/home";
import { renderProfile } from "./pages/profile";
import { renderSettings } from "./pages/settings";

registerMobileUI();

const root = document.querySelector<HTMLElement>("#app-content");
if (!root) {
  throw new Error("#app-content element not found");
}

const appShell = document.querySelector<HTMLElement>("#app");
const menuToggle = document.querySelector<HTMLButtonElement>("#menu-toggle");
const drawer = document.querySelector<HTMLElement>("#app-drawer");

if (menuToggle && drawer && appShell) {
  menuToggle.addEventListener("click", () => {
    const isOpen = drawer.hasAttribute("open");
    drawer.toggleAttribute("open", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    appShell.classList.toggle("drawer-open", !isOpen);
  });
}

const homeHandler: RouteHandler = (_params, _query, _hash, outlet) => {
  const target = outlet || root;
  renderHome(target);
};

const profileHandler: RouteHandler = (_params, _query, _hash, outlet) => {
  const target = outlet || root;
  renderProfile(target);
};

const settingsHandler: RouteHandler = (_params, _query, _hash, outlet) => {
  const target = outlet || root;
  renderSettings(target);
};

const router = createRouter({
  routes: [
    { path: "/", onEnter: homeHandler },
    { path: "/profile", onEnter: profileHandler },
    { path: "/settings", onEnter: settingsHandler },
  ],
});

enableLinkNavigation(router);
router.start();
