import Foundation
import UIKit
import Network

final class DeviceService {
  func info() -> [String: Any] {
    let device = UIDevice.current
    return [
      "platform": "ios",
      "version": device.systemVersion,
      "model": device.model
    ]
  }

  func locale() -> [String: Any] {
    return [
      "locale": Locale.current.identifier
    ]
  }

  func networkStatus(timeout: TimeInterval = 0.2) -> [String: Any] {
    let monitor = NWPathMonitor()
    let queue = DispatchQueue(label: "dbf.network")
    let semaphore = DispatchSemaphore(value: 0)
    var online = true
    monitor.pathUpdateHandler = { path in
      online = (path.status == .satisfied)
      semaphore.signal()
      monitor.cancel()
    }
    monitor.start(queue: queue)
    _ = semaphore.wait(timeout: .now() + timeout)
    return [
      "online": online
    ]
  }
}
