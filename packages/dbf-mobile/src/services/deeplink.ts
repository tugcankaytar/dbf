import type { DBFMobileBridge } from "../bridge";

export type DeeplinkPayload = {
  url: string;
  route?: string;
};

export function createDeeplink(bridge: DBFMobileBridge) {
  return {
    getInitial() {
      return bridge.invoke<DeeplinkPayload | null>("deeplink.getInitial");
    },
  };
}
