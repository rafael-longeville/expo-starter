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
import Onboarding5 from "./onboarding_5";
import Onboarding7 from "./onboarding_7";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import * as Sentry from "@sentry/react-native";
import { useTranslation } from "react-i18next";
import { useTyping } from "@/context/TypingContext";
import Onboarding6 from "./onboarding_6";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";
import { BlurView } from "@react-native-community/blur";
import NotificationsPopup from "@/components/PopUp/NotificationPopup";

const IMAGES = {
  onboarding_1: require("@/assets/images/onboarding/onboarding_1.png"),
  onboarding_2: require("@/assets/images/onboarding/onboarding_1.png"),
  onboarding_3: require("@/assets/images/onboarding/onboarding_1.png"),
  onboarding_4: require("@/assets/images/onboarding/onboarding_1.png"),
  onboarding_5: require("@/assets/images/onboarding/onboarding_2.png"),
  onboarding_6: require("@/assets/images/onboarding/onboarding_3.png"),


} as const;

export default function OnboardingLayout() {
  const segments = useSegments();
  const currentSegment = segments[segments.length - 1];
  const { t } = useTranslation();
  const { isTyping } = useTyping();
  const scrollViewRef = useRef(null);
  // Handle modals in onboarding
  const { setIsBlurred, isBlurred, setIsModalOpen } =
    useStayUpdatedModalContext();
  const notificationsModalRef = useRef(null);

  const renderCurrentScreen = (scrollViewRef: any) => {
    switch (currentSegment) {
      case "onboarding_1":
        return <Onboarding1 />;
      case "onboarding_2":
        return <Onboarding2 />;
      case "onboarding_3":
        return <Onboarding3 />;
      case "onboarding_4":
        return <Onboarding4 />;
      case "onboarding_5":
        return <Onboarding5 />;
      case "onboarding_6":
        return <Onboarding6 ref={notificationsModalRef} />;
      case "onboarding_7":
        return <Onboarding7 />;
      case "onboarding_4":
        return <Onboarding4 />;
      // default:
      //   return <Onboarding1 />;
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          {isBlurred && (
            <BlurView
              style={styles.absolute}
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />
          )}
          <Image
            source={require("@/assets/images/onboarding/background.png")}
            style={styles.backgroundImage}
          />
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollViewContainer}
          >
            {IMAGES[currentSegment as keyof typeof IMAGES] && (
              <Image
                source={IMAGES[currentSegment as keyof typeof IMAGES]}
                style={styles.image}
              />
            )}
            {renderCurrentScreen(scrollViewRef)}

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
                {/* <LanguageButton
              label="To home"
              onPress={() => router.push("/(tabs)/home")}
            /> */}
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

          <NotificationsPopup
            ref={notificationsModalRef}
            setIsModalOpen={setIsModalOpen}
            setBlurred={setIsBlurred}
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
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
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  stackContainer: {
    flex: 1,
  },
  text: {
    fontSize: scaledFontSize(32),
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
    top: "20%",
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
