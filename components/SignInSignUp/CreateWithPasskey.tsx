import { Pressable, Text, Alert } from "react-native";
import { chain, client } from "@/constants/thirdweb";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { router } from "expo-router";
import { globalFonts } from "@/app/styles/globalFonts";
import * as Sentry from "@sentry/react-native";

interface CreateWithPasskeyProps {
  connect: any;
  isConnecting: boolean;
  account: any;
  isOnboarding: boolean;
}

export default function CreateWithPasskey({
  connect,
  isConnecting,
  account,
  isOnboarding,
}: CreateWithPasskeyProps) {
  const handlePress = async () => {
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
          Sentry.captureMessage(`Wallet connected using sign-up strategy`);
          return wallet;
        } catch (connectError: any) {
          Sentry.captureException(connectError);
          throw connectError;
        }
      });

      if (!isConnecting && account) {
        Sentry.addBreadcrumb({
          category: "navigation",
          message: "Navigating after successful wallet creation",
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
        "An error occurred during the wallet creation process. Please try again."
      );
    }
  };

  return (
    <Pressable
      style={{
        backgroundColor: "#13293D",
        padding: 10,
        borderRadius: 30,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        width: 335,
      }}
      onPress={handlePress}
    >
      <Text
        style={{
          ...globalFonts.whiteSubtitle,
          textAlign: "center",
          fontSize: 14,
          fontFamily: "Poppins_500Medium",
        }}
      >
        Créez votre portefeuille
      </Text>
    </Pressable>
  );
}
