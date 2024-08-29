import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { WebView } from "react-native-webview";
import { globalFonts } from "../styles/globalFonts";
import { useActiveAccount } from "thirdweb/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const Onboarding3: React.FC = () => {
  const account = useActiveAccount();
  const [onboardingValue, setOnboardingValue] = useState<string | null>(null);
  const [onboardingMethod, setOnboardingMethod] = useState<string | null>(null);
  const [customUri, setCustomUri] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        const value = await AsyncStorage.getItem("onboardingValue");
        const method = await AsyncStorage.getItem("onboardingMethod");
        setOnboardingValue(value);
        setOnboardingMethod(method);

        if (account?.address) {
          let uri =
            "https://global-stg.transak.com/?apiKey=ec807ee4-b564-4b2a-af55-92a8adfe619b&network=arbitrum&paymentMethod=credit_debit_card&visaMasterCard=true&defaultCryptoCurrency=USDC&productsAvailed=BUY&walletAddress=" +
            account.address;

          if (method === "onRamp") {
            uri =
              "https://global-stg.transak.com/?apiKey=ec807ee4-b564-4b2a-af55-92a8adfe619b&network=arbitrum&paymentMethod=credit_debit_card&visaMasterCard=true&defaultCryptoCurrency=USDC&productsAvailed=BUY&fiatCurrency=EUR&walletAddress=" +
              account.address +
              "&fiatAmount=" +
              onboardingValue;
          }

          setCustomUri(uri);
          console.log(uri);
        }
      } catch (error) {
        console.log("Error loading onboarding data from AsyncStorage", error);
      }
    };

    loadOnboardingData();
  }, [account, onboardingMethod, onboardingValue]);

  return (
    <View style={styles.container}>
      <View style={styles.containercompte}>
        <Image
          source={require("@/assets/images/lock-icon.png")}
          style={styles.icon}
        />
        <Text style={styles.textcompte}>
          <Text style={globalFonts.whiteSubtitle}>
            {t("pages.onboarding_3.account")} DOLLAR US :
          </Text>
          <Text style={styles.amount}> 0 €*</Text>
        </Text>
      </View>
      <Text style={globalFonts.title}>{t("pages.onboardin_3.title")}</Text>
      <Text style={globalFonts.subtitle}>
        {t("pages.onboardin_3.subtitle")}
      </Text>
      {customUri && (
        <WebView style={styles.webview} source={{ uri: customUri }} />
      )}
      <Text style={globalFonts.title}>
        Value is {onboardingValue} and method is {onboardingMethod}
      </Text>
      <Text
        style={{
          ...globalFonts.subtitle,
          textAlign: "center",
          fontSize: 14,
          fontFamily: "Poppins_500Medium",
        }}
      >
        {t("pages.onboarding_3.cancel")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  webview: {
    marginTop: 20,
    width: "100%",
    height: 800,
  },
  containercompte: {
    height: 60,
    borderRadius: 30,
    width: "100%",
    backgroundColor: "#13293D",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    marginBottom: 30,
  },
  icon: {
    marginRight: 10,
  },
  textcompte: {
    flexDirection: "row",
    alignItems: "center",
    fontFamily: "Poppins",
  },
  amount: {
    color: "#ECFF78",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Poppins",
  },
});

export default Onboarding3;
