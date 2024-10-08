import React, { useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { useTranslation } from "react-i18next";
import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";

interface AccountDetailsProps {
  currency: string; // Currency symbol passed from HomeScreen
  main_account_balance: string;
  investment_account_balance: string;
  total_balance: string;
}

export default function AccountDetails({
  currency,
  main_account_balance,
  investment_account_balance,
  total_balance,
}: AccountDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const chevronIcon = isOpen
    ? require("../../assets/images/chevron-up-icon.png")
    : require("../../assets/images/chevron-down-icon.png");

  const collapsibleText = !isOpen ? (
    <Text style={globalFonts.subtitle}>{t("pages.home.details")}</Text>
  ) : (
    <Text style={globalFonts.subtitle}>{t("pages.home.hide_details")}</Text>
  );

  return (
    <View style={styles.account_details}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Text style={globalFonts.subtitle}>
          {t("pages.home.total_balance")}
        </Text>
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={globalFonts.bigNumber}>{total_balance} </Text>
          <Text
            style={{
              ...globalFonts.bigNumber,
              fontFamily:
                parseFloat(total_balance) > 0 && currency !== "$"
                  ? "Poppins_700Bold_Italic"
                  : "Poppins_700Bold",
            }}
          >
            {currency}
          </Text>
        </View>
      </View>

      <Collapsible title="Transaction" isOpen={isOpen}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 5,
              width: "100%",
            }}
          >
            <Text style={styles.smallNumber}>
              {main_account_balance}{" "}
              <Text
                style={{
                  ...styles.smallNumber,
                  fontFamily:
                    parseFloat(main_account_balance) > 0 && currency !== "$"
                      ? "Poppins_700Bold_Italic"
                      : "Poppins_700Bold",
                }}
              >
                {currency}
              </Text>
            </Text>
            <Text
              style={{
                ...globalFonts.subtitle,
                fontSize: scaledFontSize(14),
              }}
            >
              {t("pages.home.on_main_account")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 5,
            }}
          >
            <Text style={styles.smallNumber}>
              {investment_account_balance}{" "}
              <Text
                style={{
                  ...styles.smallNumber,
                  fontFamily:
                    parseFloat(investment_account_balance) > 0 &&
                    currency !== "$"
                      ? "Poppins_700Bold_Italic"
                      : "Poppins_700Bold",
                }}
              >
                {currency}
              </Text>
            </Text>
            <Text
              style={{
                ...globalFonts.subtitle,
                fontSize: scaledFontSize(14),
              }}
            >
              {t("pages.home.on_investments")}
            </Text>
          </View>
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
    fontSize: scaledFontSize(18),
    fontFamily: "Poppins_700Bold",
    color: "#13293D",
  },
  whiteSubtitle: {
    fontSize: scaledFontSize(18),
    width: "100%",
    color: "white",
    fontFamily: "Poppins_400Regular",
  },
  scrollView: {
    backgroundColor: "#fff",
    height: "100%",
  },
});
