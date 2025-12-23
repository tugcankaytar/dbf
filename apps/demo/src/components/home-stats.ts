import { defineComponent, getStrings } from "dbf-core";
import styles from "./home-stats.css?inline";
import imageUrl from "../../public/vite.svg";

defineComponent("home-stats", {
  styles,
  render({ html }) {
    const dict = getStrings().homeStats;
    const items = dict.items as Array<{ label: string; value: string; hint: string }>;

    return html`
      <section class="stats">
        <div class="stats-grid">
          ${items
            .map(
              (item) => html`
                <dbf-stat
                  label="${item.label}"
                  value="${item.value}"
                  hint="${item.hint}"
                  imageUrl="${imageUrl}"
                ></dbf-stat>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  },
});
