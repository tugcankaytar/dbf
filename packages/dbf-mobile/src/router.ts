import type { Router } from "dbf-router";
import type { DBFMobileBridge } from "./bridge";
import type { DeeplinkPayload } from "./services/deeplink";
import type { PushPayload } from "./services/notifications";

type RouteFromEvent = (payload: DeeplinkPayload | PushPayload) => string | null;

export function bindRouterToNative(
  bridge: DBFMobileBridge,
  router: Router,
  options: {
    deeplinkRoute?: RouteFromEvent;
    pushRoute?: RouteFromEvent;
  } = {}
) {
  const deeplinkMapper =
    options.deeplinkRoute ??
    ((payload: DeeplinkPayload) => payload.route ?? payload.url ?? null);
  const pushMapper =
    options.pushRoute ?? ((payload: PushPayload) => payload.route ?? null);

  const offDeep = bridge.on("deeplink.opened", (payload) => {
    const route = deeplinkMapper(payload as DeeplinkPayload);
    if (route) router.navigate(route);
  });

  const offPush = bridge.on("push.opened", (payload) => {
    const route = pushMapper(payload as PushPayload);
    if (route) router.navigate(route);
  });

  return () => {
    offDeep();
    offPush();
  };
}
