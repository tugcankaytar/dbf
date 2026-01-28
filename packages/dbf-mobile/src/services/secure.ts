import type { DBFMobileBridge } from "../bridge";

export function createSecureStorage(bridge: DBFMobileBridge) {
  return {
    get(key: string) {
      return bridge.invoke<string | null>("secure.get", { key });
    },
    set(key: string, value: string) {
      return bridge.invoke<boolean>("secure.set", { key, value });
    },
    remove(key: string) {
      return bridge.invoke<boolean>("secure.remove", { key });
    },
  };
}
