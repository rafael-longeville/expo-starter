import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { scaledFontSize } from "../styles/globalFonts";
import { router } from "expo-router";
import { Passkey, PasskeyCreateRequest } from "react-native-passkey";
import * as Sentry from "@sentry/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Onboarding5: React.FC = () => {
  const { t } = useTranslation();
  const [walletName, setWalletName] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loader state

  const handleCreatePasskey = async (): Promise<void> => {
    try {
      Sentry.addBreadcrumb({
        category: "auth",
        message: "Starting passkey creation process",
        level: "info",
      });

      setLoading(true); // Show loader

      // Step 1: Request passkey creation options
      const signUpResponse = await fetch(
        "https://api-testnet.ibexwallet.org/auth/passkey",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "SIGN_UP", userName: walletName }),
        }
      );

      if (!signUpResponse.ok) {
        const errorResponse = await signUpResponse.json();
        throw new Error(
          `Error requesting passkey options: ${
            signUpResponse.status
          } - ${JSON.stringify(errorResponse)}`
        );
      }

      const registrationOptions = await signUpResponse.json();

      // Step 2: Create passkey
      const passkeyCreationRequest: PasskeyCreateRequest = {
        challenge:
          registrationOptions.credentialsRequestOptions.publicKey.challenge,
        rp: registrationOptions.credentialsRequestOptions.publicKey.rp,
        user: registrationOptions.credentialsRequestOptions.publicKey.user,
        pubKeyCredParams:
          registrationOptions.credentialsRequestOptions.publicKey
            .pubKeyCredParams,
      };

      const passkeyResult = await Passkey.create(passkeyCreationRequest);

      // Step 3: Login with the passkey result
      const loginPayload = {
        rawId: passkeyResult.rawId,
        response: {
          attestationObject: passkeyResult.response.attestationObject,
          clientDataJSON: passkeyResult.response.clientDataJSON,
        },
        type: "public-key",
      };

      const loginResponse = await fetch(
        "https://api-testnet.ibexwallet.org/auth/passkey/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginPayload),
        }
      );

      if (!loginResponse.ok) {
        const errorResponse = await loginResponse.json();
        throw new Error(
          `Error logging in: ${loginResponse.status} - ${JSON.stringify(
            errorResponse
          )}`
        );
      }

      const loginData = await loginResponse.json();

      // Step 4: Store JWT token
      await AsyncStorage.setItem("jwt_token", loginData.access_token);

      Sentry.addBreadcrumb({
        category: "auth",
        message: "JWT token saved successfully",
        level: "info",
      });

      router.push("/(onboarding)/onboarding_6");
    } catch (error) {
      console.error("Passkey creation/login failed:", error);
      Sentry.captureException(error);

      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        //@ts-ignore
        error.message.includes(
          "(com.apple.AuthenticationServices.AuthorizationError error 1001.)"
        )
      ) {
        Alert.alert(
          "Operation Canceled",
          "You canceled the process. Please try again."
        );
      } else {
        Alert.alert("Error", "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#333333" />
        </View>
      ) : (
        <>
          <Text style={styles.title}>{t("pages.onboarding_5.title")}</Text>
          <View style={styles.container}>
            <View style={styles.inputSection}>
              <Text style={styles.label}>{t("pages.onboarding_5.label")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("pages.onboarding_5.placeholder")}
                placeholderTextColor="#A0A0A0"
                value={walletName}
                onChangeText={setWalletName}
              />
              <Text style={styles.accessText}>
                {t("pages.onboarding_5.access_text")}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  walletName.trim()
                    ? styles.buttonActive
                    : styles.buttonDisabled,
                ]}
                onPress={handleCreatePasskey}
                disabled={!walletName.trim()}
              >
                <Text style={styles.buttonText}>
                  {t("pages.onboarding_5.create_wallet_button")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    paddingBottom: 30,
    marginTop: 170,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    width: "100%",
  },
  title: {
    fontSize: scaledFontSize(22),
    fontWeight: "700",
    textAlign: "center",
    color: "#212121",
  },
  inputSection: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  label: {
    fontSize: scaledFontSize(20),
    fontFamily: "Poppins_400Regular",
    color: "#212121",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    width: "60%",
    height: 40,
    borderColor: "#6EE7B7",
    borderWidth: 0.5,
    borderRadius: 20,
    backgroundColor: "#FFFFFF", // White background
    paddingHorizontal: 10,
    textAlign: "center",
    fontSize: scaledFontSize(14),
    color: "#212121",
    marginBottom: 10,
  },
  accessText: {
    fontSize: scaledFontSize(16),
    fontFamily: "Poppins_400Regular",
    color: "#212121",
    textAlign: "center",
  },
  button: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    width: "95%",
    height: 40,
  },
  buttonActive: {
    backgroundColor: "#333333",
    // Add drop shadow for iOS
    shadowColor: "#091E42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Add elevation for Android
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    fontSize: scaledFontSize(14),
    color: "#FFFFFF",
    fontFamily: "Poppins_500Medium",
  },

  linkText: {
    fontSize: scaledFontSize(14),
    color: "#212121",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
});
export default Onboarding5;
