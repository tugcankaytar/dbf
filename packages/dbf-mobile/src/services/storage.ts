import type { DBFMobileBridge } from "../bridge";

export function createStorage(bridge: DBFMobileBridge) {
  return {
    get(key: string) {
      return bridge.invoke<string | null>("storage.get", { key });
    },
    set(key: string, value: string) {
      return bridge.invoke<boolean>("storage.set", { key, value });
    },
    remove(key: string) {
      return bridge.invoke<boolean>("storage.remove", { key });
    },
  };
}
