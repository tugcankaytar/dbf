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

/**
 * Controlled/Uncontrolled input davranışları
 * React-benzeri form input yönetimi
 */
/**
 * Input element'inin controlled mı uncontrolled mı olduğunu kontrol et
 */
declare function isControlledInput(element: HTMLElement): boolean;
/**
 * Controlled input için value'yu güncelle
 */
declare function updateControlledInput(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string | number | boolean): void;
/**
 * Input'un mevcut değerini al (controlled veya uncontrolled)
 */
declare function getInputValue(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string | boolean;
/**
 * Form element'lerini controlled/uncontrolled modda yönet
 */
declare function syncFormInputs(root: ShadowRoot | HTMLElement, controlledValues: Record<string, any>): void;

type GlobalErrorSource = "error" | "unhandledrejection";
interface GlobalErrorHandlerOptions {
    /**
     * Whether to show a small banner at the bottom of the page when a global
     * error occurs. Defaults to `true` in browser environments.
     */
    showBanner?: boolean;
    /**
     * Document or root element used to attach the banner.
     * Defaults to `document`.
     */
    root?: Document | HTMLElement;
    /**
     * Build the message shown in the banner.
     * By default a generic “something went wrong” message is used.
     */
    getMessage?(error: unknown, source: GlobalErrorSource): string;
}
/**
 * Installs global `error` and `unhandledrejection` handlers.
 *
 * This is an **optional helper** — libraries should not call it automatically.
 * Call it from your application entry point if you want a simple global error
 * banner + console logging.
 *
 * Returns a cleanup function that removes the installed handlers.
 */
declare function installGlobalErrorHandler(options?: GlobalErrorHandlerOptions): () => void;

/**
 * Error Boundary: Component tree'de hata yakalama ve fallback UI
 */

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo?: any;
}
interface ErrorBoundaryProps {
    fallback?: (error: Error, errorInfo?: any) => string;
    onError?: (error: Error, errorInfo?: any) => void;
}
/**
 * Error Boundary component base class
 */
declare abstract class ErrorBoundaryComponent extends DBFComponent<ErrorBoundaryState, ErrorBoundaryProps> {
    state: ErrorBoundaryState;
    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState>;
    componentDidCatch(error: Error, errorInfo: any): void;
    render(): void;
    abstract renderChildren(): void;
}
/**
 * Error Boundary helper: defineComponent ile kullanım için
 */
declare function createErrorBoundary(tag: string, options: {
    fallback?: (error: Error, errorInfo?: any) => string;
    onError?: (error: Error, errorInfo?: any) => void;
    render: (root: ShadowRoot) => void;
}): void;

/**
 * Basit bir i18n (internationalization) sistemi.
 * Kullanıcı dictionary'lerini register eder, dil değiştirir ve string'leri alır.
 */
type LanguageCode = string;
type Dictionary = Record<string, any>;
type Listener = (lang: LanguageCode) => void;
/**
 * i18n manager instance'ı
 */
declare class I18nManager {
    private dictionaries;
    private currentLang;
    private listeners;
    private defaultLang;
    /**
     * Bir dil için dictionary kaydet.
     * İlk kaydedilen dil otomatik olarak default ve current olur.
     */
    register(lang: LanguageCode, dict: Dictionary): void;
    /**
     * Mevcut dili al.
     */
    getLanguage(): LanguageCode;
    /**
     * Dili değiştir ve tüm listener'ları bilgilendir.
     */
    setLanguage(lang: LanguageCode): void;
    /**
     * Dil değişikliğini dinle. Cleanup fonksiyonu döner.
     */
    onLanguageChange(fn: Listener): () => void;
    /**
     * Mevcut dil için dictionary'yi al.
     */
    getStrings(): Dictionary;
    /**
     * Belirli bir dil için dictionary'yi al.
     */
    getStringsFor(lang: LanguageCode): Dictionary;
    /**
     * Kayıtlı tüm dilleri al.
     */
    getAvailableLanguages(): LanguageCode[];
}
declare const i18n: I18nManager;

/**
 * Convenience functions (global instance üzerinden)
 */
declare function registerLanguage(lang: LanguageCode, dict: Dictionary): void;
declare function getLanguage(): LanguageCode;
declare function setLanguage(lang: LanguageCode): void;
declare function onLanguageChange(fn: Listener): () => void;
declare function getStrings(): Dictionary;
declare function getStringsFor(lang: LanguageCode): Dictionary;
declare function getAvailableLanguages(): LanguageCode[];

/**
 * useState hook: Component state yönetimi
 */
declare function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];

/**
 * useEffect ve useLayoutEffect hooks: Side effect yönetimi
 */
declare function useEffect(effect: () => void | (() => void), deps?: any[]): void;
declare function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;

/**
 * useMemo hook: Hesaplanmış değerleri cache'leme
 */
declare function useMemo<T>(factory: () => T, deps?: any[]): T;

/**
 * useCallback hook: Fonksiyon referanslarını cache'leme
 */
declare function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T;

/**
 * useRef hook: Mutable ref değerleri
 */
declare function useRef<T>(initialValue: T): {
    current: T;
};

/**
 * useReducer hook: State yönetimi için reducer pattern
 */
type Reducer<S, A> = (state: S, action: A) => S;
declare function useReducer<S, A>(reducer: Reducer<S, A>, initialState: S): [S, (action: A) => void];
declare function useReducer<S, A>(reducer: Reducer<S, A>, initialState: S, init?: (initialState: S) => S): [S, (action: A) => void];

/**
 * Context oluştur
 */
declare function createContext<T>(defaultValue: T): {
    _id: symbol;
    _defaultValue: T;
};
type Context<T> = ReturnType<typeof createContext<T>>;
/**
 * useContext hook: Context değerini okur
 */
declare function useContext<T>(context: Context<T>): T;
/**
 * Context value'yu bir element'e bağla (Provider gibi)
 * Update fonksiyonunu döndürür
 */
declare function provideContext<T>(host: HTMLElement, context: Context<T>, value: T): (newValue: T) => void;

export { type Context, DBFComponent, ErrorBoundaryComponent, type ErrorBoundaryProps, type ErrorBoundaryState, type GlobalErrorHandlerOptions, type GlobalErrorSource, type LanguageCode, type PropSchema, type PropType, type PropsFromSchema, type Reducer, createContext, createErrorBoundary, define, defineComponent, defineProps, getAvailableLanguages, getInputValue, getLanguage, getStrings, getStringsFor, html, i18n, installGlobalErrorHandler, isControlledInput, on, onLanguageChange, parseProp, provideContext, registerLanguage, render, setLanguage, syncFormInputs, updateControlledInput, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState };
