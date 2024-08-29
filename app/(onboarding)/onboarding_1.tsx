import InvestmentCard from "@/components/InvestmentCard/InvestmentCard";
import { Link, router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Divider } from "react-native-paper";
import { globalFonts } from "../styles/globalFonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
      <Pressable
        style={{
          backgroundColor: "#13293D",
          padding: 10,
          borderRadius: 30,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          width: 335,
        }}
        onPress={() => {
          AsyncStorage.setItem("continueWithoutFunding", "true");
          router.push("/(onboarding)/onboarding_2");
        }}
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
          textAlign: "center",
          fontSize: 14,
          fontFamily: "Poppins_500Medium",
        }}
      >
        <Link href={"/(tabs)/login"}>
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

export default Onboarding1;
