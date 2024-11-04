import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, Button } from "react-native";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import { useTranslation } from "react-i18next";
import ConnectWithPasskey from "@/components/SignInSignUp/ConnectWithPasskey";
import CreateWithPasskey from "@/components/SignInSignUp/CreateWithPasskey";
// import { useActiveAccount, useConnect } from "thirdweb/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import ConnectWithGoogle from "@/components/SignInSignUp/ConnectWithGoogle";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { getLocales } from "expo-localization";
import i18n from "../i18n";

const Onboarding1: React.FC = () => {
  const { t } = useTranslation();
  // const { connect, isConnecting, error } = useConnect();
  // const account = useActiveAccount();
  const router = useRouter();

  const [storedValue, setStoredValue] = useState<string | null>(null);
  const [asyncStorageValue, setAsyncStorageValue] = useState<string | null>(
    null
  );
  // Get the preferred locale
  const locales = getLocales();
  const preferredLocale = locales[0]?.languageCode || "en"; // Fallback to 'en' if locale is not available
  // States
  const [selectedLanguage, setSelectedLanguage] = useState<"fr" | "en" | null>(
    "en"
  );

  useEffect(() => {
    const fetchStoredAndResetSettings = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("selectedLanguage");

        await AsyncStorage.setItem("continueWithoutFunding", "false");

        if (storedLanguage) {
          i18n.changeLanguage(storedLanguage);
          setSelectedLanguage(storedLanguage as "fr" | "en");
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error(
          "Error retrieving settings or JWT tokens from AsyncStorage:",
          error
        );
      }
    };

    fetchStoredAndResetSettings();
  }, []);

  useEffect(() => {
    const getValueFromAsyncStorage = async () => {
      try {
        const value = await AsyncStorage.getItem("continueWithoutFunding");

        if (value !== null) {
          setStoredValue(value); // Set the value if it exists
          Sentry.addBreadcrumb({
            category: "storage",
            message: `Retrieved continueWithoutFunding: ${value}`,
            level: "info",
          });
        }
        const allKeys = await AsyncStorage.getAllKeys();
        console.log("allKeys", allKeys);
        setAsyncStorageValue(allKeys.join());
        const walletTokenKey = allKeys.find((key) =>
          key.startsWith("walletToken")
        );
        const thirdwebEwsWalletUserDetailsKey = allKeys.find((key) =>
          key.startsWith("thirdwebEwsWalletUserDetails")
        );
        const passKeyCredentialId = allKeys.find((key) =>
          key.startsWith("passkey-credential-id")
        );

        if (walletTokenKey) {
          console.log("Removing walletTokenKey", walletTokenKey);
          await AsyncStorage.removeItem(walletTokenKey);
        }
        if (thirdwebEwsWalletUserDetailsKey) {
          console.log(
            "Removing thirdwebEwsWalletUserDetailsKey",
            thirdwebEwsWalletUserDetailsKey
          );
          await AsyncStorage.removeItem(thirdwebEwsWalletUserDetailsKey);
        }
        if (passKeyCredentialId) {
          console.log("Removing passKeyCredentialId", passKeyCredentialId);
          await AsyncStorage.removeItem(passKeyCredentialId);
        }
        await AsyncStorage.removeItem("thirdweb:active-wallet-id");
        await AsyncStorage.removeItem("thirdweb:connected-wallet-ids");
        await AsyncStorage.removeItem("thirdweb:active-chain");
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error retrieving data from AsyncStorage: ", error);
      }
    };

    getValueFromAsyncStorage();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={globalFonts.title}>{t("pages.onboarding_1.title")}</Text>
      <Text
        style={{
          ...globalFonts.subtitle,
          fontSize: scaledFontSize(16),
          textAlign: "center",
        }}
      >
        {t("pages.onboarding_1.subtitle")}
      </Text>
      <Image
        style={styles.image}
        source={require("@/assets/images/onboarding/1/biometry-image.png")}
      />
      <Text
        style={{
          ...globalFonts.subtitle,
          fontSize: scaledFontSize(12),
          textAlign: "center",
          width: "90%",
          lineHeight: scaledFontSize(22),
          marginBottom: 10,
        }}
      >
        {t("pages.onboarding_1.second_subtitle")}
      </Text>
      <ConnectWithPasskey />
      <CreateWithPasskey />
      {/*
        <CreateWithPasskey
          connect={connect}
          redirectionUrl={continueWithoutFundingUrl}
          // withoutFunding={storedValue}
        />
        <ConnectWithGoogle
          connect={connect}
          isConnecting={isConnecting}
          redirectUrl={continueWithoutFundingUrl}
          account={account}
          error={error}
        /> */}
      <Text
        style={{ ...globalFonts.disclaimerText, width: "90%", marginTop: 40 }}
      >
        {t("disclaimer")}
        <Link href={"https://moncomptesouverain.fr"}>
          <Text style={{ textDecorationLine: "underline" }}>
            {t("disclaimer_link")}
          </Text>
        </Link>
        {t("disclaimer_2")}
        <Link href={"https://moncomptesouverain.fr"}>
          <Text style={{ textDecorationLine: "underline" }}>
            {t("disclaimer_link_2")}
          </Text>
        </Link>
      </Text>
      {/* <View
        style={{
          marginTop: 20,
        }}
      >
        <Button
          title={"To onboarding 2"}
          onPress={() => {
            AsyncStorage.setItem("continueWithoutFunding", "true");
            router.push("/(onboarding)/onboarding_2");
          }}
        />
        <Button
          title={"To onboarding 6"}
          onPress={() => {
            AsyncStorage.setItem("continueWithoutFunding", "true");
            router.push("/(onboarding)/onboarding_6");
          }}
        />
      </View> */}

      {/* Display the value retrieved from AsyncStorage */}
      {/* {storedValue && (
        <Text style={globalFonts.subtitle}>
          Skipped provisionning: {storedValue}
        </Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    gap: 10,
  },
  image: {
    marginTop: 20,
    marginBottom: 10,
    height: 220,
    width: 175,
    resizeMode: "contain",
  },
  text: {
    fontSize: scaledFontSize(24),

    fontWeight: "bold",
  },
});

export default Onboarding1;
