import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import {
  getIconSource,
  getCurrencySymbol,
  gainContainerStyle,
} from "./StyleFunctions";
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // State for the amount entered in the TextInput
  const [amount, setAmount] = useState<string>("");

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Image
          style={styles.euroIcon}
          source={getIconSource(investing, investment)}
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
              value={amount} // Bind the state to the TextInput
              onChangeText={(text) => setAmount(text)} // Update the state on text change
            />
          </View>
          <Text style={styles.asideInputText}>
            {getCurrencySymbol(investing, investment)}
          </Text>
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
          const isValidAmount = (value: string) => {
            const num = parseInt(value, 10);
            return !isNaN(num) && num > 0 && Number.isInteger(num);
          };

          if (!isValidAmount(amount)) {
            console.error("Invalid amount. Please enter an integer greater than 0.");
            return;
          }

          try {
            await AsyncStorage.setItem("onboardingValue", amount);
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
            pathname: "/(onboarding)/onboarding_2",
          });
        }}>
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
