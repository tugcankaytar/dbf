# Android Host Scaffold

This is a minimal Kotlin skeleton showing how to wire a WebView with the DBF bridge.
Add these files to an Android Studio project.

Key parts:
- `addJavascriptInterface` for JS -> native
- `evaluateJavascript` for native -> JS events
- Method whitelist and module stubs

Setup:
- Copy `google-services.json.example` to `google-services.json`
- Enable FCM in Firebase console for your app ID

