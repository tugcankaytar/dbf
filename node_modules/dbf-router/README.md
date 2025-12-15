# DBF Router

Minimal, HTML-first client-side router designed to pair nicely with **DBF Core**.

## Features

- **Simple core API**: `createRouter({ routes })` + `router.navigate()`
- **HTML-first links**: `enableLinkNavigation(router)` ile `<a data-nav-route="/path">` tıklamalarını otomatik yönetir
- **Framework-agnostic**: Sadece History API ve DOM kullanır, herhangi bir UI framework’üne bağlı değildir

## Installation

```bash
npm install dbf-router
```

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

## Link behaviour

- Router, `data-nav-route` attribute’u olan link’leri dinler:
  - `<a href="/docs" data-nav-route="/docs">Docs</a>`
- Orta tık, Ctrl+Click gibi yeni sekme davranışlarına karışmaz.
- Dış (http/https) link’leri otomatik olarak göz ardı eder.

## Status

Early experiment. API is intentionally small and may evolve as DBF ekosistemi netleşir.

