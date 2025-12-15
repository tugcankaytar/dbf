# DBF Core

**DBF Core** is a tiny Web Components “engine” that gives you:

- A `DBFComponent` base class (state, props, lifecycle)
- A `defineComponent` helper for ergonomic component definitions
- A minimal `html` + `render` layer (template strings → shadow DOM)
- Typed, schema-based props and small utilities

It’s designed to be **HTML-first**, framework-agnostic, and easy to integrate into any stack.

## Installation

```bash
npm install dbf-core
```

## Defining a simple component

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

## Using state and events

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
  render({ state, props, html, host }) {
    const value = state.count + (props.initial ?? 0);

    // Basit event örneği: her render'da son değeri attribute olarak yansıtabiliriz
    host.setAttribute("data-count", String(value));

    return html`
      <button data-action="inc">Count: ${value}</button>
    `;
  },
  mount({ root, on, setState }) {
    on(root, "click", "[data-action='inc']", () => {
      setState({ count: (state) => state.count + 1 } as any);
    });
  },
});
```

## Styles per component

DBF Core, component başına shadow DOM içine stil eklemek için `styles` alanını destekler. Vite gibi bundler’larda CSS’i `?inline` ile string olarak import edebilirsiniz.

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

## Props helper: `defineProps` + `PropsFromSchema`

Tek bir şemadan hem runtime props çözümlemesini hem de TypeScript tiplerini türetmek için:

```ts
import { defineProps, type PropsFromSchema } from "dbf-core";

const inputProps = defineProps({
  placeholder: "string",
  type: "string",
} as const);

type InputProps = PropsFromSchema<typeof inputProps>;
```

Bu sayede şemayı ve tipi ayrı ayrı tutmak zorunda kalmazsınız; tek bir `defineProps` çağrısı yeter.

## Demo

Bu repodaki `apps/demo` uygulaması, DBF Core ile inşa edilmiş çeşitli component ve sayfa örnekleri içerir.


