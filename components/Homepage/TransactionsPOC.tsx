import { prepareTransaction, sendAndConfirmTransaction, toWei } from "thirdweb";
import { chain, client } from "@/constants/thirdweb";
import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { globalFonts } from "@/app/styles/globalFonts";

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

  const transaction = prepareTransaction({
    to: "0x4fc0C27D9F37dC94469e449CBe015df9A392c83e",
    chain: chain,
    client: client,
    value: toWei("0.0001"),
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
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const copyToClipboard = () => {
    if (account?.address) {
      Clipboard.setString(account.address);
      Alert.alert(
        "Adresse copiée",
        "L'adresse a été copiée dans le presse-papier."
      );
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={globalFonts.subtitle}>Bonjour {account?.address}</Text>
        {/* <Text style={globalFonts.title}>
          Vous avez {data?.displayValue} ETH
        </Text> */}
        <Button onPress={onClick}>
          <Text>Envoyer 0.001 ETH</Text>
        </Button>
        <Button onPress={copyToClipboard}>
          <Text>Copier l'adresse</Text>
        </Button>
        {signedMessage && <Text>Signed Transaction Hash: {signedMessage}</Text>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
