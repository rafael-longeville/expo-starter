import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";

const Onboarding7: React.FC = () => {
  //   // const account = useActiveAccount();

  return (
    <View>
      <Text
        style={{
          ...globalFonts.bigTitle,
          ...styles.title,
        }}
      >
        Page d'attente
      </Text>
      <View style={styles.descriptionContainer}>
        <Text
          style={{
            ...globalFonts.subtitle,
            fontSize: scaledFontSize(20),
            textAlign: "left",
          }}
        >
          Veuillez patienter pendant que nous vérifions votre compte
        </Text>
        <Text
          style={{
            ...globalFonts.disclaimerText,
            fontSize: scaledFontSize(16),
            textAlign: "left",
          }}
        >
          Vous allez être redirigé vers la page d'accueil, merci de votre
          patience, vous êtes bientôt prêt à utiliser votre compte. Nous faisons
          de notre mieux pour vous connecter le plus rapidement à votre compte
          IBEx Wallet
        </Text>
      </View>
      <View style={styles.socialsContainer}>
        <Image
          source={require("@/assets/images/onboarding/7/website.png")}
          style={styles.image}
        />
        <Image
          source={require("@/assets/images/onboarding/7/telegram.png")}
          style={styles.image}
        />
        <Image
          source={require("@/assets/images/onboarding/7/twitter.png")}
          style={styles.image}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionContainer: {
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "center",
    gap: 15,
  },
  socialsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 60,
  },
  image: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: scaledFontSize(22),
    textAlign: "center",
  },
});

export default Onboarding7;
