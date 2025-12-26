import "/src/style.css";
// Setup i18n dictionaries before components use them
import "../i18n-setup";
// Register all demo components in one place
import "./dbf-counter";
import "./dbf-input";
import "./dbf-card";
import "./dbf-stat";
import "./home-hero";
import "./home-stats";
import "./home-features";
import "./home-newsletter";
import "./home-menu";
import "./home-footer";
// New feature demos
import "./demo-hooks";
import "./demo-context";
import "./demo-error-boundary";
import "./demo-data-fetch";
// Router demo integration
import "../routes/router";



/* veya özelleştirilmiş:
installGlobalErrorHandler({
  getMessage(error, source) {
    if (source === "unhandledrejection") {
      console.error("Unhandled rejection:", error);
      return "Async error occurred. Check console for details.";
    }
    return "Unexpected error. Please check the console.";
  },
});
*/