## DBF Framework — Usage Guide

This guide explains how to use DBF packages from **outside** the monorepo.

---

## Installation options

### Option A: npm publish (production)

Publish each package and install them normally.

```bash
# login once
npm login

# publish packages (run from repo root)
cd packages/dbf-core   && npm publish
cd ../dbf-router       && npm publish
cd ../dbf-mssql        && npm publish
```

If a package name is taken, rename it in its `package.json` (for example use a scope: `@your-org/dbf-core`).

In your app:

```bash
npm install dbf-core dbf-router dbf-mssql
```

---

### Option B: npm link (local development)

Useful when developing packages and testing them in another repo.

In the DBF monorepo:

```bash
cd packages/dbf-core  && npm link
cd ../dbf-router      && npm link
cd ../dbf-mssql       && npm link
```

In your consumer project:

```bash
npm link dbf-core dbf-router dbf-mssql
```

> With `npm link`, changes in the monorepo require rebuilding the package (watch mode is recommended).

---

### Option C: local file path (quickest)

In your consumer project `package.json`:

```json
{
  "dependencies": {
    "dbf-core": "file:../dbf/packages/dbf-core",
    "dbf-router": "file:../dbf/packages/dbf-router",
    "dbf-mssql": "file:../dbf/packages/dbf-mssql"
  }
}
```

Then:

```bash
npm install
```

---

### Option D: Git dependency (private/public)

You can depend on the repo directly (works best if you tag releases and keep package names stable).

```json
{
  "dependencies": {
    "dbf-core": "git+https://github.com/your-org/dbf.git#packages/dbf-core",
    "dbf-router": "git+https://github.com/your-org/dbf.git#packages/dbf-router",
    "dbf-mssql": "git+https://github.com/your-org/dbf.git#packages/dbf-mssql"
  }
}
```

---

## Quick start (Vite + DBF Core + DBF Router)

Create a Vite project:

```bash
npm create vite@latest my-dbf-app -- --template vanilla-ts
cd my-dbf-app
npm install
```

Install DBF packages (choose one of the options above), then:

```ts
// src/my-component.ts
import { defineComponent, html } from "dbf-core";
import styles from "./my-component.css?inline";

defineComponent("my-component", {
  styles,
  render({ html }) {
    return html`<div>Hello DBF!</div>`;
  },
});
```

Router:

```ts
// src/router.ts
import { createRouter, enableLinkNavigation } from "dbf-router";

const root = document.querySelector("#app");
if (!root) throw new Error("Root element not found");

const router = createRouter({
  routes: [
    { path: "/", onEnter: () => (root.innerHTML = "<my-component></my-component>") },
    { path: "/about", onEnter: () => (root.innerHTML = "<h1>About</h1>") },
  ],
});

enableLinkNavigation(router);
router.start();
```

HTML entry:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="/src/router.ts"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

---

## TypeScript notes

- DBF packages ship **ESM + CJS + types**, so Vite typically needs no special config.
- For CSS `?inline` imports, add a type declaration if your tooling complains:

```ts
declare module "*.css?inline" {
  const content: string;
  export default content;
}
```

---

## Troubleshooting

### “Cannot find module 'dbf-core'” / missing types

- Ensure you built the packages (`npm run build:*` in the monorepo).
- Delete `node_modules` and reinstall.

