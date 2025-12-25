/**
 * useState hook: Component state yönetimi
 */

import { getCurrentHook, getHooksContext } from "./dispatcher";
import type { StateHook } from "./types";

export function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void] {
  const component = (globalThis as any).__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useState] useState can only be called inside a component");
  }

  const hook = getCurrentHook<StateHook<T>>(component, () => {
    const value = typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
    return {
      type: "state",
      id: -1, // dispatcher set edecek
      value,
      setter: (newValue: T | ((prev: T) => T)) => {
        const ctx = getHooksContext(component);
        const stateHook = ctx.hooks[hook.id] as StateHook<T>;
        const prevValue = stateHook.value;
        const nextValue = typeof newValue === "function" ? (newValue as (prev: T) => T)(prevValue) : newValue;

        if (Object.is(prevValue, nextValue)) {
          return; // Değer değişmedi, render yapma
        }

        stateHook.value = nextValue;
        // Component'in invalidate metodunu çağır
        if (component.invalidate) {
          component.invalidate();
        }
      },
    };
  });

  return [hook.value, hook.setter];
}

