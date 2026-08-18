import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AppProviders from "./app/providers.jsx";

import "./styles/globals.css";

// Prevent mouse wheel from inadvertently changing values in number inputs across the entire application
if (typeof window !== "undefined") {
  document.addEventListener(
    "wheel",
    () => {
      if (
        document.activeElement &&
        document.activeElement.tagName === "INPUT" &&
        document.activeElement.type === "number"
      ) {
        document.activeElement.blur();
      }
    },
    { passive: true }
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);
