import React, { useCallback, useMemo, forwardRef } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react-native";
import { TransactionType } from "@/app/sharedTypes";

type TransactionValidationModalProps = {
  setIsModalOpen: (isOpen: boolean) => void;
  setBlurred: (blurred: boolean) => void;
  currency: string;
  amount: string;
  transactionType: keyof TransactionType; // Ensure it's typed correctly
};

const TransactionValidationModal = forwardRef<
  BottomSheetModal,
  TransactionValidationModalProps
>(({ setIsModalOpen, setBlurred, currency, amount, transactionType }, ref) => {
  const { t } = useTranslation();

  // Construct the translation key based on transaction type
  const translationKey = `pop-ups.transaction.${transactionType}`;

  // variables
  const snapPoints = useMemo(() => ["55%"], []);

  const handleDismissModal = useCallback(() => {
    setIsModalOpen(false);
    setBlurred(false);
    if (ref && "current" in ref && ref.current) {
      ref.current.dismiss();
    }
  }, [ref, setIsModalOpen, setBlurred]);

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
  }, [handleDismissModal]);

  return (
    <>
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
                {t(`${translationKey}.title`)}
              </Text>
            </View>
            <Text
              style={{
                ...globalFonts.mediumSubtitle,
                fontSize: scaledFontSize(14),
              }}
            >
              {t(`${translationKey}.message`, { amount, currency })}
            </Text>
          </View>
          <Pressable style={styles.button} onPress={handleContinuePress}>
            <Text
              style={{
                ...globalFonts.whiteSubtitle,
                textAlign: "center",
                fontSize: scaledFontSize(14),
                fontFamily: "Poppins_500Medium",
              }}
            >
              {t(`${translationKey}.confirm`)}
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
              if (ref && "current" in ref && ref.current) {
                ref.current.dismiss();
              }
            }}
          >
            {t(`${translationKey}.cancel`)}
          </Text>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: "#13293D",
    padding: 10,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  icon: {
    marginBottom: 15,
    width: 80,
    height: 80,
  },
});

export default TransactionValidationModal;
