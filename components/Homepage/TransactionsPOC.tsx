import { prepareContractCall, getContract, sendAndConfirmTransaction, toWei } from "thirdweb";
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

  const contract = getContract({
    client,
    chain: chain,
    address: "0xa1Ebb6CcECDFE0CbC0aaE08E73917AA8E534a7Ec"
  });

  const transaction = prepareContractCall({
    contract,
    method: "function transfer(address to, uint256 value)",
    params: ["0x3bF093C1bB2dFBcfD8EACCbB7cD5a1eAf017494C", toUnits("10", 6)],
  });

  const onClick = async () => {
    if (account) {
      try {
        // Send the transaction
        const tx = await sendAndConfirmTransaction({
          transaction,
          account,
        });

        refetch();
        setTransactionObject(tx);

        const txHash = tx?.transactionHash; // Extract the transaction hash
        console.log("Transaction hash:", txHash);

        if (txHash) {
          // Sign the transaction hash with ECDSA
          const signer = account.signer; // Ensure this points to the account's signer
          const signature = await signer.signMessage(txHash); // Sign the transaction hash

          setSignedMessage(signature);
          console.log("Signed message:", signature);
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