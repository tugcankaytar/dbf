import { html, render } from "dbf-core";

export function renderProfile(root: HTMLElement) {
  render(
    root,
    html`
      <div class="page-stack">
        <dbf-mobile-card>
          <h2>Tugcan Kaytar</h2>
          <p>Mobil UI demo profili. Routing ile gecis yapiliyor.</p>
        </dbf-mobile-card>

        <dbf-mobile-list>
          <dbf-mobile-list-item>E-posta: tugcan@databank.com</dbf-mobile-list-item>
          <dbf-mobile-list-item>Plan: Starter</dbf-mobile-list-item>
          <dbf-mobile-list-item>Bildirimler: Acik</dbf-mobile-list-item>
        </dbf-mobile-list>
      </div>
    `
  );
}
