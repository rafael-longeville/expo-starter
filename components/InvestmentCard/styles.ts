import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#13293D",
    borderRadius: 30,
    padding: 20,
    width: "100%",
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  asideInputText: {
    color: "#ECFF78",
    fontSize: 28,
    fontFamily: "Poppins_600SemiBold",
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    marginBottom: -3,
  },
  headerAmount: {
    color: "#ECFF78",
    fontFamily: "Poppins_700Bold",
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    gap: 28,
  },
  flexInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  inputContainer: {
    width: 140,
    justifyContent: "center",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 20,
  },
  input: {
    fontSize: 18,
    color: "#13293D",
    fontFamily: "Poppins_600SemiBold",
    paddingHorizontal: 20,
    marginBottom: -5,
    height: "100%",
    lineHeight: 20,
    flex: 1,
  },
  euroIcon: {
    height: 24,
    width: 24,
    marginLeft: 10,
  },
  gain: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  rendementText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
  rendementValue: {
    fontFamily: "Poppins_500Medium",
    color: "#ECFF78",
    fontSize: 18,
  },
  buttonContainer: {
    position: "relative",
    width: "100%",
    height: 50, // Match the height of your image
    justifyContent: "center",
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  depositButtonText: {
    position: "absolute", // Overlay the text on top of the image
    color: "#13293D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    left: 100, // Adjust this value to position the text towards the left
    textAlign: "left", // Ensure the text aligns to the left
  },
  arrowIcon: {
    marginLeft: 10,
    height: 20,
    width: 20,
  },
  dollarIcon: {
    height: 26,
    width: 26,
  },
  withdrawButtonText: {
    position: "absolute", // Overlay the text on top of the image
    color: "#13293D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    left: 78, // Adjust this value to position the text towards the left
    textAlign: "left", // Ensure the text aligns to the left
  },
  buttonContainer2: {
    position: "relative",
    width: "50%",
    height: 53, // Match the height of your image
    justifyContent: "center",
  },
  depositButtonText2: {
    position: "absolute", // Overlay the text on top of the image
    color: "#13293D",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    left: 25, // Adjust this value to position the text towards the left
    textAlign: "left", // Ensure the text aligns to the left
  },
});
