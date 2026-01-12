import { getStrings } from "dbf-core";
import componentsPageStyles from "../components/components-page.css?inline";

export function renderComponents(root: HTMLElement) {
  try {
    const dict = getStrings().componentsPage;

    root.innerHTML = `
    <style>${componentsPageStyles}</style>
    <section class="components-page" id="components">
      <div class="components-header">
        <h1>${dict.title}</h1>
        <p>${dict.subtitle}</p>
      </div>

      <div class="components-grid">
        <!-- Basic Components -->
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

        <dbf-card
          title="${dict.inputTitle}"
          description="${dict.inputDescription}"
          imageUrl="https://vitejs.dev/logo.svg"
        >
          <dbf-input placeholder="Enter text..." type="text"></dbf-input>
          <dbf-input placeholder="Enter email..." type="email"></dbf-input>
        </dbf-card>

        <dbf-card
          title="${dict.statTitle}"
          description="${dict.statDescription}"
          imageUrl="https://vitejs.dev/logo.svg"
        >
          <dbf-stat
            label="Lightweight"
            value="< 5 KB"
            hint="minified, gzip"
            imageUrl="https://vitejs.dev/logo.svg"
          ></dbf-stat>
        </dbf-card>

        <!-- Hooks Examples -->
        <dbf-card
          title="${dict.hooksTitle}"
          description="${dict.hooksDescription}"
          imageUrl="https://vitejs.dev/logo.svg"
        >
          <demo-use-state></demo-use-state>
          <demo-use-effect></demo-use-effect>
          <demo-use-memo></demo-use-memo>
          <demo-use-callback></demo-use-callback>
          <demo-use-reducer></demo-use-reducer>
        </dbf-card>

        <!-- Context API -->
        <dbf-card
          title="${dict.contextTitle}"
          description="${dict.contextDescription}"
          imageUrl="https://vitejs.dev/logo.svg"
        >
          <demo-theme-provider>
            <demo-theme-consumer></demo-theme-consumer>
            <demo-theme-consumer></demo-theme-consumer>
          </demo-theme-provider>
        </dbf-card>

        <!-- Error Boundary -->
        <dbf-card
          title="${dict.errorBoundaryTitle}"
          description="${dict.errorBoundaryDescription}"
          imageUrl="https://vitejs.dev/logo.svg"
        >
          <demo-error-boundary></demo-error-boundary>
        </dbf-card>
      </div>
    </section>
  `;
  } catch (error) {
    console.error("Error rendering components page:", error);
    root.innerHTML = `
      <section class="components-page" id="components">
        <div class="components-header">
          <h1>Error</h1>
          <p>Failed to load components page. Check console for details.</p>
          <pre>${String(error)}</pre>
        </div>
      </section>
    `;
  }
}
