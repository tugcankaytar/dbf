import { html, render } from "dbf-core";

export function renderHome(root: HTMLElement) {
  render(
    root,
    html`
      <div class="page-stack">
        <dbf-mobile-card>
          <div class="badge">MVP</div>
          <h2>Mobile-first components</h2>
          <p>DBF Core + DBF Router ile calisan temel mobil UI seti.</p>
        </dbf-mobile-card>

        <dbf-mobile-list>
          <dbf-mobile-list-item>Hizli sayfa gecisleri</dbf-mobile-list-item>
          <dbf-mobile-list-item>Shadow DOM izolasyonu</dbf-mobile-list-item>
          <dbf-mobile-list-item>Basit, temiz API</dbf-mobile-list-item>
        </dbf-mobile-list>

        <dbf-mobile-button>Primary action</dbf-mobile-button>
      </div>
    `
  );
}
