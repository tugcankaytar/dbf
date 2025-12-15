## DBF Monorepo

This repository contains the **DBF** ecosystem:

- `packages/dbf-core` – lightweight Web Components engine (state, props, render, events)
- `packages/dbf-router` – minimal, HTML‑first client‑side router
- `apps/demo` – example app that showcases DBF Core + DBF Router together

The goal is to make **HTML‑first, framework‑agnostic UI** pleasant to work with, while keeping the runtime very small and explicit.

---

## 1. Repository layout

- **Root**
  - `package.json` – npm workspaces and build scripts
  - `README.md` – this file

- **Packages**
  - `packages/dbf-core` – published as `dbf-core`
  - `packages/dbf-router` – published as `dbf-router`

- **Apps**
  - `apps/demo` – Vite app used for local development and examples

---

## 2. Getting started (local development)

From the repository root:

```bash
# Install all workspace dependencies
npm install

# Build core libraries
npm run build:core
npm run build:router

# Start the demo app
cd apps/demo
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`) in your browser.

---

## 3. Packages overview

### 3.1 `dbf-core`

DBF Core is a small library that wraps the native Custom Elements APIs with:

- A `DBFComponent` base class (state, props, lifecycle)
- A `defineComponent` helper for ergonomic component definitions
- A minimal `html` + `render` layer (template strings → `shadowRoot.innerHTML`)
- Typed props via `defineProps` and `PropsFromSchema`
- A small `on` helper for event delegation

See [`packages/dbf-core/README.md`](packages/dbf-core/README.md) for full API and examples.

### 3.2 `dbf-router`

DBF Router is an intentionally tiny router that:

- Uses the History API and DOM only (no framework assumptions)
- Accepts a list of routes `{ path, onEnter }`
- Provides `createRouter` and `enableLinkNavigation` to wire up `<a data-nav-route="/path">` links

See [`packages/dbf-router/README.md`](packages/dbf-router/README.md) for full details.

### 3.3 `apps/demo`

The demo app shows how to:

- Register DBF Core components
- Structure pages under `src/pages`
- Wire DBF Router under `src/routes/router.ts`
- Build a small landing page with header / content / footer and multiple routes

This app is a good starting point if you want to see DBF “in action” before using it in your own project.

---

## 4. Scripts

From the repository root:

- **`npm run build:core`** – build `dbf-core` into `packages/dbf-core/dist`
- **`npm run dev:core`** – watch/build `dbf-core` during development
- **`npm run build:router`** – build `dbf-router` into `packages/dbf-router/dist`
- **`npm run dev:router`** – watch/build `dbf-router`

Inside `apps/demo`:

- **`npm run dev`** – start Vite dev server
- **`npm run build`** – build demo app for production
- **`npm run preview`** – preview the production build

---

## 5. Status

This project is experimental and evolving. APIs in `dbf-core` and `dbf-router` may change as real‑world usage grows and we refine the ergonomics.

If you try DBF and run into rough edges, limitations, or have ideas for better APIs, those are exactly the kind of insights that will help shape the project.
