import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
  id: "inactivty-storage",
});

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
      recordStartTime();
    } else if (
      nextAppState === "active" &&
      appState.current.match(/background/)
    ) {
      const elapsed = Date.now() - (storage.getNumber("startTime") || 0);
      console.log("🚀 ~ handleAppStateChange ~ elapsed:", elapsed);
      if (elapsed > 5000 && account && wallet) {
        console.log("User has been inactive for more than 1000ms");
        Alert.alert(
          "You have been inactive for more than 5 seconds, so you have to login again"
        );
        wallet.disconnect().then(() => {
          router.navigate("/(onboarding)/onboarding_3");
        });
      }
    }
    appState.current = nextAppState;
  };

  const recordStartTime = () => {
    storage.set("startTime", Date.now());
  };

  return children;
};
