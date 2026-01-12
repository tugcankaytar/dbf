import { defineComponent } from "dbf-core";

type NotifyType = "success" | "error" | "info";

function normalize(host: HTMLElement, props: any) {
  const message =
    (props?.message ??
      host.getAttribute("message") ??
      "") + "";

  const type =
    ((props?.type ?? host.getAttribute("type") ?? "success") + "") as NotifyType;

  const durationRaw = props?.duration ?? host.getAttribute("duration");
  const duration = Number(durationRaw);

  return {
    message,
    type: (type === "success" || type === "error" || type === "info") ? type : "success",
    duration: Number.isFinite(duration) ? duration : 2000,
  };
}

defineComponent("dbf-notification", {
  props: {
    message: "string",
    duration: "number",
    type: "string",
  },

  render({ html, props, host }) {
    const { message, type } = normalize(host as any, props);

    return html`
      <style>
        :host { display: block; }
        .toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          background: rgba(15, 23, 42, 0.92);
          color: #e5e7eb;
          box-shadow: 0 18px 40px rgba(2, 6, 23, 0.55);
          backdrop-filter: blur(10px);

          opacity: 0;
          transform: translateY(6px);
          transition: opacity .18s ease, transform .18s ease;
          will-change: opacity, transform;
        }

        :host([data-mounted="1"]) .toast {
          opacity: 1;
          transform: translateY(0);
        }

        .toast.success { border-color: rgba(52, 211, 153, 0.35); }
        .toast.error   { border-color: rgba(248, 113, 113, 0.35); }
        .toast.info    { border-color: rgba(56, 189, 248, 0.35); }

        p {
          margin: 0;
          font-weight: 600;
          white-space: nowrap;
        }
        .toast.success p { color: #34d399; }
        .toast.error p   { color: #f87171; }
        .toast.info p    { color: #38bdf8; }

        button {
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: rgba(15, 23, 42, 0.6);
          color: #e5e7eb;
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          cursor: pointer;
          font-size: 0.85rem;
        }
        button:hover { filter: brightness(1.05); }
      </style>

      <div class="toast ${type}">
        <p>${message}</p>
        <button type="button" data-action="close">X</button>
      </div>
    `;
  },

  mount({ root, on, host, props }) {
    const h = host as HTMLElement;

    // mount animasyonu
    queueMicrotask(() => h.setAttribute("data-mounted", "1"));

    const remove = () => {
      // çıkış animasyonu
      h.removeAttribute("data-mounted");
      setTimeout(() => h.remove(), 220);
    };

    on(root, "click", "[data-action='close']", remove);

    const { duration } = normalize(h, props);
    if (Number.isFinite(duration) && duration > 0) {
      setTimeout(remove, duration);
    }
  },
});
