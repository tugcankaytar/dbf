import Foundation
import Security

final class SecureStorageService {
  func get(_ key: String) -> String? {
    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrAccount as String: key,
      kSecReturnData as String: true,
      kSecMatchLimit as String: kSecMatchLimitOne
    ]
    var dataTypeRef: AnyObject?
    let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
    guard status == errSecSuccess else { return nil }
    guard let data = dataTypeRef as? Data else { return nil }
    return String(data: data, encoding: .utf8)
  }

  func set(_ key: String, value: String) {
    let data = value.data(using: .utf8) ?? Data()
    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrAccount as String: key
    ]
    let attributes: [String: Any] = [
      kSecValueData as String: data
    ]
    let status = SecItemUpdate(query as CFDictionary, attributes as CFDictionary)
    if status == errSecItemNotFound {
      var newQuery = query
      newQuery[kSecValueData as String] = data
      SecItemAdd(newQuery as CFDictionary, nil)
    }
  }

  func remove(_ key: String) {
    let query: [String: Any] = [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrAccount as String: key
    ]
    SecItemDelete(query as CFDictionary)
  }
}
