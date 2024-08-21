import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {
  useActiveAccount,
  useConnect,
  useDisconnect,
  useActiveWallet,
} from "thirdweb/react";
import {
  getUserEmail,
  hasStoredPasskey,
  inAppWallet,
} from "thirdweb/wallets/in-app";
import { chain, client } from "@/constants/thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { ThemedButton } from "@/components/ThemedButton";
import { useEffect, useState } from "react";
import { Wallet } from "thirdweb/wallets";
import { ScrollView } from "react-native";
import { Link, router } from "expo-router";

export default function HomeScreen() {
  const account = useActiveAccount();

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Bonjour {account?.address}</Text>
      </View>
    </ScrollView>
  );
}

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
  whiteSubtitle: {
    fontSize: 18,
    width: "100%",
    color: "white",
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
    marginTop: 24,
  },
});
