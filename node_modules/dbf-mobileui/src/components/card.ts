import { defineComponent } from "dbf-core";
import { baseStyles, surfaceStyles } from "../styles/shared";

export function defineMobileCard() {
  defineComponent("dbf-mobile-card", {
    styles: [
      baseStyles,
      surfaceStyles,
      `
      :host {
        display: block;
      }

      .card {
        padding: 16px;
      }
      `,
    ],
    render({ html }) {
      return html`<div class="surface card"><slot></slot></div>`;
    },
  });
}
