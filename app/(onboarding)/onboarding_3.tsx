import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { globalFonts } from "../styles/globalFonts";
import { useTranslation } from "react-i18next";
import ConnectWithPasskey from "@/components/SignInSignUp/ConnectWithPasskey";
import CreateWithPasskey from "@/components/SignInSignUp/CreateWithPasskey";
import { useActiveAccount, useConnect } from "thirdweb/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import ConnectWithGoogle from "@/components/SignInSignUp/ConnectWithGoogle";
import * as Sentry from "@sentry/react-native";

const Onboarding3: React.FC = () => {
  const { t } = useTranslation();
  const { connect, isConnecting, error } = useConnect();
  const account = useActiveAccount();

  const [storedValue, setStoredValue] = useState<string | null>(null);

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
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error retrieving data from AsyncStorage: ", error);
      }
    };

    getValueFromAsyncStorage();
  }, []);

  useEffect(() => {
    if (error) {
      Sentry.captureException(error);
      console.error("Error during connection:", error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Text
        style={{
          ...globalFonts.disclaimerText,
          width: "80%",
        }}
      >
        (DEBUG | ContinueWithoutFunding) :{storedValue}
      </Text>
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
        <ConnectWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          account={account}
          isOnboarding={true}
          // withoutFunding={storedValue}
        />
        <CreateWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          account={account}
          isOnboarding={true}
          // withoutFunding={storedValue}
        />
        {process.env.EXPO_PUBLIC_IS_DEVELOPMENT === "true" && (
          <ConnectWithGoogle
            connect={connect}
            isConnecting={isConnecting}
            account={account}
            error={error}
          />
        )}
      </View>
      <Text style={globalFonts.disclaimerText}>
        {t("disclaimer")}
        <Link href={"https://moncomptesouverain.fr"}>
          <Text style={{ textDecorationLine: "underline" }}>
            {t("disclaimer_link")}
          </Text>
        </Link>
      </Text>

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

export default Onboarding3;
