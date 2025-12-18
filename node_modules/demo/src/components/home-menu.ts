import { defineComponent } from "dbf-core";
import styles from "./home-menu.css?inline";
import {
  getLanguage,
  setLanguage,
  getStrings,
  onLanguageChange,
  type LanguageCode,
} from "../middlewares/language";

type HomeMenuState = {
  lang: LanguageCode;
};

defineComponent<HomeMenuState>("home-menu", {
  styles,
  state: () => ({
    lang: getLanguage(),
  }),
  mount({ root, on, setState }) {
    onLanguageChange((lang) => {
      setState({ lang });
    });

    on(root, "click", "[data-action='change-lang']", (_ev, el) => {
      const button = el as HTMLButtonElement;
      const lang = button.dataset.lang as LanguageCode | undefined;
      if (!lang) return;
      setLanguage(lang);
    });

    // İstersen ileride unmount için dispose'u kullanabilirsin.
    // return () => dispose();
  },
  render({ html, state }) {
    const dict = getStrings();
    const { menu } = dict;
    const isEn = state.lang === "en";

    return html`
      <div class="site-header-inner">
        <div class="brand">
          <span class="brand-mark">DBF</span>
          <span class="brand-text-wrapper">
            <span class="brand-text-list">
              <span class="brand-text">Core</span>
            </span>
            <span class="brand-text-list">
              <span class="brand-text">Router</span>
            </span>
            <span class="brand-text-list">
              <span class="brand-text">UI</span>
            </span>
          </span>
        </div>  
        <nav class="nav">
          <a href="/">${menu.overview}</a>
          <a href="/docs">${menu.docs}</a>
          <a href="/components">${menu.components}</a>
        </nav>
        <div class="actions">
        <button class="btn small ghost">${menu.star}</button>
        ${isEn
          ? html`<button
              class="btn small ghost"
              data-action="change-lang"
              data-lang="tr"
            >
              ${menu.switchToOther}
            </button>`
          : html`<button
              class="btn small ghost"
              data-action="change-lang"
              data-lang="en"
            >
              ${menu.switchToOther}
            </button>`}
          </div>
      </div>
    `;
  },
});
