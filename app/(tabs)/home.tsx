import React, { useState, useCallback } from "react";
import { StyleSheet, ScrollView, RefreshControl, View } from "react-native";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountDetails from "@/components/Homepage/AccountDetails";
import MainAccount from "@/components/Homepage/MainAccount";
import TransactionPOC from "@/components/Homepage/TransactionsPOC";
import InvestmentAccount from "@/components/Homepage/InvestmentAccount";
import InvestmentCard from "@/components/InvestmentCard/InvestmentCard";
import TransactionHistory from "@/components/Homepage/TransactionHistory";

export default function HomeScreen() {
  const account = useActiveAccount();
  const [refreshing, setRefreshing] = useState(false);
  const [transactionObject, setTransactionObject] = useState<any>(null);

  const { data, refetch } = useWalletBalance({
    chain: chain,
    address: account?.address,
    client,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AccountDetails />
        <MainAccount />
        <InvestmentAccount />
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            gap: 20,
          }}
        >
          <InvestmentCard investment={"DOLLAR US"} investing />
          <InvestmentCard investment={"EURO"} investing />
        </View>
        <TransactionHistory />
        <TransactionPOC account={account} refetch={refetch} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
