## DBF Monorepo

This repository contains the **DBF** ecosystem:

- **`dbf-core`**: a tiny, HTML-first Web Components engine (state/props/render/events)
- **`dbf-router`**: a minimal, HTML-first client-side router
- **`dbf-mssql`**: Node.js helpers for MSSQL (`.env` config + pool + stored procedures)

The goal is to keep the runtime **small and explicit**, while giving you a pleasant developer experience without forcing a framework (React/Vue/etc.).

---

## Requirements

- **Node.js**: `>= 18`
- **npm**: a recent version (workspaces enabled)

---

## Repository layout

- **Root**
  - `package.json`: npm workspaces and root scripts
  - `tsconfig.base.json`: shared TypeScript config
  - `README.md`: this file
  - `USAGE.md`: using DBF packages outside this monorepo

- **Packages** (`packages/*`)
  - `packages/dbf-core` → published as `dbf-core`
  - `packages/dbf-router` → published as `dbf-router`
  - `packages/dbf-mssql` → published as `dbf-mssql`

- **Apps** (`apps/*`)
  - `apps/demo`: Vite demo showcasing DBF Core + DBF Router

---

## Packages overview

| Package | Runtime | What it does | Docs |
| --- | --- | --- | --- |
| `dbf-core` | Browser (Custom Elements) | Define components, props/state/render, event delegation, scoped styles | [`packages/dbf-core/README.md`](packages/dbf-core/README.md) |
| `dbf-router` | Browser | Minimal SPA router (`createRouter`, `enableLinkNavigation`) | [`packages/dbf-router/README.md`](packages/dbf-router/README.md) |
| `dbf-mssql` | **Node.js (server)** | `.env` → MSSQL config, pool, query/proc helpers | [`packages/dbf-mssql/README.md`](packages/dbf-mssql/README.md) |

> `dbf-mssql` is **server-only**. The recommended architecture is: **frontend → backend API → MSSQL**.

---

## Getting started (local development)

From the repo root:

```bash
# Install workspace dependencies
npm install

# Build packages (produces ESM + CJS + d.ts)
npm run build:core
npm run build:router
npm run build:mssql
```

### Run the demo app

```bash
cd apps/demo
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

---

## Development workflow (DX)

### Watch mode (develop packages)

```bash
# run in separate terminals
npm run dev:core
npm run dev:router
npm run dev:mssql
```

> When consuming a local package build from another repo, your consumer app may need its own refresh/rebuild to pick up new `dist/` outputs.

### Package outputs

Each package builds to:

- `dist/index.js` (ESM)
- `dist/index.cjs` (CJS)
- `dist/index.d.ts` + `dist/index.d.cts` (TypeScript types)

---

## Using these packages outside the monorepo

See [`USAGE.md`](USAGE.md) for full details. Common options:

- **Local file path** (quickest): `package.json` → `"dbf-core": "file:../path/to/dbf-core"`
- **npm link** (local development)
- **npm publish** (production)

---

## Important note about `dbf-mssql`

`dbf-mssql` must run in **Node.js**. Do not bundle it into the browser:

- **Security**: you would leak DB credentials to the client
- **Technical**: MSSQL drivers rely on Node APIs (e.g. `Buffer`)

---

## Scripts

From the repo root:

- **`npm run build:core`**, **`npm run dev:core`**
- **`npm run build:router`**, **`npm run dev:router`**
- **`npm run build:mssql`**, **`npm run dev:mssql`**

Inside `apps/demo`:

- **`npm run dev`**, **`npm run build`**, **`npm run preview`**

---

## Status

This project is evolving. APIs (especially `dbf-core` and `dbf-router`) may change as real-world usage grows and we refine the ergonomics.
