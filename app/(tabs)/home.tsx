import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  RefreshControl,
} from "react-native";
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
  const [transactionObject, setTransactionObject] = useState(null);

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
