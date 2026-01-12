/**
 * Hooks örnekleri: useState, useEffect, useMemo, useCallback, useReducer
 */
import { defineComponent, useState, useEffect, useMemo, useCallback, useReducer } from "dbf-core";

// useState örneği - state ile (bu zaten çalışıyor)
defineComponent("demo-use-state", {
  render({ html, state }) {
    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 1rem 0;
        }
        button {
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          border: 1px solid #6366f1;
          background: #6366f1;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
        input {
          padding: 0.5rem;
          margin: 0.25rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      </style>
      <h3>useState Hook</h3>
      <p>Count: <strong>${state.count}</strong></p>
      <button data-action="inc-count">Increment</button>
      <button data-action="dec-count">Decrement</button>
      <p>Name: <strong>${state.name}</strong></p>
      <input
        type="text"
        data-action="set-name"
        value="${state.name}"
        placeholder="Enter name"
      />
    `;
  },
  state: () => ({ count: 0, name: "DBF" }),
  mount({ root, on, setState, host }) {
    on(root, "click", "[data-action='inc-count']", () => {
      // Closure sorununu önlemek için host.state kullan
      setState({ count: host.state.count + 1 });
    });
    on(root, "click", "[data-action='dec-count']", () => {
      // Closure sorununu önlemek için host.state kullan
      setState({ count: host.state.count - 1 });
    });
    on(root, "input", "[data-action='set-name']", (_ev, el) => {
      const input = el as HTMLInputElement;
      setState({ name: input.value });
    });
  },
});

// useEffect örneği - hooks kullanarak
defineComponent("demo-use-effect", {
  render({ html }) {
    const [count] = useState(0);
    const [effectCount, setEffectCount] = useState(0);

    useEffect(() => {
      // Effect sadece count değiştiğinde çalışır
      setEffectCount((prev) => prev + 1);
      console.log("Effect ran, count is:", count);
      return () => {
        console.log("Effect cleanup, count was:", count);
      };
    }, [count]);

    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 1rem 0;
        }
        button {
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          border: 1px solid #10b981;
          background: #10b981;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <h3>useEffect Hook</h3>
      <p>Count: <strong>${count}</strong></p>
      <p>Effect ran <strong>${effectCount}</strong> times</p>
      <button data-action="trigger-effect">Trigger Effect</button>
      <p><small>Check console for effect logs</small></p>
    `;
  },
  mount({ root, on, host }) {
    on(root, "click", "[data-action='trigger-effect']", () => {
      // Hooks context'inden direkt setter'a eriş
      // __hooks__ bir HooksContext objesi, içinde hooks array'i var
      // Event handler lazy çalıştığı için hooks her zaman hazır olacak
      const hooksContext = (host as any).__hooks__;      
      const countHook = hooksContext.hooks[0];        
      countHook.setter((prev: number) => prev + 1);
      console.log("countHook", countHook);
    });
  },
});

// useMemo örneği
defineComponent("demo-use-memo", {
  render({ html, host }) {
    const [a, setA] = useState(1);
    const [b, setB] = useState(2);
    const [renderCount, setRenderCount] = useState(0);

    // Setter'ları host üzerinde sakla
    (host as any).__setA = setA;
    (host as any).__setB = setB;

    // Expensive calculation - sadece a veya b değiştiğinde yeniden hesaplanır
    const expensiveValue = useMemo(() => {
      console.log("Expensive calculation running...");
      return a * b * 1000;
    }, [a, b]);

    // Render count'u useEffect ile güncelle - sadece expensiveValue değiştiğinde
    useEffect(() => {
      setRenderCount((prev) => prev + 1);
    }, [expensiveValue]);

    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 1rem 0;
        }
        button {
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          border: 1px solid #f59e0b;
          background: #f59e0b;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <h3>useMemo Hook</h3>
      <p>A: <strong>${a}</strong> | B: <strong>${b}</strong></p>
      <p>Expensive Value: <strong>${expensiveValue}</strong></p>
      <p>Calculation ran: <strong>${renderCount}</strong> times</p>
      <button data-action="inc-a">Increment A</button>
      <button data-action="inc-b">Increment B</button>
    `;
  },
  mount({ root, on, host }) {
    on(root, "click", "[data-action='inc-a']", () => {
      // Hooks context'inden direkt setter'a eriş
      const hooks = (host as any).__hooks__;
      if (hooks?.hooks?.[0]?.setter) {
        // Functional update kullan
        hooks.hooks[0].setter((prev: number) => prev + 1);
      }
    });
    on(root, "click", "[data-action='inc-b']", () => {
      // Hooks context'inden direkt setter'a eriş
      const hooks = (host as any).__hooks__;
      if (hooks?.hooks?.[1]?.setter) {
        // Functional update kullan
        hooks.hooks[1].setter((prev: number) => prev + 1);
      }
    });
  },
});

// useCallback örneği
defineComponent("demo-use-callback", {
  render({ html }) {
    const [count] = useState(0);
    const [other] = useState(0);

    // Callback sadece count değiştiğinde yeniden oluşturulur (örnek amaçlı)
    useCallback(() => {
      // Callback örneği - gerçek kullanım mount'ta
    }, [count]);

    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 1rem 0;
        }
        button {
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          border: 1px solid #8b5cf6;
          background: #8b5cf6;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <h3>useCallback Hook</h3>
      <p>Count: <strong>${count}</strong></p>
      <p>Other: <strong>${other}</strong></p>
      <button data-action="inc-count-cb">Increment Count</button>
      <button data-action="inc-other">Increment Other</button>
      <p><small>Callback only recreates when count changes</small></p>
    `;
  },
  mount({ root, on, host }) {
    on(root, "click", "[data-action='inc-count-cb']", () => {
      // Hooks context'inden direkt setter'a eriş
      const hooks = (host as any).__hooks__;
      if (hooks?.hooks?.[0]?.setter) {
        // Functional update kullan
        hooks.hooks[0].setter((prev: number) => prev + 1);
      }
    });
    on(root, "click", "[data-action='inc-other']", () => {
      // Hooks context'inden direkt setter'a eriş
      const hooks = (host as any).__hooks__;
      if (hooks?.hooks?.[1]?.setter) {
        // Functional update kullan
        hooks.hooks[1].setter((prev: number) => prev + 1);
      }
    });
  },
});

// useReducer örneği
defineComponent("demo-use-reducer", {
  render({ html, host }) {
    type Action = { type: "increment" } | { type: "decrement" } | { type: "reset" };
    const reducer = (state: number, action: Action) => {
      switch (action.type) {
        case "increment":
          return state + 1;
        case "decrement":
          return state - 1;
        case "reset":
          return 0;
        default:
          return state;
      }
    };

    const [count, dispatch] = useReducer(reducer, 0);

    // Dispatch'i host üzerinde sakla
    (host as any).__dispatch = dispatch;

    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 1rem 0;
        }
        button {
          padding: 0.5rem 1rem;
          margin: 0.25rem;
          border: 1px solid #ec4899;
          background: #ec4899;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <h3>useReducer Hook</h3>
      <p>Count: <strong>${count}</strong></p>
      <button data-action="increment">+</button>
      <button data-action="decrement">-</button>
      <button data-action="reset">Reset</button>
    `;
  },
  mount({ root, on, host }) {
    on(root, "click", "[data-action='increment']", () => {
      // Hooks context'inden direkt dispatch'e eriş
      const hooks = (host as any).__hooks__;
      if (hooks?.hooks?.[0]?.dispatch) {
        hooks.hooks[0].dispatch({ type: "increment" });
      }
    });
    on(root, "click", "[data-action='decrement']", () => {
      // Hooks context'inden direkt dispatch'e eriş
      const hooks = (host as any).__hooks__;
      if (hooks?.hooks?.[0]?.dispatch) {
        hooks.hooks[0].dispatch({ type: "decrement" });
      }
    });
    on(root, "click", "[data-action='reset']", () => {
      // Hooks context'inden direkt dispatch'e eriş
      const hooks = (host as any).__hooks__;
      if (hooks?.hooks?.[0]?.dispatch) {
        hooks.hooks[0].dispatch({ type: "reset" });
      }
    });
  },
});
