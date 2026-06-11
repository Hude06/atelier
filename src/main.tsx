import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./fonts.css";
import "./styles.css";

// Breadcrumb for post-mortem debugging — the browser console already logs
// the error itself.
function recordError(detail: unknown) {
  try {
    localStorage.setItem(
      "atelier.lastError",
      JSON.stringify({
        message: detail instanceof Error ? detail.message : String(detail),
        stack: detail instanceof Error ? detail.stack : undefined,
        at: Date.now(),
      })
    );
  } catch {
    // localStorage unavailable
  }
}

window.addEventListener("error", (e) => recordError(e.error ?? e.message));
window.addEventListener("unhandledrejection", (e) => recordError(e.reason));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
