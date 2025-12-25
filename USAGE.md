# DBF Framework - Usage Guide

Bu dokümantasyon, DBF framework'ünü başka bir projede nasıl kullanabileceğinizi açıklar.

## 📦 Kurulum Seçenekleri

### Seçenek 1: npm Publish (Production - Önerilen)

Paketleri npm registry'ye publish edip standart şekilde kullanabilirsiniz.

#### 1.1. Paketleri Publish Etme

```bash
# npm'e login olun (ilk kez)
npm login

# dbf-core'u publish edin
cd packages/dbf-core
npm publish

# dbf-router'ı publish edin (dbf-core'a bağımlı)
cd ../dbf-router
npm publish
```

**Not:** Eğer paket isimleri zaten alınmışsa, `package.json` dosyalarında `name` alanını değiştirmeniz gerekebilir (örn: `@your-org/dbf-core`).

#### 1.2. Başka Bir Projede Kullanım

```bash
# Yeni projenizde
npm install dbf-core dbf-router
```

```typescript
// Örnek kullanım
import { defineComponent, html } from "dbf-core";
import { createRouter, enableLinkNavigation } from "dbf-router";
```

---

### Seçenek 2: npm Link (Local Development)

Geliştirme aşamasında local olarak test etmek için `npm link` kullanabilirsiniz.

#### 2.1. Paketleri Link Etme

```bash
# DBF monorepo'sunda
cd packages/dbf-core
npm link

cd ../dbf-router
npm link
npm link dbf-core  # dbf-router'ın dbf-core'a bağımlılığını çözmek için
```

#### 2.2. Başka Bir Projede Kullanım

```bash
# Yeni projenizde
npm link dbf-core dbf-router
```

**Not:** `npm link` kullandığınızda, paketlerde yaptığınız değişiklikler otomatik olarak yeni projeye yansır (build gerekir).

---

### Seçenek 3: Local File Path (Monorepo)

Eğer tüm projeleriniz aynı monorepo içindeyse, doğrudan dosya yolu kullanabilirsiniz.

#### 3.1. Yeni Projenizin package.json'u

```json
{
  "name": "my-app",
  "type": "module",
  "dependencies": {
    "dbf-core": "file:../../packages/dbf-core",
    "dbf-router": "file:../../packages/dbf-router"
  }
}
```

```bash
npm install
```

---

### Seçenek 4: Git Repository (Private/Public)

Paketleri Git repository'de tutup doğrudan oradan kullanabilirsiniz.

#### 4.1. package.json'da Git URL

```json
{
  "dependencies": {
    "dbf-core": "git+https://github.com/your-org/dbf.git#packages/dbf-core",
    "dbf-router": "git+https://github.com/your-org/dbf.git#packages/dbf-router"
  }
}
```

**Not:** Bu yöntem için paketlerin `package.json` dosyalarında doğru `name` ve `version` olmalı.

---

## 🚀 Hızlı Başlangıç

### 1. Yeni Proje Oluşturma

```bash
# Vite ile yeni proje
npm create vite@latest my-dbf-app -- --template vanilla-ts
cd my-dbf-app
npm install
```

### 2. DBF Paketlerini Kurma

```bash
# Seçenek 1: npm'den (publish edildikten sonra)
npm install dbf-core dbf-router

# Seçenek 2: npm link ile
npm link dbf-core dbf-router

# Seçenek 3: Local path ile
npm install file:../../packages/dbf-core file:../../packages/dbf-router
```

### 3. İlk Component Oluşturma

```typescript
// src/my-component.ts
import { defineComponent, html } from "dbf-core";
import styles from "./my-component.css?inline";

defineComponent("my-component", {
  styles,
  render({ html }) {
    return html`<div>Hello DBF!</div>`;
  },
});
```

### 4. Router Kurulumu

```typescript
// src/router.ts
import { createRouter, enableLinkNavigation } from "dbf-router";

const root = document.querySelector("#app");
if (!root) throw new Error("Root element not found");

const router = createRouter({
  routes: [
    { path: "/", onEnter: () => { root.innerHTML = "<my-component></my-component>"; } },
    { path: "/about", onEnter: () => { root.innerHTML = "<h1>About</h1>"; } },
  ],
});

enableLinkNavigation(router);
router.start();
```

### 5. HTML'de Kullanım

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="/src/router.ts"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

---

## 📝 TypeScript Yapılandırması

### Vite Projeleri İçin

`vite.config.ts` dosyanızda özel bir yapılandırma gerekmez. DBF paketleri ESM ve CJS formatlarını destekler.

### CSS Import Desteği

CSS dosyalarını `?inline` query parametresi ile import edebilirsiniz:

```typescript
import styles from "./component.css?inline";
```

**Not:** Eğer TypeScript hatası alırsanız, `src/css-inline.d.ts` dosyası oluşturun:

```typescript
declare module "*.css?inline" {
  const content: string;
  export default content;
}
```

Ya da `dbf-core` paketini kullandığınızda bu tip tanımı otomatik gelir.

---

## 🔧 Build ve Development

### Development Mode

```bash
# DBF paketlerini watch mode'da build et
cd packages/dbf-core
npm run dev  # Watch mode

# Yeni projenizde
npm run dev
```

### Production Build

```bash
# DBF paketlerini build et
cd packages/dbf-core
npm run build

cd ../dbf-router
npm run build

# Yeni projenizde
npm run build
```

---

## 📚 Daha Fazla Bilgi

- `packages/dbf-core/README.md` - DBF Core dokümantasyonu
- `packages/dbf-router/README.md` - DBF Router dokümantasyonu
- `apps/demo/` - Örnek uygulama

---

## ❓ Sorun Giderme

### "Cannot find module 'dbf-core'"

- Paketlerin build edildiğinden emin olun: `cd packages/dbf-core && npm run build`
- `node_modules` klasörünü silip tekrar `npm install` yapın

### TypeScript Tip Hataları

- `dbf-core` ve `dbf-router` paketlerinin `dist/index.d.ts` dosyalarının mevcut olduğundan emin olun
- TypeScript cache'ini temizleyin: `rm -rf node_modules/.cache`

### CSS Import Hataları

- Vite kullanıyorsanız, `?inline` query parametresi otomatik çalışır
- TypeScript tip tanımı için `css-inline.d.ts` dosyası oluşturun (yukarıya bakın)

