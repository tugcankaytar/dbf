# DBF Core

**DBF Core** is a tiny Web Components “engine” that gives you:

- A `DBFComponent` base class (state, props, lifecycle)
- A `defineComponent` helper for ergonomic component definitions
- A minimal `html` + `render` layer (template strings → shadow DOM)
- Typed, schema-based props and small utilities

It’s designed to be **HTML‑first**, framework‑agnostic, and easy to integrate into any stack.

---

## 1. Installation

```bash
npm install dbf-core
```

DBF Core is framework‑agnostic and works anywhere you can register Custom Elements (plain HTML, React, Vue, etc.).

---

## 2. Quick start: defining a simple component

```ts
import { defineComponent } from "dbf-core";

interface HelloProps {
  name: string;
}

defineComponent<never, HelloProps>("hello-name", {
  props: { name: "string" } as const,
  render({ props, html }) {
    return html`<p>Hello, ${props.name}!</p>`;
  },
});

// HTML:
// <hello-name name="DBF"></hello-name>
```

This registers a standard Custom Element `<hello-name>` that reads its props from the element’s attributes.

---

## 3. State and events

DBF Core lets you combine props + internal state + events in a small, React‑like way.

```ts
import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";

const counterProps = defineProps({
  initial: "number",
} as const);

type CounterProps = PropsFromSchema<typeof counterProps>;

interface CounterState {
  count: number;
}

defineComponent<CounterState, CounterProps>("dbf-counter", {
  props: counterProps,
  state: () => ({ count: 0 }),

  render({ state, props, html }) {
    const value = state.count + (props.initial ?? 0);

    return html`
      <button data-action="inc">Count: ${value}</button>
    `;
  },

  mount({ root, on, setState }) {
    on(root, "click", "[data-action='inc']", () => {
      setState({ count: 1 } as any); // replace with your own update logic
    });
  },
});
```

Key ideas:

- `state` is initialized once per instance via `state: () => ({ ... })`.
- `render` is called whenever state/props change.
- `mount` runs once after the component is attached; you typically use it for event delegation via `on(root, "click", "[data-action='inc']", handler)`.

---

## 4. Per‑component styles

DBF Core supports a `styles` field so you can inject styles into each component’s shadow root. With Vite (or similar bundlers) you can use `?inline` to import CSS as a string.

```ts
import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";
import cardStyles from "./card.css?inline";

const cardProps = defineProps({
  title: "string",
  description: "string",
  imageUrl: "string",
} as const);

type CardProps = PropsFromSchema<typeof cardProps>;

defineComponent<never, CardProps>("dbf-card", {
  props: cardProps,
  styles: cardStyles,
  render({ props, html }) {
    return html`
      <div class="card">
        <img src="${props.imageUrl}" alt="${props.title}" />
        <h2>${props.title}</h2>
        <p>${props.description}</p>
      </div>
    `;
  },
});
```

This keeps your styles **scoped** to the component via shadow DOM, and avoids leaking global CSS.

---

## 5. Typed props with `defineProps` + `PropsFromSchema`

To avoid duplicating prop definitions in both runtime and TypeScript types, DBF Core exposes a small props helper:

```ts
import { defineProps, type PropsFromSchema } from "dbf-core";

const inputProps = defineProps({
  placeholder: "string",
  type: "string",
} as const);

type InputProps = PropsFromSchema<typeof inputProps>;
```

- `defineProps` defines the runtime schema.
- `PropsFromSchema` infers the TypeScript type (`placeholder: string; type: string;`).

You can then plug `inputProps` directly into `defineComponent`’s options.

---

## 6. Relationship with the demo app

The `apps/demo` application in this repository:

- Registers several DBF Core components (cards, inputs, stats, etc.).
- Demonstrates page composition (a landing page built from custom elements).
- Integrates with `dbf-router` to show client‑side navigation.

It’s a good reference if you want to see **how DBF Core is intended to be used in practice**.

