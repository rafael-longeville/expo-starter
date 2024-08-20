import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  useActiveAccount,
  useConnect,
  useDisconnect,
  useActiveWallet,
  ConnectButton,
  ConnectEmbed,
  lightTheme,
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
import { createWallet, Wallet } from "thirdweb/wallets";
import { ethereum, base } from "thirdweb/chains";
import { createAuth } from "thirdweb/auth";
import { ScrollView } from "react-native";

const wallets = [
  inAppWallet({
    auth: {
      passkeyDomain: "thirdweb.com",
    },
    smartAccount: {
      chain: base,
      sponsorGas: true,
    },
  }),
  createWallet("io.metamask"),

  createWallet("me.rainbow"),
  createWallet("com.trustwallet.app"),
  createWallet("io.zerion.wallet"),
];

const thirdwebAuth = createAuth({
  domain: "localhost:3000",
  client,
});

// fake login state, this should be returned from the backend
let isLoggedIn = false;

export default function HomeScreen() {
  const account = useActiveAccount();
  const theme = useColorScheme();
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 32,
            fontWeight: 600,
            width: "100%",
          }}
        >
          Bienvenue
        </Text>
        <Image source={require("@/assets/images/biometry-image.png")} />
        <ConnectWithPasskey />
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            width: "100%",
            fontFamily: "Poppins",
          }}
        >
          Ou bien connectez vous avec :
        </Text>
        <CustomConnectUI />
      </View>
    </ScrollView>
  );
}

const CustomConnectUI = () => {
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [email, setEmail] = useState<string | undefined>();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    if (wallet && wallet.id === "inApp") {
      getUserEmail({ client }).then(setEmail);
    }
  }, [wallet]);

  return wallet && account ? (
    <View>
      <ThemedText>Connected as {shortenAddress(account.address)}</ThemedText>
      {email && <ThemedText type="subtext">{email}</ThemedText>}
      <View style={{ height: 16 }} />
      <ThemedButton onPress={() => disconnect(wallet)} title="Disconnect" />
    </View>
  ) : (
    <>
      <ConnectWithGoogle />
    </>
  );
};

const ConnectWithGoogle = () => {
  const { connect, isConnecting } = useConnect();
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
        connect(async (): Promise<Wallet> => {
          const w = inAppWallet({
            smartAccount: {
              chain,
              sponsorGas: true,
            },
          });
          await w.connect({
            client,
            strategy: "facebook",
          });
          return w;
        });
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

const ConnectWithPasskey = () => {
  const { connect, isConnecting } = useConnect();
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
        });
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: "white",
          fontWeight: 500,
        }}
      >
        Créez votre portefeuille
      </Text>
    </Pressable>
    // <ThemedButton
    //   title="Login with Passkey"
    //
    // />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 24,
    backgroundColor: "#ECFF78",
    height: "100%",
  },
  container: {
    backgroundColor: "#ECFF78",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    flex: 1,
    height: "100%",
    alignItems: "center",
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
