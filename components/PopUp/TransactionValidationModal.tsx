import React, {
  useCallback,
  useMemo,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { View, Text, StyleSheet, Image, Pressable, Button } from "react-native";
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

const TransactionValidationModal = forwardRef(
  ({ setIsModalOpen, setBlurred, account, currency }: any, ref: any) => {
    const { t } = useTranslation();
    let amount = "105.37";

    // variables
    const snapPoints = useMemo(() => ["55%"], []);

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

    const handleContinuePress = useCallback(() => {
      // Handle transaction here
      handleDismissModal();
    }, []);

    return (
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
              <Image
                source={require("@/assets/images/exclamation-icon.png")}
                style={styles.icon}
              />
              <Text style={globalFonts.title}>
                {t("pop-ups.transaction.title")}
              </Text>
            </View>
            <Text
              style={{
                ...globalFonts.mediumSubtitle,
                fontSize: scaledFontSize(14),
              }}
            >
              {t("pop-ups.transaction.description", {
                amount: amount,
                currency: currency,
              })}
            </Text>
          </View>
          <Pressable
            style={{
              backgroundColor: "#13293D",
              padding: 10,
              borderRadius: 30,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: 30,
            }}
            onPress={handleContinuePress}
          >
            <Text
              style={{
                ...globalFonts.whiteSubtitle,
                textAlign: "center",
                fontSize: scaledFontSize(14),
                fontFamily: "Poppins_500Medium",
              }}
            >
              {t("pop-ups.transaction.confirm")}
            </Text>
          </Pressable>
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
            {t("pop-ups.transaction.cancel")}
          </Text>
        </BottomSheetScrollView>
      </BottomSheetModal>
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
    fontSize: scaledFontSize(20),
    fontWeight: "700",
    fontFamily: "Poppins",
  },
  icon: {
    marginBottom: 15,
    width: 80,
    height: 80,
  },
});

export default TransactionValidationModal;
