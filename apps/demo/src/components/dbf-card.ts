import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";
import cardStyles from "./dbf-card.css?inline";

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
        <div class="card-header">
          <img src="${props.imageUrl}" alt="${props.title}" />
          <h2>${props.title}</h2>
          <p>${props.description}</p>
        </div>
        <div class="card-body">
          <slot></slot>
          </div>
        </div>
      </div>
    `;
  },
});
