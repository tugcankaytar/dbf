import Foundation
import WebKit

final class DBFBridge: NSObject, WKScriptMessageHandler {
  private weak var webView: WKWebView?
  private let storage = StorageService()
  private let secure = SecureStorageService()
  private let device = DeviceService()
  private let notifications = NotificationService()

  private let allowedMethods: Set<String> = [
    "bridge.ready",
    "native.log",
    "storage.get",
    "storage.set",
    "storage.remove",
    "secure.get",
    "secure.set",
    "secure.remove",
    "device.info",
    "device.locale",
    "device.network",
    "deeplink.getInitial",
    "notifications.requestPermission",
    "notifications.getToken"
  ]

  init(webView: WKWebView) {
    self.webView = webView
  }

  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    guard let body = message.body as? String else { return }
    handleMessage(body)
  }

  private func handleMessage(_ raw: String) {
    guard let data = raw.data(using: .utf8) else { return }
    guard
      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
      let type = json["type"] as? String,
      type == "invoke",
      let id = json["id"] as? String,
      let method = json["method"] as? String
    else {
      return
    }

    if !allowedMethods.contains(method) {
      sendResult(id: id, ok: false, payload: nil, error: ["code": "E_METHOD", "message": "Not allowed"])
      return
    }

    let payload = json["payload"] as? [String: Any]

    switch method {
    case "bridge.ready":
      sendEvent(name: "ready.ack", payload: ["ok": true])
      sendResult(id: id, ok: true, payload: ["ready": true], error: nil)
    case "native.log":
      sendResult(id: id, ok: true, payload: ["logged": true], error: nil)
    case "storage.get":
      let key = payload?["key"] as? String ?? ""
      let value = storage.get(key)
      sendResult(id: id, ok: true, payload: ["value": value as Any], error: nil)
    case "storage.set":
      let key = payload?["key"] as? String ?? ""
      let value = payload?["value"] as? String ?? ""
      storage.set(key, value: value)
      sendResult(id: id, ok: true, payload: ["success": true], error: nil)
    case "storage.remove":
      let key = payload?["key"] as? String ?? ""
      storage.remove(key)
      sendResult(id: id, ok: true, payload: ["success": true], error: nil)
    case "secure.get":
      let key = payload?["key"] as? String ?? ""
      let value = secure.get(key)
      sendResult(id: id, ok: true, payload: ["value": value as Any], error: nil)
    case "secure.set":
      let key = payload?["key"] as? String ?? ""
      let value = payload?["value"] as? String ?? ""
      secure.set(key, value: value)
      sendResult(id: id, ok: true, payload: ["success": true], error: nil)
    case "secure.remove":
      let key = payload?["key"] as? String ?? ""
      secure.remove(key)
      sendResult(id: id, ok: true, payload: ["success": true], error: nil)
    case "device.info":
      sendResult(id: id, ok: true, payload: device.info(), error: nil)
    case "device.locale":
      sendResult(id: id, ok: true, payload: device.locale(), error: nil)
    case "device.network":
      sendResult(id: id, ok: true, payload: device.networkStatus(), error: nil)
    case "deeplink.getInitial":
      let url = BridgeHub.shared.initialDeeplink
      BridgeHub.shared.initialDeeplink = nil
      sendResult(id: id, ok: true, payload: ["url": url as Any], error: nil)
    case "notifications.requestPermission":
      notifications.requestPermission { granted in
        if granted {
          self.notifications.registerForRemoteNotifications()
        }
        self.sendResult(id: id, ok: true, payload: ["granted": granted], error: nil)
      }
    case "notifications.getToken":
      let token = BridgeHub.shared.pushToken ?? ""
      sendResult(id: id, ok: true, payload: ["token": token, "platform": "ios"], error: nil)
    default:
      sendResult(id: id, ok: false, payload: nil, error: ["code": "E_UNKNOWN", "message": "Unknown method"])
    }
  }

  func sendEvent(name: String, payload: [String: Any]) {
    let event: [String: Any] = [
      "type": "event",
      "name": name,
      "payload": payload
    ]
    postToWebView(event)
  }

  private func sendResult(id: String, ok: Bool, payload: [String: Any]?, error: [String: Any]?) {
    var result: [String: Any] = [
      "type": "result",
      "id": id,
      "ok": ok
    ]
    if let payload = payload {
      result["payload"] = payload
    }
    if let error = error {
      result["error"] = error
    }
    postToWebView(result)
  }

  private func postToWebView(_ message: [String: Any]) {
    guard let data = try? JSONSerialization.data(withJSONObject: message),
          let json = String(data: data, encoding: .utf8) else { return }
    let script = "window.dispatchEvent(new MessageEvent('message', { data: \(json) }));"
    webView?.evaluateJavaScript(script, completionHandler: nil)
  }
}
