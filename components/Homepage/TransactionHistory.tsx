import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { shortenHex } from "thirdweb/utils";
import { globalFonts } from "@/app/styles/globalFonts";
import moment from "moment"; // Import moment.js for date formatting

// Step 1: Set up Apollo Client
const client = new ApolloClient({
  uri: "https://cyxmcvdjccisnvnhnrvc.hasura.eu-central-1.nhost.run/v1/graphql",
  cache: new InMemoryCache(),
});

// Step 2: Create GraphQL Query
const GET_TRANSACTIONS = gql`
  query GetTransactions($excludedStatus: String!) {
    transaction(where: { transaction_status: { _neq: $excludedStatus } }) {
      id
      transaction_type
      transaction_amount
      wallet_address
      transaction_method
      transaction_status
      transaction_created_at
    }
  }
`;

function TransactionHistoryComponent() {
  const { t } = useTranslation();

  // Step 3: Fetch transactions using the useQuery hook with pollInterval for auto refetch
  const { loading, error, data, refetch } = useQuery(GET_TRANSACTIONS, {
    variables: { excludedStatus: "AWAITING_PAYMENT_FROM_USER " }, // Exclude cancelled transactions
    client,
    pollInterval: 10000, // Set poll interval to 10 seconds (10000 milliseconds)
  });

  useEffect(() => {
    if (data) {
      console.log("Fetched Transactions: ", data.transaction);
    }
  }, [data]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading transactions.</Text>;

  // Use fetched transactions instead of static history
  const transactions = data.transaction.map((item: any) => {
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
      amount: item.transaction_amount.toFixed(2),
      txId: shortenHex(item.wallet_address), // Assuming wallet_address serves as a transaction ID
    };
  });

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <Text style={globalFonts.mediumSubtitle}>
          {t("pages.home.transactions.title")}
        </Text>
        <Image
          source={require("@/assets/images/info-icon.png")}
          style={{
            marginBottom: 5,
          }}
        />
      </View>

      {/* Display fetched transactions */}
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
            marginBottom: 12,
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
                <Text style={styles.amount}>{item.amount} €*</Text>
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
                  <Text style={{ ...styles.secondRowText, fontSize: 12 }}>
                    ID: {item.txId}
                  </Text>
                  <Image source={require("@/assets/images/tx-copy-icon.png")} />
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
            style={{
              marginBottom: 3,
            }}
          />
          <Text style={styles.secondRowText}>
            {t("pages.home.transactions.seeAll")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Step 4: Define the styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  topRowText: {
    color: "#AFC0FF",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },
  secondRowText: {
    color: "#13293D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  amount: {
    color: "#13293D",
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 25,
  },
});

// Step 5: Wrap the component in ApolloProvider and export
export default function App() {
  return (
    <ApolloProvider client={client}>
      <TransactionHistoryComponent />
    </ApolloProvider>
  );
}
