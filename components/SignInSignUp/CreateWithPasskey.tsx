import React from "react";
import { router } from "expo-router";
import {
  Pressable,
  Text,
  Alert,
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";
import * as Sentry from "@sentry/react-native";
import { useTranslation } from "react-i18next";

interface ConnectWithPasskeyProps {}

export default function CreateWithPasskey({}: ConnectWithPasskeyProps) {
  // Only render the view if no passkey is stored
  // if (!hasPasskey) {
  //   return null; // Do not render if a passkey already exists
  // }

  const { t } = useTranslation();

  const handlePress = async () => {
    try {
      // Connect to the wallet
      // Redirect to the next page
      router.push("/(onboarding)/onboarding_2");
    } catch (error: any) {
      // Sentry.captureException(error);
      Alert.alert("Error", error.message);
    }
  };
  return (
    <Pressable
      style={styles.button} // No changes to button style
      onPress={handlePress}
    >
      <Text
        style={{
          ...globalFonts.mediumSubtitle,
          textAlign: "center",
          color: "#212121",
          fontSize: scaledFontSize(12),
        }}
      >
        {t("pages.onboarding_1.sign-up")}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderRadius: 30,
    height: 37,
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    // Add drop shadow for iOS
    shadowColor: "#091E42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Add elevation for Android
    elevation: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background to dim the screen
  },
  loaderContainer: {
    backgroundColor: "#13293D",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loaderText: {
    color: "#ffffff",
    marginTop: 10,
  },
});
