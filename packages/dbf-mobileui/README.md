# DBF Mobile UI

Mobile-first UI components built on top of DBF Core, designed to pair with DBF Router.

## Install

```bash
npm install dbf-mobileui dbf-core dbf-router
```

## Usage

```ts
import { registerMobileUI } from "dbf-mobileui";

registerMobileUI();
```

Then use the custom elements in your app:

```html
<dbf-mobile-page>
  <dbf-mobile-navbar slot="navbar" title="Home"></dbf-mobile-navbar>
  <dbf-mobile-card>Welcome</dbf-mobile-card>
  <dbf-mobile-toolbar slot="toolbar">
    <dbf-mobile-link href="/">Home</dbf-mobile-link>
  </dbf-mobile-toolbar>
</dbf-mobile-page>
```
