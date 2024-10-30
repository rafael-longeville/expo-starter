import AsyncStorage from "@react-native-async-storage/async-storage";
import { ViewStyle } from "react-native";

// Function to determine the icon source
export const getIconSource = (investing: boolean, investment: string) => {
  if (investing === false) {
    return require("@/assets/images/lock-icon.png");
  }
  return investment === "DOLLAR US"
    ? require("@/assets/images/dollar-icon.png")
    : require("@/assets/images/euro-icon.png");
};

// Function to determine the currency symbol
export const getCurrencySymbol = async () => {
  try {
    const storedCurrency = await AsyncStorage.getItem("selectedCurrency");
    if (storedCurrency === "euro") {
      return "€";
    } else if (storedCurrency === "dollar") {
      return "$";
    } else {
      // Default to Euro if no currency is set
      return "€";
    }
  } catch (error) {
    console.error("Error retrieving currency from AsyncStorage:", error);
    // Default to Euro in case of error
    return "€";
  }
};

// Optionally, you can also export custom styles if needed
// For example:
export const gainContainerStyle = (investing: boolean): ViewStyle => ({
  display: investing === false ? "none" : "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});
