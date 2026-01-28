package com.dbf.mobile

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import org.json.JSONObject

class PushService : FirebaseMessagingService() {
  override fun onNewToken(token: String) {
    BridgeRegistry.pushToken = token
  }

  override fun onMessageReceived(message: RemoteMessage) {
    val payload = JSONObject()
    payload.put("title", message.notification?.title)
    payload.put("body", message.notification?.body)
    payload.put("data", JSONObject(message.data as Map<*, *>))
    BridgeRegistry.bridge?.sendEvent("push.received", payload.toMap())
  }
}

private fun JSONObject.toMap(): Map<String, Any?> {
  val out = mutableMapOf<String, Any?>()
  val keys = keys()
  while (keys.hasNext()) {
    val key = keys.next()
    out[key] = get(key)
  }
  return out
}
