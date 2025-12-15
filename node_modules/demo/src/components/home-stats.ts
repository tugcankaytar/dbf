import { defineComponent } from "dbf-core";
import styles from "./home-stats.css?inline";

defineComponent("home-stats", {
  styles,
  render({ html }) {
    return html`
      <section class="stats">
        <div class="stats-grid">
          <dbf-stat
            label="Lightweight"
            value="< 5 KB"
            hint="Core runtime, minified & gzip"
          ></dbf-stat>
          <dbf-stat
            label="Native"
            value="0 abstractions"
            hint="Built on top of Custom Elements"
          ></dbf-stat>
          <dbf-stat
            label="DX"
            value="Type-safe"
            hint="Typed props, state helpers, events"
          ></dbf-stat>
        </div>
      </section>
    `;
  },
});


