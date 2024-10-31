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
      {/* Header Title */}
      <Text style={styles.title}>{t("pages.onboarding_2.title")}</Text>
      <Text style={styles.subtitle}>{t("pages.onboarding_2.subtitle")}</Text>

      {/* Description Section */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {t("pages.onboarding_2.description")}
        </Text>
        <View>
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
      <TouchableOpacity style={styles.button} onPress={handleCreateWallet}>
        <Text style={styles.buttonText}>
          {t("pages.onboarding_2.create_wallet_button")}
        </Text>
      </TouchableOpacity>

      {/* Bottom Text Link */}
      <TouchableOpacity>
        <Text style={styles.linkText}>
          {t("pages.onboarding_2.private_key_info")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: scaledFontSize(20),
    fontWeight: "700",
    textAlign: "center",
    color: "#13293D",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: scaledFontSize(14),
    textAlign: "center",
    color: "#13293D",
    opacity: 0.7,
    marginBottom: "20%",
  },
  descriptionContainer: {
    marginBottom: "30%",
    alignItems: "flex-start",
    width: "100%",
    gap: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: 0.32,
    color: "#212121",
    fontFamily: "Poppins",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#333333", // Active color to match Onboarding3
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    width: "100%", // Full width to match checkbox container in Onboarding3
  },
  buttonText: {
    fontSize: scaledFontSize(14),
    color: "#FFFFFF",
    fontWeight: "500",
  },
  linkText: {
    fontSize: scaledFontSize(14), // 1.5 times bigger
    color: "#13293D",
    textAlign: "center",
  },
});

export default Onboarding2;
