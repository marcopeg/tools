/// <reference types="./vite-env.d.ts" />

import "/node_modules/flag-icons/css/flag-icons.min.css";
import "material-icons/iconfont/material-icons.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { MuiProvider } from "./providers/MuiProvider";
import { App } from "./App";
import "./i18n";

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <MuiProvider>
        <Router>
          <App />
        </Router>
      </MuiProvider>
    </React.StrictMode>
  );
}
