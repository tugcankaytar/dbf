import { getStrings } from "dbf-core";

export function renderDocs(root: HTMLElement) {
  const dict = getStrings().docs;

  root.innerHTML = `
    <section class="newsletter">
      <h2>${dict.title}</h2>
      <p>
        ${dict.body}
      </p>
    </section>
  `;
}
