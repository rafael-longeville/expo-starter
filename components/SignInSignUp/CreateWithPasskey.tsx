import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  Alert,
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { chain, client } from "@/constants/thirdweb";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { hasStoredPasskey } from "thirdweb/wallets/in-app";
import { router } from "expo-router";
import { globalFonts } from "@/app/styles/globalFonts";
import * as Sentry from "@sentry/react-native";

interface CreateWithPasskeyProps {
  connect: any;
  redirectionUrl: string;
}

export default function CreateWithPasskey({
  connect,
  redirectionUrl,
}: CreateWithPasskeyProps) {
  const [loading, setLoading] = useState(false); // State to manage the loading
  // const [hasPasskey, setHasPasskey] = useState(true); // State to manage whether a passkey exists

  // useEffect(() => {
  //   // Check if a passkey is stored when the component mounts
  //   const checkPasskey = async () => {
  //     try {
  //       const result = await hasStoredPasskey(client);
  //       setHasPasskey(result); // If passkey exists, update state to true
  //     } catch (error) {
  //       Sentry.captureException(error);
  //     }
  //   };

  //   checkPasskey();
  // }, []);

  const handlePress = async () => {
    setLoading(true); // Show loader when the process starts

    try {
      Sentry.addBreadcrumb({
        category: "action",
        message: "User clicked create wallet button",
        level: "info",
      });

      const wallet = inAppWallet({
        auth: {
          options: ["passkey"],
          passkeyDomain: "moncomptesouverain.fr",
        },
      });

      await connect(async (): Promise<Wallet> => {
        try {
          await wallet.connect({
            client,
            strategy: "passkey",
            type: "sign-up",
          });
          router.push({
            pathname: redirectionUrl as
              | "/(onboarding)/onboarding_4"
              | "/(tabs)/home",
          });
          setLoading(false); // Hide loader after successful wallet creation
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
        "An error occurred during the wallet creation process. Please try again."
      );
    }
  };

  // // Only render the view if no passkey is stored
  // if (hasPasskey) {
  //   return null; // Do not render if a passkey already exists
  // }

  return (
    <View>
      <Pressable
        style={styles.button}
        onPress={handlePress}
        disabled={loading} // Disable the button while loading
      >
        <Text style={styles.buttonText}>Créez votre portefeuille</Text>
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
                Creating wallet, please wait...
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
    backgroundColor: "#13293D",
    padding: 10,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 335,
  },
  buttonText: {
    ...globalFonts.whiteSubtitle,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
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
