import { defineComponent, useState, useEffect } from "dbf-core";
import { notify } from "./notify";
const getData = (index: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (index === 0) {
        resolve({ name: "John Doe", email: "john@example.com" });
      } else if (index === 1) {
        resolve({ name: "Jane Smith", email: "jane@example.com" });
      } else {
        resolve({ name: "Jim Beam", email: "jim@example.com" });
      }
    }, 1000);
  });
}


defineComponent("demo-data-fetch", {
  render({ html }) {
    const [userData] = useState<{ name: string; email: string } | null>(null);
    const [loading] = useState(true);
    // Burada `p` etiketi için olan CSS'i değiştiriyoruz:
    useEffect(() => {
      if (userData) {
        console.log("Veriler güncellendi", userData);
        notify({
          message: "Veriler güncellendi",
          duration: 2000,
          type: "success",
        });
      }
    }, [userData]);

    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 8px;
          margin: 1rem 0;
          background: rgba(15, 23, 42, 0.6);
          color: #e5e7eb;
        }
        h3 {
          margin: 0 0 0.75rem;
          font-size: 1.1rem;
        }
        p {
          margin: 0.4rem 0;
        }
        button {
          padding: 0.5rem 1rem;
          margin: 0.25rem 0.5rem 0.25rem 0;
          border-radius: 999px;
          border: 1px solid transparent;
          font-weight: 500;
          font-family: inherit;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease,
            box-shadow 0.1s ease, filter 0.2s ease;
        }
        button[data-action="refetch-data"] {
          background: rgba(15, 23, 42, 0.6);
          border-color: rgba(148, 163, 184, 0.6);
          color: #e5e7eb;
        }
        button:hover {
          filter: brightness(0.95);
        }
        button:active {
          transform: translateY(1px);
        }
        button:focus-visible {
          outline: 2px solid #38bdf8;
          outline-offset: 2px;
        }
        .loading {
          color: #94a3b8;
          font-style: italic;
        }
      </style>
      <h3>Data Fetching Example</h3>

      ${loading
        ? `<p class="loading">Loading...</p>`
        : userData
          ? `<p>Name: <strong>${userData.name}</strong></p>
             <p>Email: <strong>${userData.email}</strong></p>`
          : `<p>No data</p>`}

      <div style="display: flex; justify-content: center; margin-top: 1rem;">
        <button data-action="refetch-data">Refetch Data</button>
      </div>
    `;
  },

  mount({ root, on, host }) {
    // ✅ ilk yükleme burada: __hooks__ garanti hazır
    const hooks = (host as any).__hooks__?.hooks;
    if (!hooks) return;
    const setInitialData = () => {
      getData(0).then((data) => {
        hooks[0]?.setter?.(data);
        hooks[1]?.setter?.(false);
      });
    }
    setInitialData();

    on(root, "click", "[data-action='refetch-data']", () => {
      hooks[1]?.setter?.(true);
      getData(1).then((data) => {
        hooks[0]?.setter?.(data);
        hooks[1]?.setter?.(false);
      });
    });
  },
});
