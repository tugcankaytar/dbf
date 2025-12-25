/**
 * Hooks sisteminin temel tipleri
 */

export type HookType = "state" | "effect" | "memo" | "callback" | "ref" | "reducer";

export interface HookBase {
  type: HookType;
  id: number; // Hook sırasını takip etmek için
}

export interface StateHook<T = any> extends HookBase {
  type: "state";
  value: T;
  setter: (value: T | ((prev: T) => T)) => void;
}

export interface EffectHook extends HookBase {
  type: "effect";
  effect: () => void | (() => void);
  deps?: any[];
  cleanup?: () => void;
  layout?: boolean; // useLayoutEffect için
}

export interface MemoHook<T = any> extends HookBase {
  type: "memo";
  value: T;
  deps?: any[];
  factory: () => T;
}

export interface CallbackHook<T extends (...args: any[]) => any> extends HookBase {
  type: "callback";
  callback: T;
  deps?: any[];
  factory: (...args: Parameters<T>) => T;
}

export interface RefHook<T = any> extends HookBase {
  type: "ref";
  current: T;
  initialValue: T;
}

export interface ReducerHook<S, A> extends HookBase {
  type: "reducer";
  state: S;
  dispatch: (action: A) => void;
  reducer: (state: S, action: A) => S;
}

export type Hook =
  | StateHook
  | EffectHook
  | MemoHook
  | CallbackHook<any>
  | RefHook
  | ReducerHook<any, any>;

/**
 * Component instance'ı için hooks context'i
 */
export interface HooksContext {
  hooks: Hook[];
  currentIndex: number;
  component: any; // DBFComponent instance
  isRendering: boolean;
}

