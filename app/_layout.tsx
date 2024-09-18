import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SplashScreen, Stack, router } from "expo-router";
import { ThirdwebProvider } from "thirdweb/react";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_600SemiBold_Italic,
  Poppins_400Regular_Italic,
} from "@expo-google-fonts/poppins";
import * as Sentry from "@sentry/react-native";
import { StayUpdatedModalContentProvider } from "@/context/StayUpdatedModalContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserInactivityProvider } from "@/context/UserInactivity";

// Initialize Sentry
Sentry.init({
  dsn: "https://27208761507910af7d813dfb11ef409c@o4507865111855104.ingest.de.sentry.io/4507865113821264",
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
});

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThirdwebProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <UserInactivityProvider>
          <StayUpdatedModalContentProvider>
            <GestureHandlerRootView>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(onboarding)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </GestureHandlerRootView>
          </StayUpdatedModalContentProvider>
        </UserInactivityProvider>
      </ThemeProvider>
    </ThirdwebProvider>
  );
}

export default Sentry.wrap(RootLayout);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
