import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

// Define the props interface
interface InvestmentCardProps {
  investment: string; // or any other type that suits your need
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Image
          style={styles.dollarIcon}
          source={require("@/assets/images/dollar-icon.png")}
        />
        <Text style={styles.headerText}>
          {t("components.investment_card.investment")} {investment} :{" "}
          <Text style={styles.headerAmount}>0 €*</Text>
        </Text>
      </View>

      <View style={styles.flexContainer}>
        <View style={styles.flexInputContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="0"
              placeholderTextColor="rgba(19, 41, 61, 0.60)"
            />
          </View>
          <Image
            style={styles.euroIcon}
            source={require("@/assets/images/euro-icon.png")}
          />
        </View>
        <View style={styles.gain}>
          <Text style={styles.rendementText}>
            {t("components.investment_card.yield")} :
          </Text>
          <Text style={styles.rendementValue}>7,85 %</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonContainer}>
        <Image
          source={require("@/assets/images/button-shape.png")}
          style={styles.buttonImage}
        />
        <Text style={styles.depositButtonText}>
          {t("components.investment_card.deposit")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#13293D",
    borderRadius: 30,
    padding: 20,
    width: "100%",
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    marginBottom: -3,
  },
  headerAmount: {
    color: "#ECFF78",
    fontFamily: "Poppins_700Bold",
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    gap: 28,
  },
  flexInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: 140,
    justifyContent: "center",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 20,
  },
  input: {
    fontSize: 20,
    color: "#13293D",
    fontFamily: "Poppins_600SemiBold",
    paddingHorizontal: 20,
    marginBottom: -5,
    height: "100%",
    lineHeight: 20,
    flex: 1,
  },
  euroIcon: {
    height: 24,
    width: 24,
    marginLeft: 10,
  },
  gain: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  rendementText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
  rendementValue: {
    fontFamily: "Poppins_500Medium",
    color: "#ECFF78",
    fontSize: 18,
  },
  buttonContainer: {
    position: "relative",
    width: "100%",
    height: 60, // Match the height of your image
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  depositButtonText: {
    position: "absolute", // Overlay the text on top of the image
    color: "#13293D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    left: 100, // Adjust this value to position the text towards the left
    textAlign: "left", // Ensure the text aligns to the left
  },
  arrowIcon: {
    marginLeft: 10,
    height: 20,
    width: 20,
  },
  dollarIcon: {
    height: 26,
    width: 26,
  },
});

export default InvestmentCard;
