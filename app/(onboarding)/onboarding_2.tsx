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
      </View>
      <View style={styles.buttonContainer}>
        {/* Bottom Button */}
        <TouchableOpacity style={styles.button} onPress={handleCreateWallet}>
          <Text style={styles.buttonText}>
            {t("pages.onboarding_2.create_wallet_button")}
          </Text>
        </TouchableOpacity>

        {/* Bottom Text Link */}
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() =>
            router.push(
              "https://docs.wallet.civicpower.org/tout-comprendre/votre-paire-de-cle-dacces "
            )
          }
        >
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
    paddingHorizontal: 30,
    backgroundColor: "transparent",
    paddingBottom: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
  },
  descriptionContainer: {
    alignItems: "flex-start",
    width: "100%",
    gap: 20,
  },
  bulletContainer: {
    paddingLeft: 15,
  },
  title: {
    fontSize: scaledFontSize(22),
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 0.44,
  },
  subtitle: {
    fontSize: scaledFontSize(16),
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_400Regular",
  },
  descriptionText: {
    fontSize: scaledFontSize(16),
    lineHeight: 22,
    letterSpacing: 0.32,
    color: "#212121",
    fontFamily: "Poppins_400Regular",
  },
  button: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    width: "95%",
    backgroundColor: "#333333",
    // Add drop shadow for iOS
    shadowColor: "#091E42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Add elevation for Android
    elevation: 5,
  },
  buttonText: {
    fontSize: scaledFontSize(14),
    color: "#FFFFFF",
    fontWeight: "500",
  },
  linkContainer: {},
  linkText: {
    fontSize: scaledFontSize(14),
    color: "#212121",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
});

export default Onboarding2;
