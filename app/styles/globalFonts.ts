import { StyleSheet } from "react-native";
// Import poppins
import "@expo-google-fonts/poppins";

export const globalFonts = StyleSheet.create({
  bigNumber: {
    fontFamily: "Poppins_700Bold",
    fontSize: 40,
    color: "#13293D",
    lineHeight: 50,
  },
  bigNumberSemi: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 40,
    color: "#13293D",
    lineHeight: 50,
  },
  bigTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 32,
    color: "#13293D",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 22,
    color: "#13293D",
  },
  mediumSubtitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    color: "#13293D",
    // lineHeight: 25,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#13293D",
  },
  whiteSubtitle: {
    fontSize: 16,
    color: "white",
    fontFamily: "Poppins_400Regular",
  },
  disclaimerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "rgba(19, 41, 61, 0.70)",
  },
});
