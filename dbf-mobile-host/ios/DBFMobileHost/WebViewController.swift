import UIKit
import WebKit

final class WebViewController: UIViewController {
  private var webView: WKWebView!
  private var bridge: DBFBridge!

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .white

    let contentController = WKUserContentController()
    let config = WKWebViewConfiguration()
    config.userContentController = contentController

    webView = WKWebView(frame: .zero, configuration: config)
    webView.translatesAutoresizingMaskIntoConstraints = false
    view.addSubview(webView)

    NSLayoutConstraint.activate([
      webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      webView.topAnchor.constraint(equalTo: view.topAnchor),
      webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
    ])

    bridge = DBFBridge(webView: webView)
    BridgeHub.shared.bridge = bridge
    contentController.add(bridge, name: "DBF")

    loadLocalWebApp()
  }

  private func loadLocalWebApp() {
    if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "webapp") {
      webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
    }
  }
}
