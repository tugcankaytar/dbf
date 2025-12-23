/**
 * Context API: Global state yönetimi için React-benzeri Context sistemi
 */

export interface ContextValue<T = any> {
  value: T;
  listeners: Set<() => void>;
}

const contextStore = new WeakMap<HTMLElement, Map<symbol, ContextValue>>();

/**
 * Context oluştur
 */
export function createContext<T>(defaultValue: T) {
  const contextId = Symbol("dbf-context");

  return {
    _id: contextId,
    _defaultValue: defaultValue,
  };
}

export type Context<T> = ReturnType<typeof createContext<T>>;

/**
 * useContext hook: Context değerini okur
 */
export function useContext<T>(context: Context<T>): T {
  const component = (globalThis as any).__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useContext] useContext can only be called inside a component");
  }

  // Component'in parent chain'inde context provider'ı ara
  let current: HTMLElement | null = component;
  while (current) {
    const store = contextStore.get(current);
    if (store) {
      const contextValue = store.get(context._id);
      if (contextValue) {
        // Context bulundu, listener ekle (re-render için)
        const listener = () => {
          if (component.invalidate) {
            component.invalidate();
          }
        };
        contextValue.listeners.add(listener);

        // Cleanup için useEffect benzeri kayıt
        // (Bu hook index'i kullanmıyor, sadece cleanup için)
        return contextValue.value;
      }
    }
    // Shadow DOM veya normal DOM parent'ına geç
    const root = (current as any).getRootNode?.();
    current = root?.host || current.parentElement;
  }

  // Context bulunamadı, default value döndür
  return context._defaultValue;
}

/**
 * Context value'yu bir element'e bağla (Provider gibi)
 */
export function provideContext<T>(host: HTMLElement, context: Context<T>, value: T): void {
  let store = contextStore.get(host);
  if (!store) {
    store = new Map();
    contextStore.set(host, store);
  }

  const contextValue: ContextValue<T> = {
    value,
    listeners: new Set(),
  };

  store.set(context._id, contextValue);

  // Value değiştiğinde tüm listener'ları bilgilendir
  const updateValue = (newValue: T) => {
    if (newValue !== contextValue.value) {
      contextValue.value = newValue;
      contextValue.listeners.forEach((fn) => fn());
    }
  };

  // Update fonksiyonunu context value'ya ekle
  (contextValue as any).update = updateValue;
}

