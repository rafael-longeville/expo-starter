import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import "intl-pluralrules";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Check if "selectedLanguage" is already set in AsyncStorage
const setInitialLanguage = async () => {
  const selectedLanguage = await AsyncStorage.getItem("selectedLanguage");
  if (!selectedLanguage) {
    await AsyncStorage.setItem("selectedLanguage", preferredLocale || "en");
    if (preferredLocale == "fr") {
      await AsyncStorage.setItem("selectedCurrency", "euro");
    }
    else
      await AsyncStorage.setItem("selectedCurrency", "dollar");
  }
  else{
    i18n.changeLanguage(selectedLanguage);
  }
};

// Call the function to set the initial language
setInitialLanguage();

export default i18n;
