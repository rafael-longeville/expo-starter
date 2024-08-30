import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { globalFonts } from "../styles/globalFonts";
import { useTranslation } from "react-i18next";
import ConnectWithPasskey from "@/components/SignInSignUp/ConnectWithPasskey";
import CreateWithPasskey from "@/components/SignInSignUp/CreateWithPasskey";
import { useActiveAccount, useConnect } from "thirdweb/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import ConnectWithGoogle from "@/components/SignInSignUp/ConnectWithGoogle";

const Onboarding2: React.FC = () => {
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
        }
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage: ", error);
      }
    };

    getValueFromAsyncStorage();
  }, []);

  if (isConnecting) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#13293D" />
      </View>
    );
  }

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
        <ConnectWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          account={account}
          error={error}
          isOnboarding={true}
        />
        <CreateWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          account={account}
          error={error}
          isOnboarding={true}
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
            nos conditions générales de ventes.
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

export default Onboarding2;
