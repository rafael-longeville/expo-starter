import React, { useCallback, forwardRef, useMemo } from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert, Platform, Linking } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";
import { useTranslation } from "react-i18next";
import { Href, Link, router, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

// Custom handle component
const CustomHandle = () => {
  return (
    <View style={styles.customHandleContainer}>
      <View style={styles.customHandle}>
        <Image
          source={require("@/assets/images/pop-ups/info-icon.png")}
          style={{ width: 80, height: 80 }}
        />
      </View>
    </View>
  );
};

const NotificationsPopup = forwardRef(
  ({ setIsModalOpen, setBlurred, isModalOpen }: any, ref: any) => {
    const { t } = useTranslation();
    const snapPoints = useMemo(() => [360], []);
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

    const handleContinue = async () => {
      // Close the modal
      handleDismissModal();
      // Navigate to the next screen
      if (!isModalOpen) {
        const { status } = await Notifications.getPermissionsAsync();

      if (status === "granted") {
        // Permission is already granted
        router.navigate("/(onboarding)/onboarding_7");
      } else if (status === "denied") {
        // Permission has been denied previously
        Alert.alert(
          "Permission Required",
          "This app needs permission to show notifications. Please go to your app settings to enable notifications.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                const settingsUrl =
                  Platform.OS === "ios"
                    ? "app-settings:" // iOS settings
                    : "package:com.mcs_ibex.app"; // Android settings with package name
                Linking.openURL(settingsUrl).catch(() => {
                  Alert.alert(
                    "Error",
                    "Unable to open settings. Please navigate to your device settings manually.",
                    [{ text: "OK" }]
                  );
                });
              },
            },
          ]
        );
      } else {
        // Request permission again
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus === "granted") {
          router.navigate("/(onboarding)/onboarding_7");
        } else {
          Alert.alert(
            "Permission Required",
            "This app needs permission to show notifications. Please go to your app settings to enable notifications.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => {
                  const settingsUrl =
                    Platform.OS === "ios"
                      ? "app-settings:" // iOS settings
                      : "package:com.mcs_ibex.app"; // Android settings with package name
                  Linking.openURL(settingsUrl).catch(() => {
                    Alert.alert(
                      "Error",
                      "Unable to open settings. Please navigate to your device settings manually.",
                      [{ text: "OK" }]
                    );
                  });
                },
              },
            ]
          );
        }
      }
      }
    };

    const handleContinueWithout = () => {
      // Close the modal
      handleDismissModal();
      // Navigate to the next screen
      if (!isModalOpen) {
        router.navigate("/(onboarding)/onboarding_7");
      }
    };

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
          <Text style={styles.title}>
            {t("pop-ups.onboarding_notifications.title")}
          </Text>

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
              {t("pop-ups.onboarding_notifications.description")}
            </Text>

            {/* Bottom Button */}
            <TouchableOpacity
              style={[styles.button, styles.buttonActive]}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>
                {t("pop-ups.onboarding_notifications.button")}
              </Text>
            </TouchableOpacity>

            {/* Bottom Text Link */}
            <TouchableOpacity onPress={handleContinueWithout}>
              <Text style={styles.linkText}>
                {t("pop-ups.onboarding_notifications.continue_without")}
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
    marginTop: 50, // Adjust this to move the content upwards as it was before
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
    height: 37,
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

export default NotificationsPopup;
