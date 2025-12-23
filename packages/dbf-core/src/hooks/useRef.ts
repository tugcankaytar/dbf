/**
 * useRef hook: Mutable ref değerleri
 */

import { getCurrentHook } from "./dispatcher";
import type { RefHook } from "./types";

export function useRef<T>(initialValue: T): { current: T } {
  const component = (globalThis as any).__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useRef] useRef can only be called inside a component");
  }

  const hook = getCurrentHook<RefHook<T>>(component, () => ({
    type: "ref",
    id: -1,
    current: initialValue,
    initialValue,
  }));

  return { current: hook.current };
}

