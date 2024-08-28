import React from "react";
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
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import Onboarding1 from "./onboarding_1";
import Onboarding2 from "./onboarding_2";
import Onboarding3 from "./onboarding_3";

const IMAGES = {
  onboarding_1: require("@/assets/images/onboarding/onboarding_1.png"),
  onboarding_2: require("@/assets/images/onboarding/onboarding_2.png"),
  onboarding_3: require("@/assets/images/onboarding/onboarding_3.png"),
} as const;

export default function OnboardingLayout() {
  const segments = useSegments();
  const { t } = useTranslation();
  const currentSegment = segments[segments.length - 1];

  const handleChangeLanguage = (language: "fr" | "en") => {
    i18n.changeLanguage(language);
  };

  const navigateToPage = (offset: number) => {
    const number = Math.min(
      Math.max(parseInt(currentSegment.split("_")[1]) + offset, 1),
      3
    );
    const path = `/onboarding_${number}`;
    router.push({
      pathname: path as `/onboarding_1` | `/onboarding_2` | `/onboarding_3`,
    });
  };

  const renderCurrentScreen = () => {
    switch (currentSegment) {
      case "onboarding_1":
        return <Onboarding1 />;
      case "onboarding_2":
        return <Onboarding2 />;
      case "onboarding_3":
        return <Onboarding3 />;
      default:
        return <Onboarding1 />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("@/assets/images/yellow-rectangle.png")}
        style={styles.backgroundImage}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.languageSwitcher}>
          <LanguageButton
            label="Change to French"
            onPress={() => handleChangeLanguage("fr")}
          />
          <LanguageButton
            label="Change to English"
            onPress={() => handleChangeLanguage("en")}
          />
        </View>

        <Image
          source={IMAGES[currentSegment as keyof typeof IMAGES]}
          style={styles.image}
        />
        {renderCurrentScreen()}

        <NavigationButton
          label="Back to home page"
          onPress={() => router.push("/")}
        />
        <NavigationButton
          label="Go + 1 page"
          onPress={() => navigateToPage(1)}
        />
        <NavigationButton
          label="Go - 1 page"
          onPress={() => navigateToPage(-1)}
        />
      </ScrollView>
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

const NavigationButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={styles.navigationButton}>
    <Text style={styles.navigationButtonText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContainer: {
    padding: 20,
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
