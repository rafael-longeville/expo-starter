import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import { useRouter } from "expo-router";

const Onboarding7: React.FC = () => {
  const router = useRouter();

  const handlePress = (type: string) => () => {
    switch (type) {
      case "website":
        router.push("https://moncomptesouverain.fr/");
        break;
      case "telegram":
        router.push("https://t.me/inblocksexchange");
        break;
      case "twitter":
        router.push("https://x.com/ibex_official");
        break;
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        flex: 1,
        alignItems: "center",
        marginTop: 40,
      }}
    >
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
        <Pressable onPress={handlePress("website")} style={styles.shadow}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("@/assets/images/onboarding/7/website.png")}
              style={styles.image}
            />
          </View>
        </Pressable>

        <Pressable onPress={handlePress("telegram")} style={styles.shadow}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("@/assets/images/onboarding/7/telegram.png")}
              style={styles.image}
            />
          </View>
        </Pressable>

        <Pressable onPress={handlePress("twitter")} style={styles.shadow}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("@/assets/images/onboarding/7/twitter.png")}
              style={styles.image}
            />
          </View>
        </Pressable>
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
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 }, // Moves the shadow downwards
    shadowOpacity: 0.3, // Increase opacity for a more pronounced shadow
    shadowRadius: 8, // Increase radius for a softer, more diffuse shadow
    elevation: 10, // Matches shadow on Android
    borderRadius: 10, // Ensures rounded shadow if desired
  },
  imageWrapper: {
    padding: 5, // Adds space around the image to prevent clipping of the shadow
    borderRadius: 10, // Matches shadow radius for a consistent look
  },
  image: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: scaledFontSize(22),
    textAlign: "center",
  },
});

export default Onboarding7;
