import { globalFonts } from "@/app/styles/globalFonts";
import React, { useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { useTranslation } from "react-i18next";

export default function AccountDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  // Conditionally require the image based on the isOpen state
  const chevronIcon = isOpen
    ? require("../../assets/images/chevron-up-icon.png")
    : require("../../assets/images/chevron-down-icon.png");

  const total_balance = "1073,04";
  const main_account_balance = "133,64";
  const investment_account_balance = "939,40";

  const collapsibleText = !isOpen ? (
    <Text style={globalFonts.subtitle}>{t("pages.home.details")}</Text>
  ) : (
    <Text style={globalFonts.subtitle}>{t("pages.home.hide_details")}</Text>
  );

  return (
    <View style={styles.account_details}>
      <Text style={globalFonts.bigTitle}>{t("welcome")} !</Text>
      <Text style={globalFonts.subtitle}>{t("pages.home.total_balance")}</Text>
      {/* Change the currency symbol based on async storage value */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Text style={globalFonts.bigNumber}>{total_balance} €*</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Pressable
            onPress={() => setIsOpen(!isOpen)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            {collapsibleText}
            <Image
              source={chevronIcon}
              style={{
                marginTop: isOpen ? 3 : -10,
              }}
            />
          </Pressable>
        </View>
      </View>

      <Collapsible title="Transaction" isOpen={isOpen}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text style={styles.smallNumber}> {main_account_balance} €*</Text>
          <Text
            style={{
              ...globalFonts.subtitle,
              fontSize: 14,
            }}
          >
            {t("pages.home.on_main_account")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text style={styles.smallNumber}>
            {" "}
            {investment_account_balance} €*
          </Text>
          <Text
            style={{
              ...globalFonts.subtitle,
              fontSize: 14,
            }}
          >
            {t("pages.home.on_investments")}
          </Text>
        </View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  account_details: {
    backgroundColor: "#ECFF78",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  smallNumber: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },

  whiteSubtitle: {
    fontSize: 18,
    width: "100%",
    color: "white",
    fontFamily: "Poppins_400Regular",
  },
  scrollView: {
    backgroundColor: "#fff",
    height: "100%",
  },
});
