import "./index.css";
// @deno-types="@types/react"
import { StrictMode } from "react";
// @deno-types="@types/react-dom/client"
import { createRoot } from "react-dom/client";
import InstallerUI from "./InstallerUI.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <div className="min-h-screen bg-gray-900">
      <InstallerUI />
    </div>
  </StrictMode>
);
