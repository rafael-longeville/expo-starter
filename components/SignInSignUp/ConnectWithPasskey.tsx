import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  Pressable,
  Text,
  Alert,
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { hasStoredPasskey } from "thirdweb/wallets/in-app";

import { client } from "@/constants/thirdweb";
import { globalFonts } from "@/app/styles/globalFonts";
import * as Sentry from "@sentry/react-native";
import { useTranslation } from "react-i18next";
import { sepolia } from "thirdweb/chains";

interface ConnectWithPasskeyProps {
  connect: any;
  redirectionUrl: string;
}

export default function ConnectWithPasskey({
  connect,
  redirectionUrl,
}: ConnectWithPasskeyProps) {
  const [loading, setLoading] = useState(false); // State to manage the loading

  const { t } = useTranslation();

  const handlePress = async () => {
    setLoading(true); // Show loader when the process starts
    try {
      Sentry.addBreadcrumb({
        category: "action",
        message: "User clicked connect button",
        level: "info",
      });

      const wallet = inAppWallet({
        auth: {
          options: ["passkey"],
          passkeyDomain: "moncomptesouverain.fr",
        },
        smartAccount: {
          chain: sepolia,
          sponsorGas: true,
        },
      });

      await connect(async (): Promise<Wallet> => {
        try {
          await wallet.connect({
            client,
            strategy: "passkey",
            type: "sign-in",
          });
          router.push({
            pathname: redirectionUrl as
              | "/(onboarding)/onboarding_4"
              | "/(tabs)/home",
          });
          setLoading(false); // Hide loader after successful connection
          return wallet;
        } catch (connectError: any) {
          Sentry.captureException(connectError);
          setLoading(false); // Hide loader on error
          throw connectError;
        }
      });
    } catch (err: any) {
      Sentry.captureException(err);
      setLoading(false); // Hide loader on error
      Alert.alert(
        "Error",
        "An error occurred during the connection process. Please try again."
      );
    }
  };

  return (
    <View>
      <Pressable
        style={styles.button} // No changes to button style
        onPress={handlePress}
        disabled={loading} // Disable the button while loading
      >
        <Text
          style={{
            ...globalFonts.subtitle,
            textAlign: "center",
          }}
        >
          {t("pages.onboarding_3.sign-in")}
        </Text>
      </Pressable>

      {loading && ( // Modal for the centered loader overlay
        <Modal
          transparent={true}
          animationType="fade"
          visible={loading}
          onRequestClose={() => setLoading(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loaderText}>
                {t("pages.onboarding_3.sign-in-pending")}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 335,
    borderWidth: 1,
    borderColor: "#13293D",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background to dim the screen
  },
  loaderContainer: {
    backgroundColor: "#13293D",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loaderText: {
    color: "#ffffff",
    marginTop: 10,
  },
});
