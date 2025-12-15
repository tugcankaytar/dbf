import { defineComponent } from "dbf-core";
import styles from "./home-hero.css?inline";

defineComponent("home-hero", {
  styles,
  render({ html }) {
    return html`
      <section class="hero">
        <p class="badge">Web Components • Developer Toolkit</p>
        <h1>Ship UI with native Web Components.</h1>
        <p class="hero-subtitle">
          DBF Core is a tiny layer on top of Custom Elements that gives you state, props,
          events and rendering — without committing to a heavy framework.
        </p>
        <div class="hero-actions">
          <button class="btn primary">Get started</button>
          <button class="btn ghost">Open docs</button>
        </div>
        <p class="hero-meta">HTML-first. Framework-agnostic. Production ready foundations.</p>
      </section>
    `;
  },
});


