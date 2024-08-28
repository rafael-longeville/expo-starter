import { router } from "expo-router";
import { Pressable, Text } from "react-native";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { hasStoredPasskey } from "thirdweb/wallets/in-app";
import { chain, client } from "@/constants/thirdweb";
import { globalFonts } from "@/app/styles/globalFonts";

export default function ConnectWithPasskey({
  connect,
  isConnecting,
  account,
  error,
}: any) {
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
      onPress={() => {
        try {
          connect(async (): Promise<Wallet> => {
            const wallet = inAppWallet({
              auth: {
                options: ["passkey"],
                passkeyDomain: "moncomptesouverain.fr",
              },
            });

            const hasPasskey = await hasStoredPasskey(client);
            await wallet.connect({
              client,
              strategy: "passkey",
              type: hasPasskey ? "sign-in" : "sign-up",
            });
            return wallet;
          }).then(() => {
            if (!isConnecting && account) {
              router.push({
                pathname: "/(tabs)/home",
              });
            }
          });
        } catch {
          console.log("error", error);
        }
      }}
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
