"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DbfMssqlClient: () => DbfMssqlClient,
  createMssqlClientFromEnv: () => createMssqlClientFromEnv,
  execProcFromEnv: () => execProcFromEnv,
  mssqlConfigFromEnv: () => mssqlConfigFromEnv,
  param: () => param,
  sql: () => sql
});
module.exports = __toCommonJS(index_exports);
var import_dotenv = __toESM(require("dotenv"), 1);
var sqlImport = __toESM(require("mssql"), 1);
var sql = sqlImport.default ?? sqlImport;
function param(value, type) {
  return { value, type };
}
function isTypedParam(param2) {
  return param2 != null && typeof param2 === "object" && "value" in param2;
}
function getPrefix(options) {
  return options?.prefix ?? "DBF_MSSQL_";
}
function asKey(prefix, suffix) {
  return `${prefix}${suffix}`;
}
function isTruthy(value) {
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "y" || v === "on";
}
function isFalsy(value) {
  const v = value.trim().toLowerCase();
  return v === "0" || v === "false" || v === "no" || v === "n" || v === "off";
}
function parseBool(value, keyName) {
  if (isTruthy(value)) return true;
  if (isFalsy(value)) return false;
  throw new Error(
    `Invalid boolean value for ${keyName}. Expected one of: true/false, 1/0, yes/no, on/off.`
  );
}
function parseIntStrict(value, keyName) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid number value for ${keyName}.`);
  }
  return n;
}
function requiredEnv(env, keyName) {
  const value = env[keyName];
  if (value == null || value.trim() === "") {
    throw new Error(`Missing required env var: ${keyName}`);
  }
  return value;
}
function optionalEnv(env, keyName) {
  const value = env[keyName];
  if (value == null || value.trim() === "") return void 0;
  return value;
}
function mssqlConfigFromEnv(options = {}) {
  const prefix = getPrefix(options);
  if (options.loadDotenv !== false) {
    if (options.dotenvPath) import_dotenv.default.config({ path: options.dotenvPath });
    else import_dotenv.default.config();
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
  const config = {
    server,
    database,
    user,
    password,
    options: {
      encrypt: encryptStr ? parseBool(encryptStr, asKey(prefix, "ENCRYPT")) : true,
      trustServerCertificate: trustStr ? parseBool(trustStr, asKey(prefix, "TRUST_SERVER_CERTIFICATE")) : false
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
      ...config.pool ?? {},
      ...poolMaxStr ? { max: parseIntStrict(poolMaxStr, asKey(prefix, "POOL_MAX")) } : {},
      ...poolMinStr ? { min: parseIntStrict(poolMinStr, asKey(prefix, "POOL_MIN")) } : {},
      ...poolIdleMsStr ? { idleTimeoutMillis: parseIntStrict(poolIdleMsStr, asKey(prefix, "POOL_IDLE_TIMEOUT_MS")) } : {}
    };
  }
  return config;
}
function applyInput(request, name, param2) {
  if (isTypedParam(param2)) {
    const p = param2;
    if (p.type) {
      request.input(name, p.type, p.value);
      return;
    }
    request.input(name, p.value);
    return;
  }
  request.input(name, param2);
}
function applyOutput(request, name, param2) {
  request.output(name, param2.type);
}
var DbfMssqlClient = class {
  config;
  poolPromise = null;
  constructor(config, options = {}) {
    this.config = config;
    if (options.eager) void this.connect();
  }
  /**
   * Ensures the underlying connection pool is created + connected.
   */
  async connect() {
    if (this.poolPromise) return this.poolPromise;
    this.poolPromise = (async () => {
      const pool = new sql.ConnectionPool(this.config);
      try {
        await pool.connect();
        return pool;
      } catch (err) {
        try {
          pool.close();
        } catch {
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
  async close() {
    const p = this.poolPromise;
    this.poolPromise = null;
    if (!p) return;
    const pool = await p;
    await pool.close();
  }
  /**
   * Executes a raw SQL query with optional input parameters.
   */
  async query(sqlText, inputs = {}) {
    const pool = await this.connect();
    const request = pool.request();
    for (const [name, value] of Object.entries(inputs)) applyInput(request, name, value);
    return request.query(sqlText);
  }
  /**
   * Executes a stored procedure.
   *
   * Returns the underlying `mssql` execute result (recordsets, output params, returnValue).
   */
  async execProc(procName, inputs = {}, outputs = {}) {
    const pool = await this.connect();
    const request = pool.request();
    for (const [name, value] of Object.entries(inputs)) applyInput(request, name, value);
    for (const [name, value] of Object.entries(outputs)) applyOutput(request, name, value);
    return request.execute(procName);
  }
};
function createMssqlClientFromEnv(envOptions = {}, clientOptions = {}) {
  const config = mssqlConfigFromEnv(envOptions);
  return new DbfMssqlClient(config, clientOptions);
}
async function execProcFromEnv(procName, inputs = {}, outputs = {}, envOptions = {}) {
  const client = createMssqlClientFromEnv(envOptions);
  try {
    return await client.execProc(procName, inputs, outputs);
  } finally {
    await client.close();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DbfMssqlClient,
  createMssqlClientFromEnv,
  execProcFromEnv,
  mssqlConfigFromEnv,
  param,
  sql
});
