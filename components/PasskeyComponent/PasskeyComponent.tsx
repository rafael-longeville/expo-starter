import React, { useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Passkey,
  PasskeyCreateRequest,
  PasskeyCreateResult,
  PasskeyGetRequest,
  PasskeyGetResult,
} from "react-native-passkey";
import CreateWithPasskey from "../SignInSignUp/CreateWithPasskey";
import ConnectWithPasskey from "../SignInSignUp/ConnectWithPasskey";
import { useRouter } from "expo-router";

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

  const handleCreatePasskey = async (): Promise<void> => {
    try {
      // Step 1: Request passkey creation options
      let registrationOptions;
      try {
        const signUpResponse = await fetch(
          "https://api-testnet.ibexwallet.org/auth/passkey",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "SIGN_UP",
              userName: "Wallet de Rafa",
            }),
          }
        );

        if (!signUpResponse.ok) {
          const errorResponse = await signUpResponse.json();
          throw new Error(
            `Error in Step 1 (Passkey creation options): ${
              signUpResponse.status
            } - ${JSON.stringify(errorResponse)}`
          );
        }

        registrationOptions = await signUpResponse.json();
        console.log(
          "Received registration options:",
          registrationOptions.credentialsRequestOptions.publicKey.user
        );
      } catch (error) {
        console.error("Error in Step 1 (Passkey creation options):", error);
        throw error;
      }

      // Step 2: Create passkey
      let passkeyResult;
      try {
        const passkeyCreationRequest: PasskeyCreateRequest = {
          challenge:
            registrationOptions.credentialsRequestOptions.publicKey.challenge,
          rp: registrationOptions.credentialsRequestOptions.publicKey.rp,
          user: registrationOptions.credentialsRequestOptions.publicKey.user,
          pubKeyCredParams:
            registrationOptions.credentialsRequestOptions.publicKey
              .pubKeyCredParams,
        };

        passkeyResult = await Passkey.create(passkeyCreationRequest);
        console.log("Passkey creation result:", passkeyResult);
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "error" in error &&
          "message" in error
        ) {
          const nativeError = error as { error: string; message: string };
          if (
            nativeError.error === "Native error" &&
            nativeError.message.includes(
              "(com.apple.AuthenticationServices.AuthorizationError error 1001.)"
            )
          ) {
            console.warn("Passkey creation was canceled by the user.");
            Alert.alert(
              "Passkey Creation Canceled",
              "You canceled the passkey creation process. Please try again."
            );
            return; // Exit without throwing
          }
        }
        console.error("Error in Step 2 (Passkey creation):", error);
        throw error; // Re-throw for other errors
      }

      // Step 3: Login with the passkey result
      let loginData;
      try {
        const loginPayload = {
          rawId: passkeyResult.rawId,
          response: {
            attestationObject: passkeyResult.response.attestationObject, // Correct field mapping
            clientDataJSON: passkeyResult.response.clientDataJSON,
          },
          type: "public-key",
        };

        console.log(
          "Corrected Login payload:",
          JSON.stringify(loginPayload, null, 2)
        );

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
          console.error("Login response error details:", errorResponse);
          throw new Error(
            `Error in Step 3 (Login): ${
              loginResponse.status
            } - ${JSON.stringify(errorResponse)}`
          );
        }

        loginData = await loginResponse.json();
        console.log("Login response data:", loginData);
      } catch (error) {
        console.error("Error in Step 3 (Login):", error);
        throw error;
      }

      // Step 4: Store the JWT token
      try {
        setAccessToken(loginData.access_token);
        showResultAlert("Login Successful", loginData);
      } catch (error) {
        console.error("Error in Step 4 (Storing JWT):", error);
        throw error;
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "error" in error &&
        "message" in error
      ) {
        const nativeError = error as { error: string; message: string };
        if (
          nativeError.error === "Native error" &&
          nativeError.message.includes(
            "(com.apple.AuthenticationServices.AuthorizationError error 1001.)"
          )
        ) {
          console.warn("Passkey creation/login was canceled by the user.");
          Alert.alert(
            "Operation Canceled",
            "You canceled the process. Please try again."
          );
          return; // Exit without throwing
        }
      }
      console.error("Passkey creation/login failed:", error);
      showResultAlert("Passkey Creation/Login Failed", { error });
    }
  };

  const handleSignIn = async (): Promise<void> => {
    try {
      // Step 1: Request authentication options for sign-in
      let authenticationOptions;
      try {
        const response = await fetch(
          "https://api-testnet.ibexwallet.org/auth/passkey",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "SIGN_IN",
            }),
          }
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(
            `Error in Step 1 (Authentication options): ${
              response.status
            } - ${JSON.stringify(errorResponse)}`
          );
        }

        authenticationOptions = await response.json();
        console.log("Received authentication options:", authenticationOptions);
      } catch (error) {
        console.error("Error in Step 1 (Authentication options):", error);
        throw error;
      }

      // Step 2: Use passkey to authenticate
      let authenticationResult;
      try {
        const authenticationRequest: PasskeyGetRequest = {
          challenge:
            authenticationOptions.credentialsRequestOptions.publicKey.challenge,
          rpId: "app-testnet.ibexwallet.org", // Explicitly set rpId if missing
          userVerification:
            authenticationOptions.credentialsRequestOptions.publicKey
              .userVerification,
        };

        authenticationResult = await Passkey.get(authenticationRequest);
        console.log("Authentication result:", authenticationResult);
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "error" in error &&
          "message" in error
        ) {
          const nativeError = error as { error: string; message: string }; // Type assertion
          if (
            nativeError.error === "Native error" &&
            nativeError.message.includes(
              "(com.apple.AuthenticationServices.AuthorizationError error 1001.)"
            )
          ) {
            console.warn("Authentication was canceled by the user.");
            Alert.alert(
              "Sign-In Canceled",
              "You canceled the authentication process. Please try again."
            );
            return; // Exit without throwing
          }
        }
        console.error("Error in Step 2 (Passkey authentication):", error);
        throw error; // Re-throw for other errors
      }

      // Step 3: Send authentication result to login endpoint
      let loginData;
      try {
        const loginPayload = {
          authenticatorAttachment: "platform", // Assume platform authenticator
          clientExtensionResults: {},
          id: authenticationResult.id,
          rawId: authenticationResult.rawId,
          response: {
            authenticatorData: authenticationResult.response.authenticatorData,
            clientDataJSON: authenticationResult.response.clientDataJSON,
            signature: authenticationResult.response.signature,
            userHandle: authenticationResult.response.userHandle,
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
          console.error("Login response error details:", errorResponse);
          throw new Error(
            `Error in Step 3 (Sign-In): ${
              loginResponse.status
            } - ${JSON.stringify(errorResponse)}`
          );
        }

        loginData = await loginResponse.json();
        console.log("Sign-in response data:", loginData);
      } catch (error) {
        console.error("Error in Step 3 (Sign-In):", error);
        throw error;
      }

      // Step 4: Store the JWT token
      try {
        setAccessToken(loginData.access_token);
        router.push("/(onboarding)/onboarding_7");
      } catch (error) {
        console.error("Error in Step 4 (Storing JWT):", error);
        throw error;
      }
    } catch (error) {
      console.error("Passkey sign-in failed:", error);
      showResultAlert("Sign-In Failed", { error });
    }
  };

  return (
    <View
      style={{
        flexDirection: "column",
        gap: 10,
        padding: 20,
        width: "100%",
        alignItems: "center",
      }}
    >
      <CreateWithPasskey
        onPressFunction={() => router.push("/(onboarding)/onboarding_2")}
      />
      <ConnectWithPasskey onPressFunction={handleSignIn} />
    </View>
  );
};

export default PasskeyComponent;
