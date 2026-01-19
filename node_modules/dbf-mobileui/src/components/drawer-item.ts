import { defineComponent } from "dbf-core";
import { baseStyles } from "../styles/shared";

export function defineMobileDrawerItem() {
  defineComponent("dbf-mobile-drawer-item", {
    styles: [
      baseStyles,
      `
      :host {
        display: block;
      }

      li {
        padding: 12px 14px;
        border-bottom: 1px solid #eef2f7;
        font-size: 0.92rem;
      }

      li:last-child {
        border-bottom: none;
      }
      `,
    ],
    render({ html }) {
      return html`<li><slot></slot></li>`;
    },
  });
}
