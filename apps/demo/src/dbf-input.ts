import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";
import inputStyles from "./dbf-input.css?inline";

const inputProps = defineProps({
  placeholder: "string",
  type: "string",
} as const);

type InputProps = PropsFromSchema<typeof inputProps>;

defineComponent<never, InputProps>("dbf-input", {
  // <dbf-input placeholder="Adınızı girin"> gibi kullanımı destekler
  props: inputProps,

  /*mount({ root, on, setState, host }) {
    // Shadow root içindeki <input> için input event'ini dinle
    on(root, "input", "input", (_ev, el) => {
      const input = el as HTMLInputElement;
      const value = input.value;
      setState({ value });

      // Dışarıya controlled input gibi davranması için custom event gönder
      host.dispatchEvent(
        new CustomEvent("change", {
          detail: { value },
          bubbles: true,
          composed: true,
        })
      );
    });
  },*/

  styles: inputStyles,

  render({ props, html }) {
    const placeholder = props.placeholder ?? "Type something...";

    return html`
      <label>
        <input type="${props.type ?? "text"}" placeholder="${placeholder}" />
      </label>
    `;
  },
});

