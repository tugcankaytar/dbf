export function renderComponents(root: HTMLElement) {
  root.innerHTML = `
    <section class="hero-preview" id="components">
      <dbf-card
        title="dbf-card"
        description="A simple card component composed with DBF Core."
        imageUrl="https://vitejs.dev/logo.svg"
      >
        <dbf-input placeholder="Title" type="text"></dbf-input>
        <dbf-input placeholder="Description" type="text"></dbf-input>
      </dbf-card>

      <dbf-card
        title="Counter demo"
        description="State and events without a virtual DOM."
        imageUrl="https://vitejs.dev/logo.svg"
      >
        <dbf-counter></dbf-counter>
      </dbf-card>
    </section>
  `;
}
