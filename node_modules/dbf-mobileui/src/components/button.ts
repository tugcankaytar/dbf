import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";
import { baseStyles } from "../styles/shared";

const props = defineProps({
  variant: "string",
  disabled: "boolean",
} as const);

type ButtonProps = PropsFromSchema<typeof props>;

export function defineMobileButton() {
  defineComponent<Record<string, never>, ButtonProps>("dbf-mobile-button", {
    props,
    styles: [
      baseStyles,
      `
      :host {
        display: block;
        width: 100%;
      }

      button {
        width: 100%;
        padding: 12px 16px;
        border-radius: 12px;
        border: 1px solid transparent;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.05s ease, box-shadow 0.2s ease;
      }

      button.primary {
        background: #0f62fe;
        color: #ffffff;
        box-shadow: 0 8px 18px rgba(15, 98, 254, 0.25);
      }

      button.secondary {
        background: #ffffff;
        color: #0f172a;
        border-color: #d0d5dd;
      }

      button.ghost {
        background: #f8fafc;
        color: #0f172a;
      }

      button:active {
        transform: translateY(1px);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
      }
      `,
    ],
    render({ props, html }) {
      const variant = props.variant || "primary";
      const disabledAttr = props.disabled ? "disabled" : "";
      return html`<button class="${variant}" ${disabledAttr}><slot></slot></button>`;
    },
  });
}
