import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import App from "./App.jsx";
import "./index.css";
import { ToastProvider } from "@heroui/toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider locale="id-ID">
      <ToastProvider />
      <App />
    </HeroUIProvider>
  </StrictMode>,
);
