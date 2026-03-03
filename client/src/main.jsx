/**
 * App entry point.
 *
 * Mounts the React app into #root and sets up React Router
 * so routing works across the whole application.
 *
 * React.StrictMode is enabled to help catch potential issues
 * during development.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);