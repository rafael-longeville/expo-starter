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
        <View
          style={{
            flexDirection: "column",
            gap: 29,
          }}
        >
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => handleOptionSelect(0)}
          >
            <View style={styles.optionCheckbox}>
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
            </View>
            <View style={styles.optionItem}>
              <Text style={styles.optionText}>
                {t("pages.onboarding_4.option_recover_wallet")}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => handleOptionSelect(1)}
          >
            <View style={styles.optionCheckbox}>
              <View
                style={{
                  ...styles.radioCircle,
                }}
              >
                {/* Additional Circle with Blur Effect */}
                {selectedOption === 1 && (
                  <>
                    <View style={styles.additionalCircle} />
                    <View style={styles.innerCircle} />
                  </>
                )}
              </View>
            </View>
            <View style={styles.optionItem}>
              <Text style={styles.optionText}>
                {t("pages.onboarding_4.option_lose_access")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

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
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: scaledFontSize(22),
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_600SemiBold",
  },
  subtitle: {
    fontSize: scaledFontSize(16),
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_400Regular",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 90,
  },
  questionText: {
    fontSize: scaledFontSize(20),
    fontWeight: "400",
    textAlign: "center",
    color: "#212121",
    fontFamily: "Poppins_400Regular",
    marginTop: 64, // Spacing below subtitle
  },
  optionContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 45,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  optionCheckbox: {
    width: "10%",
  },
  optionItem: {
    width: "90%",
  },
  optionText: {
    fontSize: scaledFontSize(12),
    color: "#212121",
    fontFamily: "Poppins_400Regular",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#525252",
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
    width: 1,
    height: 1,
    borderRadius: 3,
    backgroundColor: "#6EE7B7",
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
