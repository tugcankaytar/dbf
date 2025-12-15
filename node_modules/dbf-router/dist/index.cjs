"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createRouter: () => createRouter,
  enableLinkNavigation: () => enableLinkNavigation
});
module.exports = __toCommonJS(index_exports);
function matchRoute(pathname, routes, basePath) {
  const normalized = pathname.startsWith(basePath) ? pathname.slice(basePath.length) || "/" : pathname || "/";
  for (const route of routes) {
    if (route.path === normalized) {
      return { route, params: {} };
    }
  }
  return null;
}
function createRouter(options) {
  const basePath = options.basePath ?? "";
  let listening = false;
  const handleLocation = () => {
    const match = matchRoute(window.location.pathname, options.routes, basePath);
    if (!match) return;
    match.route.onEnter(match.params);
  };
  const onPopState = () => handleLocation();
  return {
    navigate(path) {
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
    }
  };
}
function enableLinkNavigation(router, options = {}) {
  const root = options.root ?? document;
  const selector = options.selector ?? "[data-nav-route]";
  const onClick = (ev) => {
    if (!(ev instanceof MouseEvent)) return;
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) {
      return;
    }
    const target = ev.target;
    const link = target?.closest(selector);
    if (!link) return;
    const path = link.getAttribute("data-nav-route") ?? link.getAttribute("href");
    if (!path || path.startsWith("http")) return;
    ev.preventDefault();
    router.navigate(path);
  };
  root.addEventListener("click", onClick);
  return () => {
    root.removeEventListener("click", onClick);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createRouter,
  enableLinkNavigation
});
