import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserInactivityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log("App state changed to", nextAppState);
    if (nextAppState === "background") {
      await recordStartTime();
    } else if (
      nextAppState === "active" &&
      appState.current.match(/background/)
    ) {
      const startTime = await AsyncStorage.getItem(
        "user_inactivity_start_time"
      );
      const elapsed = Date.now() - parseInt(startTime || "0");
      console.log("Elapsed time:", elapsed);
      if (elapsed > 1000 && account && wallet) {
        console.log("User has been inactive for more than 1000ms");
        Alert.alert(
          "You have been inactive for more than 5 seconds, so you have to login again"
        );
        disconnect(wallet);
        router.navigate("/(onboarding)/onboarding_3");
      }
    }
    appState.current = nextAppState;
  };

  const recordStartTime = async () => {
    await AsyncStorage.setItem(
      "user_inactivity_start_time",
      Date.now().toString()
    );
  };

  return children;
};
