import React, { useState, useCallback, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, RefreshControl, View } from "react-native";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountDetails from "@/components/Homepage/AccountDetails";
import MainAccount from "@/components/Homepage/MainAccount";
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
import { BlurView } from "@react-native-community/blur"; // Import BlurView
import OnRampModal from "@/components/PopUp/OnRampModal";

export default function HomeScreen() {
  const account = useActiveAccount();
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState<string>("$");
  const [eurBalance, setEurBalance] = useState<number>(0);
  const [usdBalance, setUsdBalance] = useState<number>(0);

  const tokenAddress = "0x0c86a754a29714c4fe9c6f1359fa7099ed174c0b";

  const { data, refetch } = useWalletBalance({
    chain,
    address: account?.address,
    client,
    tokenAddress,
  });

  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    setIsBlurred,
    isBlurred,
  } = useStayUpdatedModalContext();

  const stayUpdatedModalRef = useRef<BottomSheetModal>(null);
  const onRampModalRef = useRef<BottomSheetModal>(null);

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
    const fetchInvestmentBalances = async () => {
      try {
        let eurBalance = await AsyncStorage.getItem(
          "investment_account_balance_eur"
        );
        let usdBalance = await AsyncStorage.getItem(
          "investment_account_balance_usd"
        );

        setEurBalance(parseFloat(eurBalance || "0"));
        setUsdBalance(parseFloat(usdBalance || "0"));
      } catch (error) {
        console.error("Error fetching investment balances:", error);
      }
    };

    fetchInvestmentBalances();
  }, []);

  const handleCloseModal = () => {
    setIsBlurred(false); // Disable blur when modal is closed
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          {isBlurred && (
            <BlurView
              style={styles.absolute}
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />
          )}
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
                  ? (
                      parseFloat(data?.displayValue) -
                      eurBalance -
                      usdBalance
                    ).toFixed(2)
                  : "0.00"
              }
              investment_account_balance={(eurBalance + usdBalance).toFixed(2)}
              total_balance={
                data ? parseFloat(data?.displayValue).toFixed(2) : "0.00"
              }
            />

            <MainAccount
              currency={currency}
              main_account_balance={
                data
                  ? (
                      parseFloat(data?.displayValue) -
                      eurBalance -
                      usdBalance
                    ).toFixed(2)
                  : "0.00"
              }
            />
            <InvestmentAccount
              currency={currency}
              investment_account_balance={(eurBalance + usdBalance).toFixed(2)}
            />
            <View style={styles.investmentContainer}>
              <InvestmentCard investment={`DOLLAR US`} investing />
              <InvestmentCard investment={`EURO`} investing />
            </View>
            <TransactionHistory />
          </ScrollView>
          <StayUpdated
            ref={stayUpdatedModalRef}
            setIsModalOpen={setIsCheckoutModalOpen}
            setBlurred={setIsBlurred}
            onDismiss={handleCloseModal}
          />
          <OnRampModal
            ref={onRampModalRef}
            setIsModalOpen={setIsCheckoutModalOpen}
            setBlurred={setIsBlurred}
            account={account}
          />
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
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  investmentContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
});
