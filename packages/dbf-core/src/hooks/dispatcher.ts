/**
 * Hooks dispatcher: Component instance'ları için hooks state'ini yönetir
 */

import type { Hook, HooksContext } from "./types";

// WeakMap ile component instance -> hooks context mapping
const hooksMap = new WeakMap<any, HooksContext>();

/**
 * Bir component instance için hooks context'i al veya oluştur
 */
export function getHooksContext(component: any): HooksContext {
  let ctx = hooksMap.get(component);
  if (!ctx) {
    ctx = {
      hooks: [],
      currentIndex: 0,
      component,
      isRendering: false,
    };
    hooksMap.set(component, ctx);
  }
  return ctx;
}

/**
 * Render başlangıcında çağrılır: hook index'ini sıfırla
 */
export function startRender(component: any): void {
  const ctx = getHooksContext(component);
  ctx.currentIndex = 0;
  ctx.isRendering = true;
}

/**
 * Render bitişinde çağrılır: effect'leri çalıştır
 */
export function endRender(component: any): void {
  const ctx = getHooksContext(component);
  ctx.isRendering = false;

  // Effect hook'larını çalıştır (cleanup önce, sonra yeni effect)
  for (const hook of ctx.hooks) {
    if (hook.type === "effect") {
      // Cleanup önceki effect'ten varsa çalıştır
      if (hook.cleanup) {
        try {
          hook.cleanup();
        } catch (error) {
          console.error("[dbf-core:hooks] Effect cleanup error:", error);
        }
      }

      // Yeni effect'i çalıştır
      try {
        const cleanup = hook.effect();
        hook.cleanup = typeof cleanup === "function" ? cleanup : undefined;
      } catch (error) {
        console.error("[dbf-core:hooks] Effect error:", error);
      }
    }
  }
}

/**
 * Mevcut hook'u al veya yeni oluştur
 */
export function getCurrentHook<T extends Hook>(component: any, factory: () => T): T {
  const ctx = getHooksContext(component);

  if (!ctx.isRendering) {
    throw new Error(
      "[dbf-core:hooks] Hooks can only be called during component render or mount phase"
    );
  }

  const index = ctx.currentIndex;
  ctx.currentIndex++;

  if (index < ctx.hooks.length) {
    // Mevcut hook'u kullan
    const existing = ctx.hooks[index] as T;
    if (existing.type !== factory().type) {
      throw new Error(
        `[dbf-core:hooks] Hook type mismatch at index ${index}. Expected ${factory().type}, got ${existing.type}`
      );
    }
    return existing;
  }

  // Yeni hook oluştur
  const newHook = factory();
  newHook.id = index;
  ctx.hooks.push(newHook);
  return newHook;
}

/**
 * Component unmount olduğunda cleanup yap
 */
export function cleanupHooks(component: any): void {
  const ctx = hooksMap.get(component);
  if (!ctx) return;

  // Tüm effect cleanup'larını çalıştır
  for (const hook of ctx.hooks) {
    if (hook.type === "effect" && hook.cleanup) {
      try {
        hook.cleanup();
      } catch (error) {
        console.error("[dbf-core:hooks] Cleanup error on unmount:", error);
      }
    }
  }

  // Context'i temizle
  hooksMap.delete(component);
}

