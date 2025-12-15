import { DBFComponent } from "./Component";
import type { PropSchema } from "./props";
import { define } from "./define";
import { html } from "../dom/html";
import { render } from "../dom/render";
import { on } from "../events/on";

type StateObj = Record<string, any>;
type PropsObj = Record<string, any>;

export interface ComponentRenderCtx<S extends StateObj, P extends PropsObj> {
  state: S;
  props: P;
  html: typeof html;
  host: DBFComponent<S, P>;
}

export interface ComponentMountCtx<S extends StateObj, P extends PropsObj> {
  root: ShadowRoot;
  on: typeof on;
  state: S;
  props: P;
  setState(patch: Partial<S>): void;
  host: DBFComponent<S, P>;
}

export interface DefineComponentOptions<
  S extends StateObj = StateObj,
  P extends PropsObj = PropsObj
> {
  /** Attribute -> props şeması */
  props?: PropSchema;
  /** Başlangıç state'i */
  state?: () => S;
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
export function defineComponent<
  S extends StateObj = StateObj,
  P extends PropsObj = PropsObj
>(tag: string, options: DefineComponentOptions<S, P>): void {
  class Impl extends DBFComponent<S, P> {
    static props: PropSchema | undefined = options.props;

    state: S = (options.state ? options.state() : ({} as S));

    protected override componentDidMount(): void {
      options.mount?.({
        root: this.root,
        on,
        state: this.state,
        props: this.props,
        setState: (patch) => this.setState(patch),
        host: this,
      });
    }

    render(): void {
      const tpl = options.render({
        state: this.state,
        props: this.props,
        html,
        host: this,
      });
      render(this.root, tpl);
    }
  }

  define(tag, Impl);
}


