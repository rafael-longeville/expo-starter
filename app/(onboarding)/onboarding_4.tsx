import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { globalFonts } from "../styles/globalFonts";
import { useTranslation } from "react-i18next";

const Onboarding4: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View>
        <Text style={globalFonts.title}>{t("pages.onboarding_4.title")}</Text>
        <Text style={globalFonts.subtitle}>
          {t("pages.onboarding_4.subtitle")}
        </Text>
      </View>
      <View>
        <Text style={styles.questionText}>
          {t("pages.onboarding_4.money_question")}
        </Text>
        <Text style={styles.descriptionText}>
          {t("pages.onboarding_4.money_question_helper")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 20,
  },
  questionText: {
    fontSize: 14,
    color: "#13293D",
    fontFamily: "Poppins_600SemiBold",
  },
  descriptionText: {
    fontSize: 12,
    color: "#13293D",
    opacity: 0.7,
    fontFamily: "Poppins_400Regular",
    width: "80%",
  },
});

export default Onboarding4;
