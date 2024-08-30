import { router } from "expo-router";
import { Pressable, StyleSheet, Image } from "react-native";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { chain, client } from "@/constants/thirdweb";

export default function ConnectWithGoogle({
  connect,
  isConnecting,
  account,
  error,
}: any) {
  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        try {
          connect(async (): Promise<Wallet> => {
            const w = inAppWallet({
              smartAccount: {
                chain,
                sponsorGas: true,
              },
            });
            await w.connect({
              client,
              strategy: "google",
            });
            return w;
          }).then(() => {
            if (!isConnecting && account) {
              router.push({
                pathname: "/(onboarding)/onboarding_3",
              });
            }
          });
        } catch {
          console.log("error", error);
        }
      }}
    >
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
    width: 300,
  },
});
