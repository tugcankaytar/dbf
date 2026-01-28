const logEl = document.getElementById("log");
const readyBtn = document.getElementById("ready-btn");

const listeners = new Map();
const pending = new Map();

function log(message, data) {
  const line = data ? `${message} ${JSON.stringify(data)}` : message;
  logEl.textContent = `${line}\n` + logEl.textContent;
}

function postMessage(message) {
  const payload = JSON.stringify(message);
  if (window.webkit?.messageHandlers?.DBF) {
    window.webkit.messageHandlers.DBF.postMessage(payload);
  } else if (window.DBF?.postMessage) {
    window.DBF.postMessage(payload);
  } else {
    log("bridge channel not found");
  }
}

function invoke(method, payload) {
  const id = `req_${Math.random().toString(36).slice(2)}`;
  postMessage({ type: "invoke", id, method, payload });
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error("timeout"));
      }
    }, 8000);
  });
}

function on(eventName, cb) {
  const set = listeners.get(eventName) || new Set();
  set.add(cb);
  listeners.set(eventName, set);
  return () => set.delete(cb);
}

window.addEventListener("message", (event) => {
  if (typeof event.data !== "string") return;
  let msg;
  try {
    msg = JSON.parse(event.data);
  } catch {
    return;
  }
  if (msg.type === "result") {
    const entry = pending.get(msg.id);
    if (!entry) return;
    pending.delete(msg.id);
    if (msg.ok) entry.resolve(msg.payload);
    else entry.reject(msg.error);
  }
  if (msg.type === "event") {
    const set = listeners.get(msg.name);
    if (!set) return;
    for (const cb of set) cb(msg.payload);
  }
});

readyBtn.addEventListener("click", async () => {
  try {
    const res = await invoke("bridge.ready", { ts: Date.now() });
    log("ready ok", res);
  } catch (err) {
    log("ready error", err);
  }
});

document.querySelectorAll("button[data-action]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const action = btn.getAttribute("data-action");
    try {
      if (action === "storage-set") {
        log("storage.set");
        const res = await invoke("storage.set", { key: "token", value: "abc" });
        log("storage.set result", res);
      }
      if (action === "storage-get") {
        const res = await invoke("storage.get", { key: "token" });
        log("storage.get result", res);
      }
      if (action === "secure-set") {
        const res = await invoke("secure.set", { key: "pin", value: "1234" });
        log("secure.set result", res);
      }
      if (action === "secure-get") {
        const res = await invoke("secure.get", { key: "pin" });
        log("secure.get result", res);
      }
      if (action === "device-info") {
        const res = await invoke("device.info");
        log("device.info", res);
      }
      if (action === "device-locale") {
        const res = await invoke("device.locale");
        log("device.locale", res);
      }
      if (action === "device-network") {
        const res = await invoke("device.network");
        log("device.network", res);
      }
      if (action === "deeplink") {
        const res = await invoke("deeplink.getInitial");
        log("deeplink.getInitial", res);
      }
      if (action === "notif-permission") {
        const res = await invoke("notifications.requestPermission");
        log("notifications.requestPermission", res);
      }
      if (action === "notif-token") {
        const res = await invoke("notifications.getToken");
        log("notifications.getToken", res);
      }
    } catch (err) {
      log("error", err);
    }
  });
});

on("deeplink.opened", (payload) => log("event deeplink.opened", payload));
on("push.received", (payload) => log("event push.received", payload));
on("push.opened", (payload) => log("event push.opened", payload));
