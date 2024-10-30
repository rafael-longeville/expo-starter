// OnboardingInvestmentCard.tsx

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  LayoutChangeEvent,
} from "react-native";
import { styles } from "./styles";
import {
  getIconSource,
  getCurrencySymbol,
  gainContainerStyle,
} from "./StyleFunctions";
import { globalFonts } from "@/app/styles/globalFonts";
import { useTyping } from "@/context/TypingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

interface OnboardingInvestmentCardProps {
  investment: string;
  investing: boolean;
  scrollViewRef: React.RefObject<any>;
  onFocusInput: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

const OnboardingInvestmentCard = ({
  investment,
  investing,
  scrollViewRef,
  onFocusInput,
  onLayout,
}: OnboardingInvestmentCardProps) => {
  const { t } = useTranslation();
  const { setIsTyping } = useTyping();

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

  const handleDeposit = async () => {
    const numericAmount = parseAmount(amount); // Convert amount to number

    if (numericAmount <= 0) {
      console.error("Invalid amount. Please enter a number greater than 0.");
      return;
    }

    if (numericAmount < 5 || numericAmount > 100) {
      Alert.alert(
        "Montant incorrect",
        "Veuillez entrer un montant entre 5 et 100."
      );
      return;
    }

    // Store the data in AsyncStorage
    try {
      await AsyncStorage.setItem("onboardingValue", numericAmount.toString());
    } catch (error) {
      console.error("Error storing data: ", error);
    }

    if (investing === true && investment === "DOLLAR US") {
      try {
        await AsyncStorage.setItem("onboardingMethod", "angleUSD");
        await AsyncStorage.setItem("continueWithoutFunding", "false");
        console.log(
          "onboardingMethod: ",
          AsyncStorage.getItem("onboardingMethod")
        );
      } catch (error) {
        console.error("Error storing data: ", error);
      }
    } else if (investing === true && investment === "EURO") {
      try {
        await AsyncStorage.setItem("onboardingMethod", "angleEUR");
        await AsyncStorage.setItem("continueWithoutFunding", "false");
      } catch (error) {
        console.error("Error storing data: ", error);
      }
    } else {
      try {
        await AsyncStorage.setItem("onboardingMethod", "onRamp");
        await AsyncStorage.setItem("continueWithoutFunding", "false");
      } catch (error) {
        console.error("Error storing data: ", error);
      }
    }

    router.push({
      pathname: "/(onboarding)/onboarding_3",
    });
  };

  return (
    <View style={styles.cardContainer} onLayout={onLayout}>
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
          <Text style={styles.headerText}>
            {investing ? "CR" : "CC"} - {investment}
          </Text>
        </View>
        {/* No need for the info icon and modal in onboarding */}
      </View>

      <View style={styles.flexContainer}>
        <View style={styles.flexInputContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="0"
              placeholderTextColor="rgba(19, 41, 61, 0.60)"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
              }}
              onFocus={() => {
                setIsTyping(true);
                onFocusInput(); // Scroll to the card when input is focused
              }}
              onBlur={() => setIsTyping(false)}
            />
          </View>
          <Text style={[styles.asideInputText]}>{currencySymbol}</Text>
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
        onPress={handleDeposit}
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

export default OnboardingInvestmentCard;
