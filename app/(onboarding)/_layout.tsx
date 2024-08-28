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

export default function OnboardingLayout() {
  const segments = useSegments();
  const { t } = useTranslation();

  // Define the images for each onboarding step
  const images = {
    onboarding_1: require("@/assets/images/onboarding/onboarding_1.png"),
    onboarding_2: require("@/assets/images/onboarding/onboarding_2.png"),
    onboarding_3: require("@/assets/images/onboarding/onboarding_3.png"),
  } as const;

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

  const changeLanguageToFrench = () => {
    i18n.changeLanguage("fr");
  };

  const changeLanguageToEnglish = () => {
    i18n.changeLanguage("en");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("@/assets/images/yellow-rectangle.png")}
        style={styles.backgroundImage}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
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
        {renderCurrentScreen()}

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
            Back to home page
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#13293D",
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
          onPress={() => {
            console.log("Button pressed");
            let number = parseInt(currentSegment.split("_")[1]) + 1;
            let path = `/onboarding_${number as unknown as 1 | 2 | 3}`;
            router.push({
              pathname: path as
                | "/(onboarding)/onboarding_1"
                | "/(onboarding)/onboarding_2"
                | "/(onboarding)/onboarding_3",
            });
            console.log("Path: ", path);
          }}
        >
          <Text
            style={{
              color: "#fff",
            }}
          >
            Go + 1 page
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#13293D",
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
          onPress={() => {
            console.log("Button pressed");
            let number = parseInt(currentSegment.split("_")[1]) - 1;
            let path = `/onboarding_${number as unknown as 1 | 2 | 3}`;
            router.push({
              pathname: path as
                | "/(onboarding)/onboarding_1"
                | "/(onboarding)/onboarding_2"
                | "/(onboarding)/onboarding_3",
            });
            console.log("Path: ", path);
          }}
        >
          <Text
            style={{
              color: "#fff",
            }}
          >
            Go - 1 page
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
    resizeMode: "cover", // Ensures the image covers the area proportionally
    zIndex: -1, // Ensures the image stays behind all other elements
  },
});
