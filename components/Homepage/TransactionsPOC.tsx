import { prepareTransaction } from "thirdweb";
import { sendAndConfirmTransaction, toWei } from "thirdweb";
import { chain, client } from "@/constants/thirdweb";
import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { Alert } from "react-native";

interface TransactionPOCProps {
  account: any;
  refetch: any;
}

export default function TransactionPOC({
  account,
  refetch,
}: TransactionPOCProps) {
  const [transactionObject, setTransactionObject] = useState<any>(null);

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
    <></>
    /* <View style={styles.container}>
          <Text style={globalFonts.subtitle}>Bonjour {account?.address}</Text>
          <Text style={globalFonts.title}>
            Vous avez {data?.displayValue} ETH
          </Text>
          <Button title="Envoyer 0.001 ETH" onPress={onClick} />
          <Button title="Copier l'adresse" onPress={copyToClipboard} />
        </View> */
  );
}
