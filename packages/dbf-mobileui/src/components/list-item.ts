import { defineComponent } from "dbf-core";
import { baseStyles } from "../styles/shared";

export function defineMobileListItem() {
  defineComponent("dbf-mobile-list-item", {
    styles: [
      baseStyles,
      `
      :host {
        display: block;
      }

      li {
        padding: 14px 16px;
        border-bottom: 1px solid #eef2f7;
        font-size: 0.95rem;
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
