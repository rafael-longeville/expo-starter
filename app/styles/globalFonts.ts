import { StyleSheet } from "react-native";
// Import poppins
import "@expo-google-fonts/poppins";

export const globalFonts = StyleSheet.create({
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
});
