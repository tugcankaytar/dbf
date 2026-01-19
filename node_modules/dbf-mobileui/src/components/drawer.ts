import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";
import { baseStyles, surfaceStyles } from "../styles/shared";

const props = defineProps({
  side: "string",
  animation: "string",
} as const);

type DrawerProps = PropsFromSchema<typeof props>;

export function defineMobileDrawer() {
  defineComponent<Record<string, never>, DrawerProps>("dbf-mobile-drawer", {
    props,
    styles: [
      baseStyles,
      surfaceStyles,
      `
      :host {
        display: none;
        position: relative;
        width: 100%;
      }

      :host([open]) {
        display: grid;
      }

      .panel {
        padding: 12px;
        animation-duration: 0.25s;
        animation-timing-function: ease;
      }

      .panel.slide-left {
        animation-name: slide-in-left;
      }

      .panel.slide-right {
        animation-name: slide-in-right;
      }

      .panel.slide-top {
        animation-name: slide-in-top;
      }

      .panel.slide-bottom {
        animation-name: slide-in-bottom;
      }

      .panel.fade {
        animation-name: fade-in;
      }

      .panel.scale {
        animation-name: scale-in;
      }

      @keyframes slide-in-left {
        from {
          transform: translateX(-12%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slide-in-right {
        from {
          transform: translateX(12%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slide-in-top {
        from {
          transform: translateY(-12%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes slide-in-bottom {
        from {
          transform: translateY(12%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes scale-in {
        from {
          transform: scale(0.96);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
      `,
    ],
    render({ html, props }) {
      const side = props.side || "left";
      const animation = props.animation || "slide";
      const animationClass =
        animation === "fade"
          ? "fade"
          : animation === "scale"
          ? "scale"
          : `slide-${side}`;

      return html`<div class="surface panel ${animationClass}"><slot></slot></div>`;
    },
  });
}
