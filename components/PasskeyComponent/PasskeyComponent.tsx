import React, { useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Passkey, PasskeyGetRequest } from "react-native-passkey";
import CreateWithPasskey from "../SignInSignUp/CreateWithPasskey";
import ConnectWithPasskey from "../SignInSignUp/ConnectWithPasskey";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PasskeyComponent: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    Clipboard.setStringAsync(text);
    Alert.alert("Copied to Clipboard", "The result has been copied.");
  };

  const showResultAlert = (title: string, result: any) => {
    const resultString = JSON.stringify(result, null, 2);
    Alert.alert(
      title,
      resultString,
      [
        {
          text: "Copier pour envoyer au Dev",
          onPress: () => copyToClipboard(resultString),
        },
        { text: "OK", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  let isSigningIn = false;

  const handleSignIn = async (): Promise<void> => {
    // Check if passkeys are supported before proceeding
    const isSupported = Passkey.isSupported();
    if (!isSupported) {
      Alert.alert(
        "Passkeys Not Supported",
        "Your device does not support passkeys. Please use another method."
      );
      return;
    }

    if (isSigningIn) {
      console.warn("Sign-in already in progress.");
      return;
    }
    isSigningIn = true;
    try {
      const authOptionsResponse = await fetch(
        "https://api-testnet.ibexwallet.org/auth/passkey",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "SIGN_IN" }),
        }
      );

      if (!authOptionsResponse.ok) {
        const errorResponse = await authOptionsResponse.json();
        throw new Error(
          `Error requesting authentication options: ${
            authOptionsResponse.status
          } - ${JSON.stringify(errorResponse)}`
        );
      }

      const authenticationOptions = await authOptionsResponse.json();
      console.log("Received authentication options:", authenticationOptions);

      const authenticationRequest: PasskeyGetRequest = {
        challenge:
          authenticationOptions.credentialsRequestOptions.publicKey.challenge,
        rpId: "app-testnet.ibexwallet.org",
        userVerification:
          authenticationOptions.credentialsRequestOptions.publicKey
            .userVerification,
      };

      const authenticationResult = await Passkey.get(authenticationRequest);
      console.log("Authentication result:", authenticationResult);

      const parsedResult =
        typeof authenticationResult === "string"
          ? JSON.parse(authenticationResult)
          : authenticationResult;

      const loginPayload = {
        authenticatorAttachment: "platform",
        clientExtensionResults: {},
        id: parsedResult.id,
        rawId: parsedResult.rawId,
        response: {
          authenticatorData: parsedResult.response.authenticatorData,
          clientDataJSON: parsedResult.response.clientDataJSON,
          signature: parsedResult.response.signature,
          userHandle: parsedResult.response.userHandle,
        },
        type: "public-key",
      };

      console.log("Sign-in payload:", JSON.stringify(loginPayload, null, 2));

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
          `Error during sign-in: ${loginResponse.status} - ${JSON.stringify(
            errorResponse
          )}`
        );
      }

      const loginData = await loginResponse.json();
      console.log("Sign-in response data:", loginData);

      await AsyncStorage.setItem("jwt_token", loginData.access_token);

      router.push("/(onboarding)/onboarding_7");
    } catch (error) {
      console.error("Passkey sign-in failed:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        //@ts-ignore
        error.message.includes(
          "(com.apple.AuthenticationServices.AuthorizationError error 1001.)"
        )
      ) {
        console.log("Sign in canceled")
      } else {
        Alert.alert("Error", JSON.stringify(error));
      }
    } finally {
      isSigningIn = false;
    }
  };

  return (
    <>
      <CreateWithPasskey
        onPressFunction={() => {
          const isSupported = Passkey.isSupported();
          if (!isSupported) {
            Alert.alert(
              "Passkeys Not Supported",
              "Your device does not support passkeys. Please use another method."
            );
            return;
          }
          router.push("/(onboarding)/onboarding_2");
        }}
      />
      <ConnectWithPasskey onPressFunction={handleSignIn} />
    </>
  );
};

export default PasskeyComponent;
