import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { scaledFontSize } from "../styles/globalFonts";
import { router } from "expo-router";

const Onboarding3: React.FC = () => {
  const { t } = useTranslation();
  const [isFirstChecked, setIsFirstChecked] = useState(false);
  const [isSecondChecked, setIsSecondChecked] = useState(false);
  const [isThirdChecked, setIsThirdChecked] = useState(false);

  const allChecked = isFirstChecked && isSecondChecked && isThirdChecked;

  const handleContinue = () => {
    if (allChecked) {
      router.push("/(onboarding)/onboarding_4");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Title and Subtitle */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          {t("pages.onboarding_3.security_title")}
        </Text>
        <Text style={styles.subtitle}>
          {t("pages.onboarding_3.access_key_importance")}
        </Text>
        <Text style={styles.instructionText}>
          {t("pages.onboarding_3.confirm_checkboxes")}
        </Text>
      </View>

      <View style={styles.mainContainer}>
        {/* Main Content (Centered) */}
        <View style={styles.contentContainer}>
          {/* Checkbox Section */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkboxItem,
                isFirstChecked && styles.checkedCheckbox,
              ]}
              onPress={() => setIsFirstChecked(!isFirstChecked)}
            >
              <Image
                source={
                  isFirstChecked
                    ? require("@/assets/images/onboarding/3/green_check.png")
                    : require("@/assets/images/onboarding/3/blue_check.png")
                }
                style={styles.checkIcon}
              />
              <Text style={styles.checkboxText}>
                {Platform.OS === 'ios' ? t("pages.onboarding_3.checkbox_1_ios") : t("pages.onboarding_3.checkbox_1_android")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.checkboxItem,
                isSecondChecked && styles.checkedCheckbox,
              ]}
              onPress={() => setIsSecondChecked(!isSecondChecked)}
            >
              <Image
                source={
                  isSecondChecked
                    ? require("@/assets/images/onboarding/3/green_check.png")
                    : require("@/assets/images/onboarding/3/blue_check.png")
                }
                style={styles.checkIcon}
              />
              <Text
                style={{
                  ...styles.checkboxText,
                  paddingRight: 30,
                }}
              >
                {t("pages.onboarding_3.checkbox_2")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.checkboxItem,
                isThirdChecked && styles.checkedCheckbox,
              ]}
              onPress={() => setIsThirdChecked(!isThirdChecked)}
            >
              <Image
                source={
                  isThirdChecked
                    ? require("@/assets/images/onboarding/3/green_check.png")
                    : require("@/assets/images/onboarding/3/blue_check.png")
                }
                style={styles.checkIcon}
              />
              <Text
                style={{
                  ...styles.checkboxText,
                  paddingRight: 30,
                }}
              >
                {t("pages.onboarding_3.checkbox_3")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {/* Bottom Button */}
          <TouchableOpacity
            style={[
              styles.button,
              allChecked ? styles.buttonActive : styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!allChecked}
          >
            <Text style={styles.buttonText}>
              {t("pages.onboarding_3.continue_button")}
            </Text>
          </TouchableOpacity>

          {/* Bottom Text Link */}
          <TouchableOpacity
            onPress={() =>
              router.push(
                "https://docs.wallet.civicpower.org/tout-comprendre/votre-paire-de-cle-dacces "
              )
            }
          >
            <Text style={styles.linkText}>
              {t("pages.onboarding_3.private_key_info")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  mainContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  title: {
    fontSize: scaledFontSize(22),
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_600SemiBold",
  },
  subtitle: {
    fontSize: scaledFontSize(20),
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_400Regular",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 36,
  },
  instructionText: {
    fontSize: scaledFontSize(16),
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_400Regular",
    letterSpacing: 0.32,
  },
  checkboxContainer: {
    marginBottom: 60,
    alignItems: "flex-start",
    width: "100%",
    gap: 15,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingRight: 5,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "#091E42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    width: "100%",
  },
  checkedCheckbox: {
    borderColor: "#00C6AE",
    borderWidth: 1,
  },
  checkIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  checkboxText: {
    fontSize: scaledFontSize(12),
    lineHeight: 20,
    color: "#212121",
    fontFamily: "Poppins_400Regular",
    flex: 1,
  },
  button: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    height: 40,
    paddingVertical: 10,
  },
  buttonActive: {
    backgroundColor: "#333333",
    // Add drop shadow for iOS
    shadowColor: "#091E42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Add elevation for Android
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    fontSize: scaledFontSize(14),
    color: "#FFFFFF",
    fontFamily: "Poppins_500Medium",
  },
  linkText: {
    fontSize: scaledFontSize(14),
    color: "#212121",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
});

export default Onboarding3;
