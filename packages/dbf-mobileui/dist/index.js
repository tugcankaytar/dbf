// src/components/button.ts
import { defineComponent, defineProps } from "dbf-core";

// src/styles/shared.ts
var baseStyles = `
:host {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  color: #121417;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
}
`;
var surfaceStyles = `
.surface {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}
`;

// src/components/button.ts
var props = defineProps({
  variant: "string",
  disabled: "boolean"
});
function defineMobileButton() {
  defineComponent("dbf-mobile-button", {
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
      `
    ],
    render({ props: props6, html }) {
      const variant = props6.variant || "primary";
      const disabledAttr = props6.disabled ? "disabled" : "";
      return html`<button class="${variant}" ${disabledAttr}><slot></slot></button>`;
    }
  });
}

// src/components/card.ts
import { defineComponent as defineComponent2 } from "dbf-core";
function defineMobileCard() {
  defineComponent2("dbf-mobile-card", {
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
      `
    ],
    render({ html }) {
      return html`<div class="surface card"><slot></slot></div>`;
    }
  });
}

// src/components/drawer.ts
import { defineComponent as defineComponent3, defineProps as defineProps2 } from "dbf-core";
var props2 = defineProps2({
  side: "string",
  animation: "string"
});
function defineMobileDrawer() {
  defineComponent3("dbf-mobile-drawer", {
    props: props2,
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
      `
    ],
    render({ html, props: props6 }) {
      const side = props6.side || "left";
      const animation = props6.animation || "slide";
      const animationClass = animation === "fade" ? "fade" : animation === "scale" ? "scale" : `slide-${side}`;
      return html`<div class="surface panel ${animationClass}"><slot></slot></div>`;
    }
  });
}

// src/components/drawer-item.ts
import { defineComponent as defineComponent4 } from "dbf-core";
function defineMobileDrawerItem() {
  defineComponent4("dbf-mobile-drawer-item", {
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
      `
    ],
    render({ html }) {
      return html`<li><slot></slot></li>`;
    }
  });
}

// src/components/input.ts
import { defineComponent as defineComponent5, defineProps as defineProps3 } from "dbf-core";
var props3 = defineProps3({
  label: "string",
  placeholder: "string",
  value: "string",
  type: "string"
});
function defineMobileInput() {
  defineComponent5("dbf-mobile-input", {
    props: props3,
    styles: [
      baseStyles,
      `
      :host {
        display: block;
      }

      label {
        display: block;
        font-size: 0.85rem;
        color: #475467;
        margin-bottom: 6px;
      }

      input {
        width: 100%;
        padding: 12px 14px;
        border-radius: 12px;
        border: 1px solid #d0d5dd;
        font-size: 0.95rem;
        outline: none;
      }

      input:focus {
        border-color: #0f62fe;
        box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.2);
      }
      `
    ],
    render({ props: props6, html }) {
      const label = props6.label ? html`<label>${props6.label}</label>` : "";
      const type = props6.type || "text";
      const placeholder = props6.placeholder || "";
      const value = props6.value || "";
      return html`${label}<input type="${type}" placeholder="${placeholder}" value="${value}" />`;
    },
    mount({ root, on, host }) {
      on(root, "input", "input", (ev) => {
        const target = ev.target;
        const value = target?.value ?? "";
        host.dispatchEvent(
          new CustomEvent("value-change", {
            detail: { value },
            bubbles: true,
            composed: true
          })
        );
      });
    }
  });
}

// src/components/link.ts
import { defineComponent as defineComponent6, defineProps as defineProps4 } from "dbf-core";
var props4 = defineProps4({
  href: "string",
  variant: "string"
});
function defineMobileLink() {
  defineComponent6("dbf-mobile-link", {
    props: props4,
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
      `
    ],
    render({ props: props6, html }) {
      const href = props6.href || "#";
      const variant = props6.variant || "primary";
      return html`<a class="${variant}" href="${href}"><slot></slot></a>`;
    }
  });
}

// src/components/list.ts
import { defineComponent as defineComponent7 } from "dbf-core";
function defineMobileList() {
  defineComponent7("dbf-mobile-list", {
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
      `
    ],
    render({ html }) {
      return html`<div class="surface"><ul><slot></slot></ul></div>`;
    }
  });
}

// src/components/list-item.ts
import { defineComponent as defineComponent8 } from "dbf-core";
function defineMobileListItem() {
  defineComponent8("dbf-mobile-list-item", {
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
      `
    ],
    render({ html }) {
      return html`<li><slot></slot></li>`;
    }
  });
}

// src/components/navbar.ts
import { defineComponent as defineComponent9, defineProps as defineProps5 } from "dbf-core";
var props5 = defineProps5({
  title: "string",
  back: "boolean",
  backlabel: "string"
});
function defineMobileNavbar() {
  defineComponent9("dbf-mobile-navbar", {
    props: props5,
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
      `
    ],
    render({ props: props6, html }) {
      const showBack = props6.back;
      const backLabel = props6.backlabel || "Back";
      const backButton = showBack ? html`<button data-action="back">${backLabel}</button>` : html`<span></span>`;
      return html`
        <header>
          ${backButton}
          <div class="title">${props6.title || ""}</div>
          <div class="actions"><slot name="actions"></slot></div>
        </header>
      `;
    },
    mount({ root, on }) {
      on(root, "click", "[data-action='back']", () => {
        window.history.back();
      });
    }
  });
}

// src/components/toolbar.ts
import { defineComponent as defineComponent10 } from "dbf-core";
function defineMobileToolbar() {
  defineComponent10("dbf-mobile-toolbar", {
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
      `
    ],
    render({ html }) {
      return html`<div class="toolbar"><slot></slot></div>`;
    }
  });
}

// src/layout/page.ts
import { defineComponent as defineComponent11 } from "dbf-core";
function defineMobilePage() {
  defineComponent11("dbf-mobile-page", {
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
      `
    ],
    render({ html }) {
      return html`
        <div class="page">
          <div class="navbar"><slot name="navbar"></slot></div>
          <div class="content"><slot></slot></div>
          <div class="toolbar"><slot name="toolbar"></slot></div>
        </div>
      `;
    }
  });
}

// src/register.ts
function registerMobileUI() {
  defineMobileButton();
  defineMobileCard();
  defineMobileDrawer();
  defineMobileDrawerItem();
  defineMobileInput();
  defineMobileLink();
  defineMobileList();
  defineMobileListItem();
  defineMobileNavbar();
  defineMobileToolbar();
  defineMobilePage();
}
export {
  defineMobileButton,
  defineMobileCard,
  defineMobileDrawer,
  defineMobileDrawerItem,
  defineMobileInput,
  defineMobileLink,
  defineMobileList,
  defineMobileListItem,
  defineMobileNavbar,
  defineMobilePage,
  defineMobileToolbar,
  registerMobileUI
};
