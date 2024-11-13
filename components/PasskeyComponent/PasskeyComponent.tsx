import React, { useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Passkey,
  PasskeyCreateResult,
  PasskeyGetResult,
  PasskeyGetRequest,
} from "react-native-passkey";
import "react-native-get-random-values";

const generateMockChallenge = (): string => {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return base64UrlEncode(randomBytes);
};

const base64UrlEncode = (arrayBuffer: Uint8Array): string => {
  return btoa(String.fromCharCode(...arrayBuffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const PasskeyComponent: React.FC = () => {
  const [assertion, setAssertion] = useState<PasskeyGetResult | null>(null);
  const [registrationResult, setRegistrationResult] =
    useState<PasskeyCreateResult | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    Clipboard.setStringAsync(text);
    Alert.alert("Copied to Clipboard", "The result has been copied.");
  };

  const showResultAlert = (title: string, result: object) => {
    const resultString = JSON.stringify(result, null, 2);
    Alert.alert(
      title,
      resultString,
      [
        {
          text: "Copy to Clipboard",
          onPress: () => copyToClipboard(resultString),
        },
        { text: "OK", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleCreatePasskey = async (): Promise<void> => {
    try {
      // Step 1: Fetch the registration options from `/auth/passkey`
      const response = await fetch(
        "https://api-testnet.ibexwallet.org/auth/passkey",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "SIGN_UP" }),
        }
      );

      const registrationOptions = await response.json();
      console.log("Received registration options:", registrationOptions);

      // Step 2: Encode the challenge as base64 URL-safe string
      const challengeUint8Array = Uint8Array.from(
        atob(registrationOptions.credentialsRequestOptions.publicKey.challenge),
        (c) => c.charCodeAt(0)
      );
      const challengeBase64Url = btoa(
        String.fromCharCode(...challengeUint8Array)
      )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // Step 3: Create passkeyCreationRequest with encoded challenge
      const passkeyCreationRequest = {
        challenge: challengeBase64Url,
        rp: registrationOptions.credentialsRequestOptions.publicKey.rp,
        user: {
          ...registrationOptions.credentialsRequestOptions.publicKey.user,
          id: btoa(
            String.fromCharCode(
              ...Uint8Array.from(
                atob(
                  registrationOptions.credentialsRequestOptions.publicKey.user
                    .id
                ),
                (c) => c.charCodeAt(0)
              )
            )
          )
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, ""),
        },
        pubKeyCredParams:
          registrationOptions.credentialsRequestOptions.publicKey
            .pubKeyCredParams,
        timeout:
          registrationOptions.credentialsRequestOptions.publicKey.timeout,
        attestation:
          registrationOptions.credentialsRequestOptions.publicKey.attestation,
      };

      // Create passkey on device
      const passkeyResult = await Passkey.create(passkeyCreationRequest);
      console.log("Passkey creation result:", passkeyResult);

      // Store passkey creation result
      setRegistrationResult(passkeyResult);
      showResultAlert("Passkey Created", passkeyResult);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      showResultAlert("Passkey Creation Failed", {
        error: errorMessage,
        details: error,
      });
    }
  };

  // Step 2: Handle Authentication
  const handleAuthenticate = async (): Promise<void> => {
    if (!registrationResult) {
      Alert.alert("Error", "No passkey found. Please create a passkey first.");
      return;
    }

    try {
      // Step 1: Fetch challenge and authentication options
      const response = await fetch(
        "https://api-testnet.ibexwallet.org/auth/passkey/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const authenticationOptions = await response.json();
      console.log("Received authentication options:", authenticationOptions);

      // Step 2: Encode challenge as base64 URL-safe string for PasskeyGetRequest
      const challengeUint8Array = Uint8Array.from(
        atob(
          authenticationOptions.credentialsRequestOptions.publicKey.challenge
        ),
        (c) => c.charCodeAt(0)
      );
      const challengeBase64Url = btoa(
        String.fromCharCode(...challengeUint8Array)
      )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // Step 3: Construct authenticationRequest with encoded challenge
      const authenticationRequest = {
        challenge: challengeBase64Url,
        rpId: authenticationOptions.credentialsRequestOptions.publicKey.rp.id,
        userVerification: "preferred", // Set user verification based on the requirements (optional)
      };

      // Perform authentication using Passkey.get
      const authenticationResult = await Passkey.get(authenticationRequest);
      console.log("Authentication result:", authenticationResult);

      // Step 4: Send authentication result to server for token exchange
      const loginResponse = await fetch(
        "https://api-testnet.ibexwallet.org/auth/passkey/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authenticatorAttachment: "platform",
            clientExtensionResults: {},
            id: authenticationResult.id,
            rawId: authenticationResult.rawId,
            response: {
              authenticatorData:
                authenticationResult.response.authenticatorData,
              clientDataJSON: authenticationResult.response.clientDataJSON,
            },
            type: "public-key",
          }),
        }
      );

      const loginData = await loginResponse.json();
      console.log("Login response data:", loginData);

      setAccessToken(loginData.access_token);
      showResultAlert("Login Successful", loginData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      showResultAlert("Authentication Failed", {
        error: errorMessage,
        details: error,
      });
    }
  };

  return (
    <View style={{ flexDirection: "column", gap: 10, padding: 20 }}>
      <Button title="Create Passkey" onPress={handleCreatePasskey} />
      <Button title="Authenticate with Passkey" onPress={handleAuthenticate} />
      {registrationResult && (
        <View>
          <Text>Registration Result:</Text>
          <Text>{JSON.stringify(registrationResult, null, 2)}</Text>
        </View>
      )}
      {accessToken && (
        <View>
          <Text>Access Token:</Text>
          <Text>{accessToken}</Text>
        </View>
      )}
    </View>
  );
};

export default PasskeyComponent;
