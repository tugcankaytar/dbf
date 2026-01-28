package com.dbf.mobile

import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.google.firebase.messaging.FirebaseMessaging
import org.json.JSONObject

class DBFBridge(private val webView: WebView) {
  private val allowedMethods = setOf(
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
  )

  @JavascriptInterface
  fun postMessage(raw: String) {
    try {
      val json = JSONObject(raw)
      if (json.optString("type") != "invoke") return
      val id = json.optString("id")
      val method = json.optString("method")
      if (!allowedMethods.contains(method)) {
        sendResult(id, false, null, error("E_METHOD", "Not allowed"))
        return
      }
      when (method) {
        "bridge.ready" -> {
          sendEvent("ready.ack", JSONObject().put("ok", true))
          sendResult(id, true, JSONObject().put("ready", true), null)
        }
        "native.log" -> {
          Log.d("DBFBridge", json.optJSONObject("payload")?.toString() ?: "")
          sendResult(id, true, JSONObject().put("logged", true), null)
        }
        "storage.get" -> {
          val key = json.optJSONObject("payload")?.optString("key") ?: ""
          val prefs = getPrefs()
          val value = prefs.getString(key, null)
          val payload = JSONObject().put("value", value ?: JSONObject.NULL)
          sendResult(id, true, payload, null)
        }
        "storage.set" -> {
          val key = json.optJSONObject("payload")?.optString("key") ?: ""
          val value = json.optJSONObject("payload")?.optString("value") ?: ""
          getPrefs().edit().putString(key, value).apply()
          sendResult(id, true, JSONObject().put("success", true), null)
        }
        "storage.remove" -> {
          val key = json.optJSONObject("payload")?.optString("key") ?: ""
          getPrefs().edit().remove(key).apply()
          sendResult(id, true, JSONObject().put("success", true), null)
        }
        "secure.get" -> {
          val key = json.optJSONObject("payload")?.optString("key") ?: ""
          val value = getSecurePrefs().getString(key, null)
          val payload = JSONObject().put("value", value ?: JSONObject.NULL)
          sendResult(id, true, payload, null)
        }
        "secure.set" -> {
          val key = json.optJSONObject("payload")?.optString("key") ?: ""
          val value = json.optJSONObject("payload")?.optString("value") ?: ""
          getSecurePrefs().edit().putString(key, value).apply()
          sendResult(id, true, JSONObject().put("success", true), null)
        }
        "secure.remove" -> {
          val key = json.optJSONObject("payload")?.optString("key") ?: ""
          getSecurePrefs().edit().remove(key).apply()
          sendResult(id, true, JSONObject().put("success", true), null)
        }
        "device.info" -> {
          val payload = JSONObject()
            .put("platform", "android")
            .put("version", android.os.Build.VERSION.RELEASE ?: "")
            .put("model", android.os.Build.MODEL ?: "")
          sendResult(id, true, payload, null)
        }
        "device.locale" -> {
          val payload = JSONObject().put("locale", java.util.Locale.getDefault().toString())
          sendResult(id, true, payload, null)
        }
        "device.network" -> {
          val online = NetworkUtil.isOnline(BridgeRegistry.appContext)
          val payload = JSONObject().put("online", online)
          sendResult(id, true, payload, null)
        }
        "deeplink.getInitial" -> {
          val url = BridgeRegistry.initialDeeplink
          BridgeRegistry.initialDeeplink = null
          val payload = JSONObject().put("url", url ?: JSONObject.NULL)
          sendResult(id, true, payload, null)
        }
        "notifications.requestPermission" -> {
          val activity = BridgeRegistry.activity
          if (activity == null) {
            sendResult(id, false, null, error("E_CONTEXT", "No activity"))
            return
          }
          PermissionUtil.requestNotification(activity) { granted ->
            sendResult(id, true, JSONObject().put("granted", granted), null)
          }
        }
        "notifications.getToken" -> {
          FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
              sendResult(id, false, null, error("E_FCM", task.exception?.message ?: "Token error"))
              return@addOnCompleteListener
            }
            val token = task.result ?: ""
            BridgeRegistry.pushToken = token
            val payload = JSONObject().put("token", token).put("platform", "android")
            sendResult(id, true, payload, null)
          }
        }
        else -> sendResult(id, false, null, error("E_UNKNOWN", "Unknown method"))
      }
    } catch (_: Exception) {
      // ignore malformed payloads in scaffold
    }
  }

  private fun sendResult(id: String, ok: Boolean, payload: JSONObject?, error: JSONObject?) {
    val result = JSONObject()
      .put("type", "result")
      .put("id", id)
      .put("ok", ok)
    if (payload != null) result.put("payload", payload)
    if (error != null) result.put("error", error)
    postToWebView(result)
  }

  fun sendEvent(name: String, payload: JSONObject) {
    val event = JSONObject()
      .put("type", "event")
      .put("name", name)
      .put("payload", payload)
    postToWebView(event)
  }

  private fun postToWebView(message: JSONObject) {
    val json = message.toString()
    val script = "window.dispatchEvent(new MessageEvent('message', { data: $json }));"
    webView.post { webView.evaluateJavascript(script, null) }
  }

  private fun getPrefs() = webView.context.getSharedPreferences("dbf_prefs", 0)

  private fun getSecurePrefs(): android.content.SharedPreferences {
    val context = BridgeRegistry.appContext ?: webView.context
    val masterKey = MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build()
    return EncryptedSharedPreferences.create(
      context,
      "dbf_secure",
      masterKey,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
  }

  private fun error(code: String, message: String): JSONObject {
    return JSONObject().put("code", code).put("message", message)
  }
}
