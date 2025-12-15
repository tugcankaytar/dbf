import { defineComponent } from "dbf-core";
import styles from "./home-features.css?inline";
import imageUrl from "../../public/vite.svg";

defineComponent("home-features", {
  styles,
  render({ html }) {
    return html`
      <section class="features">
        <div class="features-grid">
          <dbf-card
            title="State & props"
            description="Describe component behavior with a small, React-like API built for Web Components."
            imageUrl="${imageUrl}"
          ></dbf-card>
          <dbf-card
            title="Shadow DOM friendly styles"
            description="Attach styles per component via the styles option — no global leakage."
            imageUrl="${imageUrl}"
          ></dbf-card>
          <dbf-card
            title="HTML-first composition"
            description="Use custom tags directly in HTML — works with any framework or no framework."
            imageUrl="${imageUrl}"
          ></dbf-card>
        </div>
      </section>
    `;
  },
});


