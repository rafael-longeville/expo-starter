import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { WebView } from 'react-native-webview';
import { globalFonts } from "../styles/globalFonts";
import {
  useActiveAccount,
} from "thirdweb/react";

const Onboarding3: React.FC = () => {
  const account = useActiveAccount();
  if(account) {
    console.log(account.address)
  }
  return (
    <View style={styles.container}>
      <View style={styles.containercompte}>
        <Image source={require('@/assets/images/lock-icon.png')} style={styles.icon} />
        <Text style={styles.textcompte}>
          <Text style={globalFonts.whiteSubtitle}>Compte DOLLAR US :</Text>
          <Text style={styles.amount}> 0 €*</Text>
        </Text>
      </View>
      <Text style={globalFonts.title}>Alimentez votre compte</Text>
      <Text style={globalFonts.subtitle}>
        Placez vos fonds dans un des compte rémunéré via carte bancaire, Apple Pay ou Google Pay.
      </Text>
      {account?.address && <WebView
        style={styles.webview}
        source={{ uri: 'https://global-stg.transak.com/?apiKey=ec807ee4-b564-4b2a-af55-92a8adfe619b&network=arbitrum&paymentMethod=credit_debit_card&visaMasterCard=true&defaultCryptoCurrency=USDC&productsAvailed=BUY&walletAddress=' + account.address }}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  webview: {
    marginTop: 20,
    width: "100%",
    height: 800,
  },
  containercompte: {
    height: 60,
    borderRadius: 30,
    width: '100%',
    backgroundColor: '#13293D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20, // Adjust padding to the left as needed
    marginBottom: 30
  },
  icon: {
    marginRight: 10, // Add some margin between icon and text
  },
  textcompte: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Poppins',
  },
  amount: {
    color: '#ECFF78',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
});

export default Onboarding3;
