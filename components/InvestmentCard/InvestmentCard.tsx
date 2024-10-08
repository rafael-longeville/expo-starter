// InvestmentCard.tsx

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { styles } from "./styles";
import {
  getIconSource,
  getCurrencySymbol,
  gainContainerStyle,
} from "./StyleFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalFonts } from "@/app/styles/globalFonts";
import { useTyping } from "@/context/TypingContext";

interface InvestmentCardProps {
  investment: string;
  investing: boolean;
  main_account_balance: string;
  eurBalance: number;
  setEurBalance: (balance: number) => void;
  usdBalance: number;
  setUsdBalance: (balance: number) => void;
  handleOpenModal: () => void;
  setAsset: (asset: string) => void;
  onInitiateTransaction: (transactionDetails: {
    investmentType: string;
    amount: number;
    action: "deposit" | "withdraw";
  }) => void;
  setIsValidationModalOpen: (isOpen: boolean) => void;
}

const InvestmentCard = ({
  investment,
  investing,
  main_account_balance,
  eurBalance,
  setEurBalance,
  usdBalance,
  setUsdBalance,
  handleOpenModal,
  setAsset,
  onInitiateTransaction,
  setIsValidationModalOpen,
}: InvestmentCardProps) => {
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

  const handleDeposit = () => {
    const numericAmount = parseAmount(amount);
    if (numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a number greater than 0.");
      return;
    }

    // Check if user has enough balance
    if (parseFloat(main_account_balance) < numericAmount) {
      Alert.alert(
        "Insufficient Balance",
        "You do not have enough balance in your main account."
      );
      return;
    }
    setIsValidationModalOpen(true);
    onInitiateTransaction({
      investmentType: investment,
      amount: numericAmount,
      action: "deposit",
    });
  };

  const handleWithdraw = () => {
    const numericAmount = parseAmount(amount);
    if (numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a number greater than 0.");
      return;
    }
    setIsValidationModalOpen(true);

    onInitiateTransaction({
      investmentType: investment,
      amount: numericAmount,
      action: "withdraw",
    });
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
          <Text style={styles.headerText}>
            {investing ? "CR" : "CC"} - {investment}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setAsset(investment);
            handleOpenModal();
          }}
        >
          <Image
            source={require("@/assets/images/info-icon.png")}
            style={{
              width: 20,
              height: 20,
              marginRight: 20,
            }}
          />
        </Pressable>
      </View>

      {(investment === "EURO" && eurBalance > 0) ||
      (investment === "DOLLAR US" && usdBalance > 0) ? (
        <View style={styles.flexContainer}>
          <Text
            style={{
              ...globalFonts.mediumSubtitle,
              color: "#ECFF78",
              includeFontPadding: false,
              marginLeft: 20,
            }}
          >
            {investment === "EURO" ? `${eurBalance} €` : `${usdBalance} $`}
          </Text>
        </View>
      ) : null}

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

      {(investment === "EURO" && eurBalance > 0) ||
      (investment === "DOLLAR US" && usdBalance > 0) ? (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 10,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={styles.buttonContainer2}
            activeOpacity={0.6}
            onPress={handleWithdraw}
          >
            <Image
              source={require("@/assets/images/small-withdraw-button-shape.png")}
              style={styles.buttonImage}
            />
            <Text style={styles.withdrawButtonText}>
              {t("components.investment_card.withdraw")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer2}
            activeOpacity={0.6}
            onPress={handleDeposit}
          >
            <Image
              source={require("@/assets/images/small-deposit-button-shape.png")}
              style={styles.buttonImage}
            />
            <Text style={styles.depositButtonText2}>
              {t("components.investment_card.deposit")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
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
      )}
    </View>
  );
};

export default InvestmentCard;
