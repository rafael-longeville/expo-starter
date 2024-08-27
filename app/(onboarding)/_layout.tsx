import { Stack, useSegments } from "expo-router";
import React from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

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
    // Check if currentSegment is a valid key in the images object
    if (
      currentSegment === "onboarding_1" ||
      currentSegment === "onboarding_2" ||
      currentSegment === "onboarding_3"
    ) {
      return images[currentSegment];
    }

    // Fallback image if the current segment doesn't match any onboarding keys
    return require("@/assets/images/onboarding/onboarding_1.png");
  };

  const changeLanguageToFrench = () => {
    i18n.changeLanguage("fr");
  };

  // Function to change the language to English
  const changeLanguageToEnglish = () => {
    i18n.changeLanguage("en");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* The image is displayed at the top */}
      {currentSegment === "onboarding_1" && (
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Pressable
              onPress={changeLanguageToFrench}
              style={{
                backgroundColor: "blue",
                padding: 2,
              }}
            >
              <Text
                style={{
                  backgroundColor: "blue",
                  color: "white",
                }}
              >
                Change to French
              </Text>
            </Pressable>
            <Pressable
              onPress={changeLanguageToEnglish}
              style={{
                backgroundColor: "blue",
                padding: 2,
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Change to English
              </Text>
            </Pressable>
          </View>
          <Text style={styles.text}>{t("welcome")}</Text>
        </>
      )}
      <Image source={getSource()} style={styles.image} />
      {/* Stack Navigator is displayed below the image */}
      <View style={styles.stackContainer}>
        <Stack>
          <Stack.Screen name="onboarding_1" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding_2" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding_3" options={{ headerShown: false }} />
        </Stack>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#13293D",
    textAlign: "center",
    marginVertical: 10, // Space between text and image
  },
  container: {
    flex: 1,
    backgroundColor: "#fff", // Example background color
    padding: 20,
  },
  stackContainer: {
    flex: 1,
  },
  image: {
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20, // Space between image and other elements
  },
});
