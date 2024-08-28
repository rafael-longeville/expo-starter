import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import "intl-pluralrules";

// Import your translation files
import en from "./locales/en.json";
import fr from "./locales/fr.json";

// Get the preferred locale
const locales = getLocales();
const preferredLocale = locales[0]?.languageCode || "en"; // Fallback to 'en' if locale is not available

i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next.
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: preferredLocale, // Set the initial language based on the device's locale
    fallbackLng: "en", // Fallback language
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
