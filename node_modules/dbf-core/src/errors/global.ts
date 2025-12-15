export type GlobalErrorSource = "error" | "unhandledrejection";

export interface GlobalErrorHandlerOptions {
  /**
   * Whether to show a small banner at the bottom of the page when a global
   * error occurs. Defaults to `true` in browser environments.
   */
  showBanner?: boolean;

  /**
   * Document or root element used to attach the banner.
   * Defaults to `document`.
   */
  root?: Document | HTMLElement;

  /**
   * Build the message shown in the banner.
   * By default a generic “something went wrong” message is used.
   */
  getMessage?(error: unknown, source: GlobalErrorSource): string;
}

const DEFAULT_BANNER_ID = "dbf-core-global-error-banner";

function resolveDocument(root?: Document | HTMLElement): Document | null {
  if (typeof window === "undefined") return null;
  if (!root) return window.document;
  if (root instanceof window.Document) return root;
  return root.ownerDocument ?? window.document;
}

function ensureBanner(doc: Document, id: string): HTMLDivElement {
  let el = doc.querySelector<HTMLDivElement>(`#${id}`);
  if (el) return el;

  el = doc.createElement("div");
  el.id = id;
  el.style.position = "fixed";
  el.style.insetInline = "0";
  el.style.bottom = "0";
  el.style.zIndex = "9999";
  el.style.padding = "0.75rem 1.5rem";
  el.style.display = "flex";
  el.style.justifyContent = "space-between";
  el.style.alignItems = "center";
  el.style.gap = "0.75rem";
  el.style.background = "rgba(127, 29, 29, 0.95)";
  el.style.color = "#fee2e2";
  el.style.fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  el.style.fontSize = "0.9rem";

  const msg = doc.createElement("span");
  msg.id = `${id}-message`;

  const closeBtn = doc.createElement("button");
  closeBtn.textContent = "Dismiss";
  closeBtn.style.border = "1px solid rgba(248, 250, 252, 0.4)";
  closeBtn.style.borderRadius = "999px";
  closeBtn.style.padding = "0.35rem 0.9rem";
  closeBtn.style.background = "transparent";
  closeBtn.style.color = "inherit";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = () => {
    el?.remove();
  };

  el.append(msg, closeBtn);
  doc.body.appendChild(el);
  return el;
}

function showBannerMessage(
  doc: Document,
  message: string,
  id: string = DEFAULT_BANNER_ID
) {
  const banner = ensureBanner(doc, id);
  const msg = banner.querySelector<HTMLSpanElement>(`#${id}-message`);
  if (msg) msg.textContent = message;
}

/**
 * Installs global `error` and `unhandledrejection` handlers.
 *
 * This is an **optional helper** — libraries should not call it automatically.
 * Call it from your application entry point if you want a simple global error
 * banner + console logging.
 *
 * Returns a cleanup function that removes the installed handlers.
 */
export function installGlobalErrorHandler(
  options: GlobalErrorHandlerOptions = {}
): () => void {
  if (typeof window === "undefined") {
    // SSR / non-DOM environment: no-op
    return () => {};
  }

  const doc = resolveDocument(options.root);
  const showBanner = options.showBanner ?? true;
  const getMessage =
    options.getMessage ??
    ((_error: unknown, _source: GlobalErrorSource) =>
      "Something went wrong. Please check the console for details.");

  const onError = (event: ErrorEvent) => {
    // Native error event
    // eslint-disable-next-line no-console
    console.error("[dbf-core] Uncaught error:", event.error ?? event.message);
    if (doc && showBanner) {
      showBannerMessage(doc, getMessage(event.error ?? event.message, "error"));
    }
  };

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    // eslint-disable-next-line no-console
    console.error("[dbf-core] Unhandled promise rejection:", event.reason);
    if (doc && showBanner) {
      showBannerMessage(
        doc,
        getMessage(event.reason, "unhandledrejection")
      );
    }
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
  };
}


