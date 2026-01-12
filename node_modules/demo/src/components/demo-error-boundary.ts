/**
 * Error Boundary örneği
 */
import { defineComponent, createErrorBoundary } from "dbf-core";

// Hata fırlatan component
defineComponent("demo-error-thrower", {
  render({ html, state }) {
    if (state.shouldError) {
      throw new Error("This is a test error!");
    }

    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 1px solid #ef4444;
          border-radius: 8px;
          margin: 1rem 0;
        }
        button {
          padding: 0.5rem 1rem;
          border: 1px solid #ef4444;
          background: #ef4444;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <h3>Error Thrower Component</h3>
      <button data-action="throw-error">Throw Error</button>
    `;
  },
  state: () => ({ shouldError: false }),
  mount({ root, on, setState }) {
    on(root, "click", "[data-action='throw-error']", () => {
      setState({ shouldError: true });
    });
  },
});

// Error Boundary ile sarmalanmış
createErrorBoundary("demo-error-boundary", {
  fallback: (error) => {
    return `
      <style>
        :host {
          display: block;
          padding: 1rem;
          border: 2px solid #ef4444;
          border-radius: 8px;
          background: #fef2f2;
          color: #991b1b;
        }
        h3 {
          margin: 0 0 0.5rem 0;
        }
        pre {
          background: #fee2e2;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }
      </style>
      <h3>⚠️ Error Caught by Boundary</h3>
      <p>${error.message}</p>
      <pre>${error.stack || ""}</pre>
    `;
  },
  onError: (error) => {
    console.error("Error caught:", error);
  },
  render: (root) => {
    root.innerHTML = `<demo-error-thrower></demo-error-thrower>`;
  },
});

