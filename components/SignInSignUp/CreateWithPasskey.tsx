import { Pressable, Text } from "react-native";
import { chain, client } from "@/constants/thirdweb";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { router } from "expo-router";
import { globalFonts } from "@/app/styles/globalFonts";

interface CreateWithPasskeyProps {
  connect: any;
  isConnecting: boolean;
  account: any;
  error: any;
  isOnboarding: boolean;
}
export default function CreateWithPasskey({
  connect,
  isConnecting,
  account,
  error,
  isOnboarding,
}: CreateWithPasskeyProps) {
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
      onPress={() => {
        try {
          connect(async (): Promise<Wallet> => {
            const wallet = inAppWallet({
              auth: {
                options: ["passkey"],
                passkeyDomain: "moncomptesouverain.fr",
              },
            });

            await wallet.connect({
              client,
              strategy: "passkey",
              type: "sign-up",
            });
            return wallet;
          }).then(() => {
            if (!isConnecting && account) {
              router.push({
                pathname: !isOnboarding
                  ? "/(tabs)/home"
                  : "/(onboarding)/onboarding_3",
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
