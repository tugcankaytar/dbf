import { defineComponent, getStrings } from "dbf-core";
import styles from "./home-newsletter.css?inline";

defineComponent("home-newsletter", {
  styles,
  render({ html }) {
    const dict = getStrings().homeNewsletter;

    return html`
      <section class="newsletter">
        <h2>${dict.title}</h2>
        <p>${dict.body}</p>
        <div class="newsletter-form">
          <dbf-input placeholder="${dict.inputPlaceholder}" type="text"></dbf-input>
          <button class="btn primary">${dict.cta}</button>
        </div>
        <p class="newsletter-meta">${dict.meta}</p>
      </section>
    `;
  },
});
