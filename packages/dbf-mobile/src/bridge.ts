import type {
  BridgeEventMessage,
  BridgeMessage,
  BridgeResultMessage,
  BridgeTransport,
  Unsubscribe,
} from "./types";
import { createDefaultTransport } from "./transport";

type PendingEntry = {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timeoutId?: number;
};

type BridgeOptions = {
  transport?: BridgeTransport;
  timeoutMs?: number;
  devMode?: boolean;
  allowedMethods?: string[];
  payloadLimitBytes?: number;
  logPipe?: boolean;
};

function createId() {
  return `req_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function parseMessage(raw: string): BridgeMessage | null {
  try {
    return JSON.parse(raw) as BridgeMessage;
  } catch {
    return null;
  }
}

export class DBFMobileBridge {
  private transport: BridgeTransport;
  private pending = new Map<string, PendingEntry>();
  private listeners = new Map<string, Set<(payload: unknown) => void>>();
  private timeoutMs: number;
  private devMode: boolean;
  private allowedMethods?: Set<string>;
  private payloadLimitBytes: number;
  private logPipeEnabled: boolean;
  private consoleOriginals?: {
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
  };
  private isPiping = false;

  constructor(options: BridgeOptions = {}) {
    this.transport = options.transport ?? createDefaultTransport();
    this.timeoutMs = options.timeoutMs ?? 10000;
    this.devMode = Boolean(options.devMode);
    this.allowedMethods = options.allowedMethods
      ? new Set(options.allowedMethods)
      : undefined;
    this.payloadLimitBytes = options.payloadLimitBytes ?? 64 * 1024;
    this.logPipeEnabled = Boolean(options.logPipe ?? this.devMode);

    this.transport.onMessage((raw) => this.handleMessage(raw));

    if (this.logPipeEnabled) {
      this.installConsolePipe();
    }
  }

  private log(message: string, detail?: unknown) {
    if (!this.devMode) return;
    const logger = this.consoleOriginals?.log ?? console.log;
    if (detail === undefined) {
      logger(`[dbf-mobile] ${message}`);
    } else {
      logger(`[dbf-mobile] ${message}`, detail);
    }
  }

  private handleMessage(raw: string) {
    const msg = parseMessage(raw);
    if (!msg) return;

    if (msg.type === "result") {
      this.handleResult(msg);
      return;
    }

    if (msg.type === "event") {
      this.handleEvent(msg);
    }
  }

  private handleResult(msg: BridgeResultMessage) {
    const entry = this.pending.get(msg.id);
    if (!entry) return;
    this.pending.delete(msg.id);
    if (entry.timeoutId) {
      clearTimeout(entry.timeoutId);
    }
    if (msg.ok) {
      this.log(`result ok ${msg.id}`, msg.payload);
      entry.resolve(msg.payload);
    } else {
      const error = new Error(msg.error?.message || "Bridge error");
      (error as Error & { code?: string }).code = msg.error?.code;
      this.log(`result error ${msg.id}`, msg.error);
      entry.reject(error);
    }
  }

  private handleEvent(msg: BridgeEventMessage) {
    const handlers = this.listeners.get(msg.name);
    if (!handlers) return;
    this.log(`event ${msg.name}`, msg.payload);
    for (const cb of handlers) cb(msg.payload);
  }

  private installConsolePipe() {
    if (this.consoleOriginals) return;
    this.consoleOriginals = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console),
    };

    const wrap =
      (level: keyof NonNullable<DBFMobileBridge["consoleOriginals"]>) =>
      (...args: unknown[]) => {
        this.consoleOriginals?.[level](...args);
        if (this.isPiping) return;
        if (!this.logPipeEnabled) return;
        if (this.allowedMethods && !this.allowedMethods.has("native.log")) return;
        this.isPiping = true;
        this.sendRawInvoke("native.log", { level, args });
        this.isPiping = false;
      };

    console.log = wrap("log");
    console.warn = wrap("warn");
    console.error = wrap("error");
    console.info = wrap("info");
    console.debug = wrap("debug");
  }

  private sendRawInvoke(method: string, payload?: unknown) {
    const id = createId();
    const message = JSON.stringify({
      type: "invoke",
      id,
      method,
      payload,
    });
    this.transport.send(message);
  }

  ready(): Promise<void> {
    return this.invoke<void>("bridge.ready", {
      ts: Date.now(),
    });
  }

  invoke<T = unknown>(method: string, payload?: unknown): Promise<T> {
    if (this.allowedMethods && !this.allowedMethods.has(method)) {
      return Promise.reject(
        new Error(`Bridge method not allowed: ${method}`)
      );
    }
    const id = createId();
    const message = JSON.stringify({
      type: "invoke",
      id,
      method,
      payload,
    });

    if (this.payloadLimitBytes > 0) {
      const size = new TextEncoder().encode(message).length;
      if (size > this.payloadLimitBytes) {
        return Promise.reject(
          new Error(`Bridge payload too large (${size} bytes)`)
        );
      }
    }

    this.log(`invoke ${method}`, payload);
    this.transport.send(message);

    return new Promise<T>((resolve, reject) => {
      const entry: PendingEntry = {
        resolve,
        reject,
      };

      if (this.timeoutMs > 0) {
        entry.timeoutId = window.setTimeout(() => {
          this.pending.delete(id);
          reject(new Error(`Bridge timeout for ${method}`));
        }, this.timeoutMs);
      }

      this.pending.set(id, entry);
    });
  }

  on(eventName: string, cb: (payload: unknown) => void): Unsubscribe {
    const set = this.listeners.get(eventName) ?? new Set();
    set.add(cb);
    this.listeners.set(eventName, set);
    return () => {
      const handlers = this.listeners.get(eventName);
      if (!handlers) return;
      handlers.delete(cb);
      if (handlers.size === 0) this.listeners.delete(eventName);
    };
  }
}
