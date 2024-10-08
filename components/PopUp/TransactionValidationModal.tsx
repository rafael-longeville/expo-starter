// TransactionValidationModal.tsx

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react-native";

interface TransactionValidationModalProps {
  isVisible: boolean;
  onConfirm: (confirmed: boolean) => void;
  transactionDetails: {
    investmentType: string;
    amount: number;
    action: "deposit" | "withdraw";
  } | null;
  setIsValidationModalOpen: (isOpen: boolean) => void;
}

const TransactionValidationModal = ({
  isVisible,
  onConfirm,
  transactionDetails,
  setIsValidationModalOpen,
}: TransactionValidationModalProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();

  // Snap points for the BottomSheetModal
  const snapPoints = useMemo(() => ["45%"], []);

  // Custom handle component
  const CustomHandle = () => {
    return (
      <View style={styles.customHandleContainer}>
        <View style={styles.customHandle}>
          <Image
            source={require("@/assets/images/exclamation-icon.png")}
            style={{ width: 80, height: 80 }}
          />
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  // Ensure hooks are called unconditionally
  useEffect(() => {
    if (!transactionDetails) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [transactionDetails]);

  const handleDismissModal = useCallback(() => {
    onConfirm(false); // User canceled the transaction
    setIsValidationModalOpen(false);
  }, [onConfirm]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        handleDismissModal();
      }
    },
    [handleDismissModal]
  );

  const handleContinuePress = useCallback(() => {
    onConfirm(true); // User confirmed the transaction
  }, [onConfirm]);

  if (!transactionDetails) return null;

  const { investmentType, amount, action } = transactionDetails;

  // Map the action and investmentType to your specific translation keys
  let translationKey = "";
  if (action === "deposit") {
    if (investmentType === "DOLLAR US") {
      translationKey = "pop-ups.transaction.home.swap_cc_to_usd";
    } else if (investmentType === "EURO") {
      translationKey = "pop-ups.transaction.home.swap_cc_to_euro";
    }
  } else if (action === "withdraw") {
    if (investmentType === "DOLLAR US") {
      translationKey = "pop-ups.transaction.home.swap_usd_to_cc";
    } else if (investmentType === "EURO") {
      translationKey = "pop-ups.transaction.home.swap_euro_to_cc";
    }
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onDismiss={handleDismissModal}
      handleComponent={CustomHandle} // Use custom handle
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} enableTouchThrough={false} />
      )}
    >
      <BottomSheetScrollView style={styles.container}>
        <View style={{ flexDirection: "column", gap: 20 }}>
          {/* Removed the image from here since it's now in the custom handle */}
          <View style={{ flexDirection: "column", alignItems: "center" }}>
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
            {t(`${translationKey}.message`, {
              amount,
            })}
          </Text>
          <Text
            style={{
              ...globalFonts.mediumSubtitle,
              fontSize: scaledFontSize(14),
            }}
          >
            {t(`${translationKey}.do_you_confirm_this_action`, {
              amount,
            })}
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
          onPress={handleDismissModal}
        >
          {t(`${translationKey}.cancel`)}
        </Text>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50, // Adjust this to move the content upwards to account for the custom handle
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

export default TransactionValidationModal;
