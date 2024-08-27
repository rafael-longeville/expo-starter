import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// Import your translation files
import en from "./locales/en.json";
import fr from "./locales/fr.json";

// Get the preferred locale
const locales = Localization.getLocales();
const preferredLocale = locales[0]?.languageCode || "en"; // Fallback to "en" if something goes wrong

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: preferredLocale, // Default language based on the preferred locale
  fallbackLng: "en", // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
