import { Stack, useSegments } from "expo-router";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingLayout() {
  const segments = useSegments();

  // Define the images for each onboarding step
  const images = {
    onboarding_1: require("@/assets/images/onboarding/onboarding_1.png"),
    onboarding_2: require("@/assets/images/onboarding/onboarding_2.png"),
    onboarding_3: require("@/assets/images/onboarding/onboarding_3.png"),
  } as const;

  // Get source based on the current route
  const getSource = () => {
    const currentSegment = segments[segments.length - 1];

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

  return (
    <SafeAreaView style={styles.container}>
      {/* The image is displayed at the top */}
      <Image source={getSource()} style={styles.image} />
      {/* Stack Navigator is displayed below the image */}
      <View style={styles.stackContainer}>
        <Stack>
          <Stack.Screen name="onboarding_1" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding_3" options={{ headerShown: false }} />
        </Stack>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Example background color
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
