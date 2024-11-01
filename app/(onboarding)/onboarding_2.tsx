import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { scaledFontSize } from "../styles/globalFonts";
import { router } from "expo-router";

const Onboarding2: React.FC = () => {
  const { t } = useTranslation();

  const handleCreateWallet = () => {
    router.push("/(onboarding)/onboarding_3");
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Title and Subtitle */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t("pages.onboarding_2.title")}</Text>
        <Text style={styles.subtitle}>{t("pages.onboarding_2.subtitle")}</Text>
      </View>

      {/* Main Content (Centered) */}
      <View style={styles.contentContainer}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {t("pages.onboarding_2.description")}
          </Text>
          <View style={styles.bulletContainer}>
            <Text style={styles.descriptionText}>
              • {t("pages.onboarding_2.fingerprint")}
            </Text>
            <Text style={styles.descriptionText}>
              • {t("pages.onboarding_2.face_id")}
            </Text>
            <Text style={styles.descriptionText}>
              • {t("pages.onboarding_2.pin_code")}
            </Text>
          </View>
          <Text style={styles.descriptionText}>
            {t("pages.onboarding_2.icloud_note")}
          </Text>
          <Text style={styles.descriptionText}>
            {t("pages.onboarding_2.warning")}
          </Text>
        </View>

        {/* Bottom Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateWallet}
        >
          <Text style={styles.buttonText}>
            {t("pages.onboarding_2.create_wallet_button")}
          </Text>
        </TouchableOpacity>

        {/* Bottom Text Link */}
        <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.linkText}>
            {t("pages.onboarding_2.private_key_info")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: "transparent",
  },
  headerContainer: {
    position: "absolute",
    top: 30, // 30px from the top
    left: 0,
    right: 0,
    alignItems: "center",
  },
  title: {
    fontSize: scaledFontSize(22),
    fontWeight: "700",
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_600SemiBold",
  },
  subtitle: {
    fontSize: scaledFontSize(16),
    textAlign: "center",
    color: "#212121",
    marginTop: 20, // 20px below the title
    fontFamily: "Poppins_400Regular",

  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50, // Offset for the header section
  },
  descriptionContainer: {
    marginBottom: 60,
    alignItems: "flex-start",
    width: "100%",
    gap: 20,
  },
  bulletContainer: {
    paddingLeft: 15
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: 0.32,
    color: "#212121",
    fontFamily: "Poppins_400Regular",
    marginBottom: 5,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 70, // 30px above the link
  },
  buttonText: {
    fontSize: scaledFontSize(14),
    color: "#FFFFFF",
    fontWeight: "500",
  },
  linkContainer: {
    position: "absolute",
    bottom: 30, // 30px from the bottom
  },
  linkText: {
    fontSize: scaledFontSize(14),
    color: "#212121",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
});

export default Onboarding2;
