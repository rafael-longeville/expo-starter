import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useActiveAccount, useConnect } from "thirdweb/react";
import { hasStoredPasskey, inAppWallet } from "thirdweb/wallets/in-app";
import { chain, client } from "@/constants/thirdweb";
import { Wallet } from "thirdweb/wallets";
import { ScrollView } from "react-native";
import { Link, router } from "expo-router";
import CreateWithPasskey from "@/components/SignInSignUp/CreateWithPasskey";
import ConnectWithPasskey from "@/components/SignInSignUp/ConnectWithPasskey";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';

export default function HomeScreen() {
  const { connect, isConnecting, error } = useConnect();
  const account = useActiveAccount();

  const getDataandTransfer = async (key: any) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        router.push({
          pathname: "/(tabs)/splash",
        });
      }
    } catch (error) {
      console.error("Error retrieving data: ", error);
    }
  };

  useEffect(() => {
    getDataandTransfer("hasSeenSplash");
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text
          style={{
            ...styles.blackSubtitle,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Vous êtes à un doigt de créer votre compte souverain gratuitement !
        </Text>
        <Image source={require("@/assets/images/biometry-image.png")} />
        <ConnectWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          account={account}
          error={error}
        />
        <CreateWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          account={account}
          error={error}
        />
        {process.env.EXPO_PUBLIC_IS_DEVELOPMENT === "true" && (
          <>
            {/* <Pressable
              style={{
                backgroundColor: "#13293D",
                padding: 10,
                borderRadius: 30,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                width: 300,
              }}
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/home",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                To Home
              </Text>
            </Pressable> */}
            <Pressable
              style={{
                backgroundColor: "#13293D",
                padding: 10,
                borderRadius: 30,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                width: 300,
              }}
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/splash",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                To splash
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#13293D",
                padding: 10,
                borderRadius: 30,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                width: 300,
              }}
              onPress={() => {
                router.push({
                  pathname: "/(onboarding)/onboarding_1",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                To Onboarding 1
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#13293D",
                padding: 10,
                borderRadius: 30,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                width: 300,
              }}
              onPress={() => {
                router.push({
                  pathname: "/(onboarding)/onboarding_2",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                To Onboarding 2
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#13293D",
                padding: 10,
                borderRadius: 30,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                width: 300,
              }}
              onPress={() => {
                router.push({
                  pathname: "/(onboarding)/onboarding_3",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                To Onboarding 3
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#13293D",
                padding: 10,
                borderRadius: 30,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                width: 300,
              }}
              onPress={() => {
                router.push({
                  pathname: "/(onboarding)/onboarding_4",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                To Onboarding 4
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#13293D",
                padding: 10,
                borderRadius: 30,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                width: 300,
              }}
              onPress={async () => {
                try {
                  await AsyncStorage.clear();
                  console.log("All async storage data cleared.");
                  // Optional: You can navigate to a specific screen or give feedback to the user
                } catch (error) {
                  console.error("Error clearing async storage: ", error);
                }
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Clear Cache
              </Text>
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
        <Image
          style={{
            marginTop: 24,
          }}
          source={require("@/assets/images/ibex-wallet-logo.png")}
        />
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
            <Text
              style={{
                textDecorationLine: "underline",
              }}
            >
              nos conditions générales de ventes.
            </Text>
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
}

const ConnectWithGoogle = ({ connect, isConnecting, account, error }: any) => {
  return (
    <Pressable
      style={{
        backgroundColor: "#13293D",
        padding: 10,
        borderRadius: 30,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        width: 50,
      }}
      onPress={() => {
        try {
          connect(async (): Promise<Wallet> => {
            const w = inAppWallet({
              smartAccount: {
                chain,
                sponsorGas: true,
              },
            });
            await w.connect({
              client,
              strategy: "google",
            });
            return w;
          }).then(() => {
            if (!isConnecting && account) {
              router.push({
                pathname: "/(tabs)/home",
              });
            }
          });
        } catch {
          console.log("error", error);
        }
      }}
    >
      <Image
        source={require("@/assets/images/google.png")}
        style={{
          width: 30,
          height: 30,
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "space-evenly",
  },
});