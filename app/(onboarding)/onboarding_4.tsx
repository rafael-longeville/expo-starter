import React, { forwardRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { scaledFontSize } from "../styles/globalFonts";
import { router } from "expo-router";
import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";

const Onboarding4 = forwardRef(({ setIsREF }: any, ref: any) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<null | number>(null);
  const [showError, setShowError] = useState(false);
  const { setIsBlurred, isBlurred, setIsModalOpen, setIsModalError } =
    useStayUpdatedModalContext();

  const handleVerify = () => {
    if (selectedOption === 1) {
      setIsBlurred(true);
      setIsModalOpen(true);
      setIsModalError(false);
      ref.current?.present();
    } else {
      setIsBlurred(true);
      setIsModalOpen(true);
      setIsModalError(true);
      ref.current?.present();

      // setShowError(true);
    }
  };

  const handleOptionSelect = (option: number) => {
    setSelectedOption(option);
    setShowError(false);
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Title and Subtitle */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          {t("pages.onboarding_4.understood_title")}
        </Text>
        <Text style={styles.subtitle}>
          {t("pages.onboarding_4.choose_correct_answer")}
        </Text>
        <Text style={styles.questionText}>
          {t("pages.onboarding_4.access_key_deletion")}
        </Text>
      </View>

      {/* Main Content (Centered) */}
      <View style={styles.contentContainer}>
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
              {/* Additional Circle with Blur Effect */}
              {selectedOption === 0 && (
                <View style={styles.additionalCircle} />
              )}
              {/* Inner Circle */}
              {selectedOption === 0 && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.optionText}>
              {t("pages.onboarding_4.option_recover_wallet")}
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
              {/* Additional Circle with Blur Effect */}
              {selectedOption === 1 && (
                <View style={styles.additionalCircle} />
              )}
              {/* Inner Circle */}
              {selectedOption === 1 && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.optionText}>
              {t("pages.onboarding_4.option_lose_access")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {showError && (
          <Text style={styles.errorText}>
            {t("pages.onboarding_4.incorrect_answer")}
          </Text>
        )}

        {/* Bottom Button */}
        <TouchableOpacity
          style={[
            styles.button,
            selectedOption !== null
              ? styles.buttonActive
              : styles.buttonDisabled,
          ]}
          onPress={handleVerify}
          disabled={selectedOption === null}
        >
          <Text style={styles.buttonText}>
            {t("pages.onboarding_4.verify_answer")}
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
            {t("pages.onboarding_4.private_key_info")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

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
  },
  questionText: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_400Regular",
    marginTop: 80, // Spacing below subtitle
  },
  optionsContainer: {
    marginTop: 50,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#525252",
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  radioCircleSelected: {
    // You can add styles here if needed when selected
  },
  additionalCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6EE7B7",
    position: "absolute",
    // Simulate blur with shadow (optional)
    shadowColor: "#6EE7B7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 4,
  },
  innerCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6EE7B7",
  },
  optionText: {
    fontSize: scaledFontSize(14),
    color: "#212121",
    flex: 1,
  },
  errorText: {
    color: "#FF0000",
    fontSize: scaledFontSize(14),
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    width: "95%",
    position: "absolute",
    bottom: 70,
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
    fontWeight: "500",
  },
  linkContainer: {
    position: "absolute",
    bottom: 30,
  },
  linkText: {
    fontSize: scaledFontSize(14),
    color: "#212121",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
});

export default Onboarding4;
