import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App.jsx";
import { installContactTracking } from "./analytics.js";
import "./styles.css";

const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

const removeTracking = installContactTracking();
if (import.meta.hot) import.meta.hot.dispose(removeTracking);
