// Home.tsx

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Alert,
} from "react-native";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { chain, client } from "@/constants/thirdweb";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountDetails from "@/components/Homepage/AccountDetails";
import MainAccount from "@/components/Homepage/MainAccount";
import InvestmentAccount from "@/components/Homepage/InvestmentAccount";
import TransactionHistory from "@/components/Homepage/TransactionHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StayUpdated from "@/components/PopUp/StayUpdated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import MainAccountPopup from "@/components/PopUp/MainAccountPopup";
import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";
import { BlurView } from "@react-native-community/blur";
import OnRampModal from "@/components/PopUp/OnRampModal";
import TransactionValidationModal from "@/components/PopUp/TransactionValidationModal";
import InvestmentAccountPopup from "@/components/PopUp/InvestmentAccountPopup";
import InvestmentCard from "@/components/InvestmentCard/InvestmentCard";
import withFadeIn from "@/components/effects/withFadeIn";
import TransactionPOC from "@/components/Homepage/TransactionsPOC";

function HomeScreen() {
  const account = useActiveAccount();
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState<string>("$");
  const [eurBalance, setEurBalance] = useState<number>(0);
  const [usdBalance, setUsdBalance] = useState<number>(0);
  const [mainAccountBalance, setMainAccountBalance] = useState<string>("0.00");
  const [asset, setAsset] = useState<string>("");

  // New state variables for transaction handling
  const [pendingTransaction, setPendingTransaction] = useState<{
    investmentType: string;
    amount: number;
    action: "deposit" | "withdraw";
  } | null>(null);
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);

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
    isBlurred,
    setIsBlurred,
    setIsModalOpen,
    isValidationModalOpen,
    setIsValidationModalOpen,
    isOffRamp,
    setIsOffRamp,
  } = useStayUpdatedModalContext();

  const stayUpdatedModalRef = useRef(null);
  const currentAccountModalRef = useRef(null);
  const investmentAccountModalRef = useRef(null);
  const onRampModalRef = useRef(null);

  // Modal handling

  const handleOpenModal = (ref: any) => {
    ref?.current?.present();
    setIsModalOpen(true);
    setIsBlurred(true);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

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

        if (!eurBalance) {
          await AsyncStorage.setItem("investment_account_balance_eur", "0");
          eurBalance = "0";
        }
        if (!usdBalance) {
          await AsyncStorage.setItem("investment_account_balance_usd", "0");
          usdBalance = "0";
        }

        setEurBalance(parseFloat(eurBalance));
        setUsdBalance(parseFloat(usdBalance));
      } catch (error) {
        console.error("Error fetching investment balances:", error);
      }
    };

    fetchInvestmentBalances();
  }, []);

  useEffect(() => {
    const fetchBalanceWithConversion = async () => {
      if (data != undefined) {
        console.log("New balance", data);
        let balance = parseFloat(data?.displayValue) || 0;
        if (currency === "€") {
          const conversionRate = await getConversionRate();
          if (conversionRate) {
            balance *= conversionRate; // Convert USD to EUR
          }
        }
        setMainAccountBalance((balance - eurBalance - usdBalance).toFixed(2));
      }
    };

    fetchBalanceWithConversion();
  }, [currency, data, eurBalance, usdBalance]);

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const hasSeenStayUpdated =
          await AsyncStorage.getItem("hasSeenStayUpdated");
        if (!hasSeenStayUpdated) {
          //@ts-ignore
          stayUpdatedModalRef.current?.present();
          setIsModalOpen(true);
          setIsBlurred(true); // Enable blur when modal is open
          await AsyncStorage.setItem("hasSeenStayUpdated", "true");
        }
      } catch (error) {
        console.error("Error checking first visit:", error);
      }
    };

    checkFirstVisit();
  }, []);

  useEffect(() => {
    if (isCheckoutModalOpen || isValidationModalOpen) {
      //@ts-ignore
      onRampModalRef.current?.present();
      setIsBlurred(true); // Enable blur when modal is open
    }
  }, [isCheckoutModalOpen]);

  // Handler for initiating transactions
  const handleInitiateTransaction = (transactionDetails: {
    investmentType: string;
    amount: number;
    action: "deposit" | "withdraw";
  }) => {
    setPendingTransaction(transactionDetails);
    setIsBlurred(true);
    setIsTransactionModalVisible(true);
  };

  // Handler for confirming transactions
  const handleConfirmTransaction = async (confirmed: boolean) => {
    setIsTransactionModalVisible(false);
    setIsBlurred(false);

    if (confirmed && pendingTransaction) {
      const { investmentType, amount, action } = pendingTransaction;

      // Execute the transaction logic
      if (investmentType === "EURO") {
        if (action === "deposit") {
          // Update EUR balance
          const newEurBalance = eurBalance + amount;
          setEurBalance(newEurBalance);
          await AsyncStorage.setItem(
            "investment_account_balance_eur",
            newEurBalance.toString()
          );
        } else if (action === "withdraw") {
          // Ensure sufficient balance
          if (eurBalance >= amount) {
            const newEurBalance = eurBalance - amount;
            setEurBalance(newEurBalance);
            await AsyncStorage.setItem(
              "investment_account_balance_eur",
              newEurBalance.toString()
            );
          } else {
            // Handle insufficient balance
            Alert.alert(
              "Insufficient Balance",
              "You do not have enough EUR balance to withdraw this amount."
            );
          }
        }
      } else if (investmentType === "DOLLAR US") {
        if (action === "deposit") {
          // Update USD balance
          const newUsdBalance = usdBalance + amount;
          setUsdBalance(newUsdBalance);
          await AsyncStorage.setItem(
            "investment_account_balance_usd",
            newUsdBalance.toString()
          );
        } else if (action === "withdraw") {
          // Ensure sufficient balance
          if (usdBalance >= amount) {
            const newUsdBalance = usdBalance - amount;
            setUsdBalance(newUsdBalance);
            await AsyncStorage.setItem(
              "investment_account_balance_usd",
              newUsdBalance.toString()
            );
          } else {
            // Handle insufficient balance
            Alert.alert(
              "Insufficient Balance",
              "You do not have enough USD balance to withdraw this amount."
            );
          }
        }
      }
      // Reset pending transaction
      setPendingTransaction(null);
    } else {
      // Transaction canceled, reset pending transaction
      setPendingTransaction(null);
    }
  };

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
              main_account_balance={mainAccountBalance}
              investment_account_balance={(eurBalance + usdBalance).toFixed(2)}
              total_balance={(
                parseFloat(mainAccountBalance) +
                eurBalance +
                usdBalance
              ).toFixed(2)}
            />

            <MainAccount
              currency={currency}
              main_account_balance={mainAccountBalance}
              ref={onRampModalRef}
              setIsModalOpen={setIsCheckoutModalOpen}
              setBlurred={setIsBlurred}
              handleOpenModal={() => handleOpenModal(currentAccountModalRef)}
              setIsOffRamp={setIsOffRamp}
            />
            <InvestmentAccount
              currency={currency}
              investment_account_balance={(eurBalance + usdBalance).toFixed(2)}
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
              <InvestmentCard
                investment="DOLLAR US"
                investing
                main_account_balance={mainAccountBalance}
                eurBalance={eurBalance}
                usdBalance={usdBalance}
                setEurBalance={setEurBalance}
                setUsdBalance={setUsdBalance}
                setAsset={setAsset}
                handleOpenModal={() =>
                  handleOpenModal(investmentAccountModalRef)
                }
                onInitiateTransaction={handleInitiateTransaction}
                setIsValidationModalOpen={setIsValidationModalOpen}
              />
              <InvestmentCard
                investment="EURO"
                investing
                main_account_balance={mainAccountBalance}
                eurBalance={eurBalance}
                usdBalance={usdBalance}
                setEurBalance={setEurBalance}
                setUsdBalance={setUsdBalance}
                setAsset={setAsset}
                handleOpenModal={() =>
                  handleOpenModal(investmentAccountModalRef)
                }
                onInitiateTransaction={handleInitiateTransaction}
                setIsValidationModalOpen={setIsValidationModalOpen}
              />
            </View>
            <TransactionHistory
              refetchBalance={refetch}
              currency={currency}
              getConversionRate={getConversionRate}
            />
            <View style={{ marginTop: 50, marginBottom: 150 }}>
              <TransactionPOC account={account} refetch={refetch} />
            </View>
          </ScrollView>
          <MainAccountPopup
            ref={currentAccountModalRef}
            setIsModalOpen={setIsModalOpen}
            setBlurred={setIsBlurred}
          />
          <InvestmentAccountPopup
            ref={investmentAccountModalRef}
            setIsModalOpen={setIsModalOpen}
            setBlurred={setIsBlurred}
            asset={asset}
          />
          <StayUpdated
            ref={stayUpdatedModalRef}
            setIsModalOpen={setIsModalOpen}
            setBlurred={setIsBlurred}
          />
          <OnRampModal
            ref={onRampModalRef}
            setIsModalOpen={setIsCheckoutModalOpen}
            setBlurred={setIsBlurred}
            account={account}
            isOffRamp={isOffRamp}
            currency={currency}
            mainAccountBalance={mainAccountBalance}
          />
          {/* Transaction Validation Modal */}
          <TransactionValidationModal
            isVisible={isTransactionModalVisible}
            onConfirm={handleConfirmTransaction}
            transactionDetails={pendingTransaction}
            setIsValidationModalOpen={setIsValidationModalOpen}
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
const EnhancedHomeScreen = withFadeIn(HomeScreen);

export default process.env.EXPO_PUBLIC_IS_DEVELOPMENT
  ? HomeScreen
  : EnhancedHomeScreen;

// Function to get conversion rate (Place this at the bottom of the file)
async function getConversionRate() {
  try {
    // Primary API - Frankfurter
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=EUR"
    );
    const data = await response.json();
    return data.rates.EUR;
  } catch (error) {
    console.error("Frankfurter API failed, trying fallback:", error);

    // Fallback API - FreeCurrencyAPI
    try {
      const response = await fetch(
        "https://api.freecurrencyapi.com/v1/latest?base_currency=USD&apikey=YOUR_API_KEY"
      );
      const data = await response.json();
      return data.data.EUR;
    } catch (fallbackError) {
      console.error("Fallback API failed:", fallbackError);
      return null;
    }
  }
}
