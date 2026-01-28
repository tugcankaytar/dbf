# DBF Mobile

WebView bridge client for DBF apps. This package exposes a typed JS API for
calling native modules and receiving native events.

## Install

```bash
npm install dbf-mobile dbf-router
```

## Usage

```ts
import { createDBFMobile, bindRouterToNative } from "dbf-mobile";
import { createRouter } from "dbf-router";

const mobile = createDBFMobile({ devMode: true });

const router = createRouter({ routes: [] });
bindRouterToNative(mobile.bridge, router);

await mobile.ready();
await mobile.storage.set("token", "abc");
const token = await mobile.secure.get("token");
```

## Bridge API

- `invoke(method, payload?)`
- `on(eventName, callback)`
- `ready()` (handshake)

## Services

- `storage.get/set/remove`
- `secure.get/set/remove`
- `device.info/locale/network`
- `deeplink.getInitial`
- `notifications.requestPermission/getToken`

## Protocol

```json
{ "type": "invoke", "id": "req_123", "method": "storage.set", "payload": { "key": "token", "value": "abc" } }
```

```json
{ "type": "result", "id": "req_123", "ok": true, "payload": { "success": true } }
```

```json
{ "type": "event", "name": "push.received", "payload": { "title": "Hello" } }
```

## Events

- `ready.ack`
- `deeplink.opened`
- `push.received`
- `push.opened`
- `native.error`

## Whitelist + payload limits

By default `createDBFMobile` enforces a method whitelist for the MVP modules.
Override with:

```ts
createDBFMobile({
  allowedMethods: ["storage.get", "storage.set"],
  payloadLimitBytes: 65536,
});
```

## Host scaffolds

This repo includes stub native hosts under `dbf-mobile-host/`:

- `dbf-mobile-host/ios/` (WKWebView + Swift)
- `dbf-mobile-host/android/` (WebView + Kotlin)
- `dbf-mobile-host/webapp/` (copy your `dist/` output)
