import { defineComponent } from "dbf-core";
import { baseStyles } from "../styles/shared";

export function defineMobilePage() {
  defineComponent("dbf-mobile-page", {
    styles: [
      baseStyles,
      `
      :host {
        display: block;
        min-height: 100dvh;
        background: #f8fafc;
      }

      .page {
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
      }

      .content {
        flex: 1;
        padding: 16px;
      }
      `,
    ],
    render({ html }) {
      return html`
        <div class="page">
          <div class="navbar"><slot name="navbar"></slot></div>
          <div class="content"><slot></slot></div>
          <div class="toolbar"><slot name="toolbar"></slot></div>
        </div>
      `;
    },
  });
}
