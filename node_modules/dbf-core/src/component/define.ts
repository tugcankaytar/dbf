import { invariant } from "../internal/invariant";

export function define(tag: string, ctor: CustomElementConstructor) {
  invariant(tag.includes("-"), "Custom element tag must contain '-' (e.g. 'dbf-counter').");
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}
