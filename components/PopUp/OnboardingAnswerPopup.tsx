import React, { useCallback, forwardRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  BackHandler,
} from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";
import { useTranslation } from "react-i18next";
import { Href, Link, router, useFocusEffect, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

const OnboardingAnswerPopup = forwardRef(
  (
    { setIsModalOpen, setBlurred, isModalOpen, isModalError }: any,
    ref: any
  ) => {
    const { t } = useTranslation();
    const snapPoints = useMemo(() => ["40%"], []);
    const router = useRouter();

    const handleDismissModal = useCallback(() => {
      setBlurred(false);
      ref.current?.dismiss();
      setIsModalOpen(false);
    }, []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          handleDismissModal();
        }
      },
      [handleDismissModal]
    );

    const handleContinue = () => {
      handleDismissModal();
      console.log(!isModalError && !isModalOpen);
      // Navigate to the next screen
      if (!isModalError) {
        console.log("Navigating to the next screen");
        router.navigate("/(onboarding)/onboarding_5");
      }
    };

    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (isModalOpen) {
            handleDismissModal();
            return true;
          }
          return false;
        };

        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () =>
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }, [isModalOpen, handleDismissModal])
    );

    // Custom handle component
    const CustomHandle = () => {
      return (
        <View style={styles.customHandleContainer}>
          <View style={styles.customHandle}>
            {isModalError ? (
              <Image
                source={require("@/assets/images/pop-ups/info-icon.png")}
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <Image
                source={require("@/assets/images/pop-ups/info-icon.png")}
                style={{ width: 80, height: 80 }}
              />
            )}
          </View>
        </View>
      );
    };

    const answerState = isModalError ? "bad_answer" : "good_answer";

    return (
      <BottomSheetModal
        ref={ref}
        index={0} // Start at the first snap point (index 0)
        snapPoints={snapPoints} // Fixed snap points
        enableDynamicSizing={false} // Disable dynamic sizing for fixed height
        onChange={handleSheetChanges}
        handleComponent={CustomHandle} // Use custom handle
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>{t(`pop-ups.${answerState}.title`)}</Text>

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Text
              style={{
                ...globalFonts.subtitle,
                fontSize: scaledFontSize(14),
                fontFamily: "Poppins_500Medium",
                alignSelf: "center",
                width: "80%",
                textAlign: "center",
              }}
            >
              {t(`pop-ups.${answerState}.description`)}
            </Text>

            {/* Bottom Button */}
            <TouchableOpacity
              style={[styles.button, styles.buttonActive]}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>
                {t(`pop-ups.${answerState}.button`)}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 30,
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 24,
    marginTop: "20%", // Adjust this to move the content upwards as it was before
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: scaledFontSize(24),
    color: "#13293D",
  },

  button: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 60,
    marginBottom: 20,
    height: 50,
  },
  buttonActive: {
    backgroundColor: "#333333",
  },
  buttonText: {
    ...globalFonts.subtitle,
    textAlign: "center",
    color: "white",
  },
  linkText: {
    fontSize: scaledFontSize(14),
    color: "#13293D",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
  customHandleContainer: {
    position: "absolute",
    top: -40, // Positioning for the icon
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  customHandle: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
});

export default OnboardingAnswerPopup;
