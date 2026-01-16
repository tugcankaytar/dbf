## DBF Monorepo

Bu repo **DBF** ekosistemini içerir: Web Components tabanlı “HTML-first” UI yaklaşımı + minimal router + Node.js tarafında MSSQL yardımcıları.

- **Amaç**: Framework’e bağımlı olmadan (React/Vue şart koşmadan) **küçük, anlaşılır ve modüler** bir geliştirme deneyimi sunmak.
- **Çıkış formatları**: Paketler `tsup` ile **ESM + CJS + d.ts** üretecek şekilde build edilir.

---

## 1) Önkoşullar

- **Node.js**: `>= 18`
- **npm**: workspace desteği olan güncel sürüm

---

## 2) Repository yapısı

- **Root**
  - `package.json`: npm workspaces + root script’ler
  - `tsconfig.base.json`: ortak TypeScript ayarları
  - `README.md`: bu doküman
  - `USAGE.md`: monorepo dışından kullanım alternatifleri (npm publish / link / file)

- **Packages** (`packages/*`)
  - `packages/dbf-core` → publish adı: `dbf-core`
  - `packages/dbf-router` → publish adı: `dbf-router`
  - `packages/dbf-mssql` → publish adı: `dbf-mssql`

- **Apps** (`apps/*`)
  - `apps/demo`: DBF Core + DBF Router kullanımını gösteren Vite demo

---

## 3) Paketler (overview)

| Paket | Nerede çalışır? | Ne sağlar? | Doküman |
| --- | --- | --- | --- |
| `dbf-core` | Browser (Custom Elements) | Component tanımı, props/state/render, event delegation, shadow DOM style | `packages/dbf-core/README.md` |
| `dbf-router` | Browser | Minimal SPA router (`createRouter`, `enableLinkNavigation`) | `packages/dbf-router/README.md` |
| `dbf-mssql` | **Node.js (server)** | `.env` ile MSSQL pool + query/proc helpers (`execProcFromEnv`, `DbfMssqlClient`) | `packages/dbf-mssql/README.md` |

> Not: `dbf-mssql` tarayıcıda çalışmaz. Frontend → backend API çağrısı şeklinde kullanılmalıdır.

---

## 4) Hızlı başlangıç (local development)

Repo kökünden:

```bash
# Workspace dependency’lerini yükle
npm install

# Paketleri build et (dist + d.ts üretir)
npm run build:core
npm run build:router
npm run build:mssql
```

### 4.1 Demo uygulamasını çalıştırma

```bash
cd apps/demo
npm install
npm run dev
```

Vite’ın verdiği URL’i (genelde `http://localhost:5173`) aç.

---

## 5) Geliştirme döngüsü (DX)

### 5.1 Watch mode (paket geliştirirken)

```bash
# ayrı terminallerde
npm run dev:core
npm run dev:router
npm run dev:mssql
```

> DBF paketleri `dist/` altında çıktılar ürettiği için, dış projede kullanıyorsanız watch sırasında **consumer uygulamanın da** yeniden derleme/yenileme ihtiyacı olabilir.

### 5.2 Build çıktısı (paketler)

Her paket:
- `dist/index.js` (ESM)
- `dist/index.cjs` (CJS)
- `dist/index.d.ts` + `dist/index.d.cts` (TypeScript types)

---

## 6) Monorepo dışından kullanım

Detaylı seçenekler için `USAGE.md`’ye bakın. Kısa özet:

- **Local file path** (en basit):
  - `package.json` → `"dbf-mssql": "file:/absolute/or/relative/path"`
  - sonra `npm install`
- **npm link** (local dev için):
  - pakette `npm link`
  - consumer projede `npm link dbf-mssql`
- **npm publish** (prod):
  - `packages/<pkg>` içinde `npm publish`

---

## 7) `dbf-mssql` için mimari not (önemli)

`dbf-mssql` **Node.js** tarafında çalışır. Doğru mimari:

- **Backend**: `dbf-mssql` ile MSSQL’e bağlanır ve proc/query çalıştırır.
- **Frontend**: backend’deki endpoint’e `fetch`/`axios` ile istek atar.

Tarayıcıda direkt DB bağlantısı:
- **Güvenli değildir** (credential sızıntısı)
- Teknik olarak da sorunludur (driver/Buffer vb.)

---

## 8) Script’ler

Repo kökünden:

- **`npm run build:core`**: `dbf-core` build
- **`npm run dev:core`**: `dbf-core` watch build
- **`npm run build:router`**: `dbf-router` build
- **`npm run dev:router`**: `dbf-router` watch build
- **`npm run build:mssql`**: `dbf-mssql` build
- **`npm run dev:mssql`**: `dbf-mssql` watch build

Demo içinde (`apps/demo`):

- **`npm run dev`**: Vite dev server
- **`npm run build`**: production build
- **`npm run preview`**: build’i serve et

---

## 9) Durum

Bu repo aktif gelişiyor. API’ler (özellikle `dbf-core` / `dbf-router`) gerçek kullanım arttıkça sadeleşebilir veya genişleyebilir.

Geri bildirim/iyileştirme önerileri için paket README’lerindeki örnekleri referans alarak issue/PR açmanız en hızlı yol.
