import "/src/style.css";
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