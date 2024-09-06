import { globalFonts } from "@/app/styles/globalFonts";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

export default function MainAccount({ currency }: { currency: string }) {
  const main_account_balance = "133,64";
  const { t } = useTranslation();

  return (
    <View style={styles.main_account}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <Text style={globalFonts.mediumSubtitle}>
          {t("pages.home.your_main_account")}
        </Text>
        <Pressable /* onPress={modalPress} */>
          <Image
            source={require("@/assets/images/info-icon.png")}
            style={{ width: 20, height: 20 }}
          />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#13293D",
          paddingHorizontal: 25,
          paddingVertical: 15,
          borderRadius: 30,
          width: "100%",
        }}
      >
        <Text
          style={{
            ...globalFonts.subtitle,
            color: "white",
          }}
        >
          {t("pages.home.balance")}
        </Text>
        {/* Replace with async storage currency */}
        <Text
          style={{
            ...globalFonts.bigNumberSemi,
            color: "#ECFF78",
            includeFontPadding: false,
          }}
        >
          {main_account_balance} {currency}
        </Text>
      </View>
      <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
        <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.6}>
          <Image
            source={require("@/assets/images/small-withdraw-button-shape.png")}
            style={styles.buttonImage}
          />
          <Text style={styles.withdrawButtonText}>
            {t("components.investment_card.withdraw")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.6}>
          <Image
            source={require("@/assets/images/small-deposit-button-shape.png")}
            style={styles.buttonImage}
          />
          <Text style={styles.depositButtonText}>
            {t("components.investment_card.deposit")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main_account: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-start",
  },
  buttonContainer: {
    position: "relative",
    width: "50%",
    height: 53, // Match the height of your image
    justifyContent: "center",
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  depositButtonText: {
    position: "absolute", // Overlay the text on top of the image
    color: "#13293D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    left: 40, // Adjust this value to position the text towards the left
    textAlign: "left", // Ensure the text aligns to the left
  },
  withdrawButtonText: {
    position: "absolute", // Overlay the text on top of the image
    color: "#13293D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    left: 85, // Adjust this value to position the text towards the left
    textAlign: "left", // Ensure the text aligns to the left
  },
});
