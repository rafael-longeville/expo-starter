import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { scaledFontSize } from "../styles/globalFonts";

const Onboarding2: React.FC = () => {
  const { t } = useTranslation();

  const handleCreateWallet = () => {
    // Navigation logic for wallet creation
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
      <TouchableOpacity
        onPress={() => {
          /* Show info about private key */
        }}
      >
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
    backgroundColor: "transparent", // Keep background transparent
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
    alignItems: "flex-start", // Align content to the left
    width: "100%",
    gap: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: 0.32, // 2% of 16px is 0.32px
    color: "#212121",
    fontFamily: "Poppins",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#333333", // Adjust button color to match design
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: scaledFontSize(14),
    color: "#FFFFFF",
    fontWeight: "500",
  },
  linkText: {
    fontSize: scaledFontSize(12),
    color: "#13293D",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default Onboarding2;
