import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useSegments } from "expo-router";
import Onboarding1 from "./onboarding_1";
import Onboarding2 from "./onboarding_2";
import Onboarding3 from "./onboarding_3";
import Onboarding4 from "./onboarding_4";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalFonts } from "../styles/globalFonts";
import * as Sentry from "@sentry/react-native";
import { useTranslation } from "react-i18next";

const IMAGES = {
  onboarding_1: require("@/assets/images/onboarding/onboarding_1.png"),
  onboarding_2: require("@/assets/images/onboarding/onboarding_2.png"),
  onboarding_3: require("@/assets/images/onboarding/onboarding_3.png"),
} as const;

export default function OnboardingLayout() {
  const segments = useSegments();
  const currentSegment = segments[segments.length - 1];
  const { t } = useTranslation();

  const renderCurrentScreen = () => {
    switch (currentSegment) {
      case "onboarding_1":
        return <Onboarding1 />;
      case "onboarding_2":
        return <Onboarding2 />;
      case "onboarding_3":
        return <Onboarding3 />;
      case "onboarding_4":
        return <Onboarding4 />;
      default:
        return <Onboarding1 />;
    }
  };

  const handleContinuePress = async () => {
    try {
      Sentry.addBreadcrumb({
        category: "action",
        message: "User clicked continue without funding",
        level: "info",
      });

      await AsyncStorage.setItem("continueWithoutFunding", "true");

      Sentry.addBreadcrumb({
        category: "storage",
        message: "Stored continueWithoutFunding flag in AsyncStorage",
        level: "info",
      });

      router.push("/(onboarding)/onboarding_3");
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error storing data or navigating:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("@/assets/images/yellow-rectangle.png")}
        style={styles.backgroundImage}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {currentSegment !== "onboarding_3" &&
          IMAGES[currentSegment as keyof typeof IMAGES] && (
            <Image
              source={IMAGES[currentSegment as keyof typeof IMAGES]}
              style={styles.image}
            />
          )}

        {renderCurrentScreen()}

        {process.env.EXPO_PUBLIC_IS_DEVELOPMENT && (
          <View style={styles.languageSwitcher}>
            <LanguageButton
              label="To 1"
              onPress={() => router.push("/(onboarding)/onboarding_1")}
            />
            <LanguageButton
              label="To T"
              onPress={() => router.push("/(onboarding)/onboarding_4")}
            />
            <LanguageButton
              label="To home"
              onPress={() => router.push("/(tabs)/home")}
            />
            <LanguageButton
              label="Clear cache"
              onPress={async () => {
                try {
                  await AsyncStorage.clear();
                  console.log("All async storage data cleared.");
                } catch (error) {
                  console.error("Error clearing async storage: ", error);
                }
              }}
            />
          </View>
        )}
      </ScrollView>
      {currentSegment === "onboarding_2" && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            padding: 20,
            gap: 20,
            zIndex: 100,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#13293D",
              padding: 10,
              borderRadius: 30,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            onPress={handleContinuePress}
          >
            <Text
              style={{
                ...globalFonts.whiteSubtitle,
                textAlign: "center",
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
              }}
            >
              {t("pages.onboarding_2.continue_button")}
            </Text>
          </Pressable>
          <Text
            style={{
              ...globalFonts.subtitle,
              width: "100%",
              textAlign: "center",
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
            }}
            onPress={handleContinuePress}
          >
            {t("pages.onboarding_2.has_account")}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const LanguageButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={styles.languageButton}>
    <Text style={styles.languageButtonText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContainer: {
    padding: 30,
  },
  stackContainer: {
    flex: 1,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#13293D",
    textAlign: "center",
    marginVertical: 10,
  },
  languageSwitcher: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  languageButton: {
    backgroundColor: "blue",
    padding: 10,
    margin: 5,
  },
  languageButtonText: {
    color: "white",
  },
  image: {
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 40,
  },
  backgroundImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%", // Adjust as needed to cover the bottom part of the screen
    resizeMode: "cover", // Ensures the image covers the area proportionally
    zIndex: -1, // Ensures the image stays behind all other elements
  },
  navigationButton: {
    backgroundColor: "#13293D",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  navigationButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});
