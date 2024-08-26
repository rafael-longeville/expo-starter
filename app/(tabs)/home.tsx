import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import {
  useActiveAccount,
  useWalletBalance,
  useSendTransaction,
} from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { sendAndConfirmTransaction, prepareTransaction, toWei } from "thirdweb";

export default function HomeScreen() {
  const account = useActiveAccount();
  const [refreshing, setRefreshing] = useState(false);
  const [transactionObject, setTransactionObject] = useState<any>(null);

  const { data, refetch } = useWalletBalance({
    chain: chain,
    address: account?.address,
    client,
  });

  const transaction = prepareTransaction({
    to: "0x4fc0C27D9F37dC94469e449CBe015df9A392c83e",
    chain: chain,
    client: client,
    value: toWei("0.0001"),
  });

  const onClick = async () => {
    if (account) {
      try {
        const tx = await sendAndConfirmTransaction({
          transaction,
          account,
        })
          .then((res) => {
            refetch();
            console.log(tx);
            setTransactionObject(tx);
            console.log("Transaction", res);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, []);

  const copyToClipboard = () => {
    if (account?.address) {
      Clipboard.setString(account.address);
      Alert.alert("Adresse copiée", "L'adresse a été copiée dans le presse-papier.");
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.blackSubtitle}>Bonjour {account?.address}</Text>
        <Text style={styles.title}>Vous avez {data?.displayValue} ETH</Text>
        <Button title="Envoyer 0.001 ETH" onPress={onClick} />
        <Button title="Copier l'adresse" onPress={copyToClipboard} />
      </View>
    </ScrollView>
  );
}

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
    padding: 50,
    gap: 12,
    flex: 1,
    height: "100%",
    alignItems: "center",
    fontFamily: "Poppins",
    marginTop: 24,
  },
});
