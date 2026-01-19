import { defineComponent } from "dbf-core";
import { baseStyles, surfaceStyles } from "../styles/shared";

export function defineMobileList() {
  defineComponent("dbf-mobile-list", {
    styles: [
      baseStyles,
      surfaceStyles,
      `
      :host {
        display: block;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .surface {
        overflow: hidden;
      }
      `,
    ],
    render({ html }) {
      return html`<div class="surface"><ul><slot></slot></ul></div>`;
    },
  });
}
