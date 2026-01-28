import Foundation

final class StorageService {
  private let defaults = UserDefaults.standard

  func get(_ key: String) -> String? {
    return defaults.string(forKey: key)
  }

  func set(_ key: String, value: String) {
    defaults.set(value, forKey: key)
  }

  func remove(_ key: String) {
    defaults.removeObject(forKey: key)
  }
}
