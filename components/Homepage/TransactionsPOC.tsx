import { prepareContractCall, getContract, sendAndConfirmTransaction, toWei, sendBatchTransaction } from "thirdweb";
import { chain, client } from "@/constants/thirdweb";
import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { globalFonts } from "@/app/styles/globalFonts";
import { toUnits } from "thirdweb/utils";

interface TransactionPOCProps {
  account: any;
  refetch: any;
}

export default function TransactionPOC({
  account,
  refetch,
}: TransactionPOCProps) {
  const [transactionObject, setTransactionObject] = useState<any>(null);
  const [signedMessage, setSignedMessage] = useState<string | null>(null);

  const contractApprove = getContract({
    client,
    chain: chain,
    address: "0x070E6A0e832401547a82AF5D6E2360438cf450cB"
  });

  const contractStake = getContract({
    client,
    chain: chain,
    address: "0x18406a4C275925fF2Bf5Fdd0616C2872Ff44202E"
  });

  const transactions = [
    prepareContractCall({
      contract: contractApprove,
      method: "function approve(address spender, uint256 value)",
      params: ["0x18406a4C275925fF2Bf5Fdd0616C2872Ff44202E", BigInt(115792089237316195423570985008687907853269984665640564039457584007913129639935)],
    }),
    prepareContractCall({
      contract: contractStake,
      method: "function stake(address token, uint256 tokenValue, address stArtsRecipient)",
      params: ["0x070E6A0e832401547a82AF5D6E2360438cf450cB", toUnits("0.0033808", 6), account?.address],
    }),
  ];

  const onClick = async () => {
    if (account) {
      try {
        // Send the transaction
        const tx =  await sendBatchTransaction({
          transactions,
          account
        });

        refetch();
        setTransactionObject(tx);
        console.log(tx)
        const txHash = tx?.transactionHash; // Extract the transaction hash
        console.log("Transaction hash:", txHash);

        if (txHash) {
          Alert.alert("Transaction Successful", `Transaction Hash: ${txHash}`);
        }
      } catch (error) {
        console.error("Transaction error:", error as Error);
        Alert.alert(
          "Transaction Failed",
          `Error: ${(error as Error).message || error}`
        );
      }
    } else {
      Alert.alert("Account Not Found", "Please connect your account.");
    }
  };

  const copyToClipboard = () => {
    if (account?.address) {
      Clipboard.setString(account.address);
      Alert.alert(
        "Address Copied",
        "The address has been copied to the clipboard."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={globalFonts.subtitle}>Bonjour {account?.address}</Text>
      <Button onPress={onClick}>
        <Text>Envoyer 0.001 ETH</Text>
      </Button>
      <Button onPress={copyToClipboard}>
        <Text>Copier l'adresse</Text>
      </Button>
      {signedMessage && <Text>Signed Transaction Hash: {signedMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});