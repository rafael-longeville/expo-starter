import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { scaledFontSize } from "../styles/globalFonts";
import { router } from "expo-router";

const Onboarding4: React.FC = () => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<null | number>(null);
  const [showError, setShowError] = useState(false);

  const handleVerify = () => {
    if (selectedOption === 1) {
      router.push("/(onboarding)/onboarding_6"); // Navigate to the next screen if correct
    } else {
      setShowError(true); // Show error message if the answer is incorrect
    }
  };

  const handleOptionSelect = (option: number) => {
    setSelectedOption(option);
    setShowError(false); // Reset error message when the user selects a new option
  };

  return (
    <View style={styles.container}>
      {/* Header Title */}
      <Text style={styles.title}>Avez-vous bien compris ?</Text>
      <Text style={styles.subtitle}>Choisissez la bonne réponse.</Text>

      {/* Question */}
      <Text style={styles.questionText}>
        Si vous supprimez la clé d'accès...
      </Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => handleOptionSelect(0)}
        >
          <View
            style={[
              styles.radioCircle,
              selectedOption === 0 && styles.radioCircleSelected,
            ]}
          >
            {selectedOption === 0 && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.optionText}>
            Je pourrais tout de même récupérer mon portefeuille
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => handleOptionSelect(1)}
        >
          <View
            style={[
              styles.radioCircle,
              selectedOption === 1 && styles.radioCircleSelected,
            ]}
          >
            {selectedOption === 1 && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.optionText}>
            Je ne pourrais plus me connecter à mon portefeuille et perdrais
            l'accès à mes fonds.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {showError && (
        <Text style={styles.errorText}>
          Réponse incorrecte, veuillez réessayer.
        </Text>
      )}

      {/* Bottom Button */}
      <TouchableOpacity
        style={[
          styles.button,
          selectedOption !== null ? styles.buttonActive : styles.buttonDisabled,
        ]}
        onPress={handleVerify}
        disabled={selectedOption === null}
      >
        <Text style={styles.buttonText}>Vérifier ma réponse</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: scaledFontSize(16),
    textAlign: "center",
    color: "#212121",
    marginBottom: 30,
  },
  questionText: {
    fontSize: scaledFontSize(16),
    fontWeight: "600",
    textAlign: "center",
    color: "#212121",
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 45,
    backgroundColor: "#F8F8F8",
    marginBottom: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "black", // Fading green border
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: "black", // Slightly darker green for selected
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#A0E8D1", // Lighter green color for inner circle
  },
  optionText: {
    fontSize: scaledFontSize(14),
    color: "#212121",
    flex: 1,
  },
  errorText: {
    color: "#FF0000", // Red color for error message
    fontSize: scaledFontSize(14),
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
    marginBottom: 20,
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
    fontSize: scaledFontSize(18), // 1.5 times bigger
    color: "#13293D",
    textAlign: "center",
  },
});

export default Onboarding4;
