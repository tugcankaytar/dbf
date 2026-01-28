import { DBFMobileBridge } from "./bridge";
import { createDefaultTransport } from "./transport";
import { createStorage } from "./services/storage";
import { createSecureStorage } from "./services/secure";
import { createDevice } from "./services/device";
import { createDeeplink } from "./services/deeplink";
import { createNotifications } from "./services/notifications";

export type { BridgeMessage, BridgeResultMessage, BridgeEventMessage, BridgeTransport } from "./types";
export { DBFMobileBridge } from "./bridge";
export { createDefaultTransport } from "./transport";
export { bindRouterToNative } from "./router";
export type { DeviceInfo, NetworkInfo } from "./services/device";
export type { DeeplinkPayload } from "./services/deeplink";
export type { PushPayload, PushToken } from "./services/notifications";

type CreateMobileOptions = {
  devMode?: boolean;
  timeoutMs?: number;
  allowedMethods?: string[];
  payloadLimitBytes?: number;
  logPipe?: boolean;
};

export function createDBFMobile(options: CreateMobileOptions = {}) {
  const defaultAllowedMethods = [
    "bridge.ready",
    "native.log",
    "storage.get",
    "storage.set",
    "storage.remove",
    "secure.get",
    "secure.set",
    "secure.remove",
    "device.info",
    "device.locale",
    "device.network",
    "deeplink.getInitial",
    "notifications.requestPermission",
    "notifications.getToken",
  ];

  const bridge = new DBFMobileBridge({
    transport: createDefaultTransport(),
    timeoutMs: options.timeoutMs,
    devMode: options.devMode,
    allowedMethods: options.allowedMethods ?? defaultAllowedMethods,
    payloadLimitBytes: options.payloadLimitBytes,
    logPipe: options.logPipe,
  });

  return {
    bridge,
    invoke: bridge.invoke.bind(bridge),
    on: bridge.on.bind(bridge),
    ready: bridge.ready.bind(bridge),
    storage: createStorage(bridge),
    secure: createSecureStorage(bridge),
    device: createDevice(bridge),
    deeplink: createDeeplink(bridge),
    notifications: createNotifications(bridge),
  };
}
