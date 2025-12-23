/**
 * useEffect ve useLayoutEffect hooks: Side effect yönetimi
 */

import { getCurrentHook, getHooksContext } from "./dispatcher";
import type { EffectHook } from "./types";

function shallowEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}

function createEffectHook(
  effect: () => void | (() => void),
  deps: any[] | undefined,
  layout: boolean
): EffectHook {
  return {
    type: "effect",
    id: -1, // dispatcher set edecek
    effect,
    deps,
    layout,
  };
}

export function useEffect(effect: () => void | (() => void), deps?: any[]): void {
  const component = (globalThis as any).__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useEffect] useEffect can only be called inside a component");
  }

  const hook = getCurrentHook<EffectHook>(component, () => createEffectHook(effect, deps, false));

  // Dependency değişti mi kontrol et
  if (hook.deps !== undefined && deps !== undefined) {
    if (shallowEqual(hook.deps, deps)) {
      // Değişmedi, effect'i çalıştırma
      return;
    }
  } else if (hook.deps === deps) {
    // İkisi de undefined, değişmedi
    return;
  }

  // Dependency değişti veya ilk render, effect'i güncelle
  hook.effect = effect;
  hook.deps = deps;
  // Effect render sonunda dispatcher tarafından çalıştırılacak
}

export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void {
  const component = (globalThis as any).__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useLayoutEffect] useLayoutEffect can only be called inside a component");
  }

  const hook = getCurrentHook<EffectHook>(component, () => createEffectHook(effect, deps, true));

  // Dependency kontrolü (useEffect ile aynı)
  if (hook.deps !== undefined && deps !== undefined) {
    if (shallowEqual(hook.deps, deps)) {
      return;
    }
  } else if (hook.deps === deps) {
    return;
  }

  hook.effect = effect;
  hook.deps = deps;
  // Layout effect'ler render'dan hemen sonra, paint'ten önce çalışmalı
  // Şimdilik normal effect gibi çalıştırıyoruz, ileride optimize edilebilir
}

