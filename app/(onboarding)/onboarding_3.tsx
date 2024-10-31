import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
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
      {/* Header Title */}
      <Text style={styles.title}>Sécurité</Text>
      <Text style={styles.subtitle}>Votre clé d'accès est importante</Text>
      <Text style={styles.instructionText}>
        Cochez toutes les cases pour confirmer que vous comprenez l'importance
        des clés d'accès.
      </Text>

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
            Sur votre téléphone, allez dans «Paramètres › Votre compte › iCloud»
            et activez «Mots de passe et keychain» (pas 1Password), pour activer
            les clés d'accès.
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
          <Text style={styles.checkboxText}>
            Les clés d'accès vous permettent de récupérer le portefeuille à
            l'avenir, en cas de perte ou de remplacement de votre appareil.
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
          <Text style={styles.checkboxText}>
            Important : si votre clé d'accès est supprimée (et que vous ne
            l'avez pas sauvegardée autrement), vous perdez l'accès au
            portefeuille et aux fonds.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity
        style={[
          styles.button,
          allChecked ? styles.buttonActive : styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!allChecked}
      >
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>

      {/* Bottom Text Link */}
      <TouchableOpacity>
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
    backgroundColor: "transparent",
  },
  title: {
    fontSize: scaledFontSize(22),
    fontWeight: "700",
    textAlign: "center",
    color: "#212121",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: scaledFontSize(20),
    textAlign: "center",
    color: "#212121",
    marginBottom: 15,
  },
  instructionText: {
    fontSize: scaledFontSize(18),
    textAlign: "center",
    color: "#212121",
    marginBottom: 60,
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
    paddingRight: 8,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: "#F8F8F8",
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
    fontSize: 12,
    lineHeight: 20,
    fontWeight: "400",
    color: "#212121",
    fontFamily: "Poppins_400Regular",

    flex: 1,
  },
  button: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    height: 37,
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
  linkText: {
    fontSize: scaledFontSize(14),
    color: "#13293D",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
});

export default Onboarding3;
