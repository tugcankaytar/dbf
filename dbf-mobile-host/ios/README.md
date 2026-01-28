# iOS Host Scaffold

This is a minimal Swift skeleton showing how to wire WKWebView with the DBF bridge.
Add these files to an Xcode project.

Key parts:
- `WKScriptMessageHandler` for JS -> native
- `evaluateJavaScript` for native -> JS events
- Method whitelist and module stubs

Setup:
- Enable Push Notifications capability in Xcode
- Add `DBFMobileHost.entitlements` to your target

