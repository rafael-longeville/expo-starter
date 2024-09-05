import React, {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { globalFonts } from "@/app/styles/globalFonts";
import { useTranslation } from "react-i18next";
import { Href, Link } from "expo-router";

const MainAccountPopup = forwardRef(({ modalPress }: any, ref: any) => {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%"], []);

  // Handle modal dismiss
  const handleDismissModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        handleDismissModal();
      }
      console.log("handleSheetChanges", index);
    },
    [handleDismissModal]
  );

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetModalRef.current?.present();
    },
    dismiss: handleDismissModal,
  }));

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0} // Start at the first snap point (index 0)
      snapPoints={snapPoints} // Fixed snap points
      enableDynamicSizing={false} // Disable dynamic sizing for fixed height
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          opacity={0.7} // Adjust opacity as needed
          style={StyleSheet.absoluteFill}
        >
          <BlurView intensity={30} style={StyleSheet.absoluteFill} />
        </BottomSheetBackdrop>
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.title}>{t("pop-ups.stay_updated.title")}</Text>
        <Text style={styles.subtitle}>
          {t("pop-ups.stay_updated.subtitle")}
        </Text>
        <Image
          source={require("@/assets/images/pop-ups/swipe-down.png")}
          style={{ marginTop: 30 }}
        />
        <View style={{ marginTop: 30, width: "100%", alignItems: "center" }}>
          <Text style={{ ...globalFonts.disclaimerText, width: "60%" }}>
            {t("pop-ups.stay_updated.disclaimer.description")}
          </Text>
          <Text
            style={{
              ...globalFonts.disclaimerText,
              width: "60%",
              textDecorationLine: "underline",
            }}
          >
            <Link href={t("pop-ups.stay_updated.disclaimer.href_link") as Href}>
              {t("pop-ups.stay_updated.disclaimer.link")}
            </Link>
          </Text>
        </View>
        <Pressable style={styles.button} onPress={handleDismissModal}>
          <Text style={styles.buttonText}>
            {t("pop-ups.stay_updated.button")}
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 30,
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: "#13293D",
  },
  subtitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
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
});

export default MainAccountPopup;
