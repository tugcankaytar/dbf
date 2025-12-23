/**
 * useMemo hook: Hesaplanmış değerleri cache'leme
 */

import { getCurrentHook } from "./dispatcher";
import type { MemoHook } from "./types";

function shallowEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}

export function useMemo<T>(factory: () => T, deps?: any[]): T {
  const component = (globalThis as any).__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useMemo] useMemo can only be called inside a component");
  }

  const hook = getCurrentHook<MemoHook<T>>(component, () => ({
    type: "memo",
    id: -1,
    value: factory(),
    deps,
    factory,
  }));

  // Dependency değişti mi kontrol et
  if (hook.deps !== undefined && deps !== undefined) {
    if (shallowEqual(hook.deps, deps)) {
      // Değişmedi, cache'lenmiş değeri döndür
      return hook.value;
    }
  } else if (hook.deps === deps) {
    // İkisi de undefined, cache'lenmiş değeri döndür
    return hook.value;
  }

  // Dependency değişti, yeniden hesapla
  hook.value = factory();
  hook.deps = deps;
  hook.factory = factory;

  return hook.value;
}

