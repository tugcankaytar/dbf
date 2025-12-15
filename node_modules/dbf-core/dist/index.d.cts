type PropType = "string" | "number" | "boolean" | "json";
type PropSchema = Record<string, PropType>;
declare function parseProp(type: PropType, raw: string | null): any;
type PropValueFromType<T extends PropType> = T extends "string" ? string : T extends "number" ? number : T extends "boolean" ? boolean : any;
/**
 * Verilen prop şemasından TypeScript tipi üretir.
 *
 * const schema = { label: "string", count: "number" } as const;
 * type Props = PropsFromSchema<typeof schema>;
 */
type PropsFromSchema<S extends PropSchema> = {
    [K in keyof S]: PropValueFromType<S[K]>;
};
/**
 * Props şemasını tek yerde tanımlayıp hem runtime hem de type-safe kullanmak için helper.
 *
 * const props = defineProps({
 *   label: "string",
 *   count: "number",
 * } as const);
 *
 * type Props = PropsFromSchema<typeof props>;
 */
declare function defineProps<S extends PropSchema>(schema: S): S;

/**
 * React benzeri bir temel component sınıfı.
 * - State yönetimi (`setState`)
 * - Attribute tabanlı props okuma
 * - Basit bir render scheduler
 */
declare abstract class DBFComponent<S extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>> extends HTMLElement {
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
    static get observedAttributes(): string[];
    /** Çözümlenmiş props değerleri */
    props: P;
    /** Component state'i */
    state: S;
    protected root: ShadowRoot;
    private _queued;
    private _isMounted;
    private _isFirstRender;
    constructor();
    /**
     * Attribute'ları static props şemasına göre çözümler.
     */
    private _readProps;
    /**
     * Dışarıdan attribute değiştiğinde props'u yeniden oku ve gerekirse yeniden render et.
     */
    attributeChangedCallback(): void;
    /**
     * Props değiştiğinde tetiklenen hook. Varsayılan olarak sadece invalidate eder.
     * Kullanıcı isterse override edebilir.
     */
    protected propsChanged(_prev: P, _next: P): void;
    setState(patch: Partial<S>): void;
    /**
     * Kullanıcı `shouldRender` override ederek
     * gereksiz render'ları atlayabilir.
     */
    protected shouldRender(_prevState: S, _nextState: S): boolean;
    invalidate(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Lifecycle hook'ları. Kullanıcı isterse override eder. */
    protected componentDidMount(): void;
    protected componentDidUpdate(_prevState: S, _nextState: S): void;
    protected componentWillUnmount(): void;
    /** Kullanıcı implement etmek zorunda. */
    abstract render(): void;
}

declare function define(tag: string, ctor: CustomElementConstructor): void;

declare function html(strings: TemplateStringsArray, ...values: any[]): string;

declare function on(root: ShadowRoot | HTMLElement, eventName: string, selector: string, handler: (ev: Event, el: Element) => void): void;

type StateObj = Record<string, any>;
type PropsObj = Record<string, any>;
interface ComponentRenderCtx<S extends StateObj, P extends PropsObj> {
    state: S;
    props: P;
    html: typeof html;
    host: DBFComponent<S, P>;
}
interface ComponentMountCtx<S extends StateObj, P extends PropsObj> {
    root: ShadowRoot;
    on: typeof on;
    state: S;
    props: P;
    setState(patch: Partial<S>): void;
    host: DBFComponent<S, P>;
}
interface DefineComponentOptions<S extends StateObj = StateObj, P extends PropsObj = PropsObj> {
    /** Attribute -> props şeması */
    props?: PropSchema;
    /** Başlangıç state'i */
    state?: () => S;
    /**
     * Shadow root'a her render'da en başta eklenecek sabit stil(ler).
     * Örn: import styles from "./my-comp.css?inline"; styles: styles
     */
    styles?: string | string[];
    /** Her render'da çalışacak template fonksiyonu */
    render(ctx: ComponentRenderCtx<S, P>): string;
    /** İlk mount'ta (event bağlama vs) çalışacak opsiyonel hook */
    mount?(ctx: ComponentMountCtx<S, P>): void;
}
/**
 * Kullanıcı dostu component tanımlama helper'ı.
 *
 * Örnek:
 * defineComponent("dbf-input", {
 *   props: { placeholder: "string" },
 *   state: () => ({ value: "" }),
 *   render({ state, props, html }) { ... },
 *   mount({ root, on, setState }) { ... },
 * });
 */
declare function defineComponent<S extends StateObj = StateObj, P extends PropsObj = PropsObj>(tag: string, options: DefineComponentOptions<S, P>): void;

declare function render(root: ShadowRoot | HTMLElement, tpl: string): void;

export { DBFComponent, type PropSchema, type PropType, type PropsFromSchema, define, defineComponent, defineProps, html, on, parseProp, render };
