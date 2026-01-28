import Foundation

final class BridgeHub {
  static let shared = BridgeHub()
  private init() {}

  weak var bridge: DBFBridge?

  var initialDeeplink: String?
  var pushToken: String?

  func emit(event name: String, payload: [String: Any]) {
    bridge?.sendEvent(name: name, payload: payload)
  }
}
