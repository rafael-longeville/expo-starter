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
export const getCurrencySymbol = (investing: boolean, investment: string) => {
  return investing === false || investment !== "DOLLAR US" ? "€" : "$";
};

// Optionally, you can also export custom styles if needed
// For example:
export const gainContainerStyle = (investing: boolean): ViewStyle => ({
  display: investing === false ? "none" : "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});
