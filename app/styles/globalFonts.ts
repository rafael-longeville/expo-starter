import { StyleSheet, Dimensions } from "react-native";
import "@expo-google-fonts/poppins";

// Utility function to scale fonts based on screen size
const { width, height } = Dimensions.get("window");
const scale = width / 375; // Base screen width, typically iPhone 6/7/8

const scaledFontSize = (size: number) => size * scale;

export const globalFonts = StyleSheet.create({
  bigNumber: {
    fontFamily: "Poppins_700Bold",
    fontSize: scaledFontSize(40),
    color: "#13293D",
    lineHeight: scaledFontSize(50),
  },
  bigNumberSemi: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: scaledFontSize(40),
    color: "#13293D",
    lineHeight: scaledFontSize(50),
  },
  bigTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: scaledFontSize(32),
    color: "#13293D",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: scaledFontSize(22),
    color: "#13293D",
  },
  mediumTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: scaledFontSize(22),
    color: "#13293D",
  },
  mediumSubtitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: scaledFontSize(18),
    color: "#13293D",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: scaledFontSize(16),
    color: "#13293D",
  },
  whiteSubtitle: {
    fontSize: scaledFontSize(16),
    color: "white",
    fontFamily: "Poppins_400Regular",
  },
  disclaimerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: scaledFontSize(12),
    color: "rgba(19, 41, 61, 0.70)",
    textAlign: "center",
  },
});
