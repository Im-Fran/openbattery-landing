import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Support from "./components/Support";
import Footer from "./components/Footer";
import LangSwitch from "./components/LangSwitch";
import { I18nProvider } from "./i18n/provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <LangSwitch />
      <main>
        <Support />
      </main>
      <Footer />
    </I18nProvider>
  </StrictMode>,
);
