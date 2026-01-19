import { html, render } from "dbf-core";

export function renderSettings(root: HTMLElement) {
  render(
    root,
    html`
      <div class="page-stack">
        <dbf-mobile-card>
          <h2>Profil ayarlari</h2>
          <p>Input componenti value-change eventi uretir.</p>
        </dbf-mobile-card>

        <div class="page-actions">
          <dbf-mobile-input
            id="name-input"
            label="Gorunen ad"
            placeholder="Orn: Dbf Mobile"
          ></dbf-mobile-input>
          <dbf-mobile-button variant="secondary">Kaydet</dbf-mobile-button>
          <div>
            <span class="badge">Preview:</span>
            <strong id="name-preview">-</strong>
          </div>
        </div>
      </div>
    `
  );

  const input = root.querySelector<HTMLElement>("#name-input");
  const preview = root.querySelector<HTMLElement>("#name-preview");

  if (input && preview) {
    input.addEventListener("value-change", (event) => {
      const detail = (event as CustomEvent<{ value: string }>).detail;
      preview.textContent = detail?.value || "-";
    });
  }
}
