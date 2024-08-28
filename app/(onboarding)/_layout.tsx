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
import { router, Stack, useSegments } from "expo-router";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import Onboarding1 from "./onboarding_1"; // Import your Onboarding component

export default function OnboardingLayout() {
  const segments = useSegments();
  const { t } = useTranslation();

  // Define the images for each onboarding step
  const images = {
    onboarding_1: require("@/assets/images/onboarding/onboarding_1.png"),
    onboarding_2: require("@/assets/images/onboarding/onboarding_2.png"),
    onboarding_3: require("@/assets/images/onboarding/onboarding_3.png"),
  } as const;

  // Get source based on the current route
  const currentSegment = segments[segments.length - 1];

  const getSource = () => {
    if (
      currentSegment === "onboarding_1" ||
      currentSegment === "onboarding_2" ||
      currentSegment === "onboarding_3"
    ) {
      return images[currentSegment];
    }
    return images.onboarding_1;
  };

  const changeLanguageToFrench = () => {
    i18n.changeLanguage("fr");
  };

  const changeLanguageToEnglish = () => {
    i18n.changeLanguage("en");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image
          source={require("@/assets/images/yellow-rectangle.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.languageSwitcher}>
          <Pressable
            onPress={changeLanguageToFrench}
            style={styles.languageButton}
          >
            <Text style={styles.languageButtonText}>Change to French</Text>
          </Pressable>
          <Pressable
            onPress={changeLanguageToEnglish}
            style={styles.languageButton}
          >
            <Text style={styles.languageButtonText}>Change to English</Text>
          </Pressable>
        </View>

        <Image source={getSource()} style={styles.image} />

        {/* Conditionally render the onboarding content based on the current segment */}
        {currentSegment === "onboarding_1" && <Onboarding1 />}
        {/* You can similarly add other components for onboarding_2, onboarding_3 if needed */}
        <View style={styles.stackContainer}>
          <Stack>
            <Stack.Screen
              name="onboarding_1"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="onboarding_2"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="onboarding_3"
              options={{ headerShown: false }}
            />
          </Stack>
        </View>
        <Pressable
          style={{
            backgroundColor: "#13293D",
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
          onPress={() => {
            console.log("Button pressed");
            router.push({
              pathname: "/",
            });
          }}
        >
          <Text
            style={{
              color: "#fff",
            }}
          >
            {" "}
            Back to home page
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    marginVertical: 20,
  },
  backgroundImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%", // Adjust as needed to cover the bottom part of the screen
    height: "50%", // Adjust as needed
    resizeMode: "cover", // Ensures the image covers the area proportionally
    zIndex: -1, // Ensures the image stays behind all other elements
  },
});
