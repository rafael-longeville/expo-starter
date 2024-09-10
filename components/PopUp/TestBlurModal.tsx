import React, { useRef, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Button, Image } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { globalFonts } from "@/app/styles/globalFonts";
import { Href, Link } from "expo-router";

const TestBlurModal = () => {
  const { t } = useTranslation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

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
          backdropComponent={(props) => (
            <BottomSheetBackdrop {...props} enableTouchThrough={true} />
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
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
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
});

export default TestBlurModal;
