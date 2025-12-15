import { defineComponent } from "dbf-core";
import styles from "./home-features.css?inline";
import imageUrl from "../../public/vite.svg";
import { getStrings } from "../middlewares/language";

defineComponent("home-features", {
  styles,
  render({ html }) {
    const dict = getStrings().homeFeatures;
    const cards = dict.cards as Array<{ title: string; description: string }>;

    return html`
      <section class="features">
        <div class="features-grid">
          ${cards
            .map(
              (card) => html`
                <dbf-card
                  title="${card.title}"
                  description="${card.description}"
                  imageUrl="${imageUrl}"
                ></dbf-card>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  },
});

