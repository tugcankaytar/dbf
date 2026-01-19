import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";
import { baseStyles } from "../styles/shared";

const props = defineProps({
  title: "string",
  back: "boolean",
  backlabel: "string",
} as const);

type NavbarProps = PropsFromSchema<typeof props>;

export function defineMobileNavbar() {
  defineComponent<Record<string, never>, NavbarProps>("dbf-mobile-navbar", {
    props,
    styles: [
      baseStyles,
      `
      :host {
        display: block;
      }

      header {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 8px;
        padding: 14px 16px;
        background: #ffffff;
        border-bottom: 1px solid #eef2f7;
      }

      .title {
        font-weight: 700;
        font-size: 1rem;
        text-align: center;
      }

      button {
        border: none;
        background: #f1f5f9;
        color: #0f172a;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 0.85rem;
        cursor: pointer;
      }
      `,
    ],
    render({ props, html }) {
      const showBack = props.back;
      const backLabel = props.backlabel || "Back";
      const backButton = showBack
        ? html`<button data-action="back">${backLabel}</button>`
        : html`<span></span>`;
      return html`
        <header>
          ${backButton}
          <div class="title">${props.title || ""}</div>
          <div class="actions"><slot name="actions"></slot></div>
        </header>
      `;
    },
    mount({ root, on }) {
      on(root, "click", "[data-action='back']", () => {
        window.history.back();
      });
    },
  });
}
