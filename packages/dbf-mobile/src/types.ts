export type BridgeInvokeMessage = {
  type: "invoke";
  id: string;
  method: string;
  payload?: unknown;
};

export type BridgeResultMessage = {
  type: "result";
  id: string;
  ok: boolean;
  payload?: unknown;
  error?: {
    code?: string;
    message: string;
  };
};

export type BridgeEventMessage = {
  type: "event";
  name: string;
  payload?: unknown;
};

export type BridgeMessage = BridgeInvokeMessage | BridgeResultMessage | BridgeEventMessage;

export type Unsubscribe = () => void;

export type BridgeTransport = {
  send(message: string): void;
  onMessage(cb: (message: string) => void): Unsubscribe;
};
