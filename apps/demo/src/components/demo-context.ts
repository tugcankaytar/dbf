/**
 * Context API örneği
 */
import {
  defineComponent,
  createContext,
  useContext,
  provideContext,
  useState,
} from "dbf-core";

// Theme Context
const ThemeContext = createContext<{ theme: string; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

// Theme Provider Component
defineComponent("demo-theme-provider", {
  render({ html, host }) {
    const [theme, setTheme] = useState("light");

    // Toggle fonksiyonunu sabit tut, sadece theme değerini güncelle
    const toggleTheme = () => {
      setTheme((prev) => {
        const newTheme = prev === "light" ? "dark" : "light";
        // Context value'yu güncelle
        const updateContext = (host as any).__updateContext;
        if (updateContext) {
          updateContext({
            theme: newTheme,
            toggle: toggleTheme,
          });
        }
        return newTheme;
      });
    };

    // Context'i provide et ve update fonksiyonunu sakla
    const updateContext = provideContext(host, ThemeContext, {
      theme,
      toggle: toggleTheme,
    });

    // Update fonksiyonunu host üzerinde sakla
    (host as any).__updateContext = updateContext;
    (host as any).__setTheme = setTheme;
    (host as any).__theme = theme;
    (host as any).__toggleTheme = toggleTheme;

    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 1rem 0;
          background: ${theme === "light" ? "#fff" : "#1f2937"};
          color: ${theme === "light" ? "#000" : "#fff"};
        }
      </style>
      <h3>Theme Provider (Context)</h3>
      <p>Current theme: <strong>${theme}</strong></p>
      <slot></slot>
    `;
  },
});

// Theme Consumer Component
defineComponent("demo-theme-consumer", {
  render({ html }) {
    const theme = useContext(ThemeContext);

    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          margin: 1rem 0;
          border: 2px solid ${theme.theme === "light" ? "#000" : "#fff"};
          border-radius: 8px;
        }
        button {
          padding: 0.5rem 1rem;
          border: 1px solid #6366f1;
          background: #6366f1;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <h4>Theme Consumer</h4>
      <p>Reading theme from context: <strong>${theme.theme}</strong></p>
      <button data-action="toggle-theme">Toggle Theme</button>
    `;
  },
  mount({ root, on, host }) {
    on(root, "click", "[data-action='toggle-theme']", () => {
      // Provider'ı bul ve toggle fonksiyonunu çağır
      let current: HTMLElement | null = host;
      while (current) {
        // Provider component'ini bul
        if (current.tagName === "DEMO-THEME-PROVIDER") {
          const toggleTheme = (current as any).__toggleTheme;
          if (toggleTheme) {
            toggleTheme();
          }
          break;
        }
        const rootNode: ShadowRoot | Document | null = (current as any).getRootNode?.();
        current = (rootNode as any)?.host || current.parentElement;
      }
    });
  },
});

