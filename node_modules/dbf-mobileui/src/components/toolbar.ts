import { defineComponent } from "dbf-core";
import { baseStyles } from "../styles/shared";

export function defineMobileToolbar() {
  defineComponent("dbf-mobile-toolbar", {
    styles: [
      baseStyles,
      `
      :host {
        display: block;
      }

      .toolbar {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        background: #ffffff;
        border-top: 1px solid #eef2f7;
      }
      `,
    ],
    render({ html }) {
      return html`<div class="toolbar"><slot></slot></div>`;
    },
  });
}
