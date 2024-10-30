import { router } from "expo-router";
import { Linking } from "react-native";

export async function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  console.log("Received path:", path);

  if (!initial) {
    alert("Hello from deep link");

    // Check if the path is the root ("moncomptesouverain.fr")
    if (path === "") {
      // Navigate to the default screen when the root path is accessed
      router.navigate("/(tabs)/home"); // Replace with your desired screen path
    }
    // Add more conditions here as needed for other paths
  }

  // Return the path if needed for further processing
  return path;
}
