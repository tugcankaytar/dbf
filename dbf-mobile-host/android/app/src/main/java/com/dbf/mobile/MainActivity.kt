package com.dbf.mobile

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
  private lateinit var webView: WebView
  private lateinit var bridge: DBFBridge

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    webView = WebView(this)
    setContentView(webView)

    webView.settings.javaScriptEnabled = true
    webView.webViewClient = WebViewClient()

    bridge = DBFBridge(webView)
    webView.addJavascriptInterface(bridge, "DBF")
    BridgeRegistry.bridge = bridge
    BridgeRegistry.activity = this
    BridgeRegistry.appContext = applicationContext

    handleInitialDeeplink(intent?.data)
    webView.loadUrl("file:///android_asset/webapp/index.html")
  }

  override fun onNewIntent(intent: android.content.Intent?) {
    super.onNewIntent(intent)
    handleInitialDeeplink(intent?.data)
  }

  override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<out String>,
    grantResults: IntArray
  ) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    PermissionUtil.onRequestPermissionsResult(requestCode, grantResults)
  }

  private fun handleInitialDeeplink(data: Uri?) {
    if (data == null) return
    val url = data.toString()
    if (BridgeRegistry.initialDeeplink == null) {
      BridgeRegistry.initialDeeplink = url
    }
    BridgeRegistry.bridge?.sendEvent("deeplink.opened", mapOf("url" to url))
  }
}
