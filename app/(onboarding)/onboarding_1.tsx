import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import { useTranslation } from "react-i18next";
import { Divider } from "react-native-paper";
import * as Sentry from "@sentry/react-native";
import i18n from "../i18n";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom Switch component to toggle notifications
const CustomSwitch: React.FC<{ value: boolean; onValueChange: () => void }> = ({
  value,
  onValueChange,
}) => {
  const handlePress = async () => {
    Sentry.addBreadcrumb({
      category: "action",
      message: `User toggled notifications switch to ${value ? "off" : "on"}`,
      level: "info",
    });

    if (value) {
      onValueChange();
    } else {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        onValueChange();
      } else {
        Alert.alert(
          "Permission Required",
          "This app needs permission to show notifications.",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.switchContainer, styles.switch]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.switchThumb,
          value ? styles.switchThumbOn : styles.switchThumbOff,
        ]}
      >
        {value ? (
          <Image source={require("../../assets/images/check-icon.png")} />
        ) : (
          <Image source={require("../../assets/images/cross-icon.png")} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const Onboarding1: React.FC = () => {
  const { t } = useTranslation();

  const [selectedCurrency, setSelectedCurrency] = useState<
    "euro" | "dollar" | null
  >("dollar");
  const [selectedLanguage, setSelectedLanguage] = useState<"fr" | "en" | null>(
    "en"
  );
  const [notifications, setNotifications] = useState<boolean>(false);

  useEffect(() => {
    const fetchStoredAndResetSettings = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("selectedLanguage");
        const storedCurrency = await AsyncStorage.getItem("selectedCurrency");
        const storedNotifications = await AsyncStorage.getItem("notifications");

        const allKeys = await AsyncStorage.getAllKeys();
        console.log("allKeys", allKeys);
        const walletTokenKey = allKeys.find((key) =>
          key.startsWith("walletToken")
        );
        const thirdwebEwsWalletUserDetailsKey = allKeys.find((key) =>
          key.startsWith("thirdwebEwsWalletUserDetails")
        );

        if (walletTokenKey) {
          console.log("Removing walletTokenKey", walletTokenKey);
          await AsyncStorage.removeItem(walletTokenKey);
        }
        if (thirdwebEwsWalletUserDetailsKey) {
          console.log(
            "Removing thirdwebEwsWalletUserDetailsKey",
            thirdwebEwsWalletUserDetailsKey
          );
          await AsyncStorage.removeItem(thirdwebEwsWalletUserDetailsKey);
        }
        await AsyncStorage.removeItem("thirdweb:active-wallet-id");
        await AsyncStorage.removeItem("thirdweb:connected-wallet-ids");
        await AsyncStorage.removeItem("thirdweb:active-chain");

        await AsyncStorage.setItem("continueWithoutFunding", "false");

        if (storedLanguage) {
          i18n.changeLanguage(storedLanguage);
          setSelectedLanguage(storedLanguage as "fr" | "en");
        }
        if (storedCurrency) {
          setSelectedCurrency(storedCurrency as "euro" | "dollar");
        }
        if (storedNotifications !== null) {
          setNotifications(storedNotifications === "true");
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error(
          "Error retrieving settings or JWT tokens from AsyncStorage:",
          error
        );
      }
    };

    fetchStoredAndResetSettings();
  }, []);

  useEffect(() => {
    // Add notification listeners
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleCurrencySelection = (currency: "euro" | "dollar") => {
    Sentry.addBreadcrumb({
      category: "selection",
      message: `User selected currency: ${currency}`,
      level: "info",
    });
    setSelectedCurrency(currency);
  };

  const handleLanguageSelection = (language: "fr" | "en") => {
    Sentry.addBreadcrumb({
      category: "selection",
      message: `User selected language: ${language}`,
      level: "info",
    });
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  const handleContinuePress = async () => {
    try {
      Sentry.addBreadcrumb({
        category: "action",
        message: "User clicked save button",
        level: "info",
      });

      // Save all settings to AsyncStorage
      await AsyncStorage.setItem("selectedLanguage", selectedLanguage || "en");
      await AsyncStorage.setItem(
        "selectedCurrency",
        selectedCurrency || "dollar"
      );
      await AsyncStorage.setItem(
        "notifications",
        notifications ? "true" : "false"
      );
      await AsyncStorage.setItem(
        "settingsDone",
        "true"
      );
      // Navigate to the next screen
      router.push("/(onboarding)/onboarding_2");
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error storing data or navigating:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={globalFonts.title}>{t("pages.onboarding_1.title")}</Text>
      </View>
      <View style={{ flexDirection: "column", gap: 15, width: "100%" }}>
        <View style={{ flexDirection: "column", gap: 5, width: "100%" }}>
          <Text style={styles.questionText}>
            {t("pages.onboarding_1.money_question")}
          </Text>
          <Text style={styles.descriptionText}>
            {t("pages.onboarding_1.money_question_helper")}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={[
              styles.commonButtonStyle,
              selectedCurrency === "euro" && styles.isSelectedButtonStyle,
            ]}
            onPress={() => handleCurrencySelection("euro")}
          >
            <Text
              style={{
                fontSize: scaledFontSize(16),
                color:
                  selectedCurrency === "euro"
                    ? "#13293D"
                    : "rgba(19, 41, 61, .7)",
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Euro (€)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.commonButtonStyle,
              selectedCurrency === "dollar" && styles.isSelectedButtonStyle,
            ]}
            onPress={() => handleCurrencySelection("dollar")}
          >
            <Text
              style={{
                fontSize: scaledFontSize(16),
                color:
                  selectedCurrency === "dollar"
                    ? "#13293D"
                    : "rgba(19, 41, 61, .7)",
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              {t("pages.onboarding_1.dollar")} ($)
            </Text>
          </TouchableOpacity>
        </View>
        <Divider style={{ width: "100%", height: 1.5 }} />
        <View style={{ flexDirection: "column", gap: 5, width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={styles.questionText}>
              {t("pages.onboarding_1.notifications_question")}
            </Text>
            <CustomSwitch
              value={notifications}
              onValueChange={() => {
                setNotifications(!notifications);
              }}
            />
          </View>
          <Text style={styles.descriptionText}>
            {t("pages.onboarding_1.notifications_question_helper")}
          </Text>
        </View>
        <Divider style={{ width: "100%", height: 1.5 }} />
        <View style={{ flexDirection: "column", gap: 5, width: "100%" }}>
          <Text style={styles.questionText}>
            {t("pages.onboarding_1.language_question")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={[
                styles.commonButtonStyle,
                selectedLanguage === "fr" && styles.isSelectedButtonStyle,
              ]}
              onPress={() => handleLanguageSelection("fr")}
            >
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <Image source={require("../../assets/images/flags/fr.png")} />
                <Text
                  style={{
                    fontSize: scaledFontSize(16),
                    color:
                      selectedLanguage === "fr"
                        ? "#13293D"
                        : "rgba(19, 41, 61, .7)",
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  Français
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.commonButtonStyle,
                selectedLanguage === "en" && styles.isSelectedButtonStyle,
              ]}
              onPress={() => handleLanguageSelection("en")}
            >
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <Image source={require("../../assets/images/flags/usa.png")} />
                <Text
                  style={{
                    fontSize: scaledFontSize(16),
                    color:
                      selectedLanguage === "en"
                        ? "#13293D"
                        : "rgba(19, 41, 61, .7)",
                    fontFamily: "Poppins_600SemiBold",
                  }}
                >
                  English
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Pressable
            style={{
              backgroundColor: "#13293D",
              padding: 10,
              borderRadius: 30,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: 30,
            }}
            onPress={handleContinuePress}
          >
            <Text
              style={{
                ...globalFonts.whiteSubtitle,
                textAlign: "center",
                fontSize: scaledFontSize(14),
                fontFamily: "Poppins_500Medium",
              }}
            >
              {t("pages.onboarding_1.save_button")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 20,
  },
  questionText: {
    fontSize: scaledFontSize(14),
    color: "#13293D",
    fontFamily: "Poppins_600SemiBold",
    width: "80%",
  },
  descriptionText: {
    fontSize: scaledFontSize(12),
    color: "#13293D",
    opacity: 0.7,
    fontFamily: "Poppins_400Regular",
    width: "100%",
  },
  commonButtonStyle: {
    width: "47%",
    borderWidth: 2,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(19, 41, 61, .5)",
    backgroundColor: "#FFFFFF",
  },
  isSelectedButtonStyle: {
    backgroundColor: "#DFE6FF",
    borderColor: "#13293D",
  },
  switchContainer: {
    width: 70,
    height: 40,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 2,
  },
  switch: {
    backgroundColor: "#13293D",
  },
  switchThumb: {
    width: 30,
    height: 30,
    borderRadius: 52.5,
    justifyContent: "center",
    alignItems: "center",
  },
  switchThumbOn: {
    backgroundColor: "#FFF",
    transform: [{ translateX: 15 }],
  },
  switchThumbOff: {
    backgroundColor: "#FFF",
    transform: [{ translateX: -15 }],
  },
  switchIcon: {
    fontSize: scaledFontSize(16),
    color: "#13293D",
  },
});

export default Onboarding1;
