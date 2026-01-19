import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";
import { baseStyles } from "../styles/shared";

const props = defineProps({
  label: "string",
  placeholder: "string",
  value: "string",
  type: "string",
} as const);

type InputProps = PropsFromSchema<typeof props>;

export function defineMobileInput() {
  defineComponent<Record<string, never>, InputProps>("dbf-mobile-input", {
    props,
    styles: [
      baseStyles,
      `
      :host {
        display: block;
      }

      label {
        display: block;
        font-size: 0.85rem;
        color: #475467;
        margin-bottom: 6px;
      }

      input {
        width: 100%;
        padding: 12px 14px;
        border-radius: 12px;
        border: 1px solid #d0d5dd;
        font-size: 0.95rem;
        outline: none;
      }

      input:focus {
        border-color: #0f62fe;
        box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.2);
      }
      `,
    ],
    render({ props, html }) {
      const label = props.label ? html`<label>${props.label}</label>` : "";
      const type = props.type || "text";
      const placeholder = props.placeholder || "";
      const value = props.value || "";
      return html`${label}<input type="${type}" placeholder="${placeholder}" value="${value}" />`;
    },
    mount({ root, on, host }) {
      on(root, "input", "input", (ev) => {
        const target = ev.target as HTMLInputElement | null;
        const value = target?.value ?? "";
        host.dispatchEvent(
          new CustomEvent("value-change", {
            detail: { value },
            bubbles: true,
            composed: true,
          })
        );
      });
    },
  });
}
