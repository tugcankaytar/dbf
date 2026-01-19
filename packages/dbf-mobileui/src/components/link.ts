import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";
import { baseStyles } from "../styles/shared";

const props = defineProps({
  href: "string",
  variant: "string",
} as const);

type LinkProps = PropsFromSchema<typeof props>;

export function defineMobileLink() {
  defineComponent<Record<string, never>, LinkProps>("dbf-mobile-link", {
    props,
    styles: [
      baseStyles,
      `
      :host {
        display: inline-block;
      }

      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 14px;
        border-radius: 999px;
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
        border: 1px solid transparent;
        transition: background 0.2s ease, color 0.2s ease;
      }

      a.primary {
        background: #0f62fe;
        color: #ffffff;
      }

      a.secondary {
        background: #ffffff;
        color: #0f172a;
        border-color: #d0d5dd;
      }

      a.ghost {
        background: #f8fafc;
        color: #0f172a;
      }
      `,
    ],
    render({ props, html }) {
      const href = props.href || "#";
      const variant = props.variant || "primary";
      return html`<a class="${variant}" href="${href}"><slot></slot></a>`;
    },
  });
}
