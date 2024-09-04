import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useActiveAccount, useConnect } from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { ScrollView } from "react-native";
import { Link, router } from "expo-router";
import CreateWithPasskey from "@/components/SignInSignUp/CreateWithPasskey";
import ConnectWithPasskey from "@/components/SignInSignUp/ConnectWithPasskey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConnectWithGoogle from "@/components/SignInSignUp/ConnectWithGoogle";

export default function LoginScreen() {
  const { connect, isConnecting, error } = useConnect();
  const account = useActiveAccount();
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("pages.login.title")}</Text>
        <Text
          style={{
            ...styles.blackSubtitle,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          {t("pages.login.subtitle")}
        </Text>
        <Image source={require("@/assets/images/biometry-image.png")} />
        <ConnectWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          account={account}
          isOnboarding={false}
        />
        <CreateWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          account={account}
          isOnboarding={false}
        />
        {process.env.EXPO_PUBLIC_IS_DEVELOPMENT === "true" && (
          <>
            <Pressable
              style={styles.button}
              onPress={() => {
                router.push({
                  pathname: "/",
                });
              }}
            >
              <Text style={styles.buttonText}>To splash</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                router.push({
                  pathname: "/(onboarding)/onboarding_1",
                });
              }}
            >
              <Text style={styles.buttonText}>To Onboarding 1</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                router.push({
                  pathname: "/(onboarding)/onboarding_2",
                });
              }}
            >
              <Text style={styles.buttonText}>To Onboarding 2</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                router.push({
                  pathname: "/(onboarding)/onboarding_3",
                });
              }}
            >
              <Text style={styles.buttonText}>To Onboarding 3</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                router.push({
                  pathname: "/(onboarding)/onboarding_4",
                });
              }}
            >
              <Text style={styles.buttonText}>To Onboarding 4</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={async () => {
                try {
                  await AsyncStorage.clear();
                  console.log("All async storage data cleared.");
                } catch (error) {
                  console.error("Error clearing async storage: ", error);
                }
              }}
            >
              <Text style={styles.buttonText}>Clear Cache</Text>
            </Pressable>
          </>
        )}

        {process.env.EXPO_PUBLIC_IS_DEVELOPMENT === "true" && (
          <ConnectWithGoogle
            connect={connect}
            isConnecting={isConnecting}
            account={account}
            error={error}
          />
        )}
        <Text
          style={{
            ...styles.blackSubtitle,
            textAlign: "center",
            fontSize: 12,
            marginTop: 12,
          }}
        >
          En continuant, vous confirmez avoir lu et accepté{" "}
          <Link href={"https://moncomptesouverain.fr"}>
            <Text style={{ textDecorationLine: "underline" }}>
              nos conditions générales de ventes.
            </Text>
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#13293D",
    padding: 10,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
  },
  title: {
    fontSize: 32,
    width: "100%",
    color: "#13293D",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  blackSubtitle: {
    fontSize: 18,
    width: "100%",
    color: "#13293D",
    fontFamily: "Poppins_400Regular",
  },
  scrollView: {
    backgroundColor: "#ECFF78",
    height: "100%",
  },
  container: {
    backgroundColor: "#ECFF78",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    flex: 1,
    height: "100%",
    alignItems: "center",
    fontFamily: "Poppins",
    marginTop: 50,
  },

  buttonText: {
    color: "white",
  },
});
