export type NotifyType = "success" | "error" | "info";

// Side-effect import: registers <dbf-notification> custom element
import "./notification";

export type NotifyOptions = {
  message: string;
  duration?: number;   // ms
  type?: NotifyType;
  dedupeKey?: string;  // aynı key gelirse eskisini sil-yenisini koy
};

function ensureStack(): HTMLElement {
  let stack = document.getElementById("dbf-toast-stack") as HTMLElement | null;
  if (stack) return stack;

  stack = document.createElement("div");
  stack.id = "dbf-toast-stack";
  stack.style.cssText = `
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    gap: .6rem;
    align-items: flex-end;
    pointer-events: none;
  `;
  document.body.appendChild(stack);
  return stack;
}

export function notify(opts: NotifyOptions) {
  const stack = ensureStack();

  // dedupe (opsiyonel)
  if (opts.dedupeKey) {
    const old = stack.querySelector(`[data-dedupe="${CSS.escape(opts.dedupeKey)}"]`);
    old?.remove();
  }

  const el = document.createElement("dbf-notification") as any;

  // stack içinde sadece toast tıklanabilsin
  (el as HTMLElement).style.pointerEvents = "auto";

  // attribute + props birlikte (hangisi destekleniyorsa)
  el.setAttribute("message", opts.message);
  el.setAttribute("type", opts.type ?? "success");
  el.setAttribute("duration", String(opts.duration ?? 2000));

  el.props = {
    message: opts.message,
    type: opts.type ?? "success",
    duration: opts.duration ?? 2000,
  };

  if (opts.dedupeKey) (el as HTMLElement).setAttribute("data-dedupe", opts.dedupeKey);

  stack.appendChild(el as HTMLElement);
  return el as HTMLElement;
}
