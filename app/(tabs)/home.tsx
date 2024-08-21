import { StyleSheet, Text, View, Button } from "react-native";
import {
  useActiveAccount,
  useWalletBalance,
  useSendTransaction
} from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { ScrollView } from "react-native";
import { getContract, prepareContractCall } from "thirdweb";
import { toUnits } from "thirdweb/utils";


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

  const contract = getContract({
    address: "0x0",
    chain: chain,
    client,
  });

  const { mutate: sendTx, data: transactionResult } = useSendTransaction();

  const onClick = () => {
    const transaction = prepareContractCall({
        contract,
        method: "function transfer(address to, uint256 value)",
        params: ["0x4fc0C27D9F37dC94469e449CBe015df9A392c83e", toUnits("0.001", 18)],
    });
    sendTx(transaction);
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