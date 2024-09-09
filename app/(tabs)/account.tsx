import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { globalFonts } from "../styles/globalFonts";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import TestBlurModal from "@/components/PopUp/TestBlurModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Checkout: React.FC = () => {
  const account = useActiveAccount();
  const [onboardingValue, setOnboardingValue] = useState<string | null>(null);
  const [onboardingMethod, setOnboardingMethod] = useState<string | null>(null);
  const [transakParams, setTransakParams] = useState<any>(null); // Holds the params for Transak SDK
  const { t } = useTranslation();

  const onTransakEventHandler = (event: EventTypes, data: Order) => {
    switch (event) {
      case Events.ORDER_CREATED:
        console.log(event, data);
        break;

      case Events.ORDER_PROCESSING:
        console.log(event, data);
        router.push("/(tabs)/home");
        break;

      default:
        console.log(event, data);
    }
  };

  useEffect(() => {
    const loadTransakParams = async () => {
      try {
        if (account?.address) {
          let params = {
            apiKey: "ec807ee4-b564-4b2a-af55-92a8adfe619b",
            fiatCurrency: "EUR",
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

    loadTransakParams();
  }, [account, onboardingMethod, onboardingValue]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TestBlurModal></TestBlurModal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  containercompte: {
    height: 60,
    borderRadius: 30,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    marginBottom: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  webview: {
    marginTop: 20,
    width: "100%",
    height: 500,
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

export default Checkout;
