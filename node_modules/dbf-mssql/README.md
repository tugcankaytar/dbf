# DBF MSSQL (`dbf-mssql`)

Node.js için **.env tabanlı** MSSQL bağlantısı ve **stored procedure** çalıştırma yardımcıları.

Bu paket `dotenv` ve `mssql` bağımlılıklarını **kendi içinde** getirir — kullanıcı tarafında ekstra paket kurmanız gerekmez.

---

## 1) Kurulum

```bash
npm install dbf-mssql
```

> Not: Bu paket **Node.js** içindir (browser/Vite frontend içinde direkt çalışmaz).

---

## 2) `.env` (örnek)

Projenizin köküne `.env` koyun:

```env
DBF_MSSQL_SERVER=localhost
DBF_MSSQL_DATABASE=MyDb
DBF_MSSQL_USER=sa
DBF_MSSQL_PASSWORD=YourStrong(!)Password

# opsiyonel
DBF_MSSQL_PORT=1433
DBF_MSSQL_ENCRYPT=true
DBF_MSSQL_TRUST_SERVER_CERTIFICATE=true
DBF_MSSQL_REQUEST_TIMEOUT_MS=30000
DBF_MSSQL_CONNECT_TIMEOUT_MS=15000
DBF_MSSQL_POOL_MAX=10
DBF_MSSQL_POOL_MIN=0
DBF_MSSQL_POOL_IDLE_TIMEOUT_MS=30000
```

Prefix değiştirmek isterseniz: `createMssqlClientFromEnv({ prefix: "MYAPP_MSSQL_" })`

---

## 3) Hızlı kullanım (proc çalıştır)

```ts
import { execProcFromEnv, param, sql } from "dbf-mssql";

const result = await execProcFromEnv("dbo.MyProc", {
  UserId: 123,
  Name: param("Ada", sql.NVarChar(50)),
});

console.log(result.recordset);
console.log(result.output);
console.log(result.returnValue);
```

---

## 4) Client ile (pool reuse)

```ts
import { createMssqlClientFromEnv } from "dbf-mssql";

const client = createMssqlClientFromEnv();

const r1 = await client.execProc("dbo.MyProc", { UserId: 123 });
const r2 = await client.query("select 1 as ok");

await client.close();
```

---

## 5) API

- `mssqlConfigFromEnv(options?)`: `.env` / `process.env` → `mssql` config üretir (validate eder)
- `createMssqlClientFromEnv(envOptions?, clientOptions?)`: env’den config ile client oluşturur
- `execProcFromEnv(procName, inputs?, outputs?, envOptions?)`: tek seferlik proc çalıştırır ve pool’u kapatır
- `DbfMssqlClient`: `connect()`, `close()`, `query()`, `execProc()`
- `sql`: `mssql` tipleri (`sql.Int`, `sql.NVarChar(50)` vb.)

