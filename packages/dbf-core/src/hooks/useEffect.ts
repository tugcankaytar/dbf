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
  let shouldRun = false;
  if (hook.deps === undefined && deps === undefined) {
    // İlk render, çalıştır
    shouldRun = true;
  } else if (hook.deps === undefined || deps === undefined) {
    // Biri undefined diğeri değil, değişti
    shouldRun = true;
  } else if (!shallowEqual(hook.deps, deps)) {
    // Dependency değişti
    shouldRun = true;
  }

  if (shouldRun) {
    hook.effect = effect;
    hook.deps = deps;
    (hook as any)._shouldRun = true; // endRender'da çalıştırılacak
  } else {
    (hook as any)._shouldRun = false; // Çalıştırma
  }
}

export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void {
  const component = (globalThis as any).__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useLayoutEffect] useLayoutEffect can only be called inside a component");
  }

  const hook = getCurrentHook<EffectHook>(component, () => createEffectHook(effect, deps, true));

  // Dependency kontrolü (useEffect ile aynı)
  let shouldRun = false;
  if (hook.deps === undefined && deps === undefined) {
    shouldRun = true;
  } else if (hook.deps === undefined || deps === undefined) {
    shouldRun = true;
  } else if (!shallowEqual(hook.deps, deps)) {
    shouldRun = true;
  }

  if (shouldRun) {
    hook.effect = effect;
    hook.deps = deps;
    (hook as any)._shouldRun = true;
  } else {
    (hook as any)._shouldRun = false;
  }
}

