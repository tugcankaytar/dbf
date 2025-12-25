/**
 * useReducer hook: State yönetimi için reducer pattern
 */

import { getCurrentHook, getHooksContext } from "./dispatcher";
import type { ReducerHook } from "./types";

export type Reducer<S, A> = (state: S, action: A) => S;

export function useReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S
): [S, (action: A) => void];

export function useReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  init?: (initialState: S) => S
): [S, (action: A) => void];

export function useReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  init?: (initialState: S) => S
): [S, (action: A) => void] {
  const component = (globalThis as any).__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useReducer] useReducer can only be called inside a component");
  }

  const hook = getCurrentHook<ReducerHook<S, A>>(component, () => {
    const initial = init ? init(initialState) : initialState;
    return {
      type: "reducer",
      id: -1,
      state: initial,
      reducer,
      dispatch: (action: A) => {
        const ctx = getHooksContext(component);
        const reducerHook = ctx.hooks[hook.id] as ReducerHook<S, A>;
        const nextState = reducerHook.reducer(reducerHook.state, action);

        if (Object.is(reducerHook.state, nextState)) {
          return; // State değişmedi, render yapma
        }

        reducerHook.state = nextState;
        // Component'in invalidate metodunu çağır
        if (component.invalidate) {
          component.invalidate();
        }
      },
    };
  });

  return [hook.state, hook.dispatch];
}

