import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, Button, StyleSheet, Image, Pressable } from "react-native";
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

const StayUpdated = () => {
  const { t } = useTranslation();
  // refs
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // state to track if modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);

  // variables
  const snapPoints = useMemo(() => ["20%", "45%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    setIsModalOpen(true);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        // Modal dismissed
        handleDismissModal();
      }
      console.log("handleSheetChanges", index);
    },
    [handleDismissModal]
  );

  // renders
  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        />

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          onDismiss={handleDismissModal} // Handle modal dismiss
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              pressBehavior="close"
              opacity={0.7} // Set to 1 for full opacity, you can adjust as needed
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
              style={{
                marginTop: 30,
              }}
            />
            <View
              style={{
                marginTop: 30,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ...globalFonts.disclaimerText,
                  width: "60%",
                }}
              >
                {t("pop-ups.stay_updated.disclaimer.description")}
              </Text>
              <Text
                style={{
                  ...globalFonts.disclaimerText,
                  width: "60%",
                  textDecorationLine: "underline",
                }}
              >
                <Link
                  href={t("pop-ups.stay_updated.disclaimer.href_link") as Href}
                >
                  {t("pop-ups.stay_updated.disclaimer.link")}
                </Link>
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
                width: 335,
              }}
              onPress={handleDismissModal}
            >
              <Text
                style={{
                  ...globalFonts.subtitle,
                  textAlign: "center",
                  color: "white",
                }}
              >
                {t("pop-ups.stay_updated.button")}
              </Text>
            </Pressable>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 30,
    flexDirection: "column",
    gap: 10,
  },
  // Fonts
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
});

export default StayUpdated;
