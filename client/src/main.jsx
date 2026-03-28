import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

const rootElement = document.getElementById("root");

function showBootstrapError(message) {
  if (!rootElement) {
    return;
  }

  rootElement.innerHTML = `<div style="padding:16px;font-family:Segoe UI,sans-serif;color:#b91c1c;">${message}</div>`;
}

if (!rootElement) {
  throw new Error("Root element not found.");
}

rootElement.innerHTML = "<div style=\"padding:16px;font-family:Segoe UI,sans-serif;\">Loading app...</div>";

window.addEventListener("error", (event) => {
  showBootstrapError(`Runtime error: ${event.message}`);
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason?.message || String(event.reason || "Unknown error");
  showBootstrapError(`Unhandled promise rejection: ${reason}`);
});

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

