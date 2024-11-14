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

const PasskeyComponent: React.FC = () => {
  const [registrationResult, setRegistrationResult] =
    useState<PasskeyCreateResult | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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
      console.log(
        "Received registration options:",
        registrationOptions.credentialsRequestOptions.publicKey.user
      );

      const passkeyCreationRequest: PasskeyCreateRequest = {
        challenge:
          registrationOptions.credentialsRequestOptions.publicKey.challenge,
        rp: registrationOptions.credentialsRequestOptions.publicKey.rp,
        user: registrationOptions.credentialsRequestOptions.publicKey.user,
        pubKeyCredParams:
          registrationOptions.credentialsRequestOptions.publicKey
            .pubKeyCredParams,
      };

      const passkeyResult: PasskeyCreateResult = await Passkey.create(
        passkeyCreationRequest
      );
      console.log("Passkey creation result:", passkeyResult);

      setRegistrationResult(passkeyResult);
      showResultAlert("Passkey Created", passkeyResult);
    } catch (error) {
      showResultAlert("Passkey Creation Failed", { error });
    }
  };

  const handleAuthenticate = async (): Promise<void> => {
    if (!registrationResult) {
      Alert.alert("Error", "No passkey found. Please create a passkey first.");
      return;
    }

    try {
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

      const authenticationRequest: PasskeyGetRequest = {
        challenge:
          authenticationOptions.credentialsRequestOptions.publicKey.challenge,
        rpId: authenticationOptions.credentialsRequestOptions.publicKey.rpId,
      };

      const authenticationResult: PasskeyGetResult = await Passkey.get(
        authenticationRequest
      );
      console.log("Authentication result:", authenticationResult);

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
              signature: authenticationResult.response.signature,
              userHandle: authenticationResult.response.userHandle,
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
      showResultAlert("Authentication Failed", { error });
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
