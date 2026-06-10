import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/schibsted-grotesk";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
