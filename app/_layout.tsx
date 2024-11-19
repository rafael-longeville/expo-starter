import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
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
import {
  AlegreyaSansSC_400Regular,
  AlegreyaSansSC_500Medium,
  AlegreyaSansSC_800ExtraBold,
} from "@expo-google-fonts/alegreya-sans-sc";

import * as Sentry from "@sentry/react-native";
import { StayUpdatedModalContentProvider } from "@/context/StayUpdatedModalContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TypingProvider } from "@/context/TypingContext";

// Initialize Sentry
Sentry.init({
  dsn: "https://27208761507910af7d813dfb11ef409c@o4507865111855104.ingest.de.sentry.io/4507865113821264",
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
});

Sentry.addBreadcrumb({
  category: "log",
  message: "Production log captured",
  level: "info",
});

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn("Error preventing splash screen auto hide:", error);
});

const RootLayout: React.FC = () => {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontLoadError] = useFonts({
    // Alegreya Sans SC
    AlegreyaSansSC_400Regular,
    AlegreyaSansSC_500Medium,
    AlegreyaSansSC_800ExtraBold,
    // Poppins
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (fontsLoaded || fontLoadError) {
      timer = setTimeout(() => {
        SplashScreen.hideAsync().catch((error) => {
          console.warn("Error hiding splash screen:", error);
        });
      }, 1000); // 1 second delay
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [fontsLoaded, fontLoadError]);

  if (!fontsLoaded && !fontLoadError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <TypingProvider>
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
      </TypingProvider>
    </ThemeProvider>
  );
};

export default Sentry.wrap(RootLayout);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
