// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import {BooleanProvider} from "./global/global";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BooleanProvider>
      <App />
    </BooleanProvider>
  </React.StrictMode>
);
