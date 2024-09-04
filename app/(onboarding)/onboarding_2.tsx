import InvestmentCard from "@/components/InvestmentCard/InvestmentCard";
import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Divider } from "react-native-paper";
import { globalFonts } from "../styles/globalFonts";
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

  const handleContinuePress = async () => {
    try {
      Sentry.addBreadcrumb({
        category: "action",
        message: "User clicked continue without funding",
        level: "info",
      });

      await AsyncStorage.setItem("continueWithoutFunding", "true");

      Sentry.addBreadcrumb({
        category: "storage",
        message: "Stored continueWithoutFunding flag in AsyncStorage",
        level: "info",
      });

      router.push("/(onboarding)/onboarding_3");
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error storing data or navigating:", error);
    }
  };

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
      <Pressable
        style={{
          backgroundColor: "#13293D",
          padding: 10,
          borderRadius: 30,
          marginTop: 20,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        onPress={handleContinuePress}
      >
        <Text
          style={{
            ...globalFonts.whiteSubtitle,
            textAlign: "center",
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
          }}
        >
          {t("pages.onboarding_1.continue_button")}
        </Text>
      </Pressable>
      <Text
        style={{
          ...globalFonts.subtitle,
          width: "100%",
          textAlign: "center",
          fontSize: 14,
          fontFamily: "Poppins_500Medium",
        }}
      >
        <Link href={"/(onboarding)/onboarding_3"} style={{ width: "100%" }}>
          {t("pages.onboarding_1.has_account")}
        </Link>
      </Text>
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

export default Onboarding2;
