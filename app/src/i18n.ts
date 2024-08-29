import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: navigator.language || "en",
    fallbackLng: "en",
    ns: ["app"],
    defaultNS: "app",
    backend: {
      loadPath: "/locales/{{ns}}-{{lng}}.json", // Path to translation files
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
