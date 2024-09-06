import { router, Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons or the icon set you're using

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarShowLabel: false, // Add this to hide the labels under the icons
          tabBarStyle: [
            styles.tabBar, // Custom style for the floating effect
            {
              display: route.name === "home" ? "flex" : "none",
            },
          ],
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap; // Explicitly narrow the type

            if (route.name === "home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "login") {
              iconName = focused ? "person" : "person-outline";
            } else {
              // Fallback in case of a new screen
              iconName = "alert"; // Provide a default icon or handle this more elegantly
            }

            return (
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={size} color={color} />
              </View>
            );
          },
        })}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="login" />
        <Tabs.Screen name="checkout" />
        {/* <Tabs.Screen name="settings" /> */}
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Floating Tab Bar style
  tabBar: {
    position: "absolute", // Make it float
    bottom: 20, // Adjust bottom positioning
    left: 20, // Add spacing from left
    right: 20, // Add spacing from right
    height: 80, // Adjust height for tab bar
    borderRadius: 30, // Rounded corners for the floating effect
    backgroundColor: "#13293D", // Tab bar background color
    shadowColor: "#000", // Shadow for the floating effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10, // Add elevation for Android shadow
    borderTopWidth: 0,
  },
  // Icon container to create white circle background
  iconContainer: {
    width: 50, // Make this a circle by using equal width and height
    height: 50,
    borderRadius: 25, // Full circle
    backgroundColor: "#fff", // White background for the circle
    justifyContent: "center", // Center the icon horizontally
    alignItems: "center", // Center the icon vertically
    margin: 10,
  },
});
