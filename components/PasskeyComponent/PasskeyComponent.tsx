import React, { useState } from "react";
import { View, Button, Text, Alert } from "react-native";
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

  // Mock registration request with a generated challenge
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

  // Function to create a new Passkey
  const handleCreatePasskey = async (): Promise<void> => {
    try {
      console.log("Registration Request:", registrationRequest);
      // Call the register method with the registration request from your server
      const result = await Passkey.create(registrationRequest);
      console.log("Registration Result:", result);
      setRegistrationResult(result);

      // Pass the result to your server for verification (omitted for this mock)
    } catch (error) {
      console.error("Error creating passkey:", JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        alert(`Passkey creation failed: ${error.message}`);
      }
    }
  };

  // Mock authentication request with a generated challenge
  const authenticationRequest: AuthenticationRequest = {
    challenge: generateMockChallenge(), // Generate a new challenge for authentication
    rpId: "moncomptesouverain.fr",
    allowCredentials: [
      {
        id:
          registrationResult?.id ||
          base64UrlEncode(new Uint8Array([5, 6, 7, 8])), // Replace with the credential ID from the registration result
        type: "public-key",
      },
    ],
  };

  // Function to authenticate using the created passkey
  const handleAuthenticate = async (): Promise<void> => {
    try {
      // Call the authenticate method with the assertion request from your server
      const result = await Passkey.get(authenticationRequest);
      console.log("Authentication Result:", result);
      Alert.alert("Authentication Successful", result.toString());
      setAssertion(result);

      // Pass the result to your server for verification (omitted for this mock)
    } catch (error) {
      console.error("Error authenticating passkey:", error);
      if (error instanceof Error) {
        alert(`Passkey authentication failed: ${error.message}`);
      }
    }
  };

  return (
    <View
      style={{
        flexDirection: "column",
        gap: 10,
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
