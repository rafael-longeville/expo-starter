import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { scaledFontSize } from "../styles/globalFonts";
import { router } from "expo-router";

const Onboarding5: React.FC = () => {
  const { t } = useTranslation();
  const [walletName, setWalletName] = useState("");

  const handleCreateWallet = () => {
    if (walletName.trim()) {
      router.push("/(onboarding)/onboarding_6");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Title */}
      <Text style={styles.title}>Créez votre portefeuille</Text>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Donnez lui un petit nom :</Text>
        <TextInput
          style={styles.input}
          placeholder="Saisir un nom"
          placeholderTextColor="#A0A0A0"
          value={walletName}
          onChangeText={setWalletName}
        />
        <Text style={styles.accessText}>Vous seul en aurez l'accès.</Text>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity
        style={[
          styles.button,
          walletName.trim() ? styles.buttonActive : styles.buttonDisabled,
        ]}
        onPress={handleCreateWallet}
        disabled={!walletName.trim()}
      >
        <Text style={styles.buttonText}>Créer mon portefeuille</Text>
      </TouchableOpacity>

      {/* Bottom Text Link */}
      <TouchableOpacity style={styles.linkContainer}>
        <Text style={styles.linkText}>Qu’est-ce qu’une clé privée</Text>
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
    fontSize: scaledFontSize(22),
    fontWeight: "700",
    textAlign: "center",
    color: "#212121",
    position: "absolute",
    top: 30, // 30px from the top
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
    width: "90%",
    position: "absolute",
    bottom: 70, // 30px above the link
  },
  buttonActive: {
    backgroundColor: "#333333",
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
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

export default Onboarding5;
