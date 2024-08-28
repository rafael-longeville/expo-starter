import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { globalFonts } from "../styles/globalFonts";
import { useTranslation } from "react-i18next";
import ConnectWithPasskey from "@/components/SignInSignUp/ConnectWithPasskey";
import CreateWithPasskey from "@/components/SignInSignUp/CreateWithPasskey";

const Onboarding2: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={globalFonts.title}>{t("pages.onboarding_2.title")}</Text>
      <Text
        style={{
          ...globalFonts.subtitle,
          width: "80%",
        }}
      >
        {t("pages.onboarding_2.subtitle")}
      </Text>
      <View style={styles.buttonContainer}>
        <Image
          style={styles.image}
          source={require("@/assets/images/biometry-image.png")}
        />
        <ConnectWithPasskey />
        <CreateWithPasskey />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    gap: 10,
  },
  image: {
    borderWidth: 1,
    borderColor: "#13293D",
    borderRadius: 30, // Optional, gives rounded corners to the image
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Onboarding2;
