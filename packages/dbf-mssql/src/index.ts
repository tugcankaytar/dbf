import dotenv from "dotenv";
import * as sqlImport from "mssql";

/**
 * `mssql` is CommonJS. When consumed from ESM, its exports may appear under `default`.
 * Normalize it so `sql.ConnectionPool` works reliably in both ESM and CJS runtimes.
 */
export const sql = ((sqlImport as any).default ?? sqlImport) as typeof import("mssql");

export type DbfMssqlConfig = import("mssql").config;

export type DbfMssqlEnvOptions = {
  /**
   * Env var prefix. Defaults to `DBF_MSSQL_`.
   * Example: `DBF_MSSQL_SERVER`, `DBF_MSSQL_DATABASE`, ...
   */
  prefix?: string;
  /**
   * By default this package calls `dotenv.config()` when building config from env.
   * Set `loadDotenv: false` if you load dotenv yourself.
   */
  loadDotenv?: boolean;
  /**
   * Optional `.env` path passed to `dotenv.config({ path })`.
   */
  dotenvPath?: string;
  /**
   * Override env source (useful for tests).
   */
  env?: NodeJS.ProcessEnv;
};

export type DbfMssqlClientOptions = {
  /**
   * If true, `client.connect()` is executed inside the constructor (fire-and-forget).
   * Default: false (lazy connect on first use).
   */
  eager?: boolean;
  /**
   * Optional hook for lightweight logging/telemetry.
   */
  log?: (event: DbfMssqlLogEvent) => void;
};

export type DbfMssqlTypedParam = {
  value: unknown;
  /**
   * Prefer passing a fully constructed type, e.g. `sql.VarChar(50)` / `sql.NVarChar(sql.MAX)`.
   * You can also pass a factory like `sql.Int`.
   */
  type?: import("mssql").ISqlTypeFactory | import("mssql").ISqlType;
};

export type DbfMssqlOutputParam = {
  /**
   * Prefer passing a fully constructed type, e.g. `sql.VarChar(50)` / `sql.NVarChar(sql.MAX)`.
   * You can also pass a factory like `sql.Int`.
   */
  type: import("mssql").ISqlTypeFactory | import("mssql").ISqlType;
};

export type DbfMssqlInputs = Record<string, unknown>;
export type DbfMssqlOutputs = Record<string, DbfMssqlOutputParam>;

export type DbfMssqlLogEvent =
  | { type: "connect"; elapsedMs: number }
  | { type: "connect:error"; elapsedMs: number; error: unknown }
  | { type: "query"; sqlText: string; elapsedMs: number }
  | { type: "query:error"; sqlText: string; elapsedMs: number; error: unknown }
  | { type: "execProc"; procName: string; elapsedMs: number }
  | { type: "execProc:error"; procName: string; elapsedMs: number; error: unknown }
  | { type: "transaction"; elapsedMs: number }
  | { type: "transaction:error"; elapsedMs: number; error: unknown };

/**
 * Helper to create a typed input param.
 *
 * Example:
 * `Name: param("Ada", sql.NVarChar(50))`
 */
export function param(
  value: unknown,
  type?: import("mssql").ISqlTypeFactory | import("mssql").ISqlType
): DbfMssqlTypedParam {
  return { value, type };
}

function isTypedParam(param: unknown): param is DbfMssqlTypedParam {
  return param != null && typeof param === "object" && "value" in (param as any);
}

function getPrefix(options?: DbfMssqlEnvOptions): string {
  return options?.prefix ?? "DBF_MSSQL_";
}

function asKey(prefix: string, suffix: string): string {
  return `${prefix}${suffix}`;
}

function isTruthy(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "y" || v === "on";
}

function isFalsy(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "0" || v === "false" || v === "no" || v === "n" || v === "off";
}

function parseBool(value: string, keyName: string): boolean {
  if (isTruthy(value)) return true;
  if (isFalsy(value)) return false;
  throw new Error(
    `Invalid boolean value for ${keyName}. Expected one of: true/false, 1/0, yes/no, on/off.`
  );
}

function parseIntStrict(value: string, keyName: string): number {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid number value for ${keyName}.`);
  }
  return n;
}

function requiredEnv(env: NodeJS.ProcessEnv, keyName: string): string {
  const value = env[keyName];
  if (value == null || value.trim() === "") {
    // Important: do not include secret values in errors; we only mention the key name.
    throw new Error(`Missing required env var: ${keyName}`);
  }
  return value;
}

function optionalEnv(env: NodeJS.ProcessEnv, keyName: string): string | undefined {
  const value = env[keyName];
  if (value == null || value.trim() === "") return undefined;
  return value;
}

/**
 * Reads MSSQL config from environment variables (optionally loading `.env` via `dotenv`).
 *
 * Required (default prefix `DBF_MSSQL_`):
 * - SERVER
 * - DATABASE
 * - USER
 * - PASSWORD
 */
export function mssqlConfigFromEnv(options: DbfMssqlEnvOptions = {}): DbfMssqlConfig {
  const prefix = getPrefix(options);

  if (options.loadDotenv !== false) {
    if (options.dotenvPath) dotenv.config({ path: options.dotenvPath });
    else dotenv.config();
  }

  const env = options.env ?? process.env;

  const server = requiredEnv(env, asKey(prefix, "SERVER"));
  const database = requiredEnv(env, asKey(prefix, "DATABASE"));
  const user = requiredEnv(env, asKey(prefix, "USER"));
  const password = requiredEnv(env, asKey(prefix, "PASSWORD"));

  const portStr = optionalEnv(env, asKey(prefix, "PORT"));
  const encryptStr = optionalEnv(env, asKey(prefix, "ENCRYPT"));
  const trustStr = optionalEnv(env, asKey(prefix, "TRUST_SERVER_CERTIFICATE"));

  const connectTimeoutMsStr = optionalEnv(env, asKey(prefix, "CONNECT_TIMEOUT_MS"));
  const requestTimeoutMsStr = optionalEnv(env, asKey(prefix, "REQUEST_TIMEOUT_MS"));

  const poolMaxStr = optionalEnv(env, asKey(prefix, "POOL_MAX"));
  const poolMinStr = optionalEnv(env, asKey(prefix, "POOL_MIN"));
  const poolIdleMsStr = optionalEnv(env, asKey(prefix, "POOL_IDLE_TIMEOUT_MS"));

  const config: DbfMssqlConfig = {
    server,
    database,
    user,
    password,
    options: {
      encrypt: encryptStr ? parseBool(encryptStr, asKey(prefix, "ENCRYPT")) : true,
      trustServerCertificate: trustStr
        ? parseBool(trustStr, asKey(prefix, "TRUST_SERVER_CERTIFICATE"))
        : false
    }
  };

  if (portStr) config.port = parseIntStrict(portStr, asKey(prefix, "PORT"));
  if (connectTimeoutMsStr)
    config.connectionTimeout = parseIntStrict(
      connectTimeoutMsStr,
      asKey(prefix, "CONNECT_TIMEOUT_MS")
    );
  if (requestTimeoutMsStr)
    config.requestTimeout = parseIntStrict(
      requestTimeoutMsStr,
      asKey(prefix, "REQUEST_TIMEOUT_MS")
    );

  if (poolMaxStr || poolMinStr || poolIdleMsStr) {
    config.pool = {
      ...(config.pool ?? {}),
      ...(poolMaxStr ? { max: parseIntStrict(poolMaxStr, asKey(prefix, "POOL_MAX")) } : {}),
      ...(poolMinStr ? { min: parseIntStrict(poolMinStr, asKey(prefix, "POOL_MIN")) } : {}),
      ...(poolIdleMsStr
        ? { idleTimeoutMillis: parseIntStrict(poolIdleMsStr, asKey(prefix, "POOL_IDLE_TIMEOUT_MS")) }
        : {})
    };
  }

  return config;
}

function applyInput(request: import("mssql").Request, name: string, param: unknown): void {
  if (isTypedParam(param)) {
    const p = param;
    if (p.type) {
      request.input(name, p.type as any, p.value as any);
      return;
    }
    request.input(name, p.value as any);
    return;
  }

  request.input(name, param as any);
}

function applyOutput(request: import("mssql").Request, name: string, param: DbfMssqlOutputParam): void {
  // mssql output signature overloads vary; keep it simple and rely on types.
  request.output(name, param.type as any);
}

export class DbfMssqlClient {
  private readonly config: DbfMssqlConfig;
  private readonly log?: (event: DbfMssqlLogEvent) => void;
  private poolPromise: Promise<import("mssql").ConnectionPool> | null = null;

  constructor(config: DbfMssqlConfig, options: DbfMssqlClientOptions = {}) {
    this.config = config;
    this.log = options.log;
    if (options.eager) void this.connect();
  }

  /**
   * Ensures the underlying connection pool is created + connected.
   */
  async connect(): Promise<import("mssql").ConnectionPool> {
    if (this.poolPromise) return this.poolPromise;

    this.poolPromise = (async () => {
      const started = Date.now();
      const pool = new sql.ConnectionPool(this.config);
      // If connect fails, reset promise so caller can retry after fixing env/config.
      try {
        await pool.connect();
        this.log?.({ type: "connect", elapsedMs: Date.now() - started });
        return pool;
      } catch (err) {
        this.log?.({ type: "connect:error", elapsedMs: Date.now() - started, error: err });
        try {
          pool.close();
        } catch {
          // ignore
        }
        this.poolPromise = null;
        throw err;
      }
    })();

    return this.poolPromise;
  }

  /**
   * Closes the connection pool (if created).
   */
  async close(): Promise<void> {
    const p = this.poolPromise;
    this.poolPromise = null;
    if (!p) return;
    const pool = await p;
    await pool.close();
  }

  /**
   * Executes a raw SQL query with optional input parameters.
   */
  async query<TRecord = any>(
    sqlText: string,
    inputs: DbfMssqlInputs = {}
  ): Promise<import("mssql").IResult<TRecord>> {
    const pool = await this.connect();
    const request = pool.request();
    for (const [name, value] of Object.entries(inputs)) applyInput(request, name, value);
    const started = Date.now();
    try {
      const result = await request.query<TRecord>(sqlText);
      this.log?.({ type: "query", sqlText, elapsedMs: Date.now() - started });
      return result;
    } catch (err) {
      this.log?.({ type: "query:error", sqlText, elapsedMs: Date.now() - started, error: err });
      throw err;
    }
  }

  /**
   * Executes a stored procedure.
   *
   * Returns the underlying `mssql` execute result (recordsets, output params, returnValue).
   */
  async execProc<TRecord = any>(
    procName: string,
    inputs: DbfMssqlInputs = {},
    outputs: DbfMssqlOutputs = {}
  ): Promise<import("mssql").IProcedureResult<TRecord>> {
    const pool = await this.connect();
    const request = pool.request();
    for (const [name, value] of Object.entries(inputs)) applyInput(request, name, value);
    for (const [name, value] of Object.entries(outputs)) applyOutput(request, name, value);
    const started = Date.now();
    try {
      const result = await request.execute<TRecord>(procName);
      this.log?.({ type: "execProc", procName, elapsedMs: Date.now() - started });
      return result;
    } catch (err) {
      this.log?.({ type: "execProc:error", procName, elapsedMs: Date.now() - started, error: err });
      throw err;
    }
  }

  /**
   * Executes a simple `select 1` to verify connectivity.
   */
  async ping(): Promise<boolean> {
    try {
      const result = await this.query("select 1 as ok");
      return result.recordset?.[0]?.ok === 1;
    } catch {
      return false;
    }
  }

  /**
   * Runs a function inside a SQL transaction (auto commit/rollback).
   */
  async withTransaction<T>(
    fn: (tx: import("mssql").Transaction) => Promise<T>
  ): Promise<T> {
    const pool = await this.connect();
    const started = Date.now();
    const tx = new sql.Transaction(pool);
    try {
      await tx.begin();
      const result = await fn(tx);
      await tx.commit();
      this.log?.({ type: "transaction", elapsedMs: Date.now() - started });
      return result;
    } catch (err) {
      try {
        await tx.rollback();
      } catch {
        // ignore rollback errors
      }
      this.log?.({ type: "transaction:error", elapsedMs: Date.now() - started, error: err });
      throw err;
    }
  }
}

/**
 * Convenience helper: create a `DbfMssqlClient` using `.env` / `process.env`.
 */
export function createMssqlClientFromEnv(
  envOptions: DbfMssqlEnvOptions = {},
  clientOptions: DbfMssqlClientOptions = {}
): DbfMssqlClient {
  const config = mssqlConfigFromEnv(envOptions);
  return new DbfMssqlClient(config, clientOptions);
}

/**
 * Convenience helper: execute a stored procedure using `.env` / `process.env`,
 * then close the connection pool.
 */
export async function execProcFromEnv<TRecord = any>(
  procName: string,
  inputs: DbfMssqlInputs = {},
  outputs: DbfMssqlOutputs = {},
  envOptions: DbfMssqlEnvOptions = {}
): Promise<import("mssql").IProcedureResult<TRecord>> {
  const client = createMssqlClientFromEnv(envOptions);
  try {
    return await client.execProc<TRecord>(procName, inputs, outputs);
  } finally {
    await client.close();
  }
}

