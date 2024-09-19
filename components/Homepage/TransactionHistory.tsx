import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { shortenHex } from "thirdweb/utils";
import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";
import moment from "moment"; // Import moment.js for date formatting
import { useActiveAccount } from "thirdweb/react"; // Import the useActiveAccount hook
import AsyncStorage from "@react-native-async-storage/async-storage";

// Step 1: Set up Apollo Client
const client = new ApolloClient({
  uri: "https://cyxmcvdjccisnvnhnrvc.hasura.eu-central-1.nhost.run/v1/graphql",
  cache: new InMemoryCache(),
});

// Step 2: Create GraphQL Query
const GET_TRANSACTIONS = gql`
  query GetTransactions($excludedStatus: String!, $walletAddress: String!) {
    transaction(
      where: {
        transaction_status: { _neq: $excludedStatus }
        wallet_address: { _eq: $walletAddress }
      }
    ) {
      id
      transaction_type
      transaction_amount
      wallet_address
      transaction_method
      transaction_status
      transaction_created_at
      transaction_hash
    }
  }
`;

function TransactionHistoryComponent({
  refetchBalance,
  currency,
  // getConversionRate,
}: any) {
  const { t } = useTranslation();
  const activeAccount = useActiveAccount(); // Get the active account
  // const [conversionRate, setConversionRate] = useState<number | null>(null);

  // Step 3: Fetch transactions using the useQuery hook with pollInterval for auto refetch
  const { loading, error, data, refetch } = useQuery(GET_TRANSACTIONS, {
    variables: {
      excludedStatus: "AWAITING_PAYMENT_FROM_USER",
      walletAddress: activeAccount?.address || "", // Use an empty string as a fallback
    },
    client,
    pollInterval: 10000, // Set poll interval to 10 seconds (10000 milliseconds)
    skip: !activeAccount?.address, // Skip the query if no active account address

    onError: (error) => {
      // Handle errors if necessary
      console.error("Error refetching query:", error);
    },
  });
  console.log("Transactions", data);

  // useEffect(() => {
  //   const fetchConversionRate = async () => {
  //     const rate = await getConversionRate();
  //     setConversionRate(rate);
  //   };
  //   fetchConversionRate();
  // }, [getConversionRate]);

  // Use fetched transactions instead of static history
  const transactions = data?.transaction.map((item: any) => {
    let from, to;

    if (item.transaction_type === "BUY") {
      from = "Carte de Crédit";
      to = "Compte Courant";
    } else if (item.transaction_type === "SELL") {
      from = "Compte Courant";
      to = "Carte de Crédit";
    } else {
      from = "Source"; // Placeholder; adjust based on actual logic if different
      to = item.transaction_method; // Assuming transaction_method is the destination
    }

    // Format the date to DD/MM/YYYY format
    const formattedDate = moment(item.transaction_created_at).format(
      "DD/MM/YYYY"
    );

    // Format the amount based on the selected currency
    const amount = item.transaction_amount.toFixed(2);

    return {
      id: item.id,
      date: formattedDate,
      status:
        item.transaction_status === "PENDING_DELIVERY_FROM_TRANSAK" ||
        item.transaction_status === "PROCESSING"
          ? "En cours"
          : item.transaction_status === "EXPIRED"
            ? "Echouée"
            : "Terminée",
      from,
      to,
      amount: `${amount} `,
      txId: shortenHex(item.transaction_hash || "0x0"),
      fullHash: item.transaction_hash
        ? "https://sepolia.arbiscan.io/tx/" + item.transaction_hash
        : "Transaction en attente.",
    };
  });

  useEffect(() => {
    const fetchNewBalance = async () => {
      try {
        await refetchBalance();
      } catch (error) {
        console.error("Error refetching balance:", error);
      }
    };
    fetchNewBalance();
  }, [transactions]);

  if (!activeAccount?.address) {
    return <View style={{ marginBottom: 120 }}></View>;
  }

  if (loading) return <Text>Loading...</Text>;
  if (!loading && error) return <Text>Error loading transactions.</Text>;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <Text style={globalFonts.mediumSubtitle}>
          {t("pages.home.transactions.title")}
        </Text>
      </View>

      {transactions.length > 0 ? (
        <>
          {transactions.map((item: any) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                backgroundColor: "rgba(216,226,225,.3)",
                paddingHorizontal: 25,
                paddingVertical: 15,
                borderRadius: 30,
                width: "100%",
                marginBottom: 8,
                marginTop: 8,
              }}
              key={item.id}
            >
              <View
                style={{
                  width: "100%",
                  paddingVertical: 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      gap: 2,
                      width: "40%",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.topRowText}>{item.date}</Text>
                    <Text style={styles.secondRowText}>{item.from}</Text>
                    <Text style={styles.amount}>{item.amount}</Text>
                  </View>
                  <Image
                    source={require("@/assets/images/tx-middle-icon.png")}
                    style={{ alignSelf: "flex-end" }}
                  />
                  <View
                    style={{
                      flexDirection: "column",
                      gap: 2,
                      width: "40%",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        ...styles.topRowText,
                        alignSelf: "flex-end",
                      }}
                    >
                      {item.status}
                    </Text>
                    <Text style={styles.secondRowText}>{item.to}</Text>
                    <View style={{ flexDirection: "row", gap: 2 }}>
                      {item.txId && (
                        <>
                          <Text
                            style={{
                              ...styles.secondRowText,
                              fontSize: scaledFontSize(12),
                            }}
                          >
                            ID: {item.txId}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              Clipboard.setString(item.fullHash);
                              Alert.alert(
                                t("pages.home.transactions.copied"),
                                t("pages.home.transactions.copied_link")
                              );
                            }}
                          >
                            <Image
                              source={require("@/assets/images/tx-copy-icon.png")}
                              style={{ width: 20, height: 20 }}
                            />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Image
                source={require("@/assets/images/tx-eye-icon.png")}
                style={{ marginBottom: 3 }}
              />
              <Text style={styles.secondRowText}>
                {t("pages.home.transactions.seeAll")}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <Text
            style={{
              ...globalFonts.disclaimerText,
              color: "#13293D",
              marginTop: 20,
            }}
            numberOfLines={4}
          >
            {t("pages.home.transactions.no_transactions_1")}
            {"\n"}
            {t("pages.home.transactions.no_transactions_2")}
          </Text>
        </View>
      )}
    </View>
  );
}

// Step 4: Define the styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 100,
  },
  topRowText: {
    color: "#AFC0FF",
    fontSize: scaledFontSize(12),
    fontFamily: "Poppins_600SemiBold",
  },
  secondRowText: {
    color: "#13293D",
    fontSize: scaledFontSize(14),
    fontFamily: "Poppins_500Medium",
  },
  amount: {
    color: "#13293D",
    fontSize: scaledFontSize(22),
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 25,
  },
});

// Step 5: Wrap the component in ApolloProvider and export
export default function TransactionHistory({
  refetchBalance,
  currency,
  getConversionRate,
}: any) {
  return (
    <ApolloProvider client={client}>
      <TransactionHistoryComponent
        refetchBalance={refetchBalance}
        currency={currency}
        getConversionRate={getConversionRate}
      />
    </ApolloProvider>
  );
}
