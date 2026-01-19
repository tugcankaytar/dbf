## DBF Router

Minimal, HTML‑first client‑side router designed to pair nicely with **DBF Core** and native Web Components.

---

## Features

- **Simple core API** – `createRouter({ routes })` + `router.navigate()`
- **HTML‑first links** – `enableLinkNavigation(router)` wires up `<a data-nav-route="/path">` automatically
- **Framework‑agnostic** – Uses the History API and DOM only, no dependency on React/Vue/etc.
- **Tiny surface area** – A small set of primitives meant to stay understandable at a glance

---

## Installation

```bash
npm install dbf-router
```

---

## Basic usage

```ts
import { createRouter, enableLinkNavigation } from "dbf-router";

const root = document.querySelector<HTMLElement>("main")!;

const router = createRouter({
  routes: [
    { path: "/", onEnter: () => (root.innerHTML = "<h1>Home</h1>") },
    { path: "/docs", onEnter: () => (root.innerHTML = "<h1>Docs</h1>") },
  ],
});

// HTML-first nav: <a href="/docs" data-nav-route="/docs">Docs</a>
enableLinkNavigation(router);
router.start();
```

When the location changes (via `navigate` or the back/forward buttons), the corresponding `onEnter` handler is called.

`onEnter` receives `(params, query, hash, outlet?)`:

- `params`: route params (e.g. `/users/:id`)
- `query`: parsed query string (`?a=1&b=2`)
- `hash`: hash fragment (e.g. `#section`)
- `outlet`: only for layout routes

---

## Link behaviour (`enableLinkNavigation`)

`enableLinkNavigation(router, options?)` attaches a global click handler that:

- Listens for clicks on elements matching `options.selector` (default: `a[href]`)
- Reads the target path from `href` (or `data-nav-route` as an optional override)
- Ignores:
  - Middle clicks
  - Modifier clicks (Ctrl/Cmd/Shift/Alt)
  - External links (`http://`, `https://`)
- Calls `router.navigate(path)` and prevents the browser’s default navigation

Recommended HTML (no duplication):

```html
<a href="/docs">Docs</a>
<a href="/components">Components</a>
```

If you really need to override the SPA route while keeping a different `href`, you can still use `data-nav-route`:

```html
<a href="/marketing" data-nav-route="/docs">Docs</a>
```

You can scope the handler to a specific container:

```ts
enableLinkNavigation(router, {
  root: document.querySelector("#app")!,
  selector: "a[data-nav-route]",
});
```

The function returns a cleanup callback you can call to remove the listener:

```ts
const dispose = enableLinkNavigation(router);
// later
dispose();
```

---

## Route configuration

The router accepts a small configuration object:

```ts
import type { RouterOptions } from "dbf-router";

const options: RouterOptions = {
  basePath: "/app", // optional
  routes: [
    { path: "/", onEnter: () => {/* ... */} },
    { path: "/docs", onEnter: () => {/* ... */} },
  ],
  onNotFound: (path) => {
    console.warn("No route for", path);
  },
};
```

- `basePath` (optional) – if your app is served under a sub‑path (`/app`), all matching is done relative to that.
- `routes` – an array of `{ path, onEnter }` objects.
- `onNotFound` (optional) – called when no route matches.

Additional capabilities already supported:

- **Params**: `/users/:id`
- **Wildcard**: `/docs/*`
- **Nested routes** via `children`
- **Route guards** via `beforeEnter` (return `false` to block or a string to redirect)
- **Layout routes** via `layout(root, outlet)` + `outlet` passed to `onEnter`

---

## Interop with DBF Core

In the demo app (`apps/demo`), DBF Router is used to swap **page components** rendered with DBF Core:

```ts
import { createRouter, enableLinkNavigation } from "dbf-router";
import { renderHome } from "../pages/home";
import { renderDocs } from "../pages/docs";

const root = document.querySelector<HTMLElement>("main.landing")!;

const router = createRouter({
  routes: [
    { path: "/", onEnter: () => renderHome(root) },
    { path: "/docs", onEnter: () => renderDocs(root) },
  ],
});

enableLinkNavigation(router);
router.start();
```

Each `renderX(root)` function composes various DBF Core custom elements, giving you a React‑like “pages as components” experience without needing a framework.

---

## Status

DBF Router is early and intentionally small. As we learn from real applications, we may add:

- Parameterised routes (`/docs/:id`)
- Route guards / before‑enter hooks
- Better integration helpers for different UI stacks

For now, the goal is to stay minimal and predictable so you always understand what the router is doing.