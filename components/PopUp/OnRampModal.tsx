import React, {
  useCallback,
  useMemo,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { globalFonts } from "@/app/styles/globalFonts";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react-native";
import {
  TransakWebView,
  Events,
  EventTypes,
  Order,
} from "@transak/react-native-sdk";
import { router } from "expo-router";
import { useActiveAccount } from "thirdweb/react";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";

const OnRampModal = forwardRef(
  ({ setIsModalOpen, setBlurred, account }: any, ref: any) => {
    const { t } = useTranslation();
    const [transakParams, setTransakParams] = useState<any>(null); // Holds the params for Transak SDK

    // variables
    const snapPoints = useMemo(() => ["85%"], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
      setIsModalOpen(true);
      setBlurred(true);
      ref.current?.present();
    }, []);

    const handleDismissModal = useCallback(() => {
      setIsModalOpen(false);
      setBlurred(false);
      ref.current?.dismiss();
    }, []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          handleDismissModal();
        }
      },
      [handleDismissModal]
    );

    // Transak event handler & Loading useEffect
    const onTransakEventHandler = (event: EventTypes, data: Order) => {
      switch (event) {
        case Events.ORDER_CREATED:
          console.log(event, data);
          break;
        case Events.ORDER_PROCESSING:
          console.log(event, data);
          ref.current?.dismiss();
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
              disablePaymentMethods: [
                "gbp_bank_transfer",
                "sepa_bank_transfer",
              ],
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
          console.error(
            "Error loading onboarding data from AsyncStorage",
            error
          );
        }
      };

      loadTransakParams();
    }, [account]);

    return (
      <>
        <Button
          style={{
            backgroundColor: "#F1F1F1",
            borderRadius: 30,
            padding: 10,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 100,
          }}
          onPress={handlePresentModalPress}
        >
          <Text style={globalFonts.subtitle}>Open Checkout</Text>
        </Button>

        <BottomSheetModal
          ref={ref}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onDismiss={handleDismissModal}
          backdropComponent={(props) => (
            <BottomSheetBackdrop {...props} enableTouchThrough={false} />
          )}
        >
          <BottomSheetScrollView style={styles.container}>
            <View style={{ flexDirection: "column", gap: 20 }}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={globalFonts.title}>
                  {t("pages.onboarding_4.title")}
                </Text>
                <View style={styles.containercompte}>
                  <Image
                    source={require("@/assets/images/lock-icon.png")}
                    style={styles.icon}
                  />
                  <Text style={styles.textcompte}>
                    <Text style={globalFonts.whiteSubtitle}>
                      {t("pages.onboarding_4.account")} DOLLAR US :
                    </Text>
                    <Text style={styles.amount}> 0 €*</Text>
                  </Text>
                </View>
              </View>
              <Text style={{ ...globalFonts.subtitle, fontSize: 14 }}>
                {t("pages.onboarding_4.subtitle")}
              </Text>
            </View>
            {transakParams ? (
              <TransakWebView
                onError={(error) => {
                  console.error("Transak error", error);
                }}
                containerStyle={styles.webview}
                transakConfig={transakParams}
                onTransakEvent={onTransakEventHandler}
              />
            ) : (
              <Text style={globalFonts.subtitle}>
                Put a loader here or something
              </Text>
            )}
            <Text
              style={{
                ...globalFonts.subtitle,
                textAlign: "center",
                fontSize: 14,
                fontFamily: "Poppins_500Medium",
                marginTop: 20,
              }}
              onPress={() => {
                Sentry.addBreadcrumb({
                  category: "navigation",
                  message: "User navigated to home from Onboarding3",
                  level: "info",
                });
                ref.current?.dismiss();
              }}
            >
              {t("pages.onboarding_4.cancel")}
            </Text>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containercompte: {
    justifyContent: "center",
    height: 60,
    borderRadius: 30,
    width: "100%",
    backgroundColor: "#13293D",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 30,
    flexDirection: "column",
    gap: 10,
  },
  webview: {
    width: "100%",
    height: 470,
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
  icon: {
    marginRight: 10,
  },
});

export default OnRampModal;
