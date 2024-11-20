import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Button,
  Dimensions,
} from "react-native";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import { useTranslation } from "react-i18next";
import ConnectWithPasskey from "@/components/SignInSignUp/ConnectWithPasskey";
import CreateWithPasskey from "@/components/SignInSignUp/CreateWithPasskey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { getLocales } from "expo-localization";
import i18n from "../i18n";
import PasskeyComponent from "@/components/PasskeyComponent/PasskeyComponent";

// Get the screen height for proportional margins
const { height: screenHeight } = Dimensions.get("window");

const Onboarding1: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [storedValue, setStoredValue] = useState<string | null>(null);
  const [asyncStorageValue, setAsyncStorageValue] = useState<string | null>(
    null
  );

  // Get the preferred locale
  const locales = getLocales();
  const preferredLocale = locales[0]?.languageCode || "en"; // Fallback to 'en' if locale is not available

  const [selectedLanguage, setSelectedLanguage] = useState<"fr" | "en" | null>(
    "en"
  );

  useEffect(() => {
    const fetchStoredAndResetSettings = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("selectedLanguage");
        await AsyncStorage.setItem("continueWithoutFunding", "false");
        i18n.changeLanguage("fr");
        // Handle language selection later
      } catch (error) {
        Sentry.captureException(error);
        console.error(
          "Error retrieving settings or JWT tokens from AsyncStorage:",
          error
        );
      }
    };

    fetchStoredAndResetSettings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={globalFonts.title}>{t("pages.onboarding_1.title")}</Text>
      <Text
        style={{
          ...globalFonts.subtitle,
          fontSize: scaledFontSize(16),
          textAlign: "center",
        }}
      >
        {t("pages.onboarding_1.subtitle")}
      </Text>
      <Image
        style={styles.image}
        source={require("@/assets/images/onboarding/1/biometry-image.png")}
      />
      <Text
        style={{
          ...globalFonts.subtitle,
          fontSize: scaledFontSize(12),
          textAlign: "center",
          width: "70%",
          lineHeight: scaledFontSize(22),
          marginBottom: screenHeight * 0.0123, // Original 10px
        }}
      >
        {t("pages.onboarding_1.second_subtitle")}
      </Text>
      <PasskeyComponent />
      <Text
        style={{
          ...globalFonts.disclaimerText,
          width: "90%",
          marginTop: screenHeight * 0.037, // Original 30px
        }}
      >
        {t("disclaimer")}
        <Link href={"https://wallet.civicpower.org/terms/"}>
          <Text style={{ textDecorationLine: "underline" }}>
            {t("disclaimer_link")}. (v1.1.0)
          </Text>
        </Link>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    gap: screenHeight * 0.0123, // Original 10px
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: screenHeight * 0.0123, // Original 10px
    width: "100%",
    marginTop: screenHeight * 0.0123, // Original 10px
  },
  image: {
    marginTop: screenHeight * 0.0493, // Original 40px
    marginBottom: screenHeight * 0.0123, // Original 10px
    height: screenHeight * 0.2958, // Original 240px
    width: screenHeight * 0.2155, // Original 175px
    resizeMode: "contain",
  },
  text: {
    fontSize: scaledFontSize(24),
    fontWeight: "bold",
  },
});

export default Onboarding1;
