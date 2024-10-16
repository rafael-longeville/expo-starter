import React, { useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import {
  Passkey,
  PasskeyCreateResult,
  PasskeyGetResult,
} from "react-native-passkey";

// Utility function to generate a mock base64 encoded challenge
const generateMockChallenge = (): string => {
  // Generate a random array of bytes and convert to base64
  const randomBytes = new Uint8Array(32); // 32 bytes = 256 bits
  window.crypto.getRandomValues(randomBytes);
  return base64UrlEncode(randomBytes);
};

// Utility function for base64 URL encoding without padding
const base64UrlEncode = (arrayBuffer: Uint8Array): string => {
  return btoa(String.fromCharCode(...arrayBuffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Remove any trailing '='
};

// Define the structure of the registration request object
interface RegistrationRequest {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{ type: string; alg: number }>;
}

// Define the structure of the authentication request object
interface AuthenticationRequest {
  challenge: string;
  rpId: string;
  allowCredentials: Array<{ id: string; type: string }>;
}

const PasskeyComponent: React.FC = () => {
  const [assertion, setAssertion] = useState<PasskeyGetResult | null>(null);
  const [registrationResult, setRegistrationResult] =
    useState<PasskeyCreateResult | null>(null);

  // Function to copy text to the clipboard
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert("Copied to Clipboard", "The result has been copied.");
  };

  // Function to show the result and allow copying
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

  // Function to create a new Passkey
  const handleCreatePasskey = async (): Promise<void> => {
    const registrationRequest: RegistrationRequest = {
      challenge: generateMockChallenge(),
      rp: {
        name: "moncomptesouverain.fr",
        id: "moncomptesouverain.fr",
      },
      user: {
        id: base64UrlEncode(new Uint8Array([1, 2, 3, 4])), // Example mock user ID, should be a base64-url encoded unique identifier
        name: "example_user",
        displayName: "Example User",
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 }, // -7 stands for ES256
      ],
    };

    try {
      console.log("Registration Request:", registrationRequest);
      const result = await Passkey.create(registrationRequest);
      console.log("Registration Result:", result);
      setRegistrationResult(result);

      // Show the result with an option to copy it
      showResultAlert("Passkey Created", result);
    } catch (error) {
      console.error("Error creating passkey:", JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        alert(`Passkey creation failed: ${error.message}`);
      }
    }
  };

  const handleAuthenticate = async (): Promise<void> => {
    if (!registrationResult) {
      Alert.alert("Error", "No passkey found. Please create a passkey first.");
      return;
    }

    const fakeChallenge = generateMockChallenge();

    const authenticationRequest: AuthenticationRequest = {
      challenge: fakeChallenge,
      rpId: "moncomptesouverain.fr", // Ensure this matches the registration
      allowCredentials: [
        {
          id: registrationResult.id, // Use the exact ID from the registration result
          type: "public-key",
        },
      ],
    };

    try {
      showResultAlert("Authentication", {
        message: "Starting Passkey.get() with the following request",
        request: authenticationRequest,
      });

      const result = await Passkey.get(authenticationRequest);

      showResultAlert("Authentication Successful", result);
      setAssertion(result);
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
    <View
      style={{
        flexDirection: "column",
        gap: 10,
        padding: 20,
      }}
    >
      <Button title="Create Passkey" onPress={handleCreatePasskey} />
      <Button title="Authenticate with Passkey" onPress={handleAuthenticate} />
      {registrationResult && (
        <View>
          <Text>Registration Result:</Text>
          <Text>{JSON.stringify(registrationResult, null, 2)}</Text>
        </View>
      )}
      {assertion && (
        <View>
          <Text>Authentication Assertion:</Text>
          <Text>{JSON.stringify(assertion, null, 2)}</Text>
        </View>
      )}
    </View>
  );
};

export default PasskeyComponent;
