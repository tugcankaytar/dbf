import componentsPageStyles from "../components/components-page.css?inline";

export function renderDataFetch(root: HTMLElement) {

  root.innerHTML = `
    <style>${componentsPageStyles}</style>
    <section class="components-page" id="data-fetch">
      <div class="components-header">
        <h1>Data Fetching Demo</h1>
        <p>This page demonstrates how to use hooksContext vs setCount for data fetching</p>
      </div>

      <div class="components-grid">
        <dbf-card
          title="Data Fetching Example"
          description="Shows the difference between using setCount in useEffect (render context) and hooksContext in event handlers (mount context)"
          imageUrl="https://vitejs.dev/logo.svg"
        >
          <demo-data-fetch></demo-data-fetch>
        </dbf-card>
      </div>
    </section>
  `;
}

