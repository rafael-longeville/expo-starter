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

export default function HomeScreen() {
  const account = useActiveAccount();
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState<string>("$");

  const { data, refetch } = useWalletBalance({
    chain: chain,
    address: account?.address,
    client,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const stayUpdatedModalRef = useRef<BottomSheetModal>(null);
  const mainAccountModalRef = useRef<BottomSheetModal>(null);

  const { setIsModalOpen, isModalOpen } = useStayUpdatedModalContext();

  const handleMainAccountModalPress = useCallback(() => {
    mainAccountModalRef.current?.present();
  }, []);

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
            <AccountDetails currency={currency} />
            <MainAccount currency={currency} />
            <Pressable
              onPress={() => {
                stayUpdatedModalRef.current?.present();
                setIsModalOpen(true);
                console.log("Stay Updated Modal Opened", isModalOpen);
              }}
            >
              <Text>Open Stay Updated Modal</Text>
            </Pressable>
            <InvestmentAccount currency={currency} />
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
          <StayUpdated ref={stayUpdatedModalRef} />
          <TransactionPOC account={account} refetch={refetch} />
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
