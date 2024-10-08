import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  Alert,
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { chain, client } from "@/constants/thirdweb";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { hasStoredPasskey } from "thirdweb/wallets/in-app";
import { router } from "expo-router";
import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";
import * as Sentry from "@sentry/react-native";
import { useTranslation } from "react-i18next";

interface CreateWithPasskeyProps {
  connect: any;
  redirectionUrl: string;
}

export default function CreateWithPasskey({
  connect,
  redirectionUrl,
}: CreateWithPasskeyProps) {
  const [loading, setLoading] = useState(false); // State to manage the loading
  const { t } = useTranslation();
  const [hasPasskey, setHasPasskey] = useState(false); // State to manage whether a passkey exists
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [passkeyName, setPasskeyName] = useState(""); // State to store the passkey name

  useEffect(() => {
    // Check if a passkey is stored when the component mounts
    const checkPasskey = async () => {
      try {
        const result = await hasStoredPasskey(client);
        setHasPasskey(result);
      } catch (error) {
        Sentry.captureException(error);
      }
    };
    checkPasskey();
  }, []);

  const handleConnect = async () => {
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
        smartAccount: {
          chain: chain,
          sponsorGas: true,
        },
      });

      await connect(async (): Promise<Wallet> => {
        try {
          await wallet.connect({
            client,
            strategy: "passkey",
            type: "sign-up",
            passkeyName, // Add passkeyName argument here
          });
          setLoading(false); // Hide loader after successful wallet creation
          router.dismissAll();
          router.replace({
            pathname: redirectionUrl as
              | "/(onboarding)/onboarding_4"
              | "/(tabs)/home",
          });
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

  const handleSavePasskeyName = () => {
    if (passkeyName.trim() === "") {
      Alert.alert("Error", "Please enter a valid passkey name.");
      return;
    }
    setModalVisible(false); // Close the modal
    handleConnect(); // Call the connect function after passkey name is entered
  };

  const handlePress = () => {
    setModalVisible(true); // Open the modal when button is pressed
  };

  return (
    <View>
      <Pressable
        style={styles.button}
        onPress={handlePress}
        disabled={loading} // Disable the button while loading
      >
        <Text style={styles.buttonText}>
          {t("pages.onboarding_3.create-account")}
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
                {t("pages.onboarding_3.create-account-pending")}
              </Text>
            </View>
          </View>
        </Modal>
      )}

      {/* Minimalist Modal for Passkey Name Input */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Passkey Name"
              placeholderTextColor="#888"
              value={passkeyName}
              onChangeText={setPasskeyName}
            />
            <Pressable style={styles.saveButton} onPress={handleSavePasskeyName}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    fontSize: scaledFontSize(14),
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#13293D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
