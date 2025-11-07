import i18n from "i18next";
import i18n_http_backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const supportedLngs = {
  en: "English",
  ru: "Русский",
};

i18n
  .use(i18n_http_backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: window.localStorage.getItem("lang") || "en", // attempt to retrieve 'lang' key from 'localStorage': if it's unset or null, set 'en' as a default language

    interpolation: {
      escapeValue: false
    },
  });

  export default i18n;