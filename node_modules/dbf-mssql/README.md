## DBF MSSQL (`dbf-mssql`)

**Server-side** MSSQL helpers for Node.js:

- Load connection settings from `.env` / `process.env`
- Create and reuse a connection pool
- Execute **stored procedures** (and raw queries if needed)

This package is intentionally **self-contained**: it ships with `mssql` and `dotenv` so consumers do not need to install extra dependencies.

---

## Installation

```bash
npm install dbf-mssql
```

> `dbf-mssql` is **Node.js-only** (do not bundle it into the browser).

---

## Environment variables

By default, `dbf-mssql` reads variables with the `DBF_MSSQL_` prefix.

Required:

- `DBF_MSSQL_SERVER`
- `DBF_MSSQL_DATABASE`
- `DBF_MSSQL_USER`
- `DBF_MSSQL_PASSWORD`

Optional:

- `DBF_MSSQL_PORT`
- `DBF_MSSQL_ENCRYPT` (default: `true`)
- `DBF_MSSQL_TRUST_SERVER_CERTIFICATE` (default: `false`)
- `DBF_MSSQL_REQUEST_TIMEOUT_MS`
- `DBF_MSSQL_CONNECT_TIMEOUT_MS`
- `DBF_MSSQL_POOL_MAX`
- `DBF_MSSQL_POOL_MIN`
- `DBF_MSSQL_POOL_IDLE_TIMEOUT_MS`

Example `.env`:

```env
DBF_MSSQL_SERVER=localhost
DBF_MSSQL_DATABASE=MyDb
DBF_MSSQL_USER=sa
DBF_MSSQL_PASSWORD=YourStrong(!)Password

# optional
DBF_MSSQL_PORT=1433
DBF_MSSQL_ENCRYPT=true
DBF_MSSQL_TRUST_SERVER_CERTIFICATE=true
DBF_MSSQL_REQUEST_TIMEOUT_MS=30000
DBF_MSSQL_CONNECT_TIMEOUT_MS=15000
DBF_MSSQL_POOL_MAX=10
DBF_MSSQL_POOL_MIN=0
DBF_MSSQL_POOL_IDLE_TIMEOUT_MS=30000
```

Custom prefix:

`createMssqlClientFromEnv({ prefix: "MYAPP_MSSQL_" })`

---

## Quick start: execute a stored procedure (one-shot)

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

`execProcFromEnv(...)` creates a client, executes the proc, then closes the pool.

---

## Reuse the pool with a client

```ts
import { createMssqlClientFromEnv } from "dbf-mssql";

const client = createMssqlClientFromEnv();

const r1 = await client.execProc("dbo.MyProc", { UserId: 123 });
const r2 = await client.query("select 1 as ok");

await client.close();
```

---

## Typed input params

If you need to force a SQL type, use `param(value, type)` and `sql.*` types:

```ts
import { execProcFromEnv, param, sql } from "dbf-mssql";

await execProcFromEnv("dbo.SaveUser", {
  Id: param(123, sql.Int),
  Name: param("Ada", sql.NVarChar(50)),
  Bio: param("...", sql.NVarChar(sql.MAX)),
});
```

---

## API

- `mssqlConfigFromEnv(options?)`: load + validate config from env (optionally calls `dotenv.config()`)
- `createMssqlClientFromEnv(envOptions?, clientOptions?)`: create a `DbfMssqlClient` from env
- `execProcFromEnv(procName, inputs?, outputs?, envOptions?)`: execute proc and close pool
- `DbfMssqlClient`: `connect()`, `close()`, `query()`, `execProc()`
- `param(value, type?)`: build a typed input param
- `sql`: normalized `mssql` module exports (works in ESM and CJS)

---

## Security / architecture note

Do not connect to MSSQL from the browser. Use:

- **Frontend** → calls your backend API
- **Backend (Node.js)** → uses `dbf-mssql` to run procs/queries

