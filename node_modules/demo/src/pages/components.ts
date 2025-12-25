import { getStrings } from "dbf-core";

export function renderComponents(root: HTMLElement) {
  const dict = getStrings().componentsPage;

  root.innerHTML = `
    <section class="hero-preview" id="components">
      <dbf-card
        title="${dict.cardTitle}"
        description="${dict.cardDescription}"
        imageUrl="https://vitejs.dev/logo.svg"
      >
        <dbf-input placeholder="Title" type="text"></dbf-input>
        <dbf-input placeholder="Description" type="text"></dbf-input>
      </dbf-card>

      <dbf-card
        title="${dict.counterTitle}"
        description="${dict.counterDescription}"
        imageUrl="https://vitejs.dev/logo.svg"
      >
        <dbf-counter></dbf-counter>
      </dbf-card>
    </section>
  `;
}
