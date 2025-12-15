import { defineComponent } from "dbf-core";

interface InputState {
  value: string;
}

interface InputProps {
  placeholder: string;
}

defineComponent<InputState, InputProps>("dbf-input", {
  // <dbf-input placeholder="Adınızı girin"> gibi kullanımı destekler
  props: { placeholder: "string" },

  state: () => ({
    value: "",
  }),

  mount({ root, on, setState, host }) {
    // Shadow root içindeki <input> için input event'ini dinle
    on(root, "input", "input", (_ev, el) => {
      const input = el as HTMLInputElement;
      const value = input.value;
      setState({ value });

      // Dışarıya controlled input gibi davranması için custom event gönder
      host.dispatchEvent(
        new CustomEvent("change", {
          detail: { value },
          bubbles: true,
          composed: true,
        })
      );
    });
  },

  render({ state, props, html }) {
    const placeholder = props.placeholder ?? "Type something...";

    return html`
      <style>
        :host {
          display: block;
          font: 14px system-ui;
          padding: 12px;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        input {
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font: inherit;
        }
        .value {
          color: #555;
          font-size: 12px;
        }
      </style>

      <label>
        <span class="value">Current value: ${state.value || "—"}</span>
        <input type="text" placeholder="${placeholder}" value="${state.value}" />
      </label>
    `;
  },
});

