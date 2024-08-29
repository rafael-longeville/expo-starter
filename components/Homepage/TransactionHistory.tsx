import { globalFonts } from "@/app/styles/globalFonts";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { shortenHex } from "thirdweb/utils";

export default function TransactionHistory() {
  const { t } = useTranslation();

  const history = [
    {
      id: 1,
      date: "10/07/2O24",
      status: "En cours",
      from: "Placement EUR",
      to: "Compte courant",
      amount: "860,10",
      txId: shortenHex(
        "0x944196a0018793ddfe3d0b01ace032c187fab2cfd62da6b6fdf8f49c85356ebc"
      ),
    },
    {
      id: 2,
      date: "04/07/2O24",
      status: "En cours",
      from: "Compte courant",
      to: "Placement EUR",
      amount: "130,50",
      txId: shortenHex(
        "0x944196a0018793ddfe3d0b01ace032c187fab2cfd62da6b6fdf8f49c85356ebc"
      ),
    },
    {
      id: 3,
      date: "10/07/2O24",
      status: "En cours",
      from: "Google Pay",
      to: "Compte courant",
      amount: "100",
      txId: shortenHex(
        "0x944196a0018793ddfe3d0b01ace032c187fab2cfd62da6b6fdf8f49c85356ebc"
      ),
    },
  ];

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

      {/* Replace with async storage currency */}
      {history.map((item) => (
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
