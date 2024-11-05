import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { scaledFontSize } from "../styles/globalFonts";
import { router } from "expo-router";

const Onboarding5: React.FC = () => {
  const { t } = useTranslation();
  const [walletName, setWalletName] = useState("");

  const handleCreateWallet = () => {
    router.navigate("/(onboarding)/onboarding_6");
  };

  return (
    <>
      <Text style={styles.title}>{t("pages.onboarding_5.title")}</Text>

      <View style={styles.container}>
        {/* Header Title */}

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>{t("pages.onboarding_5.label")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("pages.onboarding_5.placeholder")}
            placeholderTextColor="#A0A0A0"
            value={walletName}
            onChangeText={setWalletName}
          />
          <Text style={styles.accessText}>
            {t("pages.onboarding_5.access_text")}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* Bottom Button */}
          <TouchableOpacity
            style={[
              styles.button,
              walletName.trim() ? styles.buttonActive : styles.buttonDisabled,
            ]}
            onPress={handleCreateWallet}
            disabled={!walletName.trim()}
          >
            <Text style={styles.buttonText}>
              {t("pages.onboarding_5.create_wallet_button")}
            </Text>
          </TouchableOpacity>

          {/* Bottom Text Link */}
          <TouchableOpacity
            onPress={() =>
              router.push(
                "https://docs.wallet.civicpower.org/tout-comprendre/votre-paire-de-cle-dacces"
              )
            }
          >
            <Text style={styles.linkText}>
              {t("pages.onboarding_5.private_key_info")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    paddingBottom: 30,
    marginTop: 170,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    width: "100%",
  },
  title: {
    fontSize: scaledFontSize(22),
    fontWeight: "700",
    textAlign: "center",
    color: "#212121",
  },
  inputSection: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  label: {
    fontSize: scaledFontSize(20),
    fontFamily: "Poppins_400Regular",
    color: "#212121",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    width: "60%",
    height: 40,
    borderColor: "#6EE7B7",
    borderWidth: 0.5,
    borderRadius: 20,
    backgroundColor: "#FFFFFF", // White background
    paddingHorizontal: 10,
    textAlign: "center",
    fontSize: scaledFontSize(14),
    color: "#212121",
    marginBottom: 10,
  },
  accessText: {
    fontSize: scaledFontSize(16),
    fontFamily: "Poppins_400Regular",
    color: "#212121",
    textAlign: "center",
  },
  button: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    width: "95%",
    height: 40,
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

export default Onboarding5;
