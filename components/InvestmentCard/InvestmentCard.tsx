import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "./styles";
import {
  getIconSource,
  getCurrencySymbol,
  gainContainerStyle,
} from "./StyleFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { globalFonts } from "@/app/styles/globalFonts";
import { useTyping } from "@/context/TypingContext";

const InvestmentCard = forwardRef(
  (
    {
      investment,
      investing,
      isOnboarding,
      main_account_balance = "0",
      eurBalance,
      setEurBalance,
      usdBalance,
      setUsdBalance,
      handleOpenModal,
      setAsset,
      scrollViewRef,
    }: any,
    ref: any
  ) => {
    const { t } = useTranslation();
    const { setIsTyping, isTyping } = useTyping();

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
        {eurBalance != undefined &&
          !isOnboarding &&
          eurBalance > 0 &&
          investment === "EURO" && (
            <>
              <View style={styles.flexContainer}>
                <Text
                  style={{
                    ...globalFonts.mediumSubtitle,
                    color: "#ECFF78",
                    includeFontPadding: false,
                    marginLeft: 20,
                  }}
                >
                  {eurBalance} €
                </Text>
              </View>
            </>
          )}
        {usdBalance != undefined &&
          !isOnboarding &&
          usdBalance > 0 &&
          investment === "DOLLAR US" && (
            <>
              <View style={styles.flexContainer}>
                <Text
                  style={{
                    ...globalFonts.mediumSubtitle,
                    color: "#ECFF78",
                    includeFontPadding: false,
                    marginLeft: 20,
                  }}
                >
                  {usdBalance} $
                </Text>
              </View>
            </>
          )}

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
                onBlur={() => {
                  setIsTyping(false);
                }}
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
        {setEurBalance != undefined &&
        setUsdBalance != undefined &&
        eurBalance != undefined &&
        usdBalance != undefined &&
        !isOnboarding &&
        ((eurBalance > 0 && investment === "EURO") ||
          (usdBalance > 0 && investment === "DOLLAR US")) ? (
          <>
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
                onPress={async () => {
                  const numericAmount = parseAmount(amount); // Convert amount to number

                  if (numericAmount <= 0) {
                    console.error(
                      "Invalid amount. Please enter a number greater than 0."
                    );
                    return;
                  }

                  //EURO
                  if (investing === true && investment === "EURO") {
                    let newEurBalance = eurBalance - numericAmount;
                    if (newEurBalance < 0) {
                      console.error("Amount too high.");
                      return;
                    }
                    setEurBalance(newEurBalance);
                    await AsyncStorage.setItem(
                      "investment_account_balance_eur",
                      newEurBalance.toString()
                    );
                  }
                  //DOLLAR US
                  if (investing === true && investment === "DOLLAR US") {
                    let newUsdBalance = usdBalance - numericAmount;
                    if (newUsdBalance < 0) {
                      console.error("Amount too high.");
                      return;
                    }
                    setUsdBalance(newUsdBalance);
                    await AsyncStorage.setItem(
                      "investment_account_balance_usd",
                      newUsdBalance.toString()
                    );
                  }
                }}
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
                onPress={async () => {
                  const numericAmount = parseAmount(amount); // Convert amount to number

                  if (numericAmount <= 0) {
                    console.error(
                      "Invalid amount. Please enter a number greater than 0."
                    );
                    return;
                  }

                  if (parseFloat(main_account_balance) < parseFloat(amount)) {
                    console.error("Amount too high.");
                    return;
                  }
                  //EURO
                  if (investing === true && investment === "EURO") {
                    let newEurBalance = eurBalance + numericAmount;
                    setEurBalance(newEurBalance);
                    await AsyncStorage.setItem(
                      "investment_account_balance_eur",
                      newEurBalance.toString()
                    );
                  }
                  //DOLLAR US
                  if (investing === true && investment === "DOLLAR US") {
                    let newUsdBalance = usdBalance + numericAmount;
                    setUsdBalance(newUsdBalance);
                    await AsyncStorage.setItem(
                      "investment_account_balance_usd",
                      newUsdBalance.toString()
                    );
                  }
                }}
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
          </>
        ) : (
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

              if (numericAmount < 5 || numericAmount > 100) {
                Alert.alert(
                  t("components.investment_card.amount_error.title"),
                  t("components.investment_card.amount_error.message")
                );
                return;
              }
              if (isOnboarding) {
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
              } else if (
                eurBalance != undefined &&
                setEurBalance != undefined &&
                usdBalance != undefined &&
                setUsdBalance != undefined
              ) {
                if (numericAmount <= 0) {
                  console.error(
                    "Invalid amount. Please enter a number greater than 0."
                  );
                  return;
                }

                if (parseFloat(main_account_balance) < parseFloat(amount)) {
                  console.error("Amount too high.");
                  return;
                }
                //EURO
                if (investing === true && investment === "EURO") {
                  let newEurBalance = eurBalance + numericAmount;
                  setEurBalance(newEurBalance);
                  await AsyncStorage.setItem(
                    "investment_account_balance_eur",
                    newEurBalance.toString()
                  );
                }
                //DOLLAR US
                if (investing === true && investment === "DOLLAR US") {
                  let newUsdBalance = usdBalance + numericAmount;
                  setUsdBalance(newUsdBalance);
                  await AsyncStorage.setItem(
                    "investment_account_balance_usd",
                    newUsdBalance.toString()
                  );
                }
              }
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
        )}
      </View>
    );
  }
);

export default InvestmentCard;
