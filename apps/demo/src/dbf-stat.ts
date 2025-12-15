import { defineComponent, defineProps, type PropsFromSchema } from "dbf-core";
import statStyles from "./dbf-stat.css?inline";

const statProps = defineProps({
  label: "string",
  value: "string",
  hint: "string",
} as const);

type StatProps = PropsFromSchema<typeof statProps>;

defineComponent<never, StatProps>("dbf-stat", {
  props: statProps,
  styles: statStyles,
  render({ props, html }) {
    return html`
      <div class="stat">
        <div class="stat-label">${props.label}</div>
        <div class="stat-value">${props.value}</div>
        ${props.hint ? `<div class="stat-hint">${props.hint}</div>` : ""}
      </div>
    `;
  },
});


