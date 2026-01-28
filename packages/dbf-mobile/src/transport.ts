import type { BridgeTransport, Unsubscribe } from "./types";

type BridgeChannel = {
  postMessage(message: string): void;
};

type WebkitWindow = Window & {
  webkit?: {
    messageHandlers?: {
      DBF?: BridgeChannel;
    };
  };
  DBF?: BridgeChannel;
};

export function createDefaultTransport(): BridgeTransport {
  const win = window as WebkitWindow;
  const channel = win.webkit?.messageHandlers?.DBF || win.DBF;

  if (!channel) {
    throw new Error("DBF bridge channel not found on window");
  }

  const listeners = new Set<(message: string) => void>();

  const onMessage = (message: string) => {
    for (const cb of listeners) cb(message);
  };

  const onWindowMessage = (event: MessageEvent) => {
    if (typeof event.data !== "string") return;
    onMessage(event.data);
  };

  window.addEventListener("message", onWindowMessage);

  return {
    send(message: string) {
      channel.postMessage(message);
    },
    onMessage(cb: (message: string) => void): Unsubscribe {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
        if (listeners.size === 0) {
          window.removeEventListener("message", onWindowMessage);
        }
      };
    },
  };
}
