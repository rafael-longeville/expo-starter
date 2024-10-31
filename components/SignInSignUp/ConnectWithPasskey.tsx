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

export default function ConnectWithPasskey({}: ConnectWithPasskeyProps) {
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
          color: "#fff",
          fontSize: scaledFontSize(12),
        }}
      >
        {t("pages.onboarding_1.sign-in")}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#333333",
    padding: 10,
    borderRadius: 30,
    height: 37,
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    borderWidth: 2,
    borderColor: "#666666",
    // Adding shadow properties for iOS
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 10, // Vertical shadow offset
    },
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 3.5, // Shadow blur radius
    // Adding elevation for Android
    elevation: 5, // Elevation for Android shadow effect
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
