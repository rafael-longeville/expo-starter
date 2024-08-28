import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
  Pressable,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import {
  useActiveAccount,
  useWalletBalance,
  useSendTransaction,
} from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { sendAndConfirmTransaction, prepareTransaction, toWei } from "thirdweb";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { globalFonts } from "../styles/globalFonts";
import AccountDetails from "@/components/Homepage/AccountDetails";

export default function HomeScreen() {
  const { t } = useTranslation();

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
      Alert.alert(
        "Adresse copiée",
        "L'adresse a été copiée dans le presse-papier."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AccountDetails />
        {/* <View style={styles.container}>
          <Text style={globalFonts.subtitle}>Bonjour {account?.address}</Text>
          <Text style={globalFonts.title}>
            Vous avez {data?.displayValue} ETH
          </Text>
          <Button title="Envoyer 0.001 ETH" onPress={onClick} />
          <Button title="Copier l'adresse" onPress={copyToClipboard} />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  account_details: {
    backgroundColor: "#ECFF78",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  smallNumber: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },

  whiteSubtitle: {
    fontSize: 18,
    width: "100%",
    color: "white",
    fontFamily: "Poppins_400Regular",
  },
  scrollView: {
    backgroundColor: "#fff",
    height: "100%",
  },
});
