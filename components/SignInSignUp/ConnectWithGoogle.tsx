import { router } from "expo-router";
import { Pressable, StyleSheet, Image, Alert } from "react-native";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { chain, client } from "@/constants/thirdweb";
import * as Sentry from "@sentry/react-native";

export default function ConnectWithGoogle({
  connect,
  isConnecting,
  account,
}: any) {
  const handlePress = async () => {
    try {
      Sentry.addBreadcrumb({
        category: "action",
        message: "User clicked connect with Google button",
        level: "info",
      });

      const wallet = inAppWallet({
        smartAccount: {
          chain,
          sponsorGas: true,
        },
      });

      await connect(async (): Promise<Wallet> => {
        try {
          await wallet.connect({
            client,
            strategy: "google",
            redirectUrl:
              "com.civicpower.ibexwallet://(onboarding)/onboarding_4",
          });
          Sentry.captureMessage(`Wallet connected using Google strategy`);
          return wallet;
        } catch (connectError: any) {
          Sentry.captureException(connectError);
          throw connectError;
        }
      });
    } catch (err: any) {
      Sentry.captureException(err);
      Alert.alert(
        "Error",
        "An error occurred during the Google connection process. Please try again."
      );
    }
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <Image
        source={require("@/assets/images/google.png")}
        style={{ width: 30, height: 30 }}
      />
    </Pressable>
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
    width: "100%",
  },
});
