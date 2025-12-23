/**
 * Error Boundary helper: defineComponent ile entegrasyon
 */

import { defineComponent } from "../component/defineComponent";
import { html } from "../dom/html";

export interface ErrorBoundaryOptions {
  fallback?: (error: Error) => string;
  onError?: (error: Error) => void;
}

/**
 * Error Boundary wrapper: Children render ederken hata yakalar
 */
export function withErrorBoundary(
  tag: string,
  renderChildren: (root: ShadowRoot) => void,
  options: ErrorBoundaryOptions = {}
) {
  let errorState: { error: Error } | null = null;

  defineComponent(tag, {
    state: () => ({
      hasError: false,
    }),
    render({ html: h }) {
      if (errorState) {
        const fallback = options.fallback || defaultErrorFallback;
        return fallback(errorState.error);
      }

      try {
        // Children'ı render etmeye çalış
        // Not: Bu yaklaşım sınırlı, gerçek error boundary için
        // component tree'yi wrap etmek gerekir
        return h`<slot></slot>`;
      } catch (error) {
        errorState = {
          error: error instanceof Error ? error : new Error(String(error)),
        };
        if (options.onError) {
          options.onError(errorState.error);
        }
        const fallback = options.fallback || defaultErrorFallback;
        return fallback(errorState.error);
      }
    },
  });
}

function defaultErrorFallback(error: Error): string {
  return html`
    <style>
      :host {
        display: block;
        padding: 1rem;
        border: 2px solid #ef4444;
        border-radius: 0.5rem;
        background: #fef2f2;
        color: #991b1b;
      }
      h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
      }
      pre {
        margin: 0.5rem 0 0 0;
        padding: 0.75rem;
        background: #fee2e2;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        overflow-x: auto;
      }
    </style>
    <h2>Something went wrong</h2>
    <pre>${error.message}</pre>
  `;
}

