import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {
  useActiveAccount,
  useConnect,
  useDisconnect,
  useActiveWallet,
} from "thirdweb/react";
import {
  getUserEmail,
  hasStoredPasskey,
  inAppWallet,
} from "thirdweb/wallets/in-app";
import { chain, client } from "@/constants/thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { ThemedButton } from "@/components/ThemedButton";
import { useEffect, useState } from "react";
import { Wallet } from "thirdweb/wallets";
import { ScrollView } from "react-native";
import { Link, router } from "expo-router";

export default function HomeScreen() {
  const { connect, isConnecting, error } = useConnect();

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text
          style={{
            ...styles.blackSubtitle,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Vous êtes à un doigt de créer votre compte souverain gratuitement !
        </Text>
        <Image source={require("@/assets/images/biometry-image.png")} />
        <ConnectWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          error={error}
        />
        <CreateWithPasskey
          connect={connect}
          isConnecting={isConnecting}
          error={error}
        />
        <Text
          style={{
            ...styles.blackSubtitle,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Ou bien connectez vous avec :
        </Text>
        <ConnectWithGoogle
          connect={connect}
          isConnecting={isConnecting}
          error={error}
        />
        <Image
          style={{
            marginTop: 24,
          }}
          source={require("@/assets/images/ibex-wallet-logo.png")}
        />
        <Text
          style={{
            ...styles.blackSubtitle,
            textAlign: "center",
            fontSize: 12,
            marginTop: 12,
          }}
        >
          En continuant, vous confirmez avoir lu et accepté{" "}
          <Link href={"https://moncomptesouverain.fr"}>
            <Text
              style={{
                textDecorationLine: "underline",
              }}
            >
              nos conditions générales de ventes.
            </Text>
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
}

const ConnectWithGoogle = ({ connect, isConnecting, error }: any) => {
  const account = useActiveAccount();

  return (
    <Pressable
      style={{
        backgroundColor: "#13293D",
        padding: 10,
        borderRadius: 30,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        width: 50,
      }}
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
                pathname: "/(tabs)/home",
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
        style={{
          width: 30,
          height: 30,
        }}
      />
    </Pressable>
  );
};

const CreateWithPasskey = ({ connect, isConnecting, error }: any) => {
  const account = useActiveAccount();

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
          ...styles.whiteSubtitle,
          textAlign: "center",
          fontSize: 14,
          fontFamily: "Poppins_500Medium",
        }}
      >
        Créez votre portefeuille
      </Text>
    </Pressable>
  );
};

const ConnectWithPasskey = ({ connect, isConnecting, error }: any) => {
  const account = useActiveAccount();

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
          ...styles.blackSubtitle,
          textAlign: "center",
          fontSize: 14,
          fontFamily: "Poppins_500Medium",
        }}
      >
        Utilisez un portefeuille existant
      </Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    width: "100%",
    color: "#13293D",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  blackSubtitle: {
    fontSize: 18,
    width: "100%",
    color: "#13293D",
    fontFamily: "Poppins_400Regular",
  },
  whiteSubtitle: {
    fontSize: 18,
    width: "100%",
    color: "white",
    fontFamily: "Poppins_400Regular",
  },
  scrollView: {
    backgroundColor: "#ECFF78",
    height: "100%",
  },
  container: {
    backgroundColor: "#ECFF78",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    flex: 1,
    height: "100%",
    alignItems: "center",
    fontFamily: "Poppins",
    marginTop: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "space-evenly",
  },
});
