import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import {
  getIconSource,
  getCurrencySymbol,
  gainContainerStyle,
} from "./StyleFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Define the props interface
interface InvestmentCardProps {
  investment: string;
  investing?: boolean;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  investing = false, // Default value for investing
}) => {
  const { t } = useTranslation();

  // State for the currency symbol and amount entered in the TextInput
  const [currencySymbol, setCurrencySymbol] = useState<string>("€");
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    const fetchCurrencySymbol = async () => {
      const symbol = await getCurrencySymbol();
      setCurrencySymbol(symbol);
    };

    fetchCurrencySymbol();
  }, []);

  const parseAmount = (value: string): number => {
    // Replace comma with a dot and parse to a floating-point number
    const parsedValue = parseFloat(value.replace(",", "."));
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  return (
    <View style={styles.cardContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={styles.header}>
          <Image
            style={styles.euroIcon}
            source={getIconSource(investing, investment)}
          />
          <Text style={styles.headerText}>{investment}</Text>
        </View>
        <Image source={require("@/assets/images/info-icon.png")} />
      </View>

      <View style={styles.flexContainer}>
        <View style={styles.flexInputContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="0"
              placeholderTextColor="rgba(19, 41, 61, 0.60)"
              value={amount} // Bind the state to the TextInput
              onChangeText={(text) => setAmount(text)} // Update the state on text change
            />
          </View>
          <Text style={styles.asideInputText}>{currencySymbol}</Text>
        </View>
        <View style={gainContainerStyle(investing)}>
          <Text style={styles.rendementText}>
            {t("components.investment_card.yield")} :
          </Text>
          <Text style={styles.rendementValue}>7,85 %</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        activeOpacity={0.6}
        onPress={async () => {
          const numericAmount = parseAmount(amount); // Convert amount to number

          if (numericAmount <= 0) {
            console.error(
              "Invalid amount. Please enter a number greater than 0."
            );
            return;
          }

          try {
            await AsyncStorage.setItem(
              "onboardingValue",
              numericAmount.toString()
            );
          } catch (error) {
            console.error("Error storing data: ", error);
          }

          if (investing === true && investment === "DOLLAR US") {
            try {
              await AsyncStorage.setItem("onboardingMethod", "angleUSD");
            } catch (error) {
              console.error("Error storing data: ", error);
            }
          } else if (investing === true && investment === "EURO") {
            try {
              await AsyncStorage.setItem("onboardingMethod", "angleEUR");
            } catch (error) {
              console.error("Error storing data: ", error);
            }
          } else {
            try {
              await AsyncStorage.setItem("onboardingMethod", "onRamp");
            } catch (error) {
              console.error("Error storing data: ", error);
            }
          }
          router.push({
            pathname: "/(onboarding)/onboarding_3",
          });
        }}
      >
        <Image
          source={require("@/assets/images/deposit-button-shape.png")}
          style={styles.buttonImage}
        />
        <Text style={styles.depositButtonText}>
          {t("components.investment_card.deposit")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InvestmentCard;
