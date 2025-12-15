export function on(
  root: ShadowRoot | HTMLElement,
  eventName: string,
  selector: string,
  handler: (ev: Event, el: Element) => void
) {
  root.addEventListener(eventName, (ev) => {
    const target = ev.target as Element | null;
    const el = target?.closest?.(selector);
    if (!el) return;

    // ShadowRoot içinde zaten izolasyon var, ayrıca host.contains kontrolüne gerek yok.
    // Sadece eşleşen elementi handler'a iletelim.
    handler(ev, el);
  });
}
