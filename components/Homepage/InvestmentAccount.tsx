import { globalFonts } from "@/app/styles/globalFonts";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function InvestmentAccount({
  currency,
  investment_account_balance,
}: {
  currency: string;
  investment_account_balance: string;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.main_account}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <Text style={globalFonts.mediumSubtitle}>
          {t("pages.home.your_investment_account")}
        </Text>
        <Image
          source={require("@/assets/images/info-icon.png")}
          style={{
            marginBottom: 5,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#ECFF78",
          paddingHorizontal: 25,
          paddingVertical: 15,
          borderRadius: 30,
          width: "100%",
        }}
      >
        {/* Replace with async storage currency */}
        <Text
          style={{
            ...globalFonts.bigNumberSemi,
            includeFontPadding: false,
          }}
        >
          {investment_account_balance}
          <Text style={{ fontFamily: "Poppins_600SemiBold_Italic" }}>
            {" "}
            {currency}
          </Text>
        </Text>
        <Text
          style={{
            ...globalFonts.subtitle,
          }}
        >
          {t("pages.home.including_gains")} : {investment_account_balance}{" "}
          <Text style={{ fontFamily: "Poppins_400Regular_Italic" }}>
            {" "}
            {currency}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main_account: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-start",
  },
  buttonContainer: {
    position: "relative",
    width: "50%",
    height: 53, // Match the height of your image
    justifyContent: "center",
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  depositButtonText: {
    position: "absolute", // Overlay the text on top of the image
    color: "#13293D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    left: 40, // Adjust this value to position the text towards the left
    textAlign: "left", // Ensure the text aligns to the left
  },
  withdrawButtonText: {
    position: "absolute", // Overlay the text on top of the image
    color: "#13293D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    left: 85, // Adjust this value to position the text towards the left
    textAlign: "left", // Ensure the text aligns to the left
  },
});
