"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DBFComponent: () => DBFComponent,
  define: () => define,
  defineComponent: () => defineComponent,
  html: () => html,
  on: () => on,
  parseProp: () => parseProp,
  render: () => render
});
module.exports = __toCommonJS(index_exports);

// src/internal/scheduler.ts
function schedule(fn) {
  queueMicrotask(fn);
}

// src/component/props.ts
function parseProp(type, raw) {
  if (type === "boolean") return raw !== null && raw !== "false";
  if (raw === null) return type === "number" ? 0 : type === "json" ? null : "";
  if (type === "number") return Number(raw);
  if (type === "json") return JSON.parse(raw);
  return raw;
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
      this.render();
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
  for (let i = 0; i < strings.length; i++) out += strings[i] + (values[i] ?? "");
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
      const tpl = options.render({
        state: this.state,
        props: this.props,
        html,
        host: this
      });
      render(this.root, tpl);
    }
  }
  define(tag, Impl);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DBFComponent,
  define,
  defineComponent,
  html,
  on,
  parseProp,
  render
});
