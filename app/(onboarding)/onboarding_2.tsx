import InvestmentCard from "@/components/InvestmentCard/InvestmentCard";
import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Divider } from "react-native-paper";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";

const Onboarding2: React.FC = () => {
  const { t } = useTranslation();

  // Capture a breadcrumb when the component mounts
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "Onboarding1 screen loaded",
      level: "info",
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={globalFonts.title}>{t("pages.onboarding_2.title")}</Text>
          <Text style={globalFonts.subtitle}>
            {t("pages.onboarding_2.subtitle_1")}{" "}
            <Text style={{ fontFamily: "Poppins_700Bold" }}>
              {t("pages.onboarding_2.subtitle_2")}
            </Text>{" "}
            {t("pages.onboarding_2.subtitle_3")}
          </Text>
          <Text style={{ ...globalFonts.disclaimerText }}>
            {t("pages.onboarding_2.disclaimer")}
          </Text>
        </View>
        <InvestmentCard
          investment={"DOLLAR US"}
          investing={true}
          isOnboarding={true}
        />
        <InvestmentCard
          investment={"EURO"}
          investing={true}
          isOnboarding={true}
        />

        <Divider
          style={{
            backgroundColor: "#13293D",
            opacity: 0.3,
            height: 1.5,
          }}
        />
        <Text style={globalFonts.title}>
          {t("pages.onboarding_2.second_title")}
        </Text>

        <Text style={globalFonts.subtitle}>
          {t("pages.onboarding_2.second_subtitle_1")}{" "}
          <Text style={{ fontFamily: "Poppins_700Bold" }}>
            {t("pages.onboarding_2.second_subtitle_2")}
          </Text>{" "}
          {t("pages.onboarding_2.second_subtitle_3")}
        </Text>
        <InvestmentCard
          investment={"DOLLAR US"}
          investing={false}
          isOnboarding={true}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    marginBottom: 120,
  },
  text: {
    fontSize: scaledFontSize(24),
    fontWeight: "bold",
    color: "#13293D",
  },
});

export default Onboarding2;
