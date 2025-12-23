/**
 * Error Boundary: Component tree'de hata yakalama ve fallback UI
 */

import { DBFComponent } from "../component/Component";
import { define } from "../component/define";
import { html } from "../dom/html";
import { render } from "../dom/render";

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo?: any;
}

export interface ErrorBoundaryProps {
  fallback?: (error: Error, errorInfo?: any) => string;
  onError?: (error: Error, errorInfo?: any) => void;
}

/**
 * Error Boundary component base class
 */
export abstract class ErrorBoundaryComponent extends DBFComponent<
  ErrorBoundaryState,
  ErrorBoundaryProps
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
    });

    // Callback'e bildir
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Console'a log
    console.error("[dbf-core:ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const fallback = this.props.fallback || defaultFallback;
      const fallbackHtml = fallback(this.state.error, this.state.errorInfo);
      render(this.root, html`${fallbackHtml}`);
      return;
    }

    // Normal render: children'ı render et
    this.renderChildren();
  }

  abstract renderChildren(): void;
}

function defaultFallback(error: Error, _errorInfo?: any): string {
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
    <pre>${error.message}\n${error.stack || ""}</pre>
  `;
}

/**
 * Error Boundary helper: defineComponent ile kullanım için
 */
export function createErrorBoundary(
  tag: string,
  options: {
    fallback?: (error: Error, errorInfo?: any) => string;
    onError?: (error: Error, errorInfo?: any) => void;
    render: (root: ShadowRoot) => void;
  }
) {
  class ErrorBoundaryImpl extends ErrorBoundaryComponent {
    renderChildren(): void {
      try {
        options.render(this.root);
      } catch (error) {
        // Render sırasında hata oluştu, state'e kaydet
        this.setState({
          hasError: true,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }
  }

  // Props desteği ekle
  ErrorBoundaryImpl.prototype.componentDidCatch = function (error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
    });

    if (options.onError) {
      options.onError(error, errorInfo);
    }

    console.error("[dbf-core:ErrorBoundary] Caught error:", error, errorInfo);
  };

  define(tag, ErrorBoundaryImpl);
}

