import { schedule } from "../internal/scheduler";
import type { PropSchema } from "./props";
import { parseProp } from "./props";
import { startRender, endRender, cleanupHooks } from "../hooks/dispatcher";

/**
 * React benzeri bir temel component sınıfı.
 * - State yönetimi (`setState`)
 * - Attribute tabanlı props okuma
 * - Basit bir render scheduler
 */
export abstract class DBFComponent<
  S extends Record<string, any> = Record<string, any>,
  P extends Record<string, any> = Record<string, any>
> extends HTMLElement {
  /**
   * Kullanıcı tarafında override edilebilen props şeması.
   * Örn:
   *   static props = { initial: "number" } as const;
   */
  static props?: PropSchema;

  /**
   * HTML attribute -> props eşlemesini otomatik takip etmek için
   * props şemasındaki key'leri observedAttributes olarak döndürür.
   */
  static get observedAttributes(): string[] {
    const schema = (this as any).props as PropSchema | undefined;
    return schema ? Object.keys(schema) : [];
  }

  /** Çözümlenmiş props değerleri */
  props!: P;

  /** Component state'i */
  state!: S;

  protected root: ShadowRoot;

  private _queued = false;
  private _isMounted = false;
  private _isFirstRender = true;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.props = this._readProps() as P;
    // Kullanıcı state için başlangıç değeri vermezse boş obje ile başlat.
    if (this.state == null) {
      this.state = {} as S;
    }
  }

  /**
   * Attribute'ları static props şemasına göre çözümler.
   */
  private _readProps(): Record<string, any> {
    const ctor = this.constructor as typeof DBFComponent;
    const schema = (ctor as any).props as PropSchema | undefined;
    if (!schema) return {};

    const out: Record<string, any> = {};
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
    this.props = this._readProps() as P;
    if (this._isMounted) {
      this.propsChanged(prevProps, this.props);
    }
  }

  /**
   * Props değiştiğinde tetiklenen hook. Varsayılan olarak sadece invalidate eder.
   * Kullanıcı isterse override edebilir.
   */
  protected propsChanged(_prev: P, _next: P) {
    this.invalidate();
  }

  /**
   * Merge partial state or compute it from the previous state.
   */
  setState(patch: Partial<S> | ((prev: S) => Partial<S>)) {
    const nextPatch = typeof patch === "function" ? patch(this.state) : patch;
    this.state = { ...(this.state as any), ...(nextPatch as any) };
    this.invalidate();
  }

  /**
   * Kullanıcı `shouldRender` override ederek
   * gereksiz render'ları atlayabilir.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected shouldRender(_prevState: S, _nextState: S): boolean {
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

      // Hooks render başlangıcı
      startRender(this);
      (globalThis as any).__DBF_CURRENT_COMPONENT__ = this;

      try {
        this.render();
      } finally {
        // Hooks render bitişi (effect'leri çalıştır)
        endRender(this);
        (globalThis as any).__DBF_CURRENT_COMPONENT__ = undefined;
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
    // Hooks cleanup
    cleanupHooks(this);
  }

  /** Lifecycle hook'ları. Kullanıcı isterse override eder. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected componentDidMount(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected componentDidUpdate(_prevState: S, _nextState: S): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected componentWillUnmount(): void {}

  /** Kullanıcı implement etmek zorunda. */
  abstract render(): void;
}
