import { defineComponent, getStrings } from "dbf-core";
import styles from "./home-footer.css?inline";

defineComponent("home-footer", {
  styles,
  render({ html }) {
    const dict = getStrings().footer;

    return html`
      <footer class="site-footer">
        <span>© ${new Date().getFullYear()} DBF Core</span>
        <span class="dot">•</span>
        <span>${dict.builtWith}</span>
      </footer>
    `;
  },
});
