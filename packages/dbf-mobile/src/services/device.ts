import type { DBFMobileBridge } from "../bridge";

export type DeviceInfo = {
  platform: "ios" | "android" | "unknown";
  version: string;
  model: string;
};

export type NetworkInfo = {
  online: boolean;
  type?: string;
};

export function createDevice(bridge: DBFMobileBridge) {
  return {
    info() {
      return bridge.invoke<DeviceInfo>("device.info");
    },
    locale() {
      return bridge.invoke<string>("device.locale");
    },
    network() {
      return bridge.invoke<NetworkInfo>("device.network");
    },
  };
}
