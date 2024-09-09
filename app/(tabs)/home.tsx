import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Pressable,
  Text,
} from "react-native";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountDetails from "@/components/Homepage/AccountDetails";
import MainAccount from "@/components/Homepage/MainAccount";
import TransactionPOC from "@/components/Homepage/TransactionsPOC";
import InvestmentAccount from "@/components/Homepage/InvestmentAccount";
import InvestmentCard from "@/components/InvestmentCard/InvestmentCard";
import TransactionHistory from "@/components/Homepage/TransactionHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StayUpdated from "@/components/PopUp/StayUpdated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import MainAccountPopup from "@/components/PopUp/MainAccountPopup";
import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";
import TestBlurModal from "@/components/PopUp/TestBlurModal";

const formatBalance = (
  balance: any,
  eurBalance: number,
  usdBalance: number
) => {
  // Convert balance and investment balances to numbers
  const balanceNum = parseFloat(balance);
  const totalInvestmentBalance = eurBalance + usdBalance;

  // Subtract the investment balances from the main balance
  const finalBalance = balanceNum - totalInvestmentBalance;

  // Return the final balance formatted with two decimal places
  return finalBalance.toFixed(2).replace(".", ",");
};

export default function HomeScreen() {
  const account = useActiveAccount();
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState<string>("$");
  const [eurBalance, setEurBalance] = useState<number>(0);
  const [usdBalance, setUsdBalance] = useState<number>(0);

  const tokenAddress = "0x0c86a754a29714c4fe9c6f1359fa7099ed174c0b"; // the ERC20 token address

  const { data, isLoading, isError, error, refetch } = useWalletBalance({
    chain,
    address: account?.address, // Use active account address
    client,
    tokenAddress,
  });

  const { setIsModalOpen, isModalOpen } = useStayUpdatedModalContext();

  if (!isLoading && data) {
    console.log(data);
  }
  if (isError) {
    console.log(error);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const stayUpdatedModalRef = useRef<BottomSheetModal>(null);
  const mainAccountModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem("selectedCurrency");
        setCurrency(storedCurrency === "euro" ? "€" : "$");
      } catch (error) {
        console.error("Error fetching currency:", error);
      }
    };

    fetchCurrency();
  }, []);

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const hasSeenStayUpdated =
          await AsyncStorage.getItem("hasSeenStayUpdated");
        if (!hasSeenStayUpdated) {
          stayUpdatedModalRef.current?.present();
          setIsModalOpen(true);
          await AsyncStorage.setItem("hasSeenStayUpdated", "true");
        }
      } catch (error) {
        console.error("Error checking first visit:", error);
      }
    };

    checkFirstVisit();
  }, []);

  useEffect(() => {
    const fetchInvestmentBalances = async () => {
      try {
        let eurBalance = await AsyncStorage.getItem(
          "investment_account_balance_eur"
        );
        let usdBalance = await AsyncStorage.getItem(
          "investment_account_balance_usd"
        );

        // If balances don't exist, set them to 100
        if (!eurBalance) {
          await AsyncStorage.setItem("investment_account_balance_eur", "0");
          eurBalance = "0";
        }
        if (!usdBalance) {
          await AsyncStorage.setItem("investment_account_balance_usd", "0");
          usdBalance = "0";
        }

        // Update state with parsed values
        setEurBalance(parseFloat(eurBalance));
        setUsdBalance(parseFloat(usdBalance));
      } catch (error) {
        console.error("Error fetching investment balances:", error);
      }
    };

    fetchInvestmentBalances();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <AccountDetails
              currency={currency}
              main_account_balance={
                data
                  ? formatBalance(data?.displayValue, eurBalance, usdBalance)
                  : "0.00"
              }
              investment_account_balance={(eurBalance + usdBalance)
                .toFixed(2)
                .replace(".", ",")}
              total_balance={
                data
                  ? parseFloat(data?.displayValue).toFixed(2).replace(".", ",")
                  : "0.00"
              }
            />
            <TestBlurModal></TestBlurModal>
            <Pressable
              onPress={() => {
                stayUpdatedModalRef.current?.present();
                setIsModalOpen(true);
              }}
            >
              <Text>Open Stay Updated Modal</Text>
            </Pressable>
            <MainAccount
              currency={currency}
              main_account_balance={
                data
                  ? formatBalance(data?.displayValue, eurBalance, usdBalance)
                  : "0.00"
              }
            />
            <InvestmentAccount
              currency={currency}
              investment_account_balance={(eurBalance + usdBalance)
                .toFixed(2)
                .replace(".", ",")}
            />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 20,
                gap: 20,
              }}
            >
              <InvestmentCard investment={`DOLLAR US`} investing />
              <InvestmentCard investment={`EURO`} investing />
            </View>
            <TransactionHistory />
          </ScrollView>
          <MainAccountPopup ref={mainAccountModalRef} />
          <StayUpdated
            ref={stayUpdatedModalRef}
            setIsModalOpen={setIsModalOpen}
          />

          {/* <TransactionPOC account={account} refetch={refetch} /> */}
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    backgroundColor: "#fff",
    height: "100%",
  },
});
