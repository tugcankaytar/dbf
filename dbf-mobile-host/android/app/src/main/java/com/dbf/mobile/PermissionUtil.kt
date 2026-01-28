package com.dbf.mobile

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

object PermissionUtil {
  private const val REQ_NOTIF = 9001
  private var callback: ((Boolean) -> Unit)? = null

  fun requestNotification(activity: Activity, cb: (Boolean) -> Unit) {
    val granted = ContextCompat.checkSelfPermission(
      activity,
      Manifest.permission.POST_NOTIFICATIONS
    ) == PackageManager.PERMISSION_GRANTED
    if (granted) {
      cb(true)
      return
    }
    callback = cb
    ActivityCompat.requestPermissions(activity, arrayOf(Manifest.permission.POST_NOTIFICATIONS), REQ_NOTIF)
  }

  fun onRequestPermissionsResult(requestCode: Int, grantResults: IntArray) {
    if (requestCode != REQ_NOTIF) return
    val granted = grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED
    callback?.invoke(granted)
    callback = null
  }
}
