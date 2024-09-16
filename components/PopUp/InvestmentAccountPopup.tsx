import React, {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { globalFonts } from "@/app/styles/globalFonts";
import { useTranslation } from "react-i18next";
import { Href, Link } from "expo-router";

// Custom handle component
const CustomHandle = () => {
  return (
    <View style={styles.customHandleContainer}>
      <View style={styles.customHandle}>
        <Image
          source={require("@/assets/images/info-icon.png")}
          style={{ width: 80, height: 80 }}
        />
      </View>
    </View>
  );
};

const InvestmentAccountPopup = forwardRef(
  ({ setIsModalOpen, setBlurred, asset }: any, ref: any) => {
    const { t } = useTranslation();
    const snapPoints = useMemo(() => ["45%"], []);

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

    return (
      <BottomSheetModal
        ref={ref}
        index={0} // Start at the first snap point (index 0)
        snapPoints={snapPoints} // Fixed snap points
        enableDynamicSizing={false} // Disable dynamic sizing for fixed height
        onChange={handleSheetChanges}
        handleComponent={CustomHandle} // Use custom handle
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>
            {t("pop-ups.investment_account.title")}
          </Text>

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Text
              style={{
                ...globalFonts.subtitle,
                fontSize: 14,
                alignSelf: "center",
                width: "80%",
                textAlign: "center",
              }}
            >
              {t("pop-ups.investment_account.description_1")}
            </Text>
            <Text
              style={{
                ...globalFonts.subtitle,
                fontSize: 14,
                alignSelf: "center",
                textAlign: "center",

                width: "80%",
              }}
            >
              {t("pop-ups.investment_account.description_2")}
            </Text>
            <Text style={globalFonts.disclaimerText}>
              {t("pop-ups.investment_account.disclaimer")}
            </Text>
            <Text
              style={{
                ...globalFonts.subtitle,
                fontSize: 12,
                fontFamily: "Poppins_600SemiBold",
                textDecorationLine: "underline",
                width: "100%",
                textAlign: "center",
              }}
            >
              <Link
                href={
                  t(`pop-ups.investment_account.${asset}_href_link`) as Href
                }
              >
                {t("pop-ups.investment_account.link")}
              </Link>
            </Text>
          </View>
          <Pressable style={styles.button} onPress={handleDismissModal}>
            <Text style={styles.buttonText}>
              {t("pop-ups.investment_account.button")}
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 30,
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 24,
    marginTop: 50, // Adjust this to move the content upwards as it was before
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: "#13293D",
  },
  button: {
    backgroundColor: "#13293D",
    padding: 10,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 335,
    marginTop: 20,
  },
  buttonText: {
    ...globalFonts.subtitle,
    textAlign: "center",
    color: "white",
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

export default InvestmentAccountPopup;
