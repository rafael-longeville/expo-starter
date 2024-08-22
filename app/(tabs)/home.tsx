import { StyleSheet, Text, View, Button } from "react-native";
import {
  useActiveAccount,
  useWalletBalance,
  useSendTransaction
} from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { ScrollView } from "react-native";
import { sendAndConfirmTransaction } from "thirdweb";
import { prepareTransaction, toWei } from "thirdweb";

export default function HomeScreen() {

  const account = useActiveAccount();

  const { data } = useWalletBalance({
    chain: chain,
    address: account?.address,
    client,
  });
  // console.log("data", data);
  // console.log("balance", data?.displayValue, data?.symbol);
  // console.log("address", account?.address);``

  const transaction = prepareTransaction({
    to: "0x4fc0C27D9F37dC94469e449CBe015df9A392c83e",
    chain: chain,
    client: client,
    value: toWei("0.0001"),
  });
  
  const onClick = async () => {
    if (account) {
      const tx = await sendAndConfirmTransaction({ transaction, account, });
      console.log(tx)
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
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