import { defineComponent, getStrings } from "dbf-core";
import styles from "./home-hero.css?inline";

defineComponent("home-hero", {
  styles,
  render({ html }) {
    const dict = getStrings().homeHero;

    return html`
      <section class="hero">
        <p class="badge">${dict.badge}</p>
        <h1>${dict.title}</h1>
        <p class="hero-subtitle">
          ${dict.subtitle}
        </p>
        <div class="hero-actions">
          <button class="btn primary">${dict.primaryCta}</button>
          <a class="remove-underline btn ghost" href="/docs">${dict.secondaryCta}</a>
        </div>
        <p class="hero-meta">${dict.meta}</p>
      </section>
    `;
  },
});
