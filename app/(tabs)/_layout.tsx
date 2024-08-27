import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          display: route.name === "splash" ? "none" : "flex",
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="splash" />
      {/* Add other screens here */}
    </Tabs>
  );
}
