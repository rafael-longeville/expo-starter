import InvestmentCard from "@/components/InvestmentCard/InvestmentCard";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Divider } from "react-native-paper";
// import { globalFonts } from "../styles/globalFonts";

const Onboarding1: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={globalFonts.title}>{t("pages.onboarding_1.title")}</Text>
      <Text style={globalFonts.subtitle}>
        {t("pages.onboarding_1.subtitle")}
      </Text>
      <InvestmentCard investment={"DOLLAR US"} investing={true} />
      <InvestmentCard investment={"EURO"} investing={true} />

      <Divider
        style={{
          backgroundColor: "#13293D",
          opacity: 0.3,
          height: 1.5,
        }}
      />
      <Text style={globalFonts.subtitle}>
        {t("pages.onboarding_1.second_subtitle")}
      </Text>
      <InvestmentCard investment={"DOLLAR US"} investing={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#13293D",
  },
});

const globalFonts = StyleSheet.create({
  bigTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 32,
    color: "#13293D",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 22,
    color: "#13293D",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#13293D",
  },
});

export default Onboarding1;
