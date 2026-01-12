// src/internal/scheduler.ts
var scheduledTasks = /* @__PURE__ */ new Set();
var isScheduled = false;
function schedule(fn) {
  scheduledTasks.add(fn);
  if (!isScheduled) {
    isScheduled = true;
    queueMicrotask(() => {
      const tasks = Array.from(scheduledTasks);
      scheduledTasks.clear();
      isScheduled = false;
      for (const task of tasks) {
        try {
          task();
        } catch (error) {
          console.error("[dbf-core:scheduler] Task error:", error);
        }
      }
    });
  }
}

// src/component/props.ts
function parseProp(type, raw) {
  if (type === "boolean") return raw !== null && raw !== "false";
  if (raw === null) return type === "number" ? 0 : type === "json" ? null : "";
  if (type === "number") return Number(raw);
  if (type === "json") return JSON.parse(raw);
  return raw;
}
function defineProps(schema) {
  return schema;
}

// src/hooks/dispatcher.ts
var hooksMap = /* @__PURE__ */ new WeakMap();
function getHooksContext(component) {
  let ctx = hooksMap.get(component);
  if (!ctx) {
    ctx = {
      hooks: [],
      currentIndex: 0,
      component,
      isRendering: false
    };
    hooksMap.set(component, ctx);
  }
  component.__hooks__ = ctx;
  return ctx;
}
function startRender(component) {
  const ctx = getHooksContext(component);
  ctx.currentIndex = 0;
  ctx.isRendering = true;
}
function endRender(component) {
  const ctx = getHooksContext(component);
  ctx.isRendering = false;
  for (const hook of ctx.hooks) {
    if (hook.type === "effect") {
      const effectHook = hook;
      if (effectHook._shouldRun) {
        if (effectHook.cleanup) {
          try {
            effectHook.cleanup();
          } catch (error) {
            console.error("[dbf-core:hooks] Effect cleanup error:", error);
          }
        }
        try {
          const cleanup = effectHook.effect();
          effectHook.cleanup = typeof cleanup === "function" ? cleanup : void 0;
        } catch (error) {
          console.error("[dbf-core:hooks] Effect error:", error);
        }
        effectHook._shouldRun = false;
      }
    }
  }
}
function getCurrentHook(component, factory) {
  const ctx = getHooksContext(component);
  if (!ctx.isRendering) {
    throw new Error(
      "[dbf-core:hooks] Hooks can only be called during component render or mount phase"
    );
  }
  const index = ctx.currentIndex;
  ctx.currentIndex++;
  if (index < ctx.hooks.length) {
    const existing = ctx.hooks[index];
    if (existing.type !== factory().type) {
      throw new Error(
        `[dbf-core:hooks] Hook type mismatch at index ${index}. Expected ${factory().type}, got ${existing.type}`
      );
    }
    return existing;
  }
  const newHook = factory();
  newHook.id = index;
  ctx.hooks.push(newHook);
  return newHook;
}
function cleanupHooks(component) {
  const ctx = hooksMap.get(component);
  if (!ctx) return;
  for (const hook of ctx.hooks) {
    if (hook.type === "effect" && hook.cleanup) {
      try {
        hook.cleanup();
      } catch (error) {
        console.error("[dbf-core:hooks] Cleanup error on unmount:", error);
      }
    }
  }
  hooksMap.delete(component);
}

// src/component/Component.ts
var DBFComponent = class extends HTMLElement {
  /**
   * Kullanıcı tarafında override edilebilen props şeması.
   * Örn:
   *   static props = { initial: "number" } as const;
   */
  static props;
  /**
   * HTML attribute -> props eşlemesini otomatik takip etmek için
   * props şemasındaki key'leri observedAttributes olarak döndürür.
   */
  static get observedAttributes() {
    const schema = this.props;
    return schema ? Object.keys(schema) : [];
  }
  /** Çözümlenmiş props değerleri */
  props;
  /** Component state'i */
  state;
  root;
  _queued = false;
  _isMounted = false;
  _isFirstRender = true;
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.props = this._readProps();
    if (this.state == null) {
      this.state = {};
    }
  }
  /**
   * Attribute'ları static props şemasına göre çözümler.
   */
  _readProps() {
    const ctor = this.constructor;
    const schema = ctor.props;
    if (!schema) return {};
    const out = {};
    for (const [key, type] of Object.entries(schema)) {
      const raw = this.getAttribute(key);
      out[key] = parseProp(type, raw);
    }
    return out;
  }
  /**
   * Dışarıdan attribute değiştiğinde props'u yeniden oku ve gerekirse yeniden render et.
   */
  attributeChangedCallback() {
    const prevProps = this.props;
    this.props = this._readProps();
    if (this._isMounted) {
      this.propsChanged(prevProps, this.props);
    }
  }
  /**
   * Props değiştiğinde tetiklenen hook. Varsayılan olarak sadece invalidate eder.
   * Kullanıcı isterse override edebilir.
   */
  propsChanged(_prev, _next) {
    this.invalidate();
  }
  setState(patch) {
    this.state = { ...this.state, ...patch };
    this.invalidate();
  }
  /**
   * Kullanıcı `shouldRender` override ederek
   * gereksiz render'ları atlayabilir.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldRender(_prevState, _nextState) {
    return true;
  }
  invalidate() {
    if (this._queued) return;
    this._queued = true;
    const prevState = this.state;
    schedule(() => {
      this._queued = false;
      const nextState = this.state;
      if (!this.shouldRender(prevState, nextState)) {
        return;
      }
      const isFirst = this._isFirstRender;
      this._isFirstRender = false;
      startRender(this);
      globalThis.__DBF_CURRENT_COMPONENT__ = this;
      try {
        this.render();
      } finally {
        endRender(this);
        globalThis.__DBF_CURRENT_COMPONENT__ = void 0;
      }
      if (!this._isMounted) return;
      if (isFirst) {
        this.componentDidMount();
      } else {
        this.componentDidUpdate(prevState, nextState);
      }
    });
  }
  connectedCallback() {
    this._isMounted = true;
    this.invalidate();
  }
  disconnectedCallback() {
    this._isMounted = false;
    this.componentWillUnmount();
    cleanupHooks(this);
  }
  /** Lifecycle hook'ları. Kullanıcı isterse override eder. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidMount() {
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidUpdate(_prevState, _nextState) {
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentWillUnmount() {
  }
};

// src/internal/invariant.ts
function invariant(cond, msg) {
  if (!cond) throw new Error(`[dbf-core] ${msg}`);
}

// src/component/define.ts
function define(tag, ctor) {
  invariant(tag.includes("-"), "Custom element tag must contain '-' (e.g. 'dbf-counter').");
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

// src/dom/html.ts
function html(strings, ...values) {
  let out = "";
  for (let i = 0; i < strings.length; i++)
    out += strings[i] + (values[i] ?? "");
  return out;
}

// src/dom/render.ts
function render(root, tpl) {
  root.innerHTML = tpl;
}

// src/events/on.ts
function on(root, eventName, selector, handler) {
  root.addEventListener(eventName, (ev) => {
    const target = ev.target;
    const el = target?.closest?.(selector);
    if (!el) return;
    handler(ev, el);
  });
}

// src/component/defineComponent.ts
function defineComponent(tag, options) {
  const stylesPrefix = options.styles == null ? "" : Array.isArray(options.styles) ? options.styles.join("\n") : options.styles;
  class Impl extends DBFComponent {
    static props = options.props;
    state = options.state ? options.state() : {};
    componentDidMount() {
      options.mount?.({
        root: this.root,
        on,
        state: this.state,
        props: this.props,
        setState: (patch) => this.setState(patch),
        host: this
      });
    }
    render() {
      const body = options.render({
        state: this.state,
        props: this.props,
        html,
        host: this
      });
      const tpl = stylesPrefix && !body.includes("<style") ? `<style>${stylesPrefix}</style>${body}` : stylesPrefix ? `<style>${stylesPrefix}</style>${body}` : body;
      render(this.root, tpl);
    }
  }
  define(tag, Impl);
}

// src/dom/controlled.ts
function isControlledInput(element) {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
    return false;
  }
  return element.hasAttribute("value") || element.hasAttribute("checked");
}
function updateControlledInput(element, value) {
  if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox" || element.type === "radio") {
      element.checked = Boolean(value);
    } else {
      element.value = String(value);
    }
  } else if (element instanceof HTMLTextAreaElement) {
    element.value = String(value);
  } else if (element instanceof HTMLSelectElement) {
    element.value = String(value);
  }
}
function getInputValue(element) {
  if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox" || element.type === "radio") {
      return element.checked;
    }
    return element.value;
  }
  return element.value;
}
function syncFormInputs(root, controlledValues) {
  const inputs = root.querySelectorAll(
    "input, textarea, select"
  );
  for (const input of inputs) {
    const name = input.name || input.id;
    if (name && controlledValues[name] !== void 0) {
      updateControlledInput(input, controlledValues[name]);
    }
  }
}

// src/errors/global.ts
var DEFAULT_BANNER_ID = "dbf-core-global-error-banner";
function resolveDocument(root) {
  if (typeof window === "undefined") return null;
  if (!root) return window.document;
  if (root instanceof window.Document) return root;
  return root.ownerDocument ?? window.document;
}
function ensureBanner(doc, id) {
  let el = doc.querySelector(`#${id}`);
  if (el) return el;
  el = doc.createElement("div");
  el.id = id;
  el.style.position = "fixed";
  el.style.insetInline = "0";
  el.style.bottom = "0";
  el.style.zIndex = "9999";
  el.style.padding = "0.75rem 1.5rem";
  el.style.display = "flex";
  el.style.justifyContent = "space-between";
  el.style.alignItems = "center";
  el.style.gap = "0.75rem";
  el.style.background = "rgba(127, 29, 29, 0.95)";
  el.style.color = "#fee2e2";
  el.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  el.style.fontSize = "0.9rem";
  const msg = doc.createElement("span");
  msg.id = `${id}-message`;
  const closeBtn = doc.createElement("button");
  closeBtn.textContent = "Dismiss";
  closeBtn.style.border = "1px solid rgba(248, 250, 252, 0.4)";
  closeBtn.style.borderRadius = "999px";
  closeBtn.style.padding = "0.35rem 0.9rem";
  closeBtn.style.background = "transparent";
  closeBtn.style.color = "inherit";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = () => {
    el?.remove();
  };
  el.append(msg, closeBtn);
  doc.body.appendChild(el);
  return el;
}
function showBannerMessage(doc, message, id = DEFAULT_BANNER_ID) {
  const banner = ensureBanner(doc, id);
  const msg = banner.querySelector(`#${id}-message`);
  if (msg) msg.textContent = message;
}
function installGlobalErrorHandler(options = {}) {
  if (typeof window === "undefined") {
    return () => {
    };
  }
  const doc = resolveDocument(options.root);
  const showBanner = options.showBanner ?? true;
  const getMessage = options.getMessage ?? ((_error, _source) => "Something went wrong. Please check the console for details.");
  const onError = (event) => {
    console.error("[dbf-core] Uncaught error:", event.error ?? event.message);
    if (doc && showBanner) {
      showBannerMessage(doc, getMessage(event.error ?? event.message, "error"));
    }
  };
  const onUnhandledRejection = (event) => {
    console.error("[dbf-core] Unhandled promise rejection:", event.reason);
    if (doc && showBanner) {
      showBannerMessage(
        doc,
        getMessage(event.reason, "unhandledrejection")
      );
    }
  };
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
  };
}

// src/errors/ErrorBoundary.ts
var ErrorBoundaryComponent = class extends DBFComponent {
  state = {
    hasError: false,
    error: null
  };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error("[dbf-core:ErrorBoundary] Caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError && this.state.error) {
      const fallback = this.props.fallback || defaultFallback;
      const fallbackHtml = fallback(this.state.error, this.state.errorInfo);
      render(this.root, html`${fallbackHtml}`);
      return;
    }
    this.renderChildren();
  }
};
function defaultFallback(error, _errorInfo) {
  return html`
    <style>
      :host {
        display: block;
        padding: 1rem;
        border: 2px solid #ef4444;
        border-radius: 0.5rem;
        background: #fef2f2;
        color: #991b1b;
      }
      h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
      }
      pre {
        margin: 0.5rem 0 0 0;
        padding: 0.75rem;
        background: #fee2e2;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        overflow-x: auto;
      }
    </style>
    <h2>Something went wrong</h2>
    <pre>${error.message}\n${error.stack || ""}</pre>
  `;
}
function createErrorBoundary(tag, options) {
  class ErrorBoundaryImpl extends ErrorBoundaryComponent {
    renderChildren() {
      try {
        options.render(this.root);
      } catch (error) {
        this.setState({
          hasError: true,
          error: error instanceof Error ? error : new Error(String(error))
        });
      }
    }
  }
  ErrorBoundaryImpl.prototype.componentDidCatch = function(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    if (options.onError) {
      options.onError(error, errorInfo);
    }
    console.error("[dbf-core:ErrorBoundary] Caught error:", error, errorInfo);
  };
  define(tag, ErrorBoundaryImpl);
}

// src/i18n/i18n.ts
var I18nManager = class {
  dictionaries = /* @__PURE__ */ new Map();
  currentLang = "";
  listeners = /* @__PURE__ */ new Set();
  defaultLang = "";
  /**
   * Bir dil için dictionary kaydet.
   * İlk kaydedilen dil otomatik olarak default ve current olur.
   */
  register(lang, dict) {
    this.dictionaries.set(lang, dict);
    if (!this.defaultLang) {
      this.defaultLang = lang;
      this.currentLang = lang;
    }
  }
  /**
   * Mevcut dili al.
   */
  getLanguage() {
    return this.currentLang || this.defaultLang;
  }
  /**
   * Dili değiştir ve tüm listener'ları bilgilendir.
   */
  setLanguage(lang) {
    if (!this.dictionaries.has(lang)) {
      console.warn(`[dbf-core:i18n] Language "${lang}" not registered.`);
      return;
    }
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    this.listeners.forEach((fn) => fn(lang));
  }
  /**
   * Dil değişikliğini dinle. Cleanup fonksiyonu döner.
   */
  onLanguageChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  /**
   * Mevcut dil için dictionary'yi al.
   */
  getStrings() {
    const lang = this.getLanguage();
    const dict = this.dictionaries.get(lang);
    if (!dict) {
      console.warn(`[dbf-core:i18n] No dictionary for language "${lang}".`);
      return {};
    }
    return dict;
  }
  /**
   * Belirli bir dil için dictionary'yi al.
   */
  getStringsFor(lang) {
    const dict = this.dictionaries.get(lang);
    if (!dict) {
      console.warn(`[dbf-core:i18n] No dictionary for language "${lang}".`);
      return {};
    }
    return dict;
  }
  /**
   * Kayıtlı tüm dilleri al.
   */
  getAvailableLanguages() {
    return Array.from(this.dictionaries.keys());
  }
};
var i18n = new I18nManager();
function registerLanguage(lang, dict) {
  i18n.register(lang, dict);
}
function getLanguage() {
  return i18n.getLanguage();
}
function setLanguage(lang) {
  i18n.setLanguage(lang);
}
function onLanguageChange(fn) {
  return i18n.onLanguageChange(fn);
}
function getStrings() {
  return i18n.getStrings();
}
function getStringsFor(lang) {
  return i18n.getStringsFor(lang);
}
function getAvailableLanguages() {
  return i18n.getAvailableLanguages();
}

// src/hooks/useState.ts
function useState(initialValue) {
  const component = globalThis.__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useState] useState can only be called inside a component");
  }
  const hook = getCurrentHook(component, () => {
    const value = typeof initialValue === "function" ? initialValue() : initialValue;
    return {
      type: "state",
      id: -1,
      // dispatcher set edecek
      value,
      setter: (newValue) => {
        const ctx = getHooksContext(component);
        const stateHook = ctx.hooks[hook.id];
        const prevValue = stateHook.value;
        const nextValue = typeof newValue === "function" ? newValue(prevValue) : newValue;
        if (Object.is(prevValue, nextValue)) {
          return;
        }
        stateHook.value = nextValue;
        if (component.invalidate) {
          component.invalidate();
        }
      }
    };
  });
  return [hook.value, hook.setter];
}

// src/hooks/useEffect.ts
function shallowEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}
function createEffectHook(effect, deps, layout) {
  return {
    type: "effect",
    id: -1,
    // dispatcher set edecek
    effect,
    deps,
    layout
  };
}
function useEffect(effect, deps) {
  const component = globalThis.__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useEffect] useEffect can only be called inside a component");
  }
  const hook = getCurrentHook(component, () => createEffectHook(effect, deps, false));
  let shouldRun = false;
  if (hook.deps === void 0 && deps === void 0) {
    shouldRun = true;
  } else if (hook.deps === void 0 || deps === void 0) {
    shouldRun = true;
  } else if (!shallowEqual(hook.deps, deps)) {
    shouldRun = true;
  }
  if (shouldRun) {
    hook.effect = effect;
    hook.deps = deps;
    hook._shouldRun = true;
  } else {
    hook._shouldRun = false;
  }
}
function useLayoutEffect(effect, deps) {
  const component = globalThis.__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useLayoutEffect] useLayoutEffect can only be called inside a component");
  }
  const hook = getCurrentHook(component, () => createEffectHook(effect, deps, true));
  let shouldRun = false;
  if (hook.deps === void 0 && deps === void 0) {
    shouldRun = true;
  } else if (hook.deps === void 0 || deps === void 0) {
    shouldRun = true;
  } else if (!shallowEqual(hook.deps, deps)) {
    shouldRun = true;
  }
  if (shouldRun) {
    hook.effect = effect;
    hook.deps = deps;
    hook._shouldRun = true;
  } else {
    hook._shouldRun = false;
  }
}

// src/hooks/useMemo.ts
function shallowEqual2(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}
function useMemo(factory, deps) {
  const component = globalThis.__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useMemo] useMemo can only be called inside a component");
  }
  const hook = getCurrentHook(component, () => ({
    type: "memo",
    id: -1,
    value: factory(),
    deps,
    factory
  }));
  if (hook.deps !== void 0 && deps !== void 0) {
    if (shallowEqual2(hook.deps, deps)) {
      return hook.value;
    }
  } else if (hook.deps === deps) {
    return hook.value;
  }
  hook.value = factory();
  hook.deps = deps;
  hook.factory = factory;
  return hook.value;
}

// src/hooks/useCallback.ts
function shallowEqual3(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}
function useCallback(callback, deps) {
  const component = globalThis.__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useCallback] useCallback can only be called inside a component");
  }
  const hook = getCurrentHook(component, () => ({
    type: "callback",
    id: -1,
    callback,
    deps,
    factory: () => callback
  }));
  if (hook.deps !== void 0 && deps !== void 0) {
    if (shallowEqual3(hook.deps, deps)) {
      return hook.callback;
    }
  } else if (hook.deps === deps) {
    return hook.callback;
  }
  hook.callback = callback;
  hook.deps = deps;
  hook.factory = () => callback;
  return hook.callback;
}

// src/hooks/useRef.ts
function useRef(initialValue) {
  const component = globalThis.__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useRef] useRef can only be called inside a component");
  }
  const hook = getCurrentHook(component, () => ({
    type: "ref",
    id: -1,
    current: initialValue,
    initialValue
  }));
  return { current: hook.current };
}

// src/hooks/useReducer.ts
function useReducer(reducer, initialState, init) {
  const component = globalThis.__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useReducer] useReducer can only be called inside a component");
  }
  const hook = getCurrentHook(component, () => {
    const initial = init ? init(initialState) : initialState;
    return {
      type: "reducer",
      id: -1,
      state: initial,
      reducer,
      dispatch: (action) => {
        const ctx = getHooksContext(component);
        const reducerHook = ctx.hooks[hook.id];
        const nextState = reducerHook.reducer(reducerHook.state, action);
        if (Object.is(reducerHook.state, nextState)) {
          return;
        }
        reducerHook.state = nextState;
        if (component.invalidate) {
          component.invalidate();
        }
      }
    };
  });
  return [hook.state, hook.dispatch];
}

// src/context/Context.ts
var contextStore = /* @__PURE__ */ new WeakMap();
function createContext(defaultValue) {
  const contextId = /* @__PURE__ */ Symbol("dbf-context");
  return {
    _id: contextId,
    _defaultValue: defaultValue
  };
}
function useContext(context) {
  const component = globalThis.__DBF_CURRENT_COMPONENT__;
  if (!component) {
    throw new Error("[dbf-core:useContext] useContext can only be called inside a component");
  }
  let current = component;
  while (current) {
    const store = contextStore.get(current);
    if (store) {
      const contextValue = store.get(context._id);
      if (contextValue) {
        const listener = () => {
          if (component.invalidate) {
            component.invalidate();
          }
        };
        contextValue.listeners.add(listener);
        const originalUnmount = component.componentWillUnmount;
        component.componentWillUnmount = function() {
          contextValue.listeners.delete(listener);
          if (originalUnmount) {
            originalUnmount.call(this);
          }
        };
        return contextValue.value;
      }
    }
    const root = current.getRootNode?.();
    current = root?.host || current.parentElement;
  }
  return context._defaultValue;
}
function provideContext(host, context, value) {
  let store = contextStore.get(host);
  if (!store) {
    store = /* @__PURE__ */ new Map();
    contextStore.set(host, store);
  }
  const contextValue = {
    value,
    listeners: /* @__PURE__ */ new Set()
  };
  store.set(context._id, contextValue);
  const updateValue = (newValue) => {
    if (newValue !== contextValue.value) {
      contextValue.value = newValue;
      contextValue.listeners.forEach((fn) => fn());
    }
  };
  return updateValue;
}
export {
  DBFComponent,
  ErrorBoundaryComponent,
  createContext,
  createErrorBoundary,
  define,
  defineComponent,
  defineProps,
  getAvailableLanguages,
  getInputValue,
  getLanguage,
  getStrings,
  getStringsFor,
  html,
  i18n,
  installGlobalErrorHandler,
  isControlledInput,
  on,
  onLanguageChange,
  parseProp,
  provideContext,
  registerLanguage,
  render,
  setLanguage,
  syncFormInputs,
  updateControlledInput,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState
};
