package com.dbf.mobile

import android.app.Activity
import android.content.Context

object BridgeRegistry {
  var bridge: DBFBridge? = null
  var activity: Activity? = null
  var appContext: Context? = null
  var initialDeeplink: String? = null
  var pushToken: String? = null
}
