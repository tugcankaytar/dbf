import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else { return }
    if let urlContext = connectionOptions.urlContexts.first {
      BridgeHub.shared.initialDeeplink = urlContext.url.absoluteString
    }
    let window = UIWindow(windowScene: windowScene)
    window.rootViewController = WebViewController()
    window.makeKeyAndVisible()
    self.window = window
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else { return }
    BridgeHub.shared.emit(event: "deeplink.opened", payload: ["url": url.absoluteString])
  }
}
