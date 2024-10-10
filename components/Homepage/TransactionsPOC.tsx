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

  const contractART = getContract({
    client,
    chain: chain,
    address: "0x070E6A0e832401547a82AF5D6E2360438cf450cB"
  });

  const contractRadaoStaker = getContract({
    client,
    chain: chain,
    address: "0x18406a4C275925fF2Bf5Fdd0616C2872Ff44202E"
  });

  const contractTrUSDC = getContract({
    client,
    chain: chain,
    address: "0xa1Ebb6CcECDFE0CbC0aaE08E73917AA8E534a7Ec"
  });

  const transactionBuyArtWithTrUsdc = [
    // Send trUSDC test token then receive ART in another tx
    prepareContractCall({
      contract: contractTrUSDC,
      method: "function transfer(address to, uint256 value)",
      params: ["0x7Bfe5d2746D51342DD3a1F864D66B1bD74C5a0eE", toUnits("0.001", 6)],
    })
  ];

  const transactionApproveAndStakeArt = [
    // Approve ART
    prepareContractCall({
      contract: contractART,
      method: "function approve(address spender, uint256 value)",
      params: ["0x18406a4C275925fF2Bf5Fdd0616C2872Ff44202E", BigInt(Number.MAX_SAFE_INTEGER)],
    }),
    // Stake ART
    prepareContractCall({
      contract: contractRadaoStaker,
      method: "function stake(address token, uint256 tokenValue, address stArtsRecipient)",
      params: ["0x070E6A0e832401547a82AF5D6E2360438cf450cB", toUnits("0.001", 6), account?.address],
    }),
  ];

  const transactionApproveAndUnstakeArt = [
    // Approve ART
    prepareContractCall({
      contract: contractART,
      method: "function approve(address spender, uint256 value)",
      params: ["0x18406a4C275925fF2Bf5Fdd0616C2872Ff44202E", BigInt(Number.MAX_SAFE_INTEGER)],
    }),
    // Unstake ART
    prepareContractCall({
      contract: contractRadaoStaker,
      method: "function unstake(address token, uint256 tokenValue, address stArtsRecipient)",
      params: ["0x070E6A0e832401547a82AF5D6E2360438cf450cB", toUnits("0.001", 6), account?.address],
    }),
  ];

  const transactionSellArt = [
    //Sell ART (transfer then receive USDC)
    prepareContractCall({
      contract: contractART,
      method: "function transfer(address to, uint256 value)",
      params: ["0x7Bfe5d2746D51342DD3a1F864D66B1bD74C5a0eE", toUnits("0.001", 6)],
    })
  ];

  const onClick = async () => {
    if (account) {
      // try {
      //   // Send the transaction
      //   const tx =  await sendBatchTransaction({
      //     transactions,
      //     account
      //   });

      //   refetch();
      //   setTransactionObject(tx);
      //   console.log(tx)
      //   const txHash = tx?.transactionHash; // Extract the transaction hash
      //   console.log("Transaction hash:", txHash);

      //   if (txHash) {
      //     Alert.alert("Transaction Successful", `Transaction Hash: ${txHash}`);
      //   }
      // } catch (error) {
      //   console.error("Transaction error:", error as Error);
      //   Alert.alert(
      //     "Transaction Failed",
      //     `Error: ${(error as Error).message || error}`
      //   );
      // }
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