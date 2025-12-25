/**
 * useCallback hook: Fonksiyon referanslarını cache'leme
 */

import { getCurrentHook } from "./dispatcher";
import type { CallbackHook } from "./types";

function shallowEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}

export function useCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps?: any[]
): T {
  const component = (globalThis as any).__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useCallback] useCallback can only be called inside a component");
  }

  const hook = getCurrentHook<CallbackHook<T>>(component, () => ({
    type: "callback",
    id: -1,
    callback,
    deps,
    factory: () => callback,
  }));

  // Dependency değişti mi kontrol et
  if (hook.deps !== undefined && deps !== undefined) {
    if (shallowEqual(hook.deps, deps)) {
      // Değişmedi, cache'lenmiş callback'i döndür
      return hook.callback;
    }
  } else if (hook.deps === deps) {
    // İkisi de undefined, cache'lenmiş callback'i döndür
    return hook.callback;
  }

  // Dependency değişti, yeni callback'i kaydet
  hook.callback = callback;
  hook.deps = deps;
  hook.factory = () => callback;

  return hook.callback;
}

