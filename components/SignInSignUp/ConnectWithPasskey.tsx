import { router } from "expo-router";
import { Pressable, Text, Alert } from "react-native";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { client } from "@/constants/thirdweb";
import { globalFonts } from "@/app/styles/globalFonts";
import * as Sentry from "@sentry/react-native";

interface ConnectWithPasskeyProps {
  connect: any;
  isConnecting: boolean;
  account: any;
  isOnboarding: boolean;
}

export default function ConnectWithPasskey({
  connect,
  isConnecting,
  account,
  isOnboarding,
}: ConnectWithPasskeyProps) {
  const handlePress = async () => {
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
      });

      await connect(async (): Promise<Wallet> => {
        try {
          await wallet.connect({
            client,
            strategy: "passkey",
            type: "sign-in",
          });
          router.push({
            pathname: "/(onboarding)/onboarding_4",
          });
          Sentry.captureMessage(`Wallet connected using sign-in strategy`);
          return wallet;
        } catch (connectError: any) {
          Sentry.captureException(connectError);
          throw connectError;
        }
      });

      if (!isConnecting && account) {
        Sentry.addBreadcrumb({
          category: "navigation",
          message: "Navigating after successful connection",
          level: "info",
        });

        router.push({
          pathname: !isOnboarding
            ? "/(tabs)/home"
            : "/(onboarding)/onboarding_3",
        });
      }
    } catch (err: any) {
      Sentry.captureException(err);
      Alert.alert(
        "Error",
        "An error occurred during the connection process. Please try again."
      );
    }
  };

  return (
    <Pressable
      style={{
        backgroundColor: "white",
        padding: 10,
        borderRadius: 30,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        width: 335,
        borderWidth: 1,
        borderColor: "#13293D",
      }}
      onPress={handlePress}
    >
      <Text
        style={{
          ...globalFonts.subtitle,
          textAlign: "center",
        }}
      >
        Utilisez un portefeuille existant
      </Text>
    </Pressable>
  );
}
