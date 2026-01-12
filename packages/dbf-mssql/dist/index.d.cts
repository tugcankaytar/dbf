import * as sql from 'mssql';
export { sql };

type DbfMssqlConfig = sql.config;
type DbfMssqlEnvOptions = {
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
type DbfMssqlClientOptions = {
    /**
     * If true, `client.connect()` is executed inside the constructor (fire-and-forget).
     * Default: false (lazy connect on first use).
     */
    eager?: boolean;
};
type DbfMssqlTypedParam = {
    value: unknown;
    /**
     * Prefer passing a fully constructed type, e.g. `sql.VarChar(50)` / `sql.NVarChar(sql.MAX)`.
     * You can also pass a factory like `sql.Int`.
     */
    type?: sql.ISqlTypeFactory | sql.ISqlType;
};
type DbfMssqlOutputParam = {
    /**
     * Prefer passing a fully constructed type, e.g. `sql.VarChar(50)` / `sql.NVarChar(sql.MAX)`.
     * You can also pass a factory like `sql.Int`.
     */
    type: sql.ISqlTypeFactory | sql.ISqlType;
};
type DbfMssqlInputs = Record<string, unknown>;
type DbfMssqlOutputs = Record<string, DbfMssqlOutputParam>;
/**
 * Helper to create a typed input param.
 *
 * Example:
 * `Name: param("Ada", sql.NVarChar(50))`
 */
declare function param(value: unknown, type?: sql.ISqlTypeFactory | sql.ISqlType): DbfMssqlTypedParam;
/**
 * Reads MSSQL config from environment variables (optionally loading `.env` via `dotenv`).
 *
 * Required (default prefix `DBF_MSSQL_`):
 * - SERVER
 * - DATABASE
 * - USER
 * - PASSWORD
 */
declare function mssqlConfigFromEnv(options?: DbfMssqlEnvOptions): DbfMssqlConfig;
declare class DbfMssqlClient {
    private readonly config;
    private poolPromise;
    constructor(config: DbfMssqlConfig, options?: DbfMssqlClientOptions);
    /**
     * Ensures the underlying connection pool is created + connected.
     */
    connect(): Promise<sql.ConnectionPool>;
    /**
     * Closes the connection pool (if created).
     */
    close(): Promise<void>;
    /**
     * Executes a raw SQL query with optional input parameters.
     */
    query<TRecord = any>(sqlText: string, inputs?: DbfMssqlInputs): Promise<sql.IResult<TRecord>>;
    /**
     * Executes a stored procedure.
     *
     * Returns the underlying `mssql` execute result (recordsets, output params, returnValue).
     */
    execProc<TRecord = any>(procName: string, inputs?: DbfMssqlInputs, outputs?: DbfMssqlOutputs): Promise<sql.IProcedureResult<TRecord>>;
}
/**
 * Convenience helper: create a `DbfMssqlClient` using `.env` / `process.env`.
 */
declare function createMssqlClientFromEnv(envOptions?: DbfMssqlEnvOptions, clientOptions?: DbfMssqlClientOptions): DbfMssqlClient;
/**
 * Convenience helper: execute a stored procedure using `.env` / `process.env`,
 * then close the connection pool.
 */
declare function execProcFromEnv<TRecord = any>(procName: string, inputs?: DbfMssqlInputs, outputs?: DbfMssqlOutputs, envOptions?: DbfMssqlEnvOptions): Promise<sql.IProcedureResult<TRecord>>;

export { DbfMssqlClient, type DbfMssqlClientOptions, type DbfMssqlConfig, type DbfMssqlEnvOptions, type DbfMssqlInputs, type DbfMssqlOutputParam, type DbfMssqlOutputs, type DbfMssqlTypedParam, createMssqlClientFromEnv, execProcFromEnv, mssqlConfigFromEnv, param };
