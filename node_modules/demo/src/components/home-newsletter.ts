import { defineComponent } from "dbf-core";
import styles from "./home-newsletter.css?inline";

defineComponent("home-newsletter", {
  styles,
  render({ html }) {
    return html`
      <section class="newsletter">
        <h2>Stay in the loop</h2>
        <p>Get early access to docs, examples and production-ready starters.</p>
        <div class="newsletter-form">
          <dbf-input placeholder="Email adresinizi girin" type="text"></dbf-input>
          <button class="btn primary">Join waitlist</button>
        </div>
        <p class="newsletter-meta">No spam, only product updates and learning resources.</p>
      </section>
    `;
  },
});


