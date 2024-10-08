import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import { useActiveAccount } from "thirdweb/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react-native";
import {
  TransakWebView,
  Events,
  EventTypes,
  Order,
} from "@transak/react-native-sdk";

const Onboarding4: React.FC = () => {
  const account = useActiveAccount();
  const [onboardingValue, setOnboardingValue] = useState<string | null>(null);
  const [onboardingMethod, setOnboardingMethod] = useState<string | null>(null);
  const [transakParams, setTransakParams] = useState<any>(null); // Holds the params for Transak SDK
  const [currency, setCurrency] = useState<string>("EUR"); // Default currency
  const [currencySymbol, setCurrencySymbol] = useState<string>("€");
  const { t } = useTranslation();

  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        // Fetch currency and onboarding data from AsyncStorage
        const value = await AsyncStorage.getItem("onboardingValue");
        const method = await AsyncStorage.getItem("onboardingMethod");
        const storedCurrency = await AsyncStorage.getItem("selectedCurrency");

        setOnboardingValue(value);
        setOnboardingMethod(method);
        setCurrency(storedCurrency === "euro" ? "EUR" : "USD"); // Update currency
        setCurrencySymbol(storedCurrency === "euro" ? "€" : "$");
        Sentry.addBreadcrumb({
          category: "storage",
          message: `Retrieved onboardingValue: ${value}, onboardingMethod: ${method}, currency: ${storedCurrency}`,
          level: "info",
        });

        if (account?.address && currency) {
          let params = {
            apiKey: "ec807ee4-b564-4b2a-af55-92a8adfe619b",
            fiatCurrency: currency, // Use the selected currency
            cryptoCurrencyCode: "USDC",
            fiatAmount: "100",
            productsAvailed: ["BUY"],
            network: "arbitrum",
            defaultPaymentMethod: "credit_debit_card",
            disablePaymentMethods: ["gbp_bank_transfer", "sepa_bank_transfer"],
            // hideExchangeScreen: true,
            walletAddress: account.address,
            disableWalletAddressForm: true,
            isFeeCalculationHidden: true,
            environment: "STAGING",
            partnerOrderId: "123456",
          };

          if (onboardingValue) {
            params = {
              ...params,
              fiatAmount: onboardingValue,
            };
          }

          setTransakParams(params);

          Sentry.addBreadcrumb({
            category: "navigation",
            message: `Set Transak params: ${JSON.stringify(params)}`,
            level: "info",
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error loading onboarding data from AsyncStorage", error);
      }
    };

    loadOnboardingData();
  }, [account, onboardingMethod, onboardingValue, currency]); // Added currency as dependency

  const onTransakEventHandler = async (event: EventTypes, data: Order) => {
    switch (event) {
      case Events.ORDER_CREATED:
        console.log(event, data);
        break;

      case Events.ORDER_PROCESSING:
        console.log(event, data);
        try {
          await AsyncStorage.setItem("transakDone", "true");
        } catch (error) {
          console.error("Failed to store data in AsyncStorage:", error);
        }
        router.push("/(tabs)/home");
        break;

      case Events.ORDER_COMPLETED:
        router.push("/(onboarding)/onboarding_2?transactionSuccess=true");
        console.log(event, data);
        break;

      default:
        console.log(event, data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...globalFonts.title, textAlign: "left" }}>
        {t("pages.onboarding_4.title")}
      </Text>
      <Text style={globalFonts.subtitle}>
        {t(`pages.onboarding_4.subtitle_${onboardingMethod}`)}
      </Text>
      {transakParams && (
        <TransakWebView
          onError={(error) => {
            console.error("Transak error", error);
          }}
          style={styles.webview}
          transakConfig={transakParams}
          onTransakEvent={onTransakEventHandler}
        />
      )}
      <Text
        style={{
          ...globalFonts.subtitle,
          textAlign: "center",
          fontSize: scaledFontSize(14),
          marginTop: 20,
        }}
        onPress={() => {
          Sentry.addBreadcrumb({
            category: "navigation",
            message: "User navigated to home from Onboarding3",
            level: "info",
          });
          router.push("/(onboarding)/onboarding_2");
        }}
      >
        {t("pages.onboarding_4.cancel")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 15,
  },
  text: {
    fontSize: scaledFontSize(24),
    fontWeight: "bold",
  },
  webview: {
    marginTop: 20,
    width: "100%",
    height: 600,
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
    fontSize: scaledFontSize(20),
    fontWeight: "700",
    fontFamily: "Poppins",
  },
});

export default Onboarding4;
