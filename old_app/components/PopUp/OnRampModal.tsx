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
import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react-native";
import {
  TransakWebView,
  Events,
  EventTypes,
  Order,
} from "@transak/react-native-sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnRampModal = forwardRef(
  (
    {
      setIsModalOpen,
      setBlurred,
      account,
      isOffRamp,
      currency,
      mainAccountBalance,
    }: any,
    ref: any
  ) => {
    const { t } = useTranslation();
    const [transakParams, setTransakParams] = useState<any>(null); // Holds the params for Transak SDK
    // variables
    const snapPoints = useMemo(() => ["93%"], []);
    // Custom handle component
    const CustomHandle = () => {
      const source = isOffRamp
        ? require("@/assets/images/withdraw-icon.png")
        : require("@/assets/images/deposit-icon.png");
      return (
        <View style={styles.customHandleContainer}>
          <View style={styles.customHandle}>
            <Image source={source} style={{ width: 80, height: 80 }} />
          </View>
        </View>
      );
    };

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
          ref.current?.dismiss();
          break;
        default:
          console.log(event, data);
      }
    };

    useEffect(() => {
      const loadTransakParams = async () => {
        try {
          if (account?.address && isOffRamp == false) {
            let params = {
              apiKey: "ec807ee4-b564-4b2a-af55-92a8adfe619b",
              fiatCurrency: "EUR",
              cryptoCurrencyCode: "USDC",
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
          } else if (account?.address && isOffRamp == true) {
            let params = {
              apiKey: "ec807ee4-b564-4b2a-af55-92a8adfe619b",
              fiatCurrency: "EUR",
              cryptoCurrencyCode: "USDC",
              productsAvailed: ["SELL"],
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
    }, [account, isOffRamp]);

    return (
      <>
        {/* <Button
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
        </Button> */}

        <BottomSheetModal
          ref={ref}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onDismiss={handleDismissModal}
          backdropComponent={(props) => (
            <BottomSheetBackdrop {...props} enableTouchThrough={false} />
          )}
          handleComponent={CustomHandle} // Use custom handle
        >
          <BottomSheetScrollView style={styles.container}>
            <View style={{ flexDirection: "column", gap: 20 }}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text style={globalFonts.title}>
                  {isOffRamp ? t("offramp.title") : t("onramp.title")}
                </Text>
                <View style={styles.containercompte}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("@/assets/images/lock-icon.png")}
                      style={styles.icon}
                    />
                    <Text style={globalFonts.whiteSubtitle}>
                      {t("pages.onboarding_4.account")} DOLLAR US :
                    </Text>
                  </View>
                  <Text style={styles.textcompte}>
                    <Text style={styles.amount}>
                      {" "}
                      {mainAccountBalance === "0.00"
                        ? "0"
                        : mainAccountBalance}{" "}
                      {currency}
                    </Text>
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  ...globalFonts.subtitle,
                  fontSize: scaledFontSize(14),
                }}
              >
                {t(isOffRamp ? "offramp.subtitle" : "onramp.subtitle")}
              </Text>
            </View>
            {transakParams && (
              <TransakWebView
                onError={(error) => {
                  console.error("Transak error", error);
                }}
                containerStyle={styles.webview}
                transakConfig={transakParams}
                onTransakEvent={onTransakEventHandler}
              />
            )}
            <Text
              style={{
                ...globalFonts.subtitle,
                textAlign: "center",
                fontSize: scaledFontSize(14),
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
    marginTop: 35, // Adjust this to move the content upwards as it was before
  },
  containercompte: {
    justifyContent: "space-between",
    height: 60,
    borderRadius: 30,
    width: "100%",
    backgroundColor: "#13293D",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
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
    height: 500,
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
  icon: {
    marginRight: 10,
  },
  customHandleContainer: {
    position: "absolute",
    top: -40, // Positioning for the icon
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  customHandle: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
});

export default OnRampModal;
