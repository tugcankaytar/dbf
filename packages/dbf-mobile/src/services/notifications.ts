import type { DBFMobileBridge } from "../bridge";

export type PushToken = {
  token: string;
  platform: "ios" | "android" | "unknown";
};

export type PushPayload = {
  title?: string;
  body?: string;
  route?: string;
  data?: Record<string, unknown>;
};

export function createNotifications(bridge: DBFMobileBridge) {
  return {
    requestPermission() {
      return bridge.invoke<boolean>("notifications.requestPermission");
    },
    getToken() {
      return bridge.invoke<PushToken>("notifications.getToken");
    },
  };
}
