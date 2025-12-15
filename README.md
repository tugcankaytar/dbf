# DBF Monorepo

Mono repo for the **DBF** ecosystem:

- `packages/dbf-core`: core Web Components engine (state, props, render, events)
- `packages/dbf-router`: tiny, HTML-first client-side router
- `apps/demo`: example app that showcases DBF Core + DBF Router

## Getting started

```bash
npm install

# Build core libraries
npm run build:core
npm run build:router

# Start demo app
cd apps/demo
npm install
npm run dev
```


